// Tiny fetch helpers: retries, timeouts, polite rate limiting and a disk cache.
// Zero dependencies - Node 18+ ships fetch.

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { USER_AGENT, DEFAULTS } from './config.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
      const res = await fetch(url, {
        ...init,
        signal: ac.signal,
        headers: { 'user-agent': USER_AGENT, ...(init.headers ?? {}) },
      });
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

export async function requestBuffer(url, options) {
  const res = await request(url, options);
  return Buffer.from(await res.arrayBuffer());
}

/* ------------------------------ disk cache ------------------------------ */

export function cacheKey(...parts) {
  return createHash('sha1').update(parts.join(' ')).digest('hex').slice(0, 20);
}

export async function readCache(cacheDir, key, ext = 'json') {
  if (!cacheDir) return null;
  try {
    const raw = await readFile(join(cacheDir, `${key}.${ext}`));
    return ext === 'json' ? JSON.parse(raw.toString('utf8')) : raw;
  } catch {
    return null;
  }
}

export async function writeCache(cacheDir, key, value, ext = 'json') {
  if (!cacheDir) return;
  const file = join(cacheDir, `${key}.${ext}`);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, ext === 'json' ? JSON.stringify(value) : value);
}
