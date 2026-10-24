import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { createMeta, discoverItem, discoverSkill, mergeMeta, recordDeath, rollHeirloom } from './index';

describe('meta', () => {
  it('discovery is idempotent', () => {
    const m = createMeta();
    expect(discoverSkill(m, 'fireball')).toBe(true);
    expect(discoverSkill(m, 'fireball')).toBe(false);
    expect(discoverItem(m, 'bloodstone')).toBe(true);
    expect(m.discoveredSkills).toEqual(['fireball']);
  });

  it('heirloom is locked until the second death and needs a discovery', () => {
    const m = createMeta();
    discoverSkill(m, 'fireball');
    expect(rollHeirloom(m, 'wizard', 'wizard_fire', new Rng(1))).toBeNull();
    recordDeath(m, 0); recordDeath(m, 0);
    const h = rollHeirloom(m, 'wizard', 'wizard_fire', new Rng(1));
    expect(h).toMatchObject({ kind: 'tome', skill: { id: 'fireball' } });
    expect(rollHeirloom(m, 'warrior', 'warrior_tank', new Rng(1))).toBeNull(); // fireball is not usable by a warrior
  });

  it('heirloom weights the active set double', () => {
    const m = createMeta(); m.deaths = 2;
    discoverSkill(m, 'fireball'); discoverSkill(m, 'frost_bolt');
    let fire = 0;
    const rng = new Rng(5);
    for (let i = 0; i < 3000; i++) if ((rollHeirloom(m, 'wizard', 'wizard_fire', rng) as { skill: { id: string } }).skill.id === 'fireball') fire++;
    expect(fire / 3000).toBeGreaterThan(0.6);
    expect(fire / 3000).toBeLessThan(0.74);
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
