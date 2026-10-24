import { getItem, getSet, getSkill } from '@data/index';
import type { ClassId, Item, SetId, Skill } from '@data/types';
import type { Rng } from '@core/rng';

export const META_VERSION = 1;
export const HEIRLOOM_DEATHS = 2;

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

/**
 * DECISIONS #6: from death 2 onward, a run starts with one random discovered
 * item or tome usable by this class, weighted 2x toward the rolled set.
 */
export function rollHeirloom(meta: MetaState, classId: ClassId, setId: SetId, rng: Rng): Heirloom | null {
  if (!heirloomUnlocked(meta)) return null;
  const set = getSet(setId);
  const tomes = meta.discoveredSkills.map(getSkill).filter((s) => s.classId === classId || s.classId === 'any');
  const items = meta.discoveredItems.map(getItem).filter((i) => !i.classes || i.classes.includes(classId));
  const choices: { h: Heirloom; w: number }[] = [
    ...tomes.map((skill) => ({ h: { kind: 'tome', skill } as Heirloom, w: set.skills.includes(skill.id) ? 2 : 1 })),
    ...items.map((item) => ({ h: { kind: 'item', item } as Heirloom, w: item.tags?.includes(setId) ? 2 : 1 })),
  ];
  if (choices.length === 0) return null;
  return rng.weighted(choices, (c) => c.w).h;
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
