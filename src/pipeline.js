// The build pipeline, as a plain function.
//
// The CLI and the `play` server both call this. Keeping it separate from
// argument parsing means the server never has to fake a command line, and the
// whole thing stays testable without spawning a process.

import { DEFAULTS } from './config.js';
import { geocode } from './geocode.js';
import { Projector } from './project.js';
import { buildQuery, runQuery, normalizeElements } from './overpass.js';
import { fetchTerrain, flatTerrain } from './elevation.js';
import { fetchLandcover } from './landcover.js';
import { fetchImagery } from './imagery.js';
import { buildScene } from './scene.js';

/**
 * Geocode -> fetch -> build. Writing files is the host's job: Node saves a
 * .glb, the browser hands the mesh groups straight to three.js.
 *
 * @param {object} o
 * @param {string} o.address        street address, place name, or "lat,lon"
 * @param {number} [o.radius]       metres
 * @param {(msg: string) => void} [o.log]
 * @param {object} [o.scene]        overrides passed through to buildScene
 * @returns {Promise<{manifest: object, place: object, builder: import('./mesh.js').MeshBuilder}>}
 */
export async function buildMap(o = {}) {
  const log = o.log ?? (() => {});
  const radius = o.radius ?? DEFAULTS.radiusMeters;
  const scene = o.scene ?? {};

  /* 1. Where is it? */
  log(`Geocoding "${o.address}" ...`);
  const place = await geocode(o.address, {
    provider: o.geocoder ?? 'nominatim',
    apiKey: o.googleKey,
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
    endpoints: o.overpass,
    log,
  });
  const features = normalizeElements(elements);
  log(`  ${features.length} usable features from ${new URL(endpoint).host}`);

  /* 3. How high is the ground? */
  let terrain = flatTerrain();
  if (o.terrain !== false) {
    try {
      terrain = await fetchTerrain(projector, half, { ...o.terrainOptions, log });
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
      landcover = await fetchLandcover(projector, half, { ...o.landcoverOptions, log });
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

  // Terrain and land cover come from different services than OSM, so a map can
  // finish looking plausible - ground, trees - while carrying nothing built.
  // Say so rather than letting it pass for a real place.
  const { buildings, roads } = manifest.stats;
  if (buildings === 0 && roads === 0) {
    manifest.warning =
      'No buildings or roads came back from OpenStreetMap for this location. ' +
      'Either it really is empty, or the map data service was unreachable.';
    log(`  WARNING: ${manifest.warning}`);
  }

  return { manifest, place, builder };
}
