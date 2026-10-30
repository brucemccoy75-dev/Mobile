// The serialisable run. Everything needed to resume mid-run after the app is
// closed: seed + RNG stream states, class/set, HP, gold, deck, equipment,
// the current screen map and the player's progress on it.
import type { ClassId, SetId, SkillId, Slot, Stats } from '@data/types';
import type { ScreenMap, Tile } from '@core/map';
import type { Equipment } from './equipment';
import type { ShopStock } from '@core/loot';
import type { Quest } from '@core/quest';
import type { Item } from '@data/types';
import type { SkillUpgrades } from './upgrade';
import { resolveItem } from './upgrade';
import type { Versioned } from '@save/SaveStore';

export const RUN_VERSION = 4;

export interface RunState extends Versioned {
  seed: string;
  rngStates: Record<string, number>;
  /** A special run (DECISIONS #58); absent in older saves. */
  special?: boolean;
  classId: ClassId;
  setId: SetId;
  /** The run's card families (heirloom picks, DECISIONS #32). Older saves fall back to [setId]. */
  families?: SetId[];
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
  /** Node overworld (DECISIONS #37). */
  clearedNodes?: string[];
  lastClearedNode?: string | null;
  flags?: string[];
  bossDefeated: boolean;
  encountersWon: number;
  /** Ids discovered during this run, for the end-of-run summary. */
  newDiscoveries: string[];
  heirloomName: string | null;
  shop: ShopStock;
  quests: Quest[];
  skillUpgrades: SkillUpgrades;
  /** What each growing card has gained this run (DECISIONS #73); absent in older saves. */
  skillGrowth?: Record<string, number>;
  /** Items that exist only in this run (quest upgrades), stored whole. */
  customItems: Item[];
}

export const equipmentToIds = (eq: Equipment): Record<Slot, string | null> => ({ body: eq.body?.id ?? null, weapon: eq.weapon?.id ?? null, relic: eq.relic?.id ?? null });
export const equipmentFromIds = (ids: Record<Slot, string | null>, custom: Item[] = []): Equipment => ({ body: ids.body ? resolveItem(ids.body, custom) : null, weapon: ids.weapon ? resolveItem(ids.weapon, custom) : null, relic: ids.relic ? resolveItem(ids.relic, custom) : null });
