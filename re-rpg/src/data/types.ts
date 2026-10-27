// Content types. Everything the game knows about classes, skills, items and
// enemies is data of these shapes. See docs/ARCHITECTURE.md §3.

export type ClassId = 'warrior' | 'wizard' | 'shaman';
export type SetId = string;
export type SkillId = string;
export type EnemyId = string;
export type Rarity = 'basic' | 'common' | 'uncommon' | 'rare' | 'boss';

export interface Stats {
  maxHp: number;
  atk: number;
  def: number;
  /** The part of `atk` that comes from gear. Added flat to every hit, never multiplied by a card (DECISIONS #31). */
  gearAtk?: number;
  /** Luck (DECISIONS #50): luck × 1.2% is the chance of a critical hit and of a bonus turn per card, and it adds to the rare odds of rewards and the shop. */
  luck?: number;
}

/** guard blocks the next physical hit; ward the next magic hit; aegis every hit for N rounds. */
export type StatusId = 'exposed' | 'guard' | 'ward' | 'aegis' | 'burn' | 'chill' | 'weak' | 'stun' | 'brace' | 'scatter' | 'curse' | 'harden';

export type DamageKind = 'physical' | 'magic';

/** A status instance on a combatant. `turns` ticks down at end of round; Guard and Chill are consumed instead. Stun: the player skips their turn while it lasts (turns N = N-1 skipped turns when self-applied). */
export interface Status {
  id: StatusId;
  turns: number;
  /** Guard: hits remaining. Burn: damage per tick. Others unused. */
  magnitude: number;
}

export type Target = 'self' | 'enemy';

export type Effect =
  | { type: 'damage'; targets?: 'all'; mult: number; flat?: number; hits?: number; ignoreDef?: boolean; lifesteal?: number; kind?: DamageKind }
  | { type: 'heal'; pct?: number; flat?: number }
  /** `kind: 'magic'` on a hostile status means Ward (or Aegis) blocks it like a spell. */
  | { type: 'status'; target: Target; status: StatusId; turns: number; magnitude?: number; chance?: number; kind?: DamageKind }
  /** Removes these statuses from the enemy before the hit (DECISIONS #48); `targets: 'all'` strips every living enemy. */
  | { type: 'strip'; statuses: StatusId[]; targets?: 'all' };

/** How often a tome may be played. Default: every time it is drawn. */
export type SkillUses = 'once_per_fight' | 'fleeting';

export interface Skill {
  id: SkillId;
  name: string;
  text: string;
  classId: ClassId | 'any';
  setId?: SetId;
  rarity: Rarity;
  effects: Effect[];
  /** fleeting: the tome is destroyed when played (every special tome, DECISIONS #42). once_per_fight: exhausted when played, back next fight; supported by the engine, used by no card today. */
  uses?: SkillUses;
}

export interface SkillSet {
  id: SetId;
  classId: ClassId;
  name: string;
  skills: SkillId[];
}

export interface PlayerClass {
  id: ClassId;
  name: string;
  stats: Stats;
  sets: SetId[];
}

/** What the player sees above the enemy: the move for this round. */
export type Intent =
  | { kind: 'attack'; mult: number; hits: number; ignoreDef?: boolean; drain?: boolean; dmgType?: DamageKind }
  | { kind: 'guard'; hits: number }
  | { kind: 'debuff'; status: StatusId }
  | { kind: 'buff'; status: StatusId }
  | { kind: 'stagger' };

/** The tell for the round after: a posture, not a number. */
export type Posture = 'aggressive' | 'defensive' | 'sinister' | 'charging' | 'reeling' | 'countering' | 'evasive';

export interface EnemyMove {
  id: string;
  name: string;
  intent: Intent;
  posture: Posture;
  effects: Effect[];
}

export type MoveTable =
  | { kind: 'sequence'; moves: EnemyMove[] }
  | { kind: 'weighted'; moves: { move: EnemyMove; weight: number }[] };

export interface EnemyPhase {
  /** Enter this phase when hp / maxHp <= hpBelow. */
  hpBelow: number;
  table: MoveTable;
}

export interface Enemy {
  id: EnemyId;
  name: string;
  tier: 1 | 2 | 'boss1' | 'boss2';
  archetype: 'brute' | 'armored' | 'caster' | 'swarm' | 'boss';
  stats: Stats;
  table: MoveTable;
  phases?: EnemyPhase[];
  /** Texture base for the still (default `enemy_<id>`); run-time variants point at borrowed art. */
  art?: string;
  /** Tint over the still (a ghost is pale blue). */
  tint?: number;
}

export type Slot = 'body' | 'weapon' | 'relic';

/** Everything an item does is a modifier (ARCHITECTURE §3). Triggers arrive post-POC. */
export interface Modifier {
  stat?: Partial<Stats>;
}

export interface Item {
  id: string;
  name: string;
  slot: Slot;
  rarity: Rarity;
  text: string;
  /** Restrict to classes; omitted = any class. */
  classes?: ClassId[];
  /** Set ids this item synergises with; doubles its weight while that set is active. */
  tags?: SetId[];
  mods: Modifier[];
}
