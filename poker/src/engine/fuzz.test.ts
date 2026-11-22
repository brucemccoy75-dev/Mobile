// Random legal play across many seeded tournaments: the engine must never throw on a legal action,
// never lose or invent chips, and always reach a single winner.
import { describe, expect, it } from 'vitest';
import { type Action, type Hand } from './hand';
import { type Rng, mulberry32, randomInt } from './rng';
import { Tournament } from './tournament';

function randomAction(h: Hand, rng: Rng): Action {
  const legal = h.legalActions()!;
  const options: Action[] = [];
  if (legal.canCheck) options.push({ type: 'check' }, { type: 'check' });
  else options.push({ type: 'call' }, { type: 'call' }, { type: 'fold' });
  if (legal.canBet) {
    options.push({ type: 'bet', amount: legal.minBet });
    options.push({ type: 'bet', amount: legal.minBet + randomInt(rng, legal.maxTo - legal.minBet + 1) });
    options.push({ type: 'bet', amount: legal.maxTo });
  }
  if (legal.canRaise) {
    options.push({ type: 'raise', amount: legal.minRaiseTo });
    options.push({ type: 'raise', amount: legal.minRaiseTo + randomInt(rng, legal.maxTo - legal.minRaiseTo + 1) });
    options.push({ type: 'raise', amount: legal.maxTo });
  }
  return options[randomInt(rng, options.length)];
}

describe('random play', () => {
  it('never breaks the rules or the chip count', () => {
    let hands = 0;
    for (let seed = 1; seed <= 150; seed++) {
      const rng = mulberry32(seed);
      const t = new Tournament({ players: [0, 1, 2, 3, 4, 5].map((seat) => ({ seat, name: `P${seat}` })), rng });
      let guard = 0;
      while (!t.isOver) {
        if (++guard > 5000) throw new Error(`seed ${seed}: tournament did not end`);
        const h = t.startHand();
        let steps = 0;
        while (!h.isComplete) {
          if (++steps > 500) throw new Error(`seed ${seed} hand ${h.handNumber}: hand did not end`);
          expect(h.actor).not.toBeNull();
          h.act(h.actor!, randomAction(h, rng));
        }
        const inPlay = h.players.reduce((s, p) => s + p.stack, 0);
        expect(inPlay).toBe(60000);
        expect(h.potTotal()).toBeGreaterThan(0);
        const paid = h.events.filter((e) => e.type === 'payout').reduce((s, e) => s + (e.type === 'payout' ? e.amount : 0), 0);
        expect(paid).toBe(h.potTotal());
        const summary = t.finishHand();
        expect(Object.values(summary.stacks).reduce((a, b) => a + b, 0)).toBe(60000);
        hands++;
      }
      const finishes = t.players.map((p) => p.finish).sort((a, b) => a! - b!);
      expect(finishes).toEqual([1, 2, 3, 4, 5, 6]);
    }
    expect(hands).toBeGreaterThan(500);
  });
});
