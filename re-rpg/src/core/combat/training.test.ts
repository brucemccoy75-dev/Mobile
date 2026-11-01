import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import type { Enemy } from '@data/types';
import { createCombat, step } from './engine';

/** The training run (DECISIONS #96): its fights deal a set hand and the hero cannot die. */
const BRUTE: Enemy = {
  id: 'brute', name: 'Brute', tier: 1, archetype: 'brute', stats: { maxHp: 200, atk: 30, def: 0 },
  table: { kind: 'sequence', moves: [{ id: 'smash', name: 'Smash', posture: 'aggressive', intent: { kind: 'attack', mult: 1, hits: 3 }, effects: [{ type: 'damage', mult: 1, hits: 3 }] }] },
};
const WARRIOR = { stats: { maxHp: 25, atk: 4, def: 0 } };

describe('ordered deal (DECISIONS #96)', () => {
  it('deals the basics then the deck in the order given, for any seed', () => {
    for (let seed = 1; seed < 30; seed++) {
      const s = createCombat({ player: { ...WARRIOR, basics: ['defend', 'attack', 'ward', 'attack'], deck: ['bellow'], ordered: true }, enemy: 'boar', rng: new Rng(seed) });
      expect(s.player.hand).toEqual(['defend', 'attack', 'ward']);
      expect(s.player.deck).toEqual(['attack', 'bellow']);
    }
  });
  it('without it the deal is shuffled as before', () => {
    const hands = new Set<string>();
    for (let seed = 1; seed < 30; seed++) hands.add(createCombat({ player: { ...WARRIOR, basics: ['defend', 'attack', 'ward', 'attack'], deck: ['bellow'] }, enemy: 'boar', rng: new Rng(seed) }).player.hand.join());
    expect(hands.size).toBeGreaterThan(1);
  });
});

describe('a floor under HP (DECISIONS #96)', () => {
  it('a hero with floor 1 is never brought below 1 HP and never loses', () => {
    const s = createCombat({ player: { ...WARRIOR, basics: ['attack', 'attack', 'attack'], deck: [], floor: 1 }, enemy: BRUTE, rng: new Rng(3) });
    for (let i = 0; i < 6 && s.outcome === 'ongoing'; i++) {
      step(s, { type: 'card', index: 0 });
      expect(s.player.hp).toBeGreaterThanOrEqual(1);
    }
    expect(s.player.hp).toBe(1);
    expect(s.outcome).toBe('ongoing');
  });
  it('without a floor the same fight is lost', () => {
    const s = createCombat({ player: { ...WARRIOR, basics: ['attack', 'attack', 'attack'], deck: [] }, enemy: BRUTE, rng: new Rng(3) });
    step(s, { type: 'card', index: 0 });
    expect(s.outcome).toBe('lost');
  });
  it('burn, curse, thorns and recoil stop at the floor too', () => {
    const s = createCombat({ player: { ...WARRIOR, hp: 2, basics: ['attack', 'attack', 'attack'], deck: [], floor: 1, gear: { selfDamage: 5 } }, enemy: { ...BRUTE, cursed: ['thorns'], stats: { ...BRUTE.stats, atk: 0 } }, rng: new Rng(5) });
    s.player.statuses.push({ id: 'burn', magnitude: 9, turns: 3 }, { id: 'curse', magnitude: 9, turns: 3 });
    for (let i = 0; i < 3 && s.outcome === 'ongoing'; i++) { step(s, { type: 'card', index: 0 }); expect(s.player.hp).toBeGreaterThanOrEqual(1); }
    expect(s.outcome).toBe('ongoing');
  });
});
