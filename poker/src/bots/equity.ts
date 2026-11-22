// Monte Carlo equity and preflop hand classes. Everything here is seeded through the caller's rng.
import { type Card, RANK_CHARS, makeCard, newDeck, rankOf, suitOf } from '../engine/cards';
import { evaluate } from '../engine/evaluator';
import { type Rng, mulberry32 } from '../engine/rng';

/** A set of two-card combos an opponent might hold. */
export type Range = Card[][];

export interface EquityOptions {
  rng: Rng;
  /** Runouts to sample. 200 is plenty for decisions. */
  samples?: number;
  /** Per-opponent range, or null for any two cards. Shorter than `opponents` means the rest are random. */
  ranges?: (Range | null)[];
}

/**
 * Probability that `hole` wins (ties count fractionally) against `opponents` random or ranged hands,
 * with the remaining board dealt at random.
 */
export function equity(hole: readonly Card[], board: readonly Card[], opponents: number, opts: EquityOptions): number {
  const samples = opts.samples ?? 200;
  const rng = opts.rng;
  const taken = new Uint8Array(52);
  for (const c of hole) taken[c] = 1;
  for (const c of board) taken[c] = 1;
  const stock = newDeck().filter((c) => !taken[c]);
  const need = 5 - board.length;
  const cards: Card[] = [...hole, ...board];
  const oppCards: Card[][] = [];
  for (let i = 0; i < opponents; i++) oppCards.push([0, 0]);
  const dealt: Card[] = [];
  let total = 0;

  const draw = (): Card => {
    for (;;) {
      const c = stock[Math.floor(rng() * stock.length)];
      if (!taken[c]) {
        taken[c] = 1;
        dealt.push(c);
        return c;
      }
    }
  };

  for (let s = 0; s < samples; s++) {
    dealt.length = 0;
    for (let i = 0; i < opponents; i++) {
      const range = opts.ranges?.[i] ?? null;
      let placed = false;
      if (range && range.length > 0) {
        for (let tries = 0; tries < 12; tries++) {
          const combo = range[Math.floor(rng() * range.length)];
          if (!taken[combo[0]] && !taken[combo[1]]) {
            taken[combo[0]] = 1;
            taken[combo[1]] = 1;
            dealt.push(combo[0], combo[1]);
            oppCards[i][0] = combo[0];
            oppCards[i][1] = combo[1];
            placed = true;
            break;
          }
        }
      }
      if (!placed) {
        oppCards[i][0] = draw();
        oppCards[i][1] = draw();
      }
    }
    cards.length = hole.length + board.length;
    for (let i = 0; i < need; i++) cards.push(draw());
    const mine = evaluate(cards);
    const runout = cards.slice(hole.length);
    let beaten = false;
    let ties = 0;
    for (let i = 0; i < opponents; i++) {
      const theirs = evaluate([oppCards[i][0], oppCards[i][1], ...runout]);
      if (theirs > mine) {
        beaten = true;
        break;
      }
      if (theirs === mine) ties++;
    }
    if (!beaten) total += 1 / (1 + ties);
    for (const c of dealt) taken[c] = 0;
  }
  return total / samples;
}

// ---- preflop hand classes ----------------------------------------------------------------------
// 169 classes: 0..12 pairs (22..AA), 13..90 suited, 91..168 offsuit. Within suited/offsuit the index
// is pairIndex(high, low) = high*(high-1)/2 + low.

export const CLASS_COUNT = 169;

function pairIndex(high: number, low: number): number {
  return (high * (high - 1)) / 2 + low;
}

export function handClass(a: Card, b: Card): number {
  const ra = rankOf(a);
  const rb = rankOf(b);
  if (ra === rb) return ra;
  const high = Math.max(ra, rb);
  const low = Math.min(ra, rb);
  return (suitOf(a) === suitOf(b) ? 13 : 91) + pairIndex(high, low);
}

export function classLabel(cls: number): string {
  if (cls < 13) return RANK_CHARS[cls] + RANK_CHARS[cls];
  const suited = cls < 91;
  let idx = cls - (suited ? 13 : 91);
  let high = 1;
  while (pairIndex(high + 1, 0) <= idx) high++;
  const low = idx - pairIndex(high, 0);
  return RANK_CHARS[high] + RANK_CHARS[low] + (suited ? 's' : 'o');
}

/** Every two-card combo in a class: 6 for pairs, 4 suited, 12 offsuit. */
export function classCombos(cls: number): Card[][] {
  const out: Card[][] = [];
  if (cls < 13) {
    for (let s = 0; s < 4; s++) for (let t = s + 1; t < 4; t++) out.push([makeCard(cls, s), makeCard(cls, t)]);
    return out;
  }
  const suited = cls < 91;
  const idx = cls - (suited ? 13 : 91);
  let high = 1;
  while (pairIndex(high + 1, 0) <= idx) high++;
  const low = idx - pairIndex(high, 0);
  for (let s = 0; s < 4; s++) {
    for (let t = 0; t < 4; t++) {
      if (suited ? s === t : s !== t) out.push([makeCard(high, s), makeCard(low, t)]);
    }
  }
  return out;
}

let rankingCache: { order: number[]; percentile: Float64Array; equity: Float64Array } | null = null;

/**
 * Classes ordered best to worst by heads-up equity against a random hand, and each class's
 * percentile: the fraction of all 1326 combos that are at least as strong (0 = best, 1 = worst).
 * Computed once with a fixed seed so it is identical on every run.
 */
export function preflopRanking(): { order: number[]; percentile: Float64Array; equity: Float64Array } {
  if (rankingCache) return rankingCache;
  const rng = mulberry32(0x9e3779b9);
  const eq = new Float64Array(CLASS_COUNT);
  for (let cls = 0; cls < CLASS_COUNT; cls++) {
    const combo = classCombos(cls)[0];
    eq[cls] = equity(combo, [], 1, { rng, samples: 600 });
  }
  const order = [...Array(CLASS_COUNT).keys()].sort((a, b) => eq[b] - eq[a]);
  const percentile = new Float64Array(CLASS_COUNT);
  let seen = 0;
  for (const cls of order) {
    seen += classCombos(cls).length;
    percentile[cls] = seen / 1326;
  }
  rankingCache = { order, percentile, equity: eq };
  return rankingCache;
}

/** 0 for the best starting hand, approaching 1 for the worst. */
export function preflopPercentile(hole: readonly Card[]): number {
  return preflopRanking().percentile[handClass(hole[0], hole[1])];
}

const rangeCache = new Map<number, Range>();

/** All combos in the top `pct` of starting hands (0.1 = the best tenth). */
export function rangeTop(pct: number): Range {
  const key = Math.round(Math.min(1, Math.max(0.01, pct)) * 100);
  const cached = rangeCache.get(key);
  if (cached) return cached;
  const { order, percentile } = preflopRanking();
  const out: Range = [];
  for (const cls of order) {
    if (percentile[cls] > key / 100 && out.length > 0) break;
    out.push(...classCombos(cls));
  }
  rangeCache.set(key, out);
  return out;
}
