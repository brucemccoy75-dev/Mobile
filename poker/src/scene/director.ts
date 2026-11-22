// First-person camera: you sit in seat 0 and look across the table. Every cut is a head turn from
// the same eye position. Swipe to turn; it snaps to the nearest player or back to the table.
import * as THREE from 'three';
import { type Tweens, easeInOutCubic } from './tween';
import { SEAT_COUNT, figurePos } from './layout';

interface Gaze {
  /** Radians; 0 is straight across the table, positive turns right. */
  yaw: number;
  /** Radians; negative looks down. */
  pitch: number;
}

/** Eye position: just inside your own seat, at sitting height. */
export const EYE = new THREE.Vector3(0, 1.45, 3.3);
const TABLE_LOOK = new THREE.Vector3(0, 0.8, -1.6);
const RETURN_AFTER_MS = 6000;

function gazeAt(target: THREE.Vector3): Gaze {
  const d = target.clone().sub(EYE);
  const flat = Math.hypot(d.x, d.z);
  return { yaw: Math.atan2(d.x, -d.z), pitch: Math.atan2(d.y, flat) };
}

function shortest(from: number, to: number): number {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export class Director {
  readonly camera: THREE.PerspectiveCamera;
  /** 0 = the table, 1..5 = opponents. */
  cursor = 0;
  private gazes: Gaze[] = [];
  private current: Gaze;
  private dragging = false;
  private lastInteraction = 0;
  private tweens: Tweens;
  private cutToken = 0;

  constructor(camera: THREE.PerspectiveCamera, tweens: Tweens) {
    this.camera = camera;
    this.tweens = tweens;
    this.gazes = [gazeAt(TABLE_LOOK)];
    for (let s = 1; s < SEAT_COUNT; s++) {
      const f = figurePos(s);
      this.gazes.push(gazeAt(new THREE.Vector3(f.x, 1.3, f.z)));
    }
    this.current = { ...this.gazes[0] };
    this.apply(this.current);
  }

  /** Field of view widens on squarer screens so the far side of the table still fits. */
  setAspect(aspect: number): void {
    this.camera.fov = Math.min(64, Math.max(50, 50 + (2.0 - aspect) * 16));
    this.camera.updateProjectionMatrix();
  }

  private apply(g: Gaze): void {
    this.current = g;
    const dir = new THREE.Vector3(Math.sin(g.yaw) * Math.cos(g.pitch), Math.sin(g.pitch), -Math.cos(g.yaw) * Math.cos(g.pitch));
    this.camera.position.copy(EYE);
    this.camera.lookAt(EYE.clone().add(dir));
  }

  /** Turns to a shot with a smooth head movement. */
  cutTo(cursor: number, ms = 650): Promise<void> {
    const n = this.gazes.length;
    this.cursor = ((cursor % n) + n) % n;
    this.lastInteraction = performance.now();
    const from = { ...this.current };
    const to = this.gazes[this.cursor];
    const dYaw = shortest(from.yaw, to.yaw);
    const dPitch = to.pitch - from.pitch;
    const token = ++this.cutToken;
    return this.tweens.run(ms, (t) => {
      if (token !== this.cutToken) return;
      this.apply({ yaw: from.yaw + dYaw * t, pitch: from.pitch + dPitch * t });
    }, easeInOutCubic);
  }

  /** A glance at someone, e.g. an all-in; ignored while the viewer is looking around. */
  async autoCut(seat: number, holdMs: number): Promise<void> {
    if (this.dragging || this.cursor !== 0 || seat === 0) return;
    await this.cutTo(seat, 500);
    await this.tweens.delay(holdMs);
    if (this.cursor === seat && !this.dragging) await this.cutTo(0, 500);
  }

  dragStart(): void {
    this.dragging = true;
    this.cutToken++;
    this.lastInteraction = performance.now();
  }

  dragMove(dxPixels: number): void {
    if (!this.dragging) return;
    // Drag left to look left: the view follows the finger.
    const yaw = this.current.yaw - dxPixels * 0.0045;
    const nearest = this.nearest(yaw);
    const pitch = this.current.pitch + (this.gazes[nearest].pitch - this.current.pitch) * 0.15;
    this.apply({ yaw, pitch });
    this.lastInteraction = performance.now();
  }

  dragEnd(): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.lastInteraction = performance.now();
    void this.cutTo(this.nearest(this.current.yaw), 420);
  }

  private nearest(yaw: number): number {
    let best = 0;
    let bestD = Infinity;
    this.gazes.forEach((g, i) => {
      const d = Math.abs(shortest(yaw, g.yaw)) + (i === 0 ? 0.05 : 0);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return best;
  }

  /** Tap on an opponent: look at them, or back to the table if already there. */
  lookAt(seat: number): void {
    this.lastInteraction = performance.now();
    void this.cutTo(seat === this.cursor ? 0 : seat, 550);
  }

  tick(): void {
    if (this.dragging || this.cursor === 0) return;
    if (performance.now() - this.lastInteraction > RETURN_AFTER_MS) {
      this.lastInteraction = performance.now();
      void this.cutTo(0, 700);
    }
  }
}
