import Phaser from 'phaser';
import type { Skill } from '@data/types';
import { COLORS, FONT, RARITY_COLORS } from './theme';

export const CARD_W = 140;
export const CARD_H = 100;

/** A skill card in the hand. Tap to play. */
export class Card extends Phaser.GameObjects.Container {
  readonly bg: Phaser.GameObjects.Rectangle;
  readonly skillId: string;

  constructor(scene: Phaser.Scene, x: number, y: number, skill: Skill, onTap: () => void) {
    super(scene, x, y);
    this.skillId = skill.id;
    this.bg = scene.add.rectangle(0, 0, CARD_W, CARD_H, RARITY_COLORS[skill.rarity]).setStrokeStyle(2, COLORS.panelEdge);
    const name = scene.add.text(0, -CARD_H / 2 + 14, skill.name, { fontFamily: FONT, fontSize: '15px', color: COLORS.text, fontStyle: 'bold', wordWrap: { width: CARD_W - 12 }, align: 'center' }).setOrigin(0.5, 0);
    const body = scene.add.text(0, 10, skill.text, { fontFamily: FONT, fontSize: '12px', color: '#d7dbe6', wordWrap: { width: CARD_W - 16 }, align: 'center' }).setOrigin(0.5);
    this.add([this.bg, name, body]);
    this.setSize(CARD_W, CARD_H);
    scene.add.existing(this);

    this.bg.setInteractive({ useHandCursor: true });
    this.bg.on('pointerdown', () => this.setScale(0.96));
    this.bg.on('pointerout', () => this.setScale(1));
    this.bg.on('pointerup', () => { this.setScale(1); onTap(); });
  }

  setEnabled(on: boolean): this {
    this.setAlpha(on ? 1 : 0.55);
    if (on) this.bg.setInteractive(); else this.bg.disableInteractive();
    return this;
  }
}
