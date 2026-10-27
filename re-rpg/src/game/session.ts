// The live run object the scenes share, plus (de)serialisation to the
// RunState that SaveStore persists. Pure rules live in core/run, core/loot, core/meta.
import type Phaser from 'phaser';
import { enemiesOfTier, familyOf, getClass, getSet, getSkill } from '@data/index';
import type { ClassId, Enemy, EnemyId, Item, SetId, Skill, SkillId, Stats } from '@data/types';
import { RunRng, newSeed } from '@core/rng';
import { key, parseScreen, type MapNode, type ScreenMap, type Tile, type TileType } from '@core/map';
import { SCREEN1 } from '@data/maps/screen1';
import { SCREEN2 } from '@data/maps/screen2';
import { DECK_CAP } from '@core/combat';
import { DUO_CHANCE, PAIRS } from '@data/packs';
import { TOME_COPY_CAP } from '@data/skills';
import { computeStats, emptyEquipment, equip as equipItem, equipmentFromIds, equipmentToIds, type Equipment, RUN_VERSION, type RunState } from '@core/run';
import { createMeta, discoverItem, discoverSkill, rollHeirloomChoices, unlockedSets, type Heirloom, type MetaState } from '@core/meta';
import { LUCK_RARE_WEIGHT, buildPool, rollShopStock, type RewardChoice, type RewardSource, type ShopStock } from '@core/loot';
import { LEVEL_GOLD, LEVEL_HP, LEVEL_RARE_CHANCE } from '@data/progression';
import { generateQuest, questReady, type Quest, type QuestOptions } from '@core/quest';
import { WREN } from '@data/quests';
import { upgradeItem, upgradeSkill, type SkillUpgrades } from '@core/run/upgrade';
import type { SaveStore } from '@save/SaveStore';

export const SCREEN_COUNT = 2;

export type EncounterKind = 'random' | 'guard' | 'boss' | 'node';
/** `tile` is where the fight started; the combat backdrop is chosen from it (docs/ART.md). */
export interface PendingEncounter { kind: EncounterKind; enemyId: EnemyId; guardId?: string; /** Authored map node (kind 'node'). */ nodeId?: string; tile?: TileType; /** Further enemies behind the first (duos, DECISIONS #29). */ extra?: EnemyId[]; /** Full definitions when the fight holds enemies that are not in the roster (a ghost, a boss variant; DECISIONS #36). Front first; overrides enemyId/extra for the engine. */ custom?: Enemy[]; /** Set when your ghost is in this fight. */ ghost?: boolean; }
export interface CombatResult { encounter: PendingEncounter; won: boolean; }
export interface PendingOffer { source: RewardSource; gold?: number; }

export interface RunSession {
  seed: string;
  rng: RunRng;
  classId: ClassId;
  /** Primary family (the first heirloom pick); kept for labels and telemetry. */
  setId: SetId;
  /** Families whose tomes drop this run: the heirloom picks' sets (DECISIONS #32). */
  families: SetId[];
  base: Stats;
  stats: Stats;
  hp: number;
  gold: number;
  deck: SkillId[];
  equipment: Equipment;

  screenIndex: number;
  map: ScreenMap;
  playerPos: Tile;
  threat: number;
  openedPois: Set<string>;
  usedShrines: Set<string>;
  defeatedGuards: Set<string>;
  /** Node overworld (DECISIONS #37): nodes whose task is done, and the last monster node cleared (quests re-arm it). */
  clearedNodes: Set<string>;
  lastClearedNode: string | null;
  /** Run-scoped story flags set by dialogue options (DECISIONS #35). */
  flags: Set<string>;
  bossDefeated: boolean;
  encountersWon: number;
  newDiscoveries: string[];
  heirloomName: string | null;
  shop: ShopStock;
  quests: Quest[];
  skillUpgrades: SkillUpgrades;
  customItems: Item[];

