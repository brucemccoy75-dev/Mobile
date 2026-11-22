import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../engine/rng';
import { mixedLineup, runTournament, summarize } from './run';

describe('simulation', () => {
  it('plays mixed tournaments to a finish and the sharp types beat the tourists', () => {
    const reports = [];
    for (let seed = 1; seed <= 24; seed++) {
      const lineup = mixedLineup(mulberry32(seed * 7919));
      const r = runTournament(lineup, { seed, samples: 60 });
      expect(r.seats.map((s) => s.finish).sort()).toEqual([1, 2, 3, 4, 5, 6]);
      expect(r.hands).toBeGreaterThan(10);
      reports.push(r);
    }
    const { types } = summarize(reports);
    const avg = (t: string) => types.find((x) => x.type === t)!.avgFinish;
    expect(avg('tourist')).toBeGreaterThan(avg('pro'));
    expect(avg('tourist')).toBeGreaterThan(avg('calculator'));
    const vpip = (t: string) => types.find((x) => x.type === t)!.vpip;
    expect(vpip('tourist')).toBeGreaterThan(vpip('calculator'));
    expect(vpip('calculator')).toBeGreaterThan(vpip('nit'));
  });
});
