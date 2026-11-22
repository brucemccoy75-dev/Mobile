// A bot: a character, its live stats, and what it remembers about everyone else.
import { type Hand } from '../engine/hand';
import { type Rng } from '../engine/rng';
import { type Character } from './characters';
import { type Decision, decide } from './policy';
import { type Profile, newProfile, observeHand } from './profile';
import { type BotStats, type HandOutcome, handOutcome, updateClarity } from './stats';

export interface BotMemory {
  stats: BotStats;
  /** Profiles keyed by player id, kept across tournaments. */
  profiles: Record<string, Profile>;
}

export class Bot {
  readonly character: Character;
  readonly stats: BotStats;
  readonly profiles = new Map<string, Profile>();
  /** Set by the table: which player id sits in each seat this tournament. */
  seatIds = new Map<number, string>();
  seat = -1;

  constructor(character: Character, memory?: BotMemory) {
    this.character = character;
    this.stats = memory
      ? { ...memory.stats }
      : { iq: character.iq, read: character.read, clarity: character.clarityBase };
    if (memory) for (const [id, p] of Object.entries(memory.profiles)) this.profiles.set(id, p);
  }

  get type() {
    return this.character.type;
  }

  /** Fresh tournament: tilt returns to the character's baseline. */
  startTournament(seat: number, seatIds: Map<number, string>): void {
    this.seat = seat;
    this.seatIds = seatIds;
    this.stats.clarity = this.character.clarityBase;
  }

  profileFor(seat: number): Profile | undefined {
    const id = this.seatIds.get(seat);
    return id ? this.profiles.get(id) : undefined;
  }

  decide(hand: Hand, rng: Rng, samples?: number): Decision {
    return decide({
      hand, seat: this.seat, type: this.type, stats: this.stats, rng,
      profile: (seat) => this.profileFor(seat), samples,
    });
  }

  /** Learns from a finished hand and updates tilt. */
  observe(hand: Hand, rng: Rng, timings?: Map<number, number>): HandOutcome | null {
    const bySeat = new Map<number, Profile>();
    for (const [seat, id] of this.seatIds) {
      if (seat === this.seat) continue;
      let p = this.profiles.get(id);
      if (!p) {
        p = newProfile();
        this.profiles.set(id, p);
      }
      bySeat.set(seat, p);
    }
    // Only seats with an id get a profile; observeHand would create extras for unknown seats.
    const scoped = new Map<number, Profile>();
    for (const p of hand.players) if (bySeat.has(p.seat)) scoped.set(p.seat, bySeat.get(p.seat)!);
    observeHand(scoped, hand, timings);
    for (const [seat, p] of scoped) if (!bySeat.has(seat)) void p;

    if (!hand.players.some((p) => p.seat === this.seat)) return null;
    const outcome = handOutcome(hand, this.seat, rng);
    updateClarity(this.stats, this.type, outcome, this.character.temper ?? 1);
    return outcome;
  }

  memory(): BotMemory {
    return { stats: { ...this.stats }, profiles: Object.fromEntries(this.profiles) };
  }
}
