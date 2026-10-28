import Phaser from 'phaser';
import type { ScreenMap, Tile } from '@core/map';
import { BattleFx } from './battleFx';

/**
 * Overworld ambience (DECISIONS #60): a dust puff behind the walking hero, slow ripples and glints on
 * the water, and now and then a few birds that cross the map or land on the grass for a while. All of
 * it is meant to be noticed only when you look: low alpha, small, rare, and below the nodes. Timers
 * belong to the scene, so they stop with it; nothing runs every frame.
 */
const DUST = 0xf1e6cc;

export class OverworldFx {
  private water: Tile[] = [];
  private grass: Tile[] = [];

  constructor(private scene: Phaser.Scene, private map: ScreenMap, private tile: number) {
    BattleFx.textures(scene);
    for (let y = 1; y < map.height - 1; y++) for (let x = 1; x < map.width - 1; x++) {
      const t = map.tiles[y * map.width + x];
      if (t === 'water') this.water.push({ x, y });
      else if (t === 'grass') this.grass.push({ x, y });
    }
  }

  start() {
    if (this.water.length) this.scene.time.addEvent({ delay: 650, loop: true, callback: () => this.ripple() });
    this.scene.time.addEvent({ delay: Phaser.Math.Between(4000, 8000), callback: () => this.flockLoop() });
  }

  /** A small puff where the hero's feet just were. */
  dust(x: number, y: number) {
    for (let i = 0; i < 2; i++) {
      const p = this.scene.add.image(x + (Math.random() - 0.5) * 10, y, 'fx_dot').setTint(DUST).setAlpha(0.5).setScale(0.45).setDepth(5.4);
      this.scene.tweens.add({ targets: p, x: p.x + (Math.random() - 0.5) * 14, y: y - 6 - Math.random() * 6, scale: 1.1, alpha: 0, duration: 600 + Math.random() * 200, ease: 'Quad.Out', onComplete: () => p.destroy() });
    }
  }

  private at(t: Tile, jitter = 0.35) { return { x: (t.x + 0.5 + (Math.random() - 0.5) * jitter * 2) * this.tile, y: (t.y + 0.5 + (Math.random() - 0.5) * jitter * 2) * this.tile }; }

  /** A ring spreading on the water, or a brief glint. */
  private ripple() {
    const p = this.at(Phaser.Utils.Array.GetRandom(this.water));
    if (Math.random() < 0.3) {
      const g = this.scene.add.image(p.x, p.y, 'fx_spark').setAlpha(0).setScale(0.8).setDepth(2).setBlendMode(Phaser.BlendModes.ADD);
      this.scene.tweens.add({ targets: g, alpha: 0.45, duration: 300, yoyo: true, onComplete: () => g.destroy() });
      return;
    }
    const r = this.scene.add.ellipse(p.x, p.y, this.tile * 0.28, this.tile * 0.1).setStrokeStyle(1.5, 0xffffff, 0.3).setDepth(2);
    this.scene.tweens.add({ targets: r, scaleX: 2.6, scaleY: 2.6, alpha: 0, duration: 2200, ease: 'Sine.Out', onComplete: () => r.destroy() });
  }

  private flockLoop() {
    if (this.scene.sys.isActive()) this.flock();
    this.scene.time.addEvent({ delay: Phaser.Math.Between(14000, 28000), callback: () => this.flockLoop() });
  }

  /** Two to four birds cross the view; sometimes they settle on nearby grass, peck a little, and go. */
  private flock() {
    const cam = this.scene.cameras.main.worldView;
    const n = Phaser.Math.Between(2, 4);
    const fromLeft = Math.random() < 0.5;
    const y0 = cam.y + cam.height * (0.15 + Math.random() * 0.4);
    const land = Math.random() < 0.45 ? this.grass.filter((g) => { const c = this.at(g, 0); return cam.contains(c.x, c.y); }) : [];
    const spot = land.length ? Phaser.Utils.Array.GetRandom(land) : null;
    for (let i = 0; i < n; i++) {
      const b = this.bird();
      const sx = fromLeft ? cam.x - 30 - i * 22 : cam.right + 30 + i * 22, sy = y0 + (i % 2) * 12 - i * 4;
      b.setPosition(sx, sy).setScale(fromLeft ? 1 : -1, 1);
      const flap = this.scene.tweens.add({ targets: b, scaleY: 0.35, duration: 140 + Math.random() * 40, yoyo: true, repeat: -1 });
      if (spot) {
        const p = this.at(spot, 0.6);
        this.scene.tweens.add({
          targets: b, x: p.x + i * 14, y: p.y + (i % 2) * 6, duration: 2600 + i * 200, ease: 'Sine.InOut',
          onComplete: () => {
            flap.stop(); b.setScale(b.scaleX, 1).setDepth(3);
            const hop = this.scene.tweens.add({ targets: b, y: b.y - 3, duration: 120, yoyo: true, repeat: -1, repeatDelay: 900 + Math.random() * 1500 });
            this.scene.time.delayedCall(5000 + Math.random() * 5000, () => {
              hop.stop(); b.setDepth(8);
              this.scene.tweens.add({ targets: b, scaleY: 0.35, duration: 130, yoyo: true, repeat: -1 });
              const away = fromLeft ? cam.right + 60 : cam.x - 60;
              this.scene.tweens.add({ targets: b, x: away, y: b.y - cam.height * 0.5, duration: 2400, ease: 'Sine.In', onComplete: () => b.destroy() });
            });
          },
        });
      } else {
        const ex = fromLeft ? cam.right + 60 : cam.x - 60;
        this.scene.tweens.add({ targets: b, x: ex, y: sy - 30 + Math.random() * 60, duration: 6500 + Math.random() * 2000, ease: 'Linear', onComplete: () => { flap.stop(); b.destroy(); } });
      }
    }
  }

  /** A tiny dark "v". */
  private bird(): Phaser.GameObjects.Graphics {
    const g = this.scene.add.graphics().setDepth(8).setAlpha(0.75);
    g.lineStyle(2.5, 0x1f2328, 1);
    g.beginPath(); g.moveTo(-10, -4); g.lineTo(0, 1); g.lineTo(10, -4); g.strokePath();
    return g;
  }
}
