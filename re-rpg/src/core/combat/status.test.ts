import { describe, it, expect } from 'vitest';
import { Rng } from '@core/rng';
import { createCombat, step } from './engine';
import { previewDamage } from './damage';
import { getStatus, hasStatus } from './status';
import type { CombatEvent, CombatState } from './types';
import type { Enemy, EnemyMove, StatusId } from '@data/types';

/**
 * Status timing, pinned (DECISIONS #40).
 *
 * A round is: you act → each living enemy acts → enemy statuses tick → your statuses tick →
 * the next round starts. `turns` counts end-of-round ticks, and every timed status ticks at
 * the end of the round it was applied in, whoever applied it and whenever in the round.
 * So, counted in *your* turns:
 *   - your self-status with turns 1 covers this round's enemy attacks only (Broadsword's Exposed);
 *   - your self-status with turns 2 covers this round and your next turn (Shield Bash's Weak);
 *   - a status you put on an enemy with turns 2 covers your next turn (Exposing Strike);
 *   - an enemy's self-buff with turns 2 covers your next turn (Shell, Brace, Scatter);
 *   - an enemy's debuff on you with turns 2 covers the next round: your turn and its attack (Hex).
 * Guard, Ward and Chill never tick: hits and actions consume them. Burn and Curse deal their
 * damage at every tick, the first at the end of the round they were cast in.
 * The log carries `statusApplied` and `statusExpired` where they happen and `roundStart` after
 * every tick, so the chips at a round start are exactly the engine's statuses for that decision.
 */

const WARRIOR = { stats: { maxHp: 25, atk: 4, def: 1 } };

const move = (id: string, effects: EnemyMove['effects'], intent: EnemyMove['intent'] = { kind: 'stagger' }, posture: EnemyMove['posture'] = 'defensive'): EnemyMove => ({ id, name: id, posture, intent, effects });
const POKE = move('poke', [{ type: 'damage', mult: 1 }], { kind: 'attack', mult: 1, hits: 1 }, 'aggressive');
const SPELL = move('spell', [{ type: 'damage', mult: 1, kind: 'magic' }], { kind: 'attack', mult: 1, hits: 1, dmgType: 'magic' }, 'sinister');
const WAIT = move('wait', []);
const selfBuff = (status: StatusId, turns = 2, magnitude = 1): EnemyMove => move(status, [{ type: 'status', target: 'self', status, turns, magnitude }], { kind: 'buff', status });
const hex = (status: StatusId, turns = 2, magnitude = 1): EnemyMove => move(`hex_${status}`, [{ type: 'status', target: 'enemy', status, turns, magnitude, kind: 'magic' }], { kind: 'debuff', status }, 'sinister');
const GUARD = move('guard', [{ type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 1 }], { kind: 'guard', hits: 1 });

const seq = (id: string, moves: EnemyMove[], stats = { maxHp: 30, atk: 3, def: 0 }): Enemy => ({ id, name: id, tier: 1, archetype: 'brute', stats, table: { kind: 'sequence', moves } });
const DUMMY = seq('dummy', [POKE]);
const PASSIVE = seq('passive', [WAIT]);

const fight = (deck: string[], enemy: Enemy | Enemy[] = PASSIVE, seed = 1): CombatState =>
  createCombat({ player: { ...WARRIOR, deck, basics: [] }, enemies: Array.isArray(enemy) ? enemy : [enemy], rng: new Rng(seed) });

const play = (s: CombatState, id: string, target?: number) => {
  let i = s.player.hand.indexOf(id);
  if (i < 0) { s.player.hand.push(id); i = s.player.hand.length - 1; }
  return step(s, { type: 'card', index: i, target });
};
const idx = (ev: CombatEvent[], pred: (e: CombatEvent) => boolean) => ev.findIndex(pred);
const applied = (st: StatusId, side = 'enemy') => (e: CombatEvent) => e.t === 'statusApplied' && e.status === st && e.side === side;
const expired = (st: StatusId, side = 'enemy') => (e: CombatEvent) => e.t === 'statusExpired' && e.status === st && e.side === side;
const roundStart = (e: CombatEvent) => e.t === 'roundStart';
const landed = (ev: CombatEvent[], source: 'player' | 'enemy') => ev.filter((e) => e.t === 'damage' && e.source === source).map((e) => (e.t === 'damage' ? e.amount : 0));

