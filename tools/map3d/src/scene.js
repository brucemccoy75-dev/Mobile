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
  facadeDetail, orientedBox,
} from './mesh.js';
import {
  MATERIALS, AREA_CANOPY, buildingHeights, classifyBuilding, classifyArea,
  classifyHighway, classifyRailway, classifyWaterway, classifyProp, parseLength, parseIntTag,
  wallMaterial, roofMaterial,
} from './tags.js';
import { OccupancyMask, scatter } from './scatter.js';
import { pickHome, doorstep } from './home.js';

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
    landmarks: true,
    roofs: true,
    terrainCells: terrain.enabled ? DEFAULTS.terrainGrid : DEFAULTS.terrainFlatGrid,
    treeSpacing: DEFAULTS.treeSpacing,
    maxTrees: DEFAULTS.maxTrees,
    minAreaM2: 2,
    facades: true,
    // Trim, doors and windows on every building in a dense city would cost
    // more triangles than the buildings themselves. Spend the budget on the
    // ones nearest the address, where they will actually be seen.
    facadeBudget: 90000,
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
  // Area fills are the biggest thing laid on the ground - one park can be a
  // third of the map - and a chord only misses ground that bends. Washington's
  // lawns are flat enough to cover in a few large triangles; the same rule over
  // a San Francisco hillside needs four times the detail. Scale by how much the
  // ground actually moves from one grid cell to the next.
  const reliefPerCell = (terrain.max - terrain.min) / opts.terrainCells;
  const areaDetail = detail * Math.min(Math.max(0.35 / (reliefPerCell || 0.35), 1), 4);

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

  /* ------------------------------ landmarks ------------------------------ */

  // Fountains, water towers, big wheels, coaster track. These go out as manifest
  // props rather than triangles: the engine instances one mesh per kind, the way
  // it already does for trees, so a new landmark costs a tag rule in tags.js and
  // a mesh in the engine and nothing here.
  //
  // Anything also tagged as a building is left to the building pass. A footprint
  // extrusion of the real outline beats a stock shape, and emitting both would
  // put two solids in the same place.
  let landmarkCount = 0;
  let coasterCount = 0;
  if (opts.landmarks) {
    for (const f of local) {
      if (f.tags.building || f.tags['building:part']) continue;
      const cls = classifyProp(f.tags);
      if (!cls) continue;

      let x;
      let z;
      let radius = cls.radius;
      if (f.kind === 'point') {
        [x, z] = f.point;
      } else if (f.kind === 'area' && f.rings?.[0]?.length >= 3) {
        const ring = f.rings[0];
        [x, z] = centroidXZ(ring);
        // The footprint is the truth about how big the thing is; the catalogue's
        // radius is only there for a bare node with no outline at all.
        let far = 0;
        for (const [px, pz] of ring) far = Math.max(far, Math.hypot(px - x, pz - z));
        if (far > 1) radius = far;
      } else continue;
      if (!insideBounds(x, z, boundary)) continue;

      manifest.props.push({
        id: f.id,
        kind: 'landmark',
        prop: cls.prop,
        name: f.tags.name,
        x: round(x, 2),
        z: round(z, 2),
        y: round(surface(x, z), 2),
        radiusMeters: round(radius, 2),
        heightMeters: round(parseLength(f.tags.height) ?? cls.height, 1),
        rotationDeg: 0,
        source: 'osm',
      });
      landmarkCount++;
    }

    // A coaster is mapped as a flat polyline: OSM has the ground plan and no
    // height at all. The plan is the half that makes it recognisable, so hand it
    // over and let the engine invent a profile to hang on it.
    for (const f of local) {
      if (f.kind !== 'line' || f.tags.roller_coaster !== 'track') continue;
      for (const piece of clipLine(f.line, boundary)) {
        if (piece.length < 2) continue;
        manifest.props.push({
          id: f.id,
          kind: 'coaster',
          name: f.tags.name,
          points: piece.map(([px, pz]) => [round(px, 2), round(pz, 2), round(surface(px, pz), 2)]),
        });
        coasterCount++;
      }
    }
    manifest.stats.landmarks = landmarkCount;
    manifest.stats.coasters = coasterCount;
  }

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
        maxEdge: terrain.enabled ? areaDetail : 0,
      });
      if (cls.sport === 'baseball' || cls.sport === 'softball') {
        addBallDiamond(builder, norm[0], surface, y, manifest, f.id);
      }
      manifest.areas.push({
        id: f.id,
        kind: cls.material,
        sport: cls.sport || undefined,
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
    const facades = [];
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
      const seed = hash(f.id);
      // The roof's pitch comes from how wide the building is, so the shape has
      // to be measured before the height can be resolved.
      const span = orientedBox(norm[0])?.width ?? 0;
      const h = buildingHeights(f.tags, {
        ...opts, footprintM2: footprintArea, spanM: span, seed,
      });

      // Most OSM buildings carry neither `height` nor `building:levels`, so a
      // whole block falls back to one number and extrudes as a single slab.
      // Nudge estimated heights deterministically (same id -> same height) so
      // the skyline has texture. Measured heights are never touched.
      if (h.estimated && opts.jitter !== false) {
        const spread = 0.84 + ((seed % 1000) / 1000) * 0.38;
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
      const wallGroup = builder.group(wallMaterial(material, f.tags, seed));
      extrudeWalls(wallGroup, norm, () => baseY, () => eaveY, { uvScale: 4 });

      const roofShape = opts.roofs ? normalizeRoofShape(h.roofShape) : 'flat';
      const roofGroup =
        roofShape === 'flat' ? wallGroup : builder.group(roofMaterial(f.tags, seed));
      buildRoof(roofGroup, norm, eaveY, opts.roofs ? h.roofHeight : 0, roofShape, {
        uvScale: 6,
      });

      // A supermarket, an office block or a hangar is a flat-topped slab, and a
      // slab read from the street or the air is a grey box. A parapet lip and a
      // little plant on the roof is the cheapest thing that makes it a building.
      if (opts.roofDetail !== false && roofShape === 'flat' && !isPart && footprintArea > 300) {
        addRoofDetail(builder, norm, eaveY, seed, roofGroup);
      }

      if (opts.facades && !isPart) {
        facades.push({
          ring: norm[0],
          baseY,
          groundY: gMax,
          eaveY,
          levelHeight: opts.levelHeight ?? DEFAULTS.levelHeight,
          distance: Math.hypot(...centroidXZ(norm[0])),
        });
      }

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

    // Nearest first: the budget runs out on the far side of the map, where a
    // window is a pixel, rather than at whichever building OSM happened to
    // list last.
    facades.sort((a, b) => a.distance - b.distance);
    let spent = 0;
    for (const f of facades) {
      if (spent >= opts.facadeBudget) break;
      spent += facadeDetail(builder, f.ring, {
        baseY: f.baseY,
        groundY: f.groundY,
        groundAt: surface,
        eaveY: f.eaveY,
        levelHeight: f.levelHeight,
        facing: nearestRoadPoint(f.ring, roadLines),
        // Trim alone still reads at a distance; windows are what get expensive.
        windows: spent < opts.facadeBudget * 0.75,
      });
    }
    manifest.stats.facadeTriangles = spent;
  }

  /* -------------------------------- spawn ------------------------------- */

  // The geocoder's pin is an estimate along the road. Start the player on the
  // doorstep of the house at the address instead (or the nearest house), and
  // failing that on the nearest road rather than in whatever the pin fell on.
  if (opts.home !== false) {
    const home = pickHome(manifest.buildings, opts.homeTarget ?? {});
    if (home) {
      const b = home.building;
      const step = doorstep(b.outline, nearestRoadPoint(b.outline, roadLines));
      manifest.home = {
        buildingId: b.id,
        address: b.address,
        reason: home.reason,
        centre: b.centre,
      };
      manifest.spawn = {
        x: round(step.x, 2),
        y: round(surface(step.x, step.z), 3),
        z: round(step.z, 2),
        yaw: round(step.yaw, 1),
        facing: step.facing.map((v) => round(v, 3)),
        at: 'doorstep',
      };
    } else {
      let best = null;
      let bestD = 40;
      for (const { line } of roadLines) {
        for (const [x, z] of line) {
          const d = Math.hypot(x, z);
          if (d < bestD) { bestD = d; best = [x, z]; }
        }
      }
      if (best) {
        manifest.spawn = {
          x: round(best[0], 2), y: round(surface(best[0], best[1]), 3), z: round(best[1], 2),
          yaw: 0, facing: [0, -1], at: 'road',
        };
      } else {
        manifest.spawn.at = 'address';
      }
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
        if (opts.treeMeshes !== false) tree(builder, x, z, surface(x, z), height, crown, seed, kind);
        planted.push({ id: f.id, x, z, height, mapped: true, kind, crown });
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
      // With --trees-data-only the engine instances its own tree prefabs from
      // the manifest, which is far cheaper than 20 triangles a tree in a
      // static mesh; the list below is all it needs.
      if (opts.treeMeshes !== false) {
        tree(builder, spot.x, spot.z, y, height, crown, Math.round(spot.r * 1e6),
          conifer ? 'conifer' : 'broadleaf');
      }
      planted.push({
        x: spot.x, z: spot.z, height, scattered: true, crown,
        kind: scrubby ? 'scrub' : conifer ? 'conifer' : 'broadleaf',
      });
    }

    for (const t of planted) {
      manifest.props.push({
        id: t.id,
        kind: 'tree',
        species: t.kind,
        x: round(t.x, 2),
        z: round(t.z, 2),
        y: round(surface(t.x, t.z), 2),
        heightMeters: round(t.height, 1),
        crownMeters: t.crown != null ? round(t.crown, 1) : undefined,
        source: t.mapped ? 'osm' : 'scattered',
      });
    }
    manifest.stats.treeMeshes = opts.treeMeshes !== false;

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

/**
 * The lip and the machinery on top of a flat roof. The parapet is the outline
 * extruded a little past the roof plane, so the roof surface sits slightly sunk
 * inside a rim, which is how a real one looks; the units are small boxes dropped
 * inside the footprint. Deterministic in the building's seed.
 */
function addRoofDetail(builder, rings, eaveY, seed, roofGroup) {
  let state = (seed >>> 0) || 1;
  const rand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const parapet = 0.7 + rand() * 0.6;
  extrudeWalls(roofGroup, rings, () => eaveY - 0.05, () => eaveY + parapet, { uvScale: 3 });

  const ring = rings[0];
  const box = bbox(ring);
  const width = box.maxX - box.minX;
  const depth = box.maxZ - box.minZ;
  if (width < 8 || depth < 8) return;

  const g = builder.group('roof_plant');
  const wanted = Math.min(5, Math.max(1, Math.floor((width * depth) / 900)));
  let placed = 0;
  for (let attempt = 0; attempt < 40 && placed < wanted; attempt++) {
    const x = box.minX + rand() * width;
    const z = box.minZ + rand() * depth;
    // Keep clear of the parapet, or a unit pokes through the wall.
    if (!pointInRing(x, z, ring)) continue;
    const half = 1.3 + rand() * 1.1;
    if (!pointInRing(x + half + 1.5, z, ring) || !pointInRing(x - half - 1.5, z, ring)) continue;
    if (!pointInRing(x, z + half + 1.5, ring) || !pointInRing(x, z - half - 1.5, ring)) continue;
    const tall = 1.1 + rand() * 1.2;
    const unit = [
      [x - half, z - half], [x + half, z - half], [x + half, z + half], [x - half, z + half],
    ];
    const units = normalizeRings([unit]);
    if (!units.length) continue;
    extrudeWalls(g, units, () => eaveY, () => eaveY + tall, { uvScale: 2 });
    fillPolygon(g, units, () => eaveY + tall, { uvScale: 2 });
    placed++;
  }
}

/**
 * Dirt infield and a backstop for a ball field. OSM gives the outline and the
 * sport but never says where home plate is; on the fan-shaped polygon these are
 * usually mapped as, it is the sharpest corner, which is guess enough to make
 * the shape read as a ball field from anywhere on the map.
 */
function addBallDiamond(builder, ring, surface, y, manifest, id) {
  const n = ring.length;
  if (n < 4) return;

  let home = 0;
  let sharpest = Infinity;
  for (let i = 0; i < n; i++) {
    const prev = ring[(i - 1 + n) % n];
    const cur = ring[i];
    const next = ring[(i + 1) % n];
    const a1 = Math.atan2(prev[1] - cur[1], prev[0] - cur[0]);
    const a2 = Math.atan2(next[1] - cur[1], next[0] - cur[0]);
    let angle = Math.abs(a1 - a2);
    if (angle > Math.PI) angle = 2 * Math.PI - angle;
    if (angle < sharpest) {
      sharpest = angle;
      home = i;
    }
  }

  const [hx, hz] = ring[home];
  let far = 0;
  for (const [px, pz] of ring) far = Math.max(far, Math.hypot(px - hx, pz - hz));
  if (far < 20) return;                       // too small to be a ball field
  const infield = Math.min(Math.max(far * 0.42, 12), 30);
  const [cx, cz] = centroidXZ(ring);
  const facing = Math.atan2(cz - hz, cx - hx);

  // A 108 degree fan of dirt, which is what an infield looks like from above.
  const half = Math.PI * 0.3;
  const fan = [[hx, hz]];
  for (let i = 0; i <= 18; i++) {
    const t = facing - half + (2 * half * i) / 18;
    fan.push([hx + Math.cos(t) * infield, hz + Math.sin(t) * infield]);
  }
  fillPolygon(builder.group('infield'), [fan], (x, z) => surface(x, z) + y + 0.012, { uvScale: 12 });

  manifest.props.push({
    id: `${id}-backstop`,
    kind: 'landmark',
    prop: 'backstop',
    x: round(hx - Math.cos(facing) * 4, 2),
    z: round(hz - Math.sin(facing) * 4, 2),
    y: round(surface(hx, hz), 2),
    radiusMeters: round(Math.min(infield * 0.5, 11), 2),
    heightMeters: 5,
    rotationDeg: round((facing * 180) / Math.PI, 1),
    source: 'osm',
  });
}

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

/**
 * The nearest point on a road to a building, used to decide which wall the
 * front door belongs on. Only the centrelines already clipped into the map are
 * considered, so a building with no road near it just keeps its longest wall.
 */
function nearestRoadPoint(ring, roadLines) {
  const [cx, cz] = centroidXZ(ring);
  let best = null;
  let bestDist = 60;
  for (const { line } of roadLines) {
    for (const [x, z] of line) {
      const d = Math.hypot(x - cx, z - cz);
      if (d < bestDist) {
        bestDist = d;
        best = [x, z];
      }
    }
  }
  return best ?? undefined;
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
