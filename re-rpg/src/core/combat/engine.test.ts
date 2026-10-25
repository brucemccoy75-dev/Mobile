import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { createCombat, step, currentIntent, isPlayerStunned } from './engine';
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

/** Fights in tests carry no basics unless asked, so the deck is exactly what the test says. */
const fight = (deck: string[], enemy: Enemy | string = DUMMY, seed = 1, hp?: number, basics: string[] = []): CombatState =>
  createCombat({ player: { ...WARRIOR, deck, hp, basics }, enemy, rng: new Rng(seed) });

/** Play `id` from the hand; tests may inject a card that was not dealt. */
const play = (s: CombatState, id: string) => {
  let i = s.player.hand.indexOf(id);
  if (i < 0) { s.player.hand.push(id); i = s.player.hand.length - 1; }
  return step(s, { type: 'card', index: i });
};

describe('rounds and dealing', () => {
  it('opens with a full hand of 3, then deals 1 per round, overflowing oldest-first', () => {
    const s = fight(['broadsword', 'broadsword', 'broadsword', 'broadsword', 'broadsword'], PASSIVE);
    s.player.statuses.push({ id: 'stun', turns: 99, magnitude: 1 }); // pass every turn without playing
    expect(s.round).toBe(1);
    expect(s.player.hand).toHaveLength(3);
    expect(s.player.deck).toHaveLength(2);
    const oldest = s.player.hand[0];
    const ev = step(s, { type: 'skip' });
    expect(s.player.hand).toHaveLength(3);
    expect(ev.filter((e) => e.t === 'deal')).toHaveLength(1);
    expect(ev.find((e) => e.t === 'handOverflow')).toMatchObject({ discarded: oldest });
    expect(s.player.discard).toContain(oldest);
  });

  it('opens with fewer than 3 when the deck is smaller', () => {
    const s = fight(['broadsword', 'exposing_strike'], PASSIVE);
    expect(s.player.hand).toHaveLength(2);
    expect(s.player.deck).toHaveLength(0);
  });

  it('basics are shuffled into every fight on top of the run deck', () => {
    const s = createCombat({ player: { ...WARRIOR, deck: ['broadsword'] }, enemy: PASSIVE, rng: new Rng(1) });
    const all = [...s.player.deck, ...s.player.hand].sort();
    expect(all).toEqual(['attack', 'attack', 'broadsword', 'defend']);
  });

  it('with no cards at all, skip passes the turn and nothing is dealt', () => {
    const s = fight([], PASSIVE);
    expect(s.player.hand).toHaveLength(0);
    step(s, { type: 'skip' });
    expect(s.player.hand).toHaveLength(0);
    expect(s.log.some((e) => e.t === 'deal')).toBe(false);
  });

  it('refuses to skip with cards in hand', () => {
    const s = fight(['attack'], PASSIVE);
    expect(() => step(s, { type: 'skip' })).toThrow();
  });

  it('reshuffles the discard pile when the deck is empty', () => {
    const s = fight(['broadsword', 'exposing_strike'], PASSIVE);
    // opening hand holds both; play one → deck empty, discard 1 → next deal reshuffles it back
    step(s, { type: 'card', index: 0 });
    expect(s.log.filter((e) => e.t === 'reshuffle')).toHaveLength(1);
    expect(s.player.hand).toHaveLength(2);
    expect(s.player.deck.length + s.player.hand.length + s.player.discard.length).toBe(2);
  });

  it('is deterministic for a seed', () => {
    const run = (seed: number) => {
      const s = createCombat({ player: { ...WARRIOR, deck: ['fireball', 'frost_bolt', 'inferno'] }, enemy: DUMMY, rng: new Rng(seed) });
      while (s.outcome === 'ongoing') step(s, s.player.hand.length ? { type: 'card', index: 0 } : { type: 'skip' });
      return JSON.stringify(s.log);
    };
    expect(run(7)).toBe(run(7));
    expect(run(7)).not.toBe(run(8));
  });
});

