import Phaser from 'phaser';
import { COLORS, FONT } from '@game/ui/theme';

export type Rect = { x: number; y: number; w: number; h: number };

export interface LessonView {
  line: string;
  /** Screen-space area left lit and tappable; read every frame, so it can follow the camera. None = a plain note. */
  target?: () => Rect | null;
  /** Wait for this instead of a "Got it" tap (the player does what the lesson points at). */
  until?: Promise<unknown>;
  /** Shows "Skip tutorial"; called when it is tapped. */
  onSkip?: () => void;
  /** The button's words when there is no `until`. */
  ok?: string;
}

/** Above the scenes' panels and prompts; below a card held up to read (depth 300, #87), so a hold lesson shows the card. */
export const LESSON_DEPTH = 250;
const VEIL = 0x05070d, VEIL_ALPHA = 0.62, PAD = 8;

/** The union of several rects, padded. */
export function around(rects: (Rect | null | undefined)[], pad = PAD): Rect | null {
  const rs = rects.filter((r): r is Rect => !!r && r.w > 0 && r.h > 0);
  if (!rs.length) return null;
  const x0 = Math.min(...rs.map((r) => r.x)) - pad, y0 = Math.min(...rs.map((r) => r.y)) - pad;
  const x1 = Math.max(...rs.map((r) => r.x + r.w)) + pad, y1 = Math.max(...rs.map((r) => r.y + r.h)) + pad;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}
/** A game object's on-screen rect (its bounds; screen-fixed objects only). */
export const boundsOf = (o: { getBounds: () => Phaser.Geom.Rectangle } | null | undefined): Rect | null => {
  if (!o) return null;
  const b = o.getBounds();
  return { x: b.x, y: b.y, w: b.width, h: b.height };
};

/**
 * A lesson over the screen (DECISIONS #96): everything is dimmed and blocked except the target,
 * which is outlined in gold; the line sits in a box on the side away from it. Resolves when the
 * player taps "Got it", when `until` settles, or with 'skip' when they skip the tutorial.
 */
