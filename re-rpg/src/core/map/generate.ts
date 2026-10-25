import { enemiesOfTier } from '@data/index';
import type { Rng } from '@core/rng';
import { costField } from './pathfind';
import { TILE_COST, inBounds, key, type PoiKind, type ScreenMap, type Tile, type TileType } from './types';

export interface GenOptions {
  width?: number;
  height?: number;
  screenIndex: number;
  seed: string;
}

const W_DEFAULT = 48, H_DEFAULT = 24;
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

/** Layout rules (DECISIONS #23). Tweak here, not in the steps below. */
export const LAYOUT = {
  /** Tiles either side of the road kept clear of forest/swamp so the road reads as a safe corridor. */
  roadMargin: 1,
  /** Obstacles never within this many steps of the road. */
  obstacleRoadGap: 2,
  /** Smallest forest/swamp patch kept; smaller ones become grass. */
  minBiomePatch: 5,
  /** Smallest rock/water body kept. */
  minObstacle: 3,
  /** Value-noise cell size in tiles; bigger cells = broader regions. */
  noiseCell: 6,
  forestThreshold: 0.68,
  swampThreshold: 0.72,
  swampMinRoadDist: 5,
  ridges: [5, 8] as const,
  ridgeLength: [3, 8] as const,
  lakes: [2, 4] as const,
  /** Half-width of the detour wall thrown across each POI's easiest approach. */
  detourHalfWidth: [1, 2] as const,
} as const;

/**
 * Screen generator (ARCHITECTURE §6). Deterministic from the map RNG stream.
 *  1. main road west → east with bends; boss arena at the east end,
 *  2. biomes as broad noise regions (forest, then swamp far from the road), smoothed, specks removed,
 *  3. obstacles as rock ridges and lakes, never near the road, with a grass margin so rocks never sit in trees,
 *  4. POIs where the danger-weighted path cost from the road is high, each in a 3×3 grass clearing,
 *  5. a detour wall across each POI's easiest approach (kept only if everything stays reachable),
 *  6. guards on each POI's approach tile; connectivity validation, regenerate on failure.
 */
export function generateScreen(rng: Rng, opts: GenOptions): ScreenMap {
  for (let attempt = 0; attempt < 40; attempt++) {
    const m = tryGenerate(rng, opts);
    if (m && validate(m)) return m;
  }
  throw new Error(`generateScreen: no valid map after 40 attempts (seed ${opts.seed}, screen ${opts.screenIndex})`);
}