describe('harden (Shell)', () => {
  const SHELLER = seq('sheller', [selfBuff('harden'), WAIT, WAIT]);

  it('applies on the enemy turn, covers your next turn only, and the log says so before the round starts', () => {
    const s = fight(['attack', 'attack', 'attack'], SHELLER);
    const r1 = play(s, 'attack');                 // 4 lands in full: the shell comes after your move
    expect(landed(r1, 'player')).toEqual([4]);
    expect(idx(r1, applied('harden'))).toBeGreaterThan(idx(r1, (e) => e.t === 'play' && e.side === 'enemy'));
    expect(idx(r1, applied('harden'))).toBeLessThan(idx(r1, roundStart));
    expect(getStatus(s.enemy, 'harden')).toMatchObject({ turns: 1 }); // ticked once at the end of the round it was raised in
    const r2 = play(s, 'attack');                 // halved
    expect(landed(r2, 'player')).toEqual([2]);
    expect(idx(r2, expired('harden'))).toBeGreaterThan(idx(r2, (e) => e.t === 'play' && e.side === 'enemy'));
    expect(idx(r2, expired('harden'))).toBeLessThan(idx(r2, roundStart));
    expect(hasStatus(s.enemy, 'harden')).toBe(false);
    const r3 = play(s, 'attack');                 // back to full
    expect(landed(r3, 'player')).toEqual([4]);
  });

  it('halves after defence, never below 1, and Exposed doubles it back', () => {
    const s = fight(['attack', 'attack'], seq('plate', [WAIT], { maxHp: 30, atk: 3, def: 1 }));
    s.enemy.statuses.push({ id: 'harden', turns: 2, magnitude: 1 });
    expect(landed(play(s, 'attack'), 'player')).toEqual([2]);   // 4 − 1 = 3, halved up = 2
    s.enemy.statuses.push({ id: 'exposed', turns: 2, magnitude: 1 });
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);   // 3 → 2 → ×2
    const s2 = fight(['attack'], seq('wall', [WAIT], { maxHp: 30, atk: 3, def: 3 }));
    s2.enemy.statuses.push({ id: 'harden', turns: 2, magnitude: 1 });
    expect(landed(play(s2, 'attack'), 'player')).toEqual([1]);  // 4 vs 3 def = 2 (half floor), halved = 1
  });

  it('the Shell Beetle: card 4 lands 3 through its armour, 2 while hardened, then 3 again', () => {
    const s = fight(['attack', 'attack', 'attack', 'attack'], 'shell_beetle' as unknown as Enemy);
    expect(landed(play(s, 'attack'), 'player')).toEqual([3]);   // Bite round
    expect(landed(play(s, 'attack'), 'player')).toEqual([3]);   // Shell round: your hit lands before the shell goes up
    expect(getStatus(s.enemy, 'harden')).toMatchObject({ turns: 1 });
    expect(landed(play(s, 'attack'), 'player')).toEqual([2]);   // the one hardened turn
    expect(hasStatus(s.enemy, 'harden')).toBe(false);
  });
});

describe('brace', () => {
  const BRACER = seq('bracer', [selfBuff('brace'), WAIT, WAIT]);

  it('is raised after your move, throws back your next landing hit, and is spent by it', () => {
    const s = fight(['attack', 'attack'], BRACER);
    const r1 = play(s, 'attack');
    expect(landed(r1, 'player')).toEqual([4]);
    expect(r1.some((e) => e.t === 'counter')).toBe(false);
    expect(getStatus(s.enemy, 'brace')).toMatchObject({ turns: 1 });
    const r2 = play(s, 'attack');
    expect(r2.find((e) => e.t === 'counter')).toMatchObject({ amount: 4, blocked: false });
    expect(idx(r2, expired('brace'))).toBeLessThan(idx(r2, (e) => e.t === 'counter'));  // gone before the counter lands
    expect(s.player.hp).toBe(21);
  });

  it('lapses at the end of your next turn if you do not hit', () => {
    const s = fight(['defend', 'defend', 'attack'], BRACER);
    play(s, 'defend');
    play(s, 'defend');                            // held back: brace ticks 1 → 0
    expect(hasStatus(s.enemy, 'brace')).toBe(false);
    const r3 = play(s, 'attack');
    expect(r3.some((e) => e.t === 'counter')).toBe(false);
  });
});

