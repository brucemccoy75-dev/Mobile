/**
 * Map mode switch (DECISIONS #34): authored lanes are the game; the procedural generator stays
 * behind this flag (and on branch `overworld-procedural`) in case we change our minds again.
 */
export type MapMode = 'authored' | 'procedural';
const KEY = 'rerpg:map';

export function getMapMode(): MapMode {
  try { if (localStorage.getItem(KEY) === 'procedural') return 'procedural'; } catch { /* blocked storage */ }
  return 'authored';
}
export function setMapMode(mode: MapMode) {
  try { localStorage.setItem(KEY, mode); } catch { /* ignore */ }
}
export const MAP_MODE_LABEL: Record<MapMode, string> = { authored: 'authored', procedural: 'procedural' };
