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
  it('round-trips through storage and tolerates garbage', () => {
    const st = new MemStorage();
    const save = emptySave();
    save.name = 'Bruce';
    save.tournaments.vegas.wins = 2;
    writeSave(save, st);
    expect(loadSave(st).tournaments.vegas.wins).toBe(2);
    expect(loadSave(st).name).toBe('Bruce');
    st.setItem('pihkh.save.v1', '{not json');
    expect(loadSave(st).name).toBe('Hero');
    st.setItem('pihkh.save.v1', JSON.stringify({ version: 1, name: 'X' }));
    expect(loadSave(st).tournaments.tutorial.played).toBe(0);
  });

  it('records results and awards first-time trophies once', () => {
    const save = emptySave();
    const tracker = new TournamentTracker();
    tracker.lastOpponentType = 'pro';
    tracker.bustedByMe = new Set([1, 2, 3, 4, 5]);
    const fresh = recordTournament(save, { key: 'vegas', humanFinish: 1, handsPlayed: 30 }, tracker);
    const ids = fresh.map((t) => t.id);
    expect(ids).toContain('first_win');
    expect(ids).toContain('vegas_win');
    expect(ids).toContain('pro_heads_up');
    expect(ids).toContain('bust_all');
    expect(ids).toContain('speed_run');
    expect(save.tournaments.vegas.wins).toBe(1);
    expect(save.tournaments.vegas.finishes[1]).toBe(1);
    const again = recordTournament(save, { key: 'vegas', humanFinish: 1, handsPlayed: 30 }, tracker);
    expect(again).toHaveLength(0);
    expect(save.trophies.first_win.count).toBe(2);
    const third = recordTournament(save, { key: 'tutorial', humanFinish: 4, handsPlayed: 50 }, new TournamentTracker());
    expect(third).toHaveLength(0);
    expect(save.tournaments.tutorial.finishes[4]).toBe(1);
  });

  it('tracks a whole tournament from events', async () => {
    const tracker = new TournamentTracker();
    const table = new TableController({
      lineup: CHARACTERS.slice(0, 5), humanName: 'Bruce', rng: mulberry32(5), sleep: async () => {}, samples: 40,
      human: (_h, legal) => (legal.canCheck ? { type: 'check' } : legal.callAmount <= 400 ? { type: 'call' } : { type: 'fold' }),
      presenter: { present: (ev) => tracker.onEvent(ev) },
    });
    const r = await table.run();
    expect(tracker.handsPlayed).toBe(table.tournament.handsPlayed);
    if (r.humanFinish === 1) expect(tracker.lastOpponentType).not.toBeNull();
    expect(tracker.biggestPot).toBeGreaterThanOrEqual(0);
  });
});
