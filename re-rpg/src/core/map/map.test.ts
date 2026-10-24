import { describe, it, expect } from 'vitest';
import { Rng, RunRng } from '@core/rng';
import { generateScreen, validate } from './generate';
import { findPath, costField } from './pathfind';
import { stepThreat } from './encounter';
import { TILE_COST, key, type ScreenMap, type TileType } from './types';

const gen = (seed: string, screenIndex = 0) => generateScreen(new RunRng(seed).stream('map'), { seed, screenIndex });

describe('generateScreen', () => {
  const seeds = Array.from({ length: 40 }, (_, i) => `seed-${i}`);

  it('is deterministic per seed', () => {
    expect(gen('AMBER-FOX-1')).toEqual(gen('AMBER-FOX-1'));
    expect(gen('AMBER-FOX-1')).not.toEqual(gen('AMBER-FOX-2'));
  });

  it('every seed yields a valid, fully connected screen with 4 POIs and 4 guards', () => {
    for (const s of seeds) {
      const m = gen(s);
      expect(validate(m)).toBe(true);
      expect(m.pois.map((p) => p.kind).sort()).toEqual(['chest', 'chest', 'shop', 'shrine']);
      expect(m.guards).toHaveLength(4);
      expect(m.tiles).toHaveLength(m.width * m.height);
    }
  });

  it('entry is west, boss is east, and a road connects them', () => {
    for (const s of seeds.slice(0, 10)) {
      const m = gen(s);
      expect(m.entry.x).toBeLessThan(m.boss.x);
      const roadOnly = (mm: ScreenMap, x: number, y: number) => (['road', 'arena'] as TileType[]).includes(mm.tiles[y * mm.width + x]!) ? 1 : Infinity;
      expect(findPath(m, m.entry, m.boss, { costOf: roadOnly })).not.toBeNull();
    }
  });

  it('POIs are off the road and cost at least 8 to reach from it; each guard is adjacent to its POI', () => {
    for (const s of seeds.slice(0, 15)) {
      const m = gen(s);
      for (const p of m.pois) {
        expect(m.tiles[p.pos.y * m.width + p.pos.x]).not.toBe('road');
        expect(p.cost).toBeGreaterThanOrEqual(8);
        const g = m.guards.find((g) => g.id === p.guardId)!;
        expect(Math.abs(g.pos.x - p.pos.x) + Math.abs(g.pos.y - p.pos.y)).toBe(1);
      }
    }
  });

  it('screen 2 uses tier-2 guards and the Warden', () => {
    const m = gen('s2', 1);
    expect(m.bossId).toBe('warden');
    expect(m.guards.every((g) => ['ogre', 'iron_knight', 'witch', 'harpies'].includes(g.enemyId))).toBe(true);
  });

  it('mixes biomes: has road, grass, forest and some obstacles', () => {
    const m = gen('biome');
    const count = (t: TileType) => m.tiles.filter((x) => x === t).length;
    expect(count('road')).toBeGreaterThan(40);
    expect(count('grass')).toBeGreaterThan(100);
    expect(count('forest')).toBeGreaterThan(50);
    expect(count('rock') + count('water')).toBeGreaterThan(20);
  });
});

describe('findPath', () => {
  const m = gen('path');

  it('finds a path from entry to boss and it is contiguous and passable', () => {
    const p = findPath(m, m.entry, m.boss)!;
    expect(p).not.toBeNull();
    let prev = m.entry;
    for (const t of p) {
      expect(Math.abs(t.x - prev.x) + Math.abs(t.y - prev.y)).toBe(1);
      expect(TILE_COST[m.tiles[t.y * m.width + t.x]!]).not.toBe(Infinity);
      prev = t;
    }
    expect(prev).toEqual(m.boss);
  });

  it('returns null for impassable or blocked targets', () => {
    const rock = m.tiles.findIndex((t) => t === 'rock');
    expect(findPath(m, m.entry, { x: rock % m.width, y: Math.floor(rock / m.width) })).toBeNull();
    expect(findPath(m, m.entry, m.boss, { blocked: new Set([key(m.boss)]) })).toBeNull();
  });

  it('routes around a guard unless it is the target', () => {
    const g = m.guards[0]!;
    const blocked = new Set([key(g.pos)]);
    const around = findPath(m, m.entry, g.pos, { blocked });
    expect(around).toBeNull();
    const onto = findPath(m, m.entry, g.pos, { targetOnly: blocked })!;
    expect(onto.at(-1)).toEqual(g.pos);
    expect(onto.slice(0, -1).some((t) => key(t) === key(g.pos))).toBe(false);
  });

  it('prefers the road over forest', () => {
    const p = findPath(m, m.entry, m.boss)!;
    const roadShare = p.filter((t) => ['road', 'arena'].includes(m.tiles[t.y * m.width + t.x]!)).length / p.length;
    expect(roadShare).toBeGreaterThan(0.8);
  });

  it('costField marks unreachable tiles Infinity', () => {
    const c = costField(m, [m.entry]);
    expect(c[m.entry.y * m.width + m.entry.x]).toBe(0);
    const rock = m.tiles.findIndex((t) => t === 'rock');
    expect(c[rock]).toBe(Infinity);
  });
});

describe('threat meter', () => {
  it('never fires on roads', () => {
    const rng = new Rng(1);
    let meter = 0.99;
    for (let i = 0; i < 100; i++) { const r = stepThreat(meter, 'road', 0, rng); expect(r.encounter).toBe(false); meter = r.meter; }
  });

  it('fires after about five forest steps and resets low', () => {
    const rng = new Rng(2);
    let meter = 0, steps = 0, fired = false;
    while (!fired && steps < 20) { const r = stepThreat(meter, 'forest', 0, rng); meter = r.meter; fired = r.encounter; steps++; }
    expect(fired).toBe(true);
    expect(steps).toBe(5);
    expect(meter).toBeLessThan(0.35);
  });

  it('screen 2 is more dangerous', () => {
    const rng = new Rng(3);
    let meter = 0, steps = 0, fired = false;
    while (!fired && steps < 20) { const r = stepThreat(meter, 'forest', 1, rng); meter = r.meter; fired = r.encounter; steps++; }
    expect(steps).toBe(4);
  });
});
