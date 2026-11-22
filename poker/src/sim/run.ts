// Plays whole tournaments between bots, with no UI, and reports how each type behaves and finishes.
import { Tournament } from '../engine/tournament';
import { type Rng, mulberry32 } from '../engine/rng';
import { shuffle } from '../engine/cards';
import { Bot } from '../bots/bot';
import { type Character, CHARACTERS } from '../bots/characters';
import { type BotType } from '../bots/stats';

export interface SeatReport {
  id: string;
  name: string;
  type: BotType;
  finish: number;
  hands: number;
  vpip: number;
  pfr: number;
  aggressive: number;
  passive: number;
  folds: number;
  foldOpps: number;
  showdownsWon: number;
  showdowns: number;
  maxClarity: number;
  finalClarity: number;
}

export interface TournamentReport {
  seed: number;
  hands: number;
  seats: SeatReport[];
}

export interface RunOptions {
  seed: number;
  /** Equity samples per decision; lower is faster. */
  samples?: number;
  maxHands?: number;
  /** Existing bots to reuse (keeps profiles across tournaments). */
  bots?: Bot[];
}

/** Plays one 6-max tournament between the given characters. */
export function runTournament(lineup: Character[], opts: RunOptions): TournamentReport {
  const rng = mulberry32(opts.seed);
  const bots = opts.bots ?? lineup.map((c) => new Bot(c));
  const seatIds = new Map<number, string>();
  bots.forEach((b, i) => seatIds.set(i, b.character.id));
  bots.forEach((b, i) => b.startTournament(i, seatIds));

  const t = new Tournament({ players: bots.map((b, i) => ({ seat: i, name: b.character.name })), rng });
  const stats = bots.map(() => ({ hands: 0, vpip: 0, pfr: 0, aggressive: 0, passive: 0, folds: 0, foldOpps: 0, showdownsWon: 0, showdowns: 0, maxClarity: 0 }));

  const maxHands = opts.maxHands ?? 2000;
  while (!t.isOver && t.handsPlayed < maxHands) {
    const hand = t.startHand();
    let guard = 0;
    while (!hand.isComplete) {
      if (++guard > 400) throw new Error(`seed ${opts.seed}: hand ${hand.handNumber} did not end`);
      const seat = hand.actor!;
      const d = bots[seat].decide(hand, rng, opts.samples ?? 120);
      hand.act(seat, d.action);
    }
    // Per-seat tendencies for the report.
    const vp = new Set<number>();
    const pf = new Set<number>();
    let street = 'preflop';
    const streetBet = new Map<number, number>();
    let currentBet = 0;
    for (const p of hand.players) streetBet.set(p.seat, 0);
    for (const e of hand.events) {
      if (e.type === 'post' && e.kind !== 'ante') {
        streetBet.set(e.seat, streetBet.get(e.seat)! + e.amount);
        currentBet = Math.max(currentBet, streetBet.get(e.seat)!);
      }
      if (e.type === 'street') {
        street = e.street;
        currentBet = 0;
        for (const s of streetBet.keys()) streetBet.set(s, 0);
      }
      if (e.type === 'action') {
        const s = stats[e.seat];
        const toCall = currentBet - streetBet.get(e.seat)!;
        if (toCall > 0) s.foldOpps++;
        const ty = e.action.type;
        if (ty === 'fold') s.folds++;
        else if (ty === 'check' || ty === 'call') s.passive++;
        else s.aggressive++;
        if (street === 'preflop' && (ty === 'call' || ty === 'bet' || ty === 'raise')) vp.add(e.seat);
        if (street === 'preflop' && (ty === 'bet' || ty === 'raise')) pf.add(e.seat);
        streetBet.set(e.seat, streetBet.get(e.seat)! + e.amount);
        currentBet = Math.max(currentBet, streetBet.get(e.seat)!);
      }
      if (e.type === 'showdown') stats[e.seat].showdowns++;
      if (e.type === 'end') for (const w of e.winners) if (hand.events.some((x) => x.type === 'showdown' && x.seat === w)) stats[w].showdownsWon++;
    }
    for (const p of hand.players) stats[p.seat].hands++;
    for (const s of vp) stats[s].vpip++;
    for (const s of pf) stats[s].pfr++;

    for (const b of bots) {
      if (hand.players.some((p) => p.seat === b.seat)) b.observe(hand, rng);
      stats[b.seat].maxClarity = Math.max(stats[b.seat].maxClarity, b.stats.clarity);
    }
    t.finishHand();
  }
  if (!t.isOver) {
    // Ran out of hands: rank the survivors by stack.
    const survivors = t.active().sort((a, b) => b.stack - a.stack);
    survivors.forEach((p, i) => (p.finish = i + 1));
  }

  return {
    seed: opts.seed,
    hands: t.handsPlayed,
    seats: bots.map((b, i) => ({
      id: b.character.id, name: b.character.name, type: b.type, finish: t.player(i).finish!,
      ...stats[i], finalClarity: b.stats.clarity,
    })),
  };
}

