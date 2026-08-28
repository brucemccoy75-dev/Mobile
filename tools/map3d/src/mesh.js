// Mesh construction: flat polygons, extruded buildings, roofs, road ribbons,
// terrain grids and low-poly props.
//
// Coordinate system throughout: +X east, +Y up, -Z north (glTF / three.js).
// For 2D work we use (u, v) = (x, -z) so that "counter-clockwise" means the
// usual thing when looking down at the map from above.

import { earcut, ringArea } from './earcut.js';

/* ----------------------------- mesh containers ---------------------------- */

export class MeshGroup {
  constructor(material) {
    this.material = material;
    this.positions = [];
    this.normals = [];
    this.uvs = [];
    this.indices = [];
  }

  /**
   * Set false for groups that will never be textured (props). The exporters
   * then skip TEXCOORD_0, which is a quarter of the vertex payload and pure
   * waste across several thousand trees.
   */
  get needsUvs() {
    return this._needsUvs !== false;
  }

  set needsUvs(v) {
    this._needsUvs = v;
  }

  get vertexCount() {
    return this.positions.length / 3;
  }

  get triangleCount() {
    return this.indices.length / 3;
  }

  vertex(x, y, z, nx, ny, nz, u = 0, v = 0) {
    const i = this.positions.length / 3;
    this.positions.push(x, y, z);
    this.normals.push(nx, ny, nz);
    this.uvs.push(u, v);
    return i;
  }

  tri(a, b, c) {
    this.indices.push(a, b, c);
  }

  quad(a, b, c, d) {
    this.indices.push(a, b, c, a, c, d);
  }
}

export class MeshBuilder {
  constructor() {
    /** @type {Map<string, MeshGroup>} */
    this.groups = new Map();
  }

  group(material) {
    let g = this.groups.get(material);
    if (!g) {
      g = new MeshGroup(material);
      this.groups.set(material, g);
    }
    return g;
  }

  /** Drops empty groups and reports totals. */
  finalize() {
    for (const [name, g] of this.groups) {
      if (g.indices.length === 0) this.groups.delete(name);
    }
    let vertices = 0;
    let triangles = 0;
    for (const g of this.groups.values()) {
      vertices += g.vertexCount;
      triangles += g.triangleCount;
    }
    return { vertices, triangles, groups: this.groups.size };
  }
}

/* ------------------------------- ring utils ------------------------------- */

/** Removes a duplicated closing point and any repeated consecutive vertices. */
export function cleanRing(ring) {
  const out = [];
  for (const p of ring) {
    const last = out[out.length - 1];
    if (!last || Math.abs(last[0] - p[0]) > 1e-9 || Math.abs(last[1] - p[1]) > 1e-9) {
      out.push(p);
    }
  }
  while (
    out.length > 1 &&
    Math.abs(out[0][0] - out[out.length - 1][0]) < 1e-9 &&
    Math.abs(out[0][1] - out[out.length - 1][1]) < 1e-9
  ) {
    out.pop();
  }
  return out;
}

/** Ring area in the (u, v) = (x, -z) plane. Positive == counter-clockwise. */
function ringAreaXZ(ring) {
  return ringArea(ring.map(([x, z]) => [x, -z]));
}

export function polygonAreaXZ(rings) {
  if (!rings.length) return 0;
  return Math.abs(ringAreaXZ(rings[0])) -
    rings.slice(1).reduce((s, r) => s + Math.abs(ringAreaXZ(r)), 0);
}

export function centroidXZ(ring) {
  let a = 0;
  let cx = 0;
  let cz = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, z0] = ring[j];
    const [x1, z1] = ring[i];
    const cross = x0 * -z1 - x1 * -z0;
    a += cross;
    cx += (x0 + x1) * cross;
    cz += (z0 + z1) * cross;
  }
  if (Math.abs(a) < 1e-12) {
    // Degenerate ring: fall back to the vertex average.
    const n = ring.length || 1;
    return [
      ring.reduce((s, p) => s + p[0], 0) / n,
      ring.reduce((s, p) => s + p[1], 0) / n,
    ];
  }
  return [cx / (3 * a), cz / (3 * a)];
}

/**
 * Normalises a polygon so the outer ring is CCW and holes are CW (in u/v).
 * With that convention a single wall-winding rule works for both.
 */
