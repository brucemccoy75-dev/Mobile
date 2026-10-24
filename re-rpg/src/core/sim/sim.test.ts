import { describe, it, expect } from 'vitest';
import { runGauntlet, summarize, standardLoadouts } from './gauntlet';
import { greedy } from './policy';

describe('simulator', () => {
  it('runs a gauntlet deterministically', () => {
    const lo = standardLoadouts('warrior')[1]!;
    const a = runGauntlet({ loadout: lo, fights: 3, tier: 1, boss: 'gatekeeper', policy: greedy, seed: 'x' });
    const b = runGauntlet({ loadout: lo, fights: 3, tier: 1, boss: 'gatekeeper', policy: greedy, seed: 'x' });
    expect(a).toEqual(b);
  });

  it('summarizes percentages', () => {
    const lo = standardLoadouts('wizard')[0]!;
    const results = Array.from({ length: 20 }, (_, i) => runGauntlet({ loadout: lo, fights: 2, tier: 1, boss: 'gatekeeper', policy: greedy, seed: `s${i}` }));
    const s = summarize('t', results);
    expect(s.runs).toBe(20);
    expect(s.reachBossPct).toBeGreaterThanOrEqual(0);
    expect(s.reachBossPct).toBeLessThanOrEqual(100);
  });
});
