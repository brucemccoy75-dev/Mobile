import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { getItem } from '@data/index';
import { createMeta } from '@core/meta';
import { emptyEquipment } from '@core/run/equipment';
import { SELL_RATE, buildPool, itemPrice, rollOffer, rarityWeights, sellValue, type PoolContext } from './index';

const ctx = (over: Partial<PoolContext> = {}): PoolContext => ({ classId: 'warrior', families: ['warrior_tank'], meta: createMeta(), deck: [], equipment: emptyEquipment(), ...over });

describe('buildPool', () => {
  it('tomes are exactly the families\' cards, general tomes included; no family, no tomes; items are class-usable', () => {
    const p = buildPool(ctx());
    expect(p.tomes.map((t) => t.id).sort()).toEqual(['bind_wound', 'final_stand', 'shield_bash', 'stand_firm', 'warding_blast']);
    expect(buildPool(ctx({ families: ['warrior_dps'] })).tomes.map((t) => t.id).sort()).toEqual(['broadsword', 'exposing_strike', 'last_strike', 'mighty_blow']);
    expect(buildPool(ctx({ families: [] })).tomes).toEqual([]);
    expect(p.items.every((i) => !i.classes || i.classes.includes('warrior'))).toBe(true);
    expect(p.items.some((i) => i.id === 'oak_wand')).toBe(false);
  });

  it('equipped items leave the pool; tomes may drop again up to two copies', () => {
    const p = buildPool(ctx({ deck: ['shield_bash'], equipment: { ...emptyEquipment(), relic: getItem('bloodstone') } }));
    expect(p.tomes.filter((t) => t.classId !== 'any').map((t) => t.id).sort()).toEqual(['bind_wound', 'shield_bash']);
    expect(p.items.some((i) => i.id === 'bloodstone')).toBe(false);
    const capped = buildPool(ctx({ deck: ['shield_bash', 'shield_bash'] }));
    expect(capped.tomes.filter((t) => t.classId !== 'any').map((t) => t.id)).toEqual(['bind_wound']);
  });

  it('the run families decide the tomes; discovery no longer does (DECISIONS #32)', () => {
    const meta = createMeta(); meta.discoveredSkills.push('broadsword', 'fireball');
    expect(buildPool(ctx({ meta })).tomes.filter((t) => t.classId !== 'any').map((t) => t.id).sort()).toEqual(['bind_wound', 'shield_bash']);
    const both = buildPool(ctx({ meta, families: ['warrior_tank', 'warrior_dps'] }));
    expect(both.tomes.filter((t) => t.classId !== 'any').map((t) => t.id).sort()).toEqual(['bind_wound', 'broadsword', 'exposing_strike', 'shield_bash']);
  });

  it('never offers basics', () => {
    const meta = createMeta(); meta.discoveredSkills.push('attack');
    expect(buildPool(ctx({ meta })).tomes.some((t) => t.id === 'attack')).toBe(false);
  });
});

