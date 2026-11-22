import { describe, expect, it } from 'vitest';
import { type Card, cardsToString, newDeck, parseCards } from './cards';
import { Hand, type HandConfig } from './hand';
import { mulberry32 } from './rng';

/** Builds a deck that deals the given hole cards and board. Unlisted cards fill the rest. */
function deck(seats: number[], button: number, holes: Record<number, string>, board = ''): Card[] {
  const order: number[] = [];
  const i = seats.indexOf(button);
  for (let k = 1; k <= seats.length; k++) order.push(seats[(i + k) % seats.length]);
  const out: Card[] = [];
  for (let round = 0; round < 2; round++) for (const s of order) out.push(parseCards(holes[s])[round]);
  out.push(...parseCards(board));
  const used = new Set(out);
  for (const c of newDeck()) if (!used.has(c)) out.push(c);
  return out;
}

function hand(overrides: Partial<HandConfig> & { deck?: Card[] }): Hand {
  return new Hand({
    seats: [0, 1, 2].map((seat) => ({ seat, stack: 10000 })),
    button: 0,
    smallBlind: 50,
    bigBlind: 100,
    ante: 0,
    ...overrides,
  });
}

/** Chips in stacks plus, while the hand is running, chips in the pot. */
const totalChips = (h: Hand) => h.players.reduce((s, p) => s + p.stack, 0) + (h.isComplete ? 0 : h.potTotal());

describe('Hand setup', () => {
  it('posts blinds and starts with the player left of the big blind', () => {
    const h = hand({});
    expect(h.sbSeat).toBe(1);
    expect(h.bbSeat).toBe(2);
    expect(h.player(1).streetBet).toBe(50);
    expect(h.player(2).streetBet).toBe(100);
    expect(h.currentBet).toBe(100);
    expect(h.actor).toBe(0);
    expect(h.potTotal()).toBe(150);
    expect(h.players.every((p) => p.hole.length === 2)).toBe(true);
  });

  it('heads-up: the button posts the small blind and acts first preflop, second postflop', () => {
    const h = hand({ seats: [{ seat: 3, stack: 5000 }, { seat: 5, stack: 5000 }], button: 5 });
    expect(h.sbSeat).toBe(5);
    expect(h.bbSeat).toBe(3);
    expect(h.actor).toBe(5);
    h.act(5, { type: 'call' });
    expect(h.actor).toBe(3);
    h.act(3, { type: 'check' });
    expect(h.phase).toBe('flop');
    expect(h.actor).toBe(3);
  });

  it('posts antes before blinds and lets short stacks go all-in on a blind', () => {
    const h = hand({ seats: [{ seat: 0, stack: 1000 }, { seat: 1, stack: 30 }, { seat: 2, stack: 1000 }], ante: 25 });
    expect(h.player(1).committed).toBe(30);
    expect(h.player(1).allIn).toBe(true);
    expect(h.potTotal()).toBe(25 + 25 + 30 + 100);
  });

  it('rejects bad configs', () => {
    expect(() => hand({ seats: [{ seat: 0, stack: 100 }] })).toThrow();
    expect(() => hand({ button: 7 })).toThrow();
    expect(() => hand({ seats: [{ seat: 0, stack: 0 }, { seat: 1, stack: 10 }] })).toThrow();
  });
});

