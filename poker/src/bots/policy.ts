// The decision engine: one pipeline, four personalities. A policy turns the situation into weights
// over a small menu of moves; stats decide how accurately the situation is seen.
import { type Card, rankOf, suitOf } from '../engine/cards';
import { HandCategory, categoryOf, evaluate, straightHigh } from '../engine/evaluator';
import { type Action, type Hand, type LegalActions, type Street } from '../engine/hand';
import { type Rng } from '../engine/rng';
import { type Range, equity, preflopPercentile, rangeTop } from './equity';
import { type Profile, aggression, fastBetRate, foldToBet, pfrRate, vpipRate } from './profile';
import { type BotStats, type BotType, clamp } from './stats';

/** Relative weights over the move menu. Zero means never. */
export interface Weights {
  fold: number;
  /** Check when possible, otherwise call. */
  passive: number;
  small: number;
  medium: number;
  big: number;
  allin: number;
}

export type Move = keyof Weights;

export interface DecisionInput {
  hand: Hand;
  seat: number;
  type: BotType;
  stats: BotStats;
  rng: Rng;
  /** Profile of another seat, when the bot has one. */
  profile: (seat: number) => Profile | undefined;
  /** Monte Carlo samples per equity estimate. */
  samples?: number;
}

export interface Decision {
  action: Action;
  move: Move;
  /** Suggested time to pretend to think, in milliseconds. */
  thinkMs: number;
  /** What the bot believed when it decided. */
  view: Context;
}

export interface Context {
  street: Street;
  preflop: boolean;
  /** 0 = first to act after the flop, 1 = button. */
  position: number;
  isSB: boolean;
  isBB: boolean;
  pot: number;
  toCall: number;
  /** Equity needed to call: toCall / (pot + toCall). */
  required: number;
  /** Bet faced relative to the pot before it. */
  betRatio: number;
  facingBet: boolean;
  /** Preflop: someone has raised beyond the big blind. */
  facingRaise: boolean;
  raisesThisStreet: number;
  limpers: number;
  opponents: number;
  stack: number;
  stackBB: number;
  spr: number;
  /** Seats of the live opponents. */
  opponentSeats: number[];
  /** Equity as the bot sees it (noise applied). */
  equity: number;
  trueEquity: number;
  /** 0 best .. 1 worst starting hand. */
  percentile: number;
  made: HandCategory | -1;
  flushDraw: boolean;
  straightOuts: number;
  tilt: number;
  effIq: number;
  effRead: number;
  wasPreflopAggressor: boolean;
  aggressorSeat: number | null;
  aggressorProfile: Profile | undefined;
  aggressorLastMs: number | undefined;
  shortestOpponentBB: number;
  facingAllIn: boolean;
}

const SIZE: Record<'small' | 'medium' | 'big', number> = { small: 0.45, medium: 0.7, big: 1.1 };
/** Postflop bets as a share of the pot, scaled per type: the weak players bet smaller and odder. */
const SIZE_SCALE: Record<BotType, number> = { nit: 0.85, tourist: 0.7, calculator: 1, pro: 1 };
const PREFLOP_MULT: Record<'small' | 'medium' | 'big', number> = { small: 2.2, medium: 2.8, big: 4 };
/** A re-raise before the flop is a multiple of the bet it is over, not of the pot. */
const PREFLOP_RERAISE: Record<'small' | 'medium' | 'big', number> = { small: 2.3, medium: 2.8, big: 3.5 };

function gaussian(rng: Rng): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

// ---- reading the table ---------------------------------------------------------------------------

function drawInfo(hole: readonly Card[], board: readonly Card[]): { flushDraw: boolean; straightOuts: number } {
  if (board.length === 0 || board.length === 5) return { flushDraw: false, straightOuts: 0 };
  const suits = [0, 0, 0, 0];
  let mask = 0;
  for (const c of [...hole, ...board]) {
    suits[suitOf(c)]++;
    mask |= 1 << rankOf(c);
  }
  const flushDraw = suits.some((n) => n === 4);
  if (straightHigh(mask) >= 0) return { flushDraw, straightOuts: 0 };
  let outs = 0;
  for (let r = 0; r < 13; r++) {
    if (mask & (1 << r)) continue;
    if (straightHigh(mask | (1 << r)) >= 0) outs += 4;
  }
  return { flushDraw, straightOuts: outs };
}

