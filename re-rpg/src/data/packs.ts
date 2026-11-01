import type { EnemyId } from './types';
import { ROSTER } from './enemies';

/** The crawl roster's duos (DECISIONS #83): any two at random, and Vespas hunt in pairs. */
const CRAWL = ['rage_elemental', 'the_hoarder', 'porkchop_express', 'bad_llama', 'brindled_vespa'];
const CRAWL_PAIRS: [EnemyId, EnemyId][] = [...CRAWL.flatMap((a) => CRAWL.filter((b) => b !== a).map((b) => [a, b] as [EnemyId, EnemyId])), ['brindled_vespa', 'brindled_vespa']];

/**
 * Duo encounters (DECISIONS #29): hand-authored pairs, front enemy first. Pairs are the
 * design surface, so each one should pose a question a single enemy cannot.
 */
export const PAIRS: Record<1 | 2, [EnemyId, EnemyId][]> = {
  1: ROSTER.crawl ? CRAWL_PAIRS : [
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
