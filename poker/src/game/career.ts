// Career record on the device: one overall record, a rivalry record per man (games, who finished
// ahead, knockouts each way), trophies, settings, and the bots' memories.
import { type BotMemory } from '../bots/bot';
import { CHARACTERS } from '../bots/characters';
import { type BotType } from '../bots/stats';
import { HandCategory, categoryOf, describeHand, evaluate } from '../engine/evaluator';
import { type Hand } from '../engine/hand';
import { HUMAN_SEAT, type TableEvent } from './table';

export interface CareerRecord {
  played: number;
  wins: number;
  /** Count of finishes by place, index 1..6. */
  finishes: number[];
  bestHand: { score: number; description: string } | null;
  biggestPot: number;
  handsPlayed: number;
}

/** Your history against one man. */
export interface Rivalry {
  /** Nights you both played. */
  games: number;
  /** Nights you finished ahead of him. */
  wins: number;
  /** Nights he finished ahead of you. */
  losses: number;
  /** Times you took his last chip. */
  knockouts: number;
  /** Times he took yours. */
  knockedOutBy: number;
}

export interface Settings {
  sound: boolean;
  /** 0 = silent table, 0.5 = less talk, 1 = normal. */
  banter: number;
  /** Dave's room as the backdrop (daylight), or the old dark room with a lamp. */
  room: boolean;
}

export interface Save {
  version: 2;
  name: string;
  record: CareerRecord;
  rivals: Record<string, Rivalry>;
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
  { id: 'first_win', name: 'First Blood', blurb: 'Win a poker night.' },
  { id: 'five_wins', name: 'Regular', blurb: 'Win five poker nights.' },
  { id: 'pro_heads_up', name: 'Pro Killer', blurb: 'Beat a pro heads-up for the title.' },
  { id: 'bust_all', name: 'Cleaner', blurb: 'Knock out all five opponents yourself.' },
  { id: 'nemesis', name: 'Nemesis', blurb: 'Knock the same man out five times.' },
  { id: 'everyone', name: 'Nobody’s Safe', blurb: 'Knock out every man on the roster at least once.' },
  { id: 'bluff_artist', name: 'Pure Air', blurb: 'Win five pots in one night with nothing, without showing down.' },
  { id: 'the_nuts', name: 'The Nuts', blurb: 'Win a showdown with four of a kind or better.' },
  { id: 'comeback', name: 'Chip and a Chair', blurb: 'Win a night after dropping under ten big blinds.' },
  { id: 'suck_out', name: 'Rivered', blurb: 'Win an all-in as a big underdog.' },
  { id: 'speed_run', name: 'Short Night', blurb: 'Win a night in under 40 hands.' },
  { id: 'nit_buster', name: 'Scared Money', blurb: 'Knock out a nit.' },
];

export const SAVE_KEY = 'pihkh.save.v2';
/** The old per-table save; read once and folded into the overall record. */
const OLD_SAVE_KEY = 'pihkh.save.v1';

export function emptyRecord(): CareerRecord {
  return { played: 0, wins: 0, finishes: [0, 0, 0, 0, 0, 0, 0], bestHand: null, biggestPot: 0, handsPlayed: 0 };
}

export function emptyRivalry(): Rivalry {
  return { games: 0, wins: 0, losses: 0, knockouts: 0, knockedOutBy: 0 };
}

export function emptySave(): Save {
  return {
    version: 2,
    name: 'Hero',
    record: emptyRecord(),
    rivals: {},
    trophies: {},
    settings: { sound: true, banter: 1, room: true },
    memories: {},
  };
}

/** Folds a version-1 save (records per table) into one overall record. */
function migrateV1(parsed: Record<string, unknown>): Save {
  const base = emptySave();
  const old = (parsed.tournaments ?? {}) as Record<string, Partial<CareerRecord>>;
  for (const r of Object.values(old)) {
    base.record.played += r.played ?? 0;
    base.record.wins += r.wins ?? 0;
    base.record.handsPlayed += r.handsPlayed ?? 0;
    base.record.biggestPot = Math.max(base.record.biggestPot, r.biggestPot ?? 0);
    if (r.bestHand && (!base.record.bestHand || r.bestHand.score > base.record.bestHand.score)) base.record.bestHand = r.bestHand;
    for (let i = 1; i <= 6; i++) base.record.finishes[i] += r.finishes?.[i] ?? 0;
  }
  return {
    ...base,
    name: typeof parsed.name === 'string' ? parsed.name : base.name,
    settings: { ...base.settings, ...((parsed.settings as Partial<Settings>) ?? {}) },
    trophies: (parsed.trophies as Save['trophies']) ?? {},
    memories: (parsed.memories as Save['memories']) ?? {},
  };
}

