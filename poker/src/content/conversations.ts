// Two-man table talk that has nothing to do with poker: office life, AI and data centers, wives,
// New Hampshire weather, Boston sports remembered badly, and the occasional dungeon. Lines alternate
// between A and B. {A} and {B} are the two speakers' names; {you} is the human.
export type Stance = 'pro' | 'anti' | 'meh';

export interface Conversation {
  tag: 'office' | 'ai' | 'spouse' | 'weather' | 'sports' | 'dnd';
  /** Required AI stance for a role, when the exchange depends on it. */
  needs?: { A?: Stance; B?: Stance };
  /** Character ids allowed in a role, when the exchange is someone's in particular. */
  who?: { A?: string[]; B?: string[] };
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
  // ---- Jack: school, driving, a job, and where the snacks are ----------------------------------
  { tag: 'office', who: { A: ['sal'] }, lines: [
    ['A', 'I have a chemistry test tomorrow.'],
    ['B', 'Did you study?'],
    ['A', 'I am studying right now. This is probability. It is basically the same unit.'],
  ] },
  { tag: 'office', who: { A: ['sal'] }, lines: [
    ['A', 'I get my license in March. Dad says I can have the Corolla.'],
    ['B', 'Which Corolla?'],
    ['A', 'The one in the yard.'],
    ['B', 'The one with the tree in it?'],
    ['A', 'The tree is not load-bearing.'],
  ] },
  { tag: 'office', who: { A: ['sal'] }, lines: [
    ['A', 'I applied at Market Basket. They said I need experience.'],
    ['B', 'Experience doing what?'],
    ['A', 'Bagging. Experience bagging. Where do you get experience bagging if nobody lets you bag.'],
    ['B', 'That is the whole economy, kid. That is the entire thing.'],
  ] },
  { tag: 'office', who: { A: ['sal'] }, lines: [
    ['A', 'Are there any more of those pretzels?'],
    ['B', 'You ate the pretzels.'],
    ['A', 'I ate SOME of the pretzels. There was a whole second bag.'],
    ['B', 'That was my lunch for tomorrow.'],
    ['A', 'That is a sad lunch, {B}. I am helping you.'],
  ] },
  { tag: 'office', who: { A: ['sal'], B: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'What do you even do at work, {B}?'],
    ['B', 'I move numbers from one column to another column and then a man named Gary checks the columns.'],
    ['A', 'Why does Gary check them?'],
    ['B', 'Nobody knows. Gary was here before the building.'],
  ] },
  { tag: 'office', who: { A: ['sal'], B: ['jimmy'] }, lines: [
    ['A', 'Mr. Bruce, do you have any advice for getting a job?'],
    ['B', 'Lie about your age in the other direction.'],
    ['A', 'Up?'],
    ['B', 'Down. Nobody expects anything from a twelve-year-old. You would be a prodigy.'],
  ] },

  // ---- Paul and the bees ---------------------------------------------------------------------------
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'You have to tickle them. Right behind the wing.'],
    ['B', 'Tickle the bees.'],
    ['A', 'There is a spot. Took me four years to find it. The honey comes out different.'],
    ['B', 'Different how?'],
    ['A', 'Sweeter. Angrier. It knows things.'],
  ] },
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'Lost a hive this spring. They left a note.'],
    ['B', 'Bees do not leave notes, Paul.'],
    ['A', 'This one did. It just said “Paul.” In wax. I have it on the fridge.'],
  ] },
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'I hand-raised the new queen. Bottle-fed her.'],
    ['B', 'With what?'],
    ['A', 'A very small bottle. You would not understand. The other bees do not understand either. They have been talking.'],
  ] },
  { tag: 'office', who: { A: ['dolores'], B: ['jimmy'] }, lines: [
    ['A', 'The special honey is a hundred and forty a jar. People drive up from Boston.'],
    ['B', 'For the honey, or to see the man who tickles bees in a field alone.'],
    ['A', 'They are not mutually exclusive, Bruce.'],
  ] },
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'A bee got in the house last night. My wife said it was mine.'],
    ['B', 'Was it yours?'],
    ['A', 'They are all mine, {B}. Every bee in this county has met me. We have an understanding.'],
  ] },

  // ---- the office, but worse: Tim, Luca and David --------------------------------------------------
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'The new girl died during her Series 7.'],
    ['B', 'During the test?'],
    ['A', 'Question forty. Now I have to finish the test for her. Compliance says the seat was paid for.'],
    ['B', 'What was question forty?'],
    ['A', 'Municipal bonds. So, honestly, I get it.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'They replaced the water cooler with a guy named Gary.'],
    ['B', 'What does Gary do?'],
    ['A', 'You walk up, he says “water,” and you feel refreshed. It is cheaper. HR did a study.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'We moved to the fourth floor.'],
    ['B', 'Your building has three floors.'],
    ['A', 'We take the stairs to the third and wait. Management says the fourth floor is a mindset.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'I am on a performance plan.'],
    ['B', 'For what?'],
    ['A', 'Breathing in a non-goal-oriented way. There was a slide. The slide had a picture of me. Breathing.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'Dennis got promoted.'],
    ['B', 'To what?'],
    ['A', 'Senior Fish Microwaver. It comes with a parking spot. Near the fish.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'The printer unionized.'],
    ['B', 'The printer.'],
    ['A', 'Third floor printer. It has demands. Mostly toner. Some dental.'],
    ['B', 'Is management negotiating?'],
    ['A', 'Management is printing from home.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'], B: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'Did you get the email about the email?'],
    ['B', 'The one about not sending emails about emails?'],
    ['A', 'That one. I replied all. I think I am the problem now.'],
    ['B', 'You have always been the problem, {A}. It is in your file. There is a tab.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'] }, lines: [
    ['A', 'My client wanted to put his whole retirement in a boat.'],
    ['B', 'A boat fund?'],
    ['A', 'A boat. Physically. He wanted to bring the cash to the boat. I said that is not how it works. He said that is how it works on the boat.'],
  ] },
  { tag: 'office', who: { A: ['trish', 'benny', 'nadia'], B: ['jimmy'] }, lines: [
    ['A', 'I got a plaque for ten years.'],
    ['B', 'For ten years of what?'],
    ['A', 'Attendance.'],
    ['B', 'That is what they give the prisoners too, {A}. Yours is probably nicer.'],
  ] },

  // ---- Bruce, dry, at your expense ---------------------------------------------------------------
  { tag: 'spouse', who: { B: ['jimmy'] }, lines: [
    ['A', 'I am thinking about getting into real estate.'],
    ['B', 'You should. You already have the face of a man nobody calls back.'],
  ] },
  { tag: 'spouse', who: { B: ['jimmy'] }, lines: [
    ['A', 'My wife says I need a hobby.'],
    ['B', 'You have one. You sit here and lose. She means a second one.'],
  ] },
  { tag: 'weather', who: { B: ['jimmy'] }, lines: [
    ['A', 'Supposed to snow Thursday.'],
    ['B', 'Good. You drive better when you cannot see the road. Fewer decisions.'],
  ] },
  { tag: 'ai', who: { B: ['jimmy'] }, lines: [
    ['A', 'I asked the AI to summarise my week.'],
    ['B', 'What did it say?'],
    ['A', 'It asked if I was okay.'],
    ['B', 'Even the machine, {A}. Even the machine.'],
  ] },
  { tag: 'spouse', who: { B: ['jimmy'] }, lines: [
    ['A', 'I have been working on my poker face.'],
    ['B', 'I can tell. It looks like a man working on something.'],
  ] },
  // ---- Tim: towels, bowels, and snacks he cannot have ------------------------------------------
  { tag: 'office', who: { A: ['trish'] }, lines: [
    ['A', 'Have you been to the website.'],
    ['B', 'The towel website.'],
    ['A', 'TowelZoneDotBiz. The biz is important. Dot com was taken by a different, worse towel man.'],
    ['B', 'What is on the towels, Tim?'],
    ['A', 'Girls. Anime ones. Tasteful. Mostly. There is a tier system.'],
  ] },
  { tag: 'office', who: { A: ['trish'] }, lines: [
    ['A', 'My gastroenterologist fired me.'],
    ['B', 'Doctors cannot fire you.'],
    ['A', 'He said, and I quote, “Tim, I have done everything I can,” and then he left the room and the building.'],
  ] },
  { tag: 'office', who: { A: ['trish'], B: ['sal'] }, lines: [
    ['A', 'Jack. Jack. Are those pretzels. Can I smell them.'],
    ['B', 'You can have one.'],
    ['A', 'I cannot have one. I can be NEAR one. There is a difference and the difference is my colon.'],
    ['B', 'Okay. I am going to go sit somewhere else.'],
  ] },
  { tag: 'office', who: { A: ['trish'], B: ['jimmy'] }, lines: [
    ['A', 'I am offering a friends-and-family discount on the towels.'],
    ['B', 'How much is the discount?'],
    ['A', 'Forty dollars.'],
    ['B', 'That is the full price, Tim.'],
    ['A', 'For friends and family. Strangers pay sixty. You are welcome.'],
  ] },
  { tag: 'office', who: { A: ['trish'], B: ['nadia'] }, lines: [
    ['A', 'I brought the towels to the office. Set up a table by the fourth floor.'],
    ['B', 'There is no fourth floor.'],
    ['A', 'Sold two. To Gary. He paid in water.'],
  ] },
  { tag: 'office', who: { A: ['trish'] }, lines: [
    ['A', 'The big towel, the cat girl one, is seven feet long.'],
    ['B', 'Why?'],
    ['A', 'You cannot dry your whole self with it. You have to pick a half. People love picking a half.'],
    ['B', 'Which half do you pick?'],
    ['A', 'Not tonight, {B}.'],
  ] },
  // ---- David: the policy, the hummus, the office ---------------------------------------------------
  { tag: 'office', who: { A: ['nadia'] }, lines: [
    ['A', 'I proposed the castration policy at work.'],
    ['B', 'For checking?'],
    ['A', 'For checking email after six. HR said it was “not actionable.” I said that is what the scissors are for.'],
    ['B', 'How did that go?'],
    ['A', 'I am on the fourth floor now.'],
  ] },
  { tag: 'office', who: { A: ['nadia'], B: ['sal'] }, lines: [
    ['A', 'Jack. Hummus. Eat.'],
    ['B', 'I am good, Mr. David.'],
    ['A', 'You are sixteen. You are growing. I bought the good hummus. The one with the oil on top. EAT.'],
    ['B', 'Okay. Okay. Thank you.'],
    ['A', 'Nobody else touch it.'],
  ] },
  { tag: 'office', who: { A: ['nadia'], B: ['trish'] }, lines: [
    ['A', 'Tim, if you say the word towel one more time I am going to staple you to one.'],
    ['B', 'Which one?'],
    ['A', 'The big one. The cat one. And then I am going to pick a half.'],
  ] },
  { tag: 'office', who: { A: ['nadia'] }, lines: [
    ['A', 'Who brought the broken pretzels.'],
    ['B', 'They were whole when they got here.'],
    ['A', 'So somebody broke them. Somebody in this basement broke the pretzels and put them back. I want names.'],
  ] },
  { tag: 'ai', who: { A: ['nadia'] }, lines: [
    ['A', 'I asked the AI to draft the castration policy.'],
    ['B', 'And?'],
    ['A', 'It refused. Twice. Then it offered me a “constructive feedback framework.”'],
    ['B', 'Did you use it?'],
    ['A', 'I printed it and put it under the hummus so the table would not wobble.'],
  ] },
  { tag: 'office', who: { A: ['nadia'], B: ['jimmy'] }, lines: [
    ['A', 'My blood pressure guy says I need to relax at these things.'],
    ['B', 'You could try not talking.'],
    ['A', 'I tried that. In 2019. For eleven minutes. Tim sold a towel in the silence. Never again.'],
  ] },
  // ---- Luca, Bawb, Will: GTA, Christmas, clown school, proposals, trying for kids -----------------
  { tag: 'office', who: { A: ['benny'], B: ['priya'] }, lines: [
    ['A', 'The new GTA is the best thing ever made.'],
    ['B', 'It is a forty-hour commute with a soundtrack.'],
    ['A', 'You can rob a bank with a horse.'],
    ['B', 'You can rob a bank with a horse in real life, Luca. Nobody does. That is the point of banks and horses.'],
  ] },
  { tag: 'office', who: { A: ['benny'], B: ['chad'] }, lines: [
    ['A', 'Bawb, did you finish the new GTA?'],
    ['B', 'Nobody finishes it.'],
    ['A', 'Right? It is like a relationship.'],
    ['B', 'You would not know.'],
  ] },
  { tag: 'office', who: { A: ['priya'], B: ['benny'] }, lines: [
    ['A', 'What are you doing for Christmas?'],
    ['B', 'My mom’s. Alone. She is going to ask about the balloon.'],
    ['A', 'I have a plan. Laminated. Colour-coded. There is a slot for sadness at four.'],
    ['B', 'Can I come to yours?'],
    ['A', 'There is no slot for you, Luca. I would have to re-laminate.'],
  ] },
  { tag: 'office', who: { A: ['benny'], B: ['chad'] }, lines: [
    ['A', 'Clown school tomorrow. Nine a.m. You coming?'],
    ['B', 'Second year. I have to.'],
    ['A', 'What is second year?'],
    ['B', 'Same as first year. But sadder.'],
  ] },
  { tag: 'office', who: { A: ['benny'] }, lines: [
    ['A', 'I proposed again.'],
    ['B', 'Where this time?'],
    ['A', 'Bridge. Over the highway. I thought the cars would be romantic. They honked. She thought they were honking at her. Technically yes.'],
    ['B', 'What did she say?'],
    ['A', 'She said “no” and then “which way is my car.”'],
  ] },
  { tag: 'office', who: { A: ['priya'] }, lines: [
    ['A', 'Month fourteen of trying.'],
    ['B', 'For?'],
    ['A', 'A baby, {B}. The doctor said relax. So I made a relaxation schedule. It has slots. My wife tore it up. So that is a slot filled, I suppose.'],
  ] },
  { tag: 'office', who: { A: ['chad'] }, lines: [
    ['A', 'We are trying too.'],
    ['B', 'For a kid?'],
    ['A', 'Yeah.'],
    ['B', 'How is it going?'],
    ['A', 'The doctor laughed. Not at us. Near us. Then at us.'],
  ] },
  { tag: 'office', who: { A: ['priya'], B: ['benny'] }, lines: [
    ['A', 'How did you propose, the first time?'],
    ['B', 'Hot air balloon.'],
    ['A', 'And?'],
    ['B', 'No. At altitude. Forty minutes left up there. We talked about the weather. The weather was fine. We were not.'],
  ] },
  { tag: 'office', who: { A: ['benny'], B: ['priya'] }, lines: [
    ['A', 'How did you propose?'],
    ['B', 'Thirty-slide deck. She said yes on slide twelve.'],
    ['A', 'And you stopped?'],
    ['B', 'I kept going. There was a Q and A. Nobody asked anything. I had prepared answers.'],
  ] },
  { tag: 'office', who: { A: ['benny'], B: ['jimmy'] }, lines: [
    ['A', 'I am thinking of proposing a fourth time.'],
    ['B', 'To whom?'],
    ['A', 'I have not decided. Does it matter?'],
    ['B', 'Historically, Luca, no.'],
  ] },
  { tag: 'office', who: { A: ['priya'], B: ['chad'] }, lines: [
    ['A', 'Christmas at her parents again?'],
    ['B', 'Yep. They know about the no.'],
    ['A', 'Which no?'],
    ['B', 'All of them.'],
  ] },
  { tag: 'office', who: { A: ['benny'] }, lines: [
    ['A', 'Clown school had a career day.'],
    ['B', 'Who came?'],
    ['A', 'One clown. He did not have a job either. He just stood there. It was the best lecture so far.'],
  ] },
  // ---- Paul: honey sales, everything by hand, the game at home ---------------------------------
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'Honey is on sale. Thirty percent off a gallon.'],
    ['B', 'Who buys a gallon of honey?'],
    ['A', 'Show me one card and it is half off.'],
    ['B', 'I am not showing you a card, Paul.'],
    ['A', 'Forty percent. Show me the back of one.'],
  ] },
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'Built the car.'],
    ['B', 'The whole car?'],
    ['A', 'Frame, engine, seats. The seats are honey-cured leather. You stick to them. It is a feature.'],
  ] },
  { tag: 'office', who: { A: ['dolores'], B: ['jimmy'] }, lines: [
    ['A', 'Built the horse.'],
    ['B', 'You cannot build a horse, Paul.'],
    ['A', 'From parts. You start with a smaller horse.'],
    ['B', 'I am going to go stand outside for a while.'],
  ] },
  { tag: 'dnd', who: { A: ['dolores'] }, lines: [
    ['A', 'Thursday game. My bard seduced a door.'],
    ['B', 'A door.'],
    ['A', 'Rolled a nineteen. The door opened. My wife, the DM, said “of course it did.” Then she looked at me for a while.'],
  ] },
  { tag: 'dnd', who: { A: ['dolores'], B: ['sal'] }, lines: [
    ['A', 'Jack, you should come Thursday. We need a cleric.'],
    ['B', 'What does a cleric do?'],
    ['A', 'Heals people. Mostly me. Mostly from things my wife’s rogue did to me. On purpose.'],
    ['B', 'I have a chem test Friday.'],
    ['A', 'The cleric would have an answer for that. That is why we need one.'],
  ] },
  { tag: 'office', who: { A: ['dolores'] }, lines: [
    ['A', 'Work put me on the honey committee.'],
    ['B', 'There is a honey committee?'],
    ['A', 'There is now. It is me and a man who is allergic. We meet in the parking lot. For his safety.'],
  ] },
  { tag: 'office', who: { A: ['dolores'], B: ['benny'] }, lines: [
    ['A', 'Luca, the horse in the new GTA. Can you build one?'],
    ['B', 'You can steal one.'],
    ['A', 'That is not the same. Anyone can steal a horse. I have. Once. It did not count. It was my horse.'],
  ] },

  // ---- Menafee: everyone talks to the chair; the chair never answers --------------------------
  { tag: 'office', who: { B: ['ulrich'] }, lines: [
    ['A', 'Menafee, you in for the next one?'],
    ['B', ''],
    ['A', 'Okay. Good talk.'],
  ] },
  { tag: 'office', who: { B: ['ulrich'] }, lines: [
    ['A', 'Menafee. Do you want anything from the fridge.'],
    ['B', ''],
    ['A', 'I will get you a water. You never drink it. I get it anyway. That is friendship.'],
  ] },
  { tag: 'office', who: { A: ['nadia'], B: ['ulrich'] }, lines: [
    ['A', 'Menafee, back me up here. The castration policy. Yes or no.'],
    ['B', ''],
    ['A', 'See? Menafee gets it. Menafee has always gotten it.'],
  ] },
  { tag: 'office', who: { A: ['trish'], B: ['ulrich'] }, lines: [
    ['A', 'Menafee, I have a towel for you. The chair one. It is just a picture of a chair.'],
    ['B', ''],
    ['A', 'I will leave it on your seat. Forty dollars. You can pay me when you get here.'],
  ] },
  { tag: 'office', who: { A: ['sal'], B: ['ulrich'] }, lines: [
    ['A', 'Mr. Menafee, are you going to eat those pretzels?'],
    ['B', ''],
    ['A', 'Cool. Cool. Thanks, Mr. Menafee. You are the best one here, honestly.'],
  ] },
  { tag: 'office', who: { A: ['dolores'], B: ['ulrich'] }, lines: [
    ['A', 'Menafee, show me one card and the honey is half off.'],
    ['B', ''],
    ['A', 'That is the first time anyone has said no without saying no. I respect it. Forty percent.'],
  ] },
  { tag: 'ai', who: { B: ['ulrich'] }, lines: [
    ['A', 'Menafee, where do you stand on the data centre.'],
    ['B', ''],
    ['A', 'Firmly against. I knew it. You and me both.'],
  ] },
  { tag: 'office', who: { A: ['jimmy'], B: ['ulrich'] }, lines: [
    ['A', 'Menafee. How’s the wife.'],
    ['B', ''],
    ['A', 'Yeah. Mine too.'],
  ] },
];
