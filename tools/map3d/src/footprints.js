// Building footprints from outside OpenStreetMap.
//
// OSM's building coverage in rural America is thin: a lakeside subdivision of
// eighty houses can carry twenty, and a map built from it has holes where the
// player's own house should be. FEMA / Oak Ridge National Laboratory's
// "USA Structures" traced every building in the country from aerial imagery
// (public domain, United States only). We fetch the ones inside the map square
// and add any that OSM does not already have; OSM wins wherever both exist
// because its outlines are hand-drawn and carry tags.
//
// The service is an ArcGIS FeatureServer, so the query is a bounding box and
// the answer is GeoJSON. Outside the US it simply returns nothing.

import { requestJson, cacheKey, readCache, writeCache, throttle } from './net.js';

export const USA_STRUCTURES_ENDPOINT =
  'https://services2.arcgis.com/FiaPA4ga0iQKduv3/arcgis/rest/services/USA_Structures_View/FeatureServer/0/query';

export const USA_STRUCTURES_CREDIT =
  'Building footprints: FEMA / ORNL USA Structures (public domain)';

const PAGE = 2000;
const FIELDS = 'BUILD_ID,OBJECTID,OCC_CLS,PRIM_OCC,SEC_OCC,PROP_ADDR,PROP_CITY,PROP_ZIP,OUTBLDG,HEIGHT,SQMETERS';

/**
 * Structures inside the map square, as features shaped like overpass.normalizeElements
 * output: `{ id, kind: 'area', tags, rings: [[lat, lon], ...][] }`.
 * @param {import('./project.js').Projector} projector
 * @param {number} half   half-width of the map square in metres
 */
export async function fetchFootprints(projector, half, opts = {}) {
  const bbox = projector.bbox(half);
  const endpoint = opts.url ?? USA_STRUCTURES_ENDPOINT;
  const key = cacheKey(
    'footprints', endpoint,
    bbox.west.toFixed(5), bbox.south.toFixed(5), bbox.east.toFixed(5), bbox.north.toFixed(5),
  );

  let raw = await readCache(key);
  if (!raw) {
    raw = [];
    for (let offset = 0; offset <= 50000; offset += PAGE) {
      const url = new URL(endpoint);
      url.searchParams.set('where', '1=1');
      url.searchParams.set('geometry', `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`);
      url.searchParams.set('geometryType', 'esriGeometryEnvelope');
      url.searchParams.set('inSR', '4326');
      url.searchParams.set('outSR', '4326');
      url.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
      url.searchParams.set('outFields', FIELDS);
      url.searchParams.set('returnGeometry', 'true');
      url.searchParams.set('resultOffset', String(offset));
      url.searchParams.set('resultRecordCount', String(PAGE));
      url.searchParams.set('f', 'geojson');

      await throttle(url.host, 250);
      const json = await requestJson(url, { headers: { accept: 'application/json' } });
      if (json?.error) throw new Error(json.error.message ?? 'USA Structures query failed');
      const page = Array.isArray(json?.features) ? json.features : [];
      raw.push(...page);
      opts.log?.(`Footprints: ${raw.length} structures`);
      if (!json?.properties?.exceededTransferLimit || page.length === 0) break;
    }
    await writeCache(key, raw);
  }

  return raw.map(structureFeature).filter(Boolean);
}

/** One GeoJSON structure -> a normalised area feature. */
export function structureFeature(geo) {
  const geom = geo?.geometry;
  if (!geom) return null;
  let polys = [];
  if (geom.type === 'Polygon') polys = [geom.coordinates];
  else if (geom.type === 'MultiPolygon') polys = geom.coordinates;
  if (!polys.length) return null;

  // Keep the largest polygon; a structure split in two is rare and the
  // manifest is happier with one outline per building.
  polys.sort((a, b) => Math.abs(ringAreaDeg(b[0])) - Math.abs(ringAreaDeg(a[0])));
  const rings = polys[0]
    .map((ring) => ring
      .filter((p) => Array.isArray(p) && Number.isFinite(p[0]) && Number.isFinite(p[1]))
      .map(([lon, lat]) => [lat, lon]))
    .filter((ring) => ring.length >= 4);
  if (!rings.length) return null;

  const p = geo.properties ?? {};
  const id = `usa/${p.BUILD_ID ?? p.OBJECTID ?? geo.id ?? ringAreaDeg(rings[0]).toFixed(12)}`;
  return { id, kind: 'area', tags: structureTags(p), rings, source: 'usa-structures' };
}

/**
 * USA Structures occupancy -> OSM-style tags, so the rest of the pipeline
 * (heights, roofs, materials, manifest types) needs no special cases.
 */
