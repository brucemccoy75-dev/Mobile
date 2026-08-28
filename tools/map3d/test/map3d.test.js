// Unit tests: node --test tools/map3d/test
//
// These cover the pure parts (geometry, tag parsing, clipping, export format).
// Anything that touches the network is exercised by `map3d build` itself.

import test from 'node:test';
import assert from 'node:assert/strict';

import { earcut, ringArea } from '../src/earcut.js';
import { Projector, haversine, metersPerPixel } from '../src/project.js';
import {
  parseLength, buildingHeights, classifyHighway, classifyArea, classifyBuilding,
} from '../src/tags.js';
import {
  MeshBuilder, normalizeRings, fillPolygon, extrudeWalls, buildRoof, ribbon,
  orientedBox, convexHull, polygonAreaXZ, centroidXZ, cleanRing, tree, grid,
} from '../src/mesh.js';
import { clipRing, clipPolygon, clipLine, squareBoundary, circleBoundary } from '../src/clip.js';
import { normalizeElements, assembleMultipolygon, buildQuery } from '../src/overpass.js';
import { writeGlb } from '../src/glb.js';
import { writeObj } from '../src/obj.js';
import { MATERIALS } from '../src/tags.js';
import { parseDistance, slugify, parseArgs } from '../src/cli.js';
import { parseLatLon } from '../src/geocode.js';

/* -------------------------------- geometry -------------------------------- */

function triangleArea2D(data, tris) {
  let a = 0;
  for (let i = 0; i < tris.length; i += 3) {
    const p = [tris[i], tris[i + 1], tris[i + 2]].map((k) => [data[k * 2], data[k * 2 + 1]]);
    a += Math.abs(
      (p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[2][0] - p[0][0]) * (p[1][1] - p[0][1]),
    ) / 2;
  }
  return a;
}

test('earcut triangulates a convex ring', () => {
  const data = [0, 0, 10, 0, 10, 10, 0, 10];
  const tris = earcut(data);
  assert.equal(tris.length, 6);
  assert.equal(triangleArea2D(data, tris), 100);
});

test('earcut handles concave rings', () => {
  const data = [0, 0, 10, 0, 10, 4, 4, 4, 4, 10, 0, 10];
  assert.equal(triangleArea2D(data, earcut(data)), 64);
});

test('earcut cuts holes out of the covered area', () => {
  const data = [0, 0, 10, 0, 10, 10, 0, 10, 3, 3, 3, 7, 7, 7, 7, 3];
  assert.equal(triangleArea2D(data, earcut(data, [4])), 84);
});

test('earcut is insensitive to input winding', () => {
  const cw = [0, 0, 0, 10, 10, 10, 10, 0, 3, 3, 7, 3, 7, 7, 3, 7];
  assert.equal(triangleArea2D(cw, earcut(cw, [4])), 84);
});

test('earcut survives duplicate and collinear vertices', () => {
  const data = [0, 0, 5, 0, 10, 0, 10, 10, 10, 10, 0, 10];
  assert.equal(triangleArea2D(data, earcut(data)), 100);
});

test('earcut returns nothing for degenerate input', () => {
  assert.deepEqual(earcut([0, 0, 1, 1]), []);
  assert.deepEqual(earcut([0, 0, 1, 0, 2, 0]), []);
});

test('ringArea is positive for counter-clockwise rings', () => {
  assert.equal(ringArea([[0, 0], [10, 0], [10, 10], [0, 10]]), 100);
  assert.equal(ringArea([[0, 0], [0, 10], [10, 10], [10, 0]]), -100);
});

test('convex hull and oriented box recover a rotated rectangle', () => {
  // A 10 x 5 rectangle rotated 45 degrees.
  const c = Math.SQRT1_2;
  const rect = [[0, 0], [10 * c, -10 * c], [10 * c + 5 * c, -10 * c + 5 * c], [5 * c, 5 * c]];
  assert.equal(convexHull(rect).length, 4);
  const box = orientedBox(rect);
  assert.ok(Math.abs(box.length - 10) < 0.01, `length ${box.length}`);
  assert.ok(Math.abs(box.width - 5) < 0.01, `width ${box.width}`);
});

/* -------------------------------- clipping -------------------------------- */

const areaUV = (ring) => ringArea(ring.map(([x, z]) => [x, -z]));

test('clipping keeps rings that are already inside', () => {
  const b = squareBoundary(10);
  const r = clipRing([[-5, -5], [5, -5], [5, 5], [-5, 5]], b);
  assert.equal(Math.abs(areaUV(r)), 100);
});

test('clipping trims rings to the boundary', () => {
  const b = squareBoundary(10);
  const r = clipRing([[-50, -50], [50, -50], [50, 50], [-50, 50]], b);
  assert.equal(Math.abs(areaUV(r)), 400);
});

test('clipping drops rings that are entirely outside', () => {
  assert.equal(clipRing([[100, 100], [110, 100], [110, 110]], squareBoundary(10)).length, 0);
  assert.equal(clipPolygon([[[100, 100], [110, 100], [110, 110]]], squareBoundary(10)), null);
});

test('clipping preserves holes', () => {
  const rings = clipPolygon(
    [[[-50, -50], [50, -50], [50, 50], [-50, 50]], [[-3, -3], [-3, 3], [3, 3], [3, -3]]],
    squareBoundary(10),
  );
  assert.equal(rings.length, 2);
  assert.equal(Math.abs(areaUV(rings[1])), 36);
});

test('polylines are split where they leave and re-enter the boundary', () => {
  const b = squareBoundary(10);
  assert.equal(clipLine([[-30, 0], [0, 0], [30, 0]], b).length, 1);
  assert.equal(clipLine([[-30, 0], [30, 0], [30, 30], [0, 30], [0, 0]], b).length, 2);
  assert.equal(clipLine([[100, 100], [200, 200]], b).length, 0);
});

test('a circular boundary approximates its area', () => {
  const area = Math.abs(areaUV(circleBoundary(10, 64)));
  assert.ok(Math.abs(area - Math.PI * 100) < 1, `got ${area}`);
});

