// The live run object the scenes share, plus (de)serialisation to the
// RunState that SaveStore persists. Pure rules live in core/run, core/loot, core/meta.
import type Phaser from 'phaser';
import { enemiesOfTier, getClass, getSet, getSkill } from '@data/index';
import type { ClassId, EnemyId, Item, SetId, Skill, SkillId, Stats } from '@data/types';
import { RunRng, newSeed } from '@core/rng';
import { generateScreen, type ScreenMap, type Tile } from '@core/map';
import { DECK_CAP } from '@core/combat';
import { computeStats, emptyEquipment, equip as equipItem, equipmentFromIds, equipmentToIds, type Equipment, RUN_VERSION, type RunState } from '@core/run';
import { createMeta, discoverItem, discoverSkill, rollHeirloomChoices, type Heirloom, type MetaState } from '@core/meta';
import { rollShopStock, type RewardChoice, type RewardSource, type ShopStock } from '@core/loot';
import type { SaveStore } from '@save/SaveStore';

export const SCREEN_COUNT = 2;

export type EncounterKind = 'random' | 'guard' | 'boss';
export interface PendingEncounter { kind: EncounterKind; enemyId: EnemyId; guardId?: string; }
export interface CombatResult { encounter: PendingEncounter; won: boolean; }
export interface PendingOffer { source: RewardSource; gold?: number; }

export interface RunSession {
  seed: string;
  rng: RunRng;
  classId: ClassId;
  setId: SetId;
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
  bossDefeated: boolean;
  encountersWon: number;
  newDiscoveries: string[];
  heirloomName: string | null;
  shop: ShopStock;

  pendingEncounter: PendingEncounter | null;
  lastResult: CombatResult | null;
  pendingOffer: PendingOffer | null;
  /** Heirloom spread to pick from before the run starts; empty once chosen. */
  heirloomChoices: Heirloom[];
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
  if (s) await getStore(scene).saveRun(serialize(s));
}
export async function persistMeta(scene: Phaser.Scene): Promise<void> {
  await getStore(scene).saveMeta(getMeta(scene));
}

// ---------------------------------------------------------------- creation & screens

export function rollSet(classId: ClassId, rng: RunRng): SetId {
  return rng.stream('meta').pick(getClass(classId).sets);
}

export function createSession(classId: ClassId, meta: MetaState, seed = newSeed()): RunSession {
  const rng = new RunRng(seed);
  const setId = rollSet(classId, rng);
  const cls = getClass(classId);
  const s: RunSession = {
    seed, rng, classId, setId, base: { ...cls.stats }, stats: { ...cls.stats }, hp: cls.stats.maxHp, gold: 0,
    deck: [], equipment: emptyEquipment(),
    screenIndex: 0, map: undefined as unknown as ScreenMap, playerPos: { x: 0, y: 0 }, threat: 0,
    openedPois: new Set(), usedShrines: new Set(), defeatedGuards: new Set(), bossDefeated: false, encountersWon: 0,
    newDiscoveries: [], heirloomName: null, shop: { lines: [], healPrice: 0, healPct: 0.5, healUsed: true },
    pendingEncounter: null, lastResult: null, pendingOffer: null, heirloomChoices: [],
  };
  s.heirloomChoices = rollHeirloomChoices(meta, classId, setId, rng.stream('meta'));
  startScreen(s, 0, meta);
  return s;
}

/** Apply the chosen heirlooms (DECISIONS #6): items equip, tomes join the deck (copies allowed). */
export function applyHeirlooms(s: RunSession, picks: Heirloom[]): void {
  const names: string[] = [];
  for (const h of picks) {
    if (h.kind === 'tome') { if (s.deck.length < DECK_CAP) s.deck.push(h.skill.id); names.push(h.skill.name); }
    else { applyEquip(s, h.item); names.push(h.item.name); }
  }
  s.heirloomName = names.length ? names.join(' + ') : null;
  s.heirloomChoices = [];
  // The shop was stocked before the picks; re-roll so it reflects what is now equipped.
  s.shop = rollShopStock(s.screenIndex, { classId: s.classId, setId: s.setId, meta: createMeta(), deck: s.deck, equipment: s.equipment }, s.rng.stream('loot'));
}

/** Generate screen `index`, stock its shop, and put the player at its entry. */
export function startScreen(s: RunSession, index: number, meta?: MetaState): void {
  s.screenIndex = index;
  s.map = generateScreen(s.rng.stream('map'), { seed: s.seed, screenIndex: index });
  s.playerPos = { ...s.map.entry };
  s.threat = 0;
  s.openedPois = new Set();
  s.usedShrines = new Set();
  s.defeatedGuards = new Set();
  s.bossDefeated = false;
  s.shop = rollShopStock(index, { classId: s.classId, setId: s.setId, meta: meta ?? createMeta(), deck: s.deck, equipment: s.equipment }, s.rng.stream('loot'));
}

export const screenTier = (s: RunSession): 1 | 2 => (s.screenIndex === 0 ? 1 : 2);
export const randomEnemy = (s: RunSession): EnemyId => s.rng.stream('encounter').pick(enemiesOfTier(screenTier(s))).id;

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

export const setName = (s: RunSession) => getSet(s.setId).name;

// ---------------------------------------------------------------- (de)serialisation

export function serialize(s: RunSession): RunState {
  return {
    version: RUN_VERSION, updatedAt: Date.now(),
    seed: s.seed, rngStates: s.rng.snapshot(), classId: s.classId, setId: s.setId,
    hp: s.hp, gold: s.gold, deck: [...s.deck], equipment: equipmentToIds(s.equipment),
    screenIndex: s.screenIndex, map: s.map, playerPos: { ...s.playerPos }, threat: s.threat,
    openedPois: [...s.openedPois], usedShrines: [...s.usedShrines], defeatedGuards: [...s.defeatedGuards],
    bossDefeated: s.bossDefeated, encountersWon: s.encountersWon, newDiscoveries: [...s.newDiscoveries], heirloomName: s.heirloomName,
    shop: JSON.parse(JSON.stringify(s.shop)) as ShopStock,
  };
}

export function deserialize(st: RunState): RunSession {
  const rng = new RunRng(st.seed);
  rng.restore(st.rngStates);
  const base = { ...getClass(st.classId).stats };
  const equipment = equipmentFromIds(st.equipment);
  return {
    seed: st.seed, rng, classId: st.classId, setId: st.setId, base, stats: computeStats(base, equipment),
    hp: st.hp, gold: st.gold, deck: [...st.deck], equipment,
    screenIndex: st.screenIndex, map: st.map, playerPos: { ...st.playerPos }, threat: st.threat,
    openedPois: new Set(st.openedPois), usedShrines: new Set(st.usedShrines), defeatedGuards: new Set(st.defeatedGuards),
    bossDefeated: st.bossDefeated, encountersWon: st.encountersWon, newDiscoveries: [...st.newDiscoveries], heirloomName: st.heirloomName,
    shop: st.shop,
    pendingEncounter: null, lastResult: null, pendingOffer: null, heirloomChoices: [],
  };
}