describe('scatter', () => {
  const SCATTERER = seq('scatterer', [selfBuff('scatter'), WAIT, WAIT]);

  it('is raised after your move, halves your next single hit, and is spent by it', () => {
    const s = fight(['attack', 'attack', 'attack'], SCATTERER);
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
    expect(getStatus(s.enemy, 'scatter')).toMatchObject({ turns: 1 });
    const r2 = play(s, 'attack');
    expect(landed(r2, 'player')).toEqual([2]);
    expect(idx(r2, expired('scatter'))).toBeLessThan(idx(r2, (e) => e.t === 'play' && e.side === 'enemy'));
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
  });

  it('lapses at the end of your next turn if you do not hit', () => {
    const s = fight(['defend', 'defend', 'attack'], SCATTERER);
    play(s, 'defend');
    play(s, 'defend');
    expect(hasStatus(s.enemy, 'scatter')).toBe(false);
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
  });
});

describe('exposed', () => {
  it('an enemy Hex (turns 2) covers the next round: its next attack is doubled, then it is gone', () => {
    const HEXER = seq('hexer', [hex('exposed'), POKE, WAIT]);
    const s = fight(['attack', 'attack', 'attack'], HEXER);
    const r1 = play(s, 'attack');
    expect(idx(r1, applied('exposed', 'player'))).toBeLessThan(idx(r1, roundStart));
    expect(getStatus(s.player, 'exposed')).toMatchObject({ turns: 1 });
    expect(r1.find((e) => e.t === 'intent')).toMatchObject({ predictedDamage: 4 }); // (3 − 1) × 2, promised for the Exposed round
    const r2 = play(s, 'attack');
    expect(landed(r2, 'enemy')).toEqual([4]);
    expect(idx(r2, expired('exposed', 'player'))).toBeGreaterThan(idx(r2, (e) => e.t === 'damage' && e.source === 'enemy'));
    expect(idx(r2, expired('exposed', 'player'))).toBeLessThan(idx(r2, roundStart));
    expect(hasStatus(s.player, 'exposed')).toBe(false);
  });

  it('Broadsword (self, turns 1) doubles this round\'s enemy hit only', () => {
    const s = fight(['broadsword', 'attack'], DUMMY);
    const r1 = play(s, 'broadsword');
    expect(landed(r1, 'enemy')).toEqual([4]);     // (3 − 1) × 2
    expect(idx(r1, expired('exposed', 'player'))).toBeLessThan(idx(r1, roundStart));
    expect(landed(play(s, 'attack'), 'enemy')).toEqual([2]);
  });

  it('Exposing Strike (enemy, turns 2) doubles your next hit only', () => {
    const s = fight(['exposing_strike', 'attack', 'attack'], PASSIVE);
    expect(landed(play(s, 'exposing_strike'), 'player')).toEqual([3]);  // 75%; the strike itself is not doubled
    expect(getStatus(s.enemy, 'exposed')).toMatchObject({ turns: 1 });
    expect(landed(play(s, 'attack'), 'player')).toEqual([8]);
    expect(hasStatus(s.enemy, 'exposed')).toBe(false);
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
  });

  it('a second Exposed adds rounds, never multiplies', () => {
    const s = fight(['bind_wound', 'attack'], seq('hexer2', [hex('exposed'), POKE, POKE]));
    play(s, 'bind_wound');                        // self 2, then Hex +2 → 4, ticks to 3
    expect(getStatus(s.player, 'exposed')).toMatchObject({ turns: 3 });
    expect(landed(play(s, 'attack'), 'enemy')).toEqual([4]);  // ×2, not ×4
  });
});

describe('weak', () => {
  it('Shield Bash (self, turns 2) halves your next turn, not this one', () => {
    const s = fight(['shield_bash', 'attack', 'attack'], PASSIVE);
    expect(landed(play(s, 'shield_bash'), 'player')).toEqual([1]);  // round(4 × 0.25), at full strength
    expect(getStatus(s.player, 'weak')).toMatchObject({ turns: 1 });
    expect(landed(play(s, 'attack'), 'player')).toEqual([2]);        // floor(4 × 0.5)
    expect(hasStatus(s.player, 'weak')).toBe(false);
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
  });

  it('an enemy Weak (turns 2) halves your next turn only, and halves before defence', () => {
    const WEAKENER = seq('weakener', [hex('weak'), WAIT, WAIT], { maxHp: 30, atk: 3, def: 1 });
    const s = fight(['attack', 'attack', 'attack'], WEAKENER);
    expect(landed(play(s, 'attack'), 'player')).toEqual([3]);
    expect(landed(play(s, 'attack'), 'player')).toEqual([1]);        // floor(4 × 0.5) = 2, − 1 def = 1
    expect(hasStatus(s.player, 'weak')).toBe(false);
    expect(landed(play(s, 'attack'), 'player')).toEqual([3]);
  });
});

