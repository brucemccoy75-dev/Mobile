// The sharp players think out loud as they act: a claim about their hand or yours that fits the
// move they are making, the board, and how many cards are to come. Whether it is true depends on
// what they actually hold, so a bluff comes with a lie and a value bet with the truth.
import { type Card, rankOf, suitOf } from '../engine/cards';
import { HandCategory, categoryOf, evaluate } from '../engine/evaluator';
import { type Hand } from '../engine/hand';
import { type Rng } from '../engine/rng';

export type ThinkMove = 'fold' | 'check' | 'call' | 'raise' | 'allin';

export interface ThinkInput {
  hand: Hand;
  seat: number;
  /** The move the speaker is making. The line agrees with it. */
  move: ThinkMove;
  /** The man the line is aimed at (the bettor, usually), and his cards, for the reads. */
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

export type Strength = 'nothing' | 'pair' | 'made';

/** What the speaker really holds, in the three grades the lines talk about. */
export function strength(hole: readonly Card[], board: readonly Card[]): Strength {
  if (board.length < 3) return rankOf(hole[0]) === rankOf(hole[1]) ? 'pair' : 'nothing';
  const cat = categoryOf(evaluate([...hole, ...board]));
  const boardCat = board.length >= 5 ? categoryOf(evaluate(board)) : HandCategory.HighCard;
  if (cat >= HandCategory.TwoPair && cat > boardCat) return 'made';
  if (cat === HandCategory.Pair) {
    const boardRanks = board.map(rankOf);
    const own = hole.some((c) => boardRanks.includes(rankOf(c))) || rankOf(hole[0]) === rankOf(hole[1]);
    return own ? 'pair' : 'nothing';
  }
  return 'nothing';
}

const STREET: Record<number, string[]> = {
  3: ['Two to come.', 'Two more cards.', ''],
  4: ['One card to come.', 'One more card.', ''],
  5: ['No more cards.', 'That’s the board.', ''],
};

const END: Record<ThinkMove, string[]> = {
  fold: ['Fold.', 'I’m out.', 'Nope. Fold.', 'Take it.'],
  check: ['Check.', 'I’ll check.', 'Check. For now.'],
  call: ['Call.', 'I’ll call.', 'Fine. Call.', 'Call. Show me.'],
  raise: ['Raise.', 'Raise. Go on.', 'I’m raising.', 'Bet.'],
  allin: ['All in.', 'All of it.', 'I’m all in.'],
};

// Claims about my own hand, by what the move says I hold.
const STRONG = ['I’ve got it. You know I’ve got it.', 'Flopped it. Sorry in advance.', 'Two pair. Moving on.', 'I can’t fold this. Physically.', 'Oh, I have this one.', 'Got there. Don’t tell anyone.'];
const MIDDLE = ['One pair. Hm.', 'Top pair, I think. Kicker’s a problem.', 'I’ve got a pair. Is a pair good here. It’s not, is it.', 'Pair. Just the one. Just the one pair.', 'I’ve got something. Not much. Something.'];
const WEAK = ['Only got an ace.', 'Ace high. Fantastic.', 'I have nothing. I want that on the record.', 'Missed. Completely. Hm.', 'Nothing. Air.', 'I’ve got two cards and a feeling.'];
const PRE_STRONG = ['Pocket pair. Don’t look at me.', 'I’ve got a pair already. Before the flop. Gift.', 'Big cards. Big, big cards.'];
const PRE_WEAK = ['Two random cards. Lovely.', 'Not even suited.', 'I’ve got a jack and a dream.', 'Rags. Absolute rags.'];

/** A line the bot says as he acts, or null when nothing fits. */
export function thinkAloud(input: ThinkInput): string | null {
  const { hand, seat, move, rng, target } = input;
  const me = hand.player(seat);
  const board = hand.board;
  const pick = <T>(xs: T[]): T => xs[Math.floor(rng() * xs.length)];
  const street = board.length >= 3 ? pick(STREET[board.length] ?? ['']) : '';
  const end = pick(END[move]);
  const join = (claim: string) => [claim, street, end].filter(Boolean).join(' ');
  const giving = move === 'fold';
  const pressing = move === 'raise' || move === 'allin';

  // Reads about the other man, when the board makes one possible and he is in the hand. A fold
  // credits him with the hand; a call or raise denies it.
  const tex = boardTexture(board);
  if (target && board.length >= 3 && move !== 'check' && rng() < 0.5) {
    if (tex.straight) {
      return join(giving ? pick([`You’ve got the straight, don’t you, ${target.name}.`, `${target.name} has the straight. I can tell.`]) : pick([`I don’t think you have the straight, ${target.name}.`, `No straight. ${target.name} doesn’t have it.`]));
    }
    if (tex.flush) {
      return join(giving ? pick([`You’ve got the flush, ${target.name}. Of course you do.`, `${target.name}’s got the flush. Hm. Hm.`]) : pick([`No flush. You don’t have the flush, ${target.name}.`, `${target.name}, you missed the flush.`]));
    }
    if (tex.paired) {
      return join(giving ? pick([`That pair on the board helped you, ${target.name}. Didn’t it.`, `${target.name} has trips. I can smell it.`]) : pick([`That pair on the board didn’t help you, ${target.name}.`, `${target.name}, you don’t have the trips. Nobody has the trips.`]));
    }
  }
  // Claims about my own hand, as the move implies them. Whether it is true is up to the cards.
  if (board.length < 3) {
    if (move === 'check') return null;
    return join(pick(pressing ? PRE_STRONG : giving ? PRE_WEAK : rng() < 0.5 ? PRE_STRONG : PRE_WEAK));
  }
  const claim = pressing ? pick(STRONG) : giving ? pick(WEAK) : move === 'call' ? pick(rng() < 0.7 ? MIDDLE : WEAK) : pick(rng() < 0.5 ? MIDDLE : WEAK);
  return join(claim);
}
