// Career record on the device: results per tournament, trophies, settings, and the bots' memories.
import { type BotMemory } from '../bots/bot';
import { type TournamentKey } from '../bots/characters';
import { type BotType } from '../bots/stats';
import { HandCategory, categoryOf, describeHand, evaluate } from '../engine/evaluator';
import { type Hand } from '../engine/hand';
import { HUMAN_SEAT, type TableEvent } from './table';

export interface TournamentRecord {
  played: number;
  wins: number;
  /** Count of finishes by place, index 1..6. */
  finishes: number[];
  bestHand: { score: number; description: string } | null;
  biggestPot: number;
  handsPlayed: number;
}

export interface Settings {
  sound: boolean;
  /** 0 = silent table, 0.5 = less talk, 1 = normal. */
  banter: number;
}

export interface Save {
  version: 1;
  name: string;
  tournaments: Record<TournamentKey, TournamentRecord>;
  trophies: Record<string, { earnedAt: number; count: number }>;
  settings: Settings;
  memories: Record<string, BotMemory>;
}

export interface Trophy {
  id: string;
  name: string;
  blurb: string;
}

export const TROPHIES: Trophy[] = [
  { id: 'first_win', name: 'First Blood', blurb: 'Win a tournament.' },
  { id: 'tutorial_win', name: 'Graduated', blurb: 'Win the Tutorial.' },
  { id: 'vegas_win', name: 'What Happens Here', blurb: 'Win Vegas.' },
  { id: 'championship_win', name: 'Champion', blurb: 'Win the Championship.' },
  { id: 'pro_heads_up', name: 'Pro Killer', blurb: 'Beat a pro heads-up for the title.' },
  { id: 'bust_all', name: 'Cleaner', blurb: 'Eliminate all five opponents yourself.' },
  { id: 'bluff_artist', name: 'Pure Air', blurb: 'Win five pots in one tournament with nothing, without showing down.' },
  { id: 'the_nuts', name: 'The Nuts', blurb: 'Win a showdown with four of a kind or better.' },
  { id: 'comeback', name: 'Chip and a Chair', blurb: 'Win a tournament after dropping under ten big blinds.' },
  { id: 'suck_out', name: 'Rivered', blurb: 'Win an all-in as a big underdog.' },
  { id: 'speed_run', name: 'Short Night', blurb: 'Win a tournament in under 40 hands.' },
  { id: 'nit_buster', name: 'Scared Money', blurb: 'Eliminate a nit.' },
];

export const SAVE_KEY = 'pihkh.save.v1';

export function emptyRecord(): TournamentRecord {
  return { played: 0, wins: 0, finishes: [0, 0, 0, 0, 0, 0, 0], bestHand: null, biggestPot: 0, handsPlayed: 0 };
}

export function emptySave(): Save {
  return {
    version: 1,
    name: 'Hero',
    tournaments: { custom: emptyRecord(), tutorial: emptyRecord(), vegas: emptyRecord(), championship: emptyRecord() },
    trophies: {},
    settings: { sound: true, banter: 1 },
    memories: {},
  };
}

export function loadSave(storage: Pick<Storage, 'getItem' | 'setItem'> | null = safeStorage()): Save {
  const base = emptySave();
  if (!storage) return base;
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<Save>;
    if (parsed.version !== 1) return base;
    return {
      ...base,
      ...parsed,
      tournaments: { ...base.tournaments, ...(parsed.tournaments ?? {}) },
      settings: { ...base.settings, ...(parsed.settings ?? {}) },
      trophies: parsed.trophies ?? {},
      memories: parsed.memories ?? {},
    };
  } catch {
    return base;
  }
}

export function writeSave(save: Save, storage: Pick<Storage, 'getItem' | 'setItem'> | null = safeStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Storage full or blocked: the game still plays.
  }
}

