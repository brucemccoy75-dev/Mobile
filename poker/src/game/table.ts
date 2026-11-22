// Runs one tournament at a table with a human in seat 0 and bots in the rest. Emits every visible
// moment to a presenter and waits for it, so the game moves at the pace of the animations.
import { Bot, type BotMemory } from '../bots/bot';
import { type Character } from '../bots/characters';
import { type BotStats, type BotType, type HandOutcome } from '../bots/stats';
import { type Card } from '../engine/cards';
import { type Action, type Hand, type LegalActions, type Street } from '../engine/hand';
import { type Rng } from '../engine/rng';
import { type BlindLevel, Tournament, type TournamentPlayer } from '../engine/tournament';

export const HUMAN_SEAT = 0;
/** No shot clock by default: it is a casual game. Tests can set one. */
export const SHOT_CLOCK_MS = 0;

export interface SeatInfo {
  seat: number;
  id: string;
  name: string;
  type: BotType | 'human';
  stack: number;
}

export type TableEvent =
  | { type: 'tournamentStart'; seats: SeatInfo[]; level: BlindLevel }
  | { type: 'handStart'; hand: Hand; handNumber: number; button: number; level: BlindLevel; stacks: Record<number, number> }
  | { type: 'post'; seat: number; kind: 'ante' | 'sb' | 'bb'; amount: number; allIn: boolean }
  | { type: 'deal'; seat: number; cards: Card[] }
  | { type: 'turn'; seat: number; legal: LegalActions; deadline: number | null }
  | { type: 'action'; seat: number; action: Action; amount: number; allIn: boolean; street: Street; thinkMs: number }
  | { type: 'street'; street: Street; board: Card[] }
  | { type: 'showdown'; seat: number; cards: Card[]; description: string }
  | { type: 'payout'; seat: number; amount: number; returned: boolean }
  | { type: 'handEnd'; hand: Hand; winners: number[]; outcomes: Record<number, HandOutcome | null>; moods: Record<number, BotStats> }
  | { type: 'bust'; seats: number[]; finishes: Record<number, number> }
  | { type: 'level'; level: BlindLevel; index: number }
  | { type: 'tournamentEnd'; standings: TournamentPlayer[]; humanFinish: number; handsPlayed: number };

export interface Presenter {
  present(ev: TableEvent): Promise<void> | void;
}

export interface TableOptions {
  /** Five bots for the seats after the human. */
  lineup: Character[];
  humanName: string;
  rng: Rng;
  presenter: Presenter;
  memories?: Record<string, BotMemory>;
  /** Time multiplier for bot think delays; >1 is fast-forward. */
  speed?: () => number;
  /** Milliseconds before the human is folded or checked automatically; 0 or unset means never. */
  shotClockMs?: number;
  samples?: number;
  /** Replaces the real wait; tests pass an instant one. */
  sleep?: (ms: number) => Promise<void>;
  /** Automatic human for tests and simulations. */
  human?: (hand: Hand, legal: LegalActions) => Action | Promise<Action>;
  startingStack?: number;
}

const realSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export class TableController {
  readonly tournament: Tournament;
  readonly bots = new Map<number, Bot>();
  readonly seats: SeatInfo[];
  private readonly opts: TableOptions;
  private pending: { legal: LegalActions; resolve: (a: Action) => void; restart: () => void } | null = null;
  private stopped = false;
  private lastLevel = 0;
  private paused = false;
  private resumeWaiters: (() => void)[] = [];
  /** Finished hands, newest last, capped. */
  readonly history: Hand[] = [];
  /** Called with a new shot-clock deadline when a paused human turn resumes. */
  onDeadline: (deadline: number) => void = () => {};

  constructor(opts: TableOptions) {
    this.opts = opts;
    if (opts.lineup.length !== 5) throw new Error('a table takes five bots');
    const seatIds = new Map<number, string>([[HUMAN_SEAT, 'human']]);
    opts.lineup.forEach((c, i) => seatIds.set(i + 1, c.id));
    opts.lineup.forEach((c, i) => {
      const bot = new Bot(c, opts.memories?.[c.id]);
      bot.startTournament(i + 1, seatIds);
      this.bots.set(i + 1, bot);
    });
    this.tournament = new Tournament({
      players: [{ seat: HUMAN_SEAT, name: opts.humanName }, ...opts.lineup.map((c, i) => ({ seat: i + 1, name: c.name }))],
      rng: opts.rng,
      startingStack: opts.startingStack,
    });
    this.seats = this.tournament.players.map((p) => ({
      seat: p.seat,
      id: p.seat === HUMAN_SEAT ? 'human' : opts.lineup[p.seat - 1].id,
      name: p.name,
      type: p.seat === HUMAN_SEAT ? 'human' : opts.lineup[p.seat - 1].type,
      stack: p.stack,
    }));
  }

  get hand(): Hand | null {
    return this.tournament.currentHand;
  }

  /** Legal actions for the human right now, or null when it is not their turn. */
  get humanLegal(): LegalActions | null {
    return this.pending?.legal ?? null;
  }

  /** The human acts. Returns false if it is not their turn or the action is illegal. */
  humanAct(action: Action): boolean {
    if (!this.pending) return false;
    const hand = this.hand;
    if (!hand || hand.actor !== HUMAN_SEAT) return false;
    if (!isLegal(this.pending.legal, action)) return false;
    const { resolve } = this.pending;
    this.pending = null;
    resolve(action);
    return true;
  }

  get isPaused(): boolean {
    return this.paused;
  }

  /** Freezes bot timers and the shot clock until resume(). */
  pause(): void {
    if (this.paused) return;
    this.paused = true;
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    const waiters = this.resumeWaiters;
    this.resumeWaiters = [];
    for (const w of waiters) w();
    if (this.pending) this.pending.restart();
  }

  private whenResumed(): Promise<void> {
    if (!this.paused) return Promise.resolve();
    return new Promise((r) => this.resumeWaiters.push(r));
  }

  stop(): void {
    this.stopped = true;
    this.resume();
    if (this.pending) this.humanAct(this.pending.legal.canCheck ? { type: 'check' } : { type: 'fold' });
  }

  memories(): Record<string, BotMemory> {
    const out: Record<string, BotMemory> = {};
    for (const b of this.bots.values()) out[b.character.id] = b.memory();
    return out;
  }

  moods(): Record<number, BotStats> {
    const out: Record<number, BotStats> = {};
    for (const [seat, b] of this.bots) out[seat] = { ...b.stats };
    return out;
  }

  async run(): Promise<{ standings: TournamentPlayer[]; humanFinish: number }> {
    const t = this.tournament;
    await this.emit({ type: 'tournamentStart', seats: this.seats, level: t.level });
    while (!t.isOver && !this.stopped && t.player(HUMAN_SEAT).stack > 0) {
      await this.playHand();
    }
    const human = t.player(HUMAN_SEAT);
    const humanFinish = human.finish ?? (t.isOver ? 1 : t.active().length + 1);
    if (this.stopped && human.finish === undefined) human.finish = humanFinish;
    const standings = t.standings();
    await this.emit({ type: 'tournamentEnd', standings, humanFinish, handsPlayed: t.handsPlayed });
    return { standings, humanFinish };
  }

  private async playHand(): Promise<void> {
    const t = this.tournament;
    const hand = t.startHand();
    const stacks: Record<number, number> = {};
    for (const p of hand.players) stacks[p.seat] = p.stack + p.committed;
    await this.emit({ type: 'handStart', hand, handNumber: hand.handNumber, button: hand.button, level: t.level, stacks });
    let cursor = 0;
    cursor = await this.flush(hand, cursor);

    const timings = new Map<number, number>();
    while (!hand.isComplete && !this.stopped) {
      const seat = hand.actor!;
      const legal = hand.legalActions()!;
      let action: Action;
      let thinkMs: number;
      if (seat === HUMAN_SEAT) {
        const clock = this.opts.shotClockMs ?? SHOT_CLOCK_MS;
        const deadline = this.opts.human || clock <= 0 ? null : Date.now() + clock;
        await this.emit({ type: 'turn', seat, legal, deadline });
        const started = Date.now();
        action = await this.humanTurn(hand, legal);
        thinkMs = Date.now() - started;
      } else {
        await this.emit({ type: 'turn', seat, legal, deadline: null });
        const bot = this.bots.get(seat)!;
        const d = bot.decide(hand, this.opts.rng, this.opts.samples);
        thinkMs = d.thinkMs;
        await this.wait(thinkMs);
        action = d.action;
      }
      const index = hand.events.length;
      hand.act(seat, action);
      timings.set(index, thinkMs);
      cursor = await this.flush(hand, cursor, thinkMs);
    }

    if (this.stopped && !hand.isComplete) return;
    const outcomes: Record<number, HandOutcome | null> = {};
    for (const [seat, bot] of this.bots) {
      if (hand.players.some((p) => p.seat === seat)) outcomes[seat] = bot.observe(hand, this.opts.rng, timings);
    }
    const end = hand.events[hand.events.length - 1];
    this.history.push(hand);
    if (this.history.length > 12) this.history.shift();
    await this.emit({ type: 'handEnd', hand, winners: end.type === 'end' ? end.winners : [], outcomes, moods: this.moods() });

    const summary = t.finishHand();
    if (summary.busted.length > 0) {
      const finishes: Record<number, number> = {};
      for (const s of summary.busted) finishes[s] = t.player(s).finish!;
      await this.emit({ type: 'bust', seats: summary.busted, finishes });
    }
    if (t.levelIndex !== this.lastLevel) {
      this.lastLevel = t.levelIndex;
      await this.emit({ type: 'level', level: t.level, index: t.levelIndex });
    }
  }

  /** Emits hand events from `from` onward and returns the new cursor. */
  private async flush(hand: Hand, from: number, thinkMs = 0): Promise<number> {
    for (let i = from; i < hand.events.length; i++) {
      const e = hand.events[i];
      switch (e.type) {
        case 'post':
          await this.emit({ type: 'post', seat: e.seat, kind: e.kind, amount: e.amount, allIn: e.allIn });
          break;
        case 'deal':
          await this.emit({ type: 'deal', seat: e.seat, cards: e.cards });
          break;
        case 'action':
          await this.emit({ type: 'action', seat: e.seat, action: e.action, amount: e.amount, allIn: e.allIn, street: e.street, thinkMs });
          break;
        case 'street':
          await this.emit({ type: 'street', street: e.street, board: e.board });
          break;
        case 'showdown':
          await this.emit({ type: 'showdown', seat: e.seat, cards: e.cards, description: e.description });
          break;
        case 'payout':
          await this.emit({ type: 'payout', seat: e.seat, amount: e.amount, returned: e.returned });
          break;
        default:
          break;
      }
    }
    return hand.events.length;
  }

  private humanTurn(hand: Hand, legal: LegalActions): Promise<Action> {
    if (this.opts.human) return Promise.resolve(this.opts.human(hand, legal));
    void hand;
    return new Promise<Action>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      const clockMs = this.opts.shotClockMs ?? SHOT_CLOCK_MS;
      const entry = {
        legal,
        resolve: (a: Action) => {
          if (timer) clearTimeout(timer);
          resolve(a);
        },
        restart: () => {
          if (timer) clearTimeout(timer);
          if (clockMs > 0) {
            timer = setTimeout(fire, clockMs);
            this.onDeadline(Date.now() + clockMs);
          } else {
            this.onDeadline(0);
          }
        },
      };
      const fire = () => {
        if (this.paused) return;
        if (this.pending === entry) {
          this.pending = null;
          resolve(legal.canCheck ? { type: 'check' } : { type: 'fold' });
        }
      };
      this.pending = entry;
      if (clockMs > 0) timer = setTimeout(fire, clockMs);
    });
  }

  private async wait(ms: number): Promise<void> {
    const speed = this.opts.speed?.() ?? 1;
    await (this.opts.sleep ?? realSleep)(ms / Math.max(0.01, speed));
    await this.whenResumed();
  }

  private async emit(ev: TableEvent): Promise<void> {
    await this.whenResumed();
    await this.opts.presenter.present(ev);
  }
}

export function isLegal(legal: LegalActions, a: Action): boolean {
  switch (a.type) {
    case 'fold':
      return legal.canFold;
    case 'check':
      return legal.canCheck;
    case 'call':
      return !legal.canCheck && legal.callAmount > 0;
    case 'bet':
      return legal.canBet && Number.isInteger(a.amount) && a.amount >= legal.minBet && a.amount <= legal.maxTo;
    case 'raise':
      return legal.canRaise && Number.isInteger(a.amount) && a.amount >= legal.minRaiseTo && a.amount <= legal.maxTo;
  }
}