describe('guard and ward never tick', () => {
  it('your Guard waits through idle rounds and is spent by the first physical hit', () => {
    const s = fight(['defend', 'defend', 'defend', 'defend'], seq('lurker', [WAIT, WAIT, WAIT, POKE]));
    play(s, 'defend'); play(s, 'defend'); play(s, 'defend');
    expect(getStatus(s.player, 'guard')).toMatchObject({ magnitude: 3 });  // capped at 3 after three Defends
    const r4 = play(s, 'defend');                 // a 4th Defend cannot pass the cap; the poke spends one stack
    expect(r4.find((e) => e.t === 'damage' && e.source === 'enemy')).toMatchObject({ blocked: true });
    expect(getStatus(s.player, 'guard')).toMatchObject({ magnitude: 2 });
  });

  it('an enemy Guard stays up until a physical hit spends it; magic walks through', () => {
    const s = fight(['defend', 'defend', 'lightning', 'attack', 'attack'], seq('guarder', [GUARD, WAIT, WAIT, WAIT, WAIT]));
    play(s, 'defend');
    play(s, 'defend');
    expect(hasStatus(s.enemy, 'guard')).toBe(true);
    expect(landed(play(s, 'lightning'), 'player')).toEqual([6]);   // round(4 × 1.6), ignoring def, not blocked
    expect(hasStatus(s.enemy, 'guard')).toBe(true);
    const r4 = play(s, 'attack');
    expect(r4.find((e) => e.t === 'damage' && e.source === 'player')).toMatchObject({ blocked: true });
    expect(idx(r4, expired('guard'))).toBeLessThan(idx(r4, (e) => e.t === 'damage'));  // the chip goes as the hit is blocked
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
  });

  it('your Ward waits for a spell or a curse, and physical blows pass it', () => {
    const s = fight(['ward', 'attack', 'attack', 'attack'], seq('witch', [POKE, WAIT, SPELL, hex('curse', 4)]));
    const r1 = play(s, 'ward');
    expect(landed(r1, 'enemy')).toEqual([2]);
    play(s, 'attack');
    expect(getStatus(s.player, 'ward')).toMatchObject({ magnitude: 1 });
    const r3 = play(s, 'attack');
    expect(r3.find((e) => e.t === 'damage' && e.source === 'enemy')).toMatchObject({ blocked: true, kind: 'magic' });
    expect(hasStatus(s.player, 'ward')).toBe(false);
    const r4 = play(s, 'attack');                 // no ward left: the curse lands
    expect(r4.some(applied('curse', 'player'))).toBe(true);
  });
});

describe('aegis', () => {
  it('Stand Firm (turns 2) covers this round and the next, then expires; burn still ticks under it', () => {
    const s = fight(['stand_firm', 'attack', 'attack'], DUMMY);
    s.player.statuses.push({ id: 'burn', turns: 3, magnitude: 1 });
    const r1 = play(s, 'stand_firm');
    expect(r1.find((e) => e.t === 'damage' && e.source === 'enemy')).toMatchObject({ blocked: true });
    expect(r1.find((e) => e.t === 'burn' && e.side === 'player')).toMatchObject({ amount: 1 });
    expect(getStatus(s.player, 'aegis')).toMatchObject({ turns: 1 });
    const r2 = play(s, 'attack');
    expect(r2.find((e) => e.t === 'damage' && e.source === 'enemy')).toMatchObject({ blocked: true });
    expect(idx(r2, expired('aegis', 'player'))).toBeLessThan(idx(r2, roundStart));
    expect(landed(play(s, 'attack'), 'enemy')).toEqual([2]);
    expect(s.player.hp).toBe(25 - 3 - 2);
  });
});

