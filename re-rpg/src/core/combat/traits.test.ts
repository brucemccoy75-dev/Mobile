import { describe, expect, it } from 'vitest';
import { CURSED_TRAIT_INFO } from './traits';
import { CURSED_FOLLOW_UP, CURSED_THORNS } from './engine';
import { CURSED_SHIELD } from './damage';

describe('cursed trait chips (DECISIONS #78)', () => {
  it('every trait has a chip, and the chips quote the engine numbers', () => {
    expect(Object.keys(CURSED_TRAIT_INFO).sort()).toEqual(['damage', 'followUp', 'hp', 'shield', 'thorns']);
    expect(CURSED_TRAIT_INFO.thorns.label).toBe(`THORNS ${CURSED_THORNS}`);
    expect(CURSED_TRAIT_INFO.thorns.desc).toContain(`${CURSED_THORNS} HP`);
    expect(CURSED_TRAIT_INFO.thorns.desc).toContain('kills it costs nothing');
    expect(CURSED_TRAIT_INFO.followUp.desc).toContain(`${CURSED_FOLLOW_UP * 100}%`);
    expect(CURSED_TRAIT_INFO.shield.desc).toContain(`${CURSED_SHIELD * 100}%`);
  });
});