export function normalizeRings(rings) {
  const out = [];
  rings.forEach((ring, idx) => {
    const clean = cleanRing(ring);
    if (clean.length < 3) return;
    const ccw = ringAreaXZ(clean) > 0;
    const wantCcw = idx === 0;
    out.push(ccw === wantCcw ? clean : clean.slice().reverse());
  });
  return out;
}

/* ---------------------------- flat / draped fills -------------------------- */

/**
 * Triangulates rings and emits an up-facing surface.
 * @param {MeshGroup} g
 * @param {Array<Array<[number, number]>>} rings outer ring first, then holes; [x, z]
 * @param {(x: number, z: number) => number} heightAt
 * @param {{uvScale?: number, smooth?: boolean}} [opts]
 */
export function fillPolygon(g, rings, heightAt, opts = {}) {
  const uvScale = opts.uvScale ?? 20;

  const coords = [];
  const holeStarts = [];
  rings.forEach((ring, idx) => {
    if (idx > 0) holeStarts.push(coords.length / 2);
    for (const [x, z] of ring) coords.push(x, -z); // work in (u, v)
  });
  if (coords.length < 6) return 0;

  let tris = earcut(coords, holeStarts);
  if (!tris.length) return 0;

  // Vertices are shared across the surface; normals come from the height field.
  const base = [];
  for (let i = 0; i < coords.length; i += 2) {
    const x = coords[i];
    const z = -coords[i + 1];
    base.push([x, heightAt(x, z), z]);
  }

  // A lake or a park earcuts into a handful of very long triangles, which then
  // chord straight across every rise between their corners. Split them until
  // they follow the ground.
  if (opts.maxEdge > 0) {
    tris = subdivideTriangles(base, tris, opts.maxEdge, heightAt, opts.maxTriangles ?? 60000);
  }

  const smooth = opts.smooth ?? false;
  if (smooth) {
    const normals = base.map(() => [0, 0, 0]);
    for (let i = 0; i < tris.length; i += 3) {
      accumulateFaceNormal(base, normals, tris[i], tris[i + 1], tris[i + 2]);
    }
    const idx = base.map((p, i) => {
      const n = normalize(normals[i]);
      return g.vertex(p[0], p[1], p[2], n[0], n[1], n[2], p[0] / uvScale, p[2] / uvScale);
    });
    emitTriangles(g, base, tris, idx);
  } else {
    const idx = base.map((p) =>
      g.vertex(p[0], p[1], p[2], 0, 1, 0, p[0] / uvScale, p[2] / uvScale),
    );
    emitTriangles(g, base, tris, idx);
  }
  return tris.length / 3;
}

/** Emits triangles with the winding fixed so they face up (+Y). */
function emitTriangles(g, base, tris, idx) {
  for (let i = 0; i < tris.length; i += 3) {
    const [a, b, c] = [tris[i], tris[i + 1], tris[i + 2]];
    // Signed area in (u, v) = (x, -z); positive means CCW seen from above.
    const s =
      (base[b][0] - base[a][0]) * (-base[c][2] + base[a][2]) -
      (base[c][0] - base[a][0]) * (-base[b][2] + base[a][2]);
    if (s >= 0) g.tri(idx[a], idx[b], idx[c]);
    else g.tri(idx[a], idx[c], idx[b]);
  }
}

/**
 * Bisects triangles until every edge is shorter than `maxEdge`.
 *
 * Which point an edge is split at depends only on that edge - always its
 * midpoint - and whether it splits depends only on its length, so the two
 * triangles sharing an edge always reach the same verdict and split it in the
 * same place. That is what keeps this crack-free without tracking who
 * neighbours whom. `mids` keeps the shared vertex a single vertex.
 *
 * A sag test (split where the ground actually bends, leave flat ground alone)
 * looks like the smarter criterion and measured worse: it lets a triangle stay
 * large as long as its three edges happen to lie on the ground, and the
 * interior then wanders off it. Bounding the size is what bounds the error.
 */
