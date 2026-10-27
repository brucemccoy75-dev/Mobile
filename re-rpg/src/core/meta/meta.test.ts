import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { familyOf } from '@data/index';
import { allocateLegacy, classProgress, classUnlocked, createMeta, discoverItem, discoverSkill, gainExp, mergeMeta, migrateMeta, nodeState, recordDeath, recordWin, rollHeirloomChoices, unlockNode } from './index';

describe('meta', () => {
  it('discovery is idempotent', () => {
    const m = createMeta();
    expect(discoverSkill(m, 'fireball')).toBe(true);
    expect(discoverSkill(m, 'fireball')).toBe(false);
    expect(discoverItem(m, 'bloodstone')).toBe(true);
    expect(m.discoveredSkills).toEqual(['fireball']);
  });

  it('heirlooms are a random spread of tomes from the unlocked families, no repeats', () => {
    const m = createMeta();
    const h = rollHeirloomChoices(m, 'wizard', new Rng(1));
    expect(h).toHaveLength(4); // from the nine tomes of the two free families
    const ids = h.map((x) => (x.kind === 'tome' ? x.skill.id : x.item.id));
    expect(new Set(ids).size).toBe(4);
    expect(h.every((x) => x.kind === 'tome' && ['wizard_fire', 'wizard_frost'].includes(familyOf('wizard', x.skill.id)!.id))).toBe(true);
    // a fresh warrior owns no family yet (DECISIONS #41), so there is no spread; one bought family gives a spread of its two tomes
    expect(rollHeirloomChoices(m, 'warrior', new Rng(2))).toEqual([]);
    gainExp(m, 'warrior', 78); // level 3: two points, one family
    expect(unlockNode(m, 'warrior', 'warrior_dps')).toBe(true);
    const w = rollHeirloomChoices(m, 'warrior', new Rng(2));
    const picked = w.map((x) => (x.kind === 'tome' ? x.skill.id : ''));
    expect(picked).toHaveLength(4); // four of the family's five
    for (const id of picked) expect(['broadsword', 'exposing_strike', 'last_strike', 'mighty_blow', 'spiritboomerang']).toContain(id);
  });

  it('EXP levels the class, grants points, and nodes are bought per class', () => {
    const m = createMeta();
    expect(classProgress(m, 'warrior')).toMatchObject({ level: 1, exp: 0, points: 0, unlocked: [] });
    expect(classProgress(m, 'wizard')).toMatchObject({ unlocked: ['wizard_fire', 'wizard_frost'] });
    expect(nodeState(m, 'warrior', 'warrior_tank')).toEqual({ state: 'locked', reason: '2 points (you have 0)' });
    expect(unlockNode(m, 'warrior', 'warrior_tank')).toBe(false);
    expect(gainExp(m, 'warrior', 29)).toMatchObject({ from: 1, to: 1, points: 0 });
    expect(gainExp(m, 'warrior', 1)).toMatchObject({ from: 1, to: 2, points: 1 });
    expect(classProgress(m, 'warrior').points).toBe(1);
    expect(classProgress(m, 'wizard').level).toBe(1); // nothing shared
    expect(nodeState(m, 'warrior', 'warrior_tank')).toEqual({ state: 'locked', reason: '2 points (you have 1)' }); // one point buys nothing
    expect(gainExp(m, 'warrior', 48)).toMatchObject({ from: 2, to: 3, points: 1 });
    expect(nodeState(m, 'warrior', 'warrior_tank').state).toBe('available');
    expect(unlockNode(m, 'warrior', 'warrior_tank')).toBe(true);
    expect(classProgress(m, 'warrior')).toMatchObject({ points: 0, unlocked: ['warrior_tank'] });
    expect(nodeState(m, 'warrior', 'warrior_tank').state).toBe('owned');
    expect(nodeState(m, 'warrior', 'warrior_dps').state).toBe('locked');
    expect(gainExp(m, 'warrior', 10000).to).toBe(10);
    expect(classProgress(m, 'warrior').points).toBe(7);
    expect(unlockNode(m, 'warrior', 'warrior_dps')).toBe(true);
    expect(nodeState(m, 'warrior', 'wizard_fire').state).toBe('locked');
  });

  it('merges progress by max and union', () => {
    const a = createMeta(), b = createMeta();
    gainExp(a, 'warrior', 100); gainExp(b, 'shaman', 50);
    const m = mergeMeta(a, b);
    expect(m.progress.warrior?.exp).toBe(100);
    expect(m.progress.shaman?.exp).toBe(50);
    expect(migrateMeta({ version: 3, deaths: 2 })?.progress).toEqual({});
  });

  it('v5 saves lose the warrior families they were given for free, and keep their points', () => {
    const old = migrateMeta({ version: 5, deaths: 4, progress: { warrior: { level: 3, exp: 90, points: 2, unlocked: ['warrior_tank', 'warrior_dps'] }, wizard: { level: 1, exp: 0, points: 0, unlocked: ['wizard_fire', 'wizard_frost'] } } })!;
    expect(old.version).toBe(6);
    expect(old.progress.warrior).toEqual({ level: 3, exp: 90, points: 2, unlocked: [] });
    expect(old.progress.wizard?.unlocked).toEqual(['wizard_fire', 'wizard_frost']);
    expect(unlockNode(old, 'warrior', 'warrior_tank')).toBe(true); // two points buy one family now
    expect(unlockNode(old, 'warrior', 'warrior_dps')).toBe(false);
    expect(classProgress(old, 'warrior').points).toBe(0);
  });

  it('wizard and shaman unlock after a warrior win; v1 saves migrate', () => {
    const m = createMeta();
    expect(classUnlocked(m, 'warrior')).toBe(true);
    expect(classUnlocked(m, 'wizard')).toBe(false);
    recordWin(m, 2, 'wizard'); // cannot happen in play, but must not unlock by itself
    expect(classUnlocked(m, 'shaman')).toBe(false);
    recordWin(m, 2, 'warrior');
    expect(classUnlocked(m, 'wizard')).toBe(true);
    const old = migrateMeta({ version: 1, updatedAt: 1, deaths: 3, wins: 1, bestScreen: 2, discoveredSkills: ['x'], discoveredItems: [] })!;
    expect(old.version).toBe(6);
    expect(old.relations).toEqual({});
    expect(old.winsByClass).toEqual({ warrior: 1 });
    expect(old.legacyUnspent).toBe(1); // the earlier win becomes a point to spend
    expect(migrateMeta({ version: 99 })).toBeNull();
    expect(migrateMeta(null)).toBeNull();
  });

  it('legacy: a win banks one point, allocation is permanent, nothing to spend means nothing happens', () => {
    const m = createMeta();
    expect(allocateLegacy(m, 'atk')).toBe(false);
    recordWin(m, 2, 'warrior');
    expect(m.legacyUnspent).toBe(1);
    expect(allocateLegacy(m, 'maxHp')).toBe(true);
    expect(m.legacy).toEqual({ atk: 0, def: 0, maxHp: 5 });
    expect(m.legacyUnspent).toBe(0);
    expect(allocateLegacy(m, 'def')).toBe(false);
    recordWin(m, 2, 'warrior'); recordWin(m, 2, 'warrior');
    allocateLegacy(m, 'atk'); allocateLegacy(m, 'def');
    expect(m.legacy).toEqual({ atk: 1, def: 1, maxHp: 5 });
  });

  it('merge unions discoveries and maxes counters', () => {
    const a = createMeta(); a.deaths = 3; discoverSkill(a, 'x');
    const b = createMeta(); b.deaths = 1; b.wins = 2; discoverSkill(b, 'y'); discoverItem(b, 'i');
    const m = mergeMeta(a, b);
    expect(m.deaths).toBe(3); expect(m.wins).toBe(2);
    expect(m.discoveredSkills.sort()).toEqual(['x', 'y']);
    expect(m.discoveredItems).toEqual(['i']);
    a.winsByClass = { warrior: 2 }; b.winsByClass = { warrior: 1, shaman: 1 };
    expect(mergeMeta(a, b).winsByClass).toEqual({ warrior: 2, shaman: 1 });
    a.legacy = { atk: 2, def: 0, maxHp: 0 }; b.legacy = { atk: 1, def: 1, maxHp: 5 };
    expect(mergeMeta(a, b).legacy).toEqual({ atk: 2, def: 1, maxHp: 5 });
  });
});
