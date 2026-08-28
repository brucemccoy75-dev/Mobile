// The build pipeline, as a plain function.
//
// The CLI and the `play` server both call this. Keeping it separate from
// argument parsing means the server never has to fake a command line, and the
// whole thing stays testable without spawning a process.

import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULTS } from './config.js';
import { geocode } from './geocode.js';
import { Projector } from './project.js';
import { buildQuery, runQuery, normalizeElements } from './overpass.js';
import { fetchTerrain, flatTerrain } from './elevation.js';
import { fetchLandcover } from './landcover.js';
import { fetchImagery } from './imagery.js';
import { buildScene } from './scene.js';
import { MATERIALS } from './tags.js';
import { writeGlb } from './glb.js';
import { writeObj } from './obj.js';

export const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Geocode -> fetch -> build -> write.
 *
 * @param {object} o
 * @param {string} o.address        street address, place name, or "lat,lon"
 * @param {number} [o.radius]       metres
 * @param {string} [o.outDir]       where to write; omit to skip writing
 * @param {string[]} [o.formats]    any of 'glb', 'obj', 'json'
 * @param {string|null} [o.cacheDir]
 * @param {(msg: string) => void} [o.log]
 * @param {object} [o.scene]        overrides passed through to buildScene
 * @returns {Promise<{manifest: object, place: object, files: Array<[string, number]>, outDir: string|null}>}
 */
export async function buildMap(o = {}) {
  const log = o.log ?? (() => {});
  const radius = o.radius ?? DEFAULTS.radiusMeters;
  const cacheDir = o.cacheDir === undefined ? resolve(DEFAULTS.cacheDir) : o.cacheDir;
  const formats = o.formats ?? ['glb', 'json'];
  const scene = o.scene ?? {};

  /* 1. Where is it? */
  log(`Geocoding "${o.address}" ...`);
  const place = await geocode(o.address, {
    provider: o.geocoder ?? 'nominatim',
    apiKey: o.googleKey,
    cacheDir,
  });
  log(`  ${place.label}`);
  log(`  ${place.lat.toFixed(6)}, ${place.lon.toFixed(6)} (${place.provider})`);

  const projector = new Projector(place.lat, place.lon);
  const half = radius + DEFAULTS.groundPadding;

  /* 2. What is there? */
  const query = buildQuery(place.lat, place.lon, radius, {
    trees: scene.trees !== false,
    barriers: scene.barriers !== false,
  });
  const { elements, endpoint } = await runQuery(query, {
    cacheDir,
    endpoints: o.overpass,
    log,
  });
  const features = normalizeElements(elements);
  log(`  ${features.length} usable features from ${new URL(endpoint).host}`);

  /* 3. How high is the ground? */
  let terrain = flatTerrain();
  if (o.terrain !== false) {
    try {
      terrain = await fetchTerrain(projector, half, { ...o.terrainOptions, cacheDir, log });
      log(
        `  ground ${terrain.baseElevation.toFixed(0)}m at centre, ` +
          `${(terrain.max - terrain.min).toFixed(0)}m of relief ` +
          `(${terrain.provider}, ${terrain.resolutionMeters.toFixed(1)}m samples)`,
      );
    } catch (err) {
      log(`  terrain unavailable (${err.message}); falling back to flat ground`);
      terrain = flatTerrain();
    }
  }

  /* 3b. What is the ground made of? */
  let landcover = null;
  if (o.landcover !== false) {
    try {
      landcover = await fetchLandcover(projector, half, { ...o.landcoverOptions, cacheDir, log });
      if (landcover) log(`  land cover: ${landcover.summary.join(', ')}`);
      else log('  land cover: no coverage here (outside the US); using OSM only');
    } catch (err) {
      log(`  land cover unavailable (${err.message}); using OSM only`);
    }
  }

  /* 4. Optional ground imagery. */
  let imagery = null;
  if (o.imagery) {
    try {
      imagery = await fetchImagery(projector, half, o.imagery, {
        ...o.imageryOptions,
        cacheDir,
        log,
      });
      log(`  ${imagery.tiles.length} imagery tiles at zoom ${imagery.zoom}`);
    } catch (err) {
      log(`  imagery unavailable (${err.message}); using flat ground colour`);
    }
  }

  /* 5. Build the geometry. */
  log('Building geometry ...');
  const { builder, manifest } = buildScene({
    projector,
    features,
    terrain,
    radius,
    imagery,
    landcover,
    options: scene,
  });

  manifest.address = { query: o.address, resolved: place.label, provider: place.provider };
  manifest.generatedAt = new Date().toISOString();
  manifest.attribution =
    'Map data (c) OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)';
  if (imagery) manifest.imagery = { template: imagery.template, zoom: imagery.zoom };

  /* 6. Write it out. */
  const files = [];
  if (!o.outDir) return { manifest, place, files, outDir: null, builder };

  const outDir = resolve(o.outDir);
  await mkdir(outDir, { recursive: true });

  if (formats.includes('glb')) {
    const glb = writeGlb(builder, MATERIALS, {
      generator: 'map3d',
      extras: {
        origin: manifest.origin,
        radiusMeters: manifest.radiusMeters,
        attribution: manifest.attribution,
      },
    });
    await writeFile(join(outDir, 'map.glb'), glb);
    files.push(['map.glb', glb.length]);
  }

  if (formats.includes('obj')) {
    const { obj, mtl } = writeObj(builder, MATERIALS, {
      mtlName: 'map.mtl',
      name: place.label,
    });
    await writeFile(join(outDir, 'map.obj'), obj);
    await writeFile(join(outDir, 'map.mtl'), mtl);
    files.push(['map.obj', Buffer.byteLength(obj)], ['map.mtl', Buffer.byteLength(mtl)]);
  }

  if (formats.includes('json')) {
    const json = JSON.stringify(manifest, null, 2);
    await writeFile(join(outDir, 'map.json'), json);
    files.push(['map.json', Buffer.byteLength(json)]);
  }

  if (formats.includes('glb')) {
    await copyFile(join(PKG_ROOT, 'viewer', 'index.html'), join(outDir, 'index.html'));
    files.push(['index.html', 0]);
  }

  return { manifest, place, files, outDir, builder };
}
