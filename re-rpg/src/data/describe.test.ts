import { describe, it, expect } from 'vitest';
import { getSkill } from './index';
import { describeSkill } from './describe';

const warrior = { maxHp: 25, atk: 4, def: 1 };
const geared = { maxHp: 31, atk: 7, def: 1 };

describe('describeSkill', () => {
  it('shows real numbers for the current stats, not percentages', () => {
    expect(describeSkill(getSkill('attack'), warrior)).toBe('Deal 4 damage.');
    expect(describeSkill(getSkill('attack'), geared)).toBe('Deal 7 damage.');
    expect(describeSkill(getSkill('broadsword'), warrior)).toBe('Deal 8 damage. You are Exposed this round.');
    expect(describeSkill(getSkill('broadsword'), geared)).toBe('Deal 11 damage. You are Exposed this round.');
    expect(describeSkill(getSkill('defend'), warrior)).toBe('Block the next physical hit.');
    expect(describeSkill(getSkill('ward'), warrior)).toBe('Block the next magic hit.');
    expect(describeSkill(getSkill('shield_bash'), warrior)).toBe('Deal 2 damage. Block the next physical hit. Tiring: Weak next turn.');
  });

  it('special tomes state their usage rule', () => {
    expect(describeSkill(getSkill('mighty_blow'), warrior)).toBe('Deal 8 damage. Once per fight.');
    expect(describeSkill(getSkill('final_stand'), warrior)).toBe('Block every hit for 3 rounds. Fleeting: spent when played.');
  });

  it('covers heals, guards, statuses, multi-hit and lifesteal', () => {
    expect(describeSkill(getSkill('bind_wound'), warrior)).toBe('Heal 9 HP. You are Exposed for 2 rounds.');
    expect(describeSkill(getSkill('ice_armor'), warrior)).toBe('Block the next 2 physical hits.');
    expect(describeSkill(getSkill('fireball'), { maxHp: 20, atk: 5, def: 0 })).toBe('Deal 8 magic damage. Burn 2 per round for 2 rounds.');
    expect(describeSkill(getSkill('frost_bolt'), { maxHp: 20, atk: 5, def: 0 })).toBe('Deal 6 magic damage. 65% chance: Chill: the enemy skips its next action.');
    expect(describeSkill(getSkill('spirit_lash'), { maxHp: 20, atk: 4, def: 1 })).toBe('Deal 5 damage, heal half of it.');
    expect(describeSkill(getSkill('lightning'), { maxHp: 20, atk: 4, def: 1 })).toBe('Deal 6 magic damage, ignoring defence.');
    expect(describeSkill(getSkill('exposing_strike'), warrior)).toBe('Deal 4 damage. Enemy Exposed for 2 rounds.');
  });
});