export function structureTags(p = {}) {
  const occ = String(p.OCC_CLS ?? '').toLowerCase().trim();
  const prim = String(p.PRIM_OCC ?? '').toLowerCase();
  const area = Number(p.SQMETERS) || 0;

  let building = 'yes';
  if (occ === 'residential') {
    if (/mobile|manufactured/.test(prim)) building = 'static_caravan';
    else if (/multi/.test(prim)) building = 'apartments';
    else building = 'house';
  } else if (occ === 'commercial') building = 'commercial';
  else if (occ === 'industrial') building = 'industrial';
  else if (occ === 'education') building = 'school';
  else if (occ === 'government') building = 'civic';
  else if (occ === 'agriculture') building = 'barn';
  else if (occ === 'assembly') building = /church|relig|worship/.test(prim) ? 'church' : 'civic';
  else if (/utility/.test(occ)) building = 'service';

  // Outbuildings. The dataset flags some; the rest are "Single Family
  // Dwelling" polygons far too small to be one. A detached garage on a rural
  // lot runs 40-55 m2, a shed under that; real cottages start around 55 m2.
  const flagged = p.OUTBLDG === 'Y' || p.OUTBLDG === 'Yes' || p.OUTBLDG === true || p.OUTBLDG === 1;
  if (flagged) building = area >= 40 ? 'garage' : 'shed';
  else if (occ === 'residential' && area > 0 && area < 40) building = 'shed';
  else if (occ === 'residential' && area >= 40 && area < 55) building = 'garage';

  const tags = { building, source: 'usa-structures' };

  const h = Number(p.HEIGHT);
  if (Number.isFinite(h) && h > 2 && h < 150) tags.height = String(h);

  const addr = parseStreetAddress(p.PROP_ADDR);
  if (addr) {
    tags['addr:housenumber'] = addr.housenumber;
    tags['addr:street'] = addr.street;
  }
  if (p.PROP_CITY) tags['addr:city'] = titleCase(p.PROP_CITY);
  if (p.PROP_ZIP) tags['addr:postcode'] = String(p.PROP_ZIP);
  return tags;
}

/** "123 MAIN ST" -> { housenumber: "123", street: "Main St" }. */
export function parseStreetAddress(value) {
  if (!value) return null;
  const m = /^\s*(\d+[A-Za-z]?)\s+(.+?)\s*$/.exec(String(value));
  if (!m) return null;
  return { housenumber: m[1], street: titleCase(m[2]) };
}

/**
 * Adds external footprints that OSM does not already cover.
 * A footprint is "already there" when its centre lies inside an OSM building,
 * an OSM building's centre lies inside it, or the two centres are within 6 m.
 * @returns {{ features: Array, added: number, dropped: number }}
 */
export function mergeFootprints(osmFeatures, footprints, projector) {
  const toLocal = ([lat, lon]) => projector.toLocal(lat, lon);
  const existing = [];
  for (const f of osmFeatures) {
    if (f.kind !== 'area' || !f.rings?.length) continue;
    if (!(f.tags?.building || f.tags?.['building:part'])) continue;
    const ring = f.rings[0].map(toLocal);
    if (ring.length < 3) continue;
    existing.push({ ring, box: bboxOf(ring), centre: centroidOf(ring) });
  }

  const added = [];
  let dropped = 0;
  for (const fp of footprints) {
    const ring = fp.rings[0].map(toLocal);
    if (ring.length < 3) { dropped++; continue; }
    const box = bboxOf(ring);
    const centre = centroidOf(ring);
    let covered = false;
    for (const o of existing) {
      if (box.maxX < o.box.minX || box.minX > o.box.maxX ||
          box.maxZ < o.box.minZ || box.minZ > o.box.maxZ) continue;
      if (pointInRing(centre[0], centre[1], o.ring) ||
          pointInRing(o.centre[0], o.centre[1], ring) ||
          Math.hypot(centre[0] - o.centre[0], centre[1] - o.centre[1]) < 6) {
        covered = true;
        break;
      }
    }
    if (covered) dropped++;
    else added.push(fp);
  }

  return { features: [...osmFeatures, ...added], added: added.length, dropped };
}

/* -------------------------------- helpers --------------------------------- */

function titleCase(s) {
  return String(s).toLowerCase().replace(/(^|[\s-])([a-z])/g, (m, sep, c) => sep + c.toUpperCase());
}

function ringAreaDeg(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
  }
  return a / 2;
}

function bboxOf(ring) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const [x, z] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  return { minX, maxX, minZ, maxZ };
}

function centroidOf(ring) {
  let x = 0, z = 0, n = 0;
  for (let i = 0; i < ring.length; i++) {
    // Skip a repeated closing vertex so it does not weigh double.
    if (i === ring.length - 1 && ring[i][0] === ring[0][0] && ring[i][1] === ring[0][1]) break;
    x += ring[i][0];
    z += ring[i][1];
    n++;
  }
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
