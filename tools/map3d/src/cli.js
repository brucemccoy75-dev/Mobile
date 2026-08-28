// Command line front end.

import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEFAULTS, METERS_PER_MILE } from './config.js';
import { geocode } from './geocode.js';
import { Projector } from './project.js';
import { buildQuery, runQuery, normalizeElements } from './overpass.js';
import { fetchTerrain, flatTerrain } from './elevation.js';
import { fetchImagery } from './imagery.js';
import { buildScene } from './scene.js';
import { MATERIALS } from './tags.js';
import { writeGlb } from './glb.js';
import { writeObj } from './obj.js';
import { serve } from './serve.js';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const USAGE = `
map3d - build a 3D game map from a real-world address

Usage
  map3d build "<address or lat,lon>" [options]
  map3d serve [directory] [--port 8080]

Common options
  --radius <dist>        Map radius. "0.5mi" (default), "800m", "1km", or metres.
  --out <dir>            Output directory (default ./out/<slug>).
  --format <list>        glb,obj,json  (default glb,json)
  --shape <square|disc>  Ground shape (default square).

Data sources
  --geocoder <name>      nominatim (default) or google
  --google-key <key>     Google Geocoding key (or set GOOGLE_MAPS_API_KEY)
  --overpass <url>       Override the Overpass endpoint (repeatable)
  --terrain [dataset]    Fetch real elevation (default dataset aster30m)
  --elevation-url <url>  Custom OpenTopoData-compatible endpoint
  --terrain-cells <n>    Height field resolution (default ${DEFAULTS.terrainGrid})
  --imagery <template>   XYZ tile URL, e.g. "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  --imagery-zoom <n>     Force a zoom level
  --imagery-max-tiles <n>  Safety cap (default ${DEFAULTS.maxImageryTiles})

Content toggles
  --no-buildings  --no-roads  --no-areas  --no-trees  --no-barriers  --no-roofs
  --no-jitter            Do not vary heights that had to be estimated
  --level-height <m>     Metres per building level (default ${DEFAULTS.levelHeight})

Other
  --cache <dir>          Cache directory (default ${DEFAULTS.cacheDir}); --no-cache to disable
  --quiet                Only print the summary
  -h, --help

Examples
  map3d build "1600 Pennsylvania Ave NW, Washington, DC"
  map3d build "51.5007,-0.1246" --radius 800m --terrain --format glb,obj,json
  map3d build "Shibuya Crossing, Tokyo" --shape disc --no-trees
  map3d serve out/1600-pennsylvania-ave-nw-washington-dc
`;

