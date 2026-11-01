import type { VfxKind } from '@core/vfx';
import type { CursedTrait, DamageKind, Effect, Enemy, EnemyId, EnemyTraits, EnemyMove, Intent, Posture, SkillId, Stats, Status, StatusId } from '@data/types';

export type Side = 'player' | 'enemy';

/** A playing card dealt for blackjack (DECISIONS #69, #88). */
export interface PlayingCard { rank: string; suit: string; value: number }

export interface Combatant {
  side: Side;
  name: string;
  hp: number;
  stats: Stats;
  statuses: Status[];
  /** A cursed enemy's combat traits (DECISIONS #73): shield, thorns, followUp. */
  cursed?: CursedTrait[];
  /** What the player's equipment does in a fight beyond stats (DECISIONS #82). */
  gear?: Gear;
  /** An enemy's weaknesses and habits (DECISIONS #83). */
  traits?: EnemyTraits;
  /** Extra damage share right now (a Vespa's frenzy, DECISIONS #83); kept current by the engine. */
  boost?: number;
}

/** Equipment powers in combat (DECISIONS #82): statuses that never land, a chance to pierce blocks, a paid reshuffle. */
export interface Gear {
  /** These statuses never land on the wearer (Earthen Armor: Weak). */
  immune?: StatusId[];
  /** Chance per hit to go straight through Guard, Ward or Aegis, leaving the block up (Earthen Blade: 0.5). */
  pierce?: number;
  /** Once per fight: shuffle hand, deck and discard together and deal a fresh hand (Earthen Relic). */
  redraw?: boolean;
  /** HP the wearer loses for every card played that deals damage (the Doomsday pieces, DECISIONS #84). */
  selfDamage?: number;
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
  /** Flat damage each growing card has gained this run (DECISIONS #73), carried in and out of the fight. */
  growth: Record<SkillId, number>;
  /** The Earthen Relic's reshuffle has been used this fight (DECISIONS #82). */
  redrawUsed?: boolean;
  /** Blackjack's running total (DECISIONS #69, #71): the drawn cards plus the damage dealt since. */
  blackjackTotal?: number;
  /** Aces in that total still counted as 11 (each can drop to 1 rather than bust). */
  blackjackSoft?: number;
  log: CombatEvent[];  // everything that has happened, in order
}

export type PlayerAction =
  /** `target` is an enemy slot; omitted or dead → the first living enemy. */
  | { type: 'card'; index: number; target?: number; /** A coin card's call (DECISIONS #69); heads when omitted. */ call?: 'heads' | 'tails';
      /** A blackjack card's hits after the first two cards (DECISIONS #88); omitted = hit until 17 (the sim). */ bjHits?: number }
  /** Hold back: discard this card and pass the turn. The universal out for a trap turn. */
  | { type: 'hold'; index: number }
  /** Only valid while Recovering (stunned), with an empty hand, or with nothing playable (Regen, #69): the turn passes. */
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
  | { t: 'damage'; source: Side; target: Side; amount: number; blocked: boolean; hit: number; hits: number; kind: DamageKind; crit?: boolean; who?: number; volley?: number; /** A cursed enemy's follow-up (#73). */ followUp?: boolean }
  /** A cursed enemy's thorns hurt the attacker (DECISIONS #73). */
  | { t: 'thorns'; amount: number; who?: number }
  /** Luck (DECISIONS #50): the card just played lands every hit at +50%. */
  | { t: 'crit' }
  /** Luck (DECISIONS #50): the enemies wait; the player plays again this round. */
  | { t: 'bonusTurn' }
  /** The turn goes on: this many cards still to play before the enemies act (DECISIONS #68). */
  | { t: 'plays'; left: number }
  /** A coin card (DECISIONS #69): what was called, what landed. */
  | { t: 'coin'; call: 'heads' | 'tails'; result: 'heads' | 'tails'; won: boolean }
  /** Blackjack (DECISIONS #69): the running total of damage dealt, and the bust that ends you. */
  | { t: 'blackjack'; total: number }
  /** Playing Blackjack draws a playing card onto the total (DECISIONS #71). */
  | { t: 'blackjackDraw'; rank: string; suit: string; value: number; total: number }
  /** A hand of blackjack against 16 (DECISIONS #88): the cards, the total, and whether it beat 16. */
  | { t: 'blackjackHand'; cards: PlayingCard[]; total: number; won: boolean }
  | { t: 'bust'; total: number }
  /** The card did not kill: it turns on the player (DECISIONS #51). */
  | { t: 'backfire'; amount: number }
  | { t: 'heal'; side: Side; amount: number; who?: number }
  | { t: 'statusApplied'; side: Side; status: StatusId; turns: number; magnitude: number; who?: number }
  | { t: 'statusResisted'; side: Side; status: StatusId; warded?: boolean; /** Gear made the wearer immune (DECISIONS #82). */ immune?: boolean; who?: number }
  /** A hit went through a block (Earthen Blade, DECISIONS #82); the block stays. */
  | { t: 'pierce'; who?: number }
  /** Doomsday gear's recoil (DECISIONS #84): the wearer pays for an attack. */
  | { t: 'recoil'; amount: number }
  /** The Earthen Relic's reshuffle (DECISIONS #82): every card back in, shuffled, a fresh hand. */
  | { t: 'redraw'; count: number }
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
