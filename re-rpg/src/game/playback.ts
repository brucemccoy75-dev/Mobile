import type { CombatEvent } from '@core/combat';

/** One event in a lane, with how many labels already stack on its target in this beat. */
export interface Step { e: CombatEvent; stack: number; }
/** A moment of playback: its lanes run in parallel, the steps in a lane one after another. */
export interface Beat { lanes: Step[][]; }

/**
 * How the combat log plays back (DECISIONS #47, #64). Pure, so the pacing is tested:
 *   - a sweep's volley is one beat with a lane per enemy (they are hit at once);
 *   - statuses that land together (Spirit Boomerang's Exposed and Weak, a sweep's burns) are one
 *     beat with a lane each, their labels stacked per target so they do not overlap;
 *   - everything else is a beat of its own.
 */
export function beats(events: CombatEvent[]): Beat[] {
  const out: Beat[] = [];
  const volleyOf = (e: CombatEvent | undefined) => (e as { volley?: number } | undefined)?.volley;
  const whoOf = (e: CombatEvent) => (e as { who?: number }).who ?? 0;
  for (let i = 0; i < events.length; ) {
    const e = events[i]!;
    const v = volleyOf(e);
    if (v !== undefined) {
      let j = i;
      const bySlot = new Map<number, Step[]>();
      while (j < events.length && volleyOf(events[j]) === v) { const x = events[j]!; bySlot.set(whoOf(x), [...(bySlot.get(whoOf(x)) ?? []), { e: x, stack: 0 }]); j++; }
      out.push({ lanes: [...bySlot.values()] });
      i = j;
      continue;
    }
    if (e.t === 'statusApplied') {
      const lanes: Step[][] = [];
      const count = new Map<string, number>();
      let j = i;
      while (j < events.length && events[j]!.t === 'statusApplied' && volleyOf(events[j]) === undefined) {
        const x = events[j]! as Extract<CombatEvent, { t: 'statusApplied' }>;
        const key = `${x.side}:${x.side === 'enemy' ? whoOf(x) : 0}`;
        const n = count.get(key) ?? 0;
        count.set(key, n + 1);
        lanes.push([{ e: x, stack: n }]);
        j++;
      }
      out.push({ lanes });
      i = j;
      continue;
    }
    out.push({ lanes: [[{ e, stack: 0 }]] });
    i++;
  }
  return out;
}
