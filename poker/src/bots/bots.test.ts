import { describe, expect, it } from 'vitest';
import { cardsToString, parseCards } from '../engine/cards';
import { Hand } from '../engine/hand';
import { mulberry32 } from '../engine/rng';
import { Bot } from './bot';
import { CHARACTERS, characterById } from './characters';
import { classCombos, classLabel, equity, handClass, preflopPercentile, preflopRanking, rangeTop } from './equity';
import { type Move, decide } from './policy';
import { foldToBet, newProfile, observeHand, vpipRate } from './profile';
import { type BotStats, type BotType, handOutcome, updateClarity } from './stats';

/**
 * Deck for a 3-handed hand with the button on seat 0: seat 1 is the small blind, seat 2 the big
 * blind, so seat 0 acts first preflop and seat 1 acts first after the flop.
 */
function fixedDeck(holes: Record<number, string>, board: string) {
  const order = [1, 2, 0]; // dealing starts left of the button
  const out: number[] = [];
  for (let r = 0; r < 2; r++) for (const s of order) out.push(parseCards(holes[s])[r]);
  out.push(...parseCards(board));
  for (let c = 0; c < 52; c++) if (!out.includes(c)) out.push(c);
  return out;
}

function threeHanded(holes: Record<number, string>, board = '', stacks = [10000, 10000, 10000]): Hand {
  return new Hand({
    seats: [0, 1, 2].map((seat) => ({ seat, stack: stacks[seat] })),
    button: 0, smallBlind: 50, bigBlind: 100, ante: 0, deck: fixedDeck(holes, board),
  });
}

const stats = (type: BotType, clarity = 15): BotStats => {
  const c = CHARACTERS.find((x) => x.type === type)!;
  return { iq: c.iq, read: c.read, clarity };
};

/** Distribution of moves over many seeded decisions in the same spot. */
function moves(type: BotType, make: () => Hand, n = 60, clarity = 15): Record<Move, number> {
  const out: Record<Move, number> = { fold: 0, passive: 0, small: 0, medium: 0, big: 0, allin: 0 };
  for (let i = 0; i < n; i++) {
    const h = make();
    const d = decide({ hand: h, seat: h.actor!, type, stats: stats(type, clarity), rng: mulberry32(i + 1), profile: () => undefined, samples: 80 });
    out[d.move]++;
    // The chosen action must be legal.
    expect(() => h.act(h.actor!, d.action)).not.toThrow();
  }
  return out;
}

describe('equity', () => {
  it('classes and labels round-trip', () => {
    expect(classLabel(handClass(...(parseCards('As Ad') as [number, number])))).toBe('AA');
    expect(classLabel(handClass(...(parseCards('As Ks') as [number, number])))).toBe('AKs');
    expect(classLabel(handClass(...(parseCards('Ks Ad') as [number, number])))).toBe('AKo');
    expect(classLabel(handClass(...(parseCards('7s 2d') as [number, number])))).toBe('72o');
    expect(classCombos(12)).toHaveLength(6);
    expect(classCombos(handClass(...(parseCards('As Ks') as [number, number])))).toHaveLength(4);
    expect(classCombos(handClass(...(parseCards('As Kd') as [number, number])))).toHaveLength(12);
  });

  it('ranks starting hands sensibly', () => {
    expect(preflopPercentile(parseCards('As Ad'))).toBeLessThan(0.01);
    expect(preflopPercentile(parseCards('As Ks'))).toBeLessThan(preflopPercentile(parseCards('As Kd')));
    expect(preflopPercentile(parseCards('7s 2d'))).toBeGreaterThan(0.85);
    expect(rangeTop(0.1).length).toBeGreaterThan(100);
    expect(rangeTop(0.1).length).toBeLessThan(rangeTop(0.3).length);
  });

  it('estimates equity', () => {
    const rng = mulberry32(3);
    expect(equity(parseCards('As Ad'), [], 1, { rng, samples: 1500 })).toBeGreaterThan(0.8);
    expect(equity(parseCards('As Ad'), [], 5, { rng, samples: 1500 })).toBeLessThan(0.6);
    const vsQQ = equity(parseCards('As Kd'), [], 1, { rng, samples: 1500, ranges: [[parseCards('Qc Qh')]] });
    expect(vsQQ).toBeGreaterThan(0.38);
    expect(vsQQ).toBeLessThan(0.5);
    expect(equity(parseCards('Th 2c'), parseCards('Ah Kh Qh Jh 9c'), 1, { rng, samples: 100 })).toBe(1);
    expect(equity(parseCards('2c 7d'), parseCards('Ah Kh Qh Jh Th'), 1, { rng, samples: 100 })).toBe(0.5);
  });
});

