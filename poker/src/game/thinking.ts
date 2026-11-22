// The sharp players think out loud while they decide: a claim about their hand or yours that is
// sometimes true and sometimes a lie, but always fits the board and how many cards are to come.
import { type Card, rankOf, suitOf } from '../engine/cards';
import { HandCategory, categoryOf, evaluate } from '../engine/evaluator';
import { type Hand } from '../engine/hand';
import { type Rng } from '../engine/rng';

export interface ThinkInput {
  hand: Hand;
  seat: number;
  /** Chips needed to call; 0 when a check is available. */
  callAmount: number;
  /** Whether the claim should be true. */
  accurate: boolean;
  /** The man the line is aimed at (the bettor, usually), and his cards if the speaker is right about him. */
  target?: { name: string; hole: readonly Card[] };
  rng: Rng;
}

/** What the board makes possible: the reads a bot can claim about an opponent. */
export function boardTexture(board: readonly Card[]): { flush: boolean; straight: boolean; paired: boolean } {
  const suits = [0, 0, 0, 0];
  for (const c of board) suits[suitOf(c)]++;
  const ranks = new Set(board.map(rankOf));
  const flush = suits.some((n) => n >= 3);
  const paired = ranks.size < board.length;
  // Three ranks within a five-card window make a straight possible.
  let straight = false;
  const sorted = [...ranks].sort((a, b) => a - b);
  if (sorted.includes(12)) sorted.unshift(-1);
  for (let i = 0; i + 2 < sorted.length; i++) if (sorted[i + 2] - sorted[i] <= 4) straight = true;
  return { flush, straight, paired };
}

function strength(hole: readonly Card[], board: readonly Card[]): 'nothing' | 'pair' | 'made' {
  if (board.length < 3) {
    const [a, b] = hole;
    if (rankOf(a) === rankOf(b)) return 'pair';
    return 'nothing';
  }
  const cat = categoryOf(evaluate([...hole, ...board]));
  const boardCat = categoryOf(evaluate(board.length >= 5 ? board : [...board, ...hole].slice(0, 5)));
  if (cat >= HandCategory.TwoPair && cat > boardCat) return 'made';
  if (cat === HandCategory.Pair) {
    // A pair on the board alone is nothing.
    const boardRanks = board.map(rankOf);
    const own = hole.some((c) => boardRanks.includes(rankOf(c))) || rankOf(hole[0]) === rankOf(hole[1]);
    return own ? 'pair' : 'nothing';
  }
  return 'nothing';
}

const STREET: Record<number, string[]> = {
  0: ['', 'Five cards to come.', ''],
  3: ['Two to come.', 'Two more cards.', ''],
  4: ['One card to come.', 'One more card.', ''],
  5: ['No more cards.', 'That’s the board.', ''],
};

const MADE = ['I’ve got it. You know I’ve got it.', 'Flopped it. Sorry in advance.', 'Two pair. Moving on.', 'I can’t fold this. Physically.', 'Oh, I have this one.', 'Got there. Don’t tell anyone.'];
const PAIR = ['One pair. Hm.', 'Top pair, I think. Kicker’s a problem.', 'I’ve got a pair. Is a pair good here. It’s not, is it.', 'Pair. Just the one. Just the one pair.'];
const NOTHING = ['Only got an ace. Should I call?', 'Ace high. Fantastic.', 'I have nothing. I want that on the record.', 'Missed. Completely. Hm.', 'Nothing. Air. Should I raise anyway?', 'I’ve got two cards and a feeling.'];
const PRE_PAIR = ['Pocket pair. Don’t look at me.', 'I’ve got a pair already. Before the flop. Gift.'];
const PRE_NOTHING = ['Two random cards. Lovely.', 'Not even suited. Should I call?', 'I’ve got a jack and a dream.'];

/** A line the bot says while deciding, or null when nothing fits. */
export function thinkAloud(input: ThinkInput): string | null {
  const { hand, seat, accurate, rng, target } = input;
  const me = hand.player(seat);
  const board = hand.board;
  const pick = <T>(xs: T[]): T => xs[Math.floor(rng() * xs.length)];
  const street = pick(STREET[board.length] ?? ['']);
  const tail = street ? ` ${street}` : '';

  // Reads about the other man, when the board makes one possible and he is in the hand.
  const tex = boardTexture(board);
  if (target && board.length >= 3 && rng() < 0.5) {
    const his = categoryOf(evaluate([...target.hole, ...board]));
    if (tex.straight) {
      const has = his === HandCategory.Straight || his === HandCategory.StraightFlush;
      const says = accurate ? has : !has;
      return (says ? pick([`You’ve got the straight, don’t you, ${target.name}.`, `${target.name} has the straight. I can tell. Fold?`]) : pick([`I don’t think you have the straight, ${target.name}. Raise?`, `No straight. ${target.name} doesn’t have it. Call.`])) + tail;
    }
    if (tex.flush) {
      const has = his === HandCategory.Flush || his === HandCategory.StraightFlush;
      const says = accurate ? has : !has;
      return (says ? pick([`You’ve got the flush, ${target.name}. Of course you do.`, `${target.name}’s got the flush. Hm. Hm.`]) : pick([`No flush. You don’t have the flush, ${target.name}.`, `${target.name}, you missed the flush. I’m calling.`])) + tail;
    }
    if (tex.paired) {
      const has = his >= HandCategory.Trips;
      const says = accurate ? has : !has;
      return (says ? pick([`That pair on the board helped you, ${target.name}. Didn’t it.`, `${target.name} has trips. I can smell it.`]) : pick([`That pair on the board didn’t help you, ${target.name}.`, `${target.name}, you don’t have the trips. Nobody has the trips.`])) + tail;
    }
  }
  // Claims about my own hand.
  const mine = strength(me.hole, board);
  if (board.length < 3) {
    const claim = accurate ? mine : mine === 'pair' ? 'nothing' : 'pair';
    return pick(claim === 'pair' ? PRE_PAIR : PRE_NOTHING);
  }
  let claim: 'nothing' | 'pair' | 'made' = mine;
  if (!accurate) claim = mine === 'nothing' ? pick(['pair', 'made']) : mine === 'made' ? pick(['nothing', 'pair']) : pick(['nothing', 'made']);
  return pick(claim === 'made' ? MADE : claim === 'pair' ? PAIR : NOTHING) + tail;
}
