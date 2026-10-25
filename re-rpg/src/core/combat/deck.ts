import type { SkillId } from '@data/types';
import type { CombatEvent, PlayerCombatant } from './types';

export const HAND_CAP = 3;
export const DECK_CAP = 6;

/**
 * Start-of-round deal (DECISIONS #2): a full hand on round 1, then one card per
 * round. At the hand cap the oldest card is discarded first. Empty deck
 * reshuffles the discard pile.
 */
export function dealOne(p: PlayerCombatant, shuffle: (a: SkillId[]) => SkillId[], events: CombatEvent[]): void {
  if (p.deck.length === 0 && p.discard.length > 0) {
    p.deck = shuffle(p.discard);
    p.discard = [];
    events.push({ t: 'reshuffle', count: p.deck.length });
  }
  if (p.deck.length === 0) return; // nothing known yet: basics only

  if (p.hand.length >= HAND_CAP) {
    const oldest = p.hand.shift()!;
    p.discard.push(oldest);
    events.push({ t: 'handOverflow', discarded: oldest });
  }
  const card = p.deck.shift()!;
  p.hand.push(card);
  events.push({ t: 'deal', skill: card, hand: p.hand.slice() });
}

/** Remove a card from the hand into the discard pile. */
export function playCard(p: PlayerCombatant, index: number): SkillId {
  const card = p.hand[index];
  if (card === undefined) throw new Error(`No card at hand index ${index}`);
  p.hand.splice(index, 1);
  p.discard.push(card);
  return card;
}