describe('Hand betting', () => {
  it('everyone folds to the big blind, who wins the small blind', () => {
    const h = hand({});
    h.act(0, { type: 'fold' });
    h.act(1, { type: 'fold' });
    expect(h.isComplete).toBe(true);
    expect(h.player(2).stack).toBe(10050);
    expect(h.player(1).stack).toBe(9950);
    expect(h.events.at(-1)).toEqual({ type: 'end', winners: [2] });
    expect(h.events.filter((e) => e.type === 'payout' && e.returned)).toHaveLength(1);
  });

  it('gives the big blind the option when everyone calls', () => {
    const h = hand({});
    h.act(0, { type: 'call' });
    h.act(1, { type: 'call' });
    expect(h.phase).toBe('preflop');
    expect(h.actor).toBe(2);
    const legal = h.legalActions()!;
    expect(legal.canCheck).toBe(true);
    expect(legal.canRaise).toBe(true);
    expect(legal.minRaiseTo).toBe(200);
    h.act(2, { type: 'check' });
    expect(h.phase).toBe('flop');
    expect(h.actor).toBe(1);
  });

  it('enforces minimum raises and re-raises', () => {
    const h = hand({});
    expect(h.legalActions()!.minRaiseTo).toBe(200);
    expect(() => h.act(0, { type: 'raise', amount: 150 })).toThrow();
    h.act(0, { type: 'raise', amount: 300 });
    expect(h.legalActions()!.minRaiseTo).toBe(500);
    expect(() => h.act(1, { type: 'raise', amount: 450 })).toThrow();
    h.act(1, { type: 'raise', amount: 900 });
    // Seat 2 must raise by at least the last raise size, 600.
    expect(h.legalActions()!.minRaiseTo).toBe(1500);
    expect(() => h.act(2, { type: 'bet', amount: 2000 })).toThrow();
    expect(() => h.act(2, { type: 'check' })).toThrow();
    expect(() => h.act(0, { type: 'call' })).toThrow();
  });

  it('a short all-in raise does not reopen betting for players who already acted', () => {
    const h = hand({ seats: [{ seat: 0, stack: 10000 }, { seat: 1, stack: 10000 }, { seat: 2, stack: 1500 }] });
    h.act(0, { type: 'raise', amount: 1000 });
    h.act(1, { type: 'call' });
    expect(h.legalActions()!.minRaiseTo).toBe(1500);
    h.act(2, { type: 'raise', amount: 1500 });
    expect(h.player(2).allIn).toBe(true);
    expect(h.actor).toBe(0);
    expect(h.legalActions()!.canRaise).toBe(false);
    expect(h.legalActions()!.callAmount).toBe(500);
    h.act(0, { type: 'call' });
    expect(h.legalActions()!.canRaise).toBe(false);
    h.act(1, { type: 'call' });
    expect(h.phase).toBe('flop');
    expect(h.actor).toBe(1);
    expect(h.potTotal()).toBe(4500);
  });

  it('a full raise reopens betting', () => {
    const h = hand({});
    h.act(0, { type: 'raise', amount: 300 });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'raise', amount: 900 });
    expect(h.actor).toBe(0);
    expect(h.legalActions()!.canRaise).toBe(true);
  });

  it('returns an uncalled bet', () => {
    const h = hand({});
    h.act(0, { type: 'call' });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'check' });
    h.act(1, { type: 'bet', amount: 3000 });
    h.act(2, { type: 'fold' });
    h.act(0, { type: 'fold' });
    expect(h.isComplete).toBe(true);
    expect(h.player(1).stack).toBe(10200);
    expect(h.events.filter((e) => e.type === 'payout' && e.returned)).toEqual([
      { type: 'payout', seat: 1, amount: 3000, pot: 1, returned: true },
    ]);
  });

  it('runs out the board when everyone is all in', () => {
    const d = deck([0, 1], 1, { 0: 'As Ah', 1: 'Kd Kc' }, '2c 7d 9h Ts 3s');
    const h = hand({ seats: [{ seat: 0, stack: 5000 }, { seat: 1, stack: 5000 }], button: 1, deck: d });
    h.act(1, { type: 'raise', amount: 5000 });
    h.act(0, { type: 'call' });
    expect(h.isComplete).toBe(true);
    expect(h.board).toHaveLength(5);
    expect(cardsToString(h.board)).toBe('2c 7d 9h Ts 3s');
    expect(h.player(0).stack).toBe(10000);
    expect(h.player(1).stack).toBe(0);
    expect(h.events.filter((e) => e.type === 'showdown')).toHaveLength(2);
  });

  it('skips betting when only one player can act and nothing is owed', () => {
    const h = hand({ seats: [{ seat: 0, stack: 10000 }, { seat: 1, stack: 10000 }, { seat: 2, stack: 60 }] });
    // Seat 2 is all in for 60 posting the big blind; seat 0 calls 100, seat 1 completes.
    expect(h.player(2).allIn).toBe(true);
    h.act(0, { type: 'call' });
    h.act(1, { type: 'call' });
    // Seats 0 and 1 can still act against each other on the flop.
    expect(h.phase).toBe('flop');
    h.act(1, { type: 'check' });
    h.act(0, { type: 'bet', amount: 500 });
    h.act(1, { type: 'fold' });
    // Only seat 0 and the all-in seat 2 remain: the board runs out with no more action.
    expect(h.isComplete).toBe(true);
    expect(totalChips(h)).toBe(20060);
  });
});

