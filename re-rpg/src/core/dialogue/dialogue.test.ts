import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import { DIALOGUE } from '@data/dialogue';
import { ENEMIES, getSkill } from '@data/index';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
import { defaultOption, pickDialogue, resolve, visibleOptions, type DialogueCtx } from './index';

const ctx = (over: Partial<DialogueCtx> = {}): DialogueCtx => ({ flags: new Set(), relations: {}, deathsOnScreen: 0, deathsTotal: 0, level: 1, classId: 'warrior', gold: 10, daylight: 40, rng: new Rng(1), ...over });

describe('dialogue data', () => {
  it('every enemy and both gates have a pre-fight entry that always matches', () => {
    for (const e of ENEMIES) {
      const trig = e.archetype === 'boss' ? `gate:${e.id}` : `pre_fight:${e.id}`;
      expect(pickDialogue(DIALOGUE, trig, ctx()), trig).not.toBeNull();
    }
    expect(pickDialogue(DIALOGUE, 'gate:wren', ctx())).not.toBeNull();
  });
  it('every signpost on both screens has lines', () => {
    for (const [i, a] of [SCREEN1, SCREEN2].entries()) {
      const n = (a.match(/p/g) ?? []).length;
      for (let k = 0; k < n; k++) expect(pickDialogue(DIALOGUE, `sign:sign_${i + 1}_${k}`, ctx()), `sign_${i + 1}_${k}`).not.toBeNull();
    }
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