/* ------------------------------- projection ------------------------------- */

test('projection round-trips through local metres', () => {
  const p = new Projector(37.4224, -122.0841);
  const [x, z] = p.toLocal(37.43, -122.07);
  const back = p.toGeo(x, z);
  assert.ok(Math.abs(back.lat - 37.43) < 1e-9);
  assert.ok(Math.abs(back.lon - -122.07) < 1e-9);
});

test('north is -Z and east is +X', () => {
  const p = new Projector(0, 0);
  const [xNorth, zNorth] = p.toLocal(0.001, 0);
  assert.ok(zNorth < 0 && Math.abs(xNorth) < 1e-9);
  const [xEast, zEast] = p.toLocal(0, 0.001);
  assert.ok(xEast > 0 && Math.abs(zEast) < 1e-9);
});

test('local distances match the great-circle distance', () => {
  const p = new Projector(51.5007, -0.1246);
  const [x, z] = p.toLocal(51.5057, -0.1146);
  const planar = Math.hypot(x, z);
  const geodesic = haversine(51.5007, -0.1246, 51.5057, -0.1146);
  assert.ok(Math.abs(planar - geodesic) / geodesic < 0.001, `${planar} vs ${geodesic}`);
});

test('a bbox contains the requested radius', () => {
  const p = new Projector(60, 10); // high latitude, where longitude shrinks
  const b = p.bbox(1000);
  assert.ok(haversine(60, 10, 60, b.east) >= 999);
  assert.ok(haversine(60, 10, b.north, 10) >= 999);
});

test('tile resolution shrinks with latitude', () => {
  assert.ok(metersPerPixel(0, 16) > metersPerPixel(60, 16));
});

/* ----------------------------------- tags --------------------------------- */

test('lengths parse from the units OSM actually uses', () => {
  assert.equal(parseLength('12'), 12);
  assert.equal(parseLength('12 m'), 12);
  assert.equal(parseLength('12.5m'), 12.5);
  assert.equal(parseLength('1 km'), 1000);
  assert.ok(Math.abs(parseLength("40'") - 12.192) < 1e-6);
  assert.ok(Math.abs(parseLength(`40'6"`) - 12.3444) < 1e-4);
  assert.equal(parseLength('about 12'), null);
  assert.equal(parseLength(''), null);
  assert.equal(parseLength(undefined), null);
});

test('building height prefers height, then levels, then a type default', () => {
  assert.equal(buildingHeights({ building: 'yes', height: '24' }).top, 24);
  assert.equal(buildingHeights({ building: 'yes', 'building:levels': '3' }).top, 3 * 3.2 + 1);
  const guess = buildingHeights({ building: 'house' });
  assert.equal(guess.estimated, true);
  assert.equal(guess.top, 6.5);
  assert.equal(buildingHeights({ building: 'yes', height: '24' }).estimated, false);
});

test('a roof never eats more than its building', () => {
  const h = buildingHeights({ building: 'house', height: '6', 'roof:shape': 'gabled', 'roof:height': '20' });
  assert.ok(h.roofHeight <= h.top * 0.8, `${h.roofHeight} of ${h.top}`);
});

test('min_height lifts a building off the ground', () => {
  const h = buildingHeights({ building: 'yes', height: '30', min_height: '10' });
  assert.equal(h.base, 10);
  assert.equal(h.top, 30);
});

test('road width comes from width, then lanes, then class', () => {
  assert.equal(classifyHighway({ highway: 'residential', width: '8' }).width, 8);
  assert.equal(classifyHighway({ highway: 'primary', lanes: '4' }).width, 13.6);
  assert.equal(classifyHighway({ highway: 'residential' }).width, 6.5);
  assert.equal(classifyHighway({ highway: 'motorway' }).material, 'road_major');
  assert.equal(classifyHighway({ highway: 'footway' }).minor, true);
  assert.equal(classifyHighway({ building: 'yes' }), null);
  assert.equal(classifyHighway({ highway: 'proposed' }), null);
});

test('area features map to the right ground layer', () => {
  assert.equal(classifyArea({ natural: 'water' }).material, 'water');
  assert.equal(classifyArea({ leisure: 'park' }).layer, 'park');
  assert.equal(classifyArea({ amenity: 'parking' }).material, 'parking');
  assert.equal(classifyArea({ building: 'yes' }), null);
});

test('buildings are bucketed by use', () => {
  assert.equal(classifyBuilding({ building: 'house' }).material, 'building_residential');
  assert.equal(classifyBuilding({ building: 'retail' }).material, 'building_commercial');
  assert.equal(classifyBuilding({ building: 'church' }).material, 'building_civic');
  assert.equal(classifyBuilding({ building: 'yes' }).material, 'building_generic');
});

/* ---------------------------------- mesh ---------------------------------- */

/** Every triangle's winding must agree with the normal stored on its vertices. */
function assertConsistentNormals(group, label) {
  const { positions: P, normals: N, indices: I } = group;
  for (let i = 0; i < I.length; i += 3) {
    const [a, b, c] = [I[i], I[i + 1], I[i + 2]];
    const v = (k) => [P[k * 3], P[k * 3 + 1], P[k * 3 + 2]];
    const [p, q, r] = [v(a), v(b), v(c)];
    const u = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
    const w = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n);
    if (len < 1e-9) continue; // degenerate sliver
    const stored = [N[a * 3], N[a * 3 + 1], N[a * 3 + 2]];
    const dot = (n[0] * stored[0] + n[1] * stored[1] + n[2] * stored[2]) / len;
    assert.ok(dot > 0.9, `${label}: face ${i / 3} winding disagrees with its normal (${dot.toFixed(3)})`);
  }
}

const SQUARE = [[0, 0], [10, 0], [10, -10], [0, -10]];

test('rings are normalised to CCW outer and CW holes', () => {
  const [outer, hole] = normalizeRings([SQUARE, [[3, -3], [7, -3], [7, -7], [3, -7]]]);
  assert.ok(areaUV(outer) > 0);
  assert.ok(areaUV(hole) < 0);
});

