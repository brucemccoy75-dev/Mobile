# map3d

Give it a street address. It gives you back a 3D map of roughly half a mile
around that address — real terrain, buildings with real footprints and heights,
roads at real widths, water, and tree cover — as a `.glb` you can drop straight
into Unity, Unreal, Godot, Blender or three.js.

Zero dependencies. Node 18+, or any modern browser.

## Just want to walk around?

The shell is a static web app, so it can run from a URL with nothing installed
(see **Hosting it** below), or locally:

```
node tools/map3d/bin/map3d.js play
```

Open <http://localhost:8080>, type an address, and you land in it on foot —
mouse to look, WASD to walk, shift to run. Works on a phone: drag the left half
of the screen to walk, the right half to look.

**The map is built in your browser.** The same modules the CLI imports run in
the page, so nothing is uploaded anywhere and no server does any work — the
page talks to OpenStreetMap, AWS and USGS directly. Every response is kept in
the browser's Cache API, so revisiting a place you have already built takes
well under a second and no network at all.

## Want the files for an engine?

```
node tools/map3d/bin/map3d.js build "1600 Pennsylvania Ave NW, Washington, DC"
node tools/map3d/bin/map3d.js serve out/1600-pennsylvania-ave-nw-washington-dc
```

`build` writes the map to disk; `serve` opens an orbit-and-inspect viewer at
<http://localhost:8080> where you can click a building to see what OSM knows
about it.

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
| Terrain elevation | Mapzen terrarium tiles on AWS (or OpenTopoData) | no |
| Ground cover and tree density | USGS NLCD — United States only | no |
| Ground imagery (`--imagery`) | any XYZ tile URL you supply | depends |

Terrain and land cover are **on by default**. Elevation comes from RGB-encoded
tiles, so a whole map costs a handful of requests at about 7m per sample rather
than a thousand rate-limited point lookups.

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
map3d play                              [--port 8080] [--worlds <dir>] [--radius 0.5mi]
map3d build "<address or lat,lon>"      [options]
map3d serve [directory]                 [--port 8080]
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
| `--no-terrain` | | Build on a flat plane |
| `--elevation <name>` | `terrarium` | `terrarium` (tiles) or `opentopodata` (points) |
| `--terrain <dataset>` | `aster30m` | OpenTopoData dataset, when using that provider |
| `--elevation-url <url>` | | Custom elevation endpoint |
| `--ground-cells <n>` | `128` | Ground mesh resolution |
| `--no-landcover` | | Skip NLCD; use OSM polygons alone |
| `--tree-spacing <m>` | `15` | Mean gap between scattered trees |
| `--max-trees <n>` | `20000` | Cap on scattered trees |
| `--geocoder nominatim\|google` | `nominatim` | Address lookup provider |
| `--google-key <key>` | `$GOOGLE_MAPS_API_KEY` | Google Geocoding key |
| `--overpass <url>` | built-in mirror list | Use a specific Overpass instance |
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

# Circular island, both mesh formats
map3d build "Lombard Street, San Francisco" --radius 450m --shape disc --format glb,obj,json

# Thicker woods, and a flat plane if you want to do your own terrain
map3d build "Dunbarton, NH" --tree-spacing 10
map3d build "Dunbarton, NH" --no-terrain --no-landcover

# Satellite/map imagery draped on the ground (pick a provider you're licensed for)
map3d build "51.5007,-0.1246" --radius 300m \
  --imagery "https://tile.openstreetmap.org/{z}/{x}/{y}.png"

# A big quiet map: no props, no undergrowth
map3d build "Yellowstone, WY" --radius 1km --no-trees --no-barriers
```

## Hosting it

`.github/workflows/pages.yml` publishes the shell on every push. It runs the
tests, assembles `web/` plus `src/` into a site, checks the site is
self-contained, and pushes it to a **`gh-pages`** branch.

Set Settings → Pages to **Deploy from a branch**, branch **`gh-pages`**,
folder **`/ (root)`**. The repository must be public on a free plan.

A project site is served under `https://<user>.github.io/<repo>/`, not at the
domain root, so **every path in the site must be relative and must not climb
above it**. `web/app.js` imports `./src/...` for exactly this reason; a
`../src/...` resolves outside the site and 404s. There is a test for it, and
the workflow re-checks the assembled site before publishing.

