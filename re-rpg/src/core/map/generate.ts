import { enemiesOfTier } from '@data/index';
import type { Rng } from '@core/rng';
import { costField } from './pathfind';
import { TILE_COST, inBounds, key, type Guard, type Poi, type PoiKind, type ScreenMap, type Tile, type TileType } from './types';

export interface GenOptions {
  width?: number;
  height?: number;
  screenIndex: number;
  seed: string;
}

const W_DEFAULT = 48, H_DEFAULT = 24;

/**
 * Screen generator (ARCHITECTURE §6). Deterministic from the map RNG stream.
 *  1. main road west → east with bends,
 *  2. biome by distance from the road (grass → forest → swamp) plus rock/water blobs,
 *  3. boss arena at the east end,
 *  4. POIs placed where the danger-weighted path cost from the road is high,
 *  5. a guard on each POI's approach tile,
 *  6. connectivity validation, regenerate on failure.
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
  const set = (x: number, y: number, t: TileType) => { if (inBounds({ width: W, height: H } as ScreenMap, x, y)) tiles[y * W + x] = t; };
  const get = (x: number, y: number) => tiles[y * W + x]!;

  // 1. Road: entry on the west edge, arena centre near the east edge, 2–3 waypoints between.
  const entry: Tile = { x: 1, y: rng.int(Math.floor(H * 0.3), Math.floor(H * 0.7)) };
  const boss: Tile = { x: W - 4, y: rng.int(Math.floor(H * 0.3), Math.floor(H * 0.7)) };
  const nWay = rng.int(2, 3);
  const waypoints: Tile[] = [entry];
  for (let i = 1; i <= nWay; i++) {
    waypoints.push({ x: Math.floor((W - 8) * (i / (nWay + 1))) + 3, y: rng.int(3, H - 4) });
  }
  waypoints.push(boss);
  const road: Tile[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i]!, b = waypoints[i + 1]!;
    // L-shaped: horizontal then vertical, or vertical then horizontal
    const horizFirst = rng.chance(0.5);
    let x = a.x, y = a.y;
    const stepX = () => { while (x !== b.x) { x += Math.sign(b.x - x); road.push({ x, y }); } };
    const stepY = () => { while (y !== b.y) { y += Math.sign(b.y - y); road.push({ x, y }); } };
    if (horizFirst) { stepX(); stepY(); } else { stepY(); stepX(); }
  }
  road.unshift(entry);
  for (const t of road) set(t.x, t.y, 'road');

  // 3. Arena: 5x5 open ground around the boss, walled by rock except on the road side.
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    const x = boss.x + dx, y = boss.y + dy;
    const ring = Math.abs(dx) === 3 || Math.abs(dy) === 3;
    if (ring) { if (get(x, y) !== 'road') set(x, y, 'rock'); } else set(x, y, 'arena');
  }

  // 2. Biome by distance from the road (plain BFS steps, not cost).
  const roadDist = bfsDistance(W, H, tiles, road, (t) => t !== 'rock');
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = get(x, y);
    if (t !== 'grass') continue;
    const d = roadDist[y * W + x]!;
    const forestP = Math.min(0.9, Math.max(0, (d - 2) * 0.22));
    const swampP = Math.min(0.45, Math.max(0, (d - 5) * 0.12));
    if (rng.chance(swampP)) set(x, y, 'swamp');
    else if (rng.chance(forestP)) set(x, y, 'forest');
  }
  // Obstacle blobs: rock and water, never on road or arena, never adjacent to the road.
  const blobs = rng.int(6, 10);
  for (let b = 0; b < blobs; b++) {
    const cx = rng.int(2, W - 3), cy = rng.int(2, H - 3);
    const kind: TileType = rng.chance(0.5) ? 'rock' : 'water';
    const r = rng.int(1, 2);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const x = cx + dx, y = cy + dy;
      if (!inBounds({ width: W, height: H } as ScreenMap, x, y)) continue;
      if (dx * dx + dy * dy > r * r + 1) continue;
      const t = get(x, y);
      if (t === 'road' || t === 'arena' || roadDist[y * W + x]! < 2) continue;
      set(x, y, kind);
    }
  }
  // Edge rock frame.
  for (let x = 0; x < W; x++) { if (get(x, 0) !== 'road') set(x, 0, 'rock'); if (get(x, H - 1) !== 'road') set(x, H - 1, 'rock'); }
  for (let y = 0; y < H; y++) { if (get(0, y) !== 'road') set(0, y, 'rock'); if (get(W - 1, y) !== 'road') set(W - 1, y, 'rock'); }

  const map: ScreenMap = {
    seed: opts.seed, screenIndex: opts.screenIndex, width: W, height: H, tiles, entry, boss,
    bossId: opts.screenIndex === 0 ? 'gatekeeper' : 'warden', pois: [], guards: [],
  };

  // 4. POIs: danger-weighted cost from the road. Candidates are passable, off-road, outside the arena.
  const cost = costField(map, road);
  const kinds: PoiKind[] = ['shop', 'chest', 'chest', 'shrine'];
  const bands = kinds.length;
  const used: Tile[] = [];
  for (let i = 0; i < kinds.length; i++) {
    // Each POI lives in its own vertical band of the map so they spread west→east.
    const x0 = Math.floor(4 + (W - 10) * (i / bands)), x1 = Math.floor(4 + (W - 10) * ((i + 1) / bands));
    const candidates: { t: Tile; c: number }[] = [];
    for (let y = 2; y < H - 2; y++) for (let x = x0; x < x1; x++) {
      const t = get(x, y);
      if (TILE_COST[t] === Infinity || t === 'road' || t === 'arena') continue;
      const c = cost[y * W + x]!;
      if (!isFinite(c) || c < 8) continue;
      if (used.some((u) => Math.abs(u.x - x) + Math.abs(u.y - y) < 6)) continue;
      candidates.push({ t: { x, y }, c });
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.c - a.c);
    // Pick among the hardest-to-reach third so placements vary between seeds.
    const pick = candidates[rng.int(0, Math.max(0, Math.floor(candidates.length / 3) - 1))]!;
    used.push(pick.t);
    const id = `${kinds[i]}_${i}`;
    map.pois.push({ id, kind: kinds[i]!, pos: pick.t, cost: pick.c, guardId: `guard_${i}` });
  }

  // 5. Guards: on the POI's cheapest approach neighbour (the one closest to the road).
  const tier = opts.screenIndex === 0 ? 1 : 2;
  const roster = enemiesOfTier(tier);
  for (const poi of map.pois) {
    const neighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      .map(([dx, dy]) => ({ x: poi.pos.x + dx!, y: poi.pos.y + dy! }))
      .filter((t) => inBounds(map, t.x, t.y) && TILE_COST[get(t.x, t.y)] !== Infinity && get(t.x, t.y) !== 'road')
      .sort((a, b) => cost[a.y * W + a.x]! - cost[b.y * W + b.x]!);
    const spot = neighbours[0];
    if (!spot) return null;
    map.guards.push({ id: poi.guardId, pos: spot, enemyId: rng.pick(roster).id, poiId: poi.id });
  }
  return map;
}

function bfsDistance(W: number, H: number, tiles: TileType[], sources: Tile[], passable: (t: TileType) => boolean): Int32Array {
  const dist = new Int32Array(W * H).fill(-1);
  const q: number[] = [];
  for (const s of sources) { dist[s.y * W + s.x] = 0; q.push(s.y * W + s.x); }
  for (let qi = 0; qi < q.length; qi++) {
    const i = q[qi]!; const x = i % W, y = (i / W) | 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const ni = ny * W + nx;
      if (dist[ni] !== -1 || !passable(tiles[ni]!)) continue;
      dist[ni] = dist[i]! + 1; q.push(ni);
    }
  }
  return dist;
}

/** Entry reaches the boss and every POI (guards count as passable here; they are fights, not walls). */
export function validate(m: ScreenMap): boolean {
  const reach = costField(m, [m.entry]);
  const ok = (t: Tile) => isFinite(reach[t.y * m.width + t.x]!);
  if (!ok(m.boss)) return false;
  for (const p of m.pois) if (!ok(p.pos)) return false;
  for (const g of m.guards) if (!ok(g.pos)) return false;
  // POIs must not be trivially on the road.
  const roadSet = new Set<string>();
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (m.tiles[y * m.width + x] === 'road') roadSet.add(key({ x, y }));
  for (const p of m.pois) if (roadSet.has(key(p.pos))) return false;
  return true;
}
