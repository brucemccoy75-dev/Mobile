// Pipeline smoke test: a felt table with a few face-down cards, rendered with Three.js.
// Everything here is a placeholder; the real game replaces this file.
import * as THREE from 'three';

const container = document.getElementById('game');
if (!container) throw new Error('missing #game container');
const fpsEl = document.getElementById('fps');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a1f14);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 7, 8);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xdfe8e0, 0x203020, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(4, 10, 4);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);

// Table: an oval of felt with a wooden rail.
const felt = new THREE.Mesh(
  new THREE.CylinderGeometry(4, 4, 0.2, 64),
  new THREE.MeshStandardMaterial({ color: 0x1f6b3a, roughness: 0.95 }),
);
felt.scale.z = 0.65;
felt.receiveShadow = true;
scene.add(felt);

const rail = new THREE.Mesh(
  new THREE.TorusGeometry(4, 0.3, 16, 96),
  new THREE.MeshStandardMaterial({ color: 0x4a2a14, roughness: 0.6 }),
);
rail.rotation.x = Math.PI / 2;
rail.scale.y = 0.65;
rail.position.y = 0.1;
rail.castShadow = true;
rail.receiveShadow = true;
scene.add(rail);

// Five community-card placeholders.
const cardGeo = new THREE.BoxGeometry(0.63, 0.02, 0.88);
const cardMat = new THREE.MeshStandardMaterial({ color: 0xb3202c, roughness: 0.5 });
const cards: THREE.Mesh[] = [];
for (let i = 0; i < 5; i++) {
  const card = new THREE.Mesh(cardGeo, cardMat);
  card.position.set((i - 2) * 0.75, 0.12, 0);
  card.castShadow = true;
  scene.add(card);
  cards.push(card);
}

function resize() {
  const w = container!.clientWidth;
  const h = container!.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // Pull the camera back on tall (portrait) screens so the whole table stays in view.
  camera.position.z = camera.aspect < 1 ? 8 + (1 - camera.aspect) * 6 : 8;
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

let frames = 0;
let last = performance.now();
renderer.setAnimationLoop((t) => {
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    if (c) c.position.y = 0.12 + Math.sin(t / 600 + i * 0.6) * 0.03;
  }
  renderer.render(scene, camera);
  frames++;
  if (fpsEl && t - last >= 1000) {
    fpsEl.textContent = `${frames} fps`;
    frames = 0;
    last = t;
  }
});
