// One hand of No-Limit Texas Hold'em: blinds and antes, dealing, four betting rounds, side pots, showdown.
// Pure state machine with no timing or UI. Every change is recorded as an event so hands can be replayed.
import { type Card, newDeck, shuffle } from './cards';
import { describeHand, evaluate } from './evaluator';
import { type Rng } from './rng';

export type Street = 'preflop' | 'flop' | 'turn' | 'river';
export type Phase = Street | 'showdown' | 'complete';

export interface HandSeat {
  seat: number;
  stack: number;
}

export interface HandConfig {
  /** Seats with chips, in seat order. */
  seats: HandSeat[];
  /** Seat holding the dealer button. Must be one of `seats`. */
  button: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  handNumber?: number;
  rng?: Rng;
  /** Fixed deck for tests. Dealt from the front: hole cards (one per player per round, starting left of the button), then flop, turn, river. */
  deck?: readonly Card[];
}

export type Action =
  | { type: 'fold' }
  | { type: 'check' }
  | { type: 'call' }
  /** Open a bet when no one has bet this street. `amount` is the total bet. */
  | { type: 'bet'; amount: number }
  /** Raise to `amount` total this street. */
  | { type: 'raise'; amount: number };

export interface LegalActions {
  seat: number;
  canFold: boolean;
  canCheck: boolean;
  /** Chips needed to call, capped at the stack. 0 when a check is available. */
  callAmount: number;
  canBet: boolean;
  /** Smallest legal opening bet (total). */
  minBet: number;
  canRaise: boolean;
  /** Smallest legal raise-to total. */
  minRaiseTo: number;
  /** Largest bet or raise-to total: the player's whole stack. */
  maxTo: number;
}

export interface PlayerState {
  seat: number;
  stack: number;
  /** Stack at the start of the hand. */
  startStack: number;
  hole: Card[];
  /** Chips put in on the current street. */
  streetBet: number;
  /** Chips put in during the whole hand, antes included. */
  committed: number;
  folded: boolean;
  allIn: boolean;
}

export interface Pot {
  amount: number;
  /** Seats that can win this pot. */
  eligible: number[];
}

export type HandEvent =
  | { type: 'start'; handNumber: number; button: number; seats: number[]; smallBlind: number; bigBlind: number; ante: number }
  | { type: 'post'; seat: number; kind: 'ante' | 'sb' | 'bb'; amount: number; allIn: boolean }
  | { type: 'deal'; seat: number; cards: Card[] }
  | { type: 'street'; street: Street; board: Card[] }
  | { type: 'action'; street: Street; seat: number; action: Action; amount: number; allIn: boolean }
  | { type: 'showdown'; seat: number; cards: Card[]; score: number; description: string }
  | { type: 'payout'; seat: number; amount: number; pot: number; returned: boolean }
  | { type: 'end'; winners: number[] };

export class Hand {
  readonly handNumber: number;
  readonly button: number;
  readonly smallBlind: number;
  readonly bigBlind: number;
  readonly ante: number;
  readonly players: PlayerState[];
  readonly board: Card[] = [];
  readonly events: HandEvent[] = [];
  readonly sbSeat: number;
  readonly bbSeat: number;

  phase: Phase = 'preflop';
  /** Highest streetBet this street. */
  currentBet = 0;
  /** Size of the last full raise this street; sets the minimum raise. */
  lastRaiseSize: number;
  /** Seat to act, or null when no action is pending. */
  actor: number | null = null;

  private readonly deck: Card[];
  private readonly seatOrder: number[];
  private toAct = new Set<number>();
  /** Seats that have acted since the last full raise; they may not raise again until someone else raises. */
  private actedSinceFullRaise = new Set<number>();
  private scores = new Map<number, number>();

