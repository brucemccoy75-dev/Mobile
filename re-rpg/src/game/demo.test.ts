import { describe, expect, it } from 'vitest';
import { createMeta } from '@core/meta';
import { createCombat, step } from '@core/combat';
import { Rng } from '@core/rng';
import { getEnemy } from '@data/index';
import { cursedEnemy, dungeonEnemy } from '@core/variants';
import { DUNGEON_ROSTER } from '@data/enemies';
import { cardsLocked, createDemo, offRecord, runBasics, sellableCards } from './session';
import type { Enemy } from '@data/types';

describe('demo mode (DECISIONS #93)', () => {
  it('a demo run is off the record, holds only Doom, and can gain no other card', () => {
    for (const screen of [0, 1]) {
      const s = createDemo('warrior', createMeta(), screen);
      expect(s.screenIndex).toBe(screen);
      expect(offRecord(s)).toBe(true);
      expect(s.heirloomChoices).toEqual([]);
      expect(s.deck).toEqual(['doom', 'doom', 'doom']);
      expect(runBasics(s)).toEqual([]);
      expect(cardsLocked(s)).toBe(true);
      expect(sellableCards(s)).toEqual([]);
    }
  });

  it('Doom kills every enemy in one play: bosses, duos, guarded, shielded, cursed, dungeon-tough, while you are Weak', () => {
    const big: (string | Enemy)[][] = [
      ['warden'], ['gatekeeper'], ['ogre', 'iron_knight'],
      [cursedEnemy(getEnemy('ogre'), ['hp', 'shield'])], [cursedEnemy(getEnemy('iron_knight'), ['hp', 'shield'])],
      ...DUNGEON_ROSTER.map((id) => [dungeonEnemy(getEnemy(id))]),
    ];
    for (const enemies of big) {
      const s = createCombat({ player: { stats: { maxHp: 25, atk: 4, def: 1 }, deck: ['doom', 'doom', 'doom'], basics: [] }, enemies, rng: new Rng(1) });
      for (const e of s.enemies) e.statuses.push({ id: 'guard', turns: 99, magnitude: 3 }, { id: 'aegis', turns: 3, magnitude: 1 }, { id: 'harden', turns: 3, magnitude: 1 });
      s.player.statuses.push({ id: 'weak', turns: 3, magnitude: 1 });
      step(s, { type: 'card', index: 0 });
      expect(s.outcome, JSON.stringify(enemies.map((e) => (typeof e === 'string' ? e : e.name)))).toBe('won');
    }
  });
});

describe('a card may carry its own text (DECISIONS #93)', () => {
  it('Doom reads its written line; a card without one is still generated', async () => {
    const { getSkill, describeSkill } = await import('@data/index');
    const st = { maxHp: 25, atk: 4, def: 1 };
    expect(describeSkill(getSkill('doom'), st)).toBe('Every enemy dies. Demo mode only.');
    expect(describeSkill(getSkill('attack'), st)).toBe('Deal 4 damage.');
  });
});
