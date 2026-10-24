import Phaser from 'phaser';
import { getItem, getSkill } from '@data/index';
import type { ShopLine } from '@core/loot';
import { DECK_CAP } from '@core/combat';
import { getMeta, getSession, persistMeta, persistRun, takeChoice, type RunSession } from '@game/session';
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
    this.statusText.setText(`HP ${s.hp}/${s.stats.maxHp}  ATK ${s.stats.atk}  DEF ${s.stats.def}   ·   deck ${s.deck.length}/${DECK_CAP}   ·   ${eq}`);

    const entries: { line: ShopLine | null; label: string; title: string; body: string; price: number; sold: boolean; rarity: keyof typeof RARITY_COLORS }[] = st.lines.map((line) => line.kind === 'item'
      ? { line, label: `${getItem(line.id).slot.toUpperCase()} · ${getItem(line.id).rarity}`, title: getItem(line.id).name, body: getItem(line.id).text, price: line.price, sold: line.sold, rarity: getItem(line.id).rarity }
      : { line, label: 'TOME', title: getSkill(line.id).name, body: getSkill(line.id).text, price: line.price, sold: line.sold, rarity: getSkill(line.id).rarity });
    entries.push({ line: null, label: 'SERVICE', title: 'Mend wounds', body: `Heal ${Math.round(st.healPct * 100)}% of max HP. Once per shop.`, price: st.healPrice, sold: st.healUsed, rarity: 'uncommon' });

    const n = entries.length, cw = 220, ch = 180, gap = 16;
    const startX = W / 2 - ((n * cw + (n - 1) * gap) / 2) + cw / 2;
    entries.forEach((e, i) => {
      const x = startX + i * (cw + gap), y = H / 2 - 10;
      const affordable = s.gold >= e.price && !e.sold;
      const bg = this.add.rectangle(x, y, cw, ch, COLORS.panel).setStrokeStyle(3, RARITY_COLORS[e.rarity]).setAlpha(e.sold ? 0.35 : affordable ? 1 : 0.6);
      const mk = (o: Phaser.GameObjects.GameObject) => { this.cards.push(o); return o; };
      mk(bg);
      mk(this.add.text(x, y - ch / 2 + 16, e.label, { fontFamily: FONT, fontSize: '12px', color: '#9aa3b8', fontStyle: 'bold' }).setOrigin(0.5));
      mk(this.add.text(x, y - ch / 2 + 46, e.title, { ...text.h2, fontSize: '19px', wordWrap: { width: cw - 20 }, align: 'center' }).setOrigin(0.5));
      mk(this.add.text(x, y + 2, e.body, { ...text.body, fontSize: '13px', wordWrap: { width: cw - 24 }, align: 'center' }).setOrigin(0.5));
      mk(this.add.text(x, y + ch / 2 - 18, e.sold ? 'sold' : `${e.price} gold`, { ...text.body, fontSize: '15px', color: affordable ? COLORS.gold : COLORS.muted, fontStyle: 'bold' }).setOrigin(0.5));
      if (affordable) { bg.setInteractive({ useHandCursor: true }); bg.on('pointerup', () => this.buy(e.line)); }
    });
  }

  private buy(line: ShopLine | null) {
    if (this.busy) return;
    const s = this.session;
    if (!line) {
      s.gold -= s.shop.healPrice; s.shop.healUsed = true;
      s.hp = Math.min(s.stats.maxHp, s.hp + Math.round(s.stats.maxHp * s.shop.healPct));
      void persistRun(this); this.render(); return;
    }
    const commit = async (replaceId?: string) => {
      this.busy = true;
      s.gold -= line.price; line.sold = true;
      takeChoice(s, getMeta(this), line.kind === 'item' ? { kind: 'item', item: getItem(line.id) } : { kind: 'tome', skill: getSkill(line.id) }, replaceId);
      await Promise.all([persistMeta(this), persistRun(this)]);
      this.busy = false; this.render();
    };
    if (line.kind === 'item' && s.equipment[getItem(line.id).slot]) return void openComparePanel(this, s, getItem(line.id), () => void commit());
    if (line.kind === 'tome' && s.deck.length >= DECK_CAP) return void openSwapPanel(this, s, getSkill(line.id), (id) => void commit(id));
    void commit();
  }
}
