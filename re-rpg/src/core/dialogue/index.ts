import type { ClassId, SkillId } from '@data/types';
import type { Rng } from '@core/rng';

/**
 * Dialogue with options (DECISIONS #35). Pure: entries are data, conditions read a small
 * context, and effects are returned for the game layer to apply. Nothing here knows Phaser.
 *
 * Writing lives in data/dialogue.ts. Each entry answers a trigger such as `pre_fight:hex_imp`,
 * `gate:gatekeeper`, `sign:sign_1_0` or `giver:wren`; the first entry whose conditions all hold
 * wins, so put the specific variants (deaths >= 3, a flag set) before the general one.
 */
export type Cond =
  | { flag: string; is?: boolean }
  | { relation: string; min?: number; max?: number }
  | { deaths: 'screen' | 'total'; min?: number; max?: number }
  | { killedBy: string }
  | { level: { min?: number; max?: number } }
  | { gold: { min?: number } }
  | { fights: { min?: number; max?: number } }
  | { class: ClassId }
  | { chance: number }
  // The story vocabulary (DECISIONS #61):
  /** The screen this happens on (0 = screen 1). */
  | { screen: number }
  /** A world.json quest's state this run: none (never offered), offered, active, ready (can be handed in), done, declined. */
  | { quest: string; is: QuestState }
  /** A card in the deck or an item worn. */
  | { has: string }
  /** This run is (or is not) a special run (DECISIONS #58). */
  | { special: boolean }
  /** A flag remembered across runs (set by the `remember` effect). */
  | { remembered: string; is?: boolean }
  | { not: Cond }
  | { any: Cond[] };

export type QuestState = 'none' | 'offered' | 'active' | 'ready' | 'done' | 'declined';
export const QUEST_STATES: QuestState[] = ['none', 'offered', 'active', 'ready', 'done', 'declined'];

export type DEffect =
  | { flag: string; value?: boolean }
  | { relation: string; delta: number }
  | { gold: number }
  | { hp: number }
  | { tome: SkillId | 'random' }
  /**
   * Re-arm the last cleared monster node with a bigger fight (a quest sends you back). The node may
   * name the words that greet you there and a flag set when you win it (DECISIONS #61).
   */
  | { rearm: true | Rearm }
  /** Remember a flag across runs (DECISIONS #61). */
  | { remember: string }
  /** Offer a world.json quest now, at its giver (DECISIONS #61). */
  | { quest: string }
  /** A line shown as a toast. */
  | { note: string }
  | { fight: true }
  | { skip: true }
  | { next: string };

export interface DOption {
  text: string;
  when?: Cond[];
  effects: DEffect[];
  /** The option a Skip applies (defaults to the first). */
  default?: boolean;
}

export interface Dialogue {
  id: string;
  /** What asks for it: `pre_fight:<enemyId>`, `gate:<bossId>`, `sign:<id>`, `giver:<name>`, `ghost`, or a `next` target. */
  trigger: string;
  speaker: string;
  /** Texture base for the portrait (`enemy_boar`, `hero_warrior`); omitted = a plain frame. */
  portrait?: string;
  when?: Cond[];
  lines: string[];
  options: DOption[];
}

export interface Rearm { trigger?: string; winFlag?: string; }

export interface DialogueCtx {
  flags: Set<string>;
  relations: Record<string, number>;
  deathsOnScreen: number;
  deathsTotal: number;
  lastKiller?: string;
  level: number;
  classId: ClassId;
  gold: number;
  /** Fights won this run. */
  fights: number;
  rng: Rng;
  // The story vocabulary (DECISIONS #61); optional so older callers still build a context.
  screen?: number;
  quests?: Record<string, QuestState>;
  has?: (id: string) => boolean;
  special?: boolean;
  memory?: Set<string>;
}

