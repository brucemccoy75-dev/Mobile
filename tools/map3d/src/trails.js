// Trails through the woods, and the woods as a wall.
//
// Open woodland with trees fifteen metres apart is a field with obstacles: the
// player runs straight at the next house and sees it the whole way. This makes
// the forest a mass you cannot enter, cut by trails you can - a few metres
// wide, following the contours, meandering, with a blind bend or two on the
// long ones - so that getting from place to place is a route and not a bearing.
//
// The pieces, all raster:
//   1. A 4 m cost grid over the map: forest cheap, open ground dear, roads
//      passable but never drawn, existing OSM paths and tracks nearly free,
//      buildings, water and the map edge impassable. Slope costs, and a
//      low-frequency noise term makes a route wander instead of running straight.
//   2. Sites: the spawn doorstep and every building doorstep with forest
//      within reach. A minimum spanning tree joins them, plus a few loop edges
//      so the woods are not a tree of dead ends.
//   3. Each edge is routed by A*, through one or two perpendicular waypoints
//      on the long ones (the blind corners), then split into the stretches that
//      are not on a road, smoothed, and emitted as a `highway=path` feature the
//      rest of the pipeline draws like any OSM track.
//   4. The mass: forest cells not within reach of a trail, road or building,
//      merged into rectangles the engine turns into invisible colliders that
//      block the player and the NavMesh bake alike.
//   5. A hedge: bushes along every edge of the mass and a tree row just inside,
//      so the wall you cannot pass is one you cannot see through either.
//
// The same machinery serves other places once they have a rule for what is
// mass and what is cheap: buildings and alleys in a city, fences and gates in
// a suburb, rock in a desert. This file only knows woods.

import { classifyHighway } from './tags.js';
import { OccupancyMask } from './scatter.js';
import { doorstep } from './home.js';

const CELL = 4;            // routing grid
const FINE = 2;            // mass grid
const TRAIL_WIDTH = 2.8;   // metres, the drawn ribbon
const CORRIDOR = 3.9;      // half-width kept clear of mass either side of a centreline

const COST = {
  trail: 0.35,   // an existing trail or OSM path/track: reuse it
  forest: 1.0,
  scrub: 1.4,
  open: 3.0,     // lawn, field, pasture
  developed: 6.0,
  road: 1.6,     // passable for routing, never drawn: the trail starts where it leaves the road
  nearTrail: 1.5,// extra, within 12 m of a trail but not on it: merge, do not braid
  slope: 6.0,    // per metre of rise or fall between cells
  noise: 1.3,    // amplitude on forest cells, per metre
};

/**
 * @param {object} a
 * @param {Array} a.local        projected features (scene.js `local`)
 * @param {object|null} a.landcover
 * @param {(x:number,z:number)=>number} a.surface  ground height
 * @param {number} a.half        map half-extent (ground)
 * @param {number} a.radius      query radius (sites must be inside it)
 * @param {[number,number]|null} a.spawn   spawn point if known, else the origin
 * @param {number} a.seed
 * @param {(msg:string)=>void} [a.log]
 */