describe('damage and basics', () => {
  it('Attack deals round(atk*1) - def, min 1', () => {
    const s = fight(['attack'], DUMMY);
    play(s, 'attack');
    const hit = s.log.find((e) => e.t === 'damage' && e.source === 'player');
    expect(hit).toMatchObject({ amount: 4, blocked: false });
    const back = s.log.find((e) => e.t === 'damage' && e.source === 'enemy'); // enemy atk 3 - player def 1 = 2
    expect(back).toMatchObject({ amount: 2 });
    expect(s.player.hp).toBe(23);
  });

  it('defence never removes more than half a hit', () => {
    const wall: Enemy = { ...DUMMY, stats: { maxHp: 30, atk: 3, def: 3 } };
    const s = fight(['attack'], wall);
    play(s, 'attack'); // 4 - 3 = 1, floored to ceil(4*0.5) = 2
    expect(s.enemy.hp).toBe(28);
    const heavy: Enemy = { ...DUMMY, stats: { maxHp: 30, atk: 3, def: 10 } };
    const s2 = fight(['broadsword'], heavy);
    play(s2, 'broadsword'); // 4 + 4 flat = 8 - 10 → floor 4
    expect(s2.enemy.hp).toBe(26);
  });

  it('Defend blocks the next hit and is consumed', () => {
    const s = fight(['defend'], DUMMY);
    play(s, 'defend');
    const back = s.log.find((e) => e.t === 'damage' && e.source === 'enemy');
    expect(back).toMatchObject({ amount: 0, blocked: true });
    expect(s.player.hp).toBe(25);
    expect(hasStatus(s.player, 'guard')).toBe(false);
  });

  it('Guard stacks are capped at 3', () => {
    const s = fight(['defend'], PASSIVE);
    for (let i = 0; i < 5; i++) play(s, 'defend');
    expect(getStatus(s.player, 'guard')?.magnitude).toBe(3);
  });

  it('multi-hit attacks consume one guard per hit', () => {
    const swarm: Enemy = { ...DUMMY, id: 'swarm', table: { kind: 'sequence', moves: [{ id: 'sw', name: 'Swarm', posture: 'aggressive', intent: { kind: 'attack', mult: 1, hits: 3 }, effects: [{ type: 'damage', mult: 1, hits: 3 }] }] } };
    const s = fight(['defend'], swarm);
    play(s, 'defend');
    const hits = s.log.filter((e) => e.t === 'damage' && e.source === 'enemy');
    expect(hits.map((h) => (h as { blocked: boolean }).blocked)).toEqual([true, false, false]);
    expect(s.player.hp).toBe(25 - 2 - 2);
  });
});