test('cleanRing drops the repeated closing vertex', () => {
  assert.equal(cleanRing([[0, 0], [1, 0], [1, 1], [0, 0]]).length, 3);
  assert.equal(cleanRing([[0, 0], [0, 0], [1, 0], [1, 1]]).length, 3);
});

test('polygon area subtracts holes', () => {
  const rings = normalizeRings([SQUARE, [[3, -3], [7, -3], [7, -7], [3, -7]]]);
  assert.equal(polygonAreaXZ(rings), 100 - 16);
});

test('centroid of a square is its middle', () => {
  const [x, z] = centroidXZ(SQUARE);
  assert.ok(Math.abs(x - 5) < 1e-9 && Math.abs(z + 5) < 1e-9);
});

test('a flat fill faces up', () => {
  const g = new MeshBuilder().group('m');
  fillPolygon(g, normalizeRings([SQUARE]), () => 0);
  assert.equal(g.triangleCount, 2);
  for (let i = 1; i < g.normals.length; i += 3) assert.equal(g.normals[i], 1);
  assertConsistentNormals(g, 'fill');
});

test('extruded walls face outwards', () => {
  const g = new MeshBuilder().group('m');
  extrudeWalls(g, normalizeRings([SQUARE]), () => 0, () => 10);
  assert.equal(g.triangleCount, 8);
  assertConsistentNormals(g, 'walls');

  // The centre of the box must be behind every wall.
  const { positions: P, normals: N, indices: I } = g;
  for (let i = 0; i < I.length; i += 3) {
    const a = I[i];
    const d = [P[a * 3] - 5, P[a * 3 + 1] - 5, P[a * 3 + 2] + 5];
    const dot = d[0] * N[a * 3] + d[1] * N[a * 3 + 1] + d[2] * N[a * 3 + 2];
    assert.ok(dot > 0, 'wall normal points inwards');
  }
});

test('hole walls face into the courtyard', () => {
  const rings = normalizeRings([[[0, 0], [20, 0], [20, -20], [0, -20]], [[6, -6], [14, -6], [14, -14], [6, -14]]]);
  const g = new MeshBuilder().group('m');
  extrudeWalls(g, rings, () => 0, () => 8);
  assertConsistentNormals(g, 'courtyard');
  const { positions: P, normals: N, indices: I } = g;
  let facingIn = 0;
  for (let i = 0; i < I.length; i += 3) {
    const a = I[i];
    const d = [P[a * 3] - 10, 0, P[a * 3 + 2] + 10];
    if (d[0] * N[a * 3] + d[2] * N[a * 3 + 2] < 0) facingIn++;
  }
  // 8 triangles line the hole and must point back towards the courtyard centre.
  assert.equal(facingIn, 8);
});

for (const shape of ['flat', 'pyramidal', 'gabled', 'hipped', 'skillion']) {
  test(`a ${shape} roof is consistently wound`, () => {
    const g = new MeshBuilder().group('m');
    const rings = normalizeRings([SQUARE]);
    extrudeWalls(g, rings, () => 0, () => 10);
    buildRoof(g, rings, 10, 3, shape);
    assert.ok(g.triangleCount >= 10);
    assertConsistentNormals(g, shape);
    // Nothing may poke above the ridge.
    for (let i = 1; i < g.positions.length; i += 3) assert.ok(g.positions[i] <= 13.001);
  });
}

test('an unknown roof shape falls back to flat', () => {
  const g = new MeshBuilder().group('m');
  buildRoof(g, normalizeRings([SQUARE]), 10, 3, 'quadruple_saltbox_deluxe');
  assert.equal(g.triangleCount, 2);
});

test('a road ribbon has the requested width', () => {
  const g = new MeshBuilder().group('m');
  ribbon(g, [[0, 0], [100, 0]], 8, () => 0);
  assert.equal(g.triangleCount, 2);
  const zs = [];
  for (let i = 2; i < g.positions.length; i += 3) zs.push(g.positions[i]);
  assert.equal(Math.max(...zs) - Math.min(...zs), 8);
  assertConsistentNormals(g, 'ribbon');
});

test('a ribbon corner is mitered, not pinched', () => {
  const g = new MeshBuilder().group('m');
  ribbon(g, [[0, 0], [50, 0], [50, -50]], 10, () => 0);
  assert.equal(g.triangleCount, 4);
  assertConsistentNormals(g, 'corner');
});

test('a degenerate polyline produces nothing', () => {
  const g = new MeshBuilder().group('m');
  assert.equal(ribbon(g, [[5, 5]], 8, () => 0), 0);
  assert.equal(ribbon(g, [[5, 5], [5, 5]], 8, () => 0), 0);
});

test('a grid can span several materials and stays wound correctly', () => {
  const b = new MeshBuilder();
  const tris = grid((x) => b.group(x < 0 ? 'forest' : 'grass'), 100, 10, (x, z) => Math.sin(x / 30) * 3);
  assert.equal(tris, 200);
  assert.equal(b.groups.size, 2);
  for (const [name, g] of b.groups) {
    assertConsistentNormals(g, `grid/${name}`);
    // Ground must face up everywhere.
    for (let i = 1; i < g.normals.length; i += 3) assert.ok(g.normals[i] > 0);
  }
});

test('a grid honours the keep filter', () => {
  const b = new MeshBuilder();
  const tris = grid(() => b.group('g'), 100, 20, () => 0, {
    keep: (x, z) => Math.hypot(x, z) <= 60,
  });
  const expected = (Math.PI * 60 * 60) / (10 * 10) * 2;
  assert.ok(Math.abs(tris - expected) / expected < 0.05, `${tris} vs ~${expected.toFixed(0)}`);
});

