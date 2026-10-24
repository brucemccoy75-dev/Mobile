import Phaser from 'phaser';
import { CLASSES, getSet } from '@data/index';
import type { ClassId } from '@data/types';
import { Button } from '@game/ui/Button';
import { CLASS_COLORS, COLORS, text } from '@game/ui/theme';
import { createSession, setSession } from '@game/session';

export class ClassSelectScene extends Phaser.Scene {
  private selected: ClassId | null = null;
  private panels = new Map<ClassId, Phaser.GameObjects.Rectangle>();
  private setLabel!: Phaser.GameObjects.Text;
  private begin!: Button;
  private devTomes = true;

  constructor() { super('ClassSelect'); }

  create() {
    const { width, height } = this.scale.gameSize;
    this.add.text(width / 2, 34, 'Choose your class', text.h2).setOrigin(0.5);

    const panelW = Math.min(260, (width - 80) / 3 - 16);
    const gap = 16;
    const totalW = panelW * 3 + gap * 2;
    const startX = width / 2 - totalW / 2 + panelW / 2;

    CLASSES.forEach((cls, i) => {
      const x = startX + i * (panelW + gap);
      const y = height / 2 - 20;
      const bg = this.add.rectangle(x, y, panelW, 250, COLORS.panel).setStrokeStyle(3, COLORS.panelEdge);
      this.panels.set(cls.id, bg);
      this.add.rectangle(x, y - 80, 56, 72, CLASS_COLORS[cls.id] ?? COLORS.player);
      this.add.text(x, y - 30, cls.name, text.h2).setOrigin(0.5);
      this.add.text(x, y + 4, `HP ${cls.stats.maxHp}   ATK ${cls.stats.atk}   DEF ${cls.stats.def}`, text.body).setOrigin(0.5);
      const sets = cls.sets.map((id) => getSet(id).name).join('  ·  ');
      this.add.text(x, y + 36, 'sets', text.small).setOrigin(0.5);
      this.add.text(x, y + 58, sets, { ...text.body, fontSize: '14px', color: COLORS.gold }).setOrigin(0.5);
      this.add.text(x, y + 96, 'starts with Attack + Defend', text.small).setOrigin(0.5);

      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerup', () => this.select(cls.id));
    });

    this.setLabel = this.add.text(width / 2, height - 96, 'tap a class', text.small).setOrigin(0.5);

    this.begin = new Button(this, width / 2, height - 46, 'Begin', () => this.start(), { width: 200, fill: 0x1f2a44, edge: COLORS.goldHex, disabled: true });

    const dev = new Button(this, width - 110, height - 46, 'dev: tomes ON', () => {
      this.devTomes = !this.devTomes;
      dev.label.setText(`dev: tomes ${this.devTomes ? 'ON' : 'OFF'}`);
    }, { width: 180, height: 40, fontSize: '14px' });

    new Button(this, 70, height - 46, 'Back', () => this.scene.start('Title'), { width: 110, height: 40, fontSize: '14px' });
  }

  private select(id: ClassId) {
    this.selected = id;
    for (const [cid, bg] of this.panels) bg.setStrokeStyle(3, cid === id ? COLORS.goldHex : COLORS.panelEdge);
    this.setLabel.setText('your set is rolled when the run begins');
    this.begin.setEnabled(true);
  }

  private start() {
    if (!this.selected) return;
    const session = createSession(this.selected, this.devTomes);
    setSession(this, session);
    this.cameras.main.fadeOut(200, 11, 15, 26);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Combat'));
  }
}
