import type { PlayerClass } from './types';

export const CLASSES: PlayerClass[] = [
  { id: 'warrior', name: 'Warrior', stats: { maxHp: 25, atk: 4, def: 1, luck: 5 }, sets: ['warrior_tank', 'warrior_dps'] },
  { id: 'wizard', name: 'Wizard', stats: { maxHp: 20, atk: 5, def: 0, luck: 5 }, sets: ['wizard_fire', 'wizard_frost'] },
  { id: 'shaman', name: 'Shaman', stats: { maxHp: 20, atk: 4, def: 1, luck: 5 }, sets: ['shaman_spirit', 'shaman_storm'] },
];
