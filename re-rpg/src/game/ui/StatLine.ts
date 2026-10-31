import Phaser from 'phaser';
import type { Rating, Trend } from '@core/combat';
import { FONT } from './theme';

/** Green when a status helps, red when one hurts, gold when both (DECISIONS #77). */
export const TREND_COLOR: Record<Trend, string> = { up: '#6ee07a', down: '#ff6b6b', mixed: '#ffd166', even: '#c9d1e0' };
const ARROW: Record<Trend, string> = { up: ' ▲', down: ' ▼', mixed: ' ▲▼', even: '' };
const GAP = 12;

/** "ATK 4   DEF 1": each number takes its trend's colour and an arrow. Anchored left, right or centre. */
export class StatLine extends Phaser.GameObjects.Container {
  private readonly atk: Phaser.GameObjects.Text;
  private readonly def: Phaser.GameObjects.Text;
  private readonly align: 'left' | 'right' | 'center';

  constructor(scene: Phaser.Scene, x: number, y: number, align: 'left' | 'right' | 'center' = 'left') {
    super(scene, x, y);
    this.align = align;
    const style = { fontFamily: FONT, fontSize: '13px', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3 };
    this.atk = scene.add.text(0, 0, '', style).setOrigin(0, 0.5);
    this.def = scene.add.text(0, 0, '', style).setOrigin(0, 0.5);
    this.add([this.atk, this.def]);
    scene.add.existing(this);
  }

  /** Show the two ratings; returns the line's width so whatever follows it can sit beside it. */
  set(atk: Rating, def: Rating): number {
    this.atk.setText(`ATK ${atk.value}${ARROW[atk.trend]}`).setColor(TREND_COLOR[atk.trend]);
    this.def.setText(`DEF ${def.value}${ARROW[def.trend]}`).setColor(TREND_COLOR[def.trend]);
    const w = this.atk.width + GAP + this.def.width;
    const start = this.align === 'left' ? 0 : this.align === 'right' ? -w : -w / 2;
    this.atk.x = start;
    this.def.x = start + this.atk.width + GAP;
    return w;
  }
}