function subdivideTriangles(base, tris, maxEdge, heightAt, maxTriangles) {
  const mids = new Map();
  const midpoint = (a, b) => {
    const key = a < b ? `${a},${b}` : `${b},${a}`;
    let m = mids.get(key);
    if (m === undefined) {
      const p = base[a];
      const q = base[b];
      const x = (p[0] + q[0]) / 2;
      const z = (p[2] + q[2]) / 2;
      m = base.length;
      base.push([x, heightAt(x, z), z]);
      mids.set(key, m);
    }
    return m;
  };
  const edgeLen = (a, b) =>
    Math.hypot(base[a][0] - base[b][0], base[a][2] - base[b][2]);

  let out = tris;
  // Each pass at most halves the longest edge, so this converges quickly; the
  // bound is only there so a pathological ring cannot spin.
  for (let pass = 0; pass < 14; pass++) {
    if (out.length / 3 >= maxTriangles) break;
    const next = [];
    let split = false;
    for (let i = 0; i < out.length; i += 3) {
      const a = out[i];
      const b = out[i + 1];
      const c = out[i + 2];
      const ab = edgeLen(a, b);
      const bc = edgeLen(b, c);
      const ca = edgeLen(c, a);
      const longest = Math.max(ab, bc, ca);
      if (longest <= maxEdge) {
        next.push(a, b, c);
        continue;
      }
      split = true;
      // Bisect the longest edge; the opposite corner joins the new vertex.
      if (ab === longest) {
        const m = midpoint(a, b);
        next.push(a, m, c, m, b, c);
      } else if (bc === longest) {
        const m = midpoint(b, c);
        next.push(b, m, a, m, c, a);
      } else {
        const m = midpoint(c, a);
        next.push(c, m, b, m, a, b);
      }
    }
    out = next;
    if (!split) break;
  }
  return out;
}

function accumulateFaceNormal(pts, normals, a, b, c) {
  const n = faceNormal(pts[a], pts[b], pts[c]);
  for (const i of [a, b, c]) {
    normals[i][0] += n[0];
    normals[i][1] += n[1];
    normals[i][2] += n[2];
  }
}

function faceNormal(p, q, r) {
  const ux = q[0] - p[0], uy = q[1] - p[1], uz = q[2] - p[2];
  const vx = r[0] - p[0], vy = r[1] - p[1], vz = r[2] - p[2];
  const n = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
  return n[1] < 0 ? [-n[0], -n[1], -n[2]] : n; // keep it pointing up
}

function normalize(v) {
  const len = Math.hypot(v[0], v[1], v[2]);
  return len < 1e-12 ? [0, 1, 0] : [v[0] / len, v[1] / len, v[2] / len];
}

/* -------------------------------- extrusion ------------------------------- */

/**
 * Emits outward-facing walls for a normalised polygon between two heights.
 * `baseAt`/`topAt` take (x, z) so walls can follow terrain.
 */
export function extrudeWalls(g, rings, baseAt, topAt, opts = {}) {
  const uvScale = opts.uvScale ?? 4;
  let tris = 0;

  for (const ring of rings) {
    let run = 0;
    for (let i = 0; i < ring.length; i++) {
      const [ax, az] = ring[i];
      const [bx, bz] = ring[(i + 1) % ring.length];
      const dx = bx - ax;
      const dz = bz - az;
      const len = Math.hypot(dx, dz);
      if (len < 1e-6) continue;

      // Outward normal for a CCW outer ring / CW hole ring.
      const nx = -dz / len;
      const nz = dx / len;

      const ay0 = baseAt(ax, az);
      const by0 = baseAt(bx, bz);
      const ay1 = topAt(ax, az);
      const by1 = topAt(bx, bz);
      if (ay1 - ay0 < 1e-4 && by1 - by0 < 1e-4) continue;

      const u0 = run / uvScale;
      const u1 = (run + len) / uvScale;
      const v0 = g.vertex(ax, ay0, az, nx, 0, nz, u0, 0);
      const v1 = g.vertex(bx, by0, bz, nx, 0, nz, u1, 0);
      const v2 = g.vertex(bx, by1, bz, nx, 0, nz, u1, (by1 - by0) / uvScale);
      const v3 = g.vertex(ax, ay1, az, nx, 0, nz, u0, (ay1 - ay0) / uvScale);
      g.quad(v0, v1, v2, v3);
      tris += 2;
      run += len;
    }
  }
  return tris;
}

