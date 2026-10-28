import type { EnemyId } from '@data/types';

export type TileType = 'road' | 'grass' | 'forest' | 'swamp' | 'water' | 'rock' | 'arena';

export interface Tile { x: number; y: number; }

export type PoiKind = 'chest' | 'shop' | 'shrine';

export interface Poi {
  id: string;
  kind: PoiKind;
  pos: Tile;
  /** How far off the road it sits, in danger-weighted path cost. Drives chest value. */
  cost: number;
  guardId: string;
}

export interface Guard {
  id: string;
  pos: Tile;
  enemyId: EnemyId;
  poiId: string;
}

export type NodeKind = 'start' | 'quest' | 'lost' | 'monster' | 'unknown' | 'elite' | 'shop' | 'treasure' | 'shrine' | 'boss';

/**
 * A clearing in the node overworld (DECISIONS #37). The network is authored; the kind of each open
 * slot and the species at it are rolled per run. `links` are the nodes one road away.
 */
export interface MapNode {
  id: string;
  kind: NodeKind;
  pos: Tile;
  links: string[];
  enemyId?: EnemyId;
  extra?: EnemyId[];
  /** True once the slot's species was revealed (unknown monsters) or the node was ever entered. */
  seen?: boolean;
  /** A dialogue id that replaces the node's usual words (world editor, DECISIONS #55). */
  dialogue?: string;
}

/** Kinds a designer may put on a content slot (world editor, DECISIONS #55). */
export const RULE_KINDS = ['monster', 'unknown', 'elite', 'treasure', 'shop', 'shrine'] as const;
export type RuleKind = (typeof RULE_KINDS)[number];

/**
 * A designer's rule for one node (world.json, DECISIONS #55). Unset fields keep the rolled
 * default. `kind` fixes what the slot is; `odds` rolls it per run from weights instead. `enemy`
 * names the species and `pair` makes it a duo (fight slots; a boss slot takes a boss). `dialogue`
 * replaces the node's usual words.
 */
export interface NodeRule {
  kind?: RuleKind;
  odds?: Partial<Record<RuleKind, number>>;
  enemy?: EnemyId;
  pair?: [EnemyId, EnemyId];
  dialogue?: string;
}

export interface ScreenMap {
  seed: string;
  /** True for hand-authored layouts (core/map/authored.ts): play happens on `nodes`. */
  authored?: boolean;
  nodes?: MapNode[];
  screenIndex: number;
  width: number;
  height: number;
  /** Row-major, tiles[y * width + x]. */
  tiles: TileType[];
  entry: Tile;
  boss: Tile;
  bossId: EnemyId;
  pois: Poi[];
  guards: Guard[];
  /** Quest giver: a few steps from the entry (testing placement; later per-quest). */
  questGiver: Tile;
  /** A far off-road tile for an escort NPC or other quest target. */
  npcSpot: Tile;
}

/** Movement cost for pathfinding; Infinity = impassable. */
export const TILE_COST: Record<TileType, number> = {
  road: 1, grass: 2, forest: 4, swamp: 6, arena: 1, water: Infinity, rock: Infinity,
};

/** Threat added to the meter per step onto this tile (DECISIONS: encounter roll per tile). */
export const TILE_THREAT: Record<TileType, number> = {
  road: 0, grass: 0.08, forest: 0.2, swamp: 0.3, arena: 0, water: 0, rock: 0,
};

export const tileAt = (m: ScreenMap, x: number, y: number): TileType | undefined =>
  x < 0 || y < 0 || x >= m.width || y >= m.height ? undefined : m.tiles[y * m.width + x];

export const inBounds = (m: ScreenMap, x: number, y: number) => x >= 0 && y >= 0 && x < m.width && y < m.height;
export const sameTile = (a: Tile, b: Tile) => a.x === b.x && a.y === b.y;
export const key = (t: Tile) => `${t.x},${t.y}`;