export async function main(argv) {
  const args = parseArgs(argv);

  if (args.flags.help || args.flags.h || !args.command) {
    process.stdout.write(USAGE);
    return 0;
  }

  if (args.command === 'serve') {
    const dir = resolve(args.positionals[0] ?? '.');
    await serve(dir, { port: Number(args.flags.port ?? 8080) });
    return 0;
  }

  if (args.command !== 'build') {
    process.stderr.write(`Unknown command "${args.command}".\n${USAGE}`);
    return 1;
  }

  const address = args.positionals.join(' ').trim();
  if (!address) {
    process.stderr.write('Give me an address (or "lat,lon").\n' + USAGE);
    return 1;
  }

  const quiet = Boolean(args.flags.quiet);
  const log = quiet ? () => {} : (msg) => process.stderr.write(`${msg}\n`);

  const radius = parseDistance(args.flags.radius) ?? DEFAULTS.radiusMeters;
  const cacheDir =
    args.flags['no-cache'] ? null : resolve(String(args.flags.cache ?? DEFAULTS.cacheDir));
  const formats = String(args.flags.format ?? 'glb,json')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  /* 1. Where is it? */
  log(`Geocoding "${address}" ...`);
  const place = await geocode(address, {
    provider: args.flags.geocoder ?? 'nominatim',
    apiKey: args.flags['google-key'],
    cacheDir,
  });
  log(`  ${place.label}`);
  log(`  ${place.lat.toFixed(6)}, ${place.lon.toFixed(6)} (${place.provider})`);

  const projector = new Projector(place.lat, place.lon);
  const half = radius + DEFAULTS.groundPadding;

  /* 2. What is there? */
  const query = buildQuery(place.lat, place.lon, radius, {
    trees: args.flags['no-trees'] !== true,
    barriers: args.flags['no-barriers'] !== true,
  });
  const overpassEndpoints = toArray(args.flags.overpass).flatMap((s) => s.split(','));
  const { elements, endpoint } = await runQuery(query, {
    cacheDir,
    endpoints: overpassEndpoints,
    log,
  });
  const features = normalizeElements(elements);
  log(`  ${features.length} usable features from ${new URL(endpoint).host}`);

  /* 3. How high is the ground? */
  let terrain = flatTerrain();
  if (args.flags.terrain) {
    const dataset = typeof args.flags.terrain === 'string' ? args.flags.terrain : undefined;
    try {
      terrain = await fetchTerrain(projector, half, {
        cells: args.flags['terrain-cells'] ? Number(args.flags['terrain-cells']) : undefined,
        dataset,
        url: args.flags['elevation-url'],
        cacheDir,
        log,
      });
      log(`  elevation ${terrain.baseElevation.toFixed(1)}m at centre, ` +
          `relief ${(terrain.max - terrain.min).toFixed(1)}m`);
    } catch (err) {
      log(`  terrain unavailable (${err.message}); falling back to flat ground`);
    }
  }

  /* 4. Optional ground imagery. */
  let imagery = null;
  if (args.flags.imagery) {
    try {
      imagery = await fetchImagery(projector, half, String(args.flags.imagery), {
        zoom: args.flags['imagery-zoom'] ? Number(args.flags['imagery-zoom']) : undefined,
        maxTiles: args.flags['imagery-max-tiles']
          ? Number(args.flags['imagery-max-tiles'])
          : undefined,
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
    options: {
      shape: args.flags.shape === 'disc' ? 'disc' : 'square',
      buildings: args.flags['no-buildings'] !== true,
      roads: args.flags['no-roads'] !== true,
      areas: args.flags['no-areas'] !== true,
      trees: args.flags['no-trees'] !== true,
      barriers: args.flags['no-barriers'] !== true,
      roofs: args.flags['no-roofs'] !== true,
      jitter: args.flags['no-jitter'] !== true,
      levelHeight: args.flags['level-height'] ? Number(args.flags['level-height']) : undefined,
      terrainCells: args.flags['terrain-cells'] ? Number(args.flags['terrain-cells']) : undefined,
    },
  });

  manifest.address = { query: address, resolved: place.label, provider: place.provider };
  manifest.generatedAt = new Date().toISOString();
  manifest.attribution =
    'Map data (c) OpenStreetMap contributors, ODbL 1.0 (https://www.openstreetmap.org/copyright)';
  if (imagery) manifest.imagery = { template: imagery.template, zoom: imagery.zoom };

  /* 6. Write it out. */
  const slug = args.flags.name ? slugify(String(args.flags.name)) : slugify(address);
  const outDir = resolve(String(args.flags.out ?? join('out', slug)));
  await mkdir(outDir, { recursive: true });

  const written = [];

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
    written.push(['map.glb', glb.length]);
  }

  if (formats.includes('obj')) {
    const { obj, mtl } = writeObj(builder, MATERIALS, { mtlName: 'map.mtl', name: place.label });
    await writeFile(join(outDir, 'map.obj'), obj);
    await writeFile(join(outDir, 'map.mtl'), mtl);
    written.push(['map.obj', Buffer.byteLength(obj)]);
    written.push(['map.mtl', Buffer.byteLength(mtl)]);
  }

  if (formats.includes('json')) {
    const json = JSON.stringify(manifest, null, 2);
    await writeFile(join(outDir, 'map.json'), json);
    written.push(['map.json', Buffer.byteLength(json)]);
  }

  // Drop a self-contained viewer next to the assets.
  if (formats.includes('glb')) {
    await copyFile(join(PKG_ROOT, 'viewer', 'index.html'), join(outDir, 'index.html'));
    written.push(['index.html', 0]);
  }

  const s = manifest.stats;
  process.stdout.write(
    [
      '',
      `  ${place.label}`,
      `  centre ${place.lat.toFixed(6)}, ${place.lon.toFixed(6)}  radius ${fmtDistance(radius)}`,
      `  ${s.buildings} buildings, ${s.roads} ways, ${s.areas} areas, ${s.trees ?? 0} trees`,
      `  ${s.triangles.toLocaleString()} triangles in ${s.meshes} meshes`,
      `  -> ${outDir}`,
      ...written.map(([name, size]) => `     ${name}${size ? `  ${fmtBytes(size)}` : ''}`),
      '',
      `  Preview:  npx map3d serve ${relativeish(outDir)}`,
      '',
    ].join('\n'),
  );

  return 0;
}

/* --------------------------------- args ----------------------------------- */

export function parseArgs(argv) {
  const flags = {};
  const positionals = [];
  let command = null;

  const KNOWN_VALUE_FLAGS = new Set([
    'radius', 'out', 'name', 'format', 'shape', 'geocoder', 'google-key',
    'overpass', 'elevation-url', 'terrain-cells', 'imagery', 'imagery-zoom',
    'imagery-max-tiles', 'level-height', 'cache', 'port',
  ]);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (arg.startsWith('--')) {
      const eq = arg.indexOf('=');
      const key = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
      if (eq !== -1) {
        setFlag(flags, key, arg.slice(eq + 1));
      } else if (KNOWN_VALUE_FLAGS.has(key)) {
        setFlag(flags, key, argv[++i]);
      } else if (key === 'terrain' && argv[i + 1] && !argv[i + 1].startsWith('-')) {
        setFlag(flags, key, argv[++i]);
      } else {
        setFlag(flags, key, true);
      }
      continue;
    }
    if (arg.startsWith('-') && arg.length > 1) {
      setFlag(flags, arg.slice(1), true);
      continue;
    }
    if (command === null) command = arg;
    else positionals.push(arg);
  }

  return { command, positionals, flags };
}

