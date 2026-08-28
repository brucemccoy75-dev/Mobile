// The hosted shell: type an address, build the map here in the browser, walk it.
//
// Everything under src/ is the same code the command-line tool runs. The only
// browser-specific parts are the platform adapter (PNG decoding and caching)
// and this file, which is the UI and the first-person controller.

import * as THREE from 'three';

import { installWebPlatform } from './src/browser/platform-web.js';
import { buildThreeScene, disposeScene } from './src/browser/three-scene.js';
import { buildMap } from './src/pipeline.js';
import { MATERIALS } from './src/tags.js';
import { writeGlb } from './src/glb.js';
import { METERS_PER_MILE } from './src/config.js';

installWebPlatform();
window.__map3dReady = true;

const $ = (id) => document.getElementById(id);
if (matchMedia('(hover: none)').matches) document.body.classList.add('touch');

/* =============================== rendering =============================== */

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();
const SKY = 0x9dc0dd;
scene.background = new THREE.Color(SKY);
scene.fog = new THREE.Fog(SKY, 120, 900);

const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 4000);

scene.add(new THREE.HemisphereLight(0xc4dcf2, 0x7a7a66, 1.35));
const sun = new THREE.DirectionalLight(0xfff2e0, 2.3);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0007;
const SHADOW_SPAN = 90;
Object.assign(sun.shadow.camera, {
  left: -SHADOW_SPAN, right: SHADOW_SPAN, top: SHADOW_SPAN, bottom: -SHADOW_SPAN,
  near: 1, far: 700,
});
sun.shadow.camera.updateProjectionMatrix();
scene.add(sun, sun.target);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ================================= state ================================= */

const GROUND_RE =
  /^(ground|imagery|grass|forest|scrub|pitch|farmland|sand|urban_ground|industrial_ground|parking|pavement|path|road_|railway|water)/;
const GRAVITY = 22;
const EYE = 1.68;
const RADIUS = 0.34;
// Faster than life on purpose: real walking pace makes crossing half a mile a
// chore, and covering ground is the point.
const WALK = 3.6;
const RUN = 12;
const FLY = 28;
const FLY_BOOST = 95;   // crosses a half-mile map in about 17 seconds
const CEILING = 1500;   // metres above the address; past this there is nothing to see
const FLOOR_CLEARANCE = 2;

let world = null;   // { root, ground, manifest, collider, builder }
let mode = 'home';
let locked = false;
let flying = false;

const player = {
  pos: new THREE.Vector3(),
  vel: new THREE.Vector3(),
  yaw: 0, pitch: 0,
  onGround: false,
  start: new THREE.Vector3(),
};

/* ================================= home ================================== */

let radius = 805;
let quality = 'full';

for (const chip of document.querySelectorAll('.chip')) {
  chip.onclick = () => {
    const group = chip.dataset.radius ? 'radius' : 'quality';
    for (const other of document.querySelectorAll(`.chip[data-${group}]`)) {
      other.setAttribute('aria-pressed', String(other === chip));
    }
    if (group === 'radius') radius = Number(chip.dataset.radius);
    else quality = chip.dataset.quality;
  };
}

$('form').onsubmit = (e) => {
  e.preventDefault();
  const address = $('address').value.trim();
  if (address) startBuild(address);
};

function setFlying(on) {
  flying = on;
  player.vel.set(0, 0, 0);
  $('fly').setAttribute('aria-pressed', String(on));
  $('fly').textContent = on ? 'Walk' : 'Fly';
  $('keys').textContent = on
    ? 'WASD fly · Space up · C down · Shift boost · F walk'
    : 'WASD move · Shift run · Space jump · F fly';
}

$('fly').onclick = () => setFlying(!flying);

$('cancel').onclick = () => show('home');
$('leave').onclick = () => {
  document.exitPointerLock?.();
  if (world) { scene.remove(world.root); disposeScene(world.root); world = null; }
  setFlying(false);
  show('home');
  renderRecent();
};

function show(next) {
  mode = next;
  $('home').hidden = next !== 'home';
  $('building').hidden = next !== 'building';
  $('hud').hidden = next !== 'world';
  $('tapToStart').hidden = next !== 'world' || locked;
}

/* ------------------------------ recent list ------------------------------ */

const RECENT_KEY = 'map3d.recent';

