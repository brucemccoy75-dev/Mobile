import Phaser from 'phaser';
import { fill, visibleOptions, defaultOption, type Dialogue, type DOption } from '@core/dialogue';
import { artKey } from '@game/art';
import { applyOption, canSkipDialogue, dialogueCtx, findDialogue, type DialogueResult } from '@game/dialogue';
import { getMeta, getSession, type RunSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, FONT, text } from '@game/ui/theme';

export interface DialogueData { first: Dialogue; vars: Record<string, string | number>; resolve: (r: DialogueResult) => void; }

/**
 * The speech box (DECISIONS #35): portrait, a few lines, two or three options. Launched over the
 * overworld and stopped when an option ends the exchange. Skip (once the screen has been beaten)
 * applies the default option of every box in the chain.
 */
export class DialogueScene extends Phaser.Scene {
  private session!: RunSession;
  private data_!: DialogueData;
  private made: Phaser.GameObjects.GameObject[] = [];
  private notes: string[] = [];
  private busy = false;

  constructor() { super('Dialogue'); }

  create(data: DialogueData) {
    this.data_ = data;
    this.session = getSession(this);
    this.made = [];
    this.notes = [];
    this.busy = false;
    const { width: W, height: H } = this.scale.gameSize;
    // A full-screen catcher so taps never reach the map underneath.
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.35).setInteractive();
    this.show(data.first);
  }

  private clear() { for (const o of this.made) o.destroy(); this.made = []; }

  private show(d: Dialogue) {
    this.clear();
    const { width: W, height: H } = this.scale.gameSize;
    const meta = getMeta(this);
    const ctx = dialogueCtx(this.session, meta);
    const boxH = 212, top = H - boxH - 14, left = 20, right = W - 20;
    const add = <T extends Phaser.GameObjects.GameObject>(o: T): T => { this.made.push(o); return o; };
    add(this.add.rectangle((left + right) / 2, top + boxH / 2, right - left, boxH, 0x0b0f1a, 0.96).setStrokeStyle(2, COLORS.goldHex));
    // portrait
    const px = left + 92, pBottom = top + boxH - 16;
    const key = d.portrait ? artKey(this, fill(d.portrait, this.data_.vars)) : null;
    if (key) {
      const src = this.textures.get(key).getSourceImage() as { height: number };
      add(this.add.image(px, pBottom, key).setOrigin(0.5, 1).setScale(Math.min(0.5, (boxH - 60) / src.height)));
    } else {
      add(this.add.rectangle(px, top + boxH / 2 + 6, 110, 140, 0x7a5c3a).setStrokeStyle(3, COLORS.goldHex));
      add(this.add.text(px, top + boxH / 2 + 6, d.speaker.charAt(0), { ...text.title, fontSize: '56px', color: COLORS.gold }).setOrigin(0.5));
    }
    add(this.add.text(px, top + 12, d.speaker, { fontFamily: FONT, fontSize: '13px', color: COLORS.gold, fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5, 0));
    // lines
    const optW = 300, textX = left + 184, textW = right - optW - 30 - textX;
    const body = d.lines.map((l) => fill(l, this.data_.vars)).join('\n\n');
    add(this.add.text(textX, top + 18, body, { ...text.body, fontSize: '16px', lineSpacing: 3, wordWrap: { width: textW } }).setOrigin(0, 0));
    // options
    const opts = visibleOptions(d, ctx);
    const oy0 = top + 22, oh = 46, gap = 8;
    opts.forEach((o, i) => {
      const b = new Button(this, right - 14 - optW / 2, oy0 + oh / 2 + i * (oh + gap), fill(o.text, this.data_.vars), () => this.choose(d, o), { width: optW, height: oh, fontSize: '14px', fill: i === 0 ? 0x1f2a44 : COLORS.panel, edge: i === 0 ? COLORS.goldHex : COLORS.panelEdge });
      b.label.setWordWrapWidth(optW - 20).setAlign('center');
      add(b);
    });
    if (canSkipDialogue(this.session, meta)) {
      add(new Button(this, right - 60, top - 20, 'Skip', () => this.skipAll(d), { width: 90, height: 30, fontSize: '12px' }).setAlpha(0.8));
    }
  }

  private choose(d: Dialogue, o: DOption) {
    if (this.busy) return;
    this.busy = true;
    const meta = getMeta(this);
    const a = applyOption(this.session, meta, o);
    this.notes.push(...a.notes);
    if (a.next) {
      const next = findDialogue(a.next, this.session, meta);
      if (next) { this.busy = false; this.show(next); return; }
    }
    this.finish({ fight: a.fight, skip: a.skip || (!a.fight && !a.next), notes: this.notes });
    void d;
  }

  /** Skip: take the default option of this box and every box it chains to. */
  private skipAll(d: Dialogue) {
    if (this.busy) return;
    this.busy = true;
    const meta = getMeta(this);
    let cur: Dialogue | null = d;
    let fight = false, skip = false;
    for (let guard = 0; cur && guard < 8; guard++) {
      const a = applyOption(this.session, meta, defaultOption(cur, dialogueCtx(this.session, meta)));
      this.notes.push(...a.notes);
      fight = fight || a.fight; skip = skip || a.skip;
      cur = a.next ? findDialogue(a.next, this.session, meta) : null;
    }
    this.finish({ fight, skip: skip || !fight, notes: this.notes });
  }

  private finish(r: DialogueResult) {
    const resolve = this.data_.resolve;
    this.scene.stop();
    resolve(r);
  }
}
