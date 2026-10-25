import { getItem } from '@data/index';
import type { Item, Skill, SkillId, Stats } from '@data/types';

/** Run-local skill upgrades: level per skill id, applied on top of the base definition. */
export type SkillUpgrades = Record<SkillId, number>;

/**
 * A "+1" tome upgrade, per level: +1 flat damage on damage effects, +2 on heals,
 * +1 Guard stack on self-guards, +1 magnitude on Burn/Curse. Name gains " +N".
 */
export function upgradeSkill(skill: Skill, level: number): Skill {
  if (!level) return skill;
  return {
    ...skill,
    name: `${skill.name} +${level}`,
    effects: skill.effects.map((e) => {
      if (e.type === 'damage') return { ...e, flat: (e.flat ?? 0) + level };
      if (e.type === 'heal') return { ...e, flat: (e.flat ?? 0) + 2 * level };
      if (e.type === 'status' && e.target === 'self' && (e.status === 'guard' || e.status === 'ward')) return { ...e, magnitude: (e.magnitude ?? 1) + level };
      if (e.type === 'status' && e.target === 'enemy' && (e.status === 'burn' || e.status === 'curse')) return { ...e, magnitude: (e.magnitude ?? 1) + level };
      return e;
    }),
  };
}

export const skillWith = (skill: Skill, upgrades: SkillUpgrades | undefined): Skill => upgradeSkill(skill, upgrades?.[skill.id] ?? 0);

/** A "+1" item: the first positive stat gains +1 (HP gains +3). New id so it never collides with the pool. */
export function upgradeItem(item: Item): Item {
  const total: Stats = { maxHp: 0, atk: 0, def: 0 };
  for (const m of item.mods) { total.maxHp += m.stat?.maxHp ?? 0; total.atk += m.stat?.atk ?? 0; total.def += m.stat?.def ?? 0; }
  const bump: Partial<Stats> = total.atk > 0 ? { atk: 1 } : total.def > 0 ? { def: 1 } : { maxHp: 3 };
  const label = bump.atk ? '+1 ATK' : bump.def ? '+1 DEF' : '+3 max HP';
  const baseId = item.id.replace(/\+\d+$/, '');
  const level = (parseInt(item.id.match(/\+(\d+)$/)?.[1] ?? '0', 10) || 0) + 1;
  return { ...item, id: `${baseId}+${level}`, name: `${item.name.replace(/ \+\d+$/, '')} +${level}`, text: `${item.text}, ${label}`, mods: [...item.mods, { stat: bump }] };
}

/** Items that exist only in this run (quest upgrades) are looked up before the catalogue. */
export function resolveItem(id: string, custom: Item[] = []): Item {
  return custom.find((i) => i.id === id) ?? getItem(id);
}
