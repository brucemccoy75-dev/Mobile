import { describe, expect, it } from 'vitest';
import { Rng, RunRng } from '@core/rng';
import type { Enemy } from '@data/types';
import { createCombat, redrawHand, step } from './engine';
import { hasStatus } from './status';

const WARRIOR = { stats: { maxHp: 25, atk: 4, def: 1 } };
const PASSIVE: Enemy = {
  id: 'passive', name: 'Passive', tier: 1, archetype: 'brute', stats: { maxHp: 40, atk: 3, def: 0 },
  table: { kind: 'sequence', moves: [{ id: 'wait', name: 'Wait', posture: 'defensive', intent: { kind: 'stagger' }, effects: [] }] },
};
const WEAKENER: Enemy = {
  ...PASSIVE, id: 'weakener', name: 'Weakener',
  table: { kind: 'sequence', moves: [{ id: 'sap', name: 'Sap', posture: 'aggressive', intent: { kind: 'debuff', status: 'weak' }, effects: [{ type: 'status', target: 'enemy', status: 'weak', turns: 2 }] }] },
};
const play = (s: ReturnType<typeof createCombat>, id: string, target?: number) => {
  let i = s.player.hand.indexOf(id);
  if (i < 0) { s.player.hand.push(id); i = s.player.hand.length - 1; }
  return step(s, { type: 'card', index: i, target });
};

describe('every fight is fully shuffled (designer, 2026-10-31)', () => {
  it('across a run, a deck card is equally likely at every position of the deal', () => {
    const basics = ['attack', 'attack', 'defend', 'bellow', 'defend', 'ward'], deck = ['cursed_counter', 'shield_bash'];
    const n = basics.length + deck.length, pos = new Array<number>(n).fill(0);
    let fights = 0;
    for (let run = 0; run < 150; run++) {
      const rng = new RunRng(`R${run}`).stream('combat'); // one stream, fight after fight, as a run uses it
      for (let f = 0; f < 15; f++, fights++) {
        const s = createCombat({ player: { ...WARRIOR, deck, basics }, enemy: PASSIVE, rng });
        pos[[...s.player.hand, ...s.player.deck].indexOf('cursed_counter')]! += 1;
      }
    }
    for (const c of pos) expect(Math.abs(c / fights - 1 / n)).toBeLessThan(0.03);
  });
});

describe('Earthen gear (DECISIONS #82)', () => {
  it('Weak-proof: no Weak lands, from an enemy or your own card, and it spends no Ward', () => {
    const s = createCombat({ player: { ...WARRIOR, deck: [], basics: [], gear: { immune: ['weak'] } }, enemy: WEAKENER, rng: new Rng(1) });
    s.player.statuses.push({ id: 'ward', turns: 99, magnitude: 1 });
    const ev = play(s, 'shield_bash'); // Tiring puts Weak on you; then the enemy saps
    expect(hasStatus(s.player, 'weak')).toBe(false);
    expect(ev.filter((e) => e.t === 'statusResisted' && e.immune).length).toBe(2);
    expect(s.player.statuses.find((x) => x.id === 'ward')?.magnitude).toBe(1);
    // Without the armour the same plays leave you Weak.
    const plain = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: WEAKENER, rng: new Rng(1) });
    play(plain, 'shield_bash');
    expect(hasStatus(plain.player, 'weak')).toBe(true);
  });

  it('pierce: a pierced hit lands through Guard and leaves the Guard up; about half pierce at 50%', () => {
    const always = createCombat({ player: { ...WARRIOR, deck: [], basics: [], gear: { pierce: 1 } }, enemy: PASSIVE, rng: new Rng(2) });
    always.enemies[0]!.statuses.push({ id: 'guard', turns: 99, magnitude: 2 });
    const ev = play(always, 'attack');
    expect(ev.find((e) => e.t === 'damage' && e.source === 'player')).toMatchObject({ blocked: false, amount: 4 });
    expect(ev.some((e) => e.t === 'pierce')).toBe(true);
    expect(always.enemies[0]!.statuses.find((x) => x.id === 'guard')?.magnitude).toBe(2);
    let pierced = 0;
    for (let k = 0; k < 400; k++) {
      const s = createCombat({ player: { ...WARRIOR, deck: [], basics: [], gear: { pierce: 0.5 } }, enemy: PASSIVE, rng: new Rng(100 + k) });
      s.enemies[0]!.statuses.push({ id: k % 2 ? 'guard' : 'aegis', turns: 99, magnitude: 1 });
      if (play(s, 'attack').some((e) => e.t === 'damage' && e.source === 'player' && !e.blocked)) pierced++;
    }
    expect(pierced / 400).toBeGreaterThan(0.42);
    expect(pierced / 400).toBeLessThan(0.58);
    // No gear, no pierce.
    const plain = createCombat({ player: { ...WARRIOR, deck: [], basics: [] }, enemy: PASSIVE, rng: new Rng(2) });
    plain.enemies[0]!.statuses.push({ id: 'guard', turns: 99, magnitude: 1 });
    expect(play(plain, 'attack').find((e) => e.t === 'damage' && e.source === 'player')).toMatchObject({ blocked: true });
  });

  it('redraw: hand, deck and discard shuffled together and a fresh hand dealt, once per fight, without using a play', () => {
    const basics = ['attack', 'attack', 'defend', 'bellow', 'defend', 'ward'];
    const s = createCombat({ player: { ...WARRIOR, deck: ['shield_bash'], basics, gear: { redraw: true } }, enemy: PASSIVE, rng: new Rng(3) });
    play(s, 'attack');
    const total = () => s.player.hand.length + s.player.deck.length + s.player.discard.length;
    const before = total(), round = s.round, plays = s.playsLeft;
    const ev = redrawHand(s);
    expect(ev[0]).toMatchObject({ t: 'redraw' });
    expect(s.player.hand).toHaveLength(3);
    expect(s.player.discard).toHaveLength(0);
    expect(total()).toBe(before);
    expect([s.round, s.playsLeft]).toEqual([round, plays]);
    expect(() => redrawHand(s)).toThrow(/once/);
    const plain = createCombat({ player: { ...WARRIOR, deck: [], basics }, enemy: PASSIVE, rng: new Rng(3) });
    expect(() => redrawHand(plain)).toThrow(/relic/);
  });
});
