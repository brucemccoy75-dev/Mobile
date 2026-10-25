// The serialisable run. Everything needed to resume mid-run after the app is
// closed: seed + RNG stream states, class/set, HP, gold, deck, equipment,
// the current screen map and the player's progress on it.
import { getItem } from '@data/index';
import type { ClassId, SetId, SkillId, Slot, Stats } from '@data/types';
import type { ScreenMap, Tile } from '@core/map';
import type { Equipment } from './equipment';
import type { ShopStock } from '@core/loot';
import type { Versioned } from '@save/SaveStore';

export const RUN_VERSION = 2;

export interface RunState extends Versioned {
  seed: string;
  rngStates: Record<string, number>;
  classId: ClassId;
  setId: SetId;
  /** Class base plus Legacy at run start, so a later allocation never changes a run in progress. */
  base?: Stats;
  hp: number;
  gold: number;
  deck: SkillId[];
  equipment: Record<Slot, string | null>;
  screenIndex: number;
  map: ScreenMap;
  playerPos: Tile;
  threat: number;
  openedPois: string[];
  usedShrines: string[];
  defeatedGuards: string[];
  bossDefeated: boolean;
  encountersWon: number;
  /** Ids discovered during this run, for the end-of-run summary. */
  newDiscoveries: string[];
  heirloomName: string | null;
  shop: ShopStock;
}

export const equipmentToIds = (eq: Equipment): Record<Slot, string | null> => ({ body: eq.body?.id ?? null, weapon: eq.weapon?.id ?? null, relic: eq.relic?.id ?? null });
export const equipmentFromIds = (ids: Record<Slot, string | null>): Equipment => ({ body: ids.body ? getItem(ids.body) : null, weapon: ids.weapon ? getItem(ids.weapon) : null, relic: ids.relic ? getItem(ids.relic) : null });
