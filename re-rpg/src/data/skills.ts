import type { Skill, SkillSet } from './types';

/**
 * Every card, modifier, family and tree node lives in cards.json, the file the card editor
 * (editor.html, DECISIONS #44) writes. `compileCards` turns those records into the engine's
 * skills; nothing here is edited by hand.
 */
import cardsJson from './cards.json';
import { compileCards, type CardsData } from './cardsSchema';

export const CARDS_DATA = cardsJson as unknown as CardsData;
const compiled = compileCards(CARDS_DATA);

export const SKILLS: Skill[] = compiled.skills;
export const SETS: SkillSet[] = compiled.sets;

const basic = (id: string): Skill => SKILLS.find((s) => s.id === id)!;
export const ATTACK: Skill = basic('attack');
export const DEFEND: Skill = basic('defend');
export const WARD: Skill = basic('ward');

/** Most copies of one tome a deck may hold. */
export const TOME_COPY_CAP = 2;

/** Every basic card; the engine's default when no class is named (tests). Not counted against DECK_CAP. */
export const BASIC_DECK: string[] = ['attack', 'attack', 'defend', 'ward'];
/**
 * Cards every fight starts with for a class, on top of the run deck (DECISIONS #42): the warrior
 * attacks and defends, the wizard attacks and wards, the shaman does both. Everything else,
 * Ward for a warrior included, lives on the skill tree.
 */
export const CLASS_BASICS: Record<string, string[]> = compiled.basics;
export const basicsFor = (classId: string): string[] => CLASS_BASICS[classId] ?? BASIC_DECK;

/** The class-agnostic tomes (DECISIONS #21): fleeting specials and Warding Blast; each sits in a family per class (#42). */
export const SPECIAL_TOMES: Skill[] = SKILLS.filter((s) => s.classId === 'any' && s.rarity !== 'basic');
