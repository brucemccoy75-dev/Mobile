import { ITEMS, SKILLS, getSet } from '@data/index';
import { TOME_COPY_CAP } from '@data/skills';
import type { ClassId, Item, Rarity, SetId, Skill, SkillId } from '@data/types';
import type { Rng } from '@core/rng';
import type { MetaState } from '@core/meta';
import type { Equipment } from '@core/run/equipment';

export type RewardSource = 'kill' | 'guard' | 'chest' | 'boss';

export type RewardChoice = { kind: 'tome'; skill: Skill } | { kind: 'item'; item: Item };

export interface Offer {
  source: RewardSource;
  choices: RewardChoice[];
  gold: number;
}

export interface PoolContext {
  classId: ClassId;
  /** The run's card families (the heirloom picks' sets, DECISIONS #32): only their tomes drop. */
  families: SetId[];
  meta: MetaState;
  deck: SkillId[];
  equipment: Equipment;
}

/**
 * DECISIONS #5 (amended after phone test 2): the run's tome pool is the rolled
 * set's skills plus everything discovered for this class, and tomes may repeat
 * (a second Broadsword means it comes up twice as often). The item pool is
 * every item this class can use; equipped items are removed since a slot holds one.
 */
export function buildPool(ctx: PoolContext): { tomes: Skill[]; items: Item[] } {
  const held = new Set<string>(Object.values(ctx.equipment).filter(Boolean).map((i) => i!.id));
  // Families decide the tomes (plus the always-on general tomes); equipment is still gated by discovery and class.
  const tomeIds = new Set<string>([...ctx.families.flatMap((id) => getSet(id).skills), ...SKILLS.filter((s) => s.classId === 'any' && s.rarity !== 'basic').map((s) => s.id)]);
  const copies = (id: string) => ctx.deck.filter((d) => d === id).length;
  const tomes = SKILLS.filter((s) => tomeIds.has(s.id) && s.rarity !== 'basic' && (s.classId === ctx.classId || s.classId === 'any') && copies(s.id) < TOME_COPY_CAP);
  // Rarity gating lives in the source weights (a kill almost never rolls rare), so the
  // item pool is simply everything this class can use and does not already hold.
  const items = ITEMS.filter((i) => (!i.classes || i.classes.includes(ctx.classId)) && !held.has(i.id));
  return { tomes, items };
}

/** Rarity weights by source, shifted toward rarer on screen 2 (GAME_DESIGN §5 rule 4). */
export function rarityWeights(source: RewardSource, screenIndex: number): Record<Rarity, number> {
  const base: Record<RewardSource, Record<Rarity, number>> = {
    kill: { basic: 0, common: 70, uncommon: 25, rare: 5, boss: 0 },
    guard: { basic: 0, common: 50, uncommon: 38, rare: 12, boss: 0 },
    chest: { basic: 0, common: 35, uncommon: 45, rare: 20, boss: 0 },
    boss: { basic: 0, common: 0, uncommon: 40, rare: 45, boss: 15 },
  };
  const w = { ...base[source] };
  if (screenIndex > 0) { w.common = Math.max(0, w.common - 20); w.uncommon += 5; w.rare += 15; }
  return w;
}

const CHOICE_COUNT: Record<RewardSource, number> = { kill: 2, guard: 2, chest: 3, boss: 3 };
const TOME_CHANCE: Record<RewardSource, number> = { kill: 0.35, guard: 0.4, chest: 0.4, boss: 0.5 };

export function goldFor(source: RewardSource, screenIndex: number, rng: Rng): number {
  const mult = screenIndex + 1;
  switch (source) {
    case 'kill': return rng.int(4, 8) * mult;
    case 'guard': return rng.int(8, 14) * mult;
    case 'chest': return 0; // chest gold is set by the chest's path cost
    case 'boss': return 30 * mult;
  }
}

/**
 * DECISIONS #4: kills offer 1 of 2, chests and bosses 1 of 3, plus gold.
 * Items tagged with the active set weigh double (GAME_DESIGN §5 rule 3).
 * Choices never repeat within an offer. Falls back to items when the tome pool is dry.
 */
