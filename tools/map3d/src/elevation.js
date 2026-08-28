// Optional terrain. Samples a coarse elevation grid and returns a bilinear
// sampler in local game coordinates.
//
// Default provider is OpenTopoData's public instance: free, no key, but rate
// limited to 1 call/second and 1000 calls/day. A 32x32 grid is 11 calls. For
// heavy use, run your own (https://www.opentopodata.org/server/) and pass
// --elevation-url.

import { OPENTOPODATA_ENDPOINT, DEFAULTS } from './config.js';
import { requestJson, throttle, cacheKey, readCache, writeCache } from './net.js';

/** A flat height field. Used whenever terrain is disabled or unavailable. */
export function flatTerrain(baseElevation = 0) {
  return {
    enabled: false,
    baseElevation,
    /** @returns {number} height above the map's reference plane, in metres */
    heightAt: () => 0,
    min: 0,
    max: 0,
  };
}

/**
 * Fetches an elevation grid over the map square and returns a sampler.
 * Heights are relative to the elevation at the map centre, so the origin
 * always sits at y = 0 - which is what you want when placing a player there.
 *
 * @param {import('./project.js').Projector} projector
 * @param {number} half half-width of the map square, metres
 * @param {{cells?: number, dataset?: string, url?: string, cacheDir?: string, log?: Function}} opts
 */
export async function fetchTerrain(projector, half, opts = {}) {
  const cells = Math.max(4, opts.cells ?? DEFAULTS.terrainGrid);
  const dataset = opts.dataset ?? 'aster30m';
  const baseUrl = opts.url ?? `${OPENTOPODATA_ENDPOINT}/${dataset}`;
  const n = cells + 1;

  // Grid nodes in local metres, then converted to lat/lon for the query.
  const step = (half * 2) / cells;
  const coords = [];
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = -half + i * step;
      const z = -half + j * step;
      coords.push(projector.toGeo(x, z));
    }
  }

  const key = cacheKey('elevation', baseUrl, projector.lat0, projector.lon0, half, cells);
  let heights = await readCache(opts.cacheDir, key);

  if (!heights) {
    heights = [];
    const batch = 100; // OpenTopoData's per-request location limit
    for (let start = 0; start < coords.length; start += batch) {
      const slice = coords.slice(start, start + batch);
      opts.log?.(
        `Elevation: ${Math.min(start + batch, coords.length)}/${coords.length} points`,
      );
      await throttle('opentopodata', 1100);
      const locations = slice
        .map((c) => `${c.lat.toFixed(6)},${c.lon.toFixed(6)}`)
        .join('|');
      const json = await requestJson(baseUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ locations, interpolation: 'bilinear' }).toString(),
      });
      if (json.status !== 'OK' || !Array.isArray(json.results)) {
        throw new Error(
          `Elevation lookup failed: ${json.error ?? json.status ?? 'unknown error'}`,
        );
      }
      for (const r of json.results) heights.push(r.elevation);
    }
    await writeCache(opts.cacheDir, key, heights);
  }

  // Fill any nulls (sea, dataset gaps) with the nearest known value.
  const known = heights.filter((h) => Number.isFinite(h));
  const fallback = known.length ? known.reduce((a, b) => a + b, 0) / known.length : 0;
  const grid = heights.map((h) => (Number.isFinite(h) ? h : fallback));

  const at = (i, j) => grid[clamp(j, 0, n - 1) * n + clamp(i, 0, n - 1)];

  // Reference the whole field to the centre so the address sits at y = 0.
  const centre = sample(at, n, half, step, 0, 0);

  return {
    enabled: true,
    baseElevation: centre,
    min: Math.min(...grid) - centre,
    max: Math.max(...grid) - centre,
    heightAt: (x, z) => sample(at, n, half, step, x, z) - centre,
  };
}

function sample(at, n, half, step, x, z) {
  const fi = clamp((x + half) / step, 0, n - 1.0001);
  const fj = clamp((z + half) / step, 0, n - 1.0001);
  const i = Math.floor(fi);
  const j = Math.floor(fj);
  const tx = fi - i;
  const tz = fj - j;
  const h00 = at(i, j);
  const h10 = at(i + 1, j);
  const h01 = at(i, j + 1);
  const h11 = at(i + 1, j + 1);
  return (
    h00 * (1 - tx) * (1 - tz) +
    h10 * tx * (1 - tz) +
    h01 * (1 - tx) * tz +
    h11 * tx * tz
  );
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
