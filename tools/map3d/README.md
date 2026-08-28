# map3d

Give it a street address. It gives you back a 3D map of roughly half a mile
around that address — buildings with real footprints and heights, roads at real
widths, parks, water, trees and optional terrain — as a `.glb` you can drop
straight into Unity, Unreal, Godot, Blender or three.js.

Zero dependencies. Node 18+.

```
node tools/map3d/bin/map3d.js build "1600 Pennsylvania Ave NW, Washington, DC"
node tools/map3d/bin/map3d.js serve out/1600-pennsylvania-ave-nw-washington-dc
```

The second command opens a browser preview at <http://localhost:8080> where you
can orbit the map, walk around it at eye level, and click a building to see what
OSM knows about it.

---

## What you get

```
out/<address-slug>/
  map.glb      the 3D map, one mesh per material, ready to import
  map.json     the same map as data: every building, road and area
  index.html   a self-contained three.js viewer for the two files above
  map.obj      (with --format obj) plus map.mtl
```

`map.glb` is the geometry. `map.json` is usually the more valuable half: it
carries every building's footprint polygon, height, type, name and address, and
every road's centreline, width and class. That is what you feed to a spawner to
place colliders, NPC paths, traffic, shop interiors or minimap data — things a
triangle soup can't tell you.

## Where the data comes from

| Layer | Source | Key needed |
| --- | --- | --- |
| Address → coordinates | Nominatim (OSM), or Google Geocoding | no / yes |
| Buildings, roads, land use, water, trees | OpenStreetMap via Overpass | no |
| Terrain elevation (`--terrain`) | OpenTopoData | no |
| Ground imagery (`--imagery`) | any XYZ tile URL you supply | depends |

**Why OpenStreetMap and not Google's 3D tiles?** Google's Photorealistic 3D
Tiles are streamed under terms that don't permit baking them into a game asset,
and they arrive as pre-built meshes with no semantics — you get a triangle that
looks like a shop, not a shop. OSM gives you licensed-to-redistribute vector
data with tags, which is what you actually need to build a game world. Google
is still supported for *geocoding*, where it is genuinely better at messy US
addresses:

```
map3d build "the old Woolworths on Main" --geocoder google --google-key $KEY
```

**Attribution.** OSM data is ODbL 1.0. If you ship a map built from it, credit
"© OpenStreetMap contributors" — the string is in `map.json` under
`attribution`. See <https://www.openstreetmap.org/copyright>.

## Coordinate system

- **+X east, +Y up, −Z north**, metres, right-handed. That is glTF's
  convention, and matches three.js, Godot and Unreal's glTF importer. Unity's
  glTF importers handle the handedness flip for you.
- **The origin is the address.** `(0, 0, 0)` is where you asked for, so
  `manifest.spawn` is where you drop the player.
- Over half a mile the flat-plane approximation is off by a few millimetres
  versus a proper geodesic projection, so you can treat it as exact.

`Projector.toGeo(x, z)` in `src/project.js` converts game coordinates back to
lat/lon — handy if you want to look a spot up on a real map later.

## Usage

```
map3d build "<address or lat,lon>" [options]
map3d serve [directory] [--port 8080]
```

You can skip geocoding entirely by passing coordinates: `map3d build
"51.5007,-0.1246"`.

### Options

| Flag | Default | What it does |
| --- | --- | --- |
| `--radius <dist>` | `0.5mi` | `0.5mi`, `800m`, `1km`, or a bare number of metres |
| `--out <dir>` | `out/<slug>` | Output directory |
| `--format <list>` | `glb,json` | Any of `glb`, `obj`, `json` |
| `--shape square\|disc` | `square` | Square play area, or a circular island |
| `--geocoder nominatim\|google` | `nominatim` | Address lookup provider |
| `--google-key <key>` | `$GOOGLE_MAPS_API_KEY` | Google Geocoding key |
| `--overpass <url>` | built-in mirror list | Use a specific Overpass instance |
| `--terrain [dataset]` | off | Fetch real elevation (`aster30m`, `srtm30m`, …) |
| `--terrain-cells <n>` | `32` | Height field resolution |
| `--elevation-url <url>` | OpenTopoData | Self-hosted elevation endpoint |
| `--imagery <template>` | off | XYZ tile URL, e.g. `https://…/{z}/{x}/{y}.png` |
| `--imagery-zoom <n>` | auto | Force a tile zoom level |
| `--level-height <m>` | `3.2` | Metres per `building:levels` |
| `--no-buildings`, `--no-roads`, `--no-areas`, `--no-trees`, `--no-barriers`, `--no-roofs` | | Drop a layer |
| `--no-jitter` | | Don't vary heights that had to be estimated |
| `--cache <dir>` / `--no-cache` | `.map3d-cache` | Responses are cached so re-runs are instant |
| `--quiet` | | Summary only |

