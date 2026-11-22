// Card art drawn into a canvas atlas, and a flippable card mesh.
import * as THREE from 'three';
import { type Card, RANK_CHARS, rankOf, suitOf } from '../engine/cards';

export const CARD_W = 0.63;
export const CARD_H = 0.88;

const CELL_W = 256;
const CELL_H = 360;
const COLS = 13;
const ROWS = 5; // 4 suits + back row

const SUIT_SYMBOLS = ['♣', '♦', '♥', '♠'];
const SUIT_COLORS = ['#1b1b1f', '#c8202c', '#c8202c', '#1b1b1f'];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

let atlas: THREE.CanvasTexture | null = null;

export function cardAtlas(): THREE.CanvasTexture {
  if (atlas) return atlas;
  const canvas = document.createElement('canvas');
  canvas.width = CELL_W * COLS;
  canvas.height = CELL_H * ROWS;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let suit = 0; suit < 4; suit++) {
    for (let rank = 0; rank < 13; rank++) {
      const x = rank * CELL_W;
      const y = suit * CELL_H;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#f7f4ec';
      roundRect(ctx, 4, 4, CELL_W - 8, CELL_H - 8, 22);
      ctx.fill();
      ctx.strokeStyle = '#cfc9bc';
      ctx.lineWidth = 3;
      ctx.stroke();
      const color = SUIT_COLORS[suit];
      const label = RANK_CHARS[rank] === 'T' ? '10' : RANK_CHARS[rank];
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 72px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(label, 44, 52);
      ctx.font = '56px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(SUIT_SYMBOLS[suit], 44, 116);
      ctx.save();
      ctx.translate(CELL_W - 44, CELL_H - 52);
      ctx.rotate(Math.PI);
      ctx.font = 'bold 72px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(label, 0, 0);
      ctx.font = '56px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(SUIT_SYMBOLS[suit], 0, 64);
      ctx.restore();
      ctx.font = '150px "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(SUIT_SYMBOLS[suit], CELL_W / 2, CELL_H / 2 + 8);
      ctx.restore();
    }
  }

  // Card back.
  ctx.save();
  ctx.translate(0, 4 * CELL_H);
  ctx.fillStyle = '#f7f4ec';
  roundRect(ctx, 4, 4, CELL_W - 8, CELL_H - 8, 22);
  ctx.fill();
  ctx.fillStyle = '#7a1f2b';
  roundRect(ctx, 18, 18, CELL_W - 36, CELL_H - 36, 14);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,230,200,0.35)';
  ctx.lineWidth = 2;
  for (let i = -CELL_H; i < CELL_W + CELL_H; i += 22) {
    ctx.beginPath();
    ctx.moveTo(i, 18);
    ctx.lineTo(i + CELL_H, CELL_H - 18);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i, CELL_H - 18);
    ctx.lineTo(i + CELL_H, 18);
    ctx.stroke();
  }
  ctx.strokeStyle = '#e9c98a';
  ctx.lineWidth = 4;
  roundRect(ctx, 30, 30, CELL_W - 60, CELL_H - 60, 10);
  ctx.stroke();
  ctx.restore();

  atlas = new THREE.CanvasTexture(canvas);
  atlas.colorSpace = THREE.SRGBColorSpace;
  atlas.anisotropy = 8;
  atlas.generateMipmaps = true;
  atlas.minFilter = THREE.LinearMipmapLinearFilter;
  return atlas;
}

function cellUv(geometry: THREE.PlaneGeometry, col: number, row: number): void {
  const uv = geometry.attributes.uv as THREE.BufferAttribute;
  const u0 = col / COLS;
  const u1 = (col + 1) / COLS;
  const v1 = 1 - row / ROWS;
  const v0 = 1 - (row + 1) / ROWS;
  const pad = 0.002;
  uv.setXY(0, u0 + pad, v1 - pad);
  uv.setXY(1, u1 - pad, v1 - pad);
  uv.setXY(2, u0 + pad, v0 + pad);
  uv.setXY(3, u1 - pad, v0 + pad);
  uv.needsUpdate = true;
}

let frontMaterial: THREE.MeshStandardMaterial | null = null;
const backGeometry = (() => {
  let g: THREE.PlaneGeometry | null = null;
  return () => {
    if (!g) {
      g = new THREE.PlaneGeometry(CARD_W, CARD_H);
      cellUv(g, 0, 4);
      g.rotateX(-Math.PI / 2);
      g.rotateY(Math.PI);
      g.rotateX(Math.PI);
    }
    return g;
  };
})();

function material(): THREE.MeshStandardMaterial {
  if (!frontMaterial) {
    frontMaterial = new THREE.MeshStandardMaterial({ map: cardAtlas(), roughness: 0.55, metalness: 0, side: THREE.FrontSide });
  }
  return frontMaterial;
}

/**
 * A card lying on the table. `group` carries position and yaw; `flip` carries the face-up/down
 * rotation (0 = face up, PI = face down).
 */
export class CardMesh {
  readonly group = new THREE.Group();
  readonly flip = new THREE.Group();
  private readonly front: THREE.PlaneGeometry;
  card: Card | null;

  constructor(card: Card | null) {
    this.card = card;
    const front = new THREE.PlaneGeometry(CARD_W, CARD_H);
    front.rotateX(-Math.PI / 2);
    this.front = front;
    const frontMesh = new THREE.Mesh(front, material());
    frontMesh.castShadow = true;
    const backMesh = new THREE.Mesh(backGeometry(), material());
    backMesh.position.y = -0.002;
    this.flip.add(frontMesh, backMesh);
    this.flip.rotation.x = Math.PI;
    this.group.add(this.flip);
    this.setCard(card);
  }

  setCard(card: Card | null): void {
    this.card = card;
    if (card === null) cellUv(this.front, 0, 4);
    else cellUv(this.front, rankOf(card), suitOf(card));
  }

  dispose(): void {
    this.front.dispose();
  }

  get faceUp(): boolean {
    return this.flip.rotation.x < Math.PI / 2;
  }
}
