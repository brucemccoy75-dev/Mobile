import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import { DIALOGUE } from '@data/dialogue';
import { ENEMIES, getSkill } from '@data/index';
import { defaultOption, pickDialogue, resolve, visibleOptions, type DialogueCtx } from './index';

const ctx = (over: Partial<DialogueCtx> = {}): DialogueCtx => ({ flags: new Set(), relations: {}, deathsOnScreen: 0, deathsTotal: 0, level: 1, classId: 'warrior', gold: 10, fights: 0, rng: new Rng(1), ...over });

describe('dialogue data', () => {
  it('every enemy and both gates have a pre-fight entry that always matches', () => {
    for (const e of ENEMIES) {
      const trig = e.archetype === 'boss' ? `gate:${e.id}` : `pre_fight:${e.id}`;
      expect(pickDialogue(DIALOGUE, trig, ctx()), trig).not.toBeNull();
    }
    expect(pickDialogue(DIALOGUE, 'gate:wren', ctx())).not.toBeNull();
    expect(pickDialogue(DIALOGUE, 'pre_fight:ghost', ctx())).not.toBeNull();
    expect(pickDialogue(DIALOGUE, 'pre_fight:brother', ctx())).not.toBeNull();
  });
  it('the story nodes always have something to say, and the tinker quest arc chains', () => {
    expect(pickDialogue(DIALOGUE, 'node:quest', ctx())!.id).toBe('tinker_first');
    expect(pickDialogue(DIALOGUE, 'node:quest', ctx({ fights: 1 }))!.id).toBe('tinker_quest');
    expect(pickDialogue(DIALOGUE, 'node:quest', ctx({ fights: 2, flags: new Set(['tinker_quest']) }))!.id).toBe('tinker_waiting');
    expect(pickDialogue(DIALOGUE, 'node:quest', ctx({ fights: 2, flags: new Set(['tinker_quest', 'tinker_fight_won']) }))!.id).toBe('tinker_reward');
    expect(pickDialogue(DIALOGUE, 'node:lost', ctx())).not.toBeNull();
    expect(pickDialogue(DIALOGUE, 'giver:wren', ctx({ fights: 1, flags: new Set(['wren_met']) }))!.id).toBe('wren_after_fight');
    expect(resolve(pickDialogue(DIALOGUE, 'node:quest', ctx({ fights: 1 }))!.options[0]!.effects).rearm).toBe(true);
  });
  it('every next target exists, every option ends in fight, skip or next, and named tomes exist', () => {
    const ids = new Set(DIALOGUE.map((d) => d.trigger));
    for (const d of DIALOGUE) {
      expect(d.options.length).toBeGreaterThan(0);
      for (const o of d.options) {
        const r = resolve(o.effects);
        if (r.next) expect(ids.has(r.next), `${d.id} -> ${r.next}`).toBe(true);
        for (const t of r.tomes) if (t !== 'random') getSkill(t);
        if (d.trigger.startsWith('pre_fight:') || d.trigger.startsWith('gate:')) expect(r.fight || r.skip || !!r.next, `${d.id}: "${o.text}" leads nowhere`).toBe(true);
      }
    }
  });
});

describe('dialogue selection', () => {
  it('variants go by deaths on this screen, flags and relations', () => {
    expect(pickDialogue(DIALOGUE, 'gate:gatekeeper', ctx())!.id).toBe('andre_0');
    expect(pickDialogue(DIALOGUE, 'gate:gatekeeper', ctx({ deathsOnScreen: 1 }))!.id).toBe('andre_1');
    expect(pickDialogue(DIALOGUE, 'gate:gatekeeper', ctx({ deathsOnScreen: 7 }))!.id).toBe('andre_5');
    expect(pickDialogue(DIALOGUE, 'giver:wren', ctx())!.id).toBe('wren_intro');
    expect(pickDialogue(DIALOGUE, 'giver:wren', ctx({ flags: new Set(['wren_met']) }))).toBeNull();
    expect(pickDialogue(DIALOGUE, 'giver:wren', ctx({ relations: { wren: -3 } }))!.id).toBe('wren_grudge');
    expect(pickDialogue(DIALOGUE, 'pre_fight:hex_imp', ctx({ flags: new Set(['imp_book']) }))!.id).toBe('imp_book_known');
  });
  it('options with conditions hide; the default is the Fight line', () => {
    const d = pickDialogue(DIALOGUE, 'pre_fight:boar', ctx({ gold: 0 }))!;
    expect(visibleOptions(d, ctx({ gold: 0 })).map((o) => o.text)).toEqual(['Fight.']);
    expect(visibleOptions(d, ctx({ gold: 4 }))).toHaveLength(2);
    expect(resolve(defaultOption(d, ctx()).effects).fight).toBe(true);
  });
  it('resolve folds effects', () => {
    const r = resolve([{ gold: -4 }, { flag: 'bribed_boar' }, { skip: true }, { relation: 'wren', delta: -1 }]);
    expect(r).toMatchObject({ gold: -4, skip: true, fight: false });
    expect(r.flags).toEqual([{ flag: 'bribed_boar', value: true }]);
    expect(r.relations).toEqual([{ relation: 'wren', delta: -1 }]);
  });
});

describe('default dialogue (DECISIONS #55)', () => {
  const E = [
    { id: 'pig_angry', trigger: 'pre_fight:pig', speaker: 'Pig', when: [{ flag: 'angry' }], lines: ['Angry.'], options: [{ text: 'Fight.', effects: [{ fight: true as const }] }] },
    { id: 'pig_a', trigger: 'pre_fight:pig', speaker: 'Pig', lines: ['A.'], options: [{ text: 'Fight.', effects: [{ fight: true as const }] }] },
    { id: 'pig_b', trigger: 'pre_fight:pig', speaker: 'Pig', lines: ['B.'], options: [{ text: 'Fight.', effects: [{ fight: true as const }] }] },
    { id: 'pig_c', trigger: 'pre_fight:pig', speaker: 'Pig', lines: ['C.'], options: [{ text: 'Fight.', effects: [{ fight: true as const }] }] },
  ];
  it('a matching conditional entry wins; otherwise one of the defaults at random', () => {
    expect(pickDialogue(E, 'pre_fight:pig', ctx({ flags: new Set(['angry']) }), ['pig_a', 'pig_b', 'pig_c'])!.id).toBe('pig_angry');
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) seen.add(pickDialogue(E, 'pre_fight:pig', ctx({ rng: new Rng(i) }), ['pig_a', 'pig_b', 'pig_c'])!.id);
    expect([...seen].sort()).toEqual(['pig_a', 'pig_b', 'pig_c']);
  });
  it('one default draws nothing from the stream; no defaults falls back to the first that holds', () => {
    const r = new Rng(5), before = r.getState();
    expect(pickDialogue(E, 'pre_fight:pig', ctx({ rng: r }), ['pig_b'])!.id).toBe('pig_b');
    expect(r.getState()).toBe(before);
    expect(pickDialogue(E, 'pre_fight:pig', ctx())!.id).toBe('pig_a');
  });
});