for (const kind of ['conifer', 'broadleaf']) {
  test(`a ${kind} tree is closed and consistently wound`, () => {
    const b = new MeshBuilder();
    const tris = tree(b, 5, -5, 2, 10, 3, 7, kind);
    assert.ok(tris >= 15 && tris <= 40, `${tris} triangles is outside the prop budget`);
    for (const [name, g] of b.groups) assertConsistentNormals(g, `${kind}/${name}`);
    // Nothing may poke below the ground it stands on, beyond the buried base.
    for (const [, g] of b.groups) {
      for (let i = 1; i < g.positions.length; i += 3) {
        assert.ok(g.positions[i] >= 1.7, `vertex at y=${g.positions[i]} is below ground`);
        assert.ok(g.positions[i] <= 12.001, `vertex at y=${g.positions[i]} is above the crown`);
      }
    }
  });
}

test('trees skip texture coordinates', () => {
  const b = new MeshBuilder();
  tree(b, 0, 0, 0, 8, 2, 1);
  for (const [, g] of b.groups) assert.equal(g.needsUvs, false);
  assert.equal(new MeshBuilder().group('ground').needsUvs, true);
});

test('the builder drops empty groups', () => {
  const b = new MeshBuilder();
  b.group('empty');
  fillPolygon(b.group('full'), normalizeRings([SQUARE]), () => 0);
  const totals = b.finalize();
  assert.equal(totals.groups, 1);
  assert.equal(totals.triangles, 2);
});

/* --------------------------------- overpass -------------------------------- */

test('the query asks for everything we can render', () => {
  const q = buildQuery(37.42, -122.08, 800);
  for (const tag of ['building', 'highway', 'waterway', 'landuse', 'leisure', 'natural']) {
    assert.ok(q.includes(`["${tag}"]`), `missing ${tag}`);
  }
  assert.ok(q.includes('around:800.0,37.4200000,-122.0800000'));
  assert.ok(q.includes('out geom;'));
});

test('closed ways become areas only when their tags say so', () => {
  const ring = [
    { lat: 0, lon: 0 }, { lat: 0, lon: 1 }, { lat: 1, lon: 1 }, { lat: 1, lon: 0 }, { lat: 0, lon: 0 },
  ];
  const [building] = normalizeElements([{ type: 'way', id: 1, tags: { building: 'yes' }, geometry: ring }]);
  assert.equal(building.kind, 'area');
  const [roundabout] = normalizeElements([{ type: 'way', id: 2, tags: { highway: 'residential', junction: 'roundabout' }, geometry: ring }]);
  assert.equal(roundabout.kind, 'line');
});

test('nodes become points and short ways are dropped', () => {
  const out = normalizeElements([
    { type: 'node', id: 3, tags: { natural: 'tree' }, lat: 1, lon: 2 },
    { type: 'way', id: 4, tags: { highway: 'residential' }, geometry: [{ lat: 0, lon: 0 }] },
  ]);
  assert.equal(out.length, 1);
  assert.deepEqual(out[0].point, [1, 2]);
});

test('multipolygon members are stitched into rings', () => {
  const rings = assembleMultipolygon([
    { type: 'way', role: 'outer', geometry: [{ lat: 0, lon: 0 }, { lat: 0, lon: 10 }] },
    { type: 'way', role: 'outer', geometry: [{ lat: 0, lon: 10 }, { lat: 10, lon: 10 }, { lat: 10, lon: 0 }] },
    { type: 'way', role: 'outer', geometry: [{ lat: 10, lon: 0 }, { lat: 0, lon: 0 }] },
    { type: 'way', role: 'inner', geometry: [{ lat: 3, lon: 3 }, { lat: 3, lon: 7 }, { lat: 7, lon: 7 }, { lat: 7, lon: 3 }, { lat: 3, lon: 3 }] },
  ]);
  assert.equal(rings.length, 2);
  assert.equal(rings[0].length, 5); // closed outer ring
  assert.equal(rings[1].length, 5);
});

test('reversed multipolygon members still stitch', () => {
  const rings = assembleMultipolygon([
    { type: 'way', role: 'outer', geometry: [{ lat: 0, lon: 0 }, { lat: 0, lon: 10 }] },
    { type: 'way', role: 'outer', geometry: [{ lat: 0, lon: 0 }, { lat: 10, lon: 0 }] },
    { type: 'way', role: 'outer', geometry: [{ lat: 0, lon: 10 }, { lat: 10, lon: 10 }, { lat: 10, lon: 0 }] },
  ]);
  assert.equal(rings.length, 1);
  assert.ok(rings[0].length >= 4);
});

/* --------------------------------- exports -------------------------------- */

function sampleBuilder() {
  const b = new MeshBuilder();
  const rings = normalizeRings([SQUARE]);
  extrudeWalls(b.group('building_generic'), rings, () => 0, () => 10);
  buildRoof(b.group('roof'), rings, 10, 3, 'gabled');
  fillPolygon(b.group('ground'), normalizeRings([[[-50, 50], [50, 50], [50, -50], [-50, -50]]]), () => 0);
  b.finalize();
  return b;
}

test('the GLB header and chunk layout are valid', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  assert.ok(glb instanceof Uint8Array, 'must be plain bytes, not a Buffer');
  assert.equal(glbAscii(glb, 0, 4), 'glTF');
  assert.equal(glbU32(glb, 4), 2);
  assert.equal(glbU32(glb, 8), glb.length);
  assert.equal(glb.length % 4, 0);

  const jsonLen = glbU32(glb, 12);
  assert.equal(glbU32(glb, 16), 0x4e4f534a); // 'JSON'
  const gltf = JSON.parse(glbAscii(glb, 20, 20 + jsonLen));
  assert.equal(glbU32(glb, 20 + jsonLen + 4), 0x004e4942); // 'BIN'
  assert.equal(gltf.buffers[0].byteLength, glbU32(glb, 20 + jsonLen));
  assert.equal(gltf.meshes.length, 3);
});

test('GLB accessors stay inside their buffer views', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  const gltf = JSON.parse(glbAscii(glb, 20, 20 + glbU32(glb, 12)));
  const size = { 5126: 4, 5123: 2, 5125: 4 };
  const count = { SCALAR: 1, VEC2: 2, VEC3: 3 };
  for (const a of gltf.accessors) {
    const view = gltf.bufferViews[a.bufferView];
    assert.equal(view.byteOffset % 4, 0, 'buffer view must be 4-byte aligned');
    assert.ok(size[a.componentType] * count[a.type] * a.count <= view.byteLength);
  }
});

