import { describe, it, expect } from 'vitest';
import { getItem, getSkill } from '@data/index';
import { DECK_CAP } from '@core/combat';
import { createMeta, gainExp, unlockNode } from '@core/meta';
import { applyHeirlooms, createSession, currentQuest, deserialize, serialize, spendConsumedTomes, setName, takeChoice, turnInQuest } from './session';

describe('session', () => {
  it('serialises and resumes identically, including RNG streams', () => {
    const meta = createMeta();
    const s = createSession('wizard', meta, 'ROUND-TRIP-1');
    s.gold = 17; s.hp = 9; s.threat = 0.4; s.openedPois.add('chest_1'); s.defeatedGuards.add('guard_0');
    takeChoice(s, meta, { kind: 'item', item: getItem('oak_wand') });
    takeChoice(s, meta, { kind: 'tome', skill: getSkill('fireball') });
    s.rng.stream('encounter').next();
    const json = JSON.parse(JSON.stringify(serialize(s)));
    const r = deserialize(json, meta);
    expect(r.gold).toBe(17); expect(r.hp).toBe(9); expect(r.threat).toBe(0.4);
    expect(r.openedPois.has('chest_1')).toBe(true); expect(r.defeatedGuards.has('guard_0')).toBe(true);
    expect(r.deck).toEqual(['fireball']); expect(r.equipment.weapon?.id).toBe('oak_wand');
    expect(r.stats.atk).toBe(6);
    expect(r.map).toEqual(s.map);
    expect(r.rng.stream('encounter').next()).toBe(s.rng.stream('encounter').next());
  });

  it('a fresh warrior has no families: no heirloom spread, basics only, and the shop sells only general tomes', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'HEIR-0');
    expect(s.heirloomChoices).toEqual([]);
    expect(s.families).toEqual([]);
    expect(setName(s)).toBe('basics only');
    expect(s.shop.lines.every((l) => l.kind !== 'tome' || getSkill(l.id).classId === 'any')).toBe(true);
  });

  it('every run opens with a heirloom spread; the picks set the run families and the tome pool', () => {
    const meta = createMeta();
    gainExp(meta, 'warrior', 100); // level 3: two points, one per family
    unlockNode(meta, 'warrior', 'warrior_tank'); unlockNode(meta, 'warrior', 'warrior_dps');
    const s = createSession('warrior', meta, 'HEIR-1');
    expect(s.heirloomChoices).toHaveLength(4);
    expect(s.families).toEqual(['warrior_tank', 'warrior_dps']);
    const tank = s.heirloomChoices.filter((h) => h.kind === 'tome' && h.skill.setId === 'warrior_tank');
    applyHeirlooms(s, tank.slice(0, 2), meta);
    expect(s.families).toEqual(['warrior_tank']);
    expect(s.setId).toBe('warrior_tank');
    expect(s.deck.every((id) => ['shield_bash', 'bind_wound'].includes(id))).toBe(true);
    expect(s.heirloomChoices).toEqual([]);
    expect(s.shop.lines.every((l) => l.kind !== 'tome' || getSkill(l.id).setId === 'warrior_tank' || getSkill(l.id).classId === 'any')).toBe(true);
  });

  it('legacy bonuses raise the run base and are frozen into the save', () => {
    const meta = createMeta(); meta.legacy = { atk: 1, def: 0, maxHp: 5 };
    const s = createSession('warrior', meta, 'LEGACY-1');
    expect(s.base).toEqual({ maxHp: 30, atk: 5, def: 1 });
    expect(s.hp).toBe(30);
    const later = createMeta(); later.legacy = { atk: 3, def: 3, maxHp: 15 };
    expect(deserialize(JSON.parse(JSON.stringify(serialize(s))), later).base).toEqual({ maxHp: 30, atk: 5, def: 1 });
  });

  it('each screen gets a quest; fetch turn-in swaps the carried copy for a +1 that survives a save', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'QUEST-1');
    const q = currentQuest(s)!;
    expect(q).toBeTruthy();
    // Force a fetch for a known item and complete it.
    q.kind = 'fetch'; q.hunt = undefined; q.escort = undefined; q.status = 'active'; q.fetch = { type: 'item', id: 'rusty_sword', name: 'Rusty Sword' };
    takeChoice(s, meta, { kind: 'item', item: getItem('rusty_sword') });
    const atkBefore = s.stats.atk;
    const r = turnInQuest(s, q);
    expect(r.upgraded).toBe('Rusty Sword +1');
    expect(s.equipment.weapon?.id).toBe('rusty_sword+1');
    expect(s.stats.atk).toBe(atkBefore + 1);
    expect(q.status).toBe('done');
    const back = deserialize(JSON.parse(JSON.stringify(serialize(s))), meta);
    expect(back.equipment.weapon?.name).toBe('Rusty Sword +1');
    expect(back.stats.atk).toBe(atkBefore + 1);
    // Tome fetch: the deck keeps the card, the run remembers the +1.
    const q2 = { ...q, id: 'x', status: 'active' as const, fetch: { type: 'tome' as const, id: 'broadsword', name: 'Broadsword Strike' } };
    takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') });
    expect(turnInQuest(s, q2).upgraded).toBe('Broadsword Strike +1');
    expect(s.skillUpgrades.broadsword).toBe(1);
  });

  it('fleeting tomes leave the deck once played, one copy per play', () => {
    const s = createSession('warrior', createMeta(), 'FLEET-1');
    s.deck = ['last_strike', 'last_strike', 'broadsword'];
    expect(spendConsumedTomes(s, ['last_strike'])).toEqual(['Last Strike']);
    expect(s.deck).toEqual(['last_strike', 'broadsword']);
    expect(spendConsumedTomes(s, ['final_stand'])).toEqual([]);
  });


  it('tome at the deck cap requires a swap and records discovery once', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'CAP-1');
    const filler = ['fireball', 'frost_bolt', 'lightning', 'spirit_lash', 'mend', 'static_field', 'inferno', 'ice_armor'];
    s.deck = ['shield_bash', 'bind_wound', 'exposing_strike', ...filler].slice(0, DECK_CAP);
    expect(s.deck).toHaveLength(DECK_CAP);
    expect(() => takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') })).toThrow();
    const r = takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') }, 'exposing_strike');
    expect(r.isNew).toBe(true);
    expect(s.deck[2]).toBe('broadsword');
    expect(s.deck).toHaveLength(DECK_CAP);
    expect(takeChoice(s, meta, { kind: 'tome', skill: getSkill('broadsword') }, 'shield_bash').isNew).toBe(false);
  });
});