function setFlag(flags, key, value) {
  if (key in flags) {
    flags[key] = toArray(flags[key]).concat(value);
  } else {
    flags[key] = value;
  }
}

function toArray(v) {
  return v == null ? [] : Array.isArray(v) ? v : [v];
}

/** "0.5mi" | "800m" | "1km" | "800" (metres) -> metres */
export function parseDistance(value) {
  if (value == null || value === true) return null;
  const m = String(value).trim().toLowerCase().match(/^([\d.]+)\s*(mi|mile|miles|m|km|ft)?$/);
  if (!m) throw new Error(`Could not read the radius "${value}". Try 0.5mi, 800m or 1km.`);
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n) || n <= 0) throw new Error(`Radius must be positive, got "${value}".`);
  switch (m[2]) {
    case 'mi': case 'mile': case 'miles': return n * METERS_PER_MILE;
    case 'km': return n * 1000;
    case 'ft': return n * 0.3048;
    default: return n;
  }
}

function fmtDistance(m) {
  return `${m.toFixed(0)}m (${(m / METERS_PER_MILE).toFixed(2)}mi)`;
}

function fmtBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 ** 2).toFixed(1)} MB`;
}

export function slugify(text) {
  return (
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'map'
  );
}

function relativeish(p) {
  const cwd = process.cwd();
  return p.startsWith(cwd + '/') ? p.slice(cwd.length + 1) : p;
}
