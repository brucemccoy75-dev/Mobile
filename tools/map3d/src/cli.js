// Command line front end.

import { join, resolve } from 'node:path';

import { DEFAULTS, METERS_PER_MILE } from './config.js';
import { buildMap } from './pipeline.js';
import { serve } from './serve.js';
import { play } from './play.js';

/** CLI flags arrive as strings or undefined; the pipeline wants numbers. */
function num(v) {
  return v === undefined ? undefined : Number(v);
}

const USAGE = `
map3d - build a 3D game map from a real-world address

Usage
  map3d play                              Type an address, walk around it
  map3d build "<address or lat,lon>"      Build files for an engine
  map3d serve [directory] [--port 8080]   Serve an already-built map

Common options
  --radius <dist>        Map radius. "0.5mi" (default), "800m", "1km", or metres.
  --out <dir>            Output directory (default ./out/<slug>).
  --format <list>        glb,obj,json  (default glb,json)
  --shape <square|disc>  Ground shape (default square).

Terrain and ground cover (both on by default)
  --no-terrain           Build on a flat plane instead
  --elevation <name>     terrarium (default, ~7m tiles) or opentopodata
  --terrain <dataset>    OpenTopoData dataset, e.g. srtm30m
  --elevation-url <url>  Custom elevation endpoint
  --ground-cells <n>     Ground mesh resolution (default ${DEFAULTS.terrainGrid})
  --no-landcover         Skip NLCD land cover (US only; drives ground + trees)
  --tree-spacing <m>     Mean gap between scattered trees (default ${DEFAULTS.treeSpacing})
  --max-trees <n>        Cap on scattered trees (default ${DEFAULTS.maxTrees})

Data sources
  --geocoder <name>      nominatim (default) or google
  --google-key <key>     Google Geocoding key (or set GOOGLE_MAPS_API_KEY)
  --overpass <url>       Override the Overpass endpoint (repeatable)
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
  map3d play
  map3d build "1600 Pennsylvania Ave NW, Washington, DC"
  map3d build "51.5007,-0.1246" --radius 800m --format glb,obj,json
  map3d build "Shibuya Crossing, Tokyo" --shape disc --no-trees
  map3d serve out/1600-pennsylvania-ave-nw-washington-dc
`;

export async function main(argv) {
  const args = parseArgs(argv);

  if (args.flags.help || args.flags.h || !args.command) {
    process.stdout.write(USAGE);
    return 0;
  }

  if (args.command === 'play') {
    await play({
      port: Number(args.flags.port ?? 8080),
      worldsDir: args.flags.worlds ? String(args.flags.worlds) : undefined,
      cacheDir: args.flags['no-cache'] ? null : resolve(String(args.flags.cache ?? DEFAULTS.cacheDir)),
      radius: parseDistance(args.flags.radius) ?? undefined,
    });
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

  const { manifest, place, files, outDir } = await buildMap({
    address,
    radius,
    outDir: resolve(String(args.flags.out ?? join('out',
      args.flags.name ? slugify(String(args.flags.name)) : slugify(address)))),
    formats,
    cacheDir,
    log,
    geocoder: args.flags.geocoder,
    googleKey: args.flags['google-key'],
    overpass: toArray(args.flags.overpass).flatMap((s) => s.split(',')),
    terrain: args.flags['no-terrain'] !== true,
    terrainOptions: {
      provider: args.flags.elevation,
      cells: num(args.flags['terrain-cells']),
      dataset: typeof args.flags.terrain === 'string' ? args.flags.terrain : undefined,
      url: args.flags['elevation-url'],
      zoom: num(args.flags['elevation-zoom']),
    },
    landcover: args.flags['no-landcover'] !== true,
    landcoverOptions: {
      url: args.flags['landcover-url'],
      layer: args.flags['landcover-layer'],
    },
    imagery: args.flags.imagery ? String(args.flags.imagery) : undefined,
    imageryOptions: {
      zoom: num(args.flags['imagery-zoom']),
      maxTiles: num(args.flags['imagery-max-tiles']),
    },
    scene: {
      shape: args.flags.shape === 'disc' ? 'disc' : 'square',
      buildings: args.flags['no-buildings'] !== true,
      roads: args.flags['no-roads'] !== true,
      areas: args.flags['no-areas'] !== true,
      trees: args.flags['no-trees'] !== true,
      barriers: args.flags['no-barriers'] !== true,
      roofs: args.flags['no-roofs'] !== true,
      jitter: args.flags['no-jitter'] !== true,
      levelHeight: num(args.flags['level-height']),
      terrainCells: num(args.flags['ground-cells']),
      treeSpacing: num(args.flags['tree-spacing']),
      maxTrees: num(args.flags['max-trees']),
    },
  });
  const written = files;

  const s = manifest.stats;
  process.stdout.write(
    [
      '',
      `  ${place.label}`,
      `  centre ${place.lat.toFixed(6)}, ${place.lon.toFixed(6)}  radius ${fmtDistance(radius)}`,
      `  ${s.buildings} buildings, ${s.roads} ways, ${s.areas} areas`,
      `  ${s.trees ?? 0} trees (${s.treesMapped ?? 0} mapped in OSM, ${s.treesScattered ?? 0} scattered)`,
      `  ${s.triangles.toLocaleString()} triangles in ${s.meshes} meshes`,
      `  -> ${outDir}`,
      ...written.map(([name, size]) => `     ${name}${size ? `  ${fmtBytes(size)}` : ''}`),
      '',
      `  Preview:  ${invocation()} serve ${relativeish(outDir)}`,
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
    'overpass', 'worlds', 'elevation', 'elevation-url', 'elevation-zoom', 'terrain-cells',
    'ground-cells', 'landcover-url', 'landcover-layer', 'tree-spacing',
    'max-trees', 'imagery', 'imagery-zoom', 'imagery-max-tiles', 'level-height',
    'cache', 'port',
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

/** However the user launched us, hand them back a command that works. */
function invocation() {
  const entry = process.argv[1];
  if (!entry) return 'map3d';
  if (/[\\/]node_modules[\\/]/.test(entry) || /[\\/]\.bin[\\/]/.test(entry)) return 'map3d';
  return `node ${relativeish(resolve(entry))}`;
}

function relativeish(p) {
  const cwd = process.cwd();
  return p.startsWith(cwd + '/') ? p.slice(cwd.length + 1) : p;
}
