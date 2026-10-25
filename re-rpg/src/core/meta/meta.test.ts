import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { createMeta, discoverItem, discoverSkill, mergeMeta, recordDeath, rollHeirloomChoices } from './index';

describe('meta', () => {
  it('discovery is idempotent', () => {
    const m = createMeta();
    expect(discoverSkill(m, 'fireball')).toBe(true);
    expect(discoverSkill(m, 'fireball')).toBe(false);
    expect(discoverItem(m, 'bloodstone')).toBe(true);
    expect(m.discoveredSkills).toEqual(['fireball']);
  });

  it('heirloom choices are locked until the first death and need discoveries', () => {
    const m = createMeta();
    discoverSkill(m, 'fireball');
    expect(rollHeirloomChoices(m, 'wizard', 'wizard_fire', new Rng(1))).toEqual([]);
    recordDeath(m, 0);
    const h = rollHeirloomChoices(m, 'wizard', 'wizard_fire', new Rng(1));
    expect(h).toHaveLength(1);
    expect(h[0]).toMatchObject({ kind: 'tome', skill: { id: 'fireball' } });
    expect(rollHeirloomChoices(m, 'warrior', 'warrior_tank', new Rng(1))).toEqual([]); // fireball is not usable by a warrior
  });

  it('offers up to 4 distinct choices, favouring the active set', () => {
    const m = createMeta(); m.deaths = 1;
    ['fireball', 'inferno', 'frost_bolt', 'ice_armor'].forEach((id) => discoverSkill(m, id));
    ['oak_wand', 'heart_amulet', 'bloodstone', 'ember_staff', 'rime_staff'].forEach((id) => discoverItem(m, id));
    let firstIsFire = 0;
    const rng = new Rng(5);
    for (let i = 0; i < 2000; i++) {
      const h = rollHeirloomChoices(m, 'wizard', 'wizard_fire', rng);
      expect(h).toHaveLength(4);
      const ids = h.map((x) => (x.kind === 'tome' ? x.skill.id : x.item.id));
      expect(new Set(ids).size).toBe(4);
      const f = h[0]!;
      if ((f.kind === 'tome' && f.skill.setId === 'wizard_fire') || (f.kind === 'item' && f.item.tags?.includes('wizard_fire'))) firstIsFire++;
    }
    // 3 fire-tagged of 9 entries at double weight: 6/12 = 50% of first picks
    expect(firstIsFire / 2000).toBeGreaterThan(0.42);
    expect(firstIsFire / 2000).toBeLessThan(0.58);
  });

  it('merge unions discoveries and maxes counters', () => {
    const a = createMeta(); a.deaths = 3; discoverSkill(a, 'x');
    const b = createMeta(); b.deaths = 1; b.wins = 2; discoverSkill(b, 'y'); discoverItem(b, 'i');
    const m = mergeMeta(a, b);
    expect(m.deaths).toBe(3); expect(m.wins).toBe(2);
    expect(m.discoveredSkills.sort()).toEqual(['x', 'y']);
    expect(m.discoveredItems).toEqual(['i']);
  });
});
