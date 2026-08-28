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
  orientedBox, convexHull, polygonAreaXZ, centroidXZ, cleanRing,
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
  assert.equal(glb.toString('ascii', 0, 4), 'glTF');
  assert.equal(glb.readUInt32LE(4), 2);
  assert.equal(glb.readUInt32LE(8), glb.length);
  assert.equal(glb.length % 4, 0);

  const jsonLen = glb.readUInt32LE(12);
  assert.equal(glb.readUInt32LE(16), 0x4e4f534a); // 'JSON'
  const gltf = JSON.parse(glb.toString('utf8', 20, 20 + jsonLen));
  assert.equal(glb.readUInt32LE(20 + jsonLen + 4), 0x004e4942); // 'BIN'
  assert.equal(gltf.buffers[0].byteLength, glb.readUInt32LE(20 + jsonLen));
  assert.equal(gltf.meshes.length, 3);
});

test('GLB accessors stay inside their buffer views', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  const gltf = JSON.parse(glb.toString('utf8', 20, 20 + glb.readUInt32LE(12)));
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
  const jsonLen = glb.readUInt32LE(12);
  const gltf = JSON.parse(glb.toString('utf8', 20, 20 + jsonLen));
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
  const gltf = JSON.parse(glb.toString('utf8', 20, 20 + glb.readUInt32LE(12)));
  for (const mesh of gltf.meshes) {
    const a = gltf.accessors[mesh.primitives[0].attributes.POSITION];
    assert.equal(a.min.length, 3);
    assert.equal(a.max.length, 3);
    for (let i = 0; i < 3; i++) assert.ok(a.min[i] <= a.max[i]);
  }
});

test('the sRGB palette is written to glTF as linear', () => {
  const glb = writeGlb(sampleBuilder(), MATERIALS);
  const gltf = JSON.parse(glb.toString('utf8', 20, 20 + glb.readUInt32LE(12)));
  const roof = gltf.materials.find((m) => m.name === 'roof');
  const [r] = roof.pbrMetallicRoughness.baseColorFactor;
  assert.ok(r < MATERIALS.roof.color[0], 'linear value should be below the sRGB one');
  assert.ok(Math.abs(r - ((MATERIALS.roof.color[0] + 0.055) / 1.055) ** 2.4) < 1e-6);
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