/* ---------------------------------- roofs --------------------------------- */

const ROOF_ALIASES = {
  flat: 'flat',
  pyramidal: 'pyramidal',
  dome: 'pyramidal',
  onion: 'pyramidal',
  conical: 'pyramidal',
  cone: 'pyramidal',
  round: 'pyramidal',
  tented: 'pyramidal',
  spherical: 'pyramidal',
  gabled: 'gabled',
  gambrel: 'gabled',
  mansard: 'gabled',
  saltbox: 'gabled',
  'double_saltbox': 'gabled',
  hipped: 'hipped',
  'half-hipped': 'hipped',
  skillion: 'skillion',
  'lean_to': 'skillion',
};

export function normalizeRoofShape(shape) {
  return ROOF_ALIASES[String(shape ?? 'flat').toLowerCase()] ?? 'flat';
}

/**
 * Builds a roof sitting on `rings` at height `eaveY`, rising `roofHeight`.
 * Non-flat roofs are built over the footprint's oriented bounding box, which
 * always contains the footprint - the small overhang reads as eaves.
 */
export function buildRoof(g, rings, eaveY, roofHeight, shape, opts = {}) {
  const kind = normalizeRoofShape(shape);
  if (kind === 'flat' || roofHeight <= 0.05) {
    return fillPolygon(g, rings, () => eaveY, { uvScale: opts.uvScale ?? 8 });
  }

  const outer = rings[0];
  const ridgeY = eaveY + roofHeight;

  if (kind === 'pyramidal') {
    const [cx, cz] = centroidXZ(outer);
    let tris = 0;
    for (let i = 0; i < outer.length; i++) {
      const a = outer[i];
      const b = outer[(i + 1) % outer.length];
      tris += addFacet(g, [a[0], eaveY, a[1]], [b[0], eaveY, b[1]], [cx, ridgeY, cz]);
    }
    return tris;
  }

  const obb = orientedBox(outer);
  if (!obb) return fillPolygon(g, rings, () => eaveY, {});

  const { corners, axis } = obb; // corners in order, `axis` = index of long side
  // corners: c0 -> c1 -> c2 -> c3 (CCW). Long edges are c0-c1 and c2-c3 when
  // axis === 0, otherwise c1-c2 and c3-c0.
  const p = axis === 0 ? corners : [corners[1], corners[2], corners[3], corners[0]];
  const [a, b, c, d] = p; // a-b and c-d are the long edges

  const mid = (u, w, t = 0.5) => [u[0] + (w[0] - u[0]) * t, u[1] + (w[1] - u[1]) * t];

  if (kind === 'skillion') {
    // One long edge lifted: a-b stays at the eave, c-d rises.
    let tris = 0;
    tris += addQuadFacet(
      g,
      [a[0], eaveY, a[1]], [b[0], eaveY, b[1]],
      [c[0], ridgeY, c[1]], [d[0], ridgeY, d[1]],
    );
    // Triangular walls closing the two short ends under the slope.
    tris += addFacet(
      g, [b[0], eaveY, b[1]], [b[0], ridgeY, b[1]], [c[0], ridgeY, c[1]], edgeNormal(b, c),
    );
    tris += addFacet(
      g, [d[0], ridgeY, d[1]], [a[0], ridgeY, a[1]], [a[0], eaveY, a[1]], edgeNormal(d, a),
    );
    return tris;
  }

  // Ridge runs down the middle, parallel to the long edges.
  const inset = kind === 'hipped' ? 0.25 : 0;
  const r0 = mid(mid(a, d), mid(b, c), inset);        // near end of the ridge
  const r1 = mid(mid(a, d), mid(b, c), 1 - inset);    // far end

  let tris = 0;
  // Two long slopes.
  tris += addQuadFacet(g, [a[0], eaveY, a[1]], [b[0], eaveY, b[1]], [r1[0], ridgeY, r1[1]], [r0[0], ridgeY, r0[1]]);
  tris += addQuadFacet(g, [c[0], eaveY, c[1]], [d[0], eaveY, d[1]], [r0[0], ridgeY, r0[1]], [r1[0], ridgeY, r1[1]]);
  // Ends: vertical gable walls when inset === 0, sloped hip faces otherwise.
  const endRef = (p0, p1) => (inset > 0 ? UP : edgeNormal(p0, p1));
  tris += addFacet(g, [d[0], eaveY, d[1]], [a[0], eaveY, a[1]], [r0[0], ridgeY, r0[1]], endRef(d, a));
  tris += addFacet(g, [b[0], eaveY, b[1]], [c[0], eaveY, c[1]], [r1[0], ridgeY, r1[1]], endRef(b, c));
  return tris;
}