/** Estimated fraction of starting hands an opponent continues with, from their preflop action and profile. */
function estimateRange(profile: Profile | undefined, raised: boolean, called: boolean, read: number): number {
  const base = raised ? 0.15 : called ? 0.3 : 0.6;
  if (!profile || profile.hands < 8) return base;
  const observed = raised ? Math.max(0.04, pfrRate(profile)) : Math.max(0.08, vpipRate(profile));
  return lerp(base, observed, read * Math.min(1, profile.hands / 25));
}

export function buildContext(input: DecisionInput): Context {
  const { hand, seat, stats, rng } = input;
  const me = hand.player(seat);
  const legal = hand.legalActions()!;
  const street = hand.street!;
  const preflop = street === 'preflop';
  const live = hand.live();
  const opponentsList = live.filter((p) => p.seat !== seat);
  const pot = hand.potTotal();
  const toCall = legal.callAmount;
  const required = toCall > 0 ? toCall / (pot + toCall) : 0;
  const potBefore = Math.max(1, pot - (hand.currentBet - me.streetBet));
  const betRatio = toCall > 0 ? toCall / potBefore : 0;

  // Position: order of live players after the button; the button is last.
  const seats = hand.players.map((p) => p.seat);
  const bi = seats.indexOf(hand.button);
  const order: number[] = [];
  for (let k = 1; k <= seats.length; k++) {
    const s = seats[(bi + k) % seats.length];
    if (!hand.player(s).folded) order.push(s);
  }
  const position = order.length > 1 ? order.indexOf(seat) / (order.length - 1) : 1;

  // What happened this street and preflop.
  let raisesThisStreet = 0;
  let limpers = 0;
  let aggressorSeat: number | null = null;
  let aggressorIndex = -1;
  let preflopAggressor: number | null = null;
  const preflopRaised = new Set<number>();
  const preflopCalled = new Set<number>();
  let currentStreet: Street = 'preflop';
  hand.events.forEach((e, i) => {
    if (e.type === 'street') {
      currentStreet = e.street;
      raisesThisStreet = 0;
      aggressorSeat = null;
      return;
    }
    if (e.type !== 'action') return;
    const t = e.action.type;
    if (t === 'bet' || t === 'raise') {
      raisesThisStreet++;
      aggressorSeat = e.seat;
      aggressorIndex = i;
      if (currentStreet === 'preflop') {
        preflopAggressor = e.seat;
        preflopRaised.add(e.seat);
      }
    } else if (t === 'call' && currentStreet === 'preflop') {
      if (raisesThisStreet === 0) limpers++;
      preflopCalled.add(e.seat);
    }
  });
  void aggressorIndex;

  const tilt = stats.clarity / 100;
  const effIq = clamp((stats.iq / 100) * (1 - 0.5 * tilt), 0, 1);
  const effRead = clamp((stats.read / 100) * (1 - 0.5 * tilt), 0, 1);

  // Equity against estimated ranges when the bot is sharp enough to think in ranges.
  const ranges: (Range | null)[] = opponentsList.map((p) => {
    if (effIq < 0.45) return null;
    const pct = estimateRange(input.profile(p.seat), preflopRaised.has(p.seat), preflopCalled.has(p.seat), effRead);
    return rangeTop(lerp(1, pct, effIq));
  });
  const trueEquity = equity(me.hole, hand.board, opponentsList.length, { rng, samples: input.samples ?? 160, ranges });
  const noise = gaussian(rng) * 0.22 * (1 - effIq);
  const eq = clamp(trueEquity + noise, 0.02, 0.98);

  const made = hand.board.length >= 3 ? categoryOf(evaluate([...me.hole, ...hand.board])) : -1;
  const { flushDraw, straightOuts } = drawInfo(me.hole, hand.board);
  const stackBB = (me.stack + me.streetBet) / hand.bigBlind;
  const shortest = Math.min(...opponentsList.map((p) => (p.stack + p.streetBet) / hand.bigBlind));
  const aggressorProfile = aggressorSeat !== null ? input.profile(aggressorSeat) : undefined;
  const aggressorLastMs = aggressorProfile?.recent.at(-1)?.ms;

  return {
    street, preflop, position, isSB: seat === hand.sbSeat, isBB: seat === hand.bbSeat,
    pot, toCall, required, betRatio, facingBet: toCall > 0,
    facingRaise: preflop && hand.currentBet > hand.bigBlind,
    raisesThisStreet, limpers, opponents: opponentsList.length, stack: me.stack, stackBB, spr: me.stack / Math.max(1, pot),
    opponentSeats: opponentsList.map((p) => p.seat),
    equity: eq, trueEquity, percentile: preflopPercentile(me.hole), made, flushDraw, straightOuts,
    tilt, effIq, effRead, wasPreflopAggressor: preflopAggressor === seat, aggressorSeat, aggressorProfile,
    aggressorLastMs, shortestOpponentBB: shortest, facingAllIn: toCall >= me.stack,
  };
}

