import { describe, expect, it } from 'vitest';
import { ENEMIES, ROSTER } from './enemies';
import { enemiesOfTier } from './index';
import { PAIRS } from './packs';
import { readFileSync } from 'node:fs';

// BootScene pulls in Phaser, so its art list is read as text.
const BOOT = readFileSync(new URL('../game/scenes/BootScene.ts', import.meta.url), 'utf8');

const CRAWL = ['rage_elemental', 'the_hoarder', 'porkchop_express', 'bad_llama', 'brindled_vespa'];

describe('the crawl roster (DECISIONS #83)', () => {
  it('replaces screen 1 while the switch is on, and the original five come back when it is off', () => {
    expect(ROSTER.crawl).toBe(true);
    expect(enemiesOfTier(1).map((e) => e.id).sort()).toEqual([...CRAWL].sort());
    ROSTER.crawl = false;
    try { expect(enemiesOfTier(1).map((e) => e.id).sort()).toEqual(['adept_necromancer', 'boar', 'hex_imp', 'rat_pack', 'shell_beetle']); }
    finally { ROSTER.crawl = true; }
    expect(enemiesOfTier(2).map((e) => e.id)).not.toContain('bad_llama');
  });

  it('duos are any two at random, Vespa pairs included', () => {
    for (const [a, b] of PAIRS[1]) { expect(CRAWL).toContain(a); expect(CRAWL).toContain(b); }
    expect(PAIRS[1]).toContainEqual(['brindled_vespa', 'brindled_vespa']);
    expect(PAIRS[1].length).toBe(21);
  });

  it('balanced like the screen-1 five, each with art, start and death barks', () => {
    for (const id of CRAWL) {
      const e = ENEMIES.find((x) => x.id === id)!;
      expect(e.stats.maxHp).toBeGreaterThanOrEqual(8);
      expect(e.stats.maxHp).toBeLessThanOrEqual(14);
      expect(e.stats.atk).toBeLessThanOrEqual(4);
      expect(e.barks?.start?.length).toBeGreaterThan(0);
      expect(e.barks?.death?.length).toBeGreaterThan(0);
      expect(BOOT).toContain(`enemy_${id}_c: 'art/c/${id}@2x.png'`);
    }
    expect(ENEMIES.find((x) => x.id === 'rage_elemental')!.barks?.rage?.length).toBeGreaterThan(0);
  });
});
