// Central defaults + endpoint lists for map3d.

export const USER_AGENT =
  'map3d/1.0 (OSM -> 3D game map generator; https://github.com/brucemccoy75-dev/mobile)';

export const METERS_PER_MILE = 1609.344;

// Overpass mirrors, tried in order. The first that answers with usable JSON wins.
// Add your own (or a self-hosted instance) with --overpass <url>.
// Deliberately excludes regional extracts such as overpass.osm.ch, which
// serves Switzerland and answers "200, nothing here" for everywhere else.
// As a general fallback that is worse than an error: it looks like success.
export const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://overpass.osm.jp/api/interpreter',
];

export const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';
export const GOOGLE_GEOCODE_ENDPOINT =
  'https://maps.googleapis.com/maps/api/geocode/json';

// Free elevation service. Rate limited (1 req/s, 100 points/req) — be polite.
export const OPENTOPODATA_ENDPOINT = 'https://api.opentopodata.org/v1';

// Mapzen terrain tiles on AWS Open Data: RGB-encoded elevation, global, no key.
export const TERRARIUM_ENDPOINT =
  'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';

// USGS National Land Cover Database (United States only).
export const NLCD_ENDPOINT =
  'https://www.mrlc.gov/geoserver/mrlc_display/NLCD_2021_Land_Cover_L48/wms';

export const DEFAULTS = {
  radiusMeters: 0.5 * METERS_PER_MILE, // "about a half mile"
  groundPadding: 40,        // extra ground disc beyond the queried radius (m)
  levelHeight: 3.2,         // metres per building:level
  roofLevelHeight: 2.6,     // metres per roof:levels
  terrainGrid: 128,         // ground mesh resolution when terrain is on
  terrainFlatGrid: 8,       // ground mesh resolution when it is dead flat
  treeSpacing: 15,          // mean metres between scattered trees
  maxTrees: 20000,          // safety cap on scattered trees
  maxImageryTiles: 100,     // safety cap for --imagery
  cacheDir: '.map3d-cache',
  timeoutMs: 90_000,
  retries: 3,
};

// Vertical stacking order so coplanar ground layers never z-fight.
// (metres above the terrain surface)
export const LAYER_Y = {
  ground: 0.0,
  landuse: 0.03,
  park: 0.05,
  water: 0.08,
  parking: 0.10,
  footway: 0.12,
  road: 0.15,
  railway: 0.20,
};