// ---- the four personalities -----------------------------------------------------------------------

const W = (fold: number, passive: number, small = 0, medium = 0, big = 0, allin = 0): Weights =>
  ({ fold, passive, small, medium, big, allin });

function nit(c: Context): Weights {
  const loosen = 1 + c.tilt * 0.8;
  if (c.preflop) {
    if (c.facingAllIn) return c.percentile <= 0.02 * loosen ? W(0, 1) : W(1, 0);
    if (!c.facingRaise) {
      if (c.percentile <= 0.04 * loosen) return W(0, 0.2, 0.3, 0.5);
      if (c.percentile <= (0.1 + 0.04 * c.position) * loosen) return W(0.1, 0.7, 0.2);
      return W(1, 0.02);
    }
    if (c.percentile <= 0.025 * loosen) return W(0, 0.4, 0, 0.4, 0.2, 0.05);
    if (c.percentile <= 0.08 * loosen && c.required <= 0.35) return W(0.1, 0.9);
    return W(1, 0.03);
  }
  const strong = c.equity >= 0.78;
  const good = c.equity >= 0.6;
  const draw = c.flushDraw || c.straightOuts >= 8;
  if (!c.facingBet) {
    if (strong) return W(0, 0.25, 0.3, 0.45);
    if (good) return W(0, 0.7, 0.3);
    return W(0, 0.98, 0.02);
  }
  if (c.facingAllIn) return c.equity >= 0.8 ? W(0, 1) : W(1, 0);
  const bigBet = c.betRatio >= 0.8;
  if (c.equity >= 0.85) return W(0, 0.5, 0, 0.3, 0.15, 0.05);
  if (strong) return bigBet ? W(0.3, 0.7) : W(0.05, 0.85, 0.1);
  if (good && !bigBet && c.required <= c.equity - 0.12) return W(0.2, 0.8);
  if (draw && c.required <= c.equity * 0.75) return W(0.3, 0.7);
  return W(0.95, 0.05);
}

function tourist(c: Context): Weights {
  const wild = 1 + c.tilt;
  if (c.preflop) {
    if (c.facingAllIn) return c.equity >= 0.4 ? W(0, 1) : W(1, 0);
    if (!c.facingRaise) {
      if (c.percentile <= 0.55) return W(0, 0.55, 0.15, 0.2, 0.1 * wild, c.stackBB < 20 ? 0.1 * wild : 0);
      return W(0.8, 0.2);
    }
    if (c.percentile <= 0.5) return W(0.15, 0.7, 0.03, 0.08, 0.03 * wild, c.stackBB < 30 ? 0.02 * wild : 0);
    return W(0.85, 0.15);
  }
  const something = c.made >= HandCategory.Pair || c.flushDraw || c.straightOuts >= 4;
  // Shoving is for when the stack is not much bigger than the pot; otherwise it becomes a big bet.
  const shove = c.spr < 4 ? 1 : 0;
  if (!c.facingBet) {
    if (something) return W(0, 0.3, 0.2, 0.3, 0.15 * wild + 0.05 * wild * (1 - shove), 0.05 * wild * shove);
    return W(0, 0.75, 0.12, 0.1, 0.03 * wild);
  }
  if (c.facingAllIn) return c.equity >= 0.38 ? W(0, 1) : W(1, 0);
  if (c.equity >= 0.7) return W(0, 0.4, 0.05, 0.25, 0.2 + 0.1 * wild * (1 - shove), 0.1 * wild * shove);
  if (something) return W(0.1, 0.65, 0.05, 0.1, 0.05 + 0.05 * wild * (1 - shove), 0.05 * wild * shove);
  if (c.betRatio < 0.5) return W(0.5, 0.4, 0, 0.05, 0.05);
  return W(0.75, 0.15, 0, 0.05, 0.05);
}

