import type { VfxKind } from '@core/vfx';
import type { DamageKind, Effect, Enemy, EnemyId, EnemyMove, Intent, Posture, SkillId, Stats, Status, StatusId } from '@data/types';

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
  /** Once-per-fight cards already played: out until the next fight. */
  exhausted: SkillId[];
  /** Fleeting tomes played this fight: the run must delete them from the deck afterwards. */
  consumed: SkillId[];
}

export interface EnemyCombatant extends Combatant {
  side: 'enemy';
  enemyId: EnemyId;
  /** Position in state.enemies; events name enemies by this (`who`). */
  slot: number;
  /** Dead enemies stay in the array (the log and the scene still refer to them) but never act. */
  dead: boolean;
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
  /** Every enemy in the fight, slot order (front first). One for singles, two for duos (DECISIONS #29). */
  enemies: EnemyCombatant[];
  enemyDefs: Enemy[];
  /** Aliases of slot 0 (the same objects), kept for the many single-enemy call sites and tests. */
  enemy: EnemyCombatant;
  enemyDef: Enemy;     // the content definition (data, serialisable)
  rngState: number;    // combat stream snapshot, for save/resume
  /** A luck bonus turn was taken this round (one per round, DECISIONS #50). */
  bonusTaken?: boolean;
  /** Cards still to play before the enemies act (DECISIONS #68): one per enemy alive when the turn began, +1 for a bonus turn. */
  playsLeft: number;
  log: CombatEvent[];  // everything that has happened, in order
}

export type PlayerAction =
  /** `target` is an enemy slot; omitted or dead → the first living enemy. */
  | { type: 'card'; index: number; target?: number }
  /** Hold back: discard this card and pass the turn. The universal out for a trap turn. */
  | { type: 'hold'; index: number }
  /** Only valid while Recovering (stunned) or with an empty hand: the turn passes. */
  | { type: 'skip' };

/**
 * `who` is the enemy slot an event concerns (source or target); absent means slot 0 / not enemy-specific.
 * `volley` marks the events of hit N of a sweep (DECISIONS #47): they land on every enemy at once.
 */
export type CombatEvent =
  | { t: 'roundStart'; round: number }
  | { t: 'deal'; skill: SkillId; hand: SkillId[] }
  | { t: 'handOverflow'; discarded: SkillId }
  | { t: 'reshuffle'; count: number }
  | { t: 'intent'; intent: Intent; posture: Posture; predictedDamage: number; moveName: string; who?: number }
  | { t: 'play'; side: Side; skill: SkillId; name: string; who?: number; /** The battle effect to draw (DECISIONS #59). */ vfx?: VfxKind }
  | { t: 'hold'; skill: SkillId }
  | { t: 'exhaust'; skill: SkillId }
  | { t: 'consumed'; skill: SkillId }
  | { t: 'counter'; amount: number; blocked: boolean; who?: number; volley?: number }
  | { t: 'damage'; source: Side; target: Side; amount: number; blocked: boolean; hit: number; hits: number; kind: DamageKind; crit?: boolean; who?: number; volley?: number }
  /** Luck (DECISIONS #50): the card just played lands every hit at +50%. */
  | { t: 'crit' }
  /** Luck (DECISIONS #50): the enemies wait; the player plays again this round. */
  | { t: 'bonusTurn' }
  /** The turn goes on: this many cards still to play before the enemies act (DECISIONS #68). */
  | { t: 'plays'; left: number }
  /** The card did not kill: it turns on the player (DECISIONS #51). */
  | { t: 'backfire'; amount: number }
  | { t: 'heal'; side: Side; amount: number; who?: number }
  | { t: 'statusApplied'; side: Side; status: StatusId; turns: number; magnitude: number; who?: number }
  | { t: 'statusResisted'; side: Side; status: StatusId; warded?: boolean; who?: number }
  | { t: 'statusExpired'; side: Side; status: StatusId; stripped?: boolean; who?: number; volley?: number }
  | { t: 'burn'; side: Side; amount: number; status: 'burn' | 'curse'; who?: number }
  | { t: 'chilled'; side: Side; who?: number }
  | { t: 'stunned'; side: Side; turnsLeft: number }
  | { t: 'phase'; phase: number; who?: number }
  | { t: 'death'; side: Side; who?: number }
  | { t: 'end'; outcome: Exclude<Outcome, 'ongoing'> };

export interface EffectContext {
  self: Combatant;
  other: Combatant;
  events: CombatEvent[];
  roll: () => number;  // uniform [0,1) from the combat stream
}

export type { Effect };
