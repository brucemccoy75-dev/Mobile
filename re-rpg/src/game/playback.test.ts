import { describe, expect, it } from 'vitest';
import type { CombatEvent } from '@core/combat';
import { beats } from './playback';

const st = (side: 'player' | 'enemy', status: 'weak' | 'exposed' | 'guard' | 'burn', who?: number): CombatEvent => ({ t: 'statusApplied', side, status, turns: 2, magnitude: 1, ...(who !== undefined ? { who } : {}) });
const play: CombatEvent = { t: 'play', side: 'player', skill: 'spiritboomerang', name: 'Spirit Boomerang' };

describe('playback beats (DECISIONS #64)', () => {
  it('statuses that land together play together, each stacked by its target', () => {
    const b = beats([play, st('player', 'exposed'), st('player', 'weak')]);
    expect(b).toHaveLength(2);
    expect(b[1]!.lanes.map((l) => l.map((x) => [x.e.t === 'statusApplied' && x.e.status, x.stack]))).toEqual([[['exposed', 0]], [['weak', 1]]]);
  });
  it('different targets stack separately', () => {
    const b = beats([st('enemy', 'burn', 0), st('enemy', 'burn', 1), st('player', 'weak')]);
    expect(b).toHaveLength(1);
    expect(b[0]!.lanes.map((l) => l[0]!.stack)).toEqual([0, 0, 0]);
  });
  it('a sweep volley is one beat with a lane per enemy; anything else is its own beat', () => {
    const d = (who: number): CombatEvent => ({ t: 'damage', source: 'player', target: 'enemy', amount: 1, blocked: false, hit: 1, hits: 1, kind: 'physical', who, volley: 1 });
    const b = beats([play, d(0), d(1), { t: 'roundStart', round: 2 }]);
    expect(b.map((x) => x.lanes.length)).toEqual([1, 2, 1]);
  });
});
