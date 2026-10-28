import { describe, expect, it } from 'vitest';
import { listSlots } from '@core/map/authored';
import { WORLD, defaultsFor } from './world';
import { SCREEN_ASCII, diffWorld, validateWorld, type WorldData } from './worldSchema';

const clone = (): WorldData => JSON.parse(JSON.stringify(WORLD));
const open0 = listSlots(SCREEN_ASCII[0]!).filter((s) => s.glyph === 'o').map((s) => s.id);
const start0 = listSlots(SCREEN_ASCII[0]!).find((s) => s.glyph === 'E')!.id;

describe('world.json (DECISIONS #55)', () => {
  it('the shipped file is valid and every enemy has its everyday lines', () => {
    expect(validateWorld(WORLD)).toEqual([]);
    expect(defaultsFor('pre_fight:boar')).toEqual(['boar']);
    expect(defaultsFor('gate:gatekeeper')).toEqual(['andre_0']);
    expect(defaultsFor('giver:wren')).toEqual([]);
  });
  it('the validator names what is wrong', () => {
    const a = clone(); a.enemies.boar!.defaults = ['beetle'];
    expect(validateWorld(a)).toEqual(['enemy boar: default beetle answers pre_fight:shell_beetle, not pre_fight:boar']);
    const b = clone(); b.screens[0]!.nodes[open0[0]!] = { kind: 'shop', odds: { treasure: 1 } };
    expect(validateWorld(b)).toEqual([`screen 1 ${open0[0]}: a kind or odds, not both`]);
    const c = clone(); c.screens[0]!.nodes[start0] = { kind: 'shop' };
    expect(validateWorld(c)).toEqual([`screen 1 ${start0}: a story node or the boss keeps its kind`]);
    const d = clone(); d.screens[0]!.nodes[open0[1]!] = { enemy: 'ogre', dialogue: 'nope' };
    expect(validateWorld(d)).toEqual([`screen 1 ${open0[1]}: ogre does not belong here`, `screen 1 ${open0[1]}: no dialogue nope`]);
    const e = clone(); e.dialogue = e.dialogue.filter((x) => x.trigger !== 'node:lost');
    expect(validateWorld(e)).toContain('trigger node:lost: needs an entry with no conditions');
    const f = clone(); f.dialogue.find((x) => x.id === 'boar')!.options[0]!.effects = [{ next: 'nowhere' }];
    expect(validateWorld(f)).toEqual(['dialogue boar option "Fight.": next "nowhere" answers no entry']);
  });
  it('lists what an import changes', () => {
    const b = clone(); b.screens[0]!.nodes[open0[0]!] = { kind: 'shrine' }; b.enemies.boar!.defaults = [];
    expect(diffWorld(WORLD, b)).toEqual(['enemy boar defaults: [boar] -> []', `screen 1 ${open0[0]}: {} -> {"kind":"shrine"}`]);
  });
  it('quests: the shipped ones are valid, and the validator names a bad giver, escort, target or chain', () => {
    expect(WORLD.quests.map((q) => q.id)).toEqual(['wren_errand', 'marrow_errand', 'vell_errand']);
    const a = clone(); a.quests[0]!.giver = open0[0]!;
    expect(validateWorld(a)).toEqual(['quest wren_errand: the giver must stand at the start, Tam\'s node or the lost one\'s node']);
    const b = clone(); b.quests[0]!.escort = { node: 'node_6' };
    expect(validateWorld(b)).toEqual(['quest wren_errand: the escort cannot wait at the giver']);
    const c = clone(); c.quests[0]!.hunt = { enemy: 'ogre' };
    expect(validateWorld(c)).toEqual(['quest wren_errand: ogre is not hunted on screen 1']);
    const d = clone(); d.quests[1]!.then = 'vell_errand'; d.quests[2]!.then = 'marrow_errand';
    expect(validateWorld(d)).toEqual(['quest marrow_errand: its chain loops', 'quest vell_errand: its chain loops']);
  });
});
