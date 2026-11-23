// Placeholder people: a body, a head and a drawn face with a few expressions. Distinct per character.
import * as THREE from 'three';
import { seedFromString } from '../engine/rng';

export type Expression = 'neutral' | 'thinking' | 'happy' | 'annoyed' | 'tilted' | 'shocked' | 'out';

const SKIN = [0xf1c9a5, 0xe0ac7e, 0xc68c5b, 0x8d5a3b, 0x5c3a24, 0xf5d7b8];
const SHIRT = [0x2c4a7a, 0x7a2c2c, 0x2f6b4a, 0x6b4a8a, 0x8a6b2f, 0x3a3a3a, 0xb0b0b0, 0x1e6b7a];
const HAIR = [0x1a1210, 0x3b2a1a, 0x7a5a2a, 0xb59a5a, 0xd9d2c6, 0x5a1a1a];

function faceTexture(expression: Expression, hash: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 256);
  ctx.strokeStyle = '#2a1a12';
  ctx.fillStyle = '#2a1a12';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  const eyeY = 110;
  const eyeDx = 44;
  const wideEyes = (hash & 1) === 1;
  const drawEye = (x: number, open: number) => {
    ctx.beginPath();
    if (open >= 1) ctx.ellipse(x, eyeY, wideEyes ? 13 : 10, 13 * open, 0, 0, Math.PI * 2);
    else ctx.ellipse(x, eyeY, 12, Math.max(2, 13 * open), 0, 0, Math.PI * 2);
    ctx.fill();
  };
  const brow = (x: number, tilt: number, lift: number) => {
    ctx.beginPath();
    ctx.moveTo(x - 18, eyeY - 30 - lift + tilt);
    ctx.lineTo(x + 18, eyeY - 30 - lift - tilt);
    ctx.stroke();
  };
  const mouth = (curve: number, open = 0) => {
    ctx.beginPath();
    ctx.moveTo(128 - 34, 180);
    ctx.quadraticCurveTo(128, 180 + curve, 128 + 34, 180);
    if (open > 0) {
      ctx.quadraticCurveTo(128, 180 + curve + open, 128 - 34, 180);
      ctx.fill();
    } else ctx.stroke();
  };
  switch (expression) {
    case 'neutral':
      drawEye(128 - eyeDx, 1); drawEye(128 + eyeDx, 1); brow(128 - eyeDx, 0, 0); brow(128 + eyeDx, 0, 0); mouth(4);
      break;
    case 'thinking':
      drawEye(128 - eyeDx, 0.6); drawEye(128 + eyeDx, 0.6); brow(128 - eyeDx, -6, 4); brow(128 + eyeDx, 2, 0); mouth(-2);
      break;
    case 'happy':
      drawEye(128 - eyeDx, 0.5); drawEye(128 + eyeDx, 0.5); brow(128 - eyeDx, 0, 6); brow(128 + eyeDx, 0, 6); mouth(34);
      break;
    case 'annoyed':
      drawEye(128 - eyeDx, 0.7); drawEye(128 + eyeDx, 0.7); brow(128 - eyeDx, 8, -4); brow(128 + eyeDx, -8, -4); mouth(-16);
      break;
    case 'tilted':
      drawEye(128 - eyeDx, 1.2); drawEye(128 + eyeDx, 1.2); brow(128 - eyeDx, 14, -8); brow(128 + eyeDx, -14, -8); mouth(-24, 18);
      break;
    case 'shocked':
      drawEye(128 - eyeDx, 1.3); drawEye(128 + eyeDx, 1.3); brow(128 - eyeDx, 0, 14); brow(128 + eyeDx, 0, 14); mouth(0, 30);
      break;
    case 'out':
      ctx.beginPath(); ctx.moveTo(128 - eyeDx - 10, eyeY - 10); ctx.lineTo(128 - eyeDx + 10, eyeY + 10); ctx.moveTo(128 - eyeDx + 10, eyeY - 10); ctx.lineTo(128 - eyeDx - 10, eyeY + 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(128 + eyeDx - 10, eyeY - 10); ctx.lineTo(128 + eyeDx + 10, eyeY + 10); ctx.moveTo(128 + eyeDx + 10, eyeY - 10); ctx.lineTo(128 + eyeDx - 10, eyeY + 10); ctx.stroke();
      mouth(-10);
      break;
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const textureLoader = new THREE.TextureLoader();

/** Height of a portrait standee in world units; its bottom hides behind the rail. */
const PORTRAIT_HEIGHT = 1.5;
const PORTRAIT_BOTTOM = 0.18;

export class Figure {
  readonly group = new THREE.Group();
  /** The drawn placeholder; hidden once a portrait loads. */
  readonly capsule = new THREE.Group();
  readonly head: THREE.Mesh;
  /** The portrait standee, when the character has one. */
  portrait: THREE.Mesh | null = null;
  private portraitMaterial: THREE.MeshBasicMaterial | null = null;
  private readonly face: THREE.Mesh;
  private readonly faceMaterial: THREE.MeshBasicMaterial;
  private readonly hash: number;
  private readonly textures = new Map<Expression, THREE.CanvasTexture>();
  expression: Expression = 'neutral';
  readonly bodyMaterial: THREE.MeshStandardMaterial;
  readonly skinMaterial: THREE.MeshStandardMaterial;

  constructor(id: string, dealer = false) {
    this.hash = seedFromString(id);
    const h = this.hash;
    const skin = SKIN[h % SKIN.length];
    const shirt = dealer ? 0xf4f1ea : SHIRT[(h >>> 3) % SHIRT.length];
    const hair = HAIR[(h >>> 6) % HAIR.length];
    const build = 0.9 + ((h >>> 9) % 5) * 0.05;

    this.bodyMaterial = new THREE.MeshStandardMaterial({ color: shirt, roughness: 0.85 });
    this.skinMaterial = new THREE.MeshStandardMaterial({ color: skin, roughness: 0.7 });
    const hairMaterial = new THREE.MeshStandardMaterial({ color: hair, roughness: 0.9 });

    this.group.add(this.capsule);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42 * build, 0.5, 6, 16), this.bodyMaterial);
    body.position.y = 0.55;
    body.scale.set(1, 1, 0.7);
    body.castShadow = true;
    this.capsule.add(body);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.16, 12), this.skinMaterial);
    neck.position.y = 1.05;
    this.capsule.add(neck);

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 18), this.skinMaterial);
    this.head.position.y = 1.36;
    this.head.scale.set(1, 1.12, 1);
    this.head.castShadow = true;
    this.capsule.add(this.head);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.295, 24, 12, 0, Math.PI * 2, 0, Math.PI * (0.35 + ((h >>> 12) % 3) * 0.08)), hairMaterial);
    cap.position.y = 1.4;
    cap.scale.set(1, 1.1, 1);
    this.capsule.add(cap);

    if (dealer) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
      tie.position.set(0, 0.95, 0.3);
      this.capsule.add(tie);
      const vest = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.3, 4, 12), new THREE.MeshStandardMaterial({ color: 0x1f1f24, roughness: 0.8 }));
      vest.position.set(0, 0.5, 0.12);
      vest.scale.set(1.2, 1, 0.55);
      this.capsule.add(vest);
    } else if ((h >>> 15) % 3 === 0) {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 20), hairMaterial);
      brim.position.y = 1.5;
      this.capsule.add(brim);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.22, 20), hairMaterial);
      top.position.y = 1.6;
      this.capsule.add(top);
    } else if ((h >>> 15) % 3 === 1) {
      const glasses = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      glasses.position.set(-0.1, 1.38, 0.26);
      const glasses2 = glasses.clone();
      glasses2.position.x = 0.1;
      this.capsule.add(glasses, glasses2);
    }

    this.faceMaterial = new THREE.MeshBasicMaterial({ transparent: true, map: this.texture('neutral'), depthWrite: false });
    this.face = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), this.faceMaterial);
    this.face.position.set(0, 1.36, 0.275);
    this.capsule.add(this.face);
    this.loadPortrait(dealer ? 'dealer' : id);
  }

  /** Tries the character's portrait; the drawn figure stays until it arrives, or forever if none. */
  private loadPortrait(id: string): void {
    const url = `${import.meta.env.BASE_URL}portraits/${id}.png`;
    textureLoader.load(url, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.08, color: 0xfff1e2, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PORTRAIT_HEIGHT, PORTRAIT_HEIGHT), mat);
      mesh.position.y = PORTRAIT_BOTTOM + PORTRAIT_HEIGHT / 2;
      mesh.castShadow = true;
      mesh.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.5 });
      this.portrait = mesh;
      this.portraitMaterial = mat;
      this.group.add(mesh);
      this.capsule.visible = false;
      if (this.folded) mat.opacity = 0.38;
      this.applyTilt();
    }, undefined, () => {
      // No portrait for this character yet: keep the drawn figure.
    });
  }

  private texture(e: Expression): THREE.CanvasTexture {
    let t = this.textures.get(e);
    if (!t) {
      t = faceTexture(e, this.hash);
      this.textures.set(e, t);
    }
    return t;
  }

  folded = false;

  /** Out of the hand: sit back and fade. */
  setFolded(folded: boolean): void {
    if (this.folded === folded) return;
    this.folded = folded;
    this.group.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (!m || !('opacity' in m)) return;
      // The face plane and the portrait are always transparent; only their opacity changes.
      if (m !== this.faceMaterial && m !== this.portraitMaterial) m.transparent = folded;
      m.opacity = folded ? 0.38 : 1;
    });
  }

  /** A little life: breathing, and a lean-in while thinking. */
  tick(timeMs: number): void {
    const phase = timeMs / 1000 + this.hash % 7;
    const breathe = Math.sin(phase * 1.6) * 0.012;
    this.group.scale.y = 1 + breathe;
    const lean = this.folded ? -0.14 : this.expression === 'thinking' ? 0.12 : this.expression === 'tilted' ? 0.06 : 0;
    this.group.rotation.x += (lean - this.group.rotation.x) * 0.08;
    this.head.rotation.y = Math.sin(phase * 0.7) * 0.08 + (this.expression === 'thinking' ? Math.sin(phase * 2.3) * 0.05 : 0);
    if (this.portrait) this.portrait.rotation.z = Math.sin(phase * 0.9) * 0.012;
  }

  setExpression(e: Expression): void {
    if (e === this.expression) return;
    this.expression = e;
    this.faceMaterial.map = this.texture(e);
    this.faceMaterial.needsUpdate = true;
  }

  /** Turns a portrait standee to face a camera, like a sprite; drawn figures keep facing the table. */
  faceCamera(cameraPosition: THREE.Vector3): void {
    if (!this.portrait) return;
    const p = this.group.position;
    this.group.rotation.y = Math.atan2(cameraPosition.x - p.x, cameraPosition.z - p.z);
  }

  /** 0 = calm, 1 = steaming: the man flushes red as he tilts. */
  private tilt = 0;

  setTilt(t: number): void {
    this.tilt = Math.max(0, Math.min(1, t));
    this.applyTilt();
  }

  private applyTilt(): void {
    const t = this.tilt;
    // The portrait's own warm white, pulled toward red: green and blue drop, red stays.
    const base = new THREE.Color(0xfff1e2);
    const tinted = new THREE.Color(1, base.g * (1 - 0.62 * t), base.b * (1 - 0.72 * t));
    if (this.portraitMaterial) this.portraitMaterial.color.copy(tinted);
    this.faceMaterial.color.setRGB(1, 1 - 0.62 * t, 1 - 0.72 * t);
    this.bodyMaterial.emissive.setRGB(0.35 * t, 0, 0);
  }

  /** Dim the figure when the player is out. */
  setOut(out: boolean): void {
    const v = out ? 0.35 : 1;
    this.bodyMaterial.color.multiplyScalar(1);
    this.group.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (!m || !('opacity' in m)) return;
      if (m !== this.faceMaterial && m !== this.portraitMaterial) m.transparent = out;
      m.opacity = v;
    });
    if (out) this.setExpression('out');
  }
}
