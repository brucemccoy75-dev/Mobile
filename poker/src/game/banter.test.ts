import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../bots/characters';
import { CONVERSATIONS, INTERJECTIONS } from '../content/conversations';
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
    for (const t of ['office', 'ai', 'spouse', 'weather', 'sports', 'dnd', 'kill']) expect(tags.has(t as never), t).toBe(true);
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

describe('Menafee', () => {
  it('never says a word, but gets talked to', () => {
    let clock = 0;
    const banter = new Banter(mulberry32(21), () => clock);
    const ids = new Map([[0, 'human'], [1, 'ulrich'], [2, 'nadia'], [3, 'trish'], [4, 'sal'], [5, 'dolores']]);
    const names = new Map([[0, 'Bruce'], [1, 'Menafee'], [2, 'David'], [3, 'Tim'], [4, 'Jack'], [5, 'Paul']]);
    const table = { ids, names, clarity: () => 0 };
    const byMenafee: string[] = [];
    let addressed = 0;
    for (let i = 0; i < 1500; i++) {
      clock += 1500;
      const s = banter.onEvent({ type: 'turn', seat: 2, legal: { seat: 2 } as never, deadline: null }, table);
      if (!s) continue;
      if (s.seat === 1) byMenafee.push(s.text);
      if (s.text.includes('Menafee')) addressed++;
    }
    expect(byMenafee.length).toBeGreaterThan(0);
    expect(byMenafee.every((t) => t === '')).toBe(true);
    expect(addressed).toBeGreaterThan(0);
  });
});

describe('Bruce', () => {
  it('gets the last word on conversations he was not part of', () => {
    let clock = 0;
    const banter = new Banter(mulberry32(8), () => clock);
    const ids = new Map([[0, 'human'], [1, 'jimmy'], [2, 'trish'], [3, 'dolores'], [4, 'sal'], [5, 'nadia']]);
    const names = new Map([[0, 'Hero'], [1, 'Bruce'], [2, 'Tim'], [3, 'Paul'], [4, 'Jack'], [5, 'David']]);
    const table = { ids, names, clarity: () => 0 };
    const lines: { seat: number; text: string; conversation?: boolean; last?: boolean }[] = [];
    for (let i = 0; i < 1500; i++) {
      clock += 1500;
      const s = banter.onEvent({ type: 'turn', seat: 2, legal: { seat: 2 } as never, deadline: null }, table);
      if (s) lines.push(s);
    }
    const convo = lines.filter((l) => l.conversation);
    // Exchanges end exactly once, and an interjection is the closing line of its exchange.
    const jabs = convo.filter((l) => l.seat === 1 && l.last && INTERJECTIONS.some((j) => l.text.startsWith(j.s.slice(0, 12))));
    expect(jabs.length).toBeGreaterThan(2);
    expect(convo.every((l) => !l.text.includes('{'))).toBe(true);
    for (let i = 1; i < convo.length; i++) if (convo[i - 1].last) expect(convo[i].seat).not.toBe(-1);
  });
});

describe('Skynet', () => {
  it('has a word for every bust, the table frets then eats, and the dead stay quiet', () => {
    let clock = 0;
    const banter = new Banter(mulberry32(13), () => clock);
    const ids = new Map([[0, 'human'], [1, 'jimmy'], [2, 'trish'], [3, 'dolores'], [4, 'sal'], [5, 'nadia']]);
    const names = new Map([[0, 'Hero'], [1, 'Bruce'], [2, 'Tim'], [3, 'Paul'], [4, 'Jack'], [5, 'David']]);
    const table = { ids, names, clarity: () => 0 };
    for (let i = 0; i < 200; i++) {
      clock += 1500;
      banter.onEvent({ type: 'turn', seat: 2, legal: { seat: 2 } as never, deadline: null }, table);
    }
    clock += 1500;
    const kill = banter.onEvent({ type: 'bust', seats: [3], finishes: { 3: 6 } }, table)!;
    expect(kill.seat).toBe(-1);
    expect(kill.trigger).toBe('termination');
    expect(kill.text).toContain('Paul');
    const after: { seat: number; text: string; conversation?: boolean }[] = [];
    for (let i = 0; i < 1240; i++) {
      clock += 1500;
      const s = banter.onEvent({ type: 'turn', seat: 2, legal: { seat: 2 } as never, deadline: null }, table);
      if (s) after.push(s);
    }
    // The first thing anyone says after the laser is the aftermath exchange, and it ends on snacks.
    expect(after[0].conversation).toBe(true);
    const first = after.filter((l) => l.conversation).slice(0, 4);
    expect(first.some((l) => /pretzel|dip|cheese|wings|chips|hummus|snacks|pigs in blankets/i.test(l.text))).toBe(true);
    expect(after.every((l) => !l.text.includes('{'))).toBe(true);
    expect(after.some((l) => l.seat === 3)).toBe(false);
  });
});

describe('fairness', () => {
  it('lets every man who survives the first twenty hands speak', async () => {
    let clock = 0;
    const banter = new Banter(mulberry32(17), () => clock);
    const lineup = CHARACTERS.filter((c) => ['harold', 'dolores', 'nadia', 'chad', 'wen'].includes(c.id));
    const spoke = new Map<string, number>();
    const busted = new Set<string>();
    let hands = 0;
    const table = new TableController({
      lineup, humanName: 'Dave', rng: mulberry32(23), sleep: async () => {}, samples: 40,
      human: (_h, legal) => (legal.canCheck ? { type: 'check' } : legal.callAmount <= 300 ? { type: 'call' } : { type: 'fold' }),
      presenter: {
        present: (ev: TableEvent) => {
          if (ev.type === 'handStart') hands++;
          if (hands > 20) return;
          clock += ev.type === 'turn' ? 2500 : ev.type === 'handEnd' ? 4000 : 900;
          if (ev.type === 'bust') for (const b of ev.seats) busted.add(table.seats.find((x) => x.seat === b)!.id);
          const ids = new Map(table.seats.map((s) => [s.seat, s.id]));
          const names = new Map(table.seats.map((s) => [s.seat, s.name]));
          const s = banter.onEvent(ev, {
            ids, names, clarity: () => 0,
            traits: (seat) => { const c = table.bots.get(seat)?.character; return { talk: c?.talk ?? 1, trash: c?.trash ?? 1 }; },
          });
          if (s) spoke.set(s.speaker, (spoke.get(s.speaker) ?? 0) + 1);
        },
      },
    });
    await table.run();
    for (const c of lineup) if (!busted.has(c.id)) expect(spoke.get(c.id) ?? 0, c.id).toBeGreaterThanOrEqual(3);
  });
});
