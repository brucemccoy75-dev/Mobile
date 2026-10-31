import type { CursedTrait } from '@data/types';
import { CURSED_SHIELD } from './damage';
import { CURSED_FOLLOW_UP, CURSED_THORNS } from './engine';

/**
 * A cursed enemy's traits as chips on its status row (DECISIONS #78): a short label and the line a
 * tap shows. They last the whole fight. The numbers come from the engine's own constants.
 */
export const CURSED_TRAIT_INFO: Record<CursedTrait, { label: string; desc: string }> = {
  hp: { label: '2× HP', desc: 'Cursed: twice its usual health.' },
  damage: { label: '2× DMG', desc: 'Cursed: its attack is doubled, so every hit it lands is twice as hard.' },
  shield: { label: 'SHIELD', desc: `Cursed: every hit on it is cut to ${Math.round(CURSED_SHIELD * 100)}%, for the whole fight.` },
  thorns: { label: `THORNS ${CURSED_THORNS}`, desc: `Cursed: every attack you make on it costs you ${CURSED_THORNS} HP, through any block. The blow that kills it costs nothing.` },
  followUp: { label: 'FOLLOW-UP', desc: `Cursed: after each of its attacks, a second hit for ${Math.round(CURSED_FOLLOW_UP * 100)}% of its attack (at least 1) that no block stops.` },
};
