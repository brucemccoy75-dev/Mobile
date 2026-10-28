/**
 * Shapes the battle effects draw with particles (DECISIONS #65). Pure, so the outlines are tested.
 * Points are in pixels around (0, 0), y down.
 */
type Pt = { x: number; y: number };

/**
 * A skull made of where smoke settles: a rounded cranium and a narrower jaw on a grid, leaving the
 * eye sockets and the nose empty so they read as dark gaps in the smoke. Symmetric by construction.
 */
export function skullPoints(step = 5): Pt[] {
  const out: Pt[] = [];
  for (let y = -26; y <= 20; y += step) for (let x = 0; x <= 24; x += step) {
    const cranium = (x / 22) ** 2 + ((y + 6) / 20) ** 2 <= 1;
    const jaw = y >= 6 && y <= 20 && x <= 12 - Math.max(0, y - 14);
    if (!cranium && !jaw) continue;
    const eye = Math.hypot(x - 8, y + 6) < 6;
    const nose = y >= 0 && y <= 6 && x <= 3 - (6 - y) * 0.3;
    const teethGap = y > 13 && y < 17 && x % 10 === 5;
    if (eye || nose || teethGap) continue;
    out.push({ x, y });
    if (x !== 0) out.push({ x: -x, y });
  }
  return out;
}
