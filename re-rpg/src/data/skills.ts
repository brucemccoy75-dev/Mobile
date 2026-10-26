import type { Skill, SkillSet } from './types';

// Basics: shuffled into every fight's deck on top of the run deck (DECISIONS #2, amended).
export const ATTACK: Skill = {
  id: 'attack', name: 'Attack', text: 'Deal 100% damage.', classId: 'any', rarity: 'basic',
  effects: [{ type: 'damage', mult: 1.0 }],
};
export const DEFEND: Skill = {
  id: 'defend', name: 'Defend', text: 'Block the next hit.', classId: 'any', rarity: 'basic',
  effects: [{ type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 1 }],
};
export const WARD: Skill = {
  id: 'ward', name: 'Ward', text: 'Block the next magic hit or curse.', classId: 'any', rarity: 'basic',
  effects: [{ type: 'status', target: 'self', status: 'ward', turns: 99, magnitude: 1 }],
};

/** Most copies of one tome a deck may hold. */
export const TOME_COPY_CAP = 2;

/** Every basic card; the engine's default when no class is named (tests). Not counted against DECK_CAP. */
export const BASIC_DECK: string[] = ['attack', 'attack', 'defend', 'ward'];
/**
 * Cards every fight starts with for a class, on top of the run deck (DECISIONS #42): the warrior
 * attacks and defends, the wizard attacks and wards, the shaman does both. Everything else,
 * Ward for a warrior included, lives on the skill tree.
 */
export const CLASS_BASICS: Record<string, string[]> = {
  warrior: ['attack', 'attack', 'defend'],
  wizard: ['attack', 'attack', 'ward'],
  shaman: ['attack', 'attack', 'defend', 'ward'],
};
export const basicsFor = (classId: string): string[] => CLASS_BASICS[classId] ?? BASIC_DECK;

// Healing is rare and taxed on purpose (DECISIONS #1, #11): every heal leaves you Exposed, so it is a bet on blocking the next hits.
export const SKILLS: Skill[] = [
  ATTACK,
  DEFEND,
  WARD,

  // Warrior / Tank
  { id: 'shield_bash', name: 'Shield Bash', text: 'Deal 60% damage and block the next hit. Tiring: Weak next turn.', classId: 'warrior', setId: 'warrior_tank', rarity: 'common',
    effects: [{ type: 'damage', mult: 0.6 }, { type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 1 }, { type: 'status', target: 'self', status: 'weak', turns: 2 }] },
  // Once per fight (DECISIONS #38): a second and third Bind Wound in a long duo fight healed back most of what duos deal.
  { id: 'bind_wound', name: 'Bind Wound', text: 'Heal 25% HP. You are Exposed for 2 rounds.', classId: 'warrior', setId: 'warrior_tank', rarity: 'uncommon', uses: 'once_per_fight',
    effects: [{ type: 'heal', pct: 0.25 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] },

  // Warrior / DPS
  { id: 'broadsword', name: 'Broadsword Strike', text: 'Deal 100% + 4 damage. You overextend: Exposed this round.', classId: 'warrior', setId: 'warrior_dps', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.0, flat: 4 }, { type: 'status', target: 'self', status: 'exposed', turns: 1 }] },
  { id: 'exposing_strike', name: 'Exposing Strike', text: 'Deal 100% damage. Enemy is Exposed for 2 rounds.', classId: 'warrior', setId: 'warrior_dps', rarity: 'uncommon',
    effects: [{ type: 'damage', mult: 1.0 }, { type: 'status', target: 'enemy', status: 'exposed', turns: 2 }] },

  // Wizard / Fire
  { id: 'fireball', name: 'Fireball', text: 'Deal 150% magic damage and Burn 2 for 2 rounds.', classId: 'wizard', setId: 'wizard_fire', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.5, kind: 'magic' }, { type: 'status', target: 'enemy', status: 'burn', turns: 2, magnitude: 2 }] },
  { id: 'inferno', name: 'Inferno', text: 'Deal 100% + 10 magic damage. You are Exposed for 2 rounds.', classId: 'wizard', setId: 'wizard_fire', rarity: 'uncommon',
    effects: [{ type: 'damage', mult: 1.0, flat: 10, kind: 'magic' }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] },

  // Wizard / Frost
  { id: 'frost_bolt', name: 'Frost Bolt', text: 'Deal 120% damage. 65% chance to Chill (enemy skips its next action).', classId: 'wizard', setId: 'wizard_frost', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.2, kind: 'magic' }, { type: 'status', target: 'enemy', status: 'chill', turns: 1, chance: 0.65 }] },
  { id: 'ice_armor', name: 'Ice Armor', text: 'Block the next 2 hits.', classId: 'wizard', setId: 'wizard_frost', rarity: 'uncommon',
    effects: [{ type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 2 }] },

  // Shaman / Spirit
  { id: 'spirit_lash', name: 'Spirit Lash', text: 'Deal 120% damage and heal 50% of damage dealt.', classId: 'shaman', setId: 'shaman_spirit', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.2, lifesteal: 0.5 }] },
  { id: 'mend', name: 'Mend', text: 'Heal 35% HP. You are Exposed for 2 rounds.', classId: 'shaman', setId: 'shaman_spirit', rarity: 'uncommon',
    effects: [{ type: 'heal', pct: 0.35 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] },

  // Shaman / Storm
  { id: 'lightning', name: 'Lightning', text: 'Deal 160% damage, ignoring defense.', classId: 'shaman', setId: 'shaman_storm', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.6, ignoreDef: true, kind: 'magic' }] },
  { id: 'static_field', name: 'Static Field', text: 'Burn 3 for 3 rounds.', classId: 'shaman', setId: 'shaman_storm', rarity: 'uncommon',
    effects: [{ type: 'status', target: 'enemy', status: 'burn', turns: 3, magnitude: 3 }] },
];

