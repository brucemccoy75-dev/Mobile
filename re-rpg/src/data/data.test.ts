import { describe, it, expect } from 'vitest';
import { CARDS_DATA, CLASSES, ENEMIES, ITEMS, SETS, SKILLS, diffCards, getSkill, validateCards, type CardsData } from './index';

describe('content integrity', () => {
  it('skill ids are unique', () => {
    const ids = SKILLS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every set holds its two class cards plus the general tomes of its kind (DECISIONS #42)', () => {
    const ATTACK_GENERALS = ['mighty_blow', 'last_strike'], DEFENCE_GENERALS = ['warding_blast', 'stand_firm', 'final_stand'];
    for (const set of SETS) {
      if (!set.skills.length) continue; // a family with no cards yet (Shadow Knight, Paladin, Weaponmaster)
      const own = set.skills.filter((id) => getSkill(id).classId !== 'any');
      const general = set.skills.filter((id) => getSkill(id).classId === 'any');
      expect(own.length).toBeGreaterThanOrEqual(2); // two to start with; the editor may add more (Spirit Boomerang, 2026-10-27)
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

describe('cards.json (DECISIONS #44)', () => {
  it('the shipped file passes every rule, against itself as the shipped baseline', () => {
    expect(validateCards(CARDS_DATA, CARDS_DATA)).toEqual([]);
    expect(diffCards(CARDS_DATA, CARDS_DATA)).toEqual([]);
  });
  it('compiles the same effects the hand-written data had', () => {
    expect(getSkill('shield_bash').effects).toEqual([{ type: 'damage', mult: 0.25 }, { type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 1 }, { type: 'status', target: 'self', status: 'weak', turns: 2 }]);
    expect(getSkill('frost_bolt').effects).toEqual([{ type: 'damage', mult: 1.2, kind: 'magic' }, { type: 'status', target: 'enemy', status: 'chill', turns: 1, chance: 0.65 }]);
    expect(getSkill('lightning').effects).toEqual([{ type: 'damage', mult: 1.6, ignoreDef: true, kind: 'magic' }]);
    expect(getSkill('spirit_lash').effects).toEqual([{ type: 'damage', mult: 1.2, lifesteal: 0.5 }]);
    expect(getSkill('bind_wound')).toMatchObject({ setId: 'warrior_tank', uses: 'once_per_fight', effects: [{ type: 'heal', pct: 0.25 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] });
    expect(getSkill('mighty_blow').setId).toBeUndefined();
    expect(getSkill('shield_bash').text).toBe('Deal 25% damage. Block the next physical hit. Tiring: Weak next turn.');
  });
  it('the validator names what is wrong', () => {
    const clone = (): CardsData => JSON.parse(JSON.stringify(CARDS_DATA));
    const a = clone(); a.cards.find((c) => c.id === 'broadsword')!.damage!.percent = 900;
    expect(validateCards(a)).toEqual(['card broadsword: damage percent must be 0-500']);
    const b = clone(); b.cards.find((c) => c.id === 'broadsword')!.modifiers.push('nope');
    expect(validateCards(b)).toEqual(['card broadsword: unknown modifier nope']);
    const c = clone(); c.families.find((f) => f.id === 'warrior_tank')!.cards.push('broadsword');
    expect(validateCards(c)).toEqual(['card broadsword: listed by 2 warrior families; one at most']);
    const d = clone(); d.cards = d.cards.filter((x) => x.id !== 'exposing_strike'); d.families.forEach((f) => { f.cards = f.cards.filter((x) => x !== 'exposing_strike'); });
    expect(validateCards(d, CARDS_DATA)).toEqual(['import: card exposing_strike was removed; set its family to none instead']);
    const e = clone(); e.cards.find((x) => x.id === 'fireball')!.damage!.percent = 200;
    expect(validateCards(e, CARDS_DATA)).toEqual(['import: wizard data changed; only the warrior is in scope']);
    const f = clone(); f.trees.warrior[0]!.cost = 11;
    expect(validateCards(f)).toEqual(['tree warrior/warrior_dps: cost must be 0-10']);
  });
});
