import type { Dialogue } from '@core/dialogue';
import worldJson from './world.json';

/**
 * The writing (DECISIONS #35), now kept in world.json and edited in the world editor (#55); this
 * module only hands it to the game. Every encounter opens with a few lines and two or three options;
 * options set flags, move a relation, cost or pay a little, and then start the fight or let you
 * walk on. Entries are tried in order, so the variants with conditions come first.
 *
 * Relations (persistent, in meta): wren (the rat-keeper), gerald (the child necromancer's
 * skeleton), imp, andre. Run flags: rats_promise, imp_book, met_gerald, bribed_boar.
 */
export const DIALOGUE: Dialogue[] = (worldJson as unknown as { dialogue: Dialogue[] }).dialogue;
