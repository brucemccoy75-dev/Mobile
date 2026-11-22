import { describe, expect, it } from 'vitest';
import { parseCards } from '../engine/cards';
import { Hand } from '../engine/hand';
import { mulberry32 } from '../engine/rng';
import { boardTexture, thinkAloud } from './thinking';

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

  it('tells the truth when accurate, and lies to fit the board when not', () => {
    // Seat 1 holds the straight on a straight board; seat 2 has air.
    const h = dealt({ 0: 'Qh Qd', 1: '8s 7s', 2: '2c 3d' }, '9c Tc Jd 4h 5s', 5);
    const rng = mulberry32(3);
    let truths = 0;
    let lies = 0;
    for (let i = 0; i < 40; i++) {
      const t = thinkAloud({ hand: h, seat: 2, callAmount: 500, accurate: true, target: { name: 'Jack', hole: h.player(1).hole }, rng });
      const l = thinkAloud({ hand: h, seat: 2, callAmount: 500, accurate: false, target: { name: 'Jack', hole: h.player(1).hole }, rng });
      if (t && /straight/.test(t)) { expect(t).toMatch(/got the straight|has the straight/); truths++; }
      if (l && /straight/.test(l)) { expect(l).toMatch(/don’t think|No straight/); lies++; }
      if (t && !/Jack/.test(t)) expect(t).toMatch(/nothing|ace|Missed|two cards|Nothing/i);
    }
    expect(truths).toBeGreaterThan(0);
    expect(lies).toBeGreaterThan(0);
  });

  it('mentions how many cards are to come', () => {
    const flop = dealt({ 0: 'Qh Qd', 1: '8s 7s', 2: '2c 3d' }, '9c 2d Kd', 3);
    const rng = mulberry32(9);
    const texts = new Set<string>();
    for (let i = 0; i < 30; i++) texts.add(thinkAloud({ hand: flop, seat: 2, callAmount: 0, accurate: true, rng })!);
    expect([...texts].some((t) => /Two to come|Two more cards/.test(t))).toBe(true);
    expect([...texts].every((t) => !/One card|No more cards/.test(t))).toBe(true);
  });
});
