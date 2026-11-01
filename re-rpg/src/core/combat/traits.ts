import type { CursedTrait, EnemyTraits } from '@data/types';
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

/**
 * An enemy's weaknesses and habits as chips (DECISIONS #83), in the order they matter in a fight.
 * Each says what it is and how to use it.
 */
export function enemyTraitInfo(t: EnemyTraits | undefined): { label: string; desc: string }[] {
  if (!t) return [];
  const out: { label: string; desc: string }[] = [];
  if (t.momentum) out.push({ label: 'ROLLING', desc: `Every attack it makes adds ${t.momentum} to all its later hits (Momentum). Block one of its hits with Guard, or Chill it, and the momentum is gone.` });
  if (t.frenzy) out.push({ label: `PACK +${Math.round(t.frenzy * 100)}%`, desc: `Hits ${Math.round(t.frenzy * 100)}% harder for each other one of its kind still standing. Kill one and the other calms at once.` });
  if (t.sweepVuln) out.push({ label: `SWEEPS ×${t.sweepVuln}`, desc: `Too slow to dodge: a card that hits every enemy (Bellow and the like) does ${t.sweepVuln}× to it.` });
  if (t.chillExposes) out.push({ label: 'CHILL → EXPOSED', desc: `A Chill holds it fast: it skips its next action and is Exposed (double damage) for ${t.chillExposes} rounds.` });
  if (t.chillGrounds) out.push({ label: 'CHILL GROUNDS', desc: 'A Chill brings it down: it skips its next action and loses its Scatter.' });
  if (t.burnVuln) out.push({ label: `BURNS ×${t.burnVuln}`, desc: `Burn on it ticks ${t.burnVuln}× as hard.` });
  return out;
}
