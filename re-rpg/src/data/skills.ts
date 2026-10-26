import type { Skill, SkillSet } from './types';

/**
 * Every card, family and tree node lives in cards.json, which is the file the card spreadsheet
 * round-trips through (scripts/cards-xlsx.py export | import, DECISIONS #43). Edit the sheet or
 * the JSON, never this file, to change what a card does or where it sits on a tree.
 */
import cards from './cards.json';

export const SKILLS: Skill[] = cards.skills as Skill[];
export const SETS: SkillSet[] = cards.sets as SkillSet[];

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
export const CLASS_BASICS: Record<string, string[]> = cards.basics;
export const basicsFor = (classId: string): string[] => CLASS_BASICS[classId] ?? BASIC_DECK;

/** The class-agnostic tomes (DECISIONS #21): fleeting specials and Warding Blast; each sits in a family per class (#42). */
export const SPECIAL_TOMES: Skill[] = SKILLS.filter((s) => s.classId === 'any' && s.rarity !== 'basic');
