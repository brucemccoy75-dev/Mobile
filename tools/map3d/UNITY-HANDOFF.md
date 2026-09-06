# Handoff: map3d → Unity

**For a fresh Claude Code session running locally on the machine with Unity.**
Everything described here was built in a previous session in a cloud container,
which could not reach the Unity Editor. That is why the work moves to your
machine now. The tool is finished and working; the job ahead is consuming its
output inside the Unity project **Neighborhood Watch**.

---

## 1. Where things are

| | |
|---|---|
| Repo | `brucemccoy75-dev/Mobile` |
| Branch | `claude/3d-map-generator-addresses-1v1g89` (all the work; there is no `main` on the remote) |
| Tool | `tools/map3d/` |
| Full documentation | `tools/map3d/README.md` — read it for depth; this file is the briefing |
| Live browser version | <https://brucemccoy75-dev.github.io/Mobile/> |

Clone it next to the Unity project — the two are separate. map3d produces
files; Unity consumes them. They do not need to live in the same folder.

---

## 2. What was built

A tool that takes a **real-world street address** and generates a **3D map of
roughly a half-mile radius** around it, matching reality as closely as public
data allows. It exists to feed a 3D game with real neighbourhoods.

It runs two ways, from one codebase:

- **CLI** (Node 18+, zero dependencies) — writes `.glb` / `.json` / `.obj` files.
- **Browser** — the same modules run in the page. You type an address and land
  in it in first person, on foot or flying. Nothing is uploaded; the page talks
  to the map services directly. This is what is hosted on GitHub Pages.

The whole thing is plain ES modules with **no build step and no dependencies**.
`src/platform.js` is the seam: inflating PNGs, caching and writing files are the
only things that genuinely differ between Node and a browser, and each host
installs its own adapter at startup (`src/node/`, `src/browser/`).

### Why OpenStreetMap and not Google

Google's Photorealistic 3D Tiles cannot be redistributed or baked into a game
build — the licence forbids exactly the thing we need. OSM is ODbL: usable in a
shipped game, **provided the attribution string travels with it**. It is in
every manifest under `attribution`, and it needs to end up somewhere in the
game's credits.

---

## 3. How it works

```
address ──► Nominatim ──► lat/lon
                            │
   ┌────────────────────────┼─────────────────────────┐
   ▼                        ▼                         ▼
Overpass API          Mapzen terrarium          USGS NLCD
(OSM vectors:         (elevation tiles          (land cover,
 buildings, roads,     on AWS, ~7m)              US only —
 water, land use,                                drives ground
 trees, barriers)                                colour + where
   │                        │                    trees go)
   └────────────────────────┼─────────────────────────┘
                            ▼
                    src/scene.js  (geometry)
                            ▼
              ┌─────────────┴─────────────┐
              ▼                           ▼
        map.glb (mesh)            map.json (the data)
```

- **Overpass** is queried across several mirrors, in order, until one answers
  usefully. They are volunteer-run and frequently return 502/503.
- **Elevation** is RGB-encoded in terrarium PNGs: `R*256 + G + B/256 - 32768`
  metres. The ground is a 128×128 triangulated grid over that field.
- **Land cover** is US-only; outside the US the ground falls back to OSM
  polygons alone, which in rural areas means a much emptier map.

---

## 4. The two outputs — this is the part that matters for Unity

### `map.glb`

The rendered mesh: ground, roads, water, buildings with roofs, walls, trees.
Merged by material into one primitive each, single-buffer binary glTF.

For the Dunbarton map at the default half-mile radius: **~242,000 triangles,
about 16 MB**. Measured on that build, **185,286 of those triangles — 76% of the
entire mesh — are trees** (8,517 of them, trunk + canopy). That is the first
thing to reconsider on the Unity side; see section 8, step 4.

### `map.json` — the manifest

**This is probably more useful to the game than the mesh is.** It carries every
feature as data, so the game can spawn its own colliders, NPC paths and props
procedurally rather than raycasting a render mesh:

