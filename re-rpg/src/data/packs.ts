import type { EnemyId } from './types';
import { DUNGEON_ROSTER } from './enemies';

/** The Treasure Dungeon's duos (DECISIONS #83, #84): any two at random, and hornets hunt in pairs. */
export const DUNGEON_PAIRS: [EnemyId, EnemyId][] = [...DUNGEON_ROSTER.flatMap((a) => DUNGEON_ROSTER.filter((b) => b !== a).map((b) => [a, b] as [EnemyId, EnemyId])), ['bramble_hornet', 'bramble_hornet']];

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
export const DUO_CHANCE = [0.3, 0.4]; // screen 1 was 0.2: duos are where the HP goes (DECISIONS #42)
