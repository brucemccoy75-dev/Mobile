import Phaser from 'phaser';
import { describeSkill, familyOf } from '@data/index';
import type { SkillId } from '@data/types';
import { cursedOffer, goldFor, rollOffer, sellValue, type Offer, type RewardChoice } from '@core/loot';
import type { PendingOffer } from '@game/session';
import { DECK_CAP } from '@core/combat';
import { getMeta, getSession, persistMeta, persistRun, takeChoice, type RunSession } from '@game/session';
import { recordReward } from '@game/telemetry';
import { discoverItem, discoverSkill } from '@core/meta';
import { Button } from '@game/ui/Button';
import { openComparePanel, openSwapPanel } from '@game/ui/panels';
import { COLORS, FONT, RARITY_COLORS, text } from '@game/ui/theme';
import { tween, wait } from '@game/ui/tween';

const TITLES = { kill: 'Spoils', guard: 'Spoils', chest: 'Chest', boss: 'Boss hoard', cursed: 'Cursed spoils' } as const;

/**
 * Pick 1 of N (DECISIONS #4). Items with an occupied slot open a compare panel;
 * tomes at the deck cap open a swap panel. Skip is always allowed.
 */
const choiceId = (c: RewardChoice) => (c.kind === 'tome' ? c.skill.id : c.item.id);

export class RewardScene extends Phaser.Scene {
  private session!: RunSession;
  private offer!: Offer;
  private done = false;
  /** What follows this offer: the cursed pool after a cursed win's spoils (DECISIONS #73). */
  private next: PendingOffer | null = null;

  constructor() { super('Reward'); }

  create() {
    this.done = false;
    this.session = getSession(this);
    const pending = this.session.pendingOffer;
    if (!pending) { this.scene.start('Overworld'); return; }
    this.session.pendingOffer = null;
    this.next = pending.then ?? null;
    const meta = getMeta(this);
    const ctx = { classId: this.session.classId, families: this.session.families, meta, deck: this.session.deck, equipment: this.session.equipment };
    const rng = this.session.rng.stream('loot');
    if (pending.source === 'cursed') {
      this.offer = cursedOffer(ctx);
      // Nothing to offer (the pool is empty, or a card you hold locks the rest): straight on.
      if (!this.offer.choices.length) { this.finish(); return; }
    } else {
      // A cursed win pays its gold three times over (DECISIONS #73).
      const gold = pending.gold ?? (pending.goldMult ? goldFor(pending.source, this.session.screenIndex, rng) * pending.goldMult : undefined);
      this.offer = rollOffer(pending.source, this.session.screenIndex, ctx, rng, gold);
    }
    this.session.gold += this.offer.gold;

    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.add.text(W / 2, 30, TITLES[this.offer.source], text.h2).setOrigin(0.5);
    this.add.text(W / 2, 60, this.offer.gold > 0 ? `+${this.offer.gold} gold  ·  choose one` : 'choose one', { ...text.small, fontSize: '14px', color: COLORS.gold }).setOrigin(0.5);

    const n = this.offer.choices.length;
    const cw = 250, ch = 170, gap = 20;
    const startX = W / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
    this.offer.choices.forEach((c, i) => this.drawChoice(c, startX + i * (cw + gap), H / 2 - 10, cw, ch));

    this.add.text(W / 2, H - 78, this.statusLine(), text.small).setOrigin(0.5);
    new Button(this, W / 2, H - 40, 'Take nothing', () => this.finish(), { width: 160, height: 40, fontSize: '14px' });
  }

  private statusLine() {
    const s = this.session;
    const eq = (['body', 'weapon', 'relic'] as const).map((k) => `${k}: ${s.equipment[k]?.name ?? '—'}`).join('   ');
    return `HP ${s.hp}/${s.stats.maxHp}  ATK ${s.stats.atk}  DEF ${s.stats.def}  LUCK ${s.stats.luck ?? 0}   ·   deck ${s.deck.length}/${DECK_CAP}   ·   ${eq}`;
  }