function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return []; // private mode, or someone put junk in there
  }
}

function rememberRecent(entry) {
  try {
    const list = loadRecent().filter(
      (e) => !(e.address === entry.address && e.radius === entry.radius),
    );
    list.unshift(entry);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
  } catch {
    // Remembering is a convenience; never let it break a build.
  }
}

function renderRecent() {
  const list = loadRecent();
  if (!list.length) { $('recent').hidden = true; return; }
  $('recent').hidden = false;
  $('recentList').replaceChildren(...list.map((entry) => {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.className = 'ghost';
    b.textContent = entry.label;
    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent =
      `${(entry.radius / METERS_PER_MILE).toFixed(2)} mi` +
      (entry.stats ? ` · ${entry.stats.buildings.toLocaleString()} buildings · ` +
        `${(entry.stats.trees ?? 0).toLocaleString()} trees` : '');
    b.appendChild(meta);
    b.onclick = () => {
      radius = entry.radius;
      quality = entry.quality ?? 'full';
      startBuild(entry.address);
    };
    li.appendChild(b);
    return li;
  }));
}
renderRecent();

/* ================================= build ================================= */

async function startBuild(address) {
  show('building');
  $('buildingTitle').textContent = 'Building your map…';
  $('buildingSub').textContent = address;
  $('log').textContent = '';
  $('go').disabled = true;

  const line = (text, cls) => {
    const el = document.createElement('span');
    if (cls) el.className = cls;
    el.textContent = `${text}\n`;
    $('log').appendChild(el);
    $('log').scrollTop = $('log').scrollHeight;
  };

  try {
    // Building blocks the main thread for a second or two on a big map. Yield
    // first so the progress line actually paints before that happens.
    const log = (msg) => line(msg.trim());
    await nextFrame();

    const built = await buildMap({
      address,
      radius,
      log,
      scene: quality === 'fast' ? { treeSpacing: 22, terrainCells: 96 } : {},
    });

    if (built.manifest.warning) line(built.manifest.warning, 'err');
    line('Handing the geometry to your graphics card…');
    await nextFrame();
    enterWorld(built);

    rememberRecent({
      address,
      label: built.place.label,
      radius,
      quality,
      stats: built.manifest.stats,
    });
  } catch (err) {
    $('buildingTitle').textContent = 'That did not work';
    $('buildingSub').textContent = err.message;
    line(err.message, 'err');
    if (/Failed to fetch|NetworkError|CORS/i.test(err.message)) {
      line('', null);
      line('That looks like a network or cross-origin refusal. The data ' +
           'services are public and occasionally block browser requests; ' +
           'trying again often picks a different mirror.', 'err');
    }
  } finally {
    $('go').disabled = false;
  }
}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

function enterWorld(built) {
  if (world) { scene.remove(world.root); disposeScene(world.root); }

  const { root, ground } = buildThreeScene(THREE, built.builder, MATERIALS, {
    groundPattern: GROUND_RE,
  });
  scene.add(root);

  world = {
    root,
    ground,
    manifest: built.manifest,
    builder: built.builder,
    collider: buildCollider(built.manifest),
  };
  spawnPlayer(built.manifest);

  $('startTitle').textContent =
    built.place.label.split(',').slice(0, 2).join(',') || 'Ready';
  $('startHint').textContent = document.body.classList.contains('touch')
    ? 'Tap to start · left side to walk, right side to look'
    : 'Click to look around · WASD to walk';
  show('world');
}

