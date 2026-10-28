import type { CombatEvent } from '@core/combat';
import type { Stats } from '@data/types';

/**
 * Run telemetry (DECISIONS #26): what actually happened in real runs, kept locally as a ring
 * buffer of the last MAX_RUNS runs and exported as JSON for balance work. Pure: no Phaser.
 * Test-mode fights are never recorded (the scenes skip them).
 */
export const TELEMETRY_VERSION = 1;
export const MAX_RUNS = 20;

export interface FightRecord {
  at: number;
  screen: number;
  enemyId: string;
  /** Every enemy in the fight, front first (duos). */
  enemies?: string[];
  kind: 'random' | 'guard' | 'boss' | 'node';
  tile?: string;
  rounds: number;
  hpBefore: number;
  hpAfter: number;
  dealt: number;
  taken: number;
  blocked: number;
  counters: number;
  dotTaken: number;
  healed: number;
  cards: Record<string, number>;
  holds: number;
  outcome: 'won' | 'lost';
  deck: string[];
  equipment: Record<string, string | null>;
  stats: Stats;
  gold: number;
}

export interface RewardRecord { at: number; screen: number; source: string; offered: string[]; picked?: string; sold?: string; replaced?: string; gold: number; }
export interface ShopRecord { at: number; screen: number; bought: string; price: number; }

export interface RunRecord {
  version: typeof TELEMETRY_VERSION;
  appVersion: string;
  seed: string;
  classId: string;
  setId: string;
  /** Heirloom families this run (DECISIONS #32) and the class level at run start. */
  families?: string[];
  level?: number;
  legacy: Stats;
  /** Deck and gear at the moment the run first entered the overworld (heirlooms included). */
  start: { deck: string[]; equipment: Record<string, string | null>; stats: Stats };
  startedAt: number;
  endedAt?: number;
  outcome: 'ongoing' | 'won' | 'died' | 'abandoned';
  screensCleared: number;
  diedTo?: string;
  fights: FightRecord[];
  rewards: RewardRecord[];
  shop: ShopRecord[];
}

export interface TelemetryLog { version: typeof TELEMETRY_VERSION; runs: RunRecord[]; }

export const emptyLog = (): TelemetryLog => ({ version: TELEMETRY_VERSION, runs: [] });

/** Totals from one fight's event log. */
export function summarizeFight(log: CombatEvent[]): Pick<FightRecord, 'rounds' | 'dealt' | 'taken' | 'blocked' | 'counters' | 'dotTaken' | 'healed' | 'cards' | 'holds'> {
  const out = { rounds: 0, dealt: 0, taken: 0, blocked: 0, counters: 0, dotTaken: 0, healed: 0, cards: {} as Record<string, number>, holds: 0 };
  for (const e of log) {
    switch (e.t) {
      case 'roundStart': out.rounds = e.round; break;
      case 'damage':
        if (e.blocked) { if (e.target === 'player') out.blocked += 1; }
        else if (e.target === 'enemy') out.dealt += e.amount;
        else out.taken += e.amount;
        break;
      case 'counter': if (!e.blocked) { out.counters += 1; out.taken += e.amount; } break;
      case 'burn': if (e.side === 'player') { out.dotTaken += e.amount; out.taken += e.amount; } else out.dealt += e.amount; break;
      case 'heal': if (e.side === 'player') out.healed += e.amount; break;
      case 'play': if (e.side === 'player') out.cards[e.skill] = (out.cards[e.skill] ?? 0) + 1; break;
      case 'hold': out.holds += 1; break;
    }
  }
  return out;
}

export const findRun = (log: TelemetryLog, seed: string): RunRecord | undefined => log.runs.find((r) => r.seed === seed);

/** Start a run record (idempotent per seed). Any other run still 'ongoing' is marked abandoned. */
export function startRun(log: TelemetryLog, rec: Omit<RunRecord, 'version' | 'outcome' | 'screensCleared' | 'fights' | 'rewards' | 'shop'>): RunRecord {
  const existing = findRun(log, rec.seed);
  if (existing) return existing;
  for (const r of log.runs) if (r.outcome === 'ongoing') r.outcome = 'abandoned';
  const run: RunRecord = { ...rec, version: TELEMETRY_VERSION, outcome: 'ongoing', screensCleared: 0, fights: [], rewards: [], shop: [] };
  log.runs.push(run);
  while (log.runs.length > MAX_RUNS) log.runs.shift();
  return run;
}

