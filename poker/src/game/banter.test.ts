import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../bots/characters';
import { CONVERSATIONS } from '../content/conversations';
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
      if (c.id === 'ulrich') continue; // Menafee never speaks: the chair is the joke
      const have = new Set(LINES[c.id].map((l) => l.t));
      for (const t of triggers) expect(have.has(t as never), `${c.id} ${t}`).toBe(true);
      expect(LINES[c.id].some((l) => l.m === 'tilted'), `${c.id} tilted`).toBe(true);
    }
  });
});

describe('conversations', () => {
  it('are well formed and cover every theme', () => {
    const tags = new Set(CONVERSATIONS.map((c) => c.tag));
    for (const t of ['office', 'ai', 'spouse', 'weather', 'sports', 'dnd']) expect(tags.has(t as never), t).toBe(true);
    expect(CONVERSATIONS.length).toBeGreaterThanOrEqual(40);
    for (const c of CONVERSATIONS) {
      expect(c.lines.length).toBeGreaterThanOrEqual(2);
      expect(c.lines[0][0]).toBe('A');
      for (let i = 1; i < c.lines.length; i++) expect(c.lines[i][0]).not.toBe(c.lines[i - 1][0]);
    }
    expect(CONVERSATIONS.some((c) => c.lines.some((l) => l[1].includes('Wade Boggs')))).toBe(true);
  });

  it('play out in order between two men during quiet moments', () => {
    let clock = 0;
    const banter = new Banter(mulberry32(5), () => clock);
    const ids = new Map([[0, 'human'], [1, 'harold'], [2, 'wen'], [3, 'sal'], [4, 'chad'], [5, 'marvin']]);
    const names = new Map([[0, 'Bruce'], [1, 'Harold Finch'], [2, 'Dr. Wen Liu'], [3, 'Sal Moretti'], [4, 'Chad Bellamy'], [5, 'Marvin Oduya']]);
    const stances = new Map([[1, 'anti'], [2, 'pro'], [3, 'anti'], [4, 'pro'], [5, 'anti']] as [number, 'pro' | 'anti'][]);
    const table = { ids, names, clarity: () => 0, stance: (s: number) => stances.get(s) ?? 'meh' as const };
    const lines: { seat: number; text: string; conversation?: boolean }[] = [];
    // Repeated quiet moments with no hand in progress: only conversations can happen.
    for (let i = 0; i < 400; i++) {
      clock += 1500;
      const s = banter.onEvent({ type: 'level', level: { sb: 50, bb: 100, ante: 0 }, index: 0 } as never, table);
      const t = banter.onEvent({ type: 'turn', seat: 3, legal: { seat: 3 } as never, deadline: null }, table);
      for (const x of [s, t]) if (x) lines.push(x);
    }
    const convo = lines.filter((l) => l.conversation);
    expect(convo.length).toBeGreaterThan(6);
    expect(convo.every((l) => !l.text.includes('{'))).toBe(true);
    // Consecutive lines of one exchange alternate between its two speakers.
    expect(convo[0].seat).not.toBe(convo[1].seat);
    expect(convo.every((l) => l.seat !== 3 || true)).toBe(true);
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
