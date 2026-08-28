// Land cover: what the ground actually is, where OpenStreetMap doesn't say.
//
// OSM land-use polygons are excellent in cities and often absent in the
// countryside - a New Hampshire township can have 60 roads mapped and not one
// `natural=wood`, even though the whole place is forest. Without that, a rural
// map comes out as a grey plane and there is nothing to walk through.
//
// NLCD (USGS National Land Cover Database, 30m, CONUS + AK/HI) fills the gap.
// One WMS request returns a paletted PNG covering the map square, which we
// decode and match to the standard NLCD legend by nearest colour - resampling
// on the server shifts the palette slightly, so exact matching is too brittle.
//
// Coverage is the United States only. Elsewhere this returns null and the map
// falls back to OSM polygons alone.

import { NLCD_ENDPOINT } from './config.js';
import { requestBuffer, cacheKey, readCache, writeCache } from './net.js';
import { decodePng } from './png.js';

/**
 * NLCD legend. `canopy` is the fraction of ground we treat as tree-covered,
 * used to decide how thickly to scatter; `material` picks the ground colour.
 */
export const NLCD_CLASSES = [
  { code: 11, name: 'open water',        rgb: [70, 107, 159],  material: 'water',             canopy: 0 },
  { code: 12, name: 'ice/snow',          rgb: [209, 222, 248], material: 'ground',            canopy: 0 },
  { code: 21, name: 'developed open',    rgb: [222, 197, 197], material: 'grass',             canopy: 0.08 },
  { code: 22, name: 'developed low',     rgb: [217, 146, 130], material: 'grass',             canopy: 0.15 },
  { code: 23, name: 'developed medium',  rgb: [235, 0, 0],     material: 'urban_ground',      canopy: 0.08 },
  { code: 24, name: 'developed high',    rgb: [171, 0, 0],     material: 'urban_ground',      canopy: 0.02 },
  { code: 31, name: 'barren',            rgb: [179, 172, 159], material: 'sand',              canopy: 0 },
  { code: 41, name: 'deciduous forest',  rgb: [104, 171, 95],  material: 'forest',            canopy: 1 },
  { code: 42, name: 'evergreen forest',  rgb: [28, 95, 44],    material: 'forest',            canopy: 1 },
  { code: 43, name: 'mixed forest',      rgb: [181, 197, 143], material: 'forest',            canopy: 1 },
  { code: 52, name: 'shrub/scrub',       rgb: [204, 184, 121], material: 'scrub',             canopy: 0.25 },
  { code: 71, name: 'grassland',         rgb: [223, 223, 194], material: 'grass',             canopy: 0.03 },
  { code: 81, name: 'pasture/hay',       rgb: [220, 217, 57],  material: 'farmland',          canopy: 0.02 },
  { code: 82, name: 'cultivated crops',  rgb: [171, 108, 40],  material: 'farmland',          canopy: 0 },
  { code: 90, name: 'woody wetland',     rgb: [184, 217, 235], material: 'forest',            canopy: 0.75 },
  { code: 95, name: 'herbaceous wetland', rgb: [108, 159, 184], material: 'grass',            canopy: 0.05 },
];

const UNKNOWN = { code: 0, name: 'unknown', material: 'ground', canopy: 0 };

/**
 * How far a pixel may sit from a legend colour and still be matched.
 * Server-side resampling shifts colours by about 4 units in practice. The cap
 * must stay below half the smallest gap between two legend entries - ice/snow
 * and woody wetland are only 29 apart - or a pixel could fall inside the
 * tolerance of two classes at once and the match would depend on table order.
 */
export const MATCH_TOLERANCE = 12;

/**
 * Fetches a land-cover raster over the map square.
 * @param {import('./project.js').Projector} projector
 * @param {number} half half-width of the map square, metres
 * @returns {Promise<object|null>} sampler, or null where there is no coverage
 */
