import type { ClassId, Enemy, SetId } from './types';

/**
 * Per-class progression (DECISIONS #32): EXP from kills, levels 1-10 on a steep curve,
 * one skill point per level, spent on tree nodes that unlock card families (sets).
 * Nothing here is shared between classes. Costs are per node so a tree can be any shape.
 */
export interface TreeNode {
  setId: SetId;
  /** Skill points to unlock. 0 = owned from the start. */
  cost: number;
  /** Nodes that must be unlocked first. */
  requires?: SetId[];
}

export const TREES: Record<ClassId, TreeNode[]> = {
  warrior: [
    { setId: 'warrior_tank', cost: 0 },
    { setId: 'warrior_dps', cost: 0 },
  ],
  wizard: [
    { setId: 'wizard_fire', cost: 0 },
    { setId: 'wizard_frost', cost: 0 },
  ],
  shaman: [
    { setId: 'shaman_spirit', cost: 0 },
    { setId: 'shaman_storm', cost: 0 },
  ],
};

export const LEVEL_CAP = 10;
export const POINTS_PER_LEVEL = 1;
/** EXP to go from level 1 to 2; each further level needs EXP_GROWTH times the last step. */
export const EXP_BASE = 30;
export const EXP_GROWTH = 1.6;

/** EXP needed to climb from `level - 1` to `level` (level ≥ 2). */
export const expForLevel = (level: number): number => (level <= 1 ? 0 : Math.round(EXP_BASE * Math.pow(EXP_GROWTH, level - 2)));
/** Total EXP at which `level` is reached. */
export function expToReach(level: number): number {
  let total = 0;
  for (let l = 2; l <= level; l++) total += expForLevel(l);
  return total;
}
/** Level for a total EXP amount, capped. */
export function levelForExp(exp: number): number {
  let level = 1;
  while (level < LEVEL_CAP && exp >= expToReach(level + 1)) level++;
  return level;
}

/** EXP one enemy is worth: by tier, more as a guard, more for each member of a pack. */
export function expForEnemy(def: Enemy, kind: 'random' | 'guard' | 'boss' | 'node', packSize: number): number {
  const base = def.tier === 1 ? 10 : def.tier === 2 ? 18 : def.tier === 'boss1' ? 60 : 90;
  const guard = kind === 'guard' ? 1.33 : 1;
  const pack = packSize > 1 ? 1.5 : 1;
  return Math.round(base * guard * pack);
}
/** Bonus for finishing a run. */
export const WIN_EXP = 120;
