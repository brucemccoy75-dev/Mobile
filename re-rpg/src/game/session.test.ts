import { describe, it, expect } from 'vitest';
import { getItem, getSkill } from '@data/index';
import { DECK_CAP } from '@core/combat';
import { createMeta, gainExp, unlockNode } from '@core/meta';
import { LEVEL_GOLD, adoptFamily, applyHeirlooms, applyLevelUp, baseStatsFor, createSession, currentQuest, deserialize, poolCtx, serialize, spendConsumedTomes, setName, takeChoice, turnInQuest } from './session';
import { basicsFor } from '@data/skills';
import { getSet } from '@data/index';
import { buildPool } from '@core/loot';

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
    expect(s.shop.lines.every((l) => l.kind !== 'tome')).toBe(true); // nothing drops without a node, general tomes included
  });

  it('a family bought mid-run drops from the next reward on', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'ADOPT-1');
    expect(buildPool(poolCtx(s, meta)).tomes.map((t) => t.id)).not.toContain('shield_bash');
    expect(adoptFamily(s, 'warrior_tank')).toBe(true);
    expect(adoptFamily(s, 'warrior_tank')).toBe(false);
    expect(s.families).toEqual(['warrior_tank']);
    expect(s.setId).toBe('warrior_tank');
    expect(setName(s)).toBe('Bulwark');
    expect(buildPool(poolCtx(s, meta)).tomes.map((t) => t.id)).toEqual(expect.arrayContaining(['shield_bash', 'bind_wound']));
    adoptFamily(s, 'warrior_dps');
    expect(s.families).toEqual(['warrior_tank', 'warrior_dps']);
    expect(s.setId).toBe('warrior_tank');
    expect(deserialize(JSON.parse(JSON.stringify(serialize(s))), meta).families).toEqual(['warrior_tank', 'warrior_dps']);
  });

  it('every run opens with a heirloom spread; the picks set the run families and the tome pool', () => {
    const meta = createMeta();
    gainExp(meta, 'warrior', 300); // level 5: four points, two per family
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
    expect(s.shop.lines.every((l) => l.kind !== 'tome' || getSet('warrior_tank').skills.includes(l.id))).toBe(true);
  });

  it('every special tome is fleeting: played once, gone from the run', () => {
    for (const id of ['mighty_blow', 'stand_firm', 'last_strike', 'final_stand']) expect(getSkill(id).uses).toBe('fleeting');
    const s = createSession('warrior', createMeta(), 'FLEET-1');
    s.deck = ['mighty_blow', 'mighty_blow', 'broadsword'];
    expect(spendConsumedTomes(s, ['mighty_blow'])).toEqual(['Mighty Blow']);
    expect(s.deck).toEqual(['mighty_blow', 'broadsword']); // one copy per play
  });

  it('a warrior fights with Attack, Attack and Defend; Ward is a wizard basic', () => {
    expect(basicsFor('warrior')).toEqual(['attack', 'attack', 'defend', 'bellow', 'defend', 'ward']); // Bellow, then a second Defend and Ward, joined on 2026-10-27
    expect(basicsFor('wizard')).toEqual(['attack', 'attack', 'ward']);
    expect(basicsFor('shaman')).toEqual(['attack', 'attack', 'defend', 'ward']);
  });

  it('legacy bonuses raise the run base and are frozen into the save', () => {
    const meta = createMeta(); meta.legacy = { atk: 1, def: 0, maxHp: 5 };
    const s = createSession('warrior', meta, 'LEGACY-1');
    expect(s.base).toEqual({ maxHp: 30, atk: 5, def: 1, luck: 5 });
    expect(s.hp).toBe(30);
    const later = createMeta(); later.legacy = { atk: 3, def: 3, maxHp: 15 };
    expect(deserialize(JSON.parse(JSON.stringify(serialize(s))), later).base).toEqual({ maxHp: 30, atk: 5, def: 1, luck: 5 });
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
  it('each level is +1 max HP for good (DECISIONS #49): new runs start with it, a level gained mid-run adds it at once', () => {
    const meta = createMeta();
    const fresh = baseStatsFor('warrior', meta).maxHp;
    gainExp(meta, 'warrior', 300); // level 5
    expect(baseStatsFor('warrior', meta).maxHp).toBe(fresh + 4);
    const s = createSession('warrior', meta, 'LVL-1');
    expect(s.stats.maxHp).toBe(fresh + 4);
    s.hp = 10;
    applyLevelUp(s, meta, 2, () => 0.99); // two levels, gold both times
    expect(s.base.maxHp).toBe(fresh + 6);
    expect(s.stats.maxHp).toBe(fresh + 6);
    expect(s.hp).toBe(12);
  });

  it('a level-up rolls a rare card from the run\'s families, else gold', () => {
    const meta = createMeta();
    gainExp(meta, 'warrior', 300);
    unlockNode(meta, 'warrior', 'warrior_dps');
    const s = createSession('warrior', meta, 'LVL-2');
    s.families = ['warrior_dps'];
    const gold = s.gold;
    const card = applyLevelUp(s, meta, 1, () => 0); // the roll succeeds
    expect(card).toHaveLength(1);
    expect(card[0]).toMatchObject({ kind: 'tome' });
    const id = (card[0] as { kind: 'tome'; id: string }).id;
    expect(getSkill(id).rarity).toBe('rare');
    expect(getSet('warrior_dps').skills).toContain(id);
    expect(s.deck).toContain(id);
    const miss = applyLevelUp(s, meta, 1, () => 0.99);
    expect(miss).toEqual([{ kind: 'gold', amount: LEVEL_GOLD }]);
    expect(s.gold).toBe(gold + LEVEL_GOLD);
    // No family, no rare card: always gold (nothing drops without a node, DECISIONS #42).
    s.families = [];
    expect(applyLevelUp(s, meta, 1, () => 0)).toEqual([{ kind: 'gold', amount: LEVEL_GOLD }]);
    // A full deck takes gold too.
    s.families = ['warrior_dps'];
    s.deck = Array.from({ length: DECK_CAP }, () => 'broadsword');
    expect(applyLevelUp(s, meta, 1, () => 0)).toEqual([{ kind: 'gold', amount: LEVEL_GOLD }]);
  });
  it('luck (DECISIONS #50): every class starts with it, gear adds it, and it raises the level-up rare chance', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'LUCK-1');
    expect(s.stats.luck).toBe(5);
    expect(poolCtx(s, meta).luck).toBe(5);
    gainExp(meta, 'warrior', 300);
    s.families = ['warrior_dps'];
    // 25% + 5 × 1.2% = 31%: a roll of 0.30 lands a rare card, 0.32 does not.
    expect(applyLevelUp(s, meta, 1, () => 0.30)[0]!.kind).toBe('tome');
    expect(applyLevelUp(s, meta, 1, () => 0.32)[0]!.kind).toBe('gold');
  });
  it('the screen quest comes from world.json (DECISIONS #57): Wren at the start, with her lines', () => {
    const s = createSession('warrior', createMeta(), 'WQ-1');
    const q = currentQuest(s)!;
    expect([q.defId, q.giverNode, q.giver.name, q.status]).toEqual(['wren_errand', 'node_6', 'Wren', 'offered']);
    if (q.escort) expect(q.escort.node).toBe('node_17');
    if (q.hunt) expect(q.hunt.enemyId).not.toBe('rat_pack');
  });

  it('a hand-in pays the reward\'s flag, relation and card, and offers the next quest in a chain', () => {
    const meta = createMeta();
    const s = createSession('warrior', meta, 'WQ-2');
    const q = currentQuest(s)!;
    q.kind = 'hunt'; q.fetch = undefined; q.escort = undefined; q.status = 'active';
    q.hunt = { enemyId: 'boar', name: 'Boar', need: 1, have: 1 };
    q.reward = { gold: 5, flag: 'wren_paid', relation: { name: 'wren', delta: 2 }, tome: 'shield_bash' };
    q.then = 'wren_errand';
    const gold = s.gold;
    turnInQuest(s, q, meta);
    expect(s.gold).toBe(gold + 5);
    expect(s.flags.has('wren_paid')).toBe(true);
    expect(meta.relations.wren).toBe(2);
    expect(s.deck).toContain('shield_bash');
    const next = currentQuest(s)!;
    expect(next).not.toBe(q);
    expect([next.defId, next.status]).toEqual(['wren_errand', 'offered']);
  });
});