/**
 * Adds one flat-shaded triangle. `ref` is the direction the face should point;
 * the winding is flipped to match it, so callers never have to reason about
 * vertex order. Defaults to "up", which is what every roof surface wants.
 */
function addFacet(g, p, q, r, ref = UP) {
  let n = normalize(rawNormal(p, q, r));
  let [b, c] = [q, r];
  if (n[0] * ref[0] + n[1] * ref[1] + n[2] * ref[2] < 0) {
    [b, c] = [r, q];
    n = [-n[0], -n[1], -n[2]];
  }
  const ia = g.vertex(p[0], p[1], p[2], n[0], n[1], n[2], p[0] / 8, p[2] / 8);
  const ib = g.vertex(b[0], b[1], b[2], n[0], n[1], n[2], b[0] / 8, b[2] / 8);
  const ic = g.vertex(c[0], c[1], c[2], n[0], n[1], n[2], c[0] / 8, c[2] / 8);
  g.tri(ia, ib, ic);
  return 1;
}

/** Planar quad p-q-r-s, split into two facets sharing the same reference. */
function addQuadFacet(g, p, q, r, s, ref = UP) {
  return addFacet(g, p, q, r, ref) + addFacet(g, p, r, s, ref);
}

const UP = [0, 1, 0];
const DOWN = [0, -1, 0];

