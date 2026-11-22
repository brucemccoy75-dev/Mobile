import { describe, expect, it } from 'vitest';
import { type Hand } from './hand';
import { mulberry32 } from './rng';
import { DEFAULT_SCHEDULE, Tournament } from './tournament';

const six = () => [0, 1, 2, 3, 4, 5].map((seat) => ({ seat, name: `P${seat}` }));

/** Everyone folds to the big blind. */
function foldAround(h: Hand): void {
  while (!h.isComplete) h.act(h.actor!, { type: 'fold' });
}

/** Every player shoves and calls. */
function shoveAll(h: Hand): void {
  while (!h.isComplete) {
    const legal = h.legalActions()!;
    if (legal.canRaise) h.act(legal.seat, { type: 'raise', amount: legal.maxTo });
    else if (legal.canBet) h.act(legal.seat, { type: 'bet', amount: legal.maxTo });
    else if (legal.canCheck) h.act(legal.seat, { type: 'check' });
    else h.act(legal.seat, { type: 'call' });
  }
}

describe('Tournament', () => {
  it('starts everyone with the same stack at level 1', () => {
    const t = new Tournament({ players: six(), rng: mulberry32(1) });
    expect(t.players.every((p) => p.stack === 10000)).toBe(true);
    expect(t.level).toEqual(DEFAULT_SCHEDULE[0]);
    expect(t.button).toBe(0);
    expect(t.isOver).toBe(false);
  });

  it('raises the blinds every 8 hands and adds antes from level 4', () => {
    const t = new Tournament({ players: six(), rng: mulberry32(2) });
    for (let i = 0; i < 24; i++) {
      expect(t.levelIndex).toBe(Math.floor(i / 8));
      const h = t.startHand();
      expect(h.bigBlind).toBe(DEFAULT_SCHEDULE[t.levelIndex].bb);
      foldAround(h);
      t.finishHand();
    }
    expect(t.levelIndex).toBe(3);
    expect(t.level.ante).toBe(25);
    const h = t.startHand();
    expect(h.ante).toBe(25);
    expect(h.handNumber).toBe(25);
  });

  it('moves the button each hand and skips busted seats', () => {
    const t = new Tournament({ players: six(), rng: mulberry32(3) });
    const h = t.startHand();
    foldAround(h);
    t.finishHand();
    expect(t.button).toBe(1);
    t.player(2).stack = 0;
    t.player(2).finish = 6;
    const h2 = t.startHand();
    expect(h2.players.map((p) => p.seat)).toEqual([0, 1, 3, 4, 5]);
    foldAround(h2);
    t.finishHand();
    expect(t.button).toBe(3);
  });

  it('assigns finishing places, with same-hand busts ordered by starting stack', () => {
    const t = new Tournament({ players: [0, 1, 2].map((seat) => ({ seat, name: `P${seat}` })), rng: mulberry32(4) });
    t.player(0).stack = 500;
    t.player(1).stack = 300;
    t.player(2).stack = 29200;
    // Deal the big stack the winning cards by replaying hands until it wins everything.
    let guard = 0;
    while (!t.isOver && guard++ < 200) {
      const h = t.startHand();
      shoveAll(h);
      t.finishHand();
    }
    expect(t.isOver).toBe(true);
    const places = t.standings().map((p) => [p.seat, p.finish]);
    expect(places[0][1]).toBe(1);
    const finishes = t.players.map((p) => p.finish).sort();
    expect(finishes).toEqual([1, 2, 3]);
    const bustedTogether = t.players.filter((p) => p.bustedOn === t.player(0).bustedOn && p.seat !== 0);
    if (bustedTogether.some((p) => p.seat === 1)) {
      // Seat 0 started that hand with more chips than seat 1, so it finishes higher.
      expect(t.player(0).finish!).toBeLessThan(t.player(1).finish!);
    }
  });

  it('plays to a single winner and conserves chips', () => {
    const t = new Tournament({ players: six(), rng: mulberry32(5) });
    let guard = 0;
    while (!t.isOver && guard++ < 10000) {
      const h = t.startHand();
      shoveAll(h);
      const summary = t.finishHand();
      expect(Object.values(summary.stacks).reduce((a, b) => a + b, 0)).toBe(60000);
    }
    expect(t.isOver).toBe(true);
    expect(t.standings()[0].finish).toBe(1);
    expect(t.standings()[0].stack).toBe(60000);
    expect(new Set(t.players.map((p) => p.finish)).size).toBe(6);
    expect(() => t.startHand()).toThrow();
  });

  it('refuses to finish a hand that is still running', () => {
    const t = new Tournament({ players: six(), rng: mulberry32(6) });
    t.startHand();
    expect(() => t.finishHand()).toThrow();
    expect(() => t.startHand()).toThrow();
  });
});
