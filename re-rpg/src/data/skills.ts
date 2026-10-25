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
/** Most copies of one tome a deck may hold. */
export const TOME_COPY_CAP = 2;

/** Cards every fight starts with, in addition to the run deck. Not counted against DECK_CAP. */
export const BASIC_DECK: string[] = ['attack', 'attack', 'defend'];

// Healing is rare and taxed on purpose (DECISIONS #1, #11): every heal leaves you Exposed, so it is a bet on blocking the next hits.
export const SKILLS: Skill[] = [
  ATTACK,
  DEFEND,

  // Warrior / Tank
  { id: 'shield_bash', name: 'Shield Bash', text: 'Deal 60% damage and block the next hit.', classId: 'warrior', setId: 'warrior_tank', rarity: 'common',
    effects: [{ type: 'damage', mult: 0.6 }, { type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 1 }] },
  { id: 'bind_wound', name: 'Bind Wound', text: 'Heal 35% HP. You are Exposed for 2 rounds.', classId: 'warrior', setId: 'warrior_tank', rarity: 'uncommon',
    effects: [{ type: 'heal', pct: 0.35 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] },

  // Warrior / DPS
  { id: 'broadsword', name: 'Broadsword Strike', text: 'Deal 100% + 4 damage. You overextend: Exposed this round.', classId: 'warrior', setId: 'warrior_dps', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.0, flat: 4 }, { type: 'status', target: 'self', status: 'exposed', turns: 1 }] },
  { id: 'exposing_strike', name: 'Exposing Strike', text: 'Deal 100% damage. Enemy is Exposed for 2 rounds.', classId: 'warrior', setId: 'warrior_dps', rarity: 'uncommon',
    effects: [{ type: 'damage', mult: 1.0 }, { type: 'status', target: 'enemy', status: 'exposed', turns: 2 }] },

  // Wizard / Fire
  { id: 'fireball', name: 'Fireball', text: 'Deal 150% damage and Burn 2 for 2 rounds.', classId: 'wizard', setId: 'wizard_fire', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.5 }, { type: 'status', target: 'enemy', status: 'burn', turns: 2, magnitude: 2 }] },
  { id: 'inferno', name: 'Inferno', text: 'Deal 100% + 10 damage. You are Exposed for 2 rounds.', classId: 'wizard', setId: 'wizard_fire', rarity: 'uncommon',
    effects: [{ type: 'damage', mult: 1.0, flat: 10 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] },

  // Wizard / Frost
  { id: 'frost_bolt', name: 'Frost Bolt', text: 'Deal 120% damage. 65% chance to Chill (enemy skips its next action).', classId: 'wizard', setId: 'wizard_frost', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.2 }, { type: 'status', target: 'enemy', status: 'chill', turns: 1, chance: 0.65 }] },
  { id: 'ice_armor', name: 'Ice Armor', text: 'Block the next 2 hits.', classId: 'wizard', setId: 'wizard_frost', rarity: 'uncommon',
    effects: [{ type: 'status', target: 'self', status: 'guard', turns: 99, magnitude: 2 }] },

  // Shaman / Spirit
  { id: 'spirit_lash', name: 'Spirit Lash', text: 'Deal 120% damage and heal 50% of damage dealt.', classId: 'shaman', setId: 'shaman_spirit', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.2, lifesteal: 0.5 }] },
  { id: 'mend', name: 'Mend', text: 'Heal 35% HP. You are Exposed for 2 rounds.', classId: 'shaman', setId: 'shaman_spirit', rarity: 'uncommon',
    effects: [{ type: 'heal', pct: 0.35 }, { type: 'status', target: 'self', status: 'exposed', turns: 2 }] },

  // Shaman / Storm
  { id: 'lightning', name: 'Lightning', text: 'Deal 160% damage, ignoring defense.', classId: 'shaman', setId: 'shaman_storm', rarity: 'common',
    effects: [{ type: 'damage', mult: 1.6, ignoreDef: true }] },
  { id: 'static_field', name: 'Static Field', text: 'Burn 3 for 3 rounds.', classId: 'shaman', setId: 'shaman_storm', rarity: 'uncommon',
    effects: [{ type: 'status', target: 'enemy', status: 'burn', turns: 3, magnitude: 3 }] },
];

export const SETS: SkillSet[] = [
  { id: 'warrior_tank', classId: 'warrior', name: 'Bulwark', skills: ['shield_bash', 'bind_wound'] },
  { id: 'warrior_dps', classId: 'warrior', name: 'Berserker', skills: ['broadsword', 'exposing_strike'] },
  { id: 'wizard_fire', classId: 'wizard', name: 'Pyromancy', skills: ['fireball', 'inferno'] },
  { id: 'wizard_frost', classId: 'wizard', name: 'Cryomancy', skills: ['frost_bolt', 'ice_armor'] },
  { id: 'shaman_spirit', classId: 'shaman', name: 'Spiritcaller', skills: ['spirit_lash', 'mend'] },
  { id: 'shaman_storm', classId: 'shaman', name: 'Stormcaller', skills: ['lightning', 'static_field'] },
];
