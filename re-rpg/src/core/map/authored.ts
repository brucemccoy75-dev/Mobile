import { enemiesOfTier } from '@data/index';
import { PAIRS } from '@data/packs';
import type { EnemyId } from '@data/types';
import type { Rng } from '@core/rng';
import { costField } from './pathfind';
import { validate } from './generate';
import { TILE_COST, key, type MapNode, type NodeKind, type ScreenMap, type Tile, type TileType } from './types';

/**
 * Hand-authored screens (DECISIONS #37): the terrain and the node network are a fixed ASCII grid,
 * the contents are rolled per run. One character per tile:
 *
 *   terrain      . grass   # forest   = road   ~ water   ^ rock   % swamp   A arena
 *   node slots   E start (the story node)   o open slot, typed per run   x elite   q quest node
 *   (on roads)   n the lost one   B boss   and fixed types: f monster  u unknown  c treasure  s shop  h shrine
 *
 * Open slots draw from a bag: one shop, one shrine, a few treasures, the rest monsters (some of
 * them unknown). Dead ends take the non-fight types first. Nodes are linked when a road joins them
 * without passing through a third node.
 */
const TERRAIN: Record<string, TileType> = { '.': 'grass', '#': 'forest', '=': 'road', '~': 'water', '^': 'rock', '%': 'swamp', 'A': 'arena' };
const SLOT: Record<string, NodeKind | 'open'> = { E: 'start', B: 'boss', o: 'open', x: 'elite', q: 'quest', n: 'lost', f: 'monster', u: 'unknown', c: 'treasure', s: 'shop', h: 'shrine' };
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

export interface AuthoredOptions { seed: string; screenIndex: number; }

/** What the open slots become, by count. The rest are monsters. */
export const BAG = { shop: 1, shrine: 1, treasurePerSlot: 0.25, unknownShare: 0.4, unknownDuoChance: 0.35 } as const;

export function parseScreen(ascii: string, rng: Rng, opts: AuthoredOptions): ScreenMap {
  const rows = ascii.split('\n').map((r) => r.trimEnd()).filter((r) => r.length > 0);
  const H = rows.length, W = Math.max(...rows.map((r) => r.length));
  const tiles: TileType[] = new Array<TileType>(W * H).fill('rock');
  const slots: { ch: string; pos: Tile }[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const ch = rows[y]![x] ?? '^';
    if (ch in TERRAIN) { tiles[y * W + x] = TERRAIN[ch]!; continue; }
    if (!(ch in SLOT)) throw new Error(`parseScreen: unknown glyph '${ch}' at ${x},${y}`);
    tiles[y * W + x] = ch === 'B' ? 'arena' : 'road';
    slots.push({ ch, pos: { x, y } });
  }
  const start = slots.find((s) => s.ch === 'E'), boss = slots.find((s) => s.ch === 'B'), lost = slots.find((s) => s.ch === 'n');
  if (!start || !boss || !lost) throw new Error('parseScreen: needs E, B and n');

  const tier = opts.screenIndex === 0 ? 1 : 2;
  const roster = enemiesOfTier(tier).map((e) => e.id);
  const nodes: MapNode[] = slots.map((s, i) => ({ id: `node_${i}`, kind: SLOT[s.ch] === 'open' ? 'monster' : (SLOT[s.ch] as NodeKind), pos: s.pos, links: [] }));
  const map: ScreenMap = {
    seed: opts.seed, screenIndex: opts.screenIndex, authored: true, width: W, height: H, tiles, entry: start.pos, boss: boss.pos,
    bossId: opts.screenIndex === 0 ? 'gatekeeper' : 'warden', pois: [], guards: [], questGiver: start.pos, npcSpot: lost.pos, nodes,
  };

  // Links: walk the roads from each node; the first node met in each direction is a neighbour.
  const byTile = new Map<string, MapNode>(nodes.map((n) => [key(n.pos), n]));
  const walkable = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && (tiles[y * W + x] === 'road' || tiles[y * W + x] === 'arena');
  for (const n of nodes) {
    const seen = new Set<string>([key(n.pos)]);
    const q: Tile[] = [n.pos];
    for (let qi = 0; qi < q.length; qi++) {
      const t = q[qi]!;
      for (const [dx, dy] of DIRS4) {
        const x = t.x + dx, y = t.y + dy, k = `${x},${y}`;
        if (seen.has(k) || !walkable(x, y)) continue;
        seen.add(k);
        const other = byTile.get(k);
        if (other) { if (!n.links.includes(other.id)) n.links.push(other.id); continue; } // stop at a node
        q.push({ x, y });
      }
    }
  }

  // Open slots: the bag. Dead ends (one link) get the non-fight types first.
  const open = slots.map((s, i) => (s.ch === 'o' ? nodes[i]! : null)).filter((n): n is MapNode => !!n);
  const treasures = Math.max(1, Math.round(open.length * BAG.treasurePerSlot));
  const bag: NodeKind[] = [...Array<NodeKind>(BAG.shop).fill('shop'), ...Array<NodeKind>(BAG.shrine).fill('shrine'), ...Array<NodeKind>(treasures).fill('treasure')];
  const monsters = Math.max(0, open.length - bag.length);
  const unknowns = Math.round(monsters * BAG.unknownShare);
  const fightBag: NodeKind[] = [...Array<NodeKind>(unknowns).fill('unknown'), ...Array<NodeKind>(monsters - unknowns).fill('monster')];
  const calm = rng.shuffle(bag), fights = rng.shuffle(fightBag);
  const deadEnds = rng.shuffle(open.filter((n) => n.links.length <= 1)), inner = rng.shuffle(open.filter((n) => n.links.length > 1));
  for (const n of [...deadEnds, ...inner]) n.kind = calm.shift() ?? fights.shift() ?? 'monster';

  // Species. Elites are always a pair; unknowns sometimes are, which is their risk.
  for (const n of nodes) {
    if (n.kind === 'monster') n.enemyId = rng.pick(roster);
    else if (n.kind === 'unknown') { n.enemyId = rng.pick(roster); if (rng.chance(BAG.unknownDuoChance)) { const [a, b] = rng.pick(PAIRS[tier]); n.enemyId = a; n.extra = [b]; } }
    else if (n.kind === 'elite') { const [a, b] = rng.pick(PAIRS[tier]); n.enemyId = a; n.extra = [b]; }
    else if (n.kind === 'boss') n.enemyId = map.bossId;
  }

  if (!validate(map)) throw new Error(`parseScreen: screen ${opts.screenIndex + 1} is not fully reachable`);
  const reach = costField(map, [map.entry]);
  for (const n of nodes) if (!isFinite(reach[n.pos.y * W + n.pos.x]!)) throw new Error(`parseScreen: ${n.id} unreachable`);
  const linked = new Set<string>([nodes[0]!.id]);
  const stack = [nodes[0]!];
  while (stack.length) { const n = stack.pop()!; for (const l of n.links) if (!linked.has(l)) { linked.add(l); stack.push(nodes.find((m) => m.id === l)!); } }
  if (linked.size !== nodes.length) throw new Error('parseScreen: the node network is not connected');
  return map;
}

