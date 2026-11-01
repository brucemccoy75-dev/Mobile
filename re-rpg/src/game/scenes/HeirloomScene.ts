import Phaser from 'phaser';
import { describeSkill, familyOf } from '@data/index';
import { HEIRLOOM_PICKS } from '@core/meta';
import { applyHeirlooms, getMeta, getSession, persistRun, type RunSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, FONT, text } from '@game/ui/theme';
import { Card, CARD_H, CARD_W } from '@game/ui/Card';
import { menuBackdrop } from '@game/ui/menuBackdrop';
import { heirloomLesson } from '@game/tutorial';
import { around, boundsOf } from '@game/ui/TutorialOverlay';

/** Run start: a random spread of tomes from the class's unlocked families; keep two, their families fill the run (DECISIONS #32). */
export class HeirloomScene extends Phaser.Scene {
  private session!: RunSession;
  private picked = new Set<number>();
  private cards: { card: Card; glow: Phaser.GameObjects.Rectangle; label: Phaser.GameObjects.Text; x: number; y: number; scale: number }[] = [];
  private begin!: Button;
  private counter!: Phaser.GameObjects.Text;

  constructor() { super('Heirloom'); }

  create() {
    this.picked = new Set();
    this.cards = [];
    this.session = getSession(this);
    const choices = this.session.heirloomChoices;
    if (choices.length === 0) { this.scene.start('Overworld'); return; }

    const { width: W, height: H } = this.scale.gameSize;
    menuBackdrop(this);
    this.add.text(W / 2, 30, 'Heirlooms', text.h2).setOrigin(0.5);
    this.add.text(W / 2, 60, `Keep ${Math.min(HEIRLOOM_PICKS, choices.length)}. They start in your deck, and only their families drop this run.`, { ...text.small, fontSize: '14px', color: COLORS.gold }).setOrigin(0.5);

    // The real cards (DECISIONS #94), as big as the row allows; tap to keep, press and hold to read.
    const n = choices.length, gap = 22;
    const scale = Math.min(1.25, (W - 60 - (n - 1) * gap) / (n * CARD_W));
    const cw = CARD_W * scale, startX = W / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2, y = H / 2 + 6;
    choices.forEach((c, i) => {
      const x = startX + i * (cw + gap);
      if (c.kind !== 'tome') return; // heirlooms are tomes (core/meta rollHeirloomChoices)
      const fam = familyOf(this.session.classId, c.skill.id)?.name ?? 'skill';
      const glow = this.add.rectangle(x, y, cw + 14, CARD_H * scale + 14, COLORS.goldHex, 0).setStrokeStyle(4, COLORS.goldHex, 0);
      const label = this.add.text(x, y + (CARD_H * scale) / 2 + 14, fam.toUpperCase(), { fontFamily: FONT, fontSize: '13px', color: '#e6d9b0', fontStyle: 'bold', stroke: '#0b0f1a', strokeThickness: 3 }).setOrigin(0.5, 0);
      const card = new Card(this, x, y, c.skill, () => this.toggle(i), describeSkill(c.skill, this.session.stats), this.session.stats).setScale(scale);
      this.cards.push({ card, glow, label, x, y, scale });
    });

    this.counter = this.add.text(W / 2, H - 92, '', { ...text.small, stroke: '#0b0f1a', strokeThickness: 3 }).setOrigin(0.5);
    this.begin = new Button(this, W / 2, H - 46, 'Begin', () => this.finish(), { width: 200, fill: 0x1f2a44, edge: COLORS.goldHex });
    this.sync();
    // The first real run's heirloom screen explains itself, once (DECISIONS #96).
    void heirloomLesson(this, () => around(this.cards.map((c) => boundsOf(c.card))));
  }

  private toggle(i: number) {
    if (this.picked.has(i)) this.picked.delete(i);
    else if (this.picked.size < HEIRLOOM_PICKS) this.picked.add(i);
    this.sync();
  }

  private sync() {
    const need = Math.min(HEIRLOOM_PICKS, this.session.heirloomChoices.length);
    this.cards.forEach((v, i) => {
      const on = this.picked.has(i);
      // A kept card rises a little in a gold glow; once both are kept the others dim.
      v.glow.setFillStyle(COLORS.goldHex, on ? 0.18 : 0).setStrokeStyle(4, COLORS.goldHex, on ? 1 : 0);
      const dy = on ? -10 : 0;
      v.card.setPosition(v.x, v.y + dy); v.glow.setPosition(v.x, v.y + dy);
      v.card.setAlpha(!on && this.picked.size >= need ? 0.6 : 1);
      v.label.setColor(on ? '#ffd166' : '#e6d9b0').setText((on ? '✓ KEPT · ' : '') + v.label.text.replace('✓ KEPT · ', ''));
    });
    this.counter.setText(`${this.picked.size} of ${need} chosen`);
    this.begin.setEnabled(this.picked.size >= need);
  }

  private finish() {
    const picks = [...this.picked].sort().map((i) => this.session.heirloomChoices[i]!);
    applyHeirlooms(this.session, picks, getMeta(this));
    void persistRun(this).then(() => this.scene.start('Overworld'));
  }
}
