import Phaser from 'phaser';
import type { Skill, Stats } from '@data/types';
import { cardFace, type CardKind } from '@data/describe';
import { COLORS, FONT, RARITY_COLORS } from './theme';

export const CARD_W = 150;
export const CARD_H = 112;

/** Colour family per card kind (DECISIONS #28): attack red, defence blue, heal green, magic orange. */
export const CARD_COLORS: Record<CardKind, { fill: number; edge: number; accent: string }> = {
  attack: { fill: 0x4a1b20, edge: 0xd64545, accent: '#ff8a8a' },
  defense: { fill: 0x172a48, edge: 0x4f8fe8, accent: '#8fc1ff' },
  heal: { fill: 0x173526, edge: 0x3fbf7a, accent: '#8ff0b8' },
  magic: { fill: 0x47290f, edge: 0xe08a2e, accent: '#ffc46b' },
};

/** A skill card in the hand. Tap to play. */
export class Card extends Phaser.GameObjects.Container {
  readonly bg: Phaser.GameObjects.Rectangle;
  readonly skillId: string;

  constructor(scene: Phaser.Scene, x: number, y: number, skill: Skill, onTap: () => void, text: string = skill.text, stats: Stats = { maxHp: 1, atk: 1, def: 0 }) {
    super(scene, x, y);
    this.skillId = skill.id;
    const face = cardFace(skill, stats);
    const c = CARD_COLORS[face.kind];
    this.bg = scene.add.rectangle(0, 0, CARD_W, CARD_H, c.fill).setStrokeStyle(2, c.edge);
    // Name in the rarity colour, body text under it, the headline number big in the bottom-left corner.
    const name = scene.add.text(0, -CARD_H / 2 + 7, skill.name, { fontFamily: FONT, fontSize: '14px', color: rarityText(skill), fontStyle: 'bold', wordWrap: { width: CARD_W - 16 }, align: 'center' }).setOrigin(0.5, 0);
    const body = scene.add.text(0, -CARD_H / 2 + 7 + name.height + 3, text, { fontFamily: FONT, fontSize: '10px', color: '#d7dbe6', wordWrap: { width: CARD_W - 14 }, align: 'center' }).setOrigin(0.5, 0);
    const value = scene.add.text(-CARD_W / 2 + 10, CARD_H / 2 - 6, face.value, { fontFamily: FONT, fontSize: '30px', color: c.accent, fontStyle: 'bold' }).setOrigin(0, 1);
    const unit = scene.add.text(-CARD_W / 2 + 12 + value.width + 4, CARD_H / 2 - 10, face.unit, { fontFamily: FONT, fontSize: '10px', color: c.accent }).setOrigin(0, 1);
    this.add([this.bg, name, body, value, unit]);
    // Use limits ride the bottom-right corner so they are never missed.
    if (skill.uses) {
      const fleeting = skill.uses === 'fleeting';
      const tag = scene.add.text(CARD_W / 2 - 6, CARD_H / 2 - 6, fleeting ? 'FLEETING' : 'ONCE', { fontFamily: FONT, fontSize: '9px', color: '#0b0f1a', fontStyle: 'bold', backgroundColor: fleeting ? '#c084fc' : '#e0c060', padding: { x: 5, y: 2 } }).setOrigin(1, 1);
      this.add(tag);
    }
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

/** Rarity shows in the name colour now that the card body carries the kind colour. */
function rarityText(skill: Skill): string {
  const hex = RARITY_COLORS[skill.rarity];
  if (skill.rarity === 'basic') return COLORS.text;
  return '#' + Math.min(0xffffff, hex + 0x606060).toString(16).padStart(6, '0');
}
