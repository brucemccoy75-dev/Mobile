import type { Enemy, EnemyMove, StatusId } from './types';

// Enemies are answers to kits (GAME_DESIGN §6): armored rewards def-ignoring and
// Exposed, brutes reward reading the tell, casters punish no-sustain, swarms
// reward Guard and Burn.

const hit = (id: string, name: string, mult: number, posture: EnemyMove['posture'] = 'aggressive', hits = 1): EnemyMove => ({
  id, name, posture, intent: { kind: 'attack', mult, hits, dmgType: 'physical' },
  effects: [{ type: 'damage', mult, hits, kind: 'physical' }],
});
/** A spell: stopped by Ward, not by Guard. */
const spell = (id: string, name: string, mult: number, posture: EnemyMove['posture'] = 'sinister', hits = 1): EnemyMove => ({
  id, name, posture, intent: { kind: 'attack', mult, hits, dmgType: 'magic' },
  effects: [{ type: 'damage', mult, hits, kind: 'magic' }],
});
const guard = (id = 'guard', name = 'Guard', hits = 1): EnemyMove => ({
  id, name, posture: 'defensive', intent: { kind: 'guard', hits },
  effects: [{ type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: hits }],
});
const debuff = (id: string, name: string, status: StatusId, turns: number): EnemyMove => ({
  id, name, posture: 'sinister', intent: { kind: 'debuff', status },
  effects: [{ type: 'status', target: 'enemy', status, turns, kind: 'magic' }],
});
// Status durations count end-of-round ticks. A self-status the enemy applies on
// its own turn ticks once that same round, so turns: 2 = "exposed during the
// player's next turn".
// Armoured enemies harden instead of guarding: half damage through the player's next turn, never a wasted hit.
const harden = (id = 'shell', name = 'Shell'): EnemyMove => ({
  id, name, posture: 'defensive', intent: { kind: 'buff', status: 'harden' },
  effects: [{ type: 'status', target: 'self', status: 'harden', turns: 2 }],
});
const stagger = (id = 'stagger', name = 'Stagger'): EnemyMove => ({
  id, name, posture: 'reeling', intent: { kind: 'stagger' },
  effects: [{ type: 'status', target: 'self', status: 'exposed', turns: 2 }],
});
const charge = (id: string, name: string, mult: number, hits = 1): EnemyMove => ({
  ...hit(id, name, mult, 'charging', hits),
});
// Answers to pound-strike play (both telegraphed one round early by the posture tell):
// Brace: the next hit that lands is reflected back at the attacker. Scatter: the next single hit does half.
const brace = (id = 'brace', name = 'Brace'): EnemyMove => ({
  id, name, posture: 'countering', intent: { kind: 'buff', status: 'brace' },
  effects: [{ type: 'status', target: 'self', status: 'brace', turns: 2 }],
});
const scatter = (id = 'scatter', name = 'Scatter'): EnemyMove => ({
  id, name, posture: 'evasive', intent: { kind: 'buff', status: 'scatter' },
  effects: [{ type: 'status', target: 'self', status: 'scatter', turns: 2 }],
});

// The first spellcaster: a slow curse that also halves healing, and a drain that heals it.
const curse = (id = 'curse_dot', name = 'Curse', magnitude = 1, turns = 4): EnemyMove => ({
  id, name, posture: 'sinister', intent: { kind: 'debuff', status: 'curse' },
  effects: [{ type: 'status', target: 'enemy', status: 'curse', turns, magnitude, kind: 'magic' }],
});
const drain = (id: string, name: string, mult: number, lifesteal = 1): EnemyMove => ({
  id, name, posture: 'sinister', intent: { kind: 'attack', mult, hits: 1, drain: true, dmgType: 'magic' },
  effects: [{ type: 'damage', mult, lifesteal, kind: 'magic' }],
});

/** A hit that also leaves a status on its target (lava that keeps burning, a filth that sickens; DECISIONS #83). */
const hitWith = (id: string, name: string, mult: number, hits: number, status: StatusId, turns: number, magnitude = 1, kind: 'physical' | 'magic' = 'physical', posture: EnemyMove['posture'] = 'aggressive'): EnemyMove => ({
  id, name, posture, intent: { kind: 'attack', mult, hits, dmgType: kind },
  effects: [{ type: 'damage', mult, hits, kind }, { type: 'status', target: 'enemy', status, turns, magnitude, ...(kind === 'magic' ? { kind } : {}) }],
});

/** Move builders, shared with the run-time variants (core/variants). */
export const MOVES = { hit, spell, guard, debuff, harden, stagger, charge, brace, scatter, curse, drain, hitWith };

/**
 * The crawl roster (DECISIONS #83): five enemies from the designer's favourite books, swapped in for
 * screen 1 while this is on. Balanced like the screen-1 five they replace. Turn it off to bring the
 * Boar, Shell Beetle, Hex Imp, Adept Necromancer and Rat Pack back.
 */
export const ROSTER = { crawl: true };