export function rollOffer(source: RewardSource, screenIndex: number, ctx: PoolContext, rng: Rng, gold = goldFor(source, screenIndex, rng)): Offer {
  const pool = buildPool(ctx);
  const rw = rarityWeights(source, screenIndex);
  const choices: RewardChoice[] = [];
  const taken = new Set<string>();
  const weightItem = (i: Item) => (rw[i.rarity] ?? 0) * (i.tags?.some((t) => ctx.families.includes(t as SetId)) ? 2 : 1);
  const weightTome = (s: Skill) => Math.max(1, rw[s.rarity] ?? 0);

  for (let n = 0; n < CHOICE_COUNT[source]; n++) {
    const tomes = pool.tomes.filter((s) => !taken.has(s.id));
    const items = pool.items.filter((i) => !taken.has(i.id) && weightItem(i) > 0);
    const wantTome = tomes.length > 0 && (items.length === 0 || rng.chance(TOME_CHANCE[source]));
    if (wantTome) {
      const skill = rng.weighted(tomes, weightTome);
      taken.add(skill.id); choices.push({ kind: 'tome', skill });
    } else if (items.length > 0) {
      const item = rng.weighted(items, weightItem);
      taken.add(item.id); choices.push({ kind: 'item', item });
    }
  }
  return { source, choices, gold };
}

// ---------------------------------------------------------------- shop

export type ShopLine = { kind: 'item'; id: string; price: number; sold: boolean } | { kind: 'tome'; id: string; price: number; sold: boolean };

export interface ShopStock {
  lines: ShopLine[];
  healPrice: number;
  healPct: number;
  healUsed: boolean;
}

const PRICE: Record<Rarity, number> = { basic: 10, common: 20, uncommon: 35, rare: 60, boss: 90 };

export const itemPrice = (rarity: Rarity, screenIndex: number) => PRICE[rarity] * (screenIndex + 1);

/** A shelf line the player cannot take again: an equipped item, or a tome already at its copy cap. */
export function isLineOwned(line: ShopLine, deck: SkillId[], equipment: Equipment): boolean {
  if (line.kind === 'tome') return deck.filter((d) => d === line.id).length >= TOME_COPY_CAP;
  return Object.values(equipment).some((i) => i?.id === line.id);
}

/** Gold for selling a reward instead of taking it: roughly 40% of its shop price. */
export function sellValue(rarity: Rarity, screenIndex: number): number {
  return Math.round(PRICE[rarity] * 0.4) * (screenIndex + 1);
}
export const tomePrice = (rarity: Rarity, screenIndex: number) => (PRICE[rarity] + 10) * (screenIndex + 1);

/**
 * GAME_DESIGN §7: the shop sells two items and a heal; one tome joins the
 * shelf when the tome pool has anything. Stock is rolled once per screen with
 * chest-grade rarity weights, and prices scale with the screen.
 */
export function rollShopStock(screenIndex: number, ctx: PoolContext, rng: Rng): ShopStock {
  const pool = buildPool(ctx);
  const rw = rarityWeights('chest', screenIndex);
  const lines: ShopLine[] = [];
  const taken = new Set<string>();
  const items = pool.items.filter((i) => (rw[i.rarity] ?? 0) > 0);
  for (let n = 0; n < 2 && items.length > taken.size; n++) {
    const item = rng.weighted(items.filter((i) => !taken.has(i.id)), (i) => (rw[i.rarity] ?? 0) * (i.tags?.some((t) => ctx.families.includes(t as SetId)) ? 2 : 1));
    taken.add(item.id);
    lines.push({ kind: 'item', id: item.id, price: itemPrice(item.rarity, screenIndex), sold: false });
  }
  if (pool.tomes.length > 0) {
    const skill = rng.weighted(pool.tomes, (s) => Math.max(1, rw[s.rarity] ?? 0));
    lines.push({ kind: 'tome', id: skill.id, price: tomePrice(skill.rarity, screenIndex), sold: false });
  }
  return { lines, healPrice: 30 * (screenIndex + 1), healPct: 0.5, healUsed: false };
}
