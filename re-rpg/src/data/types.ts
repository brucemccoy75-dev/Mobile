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
}

export type StatusId = 'exposed' | 'guard' | 'burn' | 'chill' | 'weak' | 'stun' | 'brace' | 'scatter' | 'curse' | 'harden';

/** A status instance on a combatant. `turns` ticks down at end of round; Guard and Chill are consumed instead. Stun: the player skips their turn while it lasts (turns N = N-1 skipped turns when self-applied). */
export interface Status {
  id: StatusId;
  turns: number;
  /** Guard: hits remaining. Burn: damage per tick. Others unused. */
  magnitude: number;
}

export type Target = 'self' | 'enemy';

export type Effect =
  | { type: 'damage'; mult: number; flat?: number; hits?: number; ignoreDef?: boolean; lifesteal?: number }
  | { type: 'heal'; pct?: number; flat?: number }
  | { type: 'status'; target: Target; status: StatusId; turns: number; magnitude?: number; chance?: number };

export interface Skill {
  id: SkillId;
  name: string;
  text: string;
  classId: ClassId | 'any';
  setId?: SetId;
  rarity: Rarity;
  effects: Effect[];
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
  | { kind: 'attack'; mult: number; hits: number; ignoreDef?: boolean; drain?: boolean }
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