interface CalcParams {
  bluffMult: number;
  cbet: number;
  valueThreshold: number;
  callLight: number;
  trap: number;
  openBoost: number;
  threeBetBoost: number;
}

const CALC_DEFAULT: CalcParams = { bluffMult: 1, cbet: 0.45, valueThreshold: 0.55, callLight: 1, trap: 0, openBoost: 0, threeBetBoost: 0 };

function calculator(c: Context, p: CalcParams = CALC_DEFAULT): Weights {
  if (c.preflop) {
    if (c.facingAllIn) return c.equity >= c.required + 0.03 ? W(0, 1) : W(1, 0);
    if (c.stackBB < 12) {
      if (!c.facingRaise) {
        const pushPct = 0.12 + 0.2 * c.position + p.openBoost;
        return c.percentile <= pushPct ? W(0, 0, 0, 0, 0, 1) : c.isBB ? W(0, 1) : W(1, 0);
      }
      return c.equity >= c.required + 0.05 ? W(0, 0, 0, 0, 0, 1) : W(1, 0);
    }
    if (!c.facingRaise) {
      let openPct = 0.12 + 0.18 * c.position + p.openBoost;
      if (c.isSB) openPct = 0.35 + p.openBoost;
      if (c.isBB) return c.percentile <= 0.1 ? W(0, 0.3, 0, 0.7) : W(0, 1);
      if (c.percentile <= openPct * 0.3) return W(0, 0.05, 0.1, 0.75, 0.1);
      if (c.percentile <= openPct) return W(0, 0.1, 0.3, 0.6);
      return W(1, 0);
    }
    if (c.raisesThisStreet >= 2) {
      if (c.percentile <= 0.02) return W(0, 0.3, 0, 0.3, 0.2, 0.2);
      if (c.percentile <= 0.07 && c.toCall <= 0.2 * c.stack) return W(0.1, 0.9);
      return W(1, 0);
    }
    const looseOpener = c.aggressorProfile ? pfrRate(c.aggressorProfile) > 0.25 : false;
    const threeBet = 0.045 + (looseOpener ? 0.04 * c.effRead : 0) + p.threeBetBoost;
    if (c.percentile <= threeBet) return W(0, 0.3, 0, 0.55, 0.1, c.stackBB < 25 ? 0.05 : 0);
    const callPct = c.isBB ? 0.3 : 0.16;
    if ((c.percentile <= callPct || c.equity >= c.required + 0.08) && c.betRatio <= 2.5) return W(0.05, 0.95);
    return W(1, 0);
  }

  const vt = p.valueThreshold + 0.05 * (c.opponents - 1);
  const strongDraw = c.flushDraw || c.straightOuts >= 8;
  const eqAdj = c.equity + (strongDraw && c.street !== 'river' ? 0.05 : 0);
  if (!c.facingBet) {
    if (c.equity >= 0.8) {
      if (p.trap > 0 && c.position < 0.5) return W(0, 0.15 + p.trap, 0.15, 0.5, 0.2, c.spr < 2.5 ? 0.1 : 0);
      return W(0, 0.15, 0.15, 0.5, 0.2, c.spr < 2.5 ? 0.1 : 0);
    }
    if (c.equity >= vt) return W(0, 0.3, 0.3, 0.4);
    if (strongDraw && c.position > 0.5) return W(0, 0.5, 0.2 * p.bluffMult, 0.3 * p.bluffMult);
    if (c.wasPreflopAggressor && c.opponents === 1) return W(0, 1 - p.cbet, 0.6 * p.cbet, 0.4 * p.cbet);
    return W(0, 1, 0.05 * p.bluffMult, 0.04 * p.bluffMult);
  }
  if (c.facingAllIn) return c.equity >= c.required + 0.02 ? W(0, 1) : W(1, 0);
  if (c.equity >= 0.8) return W(0, 0.3 + p.trap, 0, 0.35, 0.25, c.spr < 3 ? 0.1 : 0);
  if (eqAdj >= c.required * p.callLight + 0.03) return W(0.05, 0.85, 0, c.equity >= 0.65 ? 0.1 : 0);
  return W(0.95, 0.05);
}

