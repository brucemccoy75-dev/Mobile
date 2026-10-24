import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { createCombat, step, currentIntent } from './engine';
import { hasStatus, getStatus } from './status';
import type { CombatState } from './types';
import type { Enemy } from '@data/types';

const WARRIOR = { stats: { maxHp: 25, atk: 4, def: 1 } };

/** A dummy that only ever attacks for mult 1, so tests control the numbers. */
const DUMMY: Enemy = {
  id: 'dummy', name: 'Dummy', tier: 1, archetype: 'brute', stats: { maxHp: 30, atk: 3, def: 0 },
  table: { kind: 'sequence', moves: [{ id: 'poke', name: 'Poke', posture: 'aggressive', intent: { kind: 'attack', mult: 1, hits: 1 }, effects: [{ type: 'damage', mult: 1 }] }] },
};
const PASSIVE: Enemy = {
  ...DUMMY, id: 'passive', name: 'Passive',
  table: { kind: 'sequence', moves: [{ id: 'wait', name: 'Wait', posture: 'defensive', intent: { kind: 'stagger' }, effects: [] }] },
};

const fight = (deck: string[], enemy: Enemy | string = DUMMY, seed = 1, hp?: number): CombatState =>
  createCombat({ player: { ...WARRIOR, deck, hp }, enemy, rng: new Rng(seed) });

describe('rounds and dealing', () => {
  it('deals 1, 2, 3 cards over the first three rounds, then overflows oldest-first', () => {
    const s = fight(['a1', 'a2', 'a3', 'a4', 'a5'].map(() => 'broadsword'), PASSIVE);
    expect(s.round).toBe(1);
    expect(s.player.hand).toHaveLength(1);
    step(s, { type: 'basic', id: 'defend' });
    expect(s.player.hand).toHaveLength(2);
    step(s, { type: 'basic', id: 'defend' });
    expect(s.player.hand).toHaveLength(3);
    const oldest = s.player.hand[0];
    const ev = step(s, { type: 'basic', id: 'defend' });
    expect(s.player.hand).toHaveLength(3);
    expect(ev.find((e) => e.t === 'handOverflow')).toMatchObject({ discarded: oldest });
    expect(s.player.discard).toContain(oldest);
  });

  it('with an empty deck, only basics are available and nothing is dealt', () => {
    const s = fight([], PASSIVE);
    expect(s.player.hand).toHaveLength(0);
    step(s, { type: 'basic', id: 'attack' });
    expect(s.player.hand).toHaveLength(0);
    expect(s.log.some((e) => e.t === 'deal')).toBe(false);
  });

  it('reshuffles the discard pile when the deck is empty', () => {
    const s = fight(['broadsword', 'exposing_strike'], PASSIVE);
    // round 1: 1 dealt (deck 1 left). play it. round 2: deal last (deck 0). play it. round 3: reshuffle 2 from discard.
    step(s, { type: 'card', index: 0 });
    step(s, { type: 'card', index: 0 });
    expect(s.log.filter((e) => e.t === 'reshuffle')).toHaveLength(1);
    expect(s.player.hand).toHaveLength(1);
    expect(s.player.deck.length + s.player.hand.length + s.player.discard.length).toBe(2);
  });

  it('is deterministic for a seed', () => {
    const run = (seed: number) => {
      const s = fight(['fireball', 'frost_bolt', 'inferno'], undefined, seed);
      while (s.outcome === 'ongoing') step(s, s.player.hand.length ? { type: 'card', index: 0 } : { type: 'basic', id: 'attack' });
      return JSON.stringify(s.log);
    };
    expect(run(7)).toBe(run(7));
    expect(run(7)).not.toBe(run(8));
  });
});

