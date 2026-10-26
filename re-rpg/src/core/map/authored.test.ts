import { describe, expect, it } from 'vitest';
import { RunRng } from '@core/rng';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
import { parseScreen, renderAscii, roadBetween } from './authored';
import { validate } from './generate';

const parse = (seed: string, i: 0 | 1) => parseScreen(i === 0 ? SCREEN1 : SCREEN2, new RunRng(seed).stream('map'), { seed, screenIndex: i });

describe('authored node screens', () => {
  it('both screens parse and validate; the network is fixed, the contents are not', () => {
    for (const i of [0, 1] as const) {
      const a = parse('one', i), b = parse('two', i);
      expect(validate(a)).toBe(true);
      expect(a.tiles).toEqual(b.tiles);
      expect(a.nodes!.map((n) => [n.pos, n.links])).toEqual(b.nodes!.map((n) => [n.pos, n.links]));
      const kinds = a.nodes!.map((n) => n.kind);
      expect(kinds.filter((k) => k === 'start')).toHaveLength(1);
      expect(kinds.filter((k) => k === 'boss')).toHaveLength(1);
      expect(kinds.filter((k) => k === 'quest')).toHaveLength(1);
      expect(kinds.filter((k) => k === 'lost')).toHaveLength(1);
      expect(kinds.filter((k) => k === 'elite')).toHaveLength(2);
      expect(kinds.filter((k) => k === 'shop')).toHaveLength(1);
      expect(kinds.filter((k) => k === 'shrine')).toHaveLength(1);
      expect(kinds.filter((k) => k === 'treasure').length).toBeGreaterThanOrEqual(1);
      expect(kinds.filter((k) => k === 'monster' || k === 'unknown').length).toBeGreaterThanOrEqual(5);
    }
  });

  it('the start node is the first node and links only forward; the boss hangs off the last elite', () => {
    const m = parse('shape', 0);
    const start = m.nodes!.find((n) => n.kind === 'start')!;
    expect(start.pos).toEqual(m.entry);
    expect(start.links).toHaveLength(1);
    const boss = m.nodes!.find((n) => n.kind === 'boss')!;
    expect(boss.links).toHaveLength(1);
    expect(m.nodes!.find((n) => n.id === boss.links[0])!.kind).toBe('elite');
  });

  it('links are symmetric and every road between linked nodes is walkable', () => {
    const m = parse('links', 1);
    for (const n of m.nodes!) for (const l of n.links) {
      const o = m.nodes!.find((x) => x.id === l)!;
      expect(o.links).toContain(n.id);
      const path = roadBetween(m, n.pos, o.pos);
      expect(path.length).toBeGreaterThan(0);
      expect(path.at(-1)).toEqual(o.pos);
    }
  });

  it('dead ends never hold a plain monster when a calm type is left in the bag', () => {
    for (let i = 0; i < 10; i++) {
      const m = parse(`de${i}`, 0);
      const deadEnds = m.nodes!.filter((n) => n.links.length === 1 && n.kind !== 'start' && n.kind !== 'boss' && n.kind !== 'lost');
      expect(deadEnds.every((n) => ['shop', 'shrine', 'treasure'].includes(n.kind))).toBe(true);
    }
  });

  it('rolls species per run; elites are pairs; unknowns carry a hidden species', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 12; i++) seen.add(parse(`s${i}`, 0).nodes!.map((n) => `${n.kind}:${n.enemyId ?? ''}`).join(','));
    expect(seen.size).toBeGreaterThan(5);
    const m = parse('elite', 1);
    for (const n of m.nodes!) {
      if (n.kind === 'elite') expect(n.extra).toHaveLength(1);
      if (n.kind === 'unknown' || n.kind === 'monster') expect(['ogre', 'iron_knight', 'witch', 'harpies']).toContain(n.enemyId);
    }
    expect(m.bossId).toBe('warden');
  });

  it('renders back to glyphs with the rolled kinds', () => {
    const back = renderAscii(parse('render', 0));
    expect(back.split('\n')).toHaveLength(18);
    expect(back).toContain('E');
    expect(back).toContain('B');
  });

  it('rejects a layout without a start', () => {
    expect(() => parseScreen(SCREEN1.replace('E', '='), new RunRng('x').stream('map'), { seed: 'x', screenIndex: 0 })).toThrow(/needs E/);
  });
});
