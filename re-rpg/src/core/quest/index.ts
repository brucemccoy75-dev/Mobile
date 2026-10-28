import { ITEMS, enemiesOfTier, getEnemy, getItem, getSkill } from '@data/index';
import { ESCORT_NAMES, GIVERS, type GiverVoice } from '@data/quests';
import type { ClassId, SetId, SkillId } from '@data/types';
import type { Rng } from '@core/rng';
import type { NodeRule, ScreenMap, Tile } from '@core/map';
import { buildPool, type RewardSource } from '@core/loot';
import type { MetaState } from '@core/meta';
import { allHold, type Cond, type DialogueCtx } from '@core/dialogue';
import type { Equipment } from '@core/run/equipment';

export type QuestKind = 'fetch' | 'hunt' | 'escort';
export type QuestStatus = 'offered' | 'active' | 'done' | 'declined';

export interface Quest {
  id: string;
  kind: QuestKind;
  status: QuestStatus;
  /** The world.json quest it was built from (DECISIONS #57); absent on quests from the old generator. */
  defId?: string;
  /** The node it is offered and handed in at. */
  giverNode?: string;
  /** A quest id its giver offers once this one is handed in (a chain). */
  then?: string;
  /** Built from a special-run quest (DECISIONS #58). */
  special?: boolean;
  giver: { name: string; title: string; pos: Tile; intro: string; accept: string; progress: string; complete: string; decline: string };
  /** fetch: what to bring. Items must be equipped, tomes must be in the deck; the copy handed over is lost and a +1 version returns. */
  fetch?: { type: 'item' | 'tome'; id: string; name: string };
  /** hunt: enemies of this type to kill on this screen. */
  hunt?: { enemyId: string; name: string; need: number; have: number };
  /** escort: find the NPC on the map, then bring them back; threat is higher while they follow. */
  escort?: { name: string; pos: Tile; following: boolean; node?: string };
  reward: { gold: number; offer?: RewardSource; flag?: string; relation?: { name: string; delta: number }; tome?: SkillId };
}

/**
 * A quest as the world editor writes it (world.json, DECISIONS #57). `type` is one of the three
 * kinds or `rolled` (one of them at random each run, as Wren's is). Targets left unset are rolled:
 * a fetch from the live loot pool, a hunt from this screen's species (minus `avoid`), an escort's
 * name from the usual list. Rewards left unset are the standard ones for the kind. `when` gates the
 * offer, `special` keeps it for special runs, and `then` is offered by the same giver once this one
 * is handed in.
 */
export interface QuestDef {
  id: string;
  name: string;
  screen: number;
  giver: string;
  type: QuestKind | 'rolled';
  voice: GiverVoice;
  fetch?: { id?: string };
  hunt?: { enemy?: string; need?: number; avoid?: string[] };
  escort?: { node?: string; name?: string };
  reward: { gold?: number; offer?: RewardSource | 'none'; flag?: string; relation?: { name: string; delta: number }; tome?: SkillId };
  when?: Cond[];
  special?: boolean;
  then?: string;
  /** Node rules this quest pins while it is the screen's quest (DECISIONS #58), over the screen's own. */
  nodes?: Record<string, NodeRule>;
}

/** The quest a screen offers this run (#57): one of the defs for that screen whose conditions hold; special ones only on a special run. */
export function pickQuestDef(defs: QuestDef[], screen: number, ctx: DialogueCtx, special: boolean): QuestDef | null {
  const pool = defs.filter((d) => d.screen === screen && !!d.special === special && allHold(d.when, ctx));
  if (!pool.length) return null;
  return pool.length === 1 ? pool[0]! : ctx.rng.pick(pool);
}