describe('damage and basics', () => {
  it('Attack deals round(atk*1) - def, min 1', () => {
    const s = fight([], DUMMY);
    step(s, { type: 'basic', id: 'attack' });
    const hit = s.log.find((e) => e.t === 'damage' && e.source === 'player');
    expect(hit).toMatchObject({ amount: 4, blocked: false });
    // enemy atk 3 - player def 1 = 2
    const back = s.log.find((e) => e.t === 'damage' && e.source === 'enemy');
    expect(back).toMatchObject({ amount: 2 });
    expect(s.player.hp).toBe(23);
  });

  it('Defend blocks the next hit and is consumed', () => {
    const s = fight([], DUMMY);
    step(s, { type: 'basic', id: 'defend' });
    const back = s.log.find((e) => e.t === 'damage' && e.source === 'enemy');
    expect(back).toMatchObject({ amount: 0, blocked: true });
    expect(s.player.hp).toBe(25);
    expect(hasStatus(s.player, 'guard')).toBe(false);
  });

  it('Guard stacks are capped at 3', () => {
    const s = fight([], PASSIVE);
    for (let i = 0; i < 5; i++) step(s, { type: 'basic', id: 'defend' });
    expect(getStatus(s.player, 'guard')?.magnitude).toBe(3);
  });

  it('multi-hit attacks consume one guard per hit', () => {
    const swarm: Enemy = { ...DUMMY, id: 'swarm', table: { kind: 'sequence', moves: [{ id: 'sw', name: 'Swarm', posture: 'aggressive', intent: { kind: 'attack', mult: 1, hits: 3 }, effects: [{ type: 'damage', mult: 1, hits: 3 }] }] } };
    const s = fight([], swarm);
    step(s, { type: 'basic', id: 'defend' });
    const hits = s.log.filter((e) => e.t === 'damage' && e.source === 'enemy');
    expect(hits.map((h) => (h as { blocked: boolean }).blocked)).toEqual([true, false, false]);
    expect(s.player.hp).toBe(25 - 2 - 2);
  });
});

describe('statuses', () => {
  it('Exposed doubles damage taken and expires after its rounds', () => {
    const s = fight(['exposing_strike'], DUMMY);
    step(s, { type: 'card', index: 0 }); // 4 dmg, enemy exposed 2 rounds (ticks to 1 at end of round 1)
    expect(s.enemy.hp).toBe(26);
    expect(hasStatus(s.enemy, 'exposed')).toBe(true);
    step(s, { type: 'basic', id: 'attack' }); // 8 dmg; ticks to 0 → expires
    expect(s.enemy.hp).toBe(18);
    expect(hasStatus(s.enemy, 'exposed')).toBe(false);
  });

  it('Bind Wound heals 30% and leaves you Exposed for that round only', () => {
    const s = fight(['bind_wound'], DUMMY, 1, 10);
    step(s, { type: 'card', index: 0 });
    // heal round(0.3*25)=8 → 18, then enemy hits 2 doubled = 4 → 14; exposed expires at end of round
    expect(s.player.hp).toBe(14);
    expect(hasStatus(s.player, 'exposed')).toBe(false);
  });

  it('Weak halves damage dealt', () => {
    const s = fight(['mend'], DUMMY, 1, 10);
    step(s, { type: 'card', index: 0 }); // weak 2
    step(s, { type: 'basic', id: 'attack' }); // floor(4*0.5)=2 - 0 = 2
    const hits = s.log.filter((e) => e.t === 'damage' && e.source === 'player');
    expect(hits[0]).toMatchObject({ amount: 2 });
  });

  it('Burn ticks at end of round, ignores guard, and expires', () => {
    const s = fight(['static_field'], PASSIVE);
    step(s, { type: 'card', index: 0 }); // burn 3 x3: tick 1
    expect(s.enemy.hp).toBe(27);
    step(s, { type: 'basic', id: 'defend' });
    step(s, { type: 'basic', id: 'defend' });
    expect(s.enemy.hp).toBe(21);
    expect(hasStatus(s.enemy, 'burn')).toBe(false);
    step(s, { type: 'basic', id: 'defend' });
    expect(s.enemy.hp).toBe(21);
  });

  it('Chill makes the enemy skip its action and is consumed', () => {
    const chiller: Enemy = { ...DUMMY };
    // Force the chance roll to succeed by using a skill without chance.
    const s = createCombat({ player: { ...WARRIOR, deck: [] }, enemy: chiller, rng: new Rng(3) });
    s.enemy.statuses.push({ id: 'chill', turns: 1, magnitude: 1 });
    step(s, { type: 'basic', id: 'attack' });
    expect(s.player.hp).toBe(25);
    expect(s.log.some((e) => e.t === 'chilled')).toBe(true);
    expect(hasStatus(s.enemy, 'chill')).toBe(false);
  });

  it('Lightning ignores defense', () => {
    const tank: Enemy = { ...DUMMY, stats: { maxHp: 30, atk: 3, def: 5 } };
    const s = fight(['lightning'], tank);
    step(s, { type: 'card', index: 0 }); // round(4*1.6)=6, def ignored
    expect(s.enemy.hp).toBe(24);
  });

  it('Spirit Lash heals 25% of damage dealt', () => {
    const s = fight(['spirit_lash'], DUMMY, 1, 10);
    step(s, { type: 'card', index: 0 }); // round(4*1.2)=5 dmg → heal round(1.25)=1; then take 2
    expect(s.enemy.hp).toBe(25);
    expect(s.player.hp).toBe(10 + 1 - 2);
  });
});

