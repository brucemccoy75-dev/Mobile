import type Phaser from 'phaser';
import { describeSkill, getSkill } from '@data/index';
import type { Item, Skill, SkillId } from '@data/types';
import { compareItems } from '@core/run';
import type { RunSession } from '@game/session';
import { Button } from './Button';
import { COLORS, RARITY_COLORS, text } from './theme';

/** Modal panels shared by the reward and shop scenes. Each returns a close() that destroys everything it made. */

type Made = Phaser.GameObjects.GameObject[];

function base(scene: Phaser.Scene, w: number, h: number, made: Made) {
  const { width: W, height: H } = scene.scale.gameSize;
  made.push(scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7).setDepth(50).setInteractive());
  made.push(scene.add.rectangle(W / 2, H / 2, w, h, COLORS.panel).setStrokeStyle(2, COLORS.goldHex).setDepth(51));
  const t = (x: number, y: number, s: string, st: Phaser.Types.GameObjects.Text.TextStyle = text.body) => { const o = scene.add.text(x, y, s, st).setOrigin(0.5).setDepth(52); made.push(o); return o; };
  return { W, H, t };
}

/** Compare the equipped item with `next`; Equip calls onEquip. */
export function openComparePanel(scene: Phaser.Scene, session: RunSession, next: Item, onEquip: () => void): { close: () => void } {
  const made: Made = [];
  const close = () => { for (const o of made) o.destroy(); made.length = 0; };
  const { W, H, t } = base(scene, 560, 300, made);
  const cur = session.equipment[next.slot]!;
  const c = compareItems(session.base, session.equipment, next);
  t(W / 2, H / 2 - 120, `Replace ${cur.name} with ${next.name}?`, text.h2);
  t(W / 2 - 150, H / 2 - 70, cur.name, { ...text.body, color: COLORS.muted });
  t(W / 2 - 150, H / 2 - 46, cur.text, text.small);
  t(W / 2 + 150, H / 2 - 70, next.name, { ...text.body, color: COLORS.gold });
  t(W / 2 + 150, H / 2 - 46, next.text, text.small);
  const d = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  const col = (n: number) => (n > 0 ? COLORS.heal : n < 0 ? '#ff6b6b' : COLORS.muted);
  const rows: [string, number, number, number][] = [['max HP', c.before.maxHp, c.after.maxHp, c.delta.maxHp], ['ATK', c.before.atk, c.after.atk, c.delta.atk], ['DEF', c.before.def, c.after.def, c.delta.def]];
  rows.forEach(([label, b, a, dl], i) => {
    const y = H / 2 + i * 26;
    t(W / 2 - 150, y, `${label} ${b}`, text.body);
    t(W / 2, y, '→', text.small);
    t(W / 2 + 150, y, `${label} ${a}  (${d(dl)})`, { ...text.body, color: col(dl) });
  });
  t(W / 2, H / 2 + 86, 'Binding: the old item is gone for this run.', text.small);
  made.push(new Button(scene, W / 2 - 100, H / 2 + 124, 'Equip', () => { close(); onEquip(); }, { width: 160, height: 44, fill: 0x1f2a44, edge: COLORS.goldHex }).setDepth(52));
  made.push(new Button(scene, W / 2 + 100, H / 2 + 124, 'Back', close, { width: 160, height: 44 }).setDepth(52));
  return { close };
}

/** Deck is full: choose which card `skill` replaces; onSwap receives the replaced id. */
export function openSwapPanel(scene: Phaser.Scene, session: RunSession, skill: Skill, onSwap: (replaceId: SkillId) => void): { close: () => void } {
  const made: Made = [];
  const close = () => { for (const o of made) o.destroy(); made.length = 0; };
  const { W, H, t } = base(scene, 720, 330, made);
  t(W / 2, H / 2 - 135, `Deck full. Replace which card with ${skill.name}?`, text.h2);
  t(W / 2, H / 2 - 105, describeSkill(skill, session.stats), text.small);
  const ids = session.deck;
  const cw = 108, gap = 8;
  const startX = W / 2 - ((ids.length * cw + (ids.length - 1) * gap) / 2) + cw / 2;
  ids.forEach((id, i) => {
    const sk = getSkill(id);
    const b = new Button(scene, startX + i * (cw + gap), H / 2 - 30, sk.name, () => { close(); onSwap(id); }, { width: cw, height: 70, fontSize: '13px', fill: RARITY_COLORS[sk.rarity] });
    b.label.setWordWrapWidth(cw - 10).setAlign('center');
    made.push(b.setDepth(52));
  });
  made.push(new Button(scene, W / 2, H / 2 + 110, 'Back', close, { width: 160, height: 44 }).setDepth(52));
  return { close };
}
