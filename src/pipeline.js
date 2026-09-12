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
import { fetchPlaceFacts, fetchLandmarkBlurbs } from './lore.js';
import { fetchImagery, imageryCredit } from './imagery.js';
import { fetchFootprints, mergeFootprints, USA_STRUCTURES_CREDIT } from './footprints.js';
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
  let features = normalizeElements(elements);
  log(`  ${features.length} usable features from ${new URL(endpoint).host}`);

  /* 2b. The buildings OSM does not know about (US only). */
  const credits = [];
  let footprintStats;
  if (o.footprints !== false && scene.buildings !== false) {
    try {
      const footprints = await fetchFootprints(projector, half, { ...o.footprintOptions, log });
      const merged = mergeFootprints(features, footprints, projector);
      features = merged.features;
      footprintStats = { fetched: footprints.length, added: merged.added, dropped: merged.dropped };
      if (footprints.length) {
        credits.push(USA_STRUCTURES_CREDIT);
        log(`  ${footprints.length} structures from USA Structures, ${merged.added} new to OSM`);
      }
    } catch (err) {
      log(`  footprints unavailable (${err.message}); using OSM buildings only`);
    }
  }

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
      log(
        imagery.zoom != null
          ? `  ${imagery.tiles.length} imagery tiles at zoom ${imagery.zoom}`
          : `  ${imagery.tiles.length} imagery tiles at ${imagery.metersPerPixel.toFixed(2)} m/px`,
      );
      const credit = imageryCredit(o.imagery);
      if (credit) credits.push(credit);
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
    options: { homeTarget: place.address, ...scene },
  });

  manifest.address = { query: o.address, resolved: place.label, provider: place.provider };

  /* 6. What the place is. */
  if (o.lore !== false) {
    log('Looking the place up ...');
    try {
      const facts = await fetchPlaceFacts(place, { log });
      if (facts) manifest.place = facts;
      await fetchLandmarkBlurbs(manifest.props, { log });
    } catch (err) {
      log(`  lore skipped: ${err.message}`);
    }
  }
  if (footprintStats) manifest.stats.footprints = footprintStats;
  if (credits.length) manifest.credits = credits;
  if (manifest.home) {
    log(
      `  home: ${manifest.home.address ?? manifest.home.buildingId} ` +
        `(${manifest.home.reason}); spawn on the doorstep at ` +
        `${manifest.spawn.x}, ${manifest.spawn.z}`,
    );
  } else {
    log('  home: no house found near the pin; spawning at the address point');
  }
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
