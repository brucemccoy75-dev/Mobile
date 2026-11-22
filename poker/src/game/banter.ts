// Decides who says what, when. Lines are picked by trigger and mood from each character's set,
// never repeated until the set runs dry, and rate-limited so the table stays readable.
import { LINES } from '../content/lines';
import { type Line, type Mood, type Trigger } from '../content/triggers';
import { HandCategory, categoryOf, evaluate } from '../engine/evaluator';
import { type Hand } from '../engine/hand';
import { type Rng } from '../engine/rng';
import { HUMAN_SEAT, type TableEvent } from './table';
import { preflopPercentile } from '../bots/equity';

export interface Speech {
  seat: number;
  /** 'dealer' for the dealer, otherwise the character id. */
  speaker: string;
  text: string;
  trigger: Trigger;
}

export const DEALER_SEAT = -1;

interface Vars {
  target?: string;
  hand?: string;
  amount?: number;
}

export interface BanterTable {
  /** Character id per seat. Human is 'human'. */
  ids: Map<number, string>;
  names: Map<number, string>;
  /** Clarity per bot seat, for mood. */
  clarity: (seat: number) => number;
}

const COOLDOWN_MS = 11000;
const GLOBAL_GAP_MS = 1800;
const URGENT: Trigger[] = ['badBeatTaken', 'stackedTarget', 'stackedByTarget', 'allIn', 'headsUp'];

export class Banter {
  private used = new Map<string, Set<Line>>();
  private lastSpoke = new Map<string, number>();
  private lastAny = 0;
  private rng: Rng;
  private now: () => number;
  private hand: Hand | null = null;
  private lastAggressor: number | null = null;
  private humanLastThink = 0;
  /** Chance multiplier; 0 silences the table. */
  density = 1;

  constructor(rng: Rng, now: () => number = () => Date.now()) {
    this.rng = rng;
    this.now = now;
  }

  /** Feeds a table event; returns at most one thing someone says. */
  onEvent(ev: TableEvent, table: BanterTable): Speech | null {
    switch (ev.type) {
      case 'handStart': {
        this.hand = ev.hand;
        this.lastAggressor = null;
        const bots = this.botsInHand(table);
        const bb = ev.level.bb;
        for (const seat of this.shuffled(bots)) {
          const stack = ev.stacks[seat] ?? 0;
          const total = Object.values(ev.stacks).reduce((a, b) => a + b, 0);
          if (stack / bb < 10 && this.chance(0.18)) return this.say(seat, 'shortStack', table);
          if (stack > total * 0.42 && this.chance(0.1)) return this.say(seat, 'chipLeader', table);
        }
        if (bots.length > 0 && this.chance(0.05)) return this.say(this.pick(bots), 'dealtIn', table);
        if (this.chance(0.03)) return this.say(DEALER_SEAT, 'dealtIn', table);
        return null;
      }
      case 'action':
        return this.onAction(ev, table);
      case 'handEnd':
        return this.onHandEnd(ev, table);
      case 'bust': {
        const gone = ev.seats[0];
        const bots = this.seatsOf(table).filter((s) => s !== gone && !ev.seats.includes(s));
        if (bots.length > 0 && this.chance(0.5)) return this.say(this.pick(bots), 'playerOut', table, { target: table.names.get(gone) });
        if (this.chance(0.4)) return this.say(DEALER_SEAT, 'playerOut', table, { target: table.names.get(gone) });
        return null;
      }
      case 'turn': {
        if (ev.seat === HUMAN_SEAT) return null;
        // Facing a shove: a reaction from the one deciding.
        if (this.hand && ev.legal.callAmount >= this.hand.player(ev.seat).stack * 0.6 && ev.legal.callAmount > 0 && this.chance(0.3)) {
          return this.say(ev.seat, 'facingAllIn', table, { target: this.aggressorName(table) });
        }
        // Table chatter from someone who has folded.
        const idle = this.botsInHand(table).filter((s) => s !== ev.seat && this.hand!.player(s).folded);
        if (idle.length > 0 && this.chance(0.035)) return this.say(this.pick(idle), 'idle', table);
        if (this.chance(0.01)) return this.say(DEALER_SEAT, 'idle', table);
        return null;
      }
      case 'level':
        return null;
      default:
        return null;
    }
  }

  /** Call when the hand reaches heads-up (two players left in the tournament). */
  headsUp(table: BanterTable): Speech | null {
    const bots = this.seatsOf(table);
    if (bots.length > 0 && this.chance(0.7)) return this.say(bots[0], 'headsUp', table, { target: table.names.get(HUMAN_SEAT) });
    return this.say(DEALER_SEAT, 'headsUp', table);
  }

