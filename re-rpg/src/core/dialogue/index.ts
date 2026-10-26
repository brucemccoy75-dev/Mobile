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
  | { chance: number };

export type DEffect =
  | { flag: string; value?: boolean }
  | { relation: string; delta: number }
  | { gold: number }
  | { hp: number }
  | { tome: SkillId | 'random' }
  /** Re-arm the last cleared monster node with a bigger fight (a quest sends you back). */
  | { rearm: true }
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
}

export function holds(c: Cond, ctx: DialogueCtx): boolean {
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

/** The first entry for `trigger` whose conditions hold, or null. */
export function pickDialogue(entries: Dialogue[], trigger: string, ctx: DialogueCtx): Dialogue | null {
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
  rearm: boolean;
  fight: boolean;
  skip: boolean;
  next?: string;
}

export function resolve(effects: DEffect[]): Resolution {
  const r: Resolution = { flags: [], relations: [], gold: 0, hp: 0, tomes: [], rearm: false, fight: false, skip: false };
  for (const e of effects) {
    if ('flag' in e) r.flags.push({ flag: e.flag, value: e.value ?? true });
    else if ('relation' in e) r.relations.push(e);
    else if ('gold' in e) r.gold += e.gold;
    else if ('hp' in e) r.hp += e.hp;
    else if ('tome' in e) r.tomes.push(e.tome);
    else if ('rearm' in e) r.rearm = true;
    else if ('fight' in e) r.fight = true;
    else if ('skip' in e) r.skip = true;
    else if ('next' in e) r.next = e.next;
  }
  return r;
}

/** Fill {name}-style slots. */
export const fill = (s: string, vars: Record<string, string | number>): string => s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