// Special tomes (DECISIONS #21), usable by every class. Rare ones are once per fight;
// fleeting ones are spent for good when played. All enter the pool like any tome.
export const SPECIAL_TOMES: Skill[] = [
  { id: 'mighty_blow', name: 'Mighty Blow', text: 'Deal 200% damage. Fleeting: spent when played.', classId: 'any', rarity: 'rare', uses: 'fleeting',
    effects: [{ type: 'damage', mult: 2.0 }] },
  { id: 'stand_firm', name: 'Stand Firm', text: 'Block every hit for 2 rounds. Fleeting: spent when played.', classId: 'any', rarity: 'rare', uses: 'fleeting',
    effects: [{ type: 'status', target: 'self', status: 'aegis', turns: 2 }] },
  { id: 'warding_blast', name: 'Warding Blast', text: 'Deal 60% magic damage and block the next magic hit or curse. Tiring: Weak next turn.', classId: 'any', rarity: 'common',
    effects: [{ type: 'damage', mult: 0.6, kind: 'magic' }, { type: 'status', target: 'self', status: 'ward', turns: 99, magnitude: 1 }, { type: 'status', target: 'self', status: 'weak', turns: 2 }] },
  { id: 'last_strike', name: 'Last Strike', text: 'Deal 300% damage. Fleeting: the tome is spent.', classId: 'any', rarity: 'uncommon', uses: 'fleeting',
    effects: [{ type: 'damage', mult: 3.0 }] },
  { id: 'final_stand', name: 'Final Stand', text: 'Block every hit for 3 rounds. Fleeting: the tome is spent.', classId: 'any', rarity: 'uncommon', uses: 'fleeting',
    effects: [{ type: 'status', target: 'self', status: 'aegis', turns: 3 }] },
];
SKILLS.push(...SPECIAL_TOMES);

export const SETS: SkillSet[] = [
  // The general tomes are family cards too (DECISIONS #42): the attack pair sits in each class's
  // damage family, the defence trio in its defence family, so nothing drops without a node.
  { id: 'warrior_tank', classId: 'warrior', name: 'Bulwark', skills: ['shield_bash', 'bind_wound', 'warding_blast', 'stand_firm', 'final_stand'] },
  { id: 'warrior_dps', classId: 'warrior', name: 'Berserker', skills: ['broadsword', 'exposing_strike', 'mighty_blow', 'last_strike'] },
  { id: 'wizard_fire', classId: 'wizard', name: 'Pyromancy', skills: ['fireball', 'inferno', 'mighty_blow', 'last_strike'] },
  { id: 'wizard_frost', classId: 'wizard', name: 'Cryomancy', skills: ['frost_bolt', 'ice_armor', 'warding_blast', 'stand_firm', 'final_stand'] },
  { id: 'shaman_spirit', classId: 'shaman', name: 'Spiritcaller', skills: ['spirit_lash', 'mend', 'warding_blast', 'stand_firm', 'final_stand'] },
  { id: 'shaman_storm', classId: 'shaman', name: 'Stormcaller', skills: ['lightning', 'static_field', 'mighty_blow', 'last_strike'] },
];
