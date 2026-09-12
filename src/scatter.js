// Scattering props (today: trees) across the map.
//
// Two problems to solve. Where do trees belong, and where must they not go.
//
// "Where" comes from canopy cover: OSM wood/forest/scrub polygons when they
// exist, land cover otherwise. "Must not" is everything a tree would clip
// through - buildings, road surfaces, water - which we rasterise once into a
// bitmask so each candidate is an array read instead of a polygon test against
// every feature on the map.

/**
 * A coarse boolean raster over the map square. Roughly 2m cells, so a
 * half-mile map is under a megabyte.
 */
export class OccupancyMask {
  constructor(half, cellSize = 2) {
    this.half = half;
    this.cell = cellSize;
    this.size = Math.ceil((half * 2) / cellSize) + 1;
    this.bits = new Uint8Array(this.size * this.size);
  }

  index(x, z) {
    const i = Math.round((x + this.half) / this.cell);
    const j = Math.round((z + this.half) / this.cell);
    if (i < 0 || j < 0 || i >= this.size || j >= this.size) return -1;
    return j * this.size + i;
  }

  get(x, z) {
    const k = this.index(x, z);
    return k < 0 ? false : this.bits[k] !== 0;
  }

  mark(x, z, value = 1) {
    const k = this.index(x, z);
    if (k >= 0) this.bits[k] = value;
  }

  valueAt(x, z) {
    const k = this.index(x, z);
    return k < 0 ? 0 : this.bits[k];
  }

  /** Marks a filled disc. Used to stamp road width along a centreline. */
  markDisc(cx, cz, radius, value = 1) {
    const r = Math.max(radius, this.cell / 2);
    for (let dx = -r; dx <= r; dx += this.cell) {
      for (let dz = -r; dz <= r; dz += this.cell) {
        if (dx * dx + dz * dz <= r * r) this.mark(cx + dx, cz + dz, value);
      }
    }
  }

  /** Marks a polyline swept by a disc of `width`. */
  markLine(line, width, value = 1) {
    const r = width / 2;
    for (let i = 0; i < line.length - 1; i++) {
      const [ax, az] = line[i];
      const [bx, bz] = line[i + 1];
      const len = Math.hypot(bx - ax, bz - az);
      const steps = Math.max(1, Math.ceil(len / this.cell));
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        this.markDisc(ax + (bx - ax) * t, az + (bz - az) * t, r, value);
      }
    }
  }

  /** Marks the interior of a polygon, plus an optional margin around it. */
  markPolygon(rings, margin = 0, value = 1) {
    const outer = rings[0];
    if (!outer?.length) return;
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    for (const [x, z] of outer) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    for (let x = minX - margin; x <= maxX + margin; x += this.cell) {
      for (let z = minZ - margin; z <= maxZ + margin; z += this.cell) {
        if (pointInRings(x, z, rings, margin)) this.mark(x, z, value);
      }
    }
  }

  /** True if anything is marked within `radius` of the point. */
  blocked(x, z, radius = 0) {
    if (radius <= 0) return this.get(x, z);
    for (let dx = -radius; dx <= radius; dx += this.cell) {
      for (let dz = -radius; dz <= radius; dz += this.cell) {
        if (dx * dx + dz * dz <= radius * radius && this.get(x + dx, z + dz)) return true;
      }
    }
    return false;
  }
}

/** Point in polygon with holes; `margin` grows the outer ring's test box. */
function pointInRings(x, z, rings, margin = 0) {
  if (!pointInRing(x, z, rings[0], margin)) return false;
  for (let i = 1; i < rings.length; i++) {
    if (pointInRing(x, z, rings[i], -margin)) return false;
  }
  return true;
}

export function pointInRing(x, z, ring, margin = 0) {
  if (margin === 0) return rayCast(x, z, ring);
  // Cheap dilation: a point within `margin` of the ring counts as inside.
  if (rayCast(x, z, ring)) return true;
  return distanceToRing(x, z, ring) <= margin;
}

function rayCast(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i];
    const [xj, zj] = ring[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

function distanceToRing(x, z, ring) {
  let best = Infinity;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    best = Math.min(best, distanceToSegment(x, z, ring[j], ring[i]));
  }
  return best;
}

function distanceToSegment(x, z, a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const lenSq = dx * dx + dz * dz;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq));
  return Math.hypot(x - (a[0] + t * dx), z - (a[1] + t * dz));
}

/* -------------------------------- scatter --------------------------------- */

/**
 * Jittered-grid scatter. Deterministic: the same map always produces the same
 * trees in the same places, so rebuilds don't reshuffle the world.
 *
 * @param {object} o
 * @param {number} o.half           map half-extent, metres
 * @param {number} o.spacing        mean distance between candidates
 * @param {(x, z) => number} o.canopyAt   0..1 probability that a spot is wooded
 * @param {(x, z) => boolean} o.accept    boundary / occupancy test
 * @param {number} o.max            hard cap
 * @param {number} [o.seed]
 * @returns {Array<{x: number, z: number, r: number}>} r is a 0..1 variation roll
 */
export function scatter({ half, spacing, canopyAt, accept, max, seed = 1 }) {
  const out = [];
  const cells = Math.ceil((half * 2) / spacing);

  for (let i = 0; i < cells && out.length < max; i++) {
    for (let j = 0; j < cells && out.length < max; j++) {
      const h = hash2(i, j, seed);
      // Jitter within the cell so the grid never shows through.
      const x = -half + (i + 0.15 + 0.7 * frac(h)) * spacing;
      const z = -half + (j + 0.15 + 0.7 * frac(h * 7.13)) * spacing;

      const density = canopyAt(x, z);
      if (density <= 0) continue;
      if (frac(h * 3.71) > density) continue;
      if (!accept(x, z)) continue;

      out.push({ x, z, r: frac(h * 11.37) });
    }
  }
  return out;
}

/** Deterministic hash of two integers plus a seed. */
export function hash2(i, j, seed) {
  let h = (i * 73856093) ^ (j * 19349663) ^ (seed * 83492791);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

function frac(n) {
  const x = Math.sin(n * 0.0001) * 43758.5453;
  return x - Math.floor(x);
}
