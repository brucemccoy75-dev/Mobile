import { describe, it, expect } from 'vitest';
import { CLASSES, ENEMIES, ITEMS, SETS, SKILLS, getSkill } from './index';

describe('content integrity', () => {
  it('skill ids are unique', () => {
    const ids = SKILLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every set holds its two class cards plus the general tomes of its kind (DECISIONS #42)', () => {
    const ATTACK_GENERALS = ['mighty_blow', 'last_strike'], DEFENCE_GENERALS = ['warding_blast', 'stand_firm', 'final_stand'];
    for (const set of SETS) {
      const own = set.skills.filter((id) => getSkill(id).classId !== 'any');
      const general = set.skills.filter((id) => getSkill(id).classId === 'any');
      expect(own).toHaveLength(2);
      for (const id of own) { expect(getSkill(id).classId).toBe(set.classId); expect(getSkill(id).setId).toBe(set.id); }
      expect([ATTACK_GENERALS, DEFENCE_GENERALS]).toContainEqual(general);
    }
    // each class has one attack family and one defence family, so every general tome sits in exactly one of its families
    for (const c of ['warrior', 'wizard', 'shaman'] as const) {
      const fams = SETS.filter((s) => s.classId === c);
      for (const id of [...ATTACK_GENERALS, ...DEFENCE_GENERALS]) expect(fams.filter((f) => f.skills.includes(id))).toHaveLength(1);
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
