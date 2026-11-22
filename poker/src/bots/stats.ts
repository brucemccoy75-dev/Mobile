// Bot types, stats and the clarity (tilt) model.
import { type Hand } from '../engine/hand';
import { type Rng } from '../engine/rng';
import { equity } from './equity';

export type BotType = 'nit' | 'tourist' | 'calculator' | 'pro';

export const BOT_TYPES: BotType[] = ['nit', 'tourist', 'calculator', 'pro'];

export interface BotStats {
  /** How well the bot judges odds and position. 0..100. */
  iq: number;
  /** How well the bot uses other players' history. 0..100. */
  read: number;
  /** Tilt. 0 = calm, 100 = steaming. */
  clarity: number;
}

/** Proposed stat ranges per type (design doc section 3). */
export const STAT_RANGES: Record<BotType, { iq: [number, number]; read: [number, number]; clarity: [number, number] }> = {
  nit: { iq: [35, 55], read: [20, 40], clarity: [10, 30] },
  tourist: { iq: [20, 40], read: [15, 35], clarity: [10, 30] },
  calculator: { iq: [75, 95], read: [40, 60], clarity: [10, 30] },
  pro: { iq: [80, 95], read: [80, 95], clarity: [10, 30] },
};

/** How strongly each type tilts, and how fast it calms down. */
const TILT_SENSITIVITY: Record<BotType, { up: number; down: number }> = {
  nit: { up: 1.3, down: 0.8 },
  tourist: { up: 1.2, down: 1.0 },
  calculator: { up: 0.8, down: 1.3 },
  pro: { up: 0.6, down: 1.4 },
};

export function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

export interface HandOutcome {
  /** Chips won (positive) or lost (negative) over the hand. */
  net: number;
  /** Stack after the hand. */
  stackAfter: number;
  /** Highest equity against the eventual winner's hand at any point the bot put chips in. */
  bestEquity: number;
  /** True when the bot lost at showdown as a clear favorite. */
  badBeat: boolean;
  /** True when the bot won at showdown as a clear underdog. */
  suckOut: boolean;
}

/**
 * What happened to `seat` this hand, as far as tilt is concerned. Equity is measured against the
 * actual winner's hole cards at each street where the bot put chips in.
 */
export function handOutcome(hand: Hand, seat: number, rng: Rng): HandOutcome {
  const me = hand.player(seat);
  const net = me.stack - me.startStack;
  const end = hand.events[hand.events.length - 1];
  const winners = end.type === 'end' ? end.winners : [];
  const showdown = hand.events.some((e) => e.type === 'showdown');
  const outcome: HandOutcome = { net, stackAfter: me.stack, bestEquity: 0.5, badBeat: false, suckOut: false };
  if (!showdown || me.folded) return outcome;

  // The hand that beat us (or that we beat): the biggest winner other than us, or us.
  const iWon = winners.includes(seat);
  const rival = iWon
    ? hand.players.filter((p) => !p.folded && p.seat !== seat).sort((a, b) => a.stack - b.stack)[0]
    : hand.players.find((p) => winners.includes(p.seat));
  if (!rival) return outcome;

  // Walk the events to find the board at each street where we committed chips.
  let board: number[] = [];
  let committedThisStreet = false;
  let best = 0;
  let any = false;
  const sample = () => {
    const eq = equity(me.hole, board, 1, { rng, samples: 120, ranges: [[[rival.hole[0], rival.hole[1]]]] });
    best = Math.max(best, eq);
    any = true;
  };
  for (const e of hand.events) {
    if (e.type === 'post' && e.seat === seat && e.amount > 0) committedThisStreet = true;
    if (e.type === 'action' && e.seat === seat && e.amount > 0) committedThisStreet = true;
    if (e.type === 'street') {
      if (committedThisStreet) sample();
      board = e.board;
      committedThisStreet = false;
    }
  }
  if (committedThisStreet) sample();
  if (!any) return outcome;
  outcome.bestEquity = best;
  outcome.badBeat = !iWon && best >= 0.65;
  outcome.suckOut = iWon && best <= 0.35;
  return outcome;
}

/**
 * Moves clarity after a hand. Bad beats and big losses push it up; wins pull it down; quiet hands
 * drift it down a point.
 */
export function updateClarity(stats: BotStats, type: BotType, outcome: HandOutcome, temper = 1): number {
  const base = TILT_SENSITIVITY[type];
  const sens = { up: base.up * temper, down: base.down / Math.sqrt(temper) };
  const before = stats.clarity;
  // Losses: the fraction of the stack that went (busting = 1). Wins: the gain relative to the stack
  // before the hand (doubling up = 1).
  const stackBefore = outcome.stackAfter - outcome.net;
  const impact = outcome.net < 0
    ? Math.abs(outcome.net) / Math.max(1, stackBefore)
    : Math.min(1, outcome.net / Math.max(1, stackBefore));
  let delta = -1.5;
  if (outcome.net < 0) {
    if (outcome.badBeat) {
      const severity = (outcome.bestEquity - 0.5) / 0.5;
      delta += 45 * severity * (0.3 + 0.7 * impact) * sens.up;
    } else {
      delta += 12 * impact * sens.up;
    }
  } else if (outcome.net > 0) {
    delta -= 30 * impact * sens.down;
  }
  stats.clarity = clamp(Math.round(stats.clarity + delta), 0, 100);
  return stats.clarity - before;
}
