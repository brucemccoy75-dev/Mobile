import { describe, expect, it } from 'vitest';
import { createMeta } from '@core/meta';
import { basicsFor } from '@data/skills';
import { createSession, deserialize, nodeEncounter, runBasics, sellCard, sellableCards, serialize, shrineHeal, shrineUsed, useShrine, MIN_CARDS } from './session';

describe('surprise fights in a run (DECISIONS #81)', () => {
  it('the map shows one enemy; the fight is the surprise, and the encounter says which was shown', () => {
    let found = 0;
    for (let k = 0; k < 40 && found < 3; k++) {
      const s = createSession('warrior', createMeta(), `SURP-${k}`);
      for (const n of s.map.nodes!) {
        if (!n.surprise) continue;
        const e = nodeEncounter(s, n);
        expect(e.enemyId).toBe(n.surprise);
        expect(e.surprise).toBe(n.enemyId);
        expect(e.extra).toBeUndefined();
        found++;
      }
    }
    expect(found).toBeGreaterThan(0);
  });

  it('a surprise survives a save and a reload', () => {
    for (let k = 0; k < 40; k++) {
      const s = createSession('warrior', createMeta(), `SAVE-${k}`);
      const n = s.map.nodes!.find((x) => x.surprise);
      if (!n) continue;
      const back = deserialize(serialize(s), createMeta());
      expect(back.map.nodes!.find((x) => x.id === n.id)!.surprise).toBe(n.surprise);
      return;
    }
    throw new Error('no surprise in 40 seeds');
  });
});

describe('the shrine asks (DECISIONS #81)', () => {
  it('heals half of max HP, never past full, once; declining leaves it for later', () => {
    const s = createSession('warrior', createMeta(), 'SHRINE');
    const node = { id: 'shrine_x', kind: 'shrine' as const, pos: { x: 0, y: 0 }, links: [] };
    s.hp = s.stats.maxHp; // unhurt: nothing to heal, nothing spent
    expect(shrineHeal(s)).toBe(0);
    s.hp = s.stats.maxHp - 3; // a scratch: heals only the 3
    expect(shrineHeal(s)).toBe(3);
    // Declined: the node may be cleared (walked through) but the shrine is not used.
    s.clearedNodes.add(node.id);
    expect(shrineUsed(s, node)).toBe(false);
    s.hp = 5;
    expect(useShrine(s, node)).toBe(Math.round(s.stats.maxHp * 0.5));
    expect(shrineUsed(s, node)).toBe(true);
    expect(useShrine(s, node)).toBe(0); // spent
    expect(deserialize(serialize(s), createMeta()).usedShrines.has(node.id)).toBe(true);
  });
});

describe('selling a card at the shop (DECISIONS #81)', () => {
  it('any card held, deck or starting, once per shop, for its sell value', () => {
    const s = createSession('warrior', createMeta(), 'SELL');
    s.deck = ['shield_bash'];
    const all = sellableCards(s);
    expect(all.map((c) => c.id)).toEqual(['shield_bash', ...basicsFor('warrior')]);
    const gold = s.gold;
    const got = sellCard(s, 'attack', 'basic');
    expect(s.gold).toBe(gold + got);
    expect(runBasics(s).filter((id) => id === 'attack')).toHaveLength(basicsFor('warrior').filter((id) => id === 'attack').length - 1);
    expect(sellableCards(s)).toEqual([]); // once per shop
    expect(() => sellCard(s, 'shield_bash', 'deck')).toThrow();
    // A sold starting card stays sold through a reload; the next shop buys again.
    const back = deserialize(serialize(s), createMeta());
    expect(runBasics(back)).toEqual(runBasics(s));
    back.shop = { ...back.shop, cardSold: false };
    sellCard(back, 'shield_bash', 'deck');
    expect(back.deck).toEqual([]);
  });

  it('a run keeps at least three cards', () => {
    const s = createSession('warrior', createMeta(), 'MIN');
    s.deck = [];
    s.soldBasics = basicsFor('warrior').slice(0, basicsFor('warrior').length - MIN_CARDS);
    expect(runBasics(s)).toHaveLength(MIN_CARDS);
    expect(sellableCards(s)).toEqual([]);
  });
});
