import { describe, expect, it } from 'vitest';
import { parseCards } from './cards';
import { HandCategory, categoryOf, describeHand, evaluate } from './evaluator';

const ev = (s: string) => evaluate(parseCards(s));
const cat = (s: string) => categoryOf(ev(s));

describe('evaluate', () => {
  it('classifies every category', () => {
    expect(cat('As Ks Qs Js Ts 2c 3d')).toBe(HandCategory.StraightFlush);
    expect(cat('5s 4s 3s 2s As Kc Qd')).toBe(HandCategory.StraightFlush);
    expect(cat('9c 9d 9h 9s 2c 3d 4h')).toBe(HandCategory.Quads);
    expect(cat('9c 9d 9h 2s 2c 3d 4h')).toBe(HandCategory.FullHouse);
    expect(cat('Ac 9c 7c 4c 2c 3d Kh')).toBe(HandCategory.Flush);
    expect(cat('9c 8d 7h 6s 5c Ad Kh')).toBe(HandCategory.Straight);
    expect(cat('Ac 2d 3h 4s 5c 9d Kh')).toBe(HandCategory.Straight);
    expect(cat('9c 9d 9h 2s 4c 3d Kh')).toBe(HandCategory.Trips);
    expect(cat('9c 9d 4h 4s 2c 3d Kh')).toBe(HandCategory.TwoPair);
    expect(cat('9c 9d 4h 5s 2c 3d Kh')).toBe(HandCategory.Pair);
    expect(cat('9c 2d 4h 5s Jc 3d Kh')).toBe(HandCategory.HighCard);
  });

  it('ranks categories in order', () => {
    const hands = [
      '9c 2d 4h 5s Jc 3d Kh', '9c 9d 4h 5s 2c 3d Kh', '9c 9d 4h 4s 2c 3d Kh', '9c 9d 9h 2s 4c 3d Kh',
      '9c 8d 7h 6s 5c Ad Kh', 'Ac 9c 7c 4c 2c 3d Kh', '9c 9d 9h 2s 2c 3d 4h', '9c 9d 9h 9s 2c 3d 4h',
      '5s 4s 3s 2s As Kc Qd',
    ];
    for (let i = 1; i < hands.length; i++) expect(ev(hands[i])).toBeGreaterThan(ev(hands[i - 1]));
  });

  it('uses kickers', () => {
    expect(ev('As Ad Kc 7d 2h 3c 4s')).toBeGreaterThan(ev('Ah Ac Qd 7c 2s 3d 4h'));
    expect(ev('As Ad Kc 7d 2h 3c 4s')).toBe(ev('Ah Ac Kd 7c 2s 3d 4h'));
    // Only five cards count: the sixth card never breaks the tie.
    expect(ev('As Ad Kc Qd Jh 3c 4s')).toBe(ev('Ah Ac Kd Qc Js 2d 4h'));
  });

  it('picks the best two pair from three pairs and the right kicker', () => {
    const score = ev('Ac Ad 9c 9d 4h 4s Kh');
    expect(categoryOf(score)).toBe(HandCategory.TwoPair);
    expect(describeHand(score)).toBe('Two Pair, Aces and Nines');
    expect(score).toBeGreaterThan(ev('Ah As 9h 9s 4c 4d Qh'));
  });

  it('builds a full house from two sets', () => {
    const score = ev('Ac Ad Ah 9c 9d 9h 2s');
    expect(describeHand(score)).toBe('Full House, Aces full of Nines');
  });

  it('prefers a straight flush over a higher flush and a flush over a straight', () => {
    expect(categoryOf(ev('6s 5s 4s 3s 2s As Kh'))).toBe(HandCategory.StraightFlush);
    expect(describeHand(ev('6s 5s 4s 3s 2s As Kh'))).toBe('Straight Flush, Six high');
    expect(categoryOf(ev('Ks 9s 4s 3s 2s Ah Qd'))).toBe(HandCategory.Flush);
  });

  it('finds the highest straight', () => {
    expect(describeHand(ev('Ac Kd Qh Js Tc 9d 8h'))).toBe('Straight, Ace high');
    expect(describeHand(ev('Ac 2d 3h 4s 5c 6d 8h'))).toBe('Straight, Six high');
    expect(describeHand(ev('Ac 2d 3h 4s 5c 9d 8h'))).toBe('Straight, Five high');
  });

  it('describes hands', () => {
    expect(describeHand(ev('As Ks Qs Js Ts 2c 3d'))).toBe('Royal Flush');
    expect(describeHand(ev('9c 9d 9h 9s 2c 3d 4h'))).toBe('Four of a Kind, Nines');
    expect(describeHand(ev('9c 2d 4h 5s Jc 3d Kh'))).toBe('King high');
    expect(describeHand(ev('9c 9d 4h 5s 2c 3d Kh'))).toBe('Pair of Nines');
  });

  it('works with five and six cards', () => {
    expect(cat('As Ks Qs Js Ts')).toBe(HandCategory.StraightFlush);
    expect(cat('9c 9d 4h 4s 2c 3d')).toBe(HandCategory.TwoPair);
    expect(() => evaluate(parseCards('As Ks'))).toThrow();
  });
});
