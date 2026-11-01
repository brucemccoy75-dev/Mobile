import { describe, expect, it } from 'vitest';
import { createMeta, mergeMeta, migrateMeta } from '@core/meta';
import { createCombat, currentIntent, step } from '@core/combat';
import { Rng } from '@core/rng';
import { LESSON_IDS, TRAINING, markTutorial, roadOrder, tutorialDone, validateTutorial } from '@core/tutorial';
import { WORLD } from '@data/world';
import { createTraining, nodeEncounter, offRecord, trainingCombat, trainingFinished, trainingStop } from './session';

/** The tutorial's training run (DECISIONS #96). */
describe('the training run', () => {
  it('is a warrior on the Training Grounds, off the record, no heirlooms, a little gold', () => {
    const s = createTraining(createMeta());
    expect(s.classId).toBe('warrior');
    expect(offRecord(s)).toBe(true);
    expect(s.map.training).toBe(true);
    expect(s.map.dungeon).toBeUndefined();
    expect(s.map.paint).toBe('map_training');
    expect(s.heirloomChoices).toEqual([]);
    expect(s.gold).toBeGreaterThan(0);
    expect(s.playerPos).toEqual(s.map.entry);
  });

  it('its road runs start, Boar, Hex Imp, shrine, shop, chest, a duo and a last fight, in that order, whatever the seed', () => {
    for (let i = 0; i < 5; i++) {
      const s = createTraining(createMeta());
      const road = roadOrder(s.map);
      expect(road.map((n) => n.kind)).toEqual(TRAINING.map((t) => t.kind));
      expect(road.length).toBe(s.map.nodes!.length); // every node is on the one road
      const fights = road.filter((n) => n.kind === 'monster').map((n) => [n.enemyId, ...(n.extra ?? [])]);
      expect(fights).toEqual([['boar'], ['hex_imp'], ['shell_beetle', 'rat_pack'], ['adept_necromancer']]);
      for (const n of road) if (n.kind === 'monster') {
        const e = nodeEncounter(s, n);
        expect(e.custom).toBeUndefined(); // not dungeon-tough, not cursed, no surprise
        expect(e.surprise).toBeUndefined();
      }
    }
  });

  it('each lesson fight deals its set hand, and the enemy opens as the lesson says', () => {
    const s = createTraining(createMeta());
    const [, boar, imp] = roadOrder(s.map);
    const setup = (id: string, enemy: string) => createCombat({ player: { stats: s.stats, deck: [], ...trainingCombat(s, id) }, enemy, rng: new Rng(7) });
    const b = setup(boar!.id, 'boar');
    expect(b.player.hand).toEqual(['defend', 'attack', 'attack']);
    expect(currentIntent(b).intent.kind).toBe('attack'); // Tusk: Defend's lesson
    const i = setup(imp!.id, 'hex_imp');
    expect(i.player.hand[0]).toBe('ward');
    step(i, { type: 'card', index: 0 });
    expect(i.player.statuses.some((st) => st.id === 'exposed')).toBe(false); // Ward stopped the Hex
  });

  it('the hero cannot die in a training fight, and real runs are untouched', () => {
    const s = createTraining(createMeta());
    const last = roadOrder(s.map).at(-1)!;
    expect(trainingCombat(s, last.id).floor).toBe(1);
    expect(trainingCombat(s, last.id).ordered).toBeUndefined(); // the last fight is dealt as usual
    expect(trainingStop(s, last.id)?.arrive).toBe('final');
    const c = createCombat({ player: { stats: s.stats, hp: 1, deck: [], ...trainingCombat(s, last.id) }, enemy: 'adept_necromancer', rng: new Rng(2) });
    for (let k = 0; k < 8 && c.outcome === 'ongoing'; k++) step(c, { type: 'card', index: 0 });
    expect(c.player.hp).toBeGreaterThanOrEqual(1);
    expect(c.outcome).not.toBe('lost');
  });

  it('is finished once every fight on the road is won', () => {
    const s = createTraining(createMeta());
    const fights = roadOrder(s.map).filter((n) => n.kind === 'monster');
    for (const n of fights) { expect(trainingFinished(s)).toBe(false); s.clearedNodes.add(n.id); }
    expect(trainingFinished(s)).toBe(true);
  });
});

describe('the tutorial flags in the meta', () => {
  it('a new player has not done it; marking it sticks, survives a merge, and is never lost', () => {
    const m = createMeta();
    expect(tutorialDone(m)).toBe(false);
    markTutorial(m, 'done');
    expect(tutorialDone(m)).toBe(true);
    expect(tutorialDone(mergeMeta(createMeta(), m))).toBe(true);
    expect(tutorialDone(mergeMeta(m, createMeta()))).toBe(true);
  });
  it('an older save that has played is past it; an empty one is not', () => {
    const played = migrateMeta({ ...createMeta(), version: 6, tutorial: undefined, deaths: 3 })!;
    expect(tutorialDone(played)).toBe(true);
    expect(played.tutorial).toContain('heirlooms');
    expect(tutorialDone(migrateMeta({ ...createMeta(), version: 6, tutorial: undefined })!)).toBe(false);
  });
});

describe('the lesson words (world.json)', () => {
  it('every lesson has a line, and the shipped file passes', () => {
    expect(validateTutorial(WORLD.tutorial)).toEqual([]);
    expect(Object.keys(WORLD.tutorial.lessons).sort()).toEqual([...LESSON_IDS].sort());
  });
  it('a missing, empty, long or stray line is refused', () => {
    const lessons = { ...WORLD.tutorial.lessons };
    delete lessons.welcome;
    lessons.hand = ' ';
    lessons.intent = 'x'.repeat(201);
    lessons.extra = 'hi';
    expect(validateTutorial({ lessons })).toEqual([
      'tutorial welcome: needs a line', 'tutorial hand: needs a line', 'tutorial intent: 201 characters, at most 200', 'tutorial extra: no such lesson',
    ]);
  });
});
