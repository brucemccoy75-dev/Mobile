import { describe, expect, it } from 'vitest';
import { blockSide, shieldArc, skullPoints } from './fx/shapes';

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

describe('where a blocked hit stops (DECISIONS #66)', () => {
  // A body standing on its feet (origin at the bottom), 100 wide and 140 tall, at x 300, feet at y 400.
  const body = { x: 300, y: 400, displayWidth: 100, displayHeight: 140, originY: 1 };
  const centre = { x: 300, y: 330 };

  it('a hit from the side stops at a shield outside the body on that side', () => {
    const r = shieldArc(body, 'right'), l = shieldArc(body, 'left');
    expect(r.apex.x).toBeGreaterThan(body.x + 50); // past the body's right edge
    expect(l.apex.x).toBeLessThan(body.x - 50);
    expect(r.apex.y).toBeCloseTo(centre.y);
    expect(r.apex.x - centre.x).toBeCloseTo(centre.x - l.apex.x); // mirror images
  });

  it('a spell from overhead stops at a dome above the head', () => {
    const u = shieldArc(body, 'up');
    expect(u.apex.y).toBeLessThan(body.y - 140); // above the top of the head
    expect(u.apex.x).toBeCloseTo(body.x);
  });

  it('the apex lies on the arc', () => {
    for (const side of ['left', 'right', 'up'] as const) {
      const s = shieldArc(body, side);
      expect(Math.hypot(s.apex.x - s.centre.x, s.apex.y - s.centre.y)).toBeCloseTo(s.r);
    }
  });

  it('poison and curse come from overhead; everything else from the attacker', () => {
    expect(blockSide('poison', true)).toBe('up');
    expect(blockSide('curse', false)).toBe('up');
    expect(blockSide('fireball', true)).toBe('right');
    expect(blockSide('slash', false)).toBe('left');
    expect(blockSide('none', true)).toBe('right');
  });
});
