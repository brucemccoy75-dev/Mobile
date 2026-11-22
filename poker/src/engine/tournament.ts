// A sit-and-go: fixed seats, rising blinds, play until one player holds every chip.
import { Hand } from './hand';
import { type Rng } from './rng';

export interface BlindLevel {
  sb: number;
  bb: number;
  ante: number;
}

/** 10,000 starting chips, levels every 8 hands, antes from level 4. */
export const DEFAULT_SCHEDULE: BlindLevel[] = [
  { sb: 50, bb: 100, ante: 0 },
  { sb: 75, bb: 150, ante: 0 },
  { sb: 100, bb: 200, ante: 0 },
  { sb: 150, bb: 300, ante: 25 },
  { sb: 200, bb: 400, ante: 50 },
  { sb: 300, bb: 600, ante: 75 },
  { sb: 400, bb: 800, ante: 100 },
  { sb: 500, bb: 1000, ante: 100 },
  { sb: 600, bb: 1200, ante: 200 },
  { sb: 800, bb: 1600, ante: 200 },
  { sb: 1000, bb: 2000, ante: 300 },
  { sb: 1500, bb: 3000, ante: 500 },
  { sb: 2000, bb: 4000, ante: 500 },
  { sb: 3000, bb: 6000, ante: 1000 },
  { sb: 4000, bb: 8000, ante: 1000 },
  { sb: 6000, bb: 12000, ante: 2000 },
  { sb: 8000, bb: 16000, ante: 2000 },
  { sb: 10000, bb: 20000, ante: 3000 },
];

export interface TournamentPlayer {
  seat: number;
  name: string;
  stack: number;
  /** Finishing place, 1 = winner. Unset while still playing. */
  finish?: number;
  /** Hand number on which the player busted. */
  bustedOn?: number;
}

export interface TournamentConfig {
  players: { seat: number; name: string }[];
  startingStack?: number;
  handsPerLevel?: number;
  schedule?: BlindLevel[];
  rng?: Rng;
  /** Seat that holds the button for the first hand. Defaults to the lowest seat. */
  firstButton?: number;
}

export interface HandSummary {
  handNumber: number;
  busted: number[];
  winners: number[];
  stacks: Record<number, number>;
}

export class Tournament {
  readonly players: TournamentPlayer[];
  readonly startingStack: number;
  readonly handsPerLevel: number;
  readonly schedule: BlindLevel[];
  readonly rng: Rng;
  handsPlayed = 0;
  button: number;
  private current: Hand | null = null;

  constructor(cfg: TournamentConfig) {
    if (cfg.players.length < 2) throw new Error('a tournament needs at least two players');
    this.startingStack = cfg.startingStack ?? 10000;
    this.handsPerLevel = cfg.handsPerLevel ?? 8;
    this.schedule = cfg.schedule ?? DEFAULT_SCHEDULE;
    this.rng = cfg.rng ?? Math.random;
    this.players = [...cfg.players]
      .sort((a, b) => a.seat - b.seat)
      .map((p) => ({ seat: p.seat, name: p.name, stack: this.startingStack }));
    this.button = cfg.firstButton ?? this.players[0].seat;
  }

  get levelIndex(): number {
    return Math.floor(this.handsPlayed / this.handsPerLevel);
  }

  get level(): BlindLevel {
    return this.schedule[Math.min(this.levelIndex, this.schedule.length - 1)];
  }

  /** Hands left at the current level. */
  get handsUntilNextLevel(): number {
    return this.handsPerLevel - (this.handsPlayed % this.handsPerLevel);
  }

  active(): TournamentPlayer[] {
    return this.players.filter((p) => p.stack > 0);
  }

  get isOver(): boolean {
    return this.active().length <= 1;
  }

  get currentHand(): Hand | null {
    return this.current;
  }

  player(seat: number): TournamentPlayer {
    const p = this.players.find((q) => q.seat === seat);
    if (!p) throw new Error(`no player in seat ${seat}`);
    return p;
  }

  startHand(): Hand {
    if (this.isOver) throw new Error('tournament is over');
    if (this.current) throw new Error('a hand is already in progress');
    const level = this.level;
    this.current = new Hand({
      seats: this.active().map((p) => ({ seat: p.seat, stack: p.stack })),
      button: this.button,
      smallBlind: level.sb,
      bigBlind: level.bb,
      ante: level.ante,
      handNumber: this.handsPlayed + 1,
      rng: this.rng,
    });
    return this.current;
  }

  /** Applies the finished hand: stacks, eliminations, finishing places, blind level, button. */
  finishHand(): HandSummary {
    const hand = this.current;
    if (!hand) throw new Error('no hand in progress');
    if (!hand.isComplete) throw new Error('hand is not complete');
    const handNumber = hand.handNumber;

    const startStacks = new Map<number, number>();
    for (const p of this.active()) startStacks.set(p.seat, p.stack);

    for (const hp of hand.players) this.player(hp.seat).stack = hp.stack;

    // Players busting on the same hand: the one who started with more chips finishes higher.
    const busted = this.players
      .filter((p) => p.stack === 0 && p.finish === undefined)
      .sort((a, b) => startStacks.get(a.seat)! - startStacks.get(b.seat)!);
    let place = this.players.filter((p) => p.finish === undefined).length;
    for (const p of busted) {
      p.finish = place--;
      p.bustedOn = handNumber;
    }
    const remaining = this.active();
    if (remaining.length === 1) remaining[0].finish = 1;

    this.handsPlayed++;
    this.current = null;

    // The button moves to the next seat that still has chips.
    const seats = this.players.map((p) => p.seat);
    const i = seats.indexOf(this.button);
    for (let k = 1; k <= seats.length; k++) {
      const seat = seats[(i + k) % seats.length];
      if (this.player(seat).stack > 0) {
        this.button = seat;
        break;
      }
    }

    const end = hand.events[hand.events.length - 1];
    const winners = end.type === 'end' ? end.winners : [];
    const stacks: Record<number, number> = {};
    for (const p of this.players) stacks[p.seat] = p.stack;
    return { handNumber, busted: busted.map((p) => p.seat), winners, stacks };
  }

  /** Players ordered by finishing place, with those still playing ranked by stack. */
  standings(): TournamentPlayer[] {
    return [...this.players].sort((a, b) => {
      if (a.finish !== undefined && b.finish !== undefined) return a.finish - b.finish;
      if (a.finish !== undefined) return 1;
      if (b.finish !== undefined) return -1;
      return b.stack - a.stack;
    });
  }
}