test('GLB indices never point past the vertex list', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  const jsonLen = glbU32(glb, 12);
  const gltf = JSON.parse(glbAscii(glb, 20, 20 + jsonLen));
  const binStart = 20 + jsonLen + 8;
  for (const mesh of gltf.meshes) {
    for (const prim of mesh.primitives) {
      const ia = gltf.accessors[prim.indices];
      const view = gltf.bufferViews[ia.bufferView];
      const vertices = gltf.accessors[prim.attributes.POSITION].count;
      const Arr = ia.componentType === 5125 ? Uint32Array : Uint16Array;
      const idx = new Arr(glb.buffer, glb.byteOffset + binStart + view.byteOffset, ia.count);
      assert.equal(ia.count % 3, 0);
      for (const i of idx) assert.ok(i < vertices, `${mesh.name}: index ${i} >= ${vertices}`);
    }
  }
});

test('GLB positions carry the bounds glTF requires', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  const gltf = JSON.parse(glbAscii(glb, 20, 20 + glbU32(glb, 12)));
  for (const mesh of gltf.meshes) {
    const a = gltf.accessors[mesh.primitives[0].attributes.POSITION];
    assert.equal(a.min.length, 3);
    assert.equal(a.max.length, 3);
    for (let i = 0; i < 3; i++) assert.ok(a.min[i] <= a.max[i]);
  }
});

test('the sRGB palette is written to glTF as linear', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  const gltf = JSON.parse(glbAscii(glb, 20, 20 + glbU32(glb, 12)));
  const roof = gltf.materials.find((m) => m.name === 'roof');
  const [r] = roof.pbrMetallicRoughness.baseColorFactor;
  assert.ok(r < MATERIALS.roof.color[0], 'linear value should be below the sRGB one');
  assert.ok(Math.abs(r - ((MATERIALS.roof.color[0] + 0.055) / 1.055) ** 2.4) < 1e-6);
});

test('OBJ keeps vt indices aligned when some groups have no UVs', () => {
  // Props skip TEXCOORD_0, so the texture-coordinate count runs behind the
  // vertex count. Every v/vt/vn index still has to land in range.
  const b = new MeshBuilder();
  fillPolygon(b.group('ground'), normalizeRings([SQUARE]), () => 0); // has UVs
  tree(b, 30, -30, 0, 9, 2.5, 1); // trunk + tree, both without UVs
  fillPolygon(b.group('grass'), normalizeRings([[[20, -20], [30, -20], [30, -30], [20, -30]]]), () => 1);
  b.finalize();

  const { obj } = writeObj(b, MATERIALS);
  const lines = obj.split('\n');
  const vCount = lines.filter((l) => l.startsWith('v ')).length;
  const vtCount = lines.filter((l) => l.startsWith('vt ')).length;
  const vnCount = lines.filter((l) => l.startsWith('vn ')).length;

  assert.ok(vtCount > 0 && vtCount < vCount, 'some groups should have UVs and some not');
  assert.equal(vnCount, vCount, 'every vertex needs a normal');

  let facesWithUv = 0;
  let facesWithout = 0;
  for (const line of lines.filter((l) => l.startsWith('f '))) {
    for (const part of line.slice(2).split(' ')) {
      const [v, vt, vn] = part.split('/');
      assert.ok(Number(v) >= 1 && Number(v) <= vCount, `v index ${v} out of range`);
      assert.ok(Number(vn) >= 1 && Number(vn) <= vnCount, `vn index ${vn} out of range`);
      if (vt === '') continue;
      assert.ok(Number(vt) >= 1 && Number(vt) <= vtCount, `vt index ${vt} out of 1..${vtCount}`);
    }
    if (line.includes('//')) facesWithout++;
    else facesWithUv++;
  }
  assert.ok(facesWithUv > 0 && facesWithout > 0, 'expected both kinds of face');
});

test('OBJ indices are 1-based and global across groups', () => {
  const { obj, mtl } = writeObj(sampleBuilder(), MATERIALS);
  const faces = obj.split('\n').filter((l) => l.startsWith('f '));
  const vertices = obj.split('\n').filter((l) => l.startsWith('v ')).length;
  assert.ok(faces.length > 0);
  for (const f of faces) {
    for (const part of f.slice(2).split(' ')) {
      const i = Number(part.split('/')[0]);
      assert.ok(i >= 1 && i <= vertices, `index ${i} out of 1..${vertices}`);
    }
  }
  assert.ok(obj.includes('mtllib map.mtl'));
  assert.ok(mtl.includes('newmtl roof'));
});

/* ----------------------------------- cli ---------------------------------- */

test('distances parse in miles, metres and kilometres', () => {
  assert.equal(parseDistance('0.5mi'), 804.672);
  assert.equal(parseDistance('800m'), 800);
  assert.equal(parseDistance('1km'), 1000);
  assert.equal(parseDistance('750'), 750);
  assert.equal(parseDistance(undefined), null);
  assert.throws(() => parseDistance('soon'));
  assert.throws(() => parseDistance('-5m'));
});

test('flags with values are separated from boolean flags', () => {
  const a = parseArgs(['build', '123 Main St', '--radius', '1km', '--terrain', '--no-trees']);
  assert.equal(a.command, 'build');
  assert.deepEqual(a.positionals, ['123 Main St']);
  assert.equal(a.flags.radius, '1km');
  assert.equal(a.flags.terrain, true);
  assert.equal(a.flags['no-trees'], true);
});

test('--terrain takes an optional dataset name', () => {
  assert.equal(parseArgs(['build', 'x', '--terrain', 'srtm90m']).flags.terrain, 'srtm90m');
  assert.equal(parseArgs(['build', 'x', '--terrain', '--quiet']).flags.terrain, true);
});

