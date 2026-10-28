import { describe, expect, it } from 'vitest';
import { getSkill, getEnemy } from '@data/index';
import { VFX_KINDS, vfxForEffects, vfxForSkill, isBuff } from './index';

describe('battle effects (DECISIONS #59)', () => {
  it('cards pick their effect from what they do', () => {
    expect(vfxForSkill(getSkill('attack'))).toBe('slash');
    expect(vfxForSkill(getSkill('broadsword'))).toBe('slash');
    expect(vfxForSkill(getSkill('fireball'))).toBe('fireball'); // magic + burn
    expect(vfxForSkill(getSkill('lightning'))).toBe('lightning'); // magic, ignores defence
    expect(vfxForSkill(getSkill('frost_bolt'))).toBe('frost'); // magic + chill
    expect(vfxForSkill(getSkill('static_field'))).toBe('poison'); // burn with no hit: the rain cloud
    expect(vfxForSkill(getSkill('spiritboomerang'))).toBe('lightning');
    expect(vfxForSkill(getSkill('warding_blast'))).toBe('arcane');
    expect(vfxForSkill(getSkill('bind_wound'))).toBe('heal');
    expect(vfxForSkill(getSkill('defend'))).toBe('none'); // a buff glows on its own
  });
  it('a card may name its effect, and every named one is a known kind', () => {
    expect(vfxForSkill({ ...getSkill('attack'), vfx: 'fireball' })).toBe('fireball');
    expect(VFX_KINDS).toContain('poison');
  });
  it('enemy moves read the same way', () => {
    const moves = (id: string) => { const t = getEnemy(id).table; return t.kind === 'sequence' ? t.moves : []; };
    expect(moves('boar').map((m) => vfxForEffects(m.effects))).toContain('slash');
    expect(moves('hex_imp').map((m) => vfxForEffects(m.effects)).some((k) => k === 'arcane')).toBe(true);
  });
  it('guard, ward, aegis, harden, brace and scatter are buffs that glow', () => {
    for (const s of ['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter'] as const) expect(isBuff(s)).toBe(true);
    for (const s of ['burn', 'weak', 'exposed', 'curse', 'chill', 'stun'] as const) expect(isBuff(s)).toBe(false);
  });
});
