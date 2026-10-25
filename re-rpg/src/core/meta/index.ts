import { getItem, getSet, getSkill } from '@data/index';
import type { ClassId, Item, SetId, Skill } from '@data/types';
import type { Rng } from '@core/rng';

export const META_VERSION = 3;
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
  /** Wins per class; gates the other classes (DECISIONS #16). */
  winsByClass: Partial<Record<ClassId, number>>;
  /** Permanent stat bonuses bought with Legacy points (DECISIONS #18). Never refunded. */
  legacy: { atk: number; def: number; maxHp: number };
  /** Points earned by wins and not yet allocated; spent one per run start. */
  legacyUnspent: number;
}

export type LegacyChoice = 'atk' | 'def' | 'maxHp';
export const LEGACY_GRANT: Record<LegacyChoice, number> = { atk: 1, def: 1, maxHp: 5 };

export const createMeta = (): MetaState => ({ version: META_VERSION, updatedAt: Date.now(), deaths: 0, wins: 0, bestScreen: 0, discoveredSkills: [], discoveredItems: [], winsByClass: {}, legacy: { atk: 0, def: 0, maxHp: 0 }, legacyUnspent: 0 });

/** Bring an older saved meta up to date; returns null if it cannot be read. */
export function migrateMeta(raw: unknown): MetaState | null {
  if (!raw || typeof raw !== 'object') return null;
  const m = raw as Partial<MetaState> & { version?: number };
  if (typeof m.version !== 'number' || m.version > META_VERSION) return null;
  const out: MetaState = {
    version: META_VERSION, updatedAt: m.updatedAt ?? Date.now(), deaths: m.deaths ?? 0, wins: m.wins ?? 0, bestScreen: m.bestScreen ?? 0,
    discoveredSkills: m.discoveredSkills ?? [], discoveredItems: m.discoveredItems ?? [],
    // v1 had no per-class wins: credit any earlier wins to the warrior, the only class that was ever unlocked first.
    winsByClass: m.winsByClass ?? (m.wins ? { warrior: m.wins } : {}),
    // v2 had no legacy: earlier wins become unspent points, one per win.
    legacy: m.legacy ?? { atk: 0, def: 0, maxHp: 0 },
    legacyUnspent: m.legacyUnspent ?? (m.legacy ? 0 : (m.wins ?? 0)),
  };
  return out;
}

/** Spend one Legacy point. Returns false if there is nothing to spend. */
export function allocateLegacy(meta: MetaState, choice: LegacyChoice): boolean {
  if (meta.legacyUnspent <= 0) return false;
  meta.legacyUnspent -= 1;
  meta.legacy[choice] += LEGACY_GRANT[choice];
  meta.updatedAt = Date.now();
  return true;
}

export const legacySummary = (meta: MetaState): string => {
  const parts: string[] = [];
  if (meta.legacy.atk) parts.push(`+${meta.legacy.atk} ATK`);
  if (meta.legacy.def) parts.push(`+${meta.legacy.def} DEF`);
  if (meta.legacy.maxHp) parts.push(`+${meta.legacy.maxHp} HP`);
  return parts.join(', ');
};

/** Warrior is always open; Wizard and Shaman open after a run is won as Warrior. */
export const classUnlocked = (meta: MetaState, classId: ClassId): boolean => classId === 'warrior' || (meta.winsByClass.warrior ?? 0) >= 1;
export const CLASS_UNLOCK_HINT = 'Win a run as Warrior to unlock';

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
export function recordWin(meta: MetaState, screenCount: number, classId: ClassId): void {
  meta.wins += 1; meta.bestScreen = Math.max(meta.bestScreen, screenCount); meta.updatedAt = Date.now();
  meta.winsByClass[classId] = (meta.winsByClass[classId] ?? 0) + 1;
  meta.legacyUnspent += 1;
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
    winsByClass: Object.fromEntries((['warrior', 'wizard', 'shaman'] as ClassId[]).map((c) => [c, Math.max(a.winsByClass?.[c] ?? 0, b.winsByClass?.[c] ?? 0)]).filter(([, n]) => (n as number) > 0)),
    legacy: { atk: Math.max(a.legacy?.atk ?? 0, b.legacy?.atk ?? 0), def: Math.max(a.legacy?.def ?? 0, b.legacy?.def ?? 0), maxHp: Math.max(a.legacy?.maxHp ?? 0, b.legacy?.maxHp ?? 0) },
    legacyUnspent: Math.max(a.legacyUnspent ?? 0, b.legacyUnspent ?? 0),
  };
}
