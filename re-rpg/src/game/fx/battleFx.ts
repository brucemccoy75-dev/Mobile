import Phaser from 'phaser';
import type { VfxKind } from '@core/vfx';
import { tween, wait } from '@game/ui/tween';
import { type Body, blockSide, type ShieldSide, shieldArc, skullPoints } from './shapes';

/**
 * Battle effects (DECISIONS #59), drawn with plain images and tweens so they cost nothing between
 * moments and do not depend on the engine's particle API. Every effect is short (under a second),
 * capped in particle count for phones, and resolves its promise when the hit should land.
 */
const DEPTH = 40;
/** Mix a colour toward white, for a tint that colours a sprite without drowning it. */
const lighten = (c: number, t: number) => { const ch = (s: number) => Math.round(((c >> s) & 0xff) + (255 - ((c >> s) & 0xff)) * t); return (ch(16) << 16) | (ch(8) << 8) | ch(0); };
type Pt = { x: number; y: number };
/** A blocked hit (#66): who blocked, in what colour, and whether the attacker stands to their right. */
export type Guard = { target: Body; color: number; fromRight: boolean };

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
    this.sliver(g, w, hgt);
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
   * A block (#63): a curved shield snaps up on the side the hit came from (a dome over the head for a
   * spell from above, #66), flashes, and is gone in a quarter second, throwing sparks back out.
   */
  deflect(target: Body, color: number, side: ShieldSide) {
    const { angle, r, apex, centre } = shieldArc(target, side);
    // Drawn around the apex, so the snap-up grows out from where the hit meets it.
    const g = this.scene.add.graphics({ x: apex.x, y: apex.y }).setDepth(DEPTH + 1).setBlendMode(Phaser.BlendModes.ADD);
    for (const [lw, al] of [[10, 0.35], [5, 0.9], [2, 1]] as const) {
      g.lineStyle(lw, lw === 2 ? 0xffffff : color, al);
      g.beginPath(); g.arc(centre.x - apex.x, centre.y - apex.y, r, angle - 0.9, angle + 0.9); g.strokePath();
    }
    g.setScale(0.6).setAlpha(0);
    this.scene.tweens.add({ targets: g, scale: 1.05, alpha: 1, duration: 60, ease: 'Quad.Out' });
    this.scene.tweens.add({ targets: g, alpha: 0, scale: 1.12, duration: 160, delay: 90, ease: 'Quad.In', onComplete: () => g.destroy() });
    this.flash(apex, color);
    const along = { x: -Math.sin(angle), y: Math.cos(angle) };
    for (let i = 0; i < 7; i++) {
      const a = angle + (Math.random() - 0.5) * 1.6, v = 40 + Math.random() * 40, off = (Math.random() - 0.5) * r;
      const p = this.scene.add.image(apex.x + along.x * off, apex.y + along.y * off, 'fx_spark').setTint(i % 2 ? 0xffffff : color).setRotation(a).setDepth(DEPTH + 1).setBlendMode(Phaser.BlendModes.ADD);
      this.scene.tweens.add({ targets: p, x: p.x + Math.cos(a) * v, y: p.y + Math.sin(a) * v, alpha: 0, duration: 220, ease: 'Quad.Out', onComplete: () => p.destroy() });
    }
  }

  /**
   * A blocked slash (#66): the blade sweeps in from the attacker's side and stops dead at the
   * shield, which snaps up as it arrives; the blade then falls away instead of crossing the body.
   */
  async slashBlocked(target: Body, amount: number, color: number, fromRight: boolean) {
    const side: ShieldSide = fromRight ? 'right' : 'left', dir = fromRight ? 1 : -1;
    const { apex } = shieldArc(target, side);
    const w = Phaser.Math.Clamp(60 + amount * 9, 60, 230), hgt = w * 0.26;
    const len = Math.min(w, 110); // how much of the blade shows outside the shield
    // The blade's outer end sits `len` out from the shield and it grows inward until its tip touches.
    const g = this.scene.add.graphics({ x: apex.x + dir * len, y: apex.y }).setDepth(DEPTH).setRotation(fromRight ? 0.2 : -0.2);
    this.sliver(g, w, hgt, -dir * w / 2);
    g.setScale(0.1, 1);
    await tween(this.scene, { targets: g, scaleX: len / w, duration: 90, ease: 'Quad.In' });
    this.deflect(target, color, side);
    void tween(this.scene, { targets: g, x: g.x + dir * 18, alpha: 0, delay: 50, duration: 180, ease: 'Quad.Out' }).then(() => g.destroy());
  }

  /** The slash's grey oval sliver with a bright cutting edge, `ox` along from the graphics' origin. */
  private sliver(g: Phaser.GameObjects.Graphics, w: number, hgt: number, ox = 0) {
    const outer: Pt[] = [], inner: Pt[] = [];
    for (let i = 0; i <= 28; i++) {
      const t = Math.PI * (i / 28);
      outer.push({ x: ox - Math.cos(t) * w / 2, y: Math.sin(t) * hgt / 2 });
      inner.push({ x: ox - Math.cos(t) * w * 0.47, y: Math.sin(t) * hgt * 0.12 });
    }
    g.fillStyle(0xb9c0cc, 0.85);
    g.beginPath(); g.moveTo(outer[0]!.x, outer[0]!.y);
    for (const p of outer.slice(1)) g.lineTo(p.x, p.y);
    for (const p of [...inner].reverse()) g.lineTo(p.x, p.y);
    g.closePath(); g.fillPath();
    g.lineStyle(2, 0xffffff, 0.9); g.beginPath(); g.moveTo(outer[0]!.x, outer[0]!.y); for (const p of outer.slice(1)) g.lineTo(p.x, p.y); g.strokePath();
  }

  /** Lunch Break (#69): a sandwich drops in over the hero, bounces, and is eaten in a puff of crumbs. */
  async sandwich(at: Pt) {
    const g = this.scene.add.graphics().setDepth(DEPTH + 1);
    const layer = (y: number, w: number, hgt: number, color: number, r = 6) => { g.fillStyle(color, 1); g.fillRoundedRect(-w / 2, y, w, hgt, r); };
    layer(10, 60, 12, 0xc98b45, 5);                       // bottom bread
    g.fillStyle(0xffd34d, 1); g.fillTriangle(-26, 8, 30, 8, 22, 14); // cheese
    layer(4, 62, 6, 0xe0452e, 3);                         // tomato
    g.fillStyle(0x6cc24a, 1); for (let x = -30; x < 30; x += 10) g.fillEllipse(x + 5, 3, 13, 7); // lettuce
    layer(-14, 60, 16, 0xe8b46a, 8);                      // top bread
    g.fillStyle(0xfff1d6, 0.9); for (const [x, y] of [[-14, -9], [0, -11], [14, -8]] as const) g.fillEllipse(x, y, 4, 2); // seeds
    g.setPosition(at.x, at.y - 170).setScale(0.8);
    await tween(this.scene, { targets: g, y: at.y - 78, scale: 1, duration: 320, ease: 'Bounce.Out' });
    await wait(this.scene, 180);
    // Eaten: it shrinks toward the hero and crumbs fall.
    for (let i = 0; i < 12; i++) {
      const c = this.scene.add.image(at.x + (Math.random() - 0.5) * 50, at.y - 75, 'fx_dot').setTint(Math.random() < 0.5 ? 0xc98b45 : 0xe8b46a).setScale(0.18).setDepth(DEPTH + 1);
      this.scene.tweens.add({ targets: c, y: c.y + 50 + Math.random() * 30, x: c.x + (Math.random() - 0.5) * 20, alpha: 0, duration: 520 + Math.random() * 200, ease: 'Quad.In', onComplete: () => c.destroy() });
    }
    await tween(this.scene, { targets: g, scale: 0.2, alpha: 0, y: at.y - 40, duration: 260, ease: 'Quad.In' });
    g.destroy();
    this.heal(at);
  }

  /** Blackjack (#69): a fan of playing cards whirls around the hero and flies off. */
  async cards(at: Pt) {
    const faces = [['A', '♠', '#111'], ['K', '♥', '#d22'], ['Q', '♦', '#d22'], ['J', '♣', '#111'], ['10', '♥', '#d22']] as const;
    const cy = at.y - 40, r = 78;
    const cards = faces.map(([v, suit, col], i) => {
      const c = this.scene.add.container(at.x, cy).setDepth(DEPTH + 1).setScale(0.2).setAlpha(0);
      c.add([this.scene.add.rectangle(0, 0, 26, 36, 0xffffff).setStrokeStyle(1.5, 0x333333), this.scene.add.text(0, 0, `${v}\n${suit}`, { fontFamily: 'Arial', fontSize: '11px', color: col, fontStyle: 'bold', align: 'center', lineSpacing: -3 }).setOrigin(0.5)]);
      return { c, a0: (i / faces.length) * Math.PI * 2 };
    });
    this.flash({ x: at.x, y: cy }, 0xffd700);
    await tween(this.scene, {
      targets: { t: 0 }, t: 1, duration: 760, ease: 'Sine.InOut',
      onUpdate: (tw) => {
        const t = tw.getValue() ?? 0;
        for (const { c, a0 } of cards) {
          const a = a0 + t * Math.PI * 2.2, rr = r * Math.min(1, t * 3);
          c.setPosition(at.x + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.55).setRotation(a + Math.PI / 2).setAlpha(Math.min(1, t * 4)).setScale(0.2 + Math.min(1, t * 3) * 0.8);
        }
      },
    });
    for (const { c } of cards) this.scene.tweens.add({ targets: c, y: c.y - 120, alpha: 0, angle: c.angle + 90, duration: 380, ease: 'Quad.In', onComplete: () => c.destroy() });
    await wait(this.scene, 200);
  }

  /** Trickster (#69): a gold coin is tossed, flips, and lands showing what came up. */
  async coin(at: Pt, result: 'heads' | 'tails') {
    const c = this.scene.add.container(at.x, at.y).setDepth(DEPTH + 2);
    const face = this.scene.add.circle(0, 0, 22, 0xf5c542).setStrokeStyle(3, 0xb8861b);
    const letter = this.scene.add.text(0, 0, 'H', { fontFamily: 'Arial', fontSize: '22px', color: '#7a5410', fontStyle: 'bold' }).setOrigin(0.5);
    c.add([face, letter]);
    const flips = 9;
    await tween(this.scene, {
      targets: { t: 0 }, t: 1, duration: 820, ease: 'Linear',
      onUpdate: (tw) => {
        const t = tw.getValue() ?? 0;
        c.y = at.y - Math.sin(t * Math.PI) * 70;           // up and back down
        const turn = t * flips * Math.PI;
        c.scaleX = Math.abs(Math.cos(turn)) || 0.05;
        const shown = t >= 1 ? result : Math.floor(t * flips) % 2 === 0 ? 'heads' : 'tails';
        letter.setText(shown === 'heads' ? 'H' : 'T');
      },
    });
    c.scaleX = 1; letter.setText(result === 'heads' ? 'H' : 'T');
    this.flash({ x: at.x, y: at.y }, 0xffe08a);
    await tween(this.scene, { targets: c, scale: 1.25, duration: 120, yoyo: true });
    await wait(this.scene, 250);
    void tween(this.scene, { targets: c, alpha: 0, duration: 300 }).then(() => c.destroy());
  }

  /** Rising green motes on someone healing. */
  heal(at: Pt) {
    this.glow({ x: at.x, y: at.y + 40, displayWidth: 90, displayHeight: 110, originY: 1 } as never, 0x6dff8e);
    for (let i = 0; i < 14; i++) this.scene.time.delayedCall(i * 40, () => this.burst({ x: at.x + (Math.random() - 0.5) * 60, y: at.y + 30 }, 0x7dff9a, 1, 20, 850, 0.45, -80));
  }

  /** The cast for a magic kind, from caster to target; resolves at impact. Physical and none resolve at once. */
  /** `head` is just above the target's head, where a cloud or a skull belongs (#62). */
  /**
   * With a `guard` the hit was blocked (#66): the spell stops at the shield instead of reaching the
   * body, and the shield snaps up as it arrives. Resolves true when it showed the shield itself.
   */
  async cast(kind: VfxKind, from: Pt, to: Pt, head: Pt = { x: to.x, y: to.y - 52 }, guard?: Guard): Promise<boolean> {
    const side = guard ? blockSide(kind, guard.fromRight) : 'up';
    const shield = () => { if (guard) this.deflect(guard.target, guard.color, side); };
    const at = guard ? shieldArc(guard.target, side).apex : to;
    // Stopped by a shield, the impact is smaller: the shield takes it.
    const n = guard ? 0.5 : 1;
    if (kind === 'fireball') await this.orb(from, at, 0xff8c42, 0xffd166, 1.9, () => { this.flash(at, 0xffb347); this.burst(at, 0xff8c42, 16 * n, 80); this.burst(at, 0xffe08a, 8 * n, 50); }, shield);
    else if (kind === 'frost') await this.orb(from, at, 0x9ad7ff, 0xffffff, 1.4, () => { this.burst(at, 0xbfe9ff, 14 * n, 70); this.shards(at); }, shield);
    else if (kind === 'arcane') await this.orb(from, at, 0xb57bff, 0xe0c8ff, 1.5, () => { this.ring(at, 0xb57bff); this.burst(at, 0xc9a2ff, 10 * n, 60); }, shield);
    else if (kind === 'lightning') await this.bolt(at, shield);
    else if (kind === 'poison') await this.cloud(head, guard && shieldArc(guard.target, 'up').apex.y, shield);
    else if (kind === 'curse') await this.skull(head, guard && shieldArc(guard.target, 'up').apex.y, shield);
    else return false;
    return !!guard;
  }

  /** `near` runs just before impact, for a shield to be up when the orb meets it. */
  private async orb(from: Pt, to: Pt, color: number, trail: number, size: number, impact: () => void, near?: () => void) {
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
        if (near && t >= 0.85) { near(); near = undefined; }
      },
    });
    near?.();
    o.destroy(); core.destroy();
    impact();
  }

  /** Lightning is instant, so a shield (`first`) goes up before the strike lands on it. */
  private async bolt(to: Pt, first?: () => void) {
    first?.();
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

  /**
   * A green cloud just above the head, raining down onto it. Warded (#66), the cloud sits higher and
   * the rain stops on a dome at `stopY`, splashing off it.
   */
  private async cloud(head: Pt, stopY?: number, shield?: () => void) {
    const top = stopY === undefined ? head.y - 22 : stopY - 44;
    const puffs = Array.from({ length: 8 }, (_, i) => this.scene.add.image(head.x + (i - 3.5) * 15, top + (i % 2) * 9, 'fx_dot').setTint(0x4f9a3f).setScale(1.7).setAlpha(0).setDepth(DEPTH));
    await tween(this.scene, { targets: puffs, alpha: 0.75, duration: 200 });
    for (let i = 0; i < 16; i++) this.scene.time.delayedCall(i * 35, () => {
      const d = this.scene.add.image(head.x + (Math.random() - 0.5) * 80, top + 10, 'fx_dot').setTint(0x9be27f).setScale(0.18, 0.4).setDepth(DEPTH);
      if (stopY === undefined) { this.scene.tweens.add({ targets: d, y: head.y + 46, alpha: 0.2, duration: 360, ease: 'Quad.In', onComplete: () => d.destroy() }); return; }
      this.scene.tweens.add({ targets: d, y: stopY, duration: 200, ease: 'Quad.In', onComplete: () => { this.burst({ x: d.x, y: stopY }, 0x9be27f, 2, 18, 220, 0.14, -12); d.destroy(); } });
    });
    if (shield) this.scene.time.delayedCall(170, shield);
    await wait(this.scene, 520);
    void tween(this.scene, { targets: puffs, alpha: 0, y: top - 14, duration: 380 }).then(() => puffs.forEach((p) => p.destroy()));
  }

  /**
   * A curse (#62, #65): purple smoke gathers over the head into the shape of a skull, hangs there a
   * breath, and drifts apart. Made only of soft puffs, so it reads as a haunting, not a sticker.
   * Warded (#66), it forms higher, lunges down onto a dome at `stopY` and breaks apart against it.
   */
  private async skull(head: Pt, stopY?: number, shield?: () => void) {
    const k = 1.9, cx = head.x, cy = stopY === undefined ? head.y - 36 : stopY - 20 * k - 16;
    const pts = skullPoints(5);
    const glow = this.scene.add.image(cx, cy, 'fx_dot').setTint(0x7a3fbf).setScale(3.4).setAlpha(0).setDepth(DEPTH).setBlendMode(Phaser.BlendModes.ADD);
    this.scene.tweens.add({ targets: glow, alpha: 0.28, duration: 380, yoyo: true, hold: 260, onComplete: () => glow.destroy() });
    const puffs = pts.map((p) => {
      const a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 40;
      const shade = Math.random() < 0.5 ? 0xb07ae8 : 0x8a4fd0;
      const o = this.scene.add.image(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7 + 10, 'fx_dot').setTint(shade).setScale(0.22).setAlpha(0).setDepth(DEPTH + 1);
      // Soft, overlapping, a little off the grid: smoke, not a dot matrix.
      this.scene.tweens.add({ targets: o, x: cx + p.x * k + (Math.random() - 0.5) * 4, y: cy + p.y * k + (Math.random() - 0.5) * 4, alpha: 0.32 + Math.random() * 0.12, scale: 0.44 + Math.random() * 0.12, duration: 360 + Math.random() * 120, ease: 'Sine.Out' });
      return { o, p };
    });
    // A faint dark smudge in each socket, so the eyes read against a busy background.
    const eyes = [-8, 8].map((ex) => this.scene.add.image(cx + ex * k, cy - 6 * k, 'fx_dot').setTint(0x1a0626).setScale(0.6).setAlpha(0).setDepth(DEPTH + 2));
    this.scene.tweens.add({ targets: eyes, alpha: 0.75, duration: 300, delay: 200, yoyo: true, hold: 300, onComplete: () => eyes.forEach((e) => e.destroy()) });
    await wait(this.scene, 480);
    if (stopY !== undefined) {
      // It dives at the head, hits the dome, and the smoke is flung off to the sides.
      this.scene.tweens.killTweensOf(eyes); eyes.forEach((e) => e.destroy());
      await tween(this.scene, { targets: puffs.map((q) => q.o), y: '+=16', duration: 110, ease: 'Quad.In' });
      shield?.();
      for (const { o, p } of puffs) {
        const out = p.x === 0 ? (Math.random() - 0.5) * 2 : Math.sign(p.x);
        this.scene.tweens.add({
          targets: o, x: o.x + out * (30 + Math.random() * 40), y: o.y - 10 - Math.random() * 30 - (p.y + 26) * 0.3,
          alpha: 0, scale: o.scale * 1.6, duration: 380 + Math.random() * 160, ease: 'Quad.Out', onComplete: () => o.destroy(),
        });
      }
      return;
    }
    // It hangs a breath, rising a touch, then comes apart from the top down.
    for (const { o, p } of puffs) {
      this.scene.tweens.add({
        targets: o, y: o.y - 18 - Math.random() * 16 + (p.y + 26) * 0.1, x: o.x + p.x * 0.6 + (Math.random() - 0.5) * 18,
        alpha: 0, scale: o.scale * 1.8, duration: 520 + Math.random() * 200, delay: 140 + (p.y + 26) * 3, ease: 'Sine.In',
        onComplete: () => o.destroy(),
      });
    }
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
