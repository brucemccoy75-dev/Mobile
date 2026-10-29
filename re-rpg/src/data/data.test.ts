import { describe, it, expect } from 'vitest';
import { CARDS_DATA, CLASSES, ENEMIES, ITEMS, SETS, SKILLS, compileCards, diffCards, getSkill, validateCards, type CardsData } from './index';

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
      // Bulwark also holds Repair Boomerang, a class-any card; Shadow Knight holds no general tomes (2026-10-27 imports).
      expect([ATTACK_GENERALS, DEFENCE_GENERALS, [...DEFENCE_GENERALS, 'healboomerang'], []]).toContainEqual(general);
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
  it('remove guard and remove buffs (DECISIONS #48) compile to a strip that runs before the damage and follows its targets', () => {
    const data: CardsData = JSON.parse(JSON.stringify(CARDS_DATA));
    data.modifiers.push({ id: 'break_guard', name: 'Break guard', target: 'enemy', status: 'remove_guard' }, { id: 'strip_all', name: 'Strip', target: 'enemy', status: 'remove_buffs' });
    data.cards.find((c) => c.id === 'bellow')!.modifiers = ['break_guard'];
    data.cards.find((c) => c.id === 'broadsword')!.modifiers = ['overextend', 'strip_all'];
    expect(validateCards(data)).toEqual([]);
    const { skills } = compileCards(data);
    const bellow = skills.find((k) => k.id === 'bellow')!;
    expect(bellow.effects).toEqual([{ type: 'strip', statuses: ['guard'], targets: 'all' }, { type: 'damage', mult: 0, flat: 1, ignoreDef: true, targets: 'all' }]);
    expect(bellow.text).toBe("Remove every enemy's Guard first. Deal 0% + 1 damage to every enemy, ignoring defence.");
    const broad = skills.find((k) => k.id === 'broadsword')!;
    expect(broad.effects[0]).toEqual({ type: 'strip', statuses: ['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter'] });
    expect(broad.effects.map((e) => e.type)).toEqual(['strip', 'damage', 'status']);
    const bad: CardsData = JSON.parse(JSON.stringify(data));
    bad.modifiers.find((m) => m.id === 'break_guard')!.target = 'self';
    expect(validateCards(bad)).toEqual(['modifier break_guard: remove_guard works on the enemy only']);
  });
});

describe('backfire modifier (DECISIONS #51)', () => {
  it('compiles last, reads as a warning, and the validator wants it on yourself with a percent', () => {
    const data: CardsData = JSON.parse(JSON.stringify(CARDS_DATA));
    data.modifiers.push({ id: 'backfire_all', name: 'Backfire', target: 'self', status: 'backfire', amount: 100 });
    data.cards.find((c) => c.id === 'broadsword')!.modifiers = ['backfire_all', 'overextend'];
    expect(validateCards(data)).toEqual([]);
    const broad = compileCards(data).skills.find((k) => k.id === 'broadsword')!;
    expect(broad.effects.at(-1)).toEqual({ type: 'backfire', pct: 1 });
    expect(broad.text).toContain('If the target survives, you lose all your HP.');
    const half: CardsData = JSON.parse(JSON.stringify(data));
    half.modifiers.find((m) => m.id === 'backfire_all')!.amount = 50;
    expect(compileCards(half).skills.find((k) => k.id === 'broadsword')!.text).toContain('If the target survives, you lose 50% of your max HP.');
    const bad: CardsData = JSON.parse(JSON.stringify(data));
    bad.modifiers.find((m) => m.id === 'backfire_all')!.target = 'enemy';
    delete bad.modifiers.find((m) => m.id === 'backfire_all')!.amount;
    expect(validateCards(bad)).toEqual(['modifier backfire_all: backfire works on yourself only', 'modifier backfire_all: backfire needs an amount (percent of max HP, 1-100)']);
  });
});