  private drawChoice(c: RewardChoice, x: number, y: number, w: number, h: number) {
    const rarity = c.kind === 'tome' ? c.skill.rarity : c.item.rarity;
    const bg = this.add.rectangle(x, y, w, h, COLORS.panel).setStrokeStyle(3, RARITY_COLORS[rarity]);
    const tag = c.kind === 'tome' ? (c.skill.pool === 'cursed' ? 'CURSED TOME' : `TOME · ${familyOf(this.session.classId, c.skill.id)?.name ?? 'skill'}`) : `${c.item.slot.toUpperCase()} · ${rarity}`;
    this.add.text(x, y - h / 2 + 16, tag, { fontFamily: FONT, fontSize: '12px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0.5);
    const name = c.kind === 'tome' ? c.skill.name : c.item.name;
    this.add.text(x, y - h / 2 + 46, name, { ...text.h2, fontSize: '21px', wordWrap: { width: w - 20 }, align: 'center' }).setOrigin(0.5);
    const body = c.kind === 'tome' ? describeSkill(c.skill, this.session.stats) : c.item.text;
    this.add.text(x, y + 4, body, { ...text.body, fontSize: '14px', wordWrap: { width: w - 28 }, align: 'center' }).setOrigin(0.5);
    const footer = c.kind === 'item'
      ? (this.session.equipment[c.item.slot] ? `replaces ${this.session.equipment[c.item.slot]!.name}` : 'empty slot')
      : (this.session.deck.length >= DECK_CAP ? 'deck full: swap a card' : `deck ${this.session.deck.length + 1}/${DECK_CAP}`);
    this.add.text(x, y + h / 2 - 18, footer, text.small).setOrigin(0.5);
    const isNew = c.kind === 'tome' ? !getMeta(this).discoveredSkills.includes(c.skill.id) : !getMeta(this).discoveredItems.includes(c.item.id);
    if (isNew) this.add.text(x + w / 2 - 8, y - h / 2 + 8, 'NEW', { fontFamily: FONT, fontSize: '11px', color: COLORS.gold, fontStyle: 'bold' }).setOrigin(1, 0);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerup', () => this.pick(c));
    // Sell instead: gold now, and it still counts as discovered.
    const value = sellValue(rarity, this.session.screenIndex);
    new Button(this, x, y + h / 2 + 24, `Sell · ${value} g`, () => this.sell(c, value), { width: w - 40, height: 32, fontSize: '13px', fill: 0x2a2416, edge: 0x8a6a2b });
  }

  private async sell(c: RewardChoice, value: number) {
    if (this.done) return;
    this.done = true;
    const meta = getMeta(this);
    const isNew = c.kind === 'tome' ? discoverSkill(meta, c.skill.id) : discoverItem(meta, c.item.id);
    if (isNew) this.session.newDiscoveries.push(c.kind === 'tome' ? c.skill.id : c.item.id);
    this.session.gold += value;
    recordReward(this, this.session, { source: this.offer.source, offered: this.offer.choices.map(choiceId), sold: choiceId(c), gold: this.offer.gold + value });
    await Promise.all([persistMeta(this), persistRun(this)]);
    const { width: W, height: H } = this.scale.gameSize;
    const name = c.kind === 'tome' ? c.skill.name : c.item.name;
    const banner = this.add.text(W / 2, H / 2, `${isNew ? 'NEW DISCOVERY  ·  ' : ''}sold ${name} for ${value} gold`, { ...text.h2, color: COLORS.gold, backgroundColor: '#000000cc', padding: { x: 16, y: 10 } }).setOrigin(0.5).setDepth(60).setAlpha(0);
    await tween(this, { targets: banner, alpha: 1, duration: 150 });
    await wait(this, isNew ? 1100 : 700);
    this.finish();
  }

  private pick(c: RewardChoice) {
    if (this.done) return;
    if (c.kind === 'item' && this.session.equipment[c.item.slot]) return void openComparePanel(this, this.session, c.item, () => void this.take(c));
    if (c.kind === 'tome' && this.session.deck.length >= DECK_CAP) return void openSwapPanel(this, this.session, c.skill, (id) => void this.take(c, id));
    void this.take(c);
  }

  private async take(c: RewardChoice, replaceId?: SkillId) {
    this.done = true;
    const meta = getMeta(this);
    const { isNew, replaced } = takeChoice(this.session, meta, c, replaceId);
    recordReward(this, this.session, { source: this.offer.source, offered: this.offer.choices.map(choiceId), picked: choiceId(c), replaced: replaced?.id, gold: this.offer.gold });
    await Promise.all([persistMeta(this), persistRun(this)]);
    const { width: W, height: H } = this.scale.gameSize;
    const name = c.kind === 'tome' ? c.skill.name : c.item.name;
    const msg = `${isNew ? 'NEW DISCOVERY  ·  ' : ''}${name}${replaced ? `  (replaced ${replaced.name})` : ''}`;
    const banner = this.add.text(W / 2, H / 2, msg, { ...text.h2, color: isNew ? COLORS.gold : COLORS.text, backgroundColor: '#000000cc', padding: { x: 16, y: 10 } }).setOrigin(0.5).setDepth(60).setAlpha(0);
    await tween(this, { targets: banner, alpha: 1, duration: 150 });
    await wait(this, isNew ? 1100 : 700);
    this.finish();
  }

  private finish() {
    this.done = true;
    // A chained offer (the cursed pool after a cursed win's spoils) comes next, on its own screen.
    if (this.next) { this.session.pendingOffer = this.next; this.next = null; void persistRun(this).then(() => this.scene.restart()); return; }
    void persistRun(this).then(() => this.scene.start('Overworld'));
  }
}
