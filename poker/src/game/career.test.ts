import { describe, expect, it } from 'vitest';
import { CHARACTERS } from '../bots/characters';
import { mulberry32 } from '../engine/rng';
import { TournamentTracker, emptySave, loadSave, recordTournament, writeSave } from './career';
import { TableController } from './table';

class MemStorage {
  data = new Map<string, string>();
  getItem(k: string) { return this.data.get(k) ?? null; }
  setItem(k: string, v: string) { this.data.set(k, v); }
  removeItem(k: string) { this.data.delete(k); }
}

describe('career', () => {
  it('round-trips through storage, tolerates garbage, and folds an old per-table save into one record', () => {
    const st = new MemStorage();
    const save = emptySave();
    save.name = 'Bruce';
    save.record.wins = 2;
    save.rivals.sal = { games: 3, wins: 2, losses: 1, knockouts: 1, knockedOutBy: 0 };
    writeSave(save, st);
    expect(loadSave(st).record.wins).toBe(2);
    expect(loadSave(st).rivals.sal.knockouts).toBe(1);
    expect(loadSave(st).name).toBe('Bruce');
    st.setItem('pihkh.save.v2', '{not json');
    expect(loadSave(st).name).toBe('Hero');
    // An old save: three tables' records become one.
    const old = new MemStorage();
    old.setItem('pihkh.save.v1', JSON.stringify({ version: 1, name: 'X', tournaments: {
      tutorial: { played: 2, wins: 1, finishes: [0, 1, 0, 1, 0, 0, 0], bestHand: null, biggestPot: 500, handsPlayed: 40 },
      vegas: { played: 1, wins: 0, finishes: [0, 0, 0, 0, 0, 1, 0], bestHand: { score: 9, description: 'a flush' }, biggestPot: 900, handsPlayed: 20 },
    }, trophies: { first_win: { earnedAt: 1, count: 1 } } }));
    const m = loadSave(old);
    expect(m.version).toBe(2);
    expect(m.name).toBe('X');
    expect(m.record.played).toBe(3);
    expect(m.record.wins).toBe(1);
    expect(m.record.finishes[5]).toBe(1);
    expect(m.record.biggestPot).toBe(900);
    expect(m.record.bestHand?.description).toBe('a flush');
    expect(m.trophies.first_win.count).toBe(1);
    expect(m.rivals).toEqual({});
  });

  it('records results, rivalries and first-time trophies once', () => {
    const save = emptySave();
    const tracker = new TournamentTracker();
    tracker.lastOpponentType = 'pro';
    tracker.bustedByMe = new Set([1, 2, 3, 4, 5]);
    tracker.rivals = ['sal', 'trish', 'nadia', 'chad', 'wen'];
    tracker.knockouts = ['sal', 'trish', 'nadia', 'chad', 'wen'];
    for (const [id, f] of [['sal', 6], ['trish', 5], ['nadia', 4], ['chad', 3], ['wen', 2]] as [string, number][]) tracker.finishes.set(id, f);
    const fresh = recordTournament(save, { humanFinish: 1, handsPlayed: 30 }, tracker);
    const ids = fresh.map((t) => t.id);
    expect(ids).toContain('first_win');
    expect(ids).toContain('pro_heads_up');
    expect(ids).toContain('bust_all');
    expect(ids).toContain('speed_run');
    expect(ids).not.toContain('nemesis');
    expect(save.record.wins).toBe(1);
    expect(save.record.finishes[1]).toBe(1);
    expect(save.rivals.sal).toEqual({ games: 1, wins: 1, losses: 0, knockouts: 1, knockedOutBy: 0 });
    const again = recordTournament(save, { humanFinish: 1, handsPlayed: 30 }, tracker);
    expect(again).toHaveLength(0);
    expect(save.trophies.first_win.count).toBe(2);
    expect(save.rivals.wen.knockouts).toBe(2);
    // A night you lose: the men still in outlasted you, the one who busted you gets the credit.
    const lost = new TournamentTracker();
    lost.rivals = ['sal', 'trish', 'nadia', 'chad', 'wen'];
    lost.finishes.set('sal', 6);
    lost.knockedOutBy = 'nadia';
    const third = recordTournament(save, { humanFinish: 5, handsPlayed: 50 }, lost);
    expect(third).toHaveLength(0);
    expect(save.record.finishes[5]).toBe(1);
    expect(save.rivals.sal).toMatchObject({ games: 3, wins: 3, losses: 0 });
    expect(save.rivals.nadia).toMatchObject({ games: 3, wins: 2, losses: 1, knockedOutBy: 1 });
    // Nemesis after five knockouts of one man; Nobody's Safe once every man has gone down once.
    for (let i = 0; i < 3; i++) recordTournament(save, { humanFinish: 1, handsPlayed: 30 }, tracker);
    expect(save.trophies.nemesis.count).toBe(1);
    expect(save.trophies.everyone).toBeUndefined();
  });

  it('tracks a whole night from events: rivals, finishes, and who busted whom', async () => {
    const tracker = new TournamentTracker();
    const lineup = CHARACTERS.slice(0, 5);
    const table = new TableController({
      lineup, humanName: 'Bruce', rng: mulberry32(5), sleep: async () => {}, samples: 40,
      human: (_h, legal) => (legal.canCheck ? { type: 'check' } : legal.callAmount <= 400 ? { type: 'call' } : { type: 'fold' }),
      presenter: { present: (ev) => tracker.onEvent(ev) },
    });
    const r = await table.run();
    expect(tracker.handsPlayed).toBe(table.tournament.handsPlayed);
    expect(tracker.rivals.sort()).toEqual(lineup.map((c) => c.id).sort());
    expect(tracker.finishes.size).toBe(5);
    if (r.humanFinish === 1) {
      expect(tracker.lastOpponentType).not.toBeNull();
      expect(tracker.knockedOutBy).toBeNull();
    } else {
      expect(tracker.knockedOutBy).not.toBeNull();
    }
    for (const id of tracker.knockouts) expect(lineup.some((c) => c.id === id)).toBe(true);
    const save = emptySave();
    recordTournament(save, { humanFinish: r.humanFinish, handsPlayed: tracker.handsPlayed }, tracker);
    expect(Object.keys(save.rivals)).toHaveLength(5);
    expect(Object.values(save.rivals).every((x) => x.games === 1 && x.wins + x.losses === 1)).toBe(true);
  });
});
