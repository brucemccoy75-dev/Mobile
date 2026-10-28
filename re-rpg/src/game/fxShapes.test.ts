import { describe, expect, it } from 'vitest';
import { skullPoints } from './fx/shapes';

describe('the smoke skull (DECISIONS #65)', () => {
  const pts = skullPoints(5);
  it('is a cranium and a jaw with empty eye sockets and nose, and symmetric', () => {
    expect(pts.length).toBeGreaterThan(40);
    expect(pts.length).toBeLessThan(90); // a phone-sized puff count
    const inEye = (p: { x: number; y: number }) => [-8, 8].some((ex) => Math.hypot(p.x - ex, p.y + 6) < 5.5);
    expect(pts.some(inEye)).toBe(false);
    for (const p of pts) expect(pts.some((q) => Math.abs(q.x + p.x) < 0.01 && Math.abs(q.y - p.y) < 0.01)).toBe(true);
    expect(Math.min(...pts.map((p) => p.y))).toBeLessThan(-20); // the dome
    expect(Math.max(...pts.map((p) => p.y))).toBeGreaterThan(14); // the jaw
  });
});
