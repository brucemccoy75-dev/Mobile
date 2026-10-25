import type { ScreenMap, TileType } from '@core/map';

/**
 * Maps the overworld grid onto the CraftPix vector ground tileset (docs/ART.md, scripts/pack-tiles.py).
 * Pure: no Phaser. Tile numbers below are the pack's own 1-56 numbering; the packed sheet holds
 * summer 1-56, then the recoloured swamp 1-56, then a flat water tile.
 */
export const GROUND_COLS = 8;
const SUMMER = 0, SWAMP = 56, WATER = 112;

/** 4-neighbour road mask: N=1 E=2 S=4 W=8 → narrow path pieces. */
const ROAD: Record<number, number[]> = {
  0: [5], 1: [39], 2: [40], 4: [37], 8: [42],
  5: [38, 51, 53], 10: [41, 49, 55],
  3: [34], 9: [36], 6: [28], 12: [30],
  7: [31], 13: [33], 11: [35], 14: [29], 15: [32],
};

/** Blob mask of what is OUTSIDE the terrain: edges N=1 E=2 S=4 W=8, corners NE=16 SE=32 SW=64 NW=128. */
const N = 1, E = 2, S = 4, W = 8, NE = 16, SE = 32, SW = 64, NW = 128;
const BLOB: Record<number, number[]> = {
  0: [14, 23], [N]: [8, 20], [S]: [2, 26], [E]: [4, 24], [W]: [6, 22],
  [N | W]: [10], [N | E]: [12], [S | W]: [16], [S | E]: [18],
  [NE]: [7], [NW]: [9], [SE]: [1], [SW]: [3],
  [NW | NE]: [11], [NW | SW]: [13], [NE | SE]: [15], [SW | SE]: [17],
  [N | SE]: [44], [N | SW]: [45], [S | NE]: [46], [S | NW]: [47],
  [N | E | S | W]: [5],
};

/** Small deterministic hash so decoration is stable per seed and tile. */
export function hash(seed: string | number, x: number, y: number, salt = 0): number {
  let sd = 0;
  for (const ch of String(seed)) sd = (Math.imul(sd, 31) + ch.charCodeAt(0)) >>> 0;
  let h = (sd ^ (x * 374761393) ^ (y * 668265263) ^ (salt * 2246822519)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const pick = <T>(arr: T[], r: number): T => arr[Math.min(arr.length - 1, Math.floor(r * arr.length))]!;

function blobTile(outside: number, r: number): number {
  // corners next to an outside edge never show, so drop them before lookup
  let m = outside;
  if (m & N) m &= ~(NE | NW);
  if (m & S) m &= ~(SE | SW);
  if (m & E) m &= ~(NE | SE);
  if (m & W) m &= ~(NW | SW);
  const exact = BLOB[m];
  if (exact) return pick(exact, r);
  const edgesOnly = BLOB[m & 15];
  if (edgesOnly) return pick(edgesOnly, r);
  return 5; // thin strips / peninsulas degrade to an island
}

function outsideMask(at: (x: number, y: number) => boolean, x: number, y: number): number {
  let m = 0;
  if (!at(x, y - 1)) m |= N; if (!at(x + 1, y)) m |= E; if (!at(x, y + 1)) m |= S; if (!at(x - 1, y)) m |= W;
  if (!at(x + 1, y - 1)) m |= NE; if (!at(x + 1, y + 1)) m |= SE; if (!at(x - 1, y + 1)) m |= SW; if (!at(x - 1, y - 1)) m |= NW;
  return m;
}

/** Ground sheet index for every tile, row-major like map.tiles. */
export function groundIndices(map: ScreenMap): number[] {
  const t = (x: number, y: number): TileType | undefined => x < 0 || y < 0 || x >= map.width || y >= map.height ? undefined : map.tiles[y * map.width + x];
  const isDirt = (x: number, y: number) => { const k = t(x, y); return k === 'arena' || k === 'road' || k === undefined; };
  const isSwamp = (x: number, y: number) => t(x, y) === 'swamp';
  const out: number[] = new Array(map.width * map.height);
  for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
    const k = t(x, y)!; const r = hash(map.seed, x, y, 1);
    let idx: number;
    if (k === 'road') {
      let m = 0;
      if (isDirt(x, y - 1)) m |= 1; if (isDirt(x + 1, y)) m |= 2; if (isDirt(x, y + 1)) m |= 4; if (isDirt(x - 1, y)) m |= 8;
      idx = SUMMER + pick(ROAD[m]!, r) - 1;
    } else if (k === 'arena') {
      idx = SUMMER + blobTile(outsideMask(isDirt, x, y), r) - 1;
    } else if (k === 'swamp') {
      idx = SWAMP + blobTile(outsideMask(isSwamp, x, y), r) - 1;
    } else if (k === 'water') {
      idx = WATER;
    } else {
      idx = SUMMER + pick([43, 52], r) - 1; // grass under forest, rock and plain grass
    }
    out[y * map.width + x] = idx;
  }
  return out;
}

export interface Prop { x: number; y: number; frame: string; scale: number; }

/** Decorative props per tile (trees, reeds, boulders), stable per seed; positions in tile units. */
export function propsFor(map: ScreenMap): Prop[] {
  const props: Prop[] = [];
  for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
    const k = map.tiles[y * map.width + x]!;
    const r1 = hash(map.seed, x, y, 2), r2 = hash(map.seed, x, y, 3), r3 = hash(map.seed, x, y, 4);
    const jx = x + 0.5 + (r2 - 0.5) * 0.3, jy = y + 0.5 + (r3 - 0.5) * 0.3;
    if (k === 'forest') props.push({ x: jx, y: y + 0.9, frame: r1 < 0.55 ? 'tree_small' : r1 < 0.9 ? 'tree_medium' : 'tree_large', scale: 0.5 });
    else if (k === 'rock') props.push({ x: x + 0.5, y: y + 0.85, frame: pick(['boulder_1', 'boulder_2', 'boulder_3'], r1), scale: 0.5 });
    else if (k === 'swamp' && r1 < 0.6) props.push({ x: jx, y: jy, frame: pick(['waterplant_1', 'waterplant_2', 'waterplant_3', 'sticks_1', 'sticks_2', 'sticks_3', 'shrub_2', 'shrub_3', 'leaf_1', 'leaf_2'], r2), scale: 0.5 });
    else if (k === 'water' && r1 < 0.3) props.push({ x: jx, y: jy, frame: pick(['leaf_1', 'leaf_2', 'leaf_3'], r2), scale: 0.5 });
    else if (k === 'grass' && r1 < 0.1) props.push({ x: jx, y: jy, frame: r2 < 0.6 ? pick(['bush_small', 'bush_medium'], r3) : pick(['rock_2', 'rock_3', 'rock_4', 'rock_5'], r3), scale: 0.5 });
  }
  return props;
}
