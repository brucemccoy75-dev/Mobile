import type { Effect } from '@data/types';
import type { CardPreview } from '@data/describe';
import type { Combatant } from './types';
import { getStatus, hasStatus } from './status';

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
  // Blackjack (DECISIONS #69): every hit lands this many times over.
  const bj = getStatus(attacker, 'blackjack');
  if (bj) dmg *= bj.magnitude;
  return dmg;
}

/** What the intent display shows: total damage if every hit lands unblocked, given current statuses. */
export function predictDamage(attacker: Combatant, target: Combatant, mult: number, hits: number, ignoreDef = false, flat = 0): number {
  return computeHit(attacker, target, mult, ignoreDef, flat, hits) * hits;
}

/**
 * What one damage effect will do to `target` right now, hit by hit, for the card face
 * (DECISIONS #40): blocks are spent in order (Aegis stops all, Guard the physical, Ward the
 * magic), then each hit is exactly `computeHit`. `reasons` names everything that moved the
 * number off the card's own base: the target's armour, Harden, Exposed, Scatter and blocks,
 * the attacker's Weak. Brace's counter is not a change to what lands, so it is not here.
 */
export function previewDamage(attacker: Combatant, target: Combatant, e: Extract<Effect, { type: 'damage' }>): CardPreview {
  const hits = e.hits ?? 1;
  const aegis = hasStatus(target, 'aegis');
  let stacks = getStatus(target, e.kind === 'magic' ? 'ward' : 'guard')?.magnitude ?? 0;
  const out: CardPreview['hits'] = [];
  for (let i = 0; i < hits; i++) {
    const amount = computeHit(attacker, target, e.mult, e.ignoreDef, e.flat ?? 0, hits);
    if (aegis || stacks > 0) { if (!aegis) stacks -= 1; out.push({ amount: 0, blocked: true }); continue; }
    out.push({ amount, blocked: false });
  }
  const reasons: string[] = [];
  if (hasStatus(attacker, 'weak')) reasons.push('weak');
  if (hits === 1 && hasStatus(target, 'scatter')) reasons.push('scattered');
  if (!e.ignoreDef && target.stats.def > 0) reasons.push('armour');
  if (hasStatus(target, 'harden')) reasons.push('hardened');
  if (hasStatus(target, 'exposed')) reasons.push('exposed');
  if (out.some((h) => h.blocked)) reasons.push(aegis ? 'aegis' : e.kind === 'magic' ? 'warded' : 'guarded');
  return { hits: out, reasons };
}
