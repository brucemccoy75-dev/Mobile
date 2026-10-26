import { enemiesOfTier } from '@data/index';
import { PAIRS } from '@data/packs';
import type { EnemyId } from '@data/types';
import type { Rng } from '@core/rng';
import { costField } from './pathfind';
import { validate } from './generate';
import { TILE_COST, key, type MapNode, type Poi, type PoiKind, type ScreenMap, type Signpost, type Tile, type TileType } from './types';

/**
 * Hand-authored screens (DECISIONS #34): the layout is a fixed ASCII grid, the contents are
 * rolled per run. One character per tile:
 *
 *   terrain   . grass   # forest   = road   ~ water   ^ rock   % swamp   A arena
 *   on road   E entry   B boss (arena)   f fight node   x elite node (always a duo)   p signpost
 *   in grass  c chest   s shop   h shrine   g guard (beside a chest)   q quest giver   n NPC spot
 *
 * Nodes, guards and the boss arena are the only places a fight starts; the road between them
 * is safe, and the wilds cost daylight instead of rolling ambushes.
 */
const TERRAIN: Record<string, TileType> = { '.': 'grass', '#': 'forest', '=': 'road', '~': 'water', '^': 'rock', '%': 'swamp', 'A': 'arena' };
const UNDER: Record<string, TileType> = { E: 'road', B: 'arena', f: 'road', x: 'road', p: 'road', c: 'grass', s: 'grass', h: 'grass', g: 'grass', q: 'grass', n: 'grass' };
const POI_KIND: Record<string, PoiKind> = { c: 'chest', s: 'shop', h: 'shrine' };
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

export interface AuthoredOptions { seed: string; screenIndex: number; }

/** Parse an ASCII screen and roll its contents from the run's map stream. Throws on a malformed layout. */
export function parseScreen(ascii: string, rng: Rng, opts: AuthoredOptions): ScreenMap {
  const rows = ascii.split('\n').map((r) => r.trimEnd()).filter((r) => r.length > 0);
  const H = rows.length, W = Math.max(...rows.map((r) => r.length));
  const tiles: TileType[] = new Array<TileType>(W * H).fill('rock');
  let entry: Tile | null = null, boss: Tile | null = null, giver: Tile | null = null, npc: Tile | null = null;
  const nodeSpots: { ch: string; pos: Tile }[] = [], poiSpots: { ch: string; pos: Tile }[] = [], guardSpots: Tile[] = [], signSpots: Tile[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = rows[y]![x] ?? '^';
    const pos = { x, y };
    if (ch in TERRAIN) { tiles[y * W + x] = TERRAIN[ch]!; continue; }
    const under = UNDER[ch];
    if (!under) throw new Error(`parseScreen: unknown glyph '${ch}' at ${x},${y}`);
    tiles[y * W + x] = under;
    switch (ch) {
      case 'E': entry = pos; break;
      case 'B': boss = pos; break;
      case 'q': giver = pos; break;
      case 'n': npc = pos; break;
      case 'f': case 'x': nodeSpots.push({ ch, pos }); break;
      case 'c': case 's': case 'h': poiSpots.push({ ch, pos }); break;
      case 'g': guardSpots.push(pos); break;
      case 'p': signSpots.push(pos); break;
    }
  }
  if (!entry || !boss || !giver || !npc) throw new Error('parseScreen: needs E, B, q and n');

  const tier = opts.screenIndex === 0 ? 1 : 2;
  const roster = enemiesOfTier(tier).map((e) => e.id);
  const map: ScreenMap = {
    seed: opts.seed, screenIndex: opts.screenIndex, authored: true, width: W, height: H, tiles, entry, boss,
    bossId: opts.screenIndex === 0 ? 'gatekeeper' : 'warden', pois: [], guards: [], questGiver: giver, npcSpot: npc, nodes: [], signposts: [],
  };

  // POIs: the chest value comes from how far off the road it sits, like the generator's.
  const road: Tile[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (tiles[y * W + x] === 'road') road.push({ x, y });
  const cost = costField(map, road);
  const counts: Record<string, number> = {};
  for (const p of poiSpots) {
    const kind = POI_KIND[p.ch]!;
    const i = (counts[kind] = (counts[kind] ?? 0) + 1);
    const poi: Poi = { id: `${kind}_${i}`, kind, pos: p.pos, cost: Math.max(8, cost[p.pos.y * W + p.pos.x] ?? 8), guardId: '' };
    map.pois.push(poi);
  }
  // Guards stand beside a POI and hold it; which species, the dice decide.
  guardSpots.forEach((g, i) => {
    const poi = map.pois.find((p) => Math.abs(p.pos.x - g.x) + Math.abs(p.pos.y - g.y) === 1);
    if (!poi) throw new Error(`parseScreen: guard at ${g.x},${g.y} is not beside a chest, shop or shrine`);
    poi.guardId = `guard_${i}`;
    map.guards.push({ id: poi.guardId, pos: g, enemyId: rng.pick(roster), poiId: poi.id });
  });
  // Nodes: reading order gives stable ids, so dialogue and ghosts can name them.
  nodeSpots.forEach((n, i) => {
    const kind: MapNode['kind'] = n.ch === 'x' ? 'elite' : 'fight';
    const node: MapNode = { id: `node_${i}`, kind, pos: n.pos, enemyId: rng.pick(roster) };
    if (kind === 'elite') { const [front, rear] = rng.pick(PAIRS[tier]); node.enemyId = front; node.extra = [rear]; }
    map.nodes!.push(node);
  });
  signSpots.forEach((p, i) => map.signposts!.push({ id: `sign_${opts.screenIndex + 1}_${i}`, pos: p } as Signpost));

  if (!validate(map)) throw new Error(`parseScreen: screen ${opts.screenIndex + 1} is not fully reachable`);
  const reach = costField(map, [entry]);
  for (const n of map.nodes!) if (!isFinite(reach[n.pos.y * W + n.pos.x]!)) throw new Error(`parseScreen: node ${n.id} unreachable`);
  return map;
}

/** Which authored glyph sits on a tile, for debugging renders. */
export function renderAscii(m: ScreenMap): string {
  const back: Record<TileType, string> = { grass: '.', forest: '#', road: '=', water: '~', rock: '^', swamp: '%', arena: 'A' };
  const g = new Map<string, string>();
  g.set(key(m.entry), 'E'); g.set(key(m.boss), 'B'); g.set(key(m.questGiver), 'q'); g.set(key(m.npcSpot), 'n');
  for (const p of m.pois) g.set(key(p.pos), p.kind === 'shrine' ? 'h' : p.kind[0]!);
  for (const x of m.guards) g.set(key(x.pos), 'g');
  for (const n of m.nodes ?? []) g.set(key(n.pos), n.kind === 'elite' ? 'x' : 'f');
  for (const s of m.signposts ?? []) g.set(key(s.pos), 'p');
  const rows: string[] = [];
  for (let y = 0; y < m.height; y++) { let r = ''; for (let x = 0; x < m.width; x++) r += g.get(`${x},${y}`) ?? back[m.tiles[y * m.width + x]!]; rows.push(r); }
  return rows.join('\n');
}

/** Steps along the cheapest walk from the entry to the boss; the daylight budget is scaled from it. */
export function entryToBossSteps(m: ScreenMap): number {
  const c = costField(m, [m.entry], (mm, x, y) => (TILE_COST[mm.tiles[y * mm.width + x]!] === Infinity ? Infinity : 1));
  return c[m.boss.y * m.width + m.boss.x] ?? Infinity;
}

export const DIRS = DIRS4;
export type { EnemyId };
