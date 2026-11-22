// Chip stacks: an amount becomes columns of coloured chips.
import * as THREE from 'three';

const DENOMS = [
  { value: 5000, color: 0xd98c2b },
  { value: 1000, color: 0xe3c233 },
  { value: 500, color: 0x6a3aa2 },
  { value: 100, color: 0x202226 },
  { value: 25, color: 0x2f8f4e },
  { value: 5, color: 0xc9302c },
];

export const CHIP_R = 0.13;
export const CHIP_H = 0.028;
const MAX_PER_COLUMN = 12;

const geometry = new THREE.CylinderGeometry(CHIP_R, CHIP_R, CHIP_H, 24);
const materials = new Map<number, THREE.MeshStandardMaterial>();
const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.5 });
const edgeGeometry = new THREE.CylinderGeometry(CHIP_R * 0.72, CHIP_R * 0.72, CHIP_H + 0.002, 24);

function materialFor(color: number): THREE.MeshStandardMaterial {
  let m = materials.get(color);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.45, metalness: 0.05 });
    materials.set(color, m);
  }
  return m;
}

export function breakDown(amount: number): number[] {
  const out: number[] = [];
  let rest = amount;
  for (const d of DENOMS) {
    while (rest >= d.value && out.length < 60) {
      out.push(d.value);
      rest -= d.value;
    }
  }
  return out;
}

export class ChipStack {
  readonly group = new THREE.Group();
  amount = 0;

  set(amount: number): void {
    if (amount === this.amount && this.group.children.length > 0) return;
    this.amount = amount;
    this.group.clear();
    if (amount <= 0) return;
    const chips = breakDown(amount);
    const columns: number[][] = [];
    // One column per denomination, overflowing into new columns.
    let current: number[] = [];
    let currentValue = -1;
    for (const v of chips) {
      if (v !== currentValue || current.length >= MAX_PER_COLUMN) {
        current = [];
        columns.push(current);
        currentValue = v;
      }
      current.push(v);
    }
    const spacing = CHIP_R * 2.3;
    const offset = ((columns.length - 1) * spacing) / 2;
    columns.forEach((col, i) => {
      col.forEach((v, j) => {
        const color = DENOMS.find((d) => d.value === v)!.color;
        const chip = new THREE.Mesh(geometry, materialFor(color));
        chip.position.set(i * spacing - offset, CHIP_H / 2 + j * CHIP_H, 0);
        chip.castShadow = true;
        chip.receiveShadow = true;
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.position.copy(chip.position);
        this.group.add(chip, edge);
      });
    });
  }
}
