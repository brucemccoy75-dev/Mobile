import { MOVES } from '@data/enemies';
import { getSkill } from '@data/index';
import type { ClassId, Enemy, EnemyMove, SkillId, Slot, Stats } from '@data/types';
import type { Tile } from '@core/map';

/**
 * Enemies that exist only because of what the player did (DECISIONS #36): a boss who swapped in
 * because of a grudge, and the ghost of your last death on this screen. Both are plain Enemy
 * definitions built at encounter time, so the combat engine never knows the difference.
 */

/** Wren takes the gate when her standing is this low or lower. */
export const WREN_GRUDGE = -2;

/** Wren, the rat-keeper, with your own weapon in her hand. Numbers sit a notch under Andre's; the rats make up the rest. */
export function wrenBoss(weaponName: string | null, weaponAtk: number): Enemy {
  const name = weaponName ?? 'bare hands';
  const swing = MOVES.hit('swing', `Your ${name}`, 1.0);
  const tide = MOVES.hit('rat_tide', 'Rat tide', 0.5, 'aggressive', 3);
  const whistle = MOVES.debuff('whistle', 'Whistle', 'weak', 2);
  const everything = MOVES.charge('everything', 'Everything she has', 1.9);
  return {
    id: 'wren', name: 'Wren, the rat-keeper', tier: 'boss1', archetype: 'boss',
    stats: { maxHp: 46, atk: 6 + Math.max(0, weaponAtk), def: 1 },
    table: { kind: 'sequence', moves: [swing, whistle, tide, everything] },
    phases: [{ hpBelow: 0.5, table: { kind: 'sequence', moves: [tide, MOVES.brace(), swing, everything] } }],
  };
}

export interface GhostRecord {
  classId: ClassId;
  screenIndex: number;
  tile: Tile;
  /** The node or guard whose fight it fell in; it joins that fight next time. */
  nodeId?: string;
  guardId?: string;
  deck: SkillId[];
  stats: Stats;
  equipment: Record<Slot, string | null>;
  /** Species that landed the blow. */
  killer: string;
  killerName: string;
  gold: number;
  /** Grows by one each time a run dies to it or beside it. */
  strength: number;
  at: number;
}

export const GHOST_ID = 'ghost';

/** Your ghost: your stats, your cards turned into a rotation. It knows what you knew. */
export function ghostDef(g: GhostRecord): Enemy {
  const moves: EnemyMove[] = [];
  for (const id of g.deck) {
    const sk = getSkill(id);
    if (sk.rarity === 'basic') continue;
    const dmg = sk.effects.find((e) => e.type === 'damage');
    const guard = sk.effects.find((e) => e.type === 'status' && e.target === 'self' && (e.status === 'guard' || e.status === 'aegis'));
    const hostile = sk.effects.find((e) => e.type === 'status' && e.target === 'enemy');
    if (dmg && dmg.type === 'damage') moves.push(dmg.kind === 'magic' ? MOVES.spell(sk.id, sk.name, dmg.mult, 'sinister', dmg.hits ?? 1) : (dmg.hits ?? 1) > 1 ? MOVES.hit(sk.id, sk.name, dmg.mult, 'aggressive', dmg.hits) : dmg.mult >= 1.6 ? MOVES.charge(sk.id, sk.name, dmg.mult) : MOVES.hit(sk.id, sk.name, dmg.mult));
    else if (guard) moves.push(MOVES.guard(sk.id, sk.name));
    else if (hostile && hostile.type === 'status' && (hostile.status === 'exposed' || hostile.status === 'weak')) moves.push(MOVES.debuff(sk.id, sk.name, hostile.status, hostile.turns));
    if (moves.length >= 4) break;
  }
  if (moves.length === 0) moves.push(MOVES.hit('strike', 'Strike', 1.0), MOVES.guard());
  if (moves.length === 1) moves.push(MOVES.hit('strike', 'Strike', 1.0));
  const hp = Math.max(14, g.stats.maxHp) + g.strength * 2;
  return {
    id: GHOST_ID, name: `Ghost of a ${g.classId}`, tier: g.screenIndex === 0 ? 1 : 2, archetype: 'brute', art: `hero_${g.classId}`, tint: 0x8fb4ff,
    stats: { maxHp: hp, atk: Math.max(3, g.stats.atk - 1) + Math.floor(g.strength / 2), def: g.stats.def },
    table: { kind: 'sequence', moves },
  };
}

/** What beating the ghost gives back: its gold and one of the cards it died holding. */
export function ghostSpoils(g: GhostRecord): { gold: number; tome: SkillId | null } {
  const tomes = g.deck.filter((id) => getSkill(id).rarity !== 'basic');
  return { gold: Math.min(60, g.gold), tome: tomes.length ? tomes[Math.floor(tomes.length / 2)]! : null };
}
