// Turns normalised OSM features into meshes plus a machine-readable manifest.
//
// The manifest matters as much as the mesh: a game usually wants the *data*
// (this footprint is a 3-storey house; this polyline is a residential street
// 6.5m wide) so it can spawn colliders, NPC paths and props procedurally.

import { LAYER_Y, DEFAULTS } from './config.js';
import { clipPolygon, clipLine, squareBoundary, circleBoundary } from './clip.js';
import {
  MeshBuilder, normalizeRings, fillPolygon, extrudeWalls, buildRoof, ribbon,
  grid, gridSurface, tree, polygonAreaXZ, centroidXZ, normalizeRoofShape,
} from './mesh.js';
import {
  MATERIALS, AREA_CANOPY, buildingHeights, classifyBuilding, classifyArea,
  classifyHighway, classifyRailway, classifyWaterway, parseLength, parseIntTag,
} from './tags.js';
import { OccupancyMask, scatter } from './scatter.js';

/**
 * @param {object} args
 * @param {import('./project.js').Projector} args.projector
 * @param {Array} args.features from overpass.normalizeElements
 * @param {object} args.terrain from elevation.js
 * @param {number} args.radius metres
 * @param {object} [args.imagery]
 * @param {object} [args.options]
 */
export function buildScene({ projector, features, terrain, radius, imagery, landcover, options = {} }) {
  const opts = {
    shape: 'square',        // 'square' | 'disc'
    buildings: true,
    roads: true,
    areas: true,
    trees: true,
    barriers: true,
    roofs: true,
    terrainCells: terrain.enabled ? DEFAULTS.terrainGrid : DEFAULTS.terrainFlatGrid,
    treeSpacing: DEFAULTS.treeSpacing,
    maxTrees: DEFAULTS.maxTrees,
    minAreaM2: 2,
    // Drop unset keys: the CLI passes `undefined` for every flag the user did
    // not type, and spreading those would erase the defaults above.
    ...Object.fromEntries(Object.entries(options).filter(([, v]) => v !== undefined)),
  };

  const half = radius + (opts.groundPadding ?? DEFAULTS.groundPadding);
  const boundary =
    opts.shape === 'disc' ? circleBoundary(radius, 96) : squareBoundary(half);
  // Centrelines are clipped to the boundary, then widened into ribbons, so a
  // road hugging the edge sticks out by half its width. Overhang the ground
  // by more than the widest road so nothing floats over the void.
  const groundHalf = half + 16;

  const builder = new MeshBuilder();
  const manifest = {
    origin: { lat: projector.lat0, lon: projector.lon0 },
    radiusMeters: radius,
    shape: opts.shape,
    bounds: { minX: -half, maxX: half, minZ: -half, maxZ: half },
    groundBounds: { minX: -half - 16, maxX: half + 16, minZ: -half - 16, maxZ: half + 16 },
    axes: 'X=east, Y=up, -Z=north (metres)',
    terrain: {
      enabled: terrain.enabled,
      provider: terrain.provider,
      resolutionMeters: Number.isFinite(terrain.resolutionMeters)
        ? round(terrain.resolutionMeters, 1)
        : undefined,
      baseElevationMeters: round(terrain.baseElevation, 2),
      minMeters: round(terrain.min, 2),
      maxMeters: round(terrain.max, 2),
    },
    landcover: landcover
      ? { source: landcover.source, resolutionMeters: round(landcover.resolutionMeters, 1),
          summary: landcover.summary }
      : undefined,
    spawn: { x: 0, y: 0, z: 0 },   // filled in once the ground surface exists
    buildings: [],
    roads: [],
    areas: [],
    props: [],
    stats: {},
  };

  const ground = (x, z) => terrain.heightAt(x, z);
  // Everything below is placed on the ground *mesh*, not on the smooth field
  // the mesh approximates. Those differ by however much the terrain curves
  // between grid corners, which is what leaves roads hovering or half buried.
  const surface = gridSurface(groundHalf, opts.terrainCells, ground);
  // Detail finer than the ground itself buys nothing, and costs triangles.
  const detail = (groundHalf * 2) / opts.terrainCells / 2;

  /* ------------------------------- ground ------------------------------- */

  const keepCell =
    opts.shape === 'disc'
      ? (x, z) => Math.hypot(x, z) <= radius + (half - radius) * 0.5
      : undefined;

  manifest.spawn.y = round(surface(0, 0), 3);

  if (imagery?.tiles?.length) {
    addImageryGround(builder, imagery, surface, detail);
  } else {
    // Land cover, where we have it, turns a flat grey plane into forest,
    // pasture and scrub - which is most of what a rural map is made of.
    const groupFor = landcover
      ? (x, z) => builder.group(landcover.materialAt(x, z))
      : () => builder.group('ground');
    grid(groupFor, groundHalf, opts.terrainCells, ground, { keep: keepCell });
  }

  /* --------------------------- project + clip --------------------------- */

  const local = features.map((f) => projectFeature(f, projector));

  // Collected while drawing, then used to decide where props may stand.
  const osmAreas = [];
  const waterAreas = [];
  const roadLines = [];
  const buildingRings = [];

  /* ------------------------------- areas -------------------------------- */

  if (opts.areas) {
    const areaFeatures = [];
    for (const f of local) {
      if (f.kind !== 'area') continue;
      if (f.tags.building || f.tags['building:part']) continue;
      const cls = classifyArea(f.tags);
      if (!cls) continue;
      const rings = clipPolygon(f.rings, boundary);
      if (!rings) continue;
      const norm = normalizeRings(rings);
      if (!norm.length) continue;
      const area = polygonAreaXZ(norm);
      if (area < opts.minAreaM2) continue;
      areaFeatures.push({ f, cls, norm, area });
    }

    // Big shapes first so small ones (a pitch inside a park) land on top.
    areaFeatures.sort((a, b) => b.area - a.area);

    for (const { f, cls, norm, area } of areaFeatures) {
      // Remember what OSM says the ground is, so the tree scatter can defer
      // to it instead of trusting a 30m raster over a surveyed lawn.
      osmAreas.push({ rings: norm, canopy: AREA_CANOPY[cls.material] ?? 0 });
      if (cls.material === 'water') waterAreas.push(norm);
      const y = LAYER_Y[cls.layer] ?? LAYER_Y.landuse;
      const g = builder.group(cls.material);
      fillPolygon(g, norm, (x, z) => surface(x, z) + y, {
        uvScale: 24,
        smooth: terrain.enabled,
        maxEdge: terrain.enabled ? detail : 0,
      });
      manifest.areas.push({
        id: f.id,
        kind: cls.material,
        name: f.tags.name,
        areaM2: round(area, 1),
        outline: roundRing(norm[0]),
        holes: norm.length > 1 ? norm.slice(1).map(roundRing) : undefined,
      });
    }
  }

  /* ------------------------ roads, rails, streams ------------------------ */

  if (opts.roads) {
    const junctions = new Map(); // node id -> widest half-width seen
    const lines = [];

    for (const f of local) {
      if (f.kind !== 'line') continue;

      let cls = classifyHighway(f.tags);
      let layerName = cls
        ? cls.minor
          ? 'footway'
          : 'road'
        : null;

      if (!cls) {
        const rail = classifyRailway(f.tags);
        if (rail) {
          cls = { material: rail.material, width: rail.width, kind: f.tags.railway };
          layerName = 'railway';
        }
      }
      if (!cls) {
        const water = classifyWaterway(f.tags);
        if (water) {
          cls = { material: water.material, width: water.width, kind: f.tags.waterway };
          layerName = 'water';
        }
      }
      if (!cls) continue;

      // Tunnels and subways are below the surface; keep them out of the mesh.
      const tunnel = f.tags.tunnel === 'yes' || f.tags.tunnel === 'building_passage';
      const layerTag = parseIntTag(f.tags.layer) ?? 0;
      const bridge = f.tags.bridge && f.tags.bridge !== 'no';
      const lift = bridge ? Math.max(layerTag, 1) * 4.5 : 0;

      const pieces = clipLine(f.line, boundary);
      if (!pieces.length) continue;

      manifest.roads.push({
        id: f.id,
        kind: cls.kind,
        material: cls.material,
        name: f.tags.name,
        widthMeters: round(cls.width, 2),
        oneway: f.tags.oneway === 'yes' || f.tags.oneway === '-1' || undefined,
        bridge: bridge ? true : undefined,
        tunnel: tunnel ? true : undefined,
        maxspeed: f.tags.maxspeed,
        centerlines: pieces.map(roundRing),
      });

      if (tunnel) continue;

      lines.push({ f, cls, pieces, lift, layerName });
      for (const piece of pieces) roadLines.push({ line: piece, width: cls.width });

      if (!bridge && f.nodes) {
        for (let i = 0; i < f.nodes.length; i++) {
          const id = f.nodes[i];
          const prev = junctions.get(id);
          const entry = prev ?? { count: 0, hw: 0, pt: f.line[i], material: cls.material };
          entry.count++;
          if (cls.width / 2 > entry.hw) {
            entry.hw = cls.width / 2;
            entry.material = cls.material;
          }
          junctions.set(id, entry);
        }
      }
    }

    // Draw wide roads first so narrow ones sit visibly on top of them.
    lines.sort((a, b) => b.cls.width - a.cls.width);

    for (const { cls, pieces, lift, layerName } of lines) {
      const y = (LAYER_Y[layerName] ?? LAYER_Y.road) + lift;
      const g = builder.group(cls.material);
      for (const piece of pieces) {
        ribbon(g, piece, cls.width, (x, z) => surface(x, z) + y, {
          uvScale: cls.width,
          // A bridge deck is meant to be straight; only ground-level roads
          // should be chasing the terrain.
          maxSegment: terrain.enabled && !lift ? detail : 0,
        });
      }
    }

    // Plug the gaps where ribbons meet at an intersection. Junction nodes come
    // from the unclipped centrelines, so the patch has to be clipped too.
    for (const j of junctions.values()) {
      if (j.count < 2 || !j.pt) continue;
      const [x, z] = j.pt;
      const rings = clipPolygon([discRing(x, z, j.hw, 8)], boundary);
      if (!rings) continue;
      const g = builder.group(j.material);
      fillPolygon(g, normalizeRings(rings), (px, pz) => surface(px, pz) + LAYER_Y.road, {
        uvScale: Math.max(j.hw, 1) * 2,
      });
    }
  }

  /* ----------------------------- buildings ------------------------------ */

  if (opts.buildings) {
    // OSM's Simple 3D Buildings scheme: when a building carries `building:part`
    // children, those parts hold the real per-volume heights and the parent
    // outline is only a footprint. Rendering both gives you a church nave
    // extruded to its steeple height, so the parent is drawn only if it has
    // no parts. See https://wiki.openstreetmap.org/wiki/Simple_3D_Buildings
    const candidates = local.filter(
      (f) => f.kind === 'area' && (f.tags.building || f.tags['building:part']) && !isUnderground(f.tags),
    );
    const parents = candidates.filter((f) => f.tags.building);
    const parts = candidates.filter((f) => f.tags['building:part'] && !f.tags.building);
    const parentBoxes = parents.map((f) => ({ f, box: bbox(f.rings[0]) }));

    const supersededByParts = new Set();
    for (const part of parts) {
      const [cx, cz] = centroidXZ(part.rings[0]);
      for (const { f, box } of parentBoxes) {
        if (cx < box.minX || cx > box.maxX || cz < box.minZ || cz > box.maxZ) continue;
        if (pointInRing(cx, cz, f.rings[0])) {
          supersededByParts.add(f.id);
          break;
        }
      }
    }

    for (const f of candidates) {
      const isPart = !f.tags.building;
      if (!isPart && supersededByParts.has(f.id)) {
        // Keep the footprint in the manifest; the parts carry the geometry.
        const outline = clipPolygon(f.rings, boundary);
        if (outline) {
          const norm = normalizeRings(outline);
          if (norm.length) {
            const [cx, cz] = centroidXZ(norm[0]);
            manifest.buildings.push({
              id: f.id,
              type: classifyBuilding(f.tags).type,
              name: f.tags.name,
              address: formatAddress(f.tags),
              centre: { x: round(cx, 2), z: round(cz, 2) },
              renderedAsParts: true,
              footprintM2: round(polygonAreaXZ(norm), 1),
              outline: roundRing(norm[0]),
            });
          }
        }
        continue;
      }

      const rings = clipPolygon(f.rings, boundary);
      if (!rings) continue;
      const norm = normalizeRings(rings);
      if (!norm.length) continue;
      const footprintArea = polygonAreaXZ(norm);
      if (footprintArea < opts.minAreaM2) continue;

      const { material, type } = classifyBuilding(f.tags);
      const h = buildingHeights(f.tags, opts);

      // Most OSM buildings carry neither `height` nor `building:levels`, so a
      // whole block falls back to one number and extrudes as a single slab.
      // Nudge estimated heights deterministically (same id -> same height) so
      // the skyline has texture. Measured heights are never touched.
      if (h.estimated && opts.jitter !== false) {
        const spread = 0.84 + ((hash(f.id) % 1000) / 1000) * 0.38;
        h.top = Math.max(h.base + 1, h.top * spread);
      }

      // Sample the terrain under the footprint so the building neither floats
      // nor sinks on a slope: bury to the lowest corner, top off the highest.
      let gMin = Infinity;
      let gMax = -Infinity;
      for (const [x, z] of norm[0]) {
        const y = surface(x, z);
        if (y < gMin) gMin = y;
        if (y > gMax) gMax = y;
      }
      if (!Number.isFinite(gMin)) gMin = gMax = 0;

      const baseY = gMin + h.base - (h.base > 0 ? 0 : 0.3);
      const eaveY = gMax + h.top - (opts.roofs ? h.roofHeight : 0);

      buildingRings.push(norm);
      const wallGroup = builder.group(material);
      extrudeWalls(wallGroup, norm, () => baseY, () => eaveY, { uvScale: 4 });

      const roofShape = opts.roofs ? normalizeRoofShape(h.roofShape) : 'flat';
      const roofGroup =
        roofShape === 'flat' ? wallGroup : builder.group('roof');
      buildRoof(roofGroup, norm, eaveY, opts.roofs ? h.roofHeight : 0, roofShape, {
        uvScale: 6,
      });

      const [cx, cz] = centroidXZ(norm[0]);
      manifest.buildings.push({
        id: f.id,
        type,
        material,
        isPart: isPart || undefined,
        name: f.tags.name,
        address: formatAddress(f.tags),
        centre: { x: round(cx, 2), z: round(cz, 2) },
        groundY: round(gMax, 2),
        baseMeters: round(h.base, 2),
        heightMeters: round(h.top, 2),
        levels: parseIntTag(f.tags['building:levels']) ?? undefined,
        roof: { shape: roofShape, heightMeters: round(h.roofHeight, 2) },
        heightEstimated: h.estimated || undefined,
        footprintM2: round(footprintArea, 1),
        outline: roundRing(norm[0]),
        holes: norm.length > 1 ? norm.slice(1).map(roundRing) : undefined,
      });
    }
  }

  /* --------------------------- walls and fences -------------------------- */

  if (opts.barriers) {
    const g = builder.group('wall');
    for (const f of local) {
      if (f.kind !== 'line' || !f.tags.barrier) continue;
      const height =
        parseLength(f.tags.height) ??
        { wall: 2, city_wall: 6, retaining_wall: 1.5, fence: 1.8, hedge: 1.5 }[
          f.tags.barrier
        ];
      if (!height) continue;
      const thickness = f.tags.barrier === 'hedge' ? 0.6 : 0.25;
      for (const piece of clipLine(f.line, boundary)) {
        const rings = normalizeRings([thickLine(piece, thickness)]);
        if (!rings.length) continue;
        let gy = Infinity;
        for (const [x, z] of rings[0]) gy = Math.min(gy, surface(x, z));
        extrudeWalls(g, rings, () => gy - 0.2, () => gy + height, { uvScale: 2 });
        fillPolygon(g, rings, () => gy + height, { uvScale: 2 });
      }
    }
  }

  /* -------------------------------- trees -------------------------------- */

  if (opts.trees) {
    // Individually mapped trees are ground truth and always get placed.
    const planted = [];
    for (const f of local) {
      const isTreeNode = f.kind === 'point' && f.tags.natural === 'tree';
      const isTreeRow = f.kind === 'line' && f.tags.natural === 'tree_row';
      if (!isTreeNode && !isTreeRow) continue;

      const spots = isTreeNode ? [f.point] : sampleAlong(f.line, 8);
      for (const [x, z] of spots) {
        if (!insideBounds(x, z, boundary)) continue;
        const seed = hash(`${f.id}:${x.toFixed(1)}:${z.toFixed(1)}`);
        const height = parseLength(f.tags.height) ?? 6 + (seed % 60) / 10;
        const crown = (parseLength(f.tags['diameter_crown']) ?? 0) / 2 || height * 0.28;
        const kind = /conifer|needle|pine|spruce|fir/i.test(
          `${f.tags['leaf_type'] ?? ''} ${f.tags.species ?? ''} ${f.tags.genus ?? ''}`,
        ) ? 'conifer' : 'broadleaf';
        tree(builder, x, z, surface(x, z), height, crown, seed, kind);
        planted.push({ id: f.id, x, z, height, mapped: true });
      }
    }
    const mappedCount = planted.length;

    // Then fill in the woodland. OSM polygons win where they exist; land cover
    // covers the rest, which in rural areas is very nearly all of it.
    const claimed = new OccupancyMask(half, 4);
    for (const area of osmAreas) {
      // 2 = OSM says open ground here; 3+ encodes canopy density.
      claimed.markPolygon(area.rings, 0, 2 + Math.round(area.canopy * 200));
    }

    const blockedMask = new OccupancyMask(half, 2);
    for (const rings of buildingRings) blockedMask.markPolygon(rings, 2.5);
    for (const rings of waterAreas) blockedMask.markPolygon(rings, 1);
    for (const { line, width } of roadLines) blockedMask.markLine(line, width + 3);

    const canopyAt = (x, z) => {
      const c = claimed.valueAt(x, z);
      if (c >= 2) return (c - 2) / 200; // an OSM area covers this spot
      return landcover ? landcover.canopyAt(x, z) : 0;
    };

    const spots = scatter({
      half: radius,
      spacing: opts.treeSpacing,
      canopyAt,
      accept: (x, z) => insideBounds(x, z, boundary) && !blockedMask.get(x, z),
      max: Math.max(0, opts.maxTrees - mappedCount),
      seed: Math.abs(Math.round(projector.lat0 * 1e4)) + 1,
    });

    for (const spot of spots) {
      const cls = landcover?.classAt(spot.x, spot.z);
      const conifer =
        cls?.name === 'evergreen forest' ||
        (cls?.name === 'mixed forest' && spot.r < 0.45) ||
        (!cls && spot.r < 0.35);
      const scrubby = cls?.name === 'shrub/scrub';

      const height = scrubby ? 2 + spot.r * 2.5 : 11 + spot.r * 11;
      const crown = height * (conifer ? 0.2 : 0.34) * (0.8 + spot.r * 0.5);
      const y = surface(spot.x, spot.z);
      tree(builder, spot.x, spot.z, y, height, crown, Math.round(spot.r * 1e6),
        conifer ? 'conifer' : 'broadleaf');
      planted.push({ x: spot.x, z: spot.z, height, scattered: true });
    }

    for (const t of planted) {
      manifest.props.push({
        id: t.id,
        kind: 'tree',
        x: round(t.x, 2),
        z: round(t.z, 2),
        y: round(surface(t.x, t.z), 2),
        heightMeters: round(t.height, 1),
        source: t.mapped ? 'osm' : 'scattered',
      });
    }

    manifest.stats.trees = planted.length;
    manifest.stats.treesMapped = mappedCount;
    manifest.stats.treesScattered = planted.length - mappedCount;
  }

  /* ------------------------------- finish -------------------------------- */

  const totals = builder.finalize();
  manifest.stats = {
    ...manifest.stats,
    buildings: manifest.buildings.length,
    roads: manifest.roads.length,
    areas: manifest.areas.length,
    vertices: totals.vertices,
    triangles: totals.triangles,
    meshes: totals.groups,
  };

  return { builder, manifest, boundary, half };
}

