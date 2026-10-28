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

/** A fighter's sprite, as much of it as the shield needs: where it stands and how big it is drawn. */
export type Body = { x: number; y: number; displayWidth?: number; displayHeight?: number; originY?: number };
export type ShieldSide = 'left' | 'right' | 'up';

/** Spells that fall from overhead (the rain cloud, the skull) meet a dome; the rest meet the attacker's side (#66). */
export function blockSide(kind: string, fromRight: boolean): ShieldSide {
  return kind === 'poison' || kind === 'curse' ? 'up' : fromRight ? 'right' : 'left';
}

/**
 * The shield that stops a blocked hit (#63, #66): an arc of radius `r` around `centre`, spanning
 * `angle` ± 0.9 rad, whose middle (`apex`) is where the slash or spell stops. Beside the body for a
 * hit from the side, a dome just over the head for a spell from above.
 */
export function shieldArc(t: Body, side: ShieldSide) {
  const w = t.displayWidth ?? 80, h = t.displayHeight ?? 100;
  const cy = t.y - (t.originY === 1 ? h / 2 : 0);
  const angle = side === 'up' ? -Math.PI / 2 : side === 'right' ? 0 : Math.PI;
  const r = side === 'up' ? w * 0.6 : h * 0.48;
  const reach = side === 'up' ? h / 2 + 10 : w * 0.42 + r * 0.45;
  const apex = { x: t.x + Math.cos(angle) * reach, y: cy + Math.sin(angle) * reach };
  const centre = { x: apex.x - Math.cos(angle) * r, y: apex.y - Math.sin(angle) * r };
  return { angle, r, apex, centre };
}