function pro(c: Context, profileOf: (seat: number) => Profile | undefined): Weights {
  const r = c.effRead;
  // Facing a bet: read the bettor. Otherwise: read whoever is left to bluff or value-bet into.
  const targets = c.facingBet && c.aggressorSeat !== null ? [c.aggressorSeat] : c.opponentSeats;
  const profs = targets.map(profileOf).filter((p): p is Profile => !!p && p.hands >= 10);
  const known = profs.length > 0;
  const avg = (f: (p: Profile) => number, def: number) => (known ? profs.reduce((a, p) => a + f(p), 0) / profs.length : def);
  const f = avg(foldToBet, 0.45);
  const a = avg(aggression, 0.4);
  const station = known && f < 0.4;
  const weak = known && f > 0.55;
  const maniac = known && a > 0.6;
  const multiway = c.opponents >= 3;
  // Tight players left to act: steal their blinds.
  const toActProfs = c.opponentSeats.map(profileOf).filter((p): p is Profile => !!p && p.hands >= 10);
  const tightLeft = toActProfs.length > 0 && toActProfs.every((p) => vpipRate(p) < 0.18);
  const params: CalcParams = {
    bluffMult: station || multiway ? 0.3 : weak ? 1 + (f - 0.4) * 5 * r : 1 + 0.4 * r,
    cbet: station ? 0.3 : 0.45 + 0.3 * r * (weak ? 1 : 0.5),
    valueThreshold: 0.55 - (station ? 0.07 * r : 0),
    callLight: maniac ? 1 - 0.15 * r : 1,
    trap: maniac ? 0.5 * r : 0,
    openBoost: (tightLeft ? 0.18 * r : 0.02 * r) + (c.shortestOpponentBB < 10 && c.stackBB > 25 ? 0.08 * r : 0),
    threeBetBoost: 0.02 * r,
  };
  // Timing tells: a quick bet from a known player is usually weaker, a long tank then a bet stronger.
  const view = { ...c };
  const prof = c.aggressorProfile;
  if (c.facingBet && prof && prof.timedBets >= 4 && c.aggressorLastMs !== undefined) {
    const fast = fastBetRate(prof);
    if (c.aggressorLastMs < 1500 && fast > 0.5) view.equity = clamp(c.equity + 0.05 * r, 0.02, 0.98);
    if (c.aggressorLastMs > 7000) view.equity = clamp(c.equity - 0.04 * r, 0.02, 0.98);
  }
  return calculator(view, params);
}

const POLICIES: Record<BotType, (c: Context, profileOf: (seat: number) => Profile | undefined) => Weights> = {
  nit, tourist, calculator: (c) => calculator(c), pro,
};

// ---- turning weights into an action -------------------------------------------------------------

function roundChips(amount: number, bigBlind: number): number {
  const unit = bigBlind >= 200 ? 100 : bigBlind >= 50 ? 25 : 5;
  return Math.round(amount / unit) * unit;
}