function rawNormal(p, q, r) {
  const ux = q[0] - p[0], uy = q[1] - p[1], uz = q[2] - p[2];
  const vx = r[0] - p[0], vy = r[1] - p[1], vz = r[2] - p[2];
  return [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
}

/** Outward horizontal normal of edge a->b for a CCW (in u/v) ring. */
function edgeNormal(a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const len = Math.hypot(dx, dz);
  return len < 1e-9 ? [1, 0, 0] : [-dz / len, 0, dx / len];
}

/**
 * Minimum-area oriented bounding box via rotating calipers over the convex
 * hull. Returns four corners in CCW order plus which side pair is longer.
 */
export function orientedBox(ring) {
  const hull = convexHull(ring);
  if (hull.length < 3) return null;

  let best = null;
  for (let i = 0; i < hull.length; i++) {
    const a = hull[i];
    const b = hull[(i + 1) % hull.length];
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const len = Math.hypot(dx, dz);
    if (len < 1e-9) continue;
    const ex = dx / len;
    const ez = dz / len;
    // Perpendicular in the (x, -z) sense.
    const fx = ez;
    const fz = -ex;

    let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;
    for (const [px, pz] of hull) {
      const u = (px - a[0]) * ex + (pz - a[1]) * ez;
      const v = (px - a[0]) * fx + (pz - a[1]) * fz;
      minU = Math.min(minU, u); maxU = Math.max(maxU, u);
      minV = Math.min(minV, v); maxV = Math.max(maxV, v);
    }
    const area = (maxU - minU) * (maxV - minV);
    if (!best || area < best.area) {
      best = { area, a, ex, ez, fx, fz, minU, maxU, minV, maxV };
    }
  }
  if (!best) return null;

  const { a, ex, ez, fx, fz, minU, maxU, minV, maxV } = best;
  const at = (u, v) => [a[0] + ex * u + fx * v, a[1] + ez * u + fz * v];
  let corners = [at(minU, minV), at(maxU, minV), at(maxU, maxV), at(minU, maxV)];
  if (ringAreaXZ(corners) < 0) corners = corners.slice().reverse();

  const side01 = Math.hypot(corners[1][0] - corners[0][0], corners[1][1] - corners[0][1]);
  const side12 = Math.hypot(corners[2][0] - corners[1][0], corners[2][1] - corners[1][1]);
  return { corners, axis: side01 >= side12 ? 0 : 1, width: Math.min(side01, side12), length: Math.max(side01, side12) };
}

/** Andrew's monotone chain. Input/output are [x, z] pairs. */
export function convexHull(points) {
  const pts = points.slice().sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  if (pts.length < 3) return pts;
  const cross = (o, a, b) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);

  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/* -------------------------------- ribbons --------------------------------- */

/**
 * Emits a flat ribbon (road, path, railway, stream) along a polyline.
 * Joins are mitered, with the miter length clamped so hairpins don't explode.
 * @param {Array<[number, number]>} line [x, z] points
 */
export function ribbon(g, line, width, heightAt, opts = {}) {
  // A straight run between two corners is a single quad, and a quad is flat:
  // a 90m stretch of road hops any rise in between. Break long runs up first
  // so each piece can sit on the ground it covers.
  const pts = densify(cleanRing(line), opts.maxSegment ?? 0);
  if (pts.length < 2) return 0;

  const hw = Math.max(width, 0.2) / 2;
  const uvScale = opts.uvScale ?? width;
  const maxMiter = opts.maxMiter ?? 3;

  // Per-vertex left offset direction in (u, v) space.
  const offsets = [];
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[i - 1];
    const next = pts[i + 1];
    const dIn = prev ? unit2(pts[i][0] - prev[0], -(pts[i][1] - prev[1])) : null;
    const dOut = next ? unit2(next[0] - pts[i][0], -(next[1] - pts[i][1])) : null;

    if (!dIn) offsets.push(leftOf(dOut));
    else if (!dOut) offsets.push(leftOf(dIn));
    else {
      const nIn = leftOf(dIn);
      const nOut = leftOf(dOut);
      let mx = nIn[0] + nOut[0];
      let mv = nIn[1] + nOut[1];
      const len = Math.hypot(mx, mv);
      if (len < 1e-6) {
        offsets.push(nOut); // 180 degree turn; just use the outgoing normal
      } else {
        mx /= len;
        mv /= len;
        const scale = Math.min(1 / Math.max(mx * nIn[0] + mv * nIn[1], 1e-3), maxMiter);
        offsets.push([mx * scale, mv * scale]);
      }
    }
  }

  // A carriageway is wide enough to cross a fold in the ground sideways, so a
  // single quad across the width chords over it just as a long one does along.
  const lanes = opts.maxSegment > 0
    ? Math.max(1, Math.ceil((hw * 2) / opts.maxSegment))
    : 1;

  let run = 0;
  let tris = 0;
  /** Points across the carriageway at station `i`, left to right. */
  const section = (i) => {
    const [x, z] = pts[i];
    const [ou, ov] = offsets[i];
    const out = [];
    for (let k = 0; k <= lanes; k++) {
      // (u, v) -> (x, z): u = x, v = -z
      const t = hw - (2 * hw * k) / lanes;
      const px = x + ou * t;
      const pz = z - ov * t;
      out.push([px, heightAt(px, pz), pz]);
    }
    return out;
  };

  const emit = (pt, k, v) =>
    g.vertex(pt[0], pt[1], pt[2], 0, 1, 0, k / lanes, v);

  let prevIdx = section(0).map((pt, k) => emit(pt, k, 0));

  for (let i = 1; i < pts.length; i++) {
    const cur = section(i);
    run += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    const v = run / uvScale;
    const curIdx = cur.map((pt, k) => emit(pt, k, v));
    for (let k = 0; k < lanes; k++) {
      // L(i-1) -> R(i-1) -> R(i) -> L(i) is CCW seen from above.
      g.quad(prevIdx[k], prevIdx[k + 1], curIdx[k + 1], curIdx[k]);
      tris += 2;
    }
    prevIdx = curIdx;
  }
  return tris;
}

/** Inserts points along any span longer than `maxSegment`, keeping the corners. */
export function densify(pts, maxSegment) {
  if (!(maxSegment > 0) || pts.length < 2) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, z0] = pts[i - 1];
    const [x1, z1] = pts[i];
    const steps = Math.ceil(Math.hypot(x1 - x0, z1 - z0) / maxSegment);
    for (let k = 1; k < steps; k++) {
      out.push([x0 + ((x1 - x0) * k) / steps, z0 + ((z1 - z0) * k) / steps]);
    }
    out.push(pts[i]);
  }
  return out;
}

