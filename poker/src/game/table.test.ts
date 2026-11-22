import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../bots/characters';
import { mulberry32 } from '../engine/rng';
import { HUMAN_SEAT, TableController, type TableEvent } from './table';

describe('TableController', () => {
  it('plays a whole tournament with an automatic human and emits a coherent event stream', async () => {
    const events: TableEvent[] = [];
    const lineup = CHARACTERS.slice(0, 5);
    const table = new TableController({
      lineup,
      humanName: 'You',
      rng: mulberry32(42),
      presenter: { present: (ev) => void events.push(ev) },
      sleep: async () => {},
      samples: 40,
      // A cautious human: checks when free, calls small bets, folds to big ones.
      human: (_hand, legal) => (legal.canCheck ? { type: 'check' } : legal.callAmount <= 300 ? { type: 'call' } : { type: 'fold' }),
    });
    const result = await table.run();
    expect(result.humanFinish).toBeGreaterThanOrEqual(1);
    expect(result.humanFinish).toBeLessThanOrEqual(6);
    expect(events[0].type).toBe('tournamentStart');
    expect(events.at(-1)!.type).toBe('tournamentEnd');
    const hands = events.filter((e) => e.type === 'handStart').length;
    expect(hands).toBeGreaterThan(3);
    expect(events.filter((e) => e.type === 'handEnd')).toHaveLength(hands);
    // Every turn is followed by an action from that seat.
    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (e.type !== 'turn') continue;
      const next = events.slice(i + 1).find((x) => x.type === 'action');
      expect(next && next.type === 'action' && next.seat).toBe(e.seat);
    }
    // Bots keep memories of the human.
    const mem = table.memories();
    expect(Object.keys(mem)).toHaveLength(5);
    const seen = Object.values(mem).map((m) => m.profiles.human.hands);
    expect(Math.max(...seen)).toBeGreaterThan(0);
    expect(Math.max(...seen)).toBeLessThanOrEqual(hands);
  });

  it('accepts human actions through humanAct and folds on the shot clock', async () => {
    const events: TableEvent[] = [];
    const table = new TableController({
      lineup: CHARACTERS.slice(3, 8),
      humanName: 'You',
      rng: mulberry32(7),
      presenter: { present: (ev) => void events.push(ev) },
      sleep: async () => {},
      samples: 40,
      shotClockMs: 10,
    });
    const run = table.run();
    // Wait for the first human turn and answer it.
    let answered = 0;
    const started = Date.now();
    while (Date.now() - started < 5000 && answered < 1) {
      await new Promise((r) => setTimeout(r, 1));
      const legal = table.humanLegal;
      if (legal) {
        expect(table.humanAct({ type: 'raise', amount: 5 })).toBe(false);
        expect(table.humanAct(legal.canCheck ? { type: 'check' } : { type: 'call' })).toBe(true);
        answered++;
      }
    }
    expect(answered).toBe(1);
    // From here on the shot clock answers for us.
    const result = await run;
    expect(result.humanFinish).toBeGreaterThanOrEqual(1);
    const humanActions = events.filter((e) => e.type === 'action' && e.seat === HUMAN_SEAT);
    expect(humanActions.length).toBeGreaterThan(1);
  }, 30000);
});

describe('pause', () => {
  it('holds the game while paused and resumes', async () => {
    const events: TableEvent[] = [];
    const table = new TableController({
      lineup: CHARACTERS.slice(0, 5), humanName: 'You', rng: mulberry32(9), samples: 40,
      sleep: (ms) => new Promise((r) => setTimeout(r, Math.min(ms, 2))),
      presenter: { present: (ev) => void events.push(ev) },
      shotClockMs: 40,
      human: (_h, legal) => (legal.canCheck ? { type: 'check' } : { type: 'fold' }),
    });
    const run = table.run();
    await new Promise((r) => setTimeout(r, 60));
    table.pause();
    const before = events.length;
    await new Promise((r) => setTimeout(r, 120));
    expect(events.length - before).toBeLessThanOrEqual(1);
    table.resume();
    await new Promise((r) => setTimeout(r, 120));
    expect(events.length).toBeGreaterThan(before + 1);
    table.stop();
    await run;
  });
});
