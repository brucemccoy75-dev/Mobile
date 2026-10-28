import Phaser from 'phaser';
import type { VfxKind } from '@core/vfx';
import { tween, wait } from '@game/ui/tween';

/**
 * Battle effects (DECISIONS #59), drawn with plain images and tweens so they cost nothing between
 * moments and do not depend on the engine's particle API. Every effect is short (under a second),
 * capped in particle count for phones, and resolves its promise when the hit should land.
 */
const DEPTH = 40;
/** Mix a colour toward white, for a tint that colours a sprite without drowning it. */
const lighten = (c: number, t: number) => { const ch = (s: number) => Math.round(((c >> s) & 0xff) + (255 - ((c >> s) & 0xff)) * t); return (ch(16) << 16) | (ch(8) << 8) | ch(0); };
type Pt = { x: number; y: number };

export class BattleFx {
  constructor(private scene: Phaser.Scene) { BattleFx.textures(scene); }

  /** A soft white dot and a hard spark, generated once per game. */
  static textures(scene: Phaser.Scene) {
    if (!scene.textures.exists('fx_dot')) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      for (let r = 16; r > 0; r -= 2) { g.fillStyle(0xffffff, 0.14 + (1 - r / 16) * 0.8); g.fillCircle(16, 16, r); }
      g.generateTexture('fx_dot', 32, 32); g.destroy();
    }
    if (!scene.textures.exists('fx_spark')) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xffffff, 1); g.fillRect(0, 3, 12, 2); g.fillRect(5, 0, 2, 8);
      g.generateTexture('fx_spark', 12, 8); g.destroy();
    }
  }

  /** `count` particles flung from a point; they fade as they fly. */
  burst(at: Pt, color: number, count = 12, speed = 70, life = 450, size = 0.35, gravity = 0) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2, v = speed * (0.4 + Math.random() * 0.8);
      const p = this.scene.add.image(at.x, at.y, 'fx_dot').setTint(color).setScale(size * (0.6 + Math.random() * 0.6)).setDepth(DEPTH).setBlendMode(Phaser.BlendModes.ADD);
      this.scene.tweens.add({ targets: p, x: at.x + Math.cos(a) * v, y: at.y + Math.sin(a) * v + gravity, alpha: 0, scale: 0.05, duration: life * (0.7 + Math.random() * 0.5), ease: 'Quad.Out', onComplete: () => p.destroy() });
    }
  }

  /** A grey horizontal arc across the target, longer for a bigger hit (#59: sized by the damage). */
  async slash(at: Pt, amount: number, flip = false) {
    const w = Phaser.Math.Clamp(60 + amount * 9, 60, 230), hgt = w * 0.26;
    const g = this.scene.add.graphics({ x: at.x, y: at.y }).setDepth(DEPTH).setRotation(flip ? 0.2 : -0.2);
    // A horizontal oval sliver: the outer arc of the oval and a flatter inner arc, filled grey, with a bright cutting edge.
    const outer: Pt[] = [], inner: Pt[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = Math.PI * (i / 28);
      outer.push({ x: -Math.cos(t) * w / 2, y: Math.sin(t) * hgt / 2 });
      inner.push({ x: -Math.cos(t) * w * 0.47, y: Math.sin(t) * hgt * 0.12 });
    }
    g.fillStyle(0xb9c0cc, 0.85);
    g.beginPath(); g.moveTo(outer[0]!.x, outer[0]!.y);
    for (const p of outer.slice(1)) g.lineTo(p.x, p.y);
    for (const p of [...inner].reverse()) g.lineTo(p.x, p.y);
    g.closePath(); g.fillPath();
    g.lineStyle(2, 0xffffff, 0.9); g.beginPath(); g.moveTo(outer[0]!.x, outer[0]!.y); for (const p of outer.slice(1)) g.lineTo(p.x, p.y); g.strokePath();
    g.setScale(0.25, 1);
    this.burst({ x: at.x + (flip ? -w * 0.3 : w * 0.3), y: at.y }, 0xe6ebf2, Math.min(10, 3 + Math.round(amount / 2)), 50, 320, 0.22);
    await tween(this.scene, { targets: g, scaleX: 1, duration: 110, ease: 'Quad.Out' });
    void tween(this.scene, { targets: g, alpha: 0, duration: 260, ease: 'Quad.In' }).then(() => g.destroy());
  }

  /** A shield on someone, in the colour of what they gained or what blocked (DECISIONS #59, #62). */
  glow(target: Phaser.GameObjects.GameObject & { x: number; y: number; displayWidth?: number; displayHeight?: number; originY?: number }, color = 0x6cc6ff) {
    const w = (target.displayWidth ?? 80) * 0.9, h = (target.displayHeight ?? 100) * 0.95;
    const cy = target.y - (target.originY === 1 ? h / 2 : 0);
    const aura = this.scene.add.ellipse(target.x, cy, w, h, color, 0.55).setDepth(DEPTH - 1).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0).setScale(0.85);
    // A quick flash, a third of a second in all (#63).
    this.scene.tweens.add({ targets: aura, alpha: 0.6, scale: 1.05, duration: 90, yoyo: true, hold: 60, ease: 'Sine.Out', onComplete: () => aura.destroy() });
    const t = target as unknown as { setTint?: (c: number) => void; clearTint?: () => void };
    if (t.setTint && t.clearTint) { t.setTint(lighten(color, 0.55)); this.scene.time.delayedCall(220, () => t.clearTint!()); }
    for (let i = 0; i < 4; i++) this.scene.time.delayedCall(i * 25, () => this.burst({ x: target.x + (Math.random() - 0.5) * w * 0.7, y: cy + h * 0.3 }, color, 1, 30, 420, 0.25, -50));
  }

  /**
   * A block (#63): a curved shield snaps up on the side the hit came from, flashes, and is gone in a
   * quarter second, throwing sparks back toward the attacker.
   */
  deflect(target: { x: number; y: number; displayWidth?: number; displayHeight?: number; originY?: number }, color: number, fromRight: boolean) {
    const w = (target.displayWidth ?? 80), h = (target.displayHeight ?? 100);
    const cy = target.y - (target.originY === 1 ? h / 2 : 0);
    const sx = target.x + (fromRight ? 1 : -1) * w * 0.42;
    const g = this.scene.add.graphics({ x: sx, y: cy }).setDepth(DEPTH + 1).setBlendMode(Phaser.BlendModes.ADD);
    const r = h * 0.48, dir = fromRight ? 1 : -1;
    for (const [lw, al] of [[10, 0.35], [5, 0.9], [2, 1]] as const) {
      g.lineStyle(lw, lw === 2 ? 0xffffff : color, al);
      g.beginPath(); g.arc(-dir * r * 0.55, 0, r, dir > 0 ? -0.9 : Math.PI - 0.9, dir > 0 ? 0.9 : Math.PI + 0.9); g.strokePath();
    }
    g.setScale(0.6).setAlpha(0);
    this.scene.tweens.add({ targets: g, scale: 1.05, alpha: 1, duration: 60, ease: 'Quad.Out' });
    this.scene.tweens.add({ targets: g, alpha: 0, scale: 1.12, duration: 160, delay: 90, ease: 'Quad.In', onComplete: () => g.destroy() });
    this.flash({ x: sx, y: cy }, color);
    for (let i = 0; i < 7; i++) {
      const a = (fromRight ? 0 : Math.PI) + (Math.random() - 0.5) * 1.6, v = 40 + Math.random() * 40;
      const p = this.scene.add.image(sx, cy + (Math.random() - 0.5) * r, 'fx_spark').setTint(i % 2 ? 0xffffff : color).setRotation(a).setDepth(DEPTH + 1).setBlendMode(Phaser.BlendModes.ADD);
      this.scene.tweens.add({ targets: p, x: sx + Math.cos(a) * v, y: p.y + Math.sin(a) * v, alpha: 0, duration: 220, ease: 'Quad.Out', onComplete: () => p.destroy() });
    }
  }

  /** Rising green motes on someone healing. */
  heal(at: Pt) {
    this.glow({ x: at.x, y: at.y + 40, displayWidth: 90, displayHeight: 110, originY: 1 } as never, 0x6dff8e);
    for (let i = 0; i < 14; i++) this.scene.time.delayedCall(i * 40, () => this.burst({ x: at.x + (Math.random() - 0.5) * 60, y: at.y + 30 }, 0x7dff9a, 1, 20, 850, 0.45, -80));
  }

  /** The cast for a magic kind, from caster to target; resolves at impact. Physical and none resolve at once. */
  /** `head` is just above the target's head, where a cloud or a skull belongs (#62). */
  async cast(kind: VfxKind, from: Pt, to: Pt, head: Pt = { x: to.x, y: to.y - 52 }) {
    if (kind === 'fireball') return this.orb(from, to, 0xff8c42, 0xffd166, 1.9, () => { this.flash(to, 0xffb347); this.burst(to, 0xff8c42, 16, 80); this.burst(to, 0xffe08a, 8, 50); });
    if (kind === 'frost') return this.orb(from, to, 0x9ad7ff, 0xffffff, 1.4, () => { this.burst(to, 0xbfe9ff, 14, 70); this.shards(to); });
    if (kind === 'arcane') return this.orb(from, to, 0xb57bff, 0xe0c8ff, 1.5, () => { this.ring(to, 0xb57bff); this.burst(to, 0xc9a2ff, 10, 60); });
    if (kind === 'lightning') return this.bolt(to);
    if (kind === 'poison') return this.cloud(head);
    if (kind === 'curse') return this.skull(head);
  }

  private async orb(from: Pt, to: Pt, color: number, trail: number, size: number, impact: () => void) {
    // The orb keeps its colour (normal blend); only a small core and the trail add light.
    const o = this.scene.add.image(from.x, from.y, 'fx_dot').setTint(color).setScale(size).setDepth(DEPTH);
    const core = this.scene.add.image(from.x, from.y, 'fx_dot').setTint(trail).setScale(size * 0.3).setDepth(DEPTH + 1).setBlendMode(Phaser.BlendModes.ADD);
    let n = 0;
    const arc = -40 - Math.random() * 20;
    await tween(this.scene, {
      targets: { t: 0 }, t: 1, duration: 300, ease: 'Sine.In',
      onUpdate: (tw) => {
        const t = tw.getValue() ?? 0, x = from.x + (to.x - from.x) * t, y = from.y + (to.y - from.y) * t + Math.sin(t * Math.PI) * arc;
        o.setPosition(x, y); core.setPosition(x, y);
        n++; this.burst({ x, y }, trail, 1, 14, 300, size * 0.4);
      },
    });
    o.destroy(); core.destroy();
    impact();
  }

  private async bolt(to: Pt) {
    const g = this.scene.add.graphics().setDepth(DEPTH + 2).setBlendMode(Phaser.BlendModes.ADD);
    const draw = () => {
      g.clear();
      const pts: Pt[] = [{ x: to.x + (Math.random() - 0.5) * 40, y: 0 }];
      for (let y = 30; y < to.y; y += 26) pts.push({ x: to.x + (Math.random() - 0.5) * 34, y });
      pts.push(to);
      for (const [wd, col, al] of [[9, 0x7fb8ff, 0.35], [4, 0xdfeeff, 0.9], [2, 0xffffff, 1]] as const) {
        g.lineStyle(wd, col, al); g.beginPath(); g.moveTo(pts[0]!.x, pts[0]!.y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y); g.strokePath();
      }
    };
    draw(); this.scene.cameras.main.flash(90, 200, 220, 255);
    await wait(this.scene, 70); draw(); await wait(this.scene, 70);
    this.burst(to, 0xdfeeff, 14, 70, 380, 0.3);
    void tween(this.scene, { targets: g, alpha: 0, duration: 160 }).then(() => g.destroy());
  }

  /** A green cloud just above the head, raining down onto it. */
  private async cloud(head: Pt) {
    const top = head.y - 22;
    const puffs = Array.from({ length: 8 }, (_, i) => this.scene.add.image(head.x + (i - 3.5) * 15, top + (i % 2) * 9, 'fx_dot').setTint(0x4f9a3f).setScale(1.7).setAlpha(0).setDepth(DEPTH));
    await tween(this.scene, { targets: puffs, alpha: 0.75, duration: 200 });
    for (let i = 0; i < 16; i++) this.scene.time.delayedCall(i * 35, () => {
      const d = this.scene.add.image(head.x + (Math.random() - 0.5) * 80, top + 10, 'fx_dot').setTint(0x9be27f).setScale(0.18, 0.4).setDepth(DEPTH);
      this.scene.tweens.add({ targets: d, y: head.y + 46, alpha: 0.2, duration: 360, ease: 'Quad.In', onComplete: () => d.destroy() });
    });
    await wait(this.scene, 520);
    void tween(this.scene, { targets: puffs, alpha: 0, y: top - 14, duration: 380 }).then(() => puffs.forEach((p) => p.destroy()));
  }

  /** A purple skull and crossbones that grows over the head, glows, and fades upward (a curse, #62). */
  private async skull(head: Pt) {
    const c = this.scene.add.container(head.x, head.y - 18).setDepth(DEPTH + 1).setScale(0.2).setAlpha(0);
    const g = this.scene.add.graphics();
    const bone = 0xd9b8ff, dark = 0x2a0f3d;
    for (const rot of [0.7, -0.7]) {
      g.save(); g.translateCanvas(0, 14); g.rotateCanvas(rot);
      g.fillStyle(bone, 1); g.fillRoundedRect(-30, -4, 60, 8, 4);
      for (const ex of [-30, 30]) { g.fillCircle(ex, -4, 5); g.fillCircle(ex, 4, 5); }
      g.restore();
    }
    g.fillStyle(bone, 1); g.fillCircle(0, -8, 20); g.fillRoundedRect(-12, 4, 24, 14, 4);
    g.fillStyle(dark, 1); g.fillCircle(-7, -9, 6); g.fillCircle(7, -9, 6);
    g.fillTriangle(0, -2, -3, 4, 3, 4);
    for (const tx of [-7, 0, 7]) g.fillRect(tx - 1.5, 10, 3, 7);
    const aura = this.scene.add.image(0, 0, 'fx_dot').setTint(0xb06bff).setScale(3.2).setAlpha(0.55).setBlendMode(Phaser.BlendModes.ADD);
    c.add([aura, g]);
    await tween(this.scene, { targets: c, scale: 1.15, alpha: 1, duration: 420, ease: 'Back.Out' });
    this.burst(head, 0xb06bff, 10, 50, 500, 0.3);
    void tween(this.scene, { targets: c, scale: 1.35, alpha: 0, y: c.y - 24, duration: 520, delay: 260, ease: 'Quad.In' }).then(() => c.destroy());
  }

  private flash(at: Pt, color: number) {
    const c = this.scene.add.image(at.x, at.y, 'fx_dot').setTint(color).setScale(1.2).setDepth(DEPTH).setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: c, scale: 3, alpha: 0, duration: 260, ease: 'Quad.Out', onComplete: () => c.destroy() });
  }

  private ring(at: Pt, color: number) {
    const r = this.scene.add.circle(at.x, at.y, 14).setStrokeStyle(3, color, 0.9).setDepth(DEPTH);
    this.scene.tweens.add({ targets: r, scale: 3.2, alpha: 0, duration: 340, ease: 'Quad.Out', onComplete: () => r.destroy() });
  }

  private shards(at: Pt) {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const s = this.scene.add.image(at.x, at.y, 'fx_spark').setTint(0xdff4ff).setRotation(a).setDepth(DEPTH);
      this.scene.tweens.add({ targets: s, x: at.x + Math.cos(a) * 46, y: at.y + Math.sin(a) * 46, alpha: 0, duration: 380, ease: 'Quad.Out', onComplete: () => s.destroy() });
    }
  }
}
