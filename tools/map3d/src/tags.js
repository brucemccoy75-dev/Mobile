// OSM tag interpretation: what a feature *is*, how tall/wide it is, what
// colour it gets. Everything the look of the map depends on lives here, so
// this is the file to edit when you want a different art direction.

import { DEFAULTS } from './config.js';

/* ------------------------------ unit parsing ------------------------------ */

/**
 * OSM heights are messy: "12", "12 m", "12.5m", "40'", "40'6\"", "0.5 km".
 * Returns metres, or null when we can't make sense of it.
 */
export function parseLength(value) {
  if (value == null) return null;
  const s = String(value).trim().toLowerCase();
  if (!s) return null;

  // feet and inches: 40', 40'6", 40 ft
  const ftIn = s.match(/^(-?[\d.]+)\s*(?:'|ft|feet)\s*(?:([\d.]+)\s*(?:"|in)?)?$/);
  if (ftIn) {
    const ft = parseFloat(ftIn[1]);
    const inch = ftIn[2] ? parseFloat(ftIn[2]) : 0;
    if (Number.isFinite(ft)) return ft * 0.3048 + inch * 0.0254;
  }

  const m = s.match(/^(-?[\d.]+)\s*(m|metre|metres|meter|meters|km|cm)?$/);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  switch (m[2]) {
    case 'km': return n * 1000;
    case 'cm': return n / 100;
    default: return n;
  }
}

export function parseIntTag(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

/* ------------------------------- categories ------------------------------- */

// Fallback heights (metres) by building type, used when OSM has neither
// `height` nor `building:levels`. Tuned to look plausible in a game, not to be
// surveyed truth.
const BUILDING_FALLBACK_HEIGHT = {
  house: 6.5,
  detached: 6.5,
  bungalow: 4.5,
  hut: 3,
  shed: 2.8,
  garage: 2.8,
  garages: 3,
  carport: 2.6,
  cabin: 4,
  static_caravan: 3,
  terrace: 8,
  semidetached_house: 7,
  residential: 9,
  apartments: 15,
  dormitory: 15,
  hotel: 20,
  commercial: 12,
  office: 20,
  retail: 8,
  supermarket: 8,
  kiosk: 3,
  warehouse: 10,
  industrial: 10,
  factory: 12,
  hangar: 14,
  school: 9,
  university: 15,
  college: 12,
  hospital: 18,
  church: 14,
  cathedral: 30,
  chapel: 9,
  mosque: 14,
  synagogue: 12,
  temple: 12,
  stadium: 22,
  sports_hall: 12,
  train_station: 12,
  parking: 10,
  roof: 4,
  greenhouse: 4,
  farm_auxiliary: 5,
  barn: 8,
  silo: 16,
  storage_tank: 12,
  water_tower: 25,
  civic: 12,
  public: 14,
  government: 16,
  yes: 8,
};

/** Colour + height bucket for a building, from its tags. */
export function classifyBuilding(tags) {
  const type =
    tags.building && tags.building !== 'yes'
      ? tags.building
      : tags['building:part'] && tags['building:part'] !== 'yes'
        ? tags['building:part']
        : tags.amenity || tags.shop || tags.office || 'yes';

  let material = 'building_generic';
  if (/^(house|detached|semidetached_house|terrace|bungalow|residential|apartments|dormitory|cabin|static_caravan)$/.test(type)) {
    material = 'building_residential';
  } else if (/^(commercial|retail|supermarket|office|hotel|kiosk|shop|mall)$/.test(type)) {
    material = 'building_commercial';
  } else if (/^(industrial|warehouse|factory|hangar|silo|storage_tank|works)$/.test(type)) {
    material = 'building_industrial';
  } else if (/^(church|cathedral|chapel|mosque|synagogue|temple|shrine|monastery)$/.test(type)) {
    material = 'building_civic';
  } else if (/^(school|university|college|hospital|civic|public|government|train_station|museum|library|stadium)$/.test(type)) {
    material = 'building_civic';
  } else if (/^(shed|garage|garages|hut|carport|roof|greenhouse|barn|farm_auxiliary)$/.test(type)) {
    material = 'building_outbuilding';
  }

  return { type, material };
}

/**
 * Resolves a building's vertical extent.
 * @returns {{base: number, top: number, roofHeight: number, roofShape: string, estimated: boolean}}
 */
export function buildingHeights(tags, opts = {}) {
  const levelHeight = opts.levelHeight ?? DEFAULTS.levelHeight;
  const roofLevelHeight = opts.roofLevelHeight ?? DEFAULTS.roofLevelHeight;

  let estimated = false;

  // `height` in OSM is the *total* height including the roof.
  let total =
    parseLength(tags.height) ??
    parseLength(tags['building:height']) ??
    null;

  const levels =
    parseIntTag(tags['building:levels']) ?? parseIntTag(tags['levels']) ?? null;

  const roofShape = (tags['roof:shape'] ?? 'flat').toLowerCase();
  let roofHeight =
    parseLength(tags['roof:height']) ??
    (parseIntTag(tags['roof:levels']) != null
      ? parseIntTag(tags['roof:levels']) * roofLevelHeight
      : null);

  if (total == null && levels != null) {
    total = levels * levelHeight + 1.0; // parapet / floor slab
  }
  if (total == null) {
    const { type } = classifyBuilding(tags);
    total = BUILDING_FALLBACK_HEIGHT[type] ?? BUILDING_FALLBACK_HEIGHT.yes;
    estimated = true;
  }

  if (roofHeight == null) {
    roofHeight = roofShape === 'flat' ? 0 : Math.min(total * 0.3, 5);
  }
  // The roof has to fit inside the total height.
  roofHeight = Math.max(0, Math.min(roofHeight, total * 0.8));

  const base =
    parseLength(tags.min_height) ??
    (parseIntTag(tags['building:min_level']) != null
      ? parseIntTag(tags['building:min_level']) * levelHeight
      : 0);

  return {
    base: Math.max(0, base),
    top: Math.max(base + 1, total),
    roofHeight,
    roofShape,
    estimated,
  };
}

/* --------------------------------- roads ---------------------------------- */

// Carriageway width in metres by highway class (excludes verges/sidewalks).
const ROAD_WIDTH = {
  motorway: 14,
  motorway_link: 7,
  trunk: 12,
  trunk_link: 6.5,
  primary: 11,
  primary_link: 6,
  secondary: 9.5,
  secondary_link: 5.5,
  tertiary: 8,
  tertiary_link: 5,
  unclassified: 6.5,
  residential: 6.5,
  living_street: 5.5,
  service: 4.5,
  pedestrian: 5,
  track: 3.5,
  road: 6.5,
  busway: 7,
  bus_guideway: 7,
  raceway: 9,
  footway: 1.8,
  path: 1.5,
  cycleway: 2.5,
  bridleway: 2,
  steps: 1.8,
  corridor: 2,
};

const MINOR_WAYS = /^(footway|path|cycleway|bridleway|steps|corridor|pedestrian|track)$/;

/** @returns {{material: string, width: number, minor: boolean}|null} */
export function classifyHighway(tags) {
  const hw = tags.highway;
  if (!hw) return null;
  if (hw === 'proposed' || hw === 'construction' || hw === 'planned') return null;

  const explicit = parseLength(tags.width) ?? parseLength(tags['carriageway_width']);
  const lanes = parseIntTag(tags.lanes);
  const base = ROAD_WIDTH[hw] ?? 5;
  const minor = MINOR_WAYS.test(hw);

  let width = explicit ?? (lanes && !minor ? Math.max(lanes * 3.4, 3.4) : base);
  // One-way residential streets tagged with lanes=1 still need room to drive.
  width = Math.max(width, minor ? 1.2 : 3.0);

  let material = 'road_minor';
  if (/^(motorway|trunk|primary)/.test(hw)) material = 'road_major';
  else if (/^(secondary|tertiary)/.test(hw)) material = 'road_secondary';
  else if (minor) material = 'path';
  else if (hw === 'service') material = 'road_service';

  return { material, width, minor, kind: hw };
}

/* ------------------------------ area features ----------------------------- */

/**
 * Ground-level area features (water, parks, parking, ...).
 * @returns {{material: string, layer: string}|null}
 */
export function classifyArea(tags) {
  const t = tags;

  if (t.natural === 'water' || t.waterway === 'riverbank' || t.landuse === 'reservoir' ||
      t.landuse === 'basin' || t.water) {
    return { material: 'water', layer: 'water' };
  }
  if (t.natural === 'beach' || t.natural === 'sand') {
    return { material: 'sand', layer: 'landuse' };
  }
  if (t.natural === 'wood' || t.landuse === 'forest') {
    return { material: 'forest', layer: 'park' };
  }
  if (t.natural === 'scrub' || t.natural === 'heath') {
    return { material: 'scrub', layer: 'park' };
  }
  if (
    t.leisure === 'park' || t.leisure === 'garden' || t.leisure === 'nature_reserve' ||
    t.landuse === 'grass' || t.landuse === 'meadow' || t.landuse === 'village_green' ||
    t.landuse === 'recreation_ground' || t.natural === 'grassland'
  ) {
    return { material: 'grass', layer: 'park' };
  }
  if (t.leisure === 'pitch' || t.leisure === 'track' || t.leisure === 'golf_course') {
    return { material: 'pitch', layer: 'park' };
  }
  if (t.amenity === 'parking' || t.amenity === 'parking_space') {
    return { material: 'parking', layer: 'parking' };
  }
  if (t.landuse === 'cemetery' || t.amenity === 'grave_yard') {
    return { material: 'grass', layer: 'park' };
  }
  if (t.landuse === 'farmland' || t.landuse === 'farmyard' || t.landuse === 'orchard' ||
      t.landuse === 'vineyard' || t.landuse === 'allotments') {
    return { material: 'farmland', layer: 'landuse' };
  }
  if (t.landuse === 'industrial' || t.landuse === 'railway' || t.landuse === 'quarry' ||
      t.landuse === 'construction' || t.landuse === 'brownfield') {
    return { material: 'industrial_ground', layer: 'landuse' };
  }
  if (t.landuse === 'retail' || t.landuse === 'commercial') {
    return { material: 'urban_ground', layer: 'landuse' };
  }
  if (t.area === 'yes' && t.highway === 'pedestrian') {
    return { material: 'pavement', layer: 'footway' };
  }
  return null;
}

/**
 * How thickly each ground material should be treed when we scatter.
 * OSM's own polygons win over any raster land cover, so an explicitly mapped
 * lawn stays a lawn even where the satellite record says forest.
 */
export const AREA_CANOPY = {
  forest: 1,
  scrub: 0.3,
};

/** Linear water (streams, canals) rendered as ribbons. */
export function classifyWaterway(tags) {
  const w = tags.waterway;
  if (!w) return null;
  if (!/^(river|stream|canal|ditch|drain)$/.test(w)) return null;
  const width =
    parseLength(tags.width) ??
    { river: 20, canal: 12, stream: 4, ditch: 2, drain: 2 }[w];
  return { material: 'water', width, layer: 'water' };
}

export function classifyRailway(tags) {
  const r = tags.railway;
  if (!r) return null;
  if (!/^(rail|light_rail|subway|tram|narrow_gauge|monorail|funicular)$/.test(r)) return null;
  if (tags.tunnel === 'yes' || r === 'subway') return null; // underground, skip
  return { material: 'railway', width: r === 'tram' ? 3 : 4.5, layer: 'railway' };
}

/* -------------------------------- materials ------------------------------- */

// PBR-ish material palette. Colours are sRGB in 0..1 (pick them the way you
// would in any colour picker); the glTF writer converts them to linear.
export const MATERIALS = {
  ground:             { color: [0.47, 0.48, 0.44], roughness: 1.0, metallic: 0 },
  urban_ground:       { color: [0.52, 0.51, 0.49], roughness: 1.0, metallic: 0 },
  industrial_ground:  { color: [0.47, 0.46, 0.44], roughness: 1.0, metallic: 0 },
  grass:              { color: [0.36, 0.52, 0.27], roughness: 1.0, metallic: 0 },
  forest:             { color: [0.22, 0.38, 0.20], roughness: 1.0, metallic: 0 },
  scrub:              { color: [0.42, 0.46, 0.30], roughness: 1.0, metallic: 0 },
  pitch:              { color: [0.40, 0.56, 0.32], roughness: 1.0, metallic: 0 },
  farmland:           { color: [0.55, 0.51, 0.34], roughness: 1.0, metallic: 0 },
  sand:               { color: [0.78, 0.71, 0.52], roughness: 1.0, metallic: 0 },
  water:              { color: [0.16, 0.34, 0.52], roughness: 0.15, metallic: 0.0 },
  parking:            { color: [0.33, 0.33, 0.34], roughness: 0.95, metallic: 0 },
  pavement:           { color: [0.58, 0.57, 0.55], roughness: 1.0, metallic: 0 },
  path:               { color: [0.62, 0.56, 0.47], roughness: 1.0, metallic: 0 },
  road_major:         { color: [0.21, 0.21, 0.22], roughness: 0.9, metallic: 0 },
  road_secondary:     { color: [0.24, 0.24, 0.25], roughness: 0.9, metallic: 0 },
  road_minor:         { color: [0.27, 0.27, 0.28], roughness: 0.9, metallic: 0 },
  road_service:       { color: [0.31, 0.31, 0.32], roughness: 0.95, metallic: 0 },
  railway:            { color: [0.29, 0.26, 0.24], roughness: 0.9, metallic: 0.1 },
  building_generic:      { color: [0.72, 0.70, 0.66], roughness: 0.85, metallic: 0 },
  building_residential:  { color: [0.78, 0.71, 0.62], roughness: 0.9, metallic: 0 },
  building_commercial:   { color: [0.66, 0.68, 0.72], roughness: 0.7, metallic: 0.05 },
  building_industrial:   { color: [0.60, 0.60, 0.58], roughness: 0.9, metallic: 0.05 },
  building_civic:        { color: [0.80, 0.77, 0.70], roughness: 0.8, metallic: 0 },
  building_outbuilding:  { color: [0.62, 0.58, 0.52], roughness: 0.95, metallic: 0 },
  roof:               { color: [0.42, 0.36, 0.33], roughness: 0.9, metallic: 0 },
  wall:               { color: [0.55, 0.54, 0.51], roughness: 0.95, metallic: 0 },
  tree:               { color: [0.24, 0.42, 0.22], roughness: 1.0, metallic: 0 },
  trunk:              { color: [0.32, 0.24, 0.17], roughness: 1.0, metallic: 0 },
  imagery:            { color: [1, 1, 1], roughness: 1.0, metallic: 0 },
};
