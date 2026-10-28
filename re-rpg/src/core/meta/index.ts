import { getItem, getSet, getSkill } from '@data/index';
import type { ClassId, Item, SetId, Skill } from '@data/types';
import type { Rng } from '@core/rng';
import { LEVEL_CAP, POINTS_PER_LEVEL, TREES, levelForExp } from '@data/progression';
import type { GhostRecord } from '@core/variants';

export const META_VERSION = 6;

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
  /** Per-class EXP, level, skill points and unlocked card families (DECISIONS #32). Never shared between classes. */
  progress: Partial<Record<ClassId, ClassProgress>>;
  /** How the world feels about you, per character (DECISIONS #35). Negative is bad. */
  relations: Record<string, number>;
  /** Deaths per screen index; drives the dialogue variants. */
  deathsByScreen: number[];
  /** Species that landed the last killing blow. */
  lastKiller?: string;
  /** Your last death on each screen, waiting there as a ghost (DECISIONS #36). Keyed by screen index. */
  ghosts: Record<string, GhostRecord>;
  /** Story flags remembered across runs (the `remember` effect, DECISIONS #61). */
  memory: string[];
}

export interface ClassProgress {
  level: number;
  exp: number;
  points: number;
  unlocked: SetId[];
}

export type LegacyChoice = 'atk' | 'def' | 'maxHp';
export const LEGACY_GRANT: Record<LegacyChoice, number> = { atk: 1, def: 1, maxHp: 5 };

export const createMeta = (): MetaState => ({ version: META_VERSION, updatedAt: Date.now(), deaths: 0, wins: 0, bestScreen: 0, discoveredSkills: [], discoveredItems: [], winsByClass: {}, legacy: { atk: 0, def: 0, maxHp: 0 }, legacyUnspent: 0, progress: {}, relations: {}, deathsByScreen: [], ghosts: {}, memory: [] });

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
    // v3 had no progression: everyone starts at level 1 with the free nodes.
    // v5 granted every tree node for free; v6 charges for some (DECISIONS #41), so nodes that now
    // cost points are taken back. Nothing was ever bought before v6, so nothing is lost; the
    // points earned so far stay to be spent.
    progress: m.version < 6 ? forgetPaidNodes(m.progress ?? {}) : (m.progress ?? {}),
    // v4 had no relations or per-screen deaths: the world starts neutral and forgets earlier deaths.
    relations: m.relations ?? {},
    deathsByScreen: m.deathsByScreen ?? [],
    lastKiller: m.lastKiller,
    ghosts: m.ghosts ?? {},
    memory: m.memory ?? [],
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

// ---------------------------------------------------------------- per-class progression (DECISIONS #32)

const freeNodes = (classId: ClassId): SetId[] => TREES[classId].filter((n) => n.cost === 0).map((n) => n.setId);

/** Strip every node that now costs points from each class's unlocked list (the v5 → v6 migration). */
function forgetPaidNodes(progress: MetaState['progress']): MetaState['progress'] {
  const out: MetaState['progress'] = {};
  for (const [c, p] of Object.entries(progress) as [ClassId, ClassProgress][]) {
    if (p) out[c] = { ...p, unlocked: p.unlocked.filter((id) => freeNodes(c).includes(id)) };
  }
  return out;
}

/** This class's progress, created on first touch with the free nodes owned. */
export function classProgress(meta: MetaState, classId: ClassId): ClassProgress {
  let p = meta.progress[classId];
  if (!p) { p = { level: 1, exp: 0, points: 0, unlocked: freeNodes(classId) }; meta.progress[classId] = p; }
  for (const id of freeNodes(classId)) if (!p.unlocked.includes(id)) p.unlocked.push(id);
  return p;
}

export const unlockedSets = (meta: MetaState, classId: ClassId): SetId[] => [...classProgress(meta, classId).unlocked];

/** Add EXP; every level gained grants skill points. Returns the levels crossed. */
export function gainExp(meta: MetaState, classId: ClassId, amount: number): { from: number; to: number; points: number } {
  const p = classProgress(meta, classId);
  const from = p.level;
  p.exp += Math.max(0, Math.round(amount));
  const to = Math.min(LEVEL_CAP, levelForExp(p.exp));
  const points = Math.max(0, to - from) * POINTS_PER_LEVEL;
  p.level = Math.max(p.level, to);
  p.points += points;
  meta.updatedAt = Date.now();
  return { from, to: p.level, points };
}

export type NodeState = 'owned' | 'available' | 'locked';
/** Why a node can or cannot be bought right now. */
export function nodeState(meta: MetaState, classId: ClassId, setId: SetId): { state: NodeState; reason?: string } {
  const p = classProgress(meta, classId);
  const node = TREES[classId].find((n) => n.setId === setId);
  if (!node) return { state: 'locked', reason: 'not in this tree' };
  if (p.unlocked.includes(setId)) return { state: 'owned' };
  const missing = (node.requires ?? []).filter((r) => !p.unlocked.includes(r));
  if (missing.length) return { state: 'locked', reason: `needs ${missing.map((id) => getSet(id).name).join(missing.length === 2 ? ' and ' : ', ')}` };
  if (p.points < node.cost) return { state: 'locked', reason: `${node.cost} point${node.cost === 1 ? '' : 's'} (you have ${p.points})` };
  return { state: 'available' };
}

