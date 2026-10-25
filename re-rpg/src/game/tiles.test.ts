import { describe, expect, it } from 'vitest';
import type { ScreenMap, TileType } from '@core/map';
import { groundIndices, propsFor } from './tiles';

function mapOf(rows: string[]): ScreenMap {
  const key: Record<string, TileType> = { '.': 'grass', '#': 'road', 'S': 'swamp', 'A': 'arena', '~': 'water', 'F': 'forest', 'R': 'rock' };
  const tiles = rows.flatMap((r) => [...r].map((c) => key[c]!));
  return { seed: 'seven', screenIndex: 0, width: rows[0]!.length, height: rows.length, tiles, entry: { x: 0, y: 0 }, boss: { x: 0, y: 0 }, bossId: 'gatekeeper', pois: [], guards: [], questGiver: { x: 0, y: 0 }, npcSpot: { x: 0, y: 0 } };
}

describe('ground autotiling', () => {
  it('picks straight, corner and cross path pieces for roads', () => {
    const m = mapOf(['.#.', '###', '.#.']);
    const g = groundIndices(m);
    expect(g[4]!).toBe(32 - 1);                 // cross
    expect([38, 51, 53]).toContain(g[1]! + 1);  // vertical straight (open edge counts as road)
    expect([41, 49, 55]).toContain(g[3]! + 1);  // horizontal straight
    const c = groundIndices(mapOf(['...', '.##', '.#.']));
    expect(c[4]! + 1).toBe(28);                 // S+E corner
  });
  it('wraps a swamp blob with edge and corner tiles from the swamp half of the sheet', () => {
    const m = mapOf(['.....', '.SSS.', '.SSS.', '.SSS.', '.....']);
    const g = groundIndices(m);
    expect(g[6]! + 1 - 56).toBe(10);   // NW corner of the blob: north + west outside
    expect([8, 20]).toContain(g[7]! + 1 - 56); // top edge or its variant
    expect([14, 23]).toContain(g[12]! + 1 - 56); // centre is full swamp
  });
  it('degrades thin shapes to islands instead of crashing', () => {
    const g = groundIndices(mapOf(['...', '.S.', '.S.', '...']));
    expect(g[4]! + 1 - 56).toBe(5);
    expect(groundIndices(mapOf(['~']))[0]!).toBe(112);
  });
  it('places one tree per forest tile and nothing on roads, deterministically', () => {
    const m = mapOf(['F#F', 'FFF']);
    const a = propsFor(m), b = propsFor(m);
    expect(a).toEqual(b);
    expect(a.filter((p) => p.frame.startsWith('tree')).length).toBe(5);
  });
});