  pendingEncounter: PendingEncounter | null;
  lastResult: CombatResult | null;
  pendingOffer: PendingOffer | null;
  /** Heirloom spread to pick from before the run starts; empty once chosen. */
  heirloomChoices: Heirloom[];
  /** Test Mode sandbox: never saved, logged or counted. */
  testMode?: boolean;
}

export type Store = SaveStore<MetaState, RunState>;

// ---------------------------------------------------------------- registry access

export const getSession = (scene: Phaser.Scene): RunSession => {
  const s = scene.registry.get('session') as RunSession | undefined;
  if (!s) throw new Error('No run session');
  return s;
};
export const peekSession = (scene: Phaser.Scene): RunSession | null => (scene.registry.get('session') as RunSession | undefined) ?? null;
export const setSession = (scene: Phaser.Scene, s: RunSession | null) => scene.registry.set('session', s);
export const getMeta = (scene: Phaser.Scene): MetaState => (scene.registry.get('meta') as MetaState | undefined) ?? createMeta();
export const setMeta = (scene: Phaser.Scene, m: MetaState) => scene.registry.set('meta', m);
export const getStore = (scene: Phaser.Scene): Store => scene.registry.get('store') as Store;

export async function persistRun(scene: Phaser.Scene): Promise<void> {
  const s = peekSession(scene);
  if (s && !s.testMode) await getStore(scene).saveRun(serialize(s));
}
export async function persistMeta(scene: Phaser.Scene): Promise<void> {
  await getStore(scene).saveMeta(getMeta(scene));
}

// ---------------------------------------------------------------- creation & screens

export function rollSet(classId: ClassId, rng: RunRng): SetId {
  return rng.stream('meta').pick(getClass(classId).sets);
}

/** Class base plus permanent Legacy bonuses (DECISIONS #18). */
export function baseStatsFor(classId: ClassId, meta: MetaState): Stats {
  const c = getClass(classId).stats;
  // Each level past the first is LEVEL_HP max HP for good (DECISIONS #49).
  const levelHp = ((meta.progress[classId]?.level ?? 1) - 1) * LEVEL_HP;
  return { maxHp: c.maxHp + meta.legacy.maxHp + levelHp, atk: c.atk + meta.legacy.atk, def: c.def + meta.legacy.def, luck: c.luck ?? 0 };
}

export { LEVEL_GOLD };
export type LevelReward = { kind: 'tome'; id: SkillId } | { kind: 'gold'; amount: number };

/**
 * Levels gained mid-run (DECISIONS #49): each one adds its max HP to this run at once (and the
 * HP itself), then rolls a rare card from the run's families into the deck, or gold when the roll
 * misses, no rare card is left in the pool, or the deck is full.
 */
export function applyLevelUp(s: RunSession, meta: MetaState, levels: number, roll: () => number = () => s.rng.stream('level').next()): LevelReward[] {
  const out: LevelReward[] = [];
  for (let i = 0; i < levels; i++) {
    s.base.maxHp += LEVEL_HP;
    s.stats = computeStats(s.base, s.equipment);
    s.hp = Math.min(s.stats.maxHp, s.hp + LEVEL_HP);
    const rares = buildPool(poolCtx(s, meta)).tomes.filter((t) => t.rarity === 'rare');
    // Luck adds its 1.2% per point to the rare chance (DECISIONS #50).
    if (roll() < LEVEL_RARE_CHANCE + (s.stats.luck ?? 0) * LUCK_RARE_WEIGHT / 100 && rares.length && s.deck.length < DECK_CAP) {
      const pick = rares[Math.min(rares.length - 1, Math.floor(roll() * rares.length))]!;
      applyTome(s, pick);
      discoverSkill(meta, pick.id);
      out.push({ kind: 'tome', id: pick.id });
    } else {
      s.gold += LEVEL_GOLD;
      out.push({ kind: 'gold', amount: LEVEL_GOLD });
    }
  }
  return out;
}

