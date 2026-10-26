import { describe, expect, it } from 'vitest';
import { RunRng } from '@core/rng';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
import { entryToBossSteps, parseScreen, renderAscii } from './authored';
import { findPath } from './pathfind';
import { validate } from './generate';

const parse = (seed: string, i: 0 | 1) => parseScreen(i === 0 ? SCREEN1 : SCREEN2, new RunRng(seed).stream('map'), { seed, screenIndex: i });

describe('authored screens', () => {
  it('both screens parse, validate, and keep their layout across seeds', () => {
    for (const i of [0, 1] as const) {
      const a = parse('one', i), b = parse('two', i);
      expect(validate(a)).toBe(true);
      expect(a.authored).toBe(true);
      expect(a.tiles).toEqual(b.tiles); // layout is fixed
      expect(a.nodes!.map((n) => n.pos)).toEqual(b.nodes!.map((n) => n.pos));
      expect(a.pois.map((p) => p.kind).sort()).toEqual(['chest', 'chest', 'shop', 'shrine']);
      expect(a.guards).toHaveLength(3);
      expect(a.nodes!.filter((n) => n.kind === 'elite')).toHaveLength(2);
      expect(a.nodes!.filter((n) => n.kind === 'fight')).toHaveLength(5);
      expect(a.signposts).toHaveLength(4);
    }
  });

  it('rolls node and guard species per run, elites always as a pair from the screen tier', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) seen.add(parse(`s${i}`, 0).nodes!.map((n) => n.enemyId).join(','));
    expect(seen.size).toBeGreaterThan(3);
    const m = parse('elite', 1);
    for (const n of m.nodes!) {
      if (n.kind === 'elite') { expect(n.extra).toHaveLength(1); expect(['ogre', 'iron_knight', 'witch', 'harpies']).toContain(n.enemyId); }
      else expect(n.extra).toBeUndefined();
    }
    expect(m.bossId).toBe('warden');
  });

  it('every node, guard and POI is reachable from the entry, and guards stand beside their POI', () => {
    const m = parse('reach', 0);
    for (const n of m.nodes!) expect(findPath(m, m.entry, n.pos, { targetOnly: new Set([`${n.pos.x},${n.pos.y}`]) })).not.toBeNull();
    for (const g of m.guards) {
      const poi = m.pois.find((p) => p.id === g.poiId)!;
      expect(Math.abs(g.pos.x - poi.pos.x) + Math.abs(g.pos.y - poi.pos.y)).toBe(1);
    }
    expect(entryToBossSteps(m)).toBeGreaterThan(20);
    expect(entryToBossSteps(m)).toBeLessThan(40);
  });

  it('renders back to the glyphs it was authored with', () => {
    const m = parse('render', 0);
    const back = renderAscii(m);
    const src = SCREEN1.split('\n').filter((r) => r.length > 0).join('\n');
    expect(back).toBe(src);
  });

  it('rejects a guard that is not beside a POI', () => {
    const bad = SCREEN1.replace('^g^..^', '^.^..^').replace('\n^E', '\n^E').replace('^.q..', '^gq..');
    expect(() => parseScreen(bad, new RunRng('x').stream('map'), { seed: 'x', screenIndex: 0 })).toThrow(/guard/);
  });
});
