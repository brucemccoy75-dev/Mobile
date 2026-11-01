import { describe, expect, it } from 'vitest';
import { backdropGround, backdropKey } from './backdrops';

describe('combat backdrops (DECISIONS #80)', () => {
  it('screen 1 fights in the forest; screen 2 on the tundra, whatever the tile', () => {
    expect(backdropKey('forest', 0)).toBe('bg_forest');
    expect(backdropKey('road', 0)).toBe('bg_forest');
    expect(backdropKey(undefined)).toBe('bg_forest');
    for (const t of ['road', 'forest', 'grass', 'arena'] as const) expect(backdropKey(t, 1)).toBe('bg_tundra');
  });

  it('each backdrop carries its own ground colour under the cards', () => {
    expect(backdropGround('bg_forest')).toBe(0x8b8d45);
    expect(backdropGround('bg_tundra')).toBe(0xd0deef);
    expect(backdropGround('bg_unknown')).toBe(0x8b8d45);
    // The Treasure Dungeon fights in its own hall, whatever the screen (DECISIONS #84).
    expect(backdropKey('road', 0, true)).toBe('bg_dungeon');
    expect(backdropGround('bg_dungeon')).toBe(0x312d2c);
  });
});