Because the page calls the data services directly, those requests are subject
to cross-origin rules. Nominatim, the AWS elevation tiles and USGS land cover
all send `Access-Control-Allow-Origin: *`. Overpass mirrors vary, which is one
more reason the endpoint list in `config.js` is tried in order — a mirror that
refuses a browser request is handled the same way as one returning 503.

Everything runs client-side, so the rate limits are yours to respect: one
visitor is one more caller against Nominatim's 1-request-per-second policy and
against volunteer-run Overpass instances.

## Walking around (`map3d play`)

`play` is a plain static file server over `web/` and `src/` — the same files
Pages serves. All the work happens in the page, so there is exactly one
implementation of the address screen and the walker.

The player is a 0.34m capsule with gravity, a 0.6m step-up for kerbs and
slopes, and walls from the manifest's building footprints in a uniform grid, so
each step only tests the handful of walls actually nearby. Water outlines are
walls too — swimming is not modelled, and the alternative is strolling across
the middle of a pond. **Trees have no collision**: blocking every trunk would
make dense woods impassable, and walking through one is the more forgiving
mistake.

The HUD names the street you are standing on by matching your position against
the road centrelines in the manifest, which is a nice demonstration of why that
data is worth carrying alongside the mesh.

`window.map3d` exposes `teleport(x, z)`, `look(headingDeg, pitchDeg)`, `player`
and `scene` for scripting. Note that `teleport` moves you directly and does not
resolve collisions.

**Download .glb** in the world view hands you the same file `map3d build`
writes, so you can grab a map for Unity from a phone.

**Frame rate note.** The simulation clamps its timestep to 50ms, so below 20fps
the world runs in slow motion rather than letting you tunnel through walls. If
walking feels sluggish, that is the clamp telling you the frame rate is low —
try the Fast detail setting or a smaller radius.

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

### Terrain

Elevation comes from Mapzen terrarium tiles: PNGs whose RGB channels encode
height as `R * 256 + G + B / 256 - 32768` metres. At zoom 15 that is about
3.5m per sample, so a half-mile map gets a genuinely shaped hillside rather
than a smooth blob, and it costs about six HTTP requests. Coverage is global
(SRTM, with NED over the US and EU-DEM over Europe).

The ground mesh is a `--ground-cells` grid draped over that height field.
Buildings are buried to the lowest corner of their footprint and topped off at
the highest, so they neither float nor sink on a slope; roads and ground layers
follow the terrain per vertex.

### Trees and ground cover

Where OSM has mapped things, OSM wins. Individually mapped trees
(`natural=tree`, `natural=tree_row`) are always placed exactly where they are
recorded, and any OSM land-use polygon claims its ground — a `leisure=park`
lawn stays a lawn even if a satellite says otherwise.

Everywhere else, NLCD land cover decides. Each 30m cell carries a canopy
fraction (forest 1.0, woody wetland 0.75, shrub 0.25, developed 0.02–0.15),
and trees are scattered on a jittered grid at `--tree-spacing`, accepted with
that probability. Conifer or broadleaf follows the NLCD class, so evergreen
forest gets stacked cones and deciduous gets round crowns.

Nothing is scattered where it would clip: building footprints (plus 2.5m),
road surfaces (plus 3m) and water are rasterised into a mask first. The
clearings you see along roads and around houses fall out of that for free.

Scattering is deterministic — the same address always produces the same trees
in the same places, so rebuilding doesn't reshuffle the world.

Outside the United States there is no NLCD, so this falls back to OSM polygons
alone. In most of Europe that is plenty; in rural Canada or Australia it is
not, and those maps will still come out bare.

### Layering

Coplanar ground surfaces (land use, then parks, water, parking, footways, roads,
rails) are stacked a few centimetres apart in `config.js` so they never
z-fight. Bridges are lifted by their `layer` tag; tunnels are left out of the
mesh.

## Data quality, honestly

The map is exactly as good as OpenStreetMap is in that spot.

- **An empty map is flagged.** If a build finishes with no buildings and no
  roads, `map.json` carries a `warning` and the log says so. That usually
  means the data service was unreachable, not that the place is empty.
