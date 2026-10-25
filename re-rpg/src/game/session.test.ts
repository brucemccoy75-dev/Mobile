import { describe, it, expect } from 'vitest';
import { getItem, getSkill } from '@data/index';
import { createMeta } from '@core/meta';
import { applyHeirlooms, createSession, deserialize, serialize, takeChoice } from './session';

describe('session', () => {
  it('serialises and resumes identically, including RNG streams', () => {
    const meta = createMeta();
    const s = createSession('wizard', meta, 'ROUND-TRIP-1');
    s.gold = 17; s.hp = 9; s.threat = 0.4; s.openedPois.add('chest_1'); s.defeatedGuards.add('guard_0');
    takeChoice(s, meta, { kind: 'item', item: getItem('oak_wand') });
    takeChoice(s, meta, { kind: 'tome', skill: getSkill('fireball') });
    s.rng.stream('encounter').next();
    const json = JSON.parse(JSON.stringify(serialize(s)));
    const r = deserialize(json);
    expect(r.gold).toBe(17); expect(r.hp).toBe(9); expect(r.threat).toBe(0.4);
    expect(r.openedPois.has('chest_1')).toBe(true); expect(r.defeatedGuards.has('guard_0')).toBe(true);
    expect(r.deck).toEqual(['fireball']); expect(r.equipment.weapon?.id).toBe('oak_wand');
    expect(r.stats.atk).toBe(6);
    expect(r.map).toEqual(s.map);
    expect(r.rng.stream('encounter').next()).toBe(s.rng.stream('encounter').next());
  });

  it('heirloom spread is offered after the first death and picks apply', () => {
    const meta = createMeta(); meta.deaths = 1; meta.discoveredItems.push('heart_amulet'); meta.discoveredSkills.push('broadsword');
    const s = createSession('warrior', meta, 'HEIR-1');
    expect(s.heirloomChoices).toHaveLength(2);
    expect(s.heirloomName).toBeNull();
    applyHeirlooms(s, s.heirloomChoices);
    expect(s.heirloomName).toContain('Heart Amulet');
    expect(s.stats.maxHp).toBe(31); expect(s.hp).toBe(31);
    expect(s.deck).toEqual(['broadsword']);
    expect(s.heirloomChoices).toEqual([]);
  });

  it('no heirloom spread before the first death', () => {
    const meta = createMeta(); meta.discoveredItems.push('heart_amulet');
    expect(createSession('warrior', meta, 'HEIR-0').heirloomChoices).toEqual([]);
  });

  it('tome at the deck cap requires a swap and records discovery once', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'CAP-1');
    s.deck = ['shield_bash', 'bind_wound', 'exposing_strike', 'fireball', 'frost_bolt', 'lightning'];
    expect(() => takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') })).toThrow();
    const r = takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') }, 'exposing_strike');
    expect(r.isNew).toBe(true);
    expect(s.deck).toEqual(['shield_bash', 'bind_wound', 'broadsword', 'fireball', 'frost_bolt', 'lightning']);
    expect(takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') }, 'shield_bash').isNew).toBe(false);
  });
});
