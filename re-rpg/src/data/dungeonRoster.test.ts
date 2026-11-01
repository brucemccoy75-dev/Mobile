import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { DUNGEON_ROSTER, ENEMIES } from './enemies';
import { enemiesOfTier } from './index';
import { DUNGEON_PAIRS, PAIRS } from './packs';

// BootScene pulls in Phaser, so its art list is read as text.
const BOOT = readFileSync(new URL('../game/scenes/BootScene.ts', import.meta.url), 'utf8');

describe('the Treasure Dungeon roster (DECISIONS #83, #84)', () => {
  it('screen 1 has its original five again; the dungeon five are in no screen', () => {
    expect(enemiesOfTier(1).map((e) => e.id).sort()).toEqual(['adept_necromancer', 'boar', 'hex_imp', 'rat_pack', 'shell_beetle']);
    for (const id of DUNGEON_ROSTER) {
      expect(enemiesOfTier(1).map((e) => e.id)).not.toContain(id);
      expect(enemiesOfTier(2).map((e) => e.id)).not.toContain(id);
    }
    for (const [a, b] of PAIRS[1]) expect(DUNGEON_ROSTER as readonly string[]).not.toContain(a), expect(DUNGEON_ROSTER as readonly string[]).not.toContain(b);
  });

  it('renamed, any two at random as a duo, hornet pairs included', () => {
    expect(DUNGEON_ROSTER.map((id) => ENEMIES.find((e) => e.id === id)!.name)).toEqual(['Wrath Wraith', 'The Midden Queen', 'The Hogpile', 'Spiteful Alpaca', 'Bramble Hornet']);
    expect(DUNGEON_PAIRS).toContainEqual(['bramble_hornet', 'bramble_hornet']);
    expect(DUNGEON_PAIRS.length).toBe(21);
  });

  it('each has art and barks', () => {
    for (const id of DUNGEON_ROSTER) {
      const e = ENEMIES.find((x) => x.id === id)!;
      expect(e.set).toBe('dungeon');
      expect(e.barks?.start?.length).toBeGreaterThan(0);
      expect(e.barks?.death?.length).toBeGreaterThan(0);
      expect(BOOT).toContain(`enemy_${id}_c: 'art/c/${id}@2x.png'`);
    }
  });

  it('screen 2 wears frost names, same moves and stats', () => {
    expect(['ogre', 'iron_knight', 'witch', 'harpies', 'warden'].map((id) => ENEMIES.find((e) => e.id === id)!.name)).toEqual(['Frost Ogre', 'Frozen Knight', 'Icy Witch', 'Snow Harpies', 'The Frost Warden']);
  });
});
