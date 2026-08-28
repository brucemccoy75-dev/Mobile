// Clipping features to the map boundary.
//
// The boundary is always convex (a square, or a regular n-gon standing in for
// the circle), which lets us use Sutherland-Hodgman for areas and a simple
// parametric clip for lines. Points in [x, z] game space.

/** Square boundary of side 2 * half, centred on the origin. */
export function squareBoundary(half) {
  // Listed counter-clockwise in (u, v) = (x, -z).
  return [
    [-half, half],
    [half, half],
    [half, -half],
    [-half, -half],
  ];
}

/** Regular n-gon approximating a circle of `radius`, centred on the origin. */
export function circleBoundary(radius, segments = 64) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    pts.push([radius * Math.cos(t), -radius * Math.sin(t)]);
  }
  return pts;
}

/**
 * Half-plane tests for a convex boundary listed CCW in (u, v) = (x, -z).
 * Returns edges as {a, b, inside(p)} where inside means "on the kept side".
 */
function boundaryEdges(boundary) {
  const edges = [];
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    const dx = b[0] - a[0];
    const dv = -b[1] + a[1]; // in (u, v)
    edges.push({
      a,
      b,
      // Positive when p is to the left of a->b, i.e. inside a CCW polygon.
      side: (p) => dx * (-p[1] + a[1]) - dv * (p[0] - a[0]),
    });
  }
  return edges;
}

function intersect(p, q, edge) {
  const sp = edge.side(p);
  const sq = edge.side(q);
  const t = sp / (sp - sq);
  return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
}

/** Sutherland-Hodgman. Returns the clipped ring, possibly empty. */
export function clipRing(ring, boundary) {
  let out = ring;
  for (const edge of boundaryEdges(boundary)) {
    if (out.length === 0) return [];
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      const curIn = edge.side(cur) >= 0;
      const prevIn = edge.side(prev) >= 0;
      if (curIn) {
        if (!prevIn) out.push(intersect(prev, cur, edge));
        out.push(cur);
      } else if (prevIn) {
        out.push(intersect(prev, cur, edge));
      }
    }
  }
  return out;
}

/**
 * Clips a polygon (outer ring + holes). Holes that survive are kept; a fully
 * clipped-away outer ring drops the whole polygon.
 */
export function clipPolygon(rings, boundary) {
  const outer = clipRing(rings[0], boundary);
  if (outer.length < 3) return null;
  const holes = [];
  for (const hole of rings.slice(1)) {
    const clipped = clipRing(hole, boundary);
    if (clipped.length >= 3) holes.push(clipped);
  }
  return [outer, ...holes];
}

/**
 * Clips a polyline, returning zero or more surviving pieces.
 * @param {Array<[number, number]>} line
 */
export function clipLine(line, boundary) {
  const edges = boundaryEdges(boundary);
  const inside = (p) => edges.every((e) => e.side(p) >= 0);

  const pieces = [];
  let current = [];

  const push = (p) => {
    const last = current[current.length - 1];
    if (!last || Math.abs(last[0] - p[0]) > 1e-7 || Math.abs(last[1] - p[1]) > 1e-7) {
      current.push(p);
    }
  };
  const flush = () => {
    if (current.length >= 2) pieces.push(current);
    current = [];
  };

  for (let i = 0; i < line.length - 1; i++) {
    const seg = clipSegment(line[i], line[i + 1], edges);
    if (!seg) {
      flush();
      continue;
    }
    const [p, q] = seg;
    // A gap opens whenever the clipped start is not where we left off.
    const last = current[current.length - 1];
    if (last && (Math.abs(last[0] - p[0]) > 1e-6 || Math.abs(last[1] - p[1]) > 1e-6)) {
      flush();
    }
    push(p);
    push(q);
  }
  flush();

  // Drop degenerate slivers left behind by tangential segments.
  return pieces.filter((piece) => piece.length >= 2 && piece.some(inside));
}

/** Parametric segment clip against a convex region. */
function clipSegment(p, q, edges) {
  let t0 = 0;
  let t1 = 1;
  for (const edge of edges) {
    const sp = edge.side(p);
    const sq = edge.side(q);
    if (sp < 0 && sq < 0) return null;
    if (sp >= 0 && sq >= 0) continue;
    const t = sp / (sp - sq);
    if (sp < 0) t0 = Math.max(t0, t);
    else t1 = Math.min(t1, t);
    if (t0 > t1) return null;
  }
  const at = (t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  return [at(t0), at(t1)];
}

/** True when every vertex sits inside the boundary. */
export function fullyInside(points, boundary) {
  const edges = boundaryEdges(boundary);
  return points.every((p) => edges.every((e) => e.side(p) >= 0));
}