describe('branching cards and new statuses (DECISIONS #69)', () => {
  const dmg = (percent: number, bonus = 0) => ({ percent, bonus, hits: 1, type: 'physical' as const, ignoreDef: false, drain: 0, targets: 'one' as const });
  const base = (): CardsData => {
    const data: CardsData = JSON.parse(JSON.stringify(CARDS_DATA));
    data.modifiers.push(
      { id: 't_regen', name: 'Lunch', target: 'self', status: 'regen', rounds: 3, amount: 10 },
      { id: 't_bj', name: 'Blackjack', target: 'self', status: 'blackjack', amount: 5 },
      { id: 't_more', name: 'One more', target: 'self', status: 'extra_play', amount: 1 },
      { id: 't_draw', name: 'Draw to 3', target: 'self', status: 'draw_to', amount: 3 },
    );
    data.cards.push(
      { id: 't_desp', name: 'Desp', classId: 'warrior', rarity: 'rare', uses: 'fleeting', condition: { kind: 'self_hp_below', percent: 20 }, damage: null, heal: { percent: 20, flat: 0 }, modifiers: [], else: { damage: dmg(0, 5), heal: null, modifiers: [] } },
      { id: 't_knife', name: 'Knife', classId: 'warrior', rarity: 'rare', uses: null, condition: { kind: 'enemy_debuffed' }, damage: dmg(150), heal: null, modifiers: [], else: { damage: null, heal: null, modifiers: ['tiring'] } },
      { id: 't_trick', name: 'Trick', classId: 'warrior', rarity: 'rare', uses: null, condition: { kind: 'coin' }, damage: dmg(50), heal: null, modifiers: ['t_more', 't_draw'], else: { damage: null, heal: null, modifiers: ['winded'] } },
      { id: 't_lunch', name: 'Lunch', classId: 'warrior', rarity: 'rare', uses: null, damage: null, heal: null, modifiers: ['t_regen'] },
      { id: 't_bjc', name: 'BJ', classId: 'warrior', rarity: 'rare', uses: null, damage: null, heal: null, modifiers: ['t_bj'] },
    );
    return data;
  };
  const sk = (data: CardsData, id: string) => compileCards(data).skills.find((k) => k.id === id)!;

  it('a condition compiles to one branch effect with both sides, and reads as a sentence', () => {
    const data = base();
    expect(validateCards(data)).toEqual([]);
    expect(sk(data, 't_desp').effects).toEqual([{ type: 'if', cond: { kind: 'selfHpBelow', pct: 0.2 }, then: [{ type: 'heal', pct: 0.2 }], else: [{ type: 'damage', mult: 0, flat: 5 }] }]);
    expect(sk(data, 't_desp').text).toBe('If your HP is below 20%: Heal 20% HP. Otherwise: Deal 0% + 5 damage. Fleeting: spent when played.');
    expect(sk(data, 't_knife').effects).toEqual([{ type: 'if', cond: { kind: 'targetDebuffed' }, then: [{ type: 'damage', mult: 1.5 }], else: [{ type: 'status', target: 'self', status: 'weak', turns: 2 }] }]);
    expect(sk(data, 't_trick').effects).toEqual([{ type: 'if', cond: { kind: 'coin' }, then: [{ type: 'damage', mult: 0.5 }, { type: 'extraPlay', n: 1 }, { type: 'draw', upTo: 3 }], else: [{ type: 'status', target: 'self', status: 'exposed', turns: 2 }] }]);
    expect(sk(data, 't_trick').text).toBe('Call the coin. Right: Deal 50% damage. Play one more card this turn. Draw until you hold 3. Wrong: You are Exposed for 2 rounds.');
  });

  it('Regen and Blackjack compile as statuses on yourself; Blackjack lasts the fight', () => {
    const data = base();
    expect(sk(data, 't_lunch').effects).toEqual([{ type: 'status', target: 'self', status: 'regen', turns: 3, magnitude: 10 }]);
    expect(sk(data, 't_bjc').effects).toEqual([{ type: 'status', target: 'self', status: 'blackjack', turns: 99, magnitude: 5 }]);
    expect(sk(data, 't_lunch').text).toBe('Lunch Break: heal 10% of max HP a round for 3 rounds. No damage cards meanwhile.');
    expect(sk(data, 't_bjc').text).toBe('Blackjack: your hits deal 5× for the rest of the fight. Deal more than 21 in total and you die.');
  });

  it('the validator names what is wrong with a branch or a new status', () => {
    const a = base(); a.cards.find((c) => c.id === 't_desp')!.condition = { kind: 'self_hp_below', percent: 0 };
    expect(validateCards(a)).toEqual(['card t_desp: HP threshold must be 1-99']);
    const b = base(); delete b.cards.find((c) => c.id === 't_knife')!.condition;
    expect(validateCards(b)).toEqual(['card t_knife: an otherwise branch needs a condition']);
    const c = base(); c.cards.find((x) => x.id === 't_knife')!.else = { damage: null, heal: null, modifiers: [] };
    expect(validateCards(c)).toEqual(['card t_knife: the otherwise branch needs damage, heal or a modifier']);
    const d = base(); d.modifiers.find((m) => m.id === 't_regen')!.amount = 60;
    expect(validateCards(d)).toEqual(['modifier t_regen: regen amount is a percent of max HP, 1-50']);
    const e = base(); e.modifiers.find((m) => m.id === 't_bj')!.rounds = 3;
    expect(validateCards(e)).toEqual(['modifier t_bj: blackjack lasts the fight: amount 2-9, no rounds or chance']);
    const f = base(); f.modifiers.find((m) => m.id === 't_more')!.target = 'enemy';
    expect(validateCards(f)).toEqual(['modifier t_more: extra_play works on yourself only']);
    const g = base(); g.modifiers.find((m) => m.id === 't_draw')!.amount = 5;
    expect(validateCards(g)).toEqual(['modifier t_draw: draw_to needs an amount 1-3']);
    const h = base(); h.cards.find((x) => x.id === 't_knife')!.else!.damage = { ...dmg(0), percent: 0 };
    expect(validateCards(h)).toEqual(['card t_knife: otherwise damage needs a percent or a bonus']);
  });
});