function unit2(u, v) {
  const len = Math.hypot(u, v);
  return len < 1e-9 ? [1, 0] : [u / len, v / len];
}

function leftOf([u, v]) {
  return [-v, u];
}

/** A flat n-gon used to plug the gaps where road ribbons meet. */
export function disc(g, cx, cz, radius, heightAt, segments = 8) {
  const ring = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    ring.push([cx + radius * Math.cos(t), cz - radius * Math.sin(t)]);
  }
  return fillPolygon(g, [ring], heightAt, { uvScale: Math.max(radius, 1) * 2 });
}

/* --------------------------------- terrain -------------------------------- */

/**
 * A regular grid covering [-half, half] in X and Z.
 * `groupFor(x, z)` picks the MeshGroup per cell, which is how land cover tints
 * the ground; vertices are cached per group, so a material boundary duplicates
 * vertices there and stays a hard edge.
 * @param {(x: number, z: number) => import('./mesh.js').MeshGroup} groupFor
 * @param {(x: number, z: number) => number} heightAt
 * @param {{keep?: (x: number, z: number) => boolean, uvScale?: number}} [opts]
 */
export function grid(groupFor, half, cells, heightAt, opts = {}) {
  const step = (half * 2) / cells;
  const uvScale = opts.uvScale ?? half / 4;
  const keep = opts.keep;
  const caches = new Map();

  const vertexAt = (group, i, j) => {
    let cache = caches.get(group);
    if (!cache) {
      cache = new Map();
      caches.set(group, cache);
    }
    const k = i * (cells + 1) + j;
    const existing = cache.get(k);
    if (existing !== undefined) return existing;

    const x = -half + i * step;
    const z = -half + j * step;
    // Central differences give smooth normals across the height field.
    const hx = heightAt(x + step, z) - heightAt(x - step, z);
    const hz = heightAt(x, z + step) - heightAt(x, z - step);
    const n = normalize([-hx, 2 * step, -hz]);
    const v = group.vertex(x, heightAt(x, z), z, n[0], n[1], n[2], x / uvScale, z / uvScale);
    cache.set(k, v);
    return v;
  };

  let tris = 0;
  for (let i = 0; i < cells; i++) {
    for (let j = 0; j < cells; j++) {
      const cx = -half + (i + 0.5) * step;
      const cz = -half + (j + 0.5) * step;
      if (keep && !keep(cx, cz)) continue;
      const group = groupFor(cx, cz);
      if (!group) continue;
      const a = vertexAt(group, i, j);
      const b = vertexAt(group, i, j + 1);
      const c = vertexAt(group, i + 1, j + 1);
      const d = vertexAt(group, i + 1, j);
      // With +Z south, a->b->c->d is counter-clockwise seen from above.
      group.quad(a, b, c, d);
      tris += 2;
    }
  }
  return tris;
}

/**
 * The height of the surface `grid()` actually draws.
 *
 * Everything that lies on the ground - roads, paths, water, tree trunks - used
 * to ask the terrain function directly. That function is a smooth bilinear
 * field, while the ground you see is a coarse triangulation of it, and between
 * grid corners the two disagree by however much the terrain curves across a
 * cell. On rolling ground that is decimetres, and it shows: a road either
 * hovers over a rise or the rise erupts through it, which looks like the road
 * has a hole in it.
 *
 * So sample the mesh instead of the field. Corner heights come from the same
 * `heightAt`, and inside a cell this interpolates over the same two triangles
 * `grid()` emits, which makes it exact rather than merely closer.
 *
 * @param {number} half same half-width passed to grid()
 * @param {number} cells same cell count passed to grid()
 * @param {(x: number, z: number) => number} heightAt
 * @returns {(x: number, z: number) => number}
 */