export function createSession(classId: ClassId, meta: MetaState, seed = newSeed()): RunSession {
  const rng = new RunRng(seed);
  const setId = rollSet(classId, rng);
  const base = baseStatsFor(classId, meta);
  const s: RunSession = {
    seed, rng, classId, setId, families: unlockedSets(meta, classId), base: { ...base }, stats: { ...base }, hp: base.maxHp, gold: 0,
    deck: [], equipment: emptyEquipment(),
    screenIndex: 0, map: undefined as unknown as ScreenMap, playerPos: { x: 0, y: 0 }, threat: 0,
    openedPois: new Set(), usedShrines: new Set(), defeatedGuards: new Set(), clearedNodes: new Set(), lastClearedNode: null, flags: new Set(), bossDefeated: false, encountersWon: 0,
    newDiscoveries: [], heirloomName: null, shop: { lines: [], healPrice: 0, healPct: 0.5, healUsed: true }, quests: [], skillUpgrades: {}, customItems: [],
    pendingEncounter: null, lastResult: null, pendingOffer: null, heirloomChoices: [],
  };
  s.heirloomChoices = rollHeirloomChoices(meta, classId, rng.stream('meta'));
  startScreen(s, 0, meta);
  return s;
}

/**
 * Apply the heirloom picks (DECISIONS #32): tomes join the deck, and their families become the run's
 * tome pool. With no picks the pool stays every unlocked family.
 */
export function applyHeirlooms(s: RunSession, picks: Heirloom[], meta?: MetaState): void {
  const names: string[] = [];
  const fams: SetId[] = [];
  for (const h of picks) {
    if (h.kind === 'tome') {
      if (s.deck.length < DECK_CAP && s.deck.filter((d) => d === h.skill.id).length < TOME_COPY_CAP) s.deck.push(h.skill.id);
      names.push(h.skill.name);
      const fam = familyOf(s.classId, h.skill.id)?.id;
      if (fam && !fams.includes(fam)) fams.push(fam);
    } else { applyEquip(s, h.item); names.push(h.item.name); }
  }
  if (fams.length) { s.families = fams; s.setId = fams[0]!; }
  s.heirloomName = names.length ? names.join(' + ') : null;
  s.heirloomChoices = [];
  // The shop and quest were rolled before the picks; re-roll so they draw from the run's families.
  s.shop = rollShopStock(s.screenIndex, poolCtx(s, meta), s.rng.stream('loot'));
  s.quests = [...s.quests.filter((q) => !q.id.startsWith(`quest_${s.screenIndex}_`)), generateQuest(s.map, { ...poolCtx(s, meta), screenIndex: s.screenIndex }, s.rng.stream('quest'), s.map.questGiver, s.map.npcSpot, questOptions(s))];
}

/**
 * A family bought on the skill tree during a run joins the run at once (its tomes drop from the
 * next reward on; the shop keeps its stock until the next screen). The heirloom rule "only the
 * picks' families drop" still holds for what the run started with.
 */
export function adoptFamily(s: RunSession, setId: SetId): boolean {
  if (s.families.includes(setId)) return false;
  s.families.push(setId);
  if (s.families.length === 1) s.setId = setId;
  return true;
}

/** Screen 1's authored giver is Wren, who would never ask you to hunt her rats (DECISIONS #35). */
const questOptions = (s: RunSession): QuestOptions => (s.map.authored && s.screenIndex === 0 ? { voice: WREN, avoidHunt: ['rat_pack'] } : {});

/** Loot/quest context for this run: class, families, what is held. */
export const poolCtx = (s: RunSession, meta?: MetaState) => ({ classId: s.classId, families: s.families, meta: meta ?? createMeta(), deck: s.deck, equipment: s.equipment, luck: s.stats.luck ?? 0 });

