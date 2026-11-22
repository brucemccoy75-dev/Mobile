// The roster. Names and bios are placeholders until the content pass; stats sit inside the design ranges.
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
}

export const CHARACTERS: Character[] = [
  { id: 'harold', name: 'Harold Finch', type: 'nit', iq: 48, read: 32, clarityBase: 24, bio: 'Retired accountant. Brought exactly one buy-in and a sandwich.' },
  { id: 'dolores', name: 'Dolores Pike', type: 'nit', iq: 52, read: 38, clarityBase: 14, bio: 'Teaches fourth grade. Folds like she is grading papers.' },
  { id: 'marvin', name: 'Marvin Oduya', type: 'nit', iq: 40, read: 24, clarityBase: 28, bio: 'Actuary. Has calculated the odds of enjoying this and they are poor.' },
  { id: 'chad', name: 'Chad Bellamy', type: 'tourist', iq: 28, read: 20, clarityBase: 22, bio: 'In town for a bachelor party. His, possibly.' },
  { id: 'trish', name: 'Trish Novak', type: 'tourist', iq: 36, read: 30, clarityBase: 12, bio: 'Cruise ship regular. Plays every hand like the boat is leaving.' },
  { id: 'benny', name: 'Benny Ruiz', type: 'tourist', iq: 22, read: 18, clarityBase: 30, bio: 'Big night out. Has already told you about it twice.' },
  { id: 'wen', name: 'Dr. Wen Liu', type: 'calculator', iq: 92, read: 48, clarityBase: 12, bio: 'Statistician. Will tell you your exact equity after beating you with it.' },
  { id: 'priya', name: 'Priya Raman', type: 'calculator', iq: 84, read: 58, clarityBase: 18, bio: 'Chess coach. Sees your move three streets before you make it.' },
  { id: 'ulrich', name: 'Ulrich Brandt', type: 'calculator', iq: 78, read: 42, clarityBase: 26, bio: 'Structural engineer. Does not bluff. Does not need to.' },
  { id: 'sal', name: 'Sal Moretti', type: 'pro', iq: 86, read: 92, clarityBase: 16, bio: 'Thirty years of card rooms. Remembers every hand you have ever shown.' },
  { id: 'nadia', name: 'Nadia Volkova', type: 'pro', iq: 94, read: 84, clarityBase: 10, bio: 'Online crusher. Plays eight tables in her head while playing this one.' },
  { id: 'jimmy', name: 'Jimmy Dale', type: 'pro', iq: 82, read: 90, clarityBase: 22, bio: 'They call him The Clock. Times your every hesitation.' },
];

export const TOURNAMENTS = {
  tutorial: { name: 'Tutorial', types: ['nit', 'tourist'] as BotType[] },
  vegas: { name: 'Vegas', types: ['nit', 'tourist', 'calculator', 'pro'] as BotType[] },
  championship: { name: 'Championship', types: ['calculator', 'pro'] as BotType[] },
};

export type TournamentKey = keyof typeof TOURNAMENTS;

export function characterById(id: string): Character {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown character ${id}`);
  return c;
}

export function eligibleCharacters(key: TournamentKey): Character[] {
  return CHARACTERS.filter((c) => TOURNAMENTS[key].types.includes(c.type));
}
