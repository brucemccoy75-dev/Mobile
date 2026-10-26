import { CLASSES } from './classes';
import { ENEMIES } from './enemies';
import { CARDS_DATA, SETS, SKILLS } from './skills';
import { ITEMS } from './items';
import type { ClassId, Enemy, EnemyId, Item, PlayerClass, SetId, Skill, SkillId, SkillSet } from './types';

export * from './types';
export { describeSkill, baseHit } from './describe';
export { CLASSES, ENEMIES, SETS, SKILLS, ITEMS, CARDS_DATA };
export { compileCards, validateCards, diffCards, cardText, modifierText, CARDS_VERSION, type CardsData, type CardDef, type ModifierDef, type FamilyDef } from './cardsSchema';

const skillById = new Map<SkillId, Skill>(SKILLS.map((s) => [s.id, s]));
const setById = new Map<SetId, SkillSet>(SETS.map((s) => [s.id, s]));
/** The family a tome belongs to for this class (a general tome sits in one family per class); undefined for basics. */
export const familyOf = (classId: ClassId, skillId: string): SkillSet | undefined => SETS.find((st) => st.classId === classId && st.skills.includes(skillId));
const classById = new Map<ClassId, PlayerClass>(CLASSES.map((c) => [c.id, c]));
const enemyById = new Map<EnemyId, Enemy>(ENEMIES.map((e) => [e.id, e]));
const itemById = new Map<string, Item>(ITEMS.map((i) => [i.id, i]));

function must<T>(map: Map<string, T>, id: string, what: string): T {
  const v = map.get(id);
  if (!v) throw new Error(`Unknown ${what}: ${id}`);
  return v;
}

export const getSkill = (id: SkillId) => must(skillById, id, 'skill');
/** Tests only: a card that is not in cards.json, for exercising engine rules no shipped card uses yet. */
export const registerSkill = (s: Skill) => { skillById.set(s.id, s); };
export const getSet = (id: SetId) => must(setById, id, 'set');
export const getClass = (id: ClassId) => must(classById, id, 'class');
export const getEnemy = (id: EnemyId) => must(enemyById, id, 'enemy');
export const getItem = (id: string) => must(itemById, id, 'item');
export const enemiesOfTier = (tier: Enemy['tier']) => ENEMIES.filter((e) => e.tier === tier);