/** Glyph view of a parsed screen, for debugging and tests. */
export function renderAscii(m: ScreenMap): string {
  const back: Record<TileType, string> = { grass: '.', forest: '#', road: '=', water: '~', rock: '^', swamp: '%', arena: 'A' };
  const glyph: Record<NodeKind, string> = { start: 'E', boss: 'B', elite: 'x', quest: 'q', lost: 'n', monster: 'f', unknown: 'u', treasure: 'c', shop: 's', shrine: 'h' };
  const g = new Map<string, string>();
  for (const n of m.nodes ?? []) g.set(key(n.pos), glyph[n.kind]);
  const rows: string[] = [];
  for (let y = 0; y < m.height; y++) { let r = ''; for (let x = 0; x < m.width; x++) r += g.get(`${x},${y}`) ?? back[m.tiles[y * m.width + x]!]; rows.push(r); }
  return rows.join('\n');
}

/** Road tiles from one node to a linked one (excluding the start tile), for the walk animation. */
export function roadBetween(m: ScreenMap, from: Tile, to: Tile): Tile[] {
  const roadOnly = (mm: ScreenMap, x: number, y: number) => { const t = mm.tiles[y * mm.width + x]!; return t === 'road' || t === 'arena' ? 1 : Infinity; };
  const dist = costField(m, [to], roadOnly);
  const path: Tile[] = [];
  let cur = from;
  for (let guard = 0; guard < m.width * m.height; guard++) {
    if (cur.x === to.x && cur.y === to.y) break;
    let best: Tile | null = null, bestD = dist[cur.y * m.width + cur.x]!;
    for (const [dx, dy] of DIRS4) {
      const x = cur.x + dx, y = cur.y + dy;
      if (x < 0 || y < 0 || x >= m.width || y >= m.height) continue;
      const d = dist[y * m.width + x]!;
      if (d < bestD) { bestD = d; best = { x, y }; }
    }
    if (!best) break;
    path.push(best); cur = best;
  }
  return path;
}

export const DIRS = DIRS4;
export type { EnemyId };
void TILE_COST;
