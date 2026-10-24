// The in-memory run for milestones 2–3. Milestone 4 moves this into core/run
// with a RunState that is saved through SaveStore.
import type Phaser from 'phaser';
import { enemiesOfTier, getClass, getSet } from '@data/index';
import type { ClassId, Enemy, SetId, SkillId, Stats } from '@data/types';
import { RunRng, newSeed } from '@core/rng';

export const FIGHTS_BEFORE_BOSS = 4;

export interface RunSession {
  seed: string;
  rng: RunRng;
  classId: ClassId;
  setId: SetId;
  stats: Stats;
  hp: number;
  deck: SkillId[];
  fightsWon: number;
  /** Dev aid until tomes drop in milestone 4: start with the rolled set's skills in the deck. */
  devTomes: boolean;
}

export function rollSet(classId: ClassId, rng: RunRng): SetId {
  return rng.stream('meta').pick(getClass(classId).sets);
}

export function createSession(classId: ClassId, devTomes: boolean, seed = newSeed()): RunSession {
  const rng = new RunRng(seed);
  const setId = rollSet(classId, rng);
  const cls = getClass(classId);
  return {
    seed, rng, classId, setId, stats: { ...cls.stats }, hp: cls.stats.maxHp,
    deck: devTomes ? [...getSet(setId).skills] : [], fightsWon: 0, devTomes,
  };
}

/** Milestone-2 encounter order: random tier-1 fights, then the Gatekeeper. */
export function nextEnemy(s: RunSession): Enemy {
  if (s.fightsWon >= FIGHTS_BEFORE_BOSS) return enemiesOfTier('boss1')[0]!;
  return s.rng.stream('encounter').pick(enemiesOfTier(1));
}

export const getSession = (scene: Phaser.Scene): RunSession => {
  const s = scene.registry.get('session') as RunSession | undefined;
  if (!s) throw new Error('No run session');
  return s;
};
export const setSession = (scene: Phaser.Scene, s: RunSession | null) => scene.registry.set('session', s);
