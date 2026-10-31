import type { Item, Slot, Stats } from '@data/types';
import type { Gear } from '@core/combat/types';

export type Equipment = Record<Slot, Item | null>;

export const emptyEquipment = (): Equipment => ({ body: null, weapon: null, relic: null });

/** Class base plus every equipped modifier. HP and DEF are floored at 1 and 0. */
export function computeStats(base: Stats, eq: Equipment): Stats {
  const out = { ...base };
  for (const item of Object.values(eq)) {
    if (!item) continue;
    for (const m of item.mods) {
      out.maxHp += m.stat?.maxHp ?? 0;
      out.atk += m.stat?.atk ?? 0;
      out.def += m.stat?.def ?? 0;
      if (m.stat?.luck) out.luck = (out.luck ?? 0) + m.stat.luck;
    }
  }
  out.maxHp = Math.max(1, out.maxHp);
  out.def = Math.max(0, out.def);
  out.atk = Math.max(1, out.atk);
  out.gearAtk = out.atk - base.atk;
  return out;
}

/** Stat deltas of swapping `current` for `next` in the same slot (for the compare panel). */
export function compareItems(base: Stats, eq: Equipment, next: Item): { before: Stats; after: Stats; delta: Stats } {
  const before = computeStats(base, eq);
  const after = computeStats(base, { ...eq, [next.slot]: next });
  return { before, after, delta: { maxHp: after.maxHp - before.maxHp, atk: after.atk - before.atk, def: after.def - before.def } };
}

/**
 * Equip, returning the new HP: max HP changes move current HP by the same amount,
 * so a +6 HP amulet is 6 real HP and a −10 idol is a real wound (min 1).
 */
export function equip(base: Stats, eq: Equipment, hp: number, next: Item): { equipment: Equipment; hp: number; replaced: Item | null } {
  const before = computeStats(base, eq);
  const equipment = { ...eq, [next.slot]: next };
  const after = computeStats(base, equipment);
  // More max HP is real HP gained; less max HP only lowers the ceiling (clamped), it is not a wound.
  const delta = after.maxHp - before.maxHp;
  const newHp = Math.max(1, Math.min(after.maxHp, delta > 0 ? hp + delta : hp));
  return { equipment, hp: newHp, replaced: eq[next.slot] };
}

/** What the worn items do in a fight beyond stats (DECISIONS #82): immunities, pierce, the paid reshuffle. */
export function gearOf(eq: Equipment): Gear | undefined {
  const items = Object.values(eq).filter((i): i is NonNullable<typeof i> => !!i);
  const immune = [...new Set(items.flatMap((i) => i.immune ?? []))];
  const pierce = Math.max(0, ...items.map((i) => i.pierce ?? 0));
  const redraw = items.some((i) => i.redraw);
  if (!immune.length && !pierce && !redraw) return undefined;
  return { ...(immune.length ? { immune } : {}), ...(pierce ? { pierce } : {}), ...(redraw ? { redraw } : {}) };
}
/** Gold the worn relic asks for its reshuffle (DECISIONS #82), or null without one. */
export const redrawCost = (eq: Equipment): number | null => Object.values(eq).find((i) => i?.redraw)?.redraw?.gold ?? null;
