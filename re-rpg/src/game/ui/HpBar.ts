import Phaser from 'phaser';
import { COLORS, FONT } from './theme';
import { tween } from './tween';

export class HpBar extends Phaser.GameObjects.Container {
  private fill: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private readonly barWidth: number;
  private maxHp: number;
  private cur: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, name: string, max: number, alignRight = false) {
    super(scene, x, y);
    this.barWidth = width; this.maxHp = max; this.cur = max;
    const back = scene.add.rectangle(0, 0, width, 16, COLORS.hpBack).setOrigin(alignRight ? 1 : 0, 0.5);
    this.fill = scene.add.rectangle(0, 0, width, 16, COLORS.hp).setOrigin(alignRight ? 1 : 0, 0.5);
    const nameT = scene.add.text(alignRight ? 0 : 0, -14, name, { fontFamily: FONT, fontSize: '15px', color: COLORS.text, fontStyle: 'bold' }).setOrigin(alignRight ? 1 : 0, 1);
    this.label = scene.add.text(alignRight ? -width : width, -14, `${max}/${max}`, { fontFamily: FONT, fontSize: '13px', color: COLORS.muted }).setOrigin(alignRight ? 0 : 1, 1);
    this.add([back, this.fill, nameT, this.label]);
    scene.add.existing(this);
  }

  async set(hp: number, max = this.maxHp): Promise<void> {
    this.maxHp = max;
    this.cur = Math.max(0, hp);
    const ratio = this.maxHp > 0 ? this.cur / this.maxHp : 0;
    this.label.setText(`${this.cur}/${this.maxHp}`);
    this.fill.setFillStyle(ratio <= 0.3 ? COLORS.hpLow : COLORS.hp);
    await tween(this.scene, { targets: this.fill, displayWidth: Math.max(0, this.barWidth * ratio), duration: 220, ease: 'Quad.Out' });
  }
}
