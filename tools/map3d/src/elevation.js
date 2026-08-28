// Terrain height fields.
//
// Two providers:
//
//   terrarium (default) - Mapzen/AWS RGB-encoded elevation tiles. One HTTP
//     request covers ~2.4km at zoom 14, so a whole map costs a handful of
//     fetches and lands at roughly 7m per sample. No key, no rate limit.
//
//   opentopodata - the JSON point API. Slower (1 request/second, 100 points
//     each) and coarser in practice, but useful as a second opinion or when
//     you are running your own instance.
//
// Both return the same shape, with heights referenced to the map centre so
// the address always sits at y = 0.

import { OPENTOPODATA_ENDPOINT, TERRARIUM_ENDPOINT, DEFAULTS } from './config.js';
import { requestJson, requestBytes, throttle, cacheKey, readCache, writeCache } from './net.js';
import { platform } from './platform.js';
import {
  lonToTileX, latToTileY, metersPerPixel,
} from './project.js';

/** A flat height field. Used whenever terrain is disabled or unavailable. */
export function flatTerrain(baseElevation = 0) {
  return {
    enabled: false,
    provider: 'flat',
    baseElevation,
    resolutionMeters: Infinity,
    heightAt: () => 0,
    min: 0,
    max: 0,
  };
}

/**
 * @param {import('./project.js').Projector} projector
 * @param {number} half half-width of the map square, metres
 */
export async function fetchTerrain(projector, half, opts = {}) {
  const provider = opts.provider ?? 'terrarium';
  return provider === 'opentopodata'
    ? fetchTerrainPoints(projector, half, opts)
    : fetchTerrainTiles(projector, half, opts);
}

/* ------------------------------- terrarium -------------------------------- */

/** Picks the zoom whose ground resolution is closest to `targetMeters`. */
export function chooseTerrainZoom(lat, half, targetMeters = 8, maxTiles = 24) {
  for (let z = 15; z >= 8; z--) {
    const mpp = metersPerPixel(lat, z);
    const tileMeters = mpp * 256;
    const across = Math.ceil((half * 2) / tileMeters) + 1;
    if (across * across <= maxTiles && mpp <= targetMeters) return z;
  }
  // Fall back to the finest zoom whose tile count still fits.
  for (let z = 15; z >= 8; z--) {
    const across = Math.ceil((half * 2) / (metersPerPixel(lat, z) * 256)) + 1;
    if (across * across <= maxTiles) return z;
  }
  return 10;
}

async function fetchTerrainTiles(projector, half, opts = {}) {
  const template = opts.url ?? TERRARIUM_ENDPOINT;
  const zoom =
    opts.zoom ?? chooseTerrainZoom(projector.lat0, half, opts.targetMeters ?? 8);
  const bbox = projector.bbox(half);

  const x0 = Math.floor(lonToTileX(bbox.west, zoom));
  const x1 = Math.floor(lonToTileX(bbox.east, zoom));
  const y0 = Math.floor(latToTileY(bbox.north, zoom));
  const y1 = Math.floor(latToTileY(bbox.south, zoom));
  const count = (x1 - x0 + 1) * (y1 - y0 + 1);

  opts.log?.(`Terrain: ${count} elevation tiles at zoom ${zoom} ` +
    `(${metersPerPixel(projector.lat0, zoom).toFixed(1)}m per sample)`);

  const tiles = new Map();
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const url = template
        .replace('{z}', String(zoom))
        .replace('{x}', String(tx))
        .replace('{y}', String(ty));
      const key = cacheKey('terrarium', url);

      let png = await readCache(key, 'bin');
      if (!png) {
        png = await requestBytes(url, { headers: { accept: 'image/png' } });
        await writeCache(key, png, 'bin');
      }
      tiles.set(`${tx},${ty}`, await platform.decodePng(png));
    }
  }

  const size = tiles.values().next().value?.width ?? 256;

  /** Elevation at a global pixel coordinate, clamped to the tiles we have. */
  const pixel = (px, py) => {
    const tx = Math.min(Math.max(Math.floor(px / size), x0), x1);
    const ty = Math.min(Math.max(Math.floor(py / size), y0), y1);
    const tile = tiles.get(`${tx},${ty}`);
    if (!tile) return 0;
    const lx = Math.min(Math.max(Math.floor(px) - tx * size, 0), size - 1);
    const ly = Math.min(Math.max(Math.floor(py) - ty * size, 0), size - 1);
    const i = (ly * tile.width + lx) * 4;
    // Terrarium encoding: height = R * 256 + G + B / 256 - 32768 metres.
    return tile.data[i] * 256 + tile.data[i + 1] + tile.data[i + 2] / 256 - 32768;
  };

  const sampleGeo = (lat, lon) => {
    const px = lonToTileX(lon, zoom) * size - 0.5;
    const py = latToTileY(lat, zoom) * size - 0.5;
    const fx = Math.floor(px);
    const fy = Math.floor(py);
    const tx = px - fx;
    const tyf = py - fy;
    return (
      pixel(fx, fy) * (1 - tx) * (1 - tyf) +
      pixel(fx + 1, fy) * tx * (1 - tyf) +
      pixel(fx, fy + 1) * (1 - tx) * tyf +
      pixel(fx + 1, fy + 1) * tx * tyf
    );
  };

  const sample = (x, z) => {
    const { lat, lon } = projector.toGeo(x, z);
    return sampleGeo(lat, lon);
  };

  const centre = sample(0, 0);
  const { min, max } = scanRange(sample, half);

  return {
    enabled: true,
    provider: 'terrarium',
    zoom,
    resolutionMeters: metersPerPixel(projector.lat0, zoom),
    baseElevation: centre,
    min: min - centre,
    max: max - centre,
    heightAt: (x, z) => sample(x, z) - centre,
  };
}

