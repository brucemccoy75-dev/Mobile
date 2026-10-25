import { describe, expect, it } from 'vitest';
import { getEnemy } from './index';
import { LEVEL_CAP, TREES, expForEnemy, expForLevel, expToReach, levelForExp } from './progression';

describe('progression curve', () => {
  it('is steep: level 2 in a few kills, the last step a few runs', () => {
    expect(expForLevel(2)).toBe(30);
    expect(expForLevel(10)).toBeGreaterThan(1000);
    expect(expToReach(10)).toBeGreaterThan(3000);
    expect(expToReach(10)).toBeLessThan(4000);
    expect(levelForExp(0)).toBe(1);
    expect(levelForExp(30)).toBe(2);
    expect(levelForExp(999999)).toBe(LEVEL_CAP);
  });
  it('a screen-1 clear is worth about two hundred', () => {
    const wild = ['boar', 'shell_beetle', 'hex_imp', 'rat_pack', 'adept_necromancer', 'boar', 'hex_imp'].reduce((a, id) => a + expForEnemy(getEnemy(id), 'random', 1), 0);
    const guards = 4 * expForEnemy(getEnemy('boar'), 'guard', 1);
    const boss = expForEnemy(getEnemy('gatekeeper'), 'boss', 1);
    expect(wild + guards + boss).toBeGreaterThan(160);
    expect(wild + guards + boss).toBeLessThan(260);
    expect(expForEnemy(getEnemy('boar'), 'random', 2)).toBe(15);
  });
  it('every class starts with its two sets owned', () => {
    for (const nodes of Object.values(TREES)) expect(nodes.filter((n) => n.cost === 0)).toHaveLength(2);
  });
});