export function showLesson(scene: Phaser.Scene, v: LessonView): Promise<'ok' | 'skip'> {
  const { width: W, height: H } = scene.scale.gameSize;
  const parts: Phaser.GameObjects.GameObject[] = [];
  const add = <T extends Phaser.GameObjects.GameObject>(o: T): T => {
    (o as unknown as Phaser.GameObjects.Components.ScrollFactor).setScrollFactor?.(0);
    (o as unknown as Phaser.GameObjects.Components.Depth).setDepth?.(LESSON_DEPTH);
    parts.push(o);
    return o;
  };
  // Four veil pieces around the hole (one when there is no target); each swallows taps.
  const veil = [0, 1, 2, 3].map(() => add(scene.add.rectangle(0, 0, 1, 1, VEIL, VEIL_ALPHA).setOrigin(0).setInteractive()));
  // A "Got it" lesson shows its target but keeps it from being tapped; only a lesson that waits lets the tap through.
  const cover = add(scene.add.rectangle(0, 0, 1, 1, 0x000000, 0.001).setOrigin(0).setInteractive());
  const ring = add(scene.add.graphics());
  const boxW = Math.min(560, W - 32);
  const box = add(scene.add.rectangle(0, 0, boxW, 10, COLORS.panel, 0.97).setStrokeStyle(2, COLORS.goldHex).setOrigin(0.5, 0).setInteractive());
  const label = add(scene.add.text(0, 0, v.line, { fontFamily: FONT, fontSize: '16px', color: COLORS.text, wordWrap: { width: boxW - 28 }, lineSpacing: 3 }).setOrigin(0.5, 0));
  const buttons: { bg: Phaser.GameObjects.Rectangle; t: Phaser.GameObjects.Text }[] = [];
  const button = (str: string, w: number, h: number, size: string, fill: number, edge: number, on: () => void) => {
    const bg = add(scene.add.rectangle(0, 0, w, h, fill, 1).setStrokeStyle(2, edge).setInteractive({ useHandCursor: true }));
    const t = add(scene.add.text(0, 0, str, { fontFamily: FONT, fontSize: size, color: COLORS.text, fontStyle: 'bold' }).setOrigin(0.5));
    bg.on('pointerup', on);
    buttons.push({ bg, t });
    return { bg, t };
  };

  return new Promise((resolve) => {
    let done = false;
    const close = (r: 'ok' | 'skip') => {
      if (done) return;
      done = true;
      scene.events.off('update', layout);
      scene.events.off('shutdown', shut);
      for (const p of parts) p.destroy();
      resolve(r);
    };
    const shut = () => close('skip');
    const ok = !v.until ? button(v.ok ?? 'Got it', 130, 40, '16px', 0x1f2a44, COLORS.goldHex, () => close('ok')) : null;
    const skip = v.onSkip ? button('Skip tutorial', 120, 30, '12px', COLORS.panel, COLORS.panelEdge, () => { close('skip'); v.onSkip!(); }) : null;
    if (skip) { skip.bg.setAlpha(0.85); skip.t.setColor(COLORS.muted); }
    void v.until?.then(() => close('ok'));

    const textH = () => label.height;
    function layout() {
      if (done) return;
      const hole = v.target?.() ?? null;
      const [top, left, right, bottom] = veil as [Phaser.GameObjects.Rectangle, Phaser.GameObjects.Rectangle, Phaser.GameObjects.Rectangle, Phaser.GameObjects.Rectangle];
      ring.clear();
      if (!hole) {
        top.setPosition(0, 0).setSize(W, H); top.input!.hitArea.setTo(0, 0, W, H);
        for (const r of [left, right, bottom, cover]) r.setVisible(false).disableInteractive();
      } else {
        const x0 = Math.max(0, hole.x), y0 = Math.max(0, hole.y), x1 = Math.min(W, hole.x + hole.w), y1 = Math.min(H, hole.y + hole.h);
        const set = (r: Phaser.GameObjects.Rectangle, x: number, y: number, w: number, h: number) => { r.setPosition(x, y).setSize(Math.max(1, w), Math.max(1, h)); r.input?.hitArea.setTo(0, 0, Math.max(1, w), Math.max(1, h)); };
        set(top, 0, 0, W, y0);
        set(bottom, 0, y1, W, H - y1);
        set(left, 0, y0, x0, y1 - y0);
        set(right, x1, y0, W - x1, y1 - y0);
        if (v.until) cover.setVisible(false).disableInteractive();
        else set(cover, x0, y0, x1 - x0, y1 - y0);
        const pulse = 0.65 + 0.35 * Math.sin(scene.time.now / 220);
        ring.lineStyle(3, COLORS.goldHex, pulse).strokeRoundedRect(x0, y0, x1 - x0, y1 - y0, 10);
      }
      // The box goes on the side of the screen away from the target.
      const btnRow = ok || skip ? 50 : 0;
      const boxH = 16 + textH() + btnRow + 12;
      const holeMid = hole ? hole.y + hole.h / 2 : H;
      const by = holeMid > H / 2 ? Math.max(8, Math.min((hole?.y ?? H) - boxH - 12, 14)) : Math.min(H - boxH - 8, Math.max(hole!.y + hole!.h + 12, H - boxH - 14));
      box.setPosition(W / 2, by).setSize(boxW, boxH);
      box.input?.hitArea.setTo(0, 0, boxW, boxH);
      label.setPosition(W / 2, by + 14);
      const rowY = by + 16 + textH() + 30;
      if (ok) { ok.bg.setPosition(W / 2 + boxW / 2 - 85, rowY); ok.t.setPosition(ok.bg.x, rowY); }
      if (skip) { skip.bg.setPosition(W / 2 - boxW / 2 + 74, rowY); skip.t.setPosition(skip.bg.x, rowY); }
    }
    layout();
    scene.events.on('update', layout);
    scene.events.once('shutdown', shut);
  });
}
