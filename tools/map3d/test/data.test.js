// Tests for the data sources added for the game: external building
// footprints, the home/doorstep spawn, and export-style imagery.

import test from 'node:test';
import assert from 'node:assert/strict';

import { Projector } from '../src/project.js';
import {
  structureTags, structureFeature, mergeFootprints, parseStreetAddress,
} from '../src/footprints.js';
import { pickHome, doorstep, normalizeStreet } from '../src/home.js';
import { exportTileGrid, IMAGERY_PRESETS, imageryCredit } from '../src/imagery.js';

/* ------------------------------- footprints ------------------------------- */

test('USA Structures occupancy maps onto OSM building tags', () => {
  assert.equal(structureTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', SQMETERS: 180 }).building, 'house');
  assert.equal(structureTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Multi - Family Dwelling', SQMETERS: 600 }).building, 'apartments');
  assert.equal(structureTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Mobile Home', SQMETERS: 90 }).building, 'static_caravan');
  assert.equal(structureTags({ OCC_CLS: 'Commercial', SQMETERS: 900 }).building, 'commercial');
  assert.equal(structureTags({ OCC_CLS: 'Education', SQMETERS: 3000 }).building, 'school');
  assert.equal(structureTags({ OCC_CLS: 'Agriculture', SQMETERS: 400 }).building, 'barn');
  assert.equal(structureTags({ OCC_CLS: 'Unclassified', SQMETERS: 100 }).building, 'yes');
});

test('small residential polygons become garages and sheds', () => {
  assert.equal(structureTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', SQMETERS: 30 }).building, 'shed');
  assert.equal(structureTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', SQMETERS: 48 }).building, 'garage');
  assert.equal(structureTags({ OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', SQMETERS: 60 }).building, 'house');
  assert.equal(structureTags({ OCC_CLS: 'Residential', OUTBLDG: 'Y', SQMETERS: 200 }).building, 'garage');
});

test('structure addresses and heights become OSM tags', () => {
  const tags = structureTags({
    OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', SQMETERS: 150,
    PROP_ADDR: '80 FLINTLOCK FARM RD', PROP_CITY: 'DUNBARTON', PROP_ZIP: '03046', HEIGHT: 7.5,
  });
  assert.equal(tags['addr:housenumber'], '80');
  assert.equal(tags['addr:street'], 'Flintlock Farm Rd');
  assert.equal(tags['addr:city'], 'Dunbarton');
  assert.equal(tags['addr:postcode'], '03046');
  assert.equal(tags.height, '7.5');
  assert.deepEqual(parseStreetAddress('  12B OAK-HILL LANE '), { housenumber: '12B', street: 'Oak-Hill Lane' });
  assert.equal(parseStreetAddress('MAIN ST'), null);
  assert.equal(structureTags({ HEIGHT: 900 }).height, undefined);
});

test('GeoJSON structures become lat/lon area features', () => {
  const f = structureFeature({
    geometry: { type: 'Polygon', coordinates: [[[-71.61, 43.08], [-71.61, 43.0801], [-71.6099, 43.0801], [-71.61, 43.08]]] },
    properties: { BUILD_ID: 42, OCC_CLS: 'Residential', PRIM_OCC: 'Single Family Dwelling', SQMETERS: 120 },
  });
  assert.equal(f.id, 'usa/42');
  assert.equal(f.kind, 'area');
  assert.equal(f.tags.building, 'house');
  assert.deepEqual(f.rings[0][0], [43.08, -71.61]);
  assert.equal(structureFeature({ geometry: null }), null);
  assert.equal(structureFeature({ geometry: { type: 'Point', coordinates: [0, 0] } }), null);
});

test('footprints that OSM already has are dropped, new ones are added', () => {
  const projector = new Projector(43.0, -71.6);
  const square = (lat, lon, m) => {
    const dLat = m / projector.metersPerDegLat / 2;
    const dLon = m / projector.metersPerDegLon / 2;
    return [[lat - dLat, lon - dLon], [lat - dLat, lon + dLon], [lat + dLat, lon + dLon], [lat + dLat, lon - dLon], [lat - dLat, lon - dLon]];
  };
  const osm = [
    { id: 'way/1', kind: 'area', tags: { building: 'house' }, rings: [square(43.0, -71.6, 12)] },
    { id: 'way/2', kind: 'line', tags: { highway: 'residential' }, line: [[43.0, -71.6], [43.001, -71.6]] },
  ];
  const external = [
    // Same house, traced slightly differently: dropped.
    { id: 'usa/1', kind: 'area', tags: { building: 'house' }, rings: [square(43.00002, -71.60002, 14)] },
    // 200 m away: kept.
    { id: 'usa/2', kind: 'area', tags: { building: 'house' }, rings: [square(43.0018, -71.6, 12)] },
    // Degenerate: dropped.
    { id: 'usa/3', kind: 'area', tags: { building: 'house' }, rings: [[[43, -71.6], [43, -71.6]]] },
  ];
  const merged = mergeFootprints(osm, external, projector);
  assert.equal(merged.added, 1);
  assert.equal(merged.dropped, 2);
  assert.deepEqual(merged.features.map((f) => f.id), ['way/1', 'way/2', 'usa/2']);
});

/* ---------------------------------- home ---------------------------------- */

test('street names compare loosely', () => {
  assert.equal(normalizeStreet('Flintlock Farm Rd.'), 'flintlock farm road');
  assert.equal(normalizeStreet('FLINTLOCK FARM ROAD'), 'flintlock farm road');
  assert.equal(normalizeStreet('N Main St'), 'north main street');
});

const box = (cx, cz, w, d) => [
  [cx - w / 2, cz - d / 2], [cx + w / 2, cz - d / 2], [cx + w / 2, cz + d / 2], [cx - w / 2, cz + d / 2],
];
const house = (id, cx, cz, extra = {}) => ({
  id, type: 'house', centre: { x: cx, z: cz }, footprintM2: 150, outline: box(cx, cz, 12, 10), ...extra,
});

test('home is the building whose address matches, else the nearest house', () => {
  const buildings = [
    house('a', 30, 0),
    house('b', 90, 40, { address: '80 Flintlock Farm Road' }),
    house('shed', 5, 5, { type: 'shed', footprintM2: 20 }),
    house('part', 8, 0, { isPart: true }),
  ];
  const byAddress = pickHome(buildings, { housenumber: '80', street: 'Flintlock Farm Rd' });
  assert.equal(byAddress.building.id, 'b');
  assert.equal(byAddress.reason, 'address');

  const nearest = pickHome(buildings, { housenumber: '99', street: 'Nowhere' });
  assert.equal(nearest.building.id, 'a');
  assert.equal(nearest.reason, 'nearest');

  assert.equal(pickHome([house('far', 500, 500)], {}), null);
  assert.equal(pickHome([], {}), null);
});

test('the doorstep is outside the wall nearest the road, facing away from the house', () => {
  const outline = box(0, 0, 12, 10); // walls at x=+-6, z=+-5
  const road = [0, -40];              // north of the house
  const step = doorstep(outline, road);
  assert.ok(Math.abs(step.x) < 1e-9);
  assert.ok(step.z < -5, 'outside the north wall');
  assert.ok(step.z > -9);
  assert.deepEqual(step.facing.map((v) => Math.round(v)), [0, -1]);
  assert.equal(Math.round(step.yaw), 0);

  // No road nearby: the longest wall, still outside.
  const noRoad = doorstep(outline, undefined);
  assert.ok(Math.abs(noRoad.z) > 5 && Math.abs(noRoad.x) < 1e-9);

  const east = doorstep(outline, [60, 0]);
  assert.ok(east.x > 6);
  assert.equal(Math.round(east.yaw), 90);
});

/* -------------------------------- imagery --------------------------------- */

test('export imagery grid tiles the whole ground square with north-up boxes', () => {
  const projector = new Projector(43.0, -71.6);
  const cells = exportTileGrid(projector, 100, 2);
  assert.equal(cells.length, 4);
  assert.deepEqual([cells[0].x0, cells[0].z0, cells[0].x1, cells[0].z1], [-100, -100, 0, 0]);
  assert.deepEqual([cells[3].x0, cells[3].z0, cells[3].x1, cells[3].z1], [0, 0, 100, 100]);
  for (const c of cells) {
    assert.ok(c.bbox.north > c.bbox.south);
    assert.ok(c.bbox.east > c.bbox.west);
  }
  // The first cell's north-west corner is 100 m north and west of the origin.
  const [x, z] = projector.toLocal(cells[0].bbox.north, cells[0].bbox.west);
  assert.ok(Math.abs(x + 100) < 1e-6 && Math.abs(z + 100) < 1e-6);
});

test('the naip preset is an export template with a credit line', () => {
  assert.ok(IMAGERY_PRESETS.naip.includes('{bbox}') && IMAGERY_PRESETS.naip.includes('{size}'));
  assert.match(imageryCredit('naip'), /NAIP/);
  assert.equal(imageryCredit('https://example.com/{z}/{x}/{y}.png'), undefined);
});
