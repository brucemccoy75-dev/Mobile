import type { Combatant } from './types';
import { hasStatus } from './status';

export const EXPOSED_MULT = 2;
export const WEAK_MULT = 0.5;

/**
 * One hit, before Guard. Flat and readable on purpose:
 *   base = round(atk * mult), halved if attacker is Weak
 *   after def = max(1, base - def)   (def ignored for ignoreDef attacks)
 *   doubled if target is Exposed
 */
export function computeHit(attacker: Combatant, target: Combatant, mult: number, ignoreDef = false): number {
  let base = Math.round(attacker.stats.atk * mult);
  if (hasStatus(attacker, 'weak')) base = Math.floor(base * WEAK_MULT);
  const def = ignoreDef ? 0 : target.stats.def;
  let dmg = Math.max(1, base - def);
  if (hasStatus(target, 'exposed')) dmg *= EXPOSED_MULT;
  return dmg;
}

/** What the intent display shows: total damage if every hit lands unblocked, given current statuses. */
export function predictDamage(attacker: Combatant, target: Combatant, mult: number, hits: number, ignoreDef = false): number {
  return computeHit(attacker, target, mult, ignoreDef) * hits;
}