export function endRun(log: TelemetryLog, seed: string, outcome: 'won' | 'died', diedTo?: string): void {
  const r = findRun(log, seed);
  if (!r || r.outcome !== 'ongoing') return;
  r.outcome = outcome; r.endedAt = Date.now();
  if (diedTo) r.diedTo = diedTo;
}

/** Compact per-run lines for a quick read without the JSON. */
export function describeRuns(log: TelemetryLog): string[] {
  return log.runs.map((r) => {
    const won = r.fights.filter((f) => f.outcome === 'won').length;
    const taken = r.fights.reduce((a, f) => a + f.taken, 0);
    return `${new Date(r.startedAt).toISOString().slice(0, 16)} ${r.classId}/${r.setId} ${r.outcome}${r.diedTo ? ` (${r.diedTo})` : ''}: ${won} fights won, ${taken} damage taken, screens ${r.screensCleared}`;
  });
}

/**
 * A run log read the way the simulator reports (DECISIONS #67), so the two can be laid side by
 * side: finished runs only (died or won), bucketed by heirloom families ("fresh" when none).
 * `name` turns a family id into its display name.
 */
export interface RunSummary {
  label: string;
  families: string[];
  runs: number;
  levels: number[];
  reachBossPct: number;
  beatBossPct: number;
  avgHpAtBoss: number;
  avgFightsWon: number;
  avgRoundsPerFight: number;
  /** Share of fights that had two or more enemies, and share of deaths that came in one. */
  duoFightPct: number;
  duoDeathPct: number;
  /** HP regained between one fight's end and the next fight's start (shrines, heals, level-ups). */
  medianRegen: number;
  /** Deaths by the fight's enemies joined with "+". */
  deaths: Record<string, number>;
}

const median = (xs: number[]) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2; };

export function summarizeRuns(log: TelemetryLog, name: (familyId: string) => string = (id) => id): RunSummary[] {
  const buckets = new Map<string, RunRecord[]>();
  for (const r of log.runs) {
    if (r.outcome !== 'died' && r.outcome !== 'won') continue;
    const key = [...(r.families ?? [])].sort().join(',');
    buckets.set(key, [...(buckets.get(key) ?? []), r]);
  }
  return [...buckets.entries()].map(([key, runs]) => {
    const families = key ? key.split(',') : [];
    const fights = runs.flatMap((r) => r.fights);
    const enemies = (f: FightRecord) => f.enemies ?? [f.enemyId];
    const bossFights = runs.map((r) => r.fights.find((f) => f.kind === 'boss')).filter((f): f is FightRecord => !!f);
    const lost = fights.filter((f) => f.outcome === 'lost');
    const regen = runs.flatMap((r) => r.fights.slice(1).map((f, i) => f.hpBefore - r.fights[i]!.hpAfter));
    const deaths: Record<string, number> = {};
    for (const f of lost) { const k = enemies(f).join('+'); deaths[k] = (deaths[k] ?? 0) + 1; }
    return {
      label: families.length ? families.map(name).join('+') : 'fresh',
      families, runs: runs.length, levels: runs.map((r) => r.level ?? 1),
      reachBossPct: (100 * bossFights.length) / runs.length,
      beatBossPct: (100 * bossFights.filter((f) => f.outcome === 'won').length) / runs.length,
      avgHpAtBoss: bossFights.length ? bossFights.reduce((s, f) => s + f.hpBefore, 0) / bossFights.length : 0,
      avgFightsWon: fights.filter((f) => f.outcome === 'won').length / runs.length,
      avgRoundsPerFight: fights.length ? fights.reduce((s, f) => s + f.rounds, 0) / fights.length : 0,
      duoFightPct: fights.length ? (100 * fights.filter((f) => enemies(f).length > 1).length) / fights.length : 0,
      duoDeathPct: lost.length ? (100 * lost.filter((f) => enemies(f).length > 1).length) / lost.length : 0,
      medianRegen: median(regen),
      deaths,
    };
  }).sort((a, b) => a.families.length - b.families.length || a.label.localeCompare(b.label));
}
