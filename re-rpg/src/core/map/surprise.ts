import type { EnemyId } from '@data/types';
import type { Rng } from '@core/rng';
import type { MapNode, NodeRule } from './types';

/**
 * Surprise fights (DECISIONS #81): about one single-enemy fight node in seven is not what the map
 * shows. The map shows `enemyId`; the fight is `surprise`, another species from the same roster,
 * and it opens with "That's no <shown>!". Rolled with the map on its own stream, so a reload cannot
 * re-roll it. Never the boss, an elite, a duo, a cursed node or a node whose enemy the designer set.
 */
export const SURPRISE_CHANCE = 0.15;

export function rollSurprises(nodes: MapNode[], roster: readonly EnemyId[], rng: Rng, rules: Record<string, NodeRule> = {}): void {
  for (const n of nodes) {
    if ((n.kind !== 'monster' && n.kind !== 'unknown') || !n.enemyId || n.extra?.length || n.cursed) continue;
    if (rules[n.id]?.enemy || rules[n.id]?.pair) continue;
    const others = roster.filter((id) => id !== n.enemyId);
    if (!others.length || !rng.chance(SURPRISE_CHANCE)) continue;
    n.surprise = rng.pick(others);
  }
}
