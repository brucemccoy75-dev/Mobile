// Geographic -> local game-space projection.
//
// We use a local tangent plane ("ENU") centred on the address. Over a half-mile
// radius the error versus a proper geodesic projection is a few millimetres, so
// a flat plane is exactly what a game engine wants.
//
// Axis convention matches glTF / three.js / Unity / Godot:
//   +X = east, +Y = up, -Z = north  (right-handed, Y-up)

const EARTH_RADIUS = 6378137; // WGS84 semi-major axis, metres
const DEG = Math.PI / 180;

export class Projector {
  /** @param {number} lat @param {number} lon */
  constructor(lat, lon) {
    this.lat0 = lat;
    this.lon0 = lon;
    this.metersPerDegLat = EARTH_RADIUS * DEG;
    this.metersPerDegLon = EARTH_RADIUS * DEG * Math.cos(lat * DEG);
  }

  /** lat/lon -> [x, z] in metres, relative to the origin address. */
  toLocal(lat, lon) {
    return [
      (lon - this.lon0) * this.metersPerDegLon,
      -(lat - this.lat0) * this.metersPerDegLat, // north is -Z
    ];
  }

  /** [x, z] in metres -> { lat, lon }. Handy for round-tripping game coords. */
  toGeo(x, z) {
    return {
      lat: this.lat0 - z / this.metersPerDegLat,
      lon: this.lon0 + x / this.metersPerDegLon,
    };
  }

  /** Bounding box (in degrees) of a square that contains a radius-metre disc. */
  bbox(radiusMeters) {
    const dLat = radiusMeters / this.metersPerDegLat;
    const dLon = radiusMeters / this.metersPerDegLon;
    return {
      south: this.lat0 - dLat,
      west: this.lon0 - dLon,
      north: this.lat0 + dLat,
      east: this.lon0 + dLon,
    };
  }
}

/** Great-circle distance in metres (haversine). */
export function haversine(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * DEG;
  const dLon = (lon2 - lon1) * DEG;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG) * Math.cos(lat2 * DEG) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

/* ------------------------- slippy-map tile helpers ------------------------ */

export function lonToTileX(lon, z) {
  return ((lon + 180) / 360) * 2 ** z;
}

export function latToTileY(lat, z) {
  const r = lat * DEG;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z;
}

export function tileXToLon(x, z) {
  return (x / 2 ** z) * 360 - 180;
}

export function tileYToLat(y, z) {
  const n = Math.PI - 2 * Math.PI * (y / 2 ** z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

/** Ground resolution (metres per pixel) of a 256px tile at zoom z. */
export function metersPerPixel(lat, z) {
  return (156543.03392804097 * Math.cos(lat * DEG)) / 2 ** z;
}
