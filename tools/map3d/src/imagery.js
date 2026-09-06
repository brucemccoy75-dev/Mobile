// Optional satellite / map imagery draped on the ground.
//
// You supply the XYZ tile URL template, so you choose the provider you are
// licensed to use. Nothing is hard-coded here on purpose: baking Google or
// Apple imagery into a game asset is not something their terms allow, and
// this tool should not make that easy by accident.
//
// Examples (check each provider's terms before shipping):
//   OSM standard  https://tile.openstreetmap.org/{z}/{x}/{y}.png
//   Esri imagery  https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
//   Mapbox        https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=...
//
// Each tile becomes its own textured quad, so no image decoding is needed.

import { DEFAULTS } from './config.js';
import {
  lonToTileX, latToTileY, tileXToLon, tileYToLat, metersPerPixel,
} from './project.js';
import { requestBytes, cacheKey, readCache, writeCache, throttle } from './net.js';

/** Picks the highest zoom whose tile count stays under the cap. */
export function chooseZoom(lat, half, maxTiles = DEFAULTS.maxImageryTiles) {
  for (let z = 21; z >= 8; z--) {
    const tileMeters = metersPerPixel(lat, z) * 256;
    const across = Math.ceil((half * 2) / tileMeters) + 1;
    if (across * across <= maxTiles) return z;
  }
  return 8;
}

/**
 * Named providers whose terms allow baking the pixels into a game. The USDA's
 * National Agriculture Imagery Program is public domain and covers the whole
 * of the lower 48 at 0.6-1 m; USGS serves it as an ArcGIS ImageServer, which
 * exports any bounding box at any size rather than fixed XYZ tiles.
 */
export const IMAGERY_PRESETS = {
  naip: 'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage'
    + '?bbox={bbox}&bboxSR=4326&imageSR=4326&size={size}&format=jpg&f=image',
};

export const IMAGERY_CREDITS = {
  naip: 'Aerial imagery: USDA NAIP via USGS The National Map (public domain)',
};

export function imageryCredit(template) {
  return IMAGERY_CREDITS[template] ?? undefined;
}

/**
 * Downloads the imagery covering the map square.
 * @param {string} template  XYZ tile URL with {z}/{x}/{y}, a preset name, or an
 *   export URL with {bbox} and {size}
 * @returns {Promise<{zoom: number|null, tiles: Array<{x0,z0,x1,z1,data:Buffer,mime:string}>}>}
 */
export async function fetchImagery(projector, half, template, opts = {}) {
  template = IMAGERY_PRESETS[template] ?? template;
  if (template.includes('{bbox}')) return fetchImageryExport(projector, half, template, opts);
  return fetchImageryTiles(projector, half, template, opts);
}

/**
 * The map square cut into an across x across grid of local squares, each with
 * the lat/lon box an image server needs. Pure, so it is testable.
 */
export function exportTileGrid(projector, half, across) {
  const cells = [];
  const step = (half * 2) / across;
  for (let iz = 0; iz < across; iz++) {
    for (let ix = 0; ix < across; ix++) {
      const x0 = -half + ix * step;
      const z0 = -half + iz * step;
      const x1 = x0 + step;
      const z1 = z0 + step;
      const nw = projector.toGeo(x0, z0);
      const se = projector.toGeo(x1, z1);
      cells.push({
        x0, z0, x1, z1,
        bbox: { west: nw.lon, north: nw.lat, east: se.lon, south: se.lat },
      });
    }
  }
  return cells;
}

async function fetchImageryExport(projector, half, template, opts = {}) {
  // 4 x 4 cells of 1024 px over a half-mile map is ~0.45 m/px, which is finer
  // than NAIP itself; more cells only cost download time and file size.
  const across = opts.across ?? 4;
  const size = opts.size ?? 1024;
  const cells = exportTileGrid(projector, half, across);
  const tiles = [];
  let fetched = 0;
  for (const cell of cells) {
    const { west, south, east, north } = cell.bbox;
    const url = template
      .replace('{bbox}', `${west},${south},${east},${north}`)
      .replace('{size}', `${size},${size}`);
    const key = cacheKey('tile', url);
    let data = await readCache(key, 'bin');
    if (!data) {
      await throttle(new URL(url).host, opts.minIntervalMs ?? 100);
      data = await requestBytes(url, { headers: { accept: 'image/*' } });
      if (!data?.length || data.length < 100 || data[0] === 0x7b /* '{' = JSON error */) {
        throw new Error(`image server returned no image for ${url.slice(0, 120)}...`);
      }
      await writeCache(key, data, 'bin');
    }
    fetched++;
    opts.log?.(`Imagery: tile ${fetched}/${cells.length}`);
    tiles.push({
      x0: cell.x0, z0: cell.z0, x1: cell.x1, z1: cell.z1,
      data,
      mime: sniffMime(data, url),
    });
  }
  return { zoom: null, tiles, template, metersPerPixel: (half * 2) / across / size };
}

async function fetchImageryTiles(projector, half, template, opts = {}) {
  const zoom = opts.zoom ?? chooseZoom(projector.lat0, half, opts.maxTiles);
  const bbox = projector.bbox(half);

  const x0 = Math.floor(lonToTileX(bbox.west, zoom));
  const x1 = Math.floor(lonToTileX(bbox.east, zoom));
  const y0 = Math.floor(latToTileY(bbox.north, zoom));
  const y1 = Math.floor(latToTileY(bbox.south, zoom));

  const count = (x1 - x0 + 1) * (y1 - y0 + 1);
  const cap = opts.maxTiles ?? DEFAULTS.maxImageryTiles;
  if (count > cap) {
    throw new Error(
      `Imagery would need ${count} tiles at zoom ${zoom} (cap ${cap}). ` +
        `Lower --imagery-zoom or raise --imagery-max-tiles.`,
    );
  }

  const tiles = [];
  let fetched = 0;
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      const url = template
        .replace('{z}', String(zoom))
        .replace('{x}', String(tx))
        .replace('{y}', String(ty))
        .replace('{s}', 'abc'[(tx + ty) % 3]);

      const key = cacheKey('tile', url);
      let data = await readCache(key, 'bin');
      if (!data) {
        await throttle(new URL(url).host, opts.minIntervalMs ?? 60);
        data = await requestBytes(url, { headers: { accept: 'image/*' } });
        await writeCache(key, data, 'bin');
      }
      fetched++;
      opts.log?.(`Imagery: tile ${fetched}/${count}`);

      // Tile bounds -> local metres.
      const west = tileXToLon(tx, zoom);
      const east = tileXToLon(tx + 1, zoom);
      const north = tileYToLat(ty, zoom);
      const south = tileYToLat(ty + 1, zoom);
      const [xw, zn] = projector.toLocal(north, west);
      const [xe, zs] = projector.toLocal(south, east);

      tiles.push({
        x0: xw, z0: zn, x1: xe, z1: zs,
        data,
        mime: sniffMime(data, url),
      });
    }
  }

  return { zoom, tiles, template };
}

function sniffMime(buf, url) {
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50) return 'image/png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg';
  if (buf.length > 12 && String.fromCharCode(...buf.subarray(8, 12)) === 'WEBP') return 'image/webp';
  return /\.jpe?g/i.test(url) ? 'image/jpeg' : 'image/png';
}