export function loadSave(storage: Pick<Storage, 'getItem' | 'setItem'> | null = safeStorage()): Save {
  const base = emptySave();
  if (!storage) return base;
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Save>;
      if (parsed.version !== 2) return base;
      return {
        ...base,
        ...parsed,
        record: { ...base.record, ...(parsed.record ?? {}) },
        rivals: parsed.rivals ?? {},
        settings: { ...base.settings, ...(parsed.settings ?? {}) },
        trophies: parsed.trophies ?? {},
        memories: parsed.memories ?? {},
      };
    }
    const old = storage.getItem(OLD_SAVE_KEY);
    if (old) {
      const parsed = JSON.parse(old) as Record<string, unknown>;
      if (parsed.version === 1) return migrateV1(parsed);
    }
    return base;
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
    storage?.removeItem(OLD_SAVE_KEY);
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
  /** Character ids you knocked out, in order. */
  knockouts: string[] = [];
  /** The man who took your last chip, if anyone did. */
  knockedOutBy: string | null = null;
  /** Finish per character id at the end; undefined for men still in when you busted. */
  finishes = new Map<string, number | undefined>();
  /** Every bot at the table, by id. */
  rivals: string[] = [];
  airWins = 0;
  nutsWin = false;
  suckOut = false;
  underTenBB = false;
  lastOpponentType: BotType | null = null;
  private seatTypes = new Map<number, BotType | 'human'>();
  private seatIds = new Map<number, string>();
  private hand: Hand | null = null;
  private humanWasAggressor = false;

  onEvent(ev: TableEvent): void {
    switch (ev.type) {
      case 'tournamentStart':
        for (const s of ev.seats) {
          this.seatTypes.set(s.seat, s.type);
          this.seatIds.set(s.seat, s.id);
          if (s.seat !== HUMAN_SEAT) this.rivals.push(s.id);
        }
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
        const end = hand.events.at(-1);
        const winners = end?.type === 'end' ? end.winners : [];
        if (ev.seats.includes(HUMAN_SEAT)) {
          const killer = winners.find((w) => w !== HUMAN_SEAT);
          this.knockedOutBy = killer !== undefined ? this.seatIds.get(killer) ?? null : null;
          break;
        }
        if (!winners.includes(HUMAN_SEAT)) break;
        for (const s of ev.seats) {
          const t = this.seatTypes.get(s);
          this.bustedByMe.add(s);
          if (t && t !== 'human') this.bustedTypes.push(t);
          const id = this.seatIds.get(s);
          if (id) this.knockouts.push(id);
        }
        break;
      }
      case 'tournamentEnd': {
        for (const p of ev.standings) {
          const id = this.seatIds.get(p.seat);
          if (id && p.seat !== HUMAN_SEAT) this.finishes.set(id, p.finish);
        }
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
  humanFinish: number;
  handsPlayed: number;
}

/** Applies a finished night to the save and returns the trophies earned just now. */
export function recordTournament(save: Save, outcome: TournamentOutcome, tracker: TournamentTracker): Trophy[] {
  const rec = save.record;
  rec.played++;
  rec.handsPlayed += outcome.handsPlayed;
  if (outcome.humanFinish >= 1 && outcome.humanFinish <= 6) rec.finishes[outcome.humanFinish]++;
  if (outcome.humanFinish === 1) rec.wins++;
  if (tracker.bestHand && (!rec.bestHand || tracker.bestHand.score > rec.bestHand.score)) rec.bestHand = tracker.bestHand;
  rec.biggestPot = Math.max(rec.biggestPot, tracker.biggestPot);

  // Rivalries: who finished ahead of whom, and who took whose last chip.
  for (const id of tracker.rivals) {
    const r = (save.rivals[id] ??= emptyRivalry());
    r.games++;
    const his = tracker.finishes.get(id);
    // A man still in when you busted outlasted you.
    if (his !== undefined && his > outcome.humanFinish) r.wins++;
    else r.losses++;
  }
  for (const id of tracker.knockouts) (save.rivals[id] ??= emptyRivalry()).knockouts++;
  if (tracker.knockedOutBy) (save.rivals[tracker.knockedOutBy] ??= emptyRivalry()).knockedOutBy++;

  const won = outcome.humanFinish === 1;
  const earned: string[] = [];
  if (won) earned.push('first_win');
  if (rec.wins >= 5) earned.push('five_wins');
  if (won && tracker.lastOpponentType === 'pro') earned.push('pro_heads_up');
  if (won && tracker.bustedByMe.size >= 5) earned.push('bust_all');
  if (Object.values(save.rivals).some((r) => r.knockouts >= 5)) earned.push('nemesis');
  if (CHARACTERS.every((c) => (save.rivals[c.id]?.knockouts ?? 0) > 0)) earned.push('everyone');
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