export const ENEMIES: Enemy[] = [
  // ---- Screen 1 ----
  { id: 'boar', name: 'Boar', tier: 1, archetype: 'brute', stats: { maxHp: 12, atk: 5, def: 0 },
    table: { kind: 'sequence', moves: [hit('tusk', 'Tusk', 1.0), brace(), charge('gore', 'Gore', 2.0)] } },
  { id: 'shell_beetle', name: 'Shell Beetle', tier: 1, archetype: 'armored', stats: { maxHp: 10, atk: 4, def: 1 },
    table: { kind: 'sequence', moves: [hit('bite', 'Bite', 1.0), harden(), hit('bite', 'Bite', 1.0)] } },
  { id: 'hex_imp', name: 'Hex Imp', tier: 1, archetype: 'caster', stats: { maxHp: 11, atk: 4, def: 0 },
    table: { kind: 'sequence', moves: [debuff('hex', 'Hex', 'exposed', 2), hit('jab', 'Jab', 1.0), debuff('curse', 'Curse', 'weak', 2), hit('jab', 'Jab', 1.0)] } },
  { id: 'adept_necromancer', name: 'Adept Necromancer', tier: 1, archetype: 'caster', stats: { maxHp: 11, atk: 4, def: 0 },
    table: { kind: 'sequence', moves: [curse(), drain('lifetap', 'Lifetap', 1.0, 0.5), spell('bone_bolt', 'Bone Bolt', 1.5), drain('lifetap', 'Lifetap', 1.0, 0.5)] } },
  { id: 'rat_pack', name: 'Rat Pack', tier: 1, archetype: 'swarm', stats: { maxHp: 12, atk: 3, def: 0 },
    table: { kind: 'weighted', moves: [{ move: hit('swarm', 'Swarm', 0.6, 'aggressive', 3), weight: 2 }, { move: hit('nibble', 'Nibble', 1.0), weight: 1 }, { move: scatter(), weight: 1 }] } },

  // ---- Screen 1, the crawl roster (DECISIONS #83) ----
  // Rage Elemental: armoured smoke (DEF 1), it enrages below half HP. A Chill contains it: Exposed.
  { id: 'rage_elemental', name: 'Rage Elemental', tier: 1, archetype: 'brute', set: 'crawl', stats: { maxHp: 10, atk: 4, def: 1 },
    table: { kind: 'sequence', moves: [hit('obsidian_rend', 'Obsidian Rend', 0.5, 'aggressive', 3), hitWith('reverse_gravity', 'Reverse Gravity', 0.8, 1, 'exposed', 2, 1, 'magic', 'sinister'), hit('obsidian_rend', 'Obsidian Rend', 0.5, 'aggressive', 3), charge('berserker_charge', 'Berserker Charge', 1.8)] },
    phases: [{ hpBelow: 0.5, table: { kind: 'sequence', moves: [hit('obsidian_rend', 'Obsidian Rend', 0.5, 'aggressive', 3), charge('berserker_charge', 'Berserker Charge', 1.8)] } }],
    traits: { chillExposes: 2 },
    barks: {
      start: ['MINE! ALL OF THIS IS MINE!', 'You stepped on my ground. Now you are part of it.', 'RRRAAAGH!', 'Smoke and claws, little thing. Smoke and claws.'],
      rage: ['NOW I AM ANGRY.', 'You will BURN for that!', 'MORE! MORE! MORE!'],
      death: ['This... is not... over...', 'The smoke... settles...', 'Rrr...gh.'],
    } },
  // The Hoarder: slow (every other turn she gathers junk, open to you), she never dodges, and a sweep hits her double.
  { id: 'the_hoarder', name: 'The Hoarder', tier: 1, archetype: 'brute', set: 'crawl', stats: { maxHp: 14, atk: 4, def: 0 },
    table: { kind: 'sequence', moves: [hitWith('scatterer_vomit', 'Scatterer Vomit', 0.4, 4, 'weak', 2), stagger('gathering', 'Gathering Junk'), charge('crushing_slam', 'Crushing Slam', 2.0), stagger('gathering', 'Gathering Junk'), hitWith('filth_storm', 'Filth Storm', 0.8, 1, 'curse', 3, 1, 'magic', 'sinister')] },
    traits: { sweepVuln: 2 },
    barks: {
      start: ["Don't touch my things! DON'T TOUCH THEM!", "You're mine now. I keep everything.", 'My babies are hungry, sweetie.', 'Oh, a new treasure! Come here, come here!'],
      death: ['My things... who will keep my things...', 'Mine... it was all... mine...', "Don't throw me out..."],
    } },
  // Porkchop Express: each attack adds Momentum to every later hit. Block a hit, or Chill it, and it stops dead.
  { id: 'porkchop_express', name: 'Porkchop Express', tier: 1, archetype: 'brute', set: 'crawl', stats: { maxHp: 11, atk: 3, def: 1 },
    table: { kind: 'sequence', moves: [hit('tusken_grinder', 'Tusken Grinder', 0.6, 'aggressive', 2), charge('rolling_massacre', 'Rolling Massacre', 1.2), hit('tusken_grinder', 'Tusken Grinder', 0.6, 'aggressive', 2), charge('rolling_massacre', 'Rolling Massacre', 1.2)] },
    traits: { momentum: 1 },
    barks: {
      start: ['Out of the way, peasant! We have reservations!', 'Squeal for us! SQUEAL!', 'Do you know who we ARE?', 'More! We want MORE!'],
      death: ['But we were... first class...', 'Put it... on our tab...', 'Not... the suits...'],
    } },
  // Bad Llama: fragile, but its lava keeps burning. Cold hardens the lava: a Chill leaves it Exposed.
  { id: 'bad_llama', name: 'Bad Llama', tier: 1, archetype: 'caster', set: 'crawl', stats: { maxHp: 8, atk: 4, def: 0 },
    table: { kind: 'sequence', moves: [hitWith('lava_spit', 'Lava Spit', 0.6, 1, 'burn', 3, 1), hit('savage_bite', 'Savage Bite', 1.0), hitWith('molten_spray', 'Molten Spray', 0.8, 1, 'burn', 2, 2, 'magic', 'sinister'), hit('savage_bite', 'Savage Bite', 1.0)] },
    traits: { chillExposes: 2 },
    barks: {
      start: ['Hmmph.', '*spits*', 'You looked at me. That was your mistake.', 'Go on. Pet me. I dare you.'],
      death: ['...worth it.', '*one last spit*', 'I will be back. Llamas always come back.'],
    } },
  // Brindled Vespa: hunts in pairs (+50% while another Vespa lives), takes wing before it dives. Fire burns it double; a Chill brings it down.
  { id: 'brindled_vespa', name: 'Brindled Vespa', tier: 1, archetype: 'swarm', set: 'crawl', stats: { maxHp: 8, atk: 3, def: 0 },
    table: { kind: 'sequence', moves: [hitWith('venomous_sting', 'Venomous Sting', 0.7, 1, 'burn', 3, 1), scatter('take_wing', 'Take Wing'), charge('dive_strike', 'Dive Strike', 1.6)] },
    traits: { frenzy: 0.5, burnVuln: 2, chillGrounds: true },
    barks: {
      start: ['The hive is hungry.', 'Bzzzz... prey...', 'We see you. We all see you.', 'Kill for the queen.'],
      death: ['The hive... remembers...', 'Bzzz...zz...', 'Others... will come...'],
    } },

  // ---- Screen 2 ----
  { id: 'ogre', name: 'Ogre', tier: 2, archetype: 'brute', stats: { maxHp: 24, atk: 7, def: 1 },
    table: { kind: 'sequence', moves: [hit('club', 'Club', 1.0), brace(), charge('smash', 'Smash', 2.2)] } },
  { id: 'iron_knight', name: 'Iron Knight', tier: 2, archetype: 'armored', stats: { maxHp: 18, atk: 6, def: 3 },
    table: { kind: 'sequence', moves: [hit('slash', 'Slash', 1.0), harden('brace_plate', 'Brace Plate'), hit('slash', 'Slash', 1.0), charge('bash', 'Bash', 1.5)] } },
  { id: 'witch', name: 'Witch', tier: 2, archetype: 'caster', stats: { maxHp: 17, atk: 6, def: 0 },
    table: { kind: 'sequence', moves: [debuff('hex', 'Hex', 'exposed', 2), spell('bolt', 'Bolt', 1.2), debuff('curse', 'Curse', 'weak', 2), spell('bolt', 'Bolt', 1.2)] } },
  { id: 'harpies', name: 'Harpies', tier: 2, archetype: 'swarm', stats: { maxHp: 18, atk: 4, def: 1 },
    table: { kind: 'weighted', moves: [{ move: hit('swarm', 'Dive', 0.7, 'aggressive', 3), weight: 2 }, { move: debuff('screech', 'Screech', 'weak', 2), weight: 1 }, { move: scatter('scatter', 'Wheel'), weight: 1 }] } },

  // ---- Bosses ----
  // Knight Andre (id gatekeeper, the screen-1 boss) is a rhythm puzzle: guard, big hit, then exposed. Reading the tell is the fight.
  { id: 'gatekeeper', name: 'Knight Andre', tier: 'boss1', archetype: 'boss', stats: { maxHp: 52, atk: 7, def: 2 },
    table: { kind: 'sequence', moves: [guard(), charge('crush', 'Crush', 1.0, 2), stagger()] } },
  // Warden: phase two at half HP trades guard for a multi-hit rend and Weak.
  { id: 'warden', name: 'The Warden', tier: 'boss2', archetype: 'boss', stats: { maxHp: 62, atk: 8, def: 2 },
    table: { kind: 'sequence', moves: [hit('slash', 'Slash', 1.0), guard(), charge('smash', 'Smash', 1.6), stagger()] },
    phases: [{ hpBelow: 0.5, table: { kind: 'sequence', moves: [hit('rend', 'Rend', 0.6, 'aggressive', 3), debuff('curse', 'Curse', 'weak', 2), charge('smash', 'Smash', 2.0)] } }] },
];
