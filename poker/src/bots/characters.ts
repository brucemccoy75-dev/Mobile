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
  /** How hard bad beats land on him; 1 is normal, hotheads above. */
  temper?: number;
  /** What he says on the pick screen to get picked, when picked, and when dropped. */
  pitch: string[];
  picked: string;
  dropped: string;
}

export const CHARACTERS: Character[] = [
  { id: 'harold', name: 'David Sr', type: 'nit', iq: 48, read: 32, clarityBase: 24, bio: 'David\u2019s father. Says almost nothing. Folds almost everything.', aiStance: 'anti', talk: 0.3, trash: 0.5, pitch: ['I’ll be quiet.', '...', 'I fold a lot. You’ll like that.'], picked: 'Fine.', dropped: 'Fine.' },
  { id: 'dolores', name: 'Paul', type: 'nit', iq: 52, read: 38, clarityBase: 14, bio: 'Makes everything by hand: clothes, car, horse. Sells honey. Calls a full house a full homestead.', aiStance: 'meh', talk: 1.1, trash: 0.8, pitch: ['Pick me and the honey’s half off. Show me one card.', 'I built the chair I’ll be sitting in.', 'Full homestead. Think about it.'], picked: 'Honey’s in the truck. Half off.', dropped: 'Thirty percent off. Still.' },
  { id: 'marvin', name: 'Kevin', type: 'tourist', iq: 18, read: 12, clarityBase: 30, bio: 'Nobody is sure who invited Kevin. Kevin is not sure either.', aiStance: 'anti', talk: 0.6, trash: 0.8, temper: 1.4, pitch: ['PICK ME. I AM SO READY. WHO ARE YOU.', 'I have never been more sober.', 'Kevin is HERE. Kevin is IN.'], picked: 'YES. YESSSS. Where’s the bathroom.', dropped: 'No. NO. Okay. Yes. Okay.' },
  { id: 'chad', name: 'Bawb', type: 'pro', iq: 93, read: 86, clarityBase: 22, bio: 'Phone in one hand, cards in the other. Live updates from girls’ softball, basketball and track across southern New Hampshire. Takes your stack between innings. Second year of clown school. She said no.', aiStance: 'pro', talk: 0.9, trash: 0.5, pitch: ['Pick me. Bedford’s up two in the fourth. I can do both.', 'Kara’s hamstring is fine. I checked. Pick me.', 'Hold on. Souhegan just tied it. Okay. Pick me.'], picked: 'Good. Hold on. Londonderry just put a runner on.', dropped: 'Fine. More time for the softball thread.' },
  { id: 'trish', name: 'Tim', type: 'tourist', iq: 36, read: 30, clarityBase: 12, bio: 'Financial services. Has stories from the office that cannot all be true.', aiStance: 'meh', talk: 1.2, trash: 1.7, pitch: ['Pick me and I’ll throw in a towel. Forty dollars.', 'I can’t eat the chips. I can be near them.', 'TowelZoneDotBiz. Pick me.'], picked: 'Towel’s on your seat. Forty.', dropped: 'The towels will remember this.' },
  { id: 'benny', name: 'Luca', type: 'tourist', iq: 22, read: 18, clarityBase: 30, bio: 'Loves the new GTA. Enrolled in clown school. Has proposed three times, all of them high up.', aiStance: 'pro', talk: 1.1, trash: 1, pitch: ['Pick me. Nobody picks me. Ask the balloon.', 'I’ve got clown school at nine. I’m free till then.', 'The new GTA has a horse. Pick me.'], picked: 'A yes! Finally! Put it on the fridge!', dropped: 'That’s fine. That’s the Celtics game all over again.' },
  { id: 'wen', name: 'Jonathan', type: 'calculator', iq: 92, read: 48, clarityBase: 12, bio: 'Built like a boxer, wears the B hat, and has the Division II standings for three girls’ sports memorised. Feuds with the NHIAA by letter.', aiStance: 'pro', talk: 0.9, trash: 0.6, pitch: ['Pick me. I have the Division II standings memorised. All three sports.', 'Londonderry lost. I just want everyone to know that going in.', 'Bedford clinched. Pick me. I’ll explain the tiebreaker.'], picked: 'Yes. I will keep the scores coming.', dropped: 'That is a Pinkerton move. Sitting a guy for no reason.' },
  { id: 'priya', name: 'Will', type: 'calculator', iq: 84, read: 58, clarityBase: 18, bio: 'Plans everything, laminates it, and is on month fourteen of trying for a baby.', aiStance: 'meh', talk: 1, trash: 0.9, pitch: ['Pick me. I have a plan. It’s laminated.', 'I’ve prepared a deck. Thirty slides.', 'Day nine. Pick me.'], picked: 'Noted. It’s in the plan now.', dropped: 'Revising the plan. Again.' },
  { id: 'ulrich', name: 'Menafee', type: 'tourist', iq: 15, read: 10, clarityBase: 26, bio: 'Has never once shown up. People talk to his chair. It never answers.', aiStance: 'anti', talk: 1, trash: 0, pitch: ['', '', ''], picked: '', dropped: '' },
  { id: 'sal', name: 'Jack', type: 'tourist', iq: 30, read: 24, clarityBase: 16, bio: 'Sixteen. Thinks he is the best player at the table. Would like to know where the snacks are.', aiStance: 'anti', talk: 1.3, trash: 1.1, pitch: ['Pick me. I’m sixteen and I’ve never lost. Not true. Pick me.', 'Respectfully, pick me, sir.', 'Are there snacks? Pick me anyway.'], picked: 'Yes! Okay. Okay. Where are the pretzels.', dropped: 'That’s fair. Respectfully, it’s not.' },
  { id: 'nadia', name: 'David', type: 'pro', iq: 94, read: 84, clarityBase: 26, bio: 'Financial services. The hottest head at the table. Has a policy about checking.', aiStance: 'pro', talk: 1.3, trash: 1.9, temper: 2, pitch: ['Pick me. Do NOT pick Tim.', 'Pick me or I’m telling your wife.', 'Nobody checks at my table. Policy.'], picked: 'Correct. First correct thing you’ve done.', dropped: 'Unbelievable. UNBELIEVABLE.' },
  { id: 'jimmy', name: 'Bruce', type: 'pro', iq: 82, read: 90, clarityBase: 22, bio: 'Drove an hour to be tired here instead of at home. Never raises his voice; never misses. Loves the free market, the layoffs, and the machines that will replace you.', aiStance: 'pro', talk: 1.1, trash: 1.3, pitch: ['Pick me. I drove seventy minutes for this. Make it mean something.', 'I’ve got one joke tonight. It’s about you.', 'I’m tired, it’s late, and I’d still beat you. Deal.'], picked: 'Good. I was leaving at ten regardless.', dropped: 'Fine. Shorter night. Thank you, honestly.' },
];

/** The one format: you pick five men from the roster. */
export const GAME_NAME = 'Poker Night';

/** Dave's robot. It deals. */
export const DEALER_NAME = 'Skynet';

export function characterById(id: string): Character {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown character ${id}`);
  return c;
}