/** Build a run's quest from its definition, on the authored map. */
export function questFromDef(def: QuestDef, map: ScreenMap, ctx: QuestContext, rng: Rng): Quest {
  const at = (id: string | undefined, fallback: Tile) => map.nodes?.find((n) => n.id === id)?.pos ?? fallback;
  const kind: QuestKind = def.type === 'rolled' ? rng.pick(['fetch', 'hunt', 'escort'] as const) : def.type;
  const voice = def.voice;
  const giver = (target: string, need = 0) => ({
    name: voice.name, title: voice.title, pos: at(def.giver, map.questGiver),
    intro: fill(voice.intro[kind], { target, need }), accept: voice.accept, progress: voice.progress, complete: voice.complete[kind], decline: voice.decline,
  });
  const mult = ctx.screenIndex + 1;
  const std = { fetch: { gold: 15 * mult }, hunt: { gold: 25 * mult, offer: 'guard' as RewardSource }, escort: { gold: 20 * mult, offer: 'chest' as RewardSource } }[kind];
  const r = def.reward;
  const reward: Quest['reward'] = { gold: r.gold ?? std.gold };
  const offer = r.offer === 'none' ? undefined : (r.offer ?? ('offer' in std ? std.offer : undefined));
  if (offer) reward.offer = offer;
  if (r.flag) reward.flag = r.flag;
  if (r.relation) reward.relation = { ...r.relation };
  if (r.tome) reward.tome = r.tome;
  const base = { id: `quest_${ctx.screenIndex}_${def.id}`, kind, status: 'offered' as QuestStatus, defId: def.id, giverNode: def.giver, ...(def.then ? { then: def.then } : {}), ...(def.special ? { special: true } : {}), reward };

  if (kind === 'fetch') {
    const pool = buildPool({ classId: ctx.classId, families: ctx.families, meta: ctx.meta, deck: ctx.deck, equipment: ctx.equipment });
    const options: { type: 'item' | 'tome'; id: string; name: string }[] = [
      ...pool.items.filter((i) => i.rarity === 'common' || i.rarity === 'uncommon').map((i) => ({ type: 'item' as const, id: i.id, name: i.name })),
      ...pool.tomes.map((t) => ({ type: 'tome' as const, id: t.id, name: t.name })),
    ];
    const named = def.fetch?.id;
    const target = named ? (ITEMS.some((i) => i.id === named) ? { type: 'item' as const, id: named, name: getItem(named).name } : { type: 'tome' as const, id: named, name: getSkill(named).name }) : rng.pick(options);
    return { ...base, giver: giver(target.name), fetch: target };
  }
  if (kind === 'hunt') {
    const tier = ctx.screenIndex === 0 ? 1 : 2;
    const avoid = def.hunt?.avoid ?? [];
    const enemyId = def.hunt?.enemy ?? rng.pick(enemiesOfTier(tier).map((e) => e.id).filter((id) => getEnemy(id).archetype !== 'boss' && !avoid.includes(id)));
    const need = def.hunt?.need ?? 2;
    return { ...base, giver: giver(getEnemy(enemyId).name, need), hunt: { enemyId, name: getEnemy(enemyId).name, need, have: 0 } };
  }
  const name = def.escort?.name ?? rng.pick(ESCORT_NAMES);
  return { ...base, giver: giver(name), escort: { name, pos: at(def.escort?.node, map.npcSpot), following: false, ...(def.escort?.node ? { node: def.escort.node } : {}) } };
}


export interface QuestContext {
  classId: ClassId;
  families: SetId[];
  meta: MetaState;
  deck: SkillId[];
  equipment: Equipment;
  screenIndex: number;
}

const fill = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));

/**
 * One quest per screen, randomised from the run's quest stream. Fetch targets
 * come from the live loot pool (so they can actually drop), hunt targets from
 * enemies present on this map, escort NPCs from a far off-road tile.
 */
export interface QuestOptions { voice?: GiverVoice; avoidHunt?: string[]; }

