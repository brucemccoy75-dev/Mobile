import { describe, it, expect } from 'vitest';
import { getItem } from '@data/index';
import { computeStats, compareItems, emptyEquipment, equip } from './equipment';
import { equipmentFromIds, equipmentToIds } from './state';

const base = { maxHp: 25, atk: 4, def: 1 };

describe('equipment', () => {
  it('sums modifiers and floors stats', () => {
    const eq = { ...emptyEquipment(), relic: getItem('glass_idol'), body: getItem('plate_harness') };
    expect(computeStats(base, eq)).toEqual({ maxHp: 9, atk: 8, def: 5 });
    const harsh = { ...emptyEquipment(), relic: getItem('tortoise_charm') };
    expect(computeStats({ maxHp: 20, atk: 1, def: 0 }, harsh).atk).toBe(1);
  });

  it('equip adds gained max HP as real HP; lost max HP only lowers the ceiling', () => {
    const r1 = equip(base, emptyEquipment(), 20, getItem('heart_amulet'));
    expect(r1.hp).toBe(26); expect(r1.replaced).toBeNull();
    // amulet (+6) -> idol (-12): max drops by 18 but current HP is only clamped to the new max
    const r2 = equip(base, r1.equipment, 26, getItem('glass_idol'));
    expect(r2.hp).toBe(Math.min(26, computeStats(base, r2.equipment).maxHp)); expect(r2.replaced?.id).toBe('heart_amulet');
    const r3 = equip(base, emptyEquipment(), 10, getItem('glass_idol'));
    expect(r3.hp).toBe(10);
    const r4 = equip(base, emptyEquipment(), 2, getItem('glass_idol'));
    expect(r4.hp).toBe(Math.min(2, computeStats(base, r4.equipment).maxHp));
  });

  it('compare reports deltas', () => {
    const eq = { ...emptyEquipment(), weapon: getItem('rusty_sword') };
    const c = compareItems(base, eq, getItem('broad_axe'));
    expect(c.delta).toEqual({ maxHp: 0, atk: 1, def: -1 });
  });

  it('equipment ids round-trip', () => {
    const eq = { ...emptyEquipment(), weapon: getItem('iron_mace') };
    expect(equipmentFromIds(equipmentToIds(eq))).toEqual(eq);
  });
});