export async function fetchLandcover(projector, half, opts = {}) {
  // ~3m per pixel is plenty: the source data is 30m, and we only use this to
  // decide "forest or not" and to tint the ground.
  const pixels = Math.min(1024, Math.max(256, Math.round((half * 2) / 3)));
  const bbox = projector.bbox(half);

  const url = new URL(opts.url ?? NLCD_ENDPOINT);
  url.searchParams.set('SERVICE', 'WMS');
  url.searchParams.set('VERSION', '1.1.1');
  url.searchParams.set('REQUEST', 'GetMap');
  url.searchParams.set('LAYERS', opts.layer ?? 'NLCD_2021_Land_Cover_L48');
  url.searchParams.set('SRS', 'EPSG:4326');
  url.searchParams.set('FORMAT', 'image/png');
  url.searchParams.set('WIDTH', String(pixels));
  url.searchParams.set('HEIGHT', String(pixels));
  url.searchParams.set(
    'BBOX',
    `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`,
  );

  const key = cacheKey('landcover', url.toString());
  let png = await readCache(opts.cacheDir, key, 'bin');
  if (!png) {
    png = await requestBuffer(url, { headers: { accept: 'image/png' } });
    await writeCache(opts.cacheDir, key, png, 'bin');
  }

  const img = decodePng(png);
  const lookup = buildLookup(img);

  // A tile fully outside NLCD's footprint comes back blank. Treat that as
  // "no coverage" rather than "the whole world is unknown".
  const known = lookup.histogram.reduce(
    (sum, n, i) => (NLCD_CLASSES[i] ? sum + n : sum),
    0,
  );
  const coverage = known / (img.width * img.height);
  if (coverage < 0.5) {
    opts.log?.(`Land cover: only ${(coverage * 100).toFixed(0)}% recognised; ignoring`);
    return null;
  }

  const classAt = (x, z) => {
    // Local metres -> pixel. The raster spans exactly the map square, north up.
    const u = (x + half) / (half * 2);
    const v = (half - z) / (half * 2); // +Z is south, image row 0 is north
    const px = Math.min(img.width - 1, Math.max(0, Math.round(u * img.width - 0.5)));
    const py = Math.min(img.height - 1, Math.max(0, Math.round((1 - v) * img.height - 0.5)));
    return lookup.at(px, py);
  };

  const summary = lookup.histogram
    .map((n, i) => ({ n, cls: NLCD_CLASSES[i] }))
    .filter((e) => e.cls && e.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 4)
    .map((e) => `${e.cls.name} ${Math.round((e.n / (img.width * img.height)) * 100)}%`);

  return {
    source: 'nlcd',
    pixels,
    resolutionMeters: (half * 2) / pixels,
    summary,
    classAt,
    canopyAt: (x, z) => classAt(x, z).canopy,
    materialAt: (x, z) => classAt(x, z).material,
  };
}

/**
 * Maps each distinct colour in the image to a legend entry once, so per-pixel
 * lookups are a table read rather than a search over the legend.
 */
function buildLookup(img) {
  const cache = new Map();
  const histogram = new Array(NLCD_CLASSES.length).fill(0);
  const index = new Int8Array(img.width * img.height);

  for (let i = 0, p = 0; p < img.data.length; i++, p += 4) {
    const rgb = (img.data[p] << 16) | (img.data[p + 1] << 8) | img.data[p + 2];
    let slot = cache.get(rgb);
    if (slot === undefined) {
      slot = img.data[p + 3] < 128 ? -1 : nearestClass(img.data[p], img.data[p + 1], img.data[p + 2]);
      cache.set(rgb, slot);
    }
    index[i] = slot;
    if (slot >= 0) histogram[slot]++;
  }

  return {
    histogram,
    at: (px, py) => {
      const slot = index[py * img.width + px];
      return slot >= 0 ? NLCD_CLASSES[slot] : UNKNOWN;
    },
  };
}

/**
 * Nearest legend colour, or -1 when nothing is close. The threshold rejects
 * background and annotation pixels rather than snapping them to a real class.
 */
function nearestClass(r, g, b) {
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < NLCD_CLASSES.length; i++) {
    const [cr, cg, cb] = NLCD_CLASSES[i].rgb;
    const d = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return bestDist <= MATCH_TOLERANCE * MATCH_TOLERANCE ? best : -1;
}
