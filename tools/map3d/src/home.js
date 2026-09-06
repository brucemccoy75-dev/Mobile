// Where the player starts.
//
// A geocoder's pin is an estimate along the road, often a hundred metres from
// the actual house and sometimes in the trees. The map knows every building,
// so the start is the house whose address matches, or failing that the nearest
// house to the pin, and the spawn point is its doorstep: just outside the wall
// that faces the street, looking away from the door.

export const HOME_TYPES =
  /^(house|detached|semidetached_house|terrace|bungalow|residential|apartments|cabin|static_caravan|farm|cottage|yes)$/;

const ABBREVIATIONS = {
  rd: 'road', st: 'street', ave: 'avenue', av: 'avenue', dr: 'drive', ln: 'lane',
  ct: 'court', cir: 'circle', blvd: 'boulevard', pl: 'place', hwy: 'highway',
  ter: 'terrace', pkwy: 'parkway', sq: 'square', trl: 'trail', way: 'way',
  n: 'north', s: 'south', e: 'east', w: 'west', rte: 'route',
};

/** "Flintlock Farm Rd." and "flintlock farm road" compare equal. */
export function normalizeStreet(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[.,'"]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => ABBREVIATIONS[w] ?? w)
    .join(' ');
}

/**
 * @param {Array} buildings   manifest.buildings
 * @param {{housenumber?: string, street?: string}} target  from the geocoder
 * @returns {{building: object, reason: 'address'|'nearest'} | null}
 */
export function pickHome(buildings, target = {}, opts = {}) {
  const maxDistance = opts.maxDistance ?? 150;
  const minArea = opts.minArea ?? 45;
  const usable = (buildings ?? []).filter(
    (b) => !b.renderedAsParts && !b.isPart && HOME_TYPES.test(b.type ?? '') &&
      (b.footprintM2 ?? 0) >= minArea && b.centre && Array.isArray(b.outline),
  );

  if (target.housenumber && target.street) {
    const street = normalizeStreet(target.street);
    const number = String(target.housenumber).toLowerCase();
    const hit = usable.find((b) => {
      const m = /^(\S+)\s+(.+)$/.exec(b.address ?? '');
      return m && m[1].toLowerCase() === number && normalizeStreet(m[2]) === street;
    });
    if (hit) return { building: hit, reason: 'address' };
  }

  let best = null;
  let bestD = maxDistance;
  for (const b of usable) {
    const d = Math.hypot(b.centre.x, b.centre.z);
    if (d < bestD) {
      bestD = d;
      best = b;
    }
  }
  return best ? { building: best, reason: 'nearest' } : null;
}

/**
 * A point just outside the front wall. The front is the wall nearest the
 * road, or the longest wall when no road is close - the same rule the mesh
 * uses to place the door, so the player starts where the door is.
 * @param {number[][]} outline  [x, z] ring
 * @param {number[]} [roadPoint]  [x, z]
 * @returns {{x: number, z: number, yaw: number, facing: number[]}}
 */
export function doorstep(outline, roadPoint, offset = 2.5) {
  let front = null;
  let bestScore = Infinity;
  for (let i = 0; i < outline.length; i++) {
    const a = outline[i];
    const b = outline[(i + 1) % outline.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1.5) continue;
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const score = roadPoint ? Math.hypot(mid[0] - roadPoint[0], mid[1] - roadPoint[1]) : -len;
    if (score < bestScore) {
      bestScore = score;
      front = { a, b, mid, len };
    }
  }

  if (!front) {
    const c = centroid(outline);
    return { x: c[0], z: c[1], yaw: 0, facing: [0, -1] };
  }

  const dx = (front.b[0] - front.a[0]) / front.len;
  const dz = (front.b[1] - front.a[1]) / front.len;
  let nx = dz;
  let nz = -dx;
  // Pick whichever perpendicular leads out of the building.
  if (pointInRing(front.mid[0] + nx, front.mid[1] + nz, outline)) {
    nx = -nx;
    nz = -nz;
  }
  // Heading in degrees, 0 = north (-Z), 90 = east (+X).
  const yaw = (Math.atan2(nx, -nz) * 180) / Math.PI;
  return {
    x: front.mid[0] + nx * offset,
    z: front.mid[1] + nz * offset,
    yaw: (yaw + 360) % 360,
    facing: [nx, nz],
  };
}

function centroid(ring) {
  let x = 0, z = 0, n = 0;
  for (const [px, pz] of ring) { x += px; z += pz; n++; }
  return n ? [x / n, z / n] : [0, 0];
}

function pointInRing(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i];
    const [xj, zj] = ring[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}
