import type { Stats, Status, StatusId } from '@data/types';
import { WEAK_MULT } from './damage';

/**
 * The ATK and DEF a fighter shows in battle (DECISIONS #77). ATK is the attack it hits with now:
 * halved by Weak and multiplied by Blackjack, the same arithmetic as computeHit. DEF stays the
 * defence stat, since the shields work as blocks or multipliers rather than more armour. Its trend
 * says whether a status protects the fighter now (Guard, Ward, Aegis, Harden, Brace, Scatter) or
 * opens it up (Exposed).
 */
export type Trend = 'up' | 'down' | 'mixed' | 'even';
export interface Rating { value: number; base: number; trend: Trend; why: StatusId[] }

const ATK_UP: StatusId[] = ['blackjack'];
const ATK_DOWN: StatusId[] = ['weak'];
const DEF_UP: StatusId[] = ['guard', 'ward', 'aegis', 'harden', 'brace', 'scatter'];
const DEF_DOWN: StatusId[] = ['exposed'];

const trendOf = (up: boolean, down: boolean): Trend => (up && down ? 'mixed' : up ? 'up' : down ? 'down' : 'even');

export function statRatings(stats: Stats, statuses: Status[]): { atk: Rating; def: Rating } {
  const has = (id: StatusId) => statuses.find((s) => s.id === id);
  let atk = stats.atk;
  if (has('weak')) atk = Math.floor(atk * WEAK_MULT);
  const bj = has('blackjack');
  if (bj) atk *= bj.magnitude;
  const atkWhy = statuses.filter((s) => ATK_UP.includes(s.id) || ATK_DOWN.includes(s.id)).map((s) => s.id);
  const defWhy = statuses.filter((s) => DEF_UP.includes(s.id) || DEF_DOWN.includes(s.id)).map((s) => s.id);
  return {
    atk: { value: atk, base: stats.atk, trend: atk > stats.atk ? 'up' : atk < stats.atk ? 'down' : trendOf(atkWhy.some((i) => ATK_UP.includes(i)), atkWhy.some((i) => ATK_DOWN.includes(i))), why: atkWhy },
    def: { value: stats.def, base: stats.def, trend: trendOf(defWhy.some((i) => DEF_UP.includes(i)), defWhy.some((i) => DEF_DOWN.includes(i))), why: defWhy },
  };
}
