import type { Rng } from '@core/rng';
import { TILE_THREAT, type TileType } from './types';

export const THREAT_TRIGGER = 1.0;
export const SCREEN_THREAT_MULT = [1.0, 1.3];

/**
 * The threat meter (GAME_DESIGN §7): each step adds the tile's threat; when it
 * reaches 1.0 an encounter fires and the meter resets to a small random value
 * so the exact step is never fully countable. Roads are safe.
 */
export function stepThreat(meter: number, tile: TileType, screenIndex: number, rng: Rng, extraMult = 1): { meter: number; encounter: boolean } {
  const add = TILE_THREAT[tile] * (SCREEN_THREAT_MULT[screenIndex] ?? 1.3) * extraMult;
  const next = meter + add;
  if (add > 0 && next >= THREAT_TRIGGER) {
    return { meter: rng.next() * 0.35, encounter: true };
  }
  return { meter: next, encounter: false };
}