### Examples

```bash
# The default: half a mile, flat ground, everything on
map3d build "Marienplatz, Munich"

# Hilly terrain, circular island, both mesh formats
map3d build "Lombard Street, San Francisco" --radius 450m --terrain --shape disc --format glb,obj,json

# Satellite/map imagery draped on the ground (pick a provider you're licensed for)
map3d build "51.5007,-0.1246" --radius 300m \
  --imagery "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

# A big quiet map: no props, no undergrowth
map3d build "Yellowstone, WY" --radius 1km --no-trees --no-barriers
```

## The manifest (`map.json`)

```jsonc
{
  "origin": { "lat": 48.137144, "lon": 11.575399 },
  "radiusMeters": 500,
  "bounds":       { "minX": -540, "maxX": 540, "minZ": -540, "maxZ": 540 },
  "groundBounds": { "minX": -556, "maxX": 556, "minZ": -556, "maxZ": 556 },
  "axes": "X=east, Y=up, -Z=north (metres)",
  "spawn": { "x": 0, "y": 0, "z": 0 },
  "terrain": { "enabled": true, "baseElevationMeters": 519, "minMeters": -8, "maxMeters": 11 },

  "buildings": [{
    "id": "way/228534603",
    "type": "church", "material": "building_civic",
    "name": "St. Peter", "address": "1 Petersplatz",
    "centre": { "x": 46.9, "z": 74.6 },
    "groundY": 0, "baseMeters": 0, "heightMeters": 91,
    "levels": 3,
    "roof": { "shape": "gabled", "heightMeters": 5 },
    "heightEstimated": true,          // no height/levels in OSM; this is a guess
    "footprintM2": 2254,
    "outline": [[x, z], …],           // closed CCW ring, metres
    "holes": [[[x, z], …]],           // courtyards, if any
    "isPart": true,                   // one volume of a multi-part building
    "renderedAsParts": true           // footprint only; see "Buildings" below
  }],

  "roads": [{
    "id": "way/4712", "kind": "residential", "name": "Sendlinger Straße",
    "widthMeters": 6.5, "oneway": true, "bridge": true, "tunnel": true,
    "maxspeed": "30",
    "centerlines": [[[x, z], …]]      // one array per piece after clipping
  }],

  "areas": [{ "id": …, "kind": "water", "name": …, "areaM2": …, "outline": […] }],
  "props": [{ "kind": "tree", "x": …, "y": …, "z": …, "heightMeters": 7.3 }],
  "stats": { "buildings": 1103, "roads": 1172, "triangles": 45822, … }
}
```

Roads whose `tunnel` is true appear in the manifest but not in the mesh — you
still get the network topology for pathfinding.

## Importing into an engine

- **Unity** — drag `map.glb` in with glTFast or UnityGLTF. One GameObject per
  material; add mesh colliders to the building/ground meshes and leave the
  ground layers as visuals.
- **Unreal** — `Import Into Level` → glTF. Set *Import Uniform Scale* to `100`
  if your project is in centimetres.
- **Godot 4** — drop `map.glb` in the project; it imports as a scene with one
  MeshInstance3D per material.
- **Blender** — `File ▸ Import ▸ glTF 2.0`, for touch-up or baking.
- **three.js** — `GLTFLoader`; `viewer/index.html` is a working example,
  including a ground-following walk mode. It pulls three.js from a CDN, so the
  preview needs an internet connection; to work offline, vendor three.js next
  to `index.html` and point the importmap at it.

For colliders, prefer generating them from `map.json` footprints (a box or
convex hull per building) over using the render mesh — it is far cheaper and
you get one collider per building instead of one per material batch.

## How the geometry is built