$('download').onclick = () => {
  if (!world) return;
  const glb = writeGlb(world.builder, MATERIALS, {
    generator: 'map3d',
    extras: {
      origin: world.manifest.origin,
      radiusMeters: world.manifest.radiusMeters,
      attribution: world.manifest.attribution,
    },
  });
  const name = (world.manifest.address?.query ?? 'map')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const url = URL.createObjectURL(new Blob([glb], { type: 'model/gltf-binary' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name || 'map'}.glb`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

/* ------------------------------- collision ------------------------------- */

function buildCollider(manifest) {
  const CELL = 24;
  const cells = new Map();
  const key = (i, j) => `${i},${j}`;
  const rings = [];

  const addSegment = (a, b) => {
    const i0 = Math.floor(Math.min(a[0], b[0]) / CELL);
    const i1 = Math.floor(Math.max(a[0], b[0]) / CELL);
    const j0 = Math.floor(Math.min(a[1], b[1]) / CELL);
    const j1 = Math.floor(Math.max(a[1], b[1]) / CELL);
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const k = key(i, j);
        if (!cells.has(k)) cells.set(k, []);
        cells.get(k).push([a, b]);
      }
    }
  };

  const addRing = (ring) => {
    if (!ring || ring.length < 3) return;
    rings.push(ring);
    for (let i = 0; i < ring.length; i++) addSegment(ring[i], ring[(i + 1) % ring.length]);
  };

  for (const b of manifest.buildings ?? []) {
    if (b.renderedAsParts) continue; // its parts carry the geometry
    addRing(b.outline);
    for (const hole of b.holes ?? []) addRing(hole);
  }
  // Water counts as ground for the height probe, so without this you would
  // stroll out across the middle of a pond.
  for (const a of manifest.areas ?? []) {
    if (a.kind !== 'water') continue;
    addRing(a.outline);
    for (const hole of a.holes ?? []) addRing(hole);
  }

  return {
    near(x, z) {
      const out = [];
      const i = Math.floor(x / CELL);
      const j = Math.floor(z / CELL);
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          const c = cells.get(key(i + di, j + dj));
          if (c) out.push(...c);
        }
      }
      return out;
    },
    inside(x, z) {
      for (const ring of rings) {
        let hit = false;
        for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
          const [xi, zi] = ring[i];
          const [xj, zj] = ring[j];
          if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) hit = !hit;
        }
        if (hit) return true;
      }
      return false;
    },
  };
}

function resolveCollisions(pos) {
  const segments = world.collider.near(pos.x, pos.z);
  for (let pass = 0; pass < 3; pass++) {
    let moved = false;
    for (const [a, b] of segments) {
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const lenSq = dx * dx + dz * dz;
      if (lenSq < 1e-9) continue;
      const t = Math.max(0, Math.min(1, ((pos.x - a[0]) * dx + (pos.z - a[1]) * dz) / lenSq));
      const cx = a[0] + t * dx;
      const cz = a[1] + t * dz;
      let ox = pos.x - cx;
      let oz = pos.z - cz;
      const dist = Math.hypot(ox, oz);
      if (dist >= RADIUS) continue;
      if (dist < 1e-6) { ox = 1; oz = 0; }
      const scale = (RADIUS - dist) / (dist || 1);
      pos.x += ox * scale;
      pos.z += oz * scale;
      moved = true;
    }
    if (!moved) break;
  }
}

function spawnPlayer(manifest) {
  const s = manifest.spawn ?? { x: 0, y: 0, z: 0 };
  player.pos.set(s.x, s.y + EYE, s.z);
  // The address itself is often the middle of a building. Step out if so.
  if (world.collider.inside(player.pos.x, player.pos.z)) {
    outer: for (let r = 4; r <= 60; r += 4) {
      for (let a = 0; a < 12; a++) {
        const t = (a / 12) * Math.PI * 2;
        const x = s.x + Math.cos(t) * r;
        const z = s.z + Math.sin(t) * r;
        if (!world.collider.inside(x, z)) { player.pos.set(x, s.y + EYE, z); break outer; }
      }
    }
  }
  player.pos.y = groundHeight(player.pos.x, player.pos.z) + EYE;
  player.vel.set(0, 0, 0);
  player.yaw = 0;
  player.pitch = 0;
  player.start.copy(player.pos);
  setFlying(false);
}

/* -------------------------------- ground -------------------------------- */

const down = new THREE.Vector3(0, -1, 0);
const probe = new THREE.Raycaster();
probe.far = 600;

function groundHeight(x, z) {
  if (!world) return 0;
  probe.set(new THREE.Vector3(x, 300, z), down);
  const hits = probe.intersectObjects(world.ground, false);
  // Topmost ground surface: a road sits above the terrain it covers.
  return hits.length ? hits[0].point.y : 0;
}

/* ================================ controls =============================== */

const keys = new Set();

addEventListener('keydown', (e) => {
  if (mode !== 'world') return;
  if (e.code === 'KeyF' && !e.repeat) setFlying(!flying);
  keys.add(e.code);
  if (e.code === 'Space') e.preventDefault();
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => keys.clear());

$('tapToStart').addEventListener('click', () => {
  if (document.body.classList.contains('touch')) { locked = true; show('world'); return; }
  renderer.domElement.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === renderer.domElement;
  if (mode === 'world') $('tapToStart').hidden = locked;
  if (!locked) keys.clear();
});

addEventListener('mousemove', (e) => {
  if (!locked) return;
  player.yaw -= e.movementX * 0.0022;
  player.pitch = Math.max(-1.5, Math.min(1.5, player.pitch - e.movementY * 0.0022));
});

const touch = { move: null, look: null };
for (const [el, kind] of [[$('stickL'), 'move'], [$('stickR'), 'look']]) {
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    touch[kind] = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: 0, y: 0 };
  });
  el.addEventListener('pointermove', (e) => {
    const t = touch[kind];
    if (!t || t.id !== e.pointerId) return;
    if (kind === 'look') {
      player.yaw -= (e.clientX - t.ox) * 0.006;
      player.pitch = Math.max(-1.5, Math.min(1.5, player.pitch - (e.clientY - t.oy) * 0.006));
      t.ox = e.clientX;
      t.oy = e.clientY;
    } else {
      t.x = Math.max(-1, Math.min(1, (e.clientX - t.ox) / 60));
      t.y = Math.max(-1, Math.min(1, (e.clientY - t.oy) / 60));
    }
  });
  const end = (e) => { if (touch[kind]?.id === e.pointerId) touch[kind] = null; };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
}

/* ================================== loop ================================= */

const clock = new THREE.Clock();
const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const wish = new THREE.Vector3();
const look = new THREE.Vector3();
let hudTimer = 0;

function step(dt) {
  if (!world) return;

  forward.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  right.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw));

  if (flying) flyStep(dt);
  else walkStep(dt);

  camera.position.copy(player.pos);
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');

  // From altitude the default fog would swallow the whole map, so open it up
  // with height. The shadow window widens too, or shadows stop part way out.
  const altitude = Math.max(0, player.pos.y - groundHeight(player.pos.x, player.pos.z));
  scene.fog.far = 900 + altitude * 6;
  scene.fog.near = Math.min(120 + altitude * 2, scene.fog.far * 0.4);
  const span = Math.min(SHADOW_SPAN + altitude * 1.5, 600);
  if (Math.abs(sun.shadow.camera.right - span) > 5) {
    Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span });
    sun.shadow.camera.updateProjectionMatrix();
  }

  sun.position.set(player.pos.x + 150, player.pos.y + 220, player.pos.z + 100);
  sun.target.position.set(player.pos.x, player.pos.y - EYE, player.pos.z);
  sun.target.updateMatrixWorld();

  hudTimer -= dt;
  if (hudTimer <= 0) { updateHud(); hudTimer = 0.25; }
}

function walkStep(dt) {
  wish.set(0, 0, 0);
  if (keys.has('KeyW') || keys.has('ArrowUp')) wish.add(forward);
  if (keys.has('KeyS') || keys.has('ArrowDown')) wish.sub(forward);
  if (keys.has('KeyD') || keys.has('ArrowRight')) wish.add(right);
  if (keys.has('KeyA') || keys.has('ArrowLeft')) wish.sub(right);
  if (touch.move) {
    wish.addScaledVector(forward, -touch.move.y);
    wish.addScaledVector(right, touch.move.x);
  }

  const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? RUN : WALK;
  if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(speed);

  player.pos.x += wish.x * dt;
  player.pos.z += wish.z * dt;
  resolveCollisions(player.pos);

  const floor = groundHeight(player.pos.x, player.pos.z) + EYE;
  player.vel.y -= GRAVITY * dt;
  player.pos.y += player.vel.y * dt;

  if (player.pos.y <= floor) {
    player.pos.y = floor;
    player.vel.y = 0;
    player.onGround = true;
  } else if (player.pos.y - floor < 0.6 && player.vel.y <= 0) {
    player.pos.y = floor; // step up a kerb or a slope
    player.vel.y = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  if (player.onGround && keys.has('Space')) {
    player.vel.y = 6.2;
    player.onGround = false;
  }
}

/**
 * Free flight. Movement follows where you are looking, including pitch, so
 * nosing up climbs. No gravity and no collision: clipping through a roof on
 * the way over is far less annoying than being stopped by one.
 */
function flyStep(dt) {
  // Full 3D heading, unlike the ground-flattened `forward` used for walking.
  const cp = Math.cos(player.pitch);
  look.set(-Math.sin(player.yaw) * cp, Math.sin(player.pitch), -Math.cos(player.yaw) * cp);

  wish.set(0, 0, 0);
  if (keys.has('KeyW') || keys.has('ArrowUp')) wish.add(look);
  if (keys.has('KeyS') || keys.has('ArrowDown')) wish.sub(look);
  if (keys.has('KeyD') || keys.has('ArrowRight')) wish.add(right);
  if (keys.has('KeyA') || keys.has('ArrowLeft')) wish.sub(right);
  if (keys.has('Space')) wish.y += 1;
  if (keys.has('KeyC') || keys.has('ControlLeft')) wish.y -= 1;
  if (touch.move) {
    wish.addScaledVector(look, -touch.move.y);
    wish.addScaledVector(right, touch.move.x);
  }

  const speed = keys.has('ShiftLeft') || keys.has('ShiftRight') ? FLY_BOOST : FLY;
  if (wish.lengthSq() > 0) {
    wish.normalize().multiplyScalar(speed * dt);
    player.pos.add(wish);
  }

  // Stay above the ground and below a sensible ceiling, so you cannot get
  // lost underneath the terrain or out in empty sky.
  const floor = groundHeight(player.pos.x, player.pos.z) + FLOOR_CLEARANCE;
  if (player.pos.y < floor) player.pos.y = floor;
  if (player.pos.y > CEILING) player.pos.y = CEILING;
  player.onGround = false;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

function updateHud() {
  const m = world.manifest;
  const deg = (((-player.yaw * 180) / Math.PI) % 360 + 360) % 360;
  $('compass').textContent =
    `${COMPASS[Math.round(deg / 45) % 8]}  ${deg.toFixed(0).padStart(3, '0')}°`;

  const street = nearestStreet(player.pos.x, player.pos.z);
  $('street').textContent = street ?? '';
  $('street').style.opacity = street ? '1' : '0';

  const walked = Math.hypot(player.pos.x - player.start.x, player.pos.z - player.start.z);
  const lat = m.origin.lat - player.pos.z / 111320;
  const lon = m.origin.lon + player.pos.x / (111320 * Math.cos((m.origin.lat * Math.PI) / 180));
  const elev = (m.terrain?.baseElevationMeters ?? 0) + player.pos.y - EYE;
  const above = Math.max(0, player.pos.y - groundHeight(player.pos.x, player.pos.z));
  $('readout').innerHTML =
    `${lat.toFixed(5)}, ${lon.toFixed(5)}<br>` +
    `${Math.round(elev * 3.28084)} ft elevation<br>` +
    (flying ? `${Math.round(above * 3.28084)} ft above ground<br>` : '') +
    `${walked < 400 ? `${Math.round(walked)} m` : `${(walked / METERS_PER_MILE).toFixed(2)} mi`} from the address`;
}

function nearestStreet(x, z) {
  let best = null;
  let bestDist = 30;
  for (const road of world.manifest.roads ?? []) {
    if (!road.name) continue;
    for (const line of road.centerlines) {
      for (let i = 0; i < line.length - 1; i++) {
        const d = distanceToSegment(x, z, line[i], line[i + 1]);
        if (d < bestDist) { bestDist = d; best = road.name; }
      }
    }
  }
  return best;
}

function distanceToSegment(x, z, a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const lenSq = dx * dx + dz * dz;
  const t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / lenSq));
  return Math.hypot(x - (a[0] + t * dx), z - (a[1] + t * dz));
}

function tick() {
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (mode === 'world') step(dt);
  renderer.render(scene, camera);
}
tick();

/* Scripting hook, matching the standalone viewer. */
window.map3d = {
  THREE, scene, camera, renderer, player,
  get world() { return world; },
  teleport(x, z) {
    player.pos.set(x, groundHeight(x, z) + EYE, z);
    player.vel.set(0, 0, 0);
  },
  get flying() { return flying; },
  fly(on = true) { setFlying(on); },
  /** `headingDeg` is a compass bearing, matching what the HUD shows. */
  look(headingDeg, pitchDeg = 0) {
    player.yaw = (-headingDeg * Math.PI) / 180;
    player.pitch = (pitchDeg * Math.PI) / 180;
  },
  build: startBuild,
};
