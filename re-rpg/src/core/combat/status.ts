import type { Status, StatusId } from '@data/types';
import type { Combatant, CombatEvent } from './types';

export const GUARD_CAP = 3;

export function getStatus(c: Combatant, id: StatusId): Status | undefined {
  return c.statuses.find((s) => s.id === id);
}

export function hasStatus(c: Combatant, id: StatusId): boolean {
  return getStatus(c, id) !== undefined;
}

/** Apply or refresh a status. Guard stacks hits (capped); others take the longer duration and larger magnitude. */
export function applyStatus(c: Combatant, id: StatusId, turns: number, magnitude: number, events: CombatEvent[]): void {
  const existing = getStatus(c, id);
  if (!existing) {
    c.statuses.push({ id, turns, magnitude: id === 'guard' ? Math.min(GUARD_CAP, magnitude) : magnitude });
  } else if (id === 'guard') {
    existing.magnitude = Math.min(GUARD_CAP, existing.magnitude + magnitude);
  } else {
    existing.turns = Math.max(existing.turns, turns);
    existing.magnitude = Math.max(existing.magnitude, magnitude);
  }
  const s = getStatus(c, id)!;
  events.push({ t: 'statusApplied', side: c.side, status: id, turns: s.turns, magnitude: s.magnitude });
}

export function removeStatus(c: Combatant, id: StatusId, events: CombatEvent[]): void {
  const i = c.statuses.findIndex((s) => s.id === id);
  if (i < 0) return;
  c.statuses.splice(i, 1);
  events.push({ t: 'statusExpired', side: c.side, status: id });
}

/** Consume one Guard hit if present. Returns true if the hit was blocked. */
export function consumeGuard(c: Combatant, events: CombatEvent[]): boolean {
  const g = getStatus(c, 'guard');
  if (!g) return false;
  g.magnitude -= 1;
  if (g.magnitude <= 0) removeStatus(c, 'guard', events);
  return true;
}

/** Consume Brace if present. Returns true if the hit should be countered. */
export function consumeBrace(c: Combatant, events: CombatEvent[]): boolean {
  if (!hasStatus(c, 'brace')) return false;
  removeStatus(c, 'brace', events);
  return true;
}

/** Consume Chill if present. Returns true if the action should be skipped. */
export function consumeChill(c: Combatant, events: CombatEvent[]): boolean {
  if (!hasStatus(c, 'chill')) return false;
  removeStatus(c, 'chill', events);
  events.push({ t: 'chilled', side: c.side });
  return true;
}

/**
 * End-of-round tick: Burn deals its damage, then timed statuses lose a turn and
 * expire at zero. Guard and Chill are consumed by events, not time.
 */
export function tickStatuses(c: Combatant, events: CombatEvent[]): void {
  for (const dot of ['burn', 'curse'] as const) {
    const st = getStatus(c, dot);
    if (st && c.hp > 0) {
      const amount = Math.min(c.hp, st.magnitude);
      c.hp -= amount;
      events.push({ t: 'burn', side: c.side, amount, status: dot });
    }
  }
  for (const s of c.statuses.slice()) {
    if (s.id === 'guard' || s.id === 'chill') continue;
    s.turns -= 1;
    if (s.turns <= 0) removeStatus(c, s.id, events);
  }
}
