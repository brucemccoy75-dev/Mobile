import { describe, it, expect } from 'vitest';
import { Rng, RunRng } from '@core/rng';
import { generateScreen, findPath } from '@core/map';
import { createMeta } from '@core/meta';
import { emptyEquipment } from '@core/run/equipment';
import { getItem, getSkill } from '@data/index';
import { generateQuest, noteKill, questReady, type QuestContext } from './index';
import { upgradeItem, upgradeSkill } from '@core/run/upgrade';

const ctx: QuestContext = { classId: 'warrior', setId: 'warrior_tank', meta: createMeta(), deck: [], equipment: emptyEquipment(), screenIndex: 0 };
const mapFor = (seed: string) => generateScreen(new RunRng(seed).stream('map'), { seed, screenIndex: 0 });

describe('generateQuest', () => {
  it('produces every kind over many seeds, all well-formed', () => {
    const kinds = new Set<string>();
    for (let i = 0; i < 40; i++) {
      const m = mapFor(`q${i}`);
      const q = generateQuest(m, ctx, new Rng(i), m.questGiver, m.npcSpot);
      kinds.add(q.kind);
      expect(q.status).toBe('offered');
      expect(q.giver.intro).not.toContain('{');
      if (q.kind === 'fetch') { expect(q.fetch).toBeTruthy(); if (q.fetch!.type === 'item') getItem(q.fetch!.id); else getSkill(q.fetch!.id); }
      if (q.kind === 'hunt') { expect(q.hunt!.need).toBe(2); expect(q.hunt!.enemyId).not.toBe('gatekeeper'); }
      if (q.kind === 'escort') { expect(findPath(m, m.entry, q.escort!.pos)).not.toBeNull(); }
    }
    expect(kinds).toEqual(new Set(['fetch', 'hunt', 'escort']));
  });

  it('the giver sits within a few steps of the entry and the NPC spot is far off the road', () => {
    for (let i = 0; i < 20; i++) {
      const m = mapFor(`g${i}`);
      const d = Math.abs(m.questGiver.x - m.entry.x) + Math.abs(m.questGiver.y - m.entry.y);
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(5);
      expect(findPath(m, m.entry, m.questGiver)).not.toBeNull();
      expect(m.tiles[m.npcSpot.y * m.width + m.npcSpot.x]).not.toBe('road');
    }
  });
});

describe('quest progress', () => {
  it('fetch is ready when the item is equipped or the tome is in the deck', () => {
    const m = mapFor('f');
    const q = generateQuest(m, ctx, new Rng(1), m.questGiver, m.npcSpot);
    q.kind = 'fetch'; q.fetch = { type: 'item', id: 'rusty_sword', name: 'Rusty Sword' }; q.hunt = undefined; q.escort = undefined; q.status = 'active';
    expect(questReady(q, [], emptyEquipment())).toBe(false);
    expect(questReady(q, [], { ...emptyEquipment(), weapon: getItem('rusty_sword') })).toBe(true);
    q.fetch = { type: 'tome', id: 'broadsword', name: 'Broadsword Strike' };
    expect(questReady(q, ['broadsword'], emptyEquipment())).toBe(true);
  });

  it('hunt counts kills of the right enemy only while active', () => {
    const q = { id: 'h', kind: 'hunt', status: 'offered', giver: {} as never, hunt: { enemyId: 'boar', name: 'Boar', need: 2, have: 0 }, reward: { gold: 1 } } as never as import('./index').Quest;
    expect(noteKill([q], 'boar')).toBe(false);
    q.status = 'active';
    expect(noteKill([q], 'rat_pack')).toBe(false);
    noteKill([q], 'boar'); noteKill([q], 'boar'); noteKill([q], 'boar');
    expect(q.hunt!.have).toBe(2);
    expect(questReady(q, [], emptyEquipment())).toBe(true);
  });
});

describe('upgrades', () => {
  it('skill +1 adds flat damage / heal / guard and renames', () => {
    const b = upgradeSkill(getSkill('broadsword'), 1);
    expect(b.name).toBe('Broadsword Strike +1');
    expect(b.effects[0]).toMatchObject({ type: 'damage', flat: 5 });
    const d = upgradeSkill(getSkill('defend'), 2);
    expect(d.effects[0]).toMatchObject({ status: 'guard', magnitude: 3 });
    const h = upgradeSkill(getSkill('bind_wound'), 1);
    expect(h.effects[0]).toMatchObject({ type: 'heal', flat: 2 });
    expect(upgradeSkill(getSkill('attack'), 0)).toBe(getSkill('attack'));
  });

  it('item +1 bumps the first positive stat, chains, and gets a fresh id', () => {
    const a = upgradeItem(getItem('rusty_sword'));
    expect(a.id).toBe('rusty_sword+1'); expect(a.name).toBe('Rusty Sword +1');
    expect(a.mods.at(-1)).toEqual({ stat: { atk: 1 } });
    const b = upgradeItem(a);
    expect(b.id).toBe('rusty_sword+2'); expect(b.name).toBe('Rusty Sword +2');
    expect(upgradeItem(getItem('heart_amulet')).mods.at(-1)).toEqual({ stat: { maxHp: 3 } });
    expect(upgradeItem(getItem('chain_shirt')).mods.at(-1)).toEqual({ stat: { def: 1 } });
  });
});