test('--key=value and repeated flags both work', () => {
  const a = parseArgs(['build', 'x', '--radius=2km', '--overpass', 'a', '--overpass', 'b']);
  assert.equal(a.flags.radius, '2km');
  assert.deepEqual(a.flags.overpass, ['a', 'b']);
});

test('slugs are filesystem safe', () => {
  assert.equal(slugify('1600 Pennsylvania Ave NW, Washington, DC'), '1600-pennsylvania-ave-nw-washington-dc');
  assert.equal(slugify('!!!'), 'map');
  assert.ok(slugify('x'.repeat(200)).length <= 60);
});

test('bare coordinates skip the geocoder', () => {
  assert.deepEqual(parseLatLon('37.4224,-122.0841'), { lat: 37.4224, lon: -122.0841 });
  assert.deepEqual(parseLatLon(' 51.5 , -0.12 '), { lat: 51.5, lon: -0.12 });
  assert.equal(parseLatLon('1600 Amphitheatre Pkwy'), null);
  assert.equal(parseLatLon('999,0'), null);
});

/* ----------------------------------- png ---------------------------------- */

import { deflateSync, inflateSync } from 'node:zlib';
import { decodePng as decodePngRaw } from '../src/png.js';

/** The decoder takes inflate as a parameter now; supply Node's. */
const decodePng = (bytes) => decodePngRaw(bytes, (d) => inflateSync(d));

/** GLB is a Uint8Array, so read it the way a browser would. */
const glbView = (glb) => new DataView(glb.buffer, glb.byteOffset, glb.byteLength);
const glbU32 = (glb, o) => glbView(glb).getUint32(o, true);
const glbAscii = (glb, a, b) => new TextDecoder().decode(glb.subarray(a, b));
import { OccupancyMask, scatter, hash2, pointInRing } from '../src/scatter.js';
import { chooseTerrainZoom, flatTerrain } from '../src/elevation.js';
import { NLCD_CLASSES, MATCH_TOLERANCE } from '../src/landcover.js';

/** Builds a PNG in memory so the decoder can be tested without a fixture. */
function makePng(width, height, colorType, pixels, { palette, filter = 0 } = {}) {
  const channels = { 0: 1, 2: 3, 3: 1, 6: 4 }[colorType];
  const stride = width * channels;

  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = filter;
    for (let x = 0; x < stride; x++) {
      const value = pixels[y * stride + x];
      // Apply the filter we claim to be using, so the decoder must undo it.
      const a = x >= channels ? pixels[y * stride + x - channels] : 0;
      const b = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      let out = value;
      if (filter === 1) out = value - a;
      else if (filter === 2) out = value - b;
      raw[y * (stride + 1) + 1 + x] = out & 0xff;
    }
  }

  const chunk = (type, data) => {
    const head = Buffer.alloc(8);
    head.writeUInt32BE(data.length, 0);
    head.write(type, 4, 'ascii');
    return Buffer.concat([head, data, Buffer.alloc(4)]); // CRC is not checked
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = colorType;

  const parts = [Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr)];
  if (palette) parts.push(chunk('PLTE', Buffer.from(palette)));
  parts.push(chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0)));
  return Buffer.concat(parts);
}

test('PNG decodes truecolour', () => {
  const px = [255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255];
  const img = decodePng(makePng(2, 2, 2, px));
  assert.equal(img.width, 2);
  assert.equal(img.height, 2);
  assert.deepEqual([...img.data.slice(0, 4)], [255, 0, 0, 255]);
  assert.deepEqual([...img.data.slice(4, 8)], [0, 255, 0, 255]);
  assert.deepEqual([...img.data.slice(12, 16)], [255, 255, 255, 255]);
});

test('PNG decodes a palette', () => {
  const img = decodePng(makePng(2, 1, 3, [0, 1], { palette: [10, 20, 30, 40, 50, 60] }));
  assert.deepEqual([...img.data.slice(0, 4)], [10, 20, 30, 255]);
  assert.deepEqual([...img.data.slice(4, 8)], [40, 50, 60, 255]);
});

test('PNG decodes greyscale and RGBA', () => {
  assert.deepEqual([...decodePng(makePng(2, 1, 0, [8, 200])).data.slice(0, 8)],
    [8, 8, 8, 255, 200, 200, 200, 255]);
  assert.deepEqual([...decodePng(makePng(1, 1, 6, [1, 2, 3, 4])).data], [1, 2, 3, 4]);
});

for (const filter of [1, 2]) {
  test(`PNG undoes filter type ${filter}`, () => {
    const px = [];
    for (let i = 0; i < 4 * 4 * 3; i++) px.push((i * 7) % 256);
    const img = decodePng(makePng(4, 4, 2, px, { filter }));
    for (let i = 0, p = 0; i < 16; i++, p += 4) {
      assert.equal(img.data[p], px[i * 3], `pixel ${i} red`);
      assert.equal(img.data[p + 1], px[i * 3 + 1], `pixel ${i} green`);
    }
  });
}

test('PNG rejects things that are not PNGs', () => {
  assert.throws(() => decodePng(Buffer.from('definitely not a png')), /signature/);
});

test('terrarium RGB decodes to the documented elevation', () => {
  // height = R * 256 + G + B / 256 - 32768
  const img = decodePng(makePng(1, 1, 2, [128, 209, 32]));
  const [r, g, b] = img.data;
  assert.equal(r * 256 + g + b / 256 - 32768, 209.125);
});

/* --------------------------------- scatter -------------------------------- */

test('a mask blocks what has been marked and nothing else', () => {
  const m = new OccupancyMask(100, 2);
  assert.equal(m.get(0, 0), false);
  m.markDisc(0, 0, 6);
  assert.equal(m.get(0, 0), true);
  assert.equal(m.get(4, 0), true);
  assert.equal(m.get(40, 0), false);
});

test('a mask stamps a road along its whole length', () => {
  const m = new OccupancyMask(200, 2);
  m.markLine([[-100, 0], [100, 0]], 8);
  assert.equal(m.get(0, 0), true);
  assert.equal(m.get(-90, 3), true);
  assert.equal(m.get(90, -3), true);
  assert.equal(m.get(0, 40), false);
});

