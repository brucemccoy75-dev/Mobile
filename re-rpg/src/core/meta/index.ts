import { getItem, getSet, getSkill } from '@data/index';
import type { ClassId, Item, SetId, Skill } from '@data/types';
import type { Rng } from '@core/rng';

export const META_VERSION = 1;
export const HEIRLOOM_DEATHS = 1;

/** Cross-run progress. Persisted; merged across devices by union/max (ARCHITECTURE §8). */
export interface MetaState {
  version: number;
  updatedAt: number;
  deaths: number;
  wins: number;
  bestScreen: number;
  discoveredSkills: string[];
  discoveredItems: string[];
}

export const createMeta = (): MetaState => ({ version: META_VERSION, updatedAt: Date.now(), deaths: 0, wins: 0, bestScreen: 0, discoveredSkills: [], discoveredItems: [] });

/** Returns true if this is a new discovery. */
export function discoverSkill(meta: MetaState, id: string): boolean {
  if (meta.discoveredSkills.includes(id)) return false;
  meta.discoveredSkills.push(id); meta.updatedAt = Date.now(); return true;
}
export function discoverItem(meta: MetaState, id: string): boolean {
  if (meta.discoveredItems.includes(id)) return false;
  meta.discoveredItems.push(id); meta.updatedAt = Date.now(); return true;
}

export function recordDeath(meta: MetaState, screenIndex: number): void {
  meta.deaths += 1; meta.bestScreen = Math.max(meta.bestScreen, screenIndex); meta.updatedAt = Date.now();
}
export function recordWin(meta: MetaState, screenCount: number): void {
  meta.wins += 1; meta.bestScreen = Math.max(meta.bestScreen, screenCount); meta.updatedAt = Date.now();
}

export const heirloomUnlocked = (meta: MetaState) => meta.deaths >= HEIRLOOM_DEATHS;

export type Heirloom = { kind: 'tome'; skill: Skill } | { kind: 'item'; item: Item };

/** Discovered tomes and items this class could start with. */
export function heirloomPool(meta: MetaState, classId: ClassId): { tomes: Skill[]; items: Item[] } {
  return {
    tomes: meta.discoveredSkills.map(getSkill).filter((s) => s.classId === classId || s.classId === 'any'),
    items: meta.discoveredItems.map(getItem).filter((i) => !i.classes || i.classes.includes(classId)),
  };
}

export const HEIRLOOM_OFFER = 4;
export const HEIRLOOM_PICKS = 2;

/**
 * DECISIONS #6 (amended after phone test 2): from the first death, a run opens
 * with a spread of up to 4 discovered items and tomes usable by this class,
 * weighted 2x toward the rolled set, and the player keeps 2 of them.
 */
export function rollHeirloomChoices(meta: MetaState, classId: ClassId, setId: SetId, rng: Rng, count = HEIRLOOM_OFFER): Heirloom[] {
  if (!heirloomUnlocked(meta)) return [];
  const set = getSet(setId);
  const { tomes, items } = heirloomPool(meta, classId);
  let pool: { h: Heirloom; w: number; id: string }[] = [
    ...tomes.map((skill) => ({ h: { kind: 'tome', skill } as Heirloom, w: set.skills.includes(skill.id) ? 2 : 1, id: `t:${skill.id}` })),
    ...items.map((item) => ({ h: { kind: 'item', item } as Heirloom, w: item.tags?.includes(setId) ? 2 : 1, id: `i:${item.id}` })),
  ];
  const out: Heirloom[] = [];
  while (pool.length > 0 && out.length < count) {
    const pick = rng.weighted(pool, (c) => c.w);
    out.push(pick.h);
    pool = pool.filter((c) => c.id !== pick.id);
  }
  return out;
}

/** Merge rule for cloud sync: union of discoveries, max of counters. */
export function mergeMeta(a: MetaState, b: MetaState): MetaState {
  return {
    version: Math.max(a.version, b.version), updatedAt: Math.max(a.updatedAt, b.updatedAt),
    deaths: Math.max(a.deaths, b.deaths), wins: Math.max(a.wins, b.wins), bestScreen: Math.max(a.bestScreen, b.bestScreen),
    discoveredSkills: [...new Set([...a.discoveredSkills, ...b.discoveredSkills])],
    discoveredItems: [...new Set([...a.discoveredItems, ...b.discoveredItems])],
  };
}