export function gridSurface(half, cells, heightAt) {
  const step = (half * 2) / cells;
  const n = cells + 1;
  const h = new Float64Array(n * n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      h[i * n + j] = heightAt(-half + i * step, -half + j * step);
    }
  }

  return (x, z) => {
    const fi = (x + half) / step;
    const fj = (z + half) / step;
    const i = clampInt(Math.floor(fi), 0, cells - 1);
    const j = clampInt(Math.floor(fj), 0, cells - 1);
    // Outside the ground, hold the edge cell's plane rather than extrapolating.
    const u = clamp01(fi - i);
    const v = clamp01(fj - j);
    const h00 = h[i * n + j];
    const h01 = h[i * n + j + 1];
    const h11 = h[(i + 1) * n + j + 1];
    const h10 = h[(i + 1) * n + j];
    // grid() emits quad(a=(i,j), b=(i,j+1), c=(i+1,j+1), d=(i+1,j)) and quad()
    // splits it as (a,b,c) + (a,c,d), so the diagonal runs (i,j)->(i+1,j+1).
    return u <= v
      ? h00 + (h01 - h00) * v + (h11 - h01) * u
      : h00 + (h10 - h00) * u + (h11 - h10) * v;
  };
}

function clampInt(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/* ---------------------------------- props --------------------------------- */

/**
 * A cheap low-poly tree: tapered trunk plus a canopy.
 * `kind` is 'conifer' (narrow stacked cones) or 'broadleaf' (a rounder, wider
 * crown). Roughly 25-30 triangles either way, which is the budget that lets a
 * map carry several thousand of them.
 */
export function tree(builder, x, z, groundY, height, radius, seed = 0, kind = 'conifer') {
  const broadleaf = kind === 'broadleaf';
  const trunkH = height * (broadleaf ? 0.42 : 0.32);
  // Real trunks are slender against their crown; at eye level anything
  // thicker reads as a telegraph pole.
  const trunkR = Math.max(0.07, radius * (broadleaf ? 0.06 : 0.075));
  const sides = 5;
  const rot = ((seed % 10) / 10) * Math.PI;

  const trunk = builder.group('trunk');
  trunk.needsUvs = false;
  const ringAt = (r, y) => {
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const t = rot + (i / sides) * Math.PI * 2;
      // Clockwise in (x, z) is counter-clockwise in (u, v), which is what the
      // outward-facing wall rule expects.
      pts.push([x + r * Math.cos(t), y, z - r * Math.sin(t)]);
    }
    return pts;
  };

  const low = ringAt(trunkR, groundY - 0.2);
  const high = ringAt(trunkR * 0.75, groundY + trunkH);
  let tris = 0;
  for (let i = 0; i < sides; i++) {
    const j = (i + 1) % sides;
    tris += addQuadFacet(trunk, low[i], low[j], high[j], high[i], radialRef([x, z], low[i], low[j]));
  }

  const canopy = builder.group('tree');
  canopy.needsUvs = false;

  if (broadleaf) {
    // A squat bicone: widest around half way up, closed top and bottom. Any
    // lower and the crown reads as a spike rather than a deciduous canopy.
    const waistY = groundY + trunkH + (height - trunkH) * 0.45;
    const waist = ringAt(radius, waistY);
    const apex = [x, groundY + height, z];
    const base = [x, groundY + trunkH * 0.85, z];
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      tris += addFacet(canopy, waist[i], waist[j], apex);
      tris += addFacet(canopy, waist[j], waist[i], base, DOWN);
    }
    return tris;
  }

  const tiers = 2;
  for (let t = 0; t < tiers; t++) {
    const baseY = groundY + trunkH + (height - trunkH) * (t * 0.4);
    const topY = groundY + trunkH + (height - trunkH) * (0.65 + t * 0.35);
    const base = ringAt(radius * (1 - t * 0.35), baseY);
    const apex = [x, topY, z];
    for (let i = 0; i < sides; i++) {
      const j = (i + 1) % sides;
      tris += addFacet(canopy, base[i], base[j], apex);
    }
    // Close the underside so the crown is solid seen from below.
    for (let i = 1; i < sides - 1; i++) {
      tris += addFacet(canopy, base[0], base[i + 1], base[i], DOWN);
    }
  }
  return tris;
}

/** Outward horizontal direction from `centre` to the midpoint of edge a-b. */
function radialRef(centre, a, b) {
  const mx = (a[0] + b[0]) / 2 - centre[0];
  const mz = (a[2] + b[2]) / 2 - centre[1];
  const len = Math.hypot(mx, mz);
  return len < 1e-9 ? [1, 0, 0] : [mx / len, 0, mz / len];
}

export { addFacet, addQuadFacet, UP, DOWN };