export function holds(c: Cond, ctx: DialogueCtx): boolean {
  if ('not' in c) return !holds(c.not, ctx);
  if ('any' in c) return c.any.some((x) => holds(x, ctx));
  if ('quest' in c) return ctx.quests !== undefined && (ctx.quests[c.quest] ?? 'none') === c.is;
  if ('remembered' in c) return ctx.memory !== undefined && ctx.memory.has(c.remembered) === (c.is ?? true);
  if ('screen' in c) return ctx.screen === c.screen;
  if ('has' in c) return !!ctx.has?.(c.has);
  if ('special' in c) return ctx.special !== undefined && ctx.special === c.special;
  if ('flag' in c) return ctx.flags.has(c.flag) === (c.is ?? true);
  if ('relation' in c) { const v = ctx.relations[c.relation] ?? 0; return (c.min === undefined || v >= c.min) && (c.max === undefined || v <= c.max); }
  if ('deaths' in c) { const v = c.deaths === 'screen' ? ctx.deathsOnScreen : ctx.deathsTotal; return (c.min === undefined || v >= c.min) && (c.max === undefined || v <= c.max); }
  if ('killedBy' in c) return ctx.lastKiller === c.killedBy;
  if ('level' in c) return (c.level.min === undefined || ctx.level >= c.level.min) && (c.level.max === undefined || ctx.level <= c.level.max);
  if ('gold' in c) return c.gold.min === undefined || ctx.gold >= c.gold.min;
  if ('fights' in c) return (c.fights.min === undefined || ctx.fights >= c.fights.min) && (c.fights.max === undefined || ctx.fights <= c.fights.max);
  if ('class' in c) return ctx.classId === c.class;
  if ('chance' in c) return ctx.rng.chance(c.chance);
  return false;
}

export const allHold = (conds: Cond[] | undefined, ctx: DialogueCtx): boolean => (conds ?? []).every((c) => holds(c, ctx));

/**
 * The words for `trigger` (DECISIONS #35, #55): a conditional entry that holds wins (the boar that
 * remembers the apple); otherwise one of `defaults` (the speaker's everyday lines) at random, drawing
 * from the stream only when there is a choice; otherwise the first entry that holds; else null.
 */
export function pickDialogue(entries: Dialogue[], trigger: string, ctx: DialogueCtx, defaults: string[] = []): Dialogue | null {
  for (const d of entries) if (d.trigger === trigger && d.when?.length && !defaults.includes(d.id) && allHold(d.when, ctx)) return d;
  const pool = defaults.map((id) => entries.find((d) => d.id === id)).filter((d): d is Dialogue => !!d && allHold(d.when, ctx));
  if (pool.length) return pool.length === 1 ? pool[0]! : ctx.rng.pick(pool);
  for (const d of entries) if (d.trigger === trigger && allHold(d.when, ctx)) return d;
  return null;
}
export const byId = (entries: Dialogue[], id: string): Dialogue | null => entries.find((d) => d.id === id) ?? null;

/** Options the player may pick right now (conditions on options hide them rather than grey them). */
export const visibleOptions = (d: Dialogue, ctx: DialogueCtx): DOption[] => d.options.filter((o) => allHold(o.when, ctx));
export const defaultOption = (d: Dialogue, ctx: DialogueCtx): DOption => { const v = visibleOptions(d, ctx); return v.find((o) => o.default) ?? v[0]!; };

/** Everything an option asks the game to do, folded. */
export interface Resolution {
  flags: { flag: string; value: boolean }[];
  relations: { relation: string; delta: number }[];
  gold: number;
  hp: number;
  tomes: (SkillId | 'random')[];
  /** A re-arm and what its node says and sets, or null. */
  rearm: Rearm | null;
  remember: string[];
  quests: string[];
  notes: string[];
  fight: boolean;
  skip: boolean;
  next?: string;
}

export function resolve(effects: DEffect[]): Resolution {
  const r: Resolution = { flags: [], relations: [], gold: 0, hp: 0, tomes: [], rearm: null, remember: [], quests: [], notes: [], fight: false, skip: false };
  for (const e of effects) {
    if ('flag' in e) r.flags.push({ flag: e.flag, value: e.value ?? true });
    else if ('relation' in e) r.relations.push(e);
    else if ('gold' in e) r.gold += e.gold;
    else if ('hp' in e) r.hp += e.hp;
    else if ('tome' in e) r.tomes.push(e.tome);
    else if ('rearm' in e) r.rearm = e.rearm === true ? {} : { ...e.rearm };
    else if ('remember' in e) r.remember.push(e.remember);
    else if ('quest' in e) r.quests.push(e.quest);
    else if ('note' in e) r.notes.push(e.note);
    else if ('fight' in e) r.fight = true;
    else if ('skip' in e) r.skip = true;
    else if ('next' in e) r.next = e.next;
  }
  return r;
}

/** Fill {name}-style slots. */
export const fill = (s: string, vars: Record<string, string | number>): string => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