/** Spend points on a node. False if it cannot be bought. */
export function unlockNode(meta: MetaState, classId: ClassId, setId: SetId): boolean {
  if (nodeState(meta, classId, setId).state !== 'available') return false;
  const p = classProgress(meta, classId);
  p.points -= TREES[classId].find((n) => n.setId === setId)!.cost;
  p.unlocked.push(setId);
  meta.updatedAt = Date.now();
  return true;
}

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

export function recordDeath(meta: MetaState, screenIndex: number, killer?: string): void {
  meta.deaths += 1; meta.bestScreen = Math.max(meta.bestScreen, screenIndex); meta.updatedAt = Date.now();
  meta.deathsByScreen[screenIndex] = (meta.deathsByScreen[screenIndex] ?? 0) + 1;
  if (killer) meta.lastKiller = killer;
}
export const deathsOn = (meta: MetaState, screenIndex: number): number => meta.deathsByScreen?.[screenIndex] ?? 0;

/** Nudge a relation (clamped to ±9 so one grudge never becomes a number nobody can climb out of). */
export function nudgeRelation(meta: MetaState, who: string, delta: number): number {
  const v = Math.max(-9, Math.min(9, (meta.relations[who] ?? 0) + delta));
  meta.relations[who] = v; meta.updatedAt = Date.now();
  return v;
}
export function recordWin(meta: MetaState, screenCount: number, classId: ClassId): void {
  meta.wins += 1; meta.bestScreen = Math.max(meta.bestScreen, screenCount); meta.updatedAt = Date.now();
  meta.winsByClass[classId] = (meta.winsByClass[classId] ?? 0) + 1;
  meta.legacyUnspent += 1;
}

export type Heirloom = { kind: 'tome'; skill: Skill } | { kind: 'item'; item: Item };

/** Tomes this class could open a run with: every card of every unlocked family. */
export function heirloomPool(meta: MetaState, classId: ClassId): { tomes: Skill[]; items: Item[] } {
  const tomes = unlockedSets(meta, classId).flatMap((id) => getSet(id).skills.map(getSkill));
  return { tomes, items: [] };
}

export const HEIRLOOM_OFFER = 4;
export const HEIRLOOM_PICKS = 2;

/**
 * DECISIONS #32: every run opens with a random spread of HEIRLOOM_OFFER tomes drawn across the
 * class's unlocked families (not one per family: the dice decide which families show up).
 * The player keeps HEIRLOOM_PICKS; their families become the run's tome pool.
 */
export function rollHeirloomChoices(meta: MetaState, classId: ClassId, rng: Rng, count = HEIRLOOM_OFFER): Heirloom[] {
  let pool = heirloomPool(meta, classId).tomes.map((skill) => ({ h: { kind: 'tome', skill } as Heirloom, id: skill.id }));
  const out: Heirloom[] = [];
  while (pool.length > 0 && out.length < count) {
    const pick = rng.pick(pool);
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
    progress: mergeProgress(a.progress ?? {}, b.progress ?? {}),
    // Relations are a story, not a score: the device that played most recently has the truer one.
    relations: { ...((a.updatedAt >= b.updatedAt ? b : a).relations ?? {}), ...((a.updatedAt >= b.updatedAt ? a : b).relations ?? {}) },
    deathsByScreen: Array.from({ length: Math.max(a.deathsByScreen?.length ?? 0, b.deathsByScreen?.length ?? 0) }, (_, i) => Math.max(a.deathsByScreen?.[i] ?? 0, b.deathsByScreen?.[i] ?? 0)),
    lastKiller: (a.updatedAt >= b.updatedAt ? a : b).lastKiller,
    ghosts: { ...((a.updatedAt >= b.updatedAt ? b : a).ghosts ?? {}), ...((a.updatedAt >= b.updatedAt ? a : b).ghosts ?? {}) },
    // What the world remembers only grows.
    memory: [...new Set([...(a.memory ?? []), ...(b.memory ?? [])])],
  };
}

/** A death leaves a ghost on its screen; dying to (or beside) the old ghost makes the new one stronger. */
export function leaveGhost(meta: MetaState, g: Omit<GhostRecord, 'strength' | 'at'>): GhostRecord {
  const prev = meta.ghosts[String(g.screenIndex)];
  const rec: GhostRecord = { ...g, strength: prev ? Math.min(6, prev.strength + 1) : 0, at: Date.now() };
  meta.ghosts[String(g.screenIndex)] = rec; meta.updatedAt = Date.now();
  return rec;
}
export const ghostOn = (meta: MetaState, screenIndex: number): GhostRecord | undefined => meta.ghosts?.[String(screenIndex)];
export function layGhost(meta: MetaState, screenIndex: number): void { delete meta.ghosts[String(screenIndex)]; meta.updatedAt = Date.now(); }

function mergeProgress(a: MetaState['progress'], b: MetaState['progress']): MetaState['progress'] {
  const out: MetaState['progress'] = {};
  for (const c of ['warrior', 'wizard', 'shaman'] as ClassId[]) {
    const x = a[c], y = b[c];
    if (!x && !y) continue;
    if (!x || !y) { out[c] = { ...(x ?? y)!, unlocked: [...(x ?? y)!.unlocked] }; continue; }
    out[c] = { level: Math.max(x.level, y.level), exp: Math.max(x.exp, y.exp), points: Math.max(x.points, y.points), unlocked: [...new Set([...x.unlocked, ...y.unlocked])] };
  }
  return out;
}