function tryGenerate(rng: Rng, opts: GenOptions): ScreenMap | null {
  const W = opts.width ?? W_DEFAULT, H = opts.height ?? H_DEFAULT;
  const tiles: TileType[] = new Array<TileType>(W * H).fill('grass');
  const ib = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H;
  const set = (x: number, y: number, t: TileType) => { if (ib(x, y)) tiles[y * W + x] = t; };
  const get = (x: number, y: number): TileType => ib(x, y) ? tiles[y * W + x]! : 'rock';

  // 1. Road: entry on the west edge, arena centre near the east edge, 2–3 waypoints between.
  const entry: Tile = { x: 1, y: rng.int(Math.floor(H * 0.3), Math.floor(H * 0.7)) };
  const boss: Tile = { x: W - 4, y: rng.int(Math.floor(H * 0.3), Math.floor(H * 0.7)) };
  const nWay = rng.int(2, 3);
  const waypoints: Tile[] = [entry];
  for (let i = 1; i <= nWay; i++) waypoints.push({ x: Math.floor((W - 8) * (i / (nWay + 1))) + 3, y: rng.int(3, H - 4) });
  waypoints.push(boss);
  const road: Tile[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]!, b = waypoints[i + 1]!;
    const horizFirst = rng.chance(0.5);
    let x = a.x, y = a.y;
    const stepX = () => { while (x !== b.x) { x += Math.sign(b.x - x); road.push({ x, y }); } };
    const stepY = () => { while (y !== b.y) { y += Math.sign(b.y - y); road.push({ x, y }); } };
    if (horizFirst) { stepX(); stepY(); } else { stepY(); stepX(); }
  }
  road.unshift(entry);
  for (const t of road) set(t.x, t.y, 'road');
  // Arena: 5x5 open ground around the boss, walled by rock except on the road side.
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    const x = boss.x + dx, y = boss.y + dy;
    const ring = Math.abs(dx) === 3 || Math.abs(dy) === 3;
    if (ring) { if (get(x, y) !== 'road') set(x, y, 'rock'); } else set(x, y, 'arena');
  }
  const fixed = (x: number, y: number) => { const t = get(x, y); return t === 'road' || t === 'arena'; };
  const roadDist = bfsDistance(W, H, tiles, road, () => true);
  const nearRoad = (x: number, y: number, d: number) => roadDist[y * W + x]! <= d;

  // 2. Biomes from two broad noise fields. Forest favours distance from the road; swamp only far out.
  const forestNoise = valueNoise(rng, W, H, LAYOUT.noiseCell);
  const swampNoise = valueNoise(rng, W, H, LAYOUT.noiseCell);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (fixed(x, y) || nearRoad(x, y, LAYOUT.roadMargin)) continue;
    const d = roadDist[y * W + x]!;
    if (d >= LAYOUT.swampMinRoadDist && swampNoise[y * W + x]! > LAYOUT.swampThreshold) set(x, y, 'swamp');
    else if (forestNoise[y * W + x]! + Math.min(d, 8) * 0.03 > LAYOUT.forestThreshold) set(x, y, 'forest');
  }
  smooth(tiles, W, H, fixed, 2);
  dropSmallPatches(tiles, W, H, ['forest', 'swamp'], LAYOUT.minBiomePatch, 'grass');

  // 3. Obstacles: rock ridges and lakes, away from the road and the arena ring.
  const canBlock = (x: number, y: number) => ib(x, y) && !fixed(x, y) && !nearRoad(x, y, LAYOUT.obstacleRoadGap) && x > 0 && y > 0 && x < W - 1 && y < H - 1;
  const nRidges = rng.int(LAYOUT.ridges[0], LAYOUT.ridges[1]);
  for (let r = 0; r < nRidges; r++) {
    let x = rng.int(2, W - 3), y = rng.int(2, H - 3);
    const [dx, dy] = rng.pick([[1, 0], [0, 1], [1, 1], [1, -1]] as const);
    const len = rng.int(LAYOUT.ridgeLength[0], LAYOUT.ridgeLength[1]);
    for (let i = 0; i < len; i++) {
      if (canBlock(x, y)) set(x, y, 'rock');
      if (rng.chance(0.3)) { const bx = x + dy, by = y - dx; if (canBlock(bx, by)) set(bx, by, 'rock'); } // a bump keeps ridges from reading as lines
      x += dx; y += dy;
    }
  }
  const nLakes = rng.int(LAYOUT.lakes[0], LAYOUT.lakes[1]);
  for (let l = 0; l < nLakes; l++) {
    const cx = rng.int(3, W - 4), cy = rng.int(3, H - 4), rx = rng.int(2, 4), ry = rng.int(1, 3);
    for (let y = cy - ry; y <= cy + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) {
      const nx = (x - cx) / (rx + 0.5), ny = (y - cy) / (ry + 0.5);
      if (nx * nx + ny * ny <= 1 && canBlock(x, y)) set(x, y, 'water');
    }
  }
  dropSmallPatches(tiles, W, H, ['rock', 'water'], LAYOUT.minObstacle, 'grass');
  // Edge rock frame.
  for (let x = 0; x < W; x++) { if (get(x, 0) !== 'road') set(x, 0, 'rock'); if (get(x, H - 1) !== 'road') set(x, H - 1, 'rock'); }
  for (let y = 0; y < H; y++) { if (get(0, y) !== 'road') set(0, y, 'rock'); if (get(W - 1, y) !== 'road') set(W - 1, y, 'rock'); }
  // Rocks sit in grass, never among trees: forest next to rock or water becomes grass (again after the detour walls).
  const shoreline = () => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (get(x, y) !== 'forest') continue;
      if (DIRS4.some(([dx, dy]) => { const t = get(x + dx, y + dy); return t === 'rock' || t === 'water'; })) set(x, y, 'grass');
    }
    dropSmallPatches(tiles, W, H, ['forest', 'swamp'], LAYOUT.minBiomePatch, 'grass');
  };
  shoreline();

  const map: ScreenMap = {
    seed: opts.seed, screenIndex: opts.screenIndex, width: W, height: H, tiles, entry, boss,
    bossId: opts.screenIndex === 0 ? 'gatekeeper' : 'warden', pois: [], guards: [], questGiver: entry, npcSpot: boss,
  };

  // 4. POIs: danger-weighted cost from the road, one per vertical band, each in a grass clearing.
  const cost = costField(map, road);
  const kinds: PoiKind[] = ['shop', 'chest', 'chest', 'shrine'];
  const bands = kinds.length;
  const used: Tile[] = [];
  const clearing = (c: Tile) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (ib(c.x + dx, c.y + dy) && !fixed(c.x + dx, c.y + dy) && c.x + dx > 0 && c.y + dy > 0 && c.x + dx < W - 1 && c.y + dy < H - 1) set(c.x + dx, c.y + dy, 'grass'); } };
  for (let i = 0; i < kinds.length; i++) {
    const x0 = Math.floor(4 + (W - 10) * (i / bands)), x1 = Math.floor(4 + (W - 10) * ((i + 1) / bands));
    const candidates: { t: Tile; c: number }[] = [];
    for (let y = 2; y < H - 2; y++) for (let x = x0; x < x1; x++) {
      const t = get(x, y);
      if (TILE_COST[t] === Infinity || fixed(x, y) || nearRoad(x, y, 1)) continue;
      const c = cost[y * W + x]!;
      if (!isFinite(c) || c < 8) continue;
      if (used.some((u) => Math.abs(u.x - x) + Math.abs(u.y - y) < 6)) continue;
      candidates.push({ t: { x, y }, c });
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.c - a.c);
    const pick = candidates[rng.int(0, Math.max(0, Math.floor(candidates.length / 3) - 1))]!;
    used.push(pick.t);
    map.pois.push({ id: `${kinds[i]}_${i}`, kind: kinds[i]!, pos: pick.t, cost: pick.c, guardId: `guard_${i}` });
  }
  // Quest giver: 2–4 steps from the entry. NPC spot: far off-road, clear of POIs.
  const giverCands: Tile[] = [];
  for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) {
    const d = Math.abs(x - entry.x) + Math.abs(y - entry.y);
    if (d >= 2 && d <= 4 && !fixed(x, y) && TILE_COST[get(x, y)] !== Infinity && isFinite(cost[y * W + x]!)) giverCands.push({ x, y });
  }
  if (giverCands.length === 0) return null;
  map.questGiver = rng.pick(giverCands);
  const npcCands: Tile[] = [];
  for (let y = 2; y < H - 2; y++) for (let x = 6; x < W - 8; x++) {
    const c = cost[y * W + x]!;
    if (fixed(x, y) || TILE_COST[get(x, y)] === Infinity || !isFinite(c) || c < 8) continue;
    if (used.some((u) => Math.abs(u.x - x) + Math.abs(u.y - y) < 4)) continue;
    npcCands.push({ x, y });
  }
  if (npcCands.length === 0) return null;
  map.npcSpot = rng.pick(npcCands);
  for (const c of [...used, map.questGiver, map.npcSpot]) clearing(c);

  // 5. Detour walls: a short rock line across the midpoint of each POI's cheapest approach from the road.
  const targets = () => [boss, ...map.pois.map((p) => p.pos), map.questGiver, map.npcSpot];
  const allReachable = () => { const r = costField(map, [entry]); return targets().every((t) => isFinite(r[t.y * W + t.x]!)); };
  for (const poi of map.pois) {
    const approach = descend(cost, W, H, tiles, poi.pos);
    if (approach.length < 5) continue;
    const mid = approach[Math.floor(approach.length / 2)]!, next = approach[Math.floor(approach.length / 2) + 1]!;
    const px = next.y - mid.y, py = -(next.x - mid.x); // perpendicular to the walking direction
    const half = rng.int(LAYOUT.detourHalfWidth[0], LAYOUT.detourHalfWidth[1]);
    const placed: Tile[] = [];
    for (let k = -half; k <= half; k++) {
      const x = mid.x + px * k, y = mid.y + py * k;
      if (!canBlock(x, y) || get(x, y) === 'rock' || get(x, y) === 'water') continue;
      if ([...used, map.questGiver, map.npcSpot].some((u) => Math.abs(u.x - x) <= 1 && Math.abs(u.y - y) <= 1)) continue;
      placed.push({ x, y, });
    }
    const before = placed.map((t) => get(t.x, t.y));
    for (const t of placed) set(t.x, t.y, 'rock');
    if (!allReachable()) placed.forEach((t, i) => set(t.x, t.y, before[i]!));
  }

  shoreline(); // detour walls may have landed beside trees

  // 6. Guards: on the POI's cheapest approach neighbour (the one closest to the road).
  const cost2 = costField(map, road);
  const tier = opts.screenIndex === 0 ? 1 : 2;
  const roster = enemiesOfTier(tier);
  for (const poi of map.pois) {
    const neighbours = DIRS4
      .map(([dx, dy]) => ({ x: poi.pos.x + dx, y: poi.pos.y + dy }))
      .filter((t) => inBounds(map, t.x, t.y) && TILE_COST[get(t.x, t.y)] !== Infinity && get(t.x, t.y) !== 'road')
      .sort((a, b) => cost2[a.y * W + a.x]! - cost2[b.y * W + b.x]!);
    const spot = neighbours[0];
    if (!spot) return null;
    map.guards.push({ id: poi.guardId, pos: spot, enemyId: rng.pick(roster).id, poiId: poi.id });
  }
  return map;
}