describe('policies', () => {
  it('a nit folds trash and raises aces preflop', () => {
    const trash = moves('nit', () => threeHanded({ 0: '7s 2d', 1: 'As Ks', 2: '9c 9d' }));
    expect(trash.fold).toBeGreaterThan(55);
    const aces = moves('nit', () => threeHanded({ 0: 'As Ad', 1: '7s 2d', 2: '9c 9d' }));
    expect(aces.fold).toBe(0);
    expect(aces.small + aces.medium + aces.big).toBeGreaterThan(40);
  });

  it('a tourist plays a middling hand and a calculator does not', () => {
    // A hand around the 45th percentile: inside the tourist's range, outside a button open.
    const { order, percentile } = preflopRanking();
    const cls = order.find((c) => percentile[c] >= 0.45)!;
    const hole = cardsToString(classCombos(cls)[0]);
    const make = () => threeHanded({ 0: hole, 1: 'As Ks', 2: '9c 9d' });
    const tourist = moves('tourist', make);
    expect(tourist.fold).toBeLessThan(15);
    const calc = moves('calculator', make);
    expect(calc.fold).toBeGreaterThan(55);
  });

  it('a calculator calls a good price with a flush draw and folds air to a big bet', () => {
    // Seat 1 bets the flop, seat 2 folds, seat 0 faces the bet.
    const spot = (hole: string, bet: number) => {
      const h = threeHanded({ 0: hole, 1: 'Kc Kd', 2: '7h 2c' }, 'Ks 9s 2d');
      h.act(0, { type: 'call' });
      h.act(1, { type: 'call' });
      h.act(2, { type: 'check' });
      h.act(1, { type: 'bet', amount: bet });
      h.act(2, { type: 'fold' });
      return h;
    };
    const draw = moves('calculator', () => spot('As 5s', 100));
    expect(draw.fold).toBeLessThan(15);
    const air = moves('calculator', () => spot('6h 3c', 250));
    expect(air.fold).toBeGreaterThan(50);
  });

  it('a pro bluffs more into a player who folds a lot', () => {
    // Seat 1 holds air and is first to act on the flop, heads-up against seat 0.
    const spot = () => {
      const h = threeHanded({ 0: 'Kc Qd', 1: '6h 3c', 2: '7h 2c' }, 'As 9s 2d');
      h.act(0, { type: 'call' });
      h.act(1, { type: 'call' });
      h.act(2, { type: 'fold' });
      return h;
    };
    const folder = newProfile();
    folder.hands = 40; folder.foldOpps = 30; folder.folds = 26; folder.vpip = 10; folder.aggressive = 5; folder.passive = 20;
    const caller = newProfile();
    caller.hands = 40; caller.foldOpps = 30; caller.folds = 5; caller.vpip = 30; caller.aggressive = 5; caller.passive = 40;
    const count = (profile: () => typeof folder) => {
      let bluffs = 0;
      for (let i = 0; i < 80; i++) {
        const h = spot();
        const d = decide({ hand: h, seat: 1, type: 'pro', stats: stats('pro'), rng: mulberry32(i + 7), profile: () => profile(), samples: 80 });
        if (d.move !== 'passive') bluffs++;
      }
      return bluffs;
    };
    expect(count(() => folder)).toBeGreaterThan(count(() => caller) + 5);
  });

  it('tilt makes everyone more aggressive', () => {
    const make = () => threeHanded({ 0: 'Jh 9c', 1: 'As Ks', 2: '9c 9d' });
    const calm = moves('nit', make, 60, 0);
    const steaming = moves('nit', make, 60, 90);
    expect(steaming.fold).toBeLessThan(calm.fold);
  });

  it('suggests realistic think times', () => {
    const h = threeHanded({ 0: 'As Ad', 1: '7s 2d', 2: '9c 9d' });
    for (const type of ['nit', 'tourist', 'calculator', 'pro'] as BotType[]) {
      const d = decide({ hand: h, seat: 0, type, stats: stats(type), rng: mulberry32(5), profile: () => undefined, samples: 50 });
      expect(d.thinkMs).toBeGreaterThanOrEqual(450);
      expect(d.thinkMs).toBeLessThan(12000);
    }
  });
});