/* -------------------------------- helpers --------------------------------- */

function projectFeature(f, projector) {
  const p = ([lat, lon]) => projector.toLocal(lat, lon);
  if (f.kind === 'point') return { ...f, point: p(f.point) };
  if (f.kind === 'line') return { ...f, line: f.line.map(p) };
  return { ...f, rings: f.rings.map((r) => r.map(p)) };
}

function addImageryGround(builder, imagery, ground, detail = 0) {
  imagery.tiles.forEach((tile, i) => {
    const g = builder.group(`imagery_${i}`);
    g.texture = { data: tile.data, mime: tile.mime };
    const { x0, z0, x1, z1 } = tile;
    // Follow the terrain as closely as the ground grid does, within reason:
    // one imagery tile can cover 300m, and at full detail that is thousands of
    // quads each. Roads sit on this surface, so a coarse tile shows as a road
    // sunk into the hillside.
    const cells = detail > 0
      ? Math.min(Math.max(Math.round((x1 - x0) / detail), 4), 24)
      : 4;
    for (let a = 0; a < cells; a++) {
      for (let b = 0; b < cells; b++) {
        const px = [x0 + ((x1 - x0) * a) / cells, x0 + ((x1 - x0) * (a + 1)) / cells];
        const pz = [z0 + ((z1 - z0) * b) / cells, z0 + ((z1 - z0) * (b + 1)) / cells];
        const uv = [a / cells, (a + 1) / cells, b / cells, (b + 1) / cells];
        const v = (xi, zi, ui, vi) =>
          g.vertex(px[xi], ground(px[xi], pz[zi]) + 0.01, pz[zi], 0, 1, 0, uv[ui], uv[vi]);
        const v00 = v(0, 0, 0, 2);
        const v01 = v(0, 1, 0, 3);
        const v11 = v(1, 1, 1, 3);
        const v10 = v(1, 0, 1, 2);
        g.quad(v00, v01, v11, v10);
      }
    }
  });
}