/** Bilinear value noise in [0,1] with a half-amplitude second octave; broad, blobby regions. */
function valueNoise(rng: Rng, W: number, H: number, cell: number): Float32Array {
  const layer = (c: number, amp: number, out: Float32Array) => {
    const gw = Math.ceil(W / c) + 2, gh = Math.ceil(H / c) + 2;
    const g = new Float32Array(gw * gh);
    for (let i = 0; i < g.length; i++) g[i] = rng.next();
    const sm = (t: number) => t * t * (3 - 2 * t);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const fx = x / c, fy = y / c, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = sm(fx - x0), ty = sm(fy - y0);
      const v = (gx: number, gy: number) => g[gy * gw + gx]!;
      const top = v(x0, y0) * (1 - tx) + v(x0 + 1, y0) * tx, bot = v(x0, y0 + 1) * (1 - tx) + v(x0 + 1, y0 + 1) * tx;
      out[y * W + x] = out[y * W + x]! + amp * (top * (1 - ty) + bot * ty);
    }
  };
  const out = new Float32Array(W * H);
  layer(cell, 2 / 3, out);
  layer(Math.max(2, Math.floor(cell / 2)), 1 / 3, out);
  return out;
}

/** Majority filter over the 3×3 neighbourhood; kills single-tile specks and ragged edges. */
function smooth(tiles: TileType[], W: number, H: number, fixed: (x: number, y: number) => boolean, passes: number) {
  for (let p = 0; p < passes; p++) {
    const src = tiles.slice();
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      if (fixed(x, y)) continue;
      const counts = new Map<TileType, number>();
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const t = src[(y + dy) * W + (x + dx)]!;
        if (t === 'road' || t === 'arena') continue;
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
      let best: TileType = src[y * W + x]!, bestN = 0;
      for (const [t, n] of counts) if (n > bestN) { best = t; bestN = n; }
      if (bestN >= 5) tiles[y * W + x] = best;
    }
  }
}