  constructor(cfg: HandConfig) {
    if (cfg.seats.length < 2) throw new Error('a hand needs at least two players');
    const seatSet = new Set(cfg.seats.map((s) => s.seat));
    if (seatSet.size !== cfg.seats.length) throw new Error('duplicate seats');
    if (!seatSet.has(cfg.button)) throw new Error('button must be a seated player');
    for (const s of cfg.seats) if (!(s.stack > 0)) throw new Error(`seat ${s.seat} has no chips`);

    this.handNumber = cfg.handNumber ?? 1;
    this.button = cfg.button;
    this.smallBlind = cfg.smallBlind;
    this.bigBlind = cfg.bigBlind;
    this.ante = cfg.ante;
    this.lastRaiseSize = cfg.bigBlind;
    this.players = cfg.seats.map((s) => ({
      seat: s.seat, stack: s.stack, startStack: s.stack, hole: [], streetBet: 0, committed: 0, folded: false, allIn: false,
    }));
    this.seatOrder = this.players.map((p) => p.seat);
    this.deck = cfg.deck ? [...cfg.deck] : shuffle(newDeck(), cfg.rng ?? Math.random);
    if (this.deck.length < this.players.length * 2 + 5) throw new Error('deck too small');

    this.events.push({
      type: 'start', handNumber: this.handNumber, button: this.button, seats: [...this.seatOrder],
      smallBlind: this.smallBlind, bigBlind: this.bigBlind, ante: this.ante,
    });

    // Antes, then blinds. Heads-up: the button posts the small blind.
    if (this.ante > 0) {
      for (const seat of this.fromSeat(this.seatAfter(this.button))) this.post(seat, this.ante, 'ante');
    }
    if (this.players.length === 2) {
      this.sbSeat = this.button;
      this.bbSeat = this.seatAfter(this.button);
    } else {
      this.sbSeat = this.seatAfter(this.button);
      this.bbSeat = this.seatAfter(this.sbSeat);
    }
    this.post(this.sbSeat, this.smallBlind, 'sb');
    this.post(this.bbSeat, this.bigBlind, 'bb');

    // Two rounds of one card each, starting left of the button.
    for (let round = 0; round < 2; round++) {
      for (const seat of this.fromSeat(this.seatAfter(this.button))) this.player(seat).hole.push(this.deck.shift()!);
    }
    for (const p of this.players) this.events.push({ type: 'deal', seat: p.seat, cards: [...p.hole] });

    this.currentBet = Math.max(...this.players.map((p) => p.streetBet));
    this.startRound(this.seatAfter(this.bbSeat));
  }

  // ---- queries --------------------------------------------------------------------------------

  player(seat: number): PlayerState {
    const p = this.players.find((q) => q.seat === seat);
    if (!p) throw new Error(`seat ${seat} is not in this hand`);
    return p;
  }

  get isComplete(): boolean {
    return this.phase === 'complete';
  }

  get street(): Street | null {
    return this.phase === 'showdown' || this.phase === 'complete' ? null : this.phase;
  }

  /** Players still in the hand. */
  live(): PlayerState[] {
    return this.players.filter((p) => !p.folded);
  }

  /** Players who can still make decisions. */
  canAct(): PlayerState[] {
    return this.players.filter((p) => !p.folded && !p.allIn);
  }

  potTotal(): number {
    return this.players.reduce((sum, p) => sum + p.committed, 0);
  }

  /** Main and side pots as they stand now, from everything committed so far. */
  pots(): Pot[] {
    return this.layers().filter((l) => l.amount > 0).map((l) => ({ amount: l.amount, eligible: l.eligible }));
  }

  legalActions(): LegalActions | null {
    if (this.actor === null) return null;
    const p = this.player(this.actor);
    const callNeeded = this.currentBet - p.streetBet;
    const othersCanAct = this.canAct().some((q) => q.seat !== p.seat);
    const maxTo = p.streetBet + p.stack;
    const canCheck = callNeeded === 0;
    const opening = this.currentBet === 0;
    return {
      seat: p.seat,
      canFold: true,
      canCheck,
      callAmount: canCheck ? 0 : Math.min(callNeeded, p.stack),
      canBet: opening && othersCanAct && p.stack > 0,
      minBet: Math.min(this.bigBlind, maxTo),
      canRaise: !opening && othersCanAct && !this.actedSinceFullRaise.has(p.seat) && maxTo > this.currentBet,
      minRaiseTo: Math.min(this.currentBet + this.lastRaiseSize, maxTo),
      maxTo,
    };
  }