describe('rollOffer', () => {
  it('kills offer 2, chests and bosses 3, with no duplicate choices', () => {
    const rng = new Rng(1);
    for (const [src, n] of [['kill', 2], ['guard', 2], ['chest', 3], ['boss', 3]] as const) {
      for (let i = 0; i < 50; i++) {
        const o = rollOffer(src, 0, ctx(), rng);
        expect(o.choices).toHaveLength(n);
        const ids = o.choices.map((c) => (c.kind === 'tome' ? c.skill.id : c.item.id));
        expect(new Set(ids).size).toBe(ids.length);
      }
    }
  });

  it('falls back to items only when the tome pool is dry', () => {
    const rng = new Rng(2);
    const meta = createMeta();
    // a wizard with a warrior set has no usable set tomes; holding two of every special leaves nothing
    const deck = ['mighty_blow', 'mighty_blow', 'stand_firm', 'stand_firm', 'last_strike', 'last_strike', 'final_stand', 'final_stand', 'warding_blast', 'warding_blast'];
    const o = rollOffer('kill', 0, ctx({ meta, families: ['warrior_tank'], classId: 'wizard' as never, deck }), rng);
    expect(o.choices.every((c) => c.kind === 'item')).toBe(true);
  });

  it('kills almost never roll rare; bosses never roll common', () => {
    const rng = new Rng(3);
    let killRare = 0, bossCommon = 0, total = 0;
    for (let i = 0; i < 400; i++) {
      for (const c of rollOffer('kill', 0, ctx(), rng).choices) if (c.kind === 'item') { total++; if (c.item.rarity === 'rare') killRare++; }
      for (const c of rollOffer('boss', 0, ctx(), rng).choices) if (c.kind === 'item' && c.item.rarity === 'common') bossCommon++;
    }
    expect(killRare / total).toBeLessThan(0.12);
    expect(bossCommon).toBe(0);
  });

  it('set-tagged items appear roughly twice as often as untagged peers', () => {
    const rng = new Rng(4);
    let tank = 0, dps = 0;
    for (let i = 0; i < 3000; i++) for (const c of rollOffer('chest', 0, ctx(), rng).choices) {
      if (c.kind !== 'item') continue;
      if (c.item.id === 'tower_shield') tank++;  // uncommon, tagged warrior_tank (active)
      if (c.item.id === 'broad_axe') dps++;      // uncommon, tagged warrior_dps
    }
    expect(tank / dps).toBeGreaterThan(1.5);
    expect(tank / dps).toBeLessThan(2.6);
  });

  it('screen 2 shifts weights toward rare', () => {
    expect(rarityWeights('kill', 1).rare).toBeGreaterThan(rarityWeights('kill', 0).rare);
    expect(rarityWeights('kill', 1).common).toBeLessThan(rarityWeights('kill', 0).common);
  });

  it('is deterministic per rng state', () => {
    const a = rollOffer('chest', 0, ctx(), new Rng(9));
    const b = rollOffer('chest', 0, ctx(), new Rng(9));
    expect(a).toEqual(b);
  });
});

describe('isLineOwned', () => {
  it('flags tomes in the deck and equipped items', async () => {
    const { isLineOwned } = await import('./index');
    const eq = { ...emptyEquipment(), weapon: getItem('iron_mace') };
    expect(isLineOwned({ kind: 'tome', id: 'broadsword', price: 1, sold: false }, ['broadsword'], eq)).toBe(false); // a second copy is allowed
    expect(isLineOwned({ kind: 'tome', id: 'broadsword', price: 1, sold: false }, ['broadsword', 'broadsword'], eq)).toBe(true); // at the cap
    expect(isLineOwned({ kind: 'tome', id: 'broadsword', price: 1, sold: false }, [], eq)).toBe(false);
    expect(isLineOwned({ kind: 'item', id: 'iron_mace', price: 1, sold: false }, [], eq)).toBe(true);
    expect(isLineOwned({ kind: 'item', id: 'broad_axe', price: 1, sold: false }, [], eq)).toBe(false);
  });
});

describe('rollShopStock', () => {
  it('stocks two distinct items, a tome when available, and a heal', async () => {
    const { rollShopStock } = await import('./index');
    const st = rollShopStock(0, ctx(), new Rng(7));
    const items = st.lines.filter((l) => l.kind === 'item');
    expect(items).toHaveLength(2);
    expect(new Set(items.map((l) => l.id)).size).toBe(2);
    expect(st.lines.filter((l) => l.kind === 'tome')).toHaveLength(1);
    expect(st.healPrice).toBe(30);
    expect(st.lines.every((l) => l.price > 0 && !l.sold)).toBe(true);
    const dry = rollShopStock(1, ctx({ classId: 'wizard' as never, families: ['warrior_tank'], deck: ['mighty_blow', 'mighty_blow', 'stand_firm', 'stand_firm', 'last_strike', 'last_strike', 'final_stand', 'final_stand', 'warding_blast', 'warding_blast'] }), new Rng(7));
    expect(dry.lines.some((l) => l.kind === 'tome')).toBe(false);
    expect(dry.healPrice).toBe(60);
    expect(dry.lines.every((l) => l.price >= 40)).toBe(true);
  });

  it('selling pays a quarter of the shop price', () => {
    expect(SELL_RATE).toBe(0.25);
    expect(sellValue('common', 0)).toBe(Math.round(itemPrice('common', 0) * 0.25));
    expect(sellValue('rare', 1)).toBe(Math.round(itemPrice('rare', 0) * 0.25) * 2);
  });
});
