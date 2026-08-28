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
 * Downloads the tiles covering the map square.
 * @returns {Promise<{zoom: number, tiles: Array<{x0,z0,x1,z1,data:Buffer,mime:string}>}>}
 */
export async function fetchImagery(projector, half, template, opts = {}) {
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
