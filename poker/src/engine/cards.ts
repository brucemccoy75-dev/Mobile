// Cards are integers 0..51: rank = card % 13 (0 = deuce .. 12 = ace), suit = floor(card / 13).
import { type Rng } from './rng';

export type Card = number;

export const RANK_CHARS = '23456789TJQKA';
export const SUIT_CHARS = 'cdhs';
export const RANK_NAMES = ['Deuce', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace'];
export const RANK_PLURALS = ['Deuces', 'Threes', 'Fours', 'Fives', 'Sixes', 'Sevens', 'Eights', 'Nines', 'Tens', 'Jacks', 'Queens', 'Kings', 'Aces'];
export const SUIT_NAMES = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

export const ACE = 12;

export function makeCard(rank: number, suit: number): Card {
  return suit * 13 + rank;
}

export function rankOf(card: Card): number {
  return card % 13;
}

export function suitOf(card: Card): number {
  return Math.floor(card / 13);
}

export function cardToString(card: Card): string {
  return RANK_CHARS[rankOf(card)] + SUIT_CHARS[suitOf(card)];
}

export function cardsToString(cards: readonly Card[]): string {
  return cards.map(cardToString).join(' ');
}

/** Parses "As", "Td", "2c". */
export function parseCard(s: string): Card {
  const rank = RANK_CHARS.indexOf(s[0].toUpperCase());
  const suit = SUIT_CHARS.indexOf(s[1].toLowerCase());
  if (s.length !== 2 || rank < 0 || suit < 0) throw new Error(`bad card: ${s}`);
  return makeCard(rank, suit);
}

/** Parses "As Kd 7c" (whitespace separated). */
export function parseCards(s: string): Card[] {
  return s.trim().split(/\s+/).filter(Boolean).map(parseCard);
}

export function newDeck(): Card[] {
  const deck: Card[] = [];
  for (let c = 0; c < 52; c++) deck.push(c);
  return deck;
}

/** Fisher-Yates shuffle, in place, using the given rng. */
export function shuffle<T>(items: T[], rng: Rng): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const t = items[i];
    items[i] = items[j];
    items[j] = t;
  }
  return items;
}
