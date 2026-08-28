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
// Heights to the eave, not to the ridge: whatever roof the building ends up
// with is added on top. For flat-roofed types the two are the same thing.
const BUILDING_FALLBACK_HEIGHT = {
  house: 5.6,
  detached: 5.6,
  bungalow: 3.1,
  hut: 2.4,
  shed: 2.4,
  garage: 2.5,
  garages: 2.8,
  carport: 2.4,
  cabin: 3.2,
  static_caravan: 2.6,
  terrace: 6.4,
  semidetached_house: 5.8,
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
  church: 11,
  cathedral: 30,
  chapel: 6.5,
  mosque: 14,
  synagogue: 12,
  temple: 12,
  stadium: 22,
  sports_hall: 12,
  train_station: 12,
  parking: 10,
  roof: 4,
  greenhouse: 4,
  farm_auxiliary: 4.2,
  barn: 6.5,
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

// Building types that are shaped like houses: pitched roof, close to the
// ground, and the ones a half-mile map is mostly made of. Everything else keeps
// the flat top it had, because a supermarket with a gable on it looks worse
// than a supermarket with a flat roof.
const PITCHED = /^(house|detached|semidetached_house|terrace|bungalow|cabin|static_caravan|hut|cottage|farm|shed|garage|garages|carport|barn|farm_auxiliary|chapel)$/;

/**
 * What shape of roof to put on a building OSM says nothing about.
 *
 * Most buildings carry no `roof:shape`, and defaulting all of them to flat is
 * what makes a residential street read as a row of shoeboxes. A house has a
 * pitched roof; which pitch is a coin flip, so it is a deterministic one,
 * because a street where every roof faces the same way looks stamped out.
 */
export function inferRoofShape(type, footprintM2, seed = 0) {
  if (PITCHED.test(type)) {
    // A small near-square outbuilding reads better as a pyramid than a gable.
    if (footprintM2 > 0 && footprintM2 < 30 && seed % 5 === 0) return 'pyramidal';
    return seed % 3 === 0 ? 'hipped' : 'gabled';
  }
  // Small blocks of flats and older civic buildings usually have a pitch too;
  // a big footprint almost never does.
  if (/^(residential|apartments|dormitory|school|church|public)$/.test(type)) {
    return footprintM2 > 0 && footprintM2 < 260 ? 'gabled' : 'flat';
  }
  return 'flat';
}

/**
 * Resolves a building's vertical extent.
 * @returns {{base: number, top: number, roofHeight: number, roofShape: string, estimated: boolean}}
 */
export function buildingHeights(tags, opts = {}) {
  const levelHeight = opts.levelHeight ?? DEFAULTS.levelHeight;
  const roofLevelHeight = opts.roofLevelHeight ?? DEFAULTS.roofLevelHeight;
  const { type } = classifyBuilding(tags);

  const roofShape = tags['roof:shape']
    ? String(tags['roof:shape']).toLowerCase()
    : inferRoofShape(type, opts.footprintM2 ?? 0, opts.seed ?? 0);

  let roofHeight =
    parseLength(tags['roof:height']) ??
    (parseIntTag(tags['roof:levels']) != null
      ? parseIntTag(tags['roof:levels']) * roofLevelHeight
      : null) ??
    pitchedRoofHeight(roofShape, opts.spanM ?? 0);

  // OSM's two ways of stating a height mean different things, and the roof is
  // the difference: `height` is to the ridge, `building:levels` counts storeys
  // and says nothing about what sits on top of them.
  const stated = parseLength(tags.height) ?? parseLength(tags['building:height']);
  const levels = parseIntTag(tags['building:levels']) ?? parseIntTag(tags['levels']);

  let total;
  let estimated = false;
  if (stated != null) {
    total = stated;
    // Believe the number, and fit the roof inside it.
    roofHeight = Math.min(roofHeight, total * 0.45);
  } else {
    // Both of these give the height of the walls, so the roof goes on top.
    // A roof taller than the walls it sits on is a spire, not a house.
    const eave = levels != null
      ? levels * levelHeight
      : BUILDING_FALLBACK_HEIGHT[type] ?? BUILDING_FALLBACK_HEIGHT.yes;
    roofHeight = Math.min(roofHeight, eave * 0.6);
    total = eave + (roofHeight > 0 ? roofHeight : levels != null ? 1.0 : 0);
    estimated = levels == null;
  }

  roofHeight = Math.max(0, Math.min(roofHeight, total * 0.6));

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

/**
 * How high a pitched roof stands, from how wide the building is.
 *
 * Deriving it from the building's height instead - the obvious shortcut - puts
 * a 2m rise on a 19m span, which is a 12 degree pitch: from the air it reads as
 * a flat slab with a crease in it. Roofs are pitched at an angle, so the span
 * is what sets the height. The cap keeps a barn from growing a spire.
 */
function pitchedRoofHeight(shape, spanM) {
  if (shape === 'flat' || !(spanM > 0)) return shape === 'flat' ? 0 : 2;
  if (shape === 'skillion') return Math.min(Math.max(spanM * 0.25, 1), 3.5);
  return Math.min(Math.max(Math.tan((30 * Math.PI) / 180) * (spanM / 2), 1.5), 4.5);
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

/* -------------------------------- colouring ------------------------------- */

// The handful of colour names that actually turn up in `building:colour`.
// OSM allows any CSS colour; the long tail is not worth carrying.
const NAMED_COLORS = {
  white: '#f2f0ec', black: '#26242a', grey: '#8d8d8d', gray: '#8d8d8d',
  silver: '#c0c0c0', red: '#9e3b32', maroon: '#6b2b2b', brown: '#7a5a42',
  tan: '#c8ab84', beige: '#ddd0b4', cream: '#ece3cc', yellow: '#d8c479',
  orange: '#c8813f', green: '#4d6b45', olive: '#7a7a45', blue: '#4a6684',
  navy: '#33445c', purple: '#6a5372', pink: '#d6a9a9', sandstone: '#cbb391',
  terracotta: '#a5563a', slate: '#4e565e', charcoal: '#3b3b3f',
};

/** Parses `#rgb`, `#rrggbb` or a common colour name into sRGB 0..1. */
export function parseColor(value) {
  if (!value) return null;
  const s = String(value).trim().toLowerCase();
  const hex = NAMED_COLORS[s] ?? s;
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(hex);
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}

const TINTS = 6;

/** Nudges a colour's warmth and value without leaving its own family. */
function tint(color, i) {
  const warm = ((i % 3) - 1) * 0.045;      // towards brick, or towards slate
  const value = 1 + (Math.floor(i / 3) - 0.5) * 0.14;
  return [
    clamp01(color[0] * value + warm),
    clamp01(color[1] * value),
    clamp01(color[2] * value - warm),
  ];
}

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Real streets are not one colour. Every wall material gets a few variants so
// neighbouring buildings differ, picked from the OSM id so a place looks the
// same every time it is built.
for (const name of Object.keys(MATERIALS)) {
  if (!name.startsWith('building_')) continue;
  const base = MATERIALS[name];
  for (let i = 0; i < TINTS; i++) {
    MATERIALS[`${name}~${i}`] = { ...base, color: tint(base.color, i) };
  }
}

// Roofs vary more than walls do - slate, tile, shingle, tin - and the variation
// is what you notice first from the air.
const ROOF_COLORS = [
  [0.34, 0.30, 0.29], [0.45, 0.25, 0.21], [0.38, 0.36, 0.34],
  [0.28, 0.29, 0.31], [0.52, 0.42, 0.33], [0.33, 0.35, 0.31],
];
ROOF_COLORS.forEach((color, i) => {
  MATERIALS[`roof~${i}`] = { ...MATERIALS.roof, color };
});

MATERIALS.trim = { color: [0.88, 0.87, 0.84], roughness: 0.75, metallic: 0 };
MATERIALS.door = { color: [0.35, 0.27, 0.22], roughness: 0.6, metallic: 0 };
MATERIALS.window = { color: [0.16, 0.20, 0.24], roughness: 0.18, metallic: 0.1 };

/**
 * Registers a material for a colour OSM gave us explicitly, and returns its
 * name. Named after the colour, so the same colour is always the same material
 * and the mesh does not grow a group per building.
 */
function paintedMaterial(prefix, color, base) {
  const key = `${prefix}#${color.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`;
  if (!MATERIALS[key]) MATERIALS[key] = { ...base, color };
  return key;
}

/** Wall material for one building: what OSM says, else a stable variant. */
export function wallMaterial(material, tags, seed = 0) {
  const stated = parseColor(tags['building:colour'] ?? tags['building:color'] ?? tags.colour);
  if (stated) return paintedMaterial('wall', stated, MATERIALS[material]);
  return `${material}~${Math.abs(Math.trunc(seed)) % TINTS}`;
}

/** Roof material for one building: what OSM says, else a stable variant. */
export function roofMaterial(tags, seed = 0) {
  const stated = parseColor(tags['roof:colour'] ?? tags['roof:color']);
  if (stated) return paintedMaterial('roof', stated, MATERIALS.roof);
  return `roof~${Math.abs(Math.trunc(seed)) % ROOF_COLORS.length}`;
}
