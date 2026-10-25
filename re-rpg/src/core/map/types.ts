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

export interface ScreenMap {
  seed: string;
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
