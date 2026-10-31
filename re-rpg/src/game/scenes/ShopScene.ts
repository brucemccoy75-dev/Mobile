import Phaser from 'phaser';
import { describeSkill, getItem, getSkill } from '@data/index';
import { isLineOwned, type ShopLine } from '@core/loot';
import { DECK_CAP } from '@core/combat';
import { recordShop } from '@game/telemetry';
import { MIN_CARDS, cardsLocked, getMeta, getSession, persistMeta, persistRun, sellCard, sellableCards, takeChoice, type RunSession } from '@game/session';
import { Button } from '@game/ui/Button';
import { openComparePanel, openSwapPanel } from '@game/ui/panels';
import { COLORS, FONT, RARITY_COLORS, text } from '@game/ui/theme';

/** The gold sink: two items, maybe a tome, one expensive heal. Stock is per screen. */
export class ShopScene extends Phaser.Scene {
  private session!: RunSession;
  private goldText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private cards: Phaser.GameObjects.GameObject[] = [];
  private busy = false;

  constructor() { super('Shop'); }

  create() {
    this.busy = false;
    this.cards = [];
    this.session = getSession(this);
    const { width: W, height: H } = this.scale.gameSize;
    this.cameras.main.setBackgroundColor(0x0b0f1a);
    this.add.text(W / 2, 30, 'Shop', text.h2).setOrigin(0.5);
    this.goldText = this.add.text(W / 2, 60, '', { ...text.small, fontSize: '14px', color: COLORS.gold }).setOrigin(0.5);
    this.statusText = this.add.text(W / 2, H - 92, '', text.small).setOrigin(0.5);
    new Button(this, W / 2, H - 46, 'Leave', () => void persistRun(this).then(() => this.scene.start('Overworld')), { width: 160, height: 44, fontSize: '15px' });
    this.render();
  }

