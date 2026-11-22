// What a bot remembers about another player: tendencies measured from the hands it has seen.
import { type Hand, type Street } from '../engine/hand';
import { categoryOf } from '../engine/evaluator';

export interface RecentAction {
  hand: number;
  street: Street;
  action: 'fold' | 'check' | 'call' | 'bet' | 'raise';
  amount: number;
  /** Pot before the action. */
  pot: number;
  toCall: number;
  allIn: boolean;
  /** Decision time, when known. */
  ms?: number;
}

export interface ShownHand {
  hand: number;
  cards: number[];
  description: string;
  /** Was the player the last aggressor on the river? */
  aggressor: boolean;
}

export interface Profile {
  hands: number;
  vpip: number;
  pfr: number;
  aggressive: number;
  passive: number;
  foldOpps: number;
  folds: number;
  showdowns: number;
  /** Sum of hand categories shown (0..8), for an average strength. */
  showdownStrength: number;
  /** Times the player bet or raised the river and showed a weak hand. */
  bluffsShown: number;
  /** Timing samples: bets and raises made quickly vs slowly. */
  fastBets: number;
  slowBets: number;
  timedBets: number;
  recent: RecentAction[];
  shown: ShownHand[];
}

export function newProfile(): Profile {
  return {
    hands: 0, vpip: 0, pfr: 0, aggressive: 0, passive: 0, foldOpps: 0, folds: 0, showdowns: 0,
    showdownStrength: 0, bluffsShown: 0, fastBets: 0, slowBets: 0, timedBets: 0, recent: [], shown: [],
  };
}

const RECENT_LIMIT = 15;
const SHOWN_LIMIT = 8;

/** Fraction of opportunities where the player folded to a bet, with a prior for small samples. */
export function foldToBet(p: Profile, prior = 0.45): number {
  return (p.folds + prior * 6) / (p.foldOpps + 6);
}

/** Bets and raises as a fraction of all non-fold actions. */
export function aggression(p: Profile, prior = 0.4): number {
  return (p.aggressive + prior * 6) / (p.aggressive + p.passive + 6);
}

export function vpipRate(p: Profile, prior = 0.3): number {
  return (p.vpip + prior * 6) / (p.hands + 6);
}

export function pfrRate(p: Profile, prior = 0.15): number {
  return (p.pfr + prior * 6) / (p.hands + 6);
}

/** 0..1, how often the player has bet quickly rather than slowly. */
export function fastBetRate(p: Profile): number {
  return p.timedBets === 0 ? 0.5 : p.fastBets / p.timedBets;
}

/**
 * Updates profiles for every seat from a completed hand. `timings` maps the index of an action
 * event in `hand.events` to the decision time in milliseconds, when known.
 */
export function observeHand(profiles: Map<number, Profile>, hand: Hand, timings?: Map<number, number>): void {
  const get = (seat: number): Profile => {
    let p = profiles.get(seat);
    if (!p) {
      p = newProfile();
      profiles.set(seat, p);
    }
    return p;
  };
  for (const p of hand.players) get(p.seat).hands++;

  const streetBet = new Map<number, number>();
  for (const p of hand.players) streetBet.set(p.seat, 0);
  let currentBet = 0;
  let pot = 0;
  let street: Street = 'preflop';
  const vpipSeen = new Set<number>();
  const pfrSeen = new Set<number>();
  let riverAggressor: number | null = null;

  hand.events.forEach((e, index) => {
    if (e.type === 'post') {
      pot += e.amount;
      if (e.kind !== 'ante') {
        streetBet.set(e.seat, streetBet.get(e.seat)! + e.amount);
        currentBet = Math.max(currentBet, streetBet.get(e.seat)!);
      }
      return;
    }
    if (e.type === 'street') {
      street = e.street;
      currentBet = 0;
      for (const seat of streetBet.keys()) streetBet.set(seat, 0);
      return;
    }
    if (e.type !== 'action') return;
    const p = get(e.seat);
    const toCall = currentBet - streetBet.get(e.seat)!;
    const ms = timings?.get(index);
    p.recent.push({ hand: hand.handNumber, street, action: e.action.type, amount: e.amount, pot, toCall, allIn: e.allIn, ms });
    if (p.recent.length > RECENT_LIMIT) p.recent.shift();

    if (toCall > 0) p.foldOpps++;
    switch (e.action.type) {
      case 'fold':
        p.folds++;
        break;
      case 'check':
        p.passive++;
        break;
      case 'call':
        p.passive++;
        if (street === 'preflop') vpipSeen.add(e.seat);
        break;
      case 'bet':
      case 'raise':
        p.aggressive++;
        if (street === 'preflop') {
          vpipSeen.add(e.seat);
          pfrSeen.add(e.seat);
        }
        if (street === 'river') riverAggressor = e.seat;
        if (ms !== undefined) {
          p.timedBets++;
          if (ms < 1500) p.fastBets++;
          else if (ms > 6000) p.slowBets++;
        }
        break;
    }
    pot += e.amount;
    streetBet.set(e.seat, streetBet.get(e.seat)! + e.amount);
    currentBet = Math.max(currentBet, streetBet.get(e.seat)!);
  });

  for (const seat of vpipSeen) get(seat).vpip++;
  for (const seat of pfrSeen) get(seat).pfr++;

  for (const e of hand.events) {
    if (e.type !== 'showdown') continue;
    const p = get(e.seat);
    const category = categoryOf(e.score);
    p.showdowns++;
    p.showdownStrength += category;
    const aggressor = riverAggressor === e.seat;
    if (aggressor && category <= 1) p.bluffsShown++;
    p.shown.push({ hand: hand.handNumber, cards: e.cards, description: e.description, aggressor });
    if (p.shown.length > SHOWN_LIMIT) p.shown.shift();
  }
}
