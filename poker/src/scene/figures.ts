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

export class Figure {
  readonly group = new THREE.Group();
  readonly head: THREE.Mesh;
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

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42 * build, 0.5, 6, 16), this.bodyMaterial);
    body.position.y = 0.55;
    body.scale.set(1, 1, 0.7);
    body.castShadow = true;
    this.group.add(body);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.16, 12), this.skinMaterial);
    neck.position.y = 1.05;
    this.group.add(neck);

    this.head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 18), this.skinMaterial);
    this.head.position.y = 1.36;
    this.head.scale.set(1, 1.12, 1);
    this.head.castShadow = true;
    this.group.add(this.head);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.295, 24, 12, 0, Math.PI * 2, 0, Math.PI * (0.35 + ((h >>> 12) % 3) * 0.08)), hairMaterial);
    cap.position.y = 1.4;
    cap.scale.set(1, 1.1, 1);
    this.group.add(cap);

    if (dealer) {
      const tie = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.06), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
      tie.position.set(0, 0.95, 0.3);
      this.group.add(tie);
      const vest = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.3, 4, 12), new THREE.MeshStandardMaterial({ color: 0x1f1f24, roughness: 0.8 }));
      vest.position.set(0, 0.5, 0.12);
      vest.scale.set(1.2, 1, 0.55);
      this.group.add(vest);
    } else if ((h >>> 15) % 3 === 0) {
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.03, 20), hairMaterial);
      brim.position.y = 1.5;
      this.group.add(brim);
      const top = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.28, 0.22, 20), hairMaterial);
      top.position.y = 1.6;
      this.group.add(top);
    } else if ((h >>> 15) % 3 === 1) {
      const glasses = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 16), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      glasses.position.set(-0.1, 1.38, 0.26);
      const glasses2 = glasses.clone();
      glasses2.position.x = 0.1;
      this.group.add(glasses, glasses2);
    }

    this.faceMaterial = new THREE.MeshBasicMaterial({ transparent: true, map: this.texture('neutral'), depthWrite: false });
    this.face = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46), this.faceMaterial);
    this.face.position.set(0, 1.36, 0.275);
    this.group.add(this.face);
  }

  private texture(e: Expression): THREE.CanvasTexture {
    let t = this.textures.get(e);
    if (!t) {
      t = faceTexture(e, this.hash);
      this.textures.set(e, t);
    }
    return t;
  }

  setExpression(e: Expression): void {
    if (e === this.expression) return;
    this.expression = e;
    this.faceMaterial.map = this.texture(e);
    this.faceMaterial.needsUpdate = true;
  }

  /** Dim the figure when the player is out. */
  setOut(out: boolean): void {
    const v = out ? 0.35 : 1;
    this.bodyMaterial.color.multiplyScalar(1);
    this.group.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && 'opacity' in m) {
        m.transparent = out;
        m.opacity = v;
      }
    });
    if (out) this.setExpression('out');
  }
}
