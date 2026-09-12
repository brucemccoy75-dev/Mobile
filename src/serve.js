// Minimal static file server for previewing a generated map.
// Deliberately tiny: no dependencies, no directory traversal, no caching.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.obj': 'text/plain; charset=utf-8',
  '.mtl': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

export function serve(root, opts = {}) {
  const base = resolve(root);
  const port = opts.port ?? 8080;

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      let rel = decodeURIComponent(url.pathname);
      if (rel.endsWith('/')) rel += 'index.html';

      // normalize() collapses ".."; the prefix check then rejects escapes.
      const file = join(base, normalize(rel));
      if (!file.startsWith(base)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const info = await stat(file);
      if (!info.isFile()) {
        res.writeHead(404).end('Not found');
        return;
      }

      res.writeHead(200, {
        'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
        'content-length': info.size,
        'cache-control': 'no-store',
      });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });

  return new Promise((resolvePromise, reject) => {
    server.on('error', reject);
    server.listen(port, () => {
      process.stdout.write(`\n  map3d viewer: http://localhost:${port}/\n  serving ${base}\n  Ctrl-C to stop\n\n`);
      resolvePromise(server);
    });
  });
}
