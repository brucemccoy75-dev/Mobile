import { describe, expect, it } from 'vitest';
import { getSkill } from './index';
import { cardFace, cardTheme } from './describe';

const theme = (id: string) => { const s = getSkill(id); return cardTheme(s, cardFace(s, { maxHp: 25, atk: 4, def: 1 }).kind); };

describe('card frames by theme, colour by kind (DECISIONS #85)', () => {
  it('swords for physical attacks, shields for physical blocks', () => {
    expect(theme('attack')).toBe('sword');
    expect(theme('bellow')).toBe('sword'); // a stun shout (#88) wears attack red and swords
    expect(theme('blackjack')).toBe('sword');
    expect(theme('defend')).toBe('shield');
  });
  it('magic for magic damage, Ward and heals', () => {
    expect(theme('ward')).toBe('magic');
    expect(theme('warding_blast')).toBe('magic');
    expect(theme('spiritboomerang')).toBe('magic');
    expect(theme('bind_wound')).toBe('magic');
  });
  it('bones for a cursed card', () => {
    expect(theme('cursed_counter')).toBe('curse');
  });
  it('the colour is still the kind', () => {
    expect(cardFace(getSkill('ward'), { maxHp: 25, atk: 4, def: 1 }).kind).toBe('defense'); // a magic frame on a blue card
  });
});