describe('burn and curse tick at every round end, the first the same round', () => {
  it('Fireball\'s Burn 2 for 2 rounds is two ticks, the first before the next round starts', () => {
    const s = fight(['fireball', 'defend', 'defend'], PASSIVE);
    const r1 = play(s, 'fireball');               // 6 magic, then 2 burn
    expect(s.enemy.hp).toBe(22);
    expect(idx(r1, (e) => e.t === 'burn')).toBeGreaterThan(idx(r1, (e) => e.t === 'play' && e.side === 'enemy'));
    expect(idx(r1, (e) => e.t === 'burn')).toBeLessThan(idx(r1, roundStart));
    expect(getStatus(s.enemy, 'burn')).toMatchObject({ turns: 1, magnitude: 2 });
    const r2 = play(s, 'defend');
    expect(s.enemy.hp).toBe(20);
    expect(idx(r2, expired('burn'))).toBeGreaterThan(idx(r2, (e) => e.t === 'burn'));
    play(s, 'defend');
    expect(s.enemy.hp).toBe(20);
  });

  it('a Curse (turns 4) bites four times, halves healing the whole way, and ticks after the enemy\'s', () => {
    const s = fight(['attack', 'attack', 'attack', 'attack', 'bind_wound'], seq('curser', [hex('curse', 4), WAIT, WAIT, WAIT, WAIT]));
    s.enemy.statuses.push({ id: 'burn', turns: 9, magnitude: 1 });
    const r1 = play(s, 'attack');
    expect(s.player.hp).toBe(24);
    const burns = r1.filter((e) => e.t === 'burn');
    expect(burns.map((e) => (e.t === 'burn' ? e.side : ''))).toEqual(['enemy', 'player']);
    expect(getStatus(s.player, 'curse')).toMatchObject({ turns: 3 });
    play(s, 'attack'); play(s, 'attack');
    expect(s.player.hp).toBe(22);
    const r4 = play(s, 'bind_wound');            // 25% of 25 = 6, halved to 3; then the last tick
    expect(r4.find((e) => e.t === 'heal')).toMatchObject({ amount: 3 });
    expect(s.player.hp).toBe(24);
    expect(hasStatus(s.player, 'curse')).toBe(false);
  });
});

describe('chill', () => {
  it('never ticks; the enemy\'s next action is skipped and its rotation still moves on', () => {
    const s = fight(['defend', 'defend', 'attack'], seq('chilly', [WAIT, POKE, WAIT]));
    s.enemy.statuses.push({ id: 'chill', turns: 1, magnitude: 1 });
    expect(s.enemy.current.id).toBe('wait');
    const r1 = play(s, 'defend');                 // the Wait is the skipped action: chill is not saved for the poke
    expect(r1.some((e) => e.t === 'chilled')).toBe(true);
    expect(r1.some((e) => e.t === 'play' && e.side === 'enemy')).toBe(false);
    expect(hasStatus(s.enemy, 'chill')).toBe(false);
    expect(s.enemy.current.id).toBe('poke');
    const r2 = play(s, 'defend');
    expect(r2.find((e) => e.t === 'damage' && e.source === 'enemy')).toMatchObject({ blocked: true });
  });
});

describe('stun (Recovering)', () => {
  it('turns N skips N of your turns, counting down one per round, and the enemy keeps acting', () => {
    const s = fight(['attack', 'attack', 'attack'], DUMMY);
    s.player.statuses.push({ id: 'stun', turns: 2, magnitude: 1 });
    const r1 = step(s, { type: 'card', index: 0 });
    expect(r1.find((e) => e.t === 'stunned')).toMatchObject({ turnsLeft: 1 });
    expect(landed(r1, 'player')).toEqual([]);
    expect(landed(r1, 'enemy')).toEqual([2]);
    const r2 = step(s, { type: 'skip' });
    expect(r2.find((e) => e.t === 'stunned')).toMatchObject({ turnsLeft: 0 });
    expect(idx(r2, expired('stun', 'player'))).toBeLessThan(idx(r2, roundStart));
    expect(landed(play(s, 'attack'), 'player')).toEqual([4]);
  });
});