/** Walks a coarse grid to report the relief without sampling every pixel. */
function scanRange(sample, half, steps = 64) {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i <= steps; i++) {
    for (let j = 0; j <= steps; j++) {
      const h = sample(-half + (2 * half * i) / steps, -half + (2 * half * j) / steps);
      if (h < min) min = h;
      if (h > max) max = h;
    }
  }
  return { min, max };
}

/* ------------------------------ opentopodata ------------------------------ */

async function fetchTerrainPoints(projector, half, opts = {}) {
  const cells = Math.max(4, opts.cells ?? DEFAULTS.terrainGrid);
  const dataset = opts.dataset ?? 'aster30m';
  const baseUrl = opts.url ?? `${OPENTOPODATA_ENDPOINT}/${dataset}`;
  const n = cells + 1;

  const step = (half * 2) / cells;
  const coords = [];
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      coords.push(projector.toGeo(-half + i * step, -half + j * step));
    }
  }

  const key = cacheKey('elevation', baseUrl, projector.lat0, projector.lon0, half, cells);
  let heights = await readCache(key);

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
    await writeCache(key, heights);
  }

  // Fill any nulls (sea, dataset gaps) with the mean of what we did get.
  const known = heights.filter((h) => Number.isFinite(h));
  const fallback = known.length ? known.reduce((a, b) => a + b, 0) / known.length : 0;
  const grid = heights.map((h) => (Number.isFinite(h) ? h : fallback));

  const at = (i, j) => grid[clamp(j, 0, n - 1) * n + clamp(i, 0, n - 1)];
  const sample = (x, z) => bilinear(at, n, half, step, x, z);
  const centre = sample(0, 0);

  return {
    enabled: true,
    provider: 'opentopodata',
    dataset,
    resolutionMeters: step,
    baseElevation: centre,
    min: Math.min(...grid) - centre,
    max: Math.max(...grid) - centre,
    heightAt: (x, z) => sample(x, z) - centre,
  };
}

function bilinear(at, n, half, step, x, z) {
  const fi = clamp((x + half) / step, 0, n - 1.0001);
  const fj = clamp((z + half) / step, 0, n - 1.0001);
  const i = Math.floor(fi);
  const j = Math.floor(fj);
  const tx = fi - i;
  const tz = fj - j;
  return (
    at(i, j) * (1 - tx) * (1 - tz) +
    at(i + 1, j) * tx * (1 - tz) +
    at(i, j + 1) * (1 - tx) * tz +
    at(i + 1, j + 1) * tx * tz
  );
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