  // ---- actions --------------------------------------------------------------------------------

  act(seat: number, action: Action): void {
    if (this.actor !== seat) throw new Error(`seat ${seat} is not to act (actor: ${this.actor})`);
    const legal = this.legalActions()!;
    const p = this.player(seat);
    const street = this.phase as Street;
    let paid = 0;

    switch (action.type) {
      case 'fold':
        p.folded = true;
        this.actedSinceFullRaise.delete(seat);
        break;
      case 'check':
        if (!legal.canCheck) throw new Error('cannot check facing a bet');
        this.actedSinceFullRaise.add(seat);
        break;
      case 'call':
        if (legal.canCheck) throw new Error('nothing to call');
        paid = this.pay(p, legal.callAmount);
        this.actedSinceFullRaise.add(seat);
        break;
      case 'bet': {
        if (!legal.canBet) throw new Error('cannot bet now');
        this.checkAmount(action.amount, legal.minBet, legal.maxTo);
        paid = this.pay(p, action.amount - p.streetBet);
        this.applyAggression(seat, action.amount, action.amount);
        break;
      }
      case 'raise': {
        if (!legal.canRaise) throw new Error('cannot raise now');
        this.checkAmount(action.amount, legal.minRaiseTo, legal.maxTo);
        if (action.amount <= this.currentBet) throw new Error('raise must exceed the current bet');
        paid = this.pay(p, action.amount - p.streetBet);
        this.applyAggression(seat, action.amount, action.amount - this.currentBet);
        break;
      }
    }

    this.toAct.delete(seat);
    this.pruneToAct();
    this.events.push({ type: 'action', street, seat, action, amount: paid, allIn: p.allIn });
    this.advance(seat);
  }

  // ---- internals ------------------------------------------------------------------------------

  private checkAmount(amount: number, min: number, max: number): void {
    if (!Number.isInteger(amount)) throw new Error('amount must be an integer');
    if (amount < min || amount > max) throw new Error(`amount ${amount} outside [${min}, ${max}]`);
  }

  private applyAggression(seat: number, newBet: number, raiseSize: number): void {
    if (raiseSize >= this.lastRaiseSize) {
      this.lastRaiseSize = raiseSize;
      this.actedSinceFullRaise = new Set([seat]);
    } else {
      // An all-in short of a full raise does not reopen betting for players who already acted.
      this.actedSinceFullRaise.add(seat);
    }
    this.currentBet = newBet;
    this.toAct = new Set(this.canAct().filter((q) => q.seat !== seat).map((q) => q.seat));
  }

  private pay(p: PlayerState, amount: number): number {
    const amt = Math.min(amount, p.stack);
    p.stack -= amt;
    p.streetBet += amt;
    p.committed += amt;
    if (p.stack === 0) p.allIn = true;
    return amt;
  }

  private post(seat: number, amount: number, kind: 'ante' | 'sb' | 'bb'): void {
    const p = this.player(seat);
    const amt = Math.min(amount, p.stack);
    p.stack -= amt;
    p.committed += amt;
    if (kind !== 'ante') p.streetBet += amt;
    if (p.stack === 0) p.allIn = true;
    this.events.push({ type: 'post', seat, kind, amount: amt, allIn: p.allIn });
  }

  private seatAfter(seat: number): number {
    const i = this.seatOrder.indexOf(seat);
    return this.seatOrder[(i + 1) % this.seatOrder.length];
  }

  /** All seats in order, starting at `seat`. */
  private fromSeat(seat: number): number[] {
    const i = this.seatOrder.indexOf(seat);
    return this.seatOrder.map((_, k) => this.seatOrder[(i + k) % this.seatOrder.length]);
  }

  private firstToActFrom(seat: number): number | null {
    for (const s of this.fromSeat(seat)) if (this.toAct.has(s)) return s;
    return null;
  }

