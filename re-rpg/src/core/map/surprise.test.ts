import { describe, expect, it } from 'vitest';
import { RunRng } from '@core/rng';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
import { enemiesOfTier } from '@data/index';
import { parseScreen } from './authored';
import { SURPRISE_CHANCE, rollSurprises } from './surprise';

const roll = (seed: string, i: 0 | 1, rules = {}) => {
  const m = parseScreen(i === 0 ? SCREEN1 : SCREEN2, new RunRng(seed).stream('map'), { seed, screenIndex: i, rules });
  rollSurprises(m.nodes!, enemiesOfTier(i + 1 as 1 | 2).map((e) => e.id), new RunRng(seed).stream('surprise'), rules);
  return m;
};

describe('surprise fights (DECISIONS #81)', () => {
  it('about 15% of single-enemy fight nodes hide another species from the same roster', () => {
    let eligible = 0, surprised = 0;
    for (let k = 0; k < 300; k++) for (const i of [0, 1] as const) {
      const m = roll(`s${k}`, i);
      const roster = enemiesOfTier(i + 1 as 1 | 2).map((e) => e.id);
      for (const n of m.nodes!) {
        if ((n.kind === 'monster' || n.kind === 'unknown') && !n.extra?.length) eligible++;
        if (!n.surprise) continue;
        surprised++;
        expect(n.surprise).not.toBe(n.enemyId);
        expect(roster).toContain(n.surprise);
      }
    }
    expect(surprised / eligible).toBeGreaterThan(SURPRISE_CHANCE - 0.03);
    expect(surprised / eligible).toBeLessThan(SURPRISE_CHANCE + 0.03);
  });

  it('never the boss, an elite, a duo, a cursed node or a node the designer set', () => {
    for (let k = 0; k < 200; k++) {
      const m = roll(`n${k}`, 0, { node_4: { enemy: 'boar' } });
      for (const n of m.nodes!) if (n.surprise) {
        expect(['monster', 'unknown']).toContain(n.kind);
        expect(n.extra?.length ?? 0).toBe(0);
        expect(n.id).not.toBe('node_4');
      }
    }
    const m = roll('cursed', 0);
    const n = m.nodes!.find((x) => x.kind === 'monster')!;
    delete n.surprise; n.cursed = ['thorns', 'shield'];
    rollSurprises([n], ['boar', 'hex_imp'], new RunRng('x').stream('surprise'));
    expect(n.surprise).toBeUndefined();
  });

  it('the same seed rolls the same surprises', () => {
    expect(roll('same', 1).nodes!.map((n) => n.surprise)).toEqual(roll('same', 1).nodes!.map((n) => n.surprise));
  });
});
