// 5- to 7-card hand evaluator. evaluate() returns a number: higher is better, equal means a tie.
// Layout: category in bits 20+, then up to five ranks (4 bits each) from most to least significant.
import { type Card, RANK_NAMES, RANK_PLURALS } from './cards';

export const enum HandCategory {
  HighCard = 0,
  Pair = 1,
  TwoPair = 2,
  Trips = 3,
  Straight = 4,
  Flush = 5,
  FullHouse = 6,
  Quads = 7,
  StraightFlush = 8,
}

export const CATEGORY_NAMES = [
  'High Card', 'Pair', 'Two Pair', 'Three of a Kind', 'Straight', 'Flush', 'Full House', 'Four of a Kind', 'Straight Flush',
];

function make(category: HandCategory, ranks: number[]): number {
  let score = category << 20;
  for (let i = 0; i < 5; i++) score |= (i < ranks.length ? ranks[i] : 0) << (16 - 4 * i);
  return score;
}

/** Highest rank of a straight in a rank bitmask, or -1. A wheel (A-5) reports 3 (the five). */
export function straightHigh(mask: number): number {
  for (let high = 12; high >= 4; high--) {
    const need = 0b11111 << (high - 4);
    if ((mask & need) === need) return high;
  }
  const wheel = (1 << 12) | 0b1111;
  if ((mask & wheel) === wheel) return 3;
  return -1;
}

function topRanks(mask: number, count: number, exclude = 0): number[] {
  const out: number[] = [];
  for (let r = 12; r >= 0 && out.length < count; r--) {
    if (mask & (1 << r) && !(exclude & (1 << r))) out.push(r);
  }
  return out;
}

function popcount(x: number): number {
  let n = 0;
  while (x) { x &= x - 1; n++; }
  return n;
}

export function evaluate(cards: readonly Card[]): number {
  if (cards.length < 5 || cards.length > 7) throw new Error(`evaluate needs 5 to 7 cards, got ${cards.length}`);
  const rankCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const suitMask = [0, 0, 0, 0];
  let rankMask = 0;
  for (const c of cards) {
    const r = c % 13;
    const s = Math.floor(c / 13);
    rankCount[r]++;
    suitMask[s] |= 1 << r;
    rankMask |= 1 << r;
  }

  let quad = -1;
  const trips: number[] = [];
  const pairs: number[] = [];
  for (let r = 12; r >= 0; r--) {
    const n = rankCount[r];
    if (n === 4) quad = r;
    else if (n === 3) trips.push(r);
    else if (n === 2) pairs.push(r);
  }

  let flushSuit = -1;
  for (let s = 0; s < 4; s++) if (popcount(suitMask[s]) >= 5) flushSuit = s;

  if (flushSuit >= 0) {
    const sf = straightHigh(suitMask[flushSuit]);
    if (sf >= 0) return make(HandCategory.StraightFlush, [sf]);
  }
  if (quad >= 0) {
    return make(HandCategory.Quads, [quad, ...topRanks(rankMask, 1, 1 << quad)]);
  }
  if (trips.length > 0 && (pairs.length > 0 || trips.length > 1)) {
    const pairRank = Math.max(pairs.length > 0 ? pairs[0] : -1, trips.length > 1 ? trips[1] : -1);
    return make(HandCategory.FullHouse, [trips[0], pairRank]);
  }
  if (flushSuit >= 0) {
    return make(HandCategory.Flush, topRanks(suitMask[flushSuit], 5));
  }
  const st = straightHigh(rankMask);
  if (st >= 0) return make(HandCategory.Straight, [st]);
  if (trips.length > 0) {
    return make(HandCategory.Trips, [trips[0], ...topRanks(rankMask, 2, 1 << trips[0])]);
  }
  if (pairs.length >= 2) {
    const exclude = (1 << pairs[0]) | (1 << pairs[1]);
    return make(HandCategory.TwoPair, [pairs[0], pairs[1], ...topRanks(rankMask, 1, exclude)]);
  }
  if (pairs.length === 1) {
    return make(HandCategory.Pair, [pairs[0], ...topRanks(rankMask, 3, 1 << pairs[0])]);
  }
  return make(HandCategory.HighCard, topRanks(rankMask, 5));
}

export function categoryOf(score: number): HandCategory {
  return (score >>> 20) as HandCategory;
}

function rankAt(score: number, i: number): number {
  return (score >>> (16 - 4 * i)) & 0xf;
}

/** "Two Pair, Kings and Fives", "Straight, Nine high", "Full House, Aces full of Tens". */
export function describeHand(score: number): string {
  const cat = categoryOf(score);
  const r0 = rankAt(score, 0);
  const r1 = rankAt(score, 1);
  switch (cat) {
    case HandCategory.StraightFlush:
      return r0 === 12 ? 'Royal Flush' : `Straight Flush, ${RANK_NAMES[r0]} high`;
    case HandCategory.Quads:
      return `Four of a Kind, ${RANK_PLURALS[r0]}`;
    case HandCategory.FullHouse:
      return `Full House, ${RANK_PLURALS[r0]} full of ${RANK_PLURALS[r1]}`;
    case HandCategory.Flush:
      return `Flush, ${RANK_NAMES[r0]} high`;
    case HandCategory.Straight:
      return `Straight, ${RANK_NAMES[r0]} high`;
    case HandCategory.Trips:
      return `Three of a Kind, ${RANK_PLURALS[r0]}`;
    case HandCategory.TwoPair:
      return `Two Pair, ${RANK_PLURALS[r0]} and ${RANK_PLURALS[r1]}`;
    case HandCategory.Pair:
      return `Pair of ${RANK_PLURALS[r0]}`;
    default:
      return `${RANK_NAMES[r0]} high`;
  }
}
