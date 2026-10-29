import { describe, expect, it } from 'vitest';
import { RunRng } from '@core/rng';
import { getSet } from '@data/index';
import { greedy } from './policy';
import { buildScreen, rollHeirlooms, runScreen, screenLoadouts, screenRoute } from './screen';

/** The screen-1 mirror (DECISIONS #67): the real map, duos and shrine included, ending at the gate. */
describe('screen mirror', () => {
  const map = buildScreen('mirror-1', 0);
  const nodes = map.nodes!;
  const fightKinds = new Set(['monster', 'unknown', 'elite']);

  it('a full clear visits every fight and the shrine, nearest first, and never the boss', () => {
    const route = screenRoute(map, 'clear');
    const want = nodes.filter((n) => fightKinds.has(n.kind) || n.kind === 'shrine').map((n) => n.id).sort();
    expect(route.map((n) => n.id).sort()).toEqual(want);
    expect(route.some((n) => n.kind === 'boss' || n.kind === 'start')).toBe(false);
    const start = nodes.find((n) => n.kind === 'start')!;
    expect(start.links).toContain(route[0]!.id);
  });

  it('the short route is only what lies on the shortest road to the gate', () => {
    const short = screenRoute(map, 'short'), clear = screenRoute(map, 'clear');
    expect(short.length).toBeLessThan(clear.length);
    for (const n of short) expect(clear).toContain(n);
  });

  it('runs deterministically, fights every fight on the route when it survives, and meets duos', () => {
    const fresh = screenLoadouts('warrior')[0]!;
    const opts = { loadout: fresh, route: 'clear' as const, boss: 'wren' as const, policy: greedy };
    expect(runScreen({ ...opts, seed: 'a' })).toEqual(runScreen({ ...opts, seed: 'a' }));
    let duos = 0;
    for (let i = 0; i < 40; i++) {
      const r = runScreen({ ...opts, seed: `s${i}` });
      duos += r.duos;
      if (r.reachedBoss) expect(r.fightsWon).toBeGreaterThanOrEqual(r.fights);
    }
    expect(duos).toBeGreaterThan(0);
  });

  it('opens a run with two heirlooms drawn from the loadout families, as a real run does', () => {
    const lo = screenLoadouts('warrior').find((l) => l.families?.length === 1 && l.families[0] === 'warrior_dps')!;
    const deck = rollHeirlooms(lo, new RunRng('h').stream('heirlooms'));
    expect(deck).toHaveLength(2);
    expect(new Set(deck).size).toBe(2);
    for (const id of deck) expect(getSet('warrior_dps').skills).toContain(id);
  });
});
