import type { Effect, Enemy, EnemyId, EnemyMove, Intent, Posture, SkillId, Stats, Status, StatusId } from '@data/types';

export type Side = 'player' | 'enemy';

export interface Combatant {
  side: Side;
  name: string;
  hp: number;
  stats: Stats;
  statuses: Status[];
}

export interface PlayerCombatant extends Combatant {
  side: 'player';
  deck: SkillId[];
  hand: SkillId[];     // index 0 is the oldest card
  discard: SkillId[];
}

export interface EnemyCombatant extends Combatant {
  side: 'enemy';
  enemyId: EnemyId;
  phase: number;       // 0 = base table, 1.. = phases[i-1]
  seqIndex: number;    // cursor into a sequence table
  current: EnemyMove;  // this round's move (shown as intent)
  next: EnemyMove;     // next round's move (shown as posture tell)
}

export type Outcome = 'ongoing' | 'won' | 'lost';

export interface CombatState {
  /** Run-local tome upgrades (quest rewards): level per skill id. */
  skillUpgrades: Record<SkillId, number>;
  round: number;
  outcome: Outcome;
  player: PlayerCombatant;
  enemy: EnemyCombatant;
  enemyDef: Enemy;     // the content definition (data, serialisable)
  rngState: number;    // combat stream snapshot, for save/resume
  log: CombatEvent[];  // everything that has happened, in order
}

export type PlayerAction =
  | { type: 'card'; index: number }
  /** Hold back: discard this card and pass the turn. The universal out for a trap turn. */
  | { type: 'hold'; index: number }
  /** Only valid while Recovering (stunned) or with an empty hand: the turn passes. */
  | { type: 'skip' };

export type CombatEvent =
  | { t: 'roundStart'; round: number }
  | { t: 'deal'; skill: SkillId; hand: SkillId[] }
  | { t: 'handOverflow'; discarded: SkillId }
  | { t: 'reshuffle'; count: number }
  | { t: 'intent'; intent: Intent; posture: Posture; predictedDamage: number; moveName: string }
  | { t: 'play'; side: Side; skill: SkillId; name: string }
  | { t: 'hold'; skill: SkillId }
  | { t: 'counter'; amount: number; blocked: boolean }
  | { t: 'damage'; source: Side; target: Side; amount: number; blocked: boolean; hit: number; hits: number }
  | { t: 'heal'; side: Side; amount: number }
  | { t: 'statusApplied'; side: Side; status: StatusId; turns: number; magnitude: number }
  | { t: 'statusResisted'; side: Side; status: StatusId }
  | { t: 'statusExpired'; side: Side; status: StatusId }
  | { t: 'burn'; side: Side; amount: number; status: 'burn' | 'curse' }
  | { t: 'chilled'; side: Side }
  | { t: 'stunned'; side: Side; turnsLeft: number }
  | { t: 'phase'; phase: number }
  | { t: 'death'; side: Side }
  | { t: 'end'; outcome: Exclude<Outcome, 'ongoing'> };

export interface EffectContext {
  self: Combatant;
  other: Combatant;
  events: CombatEvent[];
  roll: () => number;  // uniform [0,1) from the combat stream
}

export type { Effect };
