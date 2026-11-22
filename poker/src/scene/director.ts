// Camera shots: the TV view of the whole table, plus a close-up per opponent. Swipe to orbit
// between them; it snaps to the nearest shot on release and drifts back to the table.
import * as THREE from 'three';
import { type Tweens, easeInOutCubic } from './tween';
import { SEAT_COUNT, figurePos } from './layout';

export interface Pose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

// Lower and closer than a broadcast crane shot: you are sitting at the table, looking across it.
const TV: Pose = { pos: new THREE.Vector3(0, 4.7, 6.2), look: new THREE.Vector3(0, 0.35, -1.1) };
const RETURN_AFTER_MS = 6000;

function seatPose(seat: number): Pose {
  const f = figurePos(seat);
  const toCentre = new THREE.Vector3(-f.x, 0, -f.z).normalize();
  const pos = f.clone().add(toCentre.multiplyScalar(3.6));
  pos.y = 1.75;
  return { pos, look: new THREE.Vector3(f.x, 1.15, f.z) };
}

function blend(a: Pose, b: Pose, t: number): Pose {
  return { pos: a.pos.clone().lerp(b.pos, t), look: a.look.clone().lerp(b.look, t) };
}

export class Director {
  readonly camera: THREE.PerspectiveCamera;
  /** 0 = TV view, 1..5 = opponents in seat order. */
  cursor = 0;
  private poses: Pose[] = [];
  private current: Pose = { pos: TV.pos.clone(), look: TV.look.clone() };
  private dragging = false;
  private lastInteraction = 0;
  private tweens: Tweens;
  private cutToken = 0;
  /** Extra distance for narrow screens so the whole table fits. */
  private zoomOut = 0;

  constructor(camera: THREE.PerspectiveCamera, tweens: Tweens) {
    this.camera = camera;
    this.tweens = tweens;
    this.poses = [TV];
    for (let s = 1; s < SEAT_COUNT; s++) this.poses.push(seatPose(s));
    this.apply(TV);
  }

  setAspect(aspect: number): void {
    // The TV shot is framed for about 2:1; pull back as the screen gets squarer.
    this.zoomOut = Math.max(0, (1.9 - aspect) * 2.4);
    if (this.cursor === 0 && !this.dragging) this.apply(this.poseAt(0));
  }

  private poseAt(cursor: number): Pose {
    const n = this.poses.length;
    const c = ((cursor % n) + n) % n;
    const i = Math.floor(c);
    const t = c - i;
    const a = this.adjusted(i);
    if (t < 1e-4) return a;
    return blend(a, this.adjusted((i + 1) % n), easeInOutCubic(t));
  }

  private adjusted(i: number): Pose {
    const p = this.poses[i];
    if (i !== 0 || this.zoomOut === 0) return p;
    const dir = p.pos.clone().sub(p.look).normalize();
    return { pos: p.pos.clone().add(dir.multiplyScalar(this.zoomOut)), look: p.look };
  }

  private apply(p: Pose): void {
    this.current = p;
    this.camera.position.copy(p.pos);
    this.camera.lookAt(p.look);
  }

  /** Looks at a shot with a smooth move. */
  cutTo(cursor: number, ms = 650): Promise<void> {
    const n = this.poses.length;
    this.cursor = ((cursor % n) + n) % n;
    const from = { pos: this.current.pos.clone(), look: this.current.look.clone() };
    const to = this.poseAt(this.cursor);
    const token = ++this.cutToken;
    return this.tweens.run(ms, (t) => {
      if (token !== this.cutToken) return;
      this.apply(blend(from, to, t));
    }, easeInOutCubic);
  }

  /** An automatic cut, e.g. to an all-in; ignored while the viewer is looking around. */
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
    this.cursor += -dxPixels / 260;
    this.apply(this.poseAt(this.cursor));
    this.lastInteraction = performance.now();
  }

  dragEnd(): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.lastInteraction = performance.now();
    void this.cutTo(Math.round(this.cursor), 450);
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