describe('the five synergy cards (DECISIONS #69)', () => {
  it('compile as designed and sit in their families', () => {
    expect(getSkill('desperation')).toMatchObject({ setId: 'warrior_tank', rarity: 'rare', uses: 'fleeting', effects: [{ type: 'if', cond: { kind: 'selfHpBelow', pct: 0.2 }, then: [{ type: 'heal', pct: 0.2 }], else: [{ type: 'damage', mult: 0, flat: 5 }] }] });
    expect(getSkill('utility_knife')).toMatchObject({ setId: 'warrior_tank', rarity: 'rare', vfx: 'slash', effects: [{ type: 'if', cond: { kind: 'targetDebuffed' }, then: [{ type: 'damage', mult: 1.5 }], else: [{ type: 'status', target: 'self', status: 'weak', turns: 2 }] }] });
    expect(getSkill('lunch_break')).toMatchObject({ setId: 'warrior_dps', rarity: 'rare', vfx: 'sandwich', effects: [{ type: 'status', target: 'self', status: 'regen', turns: 3, magnitude: 10 }] });
    expect(getSkill('blackjack')).toMatchObject({ setId: 'warrior_dps', rarity: 'rare', vfx: 'cards', effects: [{ type: 'status', target: 'self', status: 'blackjack', turns: 99, magnitude: 5 }] });
    expect(getSkill('trickster')).toMatchObject({ setId: 'warrior_dps', rarity: 'rare', vfx: 'coin', effects: [{ type: 'if', cond: { kind: 'coin' },
      then: [{ type: 'damage', mult: 0.5 }, { type: 'extraPlay', n: 1 }, { type: 'draw', upTo: 3 }],
      else: [{ type: 'status', target: 'self', status: 'weak', turns: 2 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }, { type: 'status', target: 'self', status: 'curse', turns: 2, magnitude: 1 }] }] });
  });
});