describe('intent and tells', () => {
  it('shows the current move and the posture of the next one, and advances', () => {
    const s = fight([], 'boar');
    const first = s.log.find((e) => e.t === 'intent')!;
    expect(first).toMatchObject({ moveName: 'Tusk', posture: 'aggressive' });
    step(s, { type: 'basic', id: 'defend' });
    step(s, { type: 'basic', id: 'defend' });
    const third = s.log.filter((e) => e.t === 'intent')[2]!;
    expect(third).toMatchObject({ moveName: 'Gore', predictedDamage: 7 }); // round(4*2)=8 - def 1
  });

  it('predicted damage reflects Exposed on the player', () => {
    const s = fight([], DUMMY);
    s.player.statuses.push({ id: 'exposed', turns: 2, magnitude: 1 });
    expect(currentIntent(s).predictedDamage).toBe(4);
  });

  it('boss phase change rebuilds the queue and emits a phase event', () => {
    const s = fight([], 'warden');
    s.enemy.hp = 30; // at the threshold; crossing is evaluated at end of round
    step(s, { type: 'basic', id: 'defend' });
    expect(s.enemy.phase).toBe(1);
    expect(s.log.some((e) => e.t === 'phase')).toBe(true);
    expect(['rend', 'curse', 'smash']).toContain(s.enemy.current.id);
  });
});

describe('outcomes', () => {
  it('ends when the enemy dies and refuses further steps', () => {
    const s = fight([], DUMMY);
    s.enemy.hp = 3;
    step(s, { type: 'basic', id: 'attack' });
    expect(s.outcome).toBe('won');
    expect(() => step(s, { type: 'basic', id: 'attack' })).toThrow();
  });

  it('ends when the player dies', () => {
    const s = fight([], DUMMY, 1, 2);
    step(s, { type: 'basic', id: 'attack' });
    expect(s.outcome).toBe('lost');
    expect(s.log.at(-1)).toEqual({ t: 'end', outcome: 'lost' });
  });
});

describe('stagger', () => {
  it('leaves the boss Exposed for the player\'s following turn', () => {
    const s = fight([], 'gatekeeper');
    step(s, { type: 'basic', id: 'attack' }); // boss guards
    step(s, { type: 'basic', id: 'defend' }); // boss crushes into guard
    step(s, { type: 'basic', id: 'attack' }); // boss staggers
    expect(hasStatus(s.enemy, 'exposed')).toBe(true);
    const before = s.enemy.hp;
    step(s, { type: 'basic', id: 'attack' }); // (4-2)*2 = 4
    expect(before - s.enemy.hp).toBe(4);
  });
});
