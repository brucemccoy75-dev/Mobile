// Tiny fetch helpers: retries, timeouts, polite rate limiting and caching.
//
// No host dependencies: `fetch` exists in both Node 18+ and every browser, and
// where responses get cached is decided by whichever platform adapter is
// installed (files under Node, the Cache API in a browser, nowhere in tests).

import { USER_AGENT, DEFAULTS } from './config.js';
import { platform, cacheKey } from './platform.js';

export { cacheKey };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const IS_BROWSER = typeof window !== 'undefined' && typeof document !== 'undefined';

/** Serialises calls to a host so we never hammer a free public API. */
const lastCallAt = new Map();
export async function throttle(key, minIntervalMs) {
  const prev = lastCallAt.get(key) ?? 0;
  const wait = prev + minIntervalMs - Date.now();
  if (wait > 0) await sleep(wait);
  lastCallAt.set(key, Date.now());
}

export class HttpError extends Error {
  constructor(status, body, url) {
    super(`HTTP ${status} from ${url}`);
    this.status = status;
    this.body = body;
    this.url = url;
  }
}

/**
 * fetch with a timeout and exponential-backoff retries.
 * Retries on network errors, 429 and 5xx. Other 4xx fail fast.
 */
export async function request(url, options = {}) {
  const {
    retries = DEFAULTS.retries,
    timeoutMs = DEFAULTS.timeoutMs,
    onRetry,
    ...init
  } = options;

  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const backoff = 1000 * 2 ** (attempt - 1);
      onRetry?.(attempt, lastErr, backoff);
      await sleep(backoff);
    }
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
    try {
      // Browsers forbid setting user-agent, and throw if you try.
      const headers = { ...(init.headers ?? {}) };
      if (!IS_BROWSER) headers['user-agent'] = USER_AGENT;
      const res = await fetch(url, { ...init, signal: ac.signal, headers });
      if (res.ok) return res;
      const body = await res.text().catch(() => '');
      const err = new HttpError(res.status, body, url);
      if (res.status !== 429 && res.status < 500) throw err;
      lastErr = err;
    } catch (err) {
      if (err instanceof HttpError && err.status !== 429 && err.status < 500) throw err;
      lastErr = err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
}

export async function requestJson(url, options) {
  const res = await request(url, options);
  return res.json();
}

/** @returns {Promise<Uint8Array>} */
export async function requestBytes(url, options) {
  const res = await request(url, options);
  return new Uint8Array(await res.arrayBuffer());
}

/* --------------------------------- cache --------------------------------- */

export function readCache(key, ext = 'json') {
  return platform.cache.read(key, ext);
}

export function writeCache(key, value, ext = 'json') {
  return platform.cache.write(key, value, ext);
}
