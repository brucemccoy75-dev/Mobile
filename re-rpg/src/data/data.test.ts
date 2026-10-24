import { describe, it, expect } from 'vitest';
import { CLASSES, ENEMIES, ITEMS, SETS, SKILLS, getSkill } from './index';

describe('content integrity', () => {
  it('skill ids are unique', () => {
    const ids = SKILLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every set references existing skills of its class', () => {
    for (const set of SETS) {
      expect(set.skills).toHaveLength(2);
      for (const id of set.skills) {
        const s = getSkill(id);
        expect(s.classId).toBe(set.classId);
        expect(s.setId).toBe(set.id);
      }
    }
  });

  it('every class has two sets that exist', () => {
    for (const c of CLASSES) {
      expect(c.sets).toHaveLength(2);
      for (const id of c.sets) expect(SETS.find((s) => s.id === id)?.classId).toBe(c.id);
    }
  });

  it('enemy ids are unique and tables are non-empty', () => {
    const ids = ENEMIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of ENEMIES) {
      const moves = e.table.kind === 'sequence' ? e.table.moves : e.table.moves.map((m) => m.move);
      expect(moves.length).toBeGreaterThan(0);
      for (const p of e.phases ?? []) expect(p.hpBelow).toBeGreaterThan(0);
    }
  });

  it('starting HP matches the brief: 25 / 20 / 20', () => {
    const hp = Object.fromEntries(CLASSES.map((c) => [c.id, c.stats.maxHp]));
    expect(hp).toEqual({ warrior: 25, wizard: 20, shaman: 20 });
  });

  it('item ids are unique, every slot has commons for every class, tags reference real sets', () => {
    const ids = ITEMS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const slot of ['body', 'weapon', 'relic'] as const) for (const c of CLASSES) {
      expect(ITEMS.some((i) => i.slot === slot && i.rarity === 'common' && (!i.classes || i.classes.includes(c.id)))).toBe(true);
    }
    for (const i of ITEMS) for (const t of i.tags ?? []) expect(SETS.some((s) => s.id === t)).toBe(true);
  });
});
