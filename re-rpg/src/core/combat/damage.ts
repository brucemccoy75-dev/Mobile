import type { Combatant } from './types';
import { hasStatus } from './status';

export const EXPOSED_MULT = 2;
export const WEAK_MULT = 0.5;

export const DEF_FLOOR = 0.5;

/**
 * One hit, before Guard. Flat and readable on purpose:
 *   base = round(classAtk * mult) + gearAtk + flat, halved if attacker is Weak
 *   (gear adds per hit and never multiplies, so stacked weapons stop doubling big cards: DECISIONS #31)
 *   after def = max(ceil(base * 0.5), base - def)   (def ignored for ignoreDef attacks)
 *   doubled if target is Exposed
 * Defence can never remove more than half a hit, so armour makes fights
 * longer, not endless (a 4-attack hero vs 3 defence used to deal 1).
 */
export function computeHit(attacker: Combatant, target: Combatant, mult: number, ignoreDef = false, flat = 0, hits = 1): number {
  const gear = attacker.stats.gearAtk ?? 0;
  let base = Math.round((attacker.stats.atk - gear) * mult) + gear + flat;
  // Scatter: a single big hit finds nothing; multi-hit attacks are unaffected.
  if (hits === 1 && hasStatus(target, 'scatter')) base = Math.ceil(base * 0.5);
  if (hasStatus(attacker, 'weak')) base = Math.floor(base * WEAK_MULT);
  const def = ignoreDef ? 0 : target.stats.def;
  let dmg = Math.max(1, Math.ceil(base * DEF_FLOOR), base - def);
  // Hardened (armoured enemies' shell): half damage while it lasts, instead of a full block.
  if (hasStatus(target, 'harden')) dmg = Math.max(1, Math.ceil(dmg * 0.5));
  if (hasStatus(target, 'exposed')) dmg *= EXPOSED_MULT;
  return dmg;
}

/** What the intent display shows: total damage if every hit lands unblocked, given current statuses. */
export function predictDamage(attacker: Combatant, target: Combatant, mult: number, hits: number, ignoreDef = false, flat = 0): number {
  return computeHit(attacker, target, mult, ignoreDef, flat, hits) * hits;
}