describe('duos: every status event names its enemy slot', () => {
  it('a rear enemy\'s self-buff is tagged to it, and your self-status keeps your side', () => {
    const SHELLER = seq('sheller', [selfBuff('harden'), WAIT, WAIT]);
    const s = fight(['defend', 'attack', 'attack'], [DUMMY, SHELLER]);
    // Two living enemies, two cards a turn (DECISIONS #68): they act after the second.
    const r1 = play(s, 'defend', 1);
    expect(r1.find(applied('guard', 'player'))).toMatchObject({ side: 'player', who: 1 }); // tagged with the target slot, read by side
    const r1b = play(s, 'attack', 0);
    expect(r1b.find(applied('harden'))).toMatchObject({ who: 1 });
    expect(hasStatus(s.enemies[0]!, 'harden')).toBe(false);
    expect(getStatus(s.enemies[1]!, 'harden')).toMatchObject({ turns: 1 });
    expect(landed(play(s, 'attack', 0), 'player')).toEqual([4]);   // the front dummy is not hardened
    play(s, 'attack', 0);                                           // round 2 ends
    const r3 = play(s, 'attack', 1);
    expect(landed(r3, 'player')).toEqual([4]);                     // the shell lapsed at the end of round 2
    expect(r3.find((e) => e.t === 'damage' && e.source === 'player')).toMatchObject({ who: 1 });
  });
});

describe('card preview (what the headline will say)', () => {
  const dmg = { type: 'damage', mult: 1 } as const;
  const vs = (def: number, statuses: { id: StatusId; turns: number; magnitude: number }[] = [], attackerStatuses: typeof statuses = []) => {
    const s = fight(['attack'], seq('t', [WAIT], { maxHp: 30, atk: 3, def }));
    s.enemy.statuses.push(...statuses);
    s.player.statuses.push(...attackerStatuses);
    return s;
  };
  const st = (id: StatusId, magnitude = 1) => ({ id, turns: 2, magnitude });

  it('matches computeHit for armour, Harden, Exposed, Weak and Scatter, and names each', () => {
    const s0 = vs(0);
    expect(previewDamage(s0.player, s0.enemy, dmg)).toEqual({ hits: [{ amount: 4, blocked: false }], reasons: [] });
    const s1 = vs(1);
    expect(previewDamage(s1.player, s1.enemy, dmg)).toEqual({ hits: [{ amount: 3, blocked: false }], reasons: ['armour'] });
    const s2 = vs(1, [st('harden')]);
    expect(previewDamage(s2.player, s2.enemy, dmg)).toEqual({ hits: [{ amount: 2, blocked: false }], reasons: ['armour', 'hardened'] });
    const s3 = vs(1, [st('exposed')]);
    expect(previewDamage(s3.player, s3.enemy, dmg)).toEqual({ hits: [{ amount: 6, blocked: false }], reasons: ['armour', 'exposed'] });
    const s4 = vs(1, [st('harden')], [st('weak')]);
    expect(previewDamage(s4.player, s4.enemy, dmg)).toEqual({ hits: [{ amount: 1, blocked: false }], reasons: ['weak', 'armour', 'hardened'] });
    const s5 = vs(0, [st('scatter')]);
    expect(previewDamage(s5.player, s5.enemy, dmg)).toEqual({ hits: [{ amount: 2, blocked: false }], reasons: ['scattered'] });
    // Every preview equals what the engine then deals.
    for (const s of [s0, s1, s2, s3, s4, s5]) {
      const want = previewDamage(s.player, s.enemy, dmg).hits[0]!.amount;
      expect(landed(play(s, 'attack'), 'player')).toEqual([want]);
    }
  });

  it('spends blocks in order: Guard stops physical hits, Ward magic, Aegis all; the rest land', () => {
    const s = vs(0, [st('guard', 1)]);
    expect(previewDamage(s.player, s.enemy, dmg)).toEqual({ hits: [{ amount: 0, blocked: true }], reasons: ['guarded'] });
    expect(previewDamage(s.player, s.enemy, { ...dmg, kind: 'magic' })).toEqual({ hits: [{ amount: 4, blocked: false }], reasons: [] });
    expect(previewDamage(s.player, s.enemy, { ...dmg, hits: 3 })).toEqual({ hits: [{ amount: 0, blocked: true }, { amount: 4, blocked: false }, { amount: 4, blocked: false }], reasons: ['guarded'] });
    const w = vs(0, [st('ward', 1)]);
    expect(previewDamage(w.player, w.enemy, { ...dmg, kind: 'magic' })).toEqual({ hits: [{ amount: 0, blocked: true }], reasons: ['warded'] });
    expect(previewDamage(w.player, w.enemy, dmg).hits[0]).toEqual({ amount: 4, blocked: false });
    const a = vs(0, [st('aegis')]);
    expect(previewDamage(a.player, a.enemy, { ...dmg, hits: 2 })).toEqual({ hits: [{ amount: 0, blocked: true }, { amount: 0, blocked: true }], reasons: ['aegis'] });
  });
});