```jsonc
{
  "origin": { "lat": 43.0863877, "lon": -71.6094191 },  // the address, at (0,0,0)
  "radiusMeters": 804.672,
  "bounds":       { "minX": -844.672, "maxX": 844.672, "minZ": -844.672, "maxZ": 844.672 },
  "groundBounds": { "minX": -860.672, "maxX": 860.672, "minZ": -860.672, "maxZ": 860.672 },
  "axes": "X=east, Y=up, -Z=north (metres)",
  "spawn": { "x": 0, "y": 0, "z": 0 },           // ground height at the address
  "terrain": { "enabled": true, "provider": "terrarium", "resolutionMeters": 3.5,
               "baseElevationMeters": 212.83, "minMeters": -21.48, "maxMeters": 30.77 },

  "buildings": [{
    "id": "way/228534603",
    "type": "house", "material": "building_residential",
    "name": "…", "address": "80 Flintlock Farm Road",
    "centre": { "x": 46.9, "z": 74.6 },
    "groundY": 0, "baseMeters": 0, "heightMeters": 9.4,
    "levels": 2,
    "roof": { "shape": "hipped", "heightMeters": 3.36 },
    "heightEstimated": true,        // no height/levels in OSM; this is a guess
    "footprintM2": 435,
    "outline": [[x, z], …],         // closed CCW ring, metres
    "holes": [[[x, z], …]]          // courtyards, if any
  }],

  "roads": [{
    "id": "way/4712", "kind": "residential", "name": "Flintlock Farm Road",
    "widthMeters": 6.5, "oneway": true, "bridge": true, "tunnel": true,
    "maxspeed": "30",
    "centerlines": [[[x, z], …]]    // one array per piece after clipping
  }],

  "areas": [{ "id": …, "kind": "water", "name": …, "areaM2": …, "outline": […],
              "sport": "baseball" }],          // sport only on leisure=pitch
  "props": [{ "kind": "tree", "x": …, "y": …, "z": …, "heightMeters": 7.3,
              "source": "osm" },               // or "scattered"
            // Landmarks: things worth a shape of their own rather than a footprint
            // extrusion. `prop` names the catalogue entry (classifyProp in tags.js);
            // radius/height come from OSM where it says, and are fallbacks otherwise.
            { "kind": "landmark", "prop": "water_tower", "name": …, "x": …, "y": …,
              "z": …, "radiusMeters": 6, "heightMeters": 28, "rotationDeg": 0 },
            // Roller coasters. The ground plan is real; OSM carries no height at
            // all, so the engine invents the profile it hangs on this.
            { "kind": "coaster", "name": …, "points": [[x, z, y], …] }],
  "stats": { "buildings": 15, "roads": 58, "triangles": 242298, "trees": 8517, … },
  "attribution": "Map data (c) OpenStreetMap contributors, ODbL 1.0 …"
}
```

Everything is in **metres**, relative to the address at the origin. Road
`centerlines` are polylines with a real `widthMeters`, so they extrude into
colliders or navmesh carve volumes directly. Building `outline` rings are closed
and counter-clockwise, so they extrude into box/mesh colliders — far cheaper
than colliding against the render mesh, and you get one collider per building
instead of one per material batch.

---

## 5. Coordinate systems — verify this first, do not assume

The map is authored in **glTF's convention: +X east, +Y up, −Z north, metres,
right-handed.**

**Unity is left-handed.** When a `.glb` is imported, the importer applies a
handedness conversion — it flips an axis. That means the raw `x`/`z` numbers in
`map.json` are **not guaranteed to line up with the imported mesh** until you
know which axis moved.

**The first task in the Unity session is to establish this empirically, not from
documentation.** A good check:

1. Pick a named road from `map.json` with an obvious shape (an intersection, a
   dead end) and note its `centerlines` coordinates.
2. Find the same feature in the imported mesh in the Scene view.
3. Compare. Derive the transform once, write it down, and put it in one place in
   code that everything else uses.

Get this wrong and every collider will be mirrored about an axis — which looks
almost right, which is the worst kind of wrong.

Unity has **no built-in `.glb` importer**. Install **glTFast**
(`com.unity.cloud.gltfast`) via Package Manager; it registers itself as the
default importer for `.gltf` and `.glb`, after which dragging the file into
`Assets/` just works.

---

## 6. How to generate a map

```bash
cd tools/map3d
node --test test/*.test.js                    # 112 tests, all should pass

# Build files for the engine
node bin/map3d.js build "80 Flintlock Farm Road, Dunbarton, NH"
#   -> ./out/<slug>/map.glb, map.json, index.html (a preview viewer)

# Useful flags
node bin/map3d.js build "<address>" --radius 400m --no-trees --format glb,json
node bin/map3d.js build "<address>" --out ../../NeighborhoodWatch/Assets/Maps/dunbarton

# Walk the map in a browser before committing to it
node bin/map3d.js play                        # http://localhost:8080
```

`node bin/map3d.js --help` lists everything. Responses are cached in
`.map3d-cache/`, so rebuilding the same place is near-instant.

You can also just use <https://brucemccoy75-dev.github.io/Mobile/>, walk the
map, and hit **Download .glb** — but that gives you the mesh only, not the
manifest, so the CLI is the better route for engine work.

