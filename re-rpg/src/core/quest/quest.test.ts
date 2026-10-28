import { describe, it, expect } from 'vitest';
import { Rng, RunRng } from '@core/rng';
import { generateScreen, findPath } from '@core/map';
import { createMeta } from '@core/meta';
import { emptyEquipment } from '@core/run/equipment';
import { getItem, getSkill } from '@data/index';
import { generateQuest, noteKill, pickQuestDef, questFromDef, questReady, type QuestContext, type QuestDef } from './index';
import { parseScreen } from '@core/map';
import { SCREEN1 } from '@data/maps/screen1';
import type { DialogueCtx } from '@core/dialogue';
import { upgradeItem, upgradeSkill } from '@core/run/upgrade';

const ctx: QuestContext = { classId: 'warrior', families: ['warrior_tank'], meta: createMeta(), deck: [], equipment: emptyEquipment(), screenIndex: 0 };
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

describe('quests as data (DECISIONS #57)', () => {
  const screen = parseScreen(SCREEN1, new RunRng('qd').stream('map'), { seed: 'qd', screenIndex: 0 });
  const voice = { name: 'Pip', title: 'the test', intro: { fetch: 'Bring {target}.', hunt: 'Kill {need} {target}.', escort: 'Find {target}.' }, accept: 'Good.', progress: 'Not yet.', complete: { fetch: 'Ta.', hunt: 'Ta.', escort: 'Ta.' }, decline: 'Fine.' };
  const base: QuestDef = { id: 'pip', name: 'Pip', screen: 0, giver: 'node_6', type: 'rolled', voice, reward: {} };
  const dctx = (over: Partial<DialogueCtx> = {}): DialogueCtx => ({ flags: new Set(), relations: {}, deathsOnScreen: 0, deathsTotal: 0, level: 1, classId: 'warrior', gold: 0, fights: 0, rng: new Rng(1), ...over });

  it('a fixed type builds that quest, at the giver node, with the named target and standard rewards', () => {
    const h = questFromDef({ ...base, type: 'hunt', hunt: { enemy: 'boar', need: 3 } }, screen, ctx, new Rng(1));
    expect(h).toMatchObject({ id: 'quest_0_pip', defId: 'pip', kind: 'hunt', giverNode: 'node_6', hunt: { enemyId: 'boar', need: 3, have: 0 }, reward: { gold: 25, offer: 'guard' } });
    expect(h.giver.pos).toEqual(screen.nodes!.find((n) => n.id === 'node_6')!.pos);
    expect(h.giver.intro).toBe('Kill 3 Boar.');
    const e = questFromDef({ ...base, type: 'escort', escort: { node: 'node_17', name: 'Ida' } }, screen, ctx, new Rng(1));
    expect(e).toMatchObject({ kind: 'escort', escort: { name: 'Ida', node: 'node_17', following: false }, reward: { gold: 20, offer: 'chest' } });
    const f = questFromDef({ ...base, type: 'fetch', fetch: { id: 'shield_bash' }, reward: { gold: 40, flag: 'pip_done', relation: { name: 'pip', delta: 2 } } }, screen, ctx, new Rng(1));
    expect(f).toMatchObject({ kind: 'fetch', fetch: { type: 'tome', id: 'shield_bash' }, reward: { gold: 40, flag: 'pip_done', relation: { name: 'pip', delta: 2 } } });
  });
  it('rolled picks among the three; a hunt never asks for an avoided species', () => {
    const kinds = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const q = questFromDef({ ...base, hunt: { need: 2, avoid: ['rat_pack'] }, escort: { node: 'node_17' } }, screen, ctx, new Rng(i));
      kinds.add(q.kind);
      if (q.hunt) expect(q.hunt.enemyId).not.toBe('rat_pack');
    }
    expect(kinds).toEqual(new Set(['fetch', 'hunt', 'escort']));
  });
  it('a screen offers one quest whose conditions hold, special ones only on a special run', () => {
    const defs: QuestDef[] = [
      { ...base, id: 'plain' },
      { ...base, id: 'after_wren', when: [{ flag: 'wren_met' }] },
      { ...base, id: 'secret', special: true },
      { ...base, id: 'other_screen', screen: 1 },
    ];
    expect(pickQuestDef(defs, 0, dctx(), false)!.id).toBe('plain');
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) seen.add(pickQuestDef(defs, 0, dctx({ flags: new Set(['wren_met']), rng: new Rng(i) }), false)!.id);
    expect([...seen].sort()).toEqual(['after_wren', 'plain']);
    expect(pickQuestDef(defs, 0, dctx(), true)!.id).toBe('secret');
    expect(pickQuestDef(defs, 2, dctx(), false)).toBeNull();
  });
});
