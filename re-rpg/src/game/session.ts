// The in-memory run for milestones 2–3. Milestone 4 moves this into core/run
// with a RunState that is saved through SaveStore.
import type Phaser from 'phaser';
import { enemiesOfTier, getClass, getSet } from '@data/index';
import type { ClassId, EnemyId, SetId, SkillId, Stats } from '@data/types';
import { RunRng, newSeed } from '@core/rng';
import { generateScreen, type ScreenMap, type Tile } from '@core/map';

export const SCREEN_COUNT = 2;

export type EncounterKind = 'random' | 'guard' | 'boss';

export interface PendingEncounter {
  kind: EncounterKind;
  enemyId: EnemyId;
  guardId?: string;
}

export interface CombatResult {
  encounter: PendingEncounter;
  won: boolean;
}

export interface RunSession {
  seed: string;
  rng: RunRng;
  classId: ClassId;
  setId: SetId;
  stats: Stats;
  hp: number;
  gold: number;
  deck: SkillId[];
  /** Dev aid until tomes drop in milestone 4: start with the rolled set's skills in the deck. */
  devTomes: boolean;

  screenIndex: number;
  map: ScreenMap;
  playerPos: Tile;
  threat: number;
  openedPois: Set<string>;
  usedShrines: Set<string>;
  defeatedGuards: Set<string>;
  bossDefeated: boolean;
  encountersWon: number;

  pendingEncounter: PendingEncounter | null;
  lastResult: CombatResult | null;
}

export function rollSet(classId: ClassId, rng: RunRng): SetId {
  return rng.stream('meta').pick(getClass(classId).sets);
}

export function createSession(classId: ClassId, devTomes: boolean, seed = newSeed()): RunSession {
  const rng = new RunRng(seed);
  const setId = rollSet(classId, rng);
  const cls = getClass(classId);
  const s: RunSession = {
    seed, rng, classId, setId, stats: { ...cls.stats }, hp: cls.stats.maxHp, gold: 0,
    deck: devTomes ? [...getSet(setId).skills] : [], devTomes,
    screenIndex: 0, map: undefined as unknown as ScreenMap, playerPos: { x: 0, y: 0 }, threat: 0,
    openedPois: new Set(), usedShrines: new Set(), defeatedGuards: new Set(), bossDefeated: false, encountersWon: 0,
    pendingEncounter: null, lastResult: null,
  };
  startScreen(s, 0);
  return s;
}

/** Generate screen `index` and put the player at its entry. Boss kills fully heal (DECISIONS #1). */
export function startScreen(s: RunSession, index: number): void {
  s.screenIndex = index;
  s.map = generateScreen(s.rng.stream('map'), { seed: s.seed, screenIndex: index });
  s.playerPos = { ...s.map.entry };
  s.threat = 0;
  s.openedPois = new Set();
  s.usedShrines = new Set();
  s.defeatedGuards = new Set();
  s.bossDefeated = false;
}

export const screenTier = (s: RunSession): 1 | 2 => (s.screenIndex === 0 ? 1 : 2);

export function randomEnemy(s: RunSession): EnemyId {
  return s.rng.stream('encounter').pick(enemiesOfTier(screenTier(s))).id;
}

export const getSession = (scene: Phaser.Scene): RunSession => {
  const s = scene.registry.get('session') as RunSession | undefined;
  if (!s) throw new Error('No run session');
  return s;
};
export const setSession = (scene: Phaser.Scene, s: RunSession | null) => scene.registry.set('session', s);