test('a mask fills a polygon but not its hole', () => {
  const m = new OccupancyMask(100, 2);
  m.markPolygon([
    [[-40, -40], [40, -40], [40, 40], [-40, 40]],
    [[-10, -10], [10, -10], [10, 10], [-10, 10]],
  ]);
  assert.equal(m.get(30, 30), true);
  assert.equal(m.get(0, 0), false, 'the hole must stay clear');
  assert.equal(m.get(80, 80), false);
});

test('a mask carries per-cell values', () => {
  const m = new OccupancyMask(100, 2);
  m.markDisc(0, 0, 4, 200);
  assert.equal(m.valueAt(0, 0), 200);
  assert.equal(m.valueAt(50, 50), 0);
});

test('points outside the mask never read as blocked', () => {
  const m = new OccupancyMask(50, 2);
  m.markDisc(0, 0, 10);
  assert.equal(m.get(5000, 5000), false);
  assert.equal(m.index(5000, 5000), -1);
});

test('scatter respects canopy density', () => {
  const none = scatter({ half: 200, spacing: 10, canopyAt: () => 0, accept: () => true, max: 1e6 });
  assert.equal(none.length, 0);
  const all = scatter({ half: 200, spacing: 10, canopyAt: () => 1, accept: () => true, max: 1e6 });
  assert.ok(all.length > 1200, `expected a full grid, got ${all.length}`);
});

test('scatter honours the accept test and the cap', () => {
  const half = scatter({
    half: 200, spacing: 10, canopyAt: () => 1, accept: (x) => x < 0, max: 1e6,
  });
  assert.ok(half.every((p) => p.x < 0));
  assert.equal(
    scatter({ half: 200, spacing: 10, canopyAt: () => 1, accept: () => true, max: 50 }).length,
    50,
  );
});

test('scatter is deterministic and jittered off the grid', () => {
  const args = { half: 150, spacing: 12, canopyAt: () => 1, accept: () => true, max: 500 };
  const a = scatter({ ...args });
  const b = scatter({ ...args });
  assert.deepEqual(a, b, 'the same map must produce the same trees');
  const c = scatter({ ...args, seed: 99 });
  assert.notDeepEqual(a, c, 'a different seed must move them');
  // No two trees should share an exact coordinate on the underlying grid.
  const xs = new Set(a.map((p) => p.x.toFixed(6)));
  assert.ok(xs.size > a.length * 0.5, 'positions look unjittered');
});

test('hash2 is stable and well spread', () => {
  assert.equal(hash2(3, 7, 1), hash2(3, 7, 1));
  assert.notEqual(hash2(3, 7, 1), hash2(7, 3, 1));
  const seen = new Set();
  for (let i = 0; i < 40; i++) for (let j = 0; j < 40; j++) seen.add(hash2(i, j, 5));
  assert.ok(seen.size > 1500, `only ${seen.size} distinct hashes from 1600 cells`);
});

test('pointInRing handles the margin', () => {
  const ring = [[0, 0], [10, 0], [10, 10], [0, 10]];
  assert.equal(pointInRing(5, 5, ring), true);
  assert.equal(pointInRing(12, 5, ring), false);
  assert.equal(pointInRing(12, 5, ring, 3), true, 'margin should reach it');
});

/* -------------------------------- elevation ------------------------------- */

test('terrain zoom targets the requested ground resolution', () => {
  const z = chooseTerrainZoom(43, 845, 8);
  assert.ok(z >= 13 && z <= 15, `got zoom ${z}`);
  // A coarser target is allowed to pick a lower zoom, never a higher one.
  assert.ok(chooseTerrainZoom(43, 845, 30) <= z);
});

test('flat terrain is flat', () => {
  const t = flatTerrain(120);
  assert.equal(t.enabled, false);
  assert.equal(t.heightAt(500, -500), 0);
  assert.equal(t.baseElevation, 120);
});

/* -------------------------------- landcover ------------------------------- */

test('the NLCD legend is well formed', () => {
  const codes = new Set();
  for (const c of NLCD_CLASSES) {
    assert.equal(c.rgb.length, 3, `${c.name} needs an rgb triple`);
    assert.ok(c.canopy >= 0 && c.canopy <= 1, `${c.name} canopy out of range`);
    assert.ok(MATERIALS[c.material], `${c.name} maps to unknown material ${c.material}`);
    assert.ok(!codes.has(c.code), `duplicate NLCD code ${c.code}`);
    codes.add(c.code);
  }
  // Forest classes must actually produce trees, water must not.
  assert.equal(NLCD_CLASSES.find((c) => c.code === 42).canopy, 1);
  assert.equal(NLCD_CLASSES.find((c) => c.code === 11).canopy, 0);
});

test('no pixel can fall within tolerance of two NLCD classes', () => {
  // Otherwise which class wins would depend on the order of the table.
  for (let i = 0; i < NLCD_CLASSES.length; i++) {
    for (let j = i + 1; j < NLCD_CLASSES.length; j++) {
      const [a, b] = [NLCD_CLASSES[i], NLCD_CLASSES[j]];
      const d = Math.hypot(...a.rgb.map((v, k) => v - b.rgb[k]));
      assert.ok(
        d > 2 * MATCH_TOLERANCE,
        `${a.name} and ${b.name} are ${d.toFixed(0)} apart, ` +
          `within 2x the ${MATCH_TOLERANCE} tolerance`,
      );
    }
  }
});

/* ------------------------------ platform seam ----------------------------- */

import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { hashString, cacheKey as platformCacheKey, concatBytes, CACHE_VERSION } from '../src/platform.js';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

function jsFilesUnder(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...jsFilesUnder(full));
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