  private render() {
    for (const c of this.cards) c.destroy();
    this.cards = [];
    const s = this.session, st = s.shop;
    const { width: W, height: H } = this.scale.gameSize;
    this.goldText.setText(`${s.gold} gold`);
    const eq = (['body', 'weapon', 'relic'] as const).map((k) => `${k}: ${s.equipment[k]?.name ?? '—'}`).join('   ');
    this.statusText.setText(`HP ${s.hp}/${s.stats.maxHp}  ATK ${s.stats.atk}  DEF ${s.stats.def}  LUCK ${s.stats.luck ?? 0}   ·   deck ${s.deck.length}/${DECK_CAP}   ·   ${eq}`);

    const entries: { line: ShopLine | null; label: string; title: string; body: string; price: number; sold: boolean; owned?: boolean; lockedOut?: boolean; rarity: keyof typeof RARITY_COLORS; action?: () => void; status?: string }[] = st.lines.map((line) => {
      const owned = !line.sold && isLineOwned(line, s.deck, s.equipment);
      // Stock is rolled when the screen opens; a card that locks (DECISIONS #73) can arrive later, so the shelf checks now.
      const lockedOut = line.kind === 'tome' && !line.sold && cardsLocked(s);
      return line.kind === 'item'
        ? { line, label: `${getItem(line.id).slot.toUpperCase()} · ${getItem(line.id).rarity}`, title: getItem(line.id).name, body: getItem(line.id).text, price: line.price, sold: line.sold || owned, owned, rarity: getItem(line.id).rarity }
        : { line, label: 'TOME', title: getSkill(line.id).name, body: describeSkill(getSkill(line.id), s.stats), price: line.price, sold: line.sold || owned || lockedOut, owned, lockedOut, rarity: getSkill(line.id).rarity };
    });
    entries.push({ line: null, label: 'SERVICE', title: 'Mend wounds', body: `Heal ${Math.round(st.healPct * 100)}% of max HP. Once per shop.`, price: st.healPrice, sold: st.healUsed, rarity: 'uncommon' });
    // Selling (DECISIONS #81): any one card, deck or starting, once per shop.
    const sellable = sellableCards(s);
    const tooFew = !st.cardSold && sellable.length === 0;
    entries.push({ line: null, label: 'SERVICE', title: 'Sell a card', body: 'Any one card you hold, starting cards too. Once per shop.', price: 0, sold: !!st.cardSold || tooFew, rarity: 'common', action: () => this.openSell(), status: st.cardSold ? 'sold one' : tooFew ? `keep ${MIN_CARDS} cards` : 'for gold' });

    const n = entries.length, gap = 16, cw = Math.min(220, Math.floor((W - 32 - (n - 1) * gap) / n)), ch = 180;
    const startX = W / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
    entries.forEach((e, i) => {
      const x = startX + i * (cw + gap), y = H / 2 - 10;
      const affordable = (e.action ? true : s.gold >= e.price) && !e.sold;
      const bg = this.add.rectangle(x, y, cw, ch, COLORS.panel).setStrokeStyle(3, RARITY_COLORS[e.rarity]).setAlpha(e.sold ? 0.35 : affordable ? 1 : 0.6);
      const mk = (o: Phaser.GameObjects.GameObject) => { this.cards.push(o); return o; };
      mk(bg);
      mk(this.add.text(x, y - ch / 2 + 16, e.label, { fontFamily: FONT, fontSize: '12px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0.5));
      mk(this.add.text(x, y - ch / 2 + 46, e.title, { ...text.h2, fontSize: '19px', wordWrap: { width: cw - 20 }, align: 'center' }).setOrigin(0.5));
      mk(this.add.text(x, y + 2, e.body, { ...text.body, fontSize: '13px', wordWrap: { width: cw - 24 }, align: 'center' }).setOrigin(0.5));
      mk(this.add.text(x, y + ch / 2 - 18, e.status ?? (e.lockedOut ? 'cursed: no new cards' : e.owned ? 'already yours' : e.sold ? 'sold' : `${e.price} gold`), { ...text.body, fontSize: '15px', color: affordable ? COLORS.gold : COLORS.muted, fontStyle: 'bold' }).setOrigin(0.5));
      if (affordable) { bg.setInteractive({ useHandCursor: true }); bg.on('pointerup', () => (e.action ? e.action() : this.buy(e.line))); }
    });
  }

  /** The sell list (DECISIONS #81): every card held, with what it fetches. One tap sells it. */
  private openSell() {
    if (this.busy) return;
    const s = this.session;
    const { width: W, height: H } = this.scale.gameSize;
    const parts: Phaser.GameObjects.GameObject[] = [];
    const close = () => parts.forEach((p) => p.destroy());
    parts.push(this.add.rectangle(W / 2, H / 2, W, H, 0x0b0f1a, 0.95).setInteractive().setDepth(100));
    parts.push(this.add.text(W / 2, 34, 'Sell which card?', text.h2).setOrigin(0.5).setDepth(101));
    parts.push(this.add.text(W / 2, 62, 'One per shop. A starting card sold is gone for the rest of the run.', { ...text.small, color: COLORS.muted }).setOrigin(0.5).setDepth(101));
    const cards = sellableCards(s);
    const cols = Math.min(4, Math.max(1, Math.floor((W - 40) / 230))), bw = Math.min(220, Math.floor((W - 40 - (cols - 1) * 12) / cols)), bh = 46;
    const x0 = W / 2 - ((cols * bw + (cols - 1) * 12) / 2) + bw / 2;
    cards.forEach((c, i) => {
      const x = x0 + (i % cols) * (bw + 12), y = 100 + Math.floor(i / cols) * (bh + 10);
      const sk = getSkill(c.id);
      const b = new Button(this, x, y, `${sk.name}${c.from === 'basic' ? ' (start)' : ''} · ${c.value} g`, () => {
        close();
        sellCard(s, c.id, c.from);
        recordShop(this, s, `sell:${c.id}`, -c.value);
        void persistRun(this); this.render();
      }, { width: bw, height: bh, fontSize: '13px', edge: RARITY_COLORS[sk.rarity] }).setDepth(101);
      parts.push(b);
    });
    parts.push(new Button(this, W / 2, H - 40, 'Keep my cards', close, { width: 180, height: 40, fontSize: '14px' }).setDepth(101));
  }

  private buy(line: ShopLine | null) {
    if (this.busy) return;
    const s = this.session;
    if (!line) {
      recordShop(this, s, 'heal', s.shop.healPrice);
      s.gold -= s.shop.healPrice; s.shop.healUsed = true;
      s.hp = Math.min(s.stats.maxHp, s.hp + Math.round(s.stats.maxHp * s.shop.healPct));
      void persistRun(this); this.render(); return;
    }
    const commit = async (replaceId?: string) => {
      this.busy = true;
      s.gold -= line.price; line.sold = true;
      recordShop(this, s, line.id, line.price);
      takeChoice(s, getMeta(this), line.kind === 'item' ? { kind: 'item', item: getItem(line.id) } : { kind: 'tome', skill: getSkill(line.id) }, replaceId);
      await Promise.all([persistMeta(this), persistRun(this)]);
      this.busy = false; this.render();
    };
    if (line.kind === 'item' && s.equipment[getItem(line.id).slot]) return void openComparePanel(this, s, getItem(line.id), () => void commit());
    if (line.kind === 'tome' && s.deck.length >= DECK_CAP) return void openSwapPanel(this, s, getSkill(line.id), (id) => void commit(id));
    void commit();
  }
}
