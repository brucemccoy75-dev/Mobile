import { enemiesOfTier, getEnemy } from '@data/index';
import { ESCORT_NAMES, GIVERS } from '@data/quests';
import type { ClassId, SetId, SkillId } from '@data/types';
import type { Rng } from '@core/rng';
import type { ScreenMap, Tile } from '@core/map';
import { buildPool, type RewardSource } from '@core/loot';
import type { MetaState } from '@core/meta';
import type { Equipment } from '@core/run/equipment';

export type QuestKind = 'fetch' | 'hunt' | 'escort';
export type QuestStatus = 'offered' | 'active' | 'done' | 'declined';

export interface Quest {
  id: string;
  kind: QuestKind;
  status: QuestStatus;
  giver: { name: string; title: string; pos: Tile; intro: string; accept: string; progress: string; complete: string; decline: string };
  /** fetch: what to bring. Items must be equipped, tomes must be in the deck; the copy handed over is lost and a +1 version returns. */
  fetch?: { type: 'item' | 'tome'; id: string; name: string };
  /** hunt: enemies of this type to kill on this screen. */
  hunt?: { enemyId: string; name: string; need: number; have: number };
  /** escort: find the NPC on the map, then bring them back; threat is higher while they follow. */
  escort?: { name: string; pos: Tile; following: boolean };
  reward: { gold: number; offer?: RewardSource };
}

export const ESCORT_THREAT_MULT = 1.25;

export interface QuestContext {
  classId: ClassId;
  setId: SetId;
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
export function generateQuest(map: ScreenMap, ctx: QuestContext, rng: Rng, giverPos: Tile, npcPos: Tile): Quest {
  const voice = rng.pick(GIVERS);
  const kind = rng.pick(['fetch', 'hunt', 'escort'] as const);
  const tier = ctx.screenIndex === 0 ? 1 : 2;
  const base = { id: `quest_${ctx.screenIndex}_${kind}`, kind, status: 'offered' as QuestStatus };
  const giver = (target: string, need = 0) => ({
    name: voice.name, title: voice.title, pos: giverPos,
    intro: fill(voice.intro[kind], { target, need }), accept: voice.accept, progress: voice.progress, complete: voice.complete[kind], decline: voice.decline,
  });

  if (kind === 'fetch') {
    const pool = buildPool({ classId: ctx.classId, setId: ctx.setId, meta: ctx.meta, deck: ctx.deck, equipment: ctx.equipment });
    const options: { type: 'item' | 'tome'; id: string; name: string }[] = [
      ...pool.items.filter((i) => i.rarity === 'common' || i.rarity === 'uncommon').map((i) => ({ type: 'item' as const, id: i.id, name: i.name })),
      ...pool.tomes.map((t) => ({ type: 'tome' as const, id: t.id, name: t.name })),
    ];
    const target = rng.pick(options);
    return { ...base, giver: giver(target.name), fetch: target, reward: { gold: 15 * (ctx.screenIndex + 1) } };
  }
  if (kind === 'hunt') {
    const present = new Set<string>([...map.guards.map((g) => g.enemyId), ...enemiesOfTier(tier).map((e) => e.id)]);
    const enemyId = rng.pick([...present].filter((id) => getEnemy(id).archetype !== 'boss'));
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