export function buildTrails({ local, landcover, surface, half, radius, spawn, seed = 1, log = () => {} }) {
  const inner = half - 6;
  const n = Math.ceil((2 * half) / CELL) + 1;
  const idx = (i, j) => j * n + i;
  const cellOf = (x, z) => [clamp(Math.round((x + half) / CELL), 0, n - 1), clamp(Math.round((z + half) / CELL), 0, n - 1)];
  const posOf = (i, j) => [i * CELL - half, j * CELL - half];

  /* ------------------------------ what is where ------------------------------ */

  const roads = [];      // non-minor highways: { line, hw }
  const minors = [];     // footway/path/track: reused as trail
  const buildings = [];  // { id, outline, centre, tags }
  const woods = [];      // OSM wood polygons
  const waters = [];
  for (const f of local) {
    if (f.kind === 'line') {
      const cls = classifyHighway(f.tags);
      if (!cls || f.tags.tunnel === 'yes') continue;
      if (f.tags.bridge && f.tags.bridge !== 'no') continue;
      (cls.minor ? minors : roads).push({ line: f.line, hw: cls.width / 2 });
    } else if (f.kind === 'area') {
      const t = f.tags;
      if ((t.building || t['building:part']) && f.rings?.[0]?.length >= 3) {
        const outline = f.rings[0];
        buildings.push({ id: f.id, outline, centre: centroid(outline), tags: t });
      } else if (t.natural === 'wood' || t.landuse === 'forest') woods.push(f.rings);
      else if (t.natural === 'water' || t.landuse === 'reservoir' || t.landuse === 'basin' || t.waterway === 'riverbank' || t.water) waters.push(f.rings);
    }
  }
  if (!landcover && woods.length === 0) { log('  trails: no woods here'); return null; }

  // Masks on the fine grid, shared by the router (sampled) and the mass.
  const woodMask = new OccupancyMask(half, FINE);
  for (const rings of woods) woodMask.markPolygon(rings, 0);
  const waterMask = new OccupancyMask(half, FINE);
  for (const rings of waters) waterMask.markPolygon(rings, 1);
  const buildingMask = new OccupancyMask(half, FINE);
  for (const b of buildings) buildingMask.markPolygon([b.outline], 1.0);
  const roadMask = new OccupancyMask(half, FINE);
  for (const r of roads) roadMask.markLine(r.line, r.hw * 2 + 3);
  const minorMask = new OccupancyMask(half, FINE);
  for (const m of minors) minorMask.markLine(m.line, 4);
  // The verge: forest just off a road is cheaper than the road, and without this
  // a route ran 10 m inside the tree line the whole way, a trail beside a road.
  // Either use the road or keep away from it.
  const vergeMask = new OccupancyMask(half, FINE);
  for (const r of roads) vergeMask.markLine(r.line, r.hw * 2 + 3 + 28);

  const forestAt = (x, z) => {
    if (woodMask.get(x, z)) return true;
    if (!landcover) return false;
    const c = landcover.classAt(x, z);
    return c.canopy >= 0.7 && c.name !== 'open water';
  };
  const groundKind = (x, z) => {
    if (forestAt(x, z)) return 'forest';
    const c = landcover?.classAt(x, z);
    if (!c) return 'open';
    if (c.name === 'open water') return 'water';
    if (c.name === 'shrub/scrub') return 'scrub';
    if (/^developed (medium|high)/.test(c.name)) return 'developed';
    return 'open';
  };

  /* ------------------------------- cost grid -------------------------------- */

  const base = new Float32Array(n * n);
  const height = new Float32Array(n * n);
  const noise = new Float32Array(n * n);
  const isRoad = new Uint8Array(n * n);
  const isMinor = new Uint8Array(n * n);
  const isForest = new Uint8Array(n * n);
  const onTrail = new Uint8Array(n * n);
  const rnd = mulberry(seed);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const k = idx(i, j);
      const [x, z] = posOf(i, j);
      height[k] = surface(x, z);
      noise[k] = valueNoise(x, z, 34, seed) * 0.7 + valueNoise(x + 900, z - 900, 13, seed) * 0.3;
      if (Math.abs(x) > inner || Math.abs(z) > inner || waterMask.get(x, z) || groundKind(x, z) === 'water') { base[k] = Infinity; continue; }
      if (buildingMask.get(x, z)) { base[k] = Infinity; continue; }
      if (minorMask.get(x, z)) { base[k] = COST.trail; isMinor[k] = 1; continue; }
      if (roadMask.get(x, z)) { base[k] = COST.road; isRoad[k] = 1; continue; }
      const g = groundKind(x, z);
      isForest[k] = g === 'forest' ? 1 : 0;
      base[k] = g === 'forest' ? COST.forest : g === 'scrub' ? COST.scrub : g === 'developed' ? COST.developed : COST.open;
      if (vergeMask.get(x, z)) base[k] += COST.nearTrail;
    }
  }

  /* --------------------------------- sites ---------------------------------- */

  const roadPts = [];
  for (const r of roads) for (const p of sampleAlong(r.line, 8)) roadPts.push(p);
  const nearestRoad = (x, z) => {
    let best = null, bd = Infinity;
    for (const p of roadPts) { const d = (p[0] - x) ** 2 + (p[1] - z) ** 2; if (d < bd) { bd = d; best = p; } }
    return best;
  };
  const forestNear = (x, z, r) => {
    for (let a = 0; a < 8; a++) { const t = (a / 8) * Math.PI * 2; if (forestAt(x + Math.cos(t) * r, z + Math.sin(t) * r)) return true; }
    return false;
  };
  const forestOnLine = (a, b) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    let m = 0;
    for (let d = 0; d <= len; d += 2) { const t = d / len; if (forestAt(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)) m += 2; }
    return m;
  };

  const sites = [];
  const origin = spawn ?? [0, 0];
  for (const b of buildings) {
    if (Math.hypot(b.centre[0], b.centre[1]) > radius - 10) continue;
    const road = nearestRoad(b.centre[0], b.centre[1]);
    const step = doorstep(b.outline, road, 2.5);
    const wooded = forestNear(step.x, step.z, 8) || forestNear(step.x, step.z, 15)
      || (road && forestOnLine([step.x, step.z], road) >= 20);
    if (!wooded) continue;
    sites.push({ id: b.id, x: step.x, z: step.z, d: Math.hypot(step.x - origin[0], step.z - origin[1]) });
  }
  sites.sort((a, b) => a.d - b.d);
  if (sites.length > 120) sites.length = 120;
  if (sites.length < 2) { log(`  trails: ${sites.length} wooded site(s), nothing to join`); return null; }

  /* --------------------------------- edges ---------------------------------- */

  const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
  // Prim's MST.
  const inTree = new Set([0]);
  const edges = [];
  while (inTree.size < sites.length) {
    let best = null;
    for (const a of inTree) for (let b = 0; b < sites.length; b++) {
      if (inTree.has(b)) continue;
      const d = dist(sites[a], sites[b]);
      if (!best || d < best.d) best = { a, b, d };
    }
    inTree.add(best.b);
    edges.push(best);
  }
  // Loops: each site's second-nearest neighbour, when that is not already an edge
  // and the pair is close enough that a loop reads as a loop and not a second road.
  const has = new Set(edges.map((e) => key(e.a, e.b)));
  const loops = [];
  for (let a = 0; a < sites.length; a++) {
    const near = sites.map((s, b) => ({ b, d: dist(sites[a], s) })).filter((o) => o.b !== a).sort((p, q) => p.d - q.d).slice(0, 2);
    for (const o of near) {
      if (o.d > 140 || has.has(key(a, o.b))) continue;
      has.add(key(a, o.b));
      loops.push({ a, b: o.b, d: o.d });
    }
  }
  edges.sort((p, q) => p.d - q.d);
  loops.sort((p, q) => p.d - q.d);
  const all = edges.concat(loops.slice(0, Math.max(4, Math.round(sites.length * 0.35))));

  /* --------------------------------- routing -------------------------------- */

  const trails = [];      // drawn polylines, [[x,z],...]
  let routed = 0, failed = 0;
  for (const e of all) {
    const A = sites[e.a], B = sites[e.b];
    // Waypoints off the straight line on the long ones: the blind bends.
    const wps = [];
    if (e.d > 60) {
      const count = e.d > 140 ? 2 : 1;
      for (let w = 0; w < count; w++) {
        const t = count === 1 ? 0.35 + rnd() * 0.3 : 0.25 + w * 0.4 + rnd() * 0.15;
        const px = A.x + (B.x - A.x) * t, pz = A.z + (B.z - A.z) * t;
        const len = e.d;
        const nx = -(B.z - A.z) / len, nz = (B.x - A.x) / len;
        const side = rnd() < 0.5 ? -1 : 1;
        const off = side * (12 + rnd() * 14);
        const wx = px + nx * off, wz = pz + nz * off;
        const [ci, cj] = cellOf(wx, wz);
        if (isForest[idx(ci, cj)] && Number.isFinite(base[idx(ci, cj)])) wps.push([wx, wz]);
      }
    }
    const legs = [[A.x, A.z], ...wps, [B.x, B.z]];
    let cells = [];
    let ok = true;
    for (let l = 0; l + 1 < legs.length; l++) {
      const part = astar(legs[l], legs[l + 1]);
      if (!part) { ok = false; break; }
      cells = cells.concat(l === 0 ? part : part.slice(1));
    }
    if (!ok) { failed++; continue; }
    routed++;
    // Stretches not on a road become trails; mark them so later edges reuse them.
    let run = [];
    const flush = (endCell) => {
      if (run.length >= 3) {
        const pts = run.map(([i, j]) => posOf(i, j));
        if (endCell) pts.push(posOf(endCell[0], endCell[1]));
        trails.push(pts);
      }
      run = [];
    };
    let prevRoad = null;
    for (const c of cells) {
      const k = idx(c[0], c[1]);
      if (isRoad[k] || isMinor[k]) {
        flush(c);
        prevRoad = c;
      } else {
        if (run.length === 0 && prevRoad) run.push(prevRoad);   // start on the road, not beside it
        run.push(c);
        onTrail[k] = 1;
        base[k] = Math.min(base[k], COST.trail);
      }
    }
    flush(null);
    // Merge, do not braid: cells within 12 m of this trail cost a little extra now.
    for (const c of cells) {
      const k = idx(c[0], c[1]);
      if (!onTrail[k]) continue;
      for (let dj = -3; dj <= 3; dj++) for (let di = -3; di <= 3; di++) {
        const ii = c[0] + di, jj = c[1] + dj;
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue;
        const kk = idx(ii, jj);
        if (!onTrail[kk] && Number.isFinite(base[kk]) && base[kk] < COST.forest + COST.nearTrail) base[kk] = Math.min(base[kk] + COST.nearTrail, COST.forest + COST.nearTrail);
      }
    }
  }

  function astar(from, to) {
    const [si, sj] = cellOf(from[0], from[1]);
    const [gi, gj] = cellOf(to[0], to[1]);
    const start = idx(si, sj), goal = idx(gi, gj);
    const g = new Float32Array(n * n).fill(Infinity);
    const came = new Int32Array(n * n).fill(-1);
    const closed = new Uint8Array(n * n);
    const heap = new Heap();
    g[start] = 0;
    heap.push(start, 0);
    const h = (k) => { const i = k % n, j = (k - i) / n; return Math.hypot(i - gi, j - gj) * CELL * COST.trail; };
    while (heap.size) {
      const k = heap.pop();
      if (closed[k]) continue;
      closed[k] = 1;
      if (k === goal) break;
      const i = k % n, j = (k - i) / n;
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue;
        const ii = i + di, jj = j + dj;
        if (ii < 0 || jj < 0 || ii >= n || jj >= n) continue;
        const kk = idx(ii, jj);
        if (closed[kk]) continue;
        let b = base[kk];
        if (kk === goal || kk === start) b = Math.min(b, COST.open);
        if (!Number.isFinite(b)) continue;
        const step = di && dj ? CELL * Math.SQRT2 : CELL;
        let c = step * (b + (isForest[kk] && !onTrail[kk] ? COST.noise * noise[kk] : 0));
        c += COST.slope * Math.abs(height[kk] - height[k]);
        const ng = g[k] + c;
        if (ng < g[kk]) { g[kk] = ng; came[kk] = k; heap.push(kk, ng + h(kk)); }
      }
    }
    if (!Number.isFinite(g[goal])) return null;
    const path = [];
    for (let k = goal; k !== -1; k = came[k]) path.push([k % n, (k - (k % n)) / n]);
    path.reverse();
    return path;
  }

  /* ------------------------------ the polylines ----------------------------- */

  const ways = [];
  let trailMeters = 0;
  trails.forEach((pts, i) => {
    let line = chaikin(chaikin(pts));
    line = simplify(line, 0.9);
    const len = lineLength(line);
    if (len < 10) return;
    trailMeters += len;
    ways.push({
      id: `trail/${i}`,
      kind: 'line',
      tags: { highway: 'path', trail: 'yes', width: String(TRAIL_WIDTH), surface: 'dirt' },
      line,
    });
  });

  /* --------------------------------- the mass -------------------------------- */

  const trailMask = new OccupancyMask(half, FINE);
  for (const w of ways) trailMask.markLine(w.line, CORRIDOR * 2);
  for (const m of minors) trailMask.markLine(m.line, CORRIDOR * 2);
  const roadClear = new OccupancyMask(half, FINE);
  for (const r of roads) roadClear.markLine(r.line, r.hw * 2 + 9);
  const buildingClear = new OccupancyMask(half, FINE);
  for (const b of buildings) buildingClear.markPolygon([b.outline], 4);

  const fn = Math.ceil((2 * half) / FINE) + 1;
  const fpos = (i, j) => [i * FINE - half, j * FINE - half];
  const blocked = new Uint8Array(fn * fn);
  for (let j = 0; j < fn; j++) for (let i = 0; i < fn; i++) {
    const [x, z] = fpos(i, j);
    if (Math.abs(x) > inner || Math.abs(z) > inner) continue;
    if (!forestAt(x, z)) continue;
    if (trailMask.get(x, z) || roadClear.get(x, z) || buildingClear.get(x, z) || waterMask.get(x, z)) continue;
    blocked[j * fn + i] = 1;
  }
  // Lone cells and one-cell spurs are not a wall, they are a snag; drop them.
  const cleaned = new Uint8Array(blocked);
  for (let j = 1; j < fn - 1; j++) for (let i = 1; i < fn - 1; i++) {
    const k = j * fn + i;
    if (!blocked[k]) continue;
    let m = 0;
    for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) if ((di || dj) && blocked[k + dj * fn + di]) m++;
    if (m < 3) cleaned[k] = 0;
  }

  const rects = greedyRects(cleaned, fn, fn, FINE, half, 12);

  /* ---------------------------------- hedge --------------------------------- */

  // Bushes along every edge of the mass, a tree row just inside. Only where the
  // cell really is forest: the mass can end at a road clearance line that runs
  // through open ground, and a hedge across a lawn is the wrong answer there.
  const hedge = [];
  const hr = mulberry(seed + 7);
  for (let j = 1; j < fn - 1; j++) for (let i = 1; i < fn - 1; i++) {
    const k = j * fn + i;
    if (!cleaned[k]) continue;
    const open = !cleaned[k - 1] || !cleaned[k + 1] || !cleaned[k - fn] || !cleaned[k + fn];
    if (!open) continue;
    const [x, z] = fpos(i, j);
    // Which way is inside: away from the open neighbours.
    const dx = (cleaned[k - 1] ? 0 : 1) - (cleaned[k + 1] ? 0 : 1);
    const dz = (cleaned[k - fn] ? 0 : 1) - (cleaned[k + fn] ? 0 : 1);
    // A bush on every edge cell and a second, staggered row a cell in: one row
    // at 70% left the house up the hill half visible from the doorstep.
    hedge.push({ x: x + (hr() - 0.5) * 1.4, z: z + (hr() - 0.5) * 1.4, kind: 'scrub', height: 2.6 + hr() * 1.2, crown: 1.7 + hr() * 0.8 });
    if (hr() < 0.8) hedge.push({ x: x + dx * FINE + (hr() - 0.5) * 2, z: z + dz * FINE + (hr() - 0.5) * 2, kind: 'scrub', height: 2.8 + hr() * 1.4, crown: 1.8 + hr() * 0.9 });
    if (hr() < 0.3) {
      const tx = x + dx * (FINE * 2 + 1) + (hr() - 0.5) * 2, tz = z + dz * (FINE * 2 + 1) + (hr() - 0.5) * 2;
      hedge.push({ x: tx, z: tz, kind: 'broadleaf', height: 9 + hr() * 5, crown: 3.4 + hr() * 1.4 });
    }
  }

  log(`  trails: ${sites.length} wooded sites, ${routed}/${all.length} edges routed${failed ? ` (${failed} failed)` : ''}, `
    + `${ways.length} trails, ${Math.round(trailMeters)} m; mass ${rects.length} blocks, hedge ${hedge.length} plants`);

  return {
    ways,
    blocks: rects,
    hedge,
    trails: ways.map((w) => ({ id: w.id, points: w.line.map(([x, z]) => [round(x, 2), round(z, 2)]), lengthMeters: round(lineLength(w.line), 1) })),
    sites: sites.map((s) => ({ id: s.id, x: round(s.x, 2), z: round(s.z, 2) })),
    stats: { sites: sites.length, edges: all.length, routed, failed, trails: ways.length, trailMeters: Math.round(trailMeters), blocks: rects.length, hedge: hedge.length },
  };
}