---

## 7. State of the code

Recent commits, newest first:

- `8658f4c` — buildings got fitted roofs, per-building colour, doors, windows,
  trim. Roof pitch now derives from the building's span (~30°) rather than its
  height; `building:levels` is correctly treated as wall height with the roof
  added on top.
- `f9868f3` — **the seating fix.** Everything lying on the ground now samples
  the ground *mesh* rather than the smooth elevation field behind it. Before
  this, roads sank into hillsides and trees floated. Measured: surface below
  ground went 5.9% → 0.0% on the Dunbarton map (worst case −2.22 m → −0.14 m),
  and 11.8% → 2.1% in San Francisco (worst −26.33 m → −1.40 m).
- `2a9ad3a` — fly mode in the browser shell, faster walk/run.

112 tests in `test/map3d.test.js`, run with `node --test test/*.test.js`
(unquoted — the quoted glob needs Node 21+).

### Known imperfections, honestly

- In very steep terrain (San Francisco), ~2% of ground-hugging surface still
  sits below the terrain, worst case 1.4 m, all of it large area fills chording
  across a fold inside one grid cell. Flat and rolling maps are clean.
- Building heights are **mostly estimated**. Most OSM buildings carry no
  `height` or `building:levels`, so a per-type default is used and jittered
  deterministically. `heightEstimated: true` in the manifest tells you which.
- Roof shapes are largely **inferred**, not surveyed. Doors and windows are
  entirely invented — OSM does not know where anyone's front door is.
- Outside the US there is no land cover, so rural maps are much barer.

---

## 8. What we are doing next, in Unity

**Goal: consume this output inside Neighborhood Watch.**

The likely shape of the work, roughly in order:

1. **Connect.** Unity's official MCP server lives in the AI Assistant package —
   *Edit → Project Settings → AI → Unity MCP* — and registers Claude Code as a
   client. That gives live access to the open Editor: scene, console,
   GameObjects, scripts. The new **Unity CLI** (`unity`) covers the
   deterministic half — editors, builds, tests — and with `unity pipeline
   install` plus `[CliCommand]` attributes you can expose project-specific
   verbs like "import this map" and call them with `unity command <name>`.
   Use both; they do different jobs.
2. **Import one map and settle the axis question** (section 5). Nothing else is
   trustworthy until that is nailed down.
3. **Write the manifest importer.** A C# editor script that reads `map.json` and
   builds, from data rather than from the mesh: road colliders from
   `centerlines` × `widthMeters`, building colliders from `outline` rings, the
   player spawn from `spawn`, and water volumes from `areas`.
4. **Decide what to do about the trees.** They are 76% of the mesh — 185k of
   242k triangles. Almost certainly better: build with `--no-trees`, then
   instantiate Unity prefabs (or terrain detail instances) from the `props`
   array, which gives GPU instancing, LODs and billboards for free. This is
   probably the single biggest win available.
5. **Then the game itself** — whatever Neighborhood Watch needs on top of a real
   neighbourhood.

---

## 9. Things worth knowing that cost time to learn

- **Address spelling matters.** The house is on "Flintlock **Farm** Road"
  (singular) in OSM, not "Farms". If geocoding fails, try the OSM spelling, or
  pass `lat,lon` directly — both work as the address argument.
- **The same address can give different maps on different days.** Building this
  map twice within an hour gave 15 buildings / 58 roads once and 22 / 65 the
  other time, from an identical geocode — different Overpass mirrors answered,
  and they do not all carry equally fresh extracts. If a rebuild loses features
  you expected, that is the likely cause, not the tool. Check
  `stats` against the previous build before assuming a regression.
- **Overpass mirrors fail constantly** and an empty answer is not the same as an
  empty place. There is explicit logic in `src/overpass.js` for this: an empty
  result is only trusted when no other mirror errored. A regional-extract mirror
  answering "200, nothing here" for New Hampshire once produced a map with
  terrain and 8,600 trees and zero buildings or roads — which looks like success
  and is the worst possible failure. `manifest.warning` is set when a build
  finishes with no buildings and no roads.
- **Nominatim refuses requests with no User-Agent** (403). Browsers always send
  one, so the hosted site is fine; this only bites tooling that strips headers.
- **The manifest is the interface, not the mesh.** If something is awkward to
  extract from the geometry, check whether it is already in `map.json` — it
  usually is.
- **The ODbL attribution has to ship** with anything built from this data.

---

*Written at the end of the session that built the tool, for the session that
will put it in a game.*
