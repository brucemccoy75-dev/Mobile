// Node's half of the platform seam: zlib for PNG inflate, and a disk cache.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { inflateSync } from 'node:zlib';

import { installPlatform } from '../platform.js';
import { decodePng } from '../png.js';

/**
 * @param {{cacheDir: string|null}} opts
 */
export function installNodePlatform({ cacheDir } = {}) {
  installPlatform({
    decodePng: async (bytes) => decodePng(bytes, (deflated) => inflateSync(deflated)),
    cache: cacheDir ? diskCache(cacheDir) : noCache(),
  });
}

function diskCache(dir) {
  return {
    async read(key, kind) {
      try {
        const raw = await readFile(join(dir, `${key}.${kind}`));
        return kind === 'json' ? JSON.parse(raw.toString('utf8')) : new Uint8Array(raw);
      } catch {
        return null;
      }
    },
    async write(key, value, kind) {
      const file = join(dir, `${key}.${kind}`);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, kind === 'json' ? JSON.stringify(value) : Buffer.from(value));
    },
  };
}

function noCache() {
  return { async read() { return null; }, async write() {} };
}
