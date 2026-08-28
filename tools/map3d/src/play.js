// `map3d play` - serves the shell locally.
//
// The shell itself is the same static site that gets published to GitHub
// Pages: web/index.html plus web/app.js, importing the modules in src/. The
// map is built in the browser either way, so there is exactly one
// implementation of the address screen and the walker, and running locally
// only differs in where the files come from.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

import { PKG_ROOT } from './node/write.js';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/** Maps a URL path onto a file inside the package. */
function resolveRequest(pathname) {
  const rel = normalize(decodeURIComponent(pathname));
  if (rel === '/' || rel === '/index.html') return join(PKG_ROOT, 'web', 'index.html');
  if (rel.startsWith('/src/')) return join(PKG_ROOT, rel);
  return join(PKG_ROOT, 'web', rel);
}

export function play(opts = {}) {
  const port = opts.port ?? 8080;

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://localhost');
      const file = resolveRequest(url.pathname);

      // normalize() has already collapsed "..", so a path that still escapes
      // the package is an attempt at traversal.
      if (!file.startsWith(PKG_ROOT)) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      const info = await stat(file);
      if (!info.isFile()) throw new Error('not a file');

      res.writeHead(200, {
        'content-type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
        'content-length': info.size,
        'cache-control': 'no-store',
      });
      createReadStream(file).pipe(res);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
    }
  });

  return new Promise((resolvePromise, reject) => {
    server.on('error', reject);
    server.listen(port, () => {
      process.stdout.write(
        `\n  map3d is running: http://localhost:${port}/\n` +
          `  maps are built in the browser and cached there\n  Ctrl-C to stop\n\n`,
      );
      resolvePromise(server);
    });
  });
}