1. **Geocode** the address, and set up a local tangent plane centred on it.
2. **Query Overpass** for everything within the radius (`around:` gives a true
   circular selection). Multipolygon relations are stitched into rings.
3. **Project and clip** every feature to the map boundary
   (Sutherland–Hodgman for areas, parametric clipping for lines).
4. **Build meshes**: ear-clipped polygons for ground layers, mitered ribbons
   for roads, extruded footprints with flat/gabled/hipped/pyramidal/skillion
   roofs for buildings, low-poly props for trees.
5. **Merge by material** into one primitive each, and write a single-buffer GLB.

Everything about how it *looks* — colours, fallback heights, road widths, tag
classification — lives in `src/tags.js`. That's the file to edit for a
different art direction.

### Buildings

Height is resolved in this order: the `height` tag, then
`building:levels × --level-height`, then a per-type default (a `house` is 6.5 m,
`apartments` 15 m, and so on). Anything that fell through to the default is
flagged `heightEstimated` in the manifest and gets a small deterministic
variation so a block of untagged buildings doesn't extrude into one flat slab
(`--no-jitter` turns that off).

Where a building has `building:part` children — OSM's
[Simple 3D Buildings](https://wiki.openstreetmap.org/wiki/Simple_3D_Buildings)
scheme, used for churches, stations and anything with a tower — the parts carry
the real per-volume heights and the parent outline is drawn as footprint only.
Without this, a church's nave gets extruded to its steeple's height.

### Layering

Coplanar ground surfaces (land use, then parks, water, parking, footways, roads,
rails) are stacked a few centimetres apart in `config.js` so they never
z-fight. Bridges are lifted by their `layer` tag; tunnels are left out of the
mesh.

## Data quality, honestly

The map is exactly as good as OpenStreetMap is in that spot.

- **Coverage varies enormously.** Central Munich has 1,100 buildings with
  roof shapes and levels. A US suburb may have footprints with no heights at
  all, and rural areas may have only roads. Check `stats` and the
  `heightEstimated` count in `map.json` before you judge the tool.
- **Heights are the weak spot.** Most buildings worldwide have no height tag.
  The defaults are tuned to look plausible, not to be surveyed truth.
- **Interiors don't exist.** These are extruded shells. Doors and windows are
  yours to add.
- **Trees are approximate.** Only individually mapped trees and tree rows are
  placed; a forest polygon is rendered as green ground, not as instanced trees.

If a spot looks wrong, it is usually fixable by editing OSM — and then
re-running with `--no-cache`.

## Networking

Overpass mirrors go down constantly, so the tool walks a list until one answers
usefully (a mirror that returns "200, zero elements" for a region it doesn't
carry is treated as a miss). Every response is cached on disk, so iterating on
the geometry costs nothing after the first fetch. Nominatim and OpenTopoData are
rate-limited to one request per second, per their usage policies.

Use `--overpass <url>` to point at your own instance for heavy use.

## Development

```bash
node --test "tools/map3d/test/*.test.js"
```

60 tests cover the triangulator, clipping, projection, tag parsing, mesh
winding and normals, multipolygon stitching, and the GLB/OBJ writers.

```
src/
  cli.js         argument parsing and the build pipeline
  geocode.js     address -> lat/lon (Nominatim, Google)
  overpass.js    query building, mirror fallback, OSM element normalisation
  elevation.js   optional terrain height field
  imagery.js     optional XYZ tile ground texture
  project.js     lat/lon <-> local metres, slippy-map maths
  clip.js        Sutherland-Hodgman and line clipping
  earcut.js      polygon triangulation with holes
  mesh.js        extrusion, roofs, ribbons, terrain grids, props
  tags.js        OSM tag -> category, height, width, colour
  scene.js       assembles features into meshes plus the manifest
  glb.js         glTF 2.0 binary writer
  obj.js         Wavefront OBJ/MTL writer
  serve.js       tiny static server for the viewer
viewer/
  index.html     three.js preview (orbit, walk, wireframe, building info)
```

The viewer exposes `window.map3d` (`scene`, `camera`, `manifest`, and
`look({x, z, distance, heading, pitch})`) so you can script screenshots or
embed it.

## License

MIT for the code. Generated maps derive from OpenStreetMap and are subject to
the ODbL.
