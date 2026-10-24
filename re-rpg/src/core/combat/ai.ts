import type { Enemy, EnemyMove, MoveTable } from '@data/types';
import type { CombatEvent, EnemyCombatant } from './types';

function tableFor(def: Enemy, phase: number): MoveTable {
  if (phase === 0) return def.table;
  return def.phases![phase - 1]!.table;
}

/** Pick the next move from a table, advancing the sequence cursor for sequence tables. */
export function pickMove(e: EnemyCombatant, def: Enemy, roll: () => number): EnemyMove {
  const table = tableFor(def, e.phase);
  if (table.kind === 'sequence') {
    const m = table.moves[e.seqIndex % table.moves.length]!;
    e.seqIndex = (e.seqIndex + 1) % table.moves.length;
    return m;
  }
  const total = table.moves.reduce((s, m) => s + m.weight, 0);
  let r = roll() * total;
  for (const { move, weight } of table.moves) {
    r -= weight;
    if (r < 0) return move;
  }
  return table.moves[table.moves.length - 1]!.move;
}

/** Which phase applies at the enemy's current HP (highest index whose threshold is met). */
export function phaseFor(def: Enemy, hp: number, maxHp: number): number {
  const ratio = hp / maxHp;
  let phase = 0;
  (def.phases ?? []).forEach((p, i) => { if (ratio <= p.hpBelow) phase = i + 1; });
  return phase;
}

/**
 * Called at end of round. If the enemy crossed a phase threshold, the queue is
 * rebuilt (the old tell was a lie, which is the drama of a phase change);
 * otherwise the tell becomes the intent and a fresh tell is drawn.
 */
export function advanceMoves(e: EnemyCombatant, def: Enemy, roll: () => number, events: CombatEvent[]): void {
  const phase = phaseFor(def, e.hp, e.stats.maxHp);
  if (phase !== e.phase) {
    e.phase = phase;
    e.seqIndex = 0;
    events.push({ t: 'phase', phase });
    e.current = pickMove(e, def, roll);
    e.next = pickMove(e, def, roll);
    return;
  }
  e.current = e.next;
  e.next = pickMove(e, def, roll);
}
