import { describe, expect, it } from 'vitest';
import { Rng } from '@core/rng';
import type { Enemy, EnemyMove, EnemyTraits } from '@data/types';
import { createCombat, step } from './engine';
import { getStatus, hasStatus, applyStatus } from './status';
import { computeHit } from './damage';

const WARRIOR = { stats: { maxHp: 40, atk: 4, def: 0 } };
const poke: EnemyMove = { id: 'poke', name: 'Poke', posture: 'aggressive' as const, intent: { kind: 'attack' as const, mult: 1, hits: 1 }, effects: [{ type: 'damage' as const, mult: 1 }] };
const wait: EnemyMove = { id: 'wait', name: 'Wait', posture: 'defensive' as const, intent: { kind: 'stagger' as const }, effects: [] };
const foe = (traits: EnemyTraits, moves: EnemyMove[] = [poke], hp = 30): Enemy => ({ id: 'foe', name: 'Foe', tier: 1, archetype: 'brute', stats: { maxHp: hp, atk: 3, def: 0 }, traits, table: { kind: 'sequence', moves } });
const play = (s: ReturnType<typeof createCombat>, id: string, target?: number) => {
  let i = s.player.hand.indexOf(id);
  if (i < 0) { s.player.hand.push(id); i = s.player.hand.length - 1; }
  return step(s, { type: 'card', index: i, target });
};
const hitsOnYou = (ev: ReturnType<typeof step>) => ev.filter((e) => e.t === 'damage' && e.target === 'player').map((e) => (e as { amount: number }).amount);

describe('enemy traits for the crawl roster (DECISIONS #83)', () => {
  it('sweep-weak: a hit-all card does double to it, a single-target card does not', () => {
    const s = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({ sweepVuln: 2 }, [wait]), rng: new Rng(1) });
    const swept = play(s, 'bellow').find((e) => e.t === 'damage' && e.source === 'player');
    expect(swept).toMatchObject({ amount: 2 }); // Bellow is 1 to everyone
    const plain = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({}, [wait]), rng: new Rng(1) });
    expect(play(plain, 'bellow').find((e) => e.t === 'damage' && e.source === 'player')).toMatchObject({ amount: 1 });
  });

  it('momentum: each attack adds to the next; a blocked hit or a Chill resets it', () => {
    const s = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({ momentum: 1 }), rng: new Rng(2) });
    expect(hitsOnYou(play(s, 'bellow'))).toEqual([3]);
    expect(getStatus(s.enemies[0]!, 'momentum')?.magnitude).toBe(1);
    expect(hitsOnYou(play(s, 'bellow'))).toEqual([4]);
    expect(hitsOnYou(play(s, 'bellow'))).toEqual([5]);
    expect(getStatus(s.enemies[0]!, 'momentum')?.magnitude).toBe(3);
    s.player.statuses.push({ id: 'guard', turns: 99, magnitude: 1 });
    play(s, 'bellow'); // blocked: the momentum breaks
    expect(hasStatus(s.enemies[0]!, 'momentum')).toBe(false);
    expect(hitsOnYou(play(s, 'bellow'))).toEqual([3]);
    applyStatus(s.enemies[0]!, 'chill', 1, 1, []);
    play(s, 'bellow'); // chilled: no attack, and the momentum is gone
    expect(hasStatus(s.enemies[0]!, 'momentum')).toBe(false);
  });

  it('frenzy: +50% for each other frenzied ally alive', () => {
    const v = foe({ frenzy: 0.5 });
    const pair = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemies: [v, { ...v, id: 'foe2' }], rng: new Rng(3) });
    expect(computeHit(pair.enemies[0]!, pair.player, 2)).toBe(9); // 6 × 1.5
    const alone = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: v, rng: new Rng(3) });
    expect(computeHit(alone.enemies[0]!, alone.player, 2)).toBe(6);
    // Its partner dies: the frenzy goes with it.
    pair.enemies[1]!.hp = 1;
    play(pair, 'attack', 1);
    expect(computeHit(pair.enemies[0]!, pair.player, 2)).toBe(6);
  });

  it('burn-weak: Burn ticks double on it', () => {
    const s = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({ burnVuln: 2 }, [wait]), rng: new Rng(4) });
    s.enemies[0]!.statuses.push({ id: 'burn', turns: 3, magnitude: 2 });
    const ev = play(s, 'defend');
    expect(ev.find((e) => e.t === 'burn' && e.side === 'enemy')).toMatchObject({ amount: 4 });
  });

  it('chill exposes it (contained, the lava hardens); chill grounds a flier (its Scatter goes)', () => {
    const a = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({ chillExposes: 2 }, [wait]), rng: new Rng(5) });
    applyStatus(a.enemies[0]!, 'chill', 1, 1, []);
    expect(hasStatus(a.enemies[0]!, 'exposed')).toBe(true);
    const b = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({ chillGrounds: true }, [wait]), rng: new Rng(5) });
    b.enemies[0]!.statuses.push({ id: 'scatter', turns: 2, magnitude: 1 });
    applyStatus(b.enemies[0]!, 'chill', 1, 1, []);
    expect(hasStatus(b.enemies[0]!, 'scatter')).toBe(false);
  });
});

describe('the card shows what will land (DECISIONS #40, #83)', () => {
  it('a sweep previews double on a sweep-weak enemy', async () => {
    const { previewDamage } = await import('./damage');
    const s = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: foe({ sweepVuln: 2 }, [wait]), rng: new Rng(9) });
    const p = previewDamage(s.player, s.enemies[0]!, { type: 'damage', mult: 0, flat: 1, ignoreDef: true, targets: 'all' });
    expect(p.hits.map((h) => h.amount)).toEqual([2]);
  });
});
