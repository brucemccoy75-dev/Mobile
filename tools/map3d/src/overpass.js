// Pulls raw OSM features from the Overpass API and turns them into simple
// {kind, tags, rings|line|point} records in lat/lon space.

import { OVERPASS_ENDPOINTS } from './config.js';
import { request, cacheKey, readCache, writeCache, HttpError } from './net.js';

/** Builds the Overpass QL for everything we know how to render. */
export function buildQuery(lat, lon, radius, opts = {}) {
  const a = `(around:${radius.toFixed(1)},${lat.toFixed(7)},${lon.toFixed(7)})`;
  const timeout = opts.timeout ?? 180;

  const clauses = [
    `way["building"]${a};`,
    `relation["building"]["type"="multipolygon"]${a};`,
    `way["building:part"]${a};`,
    `way["highway"]${a};`,
    `way["railway"]${a};`,
    `way["waterway"]${a};`,
    `way["natural"]${a};`,
    `relation["natural"]["type"="multipolygon"]${a};`,
    `way["landuse"]${a};`,
    `relation["landuse"]["type"="multipolygon"]${a};`,
    `way["leisure"]${a};`,
    `relation["leisure"]["type"="multipolygon"]${a};`,
    `way["amenity"~"^(parking|grave_yard)$"]${a};`,
    `relation["amenity"="parking"]["type"="multipolygon"]${a};`,
    `way["man_made"~"^(bridge|pier|breakwater|storage_tank|silo)$"]${a};`,
  ];
  if (opts.barriers !== false) {
    clauses.push(`way["barrier"~"^(wall|fence|hedge|retaining_wall|city_wall)$"]${a};`);
  }
  if (opts.trees !== false) {
    clauses.push(`node["natural"="tree"]${a};`);
    clauses.push(`way["natural"="tree_row"]${a};`);
  }

  return `[out:json][timeout:${timeout}];\n(\n  ${clauses.join('\n  ')}\n);\nout geom;`;
}

/**
 * Runs a query, walking the mirror list until one answers usefully.
 * @returns {Promise<{elements: any[], endpoint: string, cached: boolean}>}
 */
export async function runQuery(query, opts = {}) {
  const endpoints = opts.endpoints?.length ? opts.endpoints : OVERPASS_ENDPOINTS;
  const key = cacheKey('overpass', query);
  const cached = await readCache(key);
  if (cached) {
    opts.log?.(`Overpass: reusing cached response (${cached.elements.length} elements)`);
    return { ...cached, cached: true };
  }

  const problems = [];
  let emptyResult = null;

  for (const endpoint of endpoints) {
    opts.log?.(`Overpass: querying ${new URL(endpoint).host} ...`);
    try {
      const res = await request(endpoint, {
        method: 'POST',
        body: new URLSearchParams({ data: query }).toString(),
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeoutMs: opts.timeoutMs,
        retries: 1,
        onRetry: (n, err) => opts.log?.(`  retry ${n} after ${describe(err)}`),
      });

      const text = await res.text();
      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`non-JSON response (${text.slice(0, 120).replace(/\s+/g, ' ')})`);
      }
      if (json.remark && /error|timed out|out of memory/i.test(json.remark)) {
        throw new Error(`server remark: ${json.remark.trim()}`);
      }
      if (!Array.isArray(json.elements)) throw new Error('response had no elements array');

      const result = { elements: json.elements, endpoint };
      if (json.elements.length === 0) {
        // Could be a genuinely empty area, or a mirror carrying only a
        // regional extract. Keep looking before believing it.
        opts.log?.('  returned 0 elements, trying the next mirror');
        emptyResult ??= result;
        continue;
      }

      opts.log?.(`  got ${json.elements.length} elements`);
      await writeCache(key, result);
      return { ...result, cached: false };
    } catch (err) {
      problems.push(`${new URL(endpoint).host}: ${describe(err)}`);
      opts.log?.(`  failed (${describe(err)})`);
    }
  }

  // An empty answer is only trustworthy when nothing else went wrong. If some
  // mirrors errored, the one that said "nothing here" is exactly the one least
  // worth believing - it may only carry a regional extract. Believing it
  // silently produces a map with no buildings and no roads, which looks like
  // success and is the worst possible failure mode.
  if (emptyResult && problems.length === 0) {
    await writeCache(key, emptyResult);
    return { ...emptyResult, cached: false };
  }

  const detail = problems.length ? `\n  ${problems.join('\n  ')}` : '';
  throw new Error(
    emptyResult
      ? `No map data came back. The only mirror that answered returned nothing, ` +
        `and the others failed, so that empty answer cannot be trusted:${detail}`
      : `Every Overpass mirror failed:${detail}\n` +
        `They are volunteer-run and often busy - trying again shortly usually works.`,
  );
}

