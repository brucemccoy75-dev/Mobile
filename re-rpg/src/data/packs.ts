import type { EnemyId } from './types';

/**
 * Duo encounters (DECISIONS #29): hand-authored pairs, front enemy first. Pairs are the
 * design surface, so each one should pose a question a single enemy cannot.
 */
export const PAIRS: Record<1 | 2, [EnemyId, EnemyId][]> = {
  1: [
    ['boar', 'hex_imp'],              // a Hex in front of a Gore: block or purge?
    ['shell_beetle', 'rat_pack'],     // a wall while the swarm chips
    ['adept_necromancer', 'boar'],    // curse pressure plus a brute
    ['rat_pack', 'hex_imp'],          // two chippers: Guard stacks melt
  ],
  2: [
    ['ogre', 'witch'],
    ['iron_knight', 'harpies'],
    ['witch', 'harpies'],
    ['ogre', 'iron_knight'],
  ],
};

/** Chance a wild encounter is a duo, by screen index. */
export const DUO_CHANCE = [0.2, 0.4];
