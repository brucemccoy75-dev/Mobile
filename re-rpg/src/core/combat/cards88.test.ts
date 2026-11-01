import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import type { Enemy } from '@data/types';
import { createCombat, step } from './engine';
import { blackjackHand, BLACKJACK_BEAT } from './engine';
import { hasStatus } from './status';

const WARRIOR = { stats: { maxHp: 40, atk: 4, def: 0 } };
const DUMMY: Enemy = {
  id: 'dummy', name: 'Dummy', tier: 1, archetype: 'brute', stats: { maxHp: 60, atk: 3, def: 0 },
  table: { kind: 'sequence', moves: [{ id: 'poke', name: 'Poke', posture: 'aggressive', intent: { kind: 'attack', mult: 1, hits: 1 }, effects: [{ type: 'damage', mult: 1 }] }] },
};
const fight = (seed = 1) => createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: DUMMY, rng: new Rng(seed) });
const play = (s: ReturnType<typeof fight>, id: string, extra: Record<string, unknown> = {}) => {
  let i = s.player.hand.indexOf(id);
  if (i < 0) { s.player.hand.push(id); i = s.player.hand.length - 1; }
  return step(s, { type: 'card', index: i, ...extra });
};
const dmgToEnemy = (ev: ReturnType<typeof step>) => ev.filter((e) => e.t === 'damage' && e.source === 'player').reduce((a, e) => a + (e as { amount: number }).amount, 0);

describe('enemy stun (DECISIONS #88)', () => {
  it('a stunned enemy skips its action; it is gone the round after', () => {
    const s = fight();
    const ev = play(s, 'bellow');
    expect(ev.some((e) => e.t === 'stunned' && e.side === 'enemy')).toBe(true);
    expect(ev.some((e) => e.t === 'damage' && e.target === 'player')).toBe(false);
    expect(hasStatus(s.player, 'weak')).toBe(true); // Bellow tires you
    expect(hasStatus(s.enemies[0]!, 'stun')).toBe(false);
    const ev2 = play(s, 'defend');
    expect(ev2.some((e) => e.t === 'play' && e.side === 'enemy')).toBe(true);
  });
});

describe('Trickster: a right call puts its debuffs on the enemy (DECISIONS #88)', () => {
  it('right: the hit, a free card, and Weak, Exposed and Curse on the enemy; wrong: all three on you', () => {
    for (let seed = 1; seed < 40; seed++) {
      const s = fight(seed);
      const ev = play(s, 'trickster', { call: 'heads' });
      const coin = ev.find((e) => e.t === 'coin') as { won: boolean };
      const e = s.enemies[0]!;
      if (coin.won) {
        for (const st of ['weak', 'exposed', 'curse'] as const) expect(hasStatus(e, st)).toBe(true);
      } else {
        for (const st of ['weak', 'exposed', 'curse'] as const) expect(hasStatus(s.player, st)).toBe(true);
        expect(hasStatus(e, 'curse')).toBe(false);
      }
    }
  });
});

describe('Blackjack: beat 16 (DECISIONS #88)', () => {
  it('the hand is two cards plus each hit, the same before and during the play', () => {
    const s = fight(5);
    const two = blackjackHand(s, 0), three = blackjackHand(s, 1);
    expect(two.cards).toHaveLength(2);
    expect(three.cards.slice(0, 2)).toEqual(two.cards);
    const ev = play(s, 'blackjack', { bjHits: 1 });
    expect(ev.find((e) => e.t === 'blackjackHand')).toMatchObject({ total: three.total, cards: three.cards });
  });

  it('beat 16 without busting: 200% damage; otherwise nothing lands and you are Exposed', () => {
    let wins = 0, losses = 0;
    for (let seed = 1; seed < 80; seed++) {
      const s = fight(seed);
      const hand = blackjackHand(s, 0);
      const ev = play(s, 'blackjack', { bjHits: 0 });
      const won = hand.total > BLACKJACK_BEAT && hand.total <= 21;
      expect((ev.find((e) => e.t === 'blackjackHand') as { won: boolean }).won).toBe(won);
      if (won) { wins++; expect(dmgToEnemy(ev)).toBe(8); expect(hasStatus(s.player, 'exposed')).toBe(false); }
      else { losses++; expect(dmgToEnemy(ev)).toBe(0); expect(hasStatus(s.player, 'exposed')).toBe(true); }
    }
    expect(wins).toBeGreaterThan(0); expect(losses).toBeGreaterThan(0);
  });

  it('aces count 11 or 1; a bust is a loss', () => {
    for (let seed = 1; seed < 200; seed++) {
      const s = fight(seed);
      const h = blackjackHand(s, 3);
      const raw = h.cards.reduce((a, c) => a + c.value, 0);
      expect(h.total).toBeLessThanOrEqual(raw);
      if (h.total > 21) expect(h.cards.every((c) => c.rank !== 'A') || raw - h.total === 10 * h.cards.filter((c) => c.rank === 'A').length).toBe(true);
    }
  });

  it('with no hits given (the sim) it hits until 17', () => {
    const s = fight(9);
    const ev = play(s, 'blackjack');
    const h = ev.find((e) => e.t === 'blackjackHand') as { total: number; cards: unknown[] };
    expect(h.total >= 17 || h.cards.length === 0).toBe(true);
  });
});
