// `map3d play` - the shell.
//
// Serves a page with an address box. You type an address, it builds the map
// (streaming progress back as it goes) and drops you into it in first person.
//
// Builds land in a worlds directory keyed by a hash of the request, so asking
// for the same place twice is instant and you can revisit anything you built
// earlier from the home screen.

import { createReadStream } from 'node:fs';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

import { DEFAULTS, METERS_PER_MILE } from './config.js';
import { cacheKey } from './net.js';
import { buildMap, PKG_ROOT } from './pipeline.js';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

/**
 * @param {{port?: number, worldsDir?: string, cacheDir?: string|null, radius?: number}} opts
 */
export function play(opts = {}) {
  const port = opts.port ?? 8080;
  const worldsDir = resolve(opts.worldsDir ?? 'worlds');
  const cacheDir = opts.cacheDir === undefined ? resolve(DEFAULTS.cacheDir) : opts.cacheDir;

  /** In-flight and finished builds, keyed by world id. */
  const builds = new Map();

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/api/build' && req.method === 'POST') {
        return await handleBuild(req, res, { worldsDir, cacheDir, builds, defaultRadius: opts.radius });
      }
      if (url.pathname === '/api/worlds') {
        return await handleWorlds(res, worldsDir);
      }
      return await handleStatic(url, res, worldsDir);
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
      }
      res.end(JSON.stringify({ error: err.message }));
    }
  });

  return new Promise((resolvePromise, reject) => {
    server.on('error', reject);
    server.listen(port, () => {
      process.stdout.write(
        `\n  map3d is running: http://localhost:${port}/\n` +
          `  worlds are saved in ${worldsDir}\n  Ctrl-C to stop\n\n`,
      );
      resolvePromise(server);
    });
  });
}

/* --------------------------------- build ---------------------------------- */

/**
 * Runs a build, streaming progress lines back as newline-delimited JSON so the
 * page can show what is happening instead of a spinner. A build that is
 * already finished returns immediately.
 */
async function handleBuild(req, res, { worldsDir, cacheDir, builds, defaultRadius }) {
  const body = JSON.parse(await readBody(req));
  const address = String(body.address ?? '').trim();
  if (!address) {
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: 'Type an address first.' }));
    return;
  }

  const radius = clamp(Number(body.radius) || defaultRadius || DEFAULTS.radiusMeters, 100, 5000);
  const quality = body.quality === 'fast' ? 'fast' : 'full';
  const id = cacheKey('world', address.toLowerCase(), radius, quality);
  const dir = join(worldsDir, id);

  res.writeHead(200, {
    'content-type': 'application/x-ndjson; charset=utf-8',
    'cache-control': 'no-store',
    'x-accel-buffering': 'no',
  });
  const send = (obj) => res.write(`${JSON.stringify(obj)}\n`);

  // Already built? Hand it straight back.
  const existing = await readManifest(dir);
  if (existing) {
    send({ progress: 'Found this one already built.' });
    send({ done: true, id, manifest: summarise(existing) });
    res.end();
    return;
  }

  // Already building (two tabs, or a double click)? Follow along.
  if (builds.has(id)) {
    send({ progress: 'Already building this one, hang on...' });
    try {
      await builds.get(id);
      const manifest = await readManifest(dir);
      send({ done: true, id, manifest: summarise(manifest) });
    } catch (err) {
      send({ error: err.message });
    }
    res.end();
    return;
  }

  const run = (async () => {
    await buildMap({
      address,
      radius,
      outDir: dir,
      formats: ['glb', 'json'],
      cacheDir,
      log: (msg) => send({ progress: msg.trim() }),
      scene: quality === 'fast'
        ? { treeSpacing: 22, terrainCells: 96 }
        : {},
    });
  })();

  builds.set(id, run);
  try {
    await run;
    const manifest = await readManifest(dir);
    await writeFile(join(dir, 'world.json'), JSON.stringify({ id, address, radius, quality }));
    send({ done: true, id, manifest: summarise(manifest) });
  } catch (err) {
    send({ error: err.message });
  } finally {
    builds.delete(id);
    res.end();
  }
}

/** Everything the page needs; the full manifest can be megabytes. */
function summarise(m) {
  if (!m) return null;
  return {
    address: m.address,
    origin: m.origin,
    radiusMeters: m.radiusMeters,
    bounds: m.bounds,
    spawn: m.spawn,
    terrain: m.terrain,
    landcover: m.landcover,
    stats: m.stats,
    attribution: m.attribution,
  };
}

async function readManifest(dir) {
  try {
    await stat(join(dir, 'map.glb'));
    return JSON.parse(await readFile(join(dir, 'map.json'), 'utf8'));
  } catch {
    return null;
  }
}

/** Lists previously built worlds for the home screen. */
async function handleWorlds(res, worldsDir) {
  const out = [];
  let entries = [];
  try {
    entries = await readdir(worldsDir, { withFileTypes: true });
  } catch {
    // No worlds yet; an empty list is the right answer.
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifest = await readManifest(join(worldsDir, entry.name));
    if (!manifest) continue;
    out.push({
      id: entry.name,
      label: manifest.address?.resolved ?? manifest.address?.query ?? entry.name,
      query: manifest.address?.query,
      radiusMeters: manifest.radiusMeters,
      builtAt: manifest.generatedAt,
      stats: manifest.stats,
    });
  }
  out.sort((a, b) => String(b.builtAt).localeCompare(String(a.builtAt)));
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify(out));
}

/* --------------------------------- static --------------------------------- */

async function handleStatic(url, res, worldsDir) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/') rel = '/play.html';

  // /worlds/<id>/map.glb comes from the build directory; everything else is
  // shipped with the tool.
  const fromWorlds = rel.startsWith('/worlds/');
  const base = fromWorlds ? worldsDir : join(PKG_ROOT, 'viewer');
  const file = join(base, normalize(fromWorlds ? rel.slice('/worlds'.length) : rel));

  if (!file.startsWith(base)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
    res.writeHead(200, {
      'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
      'content-length': info.size,
      'cache-control': fromWorlds ? 'public, max-age=3600' : 'no-store',
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
  }
}

function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) reject(new Error('request too large'));
    });
    req.on('end', () => resolvePromise(data || '{}'));
    req.on('error', reject);
  });
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

export { METERS_PER_MILE };