/* ---------------------------------- helpers ---------------------------------- */

/** Merge marked cells into rectangles, greedy by rows, no side longer than maxCells. */
function greedyRects(mask, w, h, cell, half, maxCells) {
  const used = new Uint8Array(mask.length);
  const out = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = j * w + i;
    if (!mask[k] || used[k]) continue;
    let iw = 1;
    while (iw < maxCells && i + iw < w && mask[k + iw] && !used[k + iw]) iw++;
    let jh = 1;
    outer: while (jh < maxCells && j + jh < h) {
      for (let di = 0; di < iw; di++) { const kk = (j + jh) * w + i + di; if (!mask[kk] || used[kk]) break outer; }
      jh++;
    }
    for (let dj = 0; dj < jh; dj++) for (let di = 0; di < iw; di++) used[(j + dj) * w + i + di] = 1;
    // cell (i, j) is centred on (i*cell - half, j*cell - half)
    out.push({
      x: round((i + (iw - 1) / 2) * cell - half, 2),
      z: round((j + (jh - 1) / 2) * cell - half, 2),
      w: iw * cell,
      d: jh * cell,
    });
  }
  return out;
}

class Heap {
  constructor() { this.k = []; this.p = []; }
  get size() { return this.k.length; }
  push(key, pri) {
    const k = this.k, p = this.p;
    k.push(key); p.push(pri);
    let i = k.length - 1;
    while (i > 0) { const q = (i - 1) >> 1; if (p[q] <= p[i]) break; [k[q], k[i]] = [k[i], k[q]]; [p[q], p[i]] = [p[i], p[q]]; i = q; }
  }
  pop() {
    const k = this.k, p = this.p;
    const top = k[0];
    const lk = k.pop(), lp = p.pop();
    if (k.length) {
      k[0] = lk; p[0] = lp;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < k.length && p[l] < p[m]) m = l;
        if (r < k.length && p[r] < p[m]) m = r;
        if (m === i) break;
        [k[m], k[i]] = [k[i], k[m]]; [p[m], p[i]] = [p[i], p[m]]; i = m;
      }
    }
    return top;
  }
}