/** Underground volumes (metro concourses, car parks) are not part of the skyline. */
function isUnderground(tags) {
  return (
    tags.location === 'underground' ||
    tags.tunnel === 'yes' ||
    (parseIntTag(tags.layer) ?? 0) < 0 ||
    (parseIntTag(tags.level) ?? 0) < 0
  );
}

function bbox(ring) {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const [x, z] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  return { minX, maxX, minZ, maxZ };
}

/** Ray-casting point-in-polygon on [x, z] rings. */
function pointInRing(x, z, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, zi] = ring[i];
    const [xj, zj] = ring[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/** A regular n-gon ring, CCW in (u, v). */
function discRing(cx, cz, radius, segments) {
  const ring = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    ring.push([cx + radius * Math.cos(t), cz - radius * Math.sin(t)]);
  }
  return ring;
}

/** Turns a polyline into a thin closed ring so it can be extruded. */
function thickLine(line, thickness) {
  const hw = thickness / 2;
  const left = [];
  const right = [];
  for (let i = 0; i < line.length; i++) {
    const prev = line[i - 1] ?? line[i];
    const next = line[i + 1] ?? line[i];
    const dx = next[0] - prev[0];
    const dz = next[1] - prev[1];
    const len = Math.hypot(dx, dz) || 1;
    const nx = -dz / len;
    const nz = dx / len;
    left.push([line[i][0] + nx * hw, line[i][1] + nz * hw]);
    right.push([line[i][0] - nx * hw, line[i][1] - nz * hw]);
  }
  return left.concat(right.reverse());
}

/** Evenly spaced points along a polyline, for tree rows. */
function sampleAlong(line, spacing) {
  const out = [];
  let carry = 0;
  for (let i = 0; i < line.length - 1; i++) {
    const [ax, az] = line[i];
    const [bx, bz] = line[i + 1];
    const len = Math.hypot(bx - ax, bz - az);
    let t = carry;
    while (t < len) {
      out.push([ax + ((bx - ax) * t) / len, az + ((bz - az) * t) / len]);
      t += spacing;
    }
    carry = t - len;
  }
  return out;
}

function insideBounds(x, z, boundary) {
  for (let i = 0; i < boundary.length; i++) {
    const a = boundary[i];
    const b = boundary[(i + 1) % boundary.length];
    const dx = b[0] - a[0];
    const dv = -b[1] + a[1];
    if (dx * (-z + a[1]) - dv * (x - a[0]) < 0) return false;
  }
  return true;
}

function formatAddress(tags) {
  const parts = [tags['addr:housenumber'], tags['addr:street']].filter(Boolean);
  return parts.length ? parts.join(' ') : undefined;
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function round(n, digits) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

function roundRing(ring) {
  return ring.map(([x, z]) => [round(x, 2), round(z, 2)]);
}

export { MATERIALS };
