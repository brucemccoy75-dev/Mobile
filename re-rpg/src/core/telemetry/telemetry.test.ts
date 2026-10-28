import { describe, expect, it } from 'vitest';
import type { CombatEvent } from '@core/combat';
import { MAX_RUNS, describeRuns, emptyLog, endRun, findRun, startRun, summarizeFight, summarizeRuns, type FightRecord, type RunRecord } from './index';

const stats = { maxHp: 25, atk: 4, def: 1 };
const rec = (seed: string) => ({ appVersion: 't', seed, classId: 'warrior', setId: 'warrior_tank', legacy: { maxHp: 0, atk: 0, def: 0 }, start: { deck: [], equipment: {}, stats }, startedAt: 1 });

describe('telemetry', () => {
  it('summarises a fight log: dealt, taken, blocks, counters, dots, cards', () => {
    const log: CombatEvent[] = [
      { t: 'roundStart', round: 1 },
      { t: 'play', side: 'player', skill: 'attack', name: 'Attack' },
      { t: 'damage', source: 'player', target: 'enemy', amount: 4, blocked: false, hit: 1, hits: 1, kind: 'physical' },
      { t: 'play', side: 'enemy', skill: 'tusk', name: 'Tusk' },
      { t: 'damage', source: 'enemy', target: 'player', amount: 3, blocked: false, hit: 1, hits: 1, kind: 'physical' },
      { t: 'roundStart', round: 2 },
      { t: 'hold', skill: 'ward' },
      { t: 'damage', source: 'enemy', target: 'player', amount: 0, blocked: true, hit: 1, hits: 1, kind: 'physical' },
      { t: 'counter', amount: 2, blocked: false },
      { t: 'burn', side: 'player', amount: 1, status: 'curse' },
      { t: 'heal', side: 'player', amount: 5 },
      { t: 'roundStart', round: 3 },
    ];
    expect(summarizeFight(log)).toEqual({ rounds: 3, dealt: 4, taken: 6, blocked: 1, counters: 1, dotTaken: 1, healed: 5, cards: { attack: 1 }, holds: 1 });
  });

  it('keeps a ring buffer of runs, abandons stale ongoing runs, and ends runs once', () => {
    const log = emptyLog();
    for (let i = 0; i < MAX_RUNS + 3; i++) startRun(log, rec(`s${i}`));
    expect(log.runs).toHaveLength(MAX_RUNS);
    expect(findRun(log, 's0')).toBeUndefined();
    expect(log.runs.filter((r) => r.outcome === 'ongoing')).toHaveLength(1);
    const last = log.runs[log.runs.length - 1]!;
    expect(startRun(log, rec(last.seed))).toBe(last); // idempotent
    endRun(log, last.seed, 'died', 'Boar');
    expect(last.outcome).toBe('died'); expect(last.diedTo).toBe('Boar');
    endRun(log, last.seed, 'won');
    expect(last.outcome).toBe('died');
    expect(describeRuns(log)[describeRuns(log).length - 1]).toContain('died (Boar)');
  });
});

describe('run-log summary (DECISIONS #67)', () => {
  const fight = (enemies: string[], outcome: 'won' | 'lost', kind: 'node' | 'boss' = 'node', hpBefore = 20, hpAfter = 15) =>
    ({ at: 0, screen: 1, enemyId: enemies[0]!, enemies, kind, rounds: 4, hpBefore, hpAfter, dealt: 10, taken: hpBefore - hpAfter, blocked: 0, counters: 0, dotTaken: 0, healed: 0, cards: {}, holds: 0, outcome, deck: [], equipment: {}, stats, gold: 0 });
  const run = (families: string[], outcome: RunRecord['outcome'], fights: FightRecord[], level = 1): RunRecord =>
    ({ ...rec('x'), version: 1, families, level, outcome, screensCleared: 0, fights, rewards: [], shop: [] });
  const log = { version: 1 as const, runs: [
    run([], 'died', [fight(['boar'], 'won'), fight(['boar', 'hex_imp'], 'lost', 'node', 15, 0)]),
    run([], 'died', [fight(['boar'], 'won', 'node', 20, 16), fight(['rat_pack'], 'won', 'node', 17, 10), fight(['wren'], 'lost', 'boss', 12, 0)]),
    run(['warrior_dps'], 'died', [fight(['boar'], 'lost', 'node', 20, 0)], 4),
    run([], 'abandoned', [fight(['boar'], 'won')]),
    run([], 'ongoing', [fight(['boar'], 'won')]),
  ] };
  const names = (id: string) => ({ warrior_dps: 'Berserker' } as Record<string, string>)[id] ?? id;

  it('buckets finished runs by heirloom families and counts what the sim counts', () => {
    const s = summarizeRuns(log, names);
    expect(s.map((b) => b.label)).toEqual(['fresh', 'Berserker']);
    const fresh = s[0]!;
    expect(fresh.runs).toBe(2);
    expect(fresh.reachBossPct).toBe(50);
    expect(fresh.beatBossPct).toBe(0);
    expect(fresh.avgHpAtBoss).toBe(12);
    expect(fresh.avgFightsWon).toBe(1.5);
    expect(fresh.duoFightPct).toBe(20); // 1 of 5 fights
    expect(fresh.duoDeathPct).toBe(50); // 1 of 2 deaths
    expect(fresh.medianRegen).toBe(1); // between fights: +0, +1, +2
    expect(fresh.deaths).toEqual({ 'boar+hex_imp': 1, wren: 1 });
    expect(s[1]!.levels).toEqual([4]);
  });
});
