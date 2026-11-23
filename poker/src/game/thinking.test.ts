import { describe, expect, it } from 'vitest';
import { parseCards } from '../engine/cards';
import { Hand } from '../engine/hand';
import { mulberry32 } from '../engine/rng';
import { boardTexture, strength, thinkAloud } from './thinking';

function fixedDeck(holes: Record<number, string>, board: string): number[] {
  const order = [1, 2, 0]; // dealing starts left of the button
  const out: number[] = [];
  for (let r = 0; r < 2; r++) for (const s of order) out.push(parseCards(holes[s])[r]);
  out.push(...parseCards(board));
  for (let c = 0; c < 52; c++) if (!out.includes(c)) out.push(c);
  return out;
}

function dealt(holes: Record<number, string>, board: string, streets: number): Hand {
  const h = new Hand({
    seats: [0, 1, 2].map((seat) => ({ seat, stack: 10000 })),
    button: 0, smallBlind: 50, bigBlind: 100, ante: 0, deck: fixedDeck(holes, board), rng: mulberry32(1),
  });
  // Everyone checks or calls through to the wanted street.
  while (!h.isComplete && h.board.length < streets) {
    const legal = h.legalActions()!;
    h.act(h.actor!, legal.canCheck ? { type: 'check' } : { type: 'call' });
  }
  return h;
}

describe('thinking aloud', () => {
  it('reads the board for what is possible', () => {
    expect(boardTexture(parseCards('Ah Kh 2h'))).toMatchObject({ flush: true });
    expect(boardTexture(parseCards('9c Tc Jd'))).toMatchObject({ straight: true });
    expect(boardTexture(parseCards('9c 9d 2s'))).toMatchObject({ paired: true });
    expect(boardTexture(parseCards('2c 7d Ks'))).toEqual({ flush: false, straight: false, paired: false });
  });

  it('agrees with the move: a fold credits the other man, a raise denies him or claims strength', () => {
    // A straight is possible; seat 1 holds it.
    const h = dealt({ 0: 'Qh Qd', 1: '8s 7s', 2: '2c 3d' }, '9c Tc Jd 4h 5s', 5);
    const rng = mulberry32(3);
    const target = { name: 'Jack', hole: h.player(1).hole };
    let reads = 0;
    for (let i = 0; i < 60; i++) {
      const fold = thinkAloud({ hand: h, seat: 2, move: 'fold', target, rng })!;
      const raise = thinkAloud({ hand: h, seat: 2, move: 'raise', target, rng })!;
      const call = thinkAloud({ hand: h, seat: 2, move: 'call', target, rng })!;
      expect(fold).toMatch(/Fold\.|I’m out\.|Take it\.$/);
      expect(raise).toMatch(/Raise|raising|Bet\.$/);
      expect(call).toMatch(/[Cc]all/);
      if (/straight/.test(fold)) { expect(fold).toMatch(/got the straight|has the straight/); reads++; }
      if (/straight/.test(raise)) expect(raise).toMatch(/don’t think|No straight/);
      if (!/Jack/.test(fold)) expect(fold).toMatch(/nothing|ace|Missed|two cards|Nothing/i);
      if (!/Jack/.test(raise)) expect(raise).toMatch(/got it|Flopped|Two pair|can’t fold|have this|Got there/);
      expect(fold).not.toMatch(/flush|trips/);
    }
    expect(reads).toBeGreaterThan(0);
  });

  it('is honest or not depending on the cards, never on the words', () => {
    const h = dealt({ 0: 'Qh Qd', 1: '8s 7s', 2: '2c 3d' }, '9c Tc Jd 4h 5s', 5);
    expect(strength(h.player(2).hole, h.board)).toBe('nothing');
    expect(strength(h.player(1).hole, h.board)).toBe('made');
    expect(strength(h.player(0).hole, h.board)).toBe('pair');
  });

  it('mentions how many cards are to come', () => {
    const flop = dealt({ 0: 'Qh Qd', 1: '8s 7s', 2: '2c 3d' }, '9c 2d Kd 4h 5s', 3);
    const rng = mulberry32(9);
    const texts = new Set<string>();
    for (let i = 0; i < 30; i++) texts.add(thinkAloud({ hand: flop, seat: 2, move: 'call', rng })!);
    expect([...texts].some((t) => /Two to come|Two more cards/.test(t))).toBe(true);
    expect([...texts].every((t) => !/One card|No more cards/.test(t))).toBe(true);
  });
});
