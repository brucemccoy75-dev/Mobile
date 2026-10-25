import type { Item } from './types';

const stat = (s: Item['mods'][0]['stat']) => [{ stat: s }];

/**
 * Equipment (DECISIONS #33): small, flat, and never the reason a fight ends in one round.
 *   body    DEF +1 at most; HP carries the rarity.
 *   weapon  ATK +1 at most; HP or DEF carries the rarity.
 *   relic   ATK +1 at most; HP carries the rarity, costs are paid in HP.
 *   boss    only from boss loot, and the one place the caps break.
 */
export const ITEMS: Item[] = [
  // ---- body ----
  { id: 'padded_vest', name: 'Padded Vest', slot: 'body', rarity: 'common', text: '+3 max HP', mods: stat({ maxHp: 3 }) },
  { id: 'leather_jerkin', name: 'Leather Jerkin', slot: 'body', rarity: 'common', text: '+1 DEF', mods: stat({ def: 1 }) },
  { id: 'chain_shirt', name: 'Chain Shirt', slot: 'body', rarity: 'uncommon', text: '+1 DEF, +3 max HP', mods: stat({ def: 1, maxHp: 3 }) },
  { id: 'runed_robe', name: 'Runed Robe', slot: 'body', rarity: 'uncommon', text: '+5 max HP', classes: ['wizard', 'shaman'], tags: ['wizard_fire', 'wizard_frost', 'shaman_storm'], mods: stat({ maxHp: 5 }) },
  { id: 'spiritweave', name: 'Spiritweave', slot: 'body', rarity: 'uncommon', text: '+6 max HP', classes: ['shaman'], tags: ['shaman_spirit'], mods: stat({ maxHp: 6 }) },
  { id: 'plate_harness', name: 'Plate Harness', slot: 'body', rarity: 'rare', text: '+1 DEF, +6 max HP', classes: ['warrior'], tags: ['warrior_tank'], mods: stat({ def: 1, maxHp: 6 }) },
  { id: 'berserker_hide', name: 'Berserker Hide', slot: 'body', rarity: 'rare', text: '+8 max HP, −1 DEF', classes: ['warrior'], tags: ['warrior_dps'], mods: stat({ maxHp: 8, def: -1 }) },

  // ---- weapon ----
  { id: 'rusty_sword', name: 'Rusty Sword', slot: 'weapon', rarity: 'common', text: '+1 ATK', mods: stat({ atk: 1 }) },
  { id: 'oak_wand', name: 'Oak Wand', slot: 'weapon', rarity: 'common', text: '+1 ATK', classes: ['wizard'], mods: stat({ atk: 1 }) },
  { id: 'totem_staff', name: 'Totem Staff', slot: 'weapon', rarity: 'common', text: '+1 ATK, +2 max HP', classes: ['shaman'], mods: stat({ atk: 1, maxHp: 2 }) },
  { id: 'iron_mace', name: 'Iron Mace', slot: 'weapon', rarity: 'uncommon', text: '+1 ATK, +3 max HP', mods: stat({ atk: 1, maxHp: 3 }) },
  { id: 'tower_shield', name: 'Tower Shield', slot: 'weapon', rarity: 'uncommon', text: '+1 DEF, +2 max HP', classes: ['warrior'], tags: ['warrior_tank'], mods: stat({ def: 1, maxHp: 2 }) },
  { id: 'broad_axe', name: 'Broad Axe', slot: 'weapon', rarity: 'uncommon', text: '+1 ATK, +4 max HP, −1 DEF', classes: ['warrior'], tags: ['warrior_dps'], mods: stat({ atk: 1, maxHp: 4, def: -1 }) },
  { id: 'ember_staff', name: 'Ember Staff', slot: 'weapon', rarity: 'rare', text: '+1 ATK, +4 max HP', classes: ['wizard'], tags: ['wizard_fire'], mods: stat({ atk: 1, maxHp: 4 }) },
  { id: 'rime_staff', name: 'Rime Staff', slot: 'weapon', rarity: 'rare', text: '+1 ATK, +1 DEF', classes: ['wizard'], tags: ['wizard_frost'], mods: stat({ atk: 1, def: 1 }) },
  { id: 'storm_totem', name: 'Storm Totem', slot: 'weapon', rarity: 'rare', text: '+1 ATK, +1 DEF, +2 max HP', classes: ['shaman'], tags: ['shaman_storm', 'shaman_spirit'], mods: stat({ atk: 1, def: 1, maxHp: 2 }) },

  // ---- relic ----
  { id: 'heart_amulet', name: 'Heart Amulet', slot: 'relic', rarity: 'common', text: '+5 max HP', mods: stat({ maxHp: 5 }) },
  { id: 'bloodstone', name: 'Bloodstone', slot: 'relic', rarity: 'uncommon', text: '+1 ATK, −3 max HP', mods: stat({ atk: 1, maxHp: -3 }) },
  { id: 'tortoise_charm', name: 'Tortoise Charm', slot: 'relic', rarity: 'uncommon', text: '+1 DEF, +1 max HP', mods: stat({ def: 1, maxHp: 1 }) },
  { id: 'glass_idol', name: 'Glass Idol', slot: 'relic', rarity: 'rare', text: '+1 ATK, +1 DEF, −6 max HP', mods: stat({ atk: 1, def: 1, maxHp: -6 }) },
  // Boss relics: the caps do not apply, and they only drop from a boss.
  { id: 'gatekeepers_eye', name: "Gatekeeper's Eye", slot: 'relic', rarity: 'boss', text: '+2 ATK, +2 DEF', mods: stat({ atk: 2, def: 2 }) },
  { id: 'wardens_seal', name: "Warden's Seal", slot: 'relic', rarity: 'boss', text: '+3 DEF, +8 max HP', mods: stat({ def: 3, maxHp: 8 }) },
];