describe('Hand showdown and pots', () => {
  it('awards the pot to the best hand', () => {
    const d = deck([0, 1, 2], 0, { 0: '2c 3d', 1: 'Ah Kh', 2: 'Qs Qd' }, 'Qc 7h 9s 4d Ts');
    const h = hand({ deck: d });
    h.act(0, { type: 'call' });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'check' });
    for (const _ of [1, 2, 3]) {
      h.act(1, { type: 'check' });
      h.act(2, { type: 'check' });
      h.act(0, { type: 'check' });
    }
    expect(h.isComplete).toBe(true);
    expect(h.player(2).stack).toBe(10200);
    const sd = h.events.filter((e) => e.type === 'showdown');
    expect(sd.find((e) => e.type === 'showdown' && e.seat === 2)!.type === 'showdown' && (sd[2] as any).description).toBe('Three of a Kind, Queens');
  });

  it('splits ties and gives the odd chip to the first seat left of the button', () => {
    const d = deck([0, 1, 2], 0, { 0: 'Ah Kd', 1: 'As Kc', 2: '2c 7d' }, 'Qc Jh Ts 4d 9s');
    const h = hand({ seats: [0, 1, 2].map((seat) => ({ seat, stack: 1000 })), smallBlind: 25, bigBlind: 50, deck: d });
    h.act(0, { type: 'raise', amount: 125 });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'call' });
    for (const _ of [1, 2, 3]) {
      h.act(1, { type: 'check' });
      h.act(2, { type: 'check' });
      h.act(0, { type: 'check' });
    }
    // Pot 375 split between seats 0 and 1: 188 to seat 1 (left of the button), 187 to seat 0.
    expect(h.player(1).stack).toBe(875 + 188);
    expect(h.player(0).stack).toBe(875 + 187);
    expect(h.player(2).stack).toBe(875);
  });

  it('builds side pots and pays each to its own winner', () => {
    const d = deck([0, 1, 2], 0, { 0: 'Ah Ad', 1: 'Kh Kd', 2: '7c 2d' }, 'Qc Jh 4s 8d 9s');
    const h = hand({ seats: [{ seat: 0, stack: 1000 }, { seat: 1, stack: 5000 }, { seat: 2, stack: 5000 }], deck: d });
    h.act(0, { type: 'raise', amount: 1000 }); // all in
    h.act(1, { type: 'raise', amount: 3000 });
    h.act(2, { type: 'call' });
    expect(h.pots()).toEqual([
      { amount: 3000, eligible: [0, 1, 2] },
      { amount: 4000, eligible: [1, 2] },
    ]);
    h.act(1, { type: 'check' });
    h.act(2, { type: 'check' });
    h.act(1, { type: 'check' });
    h.act(2, { type: 'check' });
    h.act(1, { type: 'check' });
    h.act(2, { type: 'check' });
    expect(h.isComplete).toBe(true);
    expect(h.player(0).stack).toBe(3000);
    expect(h.player(1).stack).toBe(2000 + 4000);
    expect(h.player(2).stack).toBe(2000);
    expect(totalChips(h)).toBe(11000);
  });

  it('a folded player still feeds the pots they contributed to', () => {
    const d = deck([0, 1, 2], 0, { 0: 'Ah Ad', 1: 'Kh Kd', 2: '7c 2d' }, 'Qc Jh 4s 8d 9s');
    const h = hand({ seats: [{ seat: 0, stack: 1000 }, { seat: 1, stack: 5000 }, { seat: 2, stack: 5000 }], deck: d });
    h.act(0, { type: 'raise', amount: 1000 });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'call' });
    h.act(1, { type: 'bet', amount: 2000 });
    h.act(2, { type: 'fold' });
    expect(h.isComplete).toBe(true);
    expect(h.player(0).stack).toBe(3000);
    expect(h.player(1).stack).toBe(4000);
    expect(h.player(2).stack).toBe(4000);
  });
});

describe('Hand events', () => {
  it('records a replayable sequence', () => {
    const h = hand({ rng: mulberry32(7) });
    h.act(0, { type: 'fold' });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'check' });
    const types = h.events.map((e) => e.type);
    expect(types.slice(0, 6)).toEqual(['start', 'post', 'post', 'deal', 'deal', 'deal']);
    expect(types).toContain('street');
    expect(h.events.filter((e) => e.type === 'action')).toHaveLength(3);
  });
});
