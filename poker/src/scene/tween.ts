// Tiny tween runner driven from the render loop. All durations are scaled by the speed function.
export type Easing = (t: number) => number;

export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic: Easing = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack: Easing = (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
export const linear: Easing = (t) => t;

interface Active {
  start: number;
  duration: number;
  easing: Easing;
  update: (t: number) => void;
  resolve: () => void;
}

export class Tweens {
  private active: Active[] = [];
  private now = 0;
  speed: () => number = () => 1;

  /** Advances all tweens by `dt` milliseconds of real time. */
  tick(dt: number): void {
    this.now += dt * this.speed();
    const done: Active[] = [];
    for (const a of this.active) {
      const t = a.duration <= 0 ? 1 : Math.min(1, (this.now - a.start) / a.duration);
      a.update(a.easing(t));
      if (t >= 1) done.push(a);
    }
    if (done.length) {
      this.active = this.active.filter((a) => !done.includes(a));
      for (const a of done) a.resolve();
    }
  }

  run(duration: number, update: (t: number) => void, easing: Easing = easeOutCubic): Promise<void> {
    return new Promise((resolve) => {
      this.active.push({ start: this.now, duration, easing, update, resolve });
    });
  }

  delay(ms: number): Promise<void> {
    return this.run(ms, () => {}, linear);
  }

  /** Clears everything; pending promises resolve immediately. */
  clear(): void {
    const all = this.active;
    this.active = [];
    for (const a of all) {
      a.update(1);
      a.resolve();
    }
  }
}
