// The roster. Names and bios are placeholders until the content pass; stats sit inside the design ranges.
import { type Stance } from '../content/conversations';
import { type BotType } from './stats';

export interface Character {
  id: string;
  name: string;
  type: BotType;
  iq: number;
  read: number;
  /** Clarity at the start of a tournament. */
  clarityBase: number;
  bio: string;
  /** How he feels about AI and the data centre off Route 3. */
  aiStance: Stance;
  /** How often he speaks at all; 1 is normal, quiet men sit near 0.3. */
  talk: number;
  /** How readily he needles other players; 1 is normal. */
  trash: number;
}

export const CHARACTERS: Character[] = [
  { id: 'harold', name: 'David Sr', type: 'nit', iq: 48, read: 32, clarityBase: 24, bio: 'David\u2019s father. Says almost nothing. Folds almost everything.', aiStance: 'anti', talk: 0.3, trash: 0.5 },
  { id: 'dolores', name: 'Paul', type: 'nit', iq: 52, read: 38, clarityBase: 14, bio: 'Teaches fourth grade and raises bees by hand. Knows the spot.', aiStance: 'meh', talk: 1, trash: 0.8 },
  { id: 'marvin', name: 'Kevin', type: 'nit', iq: 40, read: 24, clarityBase: 28, bio: 'Nobody is sure who invited Kevin. Kevin is not sure either.', aiStance: 'anti', talk: 1.1, trash: 1 },
  { id: 'chad', name: 'Bawb', type: 'tourist', iq: 28, read: 20, clarityBase: 22, bio: 'Says about four words a night. Two of them are \u201call in.\u201d', aiStance: 'pro', talk: 0.3, trash: 0.6 },
  { id: 'trish', name: 'Tim', type: 'tourist', iq: 36, read: 30, clarityBase: 12, bio: 'Financial services. Has stories from the office that cannot all be true.', aiStance: 'meh', talk: 1.2, trash: 1.7 },
  { id: 'benny', name: 'Luca', type: 'tourist', iq: 22, read: 18, clarityBase: 30, bio: 'Financial services, same office. Thinks the printer thing is being handled.', aiStance: 'pro', talk: 1.1, trash: 1 },
  { id: 'wen', name: 'Jonathan', type: 'calculator', iq: 92, read: 48, clarityBase: 12, bio: 'Statistician. Will tell you your exact equity after beating you with it.', aiStance: 'pro', talk: 1, trash: 1 },
  { id: 'priya', name: 'Will', type: 'calculator', iq: 84, read: 58, clarityBase: 18, bio: 'Chess coach. Sees your move three streets before you make it.', aiStance: 'meh', talk: 1, trash: 0.9 },
  { id: 'ulrich', name: 'Menafee', type: 'calculator', iq: 78, read: 42, clarityBase: 26, bio: 'Has never once shown up. His chair plays better than most.', aiStance: 'anti', talk: 0.8, trash: 1 },
  { id: 'sal', name: 'Jack', type: 'pro', iq: 86, read: 92, clarityBase: 16, bio: 'Sixteen. Best player at the table. Would like to know where the snacks are.', aiStance: 'anti', talk: 1.3, trash: 1.1 },
  { id: 'nadia', name: 'David', type: 'pro', iq: 94, read: 84, clarityBase: 10, bio: 'Financial services. Will tell you exactly what is wrong with your play, and your face.', aiStance: 'pro', talk: 1.2, trash: 1.7 },
  { id: 'jimmy', name: 'Bruce', type: 'pro', iq: 82, read: 90, clarityBase: 22, bio: 'Joins every conversation with one dry line, usually at your expense.', aiStance: 'meh', talk: 1.1, trash: 1.2 },
];

export const TOURNAMENTS = {
  tutorial: { name: 'Kids Table', types: ['nit', 'tourist'] as BotType[] },
  vegas: { name: 'Adult Table', types: ['nit', 'tourist', 'calculator', 'pro'] as BotType[] },
  championship: { name: 'Real Poker', types: ['calculator', 'pro'] as BotType[] },
};

/** Dave's robot. It deals. */
export const DEALER_NAME = 'Skynet';

export type TournamentKey = keyof typeof TOURNAMENTS;

export function characterById(id: string): Character {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown character ${id}`);
  return c;
}

export function eligibleCharacters(key: TournamentKey): Character[] {
  return CHARACTERS.filter((c) => TOURNAMENTS[key].types.includes(c.type));
}