  /** When fewer than two players can act, nobody needs to act unless they still owe chips. */
  private pruneToAct(): void {
    if (this.canAct().length >= 2) return;
    for (const seat of [...this.toAct]) {
      if (this.player(seat).streetBet >= this.currentBet) this.toAct.delete(seat);
    }
  }

  private startRound(firstSeat: number): void {
    this.toAct = new Set(this.canAct().map((p) => p.seat));
    this.actedSinceFullRaise.clear();
    this.pruneToAct();
    if (this.toAct.size === 0) {
      this.actor = null;
      this.finishStreet();
      return;
    }
    this.actor = this.firstToActFrom(firstSeat);
  }

  private advance(lastSeat: number): void {
    if (this.live().length === 1) {
      this.actor = null;
      this.settle(false);
      return;
    }
    if (this.toAct.size === 0) {
      this.actor = null;
      this.finishStreet();
      return;
    }
    this.actor = this.firstToActFrom(this.seatAfter(lastSeat));
  }

  private finishStreet(): void {
    if (this.live().length === 1) {
      this.settle(false);
      return;
    }
    if (this.phase === 'river') {
      this.settle(true);
      return;
    }
    const next: Street = this.phase === 'preflop' ? 'flop' : this.phase === 'flop' ? 'turn' : 'river';
    const count = next === 'flop' ? 3 : 1;
    for (let i = 0; i < count; i++) this.board.push(this.deck.shift()!);
    this.phase = next;
    for (const p of this.players) p.streetBet = 0;
    this.currentBet = 0;
    this.lastRaiseSize = this.bigBlind;
    this.events.push({ type: 'street', street: next, board: [...this.board] });
    this.startRound(this.seatAfter(this.button));
  }

  private layers(): { amount: number; eligible: number[]; contributors: number[] }[] {
    const levels = [...new Set(this.players.map((p) => p.committed).filter((c) => c > 0))].sort((a, b) => a - b);
    const out: { amount: number; eligible: number[]; contributors: number[] }[] = [];
    let prev = 0;
    for (const level of levels) {
      let amount = 0;
      const contributors: number[] = [];
      for (const p of this.players) {
        const share = Math.min(p.committed, level) - prev;
        if (share > 0) {
          amount += share;
          contributors.push(p.seat);
        }
      }
      const eligible = contributors.filter((s) => !this.player(s).folded);
      out.push({ amount, eligible, contributors });
      prev = level;
    }
    return out;
  }

  private settle(showdown: boolean): void {
    if (showdown) {
      this.phase = 'showdown';
      for (const p of this.live()) {
        const score = evaluate([...p.hole, ...this.board]);
        this.scores.set(p.seat, score);
        this.events.push({ type: 'showdown', seat: p.seat, cards: [...p.hole], score, description: describeHand(score) });
      }
    }
    const winners = new Set<number>();
    const layers = this.layers();
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      if (layer.amount === 0) continue;
      if (layer.contributors.length === 1) {
        // Uncalled chips go back to whoever put them in.
        const seat = layer.contributors[0];
        this.player(seat).stack += layer.amount;
        this.events.push({ type: 'payout', seat, amount: layer.amount, pot: i, returned: true });
        continue;
      }
      let eligible = layer.eligible;
      if (eligible.length === 0) eligible = this.live().map((p) => p.seat);
      let best: number[];
      if (showdown) {
        const top = Math.max(...eligible.map((s) => this.scores.get(s)!));
        best = eligible.filter((s) => this.scores.get(s) === top);
      } else {
        best = eligible;
      }
      // Split evenly; odd chips go to the winners closest to the left of the button.
      const share = Math.floor(layer.amount / best.length);
      let remainder = layer.amount - share * best.length;
      const ordered = this.fromSeat(this.seatAfter(this.button)).filter((s) => best.includes(s));
      for (const seat of ordered) {
        const amount = share + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        this.player(seat).stack += amount;
        winners.add(seat);
        this.events.push({ type: 'payout', seat, amount, pot: i, returned: false });
      }
    }
    this.phase = 'complete';
    this.actor = null;
    this.events.push({ type: 'end', winners: [...winners] });
  }
}
