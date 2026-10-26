import { describe, it, expect } from 'vitest';
import { getSkill } from './index';
import { cardFace, describeSkill } from './describe';

const warrior = { maxHp: 25, atk: 4, def: 1 };
const geared = { maxHp: 31, atk: 7, def: 1 };

describe('describeSkill', () => {
  it('shows real numbers for the current stats, not percentages', () => {
    expect(describeSkill(getSkill('attack'), warrior)).toBe('Deal 4 damage.');
    expect(describeSkill(getSkill('attack'), geared)).toBe('Deal 7 damage.');
    expect(describeSkill(getSkill('broadsword'), warrior)).toBe('Deal 8 damage. You are Exposed this round.');
    expect(describeSkill(getSkill('broadsword'), geared)).toBe('Deal 11 damage. You are Exposed this round.');
    expect(describeSkill(getSkill('defend'), warrior)).toBe('Block the next physical hit.');
    expect(describeSkill(getSkill('ward'), warrior)).toBe('Block the next magic hit or curse.');
    expect(describeSkill(getSkill('shield_bash'), warrior)).toBe('Deal 2 damage. Block the next physical hit. Tiring: Weak next turn.');
  });

  it('special tomes state their usage rule', () => {
    expect(describeSkill(getSkill('mighty_blow'), warrior)).toBe('Deal 8 damage. Once per fight.');
    expect(describeSkill(getSkill('final_stand'), warrior)).toBe('Block every hit for 3 rounds. Fleeting: spent when played.');
  });

  it('covers heals, guards, statuses, multi-hit and lifesteal', () => {
    expect(describeSkill(getSkill('bind_wound'), warrior)).toBe('Heal 6 HP. You are Exposed for 2 rounds. Once per fight.');
    expect(describeSkill(getSkill('ice_armor'), warrior)).toBe('Block the next 2 physical hits.');
    expect(describeSkill(getSkill('fireball'), { maxHp: 20, atk: 5, def: 0 })).toBe('Deal 8 magic damage. Burn 2 per round for 2 rounds.');
    expect(describeSkill(getSkill('frost_bolt'), { maxHp: 20, atk: 5, def: 0 })).toBe('Deal 6 magic damage. 65% chance: Chill: the enemy skips its next action.');
    expect(describeSkill(getSkill('spirit_lash'), { maxHp: 20, atk: 4, def: 1 })).toBe('Deal 5 damage, heal half of it.');
    expect(describeSkill(getSkill('lightning'), { maxHp: 20, atk: 4, def: 1 })).toBe('Deal 6 magic damage, ignoring defence.');
    expect(describeSkill(getSkill('exposing_strike'), warrior)).toBe('Deal 4 damage. Enemy Exposed for 2 rounds.');
  });
});

describe('gear adds flat damage (DECISIONS #31)', () => {
  it('multiplies class attack only; gear attack is added per hit', () => {
    const stacked = { maxHp: 20, atk: 11, def: 0, gearAtk: 7 };
    expect(describeSkill(getSkill('attack'), stacked)).toBe('Deal 11 damage.');          // 4 + 7
    expect(describeSkill(getSkill('mighty_blow'), stacked)).toContain('Deal 15 damage'); // 8 + 7, not 22
    expect(describeSkill(getSkill('broadsword'), stacked)).toContain('Deal 15 damage');  // 4 + 7 + 4
  });
});

describe('cardFace', () => {
  const warrior = { maxHp: 25, atk: 4, def: 1 };
  it('classifies cards and picks the headline number', () => {
    expect(cardFace(getSkill('attack'), warrior)).toEqual({ kind: 'attack', value: '4', unit: 'damage' });
    expect(cardFace(getSkill('defend'), warrior)).toEqual({ kind: 'defense', value: '1', unit: 'hit' });
    expect(cardFace(getSkill('ward'), warrior)).toEqual({ kind: 'defense', value: '1', unit: 'spell' });
    expect(cardFace(getSkill('bind_wound'), warrior)).toEqual({ kind: 'heal', value: '6', unit: 'heal' });
    expect(cardFace(getSkill('fireball'), warrior)).toEqual({ kind: 'magic', value: '6', unit: 'magic' });
    expect(cardFace(getSkill('ice_armor'), warrior)).toEqual({ kind: 'defense', value: '2', unit: 'hits' });
    expect(cardFace(getSkill('static_field'), warrior)).toEqual({ kind: 'magic', value: '3×3', unit: 'burn' });
    expect(cardFace(getSkill('stand_firm'), warrior)).toEqual({ kind: 'defense', value: '2', unit: 'rounds' });
    expect(cardFace(getSkill('shield_bash'), warrior).kind).toBe('attack');
  });

  it('with a preview, the headline is what lands and the unit says why', () => {
    const one = (amount: number, reasons: string[] = []) => ({ hits: [{ amount, blocked: false }], reasons });
    expect(cardFace(getSkill('attack'), warrior, one(4))).toEqual({ kind: 'attack', value: '4', unit: 'damage' });
    expect(cardFace(getSkill('attack'), warrior, one(3, ['armour']))).toEqual({ kind: 'attack', value: '3', unit: 'damage · armour' });
    expect(cardFace(getSkill('attack'), warrior, one(2, ['armour', 'hardened']))).toEqual({ kind: 'attack', value: '2', unit: 'damage · armour, hardened' });
    expect(cardFace(getSkill('fireball'), warrior, one(12, ['exposed']))).toEqual({ kind: 'magic', value: '12', unit: 'magic · exposed' });
    expect(cardFace(getSkill('attack'), warrior, { hits: [{ amount: 0, blocked: true }], reasons: ['guarded'] })).toEqual({ kind: 'attack', value: '0', unit: 'blocked · guarded' });
    expect(cardFace(getSkill('attack'), warrior, { hits: [{ amount: 0, blocked: true }, { amount: 4, blocked: false }, { amount: 4, blocked: false }], reasons: ['guarded'] })).toEqual({ kind: 'attack', value: '8', unit: 'damage · guarded' });
    const flurry = { ...getSkill('attack'), effects: [{ type: 'damage' as const, mult: 1, hits: 2 }] };
    expect(cardFace(flurry, warrior, { hits: [{ amount: 3, blocked: false }, { amount: 3, blocked: false }], reasons: ['armour'] })).toEqual({ kind: 'attack', value: '3×2', unit: 'damage · armour' });
    // Non-damage cards ignore the preview.
    expect(cardFace(getSkill('defend'), warrior, one(0))).toEqual({ kind: 'defense', value: '1', unit: 'hit' });
  });
});