function sizeToAction(hand: Hand, legal: LegalActions, c: Context, move: 'small' | 'medium' | 'big', type: BotType = 'pro'): Action | null {
  const me = hand.player(legal.seat);
  const share = SIZE[move] * SIZE_SCALE[type];
  if (legal.canBet) {
    let amount = roundChips(c.pot * share, hand.bigBlind);
    amount = clamp(amount, legal.minBet, legal.maxTo);
    return { type: 'bet', amount };
  }
  if (legal.canRaise) {
    let amount: number;
    if (c.preflop && c.raisesThisStreet === 0) {
      amount = hand.bigBlind * PREFLOP_MULT[move] + c.limpers * hand.bigBlind;
    } else if (c.preflop) {
      // Three-bets and four-bets scale with the raise in front, so a 3bb open draws 7 to 10bb, not 25.
      // The weak players mostly min-raise; the scale pulls their multiple down to the floor.
      amount = hand.currentBet * PREFLOP_RERAISE[move] * (type === 'tourist' ? 0.8 : 1) + c.limpers * hand.bigBlind;
    } else {
      amount = hand.currentBet + (c.pot + c.toCall) * share;
    }
    amount = clamp(roundChips(amount, hand.bigBlind), legal.minRaiseTo, legal.maxTo);
    // A raise that leaves crumbs behind is just a shove.
    if (legal.maxTo - amount < hand.bigBlind * 2) amount = legal.maxTo;
    void me;
    return { type: 'raise', amount };
  }
  return null;
}

function applyTilt(w: Weights, c: Context): Weights {
  const t = c.tilt;
  return {
    fold: w.fold * (1 - 0.5 * t),
    passive: w.passive,
    small: w.small * (1 + t),
    medium: w.medium * (1 + 1.2 * t),
    big: w.big * (1 + 1.5 * t),
    allin: w.allin * (1 + 2 * t) + (t > 0.6 ? 0.03 * (t - 0.6) : 0),
  };
}

function sample(w: Weights, rng: Rng): Move {
  const moves: Move[] = ['fold', 'passive', 'small', 'medium', 'big', 'allin'];
  const total = moves.reduce((s, m) => s + Math.max(0, w[m]), 0);
  if (total <= 0) return 'passive';
  let x = rng() * total;
  for (const m of moves) {
    x -= Math.max(0, w[m]);
    if (x <= 0) return m;
  }
  return 'passive';
}

function thinkTime(type: BotType, c: Context, move: Move, rng: Rng): number {
  const base: Record<BotType, [number, number]> = {
    nit: [2600, 1400], tourist: [1300, 800], calculator: [2100, 1000], pro: [1900, 1200],
  };
  const [mean, sd] = base[type];
  let ms = mean + gaussian(rng) * sd;
  const hard = c.facingBet && Math.abs(c.equity - c.required) < 0.12;
  if (hard) ms *= 1.6;
  if (move === 'allin' || c.facingAllIn) ms *= 1.5;
  if (c.preflop && move === 'fold' && c.percentile > 0.4) ms *= 0.45;
  if (type === 'pro' && rng() < 0.25) ms = mean * (rng() < 0.5 ? 0.4 : 2.2);
  ms *= 1 - 0.5 * c.tilt;
  return Math.max(450, Math.round(ms));
}

export function decide(input: DecisionInput): Decision {
  const { hand, rng, type } = input;
  const legal = hand.legalActions();
  if (!legal || legal.seat !== input.seat) throw new Error(`seat ${input.seat} is not to act`);
  const c = buildContext(input);
  let w = applyTilt(POLICIES[type](c, input.profile), c);

  // Never fold when a check is free; never try to bet when no one can call.
  if (!c.facingBet) w.fold = 0;
  if (!legal.canBet && !legal.canRaise) {
    w.passive += w.small + w.medium + w.big + w.allin;
    w.small = w.medium = w.big = w.allin = 0;
  }
  let move = sample(w, rng);
  let action: Action;
  switch (move) {
    case 'fold':
      action = { type: 'fold' };
      break;
    case 'passive':
      action = legal.canCheck ? { type: 'check' } : { type: 'call' };
      break;
    case 'allin':
      action = legal.canBet ? { type: 'bet', amount: legal.maxTo } : legal.canRaise ? { type: 'raise', amount: legal.maxTo } : legal.canCheck ? { type: 'check' } : { type: 'call' };
      break;
    default: {
      const sized = sizeToAction(hand, legal, c, move, type);
      if (sized) action = sized;
      else {
        move = 'passive';
        action = legal.canCheck ? { type: 'check' } : { type: 'call' };
      }
    }
  }
  return { action, move, thinkMs: thinkTime(type, c, move, rng), view: c };
}