function chaikin(pts) {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = pts[i], b = pts[i + 1];
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
    out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/** Douglas-Peucker. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let far = -1, fd = tol;
    for (let i = a + 1; i < b; i++) {
      const d = segDist(pts[i], pts[a], pts[b]);
      if (d > fd) { fd = d; far = i; }
    }
    if (far > 0) { keep[far] = 1; stack.push([a, far], [far, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

function segDist(p, a, b) {
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const l2 = dx * dx + dz * dz;
  let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dz) / l2 : 0;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + dx * t), p[1] - (a[1] + dz * t));
}

function lineLength(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}

function sampleAlong(line, step) {
  const out = [];
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i], b = line[i + 1];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const k = Math.max(1, Math.round(len / step));
    for (let s = 0; s < k; s++) { const t = s / k; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  if (line.length) out.push(line[line.length - 1]);
  return out;
}

function centroid(ring) {
  let x = 0, z = 0;
  for (const p of ring) { x += p[0]; z += p[1]; }
  return [x / ring.length, z / ring.length];
}

function valueNoise(x, z, wavelength, seed) {
  const u = x / wavelength, v = z / wavelength;
  const i = Math.floor(u), j = Math.floor(v);
  const fu = smooth(u - i), fv = smooth(v - j);
  const a = hash01(i, j, seed), b = hash01(i + 1, j, seed), c = hash01(i, j + 1, seed), d = hash01(i + 1, j + 1, seed);
  return (a * (1 - fu) + b * fu) * (1 - fv) + (c * (1 - fu) + d * fu) * fv;
}
const smooth = (t) => t * t * (3 - 2 * t);
function hash01(i, j, seed) {
  let h = (i * 374761393 + j * 668265263 + seed * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function mulberry(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const key = (a, b) => (a < b ? `${a}:${b}` : `${b}:${a}`);
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
const round = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