describe('statuses', () => {
  it('Exposed doubles damage taken and expires after its rounds', () => {
    const s = fight(['exposing_strike', 'attack'], DUMMY);
    play(s, 'exposing_strike'); // 4 dmg, enemy exposed 2 rounds
    expect(s.enemy.hp).toBe(26);
    expect(hasStatus(s.enemy, 'exposed')).toBe(true);
    play(s, 'attack'); // 8 dmg; ticks to 0 → expires
    expect(s.enemy.hp).toBe(18);
    expect(hasStatus(s.enemy, 'exposed')).toBe(false);
  });

  it('Bind Wound heals 35% and leaves you Exposed for two rounds, never blocking anything', () => {
    const s = fight(['bind_wound', 'attack'], DUMMY, 1, 10);
    play(s, 'bind_wound'); // +round(0.35*25)=9 → 19, enemy hits 2 doubled → 15
    expect(s.player.hp).toBe(15);
    expect(hasStatus(s.player, 'exposed')).toBe(true);
    expect(hasStatus(s.player, 'guard')).toBe(false);
    expect(s.log.some((e) => e.t === 'damage' && e.target === 'player' && e.blocked)).toBe(false);
    play(s, 'attack'); // still exposed: 2 doubled → 11, then it expires
    expect(s.player.hp).toBe(11);
    expect(hasStatus(s.player, 'exposed')).toBe(false);
  });

  it('Recovering (stun) still works as a status: turns are skipped and hits land', () => {
    const s = fight(['attack'], DUMMY, 1, 20);
    s.player.statuses.push({ id: 'stun', turns: 2, magnitude: 1 }); // injected before the round: ticks once per round, so 2 = two skipped turns
    expect(isPlayerStunned(s)).toBe(true);
    const ev1 = step(s, { type: 'card', index: 0 }); // ignored: recovering
    expect(ev1.some((e) => e.t === 'stunned')).toBe(true);
    expect(s.player.hp).toBe(18);
    step(s, { type: 'skip' });
    expect(s.player.hp).toBe(16);
    expect(isPlayerStunned(s)).toBe(false);
  });

  it('Weak halves damage dealt', () => {
    const s = fight(['attack'], DUMMY, 1, 10);
    s.player.statuses.push({ id: 'weak', turns: 2, magnitude: 1 });
    play(s, 'attack'); // floor(4*0.5)=2 - 0 = 2
    const hits = s.log.filter((e) => e.t === 'damage' && e.source === 'player');
    expect(hits[0]).toMatchObject({ amount: 2 });
  });

  it('Burn ticks at end of round, ignores guard, and expires', () => {
    const s = fight(['static_field'], PASSIVE);
    play(s, 'static_field'); // burn 3 x3: tick 1
    expect(s.enemy.hp).toBe(27);
    play(s, 'defend');
    play(s, 'defend');
    expect(s.enemy.hp).toBe(21);
    expect(hasStatus(s.enemy, 'burn')).toBe(false);
    play(s, 'defend');
    expect(s.enemy.hp).toBe(21);
  });

  it('Chill makes the enemy skip its action and is consumed', () => {
    const s = fight(['attack'], DUMMY, 3);
    s.enemy.statuses.push({ id: 'chill', turns: 1, magnitude: 1 });
    play(s, 'attack');
    expect(s.player.hp).toBe(25);
    expect(s.log.some((e) => e.t === 'chilled')).toBe(true);
    expect(hasStatus(s.enemy, 'chill')).toBe(false);
  });

  it('Lightning ignores defense', () => {
    const tank: Enemy = { ...DUMMY, stats: { maxHp: 30, atk: 3, def: 5 } };
    const s = fight(['lightning'], tank);
    play(s, 'lightning'); // round(4*1.6)=6, def ignored
    expect(s.enemy.hp).toBe(24);
  });

  it('Spirit Lash heals 50% of damage dealt', () => {
    const s = fight(['spirit_lash'], DUMMY, 1, 10);
    play(s, 'spirit_lash'); // round(4*1.2)=5 dmg → heal round(2.5)=3; then take 2
    expect(s.enemy.hp).toBe(25);
    expect(s.player.hp).toBe(10 + 3 - 2);
  });
});

describe('intent and tells', () => {
  it('shows the current move and the posture of the next one, and advances', () => {
    const s = fight(['defend'], 'boar');
    const first = s.log.find((e) => e.t === 'intent')!;
    expect(first).toMatchObject({ moveName: 'Tusk', posture: 'countering' }); // the Boar braces next
    play(s, 'defend');
    play(s, 'defend');
    const third = s.log.filter((e) => e.t === 'intent')[2]!;
    expect(third).toMatchObject({ moveName: 'Gore', predictedDamage: 7 }); // round(4*2)=8 - def 1
  });

  it('predicted damage reflects Exposed on the player', () => {
    const s = fight([], DUMMY);
    s.player.statuses.push({ id: 'exposed', turns: 2, magnitude: 1 });
    expect(currentIntent(s).predictedDamage).toBe(4);
  });

  it('boss phase change rebuilds the queue and emits a phase event', () => {
    const s = fight(['defend'], 'warden');
    s.enemy.hp = 25; // at the threshold; crossing is evaluated at end of round
    play(s, 'defend');
    expect(s.enemy.phase).toBe(1);
    expect(s.log.some((e) => e.t === 'phase')).toBe(true);
    expect(['rend', 'curse', 'smash']).toContain(s.enemy.current.id);
  });
});

describe('outcomes', () => {
  it('ends when the enemy dies and refuses further steps', () => {
    const s = fight(['attack'], DUMMY);
    s.enemy.hp = 3;
    play(s, 'attack');
    expect(s.outcome).toBe('won');
    expect(() => play(s, 'attack')).toThrow();
  });

  it('ends when the player dies', () => {
    const s = fight(['attack'], DUMMY, 1, 2);
    play(s, 'attack');
    expect(s.outcome).toBe('lost');
    expect(s.log.at(-1)).toEqual({ t: 'end', outcome: 'lost' });
  });
});

