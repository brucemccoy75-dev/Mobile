import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../bots/characters';
import { LINES } from '../content/lines';
import { mulberry32 } from '../engine/rng';
import { Banter } from './banter';
import { TableController, type TableEvent } from './table';

describe('lines', () => {
  it('has at least 100 lines per type and a dealer set', () => {
    const perType: Record<string, number> = {};
    for (const c of CHARACTERS) perType[c.type] = (perType[c.type] ?? 0) + (LINES[c.id]?.length ?? 0);
    for (const [type, n] of Object.entries(perType)) expect(n, type).toBeGreaterThanOrEqual(100);
    expect(LINES.dealer.length).toBeGreaterThan(15);
  });

  it('covers every trigger for every character', () => {
    const triggers = ['dealtIn', 'foldPreflop', 'raise', 'reraise', 'callBig', 'allIn', 'facingAllIn', 'winNoShowdown', 'bluffWorked', 'winShowdown', 'loseShowdown', 'badBeatTaken', 'badBeatGiven', 'bluffCaught', 'targetFoldsToMe', 'targetCallsMeDown', 'stackedTarget', 'stackedByTarget', 'targetTank', 'targetInstant', 'shortStack', 'chipLeader', 'playerOut', 'headsUp', 'idle'];
    for (const c of CHARACTERS) {
      const have = new Set(LINES[c.id].map((l) => l.t));
      for (const t of triggers) expect(have.has(t as never), `${c.id} ${t}`).toBe(true);
      expect(LINES[c.id].some((l) => l.m === 'tilted'), `${c.id} tilted`).toBe(true);
    }
  });
});

describe('Banter', () => {
  it('speaks during a tournament, in character, without repeating itself too soon', async () => {
    let clock = 0;
    const banter = new Banter(mulberry32(3), () => clock);
    const lineup = CHARACTERS.filter((c) => ['harold', 'chad', 'wen', 'sal', 'trish'].includes(c.id));
    const speeches: { speaker: string; text: string; trigger: string }[] = [];
    const table = new TableController({
      lineup, humanName: 'Bruce', rng: mulberry32(11), sleep: async () => {}, samples: 40,
      human: (_h, legal) => (legal.canCheck ? { type: 'check' } : legal.callAmount <= 300 ? { type: 'call' } : { type: 'fold' }),
      presenter: {
        present: (ev: TableEvent) => {
          clock += 1500;
          const ids = new Map(table.seats.map((s) => [s.seat, s.id]));
          const names = new Map(table.seats.map((s) => [s.seat, s.name]));
          const s = banter.onEvent(ev, { ids, names, clarity: (seat) => table.bots.get(seat)?.stats.clarity ?? 0 });
          if (s) speeches.push(s);
        },
      },
    });
    await table.run();
    expect(speeches.length).toBeGreaterThan(5);
    expect(speeches.every((s) => !s.text.includes('{'))).toBe(true);
    const speakers = new Set(speeches.map((s) => s.speaker));
    expect(speakers.size).toBeGreaterThan(1);
    // The human is addressed by name, never as "You".
    expect(speeches.some((s) => s.text.includes('Bruce'))).toBe(true);
    // Within one trigger, a character works through fresh lines before repeating any.
    const perKey = new Map<string, string[]>();
    for (const s of speeches) {
      const key = `${s.speaker}:${s.trigger}`;
      (perKey.get(key) ?? perKey.set(key, []).get(key)!).push(s.text);
    }
    for (const [key, texts] of perKey) {
      const [id, trigger] = key.split(':');
      const pool = LINES[id].filter((l) => l.t === trigger).length;
      expect(new Set(texts).size, key).toBeGreaterThanOrEqual(Math.min(texts.length, Math.ceil(pool / 2)));
    }
  });
});