export interface TypeSummary {
  type: BotType;
  seats: number;
  avgFinish: number;
  wins: number;
  vpip: number;
  pfr: number;
  aggression: number;
  foldToBet: number;
  wtsdWon: number;
  avgMaxClarity: number;
}

export function summarize(reports: TournamentReport[]): { types: TypeSummary[]; avgHands: number; players: Record<string, { finishes: number[]; avg: number }> } {
  const byType = new Map<BotType, SeatReport[]>();
  const players: Record<string, { finishes: number[]; avg: number }> = {};
  for (const r of reports) {
    for (const s of r.seats) {
      if (!byType.has(s.type)) byType.set(s.type, []);
      byType.get(s.type)!.push(s);
      (players[s.id] ??= { finishes: [], avg: 0 }).finishes.push(s.finish);
    }
  }
  for (const p of Object.values(players)) p.avg = p.finishes.reduce((a, b) => a + b, 0) / p.finishes.length;
  const sum = (xs: SeatReport[], f: (s: SeatReport) => number) => xs.reduce((a, s) => a + f(s), 0);
  const types: TypeSummary[] = [...byType.entries()].map(([type, xs]) => ({
    type,
    seats: xs.length,
    avgFinish: sum(xs, (s) => s.finish) / xs.length,
    wins: xs.filter((s) => s.finish === 1).length,
    vpip: sum(xs, (s) => s.vpip) / Math.max(1, sum(xs, (s) => s.hands)),
    pfr: sum(xs, (s) => s.pfr) / Math.max(1, sum(xs, (s) => s.hands)),
    aggression: sum(xs, (s) => s.aggressive) / Math.max(1, sum(xs, (s) => s.aggressive + s.passive)),
    foldToBet: sum(xs, (s) => s.folds) / Math.max(1, sum(xs, (s) => s.foldOpps)),
    wtsdWon: sum(xs, (s) => s.showdownsWon) / Math.max(1, sum(xs, (s) => s.showdowns)),
    avgMaxClarity: sum(xs, (s) => s.maxClarity) / xs.length,
  }));
  return { types, avgHands: reports.reduce((a, r) => a + r.hands, 0) / Math.max(1, reports.length), players };
}

/** Picks a 6-seat lineup for a tournament from its eligible characters. */
/** One of each type plus two more, drawn by seed, so every type is always represented. */
export function mixedLineup(rng: Rng): Character[] {
  const byType = (t: BotType) => CHARACTERS.filter((c) => c.type === t);
  const picks: Character[] = [];
  for (const t of ['nit', 'tourist', 'calculator', 'pro'] as BotType[]) {
    const pool = byType(t);
    picks.push(pool[Math.floor(rng() * pool.length)]);
  }
  const rest = shuffle(CHARACTERS.filter((c) => !picks.includes(c)), rng);
  picks.push(...rest.slice(0, 2));
  return shuffle(picks, rng);
}
