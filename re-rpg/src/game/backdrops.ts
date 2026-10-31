import type { TileType } from '@core/map';

/**
 * Which combat backdrop a fight uses (DECISIONS #80), kept free of Phaser so it can be tested.
 * Screen 2 (the Frozen Pass) fights on the tundra whatever the tile; screen 1 picks by tile, and
 * only the forest exists there, so everything falls back to it.
 */
const BY_TILE: Partial<Record<TileType, string>> = { forest: 'bg_forest' };
const BY_SCREEN: Record<number, string> = { 1: 'bg_tundra' };
export function backdropKey(tile?: TileType, screenIndex = 0): string {
  return BY_SCREEN[screenIndex] ?? (tile && BY_TILE[tile]) ?? 'bg_forest';
}

/** The ground colour carried on under the hand, sampled from each backdrop's ground band. */
const GROUND: Record<string, number> = { bg_forest: 0x8b8d45, bg_tundra: 0xd0deef };
export const backdropGround = (key: string): number => GROUND[key] ?? GROUND.bg_forest!;