/** Replace connected patches of `kinds` smaller than `min` tiles with `fill`. */
function dropSmallPatches(tiles: TileType[], W: number, H: number, kinds: TileType[], min: number, fill: TileType) {
  const seen = new Uint8Array(W * H);
  for (let i = 0; i < tiles.length; i++) {
    if (seen[i] || !kinds.includes(tiles[i]!)) continue;
    const kind = tiles[i]!; const patch: number[] = [i]; seen[i] = 1;
    for (let qi = 0; qi < patch.length; qi++) {
      const j = patch[qi]!, x = j % W, y = (j / W) | 0;
      for (const [dx, dy] of DIRS4) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const n = ny * W + nx;
        if (!seen[n] && tiles[n] === kind) { seen[n] = 1; patch.push(n); }
      }
    }
    if (patch.length < min) for (const j of patch) tiles[j] = fill;
  }
}

/** Walk from `from` down the cost field to the road; the tiles of the cheapest approach, nearest the POI first. */
function descend(cost: Float64Array | number[], W: number, H: number, tiles: TileType[], from: Tile): Tile[] {
  const path: Tile[] = [from];
  let cur = from;
  for (let guard = 0; guard < W * H; guard++) {
    if (tiles[cur.y * W + cur.x] === 'road') break;
    let best: Tile | null = null, bestC = cost[cur.y * W + cur.x]!;
    for (const [dx, dy] of DIRS4) {
      const nx = cur.x + dx, ny = cur.y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const c = cost[ny * W + nx]!;
      if (c < bestC) { bestC = c; best = { x: nx, y: ny }; }
    }
    if (!best) break;
    path.push(best); cur = best;
  }
  return path;
}

function bfsDistance(W: number, H: number, tiles: TileType[], sources: Tile[], passable: (t: TileType) => boolean): Int32Array {
  const dist = new Int32Array(W * H).fill(-1);
  const q: number[] = [];
  for (const s of sources) { dist[s.y * W + s.x] = 0; q.push(s.y * W + s.x); }
  for (let qi = 0; qi < q.length; qi++) {
    const i = q[qi]!; const x = i % W, y = (i / W) | 0;
    for (const [dx, dy] of DIRS4) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const ni = ny * W + nx;
      if (dist[ni] !== -1 || !passable(tiles[ni]!)) continue;
      dist[ni] = dist[i]! + 1; q.push(ni);
    }
  }
  return dist;
}

/** Entry reaches the boss, every POI, every guard, the quest giver and the NPC spot; POIs are never on the road. */
export function validate(m: ScreenMap): boolean {
  const reach = costField(m, [m.entry]);
  const ok = (t: Tile) => isFinite(reach[t.y * m.width + t.x]!);
  if (!ok(m.boss) || !ok(m.questGiver) || !ok(m.npcSpot)) return false;
  for (const p of m.pois) if (!ok(p.pos)) return false;
  for (const g of m.guards) if (!ok(g.pos)) return false;
  const roadSet = new Set<string>();
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (m.tiles[y * m.width + x] === 'road') roadSet.add(key({ x, y }));
  for (const p of m.pois) if (roadSet.has(key(p.pos))) return false;
  return true;
}
