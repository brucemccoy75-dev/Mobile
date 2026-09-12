// The seam between the shared map code and its host.
//
// Everything in src/ apart from this file and its two adapters is plain
// JavaScript that runs anywhere. The three things that genuinely differ
// between Node and a browser live here, and each host installs its own:
//
//   decodePng   Node inflates the IDAT itself; a browser already has a PNG
//               decoder and hands us pixels from a canvas.
//   cache       Node writes files; a browser uses the Cache API, or nothing.
//   now         only so tests can hold time still.
//
// Anything that reaches for `node:` outside src/node/ is a bug.

const notInstalled = (what) => () => {
  throw new Error(`map3d: no ${what} installed for this platform`);
};

export const platform = {
  /** @type {(bytes: Uint8Array) => Promise<{width: number, height: number, data: Uint8Array}>} */
  decodePng: notInstalled('PNG decoder'),

  cache: {
    /** @type {(key: string, kind: 'json'|'bin') => Promise<any>} */
    async read() { return null; },
    /** @type {(key: string, value: any, kind: 'json'|'bin') => Promise<void>} */
    async write() {},
  },

  now: () => Date.now(),
};

export function installPlatform(parts) {
  if (parts.cache) platform.cache = parts.cache;
  if (parts.decodePng) platform.decodePng = parts.decodePng;
  if (parts.now) platform.now = parts.now;
}

/* ------------------------------ small helpers ----------------------------- */

/**
 * Stable non-cryptographic hash, used only to name cache entries and to seed
 * scatter. FNV-1a, so it behaves identically in every JavaScript engine
 * without needing node:crypto.
 */
export function hashString(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * Bumped whenever what we store changes shape. Without it, entries written by
 * an older build get read back by a newer one and produce quietly different
 * maps - which is exactly what happened once during the browser port.
 */
export const CACHE_VERSION = 2;

export function cacheKey(...parts) {
  const text = [CACHE_VERSION, ...parts].join(' ');
  // Two independent hashes over the string and its reverse: still short, but
  // far less likely to collide than one 32-bit value across many worlds.
  return hashString(text) + hashString([...text].reverse().join(''));
}

/** Concatenates byte arrays without Buffer. */
export function concatBytes(chunks) {
  let total = 0;
  for (const c of chunks) total += c.length;
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}