describe('brace, scatter and hold', () => {
  const BRACER: Enemy = {
    ...DUMMY, id: 'bracer', name: 'Bracer',
    table: { kind: 'sequence', moves: [
      { id: 'brace', name: 'Brace', posture: 'countering', intent: { kind: 'buff', status: 'brace' }, effects: [{ type: 'status', target: 'self', status: 'brace', turns: 2 }] },
      { id: 'poke', name: 'Poke', posture: 'aggressive', intent: { kind: 'attack', mult: 1, hits: 1 }, effects: [{ type: 'damage', mult: 1 }] },
    ] },
  };

  it('a braced enemy throws the first landing hit back; Guard blocks the counter', () => {
    const s = fight(['defend', 'broadsword', 'attack'], BRACER);
    play(s, 'defend');            // enemy braces; player guard x1 remains
    expect(hasStatus(s.enemy, 'brace')).toBe(true);
    play(s, 'broadsword');        // 8 lands, counter 8 blocked by the standing guard
    const counter = s.log.find((e) => e.t === 'counter');
    expect(counter).toMatchObject({ blocked: true });
    expect(hasStatus(s.enemy, 'brace')).toBe(false);
    const s2 = fight(['attack', 'broadsword'], BRACER);
    play(s2, 'attack');           // enemy braces (attack did 4 first: no brace yet when it landed)
    play(s2, 'broadsword');       // 8 lands, 8 comes back (ignores def)
    expect(s2.log.find((e) => e.t === 'counter')).toMatchObject({ amount: 8, blocked: false });
  });

  it('scatter halves a single hit, not a multi-hit, and is consumed', () => {
    const s = fight(['broadsword'], PASSIVE);
    s.enemy.statuses.push({ id: 'scatter', turns: 2, magnitude: 1 });
    play(s, 'broadsword');        // 8 → 4
    expect(s.enemy.hp).toBe(26);
    expect(hasStatus(s.enemy, 'scatter')).toBe(false);
  });

  it('hold discards the card, passes the turn, and the enemy still acts', () => {
    const s = fight(['attack', 'attack', 'attack', 'attack'], DUMMY);
    s.player.hand[0] = 'broadsword'; // ensure the held card is not simply reshuffled back into the hand
    const ev = step(s, { type: 'hold', index: 0 });
    expect(ev.some((e) => e.t === 'hold')).toBe(true);
    expect(ev.some((e) => e.t === 'play' && e.side === 'player')).toBe(false);
    expect(s.player.discard).toContain('broadsword');
    expect(s.player.hp).toBe(23);
    expect(s.enemy.hp).toBe(30);
  });
});

describe('curse and lifetap', () => {
  it('curse ticks like burn and halves healing while it lasts', () => {
    const s = fight(['bind_wound'], PASSIVE, 1, 10);
    s.player.statuses.push({ id: 'curse', turns: 3, magnitude: 2 });
    play(s, 'bind_wound'); // heal 9 → halved to 4 → 14; then curse ticks 2 → 12 (passive enemy: Exposed never bites)
    expect(s.player.hp).toBe(12);
    expect(s.log.find((e) => e.t === 'burn')).toMatchObject({ status: 'curse', amount: 2 });
  });

  it('the necromancer\'s Lifetap heals it for what it drains', () => {
    const s = fight(['defend'], 'adept_necromancer');
    s.enemy.hp = 10;
    play(s, 'attack'); // round 1: necromancer curses
    play(s, 'attack'); // round 2: lifetap 3-1 = 2 dmg, heals 2
    const heals = s.log.filter((e) => e.t === 'heal' && e.side === 'enemy');
    expect(heals.length).toBeGreaterThan(0);
    expect(hasStatus(s.player, 'curse')).toBe(true);
  });
});

describe('skill upgrades', () => {
  it('a +1 Broadsword hits for one more in combat', () => {
    const s = createCombat({ player: { ...WARRIOR, deck: ['broadsword'], basics: [] }, enemy: PASSIVE, rng: new Rng(1), skillUpgrades: { broadsword: 1 } });
    play(s, 'broadsword'); // 4 + 4 + 1 = 9
    expect(s.enemy.hp).toBe(21);
  });
});

describe('stagger', () => {
  it('leaves the boss Exposed for the player\'s following turn', () => {
    const s = fight(['attack', 'defend'], 'gatekeeper');
    play(s, 'attack'); // boss guards
    play(s, 'defend'); // boss crushes into guard
    play(s, 'attack'); // boss staggers
    expect(hasStatus(s.enemy, 'exposed')).toBe(true);
    const before = s.enemy.hp;
    play(s, 'attack'); // (4-2)*2 = 4
    expect(before - s.enemy.hp).toBe(4);
  });
});