test('shared modules never import node: built-ins', () => {
  // The hosted build loads these same files in a browser. A stray `node:`
  // import throws there and nowhere else, so guard it here instead.
  const hostOnly = new Set(['node', 'cli.js', 'play.js', 'serve.js']);
  const offenders = [];

  for (const file of jsFilesUnder(SRC)) {
    const rel = relative(SRC, file);
    const [first] = rel.split('/');
    if (hostOnly.has(first) || hostOnly.has(rel)) continue;

    const source = readFileSync(file, 'utf8');
    for (const m of source.matchAll(/from\s+['"](node:[a-z/]+)['"]/g)) {
      offenders.push(`${rel} imports ${m[1]}`);
    }
    if (/\bBuffer\s*\.\s*(from|alloc|concat)\b/.test(source)) {
      offenders.push(`${rel} uses Buffer, which browsers do not have`);
    }
  }

  assert.deepEqual(offenders, [], `these run in the browser too:\n  ${offenders.join('\n  ')}`);
});

test('both platform adapters satisfy the same contract', async () => {
  const node = await import('../src/node/platform-node.js');
  const web = await import('../src/browser/platform-web.js');
  assert.equal(typeof node.installNodePlatform, 'function');
  assert.equal(typeof web.installWebPlatform, 'function');
});

test('cache keys are stable, distinct and version-tagged', () => {
  assert.equal(platformCacheKey('a', 'b'), platformCacheKey('a', 'b'));
  const keys = new Set(['a', 'b', 'ab', 'ba', 'aa'].map((s) => platformCacheKey(s)));
  assert.equal(keys.size, 5, 'these inputs must not collide');
  assert.match(platformCacheKey('x'), /^[0-9a-f]{16}$/);
  // Bumping the version must invalidate everything, or a format change gets
  // read back through the old entries and silently produces a different map.
  assert.ok(CACHE_VERSION >= 1);
});

test('hashString is deterministic across inputs', () => {
  assert.equal(hashString('map3d'), hashString('map3d'));
  assert.notEqual(hashString('map3d'), hashString('map3e'));
  assert.match(hashString(''), /^[0-9a-f]{8}$/);
});

test('concatBytes joins typed arrays in order', () => {
  const out = concatBytes([new Uint8Array([1, 2]), new Uint8Array([]), new Uint8Array([3])]);
  assert.deepEqual([...out], [1, 2, 3]);
  assert.equal(concatBytes([]).length, 0);
});

test('the browser entry point only imports portable modules', () => {
  const app = readFileSync(join(SRC, '..', 'web', 'app.js'), 'utf8');
  assert.ok(
    !/from\s+['"]\.\.\//.test(app),
    'web/app.js must not import above the site root: Pages serves it under /<repo>/',
  );
  for (const m of app.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
    const spec = m[1];
    if (spec === 'three' || spec.startsWith('three/')) continue;
    // Relative to the *served* site, where src/ sits beside app.js. A '../'
    // here climbs above the site root on a project Pages URL like /Mobile/.
    assert.ok(spec.startsWith('./src/'), `web/app.js imports ${spec}`);
    assert.ok(!spec.includes('/node/'), `web/app.js must not import ${spec}`);
  }
});

/* --------------------------- trusting the mirrors ------------------------- */

import { runQuery } from '../src/overpass.js';
import { OVERPASS_ENDPOINTS } from '../src/config.js';
import { installPlatform } from '../src/platform.js';

/** Runs runQuery against a scripted set of responses, with no real network. */
async function withFakeOverpass(responses, fn) {
  const realFetch = globalThis.fetch;
  installPlatform({ cache: { async read() { return null; }, async write() {} } });
  globalThis.fetch = async (url) => {
    const host = new URL(url).host;
    const r = responses[host];
    if (!r) throw new TypeError('fetch failed');
    if (r.status && r.status >= 400) {
      return { ok: false, status: r.status, async text() { return ''; } };
    }
    return { ok: true, status: 200, async text() { return JSON.stringify({ elements: r.elements }); } };
  };
  try {
    return await fn();
  } finally {
    globalThis.fetch = realFetch;
  }
}

const HOSTS = OVERPASS_ENDPOINTS.map((u) => new URL(u).host);

test('an empty answer is trusted only when nothing else failed', async () => {
  // Every mirror answers, all agree the area is empty: believe them.
  const allEmpty = Object.fromEntries(HOSTS.map((h) => [h, { elements: [] }]));
  await withFakeOverpass(allEmpty, async () => {
    const res = await runQuery('[out:json];out;', { retries: 0 });
    assert.deepEqual(res.elements, []);
  });
});

test('an empty answer is refused when other mirrors errored', async () => {
  // This is the real failure: every usable mirror is down and the one that
  // answers carries a regional extract, so its "nothing here" means nothing.
  // Believing it produced a map with no buildings and no roads.
  const mostlyBroken = Object.fromEntries(HOSTS.map((h, i) => [h,
    i === HOSTS.length - 1 ? { elements: [] } : { status: 503 }]));
  await withFakeOverpass(mostlyBroken, async () => {
    await assert.rejects(
      () => runQuery('[out:json];out;', { retries: 0 }),
      /cannot be trusted/,
    );
  });
});

test('a mirror with data wins over one without', async () => {
  const mixed = Object.fromEntries(HOSTS.map((h, i) => [h,
    i === 0 ? { elements: [] } : { elements: [{ type: 'node', id: 1, lat: 0, lon: 0 }] }]));
  await withFakeOverpass(mixed, async () => {
    const res = await runQuery('[out:json];out;', { retries: 0 });
    assert.equal(res.elements.length, 1);
  });
});

test('total failure explains itself', async () => {
  await withFakeOverpass({}, async () => {
    await assert.rejects(
      () => runQuery('[out:json];out;', { retries: 0 }),
      /Every Overpass mirror failed/,
    );
  });
});

test('no regional extract is used as a general fallback', () => {
  // overpass.osm.ch serves Switzerland and answers "200, nothing here" for
  // everywhere else, which reads as success and is worse than an error.
  for (const url of OVERPASS_ENDPOINTS) {
    assert.ok(!/osm\.ch/.test(url), `${url} only carries a regional extract`);
  }
});
