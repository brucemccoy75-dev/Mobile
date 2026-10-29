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
 *   poison     a green cloud over the target's head that rains (a burn over time)
 *   curse      purple smoke that gathers into a skull over the target's head and drifts apart (a curse, #62, #65)
 *   arcane     a violet orb (any other magic, hexes)
 *   heal       rising green motes on the caster
 *   sandwich   a sandwich floats down to the caster, crumbs fall (Lunch Break, #69)
 *   cards      a fan of playing cards whirls around the caster (Blackjack, #69)
 *   coin       a gold coin flips over the caster and lands on what was called (Trickster, #69)
 *   none       nothing beyond the usual (blocks and buffs glow on their own)
 */
export const VFX_KINDS = ['slash', 'fireball', 'lightning', 'frost', 'poison', 'curse', 'arcane', 'heal', 'sandwich', 'cards', 'coin', 'none'] as const;
/** Effects drawn on the caster, not sent at a target. */
export const SELF_VFX: readonly VfxKind[] = ['heal', 'sandwich', 'cards', 'coin'];
export type VfxKind = (typeof VFX_KINDS)[number];

const BUFFS: ReadonlySet<StatusId> = new Set(['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter']);
/** A status that helps its holder. */
export const isBuff = (s: StatusId): boolean => BUFFS.has(s);

/**
 * The shield that flashes on whoever gains a status, and again when a block stops a hit
 * (DECISIONS #62): one colour per status, so a glance says what happened.
 */
export const SHIELD_COLOR: Record<StatusId, number> = {
  guard: 0xf2f6ff, ward: 0xffd84a, aegis: 0xfff0b0, harden: 0x9fb0c8, brace: 0xff9f68, scatter: 0x8ff0b0,
  weak: 0xff4d4d, curse: 0xb06bff, exposed: 0xff7a1a, burn: 0xff3d00, chill: 0x7fd4ff, stun: 0xffc0f0,
  regen: 0x7dff9a, blackjack: 0xffd700,
};
/** The shield a blocked hit shows: Aegis if it was up, else Ward for magic and Guard for a blow. */
export const blockColor = (kind: 'physical' | 'magic', aegis: boolean): number => (aegis ? SHIELD_COLOR.aegis : kind === 'magic' ? SHIELD_COLOR.ward : SHIELD_COLOR.guard);

export function vfxForEffects(effects: Effect[]): VfxKind {
  // A branching card shows what its first side does (DECISIONS #69).
  const br = effects.find((e): e is Extract<Effect, { type: 'if' }> => e.type === 'if');
  if (br) return vfxForEffects([...effects.filter((e) => e.type !== 'if'), ...br.then]);
  const hostile = (s: StatusId) => effects.some((e) => e.type === 'status' && e.target === 'enemy' && e.status === s);
  const dmg = effects.find((e): e is Extract<Effect, { type: 'damage' }> => e.type === 'damage');
  if (dmg) {
    if (dmg.kind !== 'magic') return 'slash';
    if (hostile('burn')) return 'fireball';
    if (hostile('chill')) return 'frost';
    if (hostile('curse')) return 'curse';
    if (dmg.ignoreDef) return 'lightning';
    return 'arcane';
  }
  if (hostile('curse')) return 'curse';
  if (hostile('burn')) return 'poison';
  if (hostile('chill')) return 'frost';
  if (effects.some((e) => e.type === 'status' && e.target === 'enemy' && e.kind === 'magic')) return 'arcane';
  if (effects.some((e) => e.type === 'heal')) return 'heal';
  return 'none';
}

/** A card's effect: the one it names, else the one its effects suggest. */
export const vfxForSkill = (skill: Skill): VfxKind => skill.vfx ?? vfxForEffects(skill.effects);