  private onAction(ev: Extract<TableEvent, { type: 'action' }>, table: BanterTable): Speech | null {
    const hand = this.hand;
    if (!hand) return null;
    const type = ev.action.type;
    const pot = hand.potTotal();
    const bigPot = pot > 0.3 * this.avgStack();
    const damp = bigPot ? 0.5 : 1;
    const aggressorBefore = this.lastAggressor;
    if (type === 'bet' || type === 'raise') this.lastAggressor = ev.seat;

    if (ev.seat === HUMAN_SEAT) {
      this.humanLastThink = ev.thinkMs;
      const bots = this.botsInHand(table).filter((s) => !hand.player(s).folded);
      if (bots.length === 0) return null;
      if (ev.thinkMs > 12000 && this.chance(0.35)) return this.say(this.pick(bots), 'targetTank', table, { target: table.names.get(HUMAN_SEAT) });
      if (ev.thinkMs < 700 && type !== 'fold' && this.chance(0.15)) return this.say(this.pick(bots), 'targetInstant', table, { target: table.names.get(HUMAN_SEAT) });
      if (type === 'fold' && aggressorBefore !== null && aggressorBefore !== HUMAN_SEAT && this.chance(0.22 * damp)) {
        return this.say(aggressorBefore, 'targetFoldsToMe', table, { target: table.names.get(HUMAN_SEAT) });
      }
      return null;
    }

    const me = hand.player(ev.seat);
    if (ev.allIn && type !== 'fold' && type !== 'check' && this.chance(0.6)) return this.say(ev.seat, 'allIn', table, { target: this.aggressorName(table, aggressorBefore) });
    switch (type) {
      case 'fold':
        if (ev.street === 'preflop' && this.chance(0.05 * damp)) return this.say(ev.seat, 'foldPreflop', table);
        return null;
      case 'bet':
      case 'raise': {
        const over = aggressorBefore !== null && aggressorBefore !== ev.seat;
        if (this.chance((over ? 0.14 : 0.1) * damp)) return this.say(ev.seat, over ? 'reraise' : 'raise', table, { target: over ? table.names.get(aggressorBefore!) : undefined });
        return null;
      }
      case 'call': {
        const big = ev.amount >= 0.35 * (pot - ev.amount) || ev.amount >= 0.25 * (me.stack + ev.amount);
        if (big && this.chance(0.2)) return this.say(ev.seat, 'callBig', table, { target: this.aggressorName(table, aggressorBefore) });
        return null;
      }
      default:
        return null;
    }
  }

  private onHandEnd(ev: Extract<TableEvent, { type: 'handEnd' }>, table: BanterTable): Speech | null {
    const hand = ev.hand;
    const showdown = hand.events.some((e) => e.type === 'showdown');
    const winners = ev.winners;
    const live = hand.live().map((p) => p.seat);
    const losers = live.filter((s) => !winners.includes(s));
    const biggestLoser = losers.sort((a, b) => (hand.player(a).committed - hand.player(b).committed))[losers.length - 1];
    const riverAggressor = this.lastAggressorOnRiver(hand);
    const candidates: { seat: number; t: Trigger; p: number; vars: Vars }[] = [];
    const name = (s: number | undefined) => (s === undefined ? undefined : table.names.get(s));
    const busted = (s: number) => hand.player(s).stack === 0;

    for (const [seatKey, outcome] of Object.entries(ev.outcomes)) {
      const seat = Number(seatKey);
      if (!outcome || seat === HUMAN_SEAT) continue;
      const won = winners.includes(seat);
      const p = hand.player(seat);
      if (p.folded) continue;
      if (won) {
        const target = biggestLoser;
        if (target !== undefined && busted(target)) candidates.push({ seat, t: 'stackedTarget', p: 0.9, vars: { target: name(target) } });
        if (!showdown) {
          const weak = this.isWeak(hand, seat);
          if (weak && this.lastAggressor === seat) candidates.push({ seat, t: 'bluffWorked', p: 0.3, vars: {} });
          else candidates.push({ seat, t: 'winNoShowdown', p: 0.15, vars: { target: name(target) } });
        } else {
          if (outcome.suckOut) candidates.push({ seat, t: 'badBeatGiven', p: 0.45, vars: { target: name(target) } });
          if (target !== undefined && riverAggressor === seat && target === HUMAN_SEAT) candidates.push({ seat, t: 'targetCallsMeDown', p: 0.45, vars: { target: name(target) } });
          candidates.push({ seat, t: 'winShowdown', p: 0.3, vars: { target: name(target), hand: this.shown(hand, seat) } });
        }
      } else if (showdown) {
        const target = winners[0];
        if (busted(seat)) candidates.push({ seat, t: 'stackedByTarget', p: 0.85, vars: { target: name(target) } });
        if (outcome.badBeat) candidates.push({ seat, t: 'badBeatTaken', p: 0.8, vars: { target: name(target) } });
        if (riverAggressor === seat && this.isWeak(hand, seat)) candidates.push({ seat, t: 'bluffCaught', p: 0.55, vars: { target: name(target) } });
        candidates.push({ seat, t: 'loseShowdown', p: 0.28, vars: { target: name(target) } });
      }
    }
    // The dealer announces showdown winners now and then.
    if (showdown && winners.length === 1 && this.chance(0.12)) {
      candidates.push({ seat: DEALER_SEAT, t: 'winShowdown', p: 1, vars: { hand: this.shown(hand, winners[0]) } });
    }
    for (const c of this.shuffled(candidates.sort((a, b) => b.p - a.p))) {
      if (this.chance(c.p)) {
        const s = this.say(c.seat, c.t, table, c.vars);
        if (s) return s;
      }
    }
    return null;
  }

