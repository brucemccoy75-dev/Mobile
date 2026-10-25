import type Phaser from 'phaser';

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