export function clearSave(storage: Pick<Storage, 'removeItem'> | null = safeStorage()): void {
  try {
    storage?.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

function safeStorage(): Storage | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

/** Watches one tournament's events for the things trophies and records care about. */
export class TournamentTracker {
  bestHand: { score: number; description: string } | null = null;
  biggestPot = 0;
  handsPlayed = 0;
  bustedByMe = new Set<number>();
  bustedTypes: BotType[] = [];
  airWins = 0;
  nutsWin = false;
  suckOut = false;
  underTenBB = false;
  lastOpponentType: BotType | null = null;
  private seatTypes = new Map<number, BotType | 'human'>();
  private hand: Hand | null = null;
  private humanWasAggressor = false;

  onEvent(ev: TableEvent): void {
    switch (ev.type) {
      case 'tournamentStart':
        for (const s of ev.seats) this.seatTypes.set(s.seat, s.type);
        break;
      case 'handStart': {
        this.hand = ev.hand;
        this.handsPlayed = ev.handNumber;
        this.humanWasAggressor = false;
        const me = ev.stacks[HUMAN_SEAT] ?? 0;
        if (me > 0 && me / ev.level.bb < 10) this.underTenBB = true;
        break;
      }
      case 'action':
        if (ev.seat === HUMAN_SEAT && (ev.action.type === 'bet' || ev.action.type === 'raise')) this.humanWasAggressor = true;
        break;
      case 'handEnd': {
        const hand = ev.hand;
        const me = hand.players.find((p) => p.seat === HUMAN_SEAT);
        if (!me || !ev.winners.includes(HUMAN_SEAT)) break;
        const showdown = hand.events.some((e) => e.type === 'showdown');
        const won = hand.events.filter((e) => e.type === 'payout' && e.seat === HUMAN_SEAT && !e.returned).reduce((a, e) => a + (e.type === 'payout' ? e.amount : 0), 0);
        this.biggestPot = Math.max(this.biggestPot, won);
        if (hand.board.length >= 3) {
          const score = evaluate([...me.hole, ...hand.board]);
          if (showdown) {
            if (!this.bestHand || score > this.bestHand.score) this.bestHand = { score, description: describeHand(score) };
            if (categoryOf(score) >= HandCategory.Quads) this.nutsWin = true;
          } else if (this.humanWasAggressor && categoryOf(score) <= HandCategory.HighCard) {
            this.airWins++;
          }
        } else if (!showdown && this.humanWasAggressor) {
          // Preflop steal with a weak hand counts as air too.
          const weak = me.hole.length === 2 && categoryOf(evaluate([...me.hole, 0, 14, 27].filter((c, i, a) => a.indexOf(c) === i).slice(0, 5))) <= HandCategory.HighCard;
          if (weak) this.airWins++;
        }
        // Did we get there as a big underdog? Use the bots' outcome view: a bot's bad beat against us.
        for (const [seat, o] of Object.entries(ev.outcomes)) {
          if (o && o.badBeat && Number(seat) !== HUMAN_SEAT && showdown) this.suckOut = true;
        }
        break;
      }
      case 'bust': {
        const hand = this.hand;
        if (!hand) break;
        if (ev.seats.includes(HUMAN_SEAT)) break;
        const winners = hand.events.at(-1);
        const humanWon = winners?.type === 'end' && winners.winners.includes(HUMAN_SEAT);
        for (const s of ev.seats) {
          const t = this.seatTypes.get(s);
          if (humanWon) {
            this.bustedByMe.add(s);
            if (t && t !== 'human') this.bustedTypes.push(t);
          }
        }
        break;
      }
      case 'tournamentEnd': {
        const others = ev.standings.filter((p) => p.seat !== HUMAN_SEAT);
        const runnerUp = others.find((p) => p.finish === 2) ?? others.sort((a, b) => (a.finish ?? 9) - (b.finish ?? 9))[0];
        const t = runnerUp ? this.seatTypes.get(runnerUp.seat) : undefined;
        this.lastOpponentType = t && t !== 'human' ? t : null;
        break;
      }
      default:
        break;
    }
  }
}

export interface TournamentOutcome {
  key: TournamentKey;
  humanFinish: number;
  handsPlayed: number;
}

/** Applies a finished tournament to the save and returns the trophies earned just now. */
export function recordTournament(save: Save, outcome: TournamentOutcome, tracker: TournamentTracker): Trophy[] {
  const rec = save.tournaments[outcome.key];
  rec.played++;
  rec.handsPlayed += outcome.handsPlayed;
  if (outcome.humanFinish >= 1 && outcome.humanFinish <= 6) rec.finishes[outcome.humanFinish]++;
  if (outcome.humanFinish === 1) rec.wins++;
  if (tracker.bestHand && (!rec.bestHand || tracker.bestHand.score > rec.bestHand.score)) rec.bestHand = tracker.bestHand;
  rec.biggestPot = Math.max(rec.biggestPot, tracker.biggestPot);

  const won = outcome.humanFinish === 1;
  const earned: string[] = [];
  if (won) earned.push('first_win', `${outcome.key}_win`);
  if (won && tracker.lastOpponentType === 'pro') earned.push('pro_heads_up');
  if (won && tracker.bustedByMe.size >= 5) earned.push('bust_all');
  if (tracker.airWins >= 5) earned.push('bluff_artist');
  if (tracker.nutsWin) earned.push('the_nuts');
  if (won && tracker.underTenBB) earned.push('comeback');
  if (tracker.suckOut) earned.push('suck_out');
  if (won && outcome.handsPlayed < 40) earned.push('speed_run');
  if (tracker.bustedTypes.includes('nit')) earned.push('nit_buster');

  const fresh: Trophy[] = [];
  for (const id of earned) {
    const t = TROPHIES.find((x) => x.id === id);
    if (!t) continue;
    const had = save.trophies[id];
    if (had) had.count++;
    else {
      save.trophies[id] = { earnedAt: Date.now(), count: 1 };
      fresh.push(t);
    }
  }
  return fresh;
}
