import Phaser from 'phaser';
import type { Skill, Stats } from '@data/types';
import { cardFace, cardTheme, type CardKind, type CardPreview } from '@data/describe';
import { COLORS, FONT, RARITY_COLORS } from './theme';

/**
 * 25% wider than #85's 170 (DECISIONS #86): the hand has the room, and wider lines mean fewer of them
 * and bigger type. The frame (#85) takes only the margin.
 */
export const CARD_W = 212;
export const CARD_H = 126;
/** Where the frame's ornaments are: the top-centre piece and the corners. Text keeps clear of them. */
const TOP = 21, CORNER = 26;

/**
 * Colour family per card kind (DECISIONS #28): attack red, defence blue, heal green, magic orange.
 * On parchment (#86) the kind is a light tint of the paper and a dark ink for the big number;
 * `fill`/`edge` remain for the plain card drawn when the art is missing.
 */
export const CARD_COLORS: Record<CardKind, { fill: number; edge: number; accent: string; tint: number; ink: string }> = {
  attack: { fill: 0x4a1b20, edge: 0xd64545, accent: '#ff8a8a', tint: 0xffd6cc, ink: '#a3161a' },
  defense: { fill: 0x172a48, edge: 0x4f8fe8, accent: '#8fc1ff', tint: 0xd2e0ff, ink: '#1d4ed8' },
  heal: { fill: 0x173526, edge: 0x3fbf7a, accent: '#8ff0b8', tint: 0xd4f2d6, ink: '#15803d' },
  magic: { fill: 0x47290f, edge: 0xe08a2e, accent: '#ffc46b', tint: 0xffe4bf, ink: '#b45309' },
};
/** Ink on parchment (#86): dark brown, the colour of the words. */
const INK = '#2b1d0e';

/** A skill card in the hand. Tap to play. */
export class Card extends Phaser.GameObjects.Container {
  readonly bg: Phaser.GameObjects.Rectangle;
  readonly skillId: string;

  /** `preview` (combat only) makes the headline the number the chosen target will take; see cardFace. */
  constructor(scene: Phaser.Scene, x: number, y: number, skill: Skill, onTap: () => void, text: string = skill.text, stats: Stats = { maxHp: 1, atk: 1, def: 0 }, preview?: CardPreview) {
    super(scene, x, y);
    this.skillId = skill.id;
    const face = cardFace(skill, stats, preview);
    const c = CARD_COLORS[face.kind];
    // Parchment tinted by kind (#86) under a frame by theme (#85). Without the art, the old dark card.
    const paper = scene.textures.exists('card_parchment');
    const frameKey = `frame_${cardTheme(skill, face.kind)}`;
    const framed = paper && scene.textures.exists(frameKey);
    this.bg = scene.add.rectangle(0, 0, CARD_W - 4, CARD_H - 4, c.fill);
    if (!framed) this.bg.setStrokeStyle(2, c.edge);
    const sheet = paper ? scene.add.image(0, 0, 'card_parchment').setDisplaySize(CARD_W - 6, CARD_H - 6).setTint(c.tint) : null;
    const frame = framed ? scene.add.image(0, 0, frameKey).setDisplaySize(CARD_W, CARD_H) : null;
    const ink = paper ? INK : '#e4e8f0', numberInk = paper ? c.ink : c.accent;
    // Dark cards need an outline on the words; parchment does not.
    const outline = paper ? {} : { stroke: '#0b0f1a', strokeThickness: 3 };

    // The use tag (ONCE, FLEETING, CURSED) straddles the card's top edge on the left (#86): off the
    // face and the ornaments, and low enough to stay clear of the enemy's ATK / DEF line above the hand.
    const tagText = skill.pool === 'cursed' ? 'CURSED' : skill.uses === 'fleeting' ? 'FLEETING' : skill.uses ? 'ONCE' : '';
    const tag = tagText ? scene.add.text(-CARD_W / 2 + CORNER + 6, -CARD_H / 2 + 1, tagText, { fontFamily: FONT, fontSize: '10px', color: skill.pool === 'cursed' ? '#ffffff' : '#0b0f1a', fontStyle: 'bold', backgroundColor: skill.pool === 'cursed' ? '#c1121f' : skill.uses === 'fleeting' ? '#c084fc' : '#e0c060', padding: { x: 6, y: 2 } }).setOrigin(0, 0.5) : null;

    const name = scene.add.text(0, -CARD_H / 2 + TOP, skill.name, { fontFamily: FONT, fontSize: '16px', color: paper ? rarityInk(skill) : rarityText(skill), fontStyle: 'bold', wordWrap: { width: CARD_W - 2 * CORNER - 8 }, align: 'center', ...outline }).setOrigin(0.5, 0);
    // A long name steps down rather than taking a second line from the text.
    for (const size of [15, 14, 13]) if (name.height > 24) name.setFontSize(size);
    const body = scene.add.text(0, -CARD_H / 2 + TOP + name.height + 1, text, { fontFamily: FONT, fontSize: '12px', color: ink, wordWrap: { width: CARD_W - 36 }, align: 'center', lineSpacing: -1, ...outline, ...(paper ? {} : { strokeThickness: 2 }) }).setOrigin(0.5, 0);
    // Long text (a branching card, #69) steps down a size rather than running into the number.
    const room = CARD_H - (TOP + name.height + 1) - 40;
    for (const size of [11, 10, 9]) if (body.height > room) body.setFontSize(size);
    const value = scene.add.text(-CARD_W / 2 + CORNER + 2, CARD_H / 2 - 8, face.value, { fontFamily: FONT, fontSize: '32px', color: numberInk, fontStyle: 'bold', ...outline }).setOrigin(0, 1);
    // The unit may carry the reasons the number moved ("damage · armour, hardened"); the reasons go on
    // their own line above the unit.
    const [unitWord, why] = face.unit.split(' · ');
    const ux = -CARD_W / 2 + CORNER + 7 + value.width, wrap = CARD_W - 2 * CORNER - 10 - value.width;
    const unit = scene.add.text(ux, CARD_H / 2 - 13, unitWord ?? '', { fontFamily: FONT, fontSize: '12px', color: numberInk, fontStyle: 'bold', wordWrap: { width: wrap }, ...outline, ...(paper ? {} : { strokeThickness: 2 }) }).setOrigin(0, 1);
    this.add([this.bg, ...(sheet ? [sheet] : []), ...(frame ? [frame] : []), name, body, value, unit]);
    if (tag) this.add(tag);
    if (why) this.add(scene.add.text(ux, CARD_H / 2 - 13 - unit.height + 1, why, { fontFamily: FONT, fontSize: '11px', color: paper ? INK : '#ffffff', fontStyle: 'bold', wordWrap: { width: wrap }, lineSpacing: -2, ...outline, ...(paper ? {} : { strokeThickness: 2 }) }).setOrigin(0, 1));
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

/** Rarity in the name, as ink on parchment (#86): the rarity colours are already dark; a basic card is plain ink. */
function rarityInk(skill: Skill): string {
  if (skill.rarity === 'basic') return INK;
  return '#' + RARITY_COLORS[skill.rarity].toString(16).padStart(6, '0');
}
