// Writing a built map to disk. Node only.

import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { MATERIALS } from '../tags.js';
import { writeGlb } from '../glb.js';
import { writeObj } from '../obj.js';

export const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * @param {{builder: object, manifest: object, place: object}} built
 * @param {{outDir: string, formats?: string[]}} opts
 * @returns {Promise<Array<[string, number]>>} what was written, with sizes
 */
export async function writeMap({ builder, manifest, place }, { outDir, formats = ['glb', 'json'] }) {
  const dir = resolve(outDir);
  await mkdir(dir, { recursive: true });
  const files = [];

  if (formats.includes('glb')) {
    const glb = writeGlb(builder, MATERIALS, {
      generator: 'map3d',
      extras: {
        origin: manifest.origin,
        radiusMeters: manifest.radiusMeters,
        attribution: manifest.attribution,
      },
    });
    await writeFile(join(dir, 'map.glb'), glb);
    files.push(['map.glb', glb.length]);
  }

  if (formats.includes('obj')) {
    const { obj, mtl } = writeObj(builder, MATERIALS, { mtlName: 'map.mtl', name: place.label });
    await writeFile(join(dir, 'map.obj'), obj);
    await writeFile(join(dir, 'map.mtl'), mtl);
    files.push(['map.obj', Buffer.byteLength(obj)], ['map.mtl', Buffer.byteLength(mtl)]);
  }

  if (formats.includes('json')) {
    const json = JSON.stringify(manifest, null, 2);
    await writeFile(join(dir, 'map.json'), json);
    files.push(['map.json', Buffer.byteLength(json)]);
  }

  if (formats.includes('glb')) {
    await copyFile(join(PKG_ROOT, 'viewer', 'index.html'), join(dir, 'index.html'));
    files.push(['index.html', 0]);
  }

  return files;
}
