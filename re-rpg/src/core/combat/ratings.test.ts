import { describe, expect, it } from 'vitest';
import type { Status, StatusId, Stats } from '@data/types';
import { statRatings } from './ratings';

const st = (id: StatusId, magnitude = 1, turns = 2): Status => ({ id, turns, magnitude });
const stats: Stats = { maxHp: 25, atk: 4, def: 1 };

describe('battle ATK / DEF ratings (DECISIONS #77)', () => {
  it('plain: the stats as they are, neither up nor down', () => {
    expect(statRatings(stats, [])).toEqual({ atk: { value: 4, base: 4, trend: 'even', why: [] }, def: { value: 1, base: 1, trend: 'even', why: [] } });
  });

  it('Weak halves the attack shown (as computeHit does) and reads down', () => {
    expect(statRatings(stats, [st('weak')]).atk).toEqual({ value: 2, base: 4, trend: 'down', why: ['weak'] });
    expect(statRatings({ ...stats, atk: 5 }, [st('weak')]).atk.value).toBe(2);
  });

  it('Blackjack multiplies the attack and reads up', () => {
    expect(statRatings(stats, [st('blackjack', 5)]).atk).toEqual({ value: 20, base: 4, trend: 'up', why: ['blackjack'] });
  });

  it('Weak and Blackjack together: the number decides', () => {
    expect(statRatings(stats, [st('weak'), st('blackjack', 5)]).atk).toMatchObject({ value: 10, trend: 'up' });
  });

  it('every shield reads DEF up; Exposed reads DEF down; both is mixed', () => {
    for (const id of ['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter'] as const) {
      expect(statRatings(stats, [st(id)]).def).toEqual({ value: 1, base: 1, trend: 'up', why: [id] });
    }
    expect(statRatings(stats, [st('exposed')]).def).toEqual({ value: 1, base: 1, trend: 'down', why: ['exposed'] });
    expect(statRatings(stats, [st('guard'), st('exposed')]).def).toMatchObject({ trend: 'mixed', why: ['guard', 'exposed'] });
  });

  it('statuses that touch neither stat leave both even', () => {
    const r = statRatings(stats, [st('burn'), st('chill'), st('stun'), st('curse'), st('regen')]);
    expect([r.atk.trend, r.def.trend]).toEqual(['even', 'even']);
  });
});
