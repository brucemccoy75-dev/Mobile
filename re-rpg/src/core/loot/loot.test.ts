import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { getItem } from '@data/index';
import { createMeta } from '@core/meta';
import { emptyEquipment } from '@core/run/equipment';
import { buildPool, rollOffer, rarityWeights, type PoolContext } from './index';

const ctx = (over: Partial<PoolContext> = {}): PoolContext => ({ classId: 'warrior', setId: 'warrior_tank', meta: createMeta(), deck: [], equipment: emptyEquipment(), ...over });

describe('buildPool', () => {
  it('fresh warrior: tomes are exactly the rolled set, items are class-usable', () => {
    const p = buildPool(ctx());
    expect(p.tomes.map((t) => t.id).sort()).toEqual(['bind_wound', 'shield_bash']);
    expect(p.items.every((i) => !i.classes || i.classes.includes('warrior'))).toBe(true);
    expect(p.items.some((i) => i.id === 'oak_wand')).toBe(false);
  });

  it('held tomes and items leave the pool (no duplicate drops)', () => {
    const p = buildPool(ctx({ deck: ['shield_bash'], equipment: { ...emptyEquipment(), relic: getItem('bloodstone') } }));
    expect(p.tomes.map((t) => t.id)).toEqual(['bind_wound']);
    expect(p.items.some((i) => i.id === 'bloodstone')).toBe(false);
  });

  it('discovered skills of the other set join the pool', () => {
    const meta = createMeta(); meta.discoveredSkills.push('broadsword', 'fireball');
    const p = buildPool(ctx({ meta }));
    expect(p.tomes.map((t) => t.id).sort()).toEqual(['bind_wound', 'broadsword', 'shield_bash']); // fireball is wizard-only
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
    const o = rollOffer('kill', 0, ctx({ deck: ['shield_bash', 'bind_wound'] }), rng);
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