/** Generate screen `index`, stock its shop, and put the player at its entry. */
export function startScreen(s: RunSession, index: number, meta?: MetaState): void {
  s.screenIndex = index;
  s.map = parseScreen(index === 0 ? SCREEN1 : SCREEN2, s.rng.stream('map'), { seed: s.seed, screenIndex: index });
  s.playerPos = { ...s.map.entry };
  s.threat = 0;
  s.openedPois = new Set();
  s.usedShrines = new Set();
  s.defeatedGuards = new Set();
  s.clearedNodes = new Set();
  s.lastClearedNode = null;
  s.bossDefeated = false;
  s.shop = rollShopStock(index, poolCtx(s, meta), s.rng.stream('loot'));
  // One randomised quest per screen (DECISIONS #19). Earlier screens' quests are kept for the run summary.
  s.quests = [...s.quests.filter((q) => !q.id.startsWith(`quest_${index}_`)), generateQuest(s.map, { ...poolCtx(s, meta), screenIndex: index }, s.rng.stream('quest'), s.map.questGiver, s.map.npcSpot, questOptions(s))];
}

export const currentQuest = (s: RunSession): Quest | undefined => s.quests.find((q) => q.id.startsWith(`quest_${s.screenIndex}_`));
export const isEscorting = (s: RunSession): boolean => s.quests.some((q) => q.status === 'active' && q.escort?.following);

/**
 * Hand a quest in. Fetch: the carried copy is lost and a +1 version takes its
 * place (this run only). Hunt / escort: gold now and an offer the caller opens.
 */
export function turnInQuest(s: RunSession, q: Quest): { gold: number; offer?: RewardSource; upgraded?: string } {
  if (!questReady(q, s.deck, s.equipment)) throw new Error('Quest not ready');
  q.status = 'done';
  s.gold += q.reward.gold;
  if (q.fetch) {
    if (q.fetch.type === 'tome') {
      s.skillUpgrades[q.fetch.id] = (s.skillUpgrades[q.fetch.id] ?? 0) + 1;
      return { gold: q.reward.gold, upgraded: upgradeSkill(getSkill(q.fetch.id), s.skillUpgrades[q.fetch.id]!).name };
    }
    const slot = (Object.keys(s.equipment) as (keyof Equipment)[]).find((k) => s.equipment[k]?.id === q.fetch!.id)!;
    const better = upgradeItem(s.equipment[slot]!);
    s.customItems.push(better);
    applyEquip(s, better);
    return { gold: q.reward.gold, upgraded: better.name };
  }
  return { gold: q.reward.gold, offer: q.reward.offer };
}

export const screenTier = (s: RunSession): 1 | 2 => (s.screenIndex === 0 ? 1 : 2);

// ---------------------------------------------------------------- node overworld (DECISIONS #37)

export const nodeById = (s: RunSession, id: string): MapNode => { const n = s.map.nodes?.find((x) => x.id === id); if (!n) throw new Error(`No node ${id}`); return n; };
export const nodeAt = (s: RunSession, t: Tile): MapNode | undefined => s.map.nodes?.find((n) => key(n.pos) === key(t));
/** The node the hero stands on (always one: travel ends on nodes). */
export const currentNode = (s: RunSession): MapNode => { const n = nodeAt(s, s.playerPos); if (!n) throw new Error('Hero is off the network'); return n; };
/** A node's task is done: entered and resolved (fight won, chest opened, chat had). Travel may pass through it. */
export const isCleared = (s: RunSession, n: MapNode): boolean => s.clearedNodes.has(n.id);

/**
 * Nodes you can travel to now: anything linked through cleared nodes. The destination itself need
 * not be cleared (that is how you reach a fight), but nothing beyond an uncleared node is open.
 */
