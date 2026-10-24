import { TILE_COST, inBounds, key, type ScreenMap, type Tile } from './types';

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

export interface PathOptions {
  /** Extra impassable tiles (undefeated guards, closed boss gate). */
  blocked?: Set<string>;
  /** Tiles that may be entered only as the final step (a guard you intend to fight). */
  targetOnly?: Set<string>;
  /** Cost function override; defaults to TILE_COST. */
  costOf?: (m: ScreenMap, x: number, y: number) => number;
}

export const defaultCost = (m: ScreenMap, x: number, y: number): number => TILE_COST[m.tiles[y * m.width + x]!];

/** A* on a 4-connected grid with per-tile entry cost. Returns the path excluding the start tile, or null. */
export function findPath(m: ScreenMap, from: Tile, to: Tile, opts: PathOptions = {}): Tile[] | null {
  if (!inBounds(m, to.x, to.y)) return null;
  const costOf = opts.costOf ?? defaultCost;
  const toKey = key(to);
  if (costOf(m, to.x, to.y) === Infinity && !opts.targetOnly?.has(toKey)) return null;
  if (opts.blocked?.has(toKey)) return null;

  const W = m.width;
  const idx = (t: Tile) => t.y * W + t.x;
  const g = new Float64Array(W * m.height).fill(Infinity);
  const came = new Int32Array(W * m.height).fill(-1);
  const closed = new Uint8Array(W * m.height);
  const h = (x: number, y: number) => Math.abs(x - to.x) + Math.abs(y - to.y);

  // Simple binary heap keyed on f.
  const heap: { i: number; f: number }[] = [];
  const push = (i: number, f: number) => {
    heap.push({ i, f });
    let c = heap.length - 1;
    while (c > 0) { const p = (c - 1) >> 1; if (heap[p]!.f <= heap[c]!.f) break; [heap[p], heap[c]] = [heap[c]!, heap[p]!]; c = p; }
  };
  const pop = () => {
    const top = heap[0]!; const last = heap.pop()!;
    if (heap.length) { heap[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, r = l + 1; let s = c; if (l < heap.length && heap[l]!.f < heap[s]!.f) s = l; if (r < heap.length && heap[r]!.f < heap[s]!.f) s = r; if (s === c) break; [heap[s], heap[c]] = [heap[c]!, heap[s]!]; c = s; } }
    return top;
  };

  const start = idx(from), goal = idx(to);
  g[start] = 0;
  push(start, h(from.x, from.y));

  while (heap.length) {
    const { i } = pop();
    if (closed[i]) continue;
    closed[i] = 1;
    if (i === goal) break;
    const x = i % W, y = (i / W) | 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (!inBounds(m, nx, ny)) continue;
      const ni = ny * W + nx;
      if (closed[ni]) continue;
      const k = `${nx},${ny}`;
      const isGoal = ni === goal;
      if (opts.blocked?.has(k)) continue;
      if (opts.targetOnly?.has(k) && !isGoal) continue;
      let c = costOf(m, nx, ny);
      if (c === Infinity) { if (isGoal && opts.targetOnly?.has(k)) c = 1; else continue; }
      const ng = g[i]! + c;
      if (ng < g[ni]!) { g[ni] = ng; came[ni] = i; push(ni, ng + h(nx, ny)); }
    }
  }
  if (g[goal] === Infinity) return null;
  const path: Tile[] = [];
  for (let i = goal; i !== start; i = came[i]!) path.push({ x: i % W, y: (i / W) | 0 });
  return path.reverse();
}

/** Cheapest path cost from any tile in `sources` to every reachable tile (Dijkstra). Infinity where unreachable. */
export function costField(m: ScreenMap, sources: Tile[], costOf = defaultCost): Float64Array {
  const W = m.width;
  const dist = new Float64Array(W * m.height).fill(Infinity);
  const heap: { i: number; f: number }[] = [];
  const push = (i: number, f: number) => { heap.push({ i, f }); heap.sort((a, b) => a.f - b.f); }; // maps are tiny; keep it simple
  for (const s of sources) { dist[s.y * W + s.x] = 0; push(s.y * W + s.x, 0); }
  while (heap.length) {
    const { i, f } = heap.shift()!;
    if (f > dist[i]!) continue;
    const x = i % W, y = (i / W) | 0;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      if (!inBounds(m, nx, ny)) continue;
      const c = costOf(m, nx, ny);
      if (c === Infinity) continue;
      const ni = ny * W + nx;
      const nd = f + c;
      if (nd < dist[ni]!) { dist[ni] = nd; push(ni, nd); }
    }
  }
  return dist;
}
