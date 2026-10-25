import Phaser from 'phaser';
import { getSet } from '@data/index';
import { HEIRLOOM_PICKS, type Heirloom } from '@core/meta';
import { applyHeirlooms, getSession, persistRun, type RunSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { COLORS, FONT, RARITY_COLORS, text } from '@game/ui/theme';

/** Run start after a death: a spread of unlocked tomes and items, keep up to two. */
export class HeirloomScene extends Phaser.Scene {
  private session!: RunSession;
  private picked = new Set<number>();
  private frames: Phaser.GameObjects.Rectangle[] = [];
  private begin!: Button;
  private counter!: Phaser.GameObjects.Text;

  constructor() { super('Heirloom'); }

  create() {
    this.picked = new Set();
    this.frames = [];
    this.session = getSession(this);
    const choices = this.session.heirloomChoices;
    if (choices.length === 0) { this.scene.start('Overworld'); return; }

    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.add.text(W / 2, 30, 'Heirlooms', text.h2).setOrigin(0.5);
    this.add.text(W / 2, 60, `Your past runs left these behind. Keep up to ${Math.min(HEIRLOOM_PICKS, choices.length)}.`, { ...text.small, fontSize: '14px', color: COLORS.gold }).setOrigin(0.5);

    const n = choices.length, cw = Math.min(240, (W - 80) / n - 16), ch = 180, gap = 16;
    const startX = W / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
    choices.forEach((c, i) => this.drawChoice(c, i, startX + i * (cw + gap), H / 2 - 10, cw, ch));

    this.counter = this.add.text(W / 2, H - 92, '', text.small).setOrigin(0.5);
    this.begin = new Button(this, W / 2, H - 46, 'Begin', () => this.finish(), { width: 200, fill: 0x1f2a44, edge: COLORS.goldHex });
    this.sync();
  }

  private drawChoice(c: Heirloom, i: number, x: number, y: number, w: number, h: number) {
    const rarity = c.kind === 'tome' ? c.skill.rarity : c.item.rarity;
    const bg = this.add.rectangle(x, y, w, h, COLORS.panel).setStrokeStyle(3, RARITY_COLORS[rarity]);
    this.frames.push(bg);
    const tag = c.kind === 'tome' ? `TOME · ${c.skill.setId ? getSet(c.skill.setId).name : 'skill'}` : `${c.item.slot.toUpperCase()} · ${rarity}`;
    this.add.text(x, y - h / 2 + 16, tag, { fontFamily: FONT, fontSize: '12px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(x, y - h / 2 + 46, c.kind === 'tome' ? c.skill.name : c.item.name, { ...text.h2, fontSize: '19px', wordWrap: { width: w - 20 }, align: 'center' }).setOrigin(0.5);
    this.add.text(x, y + 4, c.kind === 'tome' ? c.skill.text : c.item.text, { ...text.body, fontSize: '13px', wordWrap: { width: w - 24 }, align: 'center' }).setOrigin(0.5);
    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerup', () => {
      if (this.picked.has(i)) this.picked.delete(i);
      else if (this.picked.size < HEIRLOOM_PICKS) this.picked.add(i);
      this.sync();
    });
  }

  private sync() {
    this.frames.forEach((f, i) => f.setStrokeStyle(this.picked.has(i) ? 4 : 3, this.picked.has(i) ? COLORS.goldHex : RARITY_COLORS[(this.session.heirloomChoices[i]!.kind === 'tome' ? this.session.heirloomChoices[i]!.skill.rarity : this.session.heirloomChoices[i]!.item.rarity)]).setFillStyle(this.picked.has(i) ? 0x1f2a44 : COLORS.panel));
    this.counter.setText(`${this.picked.size} of ${Math.min(HEIRLOOM_PICKS, this.session.heirloomChoices.length)} chosen${this.picked.size === 0 ? '  ·  or begin with nothing' : ''}`);
  }

  private finish() {
    const picks = [...this.picked].sort().map((i) => this.session.heirloomChoices[i]!);
    applyHeirlooms(this.session, picks);
    void persistRun(this).then(() => this.scene.start('Overworld'));
  }
}
