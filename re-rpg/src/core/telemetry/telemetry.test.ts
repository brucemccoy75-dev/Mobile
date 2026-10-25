import { describe, expect, it } from 'vitest';
import type { CombatEvent } from '@core/combat';
import { MAX_RUNS, describeRuns, emptyLog, endRun, findRun, startRun, summarizeFight } from './index';

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
