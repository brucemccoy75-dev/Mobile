// Two-man table talk that has nothing to do with poker: office life, AI and data centers, wives,
// New Hampshire weather, Boston sports remembered badly, and the occasional dungeon. Lines alternate
// between A and B. {A} and {B} are the two speakers' names; {you} is the human.
export type Stance = 'pro' | 'anti' | 'meh';

export interface Conversation {
  tag: 'office' | 'ai' | 'spouse' | 'weather' | 'sports' | 'dnd';
  /** Required AI stance for a role, when the exchange depends on it. */
  needs?: { A?: Stance; B?: Stance };
  lines: ['A' | 'B', string][];
}

export const CONVERSATIONS: Conversation[] = [
  // ---- office ----------------------------------------------------------------------------------
  { tag: 'office', lines: [
    ['A', 'You still studying for the Series 7?'],
    ['B', 'Series 65. The 7 was last year. I failed by one question. One.'],
    ['A', 'Which one?'],
    ['B', 'All of them, apparently, but one specifically.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'The new guy brought a ukulele to lunch.'],
    ['B', 'Did he play it?'],
    ['A', 'No. He just set it on the table. Next to his soup. Like a warning.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'Somebody microwaved fish again. Third floor. Whole building.'],
    ['B', 'It was Dennis. It is always Dennis. Dennis has been microwaving the same fish since 2011.'],
    ['A', 'That explains the smell. And Dennis.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'I got the CFP. Finally. Six years.'],
    ['B', 'Congratulations. What changes?'],
    ['A', 'My email signature. That is it. That is the whole thing.'],
    ['B', 'Six years for three letters. I did the math, you are losing money.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'They moved the 401k match presentation to 4:30 on a Friday.'],
    ['B', 'Who is going to that?'],
    ['A', 'Nobody. Which is how they keep the match.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'I cold-called a guy today who turned out to be my old dentist.'],
    ['B', 'Did he roll over his IRA?'],
    ['A', 'He told me I have a cavity. Over the phone. He could hear it.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'Lunch today was a sad thing. Turkey on white. No condiments. Fluorescent lights.'],
    ['B', 'Where?'],
    ['A', 'My desk. I ate it looking at a spreadsheet about other people’s retirement.'],
    ['B', 'That is the job, {A}. That is the entire job.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'The new guy asked if we had a “vibe budget”.'],
    ['B', 'What did you tell him?'],
    ['A', 'I told him we had a budget. He seemed disappointed. Then he asked about the ukulele policy.'],
  ] },
  { tag: 'office', lines: [
    ['A', 'My manager wants me to “bring energy” to the Tuesday compliance call.'],
    ['B', 'What energy is there to bring to compliance?'],
    ['A', 'I wore a slightly louder tie. Nobody said anything. I think it worked.'],
  ] },

  // ---- AI and data centres ---------------------------------------------------------------------
  { tag: 'ai', needs: { A: 'pro', B: 'anti' }, lines: [
    ['A', 'They are putting a data centre on the old orchard off Route 3. Beautiful. Future’s here.'],
    ['B', 'The lights never turn off, {A}. I can read my mail at midnight from the glow.'],
    ['A', 'That is progress. Think of the jobs.'],
    ['B', 'Fourteen. Fourteen jobs. I counted the cars. It used to be apples.'],
  ] },
  { tag: 'ai', needs: { A: 'pro' }, lines: [
    ['A', 'I had the AI write my wife’s birthday card this year.'],
    ['B', 'How did that go?'],
    ['A', 'She cried. Good crying, I think. It mentioned a trip we never took. Very moving.'],
    ['B', 'So the robot lied to your wife and it went better than you ever have.'],
  ] },
  { tag: 'ai', needs: { A: 'anti', B: 'pro' }, lines: [
    ['A', 'My nephew lost his job to one of those chatbots.'],
    ['B', 'What did he do?'],
    ['A', 'He wrote the chatbot’s answers. Then it learned. Then it didn’t need him.'],
    ['B', 'That is actually a beautiful story. Like a bird leaving the nest.'],
    ['A', 'He is thirty-four and the bird lives in his old desk.'],
  ] },
  { tag: 'ai', needs: { A: 'pro', B: 'anti' }, lines: [
    ['A', 'Data centres are the new railroads. Everyone laughed at railroads.'],
    ['B', 'Nobody laughed at railroads. People loved railroads. You could ride a railroad.'],
    ['A', 'You can’t ride a data centre, no, but your email rides it.'],
    ['B', 'My email went fine on the old computers. The ones that turned off.'],
  ] },
  { tag: 'ai', needs: { B: 'anti' }, lines: [
    ['A', 'The grid thing is overblown. They said that about toasters.'],
    ['B', 'A toaster does not need its own substation and a lake to cool it.'],
    ['A', 'A lake?'],
    ['B', 'Tilton. They are using Tilton. I used to fish Tilton.'],
  ] },
  { tag: 'ai', needs: { A: 'pro' }, lines: [
    ['A', 'I asked the AI how to beat this table. It gave me a strategy.'],
    ['B', 'And?'],
    ['A', 'It said to fold. Every hand. For about a year.'],
    ['B', 'Smart machine.'],
  ] },
  { tag: 'ai', needs: { A: 'anti' }, lines: [
    ['A', 'The hum. Do you hear the hum? Since they built the thing on 3, there is a hum.'],
    ['B', 'That is your refrigerator.'],
    ['A', 'My refrigerator is from 1988 and it has never hummed. It groans. This is a hum.'],
  ] },
  { tag: 'ai', needs: { A: 'pro', B: 'anti' }, lines: [
    ['A', 'My car talks to me now. Suggests routes. Very polite.'],
    ['B', 'Does it take the route?'],
    ['A', 'It suggests. I decide. We have a partnership.'],
    ['B', 'My wife and I have that partnership. I know how it ends.'],
  ] },
  { tag: 'ai', needs: { B: 'pro' }, lines: [
    ['A', 'Who is actually using all that computing? Honestly. Who.'],
    ['B', 'I am. I asked it for a limerick about Dennis’s fish. It was excellent.'],
    ['A', 'They flattened an orchard for a fish limerick.'],
    ['B', 'A very good fish limerick.'],
  ] },

  // ---- spouses ---------------------------------------------------------------------------------
  { tag: 'spouse', lines: [
    ['A', 'I am allowed to play until nine.'],
    ['B', 'Allowed?'],
    ['A', 'Permitted. Cleared. There was a calendar invite.'],
    ['B', 'Mine reorganized my garage. Alphabetically. The rake is under “R”. I cannot find “R”.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'She picked my fantasy team this year.'],
    ['B', 'How is it doing?'],
    ['A', 'Undefeated. She has never watched a game. She picked by jersey colour.'],
    ['B', 'Mine does our taxes. I sign where the sticky note is. I do not read.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'My wife has a spreadsheet of my mistakes.'],
    ['B', 'Big spreadsheet?'],
    ['A', 'Multiple tabs. There is a tab for tone. Just tone.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'We are redoing the kitchen. Again. The last kitchen was a “mistake”.'],
    ['B', 'Whose mistake?'],
    ['A', 'Mine. I chose the colour. Fourteen months ago. From the two she gave me.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'I told my wife I was coming here to think.'],
    ['B', 'Did she buy that?'],
    ['A', 'She said “good, start with the gutters.” So no.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'My wife made me take a personality test for the marriage.'],
    ['B', 'How did you score?'],
    ['A', 'She did not tell me. She just nodded. Slowly. For a long time.'],
    ['B', 'That is a failing grade, {A}.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'My wife asked what I wanted for dinner and then made what she wanted.'],
    ['B', 'So why ask?'],
    ['A', 'Due process. Very important to her. She is a paralegal.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'Mine labelled the remote controls. With my name on none of them.'],
    ['B', 'So which do you use?'],
    ['A', 'I watch what is on. It is mostly a show about women who leave their husbands. She takes notes.'],
  ] },
  { tag: 'spouse', lines: [
    ['A', 'I bought a boat.'],
    ['B', 'Congratulations.'],
    ['A', 'It is in the driveway. It has been in the driveway for two years. She calls it “the decision”.'],
  ] },

  // ---- New Hampshire weather --------------------------------------------------------------------
  { tag: 'weather', lines: [
    ['A', 'It snowed in Concord in May. May.'],
    ['B', 'That is the third May in a row.'],
    ['A', 'My tomatoes have given up. They did not even try this year. Just stood there.'],
  ] },
  { tag: 'weather', lines: [
    ['A', 'Hit a frost heave on 93 so hard my glovebox opened and offered me a mint.'],
    ['B', 'Mud season is worse. Lost a boot in Loudon. Still there. Visit it sometimes.'],
  ] },
  { tag: 'weather', lines: [
    ['A', 'Forty degrees warmer in Nashua than in Berlin this morning. Same state.'],
    ['B', 'Berlin is not the same state. Berlin is a separate arrangement with God.'],
  ] },
  { tag: 'weather', lines: [
    ['A', 'My wife wants to move south. Says the winters are too long.'],
    ['B', 'How far south?'],
    ['A', 'Manchester.'],
    ['B', 'Bold.'],
  ] },
  { tag: 'weather', lines: [
    ['A', 'Remember when the Old Man of the Mountain fell off?'],
    ['B', 'Every day. I was in the car. My father said “well, that’s that” and we drove home.'],
    ['A', 'Nobody has said anything that true since.'],
  ] },
  { tag: 'weather', lines: [
    ['A', 'Black flies are out early.'],
    ['B', 'Black flies are never early. We are late. They own the state. We rent.'],
  ] },

  // ---- Boston sports, remembered badly ---------------------------------------------------------
  { tag: 'sports', lines: [
    ['A', 'Is Wade Boggs playing tonight?'],
    ['B', 'Wade Boggs retired in 1999, {A}.'],
    ['A', 'So he’s rested.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'Bledsoe looks sharp this year. Really stepping up.'],
    ['B', 'Drew Bledsoe?'],
    ['A', 'Who else? That kid behind him is never going to see the field.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'The Sox have not won it all since 1918. It is the curse. You cannot fight a curse.'],
    ['B', 'They won in 2004. And 2007. And 2013. And 2018.'],
    ['A', 'That is what they want you to think. Buckner. Say the name. Buckner.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'Bourque is going to carry the Bruins this year.'],
    ['B', 'Ray Bourque won his Cup in Colorado in 2001.'],
    ['A', 'Traitor. Still the best defenceman in the league though.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'Pitino is finally turning the Celtics around.'],
    ['B', '{A}, that was 1998 and he did not.'],
    ['A', 'Give him time. The Antoine Walker trade is going to pay off.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'Nomar’s batting stance. That is baseball. The gloves. The tapping.'],
    ['B', 'He has been retired for most of my career.'],
    ['A', 'He is day to day. He has always been day to day.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'You think the Patriots make the playoffs this year?'],
    ['B', 'With Grogan? No chance. The man is held together with tape.'],
    ['A', 'Steve Grogan is sixty-something, {B}.'],
    ['B', 'And still the best we have got.'],
  ] },
  { tag: 'sports', lines: [
    ['A', 'Went to the Garden. The old one. Rafters. Smoke. Larry.'],
    ['B', 'The old Garden was torn down in 1998.'],
    ['A', 'It was in my heart. The ticket was eleven dollars.'],
  ] },

  // ---- dungeons -------------------------------------------------------------------------------
  { tag: 'dnd', lines: [
    ['A', 'My wife DMs our group. She TPK’d us Thursday. Wiped the whole party.'],
    ['B', 'On purpose?'],
    ['A', 'She said the dice decided. She rolls behind a screen. The screen is her face.'],
  ] },
  { tag: 'dnd', lines: [
    ['A', 'Rolled a one on persuasion with my boss today.'],
    ['B', 'What were you persuading?'],
    ['A', 'That I needed Friday off. He said I have disadvantage on all future Fridays.'],
  ] },
  { tag: 'dnd', lines: [
    ['A', 'This whole table is a dungeon. {you} is the final boss. Low hit points, high charisma.'],
    ['B', 'And what are you?'],
    ['A', 'Bard. Obviously. I talk, I lose, I get a song out of it.'],
  ] },
  { tag: 'dnd', lines: [
    ['A', 'My paladin has a mortgage now. Twenty years in, the campaign got realistic.'],
    ['B', 'What does he fight?'],
    ['A', 'Property taxes. Lawful good does not help with property taxes.'],
  ] },
  { tag: 'dnd', lines: [
    ['A', 'Natural twenty on the river. That is what that was.'],
    ['B', 'That is not how cards work, {A}.'],
    ['A', 'Nothing is how it works. My wife rolls for me on Thursdays and I still lose.'],
  ] },
  { tag: 'dnd', lines: [
    ['A', 'I named my dog Vecna.'],
    ['B', 'Does your wife know who Vecna is?'],
    ['A', 'She thinks it is Italian. Please never tell her. She would take the dog in the divorce.'],
  ] },
];