  // ---- helpers -----------------------------------------------------------------------------------

  private say(seat: number, trigger: Trigger, table: BanterTable, vars: Vars = {}): Speech | null {
    const id = seat === DEALER_SEAT ? 'dealer' : table.ids.get(seat);
    if (!id || id === 'human') return null;
    const now = this.now();
    const urgent = URGENT.includes(trigger);
    if (!urgent && now - this.lastAny < GLOBAL_GAP_MS) return null;
    if (now - (this.lastSpoke.get(id) ?? -1e9) < (urgent ? COOLDOWN_MS / 3 : COOLDOWN_MS)) return null;
    const mood: Mood = seat !== DEALER_SEAT && table.clarity(seat) >= 55 ? 'tilted' : 'calm';
    const line = this.pickLine(id, trigger, mood);
    if (!line) return null;
    this.lastAny = now;
    this.lastSpoke.set(id, now);
    const text = line.s
      .replace(/\{target\}/g, vars.target ?? 'friend')
      .replace(/\{hand\}/g, vars.hand ?? 'the hand')
      .replace(/\{amount\}/g, String(vars.amount ?? ''));
    return { seat, speaker: id, text, trigger };
  }

  private pickLine(id: string, trigger: Trigger, mood: Mood): Line | null {
    const all = (LINES[id] ?? []).filter((l) => l.t === trigger && (!l.m || l.m === 'any' || l.m === mood));
    // Tilted players prefer tilted lines when there are any.
    const tilted = mood === 'tilted' ? all.filter((l) => l.m === 'tilted') : [];
    const pool = tilted.length > 0 && this.chance(0.7) ? tilted : all;
    if (pool.length === 0) return null;
    let used = this.used.get(id);
    if (!used) {
      used = new Set();
      this.used.set(id, used);
    }
    let fresh = pool.filter((l) => !used.has(l));
    if (fresh.length === 0) {
      for (const l of pool) used.delete(l);
      fresh = pool;
    }
    const line = this.pick(fresh);
    used.add(line);
    return line;
  }

  private chance(p: number): boolean {
    return this.rng() < p * this.density;
  }

  private pick<T>(items: T[]): T {
    return items[Math.floor(this.rng() * items.length)];
  }

  private shuffled<T>(items: T[]): T[] {
    const out = [...items];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  private seatsOf(table: BanterTable): number[] {
    return [...table.ids.entries()].filter(([s, id]) => id !== 'human' && s !== DEALER_SEAT).map(([s]) => s);
  }

  private botsInHand(table: BanterTable): number[] {
    const hand = this.hand;
    return this.seatsOf(table).filter((s) => hand?.players.some((p) => p.seat === s));
  }

  private avgStack(): number {
    const hand = this.hand;
    if (!hand) return 10000;
    return hand.players.reduce((a, p) => a + p.stack + p.committed, 0) / hand.players.length;
  }

  private aggressorName(table: BanterTable, seat: number | null = this.lastAggressor): string | undefined {
    return seat === null ? undefined : table.names.get(seat);
  }

  private isWeak(hand: Hand, seat: number): boolean {
    const p = hand.player(seat);
    if (hand.board.length < 3) return preflopPercentile(p.hole) > 0.45;
    return categoryOf(evaluate([...p.hole, ...hand.board])) <= HandCategory.Pair;
  }

  private shown(hand: Hand, seat: number): string | undefined {
    const e = hand.events.find((x) => x.type === 'showdown' && x.seat === seat);
    return e && e.type === 'showdown' ? e.description : undefined;
  }

  private lastAggressorOnRiver(hand: Hand): number | null {
    let onRiver = false;
    let seat: number | null = null;
    for (const e of hand.events) {
      if (e.type === 'street') onRiver = e.street === 'river';
      if (onRiver && e.type === 'action' && (e.action.type === 'bet' || e.action.type === 'raise')) seat = e.seat;
    }
    return seat;
  }
}