export function generateQuest(map: ScreenMap, ctx: QuestContext, rng: Rng, giverPos: Tile, npcPos: Tile, opts: QuestOptions = {}): Quest {
  const voice = opts.voice ?? rng.pick(GIVERS);
  const kind = rng.pick(['fetch', 'hunt', 'escort'] as const);
  const tier = ctx.screenIndex === 0 ? 1 : 2;
  const base = { id: `quest_${ctx.screenIndex}_${kind}`, kind, status: 'offered' as QuestStatus };
  const giver = (target: string, need = 0) => ({
    name: voice.name, title: voice.title, pos: giverPos,
    intro: fill(voice.intro[kind], { target, need }), accept: voice.accept, progress: voice.progress, complete: voice.complete[kind], decline: voice.decline,
  });

  if (kind === 'fetch') {
    const pool = buildPool({ classId: ctx.classId, families: ctx.families, meta: ctx.meta, deck: ctx.deck, equipment: ctx.equipment });
    const options: { type: 'item' | 'tome'; id: string; name: string }[] = [
      ...pool.items.filter((i) => i.rarity === 'common' || i.rarity === 'uncommon').map((i) => ({ type: 'item' as const, id: i.id, name: i.name })),
      ...pool.tomes.map((t) => ({ type: 'tome' as const, id: t.id, name: t.name })),
    ];
    const target = rng.pick(options);
    return { ...base, giver: giver(target.name), fetch: target, reward: { gold: 15 * (ctx.screenIndex + 1) } };
  }
  if (kind === 'hunt') {
    const present = new Set<string>([...map.guards.map((g) => g.enemyId), ...enemiesOfTier(tier).map((e) => e.id)]);
    const enemyId = rng.pick([...present].filter((id) => getEnemy(id).archetype !== 'boss' && !(opts.avoidHunt ?? []).includes(id)));
    const need = 2;
    return { ...base, giver: giver(getEnemy(enemyId).name, need), hunt: { enemyId, name: getEnemy(enemyId).name, need, have: 0 }, reward: { gold: 25 * (ctx.screenIndex + 1), offer: 'guard' } };
  }
  const name = rng.pick(ESCORT_NAMES);
  return { ...base, giver: giver(name), escort: { name, pos: npcPos, following: false }, reward: { gold: 20 * (ctx.screenIndex + 1), offer: 'chest' } };
}

/** Can this quest be handed in right now? */
export function questReady(q: Quest, deck: SkillId[], equipment: Equipment): boolean {
  if (q.status !== 'active') return false;
  if (q.fetch) return q.fetch.type === 'tome' ? deck.includes(q.fetch.id) : Object.values(equipment).some((i) => i?.id === q.fetch!.id);
  if (q.hunt) return q.hunt.have >= q.hunt.need;
  if (q.escort) return q.escort.following;
  return false;
}

/** One-line status for the map and the quest panel. */
export function questProgress(q: Quest, deck: SkillId[], equipment: Equipment): string {
  if (q.fetch) return questReady(q, deck, equipment) ? `${q.fetch.name}: carried. Return to ${q.giver.name}.` : `Find and ${q.fetch.type === 'tome' ? 'learn' : 'equip'} ${q.fetch.name}, then return.`;
  if (q.hunt) return `${q.hunt.name}: ${Math.min(q.hunt.have, q.hunt.need)} / ${q.hunt.need}${q.hunt.have >= q.hunt.need ? '. Return to ' + q.giver.name + '.' : ''}`;
  if (q.escort) return q.escort.following ? `${q.escort.name} follows you. Return to ${q.giver.name}.` : `Find ${q.escort.name} in the wilds.`;
  return '';
}

/** A kill happened: advance any active hunt that wants this enemy. Returns true if progress changed. */
export function noteKill(quests: Quest[], enemyId: string): boolean {
  let changed = false;
  for (const q of quests) if (q.status === 'active' && q.hunt && q.hunt.enemyId === enemyId && q.hunt.have < q.hunt.need) { q.hunt.have += 1; changed = true; }
  return changed;
}