export function routeTo(s: RunSession, targetId: string): MapNode[] | null {
  const from = currentNode(s);
  const prev = new Map<string, string | null>([[from.id, null]]);
  const q = [from];
  for (let qi = 0; qi < q.length; qi++) {
    const n = q[qi]!;
    if (n.id === targetId) break;
    if (n.id !== from.id && !isCleared(s, n)) continue; // cannot pass through
    for (const l of n.links) if (!prev.has(l)) { prev.set(l, n.id); q.push(nodeById(s, l)); }
  }
  if (!prev.has(targetId)) return null;
  const out: MapNode[] = [];
  for (let id: string | null = targetId; id && id !== from.id; id = prev.get(id) ?? null) out.unshift(nodeById(s, id));
  return out;
}
export const reachableNodes = (s: RunSession): MapNode[] => (s.map.nodes ?? []).filter((n) => n.id !== currentNode(s).id && routeTo(s, n.id) !== null);

export const isFightNode = (n: MapNode): boolean => n.kind === 'monster' || n.kind === 'unknown' || n.kind === 'elite' || n.kind === 'boss';

/** The fight waiting at a node. */
export function nodeEncounter(s: RunSession, node: MapNode): PendingEncounter {
  if (node.kind === 'boss') return { kind: 'boss', enemyId: node.enemyId ?? s.map.bossId, nodeId: node.id };
  return { kind: 'node', enemyId: node.enemyId!, nodeId: node.id, extra: node.extra ? [...node.extra] : undefined };
}

/** A quest sends you back: the last cleared monster node gets a fresh fight, one head bigger than before. */
export function rearmLastFight(s: RunSession): MapNode | null {
  const id = s.lastClearedNode;
  if (!id) return null;
  const n = nodeById(s, id);
  if (!isFightNode(n) || n.kind === 'boss') return null;
  s.clearedNodes.delete(n.id);
  n.seen = true;
  if (!n.extra?.length) {
    const pair = PAIRS[screenTier(s)].find(([front]) => front === n.enemyId) ?? s.rng.stream('encounter').pick(PAIRS[screenTier(s)]);
    n.enemyId = pair[0]; n.extra = [pair[1]];
  }
  s.flags.add('rearmed');
  return n;
}

/** Treasure at a node, scaled by how far it sits from the start along the network. */
export function treasureGold(s: RunSession, node: MapNode): number {
  const hops = routeTo(s, node.id)?.length ?? 2;
  return 10 + (4 + Math.min(hops, 6) * 2) * (s.screenIndex + 1) + s.rng.stream('loot').int(0, 6);
}
export const randomEnemy = (s: RunSession): EnemyId => s.rng.stream('encounter').pick(enemiesOfTier(screenTier(s))).id;

/** A wild encounter: a single enemy, or one of the screen's authored pairs (DECISIONS #29). */
export function rollEncounter(s: RunSession): PendingEncounter {
  const rng = s.rng.stream('encounter');
  const tier = screenTier(s);
  if (rng.chance(DUO_CHANCE[s.screenIndex] ?? DUO_CHANCE[DUO_CHANCE.length - 1]!)) {
    const [front, rear] = rng.pick(PAIRS[tier]);
    return { kind: 'random', enemyId: front, extra: [rear] };
  }
  return { kind: 'random', enemyId: rng.pick(enemiesOfTier(tier)).id };
}

// ---------------------------------------------------------------- taking rewards

export function applyEquip(s: RunSession, item: Item): Item | null {
  const r = equipItem(s.base, s.equipment, s.hp, item);
  s.equipment = r.equipment; s.hp = r.hp; s.stats = computeStats(s.base, s.equipment);
  return r.replaced;
}

/** Add a tome; at the deck cap the caller must pass the card to replace. */
export function applyTome(s: RunSession, skill: Skill, replaceId?: SkillId): void {
  if (s.deck.length >= DECK_CAP) {
    if (!replaceId) throw new Error('Deck full: a replacement is required');
    const i = s.deck.indexOf(replaceId);
    if (i < 0) throw new Error(`Not in deck: ${replaceId}`);
    s.deck[i] = skill.id;
  } else {
    s.deck.push(skill.id);
  }
}