describe('clarity', () => {
  it('rises on a bad beat and falls on a win', () => {
    // Seat 0 has aces, seat 1 has 72o, runout gives seat 1 two pair.
    const h = threeHanded({ 0: 'As Ad', 1: '7s 2d', 2: '9c 9h' }, '7c 2h Kd 3s 4s');
    h.act(0, { type: 'raise', amount: 10000 });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'fold' });
    expect(h.isComplete).toBe(true);
    const rng = mulberry32(9);
    const loser = handOutcome(h, 0, rng);
    expect(loser.net).toBeLessThan(0);
    expect(loser.badBeat).toBe(true);
    expect(loser.bestEquity).toBeGreaterThan(0.8);
    const s = { iq: 50, read: 30, clarity: 20 };
    updateClarity(s, 'nit', loser);
    expect(s.clarity).toBeGreaterThan(50);

    const winner = handOutcome(h, 1, rng);
    expect(winner.suckOut).toBe(true);
    const w = { iq: 30, read: 20, clarity: 60 };
    updateClarity(w, 'tourist', winner);
    expect(w.clarity).toBeLessThan(40);

    // A player who folded just drifts down a little.
    const folded = handOutcome(h, 2, rng);
    const f = { iq: 90, read: 50, clarity: 30 };
    updateClarity(f, 'calculator', folded);
    expect(f.clarity).toBeLessThan(30);
    expect(f.clarity).toBeGreaterThan(25);
  });
});

describe('profiles', () => {
  it('records tendencies from a hand', () => {
    const h = threeHanded({ 0: 'As Ad', 1: '7s 2d', 2: '9c 9h' }, '7c 2h Kd 3s 4s');
    h.act(0, { type: 'raise', amount: 300 });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'fold' });
    h.act(1, { type: 'check' });
    h.act(0, { type: 'bet', amount: 400 });
    h.act(1, { type: 'fold' });
    const profiles = new Map();
    observeHand(profiles, h, new Map([[11, 900]]));
    const p0 = profiles.get(0);
    const p1 = profiles.get(1);
    const p2 = profiles.get(2);
    expect(p0.vpip).toBe(1);
    expect(p0.pfr).toBe(1);
    expect(p0.aggressive).toBe(2);
    expect(p1.vpip).toBe(1);
    expect(p1.pfr).toBe(0);
    expect(p1.folds).toBe(1);
    expect(p1.foldOpps).toBe(2);
    expect(p1.passive).toBe(2);
    expect(p2.folds).toBe(1);
    expect(vpipRate(p0)).toBeGreaterThan(vpipRate(p2));
    expect(foldToBet(p1)).toBeGreaterThan(foldToBet(p0));
    expect(p1.recent.at(-1)?.action).toBe('fold');
    expect(p1.recent.at(-1)?.toCall).toBe(400);
  });
});

describe('Bot', () => {
  it('keeps profiles by player id and serialises its memory', () => {
    const bot = new Bot(characterById('sal'));
    const ids = new Map([[0, 'sal'], [1, 'chad'], [2, 'wen']]);
    bot.startTournament(0, ids);
    const h = threeHanded({ 0: 'As Ad', 1: '7s 2d', 2: '9c 9h' }, '7c 2h Kd 3s 4s');
    h.act(0, { type: 'raise', amount: 300 });
    h.act(1, { type: 'call' });
    h.act(2, { type: 'fold' });
    h.act(1, { type: 'check' });
    h.act(0, { type: 'bet', amount: 400 });
    h.act(1, { type: 'fold' });
    bot.observe(h, mulberry32(1));
    expect(bot.profiles.get('chad')?.hands).toBe(1);
    expect(bot.profiles.get('sal')).toBeUndefined();
    const mem = bot.memory();
    const again = new Bot(characterById('sal'), mem);
    expect(again.profiles.get('chad')?.folds).toBe(1);
    expect(again.stats.iq).toBe(characterById('sal').iq);
  });

  it('has twelve characters with every type represented', () => {
    expect(CHARACTERS).toHaveLength(12);
    for (const t of ['nit', 'tourist', 'calculator', 'pro'] as BotType[]) {
      expect(CHARACTERS.filter((c) => c.type === t).length, t).toBeGreaterThanOrEqual(2);
    }
  });
});
