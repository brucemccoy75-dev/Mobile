import type { Effect, Skill, StatusId } from '@data/types';

/**
 * Battle effects (DECISIONS #59). Pure: which effect a card or an enemy move shows is read from
 * what it does, so a new card gets a sensible one without anyone choosing; a card may also name one
 * (`vfx` in cards.json, set in the card editor). The combat scene only draws them.
 *
 *   slash      a grey arc across the target, sized by the damage (physical hits)
 *   fireball   a burning orb with a trail, then a burst (magic that burns)
 *   lightning  a bolt from above and a white flash (magic that ignores defence)
 *   frost      a cold shard and an icy burst (magic that chills)
 *   poison     a green cloud over the target that rains (burn or curse over time)
 *   arcane     a violet orb (any other magic, hexes)
 *   heal       rising green motes on the caster
 *   none       nothing beyond the usual (blocks and buffs glow on their own)
 */
export const VFX_KINDS = ['slash', 'fireball', 'lightning', 'frost', 'poison', 'arcane', 'heal', 'none'] as const;
export type VfxKind = (typeof VFX_KINDS)[number];

const BUFFS: ReadonlySet<StatusId> = new Set(['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter']);
/** A status that helps its holder: applying one glows blue on them. */
export const isBuff = (s: StatusId): boolean => BUFFS.has(s);

export function vfxForEffects(effects: Effect[]): VfxKind {
  const hostile = (s: StatusId) => effects.some((e) => e.type === 'status' && e.target === 'enemy' && e.status === s);
  const dmg = effects.find((e): e is Extract<Effect, { type: 'damage' }> => e.type === 'damage');
  if (dmg) {
    if (dmg.kind !== 'magic') return 'slash';
    if (hostile('burn')) return 'fireball';
    if (hostile('chill')) return 'frost';
    if (hostile('curse')) return 'poison';
    if (dmg.ignoreDef) return 'lightning';
    return 'arcane';
  }
  if (hostile('burn') || hostile('curse')) return 'poison';
  if (hostile('chill')) return 'frost';
  if (effects.some((e) => e.type === 'status' && e.target === 'enemy' && e.kind === 'magic')) return 'arcane';
  if (effects.some((e) => e.type === 'heal')) return 'heal';
  return 'none';
}

/** A card's effect: the one it names, else the one its effects suggest. */
export const vfxForSkill = (skill: Skill): VfxKind => skill.vfx ?? vfxForEffects(skill.effects);