function describe(err) {
  if (err instanceof HttpError) return `HTTP ${err.status}`;
  if (err?.name === 'AbortError') return 'timeout';
  return err?.message ?? String(err);
}

/* ------------------------------ normalisation ----------------------------- */

/**
 * Converts Overpass elements into a uniform shape.
 * Rings and lines are arrays of [lat, lon] pairs.
 * @returns {Array<{id: string, kind: 'area'|'line'|'point', tags: object, rings?: number[][][], line?: number[][], point?: number[]}>}
 */
export function normalizeElements(elements) {
  const out = [];

  for (const el of elements) {
    const tags = el.tags ?? {};
    const id = `${el.type}/${el.id}`;

    if (el.type === 'node') {
      out.push({ id, kind: 'point', tags, point: [el.lat, el.lon] });
      continue;
    }

    if (el.type === 'way') {
      const pts = (el.geometry ?? [])
        .filter((p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lon))
        .map((p) => [p.lat, p.lon]);
      if (pts.length < 2) continue;

      if (isClosed(pts) && looksLikeArea(tags)) {
        out.push({ id, kind: 'area', tags, rings: [pts], nodes: el.nodes });
      } else {
        out.push({ id, kind: 'line', tags, line: pts, nodes: el.nodes });
      }
      continue;
    }

    if (el.type === 'relation') {
      const rings = assembleMultipolygon(el.members ?? []);
      if (rings.length) out.push({ id, kind: 'area', tags, rings });
    }
  }

  return out;
}

function isClosed(pts) {
  const a = pts[0];
  const b = pts[pts.length - 1];
  return pts.length > 3 && Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
}

/** Closed ways are only areas if their tags say so - a roundabout is not. */
function looksLikeArea(tags) {
  if (tags.area === 'no') return false;
  if (tags.area === 'yes') return true;
  if (tags.building || tags['building:part']) return true;
  if (tags.landuse || tags.leisure || tags.natural) return true;
  if (tags.amenity === 'parking' || tags.amenity === 'grave_yard') return true;
  if (tags.waterway === 'riverbank' || tags.waterway === 'dock') return true;
  if (tags.man_made === 'storage_tank' || tags.man_made === 'silo' || tags.man_made === 'pier') return true;
  // highway/railway/barrier closed loops stay linear.
  return false;
}

/**
 * Stitches relation member ways into closed rings.
 * Outer rings come first; inner rings follow, so downstream code can treat
 * index 0 as the outline and the rest as holes.
 */
export function assembleMultipolygon(members) {
  const outer = stitch(members.filter((m) => m.type === 'way' && m.role !== 'inner'));
  const inner = stitch(members.filter((m) => m.type === 'way' && m.role === 'inner'));
  if (!outer.length) return [];
  // A relation can hold several disjoint outer rings; we keep the largest and
  // its holes, which is what matters for a half-mile game map.
  outer.sort((a, b) => Math.abs(ringAreaLL(b)) - Math.abs(ringAreaLL(a)));
  return [outer[0], ...inner];
}

function stitch(members) {
  const open = [];
  const closed = [];

  for (const m of members) {
    const pts = (m.geometry ?? [])
      .filter((p) => p && Number.isFinite(p.lat) && Number.isFinite(p.lon))
      .map((p) => [p.lat, p.lon]);
    if (pts.length < 2) continue;
    if (isClosed(pts)) {
      closed.push(pts);
    } else {
      open.push(pts);
    }
  }

  // Greedily join open segments end-to-end until they close.
  while (open.length) {
    let chain = open.pop();
    let joined = true;
    while (joined && !isClosed(chain)) {
      joined = false;
      for (let i = 0; i < open.length; i++) {
        const seg = open[i];
        if (same(chain[chain.length - 1], seg[0])) {
          chain = chain.concat(seg.slice(1));
        } else if (same(chain[chain.length - 1], seg[seg.length - 1])) {
          chain = chain.concat(seg.slice(0, -1).reverse());
        } else if (same(chain[0], seg[seg.length - 1])) {
          chain = seg.slice(0, -1).concat(chain);
        } else if (same(chain[0], seg[0])) {
          chain = seg.slice(1).reverse().concat(chain);
        } else {
          continue;
        }
        open.splice(i, 1);
        joined = true;
        break;
      }
    }
    // Unclosed chains (data gaps at the extract boundary) get force-closed.
    if (chain.length > 3) closed.push(chain);
  }

  return closed;
}

function same(a, b) {
  return Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;
}

function ringAreaLL(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += (ring[j][1] - ring[i][1]) * (ring[i][0] + ring[j][0]);
  }
  return sum / 2;
}
