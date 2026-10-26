import type Phaser from 'phaser';
import { ART_FILES } from '@game/scenes/BootScene';
import type { TileType } from '@core/map';

/**
 * Art style switch. Style C (flat vector, cel-shaded) is the chosen look (docs/ART.md);
 * Style A (pixel) stays loadable so the two can be compared on the device from the title.
 */
export type ArtStyle = 'c' | 'a';
export const ART_STYLES: ArtStyle[] = ['c', 'a'];
export const ART_STYLE_LABEL: Record<ArtStyle, string> = { c: 'C · vector', a: 'A · pixel' };
const KEY = 'rerpg:art';

export function getArtStyle(): ArtStyle {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'a' || v === 'c') return v;
  } catch { /* private window / blocked storage */ }
  return 'c';
}

export function setArtStyle(style: ArtStyle) {
  try { localStorage.setItem(KEY, style); } catch { /* ignore */ }
}

export function nextArtStyle(style: ArtStyle): ArtStyle {
  return ART_STYLES[(ART_STYLES.indexOf(style) + 1) % ART_STYLES.length] ?? 'c';
}

/**
 * Texture key for `base` (e.g. 'hero_warrior') in the chosen style, falling back to any
 * other style that was loaded. Returns null when no art exists so scenes keep their placeholder.
 */
export function artKey(scene: Phaser.Scene, base: string): string | null {
  const order = [getArtStyle(), ...ART_STYLES.filter((s) => s !== getArtStyle())];
  for (const s of order) {
    const key = `${base}_${s}`;
    if (scene.textures.exists(key)) return key;
  }
  return null;
}

/** Combat backdrop texture per overworld tile. Only the forest exists so far; everything falls back to it. */
const BACKDROPS: Partial<Record<TileType, string>> = { forest: 'bg_forest' };
export function backdropKey(tile?: TileType): string {
  return (tile && BACKDROPS[tile]) ?? 'bg_forest';
}
/** Fraction of the backdrop's height where the flat ground begins; combatants' feet sit on this line. */
export const BACKDROP_HORIZON = 0.84;
export const BACKDROP_GROUND = 0x8b8d45;

/**
 * A texture that failed to load at boot (a dropped fetch, or a Pages deploy in progress) would
 * leave its placeholder square for the whole session. Fetch it again now; `onLoaded` runs with
 * the texture key once it is in, so the scene can swap the placeholder out.
 */
export function reloadArt(scene: Phaser.Scene, base: string, onLoaded: (key: string) => void): void {
  const order = [getArtStyle(), ...ART_STYLES.filter((s) => s !== getArtStyle())];
  for (const s of order) {
    const key = `${base}_${s}`;
    const path = ART_FILES[key];
    if (!path) continue;
    scene.load.image(key, path);
    scene.load.once(`filecomplete-image-${key}`, () => { if (scene.textures.exists(key)) onLoaded(key); });
    scene.load.start();
    return;
  }
}
