import { describe, expect, it } from 'vitest';
import { classProgress, createMeta, gainExp, unlockNode } from '@core/meta';
import { buildPool, cursedPool } from '@core/loot';
import { CURSED_CHANCE, CURSED_MIN_LEVEL, cursedEnemy, rollCursedTraits } from '@core/variants';
import { RunRng } from '@core/rng';
import { getEnemy, getSkill } from '@data/index';
import { applyTome, cardsLocked, createSession, liftCurse, nodeEncounter, poolCtx, takeChoice } from './session';

/** Cursed enemies (DECISIONS #73). */
const fightKinds = new Set(['monster', 'unknown', 'elite']);
const levelled = (level: number) => {
  const meta = createMeta();
  while (classProgress(meta, 'warrior').level < level) gainExp(meta, 'warrior', 50);
  return meta;
};

describe('cursed enemies (DECISIONS #73)', () => {
  it('never below class level 3; at 3 or higher about one fight node in twenty', () => {
    expect(CURSED_MIN_LEVEL).toBe(3);
    expect(CURSED_CHANCE).toBe(0.05);
    const low = levelled(2);
    for (let i = 0; i < 60; i++) expect(createSession('warrior', low, `LOW-${i}`).map.nodes!.some((n) => n.cursed)).toBe(false);
    const high = levelled(3);
    let nodes = 0, cursed = 0;
    for (let i = 0; i < 300; i++) {
      for (const n of createSession('warrior', high, `HIGH-${i}`).map.nodes!) {
        if (!fightKinds.has(n.kind)) { expect(n.cursed).toBeUndefined(); continue; }
        nodes++; if (n.cursed) cursed++;
      }
    }
    expect(cursed / nodes).toBeGreaterThan(0.03);
    expect(cursed / nodes).toBeLessThan(0.07);
  });

  it('two different traits, and the variant carries them: 2× HP and 2× attack are in its stats', () => {
    const rng = new RunRng('t').stream('cursed');
    for (let i = 0; i < 50; i++) { const t = rollCursedTraits(rng); expect(t).toHaveLength(2); expect(new Set(t).size).toBe(2); }
    const boar = getEnemy('boar');
    const c = cursedEnemy(boar, ['hp', 'damage']);
    expect(c).toMatchObject({ id: 'boar', name: 'Cursed Boar', cursed: ['hp', 'damage'], stats: { maxHp: boar.stats.maxHp * 2, atk: boar.stats.atk * 2 } });
    expect(cursedEnemy(boar, ['shield', 'thorns']).stats).toEqual(boar.stats);
  });

  it('a cursed duo node is one cursed enemy alone; lifting the curse brings the duo back', () => {
    const meta = levelled(3);
    for (let i = 0; i < 400; i++) {
      const s = createSession('warrior', meta, `DUO-${i}`);
      const n = s.map.nodes!.find((x) => x.cursed && x.extra?.length);
      if (!n) continue;
      const e = nodeEncounter(s, n);
      expect(e.cursed).toBe(true);
      expect(e.custom).toHaveLength(1);
      expect(e.custom![0]).toMatchObject({ id: n.enemyId, cursed: n.cursed });
      liftCurse(s, n);
      const plain = nodeEncounter(s, n);
      expect(plain.cursed).toBeUndefined();
      expect(plain.custom).toBeUndefined();
      expect(plain.extra).toEqual(n.extra);
      return;
    }
    throw new Error('no cursed duo node in 400 seeds');
  });

  it('the cursed pool is outside the families, and a card that locks takes every other card off the table', () => {
    const s = createSession('warrior', levelled(3), 'POOL');
    const ctx = poolCtx(s);
    expect(cursedPool(ctx).map((k) => k.id)).toEqual(['cursed_counter']);
    expect(buildPool({ ...ctx, families: ['warrior_tank', 'warrior_dps', 'warrior_shadow_knight'] }).tomes.some((k) => k.pool === 'cursed')).toBe(false);
    applyTome(s, getSkill('cursed_counter'));
    const locked = poolCtx(s);
    expect(buildPool({ ...locked, families: ['warrior_tank'] }).tomes).toEqual([]);
    expect(cursedPool(locked)).toEqual([]);
    expect(buildPool({ ...locked, families: ['warrior_tank'] }).items.length).toBeGreaterThan(0); // gear is still fine
  });

  it('holding Cursed Counter, a card already on the shop shelf cannot be bought, and no route adds a card', () => {
    const meta = levelled(3);
    unlockNode(meta, 'warrior', 'warrior_tank');
    let s = createSession('warrior', meta, 'SHOP-0');
    for (let i = 1; !s.shop.lines.some((l) => l.kind === 'tome'); i++) s = createSession('warrior', meta, `SHOP-${i}`);
    const line = s.shop.lines.find((l) => l.kind === 'tome')!; // stocked before the lock, as in the bug
    expect(cardsLocked(s)).toBe(false);
    applyTome(s, getSkill('cursed_counter'));
    expect(cardsLocked(s)).toBe(true);
    const before = [...s.deck];
    takeChoice(s, meta, { kind: 'tome', skill: getSkill(line.id) });
    applyTome(s, getSkill('bind_wound'));
    expect(s.deck).toEqual(before);
  });
});