- **Coverage varies enormously.** Central Munich has 1,100 buildings with
  roof shapes and levels. A US suburb may have footprints with no heights at
  all, and rural areas may have only roads. Check `stats` and the
  `heightEstimated` count in `map.json` before you judge the tool.
- **Heights are the weak spot.** Most buildings worldwide have no height tag.
  The defaults are tuned to look plausible, not to be surveyed truth.
- **Interiors don't exist.** These are extruded shells. Doors and windows are
  yours to add.
- **Scattered trees are plausible, not real.** Individually mapped trees are
  where OSM says. Everything else is a statistically reasonable guess from a
  30m land-cover cell — right species mix and right density, wrong individual
  trunks. `props[].source` in the manifest says which is which.
- **Tree geometry is not instanced.** Several thousand trees is several
  thousand small meshes merged into two, which is fine to render but makes for
  a large file. If you need it smaller, raise `--tree-spacing`, or drop
  `--no-trees` and instance them yourself from `props` in the manifest.

If a spot looks wrong, it is usually fixable by editing OSM — and then
re-running with `--no-cache`.

## Networking

Overpass mirrors go down constantly, so the tool walks a list until one answers
usefully. An empty answer is only believed when **no other mirror errored** —
a mirror carrying a regional extract returns "200, nothing here" for the rest
of the world, and when it is the only one still standing that is exactly the
answer least worth trusting. Believing it yields a map with terrain and trees
but no buildings or roads, which looks like success. Regional extracts are
also kept out of the default endpoint list for the same reason. Every response is cached on disk, so iterating on
the geometry costs nothing after the first fetch. Nominatim and OpenTopoData are
rate-limited to one request per second, per their usage policies.

Use `--overpass <url>` to point at your own instance for heavy use.

## Development

```bash
node --test tools/map3d/test/*.test.js
```

Leave that glob unquoted — the shell has to expand it. Node only learned to
expand `--test` patterns itself in v21, and this runs on v18+.

Everything in `src/` is plain JavaScript that runs in both Node and a browser.
The three things that genuinely differ — inflating PNGs, caching responses, and
writing files — sit behind `platform.js`, and each host installs its own
adapter at startup. **Anything reaching for `node:` outside `src/node/` is a
bug**, and is what would quietly break the hosted build.

87 tests cover the triangulator, clipping, projection, tag parsing, mesh
winding and normals, multipolygon stitching, the PNG decoder, occupancy masks
and scatter determinism, the land-cover legend, and the GLB/OBJ writers.

```
src/
  cli.js         argument parsing and the build pipeline
  geocode.js     address -> lat/lon (Nominatim, Google)
  overpass.js    query building, mirror fallback, OSM element normalisation
  elevation.js   terrain height field (terrarium tiles or OpenTopoData)
  imagery.js     optional XYZ tile ground texture
  project.js     lat/lon <-> local metres, slippy-map maths
  clip.js        Sutherland-Hodgman and line clipping
  png.js         minimal PNG decoder (elevation tiles, land cover)
  landcover.js   NLCD land cover -> ground material and canopy density
  scatter.js     occupancy masks and deterministic prop scattering
  earcut.js      polygon triangulation with holes
  mesh.js        extrusion, roofs, ribbons, terrain grids, props
  tags.js        OSM tag -> category, height, width, colour
  scene.js       assembles features into meshes plus the manifest
  glb.js         glTF 2.0 binary writer
  obj.js         Wavefront OBJ/MTL writer
  pipeline.js    geocode -> fetch -> build, as one callable function
  platform.js    the seam between shared code and its host
  play.js        static file server for the shell
  serve.js       tiny static server for the standalone viewer
  node/          Node's half of the seam: zlib, the disk cache, writing files
  browser/       the browser's half: canvas PNG decode, Cache API, three.js
web/
  index.html     the shell: address screen and first-person walker
  app.js         builds in-page, then runs the walker
viewer/
  index.html     three.js preview (orbit, walk, wireframe, building info)
```

The viewer exposes `window.map3d` (`scene`, `camera`, `manifest`, and
`look({x, z, distance, heading, pitch})`) so you can script screenshots or
embed it.

## License

MIT for the code. Generated maps derive from OpenStreetMap and are subject to
the ODbL.
