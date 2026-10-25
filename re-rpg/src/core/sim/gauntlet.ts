import { getClass, getEnemy, getSet, enemiesOfTier } from '@data/index';
import type { ClassId, Enemy, SkillId, Stats } from '@data/types';
import { RunRng } from '@core/rng';
import { createCombat, step, type CombatState } from '@core/combat';
import type { Policy } from './policy';

export interface Loadout {
  label: string;
  classId: ClassId;
  deck: SkillId[];
  statMods?: Partial<Stats>;
}

export interface GauntletOptions {
  loadout: Loadout;
  /** Number of random tier fights before the boss. */
  fights: number;
  tier: 1 | 2;
  boss: string;
  policy: Policy;
  seed: string;
}

export interface GauntletResult {
  reachedBoss: boolean;
  beatBoss: boolean;
  fightsWon: number;
  hpAtBoss: number;
  rounds: number;
  deathBy?: string;
}

/** Stat mods are additive bonuses on top of the class base. */
export function withMods(base: Stats, mods?: Partial<Stats>): Stats {
  return { maxHp: base.maxHp + (mods?.maxHp ?? 0), atk: base.atk + (mods?.atk ?? 0), def: base.def + (mods?.def ?? 0), gearAtk: mods?.atk ?? 0 };
}

export function runFight(s: CombatState, policy: Policy, maxRounds = 60): CombatState {
  while (s.outcome === 'ongoing' && s.round < maxRounds) step(s, policy(s));
  return s;
}

export function runGauntlet(o: GauntletOptions): GauntletResult {
  const cls = getClass(o.loadout.classId);
  const stats = withMods(cls.stats, o.loadout.statMods);
  const rng = new RunRng(o.seed);
  const pool = enemiesOfTier(o.tier);
  let hp = stats.maxHp;
  let rounds = 0;
  let fightsWon = 0;

  const fight = (enemy: Enemy) => {
    const s = createCombat({ player: { stats, hp, deck: o.loadout.deck }, enemy, rng: rng.stream('combat') });
    runFight(s, o.policy);
    rounds += s.round;
    hp = s.player.hp;
    return s.outcome === 'won';
  };

  for (let i = 0; i < o.fights; i++) {
    const enemy = rng.stream('encounter').pick(pool);
    if (!fight(enemy)) return { reachedBoss: false, beatBoss: false, fightsWon, hpAtBoss: 0, rounds, deathBy: enemy.id };
    fightsWon++;
  }
  const hpAtBoss = hp;
  const boss = getEnemy(o.boss);
  const beat = fight(boss);
  return { reachedBoss: true, beatBoss: beat, fightsWon: fightsWon + (beat ? 1 : 0), hpAtBoss, rounds, deathBy: beat ? undefined : boss.id };
}

export interface Summary {
  label: string;
  runs: number;
  reachBossPct: number;
  beatBossPct: number;
  avgHpAtBoss: number;
  avgFightsWon: number;
  avgRounds: number;
  deaths: Record<string, number>;
}

export function summarize(label: string, results: GauntletResult[]): Summary {
  const n = results.length;
  const reached = results.filter((r) => r.reachedBoss);
  const deaths: Record<string, number> = {};
  for (const r of results) if (r.deathBy) deaths[r.deathBy] = (deaths[r.deathBy] ?? 0) + 1;
  return {
    label, runs: n,
    reachBossPct: (100 * reached.length) / n,
    beatBossPct: (100 * results.filter((r) => r.beatBoss).length) / n,
    avgHpAtBoss: reached.length ? reached.reduce((s, r) => s + r.hpAtBoss, 0) / reached.length : 0,
    avgFightsWon: results.reduce((s, r) => s + r.fightsWon, 0) / n,
    avgRounds: results.reduce((s, r) => s + r.rounds, 0) / n,
    deaths,
  };
}

/** A plausible full equipment kit for a screen: what body + weapon + relic add up to by then. */
export const GEAR_KIT: Record<1 | 2, Partial<Stats>> = {
  1: { maxHp: 5, atk: 2, def: 1 },
  2: { maxHp: 10, atk: 4, def: 2 },
};

/** Standard loadouts: fresh (basics only), set (two set tomes), set + the screen's gear kit, double set. */
export function standardLoadouts(classId: ClassId, gearTier: 1 | 2 = 1): Loadout[] {
  const cls = getClass(classId);
  const gear = GEAR_KIT[gearTier];
  const [setA, setB] = cls.sets.map((id) => getSet(id)) as [ReturnType<typeof getSet>, ReturnType<typeof getSet>];
  return [
    { label: `${classId} fresh`, classId, deck: [] },
    { label: `${classId} ${setA.name}`, classId, deck: setA.skills },
    { label: `${classId} ${setB.name}`, classId, deck: setB.skills },
    { label: `${classId} ${setA.name}+gear${gearTier}`, classId, deck: setA.skills, statMods: gear },
    { label: `${classId} ${setB.name}+gear${gearTier}`, classId, deck: setB.skills, statMods: gear },
    { label: `${classId} both sets+gear${gearTier}`, classId, deck: [...setA.skills, ...setB.skills], statMods: gear },
  ];
}