/** Take a reward choice, record the discovery, and report whether it was new. */
export function takeChoice(s: RunSession, meta: MetaState, choice: RewardChoice, replaceSkillId?: SkillId): { isNew: boolean; replaced: Item | Skill | null } {
  if (choice.kind === 'tome') {
    const replaced = replaceSkillId ? getSkill(replaceSkillId) : null;
    applyTome(s, choice.skill, replaceSkillId);
    const isNew = discoverSkill(meta, choice.skill.id);
    if (isNew) s.newDiscoveries.push(choice.skill.id);
    return { isNew, replaced };
  }
  const replaced = applyEquip(s, choice.item);
  const isNew = discoverItem(meta, choice.item.id);
  if (isNew) s.newDiscoveries.push(choice.item.id);
  return { isNew, replaced };
}

/** The run's families for display; a run with none (a level-1 warrior, DECISIONS #41) is on basics and general tomes. */
export const setName = (s: RunSession) => (s.families.length ? s.families.map((id) => getSet(id).name).join(' + ') : 'basics only');

/** After a fight: fleeting tomes that were played leave the deck for good. Returns their names. */
export function spendConsumedTomes(s: RunSession, consumed: SkillId[]): string[] {
  const names: string[] = [];
  for (const id of consumed) {
    const i = s.deck.indexOf(id);
    if (i >= 0) { s.deck.splice(i, 1); names.push(getSkill(id).name); }
  }
  return names;
}

// ---------------------------------------------------------------- (de)serialisation

export function serialize(s: RunSession): RunState {
  return {
    version: RUN_VERSION, updatedAt: Date.now(),
    seed: s.seed, rngStates: s.rng.snapshot(), classId: s.classId, setId: s.setId, families: [...s.families], base: { ...s.base },
    hp: s.hp, gold: s.gold, deck: [...s.deck], equipment: equipmentToIds(s.equipment),
    screenIndex: s.screenIndex, map: s.map, playerPos: { ...s.playerPos }, threat: s.threat,
    openedPois: [...s.openedPois], usedShrines: [...s.usedShrines], defeatedGuards: [...s.defeatedGuards],
    clearedNodes: [...s.clearedNodes], lastClearedNode: s.lastClearedNode, flags: [...s.flags],
    bossDefeated: s.bossDefeated, encountersWon: s.encountersWon, newDiscoveries: [...s.newDiscoveries], heirloomName: s.heirloomName,
    shop: JSON.parse(JSON.stringify(s.shop)) as ShopStock,
    quests: JSON.parse(JSON.stringify(s.quests)) as Quest[], skillUpgrades: { ...s.skillUpgrades }, customItems: JSON.parse(JSON.stringify(s.customItems)) as Item[],
  };
}

export function deserialize(st: RunState, meta: MetaState): RunSession {
  const rng = new RunRng(st.seed);
  rng.restore(st.rngStates);
  const base = st.base ?? baseStatsFor(st.classId, meta);
  const equipment = equipmentFromIds(st.equipment, st.customItems ?? []);
  return {
    seed: st.seed, rng, classId: st.classId, setId: st.setId, families: st.families ?? [st.setId], base, stats: computeStats(base, equipment),
    hp: st.hp, gold: st.gold, deck: [...st.deck], equipment,
    screenIndex: st.screenIndex, map: st.map, playerPos: { ...st.playerPos }, threat: st.threat,
    openedPois: new Set(st.openedPois), usedShrines: new Set(st.usedShrines), defeatedGuards: new Set(st.defeatedGuards),
    clearedNodes: new Set(st.clearedNodes ?? []), lastClearedNode: st.lastClearedNode ?? null, flags: new Set(st.flags ?? []),
    bossDefeated: st.bossDefeated, encountersWon: st.encountersWon, newDiscoveries: [...st.newDiscoveries], heirloomName: st.heirloomName,
    shop: st.shop, quests: st.quests ?? [], skillUpgrades: st.skillUpgrades ?? {}, customItems: st.customItems ?? [],
    pendingEncounter: null, lastResult: null, pendingOffer: null, heirloomChoices: [],
  };
}
