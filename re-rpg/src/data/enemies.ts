import type { Enemy, EnemyMove, StatusId } from './types';

// Enemies are answers to kits (GAME_DESIGN §6): armored rewards def-ignoring and
// Exposed, brutes reward reading the tell, casters punish no-sustain, swarms
// reward Guard and Burn.

const hit = (id: string, name: string, mult: number, posture: EnemyMove['posture'] = 'aggressive', hits = 1): EnemyMove => ({
  id, name, posture, intent: { kind: 'attack', mult, hits },
  effects: [{ type: 'damage', mult, hits }],
});
const guard = (id = 'guard', name = 'Guard', hits = 1): EnemyMove => ({
  id, name, posture: 'defensive', intent: { kind: 'guard', hits },
  effects: [{ type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: hits }],
});
const debuff = (id: string, name: string, status: StatusId, turns: number): EnemyMove => ({
  id, name, posture: 'sinister', intent: { kind: 'debuff', status },
  effects: [{ type: 'status', target: 'enemy', status, turns }],
});
// Status durations count end-of-round ticks. A self-status the enemy applies on
// its own turn ticks once that same round, so turns: 2 = "exposed during the
// player's next turn".
const stagger = (id = 'stagger', name = 'Stagger'): EnemyMove => ({
  id, name, posture: 'reeling', intent: { kind: 'stagger' },
  effects: [{ type: 'status', target: 'self', status: 'exposed', turns: 2 }],
});
const charge = (id: string, name: string, mult: number, hits = 1): EnemyMove => ({
  ...hit(id, name, mult, 'charging', hits),
});

export const ENEMIES: Enemy[] = [
  // ---- Screen 1 ----
  { id: 'boar', name: 'Boar', tier: 1, archetype: 'brute', stats: { maxHp: 14, atk: 4, def: 0 },
    table: { kind: 'sequence', moves: [hit('tusk', 'Tusk', 1.0), hit('tusk', 'Tusk', 1.0), charge('gore', 'Gore', 2.0)] } },
  { id: 'shell_beetle', name: 'Shell Beetle', tier: 1, archetype: 'armored', stats: { maxHp: 10, atk: 3, def: 2 },
    table: { kind: 'sequence', moves: [hit('bite', 'Bite', 1.0), guard('shell', 'Shell'), hit('bite', 'Bite', 1.0)] } },
  { id: 'hex_imp', name: 'Hex Imp', tier: 1, archetype: 'caster', stats: { maxHp: 10, atk: 3, def: 0 },
    table: { kind: 'sequence', moves: [debuff('hex', 'Hex', 'exposed', 2), hit('jab', 'Jab', 1.0), debuff('curse', 'Curse', 'weak', 2), hit('jab', 'Jab', 1.0)] } },
  { id: 'rat_pack', name: 'Rat Pack', tier: 1, archetype: 'swarm', stats: { maxHp: 12, atk: 2, def: 0 },
    table: { kind: 'weighted', moves: [{ move: hit('swarm', 'Swarm', 0.6, 'aggressive', 3), weight: 2 }, { move: hit('nibble', 'Nibble', 1.0), weight: 1 }] } },

  // ---- Screen 2 ----
  { id: 'ogre', name: 'Ogre', tier: 2, archetype: 'brute', stats: { maxHp: 28, atk: 6, def: 1 },
    table: { kind: 'sequence', moves: [hit('club', 'Club', 1.0), hit('club', 'Club', 1.0), charge('smash', 'Smash', 2.5)] } },
  { id: 'iron_knight', name: 'Iron Knight', tier: 2, archetype: 'armored', stats: { maxHp: 24, atk: 5, def: 4 },
    table: { kind: 'sequence', moves: [hit('slash', 'Slash', 1.0), guard(), hit('slash', 'Slash', 1.0), charge('bash', 'Bash', 1.5)] } },
  { id: 'witch', name: 'Witch', tier: 2, archetype: 'caster', stats: { maxHp: 18, atk: 5, def: 0 },
    table: { kind: 'sequence', moves: [debuff('hex', 'Hex', 'exposed', 2), hit('bolt', 'Bolt', 1.2), debuff('curse', 'Curse', 'weak', 2), hit('bolt', 'Bolt', 1.2)] } },
  { id: 'harpies', name: 'Harpies', tier: 2, archetype: 'swarm', stats: { maxHp: 20, atk: 3, def: 1 },
    table: { kind: 'weighted', moves: [{ move: hit('swarm', 'Dive', 0.7, 'aggressive', 3), weight: 2 }, { move: debuff('screech', 'Screech', 'weak', 2), weight: 1 }] } },

  // ---- Bosses ----
  // Gatekeeper is a rhythm puzzle: guard, big hit, then exposed. Reading the tell is the fight.
  { id: 'gatekeeper', name: 'The Gatekeeper', tier: 'boss1', archetype: 'boss', stats: { maxHp: 40, atk: 6, def: 2 },
    table: { kind: 'sequence', moves: [guard(), charge('crush', 'Crush', 1.0, 2), stagger()] } },
  // Warden: phase two at half HP trades guard for a multi-hit rend and Weak.
  { id: 'warden', name: 'The Warden', tier: 'boss2', archetype: 'boss', stats: { maxHp: 50, atk: 7, def: 2 },
    table: { kind: 'sequence', moves: [hit('slash', 'Slash', 1.0), guard(), charge('smash', 'Smash', 1.6), stagger()] },
    phases: [{ hpBelow: 0.5, table: { kind: 'sequence', moves: [hit('rend', 'Rend', 0.6, 'aggressive', 3), debuff('curse', 'Curse', 'weak', 2), charge('smash', 'Smash', 2.0)] } }] },
];
