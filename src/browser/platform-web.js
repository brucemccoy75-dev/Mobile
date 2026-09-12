// The browser's half of the platform seam.
//
// PNG decoding is free here: the browser already has a decoder, so we hand the
// bytes to createImageBitmap and read pixels back off a canvas rather than
// inflating IDAT ourselves. Caching uses the Cache API, which survives a
// reload, so rebuilding a place you have already visited costs no network.

import { installPlatform } from '../platform.js';

const CACHE_NAME = 'map3d-v1';

export function installWebPlatform({ cache = true } = {}) {
  installPlatform({
    decodePng: decodePngViaCanvas,
    cache: cache && 'caches' in globalThis ? cacheApi() : memoryCache(),
  });
}

/** @returns {Promise<{width: number, height: number, data: Uint8Array}>} RGBA */
async function decodePngViaCanvas(bytes) {
  // These images are data, not pictures. Terrarium tiles pack elevation into
  // RGB, so a colour-managed byte shift of 1 in the green channel moves the
  // ground by a metre; NLCD is a palette we match by exact-ish colour. Both
  // need the bytes the file actually contains, hence colourSpaceConversion
  // 'none' on the decode and an explicit sRGB canvas with no alpha
  // premultiplication on the read-back.
  const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }), {
    colorSpaceConversion: 'none',
    premultiplyAlpha: 'none',
  });
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  // willReadFrequently keeps this on the CPU path, which is what we want:
  // every pixel is read exactly once and never drawn.
  const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });
  ctx.drawImage(bitmap, 0, 0);
  const img = ctx.getImageData(0, 0, bitmap.width, bitmap.height, { colorSpace: 'srgb' });
  bitmap.close();
  return { width: img.width, height: img.height, data: new Uint8Array(img.data.buffer) };
}

/**
 * The Cache API only stores Responses against Requests, so entries are keyed
 * by a synthetic URL under a scheme the page never actually fetches.
 */
function cacheApi() {
  const urlFor = (key, kind) => `https://map3d.local/${kind}/${key}`;
  return {
    async read(key, kind) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const hit = await cache.match(urlFor(key, kind));
        if (!hit) return null;
        return kind === 'json' ? hit.json() : new Uint8Array(await hit.arrayBuffer());
      } catch {
        return null; // private mode, storage denied, quota - never fatal
      }
    },
    async write(key, value, kind) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const body = kind === 'json' ? JSON.stringify(value) : value;
        await cache.put(urlFor(key, kind), new Response(body));
      } catch {
        // Caching is an optimisation; failing to cache must never fail a build.
      }
    },
  };
}

function memoryCache() {
  const store = new Map();
  return {
    async read(key, kind) { return store.get(`${kind}/${key}`) ?? null; },
    async write(key, value, kind) { store.set(`${kind}/${key}`, value); },
  };
}
