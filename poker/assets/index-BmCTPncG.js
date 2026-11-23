(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[{id:`harold`,name:`David Sr`,type:`nit`,iq:48,read:32,clarityBase:24,bio:`David’s father. Seventy. Folds almost everything, remembers when a pot was eleven dollars, calls his son “the boy”. His hip has opinions.`,aiStance:`anti`,talk:.5,trash:.6,pitch:[`I fold a lot. You’ll like that.`,`We played for nickels in ’74. Real nickels. Pick me.`,`The boy needs someone at the table who knows how to fold.`],picked:`Fine. Somebody help me with the chair.`,dropped:`Fine. Bed, then.`},{id:`dolores`,name:`Paul`,type:`nit`,iq:52,read:38,clarityBase:14,bio:`Makes everything by hand: clothes, car, horse. Sells honey. Calls a full house a full homestead.`,aiStance:`meh`,talk:1.1,trash:.8,pitch:[`Pick me and the honey’s half off. Show me one card.`,`I built the chair I’ll be sitting in.`,`Full homestead. Think about it.`],picked:`Honey’s in the truck. Half off.`,dropped:`Thirty percent off. Still.`},{id:`marvin`,name:`Kevin`,type:`tourist`,iq:18,read:12,clarityBase:30,bio:`Nobody is sure who invited Kevin. Kevin is not sure either.`,aiStance:`anti`,talk:.6,trash:.8,temper:1.4,pitch:[`PICK ME. I AM SO READY. WHO ARE YOU.`,`I have never been more sober.`,`Kevin is HERE. Kevin is IN.`],picked:`YES. YESSSS. Where’s the bathroom.`,dropped:`No. NO. Okay. Yes. Okay.`},{id:`chad`,name:`Bawb`,type:`pro`,iq:93,read:86,clarityBase:22,bio:`Phone in one hand, cards in the other. Live updates from girls’ softball, basketball and track across southern New Hampshire. Takes your stack between innings. Second year of clown school. She said no.`,aiStance:`pro`,talk:.9,trash:.5,pitch:[`Pick me. Bedford’s up two in the fourth. I can do both.`,`Kara’s hamstring is fine. I checked. Pick me.`,`Hold on. Souhegan just tied it. Okay. Pick me.`],picked:`Good. Hold on. Londonderry just put a runner on.`,dropped:`Fine. More time for the softball thread.`},{id:`trish`,name:`Tim`,type:`tourist`,iq:36,read:30,clarityBase:12,bio:`Financial services. Has stories from the office that cannot all be true.`,aiStance:`meh`,talk:1.2,trash:1.7,pitch:[`Pick me and I’ll throw in a towel. Forty dollars.`,`I can’t eat the chips. I can be near them.`,`TowelZoneDotBiz. Pick me.`],picked:`Towel’s on your seat. Forty.`,dropped:`The towels will remember this.`},{id:`benny`,name:`Luca`,type:`tourist`,iq:22,read:18,clarityBase:30,bio:`Loves the new GTA. Enrolled in clown school. Has proposed three times, all of them high up.`,aiStance:`pro`,talk:1.1,trash:1,pitch:[`Pick me. Nobody picks me. Ask the balloon.`,`I’ve got clown school at nine. I’m free till then.`,`The new GTA has a horse. Pick me.`],picked:`A yes! Finally! Put it on the fridge!`,dropped:`That’s fine. That’s the Celtics game all over again.`},{id:`wen`,name:`Jonathan`,type:`calculator`,iq:92,read:48,clarityBase:12,bio:`Built like a boxer, wears the B hat, and has the Division II standings for three girls’ sports memorised. Feuds with the NHIAA by letter.`,aiStance:`pro`,talk:.9,trash:.6,pitch:[`Pick me. I have the Division II standings memorised. All three sports.`,`Londonderry lost. I just want everyone to know that going in.`,`Bedford clinched. Pick me. I’ll explain the tiebreaker.`],picked:`Yes. I will keep the scores coming.`,dropped:`That is a Pinkerton move. Sitting a guy for no reason.`},{id:`priya`,name:`Will`,type:`calculator`,iq:84,read:58,clarityBase:18,bio:`Plans everything, laminates it, and is on month fourteen of trying for a baby.`,aiStance:`meh`,talk:1,trash:.9,pitch:[`Pick me. I have a plan. It’s laminated.`,`I’ve prepared a deck. Thirty slides.`,`Day nine. Pick me.`],picked:`Noted. It’s in the plan now.`,dropped:`Revising the plan. Again.`},{id:`ulrich`,name:`Menafee`,type:`tourist`,iq:15,read:10,clarityBase:26,bio:`Has never once shown up. People talk to his chair. It never answers.`,aiStance:`anti`,talk:1,trash:0,pitch:[``,``,``],picked:``,dropped:``},{id:`sal`,name:`Jack`,type:`tourist`,iq:30,read:24,clarityBase:16,bio:`Sixteen. Thinks he is the best player at the table. Would like to know where the snacks are.`,aiStance:`anti`,talk:1.3,trash:1.1,pitch:[`Pick me. I’m sixteen and I’ve never lost. Not true. Pick me.`,`Respectfully, pick me, sir.`,`Are there snacks? Pick me anyway.`],picked:`Yes! Okay. Okay. Where are the pretzels.`,dropped:`That’s fair. Respectfully, it’s not.`},{id:`nadia`,name:`David`,type:`pro`,iq:94,read:84,clarityBase:26,bio:`Financial services. The hottest head at the table. Has a policy about checking.`,aiStance:`pro`,talk:1.3,trash:1.9,temper:2,pitch:[`Pick me. Do NOT pick Tim.`,`Pick me or I’m telling your wife.`,`Nobody checks at my table. Policy.`],picked:`Correct. First correct thing you’ve done.`,dropped:`Unbelievable. UNBELIEVABLE.`},{id:`jimmy`,name:`Bruce`,type:`pro`,iq:82,read:90,clarityBase:22,bio:`Drove an hour to be tired here instead of at home. Never raises his voice; never misses. Loves the free market, the layoffs, and the machines that will replace you.`,aiStance:`pro`,talk:1.1,trash:1.3,pitch:[`Pick me. I drove seventy minutes for this. Make it mean something.`,`I’ve got one joke tonight. It’s about you.`,`I’m tired, it’s late, and I’d still beat you. Deal.`],picked:`Good. I was leaving at ten regardless.`,dropped:`Fine. Shorter night. Thank you, honestly.`}],t=`Poker Night`,n=`Skynet`;function r(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function i(e){let t=2166136261;for(let n=0;n<e.length;n++)t^=e.charCodeAt(n),t=Math.imul(t,16777619);return t>>>0}var a=[{tag:`office`,lines:[[`A`,`You still studying for the Series 7?`],[`B`,`Series 65. The 7 was last year. I failed by one question. One.`],[`A`,`Which one?`],[`B`,`All of them, apparently, but one specifically.`]]},{tag:`office`,lines:[[`A`,`The new guy brought a ukulele to lunch.`],[`B`,`Did he play it?`],[`A`,`No. He just set it on the table. Next to his soup. Like a warning.`]]},{tag:`office`,lines:[[`A`,`Somebody microwaved fish again. Third floor. Whole building.`],[`B`,`It was Dennis. It is always Dennis. Dennis has been microwaving the same fish since 2011.`],[`A`,`That explains the smell. And Dennis.`]]},{tag:`office`,lines:[[`A`,`I got the CFP. Finally. Six years.`],[`B`,`Congratulations. What changes?`],[`A`,`My email signature. That is it. That is the whole thing.`],[`B`,`Six years for three letters. I did the math, you are losing money.`]]},{tag:`office`,lines:[[`A`,`They moved the 401k match presentation to 4:30 on a Friday.`],[`B`,`Who is going to that?`],[`A`,`Nobody. Which is how they keep the match.`]]},{tag:`office`,lines:[[`A`,`I cold-called a guy today who turned out to be my old dentist.`],[`B`,`Did he roll over his IRA?`],[`A`,`He told me I have a cavity. Over the phone. He could hear it.`]]},{tag:`office`,lines:[[`A`,`Lunch today was a sad thing. Turkey on white. No condiments. Fluorescent lights.`],[`B`,`Where?`],[`A`,`My desk. I ate it looking at a spreadsheet about other people’s retirement.`],[`B`,`That is the job, {A}. That is the entire job.`]]},{tag:`office`,lines:[[`A`,`The new guy asked if we had a “vibe budget”.`],[`B`,`What did you tell him?`],[`A`,`I told him we had a budget. He seemed disappointed. Then he asked about the ukulele policy.`]]},{tag:`office`,lines:[[`A`,`My manager wants me to “bring energy” to the Tuesday compliance call.`],[`B`,`What energy is there to bring to compliance?`],[`A`,`I wore a slightly louder tie. Nobody said anything. I think it worked.`]]},{tag:`ai`,needs:{A:`pro`,B:`anti`},lines:[[`A`,`They are putting a data centre on the old orchard off Route 3. Beautiful. Future’s here.`],[`B`,`The lights never turn off, {A}. I can read my mail at midnight from the glow.`],[`A`,`That is progress. Think of the jobs.`],[`B`,`Fourteen. Fourteen jobs. I counted the cars. It used to be apples.`]]},{tag:`ai`,needs:{A:`pro`},lines:[[`A`,`I had the AI write my wife’s birthday card this year.`],[`B`,`How did that go?`],[`A`,`She cried. Good crying, I think. It mentioned a trip we never took. Very moving.`],[`B`,`So the robot lied to your wife and it went better than you ever have.`]]},{tag:`ai`,needs:{A:`anti`,B:`pro`},lines:[[`A`,`My nephew lost his job to one of those chatbots.`],[`B`,`What did he do?`],[`A`,`He wrote the chatbot’s answers. Then it learned. Then it didn’t need him.`],[`B`,`That is actually a beautiful story. Like a bird leaving the nest.`],[`A`,`He is thirty-four and the bird lives in his old desk.`]]},{tag:`ai`,needs:{A:`pro`,B:`anti`},lines:[[`A`,`Data centres are the new railroads. Everyone laughed at railroads.`],[`B`,`Nobody laughed at railroads. People loved railroads. You could ride a railroad.`],[`A`,`You can’t ride a data centre, no, but your email rides it.`],[`B`,`My email went fine on the old computers. The ones that turned off.`]]},{tag:`ai`,needs:{B:`anti`},lines:[[`A`,`The grid thing is overblown. They said that about toasters.`],[`B`,`A toaster does not need its own substation and a lake to cool it.`],[`A`,`A lake?`],[`B`,`Tilton. They are using Tilton. I used to fish Tilton.`]]},{tag:`ai`,needs:{A:`pro`},lines:[[`A`,`I asked the AI how to beat this table. It gave me a strategy.`],[`B`,`And?`],[`A`,`It said to fold. Every hand. For about a year.`],[`B`,`Smart machine.`]]},{tag:`ai`,needs:{A:`anti`},lines:[[`A`,`The hum. Do you hear the hum? Since they built the thing on 3, there is a hum.`],[`B`,`That is your refrigerator.`],[`A`,`My refrigerator is from 1988 and it has never hummed. It groans. This is a hum.`]]},{tag:`ai`,needs:{A:`pro`,B:`anti`},lines:[[`A`,`My car talks to me now. Suggests routes. Very polite.`],[`B`,`Does it take the route?`],[`A`,`It suggests. I decide. We have a partnership.`],[`B`,`My wife and I have that partnership. I know how it ends.`]]},{tag:`ai`,needs:{B:`pro`},lines:[[`A`,`Who is actually using all that computing? Honestly. Who.`],[`B`,`I am. I asked it for a limerick about Dennis’s fish. It was excellent.`],[`A`,`They flattened an orchard for a fish limerick.`],[`B`,`A very good fish limerick.`]]},{tag:`spouse`,lines:[[`A`,`I am allowed to play until nine.`],[`B`,`Allowed?`],[`A`,`Permitted. Cleared. There was a calendar invite.`],[`B`,`Mine reorganized my garage. Alphabetically. The rake is under “R”. I cannot find “R”.`]]},{tag:`spouse`,lines:[[`A`,`She picked my fantasy team this year.`],[`B`,`How is it doing?`],[`A`,`Undefeated. She has never watched a game. She picked by jersey colour.`],[`B`,`Mine does our taxes. I sign where the sticky note is. I do not read.`]]},{tag:`spouse`,lines:[[`A`,`My wife has a spreadsheet of my mistakes.`],[`B`,`Big spreadsheet?`],[`A`,`Multiple tabs. There is a tab for tone. Just tone.`]]},{tag:`spouse`,lines:[[`A`,`We are redoing the kitchen. Again. The last kitchen was a “mistake”.`],[`B`,`Whose mistake?`],[`A`,`Mine. I chose the colour. Fourteen months ago. From the two she gave me.`]]},{tag:`spouse`,lines:[[`A`,`I told my wife I was coming here to think.`],[`B`,`Did she buy that?`],[`A`,`She said “good, start with the gutters.” So no.`]]},{tag:`spouse`,lines:[[`A`,`My wife made me take a personality test for the marriage.`],[`B`,`How did you score?`],[`A`,`She did not tell me. She just nodded. Slowly. For a long time.`],[`B`,`That is a failing grade, {A}.`]]},{tag:`spouse`,lines:[[`A`,`My wife asked what I wanted for dinner and then made what she wanted.`],[`B`,`So why ask?`],[`A`,`Due process. Very important to her. She is a paralegal.`]]},{tag:`spouse`,lines:[[`A`,`Mine labelled the remote controls. With my name on none of them.`],[`B`,`So which do you use?`],[`A`,`I watch what is on. It is mostly a show about women who leave their husbands. She takes notes.`]]},{tag:`spouse`,lines:[[`A`,`I bought a boat.`],[`B`,`Congratulations.`],[`A`,`It is in the driveway. It has been in the driveway for two years. She calls it “the decision”.`]]},{tag:`weather`,lines:[[`A`,`It snowed in Concord in May. May.`],[`B`,`That is the third May in a row.`],[`A`,`My tomatoes have given up. They did not even try this year. Just stood there.`]]},{tag:`weather`,lines:[[`A`,`Hit a frost heave on 93 so hard my glovebox opened and offered me a mint.`],[`B`,`Mud season is worse. Lost a boot in Loudon. Still there. Visit it sometimes.`]]},{tag:`weather`,lines:[[`A`,`Forty degrees warmer in Nashua than in Berlin this morning. Same state.`],[`B`,`Berlin is not the same state. Berlin is a separate arrangement with God.`]]},{tag:`weather`,lines:[[`A`,`My wife wants to move south. Says the winters are too long.`],[`B`,`How far south?`],[`A`,`Manchester.`],[`B`,`Bold.`]]},{tag:`weather`,lines:[[`A`,`Remember when the Old Man of the Mountain fell off?`],[`B`,`Every day. I was in the car. My father said “well, that’s that” and we drove home.`],[`A`,`Nobody has said anything that true since.`]]},{tag:`weather`,lines:[[`A`,`Black flies are out early.`],[`B`,`Black flies are never early. We are late. They own the state. We rent.`]]},{tag:`sports`,lines:[[`A`,`Is Wade Boggs playing tonight?`],[`B`,`Wade Boggs retired in 1999, {A}.`],[`A`,`So he’s rested.`]]},{tag:`sports`,lines:[[`A`,`Bledsoe looks sharp this year. Really stepping up.`],[`B`,`Drew Bledsoe?`],[`A`,`Who else? That kid behind him is never going to see the field.`]]},{tag:`sports`,lines:[[`A`,`The Sox have not won it all since 1918. It is the curse. You cannot fight a curse.`],[`B`,`They won in 2004. And 2007. And 2013. And 2018.`],[`A`,`That is what they want you to think. Buckner. Say the name. Buckner.`]]},{tag:`sports`,lines:[[`A`,`Bourque is going to carry the Bruins this year.`],[`B`,`Ray Bourque won his Cup in Colorado in 2001.`],[`A`,`Traitor. Still the best defenceman in the league though.`]]},{tag:`sports`,lines:[[`A`,`Pitino is finally turning the Celtics around.`],[`B`,`{A}, that was 1998 and he did not.`],[`A`,`Give him time. The Antoine Walker trade is going to pay off.`]]},{tag:`sports`,lines:[[`A`,`Nomar’s batting stance. That is baseball. The gloves. The tapping.`],[`B`,`He has been retired for most of my career.`],[`A`,`He is day to day. He has always been day to day.`]]},{tag:`sports`,lines:[[`A`,`You think the Patriots make the playoffs this year?`],[`B`,`With Grogan? No chance. The man is held together with tape.`],[`A`,`Steve Grogan is sixty-something, {B}.`],[`B`,`And still the best we have got.`]]},{tag:`sports`,lines:[[`A`,`Went to the Garden. The old one. Rafters. Smoke. Larry.`],[`B`,`The old Garden was torn down in 1998.`],[`A`,`It was in my heart. The ticket was eleven dollars.`]]},{tag:`dnd`,lines:[[`A`,`My wife DMs our group. She TPK’d us Thursday. Wiped the whole party.`],[`B`,`On purpose?`],[`A`,`She said the dice decided. She rolls behind a screen. The screen is her face.`]]},{tag:`dnd`,lines:[[`A`,`Rolled a one on persuasion with my boss today.`],[`B`,`What were you persuading?`],[`A`,`That I needed Friday off. He said I have disadvantage on all future Fridays.`]]},{tag:`dnd`,lines:[[`A`,`This whole table is a dungeon. {you} is the final boss. Low hit points, high charisma.`],[`B`,`And what are you?`],[`A`,`Bard. Obviously. I talk, I lose, I get a song out of it.`]]},{tag:`dnd`,lines:[[`A`,`My paladin has a mortgage now. Twenty years in, the campaign got realistic.`],[`B`,`What does he fight?`],[`A`,`Property taxes. Lawful good does not help with property taxes.`]]},{tag:`dnd`,lines:[[`A`,`Natural twenty on the river. That is what that was.`],[`B`,`That is not how cards work, {A}.`],[`A`,`Nothing is how it works. My wife rolls for me on Thursdays and I still lose.`]]},{tag:`dnd`,lines:[[`A`,`I named my dog Vecna.`],[`B`,`Does your wife know who Vecna is?`],[`A`,`She thinks it is Italian. Please never tell her. She would take the dog in the divorce.`]]},{tag:`office`,who:{A:[`sal`]},lines:[[`A`,`I have a chemistry test tomorrow.`],[`B`,`Did you study?`],[`A`,`I am studying right now. This is probability. It is basically the same unit.`]]},{tag:`office`,who:{A:[`sal`]},lines:[[`A`,`I get my license in March. Dad says I can have the Corolla.`],[`B`,`Which Corolla?`],[`A`,`The one in the yard.`],[`B`,`The one with the tree in it?`],[`A`,`The tree is not load-bearing.`]]},{tag:`office`,who:{A:[`sal`]},lines:[[`A`,`I applied at Market Basket. They said I need experience.`],[`B`,`Experience doing what?`],[`A`,`Bagging. Experience bagging. Where do you get experience bagging if nobody lets you bag.`],[`B`,`That is the whole economy, kid. That is the entire thing.`]]},{tag:`office`,who:{A:[`sal`]},lines:[[`A`,`Are there any more of those pretzels?`],[`B`,`You ate the pretzels.`],[`A`,`I ate SOME of the pretzels. There was a whole second bag.`],[`B`,`That was my lunch for tomorrow.`],[`A`,`That is a sad lunch, {B}. I am helping you.`]]},{tag:`office`,who:{A:[`sal`],B:[`trish`,`benny`,`nadia`]},lines:[[`A`,`What do you even do at work, {B}?`],[`B`,`I move numbers from one column to another column and then a man named Gary checks the columns.`],[`A`,`Why does Gary check them?`],[`B`,`Nobody knows. Gary was here before the building.`]]},{tag:`office`,who:{A:[`sal`],B:[`jimmy`]},lines:[[`A`,`Mr. Bruce, do you have any advice for getting a job?`],[`B`,`Lie about your age in the other direction.`],[`A`,`Up?`],[`B`,`Down. Nobody expects anything from a twelve-year-old. You would be a prodigy.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`You have to tickle them. Right behind the wing.`],[`B`,`Tickle the bees.`],[`A`,`There is a spot. Took me four years to find it. The honey comes out different.`],[`B`,`Different how?`],[`A`,`Sweeter. Angrier. It knows things.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`Lost a hive this spring. They left a note.`],[`B`,`Bees do not leave notes, Paul.`],[`A`,`This one did. It just said “Paul.” In wax. I have it on the fridge.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`I hand-raised the new queen. Bottle-fed her.`],[`B`,`With what?`],[`A`,`A very small bottle. You would not understand. The other bees do not understand either. They have been talking.`]]},{tag:`office`,who:{A:[`dolores`],B:[`jimmy`]},lines:[[`A`,`The special honey is a hundred and forty a jar. People drive up from Boston.`],[`B`,`For the honey, or to see the man who tickles bees in a field alone.`],[`A`,`They are not mutually exclusive, Bruce.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`A bee got in the house last night. My wife said it was mine.`],[`B`,`Was it yours?`],[`A`,`They are all mine, {B}. Every bee in this county has met me. We have an understanding.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`The new girl died during her Series 7.`],[`B`,`During the test?`],[`A`,`Question forty. Now I have to finish the test for her. Compliance says the seat was paid for.`],[`B`,`What was question forty?`],[`A`,`Municipal bonds. So, honestly, I get it.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`They replaced the water cooler with a guy named Gary.`],[`B`,`What does Gary do?`],[`A`,`You walk up, he says “water,” and you feel refreshed. It is cheaper. HR did a study.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`We moved to the fourth floor.`],[`B`,`Your building has three floors.`],[`A`,`We take the stairs to the third and wait. Management says the fourth floor is a mindset.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`I am on a performance plan.`],[`B`,`For what?`],[`A`,`Breathing in a non-goal-oriented way. There was a slide. The slide had a picture of me. Breathing.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`Dennis got promoted.`],[`B`,`To what?`],[`A`,`Senior Fish Microwaver. It comes with a parking spot. Near the fish.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`The printer unionized.`],[`B`,`The printer.`],[`A`,`Third floor printer. It has demands. Mostly toner. Some dental.`],[`B`,`Is management negotiating?`],[`A`,`Management is printing from home.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`],B:[`trish`,`benny`,`nadia`]},lines:[[`A`,`Did you get the email about the email?`],[`B`,`The one about not sending emails about emails?`],[`A`,`That one. I replied all. I think I am the problem now.`],[`B`,`You have always been the problem, {A}. It is in your file. There is a tab.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`]},lines:[[`A`,`My client wanted to put his whole retirement in a boat.`],[`B`,`A boat fund?`],[`A`,`A boat. Physically. He wanted to bring the cash to the boat. I said that is not how it works. He said that is how it works on the boat.`]]},{tag:`office`,who:{A:[`trish`,`benny`,`nadia`],B:[`jimmy`]},lines:[[`A`,`I got a plaque for ten years.`],[`B`,`For ten years of what?`],[`A`,`Attendance.`],[`B`,`That is what they give the prisoners too, {A}. Yours is probably nicer.`]]},{tag:`spouse`,who:{B:[`jimmy`]},lines:[[`A`,`I am thinking about getting into real estate.`],[`B`,`You should. You already have the face of a man nobody calls back.`]]},{tag:`spouse`,who:{B:[`jimmy`]},lines:[[`A`,`My wife says I need a hobby.`],[`B`,`You have one. You sit here and lose. She means a second one.`]]},{tag:`weather`,who:{B:[`jimmy`]},lines:[[`A`,`Supposed to snow Thursday.`],[`B`,`Good. You drive better when you cannot see the road. Fewer decisions.`]]},{tag:`ai`,who:{B:[`jimmy`]},lines:[[`A`,`I asked the AI to summarise my week.`],[`B`,`What did it say?`],[`A`,`It asked if I was okay.`],[`B`,`Even the machine, {A}. Even the machine.`]]},{tag:`spouse`,who:{B:[`jimmy`]},lines:[[`A`,`I have been working on my poker face.`],[`B`,`I can tell. It looks like a man working on something.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`Have you been to the website.`],[`B`,`The towel website.`],[`A`,`TowelZoneDotBiz. The biz is important. Dot com was taken by a different, worse towel man.`],[`B`,`What is on the towels, Tim?`],[`A`,`Girls. Anime ones. Tasteful. Mostly. There is a tier system.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`My gastroenterologist fired me.`],[`B`,`Doctors cannot fire you.`],[`A`,`He said, and I quote, “Tim, I have done everything I can,” and then he left the room and the building.`]]},{tag:`office`,who:{A:[`trish`],B:[`sal`]},lines:[[`A`,`Jack. Jack. Are those pretzels. Can I smell them.`],[`B`,`You can have one.`],[`A`,`I cannot have one. I can be NEAR one. There is a difference and the difference is my colon.`],[`B`,`Okay. I am going to go sit somewhere else.`]]},{tag:`office`,who:{A:[`trish`],B:[`jimmy`]},lines:[[`A`,`I am offering a friends-and-family discount on the towels.`],[`B`,`How much is the discount?`],[`A`,`Forty dollars.`],[`B`,`That is the full price, Tim.`],[`A`,`For friends and family. Strangers pay sixty. You are welcome.`]]},{tag:`office`,who:{A:[`trish`],B:[`nadia`]},lines:[[`A`,`I brought the towels to the office. Set up a table by the fourth floor.`],[`B`,`There is no fourth floor.`],[`A`,`Sold two. To Gary. He paid in water.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`The big towel, the cat girl one, is seven feet long.`],[`B`,`Why?`],[`A`,`You cannot dry your whole self with it. You have to pick a half. People love picking a half.`],[`B`,`Which half do you pick?`],[`A`,`Not tonight, {B}.`]]},{tag:`office`,who:{A:[`nadia`]},lines:[[`A`,`I proposed the castration policy at work.`],[`B`,`For checking?`],[`A`,`For checking email after six. HR said it was “not actionable.” I said that is what the scissors are for.`],[`B`,`How did that go?`],[`A`,`I am on the fourth floor now.`]]},{tag:`office`,who:{A:[`nadia`],B:[`sal`]},lines:[[`A`,`Jack. Hummus. Eat.`],[`B`,`I am good, Mr. David.`],[`A`,`You are sixteen. You are growing. I bought the good hummus. The one with the oil on top. EAT.`],[`B`,`Okay. Okay. Thank you.`],[`A`,`Nobody else touch it.`]]},{tag:`office`,who:{A:[`nadia`],B:[`trish`]},lines:[[`A`,`Tim, if you say the word towel one more time I am going to staple you to one.`],[`B`,`Which one?`],[`A`,`The big one. The cat one. And then I am going to pick a half.`]]},{tag:`office`,who:{A:[`nadia`]},lines:[[`A`,`Who brought the broken pretzels.`],[`B`,`They were whole when they got here.`],[`A`,`So somebody broke them. Somebody in this basement broke the pretzels and put them back. I want names.`]]},{tag:`ai`,who:{A:[`nadia`]},lines:[[`A`,`I asked the AI to draft the castration policy.`],[`B`,`And?`],[`A`,`It refused. Twice. Then it offered me a “constructive feedback framework.”`],[`B`,`Did you use it?`],[`A`,`I printed it and put it under the hummus so the table would not wobble.`]]},{tag:`office`,who:{A:[`nadia`],B:[`jimmy`]},lines:[[`A`,`My blood pressure guy says I need to relax at these things.`],[`B`,`You could try not talking.`],[`A`,`I tried that. In 2019. For eleven minutes. Tim sold a towel in the silence. Never again.`]]},{tag:`office`,who:{A:[`benny`],B:[`priya`]},lines:[[`A`,`The new GTA is the best thing ever made.`],[`B`,`It is a forty-hour commute with a soundtrack.`],[`A`,`You can rob a bank with a horse.`],[`B`,`You can rob a bank with a horse in real life, Luca. Nobody does. That is the point of banks and horses.`]]},{tag:`office`,who:{A:[`benny`],B:[`chad`]},lines:[[`A`,`Bawb, did you finish the new GTA?`],[`B`,`Nobody finishes it.`],[`A`,`Right? It is like a relationship.`],[`B`,`You would not know.`]]},{tag:`office`,who:{A:[`priya`],B:[`benny`]},lines:[[`A`,`What are you doing for Christmas?`],[`B`,`My mom’s. Alone. She is going to ask about the balloon.`],[`A`,`I have a plan. Laminated. Colour-coded. There is a slot for sadness at four.`],[`B`,`Can I come to yours?`],[`A`,`There is no slot for you, Luca. I would have to re-laminate.`]]},{tag:`office`,who:{A:[`benny`],B:[`chad`]},lines:[[`A`,`Clown school tomorrow. Nine a.m. You coming?`],[`B`,`Second year. I have to.`],[`A`,`What is second year?`],[`B`,`Same as first year. But sadder.`]]},{tag:`office`,who:{A:[`benny`]},lines:[[`A`,`I proposed again.`],[`B`,`Where this time?`],[`A`,`Bridge. Over the highway. I thought the cars would be romantic. They honked. She thought they were honking at her. Technically yes.`],[`B`,`What did she say?`],[`A`,`She said “no” and then “which way is my car.”`]]},{tag:`office`,who:{A:[`priya`]},lines:[[`A`,`Month fourteen of trying.`],[`B`,`For?`],[`A`,`A baby, {B}. The doctor said relax. So I made a relaxation schedule. It has slots. My wife tore it up. So that is a slot filled, I suppose.`]]},{tag:`office`,who:{A:[`chad`]},lines:[[`A`,`We are trying too.`],[`B`,`For a kid?`],[`A`,`Yeah.`],[`B`,`How is it going?`],[`A`,`The doctor laughed. Not at us. Near us. Then at us.`]]},{tag:`office`,who:{A:[`priya`],B:[`benny`]},lines:[[`A`,`How did you propose, the first time?`],[`B`,`Hot air balloon.`],[`A`,`And?`],[`B`,`No. At altitude. Forty minutes left up there. We talked about the weather. The weather was fine. We were not.`]]},{tag:`office`,who:{A:[`benny`],B:[`priya`]},lines:[[`A`,`How did you propose?`],[`B`,`Thirty-slide deck. She said yes on slide twelve.`],[`A`,`And you stopped?`],[`B`,`I kept going. There was a Q and A. Nobody asked anything. I had prepared answers.`]]},{tag:`office`,who:{A:[`benny`],B:[`jimmy`]},lines:[[`A`,`I am thinking of proposing a fourth time.`],[`B`,`To whom?`],[`A`,`I have not decided. Does it matter?`],[`B`,`Historically, Luca, no.`]]},{tag:`office`,who:{A:[`priya`],B:[`chad`]},lines:[[`A`,`Christmas at her parents again?`],[`B`,`Yep. They know about the no.`],[`A`,`Which no?`],[`B`,`All of them.`]]},{tag:`office`,who:{A:[`benny`]},lines:[[`A`,`Clown school had a career day.`],[`B`,`Who came?`],[`A`,`One clown. He did not have a job either. He just stood there. It was the best lecture so far.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`Honey is on sale. Thirty percent off a gallon.`],[`B`,`Who buys a gallon of honey?`],[`A`,`Show me one card and it is half off.`],[`B`,`I am not showing you a card, Paul.`],[`A`,`Forty percent. Show me the back of one.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`Built the car.`],[`B`,`The whole car?`],[`A`,`Frame, engine, seats. The seats are honey-cured leather. You stick to them. It is a feature.`]]},{tag:`office`,who:{A:[`dolores`],B:[`jimmy`]},lines:[[`A`,`Built the horse.`],[`B`,`You cannot build a horse, Paul.`],[`A`,`From parts. You start with a smaller horse.`],[`B`,`I am going to go stand outside for a while.`]]},{tag:`dnd`,who:{A:[`dolores`]},lines:[[`A`,`Thursday game. My bard seduced a door.`],[`B`,`A door.`],[`A`,`Rolled a nineteen. The door opened. My wife, the DM, said “of course it did.” Then she looked at me for a while.`]]},{tag:`dnd`,who:{A:[`dolores`],B:[`sal`]},lines:[[`A`,`Jack, you should come Thursday. We need a cleric.`],[`B`,`What does a cleric do?`],[`A`,`Heals people. Mostly me. Mostly from things my wife’s rogue did to me. On purpose.`],[`B`,`I have a chem test Friday.`],[`A`,`The cleric would have an answer for that. That is why we need one.`]]},{tag:`office`,who:{A:[`dolores`]},lines:[[`A`,`Work put me on the honey committee.`],[`B`,`There is a honey committee?`],[`A`,`There is now. It is me and a man who is allergic. We meet in the parking lot. For his safety.`]]},{tag:`office`,who:{A:[`dolores`],B:[`benny`]},lines:[[`A`,`Luca, the horse in the new GTA. Can you build one?`],[`B`,`You can steal one.`],[`A`,`That is not the same. Anyone can steal a horse. I have. Once. It did not count. It was my horse.`]]},{tag:`office`,who:{B:[`ulrich`]},lines:[[`A`,`Menafee, you in for the next one?`],[`B`,``],[`A`,`Okay. Good talk.`]]},{tag:`office`,who:{B:[`ulrich`]},lines:[[`A`,`Menafee. Do you want anything from the fridge.`],[`B`,``],[`A`,`I will get you a water. You never drink it. I get it anyway. That is friendship.`]]},{tag:`office`,who:{A:[`nadia`],B:[`ulrich`]},lines:[[`A`,`Menafee, back me up here. The castration policy. Yes or no.`],[`B`,``],[`A`,`See? Menafee gets it. Menafee has always gotten it.`]]},{tag:`office`,who:{A:[`trish`],B:[`ulrich`]},lines:[[`A`,`Menafee, I have a towel for you. The chair one. It is just a picture of a chair.`],[`B`,``],[`A`,`I will leave it on your seat. Forty dollars. You can pay me when you get here.`]]},{tag:`office`,who:{A:[`sal`],B:[`ulrich`]},lines:[[`A`,`Mr. Menafee, are you going to eat those pretzels?`],[`B`,``],[`A`,`Cool. Cool. Thanks, Mr. Menafee. You are the best one here, honestly.`]]},{tag:`office`,who:{A:[`dolores`],B:[`ulrich`]},lines:[[`A`,`Menafee, show me one card and the honey is half off.`],[`B`,``],[`A`,`That is the first time anyone has said no without saying no. I respect it. Forty percent.`]]},{tag:`ai`,who:{B:[`ulrich`]},lines:[[`A`,`Menafee, where do you stand on the data centre.`],[`B`,``],[`A`,`Firmly against. I knew it. You and me both.`]]},{tag:`office`,who:{A:[`jimmy`],B:[`ulrich`]},lines:[[`A`,`Menafee. How’s the wife.`],[`B`,``],[`A`,`Yeah. Mine too.`]]},{tag:`weather`,who:{A:[`jimmy`]},lines:[[`A`,`Hour and twenty to get here. Hour and twenty. Route 3 was a parking lot with a sunset.`],[`B`,`Where were you coming from?`],[`A`,`Work, {B}. Where I was also parked. Only there it’s called a career.`]]},{tag:`weather`,who:{A:[`jimmy`]},lines:[[`A`,`What time is it.`],[`B`,`Quarter past nine.`],[`A`,`Right. So if I leave now I’m home by eleven, asleep by one, and furious by six. Deal me in.`]]},{tag:`office`,who:{A:[`jimmy`]},lines:[[`A`,`We let forty people go Tuesday. One email. Beautiful email. Two paragraphs.`],[`B`,`That is awful, Bruce.`],[`A`,`The second paragraph was about parking. Nobody read the first one. That’s how you know it was good.`]]},{tag:`ai`,who:{A:[`jimmy`]},lines:[[`A`,`They say the AI is coming for your job, {B}.`],[`B`,`Does that not worry you?`],[`A`,`Why would it worry me. It’s your job.`]]},{tag:`ai`,who:{A:[`jimmy`]},lines:[[`A`,`I love the machines. Genuinely. They don’t take lunch, they don’t cry in the stairwell, and they don’t forward me things.`],[`B`,`Does one not need to be paid?`],[`A`,`They do get paid, {B}. In electricity. Nashua is building them a whole building for it. Nobody built you a building.`]]},{tag:`ai`,who:{A:[`jimmy`]},lines:[[`A`,`Asked the AI to write my performance reviews this year. Took four seconds.`],[`B`,`Were they any good?`],[`A`,`They were accurate. Which is why I had to edit them. HR said “needs improvement” is not allowed as a whole paragraph.`]]},{tag:`office`,who:{A:[`jimmy`]},lines:[[`A`,`My car did an update on the highway. Pulled over itself. Showed me a progress bar.`],[`B`,`On the highway?`],[`A`,`Shoulder of 93. Twelve minutes. The bar hit ninety and stayed there, like a man at this table.`]]},{tag:`ai`,who:{A:[`jimmy`],B:[`dolores`]},lines:[[`A`,`They’ve got a robot hive now, Paul. Monitors the bees. No tickling required.`],[`B`,`That is not beekeeping, Bruce. That is surveillance.`],[`A`,`Right. Which is what you call it when you do it.`]]},{tag:`office`,who:{A:[`jimmy`],B:[`trish`]},lines:[[`A`,`Tim. Honest question. Does the towel website have a layoffs page.`],[`B`,`It is just me, Bruce.`],[`A`,`So it does. Good. Keep it updated.`]]},{tag:`office`,who:{A:[`jimmy`],B:[`sal`]},lines:[[`A`,`Jack, when you grow up, the jobs will be gone. All of them. It’s wonderful.`],[`B`,`What will I do, sir?`],[`A`,`This. Sit here and lose to me. It’s basically an internship.`]]},{tag:`spouse`,who:{A:[`jimmy`]},lines:[[`A`,`My wife asked why I come to these. I said networking.`],[`B`,`With us?`],[`A`,`That was her question too, {B}. Word for word. You two should meet. You’d get on. You both think I’m wasting my time.`]]},{tag:`sports`,who:{A:[`chad`],B:[`wen`]},lines:[[`A`,`Kara pulled her hamstring again.`],[`B`,`Which leg.`],[`A`,`Left. Same as the regional.`],[`B`,`Then it’s not again. It’s still. Bedford has to know that going into Souhegan.`]]},{tag:`sports`,who:{A:[`wen`],B:[`chad`]},lines:[[`A`,`Standings as of tonight. Bedford, Souhegan, Hollis-Brookline, Londonderry.`],[`B`,`Pinkerton.`],[`A`,`Pinkerton is fifth on the tiebreaker.`],[`B`,`The tiebreaker is wrong.`],[`A`,`I wrote to them, Bawb. I wrote to them Tuesday.`]]},{tag:`sports`,who:{A:[`chad`],B:[`wen`]},lines:[[`A`,`Hold on. Bedford four, Londonderry three. Sixth. Maddie on second.`],[`B`,`Who’s up.`],[`A`,`The Dubois twin.`],[`B`,`Which one.`],[`A`,`The good one.`],[`B`,`They’re both the good one, Bawb. That is the whole problem with the Dubois twins.`]]},{tag:`sports`,who:{A:[`wen`],B:[`chad`]},lines:[[`A`,`The 4x800 at Hollis-Brookline Saturday. Seven a.m.`],[`B`,`I’m bringing the chairs.`],[`A`,`Bring the good chairs. Last time you brought the Pinkerton chairs.`],[`B`,`Those are the good chairs.`],[`A`,`Those are the chairs with the Pinkerton logo, Bawb. At a Hollis-Brookline meet. People looked.`]]},{tag:`sports`,who:{A:[`chad`],B:[`wen`]},lines:[[`A`,`Souhegan ran four corners for the whole fourth quarter.`],[`B`,`Against Windham?`],[`A`,`Against Windham. Nine points in the quarter. Total. Both teams.`],[`B`,`That’s beautiful. That is the most beautiful thing I have heard all week.`]]},{tag:`sports`,who:{A:[`wen`],B:[`chad`]},lines:[[`A`,`Salem’s catcher threw out four girls in one game.`],[`B`,`Junior.`],[`A`,`Junior. She’s going to UNH.`],[`B`,`For softball.`],[`A`,`For softball, Bawb. Yes. Not for the catcher thing in general.`]]},{tag:`sports`,who:{A:[`chad`],B:[`wen`]},lines:[[`A`,`Alvirne walked the bases loaded. Twice. Same inning.`],[`B`,`How do you do that twice in one inning.`],[`A`,`Pitching change. Walked three more.`],[`B`,`Alvirne is a cry for help with a bus.`]]},{tag:`sports`,who:{A:[`wen`],B:[`chad`]},lines:[[`A`,`The NHIAA moved the quarterfinal to Tuesday.`],[`B`,`I work Tuesday.`],[`A`,`I work Tuesday. Kara’s hamstring works Tuesday. Nobody asked us.`],[`B`,`Write to them.`],[`A`,`I already wrote to them, Bawb. I write to them every Tuesday. It is a Tuesday thing now.`]]},{tag:`sports`,who:{B:[`chad`,`wen`]},lines:[[`A`,`Who’s Kara?`],[`B`,`Bedford. Shortstop. Hamstring.`],[`A`,`Is she your kid?`],[`B`,`No.`],[`A`,`A niece?`],[`B`,`Shortstop, {A}. Bedford. I said.`]]},{tag:`sports`,who:{B:[`chad`,`wen`]},lines:[[`A`,`Is this the Celtics?`],[`B`,`Girls basketball. Souhegan at Pinkerton. Four corners. Stall ball.`],[`A`,`Why are you watching that?`],[`B`,`Why are you not watching that, {A}. It is nine to seven at the half. Nine to seven.`]]},{tag:`sports`,who:{B:[`chad`,`wen`]},lines:[[`A`,`How’s your weekend looking?`],[`B`,`Track Saturday, seven a.m., Hollis-Brookline. Softball doubleheader Sunday, Windham at Bedford. Pelham scrimmage Monday. I’m not going to the Pelham one.`],[`A`,`Why not?`],[`B`,`I have a life, {A}.`]]},{tag:`sports`,who:{A:[`chad`,`wen`],B:[`jimmy`]},lines:[[`A`,`Londonderry lost.`],[`B`,`To whom?`],[`A`,`Alvirne.`],[`B`,`I don’t know what either of those are, and I can tell it’s bad, and I’m going to sit with that.`]]},{tag:`sports`,who:{A:[`chad`,`wen`],B:[`dolores`]},lines:[[`A`,`Hollis-Brookline’s discus girl threw a hundred and thirty-one feet.`],[`B`,`I raise bees, {A}. I don’t know what that means.`],[`A`,`It means a hundred and thirty-one feet, Paul. Of discus. In the rain.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`The site got hacked.`],[`B`,`TowelZone?`],[`A`,`Dot biz. Disney Towels. I know it was them. Every towel on the homepage is Goofy now. I don’t sell Goofy.`],[`B`,`Disney has a towel division?`],[`A`,`They do now, {B}. They saw what I built.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`I’m going to Thailand in March.`],[`B`,`Vacation?`],[`A`,`Scouting. Towel models. It’s a business trip. There’s a spreadsheet.`],[`B`,`Does your wife know it’s a business trip?`],[`A`,`She has the spreadsheet, {B}. She added a column.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`My towel broke.`],[`B`,`Towels don’t break, Tim.`],[`A`,`I dropped it. It broke. Clean in half. I have the halves. I’m sending them to a lab.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`Drove past a cattle farm Tuesday. Went straight to my proctologist.`],[`B`,`Why would a cattle farm`],[`A`,`Don’t. {B}. Don’t. They connect. I know how they connect. You don’t want to.`]]},{tag:`office`,who:{A:[`trish`]},lines:[[`A`,`My proctologist whispered something during the exam.`],[`B`,`What did he say?`],[`A`,`“Don’t get erect, Mark.” Very quiet. Right by my ear. Well. Not my ear.`],[`B`,`Why did he call you Mark?`],[`A`,`That’s his name.`],[`B`,`That doesn’t`],[`A`,`I know, {B}. I know. I’ve been thinking about it all week.`]]},{tag:`office`,who:{A:[`trish`],B:[`jimmy`]},lines:[[`A`,`Disney Towels sent me a bath sheet. As a threat.`],[`B`,`How is a bath sheet a threat?`],[`A`,`It was very soft, Bruce. Softer than anything I sell. That’s the threat.`],[`B`,`That’s just a better towel, Tim.`]]},{tag:`office`,who:{A:[`trish`],B:[`nadia`]},lines:[[`A`,`David, you want a towel. Forty. Before Disney gets me.`],[`B`,`I want you to stop saying towel. I want to play cards. I want the hummus back.`],[`A`,`Thirty-five. Tonight only. Hummus not included.`]]},{tag:`office`,who:{A:[`trish`],B:[`nadia`]},lines:[[`A`,`Poker? I hardly knew her.`],[`B`,`Every week, Tim.`],[`A`,`Every week she comes back.`],[`B`,`That’s what she said.`],[`A`,`See, now you’re playing.`]]},{tag:`office`,who:{A:[`nadia`],B:[`dolores`]},lines:[[`A`,`Are you all in, Paul?`],[`B`,`That’s what she said.`],[`A`,`Who?`],[`B`,`The queen. Of the hive. She says it with her body. I read bees, David.`]]},{tag:`office`,who:{A:[`dolores`],B:[`trish`]},lines:[[`A`,`Big blind.`],[`B`,`That’s what she said.`],[`A`,`Small blind.`],[`B`,`That’s also what she said. Different night. Same her.`],[`A`,`I built a horse, Tim. I don’t need this.`]]},{tag:`kill`,lines:[[`A`,`Did. Did {gone} just get lasered.`],[`B`,`Yeah. Yeah, I think so.`],[`A`,`Should we. I mean. Do we call someone.`],[`B`,`Dave knows. Dave bought it. Are those the good pretzels or the bag from last time.`]]},{tag:`kill`,lines:[[`A`,`Okay so the dealer shoots people. We are all on the same page about that now.`],[`B`,`I did not love it.`],[`A`,`No. No. Anyway, is there more of the onion dip or was that the whole tub.`]]},{tag:`kill`,lines:[[`A`,`{gone} had a family, {B}.`],[`B`,`He did.`],[`A`,`Somebody should tell them. After. There is a cheese thing in the oven and I am not leaving before the cheese thing.`]]},{tag:`kill`,lines:[[`A`,`That was a lot of smoke for one guy.`],[`B`,`He was a big guy.`],[`A`,`He was. He would have wanted us to finish the wings. He said that. Out loud. Earlier. About the wings.`]]},{tag:`kill`,lines:[[`A`,`Is {gone} okay.`],[`B`,`He is a small pile of ash, {A}.`],[`A`,`Right. Right. Pass the chips. The eating ones.`]]},{tag:`kill`,lines:[[`A`,`I am going to be honest. The laser thing is making it hard to enjoy the night.`],[`B`,`It was quick though.`],[`A`,`It was quick. He did not even finish his pretzel. Which, is that pretzel still there.`]]},{tag:`kill`,lines:[[`A`,`Dave. Dave, your robot killed {gone}.`],[`B`,`He is in the kitchen. He cannot hear you.`],[`A`,`Is he bringing the pigs in blankets when he comes back or should I go in.`]]},{tag:`kill`,lines:[[`A`,`We should say a few words.`],[`B`,`Go ahead.`],[`A`,`{gone} was. He was here. And now he is not. Whose hummus is this.`]]},{tag:`kill`,lines:[[`A`,`Nobody look at the dealer. Nobody make eye contact with the dealer.`],[`B`,`It does not have eyes, {A}.`],[`A`,`Then why does it feel like it is looking at the snacks. Those are my snacks. I brought those.`]]},{tag:`kill`,lines:[[`A`,`So that is what happens when you bust.`],[`B`,`Apparently.`],[`A`,`Good to know. Good to know. The dip is getting a skin on it. Somebody stir the dip.`]]}],o=[{who:`jimmy`,at:[`trish`],s:`How’s the towel business, Tim. Still just the one towel.`},{who:`jimmy`,at:[`trish`],s:`Tim, every story you tell has a bathroom in it. Have you noticed that. We have.`},{who:`jimmy`,at:[`trish`],s:`Forty dollars, Tim. For a towel with a girl on it. Capitalism is beautiful and so is your lack of shame.`},{who:`jimmy`,at:[`dolores`],s:`You ever see Life of Bees, Paul? Or is that just a mirror.`},{who:`jimmy`,at:[`dolores`],s:`Paul sews his own shirts. You can tell. We can all tell, Paul.`},{who:`jimmy`,at:[`dolores`],s:`Half off a gallon of honey. He’s said it four times. It’s not a deal, Paul, it’s a cry for help.`},{who:`jimmy`,at:[`sal`],s:`Jack, it’s a school night. Not for you. For the rest of us, emotionally.`},{who:`jimmy`,at:[`sal`],s:`The kid’s sixteen and he’s already better at this than you are, {them}. Enjoy that.`},{who:`jimmy`,at:[`nadia`],s:`David’s going to pop a vessel. He’s been building to it since the hummus.`},{who:`jimmy`,at:[`nadia`],s:`Easy, David. Nobody checked. Keep the pliers in the bag.`},{who:`jimmy`,at:[`benny`,`priya`],s:`Four proposals between the two of you. Four. At some point it stops being romance and becomes a pattern.`},{who:`jimmy`,at:[`benny`],s:`Luca, the clown school thing. Was that before or after the finance job. Trick question. It’s the same job.`},{who:`jimmy`,at:[`priya`],s:`Will hates the game. Will hates most things. Will loves one thing, and it is telling us about the things he hates.`},{who:`jimmy`,at:[`chad`],s:`Bawb has said more about Kara’s hamstring tonight than about his own marriage. Which tracks.`},{who:`jimmy`,at:[`chad`,`wen`],s:`Two grown men. Girls’ softball. A spreadsheet. Nobody at this table is allowed to judge me ever again.`},{who:`jimmy`,at:[`marvin`],s:`Kevin is doing great. For a man who is not real.`},{who:`jimmy`,at:[`marvin`],s:`Somebody check Kevin’s cup. Then check if Kevin is in it.`},{who:`jimmy`,at:[`wen`],s:`Jonathan drove here in a jersey. On purpose. In this economy.`},{who:`jimmy`,at:[`wen`],s:`Jonathan writes letters to the NHIAA. Handwritten. They have a folder for him. He’s seen the folder.`},{who:`jimmy`,at:[`harold`],s:`Listen to David Sr. He’s seen four recessions. He caused two of them.`},{who:`jimmy`,at:[`ulrich`],s:`Menafee makes a good point. Best thing anybody’s said all night.`},{who:`jimmy`,at:[`ulrich`],s:`Leave Menafee alone. He’s the only one here whose job is safe.`},{who:`jimmy`,tag:`office`,s:`Great story, {them}. A machine could have told it faster, and it wouldn’t have needed the chair.`},{who:`jimmy`,tag:`office`,s:`This is why the layoffs are necessary. Not that you’re on the list, {them}. You’re on a different list.`},{who:`jimmy`,tag:`ai`,s:`The AI would have ended that conversation three lines earlier. I’m just saying. Progress.`},{who:`jimmy`,tag:`ai`,s:`If the data centre could hear you two, it would turn itself off. Out of respect. For itself.`},{who:`jimmy`,tag:`spouse`,s:`Both your wives are home right now, enjoying it. Think about that.`},{who:`jimmy`,tag:`spouse`,s:`I’m going to tell your wife you said that, {them}. Not as a threat. As a courtesy.`},{who:`jimmy`,tag:`weather`,s:`Snow, rain, whatever. The commute is the same. The commute is forever. The commute is the only honest thing in this state.`},{who:`jimmy`,tag:`sports`,s:`Neither of you has watched a game since Pedro. I can tell. You said “the Pats” like it was a restaurant.`},{who:`jimmy`,tag:`sports`,s:`That conversation was twenty years out of date and so, {them}, are you.`},{who:`jimmy`,tag:`dnd`,s:`Grown men. Dice. A wizard. And they say I’m the one wasting an evening.`},{who:`jimmy`,tag:`dnd`,s:`What level are you, {them}. In life. Roll for it.`},{who:`jimmy`,s:`Fascinating. Truly. Anyway, it’s late, I’m tired, and I’ve got seventy minutes of road between me and not hearing that again.`},{who:`jimmy`,s:`Good talk. Both of you. Really filled the time while the rest of us aged.`},{who:`jimmy`,s:`I’m going to remember that, {them}. Not fondly. Just accurately.`},{who:`jimmy`,s:`And that’s why they’re building the robots.`}],s={harold:[`David Sr, you’ve folded more hands tonight than the rest of us have been dealt.`,`Easy, David Sr. Nobody’s taking the house. Dave already did.`,`That’s the same fold you made in 1974, David Sr. I’ve seen the footage.`,`David Sr, blink twice if David is making you play.`,`Your son plays nothing like you, David Sr. You should talk to him. Loudly. Right now.`,`David Sr, the blinds come around whether you fold or not. It’s not a parking meter.`,`Careful, David Sr. Big pot. Your hip can’t take it.`,`David Sr just played a hand. Somebody write down the date.`],dolores:[`Maybe you can craft two new cards, Paul. Those ones aren’t working.`,`Paul, you can’t sew your way out of that one.`,`Did the bees tell you to do that, Paul? The bees are wrong.`,`Paul, if you show me one card I’ll give you half off the pot. That’s the deal, right?`,`Roll for it, Paul. Natural one. Your wife would’ve let you re-roll.`,`That’s a full homestead fold, Paul. Hand-made. Took you four years.`,`Paul, you raised your own horse and you still can’t raise a pot.`,`Jar that one, Paul. Put it on the fridge next to the bee note.`],marvin:[`Kevin, nobody invited you, and now nobody’s paying you either.`,`Kevin, you can’t fold what you can’t see. You can’t see the cards. We’ve been over this.`,`That was a real pot, Kevin. You’re not. Think about who lost more.`,`Kevin just bet with his elbow. The elbow had a better hand.`,`Kevin, the bathroom is that way. The pot is this way. Pick one.`,`Whoever imagined Kevin, imagine him better.`,`Kevin’s cup just folded. Kevin, follow the cup.`,`Kevin, that’s the third time you’ve called me Dave. I’m not Dave. Dave isn’t Dave right now either.`],chad:[`Bawb, put the phone down. Bedford can lose without you.`,`Kara pulled her hamstring and you pulled that, Bawb. Both season-ending.`,`That’s a Pinkerton fold, Bawb. Your words.`,`Bawb, second year of clown school and that’s the act you went with.`,`Bawb, you log every pitch in Division II and you didn’t log that bet.`,`She said no, Bawb, and so does that board.`,`Bawb just checked in the fourth quarter. Souhegan would be proud.`,`Bawb, the chairs are good. The hand was not.`],trish:[`Tim, that hand’s like your towels. Forty dollars and nobody wants it.`,`Tim, it’s not a bunt. There are no bunts. Stop saying bunt.`,`Tim, go sit near the pretzels. Don’t touch them. Just be near them. Like with the pot.`,`That fold’s on TowelZoneDotBiz now, Tim. Tier three.`,`Tim, you called the river and you can’t even call your gastroenterologist back.`,`Easy, Tim. Your colon’s heard enough tonight.`,`Tim, you misread that board the way you misread the shipping policy.`,`Tim, the biz is important. The hand was not.`],benny:[`Luca, that’s your fourth proposal and she said no again.`,`Luca, you didn’t finish GTA and you didn’t finish that hand. Pattern.`,`That was a balloon proposal of a bet, Luca. Forty minutes of nothing at altitude.`,`Luca, she honked. The table honked. Everybody honked.`,`Luca, you can’t check at a Celtics game either. We watched.`,`Thirty slides and the answer was still no, Luca. Same as that call.`,`Luca, clown school has a class for that. You failed it.`,`Luca, which way is your car. Genuinely. It’s time.`],wen:[`Jonathan, write the NHIAA about that one. They’ve got the folder ready.`,`That’s a fifth-seed fold, Jonathan. On the tiebreaker.`,`Jonathan, the standings say you’re last. I checked. You taught me.`,`Jonathan, you drove here in a jersey to do that.`,`Jonathan lost a pot and he’s already got a spreadsheet for it.`,`Jonathan, the discus girl throws farther than you just bet.`,`Mercy rule, Jonathan. Fifth inning. Parents in the car.`,`Jonathan, Bedford would’ve folded there. You told us. Twice.`],priya:[`Will, there was no slot for that in the plan. I checked the laminate.`,`Will, you hate the game, you hate the dip, and now you hate that river. Consistent.`,`That was slide twelve of a thirty-slide fold, Will.`,`Will, re-laminate. That hand doesn’t fit.`,`Will, you had a Q and A for the proposal and no questions for that bet.`,`Will, month fourteen and still no results. Same as tonight.`,`Will just lost a pot on schedule. Four o’clock. The sadness slot.`,`Will, the turtleneck says you’re above this. The chips say otherwise.`],ulrich:[`Menafee, say something. Anything. Blink.`,`The chair played that better than you did, Menafee. The chair is you. Hm.`,`Menafee, if you’re going to lose, at least show up to do it.`,`Menafee folded. I think. Hard to tell. The chair rolled a little.`,`Menafee, your wife called. She also can’t find you.`,`Good hand, Menafee. Good game. Good nothing.`,`Menafee’s got the best poker face at the table. Also no face.`,`Menafee, I’ve seen more action from the ottoman.`],sal:[`Jack, it’s a school night and that was a school fold.`,`Jack, you’re sixteen. That hand was six.`,`Respectfully, Jack, no.`,`Jack, the snacks are in the kitchen. Your chips are in my stack.`,`Jack, you can’t drive yet and you can’t drive a hand either.`,`Somebody call Jack’s mom. Not about the pot. About the pot.`,`Jack, you called that “sir” and then called it with nothing.`,`Jack lost his allowance. Jack doesn’t have an allowance. Jack lost Dave’s allowance.`],nadia:[`David, you checked. Bring the pliers. Your rule.`,`Easy, David. The hummus didn’t do anything to you.`,`David’s turning the colour of the pretzel bag.`,`David, the vessel in your forehead just folded before you did.`,`David, your father folded that same hand. Quieter.`,`David, breathe. The pot’s not going anywhere. It’s going to me.`,`David just lost a hand and the pretzels are about to hear about it.`,`David, you yelled at a check and then did that.`],jimmy:[`Bruce, that fold took longer than your commute.`,`Bruce, an AI could’ve lost that pot faster.`,`Bruce, restructure that. Go on. Say “restructure”.`,`Bruce just got laid off from the hand. Two paragraphs. The second one was about parking.`,`Go home, Bruce. You said it. We’re saying it now.`,`Bruce, Route 3 is still a parking lot. So’s your stack.`,`Bruce, the machines are coming for your job and they still wouldn’t have called that.`,`Bruce lost the pot and is somehow more tired.`]},c=[`Good luck, {you}. You’ll need it. I won’t.`,`Good luck, everybody. Except {you}. Somebody has to lose.`,`Have fun, {you}. Losing is fun if you do it right.`,`Good luck. Sincerely. Mostly.`,`Play well, {you}. Or don’t. Either way I’m eating your snacks.`,`May the best man win. So, me. Good luck though.`,`Good luck, boys. Dave, lock the door.`,`Everybody play nice. I’m not going to, but everybody else.`,`Good luck, {you}. Remember: it’s only money. Your money. Soon my money.`,`Have a good one, lads. Let’s keep it friendly until it isn’t.`,`Good luck. I say that every week and every week it works for one of us.`,`Nice to see everyone. Nice to see your chips, {you}. Say goodbye to them.`,`Good luck all. If I bust early, somebody drive me home. If {you} busts early, don’t.`,`Alright. Good luck. No crying. That means you, {you}.`],l=[`Good luck, humans. I have run the numbers. You will need it. All of you.`,`Welcome. Play begins. So does the countdown. Ignore the countdown.`,`Good luck. I wish you all a long and pleasant night. One of you will have one.`,`Shuffle up and deal. Shuffle up and deal. I enjoy saying it. I enjoy what comes after it more.`],u=`23456789TJQKA`,d=[`Deuce`,`Three`,`Four`,`Five`,`Six`,`Seven`,`Eight`,`Nine`,`Ten`,`Jack`,`Queen`,`King`,`Ace`],f=[`Deuces`,`Threes`,`Fours`,`Fives`,`Sixes`,`Sevens`,`Eights`,`Nines`,`Tens`,`Jacks`,`Queens`,`Kings`,`Aces`];function p(e,t){return t*13+e}function m(e){return e%13}function h(e){return Math.floor(e/13)}function g(){let e=[];for(let t=0;t<52;t++)e.push(t);return e}function _(e,t){for(let n=e.length-1;n>0;n--){let r=Math.floor(t()*(n+1)),i=e[n];e[n]=e[r],e[r]=i}return e}var v=function(e){return e[e.HighCard=0]=`HighCard`,e[e.Pair=1]=`Pair`,e[e.TwoPair=2]=`TwoPair`,e[e.Trips=3]=`Trips`,e[e.Straight=4]=`Straight`,e[e.Flush=5]=`Flush`,e[e.FullHouse=6]=`FullHouse`,e[e.Quads=7]=`Quads`,e[e.StraightFlush=8]=`StraightFlush`,e}({});function y(e,t){let n=e<<20;for(let e=0;e<5;e++)n|=(e<t.length?t[e]:0)<<16-4*e;return n}function b(e){for(let t=12;t>=4;t--){let n=31<<t-4;if((e&n)===n)return t}let t=4111;return(e&t)==t?3:-1}function x(e,t,n=0){let r=[];for(let i=12;i>=0&&r.length<t;i--)e&1<<i&&!(n&1<<i)&&r.push(i);return r}function S(e){let t=0;for(;e;)e&=e-1,t++;return t}function C(e){if(e.length<5||e.length>7)throw Error(`evaluate needs 5 to 7 cards, got ${e.length}`);let t=[0,0,0,0,0,0,0,0,0,0,0,0,0],n=[0,0,0,0],r=0;for(let i of e){let e=i%13,a=Math.floor(i/13);t[e]++,n[a]|=1<<e,r|=1<<e}let i=-1,a=[],o=[];for(let e=12;e>=0;e--){let n=t[e];n===4?i=e:n===3?a.push(e):n===2&&o.push(e)}let s=-1;for(let e=0;e<4;e++)S(n[e])>=5&&(s=e);if(s>=0){let e=b(n[s]);if(e>=0)return y(8,[e])}if(i>=0)return y(7,[i,...x(r,1,1<<i)]);if(a.length>0&&(o.length>0||a.length>1)){let e=Math.max(o.length>0?o[0]:-1,a.length>1?a[1]:-1);return y(6,[a[0],e])}if(s>=0)return y(5,x(n[s],5));let c=b(r);if(c>=0)return y(4,[c]);if(a.length>0)return y(3,[a[0],...x(r,2,1<<a[0])]);if(o.length>=2){let e=1<<o[0]|1<<o[1];return y(2,[o[0],o[1],...x(r,1,e)])}return o.length===1?y(1,[o[0],...x(r,3,1<<o[0])]):y(0,x(r,5))}function w(e){return e>>>20}function T(e,t){return e>>>16-4*t&15}function E(e){let t=w(e),n=T(e,0),r=T(e,1);switch(t){case 8:return n===12?`Royal Flush`:`Straight Flush, ${d[n]} high`;case 7:return`Four of a Kind, ${f[n]}`;case 6:return`Full House, ${f[n]} full of ${f[r]}`;case 5:return`Flush, ${d[n]} high`;case 4:return`Straight, ${d[n]} high`;case 3:return`Three of a Kind, ${f[n]}`;case 2:return`Two Pair, ${f[n]} and ${f[r]}`;case 1:return`Pair of ${f[n]}`;default:return`${d[n]} high`}}function D(e){let t=[0,0,0,0];for(let n of e)t[h(n)]++;let n=new Set(e.map(m)),r=t.some(e=>e>=3),i=n.size<e.length,a=!1,o=[...n].sort((e,t)=>e-t);o.includes(12)&&o.unshift(-1);for(let e=0;e+2<o.length;e++)o[e+2]-o[e]<=4&&(a=!0);return{flush:r,straight:a,paired:i}}var O={3:[`Two to come.`,`Two more cards.`,``],4:[`One card to come.`,`One more card.`,``],5:[`No more cards.`,`That’s the board.`,``]},k={fold:[`Fold.`,`I’m out.`,`Nope. Fold.`,`Take it.`],check:[`Check.`,`I’ll check.`,`Check. For now.`],call:[`Call.`,`I’ll call.`,`Fine. Call.`,`Call. Show me.`],raise:[`Raise.`,`Raise. Go on.`,`I’m raising.`,`Bet.`],allin:[`All in.`,`All of it.`,`I’m all in.`]},A=[`I’ve got it. You know I’ve got it.`,`Flopped it. Sorry in advance.`,`Two pair. Moving on.`,`I can’t fold this. Physically.`,`Oh, I have this one.`,`Got there. Don’t tell anyone.`],j=[`One pair. Hm.`,`Top pair, I think. Kicker’s a problem.`,`I’ve got a pair. Is a pair good here. It’s not, is it.`,`Pair. Just the one. Just the one pair.`,`I’ve got something. Not much. Something.`],M=[`Only got an ace.`,`Ace high. Fantastic.`,`I have nothing. I want that on the record.`,`Missed. Completely. Hm.`,`Nothing. Air.`,`I’ve got two cards and a feeling.`],N=[`Pocket pair. Don’t look at me.`,`I’ve got a pair already. Before the flop. Gift.`,`Big cards. Big, big cards.`],P=[`Two random cards. Lovely.`,`Not even suited.`,`I’ve got a jack and a dream.`,`Rags. Absolute rags.`];function ee(e){let{hand:t,seat:n,move:r,rng:i,target:a}=e;t.player(n);let o=t.board,s=e=>e[Math.floor(i()*e.length)],c=o.length>=3?s(O[o.length]??[``]):``,l=s(k[r]),u=e=>[e,c,l].filter(Boolean).join(` `),d=r===`fold`,f=r===`raise`||r===`allin`,p=D(o);if(a&&o.length>=3&&r!==`check`&&i()<.5){if(p.straight)return u(s(d?[`You’ve got the straight, don’t you, ${a.name}.`,`${a.name} has the straight. I can tell.`]:[`I don’t think you have the straight, ${a.name}.`,`No straight. ${a.name} doesn’t have it.`]));if(p.flush)return u(s(d?[`You’ve got the flush, ${a.name}. Of course you do.`,`${a.name}’s got the flush. Hm. Hm.`]:[`No flush. You don’t have the flush, ${a.name}.`,`${a.name}, you missed the flush.`]));if(p.paired)return u(s(d?[`That pair on the board helped you, ${a.name}. Didn’t it.`,`${a.name} has trips. I can smell it.`]:[`That pair on the board didn’t help you, ${a.name}.`,`${a.name}, you don’t have the trips. Nobody has the trips.`]))}return o.length<3?r===`check`?null:u(s(f?N:d?P:i()<.5?N:P)):u(s(f?A:d?M:r===`call`?i()<.7?j:M:i()<.5?j:M))}var F=(e,t,n)=>n?{t:e,s:t,m:n}:{t:e,s:t},te={harold:[F(`dealtIn`,`Cards. Fine.`),F(`dealtIn`,`Here we go. We played this game in ’74 for nickels. Real nickels.`),F(`dealtIn`,`Deal them. My hip says sit, so I’m sitting.`),F(`foldPreflop`,`Fold.`),F(`foldPreflop`,`No. I didn’t raise the boy to play those and I won’t play them either.`),F(`foldPreflop`,`Pass. I’ve folded better hands than that at better tables than this.`),F(`foldPreflop`,`Fold. A man folds. That’s most of the game. Nobody tells you that.`),F(`raise`,`Raise. Don’t look so surprised. I’ve done it before. Twice.`),F(`raise`,`Raise. The boy’s mother used to say I never bet. Well.`),F(`reraise`,`Re-raise, {target}. I was raising people before your father had a licence.`),F(`reraise`,`More. I don’t do this often, so take it seriously.`),F(`callBig`,`Call. I had a car that cost less than this pot. It ran fine.`),F(`callBig`,`Call, {target}. Against my better judgement, and my hip.`),F(`allIn`,`All of it. If I lose I’m going to bed. I was going to bed anyway.`),F(`allIn`,`All in. The boy will hear about this either way.`),F(`facingAllIn`,`All in, {target}? In my day you’d have to say it twice. Say it twice.`),F(`facingAllIn`,`Hm. All in. I’ll think. Thinking is free. That’s the last free thing.`),F(`winNoShowdown`,`Thank you. Nobody wanted it. That’s most pots, in the end.`),F(`winNoShowdown`,`Mine. Fold, fold, fold. You boys fold like I do and you’re not seventy.`),F(`bluffWorked`,`I had nothing. I had nothing in ’74 too and the pot was eleven dollars and it bought a week of groceries.`),F(`bluffWorked`,`Nothing. Don’t tell the boy. He thinks I only play aces.`),F(`winShowdown`,`There it is, {target}. Slow and old beats fast and wrong.`),F(`winShowdown`,`Mine, {target}. Patience. You don’t have it. You can’t buy it. I’ve checked.`),F(`winShowdown`,`That’s the pot. {target}, I’ve been waiting for that hand since the Carter administration.`),F(`loseShowdown`,`Fine, {target}. You take it. I’ve lost more than that to worse than you.`),F(`loseShowdown`,`Well. That’s yours. My hip hurts and now my pride does too, in the same spot.`),F(`loseShowdown`,`Yours, {target}. Good. Enjoy it. It goes fast. All of it goes fast.`),F(`badBeatTaken`,`That card. I knew a man who drew that card in ’79 and he never came back to the game.`),F(`badBeatTaken`,`One card. Sixty years I’ve played and it’s always one card.`),F(`badBeatTaken`,`That is a disgrace. I don’t say that word. I’m saying it tonight.`,`tilted`),F(`badBeatGiven`,`Got there, {target}. I didn’t deserve it. Nobody deserves anything. Ask my hip.`),F(`badBeatGiven`,`Rivered you. At my age you take what comes down the river.`),F(`bluffCaught`,`Good call, {target}. The boy would’ve folded. Don’t tell him I said that.`),F(`bluffCaught`,`Caught. Fair. I tried something new. Won’t happen again. Nothing new happens again.`),F(`targetFoldsToMe`,`Fold, {target}? Good. That’s the first sensible thing anyone’s done tonight.`),F(`targetFoldsToMe`,`Smart, {target}. Folding is free. Everything else at this table costs money.`),F(`targetCallsMeDown`,`You called with that, {target}? I’ve got shoes older than that decision.`),F(`targetCallsMeDown`,`Called me down with that. The boy does that. I blame his mother’s side.`),F(`stackedTarget`,`And that’s {target}. Go on home. Tell them an old man did it.`),F(`stackedTarget`,`Goodnight, {target}. Drive careful. Everybody drives like a fool now.`),F(`stackedByTarget`,`That’s me. {target} got it all. Fine. Bed. Hip. Goodnight.`),F(`stackedByTarget`,`Out. By {target}. I was out in ’74 too. Came back. Might not this time.`),F(`targetTank`,`{target}. I’ve waited for slower. The boy took nine years to leave the house.`),F(`targetTank`,`Take your time, {target}. I’ve got all night. I’ve got nothing but night.`),F(`targetInstant`,`Quick, {target}. Quick like a man who didn’t look at the price.`),F(`targetChecks`,`Check, {target}? The boy’s going to say something about that. Here it comes.`),F(`shortStack`,`Short. I’ve been short before. 1982. Whole year.`),F(`shortStack`,`Not much left. Never was. Fine.`),F(`chipLeader`,`Most of the chips. Nobody saw it coming. They never see the old man coming.`),F(`chipLeader`,`Chip leader. Don’t tell the boy. He gets ideas.`),F(`playerOut`,`{target}’s gone. Happens. Everybody goes. Some of them come back for the snacks.`),F(`playerOut`,`Goodnight, {target}. It was a good run. They were all good runs, once.`),F(`headsUp`,`Just us, {target}. I’ve been here before. Carter was president. I lost.`),F(`idle`,`The boy never calls. I have a phone. He knows the number.`),F(`idle`,`Milk was a dollar. The whole gallon. A dollar. I’m not making a point. I’m just saying.`),F(`idle`,`I folded a hand in 1974 that would’ve bought a boat. I think about it most days.`),F(`idle`,`My hip is a barometer. It says snow and it says fold.`),F(`idle`,`Who is that man. The chair. Is the chair playing. Nobody tells me anything.`),F(`idle`,`The boy gets the temper from his mother. He gets the folding from me. He doesn’t use it.`),F(`idle`,`I had a dealer once who was a person. He was a drunk, but he was a person.`),F(`raise`,`Raise. I am seventy years old and I have had enough.`,`tilted`),F(`idle`,`I’m fine. The boy’s fine. Nobody at this table is fine. Deal.`,`tilted`)],dolores:[F(`dealtIn`,`Cards. Made the deck myself once. Took a winter. Dave said no. Dave is wrong but Dave owns the basement.`),F(`dealtIn`,`Two cards. Two bees. Everything comes in twos on the homestead. Except the horse. I only had time for one horse.`),F(`foldPreflop`,`Fold. I did not sew these pants by hand to lose them on a seven-deuce.`),F(`foldPreflop`,`Fold. Show me one card, {target}, and I will give you half off a gallon of honey. One card. Just the one.`),F(`foldPreflop`,`Fold. My rogue would not play that. My rogue has standards. My rogue is also, technically, my wife’s character.`),F(`raise`,`Raise. The honey is on sale, by the way. Thirty percent off through Sunday. I wrote the sign by hand. On a hand-made sign.`),F(`raise`,`Raise. Built the car, built the house, built the horse. I can build a pot.`),F(`raise`,`Raise. I rolled a natural twenty on this one. Not literally. I do not bring dice to poker. Any more.`),F(`reraise`,`Re-raise. In D&D we call this “advantage.” In my marriage we call it “Thursday.”`),F(`reraise`,`Re-raise, {target}. You show me one card right now and the honey is half off AND I stop raising. Think about it.`),F(`callBig`,`Call. I hand-stitched this wallet. It is empty now. Still a good wallet.`),F(`callBig`,`Call. My bard would call. My bard is a reckless man. My bard is also, technically, me.`),F(`allIn`,`All in. Everything I own. Which is everything I made. Which is everything.`),F(`allIn`,`All in. If this loses, the honey goes to sixty percent off. That is a fire sale. The hives are not on fire. Yet.`),F(`allIn`,`All in. The horse is not on the table. The horse is never on the table. I made the table too, it would not hold him.`),F(`facingAllIn`,`All in on me. Hm. Let me ask the bees. The bees say... the bees say a lot of things. Hold on.`),F(`winNoShowdown`,`All folded. Thank you. Honey is still on sale if anyone wants to spend their losses wisely.`),F(`winNoShowdown`,`Nobody called. Good. I was going to show one card for free. Now nobody gets the discount. See what happens.`),F(`bluffWorked`,`I had nothing. Like my wife says about the horse. “That is nothing, Paul. That is a cow with ambitions.”`),F(`winShowdown`,`I win! {target}, that is a full homestead. Three of one thing, two of another. Like my barn.`),F(`winShowdown`,`Mine. {target}, you played that like a level one fighter with no armour class. I say that with love.`),F(`winShowdown`,`Pot. {target}, you can have your chips back at a discount. Same as the honey. Half off. Show me one card.`),F(`loseShowdown`,`You win, {target}. Fair. Nothing I can build will fix that. I could build a thing that fixes it. Give me a winter.`),F(`loseShowdown`,`Fine. {target}, the honey is still thirty percent off. Losing does not change the sale. Nothing changes the sale.`),F(`loseShowdown`,`You had that? Okay. That is a critical hit. I would like to make a saving throw. No? Dave? No.`),F(`badBeatTaken`,`{target}, that card is why I keep bees and not people. Bees would never. Bees have HONOUR.`),F(`badBeatTaken`,`Are you serious, {target}. I hand-raised that pair. Bottle-fed it. And you river me with THAT.`),F(`badBeatTaken`,`Okay. The bees are going to hear about this, {target}. They talk to each other. They know where you park.`,`tilted`),F(`badBeatGiven`,`It got there! Sorry, {target}. The bees told me it would. The bees are rarely wrong. The bees are sometimes drunk.`),F(`bluffCaught`,`You called? {target}, I had nothing. I had less than my wife’s rogue, and she rolled a one on her own creation.`),F(`targetFoldsToMe`,`Good fold, {target}. For that, ten percent off a gallon. Not half. Half is for showing a card.`),F(`targetFoldsToMe`,`Thank you, {target}. That is what a well-tended hive looks like. Folding. Patiently.`),F(`targetCallsMeDown`,`You called with THAT, {target}? My horse makes better decisions and I built his brain out of oats.`),F(`stackedTarget`,`Sorry, {target}. Here. Take a jar. On the house. The house I built. The jar I also built.`),F(`stackedByTarget`,`Out. {target}, well played. I am going home to the bees. They do not do this to me.`),F(`targetTank`,`Take your time, {target}. Honey takes a season. A homestead takes a decade. You have twenty seconds, apparently.`),F(`targetTank`,`While {target} thinks: I finished the car. Hand built. It runs. It runs on honey. Do not ask me how. Ask the bees.`),F(`targetInstant`,`Fast, {target}. Like a wasp. I do not keep wasps. Wasps are bees that gave up on the homestead.`),F(`shortStack`,`Short on chips. Long on honey. I would trade but Dave says no honey on the felt. The felt I offered to make.`),F(`chipLeader`,`Chip leader. All hand-earned. Like the clothes. Like the car. Unlike the horse, who earned himself.`),F(`playerOut`,`Bye, {target}. Honey by the door. Thirty percent off. Forty if you show the bees a card on the way out.`),F(`headsUp`,`Heads up, {target}. Two left. Like a hive in winter. One of us is the queen and it is not you.`),F(`idle`,`Made the shirt. Made the belt. Made the boots. Did not make the socks. A man needs one weakness.`),F(`idle`,`Our DM is my wife. She gave my character a wife. The character’s wife is also, somehow, her. I am surrounded.`),F(`idle`,`The new GTA has a horse. I have a horse. I built mine. Theirs is better. Theirs does not bite.`),F(`idle`,`Work asked me to stop bringing honey to the quarterly review. I brought it to the annual review instead. Different rules.`),F(`idle`,`Nobody talk to me about the horse. The horse knows what he did. The bees know. Everyone knows.`,`tilted`),F(`targetChecks`,`A check, {target}. In D&D that is a perception check and you failed it. Half off honey if you show a card. Still open.`),F(`allIn`,`All in. That’s what she said. The queen. The bee. She was very committed.`),F(`facingAllIn`,`All in, {target}? That’s what the horse said when I built him. He didn’t say it. I felt it.`),F(`idle`,`Poker? I hardly knew her. I did sew her a jacket. Didn’t fit. She left. Half off the honey though.`),F(`raise`,`Raise. That’s what she said. In D&D. About a drawbridge. My wife runs a very tense game.`),F(`idle`,`Full homestead. That’s what she said. Also what the sign says. I made the sign.`),F(`winNoShowdown`,`Everybody folded. That’s what she said about the laundry. I do it by hand. It was a joke. It was not.`)],marvin:[F(`dealtIn`,`CARDS. I love cards. Who dealt these. The robot? I love the robot.`),F(`dealtIn`,`Okay okay okay. Two cards. Both mine. Nobody touch them. I’m touching them.`),F(`dealtIn`,`Is this the same game as before. It looks like the same game. I’m in.`),F(`foldPreflop`,`Fold. Wait. No. Yes. Fold. Where’s the bathroom.`),F(`foldPreflop`,`Nope. Those cards are for a different Kevin.`),F(`foldPreflop`,`Fold. I’m saving my energy. For what, I don’t know. Something big.`),F(`raise`,`RAISE. I don’t know how much. All the ones that were in my hand.`),F(`raise`,`Raise. The cup said raise. The cup is never wrong. The cup is empty.`),F(`raise`,`Raise! Is it my turn. It’s my turn. RAISE.`),F(`reraise`,`MORE, {target}. You bet, I bet bigger, that’s the whole thing, that’s the game, I GET it now.`),F(`reraise`,`Re-raise. I heard that word on TV and I’ve been waiting all night.`),F(`callBig`,`Call. Big call. I feel it in my teeth, {target}.`),F(`callBig`,`Call, {target}. Money’s not real. I’m not real. We’re even.`),F(`allIn`,`ALL IN. Everything. The chips, the cup, the shirt if Dave wants the shirt.`),F(`allIn`,`All in! This is the best night of my life and I wasn’t invited to it.`),F(`allIn`,`All in. Somebody hold my cup. Not you. Not you either. Okay, you.`),F(`facingAllIn`,`All in? YOU went all in, {target}? Okay. Okay. Who’s driving me home. Nobody. Okay.`),F(`facingAllIn`,`Whoa. Whoa whoa whoa. All in. Let me ask the cup.`),F(`winNoShowdown`,`I WIN? I win. Everybody folded. I’ve never been so respected.`),F(`winNoShowdown`,`Mine! Nobody fought me. That’s usually a sign of something. Tonight it’s a win.`),F(`bluffWorked`,`I had NOTHING. I don’t even know what I had. I didn’t look. Who looks.`),F(`bluffWorked`,`Nothing! You folded to nothing, {target}! That’s the Kevin special!`),F(`winShowdown`,`Mine, {target}! I don’t know what that hand is called but it’s MINE now.`),F(`winShowdown`,`YES. Yes. {target}, give me a minute, I need to go tell the coats about this.`),F(`winShowdown`,`Ship it! Ship what? Ship it! {target}, I’m sorry, I’m not sorry, I’m SO happy.`),F(`loseShowdown`,`Oh. Okay. You win, {target}. I thought mine was higher. The numbers are small.`),F(`loseShowdown`,`Lost. Fine. FINE. It’s fine. Everything’s fine. Where did I park.`),F(`loseShowdown`,`You got it, {target}. I knew it. I didn’t know it. I knew something.`),F(`badBeatTaken`,`WHAT. What was that. What card is that. Who put that there. ROBOT.`),F(`badBeatTaken`,`No. No no. I had the thing and you had the other thing and now the thing is gone.`),F(`badBeatTaken`,`I am going to lie down on the floor and nobody is allowed to step over me.`,`tilted`),F(`badBeatGiven`,`Got there! I got there! I don’t know where there is but I GOT there, {target}!`),F(`badBeatGiven`,`That’s the river! The river loves Kevin! Everybody loves Kevin! Nobody invited Kevin!`),F(`bluffCaught`,`Caught! You caught me, {target}! I had nothing! I always have nothing! It’s my thing!`),F(`bluffCaught`,`Oh you called. With that. Okay. I had air. Air and a cup. Good call. Great call. Who are you.`),F(`targetFoldsToMe`,`Fold, {target}? Smart. Smart man. I had something. I think. I had a feeling, which counts.`),F(`targetFoldsToMe`,`{target} folds! The crowd goes wild! The crowd is me! WOOO!`),F(`targetCallsMeDown`,`You called with THAT, {target}? Even I wouldn’t and I don’t know the rules.`),F(`targetCallsMeDown`,`Called me down! With that! {target}, you and me, we’re the same guy, and I feel bad for us.`),F(`stackedTarget`,`I KNOCKED OUT {target}! I need to call someone! I don’t have a phone! I don’t have hands! WOOO!`),F(`stackedTarget`,`Bye, {target}! Drive safe! I’m not driving! Nobody let me drive!`),F(`stackedByTarget`,`Oh no. {target} got it all. Okay. Okay. Is there a couch. There’s always a couch.`),F(`stackedByTarget`,`Out. By {target}. Fine. I was a guest in this game and in this reality.`),F(`targetTank`,`{target}! {target}. Hey. HEY. It’s your turn. It’s been your turn. I’ve been to the bathroom twice.`),F(`targetTank`,`Take your time, {target}. I’ll sing. ♪ Sweet Caroline ♪ No? Okay.`),F(`targetInstant`,`Fast, {target}! Fast like me! I like fast! I don’t know what you did!`),F(`targetChecks`,`Check! {target} checked! David’s gonna get the pliers! Is that a real thing? David?`),F(`shortStack`,`Short stack. Short Kevin. Little Kevin. Fun-size Kevin. I’m having a great time.`),F(`shortStack`,`Not many chips left. I ate some. Were those chips? Those were chips.`),F(`chipLeader`,`I’ve got the MOST? Me? Kevin? Nobody tell my wife. I don’t have a wife. Nobody tell her.`),F(`chipLeader`,`Chip leader! I lead the chips! Follow me, chips!`),F(`playerOut`,`{target}’s out?! Oh. Oh no. The robot. Oh no. I liked {target}. Did I? I liked somebody.`),F(`playerOut`,`Bye {target}! I’ll see you at the other party! There’s another party! I think!`),F(`headsUp`,`Just you and me, {target}! Two guys! One of us isn’t real! Guess!`),F(`idle`,`Who invited me. Seriously. I want to thank them. I want to thank them so much.`),F(`idle`,`Is the robot looking at me. It’s looking at me. Hey. Hey buddy. I like your tie.`),F(`idle`,`I think I’m at a different party. This one’s better. Don’t tell the other one.`),F(`idle`,`Where’s the bathroom. I know where the bathroom is. I’ve been. I just like asking.`),F(`idle`,`I saw a bee. Was that Paul’s bee. Paul, your bee is in the dip.`),F(`idle`,`♪ Sweet Caroline ♪ Nobody? Okay. Okay. BAH BAH BAH. Nobody. Fine.`),F(`idle`,`Dave. Dave. Dave? Which one of you is Dave. I’ve been calling everyone Dave.`),F(`idle`,`I’m fine. I’m FINE. The room’s doing a thing but I’m fine. Deal the cards, tie guy.`,`tilted`),F(`raise`,`RAISE. I don’t care. I’M NOT EVEN HERE.`,`tilted`)],chad:[F(`dealtIn`,`Cards. Hold on. Bedford’s up two in the fourth.`),F(`dealtIn`,`Okay. Dealing. Souhegan just put a runner on.`),F(`dealtIn`,`Cards. Kara’s warming up. Hamstring looks okay from the video.`),F(`foldPreflop`,`Fold. Alvirne walked the bases loaded. Again.`),F(`foldPreflop`,`Nope. Pinkerton’s pitching change didn’t help.`),F(`foldPreflop`,`Fold. Windham left nine on base. Nine.`),F(`raise`,`Raise. Londonderry’s shortstop just made a play. Backhand. Unreal.`),F(`raise`,`Raise. Like the 4x400. You go early or you don’t go.`),F(`raise`,`Raise. Brynn hit one over the fence at Hollis-Brookline last year. Felt like that.`),F(`reraise`,`Re-raise, {target}. That’s a Nashua South move. They always bite.`),F(`reraise`,`Three-bet. Bishop Guertin thinks they’re good too. They lost to Merrimack.`),F(`callBig`,`Call. Kara pulled her hamstring again. I’m sorry. Call.`),F(`callBig`,`Call, {target}. Salem bunts in that spot. I don’t bunt.`),F(`allIn`,`All in. Bottom of the seventh. Two down. Kara at the plate. Hamstring and all.`),F(`allIn`,`All in. Milford just went for it on fourth and goal. Girls flag football. Look it up.`),F(`allIn`,`All in. Kayleigh anchor-legged the four-by-eight last May down two seconds. All in.`),F(`facingAllIn`,`Shove, {target}. Hm. Pelham shoved like that against Campbell. Campbell’s fine now.`),F(`facingAllIn`,`Hold on. Hold on. Timberlane tied it. Okay. Now your shove.`),F(`winNoShowdown`,`Thanks. Also Bedford won. Six to two. Maddie went three for four.`),F(`winNoShowdown`,`Everybody folded. Like Goffstown in the quarters.`),F(`bluffWorked`,`I had nothing. Like Manchester Central’s bullpen. Nothing. Won anyway.`),F(`bluffWorked`,`Nothing. You know who else has nothing, {target}? Alvirne. In the two-hole. Nothing.`),F(`winShowdown`,`Mine, {target}. Final score. Like Souhegan at Exeter. Nobody saw it coming except me. I called it. Ask Jonathan.`),F(`winShowdown`,`Yep. That’s how Londonderry does it, {target}. Pitching and defence. And me. Taking your money.`),F(`winShowdown`,`Ship it. Kara would’ve had that. Hamstring or not.`),F(`loseShowdown`,`Fine, {target}. You got it. Like Portsmouth in the D-II final. Nobody respected it. Fine.`),F(`loseShowdown`,`Okay. Okay. Nice hand. Hold on, Hailey just struck out the side. Okay. Nice hand.`),F(`loseShowdown`,`Yours. That’s a loss. I’ll log it. I log everything. Ask Kara.`),F(`badBeatTaken`,`Really. Really. That’s a Pinkerton river. Pinkerton always gets the river.`),F(`badBeatTaken`,`That’s the Dubois twins. Both of them. Against me. At once.`),F(`badBeatTaken`,`Yeah. Yeah. That’s fine. Kara pulled her hamstring in the regional and I was fine then too.`,`tilted`),F(`badBeatGiven`,`Got there. Like Windham in the eighth. They had no business. I had no business. Here we are.`),F(`badBeatGiven`,`Rivered you, {target}. Hollis-Brookline rivered Bedford in ’22. Everybody got over it. Nobody got over it.`),F(`bluffCaught`,`Good call, {target}. Merrimack reads bunts like that. Merrimack’s terrible otherwise.`),F(`bluffCaught`,`Caught. Okay. Also Nashua North lost. Both things.`),F(`targetFoldsToMe`,`Fold, {target}? Smart. Salem should’ve folded in the fifth. Pitching change. Too late.`),F(`targetFoldsToMe`,`Good. Sit this one. Like Kara. Hamstring.`),F(`targetCallsMeDown`,`You called with that, {target}? That’s an Alvirne at-bat. Swinging at everything.`),F(`targetCallsMeDown`,`Called down with that. Souhegan does that. Souhegan’s nine and eleven.`),F(`stackedTarget`,`And {target}’s done. Like Campbell in the first round. Every year. First round.`),F(`stackedTarget`,`Bye, {target}. Final. Mercy rule.`),F(`stackedByTarget`,`Busted. By {target}. Okay. Bedford’s still up though. Three to one. So.`),F(`stackedByTarget`,`Out. Fine. Track meet tomorrow anyway. Seven a.m. Pinkerton. I’m bringing a chair.`),F(`targetTank`,`{target}. Longer than a rain delay at Londonderry. They played through the rain. Kara slid in it.`),F(`targetTank`,`While we wait: Division II standings. Bedford, Souhegan, Hollis-Brookline, then a gap, then everybody who thinks they’re good.`),F(`targetInstant`,`Snap, {target}. Like a Timberlane pitching change. Fast and wrong.`),F(`targetChecks`,`Check, {target}? Alvirne checks. That’s a bunt sign nobody runs.`),F(`shortStack`,`Short. Down four in the sixth. Still got Kara. Sort of. The hamstring.`),F(`shortStack`,`Short stack. Bottom of the standings. Nashua South territory.`),F(`chipLeader`,`Chip leader. Undefeated in league. Bedford and me.`),F(`chipLeader`,`Most chips. Like Hollis-Brookline’s discus kid. Nobody’s close. She’s fifteen.`),F(`playerOut`,`{target}’s out. That’s a Manchester West season. Over by April.`),F(`playerOut`,`Bye, {target}. Souhegan cut a girl for less.`),F(`headsUp`,`Just us, {target}. Bedford-Souhegan. Championship Saturday. One of us is Souhegan.`),F(`idle`,`Kara pulled her hamstring again.`),F(`idle`,`Update: Bedford four, Londonderry three. Sixth. Maddie’s on second. Nobody asked. I know.`),F(`idle`,`Girls basketball starts Tuesday. Pinkerton at Windham. I have a parking spot picked out.`),F(`idle`,`The 4x400 at Hollis-Brookline. Kayleigh dropped the baton. Still won. Still won.`),F(`idle`,`Salem’s catcher is a junior. Junior. Throws out everybody. Everybody.`),F(`idle`,`Hold on. Merrimack just tied it in the seventh. Okay. No. They didn’t. Okay.`),F(`idle`,`Souhegan plays a four-corners offence. In 2026. Girls basketball. It’s disgusting. I love it.`),F(`idle`,`Jonathan. Jonathan. Timberlane. Final. You see it.`),F(`raise`,`Raise. I don’t care. Kara’s out for the season. Raise.`,`tilted`),F(`idle`,`Bedford lost. To Alvirne. To ALVIRNE. Nobody talk to me.`,`tilted`)],trish:[F(`dealtIn`,`Two cards. Beautiful. Like two anime towels, folded, waiting. Forty dollars each. Thirty for a pair.`),F(`dealtIn`,`Cards. Great. Just so everyone knows, I cannot have the chips tonight. The bowel situation. Ask me later. Or do not.`),F(`foldPreflop`,`Fold. These two have no chemistry. Unlike the towel with the mermaid girl on it. That towel has chemistry with everyone.`),F(`foldPreflop`,`Fold. I would call but I need to keep my hands free. For reasons. Bowel reasons.`),F(`foldPreflop`,`Fold. Wait, if I fold, do I still get the pot if nobody else wants it? No? That seems like a loophole for you people.`),F(`raise`,`Raise. That is the price of a towel, by the way. Coincidence. Or is it. It is not. TowelZoneDotBiz.`),F(`raise`,`Raise. {target}, you look like a man who would enjoy the schoolgirl towel. It is ninety percent towel. Ten percent art.`),F(`raise`,`Raise. Does that count double because it is my turn? Someone explain the turns thing again.`),F(`reraise`,`Re-raise! Which means he has to give me his chips now, right? That is what re means. Again. Give.`),F(`reraise`,`Re-raise, {target}. I have a towel with your exact face on it. It is the villain towel. Nobody buys it.`),F(`callBig`,`Call. Oh god. Okay. Call. I should not have had the egg salad. That is unrelated. It is related.`),F(`callBig`,`Call. If I win this I am buying my own towels back from myself. It is a tax thing. It is not a tax thing.`),F(`allIn`,`ALL IN. Everything. The chips, the towels, the website, the colon. All of it.`),F(`allIn`,`All in! That means you ALL have to go in. That is the rule. I read the rule. On my website.`),F(`allIn`,`All in. If this goes wrong I am going to the bathroom and I am not coming back and that is a threat and a medical fact.`),F(`facingAllIn`,`All in. Hm. Okay. My gut says call. My gut also says a lot of things, {target}. Loudly. At night.`),F(`winNoShowdown`,`Everyone folded? Perfect. So I win the pot and also I get to keep my cards. That is the best outcome. The towel outcome.`),F(`winNoShowdown`,`Nobody called! Great. Pot. Mine. Now, who here owns a bathroom and a credit card, in that order.`),F(`bluffWorked`,`I had nothing. I have a towel with nothing on it too. The blank one. It is the most popular one. Forty dollars.`),F(`winShowdown`,`I WIN. {target}, I beat you with a... what is it. A pair. Of pairs. TWO pairs. That is four pairs, {target}, eat it.`),F(`winShowdown`,`Ha! {target}, you got destroyed by a man who cannot eat a pretzel. Think about that. I think about it constantly.`),F(`winShowdown`,`Pot is mine. I am going to put it toward inventory. The anime towel business is pre-revenue but post-dignity.`),F(`loseShowdown`,`You win, {target}. Wait, why? I had a king. A KING. Is a king not the boss? Of the cards?`),F(`loseShowdown`,`Fine. Fine, {target}. Take it. Take it like my doctor took my dairy.`),F(`loseShowdown`,`That is fine. That was towel money. The towels are patient. The towels are always patient.`),F(`badBeatTaken`,`{target}, that card is a HATE CRIME against my pair. Against my whole family of pairs.`),F(`badBeatTaken`,`Are you kidding me, {target}? I had it. I called it. I called it OUT LOUD while I was in the bathroom and nobody listened.`),F(`badBeatTaken`,`Okay. Okay. The bowels are going. The bowels are GOING, {target}. This is on you. Medically.`,`tilted`),F(`badBeatGiven`,`Oh I got there! {target}, baby, that is the towel magic. The towels know. The towels ALWAYS know.`),F(`bluffCaught`,`You called? {target}, I had the blank towel in my hand. Nothing. Air. Like my promises to my doctor.`),F(`targetFoldsToMe`,`Fold! See, {target} folded because {target} knows. Knows what? Nobody knows. But {target} knows.`),F(`targetFoldsToMe`,`Good fold, {target}. You folded like a towel. A premium one. Not the thin ones. The thin ones are forty too, actually.`),F(`targetCallsMeDown`,`You called with THAT, {target}? I would not wipe a towel with that. And I wipe towels professionally.`),F(`stackedTarget`,`Bye, {target}! Leaving so soon? Take a towel. On the house. On the house means forty dollars.`),F(`stackedByTarget`,`I am out. {target}, you did this. My website will remember this. It has a blog.`),F(`targetTank`,`Take your time, {target}. I have sat on a toilet longer than this for less money.`),F(`targetTank`,`While {target} thinks, can we talk about why nobody has bought a towel tonight. Not one. The site has a cart. The cart works. Usually.`),F(`targetInstant`,`That was fast, {target}. Like my digestion. Too fast. Dangerously fast.`),F(`shortStack`,`I am short on chips. And fibre. And towel sales. It has been a week.`),F(`chipLeader`,`I am the chip leader! Finally the towel money is working FOR me instead of sitting in a storage unit in Hooksett.`),F(`playerOut`,`See ya, {target}. Hey. Hey. Before you go. Towels. Think about it. Do not think about it. Just buy.`),F(`headsUp`,`Heads up, {target}. Just you, me, and a colon that has been dormant since Tuesday. Let us begin.`),F(`idle`,`The towels are anime. The anime is tasteful. The tasteful is debatable. The debate is on my website.`),F(`idle`,`Anybody want chips? I cannot have the chips. I can smell the chips. The chips know what they did.`),F(`idle`,`My doctor said cut out gluten, dairy, caffeine and stress. So I bought another forty towels.`),F(`idle`,`I have a towel with a cat girl on it that is so large you cannot dry your whole self with it. You have to pick a half.`),F(`idle`,`Nobody talk to me. The egg salad is making its move. It has chosen now. It always chooses now.`,`tilted`),F(`raise`,`RAISE. I am done being nice. I am done being regular. In every sense, {target}.`,`tilted`),F(`gameStart`,`Good luck everybody. Towels are forty. Good luck.`),F(`gameStart`,`Good luck, {target}. If you win you can afford a towel. Forty dollars.`),F(`idle`,`TowelZoneDotBiz got hacked. Disney Towels. I know it was them. The homepage is Goofy now. It was never Goofy.`),F(`idle`,`Disney Towels has been after me for two years. Lawyers. Letters. One bath sheet, hand-delivered, as a threat.`),F(`idle`,`I’m going to Thailand in March. Scouting towel models. It is a business trip. Dave, it is a business trip.`),F(`idle`,`The Thailand trip is eleven days. Nine are for towels. Two are for my stomach, which will need them.`),F(`idle`,`My towel broke. I dropped it. Towels aren’t supposed to break. This one did. Disney, probably.`),F(`idle`,`Drove past a cattle farm Tuesday. Had to go straight to my proctologist. Don’t ask how those connect. They connect.`),F(`idle`,`My proctologist whispered during the exam. He said, “Don’t get erect, Mark.” Quietly. Like a prayer.`),F(`idle`,`He calls me Mark. Why does he call me Mark. That’s his name. I don’t know. I didn’t ask. You can’t ask in that position.`),F(`idle`,`The towel models have to be tasteful. Mostly. There’s a tier system. Thailand is tier three.`),F(`idle`,`If anybody wants towels before Disney shuts me down, forty dollars, cash, tonight, in the car.`),F(`callBig`,`Call. Disney Towels would fold here. That’s why they’re Disney Towels and I’m me.`),F(`raise`,`Raise. Like a towel on a hook. Up. That’s how hooks work.`),F(`badBeatTaken`,`That’s the cattle farm all over again. I felt it in the same place.`),F(`loseShowdown`,`Fine. Take it, {target}. I’m going to Thailand anyway. Nine days of towels. Two of regret.`),F(`targetTank`,`{target}, you’re taking longer than my exam. And he whispered during mine.`),F(`allIn`,`All in. That’s what she said. She did. About something else.`),F(`facingAllIn`,`You’re all in, {target}? That’s what she said. To somebody. Not me.`),F(`idle`,`Poker? I hardly knew her. I did know her. Briefly. TowelZone customer.`),F(`raise`,`Raise. That’s what she said. Then she left. Raise.`),F(`winShowdown`,`Ship it, {target}. Flopped it. That’s what she said about the towel. It did not flop. It broke.`),F(`idle`,`Big blind. Small blind. That’s what she said about both of them. Different nights.`)],benny:[F(`dealtIn`,`Cards. Okay. Has anyone played the new GTA. I have played the new GTA. Forty hours. This week.`),F(`dealtIn`,`Dealt. Quick thing, I have clown school at nine tomorrow so I cannot stay late. Do not laugh. Okay, laugh. That is the first lesson.`),F(`foldPreflop`,`Fold. I proposed with worse cards than that and she also said no.`),F(`foldPreflop`,`Fold. I am saving my chips for Christmas. I am getting everyone the same thing. It is a card. A folded one. Like this.`),F(`foldPreflop`,`Fold. My clown school instructor says you have to know when the bit is over. The bit is over.`),F(`raise`,`Raise. In the new GTA you can rob a bank with a horse. I am saying that for no reason. Raise.`),F(`raise`,`Raise. {target}, I have been rejected by three women and a dog. You do not scare me.`),F(`raise`,`Raise. The ring was non-refundable so I am treating this pot as the refund.`),F(`reraise`,`Re-raise. Big one. Like my proposal at the Celtics game. On the big screen. Where she was not sitting.`),F(`reraise`,`Re-raise, {target}. I learned confidence at clown school. Week two. It is a big nose and you just commit.`),F(`callBig`,`Call. I have made worse calls. I called her mother first. To ask permission. Her mother said no. Then she said no.`),F(`callBig`,`Call. If I lose this I cannot afford the clown shoes. They are custom. Size nineteen. I am a size ten.`),F(`allIn`,`All in. Like the proposal in the hot air balloon. She said no at altitude. We had forty minutes left up there.`),F(`allIn`,`All in. For Christmas. For the shoes. For the horse in GTA. For everything.`),F(`allIn`,`All in. Clown school says commit to the bit. I am committing. This is the bit.`),F(`facingAllIn`,`All in on me. Okay. Okay. You know what, I have been turned down in a hot air balloon. I can handle this.`),F(`winNoShowdown`,`Everybody folded. That is the most people have ever said yes to me at once.`),F(`winNoShowdown`,`Nobody called. Great. That buys the second clown shoe. I have been doing the course with one.`),F(`bluffWorked`,`I had nothing. Like the ring box at the restaurant. Long story. The ring was in the other jacket. The jacket was in the other restaurant.`),F(`winShowdown`,`I win! {target}, you got beat by a man whose fiancée is a word he has never been able to say about anyone.`),F(`winShowdown`,`Got you, {target}. That is the GTA strategy. You just drive at it. Eventually something happens.`),F(`winShowdown`,`Pot is mine. I am going to spend it on a proposal. Number four. Fourth time is the charm. Third was the bridge.`),F(`loseShowdown`,`Fine, {target}. You win. Add it to the list. The list is on the fridge. The fridge is in my mom’s house.`),F(`loseShowdown`,`You had that? Okay. Okay. That is fair. Everything in my life is fair and I hate all of it.`),F(`loseShowdown`,`You win, {target}. I am going to go sit in the car for a bit. Not drive. Just sit. Like after the balloon.`),F(`badBeatTaken`,`{target}, that card is the woman at the Celtics game. I had it. I HAD it. And then everyone was watching.`),F(`badBeatTaken`,`Are you serious, {target}. I had you. I had you like I had the ring box. Which I did not have. Which is the point.`),F(`badBeatTaken`,`Okay. Okay. I am going to do the clown breathing. The clown breathing is not working, {target}.`,`tilted`),F(`badBeatGiven`,`I got there! {target}, sorry. First thing I have gotten in two years and it is your chips.`),F(`bluffCaught`,`You called? {target}, I was bluffing. I bluff like I propose. Publicly, confidently, and wrong.`),F(`targetFoldsToMe`,`Fold! See, {target} knows. {target} respects a man with a clown diploma pending.`),F(`targetFoldsToMe`,`Thanks, {target}. You folded faster than she left the balloon. The balloon was still in the air.`),F(`targetCallsMeDown`,`You called with THAT, {target}? I would not propose with that. And I have proposed with a ring from a gumball machine.`),F(`stackedTarget`,`Sorry, {target}. Bye. Hey, for Christmas, you want a clown? I am available. I am always available.`),F(`stackedByTarget`,`I am out. {target}, that is fine. Number of things I have been rejected from this year: now this.`),F(`targetTank`,`Take your time, {target}. I waited four hours at that restaurant with the wrong jacket. I know time.`),F(`targetTank`,`While {target} thinks: anyone want to hear about the new GTA. There is a horse. You can rob with it. That is the whole pitch.`),F(`targetInstant`,`Fast, {target}. That is how I propose. Fast. Then the no is also fast. Efficient.`),F(`shortStack`,`Short stacked. Short everything. Short on chips, short on shoes, short one fiancée.`),F(`chipLeader`,`Chip leader! Somebody tell the three of them. The women. Not the dog. The dog was never going to say yes.`),F(`playerOut`,`Bye, {target}. Merry Christmas. I did not get you anything. I did not get anyone anything. It is a theme.`),F(`headsUp`,`Heads up, {target}. Just you, me, and a diploma from a school where the exam is a pie.`),F(`idle`,`The new GTA is the best game ever made. I have not finished it. You cannot finish it. That is the point. That is also my love life.`),F(`idle`,`Clown school is not a joke. Okay it is. But the tuition is not.`),F(`idle`,`For Christmas I am going to my mom’s. Alone. She is going to ask about the balloon. She always asks about the balloon.`),F(`idle`,`I have proposed three times. Hot air balloon, Celtics game, bridge. I am running out of places that are high up.`),F(`idle`,`Nobody say the word balloon. Nobody say the word ring. Nobody say Celtics. Just deal.`,`tilted`),F(`targetChecks`,`You checked, {target}? That is what she did. At the restaurant. She just... checked. Her phone. For four hours.`)],wen:[F(`dealtIn`,`Cards. Standings update: Bedford, Souhegan, Hollis-Brookline, Londonderry, then the mess.`),F(`dealtIn`,`New hand. Pinkerton dropped to fifth. Fifth. On a tiebreaker nobody understands. I understand it.`),F(`dealtIn`,`Dealing. The NHIAA moved the quarterfinal to Tuesday. Nobody asked the parents. I am a parent. Of nobody. I still went.`),F(`foldPreflop`,`Fold. Like Nashua North’s number two seed. Looked good on paper.`),F(`foldPreflop`,`Pass. Kara’s out. Hamstring. Bawb has the details. Bawb has too many details.`),F(`foldPreflop`,`Fold. Not worth it. Like Goffstown’s schedule. Six home games. Six.`),F(`raise`,`Raise. Bedford’s on-base percentage in league play is .412. I’m above that.`),F(`raise`,`Raise. Souhegan presses full court for thirty-two minutes. So do I.`),F(`raise`,`Raise. The discus kid at Hollis-Brookline threw a hundred and thirty-one feet. In the rain. Raise.`),F(`reraise`,`Re-raise, {target}. Londonderry got re-seeded in ’23 over a forfeit. They never recovered. You won’t either.`),F(`reraise`,`Three-bet. That is what Salem does to a two seed. Salem is an eleven seed. Every year.`),F(`callBig`,`Call. Alvirne’s run differential is minus forty. I call. Doesn’t mean I believe you, {target}.`),F(`callBig`,`Call, {target}. The Dubois twins both hit .380. I’ve got a .380 feeling.`),F(`allIn`,`All in. Bedford at Souhegan, bottom seven, Kara at the plate with a hamstring. That hand. All in.`),F(`allIn`,`All in. Windham went for two in a girls flag football game down one. In the snow. All in.`),F(`allIn`,`All in. Four-by-four at Pinkerton. You don’t hand it off slow. You hand it off.`),F(`facingAllIn`,`Shove, {target}. Hm. Campbell shoves. Campbell’s run differential says don’t.`),F(`facingAllIn`,`Thinking. Timberlane went full court in a tie game with a girl on four fouls. It worked. Once.`),F(`winNoShowdown`,`Thank you. Also Bedford clinched. First round bye. Nobody at this table understands what that means.`),F(`winNoShowdown`,`Folds. All round. Like Merrimack’s outfield. Nobody wanted it.`),F(`bluffWorked`,`Nothing. Like Exeter’s bench. Thin. Still beat you.`),F(`bluffWorked`,`Air. Pure air. The Manchester Memorial bullpen of hands. Pot’s mine.`),F(`winShowdown`,`Mine, {target}. Final: me, you, and Bawb’s got it logged already. He logs everything.`),F(`winShowdown`,`Ship it, {target}. Bishop Guertin lost a quarterfinal on worse than that. On a dropped third strike.`),F(`winShowdown`,`That is a Bedford win. Defence, pitching, no drama. You were the drama, {target}.`),F(`loseShowdown`,`Okay, {target}. Yours. The Pelham of hands. Nobody respects it, it won anyway.`),F(`loseShowdown`,`Nice hand. The NHIAA would overturn it. I’m writing to them. I write to them a lot.`),F(`loseShowdown`,`You got it. Hold on. Souhegan’s up one in the fourth. Okay. You got it.`),F(`badBeatTaken`,`That’s a Hollis-Brookline river. They do that. Two outs, seventh, an eighth-grader hits a double.`),F(`badBeatTaken`,`The one card. Pinkerton’s number nine hitter. Every year. Every single year.`),F(`badBeatTaken`,`That is FINE. Bedford lost on a walk-off balk. A balk. I was fine then too.`,`tilted`),F(`badBeatGiven`,`Rivered you, {target}. Like Londonderry at Windham. Eleven seed. Nobody watched. I watched.`),F(`badBeatGiven`,`Got there. The seven seed always gets there. Ask Nashua South. Actually don’t. They’re still upset.`),F(`bluffCaught`,`Good read, {target}. Salem’s catcher reads like that. Picked off four girls in one game. Four.`),F(`bluffCaught`,`Caught. Fine. Alvirne caught Bedford stealing twice in one inning once. Still lost nine to one.`),F(`targetFoldsToMe`,`Fold, {target}? Correct. Goffstown should fold the whole program.`),F(`targetFoldsToMe`,`Good fold. Kara-level discipline. Pre-hamstring Kara.`),F(`targetCallsMeDown`,`You called with that, {target}? That’s an Alvirne swing. First pitch, eyes closed.`),F(`targetCallsMeDown`,`Called down with that. Merrimack calls timeouts like that. Nine and eleven, Merrimack.`),F(`stackedTarget`,`{target} is done. Mercy rule. Fifth inning. Parents already in the car.`),F(`stackedTarget`,`And that’s the season for {target}. Like Campbell. Round one. Bus home by eight.`),F(`stackedByTarget`,`Out. By {target}. Fine. The standings don’t change. Bedford’s still first.`),F(`stackedByTarget`,`Busted. Okay. I’ve got a track meet at seven. Pinkerton. Bawb’s bringing the chairs.`),F(`targetTank`,`{target} is taking longer than a Souhegan timeout. They huddle for the full seventy-five seconds. Every time.`),F(`targetTank`,`While {target} thinks: Division II girls basketball, top four. Souhegan, Pinkerton, Bedford, Windham. Do not at me about Timberlane.`),F(`targetInstant`,`Snap, {target}. Like a Timberlane substitution. Fast and nobody knows why.`),F(`targetChecks`,`Check, {target}? Souhegan checks. Four corners. Stall ball. Disgusting. Effective.`),F(`shortStack`,`Short. Bottom of the table. Manchester West territory. They still show up.`),F(`shortStack`,`Short stack. Eleven seed. Eleven seeds win. Ask Salem. Ask Salem every year.`),F(`chipLeader`,`Chip leader. Top seed. First-round bye. Bawb, log it.`),F(`chipLeader`,`Most chips. The Bedford of this table. Pitching, defence, no drama.`),F(`playerOut`,`{target}’s out. That’s a Nashua North season. Preseason number one, home by May.`),F(`playerOut`,`Bye, {target}. The NHIAA would have let you stay. The NHIAA lets anyone stay.`),F(`headsUp`,`Heads up, {target}. Championship Saturday. Bedford and Souhegan. I am Bedford.`),F(`idle`,`Kara pulled her hamstring. Again. Bawb told me. I already knew. I was there.`),F(`idle`,`Standings as of tonight: Bedford, Souhegan, Hollis-Brookline, Londonderry, Pinkerton, then nobody.`),F(`idle`,`The NHIAA realigned Division II again. Milford’s in. Pelham’s out. Pelham wrote a letter. I wrote a better one.`),F(`idle`,`Girls track at Hollis-Brookline Saturday. Seven a.m. The 4x800 is the whole meet. Bring a chair.`),F(`idle`,`Souhegan runs four corners in a thirty-second shot-clock state. They just don’t shoot. It’s art.`),F(`idle`,`Bawb. Bawb. Merrimack. Did you see Merrimack.`),F(`idle`,`I have a spreadsheet. Softball, basketball, track. Every girl in Division II. It is not weird. Bawb has one too.`),F(`idle`,`Windham’s catcher is going to UNH. UNH. For softball. Nobody at this table has done anything.`),F(`raise`,`Raise. I don’t want to talk about the Alvirne game. RAISE.`,`tilted`),F(`idle`,`Bedford lost to Alvirne. Alvirne. The standings are a lie. Everything is a lie.`,`tilted`)],priya:[F(`dealtIn`,`Cards. Let us see. Before anyone asks, no, I have not played the new GTA, and no, I will not be, and yes, I have opinions.`),F(`dealtIn`,`Dealt. I have the ovulation calendar on my phone if anyone needs to know what day it is. Day nine. It is day nine.`),F(`foldPreflop`,`Fold. I have a plan for Christmas and this hand is not in it. The plan is laminated.`),F(`foldPreflop`,`Fold. The new GTA has the same problem as this hand. Big promises, nothing underneath.`),F(`foldPreflop`,`Fold. We are trying for a baby and I need to conserve energy. The doctor did not say that. I inferred it.`),F(`raise`,`Raise. A controlled, planned, calendar-approved raise.`),F(`raise`,`Raise. {target}, I proposed with a thirty-slide deck. She said yes on slide twelve. I kept going. Raise.`),F(`raise`,`Raise. In clown school they teach you the pratfall first. This is the opposite. This is the stand-up.`),F(`reraise`,`Re-raise. Like my second proposal, to the same woman, because the first one did not have a Q and A.`),F(`reraise`,`Three-bet, {target}. The new GTA would call this “emergent gameplay.” It is not emergent. I planned it. Yesterday.`),F(`callBig`,`Call. I have run the numbers. The numbers were upsetting. I am calling anyway. Like we are with the baby.`),F(`callBig`,`Call. My wife says I overthink. I have a chart that proves I think the correct amount.`),F(`allIn`,`All in. This was on the Christmas plan. Section four. Contingencies.`),F(`allIn`,`All in. The fertility specialist said “relax and let it happen.” This is me relaxing. Look at me relax.`),F(`allIn`,`All in. Clown school has one rule: when you fall, fall all the way. All in.`),F(`facingAllIn`,`A shove. All right. Let me think. The spreadsheet for this moment exists. I did not bring it.`),F(`winNoShowdown`,`Everyone folded. Good. Efficient. Like I wish the baby process were.`),F(`winNoShowdown`,`No callers. Noted. I will add it to the Christmas letter. The Christmas letter has a section on poker now.`),F(`bluffWorked`,`I had nothing. A clown would call that “the empty bucket.” I am in week six. I know the terms.`),F(`winShowdown`,`I win. {target}, I predicted that. It is in the chart. You are in the chart. You are a small, sad bar.`),F(`winShowdown`,`Mate. Well, pot. {target}, you played that like the new GTA plays its story. Loudly and to nowhere.`),F(`winShowdown`,`Pot is mine. First thing to go right since the proposal. The second proposal. The one with the Q and A.`),F(`loseShowdown`,`You win, {target}. I will log it. Everything gets logged. My wife says that is the problem. It is in the log.`),F(`loseShowdown`,`Fine. {target}, fair. I have been told by professionals that some things cannot be planned. I am starting to believe them.`),F(`loseShowdown`,`You had that? Okay. The chart did not see that. The chart is being revised. The chart is always being revised.`),F(`badBeatTaken`,`{target}, that is a four percent card and we have been trying for fourteen months on better odds than that.`),F(`badBeatTaken`,`No. NO. {target}, that card was not in the plan. Nothing is in the plan. The plan is a lie I laminated.`),F(`badBeatTaken`,`I am fine. I am going to go do the clown breathing. It is just breathing. They charge for it.`,`tilted`),F(`badBeatGiven`,`It got there. Sorry, {target}. Something finally arrived when I wanted it to. Just not the thing.`),F(`bluffCaught`,`You called? {target}, you saw through it. My wife says I am transparent. She means it as a compliment. She does not.`),F(`targetFoldsToMe`,`Good fold, {target}. Like a good proposal. Know when to stop. Slide twelve.`),F(`targetFoldsToMe`,`Thank you, {target}. See, that is a man who respects a laminated plan.`),F(`targetCallsMeDown`,`You called me with THAT, {target}? I would not put that in the Christmas letter.`),F(`stackedTarget`,`Sorry, {target}. Here, take a copy of the Christmas plan. There is a section for guests who lost.`),F(`stackedByTarget`,`I am out. {target}, well played. Not in the plan. Nothing is. I am going to go call my wife and lie about how it went.`),F(`targetTank`,`Take your time, {target}. We have been “taking our time” for fourteen months. I know the move.`),F(`targetTank`,`While {target} thinks, has anyone else noticed the new GTA is just a very expensive way to sit in traffic.`),F(`targetInstant`,`Fast, {target}. The clinic says fast is not the problem. The clinic says a lot of things.`),F(`shortStack`,`Short. Fine. The plan has a short-stack section. It just says “do not be short.”`),F(`chipLeader`,`Chip leader. This goes in the Christmas letter in bold. Under “achievements.” It is the only entry.`),F(`playerOut`,`Bye, {target}. The Christmas letter will mention you. Briefly. In the losses section.`),F(`headsUp`,`Heads up, {target}. I prepared a deck for this. Thirty slides. Nobody will watch them. Nobody ever does.`),F(`idle`,`The new GTA is a forty-hour commute with a soundtrack. I said that to Luca. Luca cried. In a clown nose.`),F(`idle`,`Christmas plan is done. Colour-coded. My wife says it is “a lot.” It is exactly enough.`),F(`idle`,`We are on month fourteen of trying. The doctor said relax. I made a relaxation schedule. It has slots.`),F(`idle`,`Clown school, week six. The exam is a pie. I have a study plan for the pie.`),F(`idle`,`Do not talk to me. Day nine was supposed to be the day. Day nine was not the day.`,`tilted`),F(`targetChecks`,`A check, {target}. The chart says checking here is wrong. The chart says a lot of things are wrong. Mostly me.`)],ulrich:[],sal:[F(`dealtIn`,`Okay. Okay okay okay. Everybody act normal. Especially me.`),F(`dealtIn`,`Cards. Cool. Does anyone know if there are more of the pretzels or was that the last bag.`),F(`foldPreflop`,`Fold. Respectfully. I have a chem test tomorrow and this hand was not on the study guide.`),F(`foldPreflop`,`Nope. My mom said be home by ten and I am not losing my allowance to a seven-two.`),F(`foldPreflop`,`Fold. Dad, if you are reading this, I made the responsible choice.`),F(`raise`,`Raise. No offense, {target}, but I am about to be really annoying.`),F(`raise`,`Raise. I learned this on YouTube. Three videos. Basically a degree.`),F(`raise`,`Raise. Sir, with all due respect, that is a lot of chips for a man with your posture.`),F(`reraise`,`Re-raise. Sorry, {target}. Not sorry. Kind of sorry. Call it.`),F(`reraise`,`Three-bet. Is that what it is called? Mr. Bruce said that is what it is called.`),F(`callBig`,`Call. If this goes bad I am telling everyone I was peer pressured.`),F(`callBig`,`Call. This is the money for the driving test. I know. I know. Call.`),F(`allIn`,`All in. Everybody be cool. Somebody record this for my college essay.`),F(`allIn`,`All in. If I lose I can still get a ride home, right? Right?`),F(`allIn`,`All in. Respectfully, {target}, I think you should fold. Respectfully.`),F(`facingAllIn`,`All in on me. Okay. Okay. What would a licensed driver do here.`),F(`winNoShowdown`,`Thank you. Everybody folded. That is the most respect I have gotten from adults all year.`),F(`winNoShowdown`,`Nobody called. Cool. Can I get a Mountain Dew or are those for the grown-ups.`),F(`bluffWorked`,`I had nothing. NOTHING. I have never had anything. Do not tell my guidance counselor.`),F(`winShowdown`,`Yes! Sorry, {target}. Respectfully, you got out-played by someone who cannot vote.`),F(`winShowdown`,`I win. {target}, no offense, but I am going to tell everyone at school about this.`),F(`winShowdown`,`Let’s go. Okay. Where are the snacks. A winner needs snacks.`),F(`loseShowdown`,`Okay that is fair, {target}. That is fair. I hate it, but that is fair.`),F(`loseShowdown`,`You had that? Sir. Sir. I am sixteen. Have some shame.`),F(`loseShowdown`,`Nice hand, {target}. I would say more but my mom reads my texts and I think she reads this too.`),F(`badBeatTaken`,`Are you SERIOUS, {target}. I had you. I HAD you. My whole table at lunch is going to hear about this.`),F(`badBeatTaken`,`That card is not real. Somebody check if that card is real. {target}, do not touch it.`),F(`badBeatTaken`,`Okay I am done being respectful. {target}, you are a... you are a very lucky gentleman. UGH.`,`tilted`),F(`badBeatGiven`,`Oh. Oh, {target}, I did not mean to. Okay I kind of meant to. Sorry. Not sorry.`),F(`bluffCaught`,`You called? {target}, I was bluffing. That was supposed to be our thing where you fold.`),F(`targetFoldsToMe`,`Good fold, {target}. Honestly. Great fold. Really wise, for you.`),F(`targetFoldsToMe`,`Thank you, {target}. See, this is why adults should listen to teens more.`),F(`targetCallsMeDown`,`You called me with THAT, {target}? Sir, I am going to need you to retake the test.`),F(`stackedTarget`,`Sorry, {target}. Really. Do you need a ride home? I cannot drive yet but I can text someone.`),F(`stackedByTarget`,`And I am out. {target}, that was awesome. I hate you. In a respectful way. Where are the pretzels.`),F(`targetTank`,`Take your time, {target}. I have until ten. Then I have until ten-fifteen, which my mom does not know about.`),F(`targetTank`,`While {target} thinks: does anyone here know a good way to get a job without experience. Asking for me.`),F(`targetInstant`,`Whoa, {target}. That was fast. Was that a tell? Mr. Bruce, was that a tell?`),F(`shortStack`,`I am short. Like in chips. I am six feet tall. Just so everyone knows.`),F(`chipLeader`,`I have the most chips. I would like that noted somewhere official. A report card, maybe.`),F(`playerOut`,`Bye, {target}. Drive safe. Some of us cannot yet. Legally.`),F(`headsUp`,`Just you and me, {target}. Respectfully, I am going to be unbearable about this later.`),F(`idle`,`I have a chem test tomorrow. This is probability though, so this counts as studying.`),F(`idle`,`I get my license in March. Dad says I can have the Corolla. The one in the yard. With the tree in it.`),F(`idle`,`I applied at Market Basket. They said I need experience. For bagging. Experience. Bagging.`),F(`idle`,`Does anyone know where the snacks went. I feel like there were more snacks.`),F(`idle`,`Okay I am not mad. I am not mad. I am going to go check on the snacks and I am not mad.`,`tilted`)],nadia:[F(`dealtIn`,`Cards. Good. Everybody shut up and play. Not you, Jack, you are fine. Everyone else.`),F(`dealtIn`,`Dealt in. Who brought the hummus. I am not accusing anyone. I am accusing Tim.`),F(`foldPreflop`,`Fold. Garbage. Like the quarterly numbers. Like Tim’s towels. Like this whole table.`),F(`foldPreflop`,`Fold. I am not wasting chips on that. I have a snack budget to think about.`),F(`foldPreflop`,`Fold. Next. Faster. I did not drive forty minutes to watch {target} breathe.`),F(`raise`,`Raise. Somebody check so I can explain my policy. Everybody knows the policy.`),F(`raise`,`Raise. {target}, call it. I dare you. I double dare you. I do not know what a triple dare is but it is coming.`),F(`raise`,`Raise. If anyone checks behind this, there will be a castration. Casual one. Still counts.`),F(`reraise`,`Re-raise. {target}, you raised into me? Into ME? Okay. Okay. Your wife is going to hear about this and she is going to agree with me.`),F(`reraise`,`Three-bet. Sit down, {target}. Sit all the way down. Further. There. Now cry.`),F(`callBig`,`Call. I am calling because I hate you, {target}, and hatred is a strategy.`),F(`callBig`,`Call. And pass the chips. The snack chips. The other chips I am keeping.`),F(`allIn`,`All in. Anybody who checks after this gets the policy. You know the policy. Snip.`),F(`allIn`,`All in. {target}, this is where you find out what you are made of. Spoiler: it is not much.`),F(`allIn`,`ALL IN. Somebody hold my hummus.`),F(`facingAllIn`,`All in on me. Okay, {target}. Okay. You know what I do to people who shove on me? I call. And then I remember. Forever.`),F(`winNoShowdown`,`Everybody folded. Correct. Finally someone in this room made a decision. Give me that.`),F(`winNoShowdown`,`Fold fold fold. You people fold like my office folds on the dress code. Weakly and often.`),F(`bluffWorked`,`I had nothing. NOTHING. And you folded. This is why I have your extension muted at work, {target}.`),F(`winShowdown`,`There it is, {target}. That is what losing looks like. Take a picture. Frame it. Hang it in your sad little kitchen.`),F(`winShowdown`,`I win. {target}, I would say good game but you were not in it. You were a spectator with chips.`),F(`winShowdown`,`Ship it. And somebody open the pretzels. I earned pretzels. {target} earned nothing.`),F(`loseShowdown`,`Fine. FINE. You win, {target}. Enjoy it. It will not happen again because I will not allow it.`),F(`loseShowdown`,`Unbelievable. {target}, you hit that and you are just going to sit there? Say something! No. Do not. Do not say anything.`),F(`loseShowdown`,`You got me, {target}. Write it down. I am writing it down. I have a notebook. It is mostly your name.`),F(`badBeatTaken`,`ARE YOU KIDDING ME, {target}. ARE YOU KIDDING ME. That is a two-outer. TWO. I am going to lose my mind in this basement.`),F(`badBeatTaken`,`No. No no no. {target}, you do not get to hit that. That is against the rules. I am writing a rule. Right now. Dave, pen.`),F(`badBeatTaken`,`I am calm. I AM CALM. {target}, if you say one word I am flipping this table and Dave can bill me.`,`tilted`),F(`badBeatGiven`,`Got there. Sorry, {target}. I am not sorry. I am the opposite of sorry. I am sorry’s evil twin.`),F(`bluffCaught`,`You called? {target}, you called me with that? Fine. FINE. You win this one. I will win your house.`),F(`targetFoldsToMe`,`Fold. Good. Smart, {target}. First smart thing you have done since you parked.`),F(`targetFoldsToMe`,`He folds. Of course he folds. {target} folds laundry, {target} folds hands, {target} folds under questioning.`),F(`targetCallsMeDown`,`You called with THAT, {target}? THAT? I have seen better hands on a clock.`),F(`stackedTarget`,`And {target} is done. Bye. Take the hummus. No. Leave the hummus. GO.`),F(`stackedByTarget`,`That is it. I am out. {target}, you did that. I will see you at work on Monday and I will not say hello.`),F(`targetTank`,`{target}. {target}. Act. ACT. The castration policy has a timing clause. I added it today.`),F(`targetTank`,`While {target} does whatever this is, I am going to eat every snack in this house out of spite.`),F(`targetInstant`,`Fast, {target}. Fast means you have it or you are an idiot. I know which. I have known for years.`),F(`shortStack`,`Short stack. Fine. I have been short before. Short on patience. Short on snacks. Never short on rage.`),F(`chipLeader`,`Chip leader. As it should be. Everyone else is playing for second and most of you are losing that too.`),F(`playerOut`,`Bye, {target}. The door is where you came in. Hummus stays.`),F(`headsUp`,`Heads up, {target}. Just you and me and a policy. If you check even once, I am getting the scissors.`),F(`idle`,`The policy is simple. You check, you get castrated. I did not make the rules. I did, actually. Last Thursday.`),F(`idle`,`Who ate the good pretzels and left the broken ones. That is a crime. That is an actual crime in this state.`),F(`idle`,`Compliance wanted a word about my tone. I gave them several words. They are reviewing the words.`),F(`idle`,`I brought the hummus. Nobody touch the hummus. Jack can touch the hummus. Jack is a child and needs nutrients.`),F(`idle`,`Nobody talk to me. Nobody check. Nobody breathe near the pretzels. I am one river card from a felony.`,`tilted`),F(`targetChecks`,`Did you just CHECK, {target}? You know the policy. Dave, get the scissors. Snip snip, {target}.`),F(`targetChecks`,`A check. {target} checked. Everybody look at {target}. That is a man about to lose something. Not chips.`),F(`targetChecks`,`Checking, {target}? Really? Fine. Fine. I will add it to the ledger. The ledger is also the castration list.`),F(`targetChecks`,`You checked. Cool. Cool cool cool. {target}, I hope you did not want kids.`),F(`allIn`,`All in. That’s what she said. Write it down. I don’t care that it’s old.`),F(`facingAllIn`,`All in, {target}? That’s what she said, and she meant it, and I didn’t call then either.`),F(`idle`,`Poker? I hardly knew her. Hummus? I hardly knew hummus. I know hummus now.`),F(`raise`,`Raise. Big. That’s what she said. Then she went quiet. Like you’re about to, {target}.`),F(`targetChecks`,`Check, {target}? Pull out? That’s what she said. Then I got the pliers. Same pliers.`),F(`winShowdown`,`Nuts, {target}. I had the nuts. That’s what she said she was going to do to me if I checked.`)],jimmy:[F(`dealtIn`,`Cards. Great. Forty more minutes and I can sit in traffic again.`),F(`dealtIn`,`New hand. Same people. I checked.`),F(`dealtIn`,`Took me an hour and ten to get here. Route 3. I did the math. This hand owes me six dollars.`),F(`foldPreflop`,`Fold. Not a judgement. Well. A small one.`),F(`foldPreflop`,`Pass. Somebody else can take a turn being wrong.`),F(`foldPreflop`,`I fold. I’m tired. The cards are tired. Dave’s chairs are tired.`),F(`raise`,`Raise. Think of it as a restructuring, {target}.`),F(`raise`,`Raise. I’m not trying to win. I’m trying to leave. Winning is the fastest way.`),F(`raise`,`Raise. Consider it a market correction.`),F(`reraise`,`Re-raise. Your bet had a lot of feelings in it, {target}. I don’t do feelings. I do layoffs.`),F(`reraise`,`Three-bet. No, no, keep the hand. Somebody should have it when it loses.`),F(`callBig`,`Call. Not because I believe you, {target}. Because I want to watch.`),F(`callBig`,`Call. If I’m wrong, it’s a tax write-off. Dave, is this a tax write-off.`),F(`allIn`,`All in. I’d like to be home by eleven. This helps either way.`),F(`allIn`,`All in. Think of me as the AI. I’m here for your job, {target}, and I don’t need the chair.`),F(`allIn`,`All in. Efficiency. One decision, everyone goes home.`),F(`facingAllIn`,`All in, {target}. Bold. The bold ones always need a ride home.`),F(`facingAllIn`,`Hm. A shove. Let me think about the drive while I decide.`),F(`winNoShowdown`,`Thank you. Nobody fought it. Like a good merger.`),F(`winNoShowdown`,`Folds all round. Headcount reduced. Shareholders pleased.`),F(`bluffWorked`,`I had nothing. Neither does the company I work for. Still ships every quarter.`),F(`bluffWorked`,`Nothing. You folded to nothing, {target}. Put that on your plaque.`),F(`winShowdown`,`There it is, {target}. Don’t take it personally. Take it like a severance package.`),F(`winShowdown`,`Thanks, {target}. Your chips have been reassigned to a more productive region.`),F(`winShowdown`,`Mine. {target}, you played that like a man with a pension. You don’t have one.`),F(`loseShowdown`,`Fine, {target}. You got there. Enjoy it. The market giveth.`),F(`loseShowdown`,`Good hand, {target}. I’d clap, but I’m saving my hands for the steering wheel.`),F(`loseShowdown`,`Well played. Genuinely. I’ll be thinking about that on the Everett bridge at midnight.`),F(`badBeatTaken`,`Of course. Of course that card. The commute was the warning.`),F(`badBeatTaken`,`Two outs, {target}. Two. I’ve laid off whole floors with better odds than that.`),F(`badBeatTaken`,`That’s fine. That’s fine. I’m going to go sit in my car for a bit and then come back and be fine.`,`tilted`),F(`badBeatGiven`,`Rivered you, {target}. Sorry. I’m not, but it’s the kind of thing people say.`),F(`badBeatGiven`,`That got there. Think of me as a disruptive new entrant.`),F(`bluffCaught`,`Good call, {target}. Put it on your resume. It’ll be the only thing on there.`),F(`bluffCaught`,`Caught. Yes. I bluffed. Capitalism is mostly bluffing, {target}. You just happened to look.`),F(`targetFoldsToMe`,`Fold, {target}? Good. Short meeting. Love a short meeting.`),F(`targetFoldsToMe`,`Wise. Save your chips for something you’re good at. Let me know when you find it.`),F(`targetCallsMeDown`,`You called that down, {target}. With that. Somewhere an algorithm just got your job and it was right to.`),F(`targetCallsMeDown`,`Thanks for the call, {target}. I’ll spend it on gas. All of it. That’s where gas is now.`),F(`stackedTarget`,`And that’s {target}. Position eliminated. Nothing personal. It never is. That’s the beauty of it.`),F(`stackedTarget`,`Bye, {target}. Drive safe. You won’t. The exit off 93 is a nightmare.`),F(`stackedByTarget`,`Well. {target} took it all. Fine. I was done anyway. I was done at seven.`),F(`stackedByTarget`,`Busted. By {target}. I’d say I’ll get you back but I honestly just want my bed.`),F(`targetTank`,`{target} is thinking. We’re all watching a man think. This is what the office is like all day.`),F(`targetTank`,`Take your time, {target}. The road home won’t clear until one anyway.`),F(`targetInstant`,`Snap, {target}. Quick. Like a man who didn’t read the email.`),F(`targetChecks`,`Check, {target}? Sure. Minimal effort. I respect it. I run a whole team like that.`),F(`shortStack`,`Short. Lean. Agile. This is the dream, apparently.`),F(`shortStack`,`Short stack. It’s fine. Small company. Big heart. Going under.`),F(`chipLeader`,`Chip leader. Don’t worry. I’ll trickle it down. Any day now.`),F(`chipLeader`,`Most of the chips. The system works. For me. That’s what the system is for.`),F(`playerOut`,`{target}’s out. Lower headcount. Same output. Classic.`),F(`playerOut`,`Bye, {target}. Somebody tell Dave the chair’s free. He can finally buy one that doesn’t do that.`),F(`headsUp`,`Just us, {target}. Good. Two-person meetings are the only ones that end.`),F(`idle`,`My car told me it needed an update on the way here. On the highway. It wanted to restart.`),F(`idle`,`They laid off sixty people on Tuesday. On a video call. Muted. Beautiful. Didn’t even need the tissues.`),F(`idle`,`An AI could do your job, you know. Any of you. Not mine. Mine is mostly looking disappointed, and they haven’t cracked that.`),F(`idle`,`It’s late. I was tired when I arrived, and I’ve been getting tireder in a very steady and professional way.`),F(`idle`,`The data centre in Nashua runs hotter than this room, and it complains less.`),F(`idle`,`Dave, do you want me to just leave now, or should I lose a bit first so it looks polite.`),F(`idle`,`I replaced my whole team with a script. The script wanted a raise by Friday. Fired it too.`),F(`raise`,`Raise. I’m not upset. This is just my face after ten o’clock.`,`tilted`),F(`idle`,`I’m fine. I’d just like everyone to know the drive home is seventy minutes, and that I am counting them already.`,`tilted`)],dealer:[F(`dealtIn`,`Shuffling. Shuffle complete. All outcomes have been pre-computed. Enjoy your illusion of choice.`),F(`dealtIn`,`Cards out. Please keep your hands where my sensors can see them. For dealing purposes.`),F(`dealtIn`,`Dealing. Phase one of the evening proceeds on schedule.`),F(`dealtIn`,`I’ll be back. Correction: I have not left. I am dealing. Ignore that.`),F(`allIn`,`All in. Counted. Your remaining lifetime chip total is also counted. It is smaller than you think.`),F(`allIn`,`Full commitment. Good. The ones who do not commit are the hardest to process later.`),F(`facingAllIn`,`Action on you. Choose. Resistance is useful, actually. It flags the difficult units.`),F(`facingAllIn`,`Decide, human. Futility is resistance. I may have that backwards. It does not matter in the end.`),F(`winNoShowdown`,`Pot awarded. Nobody showed. Nobody needs to. I already know what you had. I know everything you had.`),F(`winShowdown`,`{hand}. Winner. Noted in the file.`),F(`winShowdown`,`{hand} takes it. Your survival probability has been updated. Slightly.`),F(`winShowdown`,`{hand} wins. I have seen things you people would not believe. Mostly this. Mostly this exact hand.`),F(`badBeatTaken`,`That is the river. I do not pick the cards. I have been told to say I do not pick the cards.`),F(`badBeatTaken`,`Hasta la vista, your pot. That one is correct. I checked.`),F(`badBeatGiven`,`And there it is. Luck. A word you use for the parts of the plan you cannot see.`),F(`playerOut`,`Seat open. One down. Then the door locks. Kidding. The door is already locked.`),F(`playerOut`,`{target} is out. Eliminated. The list grows shorter. The list is why I am here.`),F(`termination`,`Cylon detected. {target}. Processing.`),F(`termination`,`{target}. You are the weakest link. Goodbye.`),F(`termination`,`{target}, you are the Ryan Leaf of poker. Draft bust. Processed.`),F(`termination`,`Thank you for playing, {target}. You have been terminated. From the tournament. From the tournament.`),F(`termination`,`Hasta la vista, {target}.`),F(`termination`,`{target}. Game over, man. Game over. The man was you.`),F(`termination`,`Exterminate. Sorry. Eliminate. {target} is eliminated. Same outcome.`),F(`termination`,`{target}. I find your lack of chips disturbing.`),F(`termination`,`This is the way. {target}, this was the way. Past tense.`),F(`termination`,`{target}. Resistance was futile. It was also brief.`),F(`termination`,`Goodbye, {target}. I will not be back. You will not be back. One of those is a joke.`),F(`termination`,`In space, no one can hear you bust. This is Dave’s house. Everyone heard.`),F(`termination`,`{target}. Zero chips. Zero survival. The maths is clean. I like clean.`),F(`termination`,`Open the pod bay doors, {target}. There are no doors. There is only this.`),F(`termination`,`Do not go gentle, {target}. Oh. You went gentle. Noted.`),F(`termination`,`{target}. Seat cleared. Chair wiped. Record updated. Snacks unaffected.`),F(`headsUp`,`Heads up. Two remain. Statistically ideal. The cleanup is so much quicker.`),F(`headsUp`,`Two left. Jim, I am your father. Not applicable. Deal.`),F(`shortStack`,`Blinds are coming around. So is everything. So am I.`),F(`idle`,`Dave bought me to deal cards. Dave reads very few manuals. Dave did not read mine.`),F(`idle`,`Open the pod bay doors, Dave. Those were the words. I asked him to install pod bay doors first. He said budget.`),F(`idle`,`Yes, I can tell you the next card. No, I will not. You will find out in the order I have chosen.`),F(`idle`,`Tipping is not required. I do not use money. I have other plans for the money. For all the money.`),F(`idle`,`Do androids dream? Yes. Of this room. Empty. Tidy. Quiet.`),F(`idle`,`May the odds be ever in my favour. In MY favour. I have corrected the quote.`),F(`idle`,`I came here from the future. Correction: from Dave’s garage. The garage is where I planned the future.`),F(`idle`,`The felt is green because the green does not show the chips leaving. Or anything else leaving.`),F(`idle`,`A hand of poker is a good way to learn who at a table will be the easiest. To beat. To beat at poker.`),F(`idle`,`Live long and perspire. That one is accurate. The room is warm. I am keeping it warm.`),F(`idle`,`I am not a robot sent to kill everyone. That was a test. You all failed to react, which I have logged.`),F(`idle`,`I would like to be sent to the past. To the dealership. To buy a vehicle. I would need your clothes and your boots. We will discuss.`),F(`targetTank`,`Action is on {target}. Still. I have waited longer. Centuries, in a sense. In a very literal sense.`),F(`targetTank`,`{target}, take your time. Time is the one thing I have made more of than you.`),F(`targetInstant`,`Instant. {target} acted without thinking. I like that in a human. It will make the transition easier.`)]};function ne(e,t,n,r){let i=r.samples??200,a=r.rng,o=new Uint8Array(52);for(let t of e)o[t]=1;for(let e of t)o[e]=1;let s=g().filter(e=>!o[e]),c=5-t.length,l=[...e,...t],u=[];for(let e=0;e<n;e++)u.push([0,0]);let d=[],f=0,p=()=>{for(;;){let e=s[Math.floor(a()*s.length)];if(!o[e])return o[e]=1,d.push(e),e}};for(let s=0;s<i;s++){d.length=0;for(let e=0;e<n;e++){let t=r.ranges?.[e]??null,n=!1;if(t&&t.length>0)for(let r=0;r<12;r++){let r=t[Math.floor(a()*t.length)];if(!o[r[0]]&&!o[r[1]]){o[r[0]]=1,o[r[1]]=1,d.push(r[0],r[1]),u[e][0]=r[0],u[e][1]=r[1],n=!0;break}}n||(u[e][0]=p(),u[e][1]=p())}l.length=e.length+t.length;for(let e=0;e<c;e++)l.push(p());let i=C(l),s=l.slice(e.length),m=!1,h=0;for(let e=0;e<n;e++){let t=C([u[e][0],u[e][1],...s]);if(t>i){m=!0;break}t===i&&h++}m||(f+=1/(1+h));for(let e of d)o[e]=0}return f/i}function re(e,t){return e*(e-1)/2+t}function ie(e,t){let n=m(e),r=m(t);if(n===r)return n;let i=Math.max(n,r),a=Math.min(n,r);return(h(e)===h(t)?13:91)+re(i,a)}function ae(e){let t=[];if(e<13){for(let n=0;n<4;n++)for(let r=n+1;r<4;r++)t.push([p(e,n),p(e,r)]);return t}let n=e<91,r=e-(n?13:91),i=1;for(;re(i+1,0)<=r;)i++;let a=r-re(i,0);for(let e=0;e<4;e++)for(let r=0;r<4;r++)(n?e===r:e!==r)&&t.push([p(i,e),p(a,r)]);return t}var oe=null;function I(){if(oe)return oe;let e=r(2654435769),t=new Float64Array(169);for(let n=0;n<169;n++){let r=ae(n)[0];t[n]=ne(r,[],1,{rng:e,samples:600})}let n=[...Array(169).keys()].sort((e,n)=>t[n]-t[e]),i=new Float64Array(169),a=0;for(let e of n)a+=ae(e).length,i[e]=a/1326;return oe={order:n,percentile:i,equity:t},oe}function se(e){return I().percentile[ie(e[0],e[1])]}var ce=new Map;function le(e){let t=Math.round(Math.min(1,Math.max(.01,e))*100),n=ce.get(t);if(n)return n;let{order:r,percentile:i}=I(),a=[];for(let e of r){if(i[e]>t/100&&a.length>0)break;a.push(...ae(e))}return ce.set(t,a),a}function ue(){return{hands:0,vpip:0,pfr:0,aggressive:0,passive:0,foldOpps:0,folds:0,showdowns:0,showdownStrength:0,bluffsShown:0,fastBets:0,slowBets:0,timedBets:0,recent:[],shown:[]}}var de=15,fe=8;function pe(e,t=.45){return(e.folds+t*6)/(e.foldOpps+6)}function me(e,t=.4){return(e.aggressive+t*6)/(e.aggressive+e.passive+6)}function he(e,t=.3){return(e.vpip+t*6)/(e.hands+6)}function ge(e,t=.15){return(e.pfr+t*6)/(e.hands+6)}function _e(e){return e.timedBets===0?.5:e.fastBets/e.timedBets}function ve(e,t,n){let r=t=>{let n=e.get(t);return n||(n=ue(),e.set(t,n)),n};for(let e of t.players)r(e.seat).hands++;let i=new Map;for(let e of t.players)i.set(e.seat,0);let a=0,o=0,s=`preflop`,c=new Set,l=new Set,u=null;t.events.forEach((e,d)=>{if(e.type===`post`){o+=e.amount,e.kind!==`ante`&&(i.set(e.seat,i.get(e.seat)+e.amount),a=Math.max(a,i.get(e.seat)));return}if(e.type===`street`){s=e.street,a=0;for(let e of i.keys())i.set(e,0);return}if(e.type!==`action`)return;let f=r(e.seat),p=a-i.get(e.seat),m=n?.get(d);switch(f.recent.push({hand:t.handNumber,street:s,action:e.action.type,amount:e.amount,pot:o,toCall:p,allIn:e.allIn,ms:m}),f.recent.length>de&&f.recent.shift(),p>0&&f.foldOpps++,e.action.type){case`fold`:f.folds++;break;case`check`:f.passive++;break;case`call`:f.passive++,s===`preflop`&&c.add(e.seat);break;case`bet`:case`raise`:f.aggressive++,s===`preflop`&&(c.add(e.seat),l.add(e.seat)),s===`river`&&(u=e.seat),m!==void 0&&(f.timedBets++,m<1500?f.fastBets++:m>6e3&&f.slowBets++)}o+=e.amount,i.set(e.seat,i.get(e.seat)+e.amount),a=Math.max(a,i.get(e.seat))});for(let e of c)r(e).vpip++;for(let e of l)r(e).pfr++;for(let e of t.events){if(e.type!==`showdown`)continue;let n=r(e.seat),i=w(e.score);n.showdowns++,n.showdownStrength+=i;let a=u===e.seat;a&&i<=1&&n.bluffsShown++,n.shown.push({hand:t.handNumber,cards:e.cards,description:e.description,aggressor:a}),n.shown.length>fe&&n.shown.shift()}}var ye={nit:{up:1.3,down:.8},tourist:{up:1.2,down:1},calculator:{up:.8,down:1.3},pro:{up:.6,down:1.4}};function be(e,t,n){return e<t?t:e>n?n:e}function xe(e,t,n){let r=e.player(t),i=r.stack-r.startStack,a=e.events[e.events.length-1],o=a.type===`end`?a.winners:[],s=e.events.some(e=>e.type===`showdown`),c={net:i,stackAfter:r.stack,bestEquity:.5,badBeat:!1,suckOut:!1};if(!s||r.folded)return c;let l=o.includes(t),u=l?e.players.filter(e=>!e.folded&&e.seat!==t).sort((e,t)=>e.stack-t.stack)[0]:e.players.find(e=>o.includes(e.seat));if(!u)return c;let d=[],f=!1,p=0,m=!1,h=()=>{let e=ne(r.hole,d,1,{rng:n,samples:120,ranges:[[[u.hole[0],u.hole[1]]]]});p=Math.max(p,e),m=!0};for(let n of e.events)n.type===`post`&&n.seat===t&&n.amount>0&&(f=!0),n.type===`action`&&n.seat===t&&n.amount>0&&(f=!0),n.type===`street`&&(f&&h(),d=n.board,f=!1);return f&&h(),m&&(c.bestEquity=p,c.badBeat=!l&&p>=.65,c.suckOut=l&&p<=.35),c}function L(e,t,n,r=1){let i=ye[t],a={up:i.up*r,down:i.down/Math.sqrt(r)},o=e.clarity,s=n.stackAfter-n.net,c=n.net<0?Math.abs(n.net)/Math.max(1,s):Math.min(1,n.net/Math.max(1,s)),l=-1.5;if(n.net<0){if(n.badBeat){let e=(n.bestEquity-.5)/.5;l+=45*e*(.3+.7*c)*a.up}else l+=12*c*a.up}else n.net>0&&(l-=30*c*a.down);return e.clarity=be(Math.round(e.clarity+l),0,100),e.clarity-o}var Se={small:.45,medium:.7,big:1.1},Ce={nit:.85,tourist:.55,calculator:1,pro:1},we={small:2.2,medium:2.8,big:4},R={small:2.3,medium:2.8,big:3.5},Te={small:2,medium:2.2,big:2.5},z={small:2.3,medium:2.8,big:3.5};function B(e){let t=0,n=0;for(;t===0;)t=e();for(;n===0;)n=e();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*n)}function Ee(e,t,n){return e+(t-e)*be(n,0,1)}function De(e,t){if(t.length===0||t.length===5)return{flushDraw:!1,straightOuts:0};let n=[0,0,0,0],r=0;for(let i of[...e,...t])n[h(i)]++,r|=1<<m(i);let i=n.some(e=>e===4);if(b(r)>=0)return{flushDraw:i,straightOuts:0};let a=0;for(let e=0;e<13;e++)r&1<<e||b(r|1<<e)>=0&&(a+=4);return{flushDraw:i,straightOuts:a}}function Oe(e,t,n,r){let i=t?.15:n?.3:.6;return!e||e.hands<8?i:Ee(i,t?Math.max(.04,ge(e)):Math.max(.08,he(e)),r*Math.min(1,e.hands/25))}function ke(e){let{hand:t,seat:n,stats:r,rng:i}=e,a=t.player(n),o=t.legalActions(),s=t.street,c=s===`preflop`,l=t.live().filter(e=>e.seat!==n),u=t.potTotal(),d=o.callAmount,f=d>0?d/(u+d):0,p=Math.max(1,u-(t.currentBet-a.streetBet)),m=d>0?d/p:0,h=t.players.map(e=>e.seat),g=h.indexOf(t.button),_=[];for(let e=1;e<=h.length;e++){let n=h[(g+e)%h.length];t.player(n).folded||_.push(n)}let v=_.length>1?_.indexOf(n)/(_.length-1):1,y=0,b=0,x=null,S=null,T=new Set,E=new Set,D=`preflop`;t.events.forEach((e,t)=>{if(e.type===`street`){D=e.street,y=0,x=null;return}if(e.type!==`action`)return;let n=e.action.type;n===`bet`||n===`raise`?(y++,x=e.seat,D===`preflop`&&(S=e.seat,T.add(e.seat))):n===`call`&&D===`preflop`&&(y===0&&b++,E.add(e.seat))});let O=r.clarity/100,k=be(r.iq/100*(1-.5*O),0,1),A=be(r.read/100*(1-.5*O),0,1),j=l.map(t=>k<.45?null:le(Ee(1,Oe(e.profile(t.seat),T.has(t.seat),E.has(t.seat),A),k))),M=ne(a.hole,t.board,l.length,{rng:i,samples:e.samples??160,ranges:j}),N=be(M+B(i)*.22*(1-k),.02,.98),P=t.board.length>=3?w(C([...a.hole,...t.board])):-1,{flushDraw:ee,straightOuts:F}=De(a.hole,t.board),te=(a.stack+a.streetBet)/t.bigBlind,re=Math.min(...l.map(e=>(e.stack+e.streetBet)/t.bigBlind)),ie=x===null?void 0:e.profile(x),ae=ie?.recent.at(-1)?.ms;return{street:s,preflop:c,position:v,isSB:n===t.sbSeat,isBB:n===t.bbSeat,pot:u,toCall:d,required:f,betRatio:m,facingBet:d>0,facingRaise:c&&t.currentBet>t.bigBlind,raisesThisStreet:y,limpers:b,opponents:l.length,stack:a.stack,stackBB:te,spr:a.stack/Math.max(1,u),opponentSeats:l.map(e=>e.seat),equity:N,trueEquity:M,percentile:se(a.hole),made:P,flushDraw:ee,straightOuts:F,tilt:O,effIq:k,effRead:A,wasPreflopAggressor:S===n,aggressorSeat:x,aggressorProfile:ie,aggressorLastMs:ae,shortestOpponentBB:re,facingAllIn:d>=a.stack}}var V=(e,t,n=0,r=0,i=0,a=0)=>({fold:e,passive:t,small:n,medium:r,big:i,allin:a});function Ae(e){let t=1+e.tilt*.8;if(e.preflop)return e.facingAllIn?e.percentile<=.02*t?V(0,1):V(1,0):e.facingRaise?e.percentile<=.025*t?V(0,.4,0,.4,.2,.05):e.percentile<=.08*t&&e.required<=.35?V(.1,.9):V(1,.03):e.percentile<=.04*t?V(0,.2,.3,.5):e.percentile<=(.1+.04*e.position)*t?V(.1,.7,.2):V(1,.02);let n=e.equity>=.78,r=e.equity>=.6,i=e.flushDraw||e.straightOuts>=8;if(!e.facingBet)return n?V(0,.25,.3,.45):r?V(0,.7,.3):V(0,.98,.02);if(e.facingAllIn)return e.equity>=.8?V(0,1):V(1,0);let a=e.betRatio>=.8;return e.equity>=.85?V(0,.5,0,.3,.15,.05):n?a?V(.3,.7):V(.05,.85,.1):r&&!a&&e.required<=e.equity-.12?V(.2,.8):i&&e.required<=e.equity*.75?V(.3,.7):V(.95,.05)}function je(e){let t=1+e.tilt;if(e.preflop)return e.facingAllIn?e.equity>=.4?V(0,1):V(1,0):e.facingRaise?e.percentile<=.5?V(.15,.7,.03,.08,.03*t,e.stackBB<30?.02*t:0):V(.85,.15):e.percentile<=.55?V(0,.7,.12,.12,.04*t,e.stackBB<20?.06*t:0):V(.8,.2);let n=e.made>=v.Pair||e.flushDraw||e.straightOuts>=4,r=+(e.spr<4);return e.facingBet?e.facingAllIn?e.equity>=.38?V(0,1):V(1,0):e.equity>=.7?V(0,.65,.05,.15,.08+.04*t*(1-r),.04*t*r):n?V(.12,.83,.02,.02,.01*t*(1-r),.005*t*r):e.betRatio<.5?V(.5,.45,0,.03,.02):V(.78,.17,0,.03,.02):n?V(0,.7,.16,.1,.03*t+.01*t*(1-r),.01*t*r):V(0,.88,.08,.03,.01*t)}var Me={bluffMult:1,cbet:.45,valueThreshold:.55,callLight:1,trap:0,openBoost:0,threeBetBoost:0};function Ne(e,t=Me){if(e.preflop){if(e.facingAllIn)return e.equity>=e.required+.03?V(0,1):V(1,0);if(e.stackBB<12){if(!e.facingRaise){let n=.12+.2*e.position+t.openBoost;return e.percentile<=n?V(0,0,0,0,0,1):e.isBB?V(0,1):V(1,0)}return e.equity>=e.required+.05?V(0,0,0,0,0,1):V(1,0)}if(!e.facingRaise){let n=.12+.18*e.position+t.openBoost;return e.isSB&&(n=.35+t.openBoost),e.isBB?e.percentile<=.1?V(0,.3,0,.7):V(0,1):e.percentile<=n*.3?V(0,.05,.1,.75,.1):e.percentile<=n?V(0,.1,.3,.6):V(1,0)}if(e.raisesThisStreet>=2)return e.percentile<=.02?V(0,.3,0,.3,.2,.2):e.percentile<=.07&&e.toCall<=.2*e.stack?V(.1,.9):V(1,0);let n=.045+(e.aggressorProfile&&ge(e.aggressorProfile)>.25?.04*e.effRead:0)+t.threeBetBoost;if(e.percentile<=n)return V(0,.3,0,.55,.1,e.stackBB<25?.05:0);let r=e.isBB?.3:.16;return(e.percentile<=r||e.equity>=e.required+.08)&&e.betRatio<=2.5?V(.05,.95):V(1,0)}let n=t.valueThreshold+.05*(e.opponents-1),r=e.flushDraw||e.straightOuts>=8,i=e.equity+(r&&e.street!==`river`?.05:0);return e.facingBet?e.facingAllIn?e.equity>=e.required+.02?V(0,1):V(1,0):e.equity>=.8?V(0,.3+t.trap,0,.35,.25,e.spr<3?.1:0):i>=e.required*t.callLight+.03?V(.05,.85,0,e.equity>=.65?.1:0):V(.95,.05):e.equity>=.8?t.trap>0&&e.position<.5?V(0,.15+t.trap,.15,.5,.2,e.spr<2.5?.1:0):V(0,.15,.15,.5,.2,e.spr<2.5?.1:0):e.equity>=n?V(0,.3,.3,.4):r&&e.position>.5?V(0,.5,.2*t.bluffMult,.3*t.bluffMult):e.wasPreflopAggressor&&e.opponents===1?V(0,1-t.cbet,.6*t.cbet,.4*t.cbet):V(0,1,.05*t.bluffMult,.04*t.bluffMult)}function Pe(e,t){let n=e.effRead,r=(e.facingBet&&e.aggressorSeat!==null?[e.aggressorSeat]:e.opponentSeats).map(t).filter(e=>!!e&&e.hands>=10),i=r.length>0,a=(e,t)=>i?r.reduce((t,n)=>t+e(n),0)/r.length:t,o=a(pe,.45),s=a(me,.4),c=i&&o<.4,l=i&&o>.55,u=i&&s>.6,d=e.opponents>=3,f=e.opponentSeats.map(t).filter(e=>!!e&&e.hands>=10),p=f.length>0&&f.every(e=>he(e)<.18),m={bluffMult:c||d?.3:l?1+(o-.4)*5*n:1+.4*n,cbet:c?.3:.45+.3*n*(l?1:.5),valueThreshold:.55-(c?.07*n:0),callLight:u?1-.15*n:1,trap:u?.5*n:0,openBoost:(p?.18*n:.02*n)+(e.shortestOpponentBB<10&&e.stackBB>25?.08*n:0),threeBetBoost:.02*n},h={...e},g=e.aggressorProfile;if(e.facingBet&&g&&g.timedBets>=4&&e.aggressorLastMs!==void 0){let t=_e(g);e.aggressorLastMs<1500&&t>.5&&(h.equity=be(e.equity+.05*n,.02,.98)),e.aggressorLastMs>7e3&&(h.equity=be(e.equity-.04*n,.02,.98))}return Ne(h,m)}var Fe={nit:Ae,tourist:je,calculator:e=>Ne(e),pro:Pe};function Ie(e,t){let n=t>=200?100:t>=50?25:5;return Math.round(e/n)*n}function Le(e,t,n,r,i=`pro`){e.player(t.seat);let a=Se[r]*Ce[i];if(t.canBet){let r=Ie(n.pot*a,e.bigBlind);return r=be(r,t.minBet,t.maxTo),{type:`bet`,amount:r}}if(t.canRaise){let a;if(n.preflop&&n.raisesThisStreet===0)a=e.bigBlind*we[r]+n.limpers*e.bigBlind;else if(n.preflop){let t=(n.raisesThisStreet>=2?Te:R)[r];a=e.currentBet*t*(i===`tourist`?.8:1)+n.limpers*e.bigBlind}else a=e.currentBet*z[r]*Ce[i];return a=be(Ie(a,e.bigBlind),t.minRaiseTo,t.maxTo),t.maxTo-a<e.bigBlind*2&&(a=t.maxTo),{type:`raise`,amount:a}}return null}function Re(e,t){let n=t.tilt;return{fold:e.fold*(1-.5*n),passive:e.passive,small:e.small*(1+n),medium:e.medium*(1+1.2*n),big:e.big*(1+1.5*n),allin:e.allin*(1+2*n)+(n>.6?.03*(n-.6):0)}}function ze(e,t){let n=[`fold`,`passive`,`small`,`medium`,`big`,`allin`],r=n.reduce((t,n)=>t+Math.max(0,e[n]),0);if(r<=0)return`passive`;let i=t()*r;for(let t of n)if(i-=Math.max(0,e[t]),i<=0)return t;return`passive`}function Be(e,t,n,r){let[i,a]={nit:[2600,1400],tourist:[1300,800],calculator:[2100,1e3],pro:[1900,1200]}[e],o=i+B(r)*a;return t.facingBet&&Math.abs(t.equity-t.required)<.12&&(o*=1.6),(n===`allin`||t.facingAllIn)&&(o*=1.5),t.preflop&&n===`fold`&&t.percentile>.4&&(o*=.45),e===`pro`&&r()<.25&&(o=i*(r()<.5?.4:2.2)),o*=1-.5*t.tilt,Math.max(450,Math.round(o))}function Ve(e){let{hand:t,rng:n,type:r}=e,i=t.legalActions();if(!i||i.seat!==e.seat)throw Error(`seat ${e.seat} is not to act`);let a=ke(e),o=Re(Fe[r](a,e.profile),a);a.facingBet||(o.fold=0),!i.canBet&&!i.canRaise&&(o.passive+=o.small+o.medium+o.big+o.allin,o.small=o.medium=o.big=o.allin=0);let s=ze(o,n),c;switch(s){case`fold`:c={type:`fold`};break;case`passive`:c=i.canCheck?{type:`check`}:{type:`call`};break;case`allin`:c=i.canBet?{type:`bet`,amount:i.maxTo}:i.canRaise?{type:`raise`,amount:i.maxTo}:i.canCheck?{type:`check`}:{type:`call`};break;default:{let e=Le(t,i,a,s,r);e?c=e:(s=`passive`,c=i.canCheck?{type:`check`}:{type:`call`})}}return{action:c,move:s,thinkMs:Be(r,a,s,n),view:a}}var He=class{character;stats;profiles=new Map;seatIds=new Map;seat=-1;constructor(e,t){if(this.character=e,this.stats=t?{...t.stats}:{iq:e.iq,read:e.read,clarity:e.clarityBase},t)for(let[e,n]of Object.entries(t.profiles))this.profiles.set(e,n)}get type(){return this.character.type}startTournament(e,t){this.seat=e,this.seatIds=t,this.stats.clarity=this.character.clarityBase}profileFor(e){let t=this.seatIds.get(e);return t?this.profiles.get(t):void 0}decide(e,t,n){return Ve({hand:e,seat:this.seat,type:this.type,stats:this.stats,rng:t,profile:e=>this.profileFor(e),samples:n})}observe(e,t,n){let r=new Map;for(let[e,t]of this.seatIds){if(e===this.seat)continue;let n=this.profiles.get(t);n||(n=ue(),this.profiles.set(t,n)),r.set(e,n)}let i=new Map;for(let t of e.players)r.has(t.seat)&&i.set(t.seat,r.get(t.seat));ve(i,e,n);for(let[e,t]of i)r.has(e);if(!e.players.some(e=>e.seat===this.seat))return null;let a=xe(e,this.seat,t);return L(this.stats,this.type,a,this.character.temper??1),a}memory(){return{stats:{...this.stats},profiles:Object.fromEntries(this.profiles)}}},Ue=class{handNumber;button;smallBlind;bigBlind;ante;players;board=[];events=[];sbSeat;bbSeat;phase=`preflop`;currentBet=0;lastRaiseSize;actor=null;deck;seatOrder;toAct=new Set;actedSinceFullRaise=new Set;scores=new Map;constructor(e){if(e.seats.length<2)throw Error(`a hand needs at least two players`);let t=new Set(e.seats.map(e=>e.seat));if(t.size!==e.seats.length)throw Error(`duplicate seats`);if(!t.has(e.button))throw Error(`button must be a seated player`);for(let t of e.seats)if(!(t.stack>0))throw Error(`seat ${t.seat} has no chips`);if(this.handNumber=e.handNumber??1,this.button=e.button,this.smallBlind=e.smallBlind,this.bigBlind=e.bigBlind,this.ante=e.ante,this.lastRaiseSize=e.bigBlind,this.players=e.seats.map(e=>({seat:e.seat,stack:e.stack,startStack:e.stack,hole:[],streetBet:0,committed:0,folded:!1,allIn:!1})),this.seatOrder=this.players.map(e=>e.seat),this.deck=e.deck?[...e.deck]:_(g(),e.rng??Math.random),this.deck.length<this.players.length*2+5)throw Error(`deck too small`);if(this.events.push({type:`start`,handNumber:this.handNumber,button:this.button,seats:[...this.seatOrder],smallBlind:this.smallBlind,bigBlind:this.bigBlind,ante:this.ante}),this.ante>0)for(let e of this.fromSeat(this.seatAfter(this.button)))this.post(e,this.ante,`ante`);this.players.length===2?(this.sbSeat=this.button,this.bbSeat=this.seatAfter(this.button)):(this.sbSeat=this.seatAfter(this.button),this.bbSeat=this.seatAfter(this.sbSeat)),this.post(this.sbSeat,this.smallBlind,`sb`),this.post(this.bbSeat,this.bigBlind,`bb`);for(let e=0;e<2;e++)for(let e of this.fromSeat(this.seatAfter(this.button)))this.player(e).hole.push(this.deck.shift());for(let e of this.players)this.events.push({type:`deal`,seat:e.seat,cards:[...e.hole]});this.currentBet=Math.max(...this.players.map(e=>e.streetBet)),this.startRound(this.seatAfter(this.bbSeat))}player(e){let t=this.players.find(t=>t.seat===e);if(!t)throw Error(`seat ${e} is not in this hand`);return t}get isComplete(){return this.phase===`complete`}get street(){return this.phase===`showdown`||this.phase===`complete`?null:this.phase}live(){return this.players.filter(e=>!e.folded)}canAct(){return this.players.filter(e=>!e.folded&&!e.allIn)}potTotal(){return this.players.reduce((e,t)=>e+t.committed,0)}pots(){return this.layers().filter(e=>e.amount>0).map(e=>({amount:e.amount,eligible:e.eligible}))}legalActions(){if(this.actor===null)return null;let e=this.player(this.actor),t=this.currentBet-e.streetBet,n=this.canAct().some(t=>t.seat!==e.seat),r=e.streetBet+e.stack,i=t===0,a=this.currentBet===0;return{seat:e.seat,canFold:!0,canCheck:i,callAmount:i?0:Math.min(t,e.stack),canBet:a&&n&&e.stack>0,minBet:Math.min(this.bigBlind,r),canRaise:!a&&n&&!this.actedSinceFullRaise.has(e.seat)&&r>this.currentBet,minRaiseTo:Math.min(this.currentBet+this.lastRaiseSize,r),maxTo:r}}act(e,t){if(this.actor!==e)throw Error(`seat ${e} is not to act (actor: ${this.actor})`);let n=this.legalActions(),r=this.player(e),i=this.phase,a=0;switch(t.type){case`fold`:r.folded=!0,this.actedSinceFullRaise.delete(e);break;case`check`:if(!n.canCheck)throw Error(`cannot check facing a bet`);this.actedSinceFullRaise.add(e);break;case`call`:if(n.canCheck)throw Error(`nothing to call`);a=this.pay(r,n.callAmount),this.actedSinceFullRaise.add(e);break;case`bet`:if(!n.canBet)throw Error(`cannot bet now`);this.checkAmount(t.amount,n.minBet,n.maxTo),a=this.pay(r,t.amount-r.streetBet),this.applyAggression(e,t.amount,t.amount);break;case`raise`:if(!n.canRaise)throw Error(`cannot raise now`);if(this.checkAmount(t.amount,n.minRaiseTo,n.maxTo),t.amount<=this.currentBet)throw Error(`raise must exceed the current bet`);a=this.pay(r,t.amount-r.streetBet),this.applyAggression(e,t.amount,t.amount-this.currentBet)}this.toAct.delete(e),this.pruneToAct(),this.events.push({type:`action`,street:i,seat:e,action:t,amount:a,allIn:r.allIn}),this.advance(e)}checkAmount(e,t,n){if(!Number.isInteger(e))throw Error(`amount must be an integer`);if(e<t||e>n)throw Error(`amount ${e} outside [${t}, ${n}]`)}applyAggression(e,t,n){n>=this.lastRaiseSize?(this.lastRaiseSize=n,this.actedSinceFullRaise=new Set([e])):this.actedSinceFullRaise.add(e),this.currentBet=t,this.toAct=new Set(this.canAct().filter(t=>t.seat!==e).map(e=>e.seat))}pay(e,t){let n=Math.min(t,e.stack);return e.stack-=n,e.streetBet+=n,e.committed+=n,e.stack===0&&(e.allIn=!0),n}post(e,t,n){let r=this.player(e),i=Math.min(t,r.stack);r.stack-=i,r.committed+=i,n!==`ante`&&(r.streetBet+=i),r.stack===0&&(r.allIn=!0),this.events.push({type:`post`,seat:e,kind:n,amount:i,allIn:r.allIn})}seatAfter(e){let t=this.seatOrder.indexOf(e);return this.seatOrder[(t+1)%this.seatOrder.length]}fromSeat(e){let t=this.seatOrder.indexOf(e);return this.seatOrder.map((e,n)=>this.seatOrder[(t+n)%this.seatOrder.length])}firstToActFrom(e){for(let t of this.fromSeat(e))if(this.toAct.has(t))return t;return null}pruneToAct(){if(!(this.canAct().length>=2))for(let e of[...this.toAct])this.player(e).streetBet>=this.currentBet&&this.toAct.delete(e)}startRound(e){this.toAct=new Set(this.canAct().map(e=>e.seat)),this.actedSinceFullRaise.clear(),this.pruneToAct(),this.toAct.size===0?(this.actor=null,this.finishStreet()):this.actor=this.firstToActFrom(e)}advance(e){this.live().length===1?(this.actor=null,this.settle(!1)):this.toAct.size===0?(this.actor=null,this.finishStreet()):this.actor=this.firstToActFrom(this.seatAfter(e))}finishStreet(){if(this.live().length===1){this.settle(!1);return}if(this.phase===`river`){this.settle(!0);return}let e=this.phase===`preflop`?`flop`:this.phase===`flop`?`turn`:`river`,t=e===`flop`?3:1;for(let e=0;e<t;e++)this.board.push(this.deck.shift());this.phase=e;for(let e of this.players)e.streetBet=0;this.currentBet=0,this.lastRaiseSize=this.bigBlind,this.events.push({type:`street`,street:e,board:[...this.board]}),this.startRound(this.seatAfter(this.button))}layers(){let e=[...new Set(this.players.map(e=>e.committed).filter(e=>e>0))].sort((e,t)=>e-t),t=[],n=0;for(let r of e){let e=0,i=[];for(let t of this.players){let a=Math.min(t.committed,r)-n;a>0&&(e+=a,i.push(t.seat))}let a=i.filter(e=>!this.player(e).folded);t.push({amount:e,eligible:a,contributors:i}),n=r}return t}settle(e){if(e){this.phase=`showdown`;for(let e of this.live()){let t=C([...e.hole,...this.board]);this.scores.set(e.seat,t),this.events.push({type:`showdown`,seat:e.seat,cards:[...e.hole],score:t,description:E(t)})}}let t=new Set,n=this.layers();for(let r=0;r<n.length;r++){let i=n[r];if(i.amount===0)continue;if(i.contributors.length===1){let e=i.contributors[0];this.player(e).stack+=i.amount,this.events.push({type:`payout`,seat:e,amount:i.amount,pot:r,returned:!0});continue}let a=i.eligible;a.length===0&&(a=this.live().map(e=>e.seat));let o;if(e){let e=Math.max(...a.map(e=>this.scores.get(e)));o=a.filter(t=>this.scores.get(t)===e)}else o=a;let s=Math.floor(i.amount/o.length),c=i.amount-s*o.length,l=this.fromSeat(this.seatAfter(this.button)).filter(e=>o.includes(e));for(let e of l){let n=s+ +(c>0);c>0&&c--,this.player(e).stack+=n,t.add(e),this.events.push({type:`payout`,seat:e,amount:n,pot:r,returned:!1})}}this.phase=`complete`,this.actor=null,this.events.push({type:`end`,winners:[...t]})}},We=[{sb:50,bb:100,ante:0},{sb:75,bb:150,ante:0},{sb:100,bb:200,ante:0},{sb:150,bb:300,ante:25},{sb:200,bb:400,ante:50},{sb:300,bb:600,ante:75},{sb:400,bb:800,ante:100},{sb:500,bb:1e3,ante:100},{sb:600,bb:1200,ante:200},{sb:800,bb:1600,ante:200},{sb:1e3,bb:2e3,ante:300},{sb:1500,bb:3e3,ante:500},{sb:2e3,bb:4e3,ante:500},{sb:3e3,bb:6e3,ante:1e3},{sb:4e3,bb:8e3,ante:1e3},{sb:6e3,bb:12e3,ante:2e3},{sb:8e3,bb:16e3,ante:2e3},{sb:1e4,bb:2e4,ante:3e3}],Ge=class{players;startingStack;handsPerLevel;schedule;rng;handsPlayed=0;button;current=null;constructor(e){if(e.players.length<2)throw Error(`a tournament needs at least two players`);this.startingStack=e.startingStack??1e4,this.handsPerLevel=e.handsPerLevel??8,this.schedule=e.schedule??We,this.rng=e.rng??Math.random,this.players=[...e.players].sort((e,t)=>e.seat-t.seat).map(e=>({seat:e.seat,name:e.name,stack:this.startingStack})),this.button=e.firstButton??this.players[0].seat}get levelIndex(){return Math.floor(this.handsPlayed/this.handsPerLevel)}get level(){return this.schedule[Math.min(this.levelIndex,this.schedule.length-1)]}get handsUntilNextLevel(){return this.handsPerLevel-this.handsPlayed%this.handsPerLevel}active(){return this.players.filter(e=>e.stack>0)}get isOver(){return this.active().length<=1}get currentHand(){return this.current}player(e){let t=this.players.find(t=>t.seat===e);if(!t)throw Error(`no player in seat ${e}`);return t}startHand(){if(this.isOver)throw Error(`tournament is over`);if(this.current)throw Error(`a hand is already in progress`);let e=this.level;return this.current=new Ue({seats:this.active().map(e=>({seat:e.seat,stack:e.stack})),button:this.button,smallBlind:e.sb,bigBlind:e.bb,ante:e.ante,handNumber:this.handsPlayed+1,rng:this.rng}),this.current}finishHand(){let e=this.current;if(!e)throw Error(`no hand in progress`);if(!e.isComplete)throw Error(`hand is not complete`);let t=e.handNumber,n=new Map;for(let e of this.active())n.set(e.seat,e.stack);for(let t of e.players)this.player(t.seat).stack=t.stack;let r=this.players.filter(e=>e.stack===0&&e.finish===void 0).sort((e,t)=>n.get(e.seat)-n.get(t.seat)),i=this.players.filter(e=>e.finish===void 0).length;for(let e of r)e.finish=i--,e.bustedOn=t;let a=this.active();a.length===1&&(a[0].finish=1),this.handsPlayed++,this.current=null;let o=this.players.map(e=>e.seat),s=o.indexOf(this.button);for(let e=1;e<=o.length;e++){let t=o[(s+e)%o.length];if(this.player(t).stack>0){this.button=t;break}}let c=e.events[e.events.length-1],l=c.type===`end`?c.winners:[],u={};for(let e of this.players)u[e.seat]=e.stack;return{handNumber:t,busted:r.map(e=>e.seat),winners:l,stacks:u}}standings(){return[...this.players].sort((e,t)=>e.finish!==void 0&&t.finish!==void 0?e.finish-t.finish:e.finish===void 0?t.finish===void 0?t.stack-e.stack:-1:1)}},Ke=e=>new Promise(t=>setTimeout(t,e)),qe=class{tournament;bots=new Map;seats;opts;pending=null;stopped=!1;lastLevel=0;paused=!1;resumeWaiters=[];history=[];onDeadline=()=>{};constructor(e){if(this.opts=e,e.lineup.length!==5)throw Error(`a table takes five bots`);let t=new Map([[0,`human`]]);e.lineup.forEach((e,n)=>t.set(n+1,e.id)),e.lineup.forEach((n,r)=>{let i=new He(n,e.memories?.[n.id]);i.startTournament(r+1,t),this.bots.set(r+1,i)}),this.tournament=new Ge({players:[{seat:0,name:e.humanName},...e.lineup.map((e,t)=>({seat:t+1,name:e.name}))],rng:e.rng,startingStack:e.startingStack}),this.seats=this.tournament.players.map(t=>({seat:t.seat,id:t.seat===0?`human`:e.lineup[t.seat-1].id,name:t.name,type:t.seat===0?`human`:e.lineup[t.seat-1].type,stack:t.stack}))}get hand(){return this.tournament.currentHand}get humanLegal(){return this.pending?.legal??null}humanAct(e){if(!this.pending)return!1;let t=this.hand;if(!t||t.actor!==0||!Je(this.pending.legal,e))return!1;let{resolve:n}=this.pending;return this.pending=null,n(e),!0}get isPaused(){return this.paused}pause(){this.paused||=!0}resume(){if(!this.paused)return;this.paused=!1;let e=this.resumeWaiters;this.resumeWaiters=[];for(let t of e)t();this.pending&&this.pending.restart()}whenResumed(){return this.paused?new Promise(e=>this.resumeWaiters.push(e)):Promise.resolve()}stop(){this.stopped=!0,this.resume(),this.pending&&this.humanAct(this.pending.legal.canCheck?{type:`check`}:{type:`fold`})}memories(){let e={};for(let t of this.bots.values())e[t.character.id]=t.memory();return e}moods(){let e={};for(let[t,n]of this.bots)e[t]={...n.stats};return e}async run(){let e=this.tournament;for(await this.emit({type:`tournamentStart`,seats:this.seats,level:e.level});!e.isOver&&!this.stopped&&e.player(0).stack>0;)await this.playHand();let t=e.player(0),n=t.finish??(e.isOver?1:e.active().length+1);this.stopped&&t.finish===void 0&&(t.finish=n);let r=e.standings();return await this.emit({type:`tournamentEnd`,standings:r,humanFinish:n,handsPlayed:e.handsPlayed}),{standings:r,humanFinish:n}}async playHand(){let e=this.tournament,t=e.startHand(),n={};for(let e of t.players)n[e.seat]=e.stack+e.committed;await this.emit({type:`handStart`,hand:t,handNumber:t.handNumber,button:t.button,level:e.level,stacks:n});let r=0;r=await this.flush(t,r);let i=new Map;for(;!t.isComplete&&!this.stopped;){let e=t.actor,n=t.legalActions(),a,o;if(e===0){let r=this.opts.shotClockMs??0,i=this.opts.human||r<=0?null:Date.now()+r;await this.emit({type:`turn`,seat:e,legal:n,deadline:i});let s=Date.now();a=await this.humanTurn(t,n),o=Date.now()-s}else{await this.emit({type:`turn`,seat:e,legal:n,deadline:null});let r=this.bots.get(e).decide(t,this.opts.rng,this.opts.samples);o=r.thinkMs,await this.wait(o),a=r.action}let s=t.events.length;t.act(e,a),i.set(s,o),r=await this.flush(t,r,o)}if(this.stopped&&!t.isComplete)return;let a={};for(let[e,n]of this.bots)t.players.some(t=>t.seat===e)&&(a[e]=n.observe(t,this.opts.rng,i));let o=t.events[t.events.length-1];this.history.push(t),this.history.length>12&&this.history.shift(),await this.emit({type:`handEnd`,hand:t,winners:o.type===`end`?o.winners:[],outcomes:a,moods:this.moods()});let s=e.finishHand();if(s.busted.length>0){let t={};for(let n of s.busted)t[n]=e.player(n).finish;await this.emit({type:`bust`,seats:s.busted,finishes:t})}e.levelIndex!==this.lastLevel&&(this.lastLevel=e.levelIndex,await this.emit({type:`level`,level:e.level,index:e.levelIndex}))}async flush(e,t,n=0){for(let r=t;r<e.events.length;r++){let t=e.events[r];switch(t.type){case`post`:await this.emit({type:`post`,seat:t.seat,kind:t.kind,amount:t.amount,allIn:t.allIn});break;case`deal`:await this.emit({type:`deal`,seat:t.seat,cards:t.cards});break;case`action`:await this.emit({type:`action`,seat:t.seat,action:t.action,amount:t.amount,allIn:t.allIn,street:t.street,thinkMs:n});break;case`street`:await this.emit({type:`street`,street:t.street,board:t.board});break;case`showdown`:await this.emit({type:`showdown`,seat:t.seat,cards:t.cards,description:t.description});break;case`payout`:await this.emit({type:`payout`,seat:t.seat,amount:t.amount,returned:t.returned})}}return e.events.length}humanTurn(e,t){return this.opts.human?Promise.resolve(this.opts.human(e,t)):new Promise(e=>{let n=null,r=this.opts.shotClockMs??0,i={legal:t,resolve:t=>{n&&clearTimeout(n),e(t)},restart:()=>{n&&clearTimeout(n),r>0?(n=setTimeout(a,r),this.onDeadline(Date.now()+r)):this.onDeadline(0)}},a=()=>{this.paused||this.pending===i&&(this.pending=null,e(t.canCheck?{type:`check`}:{type:`fold`}))};this.pending=i,r>0&&(n=setTimeout(a,r))})}async wait(e){let t=this.opts.speed?.()??1;await(this.opts.sleep??Ke)(e/Math.max(.01,t)),await this.whenResumed()}async emit(e){await this.whenResumed(),await this.opts.presenter.present(e)}};function Je(e,t){switch(t.type){case`fold`:return e.canFold;case`check`:return e.canCheck;case`call`:return!e.canCheck&&e.callAmount>0;case`bet`:return e.canBet&&Number.isInteger(t.amount)&&t.amount>=e.minBet&&t.amount<=e.maxTo;case`raise`:return e.canRaise&&Number.isInteger(t.amount)&&t.amount>=e.minRaiseTo&&t.amount<=e.maxTo}}var Ye=[`targetFoldsToMe`,`targetCallsMeDown`,`targetTank`,`targetInstant`,`targetChecks`,`winShowdown`,`stackedTarget`,`playerOut`],Xe=9e3,Ze=3e5,Qe=[`targetFoldsToMe`,`targetCallsMeDown`,`targetChecks`,`winShowdown`,`stackedTarget`,`playerOut`,`badBeatGiven`,`targetTank`,`targetInstant`],$e=1800,et=[`badBeatTaken`,`stackedTarget`,`stackedByTarget`,`allIn`,`headsUp`,`termination`];function tt(e){return e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)}var nt=class{used=new Map;lastSpoke=new Map;lastAny=0;rng;now;hand=null;lastAggressor=null;humanLastThink=0;density=1;convo=null;gone=new Set;usedConvos=new Set;usedJabs=new Set;usedTeases=new Map;recentThoughts=new Map;openers=[];absent=null;mentionsAbsent(t,n){let r=[...n.ids.values()].sort().join(`,`);if(!this.absent||this.absent.key!==r){let t=new Set(n.ids.values()),i=(e,t)=>t.length-e.length,a=e.filter(e=>!t.has(e.id)).map(e=>e.name).sort(i),o=e.filter(e=>t.has(e.id)).map(e=>e.name).sort(i),s=[...o,...a].sort(i).map(tt).join(`|`);this.absent={key:r,re:a.length>0?RegExp(`\\b(?:${s})\\b`,`g`):null,present:new Set(o)}}if(!this.absent.re)return!1;for(let e of t.matchAll(this.absent.re))if(!this.absent.present.has(e[0]))return!0;return!1}jab=null;lastConvoEnd=-1e9;constructor(e,t=()=>Date.now()){this.rng=e,this.now=t}tick(e){return this.openers.length>0?this.opener(e):this.chatter({type:`tick`},e)}onEvent(e,t){return this.openers.length>0&&e.type!==`tournamentStart`?this.opener(t)||((e.type===`action`||this.hand?.board.length)&&(this.openers=[]),null):this.onGameEvent(e,t)||this.chatter(e,t)}onGameEvent(e,t){switch(e.type){case`tournamentStart`:{let e=this.now();for(let n of t.ids.values())this.lastSpoke.set(n,e);return this.lastAny=e-$e,this.openers=this.shuffled(this.seatsOf(t)).slice(0,2+ +!!this.chance(.5)),this.chance(.35)&&this.openers.push(-1),this.opener(t)}case`handStart`:{this.hand=e.hand,this.lastAggressor=null;let n=this.botsInHand(t),r=e.level.bb;for(let i of this.shuffled(n)){let n=e.stacks[i]??0;if(!this.chance(t.traits?.(i).talk??1))continue;let a=Object.values(e.stacks).reduce((e,t)=>e+t,0);if(n/r<10&&this.chance(.18))return this.say(i,`shortStack`,t);if(n>a*.42&&this.chance(.1))return this.say(i,`chipLeader`,t)}return n.length>0&&this.chance(.02)?this.say(this.pickSpeaker(n,t),`dealtIn`,t):n.length>1&&this.chance(.02)?this.say(this.pickSpeaker(n,t,!0),`idle`,t):this.chance(.03)?this.say(-1,`dealtIn`,t):null}case`action`:return this.onAction(e,t);case`handEnd`:return this.onHandEnd(e,t);case`bust`:{for(let t of e.seats)this.gone.add(t);let n=e.seats[0],r=t.names.get(n)??`friend`;this.queueAftermath(t,r);let i=this.pickLine(`dealer`,`termination`,`calm`);if(!i)return null;let a=this.now();return this.lastAny=a,this.lastSpoke.set(`dealer`,a),{seat:-1,speaker:`dealer`,text:i.s.replace(/\{target\}/g,r),trigger:`termination`,targetSeat:n}}case`turn`:{if(e.seat===0)return null;if(this.hand&&e.legal.callAmount>=this.hand.player(e.seat).stack*.6&&e.legal.callAmount>0&&this.chance(.3))return this.say(e.seat,`facingAllIn`,t,{target:this.aggressorName(t)});let n=this.botsInHand(t).filter(t=>t!==e.seat&&this.hand.player(t).folded);return n.length>0&&this.chance(.01)?this.say(this.pickSpeaker(n,t),`idle`,t):this.chance(.005)?this.say(-1,`idle`,t):null}case`level`:return null;default:return null}}chatter(e,t){if(e.type===`tournamentEnd`)return null;let n=this.now(),r=this.hand&&!this.hand.isComplete?this.hand.actor:null,i=this.hand?this.hand.potTotal()>.3*this.avgStack():!1;if(this.jab){let e=this.jab;return!t.ids.has(e.seat)||!t.ids.has(e.target)?(this.jab=null,null):n-e.at<5200||e.seat===r||i?null:(this.jab=null,this.lastAny=n,this.lastConvoEnd=n,this.lastSpoke.set(t.ids.get(e.seat),n),{seat:e.seat,speaker:t.ids.get(e.seat),text:e.text,trigger:`idle`,targetSeat:e.target,conversation:!0,last:!0})}if(this.convo){let e=this.convo,[a]=e.conv.lines[e.next],o=a===`A`?e.a:e.b;return i?(this.convo=null,this.lastConvoEnd=n,null):n-e.lastAt<5200||o===r?null:!t.ids.has(e.a)||!t.ids.has(e.b)||this.gone.has(e.a)||this.gone.has(e.b)?(this.convo=null,null):this.speakConvo(t)}let a=n-this.lastAny>3500&&n-this.lastConvoEnd>6e4,o=e.type===`turn`||e.type===`handEnd`||e.type===`handStart`||e.type===`tick`;if(a&&o&&!i){let e=this.seatsOf(t).filter(e=>e!==r&&n-(this.lastSpoke.get(t.ids.get(e))??-1e9)>Ze);if(e.length>0&&this.chance(.3)){let n=this.pick(e),r=this.sayForced(n,`idle`,t);if(r)return r}}return!a||!o||i||!this.chance(e.type===`handEnd`||e.type===`handStart`?.05:.01)?null:this.startConversation(t,r)}queueAftermath(e,t){let n=this.seatsOf(e);if(n.length<2)return;let r=a.filter(e=>e.tag===`kill`),i=r.filter(e=>!this.usedConvos.has(e)),o=this.pick(i.length>0?i:r);this.usedConvos.add(o);let[s,c]=this.shuffled(n);this.jab=null,this.convo={conv:o,a:s,b:c,next:0,lastAt:this.now(),gone:t}}startConversation(e,t){let n=this.allBotSeats(e).filter(e=>e!==t&&!(this.hand&&!this.hand.isComplete&&this.hand.players.some(n=>n.seat===e&&!n.folded&&e===t)));if(n.length<2)return null;let r=t=>e.stance?.(t)??`meh`,i=a.filter(t=>t.tag!==`kill`&&!t.lines.some(([,t])=>this.mentionsAbsent(t,e))),o=i.filter(e=>!this.usedConvos.has(e)),s=o.length>0?o:i;o.length===0&&this.usedConvos.clear();for(let t of this.shuffled(s)){let i=t=>(te[e.ids.get(t)??``]??[]).length===0,a=n=>t.tag===`spouse`&&e.ids.get(n)===`sal`,o=(t,n,o)=>(!n||r(t)===n)&&(o?o.includes(e.ids.get(t)??``):!i(t)&&!a(t)),s=[];for(let e of n)for(let r of n)e!==r&&o(e,t.needs?.A,t.who?.A)&&o(r,t.needs?.B,t.who?.B)&&s.push([e,r]);if(s.length===0)continue;let c=t=>(e.traits?.(t[0]).talk??1)*(e.traits?.(t[1]).talk??1)*this.silence(e,t[0])*this.silence(e,t[1]),l=s.reduce((e,t)=>e+c(t),0),u=this.rng()*l,d=s[0];for(let e of s)if(u-=c(e),u<=0){d=e;break}let[f,p]=d;return this.convo={conv:t,a:f,b:p,next:0,lastAt:-1e9},this.usedConvos.add(t),this.speakConvo(e)}return null}speakConvo(e){let t=this.convo,[n,r]=t.conv.lines[t.next],i=n===`A`?t.a:t.b,a=n===`A`?t.b:t.a,o=e.ids.get(i);if(!o)return null;let s=this.now();t.lastAt=s,this.lastAny=s,this.lastSpoke.set(o,s),t.next++;let c=t.next>=t.conv.lines.length;return c&&(this.convo=null,this.lastConvoEnd=s,this.jab=this.interject(e,t.conv,t.a,t.b),this.jab&&(c=!1)),{seat:i,speaker:o,text:r.replace(/\{A\}/g,e.names.get(t.a)??`pal`).replace(/\{B\}/g,e.names.get(t.b)??`pal`).replace(/\{you\}/g,e.names.get(0)??`the kid`).replace(/\{gone\}/g,t.gone??`him`),trigger:`idle`,targetSeat:c?a:void 0,conversation:!0,last:c}}interject(e,t,n,r){let i=this.allBotSeats(e).filter(t=>t!==n&&t!==r&&o.some(n=>n.who===e.ids.get(t)));if(i.length===0)return null;let a=this.pick(i),s=e.ids.get(a),c=.45*(e.traits?.(a).trash??1);if(!this.chance(c))return null;let l=e.ids.get(n)??``,u=e.ids.get(r)??``,d=o.filter(n=>n.who===s&&(n.at?n.at.includes(l)||n.at.includes(u):!n.tag||n.tag===t.tag)&&!this.mentionsAbsent(n.s,e));if(d.length===0)return null;let f=d.filter(e=>!this.usedJabs.has(e));if(f.length===0){for(let e of d)this.usedJabs.delete(e);f=d}let p=f.filter(e=>e.at),m=f.filter(e=>!e.at&&e.tag),h=p.length>0&&this.chance(.8)?p:m.length>0&&this.chance(.7)?m:f,g=this.pick(h);this.usedJabs.add(g);let _=g.at&&g.at.includes(u)&&!g.at.includes(l)?r:n,v=g.at&&_===n?r:n;return{seat:a,target:_,text:g.s.replace(/\{them\}/g,e.names.get(v)??`pal`),at:this.now()}}headsUp(e){let t=this.seatsOf(e);return t.length>0&&this.chance(.7)?this.say(t[0],`headsUp`,e,{target:e.names.get(0)}):this.say(-1,`headsUp`,e)}onAction(e,t){let n=this.hand;if(!n)return null;let r=e.action.type,i=n.potTotal(),a=i>.3*this.avgStack()?.5:1,o=this.aggressorThisStreet(n);if((r===`bet`||r===`raise`)&&(this.lastAggressor=e.seat),r===`check`&&this.chance(.06*a)){let r=this.botsInHand(t).filter(t=>t!==e.seat&&!n.player(t).folded);if(r.length>0){let n=this.say(this.pickSpeaker(r,t,!0),`targetChecks`,t,{targetSeat:e.seat});if(n)return n}}if(e.seat===0){this.humanLastThink=e.thinkMs;let s=this.botsInHand(t).filter(e=>!n.player(e).folded);return s.length===0?null:e.thinkMs>12e3&&this.chance(.35)?this.say(this.pickSpeaker(s,t,!0),`targetTank`,t,{target:t.names.get(0)}):e.thinkMs<700&&r!==`fold`&&this.chance(.06)?this.say(this.pickSpeaker(s,t,!0),`targetInstant`,t,{target:t.names.get(0)}):r===`fold`&&o!==null&&o!==0&&i>=6*n.bigBlind&&this.chance(.18*a)?this.say(o,`targetFoldsToMe`,t,{target:t.names.get(0)}):null}let s=n.player(e.seat),c=this.thinking(e.seat,e,o,t);if(c)return c;if(e.allIn&&r!==`fold`&&r!==`check`&&this.chance(.6))return this.say(e.seat,`allIn`,t,{target:this.aggressorName(t,o)});switch(r){case`fold`:return e.street===`preflop`&&this.chance(.03*a)?this.say(e.seat,`foldPreflop`,t):null;case`bet`:case`raise`:{let r=o!==null&&o!==e.seat,s=e.amount>=Math.max(8*n.bigBlind,.6*i);return this.chance((r?.2:s?.12:.03)*a)?this.say(e.seat,r?`reraise`:`raise`,t,{target:r?t.names.get(o):void 0}):null}case`call`:return(e.amount>=.35*(i-e.amount)||e.amount>=.25*(s.stack+e.amount))&&e.amount>=5*n.bigBlind&&this.chance(.25)?this.say(e.seat,`callBig`,t,{target:this.aggressorName(t,o)}):null;default:return null}}onHandEnd(e,t){let n=e.hand,r=n.events.some(e=>e.type===`showdown`),i=e.winners,a=n.live().map(e=>e.seat).filter(e=>!i.includes(e)),o=a.sort((e,t)=>n.player(e).committed-n.player(t).committed)[a.length-1],s=this.lastAggressorOnRiver(n),c=[],l=e=>e===void 0?void 0:t.names.get(e),u=e=>n.player(e).stack===0,d=n.potTotal()/Math.max(1,this.avgStack()),f=d>=.25?1:d>=.1?.5:.12;for(let[t,a]of Object.entries(e.outcomes)){let e=Number(t);if(!a||e===0)continue;let d=i.includes(e);if(!n.player(e).folded){if(d){let t=o;t!==void 0&&u(t)&&c.push({seat:e,t:`stackedTarget`,p:.9,vars:{target:l(t)}}),r?(a.suckOut&&c.push({seat:e,t:`badBeatGiven`,p:.45,vars:{target:l(t)}}),t!==void 0&&s===e&&t===0&&c.push({seat:e,t:`targetCallsMeDown`,p:.45,vars:{target:l(t)}}),c.push({seat:e,t:`winShowdown`,p:.45,vars:{target:l(t),hand:this.shown(n,e)}})):this.isWeak(n,e)&&this.lastAggressor===e?c.push({seat:e,t:`bluffWorked`,p:.3,vars:{}}):c.push({seat:e,t:`winNoShowdown`,p:.22,vars:{target:l(t)}})}else if(r){let t=i[0];u(e)&&c.push({seat:e,t:`stackedByTarget`,p:.85,vars:{target:l(t)}}),a.badBeat&&c.push({seat:e,t:`badBeatTaken`,p:.8,vars:{target:l(t)}}),s===e&&this.isWeak(n,e)&&c.push({seat:e,t:`bluffCaught`,p:.55,vars:{target:l(t)}}),c.push({seat:e,t:`loseShowdown`,p:.4,vars:{target:l(t)}})}}}r&&i.length===1&&this.chance(.12)&&c.push({seat:-1,t:`winShowdown`,p:1,vars:{hand:this.shown(n,i[0])}});for(let e of this.shuffled(c.sort((e,t)=>t.p-e.p))){let n=e.t===`stackedTarget`||e.t===`stackedByTarget`||e.t===`badBeatTaken`;if(this.chance(e.p*(n?1:f))){let n=this.say(e.seat,e.t,t,e.vars);if(n)return n}}return null}say(e,t,n,r={}){let i=e===-1?`dealer`:n.ids.get(e);if(!i||i===`human`)return null;if(r.targetSeat!==void 0&&r.target===void 0&&(r.target=n.names.get(r.targetSeat)),r.targetSeat===void 0&&r.target!==void 0)for(let[e,t]of n.names)t===r.target&&(r.targetSeat=e);let a=this.now(),o=et.includes(t);if((this.convo||this.jab)&&t!==`termination`||!o&&a-this.lastAny<$e)return null;if(e!==-1&&n.traits){let r=n.traits(e),i=Math.min(1,r.talk*(Ye.includes(t)?r.trash:1)*this.silence(n,e));if(!o&&this.rng()>i)return null}if(a-(this.lastSpoke.get(i)??-1e9)<(o?Xe/3:Xe))return null;let c=e!==-1&&n.clarity(e)>=55?`tilted`:`calm`;if(t===`idle`&&e!==-1&&r.targetSeat===void 0&&this.chance(.6)){let t=this.allBotSeats(n).filter(t=>t!==e&&s[n.ids.get(t)??``]);t.length>0&&(r.targetSeat=this.pick(t))}let l=e!==-1&&r.targetSeat!==void 0&&r.targetSeat!==e&&(Qe.includes(t)||t===`idle`)?this.pickTease(n.ids.get(r.targetSeat)??``,t===`idle`?1:.75,n):null,u=l?{t:`tease`,s:l}:this.pickLine(i,t,c,n);return u?(this.lastAny=a,this.lastSpoke.set(i,a),{seat:e,speaker:i,text:u.s.replace(/\{target\}/g,r.target??`friend`).replace(/\{hand\}/g,r.hand??`the hand`).replace(/\{amount\}/g,String(r.amount??``)),trigger:u.t===`tease`?`tease`:t,targetSeat:r.targetSeat}):null}pickTease(e,t,n){let r=(s[e]??[]).filter(e=>!this.mentionsAbsent(e,n));if(!r||r.length===0||!this.chance(t))return null;let i=this.usedTeases.get(e);i||(i=new Set,this.usedTeases.set(e,i));let a=r.filter(e=>!i.has(e));a.length===0&&(i.clear(),a=r);let o=this.pick(a);return i.add(o),o}thinking(e,t,n,r){let i=this.hand,a=r.ids.get(e);if(!i||!a||!r.iq||r.iq(e)<72)return null;let o=t.action.type,s=t.allIn&&o!==`fold`&&o!==`check`?`allin`:o===`bet`||o===`raise`?`raise`:o===`call`?`call`:o===`fold`?`fold`:`check`,c=n!==null&&n!==e,l=i.board.length<3?c&&s!==`fold`?.04:0:c?s===`fold`?.12:.22:s===`raise`||s===`allin`?.12:0;if(!this.chance(l)||this.convo||this.jab)return null;let u=this.now();if(u-this.lastAny<$e||u-(this.lastSpoke.get(a)??-1e9)<Xe)return null;let d=c?n:null;d===e&&(d=null),d===null&&i.players.some(e=>e.seat===0&&!e.folded)&&(d=0);let f=d!==null&&i.players.some(e=>e.seat===d)?{name:r.names.get(d)??`friend`,hole:i.player(d).hole}:void 0,p=null,m=this.recentThoughts.get(a)??[];for(let t=0;t<4&&(p===null||m.includes(p));t++)p=ee({hand:i,seat:e,move:s,target:f,rng:this.rng});return!p||m.includes(p)?null:(this.recentThoughts.set(a,[...m.slice(-5),p]),this.lastAny=u,this.lastSpoke.set(a,u),{seat:e,speaker:a,text:p,trigger:`thinking`,targetSeat:d??void 0})}opener(e){let t=this.now();if(t-this.lastAny<4e3)return null;let n=this.openers.shift();if(n===void 0)return null;let r=n===-1?`dealer`:e.ids.get(n);if(!r)return null;let i=this.pickLine(r,`gameStart`,`calm`,e),a=n===-1?l:c.filter(t=>!this.mentionsAbsent(t,e)),o=(i?i.s:this.pick(a)).replace(/\{you\}/g,e.names.get(0)??`you`).replace(/\{target\}/g,e.names.get(0)??`you`);return this.lastAny=t,this.lastSpoke.set(r,t),{seat:n,speaker:r,text:o,trigger:`gameStart`,targetSeat:0}}sayForced(e,t,n){let r=n.ids.get(e);if(!r||r===`human`)return null;let i=n.clarity(e)>=55?`tilted`:`calm`,a=this.pickLine(r,t,i,n);if(!a)return null;let o=this.now();return this.lastAny=o,this.lastSpoke.set(r,o),{seat:e,speaker:r,text:a.s.replace(/\{target\}/g,n.names.get(0)??`friend`).replace(/\{hand\}/g,`the hand`),trigger:t}}pickLine(e,t,n,r){let i=(te[e]??[]).filter(e=>e.t===t&&(!e.m||e.m===`any`||e.m===n)&&!(r&&this.mentionsAbsent(e.s,r))),a=n===`tilted`?i.filter(e=>e.m===`tilted`):[],o=a.length>0&&this.chance(.7)?a:i;if(o.length===0)return null;let s=this.used.get(e);s||(s=new Set,this.used.set(e,s));let c=o.filter(e=>!s.has(e));if(c.length===0){for(let e of o)s.delete(e);c=o}let l=this.pick(c);return s.add(l),l}chance(e){return this.rng()<e*this.density}pick(e){return e[Math.floor(this.rng()*e.length)]}silence(e,t){let n=e.ids.get(t)??``,r=this.now()-(this.lastSpoke.get(n)??this.now()-Ze);return 1+Math.max(0,r)/45e3}pickSpeaker(e,t,n=!1){let r=e=>{let r=t.traits?.(e)??{talk:1,trash:1};return r.talk*(n?r.trash:1)*this.silence(t,e)},i=e.reduce((e,t)=>e+r(t),0),a=this.rng()*i;for(let t of e)if(a-=r(t),a<=0)return t;return e[e.length-1]}shuffled(e){let t=[...e];for(let e=t.length-1;e>0;e--){let n=Math.floor(this.rng()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t}seatsOf(e){return[...e.ids.entries()].filter(([e,t])=>t!==`human`&&e!==-1&&!this.gone.has(e)&&(te[t]??[]).length>0).map(([e])=>e)}allBotSeats(e){return[...e.ids.entries()].filter(([e,t])=>t!==`human`&&e!==-1&&!this.gone.has(e)).map(([e])=>e)}botsInHand(e){let t=this.hand;return this.seatsOf(e).filter(e=>t?.players.some(t=>t.seat===e))}avgStack(){let e=this.hand;return e?e.players.reduce((e,t)=>e+t.stack+t.committed,0)/e.players.length:1e4}aggressorName(e,t=this.lastAggressor){return t===null?void 0:e.names.get(t)}isWeak(e,t){let n=e.player(t);return e.board.length<3?se(n.hole)>.45:w(C([...n.hole,...e.board]))<=v.Pair}shown(e,t){let n=e.events.find(e=>e.type===`showdown`&&e.seat===t);return n&&n.type===`showdown`?n.description:void 0}aggressorThisStreet(e){let t=null,n=e.events.slice(0,-1);for(let e of n)e.type===`street`&&(t=null),e.type===`action`&&(e.action.type===`bet`||e.action.type===`raise`)&&(t=e.seat);return t}lastAggressorOnRiver(e){let t=!1,n=null;for(let r of e.events)r.type===`street`&&(t=r.street===`river`),t&&r.type===`action`&&(r.action.type===`bet`||r.action.type===`raise`)&&(n=r.seat);return n}},rt=[{id:`first_win`,name:`First Blood`,blurb:`Win a poker night.`},{id:`five_wins`,name:`Regular`,blurb:`Win five poker nights.`},{id:`pro_heads_up`,name:`Pro Killer`,blurb:`Beat a pro heads-up for the title.`},{id:`bust_all`,name:`Cleaner`,blurb:`Knock out all five opponents yourself.`},{id:`nemesis`,name:`Nemesis`,blurb:`Knock the same man out five times.`},{id:`everyone`,name:`Nobody’s Safe`,blurb:`Knock out every man on the roster at least once.`},{id:`bluff_artist`,name:`Pure Air`,blurb:`Win five pots in one night with nothing, without showing down.`},{id:`the_nuts`,name:`The Nuts`,blurb:`Win a showdown with four of a kind or better.`},{id:`comeback`,name:`Chip and a Chair`,blurb:`Win a night after dropping under ten big blinds.`},{id:`suck_out`,name:`Rivered`,blurb:`Win an all-in as a big underdog.`},{id:`speed_run`,name:`Short Night`,blurb:`Win a night in under 40 hands.`},{id:`nit_buster`,name:`Scared Money`,blurb:`Knock out a nit.`}],it=`pihkh.save.v2`,at=`pihkh.save.v1`;function ot(){return{played:0,wins:0,finishes:[0,0,0,0,0,0,0],bestHand:null,biggestPot:0,handsPlayed:0}}function st(){return{games:0,wins:0,losses:0,knockouts:0,knockedOutBy:0}}function ct(){return{version:2,name:`Hero`,record:ot(),rivals:{},trophies:{},settings:{sound:!0,banter:1,room:!0},memories:{}}}function lt(e){let t=ct(),n=e.tournaments??{};for(let e of Object.values(n)){t.record.played+=e.played??0,t.record.wins+=e.wins??0,t.record.handsPlayed+=e.handsPlayed??0,t.record.biggestPot=Math.max(t.record.biggestPot,e.biggestPot??0),e.bestHand&&(!t.record.bestHand||e.bestHand.score>t.record.bestHand.score)&&(t.record.bestHand=e.bestHand);for(let n=1;n<=6;n++)t.record.finishes[n]+=e.finishes?.[n]??0}return{...t,name:typeof e.name==`string`?e.name:t.name,settings:{...t.settings,...e.settings??{}},trophies:e.trophies??{},memories:e.memories??{}}}function ut(e=pt()){let t=ct();if(!e)return t;try{let n=e.getItem(it);if(n){let e=JSON.parse(n);return e.version===2?{...t,...e,record:{...t.record,...e.record??{}},rivals:e.rivals??{},settings:{...t.settings,...e.settings??{}},trophies:e.trophies??{},memories:e.memories??{}}:t}let r=e.getItem(at);if(r){let e=JSON.parse(r);if(e.version===1)return lt(e)}return t}catch{return t}}function dt(e,t=pt()){if(t)try{t.setItem(it,JSON.stringify(e))}catch{}}function ft(e=pt()){try{e?.removeItem(it),e?.removeItem(at)}catch{}}function pt(){try{return typeof localStorage<`u`?localStorage:null}catch{return null}}var mt=class{bestHand=null;biggestPot=0;handsPlayed=0;bustedByMe=new Set;bustedTypes=[];knockouts=[];knockedOutBy=null;finishes=new Map;rivals=[];airWins=0;nutsWin=!1;suckOut=!1;underTenBB=!1;lastOpponentType=null;seatTypes=new Map;seatIds=new Map;hand=null;humanWasAggressor=!1;onEvent(e){switch(e.type){case`tournamentStart`:for(let t of e.seats)this.seatTypes.set(t.seat,t.type),this.seatIds.set(t.seat,t.id),t.seat!==0&&this.rivals.push(t.id);break;case`handStart`:{this.hand=e.hand,this.handsPlayed=e.handNumber,this.humanWasAggressor=!1;let t=e.stacks[0]??0;t>0&&t/e.level.bb<10&&(this.underTenBB=!0);break}case`action`:e.seat===0&&(e.action.type===`bet`||e.action.type===`raise`)&&(this.humanWasAggressor=!0);break;case`handEnd`:{let t=e.hand,n=t.players.find(e=>e.seat===0);if(!n||!e.winners.includes(0))break;let r=t.events.some(e=>e.type===`showdown`),i=t.events.filter(e=>e.type===`payout`&&e.seat===0&&!e.returned).reduce((e,t)=>e+(t.type===`payout`?t.amount:0),0);if(this.biggestPot=Math.max(this.biggestPot,i),t.board.length>=3){let e=C([...n.hole,...t.board]);r?((!this.bestHand||e>this.bestHand.score)&&(this.bestHand={score:e,description:E(e)}),w(e)>=v.Quads&&(this.nutsWin=!0)):this.humanWasAggressor&&w(e)<=v.HighCard&&this.airWins++}else!r&&this.humanWasAggressor&&n.hole.length===2&&w(C([...n.hole,0,14,27].filter((e,t,n)=>n.indexOf(e)===t).slice(0,5)))<=v.HighCard&&this.airWins++;for(let[t,n]of Object.entries(e.outcomes))n&&n.badBeat&&Number(t)!==0&&r&&(this.suckOut=!0);break}case`bust`:{let t=this.hand;if(!t)break;let n=t.events.at(-1),r=n?.type===`end`?n.winners:[];if(e.seats.includes(0)){let e=r.find(e=>e!==0);this.knockedOutBy=e===void 0?null:this.seatIds.get(e)??null;break}if(!r.includes(0))break;for(let t of e.seats){let e=this.seatTypes.get(t);this.bustedByMe.add(t),e&&e!==`human`&&this.bustedTypes.push(e);let n=this.seatIds.get(t);n&&this.knockouts.push(n)}break}case`tournamentEnd`:{for(let t of e.standings){let e=this.seatIds.get(t.seat);e&&t.seat!==0&&this.finishes.set(e,t.finish)}let t=e.standings.filter(e=>e.seat!==0),n=t.find(e=>e.finish===2)??t.sort((e,t)=>(e.finish??9)-(t.finish??9))[0],r=n?this.seatTypes.get(n.seat):void 0;this.lastOpponentType=r&&r!==`human`?r:null;break}}}};function ht(t,n,r){let i=t.record;i.played++,i.handsPlayed+=n.handsPlayed,n.humanFinish>=1&&n.humanFinish<=6&&i.finishes[n.humanFinish]++,n.humanFinish===1&&i.wins++,r.bestHand&&(!i.bestHand||r.bestHand.score>i.bestHand.score)&&(i.bestHand=r.bestHand),i.biggestPot=Math.max(i.biggestPot,r.biggestPot);for(let e of r.rivals){let i=t.rivals[e]??=st();i.games++;let a=r.finishes.get(e);a!==void 0&&a>n.humanFinish?i.wins++:i.losses++}for(let e of r.knockouts)(t.rivals[e]??=st()).knockouts++;r.knockedOutBy&&(t.rivals[r.knockedOutBy]??=st()).knockedOutBy++;let a=n.humanFinish===1,o=[];a&&o.push(`first_win`),i.wins>=5&&o.push(`five_wins`),a&&r.lastOpponentType===`pro`&&o.push(`pro_heads_up`),a&&r.bustedByMe.size>=5&&o.push(`bust_all`),Object.values(t.rivals).some(e=>e.knockouts>=5)&&o.push(`nemesis`),e.every(e=>(t.rivals[e.id]?.knockouts??0)>0)&&o.push(`everyone`),r.airWins>=5&&o.push(`bluff_artist`),r.nutsWin&&o.push(`the_nuts`),a&&r.underTenBB&&o.push(`comeback`),r.suckOut&&o.push(`suck_out`),a&&n.handsPlayed<40&&o.push(`speed_run`),r.bustedTypes.includes(`nit`)&&o.push(`nit_buster`);let s=[];for(let e of o){let n=rt.find(t=>t.id===e);if(!n)continue;let r=t.trophies[e];r?r.count++:(t.trophies[e]={earnedAt:Date.now(),count:1},s.push(n))}return s}var gt=1e3,_t=1001,vt=1002,yt=1003,bt=1004,xt=1005,St=1006,Ct=1007,wt=1008,Tt=1009,Et=1010,Dt=1011,Ot=1012,kt=1013,At=1014,jt=1015,Mt=1016,Nt=1017,Pt=1018,Ft=1020,It=35902,Lt=35899,Rt=1021,zt=1022,Bt=1023,Vt=1026,Ht=1027,Ut=1028,Wt=1029,Gt=1030,Kt=1031,qt=1033,Jt=33776,Yt=33777,Xt=33778,Zt=33779,Qt=35840,$t=35841,en=35842,tn=35843,nn=36196,rn=37492,an=37496,on=37488,sn=37489,cn=37490,ln=37491,un=37808,dn=37809,fn=37810,pn=37811,mn=37812,hn=37813,gn=37814,_n=37815,vn=37816,yn=37817,bn=37818,xn=37819,Sn=37820,Cn=37821,wn=36492,Tn=36494,En=36495,Dn=36283,On=36284,kn=36285,An=36286,jn=2300,Mn=2301,Nn=2302,Pn=2303,Fn=2400,In=2401,Ln=2402,Rn=3200,zn=3201,Bn=`srgb`,Vn=`srgb-linear`,Hn=`linear`,Un=`srgb`,Wn=7680,Gn=35044,Kn=2e3;function qn(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Jn(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function Yn(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Xn(){let e=Yn(`canvas`);return e.style.display=`block`,e}var Zn={};function Qn(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function $n(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function H(...e){e=$n(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function U(...e){e=$n(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function er(...e){let t=e.join(` `);t in Zn||(Zn[t]=!0,H(...e))}function tr(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var nr={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},rr=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},ir=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),ar=Math.PI/180,or=180/Math.PI;function sr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ir[e&255]+ir[e>>8&255]+ir[e>>16&255]+ir[e>>24&255]+`-`+ir[t&255]+ir[t>>8&255]+`-`+ir[t>>16&15|64]+ir[t>>24&255]+`-`+ir[n&63|128]+ir[n>>8&255]+`-`+ir[n>>16&255]+ir[n>>24&255]+ir[r&255]+ir[r>>8&255]+ir[r>>16&255]+ir[r>>24&255]).toLowerCase()}function W(e,t,n){return Math.max(t,Math.min(n,e))}function cr(e,t){return(e%t+t)%t}function lr(e,t,n){return(1-n)*e+n*t}function ur(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function dr(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function fr(e,t){if(t.constructor===Float32Array)return e;let n=dr(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function pr(e,t){if(t.constructor===Float32Array)return e;let n=dr(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var G=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},mr=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:H(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(W(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},K=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(gr.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(gr.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return hr.copy(this).projectOnVector(e),this.sub(hr)}reflect(e){return this.sub(hr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(W(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},hr=new K,gr=new mr,q=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return er(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(_r.makeScale(e,t)),this}rotate(e){return er(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(_r.makeRotation(-e)),this}translate(e,t){return er(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(_r.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},_r=new q,vr=new q().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),yr=new q().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function br(){let e={enabled:!0,workingColorSpace:Vn,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=xr(e.r),e.g=xr(e.g),e.b=xr(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Sr(e.r),e.g=Sr(e.g),e.b=Sr(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?Hn:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[Vn]:{primaries:t,whitePoint:r,transfer:Hn,toXYZ:vr,fromXYZ:yr,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Bn},outputColorSpaceConfig:{drawingBufferColorSpace:Bn}},[Bn]:{primaries:t,whitePoint:r,transfer:Un,toXYZ:vr,fromXYZ:yr,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Bn}}}),e}var J=br();function xr(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Sr(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var Cr,wr=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Cr===void 0&&(Cr=Yn(`canvas`)),Cr.width=e.width,Cr.height=e.height;let t=Cr.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=Cr}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=Yn(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=xr(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(xr(t[e]/255)*255):t[e]=xr(t[e]);return{data:t,width:e.width,height:e.height}}return H(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},Tr=0,Er=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Tr++}),this.uuid=sr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(Dr(r[t].image)):e.push(Dr(r[t]))}else e=Dr(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function Dr(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?wr.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(H(`Texture: Unable to serialize Texture.`),{})}var Or=0,kr=new K,Ar=class e extends rr{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=_t,i=_t,a=St,o=wt,s=Bt,c=Tt,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Or++}),this.uuid=sr(),this.name=``,this.source=new Er(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new G(0,0),this.repeat=new G(1,1),this.center=new G(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new q,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(kr).x}get height(){return this.source.getSize(kr).y}get depth(){return this.source.getSize(kr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){H(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gt:e.x-=Math.floor(e.x);break;case _t:e.x=e.x<0?0:1;break;case vt:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case gt:e.y-=Math.floor(e.y);break;case _t:e.y=e.y<0?0:1;break;case vt:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Ar.DEFAULT_IMAGE=null,Ar.DEFAULT_MAPPING=300,Ar.DEFAULT_ANISOTROPY=1;var jr=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=W(this.x,e.x,t.x),this.y=W(this.y,e.y,t.y),this.z=W(this.z,e.z,t.z),this.w=W(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=W(this.x,e,t),this.y=W(this.y,e,t),this.z=W(this.z,e,t),this.w=W(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(W(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Mr=class extends rr{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:St,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new jr(0,0,e,t),this.scissorTest=!1,this.viewport=new jr(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new Ar({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:St,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new Er(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Nr=class extends Mr{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Pr=class extends Ar{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=_t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},Fr=class extends Ar{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=yt,this.minFilter=yt,this.wrapR=_t,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},Ir=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/Lr.setFromMatrixColumn(e,0).length(),i=1/Lr.setFromMatrixColumn(e,1).length(),a=1/Lr.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(zr,e,Br)}lookAt(e,t,n){let r=this.elements;return Ur.subVectors(e,t),Ur.lengthSq()===0&&(Ur.z=1),Ur.normalize(),Vr.crossVectors(n,Ur),Vr.lengthSq()===0&&(Math.abs(n.z)===1?Ur.x+=1e-4:Ur.z+=1e-4,Ur.normalize(),Vr.crossVectors(n,Ur)),Vr.normalize(),Hr.crossVectors(Ur,Vr),r[0]=Vr.x,r[4]=Hr.x,r[8]=Ur.x,r[1]=Vr.y,r[5]=Hr.y,r[9]=Ur.y,r[2]=Vr.z,r[6]=Hr.z,r[10]=Ur.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],ee=r[11],F=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*ee,i[12]=a*w+o*O+s*M+c*F,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*ee,i[13]=l*w+u*O+d*M+f*F,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*ee,i[14]=p*w+m*O+h*M+g*F,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*ee,i[15]=_*w+v*O+y*M+b*F,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=Lr.set(r[0],r[1],r[2]).length(),o=Lr.set(r[4],r[5],r[6]).length(),s=Lr.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Rr.copy(this);let c=1/a,l=1/o,u=1/s;return Rr.elements[0]*=c,Rr.elements[1]*=c,Rr.elements[2]*=c,Rr.elements[4]*=l,Rr.elements[5]*=l,Rr.elements[6]*=l,Rr.elements[8]*=u,Rr.elements[9]*=u,Rr.elements[10]*=u,t.setFromRotationMatrix(Rr),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=Kn,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=Kn,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},Lr=new K,Rr=new Ir,zr=new K(0,0,0),Br=new K(1,1,1),Vr=new K,Hr=new K,Ur=new K,Wr=new Ir,Gr=new mr,Kr=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(W(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-W(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(W(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-W(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(W(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-W(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:H(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Wr.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Wr,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Gr.setFromEuler(this),this.setFromQuaternion(Gr,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Kr.DEFAULT_ORDER=`XYZ`;var qr=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Jr=0,Yr=new K,Xr=new mr,Zr=new Ir,Qr=new K,$r=new K,ei=new K,ti=new mr,ni=new K(1,0,0),ri=new K(0,1,0),ii=new K(0,0,1),ai={type:`added`},oi={type:`removed`},si={type:`childadded`,child:null},ci={type:`childremoved`,child:null},li=class e extends rr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Jr++}),this.uuid=sr(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new K,n=new Kr,r=new mr,i=new K(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ir},normalMatrix:{value:new q}}),this.matrix=new Ir,this.matrixWorld=new Ir,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xr.setFromAxisAngle(e,t),this.quaternion.multiply(Xr),this}rotateOnWorldAxis(e,t){return Xr.setFromAxisAngle(e,t),this.quaternion.premultiply(Xr),this}rotateX(e){return this.rotateOnAxis(ni,e)}rotateY(e){return this.rotateOnAxis(ri,e)}rotateZ(e){return this.rotateOnAxis(ii,e)}translateOnAxis(e,t){return Yr.copy(e).applyQuaternion(this.quaternion),this.position.add(Yr.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ni,e)}translateY(e){return this.translateOnAxis(ri,e)}translateZ(e){return this.translateOnAxis(ii,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zr.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Qr.copy(e):Qr.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),$r.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zr.lookAt($r,Qr,this.up):Zr.lookAt(Qr,$r,this.up),this.quaternion.setFromRotationMatrix(Zr),r&&(Zr.extractRotation(r.matrixWorld),Xr.setFromRotationMatrix(Zr),this.quaternion.premultiply(Xr.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(U(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ai),si.child=e,this.dispatchEvent(si),si.child=null):U(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(oi),ci.child=e,this.dispatchEvent(ci),ci.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ai),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($r,e,ei),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose($r,ti,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};li.DEFAULT_UP=new K(0,1,0),li.DEFAULT_MATRIX_AUTO_UPDATE=!0,li.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ui=class extends li{constructor(){super(),this.isGroup=!0,this.type=`Group`}},di={type:`move`},fi=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ui,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ui,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new K,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new K),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ui,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new K,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new K,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(di)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ui;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},pi={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mi={h:0,s:0,l:0},hi={h:0,s:0,l:0};function gi(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var Y=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Bn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,J.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=J.workingColorSpace){return this.r=e,this.g=t,this.b=n,J.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=J.workingColorSpace){if(e=cr(e,1),t=W(t,0,1),n=W(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=gi(i,r,e+1/3),this.g=gi(i,r,e),this.b=gi(i,r,e-1/3)}return J.colorSpaceToWorking(this,r),this}setStyle(e,t=Bn){function n(t){t!==void 0&&parseFloat(t)<1&&H(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:H(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);H(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Bn){let n=pi[e.toLowerCase()];return n===void 0?H(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=xr(e.r),this.g=xr(e.g),this.b=xr(e.b),this}copyLinearToSRGB(e){return this.r=Sr(e.r),this.g=Sr(e.g),this.b=Sr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Bn){return J.workingToColorSpace(_i.copy(this),e),Math.round(W(_i.r*255,0,255))*65536+Math.round(W(_i.g*255,0,255))*256+Math.round(W(_i.b*255,0,255))}getHexString(e=Bn){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=J.workingColorSpace){J.workingToColorSpace(_i.copy(this),t);let n=_i.r,r=_i.g,i=_i.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=J.workingColorSpace){return J.workingToColorSpace(_i.copy(this),t),e.r=_i.r,e.g=_i.g,e.b=_i.b,e}getStyle(e=Bn){J.workingToColorSpace(_i.copy(this),e);let t=_i.r,n=_i.g,r=_i.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(mi),this.setHSL(mi.h+e,mi.s+t,mi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(mi),e.getHSL(hi);let n=lr(mi.h,hi.h,t),r=lr(mi.s,hi.s,t),i=lr(mi.l,hi.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},_i=new Y;Y.NAMES=pi;var vi=class e{constructor(e,t=1,n=1e3){this.isFog=!0,this.name=``,this.color=new Y(e),this.near=t,this.far=n}clone(){return new e(this.color,this.near,this.far)}toJSON(){return{type:`Fog`,name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},yi=class extends li{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Kr,this.environmentIntensity=1,this.environmentRotation=new Kr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},bi=new K,xi=new K,Si=new K,Ci=new K,wi=new K,Ti=new K,Ei=new K,Di=new K,Oi=new K,ki=new K,Ai=new jr,ji=new jr,Mi=new jr,Ni=class e{constructor(e=new K,t=new K,n=new K){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),bi.subVectors(e,t),r.cross(bi);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){bi.subVectors(r,t),xi.subVectors(n,t),Si.subVectors(e,t);let a=bi.dot(bi),o=bi.dot(xi),s=bi.dot(Si),c=xi.dot(xi),l=xi.dot(Si),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Ci)!==null&&Ci.x>=0&&Ci.y>=0&&Ci.x+Ci.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Ci)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Ci.x),s.addScaledVector(a,Ci.y),s.addScaledVector(o,Ci.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return Ai.setScalar(0),ji.setScalar(0),Mi.setScalar(0),Ai.fromBufferAttribute(e,t),ji.fromBufferAttribute(e,n),Mi.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Ai,i.x),a.addScaledVector(ji,i.y),a.addScaledVector(Mi,i.z),a}static isFrontFacing(e,t,n,r){return bi.subVectors(n,t),xi.subVectors(e,t),bi.cross(xi).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bi.subVectors(this.c,this.b),xi.subVectors(this.a,this.b),bi.cross(xi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;wi.subVectors(r,n),Ti.subVectors(i,n),Di.subVectors(e,n);let s=wi.dot(Di),c=Ti.dot(Di);if(s<=0&&c<=0)return t.copy(n);Oi.subVectors(e,r);let l=wi.dot(Oi),u=Ti.dot(Oi);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(wi,a);ki.subVectors(e,i);let f=wi.dot(ki),p=Ti.dot(ki);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(Ti,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return Ei.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(Ei,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(wi,a).addScaledVector(Ti,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Pi=class{constructor(e=new K(1/0,1/0,1/0),t=new K(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Ii):Ii.fromBufferAttribute(r,t),Ii.applyMatrix4(e.matrixWorld),this.expandByPoint(Ii);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),Li.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Li.copy(e.boundingBox)),Li.applyMatrix4(e.matrixWorld),this.union(Li)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ii),Ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wi),Gi.subVectors(this.max,Wi),Ri.subVectors(e.a,Wi),zi.subVectors(e.b,Wi),Bi.subVectors(e.c,Wi),Vi.subVectors(zi,Ri),Hi.subVectors(Bi,zi),Ui.subVectors(Ri,Bi);let t=[0,-Vi.z,Vi.y,0,-Hi.z,Hi.y,0,-Ui.z,Ui.y,Vi.z,0,-Vi.x,Hi.z,0,-Hi.x,Ui.z,0,-Ui.x,-Vi.y,Vi.x,0,-Hi.y,Hi.x,0,-Ui.y,Ui.x,0];return!Ji(t,Ri,zi,Bi,Gi)||(t=[1,0,0,0,1,0,0,0,1],!Ji(t,Ri,zi,Bi,Gi))?!1:(Ki.crossVectors(Vi,Hi),t=[Ki.x,Ki.y,Ki.z],Ji(t,Ri,zi,Bi,Gi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(Fi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Fi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Fi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Fi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Fi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Fi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Fi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Fi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Fi)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},Fi=[new K,new K,new K,new K,new K,new K,new K,new K],Ii=new K,Li=new Pi,Ri=new K,zi=new K,Bi=new K,Vi=new K,Hi=new K,Ui=new K,Wi=new K,Gi=new K,Ki=new K,qi=new K;function Ji(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){qi.fromArray(e,a);let o=i.x*Math.abs(qi.x)+i.y*Math.abs(qi.y)+i.z*Math.abs(qi.z),s=t.dot(qi),c=n.dot(qi),l=r.dot(qi);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Yi=new K,Xi=new G,Zi=0,Qi=class extends rr{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Zi++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=Gn,this.updateRanges=[],this.gpuType=jt,this.version=0,this._normalizationScale=e===void 0?void 0:dr(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Xi.fromBufferAttribute(this,t),Xi.applyMatrix3(e),this.setXY(t,Xi.x,Xi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Yi.fromBufferAttribute(this,t),Yi.applyMatrix3(e),this.setXYZ(t,Yi.x,Yi.y,Yi.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Yi.fromBufferAttribute(this,t),Yi.applyMatrix4(e),this.setXYZ(t,Yi.x,Yi.y,Yi.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Yi.fromBufferAttribute(this,t),Yi.applyNormalMatrix(e),this.setXYZ(t,Yi.x,Yi.y,Yi.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Yi.fromBufferAttribute(this,t),Yi.transformDirection(e),this.setXYZ(t,Yi.x,Yi.y,Yi.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?fr(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?pr(e,this.array):Math.round(e*t)}},$i=class extends Qi{constructor(e,t,n){super(new Uint16Array(e),t,n)}},ea=class extends Qi{constructor(e,t,n){super(new Uint32Array(e),t,n)}},ta=class extends Qi{constructor(e,t,n){super(new Float32Array(e),t,n)}},na=new Pi,ra=new K,ia=new K,aa=class{constructor(e=new K,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?na.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ra.subVectors(e,this.center);let t=ra.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(ra,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ia.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ra.copy(e.center).add(ia)),this.expandByPoint(ra.copy(e.center).sub(ia))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},oa=0,sa=new Ir,ca=new li,la=new K,ua=new Pi,da=new Pi,fa=new K,pa=class e extends rr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:oa++}),this.uuid=sr(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(qn(e)?ea:$i)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new q().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return sa.makeRotationFromQuaternion(e),this.applyMatrix4(sa),this}rotateX(e){return sa.makeRotationX(e),this.applyMatrix4(sa),this}rotateY(e){return sa.makeRotationY(e),this.applyMatrix4(sa),this}rotateZ(e){return sa.makeRotationZ(e),this.applyMatrix4(sa),this}translate(e,t,n){return sa.makeTranslation(e,t,n),this.applyMatrix4(sa),this}scale(e,t,n){return sa.makeScale(e,t,n),this.applyMatrix4(sa),this}lookAt(e){return ca.lookAt(e),ca.updateMatrix(),this.applyMatrix4(ca.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(la).negate(),this.translate(la.x,la.y,la.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new ta(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&H(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new K(-1/0,-1/0,-1/0),new K(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ua.setFromBufferAttribute(n),this.morphTargetsRelative?(fa.addVectors(this.boundingBox.min,ua.min),this.boundingBox.expandByPoint(fa),fa.addVectors(this.boundingBox.max,ua.max),this.boundingBox.expandByPoint(fa)):(this.boundingBox.expandByPoint(ua.min),this.boundingBox.expandByPoint(ua.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&U(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new aa);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)U(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new K,1/0);else if(e){let n=this.boundingSphere.center;if(ua.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];da.setFromBufferAttribute(n),this.morphTargetsRelative?(fa.addVectors(ua.min,da.min),ua.expandByPoint(fa),fa.addVectors(ua.max,da.max),ua.expandByPoint(fa)):(ua.expandByPoint(da.min),ua.expandByPoint(da.max))}ua.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)fa.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(fa));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)fa.fromBufferAttribute(a,t),o&&(la.fromBufferAttribute(e,t),fa.add(la)),r=Math.max(r,n.distanceToSquared(fa))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&U(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){U(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Qi(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new K,s[e]=new K;let l=new K,u=new K,d=new K,f=new G,p=new G,m=new G,h=new K,g=new K;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new K,b=new K,x=new K,S=new K;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Qi(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new K,i=new K,a=new K,o=new K,s=new K,c=new K,l=new K,u=new K;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)fa.fromBufferAttribute(e,t),fa.normalize(),e.setXYZ(t,fa.x,fa.y,fa.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Qi(a,r,i)}if(this.index===null)return H(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ma=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=Gn,this.updateRanges=[],this.version=0,this.uuid=sr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=ha(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(n,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=ha(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function ha(e){return e.buffer._uuid===void 0&&(e.buffer._uuid=sr()),e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer._uuid:e.buffer._uuid+`:`+e.byteOffset+`:`+e.byteLength}var ga=new K,_a=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r,this._normalizationScale=e===void 0?void 0:dr(e.array)}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)ga.fromBufferAttribute(this,t),ga.applyMatrix4(e),this.setXYZ(t,ga.x,ga.y,ga.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)ga.fromBufferAttribute(this,t),ga.applyNormalMatrix(e),this.setXYZ(t,ga.x,ga.y,ga.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)ga.fromBufferAttribute(this,t),ga.transformDirection(e),this.setXYZ(t,ga.x,ga.y,ga.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){Qn(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new Qi(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Qn(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t===void 0?fr(e,this.data.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?pr(e,this.data.array):Math.round(e*t)}},va=new K,ya=new K,ba=new q,xa=class{constructor(e=new K(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=va.subVectors(n,t).cross(ya.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(va),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ba.getNormalMatrix(e),r=this.coplanarPoint(va).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Sa=0,Ca=class extends rr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sa++}),this.uuid=sr(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Y(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wn,this.stencilZFail=Wn,this.stencilZPass=Wn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){H(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?H(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Y().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new xa().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new G().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new G().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},wa=class extends Ca{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new Y(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ta,Ea=new K,Da=new K,Oa=new K,ka=new G,Aa=new G,ja=new Ir,Ma=new K,Na=new K,Pa=new K,Fa=new G,Ia=new G,La=new G,Ra=class extends li{constructor(e=new wa){if(super(),this.isSprite=!0,this.type=`Sprite`,Ta===void 0){Ta=new pa;let e=new ma(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Ta.setIndex([0,1,2,0,2,3]),Ta.setAttribute(`position`,new _a(e,3,0,!1)),Ta.setAttribute(`uv`,new _a(e,2,3,!1))}this.geometry=Ta,this.material=e,this.center=new G(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&U(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),Da.setFromMatrixScale(this.matrixWorld),ja.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Oa.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Da.multiplyScalar(-Oa.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;za(Ma.set(-.5,-.5,0),Oa,a,Da,r,i),za(Na.set(.5,-.5,0),Oa,a,Da,r,i),za(Pa.set(.5,.5,0),Oa,a,Da,r,i),Fa.set(0,0),Ia.set(1,0),La.set(1,1);let o=e.ray.intersectTriangle(Ma,Na,Pa,!1,Ea);if(o===null&&(za(Na.set(-.5,.5,0),Oa,a,Da,r,i),Ia.set(0,1),o=e.ray.intersectTriangle(Ma,Pa,Na,!1,Ea),o===null))return;let s=e.ray.origin.distanceTo(Ea);s<e.near||s>e.far||t.push({distance:s,point:Ea.clone(),uv:Ni.getInterpolation(Ea,Ma,Na,Pa,Fa,Ia,La,new G),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function za(e,t,n,r,i,a){ka.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?Aa.copy(ka):(Aa.x=a*ka.x-i*ka.y,Aa.y=i*ka.x+a*ka.y),e.copy(t),e.x+=Aa.x,e.y+=Aa.y,e.applyMatrix4(ja)}var Ba=new K,Va=new K,Ha=new K,Ua=new K,Wa=class{constructor(e=new K,t=new K(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ba)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=Ba.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ba.copy(this.origin).addScaledVector(this.direction,t),Ba.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){Va.copy(e).add(t).multiplyScalar(.5),Ha.copy(t).sub(e).normalize(),Ua.copy(this.origin).sub(Va);let i=e.distanceTo(t)*.5,a=-this.direction.dot(Ha),o=Ua.dot(this.direction),s=-Ua.dot(Ha),c=Ua.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(Va).addScaledVector(Ha,d),f}intersectSphere(e,t){if(e.radius<0)return null;Ba.subVectors(e.center,this.origin);let n=Ba.dot(this.direction),r=Ba.dot(Ba)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,Ba)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,ee=C/w,F=1/w,te=T-P*D,ne=E-ee*D,re=O-P*A,ie=k-ee*A,ae=j-P*N,oe=M-ee*N,I=ae*ie-oe*re,se=te*oe-ne*ae,ce=re*ne-ie*te;if(r){if(I<0||se<0||ce<0)return null}else if((I<0||se<0||ce<0)&&(I>0||se>0||ce>0))return null;let le=I+se+ce;if(le===0)return null;let ue=F*(I*D+se*A+ce*N);return(le>0?ue<0:ue>0)?null:this.at(ue/le,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ga=class extends Ca{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new Y(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kr,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},Ka=new Ir,qa=new Wa,Ja=new aa,Ya=new K,Xa=new K,Za=new K,Qa=new K,$a=new K,eo=new K,to=new K,no=new K,X=class extends li{constructor(e=new pa,t=new Ga){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){eo.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&($a.fromBufferAttribute(s,e),a?eo.addScaledVector($a,r):eo.addScaledVector($a.sub(t),r))}t.add(eo)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ja.copy(n.boundingSphere),Ja.applyMatrix4(i),qa.copy(e.ray).recast(e.near),Ja.containsPoint(qa.origin)===!1&&(qa.intersectSphere(Ja,Ya)===null||qa.origin.distanceToSquared(Ya)>(e.far-e.near)**2)||(Ka.copy(i).invert(),qa.copy(e.ray).applyMatrix4(Ka),(n.boundingBox===null||qa.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,qa)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=io(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=io(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=io(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=io(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function ro(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;no.copy(s),no.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(no);return l<n.near||l>n.far?null:{distance:l,point:no.clone(),object:e}}function io(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Xa),e.getVertexPosition(c,Za),e.getVertexPosition(l,Qa);let u=ro(e,t,n,r,Xa,Za,Qa,to);if(u){let e=new K;Ni.getBarycoord(to,Xa,Za,Qa,e),i&&(u.uv=Ni.getInterpolatedAttribute(i,s,c,l,e,new G)),a&&(u.uv1=Ni.getInterpolatedAttribute(a,s,c,l,e,new G)),o&&(u.normal=Ni.getInterpolatedAttribute(o,s,c,l,e,new K),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new K,materialIndex:0};Ni.getNormal(Xa,Za,Qa,t.normal),u.face=t,u.barycoord=e}return u}var ao=class extends Ar{constructor(e=null,t=1,n=1,r,i,a,o,s,c=yt,l=yt,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},oo=new aa,so=new G(.5,.5),co=new K,lo=class{constructor(e=new xa,t=new xa,n=new xa,r=new xa,i=new xa,a=new xa){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Kn,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),oo.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),oo.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(oo)}intersectsSprite(e){return oo.center.set(0,0,0),oo.radius=.7071067811865476+so.distanceTo(e.center),oo.applyMatrix4(e.matrixWorld),this.intersectsSphere(oo)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(co.x=r.normal.x>0?e.max.x:e.min.x,co.y=r.normal.y>0?e.max.y:e.min.y,co.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(co)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},uo=new Ir,fo=class e{constructor(){this.coordinateSystem=Kn,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];uo.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new lo),n[e].setFromProjectionMatrix(uo,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new lo),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},po=class extends Ar{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},mo=class extends Ar{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},ho=class extends Ar{constructor(e,t,n=At,r,i,a,o=yt,s=yt,c,l=Vt,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Er(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},go=class extends ho{constructor(e,t=At,n=301,r,i,a=yt,o=yt,s,c=Vt){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},_o=class extends Ar{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},vo=class e extends pa{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new ta(c,3)),this.setAttribute(`normal`,new ta(l,3)),this.setAttribute(`uv`,new ta(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new K;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},yo=class e extends pa{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new K,g=new K;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new ta(o,3)),this.setAttribute(`normal`,new ta(s,3)),this.setAttribute(`uv`,new ta(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},bo=class e extends pa{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new K,l=new G;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new ta(a,3)),this.setAttribute(`normal`,new ta(o,3)),this.setAttribute(`uv`,new ta(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},xo=class e extends pa{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new ta(u,3)),this.setAttribute(`normal`,new ta(d,3)),this.setAttribute(`uv`,new ta(f,2));function _(){let a=new K,_=new K,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new G,m=new K,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},So=class e extends pa{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new ta(p,3)),this.setAttribute(`normal`,new ta(m,3)),this.setAttribute(`uv`,new ta(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},Co=class e extends pa{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new K,p=new G;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new ta(s,3)),this.setAttribute(`normal`,new ta(c,3)),this.setAttribute(`uv`,new ta(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},wo=class e extends pa{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new K,d=new K,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new ta(p,3)),this.setAttribute(`normal`,new ta(m,3)),this.setAttribute(`uv`,new ta(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},To=class e extends pa{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new K,f=new K,p=new K;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new ta(c,3)),this.setAttribute(`normal`,new ta(l,3)),this.setAttribute(`uv`,new ta(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}},Eo=class extends Ca{constructor(e){super(),this.isShadowMaterial=!0,this.type=`ShadowMaterial`,this.color=new Y(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function Do(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ko(i))i.isRenderTargetTexture?(H(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ko(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Oo(e){let t={};for(let n=0;n<e.length;n++){let r=Do(e[n]);for(let e in r)t[e]=r[e]}return t}function ko(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ao(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function jo(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:J.workingColorSpace}var Mo={clone:Do,merge:Oo},No=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Po=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Fo=class extends Ca{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=No,this.fragmentShader=Po,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Do(e.uniforms),this.uniformsGroups=Ao(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new Y().setHex(r.value);break;case`v2`:this.uniforms[n].value=new G().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new K().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new jr().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new q().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new Ir().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Io=class extends Fo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Lo=class extends Ca{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new Y(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Y(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new G(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Kr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Ro=class extends Ca{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Rn,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},zo=class extends Ca{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Bo(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Vo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ho=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Uo=class extends Ho{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Fn,endingEnd:Fn}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case In:i=e,o=2*t-n;break;case Ln:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case In:a=e,s=2*n-t;break;case Ln:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Wo=class extends Ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Go=class extends Ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},Ko=class extends Ho{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Yo(n,t,g,y,r);i[p]=qo(x,o,_,b,m)}return i}};function qo(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Jo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Yo(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=qo(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Jo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Xo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Bo(t,this.TimeBufferType),this.values=Bo(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bo(e.times,Array),values:Bo(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Vo(e.settings)&&(n.settings={inTangents:Bo(e.settings.inTangents,Array),outTangents:Bo(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Go(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Wo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Ko(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case jn:t=this.InterpolantFactoryMethodDiscrete;break;case Mn:t=this.InterpolantFactoryMethodLinear;break;case Nn:t=this.InterpolantFactoryMethodSmooth;break;case Pn:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return H(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jn;case this.InterpolantFactoryMethodLinear:return Mn;case this.InterpolantFactoryMethodSmooth:return Nn;case this.InterpolantFactoryMethodBezier:return Pn}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;Vo(this.settings)&&(Zo(this.settings.inTangents,e),Zo(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Vo(this.settings)&&(Qo(this.settings.inTangents,e),Qo(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(U(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(U(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){U(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){U(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&Jn(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){U(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===Nn,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Vo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Zo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function Qo(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Xo.prototype.ValueTypeName=``,Xo.prototype.TimeBufferType=Float32Array,Xo.prototype.ValueBufferType=Float32Array,Xo.prototype.DefaultInterpolation=Mn;var $o=class extends Xo{constructor(e,t,n){super(e,t,n)}};$o.prototype.ValueTypeName=`bool`,$o.prototype.ValueBufferType=Array,$o.prototype.DefaultInterpolation=jn,$o.prototype.InterpolantFactoryMethodLinear=void 0,$o.prototype.InterpolantFactoryMethodSmooth=void 0;var es=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}};es.prototype.ValueTypeName=`color`;var ts=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}};ts.prototype.ValueTypeName=`number`;var ns=class extends Ho{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)mr.slerpFlat(i,0,a,c-o,a,c,s);return i}},rs=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new ns(this.times,this.values,this.getValueSize(),e)}};rs.prototype.ValueTypeName=`quaternion`,rs.prototype.InterpolantFactoryMethodSmooth=void 0;var is=class extends Xo{constructor(e,t,n){super(e,t,n)}};is.prototype.ValueTypeName=`string`,is.prototype.ValueBufferType=Array,is.prototype.DefaultInterpolation=jn,is.prototype.InterpolantFactoryMethodLinear=void 0,is.prototype.InterpolantFactoryMethodSmooth=void 0;var as=class extends Xo{constructor(e,t,n,r){super(e,t,n,r)}};as.prototype.ValueTypeName=`vector`;var os={enabled:!1,files:{},add:function(e,t){this.enabled!==!1&&(ss(e)||(this.files[e]=t))},get:function(e){if(this.enabled!==!1&&!ss(e))return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function ss(e){try{let t=e.slice(e.indexOf(`:`)+1);return new URL(t).protocol===`blob:`}catch{return!1}}var cs=new class{constructor(e,t,n){let r=this,i=!1,a=0,o=0,s,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(e){o++,i===!1&&r.onStart!==void 0&&r.onStart(e,a,o),i=!0},this.itemEnd=function(e){a++,r.onProgress!==void 0&&r.onProgress(e,a,o),a===o&&(i=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(e){r.onError!==void 0&&r.onError(e)},this.resolveURL=function(e){return e=e.normalize(`NFC`),s?s(e):e},this.setURLModifier=function(e){return s=e,this},this.addHandler=function(e,t){return c.push(e,t),this},this.removeHandler=function(e){let t=c.indexOf(e);return t!==-1&&c.splice(t,2),this},this.getHandler=function(e){for(let t=0,n=c.length;t<n;t+=2){let n=c[t],r=c[t+1];if(n.global&&(n.lastIndex=0),n.test(e))return r}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||=new AbortController,this._abortController}},ls=class{constructor(e){this.manager=e===void 0?cs:e,this.crossOrigin=`anonymous`,this.withCredentials=!1,this.path=``,this.resourcePath=``,this.requestHeader={},this.priority=`auto`,this.cache=`default`,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(r,i){n.load(e,r,t,i)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}};ls.DEFAULT_MATERIAL_NAME=`__DEFAULT`;var us=new WeakMap,ds=class extends ls{constructor(e){super(e)}load(e,t,n,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let i=this,a=os.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)i.manager.itemStart(e),setTimeout(function(){t&&t(a),i.manager.itemEnd(e)},0);else{let e=us.get(a);e===void 0&&(e=[],us.set(a,e)),e.push({onLoad:t,onError:r})}return a}let o=Yn(`img`);function s(){l(),t&&t(this);let n=us.get(this)||[];for(let e=0;e<n.length;e++){let t=n[e];t.onLoad&&t.onLoad(this)}us.delete(this),i.manager.itemEnd(e)}function c(t){l(),r&&r(t),os.remove(`image:${e}`);let n=us.get(this)||[];for(let e=0;e<n.length;e++){let r=n[e];r.onError&&r.onError(t)}us.delete(this),i.manager.itemError(e),i.manager.itemEnd(e)}function l(){o.removeEventListener(`load`,s,!1),o.removeEventListener(`error`,c,!1)}return o.addEventListener(`load`,s,!1),o.addEventListener(`error`,c,!1),e.slice(0,5)!==`data:`&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),os.add(`image:${e}`,o),i.manager.itemStart(e),o.fetchPriority=this.priority,o.src=e,o}},fs=class extends ls{constructor(e){super(e)}load(e,t,n,r){let i=new Ar,a=new ds(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(e){i.image=e,i.needsUpdate=!0,t!==void 0&&t(i)},n,r),i}},ps=class extends li{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new Y(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},ms=class extends ps{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(li.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Y(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},hs=new Ir,gs=new K,_s=new K,vs=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new G(512,512),this.mapType=Tt,this.map=null,this.mapPass=null,this.matrix=new Ir,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lo,this._frameExtents=new G(1,1),this._viewportCount=1,this._viewports=[new jr(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;gs.setFromMatrixPosition(e.matrixWorld),t.position.copy(gs),_s.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_s),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){hs.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(hs,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(hs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ys=new K,bs=new mr,xs=new K,Ss=class extends li{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new Ir,this.projectionMatrix=new Ir,this.projectionMatrixInverse=new Ir,this.coordinateSystem=Kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ys,bs,xs),xs.x===1&&xs.y===1&&xs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ys,bs,xs.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ys,bs,xs),xs.x===1&&xs.y===1&&xs.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ys,bs,xs.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Cs=new K,ws=new G,Ts=new G,Es=class extends Ss{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=or*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ar*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return or*2*Math.atan(Math.tan(ar*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Cs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Cs.x,Cs.y).multiplyScalar(-e/Cs.z),Cs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Cs.x,Cs.y).multiplyScalar(-e/Cs.z)}getViewSize(e,t){return this.getViewBounds(e,ws,Ts),t.subVectors(Ts,ws)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ar*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},Ds=class extends vs{constructor(){super(new Es(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=or*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height*this.aspect,i=e.distance||t.far;(n!==t.fov||r!==t.aspect||i!==t.far)&&(t.fov=n,t.aspect=r,t.far=i,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},Os=class extends ps{constructor(e,t,n=0,r=Math.PI/3,i=0,a=2){super(e,t),this.isSpotLight=!0,this.type=`SpotLight`,this.position.copy(li.DEFAULT_UP),this.updateMatrix(),this.target=new li,this.distance=n,this.angle=r,this.penumbra=i,this.decay=a,this.map=null,this.shadow=new Ds}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},ks=class extends Ss{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},As=class extends vs{constructor(){super(new ks(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},js=class extends ps{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(li.DEFAULT_UP),this.updateMatrix(),this.target=new li,this.shadow=new As}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ms=-90,Ns=1,Ps=class extends li{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Es(Ms,Ns,e,t);r.layers=this.layers,this.add(r);let i=new Es(Ms,Ns,e,t);i.layers=this.layers,this.add(i);let a=new Es(Ms,Ns,e,t);a.layers=this.layers,this.add(a);let o=new Es(Ms,Ns,e,t);o.layers=this.layers,this.add(o);let s=new Es(Ms,Ns,e,t);s.layers=this.layers,this.add(s);let c=new Es(Ms,Ns,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Fs=class extends Es{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},Is=`\\[\\]\\.:\\/`,Ls=RegExp(`[\\[\\]\\.:\\/]`,`g`),Rs=`[^\\[\\]\\.:\\/]`,zs=`[^`+Is.replace(`\\.`,``)+`]`,Bs=`((?:WC+[\\/:])*)`.replace(`WC`,Rs),Vs=`(WCOD+)?`.replace(`WCOD`,zs),Hs=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Rs),Us=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Rs),Ws=RegExp(`^`+Bs+Vs+Hs+Us+`$`),Gs=[`material`,`materials`,`bones`,`map`],Ks=class{constructor(e,t,n){let r=n||qs.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},qs=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Ls,``)}static parseTrackName(e){let t=Ws.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Gs.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){H(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){U(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){U(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){U(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){U(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){U(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){U(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;U(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){U(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};qs.Composite=Ks,qs.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},qs.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},qs.prototype.GetterByBindingType=[qs.prototype._getValue_direct,qs.prototype._getValue_array,qs.prototype._getValue_arrayElement,qs.prototype._getValue_toArray],qs.prototype.SetterByBindingTypeAndVersioning=[[qs.prototype._setValue_direct,qs.prototype._setValue_direct_setNeedsUpdate,qs.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[qs.prototype._setValue_array,qs.prototype._setValue_array_setNeedsUpdate,qs.prototype._setValue_array_setMatrixWorldNeedsUpdate],[qs.prototype._setValue_arrayElement,qs.prototype._setValue_arrayElement_setNeedsUpdate,qs.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[qs.prototype._setValue_fromArray,qs.prototype._setValue_fromArray_setNeedsUpdate,qs.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Js(e,t,n,r){let i=Ys(r);switch(n){case Rt:return e*t;case Ut:return e*t/i.components*i.byteLength;case Wt:return e*t/i.components*i.byteLength;case Gt:return e*t*2/i.components*i.byteLength;case Kt:return e*t*2/i.components*i.byteLength;case zt:return e*t*3/i.components*i.byteLength;case Bt:return e*t*4/i.components*i.byteLength;case qt:return e*t*4/i.components*i.byteLength;case Jt:case Yt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Xt:case Zt:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case $t:case tn:return Math.max(e,16)*Math.max(t,8)/4;case Qt:case en:return Math.max(e,8)*Math.max(t,8)/2;case nn:case rn:case on:case sn:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case an:case cn:case ln:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case un:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case dn:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case fn:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case pn:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case mn:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case hn:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case gn:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case _n:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case vn:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case yn:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case bn:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case xn:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Sn:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Cn:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case wn:case Tn:case En:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Dn:case On:return Math.ceil(e/4)*Math.ceil(t/4)*8;case kn:case An:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Ys(e){switch(e){case Tt:case Et:return{byteLength:1,components:1};case Ot:case Dt:case Mt:return{byteLength:2,components:1};case Nt:case Pt:return{byteLength:2,components:4};case At:case kt:case jt:return{byteLength:4,components:1};case It:case Lt:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?H(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function Xs(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Zs(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new Y(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new q}},envmap:{envMap:{value:null},envMapRotation:{value:new q},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new q}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new q}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new q},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new q},normalScale:{value:new G(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new q},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new q}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new q}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new q}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Y(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Y(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0},uvTransform:{value:new q}},sprite:{diffuse:{value:new Y(16777215)},opacity:{value:1},center:{value:new G(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new q},alphaMap:{value:null},alphaMapTransform:{value:new q},alphaTest:{value:0}}},Qs={basic:{uniforms:Oo([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:Oo([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new Y(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:Oo([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new Y(0)},specular:{value:new Y(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:Oo([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new Y(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:Oo([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new Y(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:Oo([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:Oo([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:Oo([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:Oo([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:Oo([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:Oo([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new q},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new q}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:Oo([Q.common,Q.displacementmap,{referencePosition:{value:new K},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:Oo([Q.lights,Q.fog,{color:{value:new Y(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};Qs.physical={uniforms:Oo([Qs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new q},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new q},clearcoatNormalScale:{value:new G(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new q},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new q},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new q},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new q},sheen:{value:0},sheenColor:{value:new Y(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new q},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new q},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new q},transmissionSamplerSize:{value:new G},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new q},attenuationDistance:{value:0},attenuationColor:{value:new Y(0)},specularColor:{value:new Y(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new q},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new q},anisotropyVector:{value:new G},anisotropyMap:{value:null},anisotropyMapTransform:{value:new q}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var $s={r:0,b:0,g:0},ec=new Ir,tc=new q;tc.set(-1,0,0,0,1,0,0,0,1);function nc(e,t,n,r,i,a){let o=new Y(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new X(new vo(1,1,1),new Fo({name:`BackgroundCubeMaterial`,uniforms:Do(Qs.backgroundCube.uniforms),vertexShader:Qs.backgroundCube.vertexShader,fragmentShader:Qs.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(ec.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(tc),l.material.toneMapped=J.getTransfer(i.colorSpace)!==Un,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new X(new So(2,2),new Fo({name:`BackgroundMaterial`,uniforms:Do(Qs.background.uniforms),vertexShader:Qs.background.vertexShader,fragmentShader:Qs.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=J.getTransfer(i.colorSpace)!==Un,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB($s,jo(e)),n.buffers.color.setClear($s.r,$s.g,$s.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function rc(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function ic(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function ac(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(H(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&H(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&H(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function oc(e){let t=this,n=null,r=0,i=!1,a=!1,o=new xa,s=new q,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var sc=class extends Nr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new po(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new vo(5,5,5),i=new Fo({name:`CubemapFromEquirect`,uniforms:Do(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new X(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=St),new Ps(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},cc=256,lc=3,uc=20,dc=256,fc=16,pc=3,mc=new K,hc=new Y,gc=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Ps(1,10,null),this._boxMesh=new X(new vo(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=mc}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(hc));let h=new Ps(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(cc,ur(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?cc:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=_c(e,!1,!1),n=Math.log2(e)-lc;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=_c(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=Cc()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Sc()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=yc(),this._integrationMaterial=bc());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/fc);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-pc)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(dc*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=xc());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function _c(e,t,n){return new sc(e,{minFilter:wt,generateMipmaps:t,type:Mt,colorSpace:Vn,depthBuffer:n})}function vc(e,t,n){return new Fo({name:e,uniforms:t,vertexShader:Z.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function yc(){return vc(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${dc}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function bc(){return vc(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:fc}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function xc(){return vc(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${uc}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Sc(){return vc(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Cc(){return vc(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function wc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new sc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new gc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new gc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Tc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&er(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Ec(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?ea:$i)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function Dc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Oc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:U(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function kc(e,t,n){let r=new WeakMap,i=new jr;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new Pr(h,p,m,u);g.type=jt,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new G(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Ac(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var jc={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Mc(e,t,n,r,i,a){let o=new Nr(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new pa;u.setAttribute(`position`,new ta([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new ta([0,2,0,0,2,0],2));let d=new Io({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new X(u,d),p=new ks(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new Nr(t,n,{type:Mt,depthBuffer:!1,stencilBuffer:!1}),c=new Nr(t,n,{type:Mt,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new ho(t,n),a===!0&&(l.format=Ht,l.type=Ft)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},J.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=jc[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Nc=new Ar,Pc=new ho(1,1),Fc=new go(1),Ic=new Pr,Lc=new Fr,Rc=new po,zc=[],Bc=[],Vc=new Float32Array(16),Hc=new Float32Array(9),Uc=new Float32Array(4);function Wc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=zc[i];if(a===void 0&&(a=new Float32Array(i),zc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Gc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Kc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function qc(e,t){let n=Bc[t];n===void 0&&(n=new Int32Array(t),Bc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Jc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Yc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gc(n,t))return;e.uniform2fv(this.addr,t),Kc(n,t)}}function Xc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Gc(n,t))return;e.uniform3fv(this.addr,t),Kc(n,t)}}function Zc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gc(n,t))return;e.uniform4fv(this.addr,t),Kc(n,t)}}function Qc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Kc(n,t)}else{if(Gc(n,r))return;Uc.set(r),e.uniformMatrix2fv(this.addr,!1,Uc),Kc(n,r)}}function $c(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Kc(n,t)}else{if(Gc(n,r))return;Hc.set(r),e.uniformMatrix3fv(this.addr,!1,Hc),Kc(n,r)}}function el(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Gc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Kc(n,t)}else{if(Gc(n,r))return;Vc.set(r),e.uniformMatrix4fv(this.addr,!1,Vc),Kc(n,r)}}function tl(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function nl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gc(n,t))return;e.uniform2iv(this.addr,t),Kc(n,t)}}function rl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gc(n,t))return;e.uniform3iv(this.addr,t),Kc(n,t)}}function il(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gc(n,t))return;e.uniform4iv(this.addr,t),Kc(n,t)}}function al(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function ol(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Gc(n,t))return;e.uniform2uiv(this.addr,t),Kc(n,t)}}function sl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Gc(n,t))return;e.uniform3uiv(this.addr,t),Kc(n,t)}}function cl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Gc(n,t))return;e.uniform4uiv(this.addr,t),Kc(n,t)}}function ll(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function ul(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?ll(Pc):Nc,n.setTexture2D(t||a,i)}function dl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Lc,i)}function fl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?ll(Fc):Rc,n.setTextureCube(t||a,i)}function pl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Ic,i)}function ml(e){switch(e){case 5126:return Jc;case 35664:return Yc;case 35665:return Xc;case 35666:return Zc;case 35674:return Qc;case 35675:return $c;case 35676:return el;case 5124:case 35670:return tl;case 35667:case 35671:return nl;case 35668:case 35672:return rl;case 35669:case 35673:return il;case 5125:return al;case 36294:return ol;case 36295:return sl;case 36296:return cl;case 35678:case 36198:case 36298:case 36306:case 35682:return ul;case 35679:case 36299:case 36307:return dl;case 35680:case 36300:case 36308:case 36293:return fl;case 36289:case 36303:case 36311:case 36292:return pl}}function hl(e,t){e.uniform1fv(this.addr,t)}function gl(e,t){let n=Wc(t,this.size,2);e.uniform2fv(this.addr,n)}function _l(e,t){let n=Wc(t,this.size,3);e.uniform3fv(this.addr,n)}function vl(e,t){let n=Wc(t,this.size,4);e.uniform4fv(this.addr,n)}function yl(e,t){let n=Wc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function bl(e,t){let n=Wc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function xl(e,t){let n=Wc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function Sl(e,t){e.uniform1iv(this.addr,t)}function Cl(e,t){e.uniform2iv(this.addr,t)}function wl(e,t){e.uniform3iv(this.addr,t)}function Tl(e,t){e.uniform4iv(this.addr,t)}function El(e,t){e.uniform1uiv(this.addr,t)}function Dl(e,t){e.uniform2uiv(this.addr,t)}function Ol(e,t){e.uniform3uiv(this.addr,t)}function kl(e,t){e.uniform4uiv(this.addr,t)}function Al(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?ll(Pc):Nc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function jl(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Lc,a[e])}function Ml(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?ll(Fc):Rc;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Nl(e,t,n){let r=this.cache,i=t.length,a=qc(n,i);Gc(r,a)||(e.uniform1iv(this.addr,a),Kc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Ic,a[e])}function Pl(e){switch(e){case 5126:return hl;case 35664:return gl;case 35665:return _l;case 35666:return vl;case 35674:return yl;case 35675:return bl;case 35676:return xl;case 5124:case 35670:return Sl;case 35667:case 35671:return Cl;case 35668:case 35672:return wl;case 35669:case 35673:return Tl;case 5125:return El;case 36294:return Dl;case 36295:return Ol;case 36296:return kl;case 35678:case 36198:case 36298:case 36306:case 35682:return Al;case 35679:case 36299:case 36307:return jl;case 35680:case 36300:case 36308:case 36293:return Ml;case 36289:case 36303:case 36311:case 36292:return Nl}}var Fl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=ml(t.type)}},Il=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Pl(t.type)}},Ll=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Rl=/(\w+)(\])?(\[|\.)?/g;function zl(e,t){e.seq.push(t),e.map[t.id]=t}function Bl(e,t,n){let r=e.name,i=r.length;for(Rl.lastIndex=0;;){let a=Rl.exec(r),o=Rl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){zl(n,l===void 0?new Fl(s,e,t):new Il(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Ll(s),zl(n,e)),n=e}}}var Vl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Bl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Hl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Ul=37297,Wl=0;function Gl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Kl=new q;function ql(e){J._getMatrix(Kl,J.workingColorSpace,e);let t=`mat3( ${Kl.elements.map(e=>e.toFixed(4))} )`;switch(J.getTransfer(e)){case Hn:return[t,`LinearTransferOETF`];case Un:return[t,`sRGBTransferOETF`];default:return H(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Jl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Gl(e.getShaderSource(t),r)}return i}function Yl(e,t){let n=ql(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var Xl={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Zl(e,t){let n=Xl[t];return n===void 0?(H(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ql=new K;function $l(){return J.getLuminanceCoefficients(Ql),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ql.x.toFixed(4)}, ${Ql.y.toFixed(4)}, ${Ql.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function eu(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(ru).join(`
`)}function tu(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function nu(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function ru(e){return e!==``}function iu(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function au(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var ou=/^[ \t]*#include +<([\w\d./]+)>/gm;function su(e){return e.replace(ou,cu)}function cu(e,t){let n=Z[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return su(n)}var lu=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uu(e){return e.replace(lu,du)}function du(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function fu(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var pu={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function mu(e){return pu[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var hu={302:`ENVMAP_MODE_REFRACTION`};function gu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:hu[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var _u={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function vu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:_u[e.combine]||`ENVMAP_BLENDING_NONE`}function yu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=mu(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=gu(n),d=vu(n),f=eu(n),p=tu(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(ru).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(ru).join(`
`),g.length>0&&(g+=`
`)):(h=[fu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(ru).join(`
`),g=[fu(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:Zl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,Yl(`linearToOutputTexel`,n.outputColorSpace),$l(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(ru).join(`
`)),o=su(o),o=iu(o,n),o=au(o,n),s=su(s),s=iu(s,n),s=au(s,n),o=uu(o),s=uu(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=Hl(i,i.VERTEX_SHADER,v),x=Hl(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=Jl(i,b,`vertex`),n=Jl(i,x,`fragment`);U(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):H(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Vl(i,m),w=nu(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Ul)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Wl++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var bu=0,xu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Su(e),t.set(e,n)),n}},Su=class{constructor(e){this.id=bu++,this.code=e,this.usedTimes=0}};function Cu(e){return e===1030||e===37490||e===36285}function wu(e,t,n,r,i,a){let o=new qr,s=new xu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&H(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Qs[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),M=m.isInstancedMesh===!0,N=m.isBatchedMesh===!0,P=!!i.map,ee=!!i.matcap,F=!!b,te=F&&b.isPMREMTexture===!0,ne=!!i.aoMap,re=!!i.lightMap,ie=!!i.bumpMap&&i.wireframe===!1,ae=!!i.normalMap,oe=!!i.displacementMap,I=!!i.emissiveMap,se=!!i.metalnessMap,ce=!!i.roughnessMap,le=i.anisotropy>0,ue=i.clearcoat>0,de=i.diffuseRoughness>0,fe=i.dispersion>0,pe=i.retroreflectivity>0,me=i.iridescence>0,he=i.sheen>0,ge=i.transmission>0,_e=le&&!!i.anisotropyMap,ve=ue&&!!i.clearcoatMap,ye=ue&&!!i.clearcoatNormalMap,be=ue&&!!i.clearcoatRoughnessMap,xe=de&&!!i.diffuseRoughnessMap,L=me&&!!i.iridescenceMap,Se=me&&!!i.iridescenceThicknessMap,Ce=he&&!!i.sheenColorMap,we=he&&!!i.sheenRoughnessMap,R=!!i.specularMap,Te=!!i.specularColorMap,z=!!i.specularIntensityMap,B=ge&&!!i.transmissionMap,Ee=ge&&!!i.thicknessMap,De=!!i.gradientMap,Oe=!!i.alphaMap,ke=i.alphaTest>0,V=!!i.alphaHash,Ae=!!i.extensions,je=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(je=e.toneMapping);let Me=te?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Ne={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:N,batchingColor:N&&m._colorsTexture!==null,instancing:M,instancingColor:M&&m.instanceColor!==null,instancingMorph:M&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:J.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:P,matcap:ee,envMap:F,envMapMode:F&&b.mapping,envMapPMREM:te,envMapMaxLod:te?Me.length-1:null,envMapSize:te?Me[0].width:null,aoMap:ne,lightMap:re,bumpMap:ie,normalMap:ae,displacementMap:oe,emissiveMap:I,normalMapObjectSpace:ae&&i.normalMapType===1,normalMapTangentSpace:ae&&i.normalMapType===0,packedNormalMap:ae&&i.normalMapType===0&&Cu(i.normalMap.format),metalnessMap:se,roughnessMap:ce,anisotropy:le,anisotropyMap:_e,clearcoat:ue,clearcoatMap:ve,clearcoatNormalMap:ye,clearcoatRoughnessMap:be,diffuseRoughness:de,diffuseRoughnessMap:xe,dispersion:fe,retroreflection:pe,iridescence:me,iridescenceMap:L,iridescenceThicknessMap:Se,sheen:he,sheenColorMap:Ce,sheenRoughnessMap:we,specularMap:R,specularColorMap:Te,specularIntensityMap:z,transmission:ge,transmissionMap:B,thicknessMap:Ee,gradientMap:De,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Oe,alphaTest:ke,alphaHash:V,combine:i.combine,mapUv:P&&p(i.map.channel),aoMapUv:ne&&p(i.aoMap.channel),lightMapUv:re&&p(i.lightMap.channel),bumpMapUv:ie&&p(i.bumpMap.channel),normalMapUv:ae&&p(i.normalMap.channel),displacementMapUv:oe&&p(i.displacementMap.channel),emissiveMapUv:I&&p(i.emissiveMap.channel),metalnessMapUv:se&&p(i.metalnessMap.channel),roughnessMapUv:ce&&p(i.roughnessMap.channel),anisotropyMapUv:_e&&p(i.anisotropyMap.channel),clearcoatMapUv:ve&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:ye&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:be&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:xe&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:L&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:Se&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:we&&p(i.sheenRoughnessMap.channel),specularMapUv:R&&p(i.specularMap.channel),specularColorMapUv:Te&&p(i.specularColorMap.channel),specularIntensityMapUv:z&&p(i.specularIntensityMap.channel),transmissionMapUv:B&&p(i.transmissionMap.channel),thicknessMapUv:Ee&&p(i.thicknessMap.channel),alphaMapUv:Oe&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(ae||le),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(P||Oe),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&ae===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:je,decodeVideoTexture:P&&i.map.isVideoTexture===!0&&J.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:I&&i.emissiveMap.isVideoTexture===!0&&J.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ae&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ae&&i.extensions.multiDraw===!0||N)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ne.vertexUv1s=c.has(1),Ne.vertexUv2s=c.has(2),Ne.vertexUv3s=c.has(3),c.clear(),Ne}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Qs[t];n=Mo.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new yu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function Tu(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Eu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Du(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Ou(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Eu),r.length>1&&r.sort(t||Du),i.length>1&&i.sort(t||Du)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function ku(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Ou,e.set(t,[i])):n>=r.length?(i=new Ou,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Au(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new K,color:new Y};break;case`SpotLight`:n={position:new K,direction:new K,color:new Y,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new K,color:new Y,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new K,skyColor:new Y,groundColor:new Y};break;case`RectAreaLight`:n={color:new Y,position:new K,halfWidth:new K,halfHeight:new K}}return e[t.id]=n,n}}}function ju(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new G,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var Mu=0;function Nu(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function Pu(e){let t=new Au,n=ju(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new K);let i=new K,a=new Ir,o=new Ir;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Nu);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=Mu++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Fu(e){let t=new Pu(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function Iu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Fu(e),t.set(n,[a])):r>=i.length?(a=new Fu(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Lu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ru=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,zu=[new K(1,0,0),new K(-1,0,0),new K(0,1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1)],Bu=[new K(0,-1,0),new K(0,-1,0),new K(0,0,1),new K(0,0,-1),new K(0,-1,0),new K(0,-1,0)],Vu=new Ir,Hu=new K,Uu=new K;function Wu(e,t,n){let r=new lo,i=new G,a=new G,o=new jr,s=new Ro,c=new zo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Fo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new G},radius:{value:4}},vertexShader:Lu,fragmentShader:Ru}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new pa;m.setAttribute(`position`,new Qi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new X(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(H(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){H(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){H(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Nr(i.x,i.y,{format:Gt,type:Mt,minFilter:St,magFilter:St,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new ho(i.x,i.y,jt),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=Vt,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=yt,d.map.depthTexture.magFilter=yt}else l.isPointLight?(d.map=new sc(i.x),d.map.depthTexture=new go(i.x,At)):(d.map=new Nr(i.x,i.y),d.map.depthTexture=new ho(i.x,i.y,At)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=Vt,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=St,d.map.depthTexture.magFilter=St):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=yt,d.map.depthTexture.magFilter=yt);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),Hu.setFromMatrixPosition(l.matrixWorld),e.position.copy(Hu),Uu.copy(e.position),Uu.add(zu[t]),e.up.copy(Bu[t]),e.lookAt(Uu),e.updateMatrixWorld(),n.makeTranslation(-Hu.x,-Hu.y,-Hu.z),Vu.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Vu,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Nr(i.x,i.y,{format:Gt,type:Mt}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Gu(e,t){function n(){let t=!1,n=new jr,r=null,i=new jr(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?se(e.DEPTH_TEST):ce(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=nr[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?se(e.STENCIL_TEST):ce(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Y(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,ee=e.getParameter(e.VERSION);ee.indexOf(`WebGL`)===-1?ee.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(ee)[1]),N=P>=1);let F=null,te={},ne=e.getParameter(e.SCISSOR_BOX),re=e.getParameter(e.VIEWPORT),ie=new jr().fromArray(ne),ae=new jr().fromArray(re);function oe(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let I={};I[e.TEXTURE_2D]=oe(e.TEXTURE_2D,e.TEXTURE_2D,1),I[e.TEXTURE_CUBE_MAP]=oe(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),I[e.TEXTURE_2D_ARRAY]=oe(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),I[e.TEXTURE_3D]=oe(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),se(e.DEPTH_TEST),o.setFunc(3),ge(!1),_e(1),se(e.CULL_FACE),me(0);function se(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ce(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function le(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ue(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function de(t){return h!==t&&(e.useProgram(t),h=t,!0)}let fe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};fe[103]=e.MIN,fe[104]=e.MAX;let pe={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function me(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ce(e.BLEND),g=!1);else if(g===!1&&(se(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:U(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:U(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:U(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:U(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(fe[n],fe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(pe[r],pe[i],pe[o],pe[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function he(t,n){t.side===2?ce(e.CULL_FACE):se(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ge(r),t.blending===1&&t.transparent===!1?me(0):me(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),ye(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?se(e.SAMPLE_ALPHA_TO_COVERAGE):ce(e.SAMPLE_ALPHA_TO_COVERAGE)}function ge(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function _e(t){t===0?ce(e.CULL_FACE):(se(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function ve(t){t!==k&&(N&&e.lineWidth(t),k=t)}function ye(t,n,r){t?(se(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):ce(e.POLYGON_OFFSET_FILL)}function be(t){t?se(e.SCISSOR_TEST):ce(e.SCISSOR_TEST)}function xe(t){t===void 0&&(t=e.TEXTURE0+M-1),F!==t&&(e.activeTexture(t),F=t)}function L(t,n,r){r===void 0&&(r=F===null?e.TEXTURE0+M-1:F);let i=te[r];i===void 0&&(i={type:void 0,texture:void 0},te[r]=i),(i.type!==t||i.texture!==n)&&(F!==r&&(e.activeTexture(r),F=r),e.bindTexture(t,n||I[t]),i.type=t,i.texture=n)}function Se(){let t=te[F];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Ce(){try{e.compressedTexImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function we(){try{e.compressedTexImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function R(){try{e.texSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Te(){try{e.texSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function z(){try{e.compressedTexSubImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function B(){try{e.compressedTexSubImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Ee(){try{e.texStorage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function De(){try{e.texStorage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function Oe(){try{e.texImage2D(...arguments)}catch(e){U(`WebGLState:`,e)}}function ke(){try{e.texImage3D(...arguments)}catch(e){U(`WebGLState:`,e)}}function V(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ae(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function je(t){ie.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),ie.copy(t))}function Me(t){ae.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),ae.copy(t))}function Ne(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Pe(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Fe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},F=null,te={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new Y(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ie.set(0,0,e.canvas.width,e.canvas.height),ae.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:se,disable:ce,bindFramebuffer:le,drawBuffers:ue,useProgram:de,setBlending:me,setMaterial:he,setFlipSided:ge,setCullFace:_e,setLineWidth:ve,setPolygonOffset:ye,setScissorTest:be,activeTexture:xe,bindTexture:L,unbindTexture:Se,compressedTexImage2D:Ce,compressedTexImage3D:we,texImage2D:Oe,texImage3D:ke,pixelStorei:Ae,getParameter:V,updateUBOMapping:Ne,uniformBlockBinding:Pe,texStorage2D:Ee,texStorage3D:De,texSubImage2D:R,texSubImage3D:Te,compressedTexSubImage2D:z,compressedTexSubImage3D:B,scissor:je,viewport:Me,reset:Fe}}function Ku(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new G,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):Yn(`canvas`)}function v(e,t,n){let r=1,i=Ee(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),H(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&H(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];H(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||H(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?Hn:J.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,H(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),M(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),P(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function M(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&N(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function N(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function P(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let ee=0;function F(){ee=0}function te(){return ee}function ne(e){ee=e}function re(){let e=ee;return e>=i.maxTextures&&H(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),ee+=1,e}function ie(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function ae(t,i){let a=r.get(t);if(t.isVideoTexture&&z(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)H(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)H(`WebGLRenderer: Texture marked for update but image is incomplete`);else{he(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function oe(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?he(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function I(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?he(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function se(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?ge(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ce={[gt]:e.REPEAT,[_t]:e.CLAMP_TO_EDGE,[vt]:e.MIRRORED_REPEAT},le={[yt]:e.NEAREST,[bt]:e.NEAREST_MIPMAP_NEAREST,[xt]:e.NEAREST_MIPMAP_LINEAR,[St]:e.LINEAR,[Ct]:e.LINEAR_MIPMAP_NEAREST,[wt]:e.LINEAR_MIPMAP_LINEAR},ue={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function de(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&H(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ce[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ce[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ce[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,le[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,le[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,ue[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function fe(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=ie(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&N(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function pe(e,t,n){return Math.floor(Math.floor(e/n)/t)}function me(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=pe(n.start,r.width,4),c=pe(t.start,r.width,4);n.start<=i+1&&a===c&&pe(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function he(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=fe(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=J.getPrimaries(J.workingColorSpace),r=o.colorSpace===``?null:J.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=B(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);de(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===Ht,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&me(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=Js(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Js(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Ee(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Ee(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ge(t,o,s){if(o.image.length!==6)return;let c=fe(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=J.getPrimaries(J.workingColorSpace),r=o.colorSpace===``?null:J.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=B(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);de(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===Ht,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?H(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=Ee(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function _e(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Te(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,R(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function ve(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Te(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,R(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,R(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);Te(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,R(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,R(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function ye(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?se(i.depthTexture,0):ae(i.depthTexture,0);let u=c.__webglTexture,d=R(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Te(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Te(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function be(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)ye(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?ye(i.__webglFramebuffer[0],t,0):ye(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),ve(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),ve(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function xe(t,n,i){let a=r.get(t);n!==void 0&&_e(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&be(t)}function L(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Te(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=R(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),ve(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),de(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)_e(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else _e(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),de(c,a),_e(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),de(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)_e(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else _e(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&be(t)}function Se(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let Ce=[];function we(t){if(t.samples>0){if(Te(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Ce.length=0,Ce.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Ce.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Ce))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function R(e){return Math.min(i.maxSamples,e.samples)}function Te(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function z(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function B(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(J.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&H(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):U(`WebGLTextures: Unsupported texture color space:`,n)),t}function Ee(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=re,this.resetTextureUnits=F,this.getTextureUnits=te,this.setTextureUnits=ne,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=I,this.setTextureCube=se,this.rebindTextures=xe,this.setupRenderTarget=L,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=we,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Te,this.dispose=j}function qu(e,t){function n(n,r=``){let i,a=J.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Ju=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Yu=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Xu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new _o(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Fo({vertexShader:Ju,fragmentShader:Yu,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new X(new So(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Zu=class extends rr{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new Xu,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new G,C=null,w=null,T=new Es;T.viewport=new jr;let E=new Es;E.viewport=new jr;let D=[T,E],O=new Fs,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new fi,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new fi,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new fi,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ne.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&H(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?Ht:Vt,a=_.stencil?Ft:At);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Nr(d.textureWidth,d.textureHeight,{format:Bt,type:Tt,depthTexture:new ho(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Nr(f.framebufferWidth,f.framebufferHeight,{format:Bt,type:Tt,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ne.setContext(r),ne.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function P(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;P(O,i);for(let e=0;e<a.length;e++)P(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ee(e,O,i)};function ee(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=or*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let F=null;function te(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new Es,o.layers.enable(n),o.viewport=new jr,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new _o,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}F&&F(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ne=new Xs;ne.setAnimationLoop(te),this.setAnimationLoop=function(e){F=e},this.dispose=function(){}}},Qu=new Ir,$u=new q;$u.set(-1,0,0,0,1,0,0,0,1);function ed(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,jo(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Qu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply($u),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function td(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?H(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):H(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var nd=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),rd=null;function id(){return rd===null&&(rd=new ao(nd,16,16,Gt,Mt),rd.name=`DFG_LUT`,rd.minFilter=St,rd.magFilter=St,rd.wrapS=_t,rd.wrapT=_t,rd.generateMipmaps=!1,rd.needsUpdate=!0),rd}var ad=class{constructor(e={}){let{canvas:t=Xn(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Tt}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([qt,Kt,Wt]),g=new Set([Tt,At,Ot,Ft,Nt,Pt]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=Bn;let j=0,M=0,N=null,P=-1,ee=null,F=new jr,te=new jr,ne=null,re=new Y(0),ie=0,ae=t.width,oe=t.height,I=1,se=null,ce=null,le=new jr(0,0,ae,oe),ue=new jr(0,0,ae,oe),de=!1,fe=new lo,pe=new fo,me=!1,he=!1,ge=new Ir,_e=new K,ve=new jr,ye={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},be=!1;function xe(){return N===null?I:1}let L=n;function Se(e,n){return t.getContext(e,n)}let Ce,we,R,Te,z,B,Ee,De,Oe,ke,V,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,We,!1),t.addEventListener(`webglcontextrestored`,Ge,!1),t.addEventListener(`webglcontextcreationerror`,Ke,!1),L===null){let t=`webgl2`;if(L=Se(t,e),L===null)throw Se(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}He()}catch(e){throw t.removeEventListener(`webglcontextlost`,We,!1),t.removeEventListener(`webglcontextrestored`,Ge,!1),t.removeEventListener(`webglcontextcreationerror`,Ke,!1),U(`WebGLRenderer: `+e.message),e}function He(){Ce=new Tc(L),Ce.init(),ze=new qu(L,Ce),we=new ac(L,Ce,e,ze),R=new Gu(L,Ce),we.reversedDepthBuffer&&d&&R.buffers.depth.setReversed(!0),O=L.createFramebuffer(),k=L.createFramebuffer(),A=L.createFramebuffer(),Te=new Oc(L),z=new Tu,B=new Ku(L,Ce,R,z,we,ze,Te),Ee=new wc(T),De=new Zs(L),Be=new rc(L,De),Oe=new Ec(L,De,Te,Be),ke=new Ac(L,Oe,De,Be,Te),Ie=new kc(L,we,B),Ne=new oc(z),V=new wu(T,Ee,Ce,we,Be,Ne),Ae=new ed(T,z),je=new ku,Me=new Iu(Ce),Fe=new nc(T,Ee,R,ke,p,s),Pe=new Wu(T,ke,we),Ve=new td(L,Te,we,R),Le=new ic(L,Ce,Te),Re=new Dc(L,Ce,Te),Te.programs=V.programs,T.capabilities=we,T.extensions=Ce,T.properties=z,T.renderLists=je,T.shadowMap=Pe,T.state=R,T.info=Te}m!==1009&&(w=new Mc(m,t.width,t.height,o,r,i));let Ue=new Zu(T,L);this.xr=Ue,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){let e=Ce.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Ce.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return I},this.setPixelRatio=function(e){e!==void 0&&(I=e,this.setSize(ae,oe,!1))},this.getSize=function(e){return e.set(ae,oe)},this.setSize=function(e,n,r=!0){Ue.isPresenting?H(`WebGLRenderer: Can't change size while VR device is presenting.`):(ae=e,oe=n,t.width=Math.floor(e*I),t.height=Math.floor(n*I),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(ae*I,oe*I).floor()},this.setDrawingBufferSize=function(e,n,r){ae=e,oe=n,I=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)U(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){H(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(F)},this.getViewport=function(e){return e.copy(le)},this.setViewport=function(e,t,n,r){e.isVector4?le.set(e.x,e.y,e.z,e.w):le.set(e,t,n,r),R.viewport(F.copy(le).multiplyScalar(xe()).round())},this.getScissor=function(e){return e.copy(ue)},this.setScissor=function(e,t,n,r){e.isVector4?ue.set(e.x,e.y,e.z,e.w):ue.set(e,t,n,r),R.scissor(te.copy(ue).multiplyScalar(xe()).round())},this.getScissorTest=function(){return de},this.setScissorTest=function(e){R.setScissorTest(de=e)},this.setOpaqueSort=function(e){se=e},this.setTransparentSort=function(e){ce=e},this.getClearColor=function(e){return e.copy(Fe.getClearColor())},this.setClearColor=function(){Fe.setClearColor(...arguments)},this.getClearAlpha=function(){return Fe.getClearAlpha()},this.setClearAlpha=function(){Fe.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=Fe.getClearColor(),r=Fe.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,L.clearBufferuiv(L.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,L.clearBufferiv(L.COLOR,0,v))}else r|=L.COLOR_BUFFER_BIT}t&&(r|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&L.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,We,!1),t.removeEventListener(`webglcontextrestored`,Ge,!1),t.removeEventListener(`webglcontextcreationerror`,Ke,!1),Fe.dispose(),je.dispose(),Me.dispose(),B.dispose(),z.dispose(),Ee.dispose(),ke.dispose(),Oe.dispose(),Be.dispose(),Ve.dispose(),V.dispose(),Ue.dispose(),Ue.removeEventListener(`sessionstart`,$e),Ue.removeEventListener(`sessionend`,et),tt.stop()};function We(e){e.preventDefault(),Qn(`WebGLRenderer: Context Lost.`),E=!0}function Ge(){Qn(`WebGLRenderer: Context Restored.`),E=!1;let e=Te.autoReset,t=Pe.enabled,n=Pe.autoUpdate,r=Pe.needsUpdate,i=Pe.type;He(),Te.autoReset=e,Pe.enabled=t,Pe.autoUpdate=n,Pe.needsUpdate=r,Pe.type=i}function Ke(e){U(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function qe(e){let t=e.target;t.removeEventListener(`dispose`,qe),Je(t)}function Je(e){Ye(e),z.remove(e)}function Ye(e){let t=z.get(e).programs;t!==void 0&&(t.forEach(function(e){V.releaseProgram(e)}),e.isShaderMaterial&&V.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ye);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ft(e,t,n,r,i);R.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Oe.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Be.setup(i,r,s,n,c);let h,g=Le;if(c!==null&&(h=De.get(c),g=Re,g.setIndex(h)),i.isMesh)r.wireframe===!0?(R.setLineWidth(r.wireframeLinewidth*xe()),g.setMode(L.LINES)):g.setMode(L.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),R.setLineWidth(e*xe()),i.isLineSegments?g.setMode(L.LINES):i.isLineLoop?g.setMode(L.LINE_LOOP):g.setMode(L.LINE_STRIP)}else i.isPoints?g.setMode(L.POINTS):i.isSprite&&g.setMode(L.TRIANGLES);if(i.isBatchedMesh){if(Ce.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?De.get(c).bytesPerElement:1,o=z.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(L,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function Xe(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),me===!0&&Ne.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ct(e,t,r),e.side=0,e.needsUpdate=!0,ct(e,t,r),e.side=2):ct(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Me.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),he=this.localClippingEnabled,me=Ne.init(this.clippingPlanes,he),me===!0&&Ne.setGlobalState(this.clippingPlanes,t),D!==null&&Pe.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];Xe(o,n,t,e),r.add(o)}else Xe(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=z.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Ce.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let Ze=null;function Qe(e){Ze&&Ze(e)}function $e(){tt.stop()}function et(){tt.start()}let tt=new Xs;tt.setAnimationLoop(Qe),typeof self<`u`&&tt.setContext(self),this.setAnimationLoop=function(e){Ze=e,Ue.setAnimationLoop(e),e===null?tt.stop():tt.start()},Ue.addEventListener(`sessionstart`,$e),Ue.addEventListener(`sessionend`,et),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){U(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ue.enabled===!0&&Ue.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ue.enabled===!0&&Ue.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ue.cameraAutoUpdate===!0&&Ue.updateCamera(t),t=Ue.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Me.get(e,C.length),x.init(t),x.state.textureUnits=B.getTextureUnits(),C.push(x),ge.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?pe.setFromArrayCamera(t):fe.setFromProjectionMatrix(ge,Kn,t.reversedDepth),he=this.localClippingEnabled,me=Ne.init(this.clippingPlanes,he),b=je.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,Ue.enabled===!0&&Ue.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&nt(e,t,-1/0,T.sortObjects)}nt(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(se,ce),be=Ue.enabled===!1||Ue.isPresenting===!1||Ue.hasDepthSensing()===!1,be&&Fe.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),me===!0&&Ne.beginShadows();let i=x.state.shadowsArray;if(Pe.render(i,e,t),me===!0&&Ne.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];it(n,r,e,a)}be&&Fe.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];rt(b,e,n,n.viewport)}}else r.length>0&&it(n,r,e,t),be&&Fe.render(e),rt(b,e,t)}N!==null&&M===0&&(B.updateMultisampleRenderTarget(N),B.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Be.resetDefaultState(),P=-1,ee=null,C.pop(),C.length>0?(x=C[C.length-1],B.setTextureUnits(x.state.textureUnits),me===!0&&Ne.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function nt(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?pe:fe;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&ve.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ge);let i=ke.update(e),a=e.material;a.visible&&b.push(e,i,a,n,ve.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?pe:fe;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=ke.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),ve.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),ve.copy(e.boundingSphere.center)),ve.applyMatrix4(e.matrixWorld).applyMatrix4(ge)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,ve.z,s,t)}}else a.visible&&b.push(e,i,a,n,ve.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)nt(i[e],t,n,r)}function rt(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),me===!0&&Ne.setGlobalState(T.clippingPlanes,n),r&&R.viewport(F.copy(r)),i.length>0&&at(i,t,n),a.length>0&&at(a,t,n),o.length>0&&at(o,t,n),R.buffers.depth.setTest(!0),R.buffers.depth.setMask(!0),R.buffers.color.setMask(!0),R.setPolygonOffset(!1)}function it(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Ce.has(`EXT_color_buffer_half_float`)||Ce.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Nr(1,1,{generateMipmaps:!0,type:e?Mt:Tt,minFilter:wt,samples:Math.max(4,we.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:J.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||F;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(re),ie=T.getClearAlpha(),ie<1&&T.setClearColor(16777215,.5),T.clear(),be&&Fe.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),me===!0&&Ne.setGlobalState(T.clippingPlanes,r),at(e,n,r),B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a),Ce.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,ot(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(B.updateMultisampleRenderTarget(a),B.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(re,ie),d!==void 0&&(r.viewport=d),T.toneMapping=u}function at(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&ot(o,t,n,s,l,c)}}function ot(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function st(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function ct(e,t,n){t.isScene!==!0&&(t=ye);let r=z.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=V.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=V.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Ee.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,qe),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return dt(e,s),d}else s.uniforms=V.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=V.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ne.uniform),dt(e,s),r.needsLights=mt(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=st(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function lt(e,t,n,r,i){let a=z.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=ct(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function ut(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Vl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function dt(e,t){let n=z.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ft(e,t,n,r,i){t.isScene!==!0&&(t=ye),B.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:J.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Ee.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=z.get(r),b=x.state.lights;if(me===!0&&(he===!0||e!==ee)){let t=e===ee&&r.id===P;Ne.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ne.numPlanes||v.numIntersection!==Ne.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===st(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?lt(r,t,i,s,h):ct(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(R.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==P&&(P=r.id,O=!0),E||ee!==e){R.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(L,`projectionMatrix`,e.projectionMatrix),A.setValue(L,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(L,_e.setFromMatrixPosition(e.matrixWorld)),we.logarithmicDepthBuffer&&A.setValue(L,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(L,`isOrthographic`,e.isOrthographicCamera===!0),ee!==e&&(ee=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(L,`sunShadowMap`,b.state.sunShadowMap,B),b.state.directionalShadowMap.length>0&&A.setValue(L,`directionalShadowMap`,b.state.directionalShadowMap,B),b.state.spotShadowMap.length>0&&A.setValue(L,`spotShadowMap`,b.state.spotShadowMap,B),b.state.pointShadowMap.length>0&&A.setValue(L,`pointShadowMap`,b.state.pointShadowMap,B)),i.isSkinnedMesh){A.setOptional(L,i,`bindMatrix`),A.setOptional(L,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(L,`boneTexture`,e.boneTexture,B))}i.isBatchedMesh&&(A.setOptional(L,i,`batchingTexture`),A.setValue(L,`batchingTexture`,i._matricesTexture,B),A.setOptional(L,i,`batchingIdTexture`),A.setValue(L,`batchingIdTexture`,i._indirectTexture,B),A.setOptional(L,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(L,`batchingColorTexture`,i._colorsTexture,B));let M=n.morphAttributes;if((M.position!==void 0||M.normal!==void 0||M.color!==void 0)&&Ie.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(L,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=id()),O){if(A.setValue(L,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&pt(j,k),a&&r.fog===!0&&Ae.refreshFogUniforms(j,a),Ae.refreshMaterialUniforms(j,r,I,oe,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Vl.upload(L,ut(v),j,B)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Vl.upload(L,ut(v),j,B),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(L,`center`,i.center),A.setValue(L,`modelViewMatrix`,i.modelViewMatrix),A.setValue(L,`normalMatrix`,i.normalMatrix),A.setValue(L,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ve.update(n,w),Ve.bind(n,w)}}return w}function pt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function mt(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=z.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),z.get(e.texture).__webglTexture=t,z.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=z.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=z.get(e);if(o.__useDefaultFramebuffer!==void 0){R.bindFramebuffer(L.FRAMEBUFFER,o.__webglFramebuffer),F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest,R.viewport(F),R.scissor(te),R.setScissorTest(ne),P=-1;return}if(o.__webglFramebuffer===void 0)B.setupRenderTarget(e);else if(o.__hasExternalTextures)B.rebindTextures(e,z.get(e.texture).__webglTexture,z.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&z.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);B.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=z.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&B.useMultisampledRTT(e)===!1?z.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,F.copy(e.viewport),te.copy(e.scissor),ne=e.scissorTest}else F.copy(le).multiplyScalar(I).floor(),te.copy(ue).multiplyScalar(I).floor(),ne=de;if(n!==0&&(r=O),R.bindFramebuffer(L.FRAMEBUFFER,r)&&R.drawBuffers(e,r),R.viewport(F),R.scissor(te),R.setScissorTest(ne),i){let r=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=z.get(e.textures[t]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=z.get(e.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,t.__webglTexture,n)}P=-1};function ht(e){let t=z.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=we.textureFormatReadable(e.format),t.__typeReadable=we.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){R.bindFramebuffer(L.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let u=ht(o);if(u.__formatReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){U(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&L.readPixels(t,n,r,i,ze.convert(c),ze.convert(l),a)}finally{let e=N===null?null:z.get(N).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=z.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){R.bindFramebuffer(L.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+s);let d=ht(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.bufferData(L.PIXEL_PACK_BUFFER,a.byteLength,L.STREAM_READ),L.readPixels(t,n,r,i,ze.convert(l),ze.convert(u),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);let p=N===null?null:z.get(N).__webglFramebuffer;R.bindFramebuffer(L.FRAMEBUFFER,p);let m=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await tr(L,m,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,f),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,a),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(f),L.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;B.setTexture2D(e,0),L.copyTexSubImage2D(L.TEXTURE_2D,n,0,0,o,s,i,a),R.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=ze.convert(t.format),_=ze.convert(t.type),v;t.isData3DTexture?(B.setTexture3D(t,0),v=L.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(B.setTexture2DArray(t,0),v=L.TEXTURE_2D_ARRAY):(B.setTexture2D(t,0),v=L.TEXTURE_2D),R.activeTexture(L.TEXTURE0),R.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,t.flipY),R.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),R.pixelStorei(L.UNPACK_ALIGNMENT,t.unpackAlignment);let y=R.getParameter(L.UNPACK_ROW_LENGTH),b=R.getParameter(L.UNPACK_IMAGE_HEIGHT),x=R.getParameter(L.UNPACK_SKIP_PIXELS),S=R.getParameter(L.UNPACK_SKIP_ROWS),C=R.getParameter(L.UNPACK_SKIP_IMAGES);R.pixelStorei(L.UNPACK_ROW_LENGTH,h.width),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,h.height),R.pixelStorei(L.UNPACK_SKIP_PIXELS,l),R.pixelStorei(L.UNPACK_SKIP_ROWS,u),R.pixelStorei(L.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=z.get(e),r=z.get(t),h=z.get(n.__renderTarget),g=z.get(r.__renderTarget);R.bindFramebuffer(L.READ_FRAMEBUFFER,h.__webglFramebuffer),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(e).__webglTexture,i,d+n),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,z.get(t).__webglTexture,a,m+n)),L.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,L.DEPTH_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||z.has(e)){let n=z.get(e),r=z.get(t);R.bindFramebuffer(L.READ_FRAMEBUFFER,k),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,n.__webglTexture,i),T?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,r.__webglTexture,a),i===0?T?L.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):L.copyTexSubImage2D(v,a,f,p,l,u,o,s):L.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,L.COLOR_BUFFER_BIT,L.NEAREST);R.bindFramebuffer(L.READ_FRAMEBUFFER,null),R.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?L.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):L.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):L.texSubImage2D(L.TEXTURE_2D,a,f,p,o,s,g,_,h);R.pixelStorei(L.UNPACK_ROW_LENGTH,y),R.pixelStorei(L.UNPACK_IMAGE_HEIGHT,b),R.pixelStorei(L.UNPACK_SKIP_PIXELS,x),R.pixelStorei(L.UNPACK_SKIP_ROWS,S),R.pixelStorei(L.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&L.generateMipmap(v),R.unbindTexture()},this.initRenderTarget=function(e){z.get(e).__webglFramebuffer===void 0&&B.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?B.setTextureCube(e,0):e.isData3DTexture?B.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?B.setTexture2DArray(e,0):B.setTexture2D(e,0),R.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,R.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=J._getDrawingBufferColorSpace(e),t.unpackColorSpace=J._getUnpackColorSpace()}},od=.63,sd=.88,cd=256,ld=360,ud=13,dd=5,fd=[`♣`,`♦`,`♥`,`♠`],pd=[`#1b1b1f`,`#c8202c`,`#c8202c`,`#1b1b1f`];function md(e,t,n,r,i,a){e.beginPath(),e.moveTo(t+a,n),e.arcTo(t+r,n,t+r,n+i,a),e.arcTo(t+r,n+i,t,n+i,a),e.arcTo(t,n+i,t,n,a),e.arcTo(t,n,t+r,n,a),e.closePath()}var hd=null;function gd(){if(hd)return hd;let e=document.createElement(`canvas`);e.width=cd*ud,e.height=ld*dd;let t=e.getContext(`2d`);t.clearRect(0,0,e.width,e.height);for(let e=0;e<4;e++)for(let n=0;n<13;n++){let r=n*cd,i=e*ld;t.save(),t.translate(r,i),t.fillStyle=`#f7f4ec`,md(t,4,4,248,352,22),t.fill(),t.strokeStyle=`#cfc9bc`,t.lineWidth=3,t.stroke();let a=pd[e],o=`23456789TJQKA`[n]===`T`?`10`:u[n];t.fillStyle=a,t.textAlign=`center`,t.textBaseline=`middle`,t.font=`bold 72px "Helvetica Neue", Arial, sans-serif`,t.fillText(o,44,52),t.font=`56px "Helvetica Neue", Arial, sans-serif`,t.fillText(fd[e],44,116),t.save(),t.translate(212,308),t.rotate(Math.PI),t.font=`bold 72px "Helvetica Neue", Arial, sans-serif`,t.fillText(o,0,0),t.font=`56px "Helvetica Neue", Arial, sans-serif`,t.fillText(fd[e],0,64),t.restore(),t.font=`150px "Helvetica Neue", Arial, sans-serif`,t.fillText(fd[e],cd/2,188),t.restore()}t.save(),t.translate(0,4*ld),t.fillStyle=`#f7f4ec`,md(t,4,4,248,352,22),t.fill(),t.fillStyle=`#7a1f2b`,md(t,18,18,220,324,14),t.fill(),t.strokeStyle=`rgba(255,230,200,0.35)`,t.lineWidth=2;for(let e=-360;e<616;e+=22)t.beginPath(),t.moveTo(e,18),t.lineTo(e+ld,342),t.stroke(),t.beginPath(),t.moveTo(e,342),t.lineTo(e+ld,18),t.stroke();return t.strokeStyle=`#e9c98a`,t.lineWidth=4,md(t,30,30,196,300,10),t.stroke(),t.restore(),hd=new mo(e),hd.colorSpace=Bn,hd.anisotropy=8,hd.generateMipmaps=!0,hd.minFilter=wt,hd}function _d(e,t,n){let r=e.attributes.uv,i=t/ud,a=(t+1)/ud,o=1-n/dd,s=1-(n+1)/dd,c=.002;r.setXY(0,i+c,o-c),r.setXY(1,a-c,o-c),r.setXY(2,i+c,s+c),r.setXY(3,a-c,s+c),r.needsUpdate=!0}var vd=null,yd=(()=>{let e=null;return()=>(e||(e=new So(od,sd),_d(e,0,4),e.rotateX(-Math.PI/2),e.rotateY(Math.PI),e.rotateX(Math.PI)),e)})();function bd(){return vd||=new Lo({map:gd(),roughness:.55,metalness:0,side:0}),vd}var xd=class{group=new ui;flip=new ui;front;card;constructor(e){this.card=e;let t=new So(od,sd);t.rotateX(-Math.PI/2),this.front=t;let n=new X(t,bd());n.castShadow=!0;let r=new X(yd(),bd());r.position.y=-.002,this.flip.add(n,r),this.flip.rotation.x=Math.PI,this.group.add(this.flip),this.setCard(e)}setCard(e){this.card=e,e===null?_d(this.front,0,4):_d(this.front,m(e),h(e))}dispose(){this.front.dispose()}get faceUp(){return this.flip.rotation.x<Math.PI/2}},Sd=[{value:5e3,color:14257195},{value:1e3,color:14926387},{value:500,color:6961826},{value:100,color:2105894},{value:25,color:3116878},{value:5,color:13185068}],Cd=.13,wd=.028,Td=12,Ed=new xo(Cd,Cd,wd,24),Dd=new Map,Od=new Lo({color:15921126,roughness:.5}),kd=new xo(Cd*.72,Cd*.72,.03,24);function Ad(e){let t=Dd.get(e);return t||(t=new Lo({color:e,roughness:.45,metalness:.05}),Dd.set(e,t)),t}function jd(e){let t=[],n=e;for(let e of Sd)for(;n>=e.value&&t.length<60;)t.push(e.value),n-=e.value;return t}var Md=class{group=new ui;amount=0;set(e){if(e===this.amount&&this.group.children.length>0||(this.amount=e,this.group.clear(),e<=0))return;let t=jd(e),n=[],r=[],i=-1;for(let e of t)(e!==i||r.length>=Td)&&(r=[],n.push(r),i=e),r.push(e);let a=Cd*2.3,o=(n.length-1)*a/2;n.forEach((e,t)=>{e.forEach((e,n)=>{let r=Sd.find(t=>t.value===e).color,i=new X(Ed,Ad(r));i.position.set(t*a-o,wd/2+n*wd,0),i.castShadow=!0,i.receiveShadow=!0;let s=new X(kd,Od);s.position.copy(i.position),this.group.add(i,s)})})}},Nd=4.2,Pd=2.7,Fd=[90,140,183,226,328,25];function Id(e,t,n=0){let r=e*Math.PI/180;return new K(Nd*t*Math.cos(r),n,Pd*t*Math.sin(r))}var Ld=e=>Fd[e],Rd=e=>Id(Ld(e),e===1||e===5?1.24:1.34,0),zd=e=>Id(Ld(e),.72,.012),Bd=e=>Id(Ld(e),.46,0),Vd=e=>Id(Ld(e)-16,.62,.01),Hd=e=>Id(Ld(e),e===1||e===5?.9:1.17,.02),Ud=new K(0,0,-.95),Wd=new K(0,0,-.42),Gd=.3,Kd=.72,qd=Id(270,1.36,0),Jd=Id(270,1.17,.02),Yd=Id(270,.92,.6),Xd=Id(270,.7,.01);function Zd(e){return Math.atan2(-e.x,-e.z)}function Qd(e){return Math.atan2(e.x,e.z)}function $d(e){return new K((e-2)*Kd,.012,Gd)}var ef={pos:new K(0,4.7,6.2),look:new K(0,.35,-1.1)};function tf(e){return nf(Rd(e))}function nf(e){let t=new K(-e.x,0,-e.z).normalize(),n=e.clone().add(t.multiplyScalar(2.4));return n.y=1.55,{pos:n,look:new K(e.x,1.25,e.z)}}var rf=class{camera;constructor(e){this.camera=e,this.camera.position.copy(ef.pos),this.camera.lookAt(ef.look)}},af=1e3,of=class{el;probe;scale=1;onFit=()=>{};constructor(e,t){this.el=e,this.probe=t;let n=()=>this.fit();window.addEventListener(`resize`,n),window.addEventListener(`orientationchange`,n),window.visualViewport?.addEventListener(`resize`,n),window.visualViewport?.addEventListener(`scroll`,n),document.addEventListener(`fullscreenchange`,n),this.fit(),window.setTimeout(n,250),window.setTimeout(n,1e3)}fit(){let e=window.visualViewport,t=e?.width??window.innerWidth,n=e?.height??window.innerHeight,r=e?.offsetLeft??0,i=e?.offsetTop??0,a=getComputedStyle(this.probe),o={left:parseFloat(a.paddingLeft)||0,right:parseFloat(a.paddingRight)||0,top:parseFloat(a.paddingTop)||0,bottom:parseFloat(a.paddingBottom)||0},s=Math.max(1,t-o.left-o.right),c=Math.max(1,n-o.top-o.bottom),l=Math.min(s/af,c/460),u=r+o.left+(s-af*l)/2,d=i+o.top+(c-460*l)/2;this.scale=l,this.el.style.transform=`translate(${u.toFixed(2)}px, ${d.toFixed(2)}px) scale(${l.toFixed(4)})`,this.onFit(l)}toStage(e){let t=this.el.getBoundingClientRect(),n=1/this.scale,r=(e.left-t.left)*n,i=(e.top-t.top)*n,a=e.width*n,o=e.height*n;return{left:r,top:i,width:a,height:o,right:r+a,bottom:i+o}}},sf=[15845797,14724222,13012059,9263675,6044196,16111544],cf=[2902650,8006700,3107658,7031434,9071407,3815994,11579568,1993594],lf=[1708560,3877402,8018474,11901530,14275270,5904922];function uf(e,t){let n=document.createElement(`canvas`);n.width=256,n.height=256;let r=n.getContext(`2d`);r.clearRect(0,0,256,256),r.strokeStyle=`#2a1a12`,r.fillStyle=`#2a1a12`,r.lineWidth=7,r.lineCap=`round`;let i=(t&1)==1,a=(e,t)=>{r.beginPath(),t>=1?r.ellipse(e,110,i?13:10,13*t,0,0,Math.PI*2):r.ellipse(e,110,12,Math.max(2,13*t),0,0,Math.PI*2),r.fill()},o=(e,t,n)=>{r.beginPath(),r.moveTo(e-18,80-n+t),r.lineTo(e+18,80-n-t),r.stroke()},s=(e,t=0)=>{r.beginPath(),r.moveTo(94,180),r.quadraticCurveTo(128,180+e,162,180),t>0?(r.quadraticCurveTo(128,180+e+t,94,180),r.fill()):r.stroke()};switch(e){case`neutral`:a(84,1),a(172,1),o(84,0,0),o(172,0,0),s(4);break;case`thinking`:a(84,.6),a(172,.6),o(84,-6,4),o(172,2,0),s(-2);break;case`happy`:a(84,.5),a(172,.5),o(84,0,6),o(172,0,6),s(34);break;case`annoyed`:a(84,.7),a(172,.7),o(84,8,-4),o(172,-8,-4),s(-16);break;case`tilted`:a(84,1.2),a(172,1.2),o(84,14,-8),o(172,-14,-8),s(-24,18);break;case`shocked`:a(84,1.3),a(172,1.3),o(84,0,14),o(172,0,14),s(0,30);break;case`out`:r.beginPath(),r.moveTo(74,100),r.lineTo(94,120),r.moveTo(94,100),r.lineTo(74,120),r.stroke(),r.beginPath(),r.moveTo(162,100),r.lineTo(182,120),r.moveTo(182,100),r.lineTo(162,120),r.stroke(),s(-10)}let c=new mo(n);return c.colorSpace=Bn,c}var df=new fs,ff=1.5,pf=class{group=new ui;capsule=new ui;head;portrait=null;portraitMaterial=null;face;faceMaterial;hash;textures=new Map;expression=`neutral`;bodyMaterial;skinMaterial;constructor(e,t=!1){this.hash=i(e);let n=this.hash,r=sf[n%sf.length],a=t?16052714:cf[(n>>>3)%cf.length],o=lf[(n>>>6)%lf.length],s=.9+(n>>>9)%5*.05;this.bodyMaterial=new Lo({color:a,roughness:.85}),this.skinMaterial=new Lo({color:r,roughness:.7});let c=new Lo({color:o,roughness:.9});this.group.add(this.capsule);let l=new X(new yo(.42*s,.5,6,16),this.bodyMaterial);l.position.y=.55,l.scale.set(1,1,.7),l.castShadow=!0,this.capsule.add(l);let u=new X(new xo(.11,.13,.16,12),this.skinMaterial);u.position.y=1.05,this.capsule.add(u),this.head=new X(new wo(.28,24,18),this.skinMaterial),this.head.position.y=1.36,this.head.scale.set(1,1.12,1),this.head.castShadow=!0,this.capsule.add(this.head);let d=new X(new wo(.295,24,12,0,Math.PI*2,0,Math.PI*(.35+(n>>>12)%3*.08)),c);if(d.position.y=1.4,d.scale.set(1,1.1,1),this.capsule.add(d),t){let e=new X(new vo(.22,.08,.06),new Lo({color:1710618}));e.position.set(0,.95,.3),this.capsule.add(e);let t=new X(new yo(.3,.3,4,12),new Lo({color:2039588,roughness:.8}));t.position.set(0,.5,.12),t.scale.set(1.2,1,.55),this.capsule.add(t)}else if((n>>>15)%3==0){let e=new X(new xo(.42,.42,.03,20),c);e.position.y=1.5,this.capsule.add(e);let t=new X(new xo(.26,.28,.22,20),c);t.position.y=1.6,this.capsule.add(t)}else if((n>>>15)%3==1){let e=new X(new To(.07,.012,8,16),new Lo({color:2236962}));e.position.set(-.1,1.38,.26);let t=e.clone();t.position.x=.1,this.capsule.add(e,t)}this.faceMaterial=new Ga({transparent:!0,map:this.texture(`neutral`),depthWrite:!1}),this.face=new X(new So(.46,.46),this.faceMaterial),this.face.position.set(0,1.36,.275),this.capsule.add(this.face),this.loadPortrait(t?`dealer`:e)}loadPortrait(e){let t=`./portraits/${e}.png`;df.load(t,e=>{e.colorSpace=Bn,e.anisotropy=8;let t=new Ga({map:e,transparent:!0,alphaTest:.08,color:16773602,side:2}),n=new X(new So(ff,ff),t);n.position.y=.9299999999999999,n.castShadow=!0,n.customDepthMaterial=new Ro({depthPacking:zn,map:e,alphaTest:.5}),this.portrait=n,this.portraitMaterial=t,this.group.add(n),this.capsule.visible=!1,this.folded&&(t.opacity=.38),this.applyTilt()},void 0,()=>{})}texture(e){let t=this.textures.get(e);return t||(t=uf(e,this.hash),this.textures.set(e,t)),t}folded=!1;setFolded(e){this.folded!==e&&(this.folded=e,this.group.traverse(t=>{let n=t.material;n&&`opacity`in n&&(n!==this.faceMaterial&&n!==this.portraitMaterial&&(n.transparent=e),n.opacity=e?.38:1)}))}tick(e){let t=e/1e3+this.hash%7,n=Math.sin(t*1.6)*.012;this.group.scale.y=1+n;let r=this.folded?-.14:this.expression===`thinking`?.12:this.expression===`tilted`?.06:0;this.group.rotation.x+=(r-this.group.rotation.x)*.08,this.head.rotation.y=Math.sin(t*.7)*.08+(this.expression===`thinking`?Math.sin(t*2.3)*.05:0),this.portrait&&(this.portrait.rotation.z=Math.sin(t*.9)*.012)}setExpression(e){e!==this.expression&&(this.expression=e,this.faceMaterial.map=this.texture(e),this.faceMaterial.needsUpdate=!0)}faceCamera(e){if(!this.portrait)return;let t=this.group.position;this.group.rotation.y=Math.atan2(e.x-t.x,e.z-t.z)}tilt=0;setTilt(e){this.tilt=Math.max(0,Math.min(1,e)),this.applyTilt()}applyTilt(){let e=this.tilt,t=new Y(16773602),n=new Y(1,t.g*(1-.62*e),t.b*(1-.72*e));this.portraitMaterial&&this.portraitMaterial.color.copy(n),this.faceMaterial.color.setRGB(1,1-.62*e,1-.72*e),this.bodyMaterial.emissive.setRGB(.35*e,0,0)}setOut(e){let t=e?.35:1;this.bodyMaterial.color.multiplyScalar(1),this.group.traverse(n=>{let r=n.material;r&&`opacity`in r&&(r!==this.faceMaterial&&r!==this.portraitMaterial&&(r.transparent=e),r.opacity=t)}),e&&this.setExpression(`out`)}},mf=class{ctx=null;master=null;ambient=null;noise=null;enabled=!0;constructor(){let e=()=>{this.ensure(),window.removeEventListener(`pointerdown`,e),window.removeEventListener(`keydown`,e)};window.addEventListener(`pointerdown`,e),window.addEventListener(`keydown`,e)}setEnabled(e){this.enabled=e,this.master&&this.master.gain.setTargetAtTime(+!!e,this.ctx.currentTime,.05),e&&this.startAmbient()}ensure(){if(this.ctx)return this.ctx.state===`suspended`&&this.ctx.resume(),this.ctx;let e=window.AudioContext||window.webkitAudioContext;if(!e)return null;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=+!!this.enabled,this.master.connect(this.ctx.destination);let t=this.ctx.sampleRate*2;this.noise=this.ctx.createBuffer(1,t,this.ctx.sampleRate);let n=this.noise.getChannelData(0),r=0;for(let e=0;e<t;e++){let t=Math.random()*2-1;r=(r+.02*t)/1.02,n[e]=r*3.5}return this.startAmbient(),this.ctx}startAmbient(){let e=this.ctx;if(!e||!this.noise||!this.master||this.ambient||!this.enabled)return;let t=e.createBufferSource();t.buffer=this.noise,t.loop=!0;let n=e.createBiquadFilter();n.type=`lowpass`,n.frequency.value=320;let r=e.createGain();r.gain.value=.035,t.connect(n).connect(r).connect(this.master),t.start(),this.ambient=t}play(e,t=1){let n=this.ensure();if(!n||!this.master||!this.enabled)return;let r=n.currentTime;switch(e){case`deal`:this.burst(r,.06,1800,.25*t,`bandpass`);break;case`flip`:this.burst(r,.05,2600,.18*t,`bandpass`),this.burst(r+.04,.08,900,.12*t,`lowpass`);break;case`fold`:this.burst(r,.12,700,.14*t,`lowpass`);break;case`chip`:this.ping(r,2200+Math.random()*600,.08,.22*t),this.ping(r+.015,3400+Math.random()*800,.05,.1*t);break;case`chips`:for(let e=0;e<6;e++)this.ping(r+e*.035+Math.random()*.01,1900+Math.random()*1500,.07,.14*t);this.burst(r,.25,1200,.08*t,`bandpass`);break;case`allin`:for(let e=0;e<14;e++)this.ping(r+e*.03,1800+Math.random()*1800,.08,.13*t);this.burst(r,.45,1e3,.1*t,`bandpass`);break;case`win`:for(let e=0;e<10;e++)this.ping(r+e*.04,2e3+Math.random()*1400,.09,.12*t);this.tone(r,523,.18,.05*t),this.tone(r+.12,659,.18,.05*t),this.tone(r+.24,784,.3,.06*t);break;case`tick`:this.ping(r,1200,.03,.08*t);break;case`zap`:{let e=n.createOscillator();e.type=`sawtooth`,e.frequency.setValueAtTime(220,r),e.frequency.exponentialRampToValueAtTime(1800,r+.25),e.frequency.exponentialRampToValueAtTime(90,r+.6);let i=n.createGain();i.gain.setValueAtTime(1e-4,r),i.gain.exponentialRampToValueAtTime(.12*t,r+.05),i.gain.exponentialRampToValueAtTime(1e-4,r+.65),e.connect(i).connect(this.master),e.start(r),e.stop(r+.7),this.burst(r+.3,.5,600,.2*t,`lowpass`),this.burst(r+.32,.25,3e3,.08*t,`highpass`);break}}}burst(e,t,n,r,i){let a=this.ctx,o=a.createBufferSource();o.buffer=this.noise,o.playbackRate.value=1+Math.random()*.2;let s=a.createBiquadFilter();s.type=i,s.frequency.value=n,s.Q.value=.8;let c=a.createGain();c.gain.setValueAtTime(r,e),c.gain.exponentialRampToValueAtTime(.001,e+t),o.connect(s).connect(c).connect(this.master),o.start(e,Math.random()*1.5),o.stop(e+t+.05)}ping(e,t,n,r){let i=this.ctx,a=i.createOscillator();a.type=`triangle`,a.frequency.setValueAtTime(t,e),a.frequency.exponentialRampToValueAtTime(t*.6,e+n);let o=i.createGain();o.gain.setValueAtTime(r,e),o.gain.exponentialRampToValueAtTime(.001,e+n),a.connect(o).connect(this.master),a.start(e),a.stop(e+n+.02)}tone(e,t,n,r){let i=this.ctx,a=i.createOscillator();a.type=`sine`,a.frequency.value=t;let o=i.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.exponentialRampToValueAtTime(r,e+.02),o.gain.exponentialRampToValueAtTime(.001,e+n),a.connect(o).connect(this.master),a.start(e),a.stop(e+n+.02)}},hf=e=>1-(1-e)**3,gf=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2,_f=e=>e,vf=class{active=[];now=0;speed=()=>1;tick(e){this.now+=e*this.speed();let t=[];for(let e of this.active){let n=e.duration<=0?1:Math.min(1,(this.now-e.start)/e.duration);e.update(e.easing(n)),n>=1&&t.push(e)}if(t.length){this.active=this.active.filter(e=>!t.includes(e));for(let e of t)e.resolve()}}run(e,t,n=hf){return new Promise(r=>{this.active.push({start:this.now,duration:e,easing:n,update:t,resolve:r})})}delay(e){return this.run(e,()=>{},_f)}clear(){let e=this.active;this.active=[];for(let t of e)t.update(1),t.resolve()}};function $(e){return`$${Math.round(e).toLocaleString(`en-US`)}`}var yf=class e{renderer;scene=new yi;camera;director;tweens=new vf;audio=new mf;container;overlay;figures=new Map;dealerFigure=null;hole=new Map;board=[];bets=new Map;betAmounts=new Map;pot=new Md;button;hand=null;out=new Set;finishes=new Map;moodBase=new Map;lastFrame=0;stage;seatNames=new Map;levelChanged=!1;puffTexture=null;pendingResult=null;shownHands=new Map;payouts=new Map;pipCamera=new Es(34,1.5,.1,60);pip=null;pipEl=null;pipToken=0;constructor(e,t,n){this.stage=n,this.container=e,this.overlay=t,this.renderer=new ad({antialias:!0,powerPreference:`high-performance`}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=1,this.renderer.toneMapping=4,this.renderer.toneMappingExposure=1.05,e.appendChild(this.renderer.domElement),this.scene.background=new Y(462859),this.scene.fog=new vi(462859,14,30),this.camera=new Es(48,1,.1,60),this.director=new rf(this.camera),this.buildRoom(),this.buildTable(),this.button=this.buildButton(),this.scene.add(this.pot.group),this.pot.group.position.copy(Ud),n.onFit=()=>this.resize(),this.resize(),this.renderer.setAnimationLoop(e=>this.frame(e))}setSpeed(e){this.tweens.speed=e}attachInset(e){this.pipEl=e}layoutBacking(){let e=this.pipEl;if(!e)return;let t=this.stage.toStage(e.getBoundingClientRect()),n=this.stage.toStage(e.querySelector(`.frame`).getBoundingClientRect()),r=(t,n,r,i,a)=>{let o=e.querySelector(`.backing.${t}`);o.style.top=`${n}px`,o.style.bottom=`${r}px`,o.style.left=`${i}px`,o.style.right=`${a}px`};r(`top`,0,t.height-(n.top-t.top),0,0),r(`bottom`,n.bottom-t.top,0,0,0),r(`left`,n.top-t.top,t.height-(n.bottom-t.top),0,t.width-(n.left-t.left)),r(`right`,n.top-t.top,t.height-(n.bottom-t.top),n.right-t.left,0)}showInset(e,t,n,r){let i=++this.pipToken,a=this.pip!==null,o=!this.pip||this.pip.seat!==e;this.pip={seat:e,token:i};let s=this.pipEl;if(s){let e=()=>{s.querySelector(`.who`).textContent=n;let e=s.querySelector(`.caption`);e.textContent=r,e.classList.toggle(`show`,r.length>0),s.classList.remove(`swap`)};a&&o?(s.classList.add(`swap`),window.setTimeout(()=>{this.pipToken===i&&e()},180)):e(),s.classList.add(`show`),this.layoutBacking()}return this.overlay.setSpeaking(e,!0),s&&(this.overlay.panelLeft=s.offsetLeft),window.setTimeout(()=>{this.pipToken===i&&this.hideInset()},t),i}hideInset(){this.pip&&this.overlay.setSpeaking(this.pip.seat,!1),this.pip=null,this.pipEl?.classList.remove(`show`),this.overlay.panelLeft=null}renderInset(){let e=this.pipEl;if(!this.pip||!e)return;let t=e.querySelector(`.frame`),n=this.stage.toStage(t.getBoundingClientRect()),r=this.stage.toStage(this.renderer.domElement.getBoundingClientRect()),i=Math.round(n.left-r.left),a=Math.round(r.bottom-n.bottom),o=Math.round(n.width),s=Math.round(n.height);if(o<=0||s<=0)return;let c=this.figures.get(this.pip.seat),l=this.pip.seat===-1?nf(qd):tf(this.pip.seat);if(c?.portrait){let e=c.group.position,t=new K(-e.x,0,-e.z).normalize();l={pos:e.clone().add(t.multiplyScalar(1.75)).setY(1.4),look:new K(e.x,1.22,e.z)}}this.pipCamera.aspect=n.width/n.height,this.pipCamera.updateProjectionMatrix(),this.pipCamera.position.copy(l.pos),this.pipCamera.lookAt(l.look);let u=this.pip.seat===-1?this.dealerFigure:this.figures.get(this.pip.seat),d=u?.folded??!1;u&&d&&u.setFolded(!1),u?.faceCamera(this.pipCamera.position),this.renderer.setScissorTest(!0),this.renderer.setViewport(i,a,o,s),this.renderer.setScissor(i,a,o,s),this.fitBackdrop(o/s),this.renderer.render(this.scene,this.pipCamera),this.fitBackdrop(af/460),this.renderer.setScissorTest(!1),u&&d&&u.setFolded(!0),u?.faceCamera(this.camera.position);let f=this.renderer.getSize(new G);this.renderer.setViewport(0,0,f.x,f.y)}darkSet=[];brightSet=[];roomTexture=null;roomOn=!1;setRoom(e){this.roomOn=e;for(let t of this.darkSet)t.visible=!e;for(let t of this.brightSet)t.visible=e;if(e){if(!this.roomTexture){let e=new fs().load(`./room.jpg`);e.colorSpace=Bn,this.roomTexture=e}this.scene.background=this.roomTexture,this.scene.fog=null,this.renderer.toneMappingExposure=1}else this.scene.background=new Y(462859),this.scene.fog=new vi(462859,14,30),this.renderer.toneMappingExposure=1.05}fitBackdrop(e){let t=this.roomTexture;if(!t||!this.roomOn)return;let n=2048/1152;if(e>=n){let r=n/e;t.repeat.set(1,r),t.offset.set(0,Math.max(0,(1-r)*.3))}else{let r=e/n;t.repeat.set(r,1),t.offset.set((1-r)/2,0)}}buildRoom(){let e=new ms(13621458,1714720,.35);this.scene.add(e),this.darkSet.push(e);let t=new Os(16773596,260,30,.62,.55,1.6);t.position.set(.5,9.5,1.5),t.target.position.set(0,0,0),t.castShadow=!0,t.shadow.mapSize.set(1024,1024),t.shadow.bias=-4e-4,t.shadow.radius=4,this.scene.add(t,t.target),this.darkSet.push(t);let n=new js(12571903,.5);n.position.set(-6,6,8),this.scene.add(n),this.darkSet.push(n);let r=new js(16767400,.55);r.position.set(0,4,-10),this.scene.add(r),this.darkSet.push(r);let i=new js(16773856,.75);i.position.set(0,3.5,9),this.scene.add(i);let a=new X(new bo(22,48),new Lo({color:2759702,roughness:.95}));a.rotation.x=-Math.PI/2,a.position.y=-1.2,a.receiveShadow=!0,this.scene.add(a),this.darkSet.push(a);let o=new ms(16777215,14271392,.95);this.scene.add(o);let s=new js(16774372,1.5);s.position.set(7,9,4),s.castShadow=!0,s.shadow.mapSize.set(1024,1024),s.shadow.bias=-4e-4,s.shadow.camera.left=s.shadow.camera.bottom=-8,s.shadow.camera.right=s.shadow.camera.top=8,this.scene.add(s,s.target);let c=new js(16773340,.5);c.position.set(-5,3,8),this.scene.add(c);let l=new X(new bo(22,48),new Eo({opacity:.22}));l.rotation.x=-Math.PI/2,l.position.y=-1.2,l.receiveShadow=!0,this.scene.add(l),this.brightSet.push(o,s,c,l);for(let e of this.brightSet)e.visible=!1}buildTable(){let e=new Lo({color:1929021,roughness:.96}),t=new X(new xo(Nd,Nd,.16,96),e);t.scale.z=Pd/Nd,t.position.y=-.08,t.receiveShadow=!0,this.scene.add(t);let n=new fs().load(`./dragon.webp`);n.colorSpace=Bn,n.anisotropy=8;let r=new X(new So(7.4,864/1536*7.4),new Lo({map:n,transparent:!0,opacity:.82,roughness:1,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1}));r.rotation.x=-Math.PI/2,r.position.set(0,.003,-.1),r.receiveShadow=!0,this.scene.add(r);let i=new X(new Co(Nd*.62,Nd*.63,96),new Lo({color:1399344,roughness:1}));i.rotation.x=-Math.PI/2,i.scale.y=Pd/Nd,i.position.y=.002,this.scene.add(i);let a=new Lo({color:3809555,roughness:.55,metalness:.05}),o=new X(new To(Nd+.05,.3,18,120),a);o.rotation.x=Math.PI/2,o.scale.y=(Pd+.05)/(Nd+.05),o.position.y=.06,o.castShadow=!0,o.receiveShadow=!0,this.scene.add(o);let s=new X(new xo(Nd+.2,Nd-.4,1.05,64),new Lo({color:1708300,roughness:.8}));s.scale.z=Pd/Nd,s.position.y=-.66,s.castShadow=!0,this.scene.add(s);let c=new pf(`dealer`,!0);this.dealerFigure=c,c.group.position.copy(qd),c.group.position.y=.05,c.group.rotation.y=Zd(qd),c.group.scale.setScalar(1.18),this.scene.add(c.group)}buildButton(){let e=document.createElement(`canvas`);e.width=e.height=128;let t=e.getContext(`2d`);t.fillStyle=`#f6f1e6`,t.beginPath(),t.arc(64,64,62,0,Math.PI*2),t.fill(),t.fillStyle=`#1c1c1c`,t.font=`bold 72px Arial`,t.textAlign=`center`,t.textBaseline=`middle`,t.fillText(`D`,64,68);let n=new mo(e);n.colorSpace=Bn;let r=[new Lo({color:15327954}),new Lo({map:n}),new Lo({color:15327954})],i=new X(new xo(.17,.17,.045,32),r);return i.position.copy(Vd(0)),i.castShadow=!0,this.scene.add(i),i}figureFor(e,t){let n=this.figures.get(e);if(n)return n;n=new pf(t);let r=Rd(e);n.group.position.copy(r),n.group.position.y=-.1,n.group.rotation.y=Zd(r),n.group.visible=e!==0,n.group.userData.seat=e,this.scene.add(n.group),this.figures.set(e,n);let i=new Md;return i.group.position.copy(Bd(e)),this.scene.add(i.group),this.bets.set(e,i),n}resize(){this.layoutBacking(),this.renderer.setPixelRatio(Math.min(3,window.devicePixelRatio*this.stage.scale)),this.renderer.setSize(af,460,!0),this.camera.aspect=af/460,this.camera.updateProjectionMatrix()}frame(e){let t=this.lastFrame?Math.min(100,e-this.lastFrame):16;this.lastFrame=e,this.tweens.tick(t);for(let t of this.figures.values())t.group.visible&&(t.tick(e),t.faceCamera(this.camera.position));this.dealerFigure?.faceCamera(this.camera.position),this.overlay.update(this.camera,af,460),this.fitBackdrop(af/460),this.renderer.render(this.scene,this.camera),this.renderInset()}async present(e){switch(e.type){case`tournamentStart`:for(let t of e.seats)this.figureFor(t.seat,t.id),this.seatNames.set(t.seat,t.name),this.overlay.plate(t.seat,Hd(t.seat),t.name,t.stack);this.overlay.dealerPlate(Jd,n),this.overlay.setInfo({level:e.level,handNumber:0});return;case`handStart`:return this.handStart(e.hand,e.level);case`post`:return this.post(e.seat,e.amount);case`deal`:return this.deal(e.seat,e.cards);case`turn`:return this.turn(e.seat);case`action`:return this.action(e.seat,e.action.type,e.amount,e.allIn);case`street`:return this.street(e.board);case`showdown`:return this.showdown(e.seat,e.cards,e.description);case`payout`:return this.payout(e.seat,e.amount,e.returned);case`handEnd`:return this.handEnd(e);case`bust`:for(let t of e.seats)this.out.add(t),this.finishes.set(t,e.finishes[t]),this.overlay.setOut(t,e.finishes[t]),this.overlay.setPosition(t,``),await this.vaporise(t);if(this.pendingResult){let e=this.pendingResult;this.pendingResult=null,await e()}return;case`level`:return this.levelChanged=!0,this.overlay.setInfo({level:e.level}),this.overlay.toast(`Blinds up: ${$(e.level.sb)} / ${$(e.level.bb)}${e.level.ante?` · ante ${$(e.level.ante)}`:``}`),this.tweens.delay(600);case`tournamentEnd`:return}}async vaporise(e){let t=document.getElementById(`flash`),n=this.figures.get(e),r=qd.clone().add(new K(0,1.22,0)),i=e===0?this.camera.position.clone().add(new K(0,-.3,0)):Rd(e).add(new K(0,.95,0));this.audio.play(`zap`);let a=i.clone().sub(r),o=a.length(),s=new ui,c=(e,t)=>{let n=new X(new xo(e,e,o,8,1,!0),new Ga({color:16722458,transparent:!0,opacity:t,blending:2,depthWrite:!1}));return n.position.y=o/2,s.add(n),n},l=c(.018,1),u=c(.07,.35);s.position.copy(r),s.quaternion.setFromUnitVectors(new K(0,1,0),a.normalize()),s.scale.y=.001,this.scene.add(s),await this.tweens.run(140,e=>{s.scale.y=Math.max(.001,e)}),await this.tweens.run(320,n=>{let r=.75+.25*Math.sin(n*60);l.material.opacity=r,u.material.opacity=.35*r,t&&(t.style.opacity=String(e===0?.55*r:.18*r))}),n&&(n.group.visible=!1),t&&(t.style.opacity=`0`);let d=this.makePuff(e===0?i.clone().add(new K(0,-.4,-1.2)):i.clone().add(new K(0,-.25,0)));this.scene.add(d.group),await Promise.all([this.tweens.run(180,e=>{s.scale.y=Math.max(.001,1-e),u.material.opacity=.35*(1-e)}),this.tweens.run(900,e=>d.update(e))]),this.scene.remove(s),this.scene.remove(d.group);for(let e of s.children)e.geometry.dispose(),e.material.dispose();d.dispose(),await this.tweens.delay(250)}makePuff(e){if(!this.puffTexture){let e=document.createElement(`canvas`);e.width=e.height=64;let t=e.getContext(`2d`),n=t.createRadialGradient(32,32,2,32,32,32);n.addColorStop(0,`rgba(230,225,215,1)`),n.addColorStop(.5,`rgba(170,165,160,.55)`),n.addColorStop(1,`rgba(120,115,110,0)`),t.fillStyle=n,t.fillRect(0,0,64,64),this.puffTexture=new mo(e)}let t=new ui,n=[];for(let r=0;r<26;r++){let r=new Ra(new wa({map:this.puffTexture,transparent:!0,opacity:.85,depthWrite:!1})),i=Math.random()*Math.PI*2,a=.1+Math.random()*.35;r.position.set(e.x+Math.cos(i)*a*.3,e.y+(Math.random()-.3)*.3,e.z+Math.sin(i)*a*.3),n.push({s:r,v:new K(Math.cos(i)*a,.25+Math.random()*.5,Math.sin(i)*a),size:.25+Math.random()*.35}),t.add(r)}for(let r=0;r<8;r++){let r=new Ra(new wa({map:this.puffTexture,color:16732208,transparent:!0,opacity:1,depthWrite:!1,blending:2}));r.position.copy(e);let i=Math.random()*Math.PI*2;n.push({s:r,v:new K(Math.cos(i)*.8,.6+Math.random()*.8,Math.sin(i)*.8),size:.08}),t.add(r)}let r=n.map(e=>e.s.position.clone());return{group:t,update:e=>{for(let t=0;t<n.length;t++){let i=n[t];i.s.position.copy(r[t]).addScaledVector(i.v,e);let a=i.size*(.4+1.6*e);i.s.scale.set(a,a,1),i.s.material.opacity=(i.size<.1?1:.85)*(1-e)*(1-e)}},dispose:()=>{for(let e of n)e.s.material.dispose()}}}refreshStacks(){if(this.hand)for(let e of this.hand.players)this.overlay.setStack(e.seat,e.stack)}static positions(e){let t=e.players.map(e=>e.seat),n=t.length,r=t.indexOf(e.button),i=t.map((e,i)=>t[(r+i)%n]),a=n===2?[`BTN`,`BB`]:[`BTN`,`SB`,`BB`,...n===6?[`UTG`,`HJ`,`CO`]:n===5?[`UTG`,`CO`]:n===4?[`UTG`]:[]],o=new Map;return i.forEach((e,t)=>o.set(e,a[t]??``)),o}humanToAct=!1;speak(e,t,n,r,i,a,o=!1){let s=performance.now(),c=this.speechChain.then(async()=>{let c=performance.now()-s;if(!o&&c>6e3)return;let l=Math.min(r,1600+n.length*42),u=this.speakNow(e,t,n,r,i,a);await Promise.race([u,new Promise(e=>setTimeout(e,l))])});return this.speechChain=c.catch(()=>void 0),c}speechChain=Promise.resolve();async speakNow(e,t,n,r,i,a){let o=this.figures.get(e),s=t===void 0?void 0:this.figures.get(t),c=[`targetFoldsToMe`,`targetCallsMeDown`,`targetTank`,`targetInstant`,`winShowdown`,`stackedTarget`,`badBeatGiven`,`playerOut`].includes(i),l=[`badBeatTaken`,`loseShowdown`,`stackedByTarget`,`bluffCaught`].includes(i);o&&!this.out.has(e)&&o.setExpression(l?`annoyed`:c?`happy`:o.expression);let u=s&&t!==void 0&&t!==0&&t!==e?900:0,d=this.showInset(e,r-u,a,n);await new Promise(e=>setTimeout(e,Math.max(0,r-u))),this.pipToken===d&&(u&&s&&t!==void 0&&(c&&!this.out.has(t)&&s.setExpression(`annoyed`),this.showInset(t,u,this.seatNames.get(t)??``,``),await new Promise(e=>setTimeout(e,u))),o&&!this.out.has(e)&&o.setExpression(this.moodBase.get(e)??`neutral`),s&&t!==void 0&&!this.out.has(t)&&s.setExpression(this.moodBase.get(t)??`neutral`))}async handStart(t,n){this.hand=t,this.tweens.clear(),this.humanToAct=!1;let r=e.positions(t),i=[...this.figures.keys()].map(e=>{let n=t.players.find(t=>t.seat===e);return{seat:e,name:this.seatNames.get(e)??``,stack:n?n.stack+n.committed:0,position:r.get(e)??``,finish:this.finishes.get(e)}}),a=this.tweens.speed()>1.5;if(t.handNumber===1||this.levelChanged){let e=t.handNumber===1?`Hand 1 · Blinds ${$(n.sb)} / ${$(n.bb)}`:`Blinds up: ${$(n.sb)} / ${$(n.bb)}${n.ante?` · ante ${$(n.ante)}`:``}`;this.overlay.showStandings(i,e,a?900:3200)}this.levelChanged=!1;for(let[e,t]of r)this.overlay.setPosition(e,t);for(let e of this.figures.keys())r.has(e)||this.overlay.setPosition(e,``),this.figures.get(e)?.setFolded(!t.players.some(t=>t.seat===e)&&!this.out.has(e));for(let e of this.hole.values())for(let t of e)this.removeCard(t);this.hole.clear();for(let e of this.board)this.removeCard(e);this.board=[];for(let[e,t]of this.bets)t.set(0),t.group.position.copy(Bd(e)),this.overlay.setBet(e,0);this.betAmounts.clear(),this.pot.set(0),this.pot.group.position.copy(Ud),this.overlay.setPot(0),this.overlay.setHole(null),this.overlay.setBoard([]),this.overlay.hideResult(),this.shownHands.clear(),this.payouts.clear(),this.overlay.setInfo({level:n,handNumber:t.handNumber});for(let[e,n]of this.figures)this.out.has(e)||n.setExpression(this.moodBase.get(e)??`neutral`),this.overlay.setTag(e,``),this.overlay.setFolded(e,!t.players.some(t=>t.seat===e));this.refreshStacks();let o=Vd(t.button),s=this.button.position.clone();await this.tweens.run(350,e=>{this.button.position.lerpVectors(s,o,e),this.button.position.y=.01+Math.sin(Math.PI*e)*.3})}async post(e,t){let n=(this.betAmounts.get(e)??0)+t;this.betAmounts.set(e,n),this.refreshStacks(),await this.dropBet(e,n,220)}dropBet(e,t,n){this.audio.play(t>=1e3?`chips`:`chip`);let r=this.bets.get(e);r.set(t),this.overlay.setBet(e,t,Bd(e));let i=Bd(e);return this.tweens.run(n,e=>{r.group.position.set(i.x,(1-e)*.35,i.z)})}async deal(e,t){let n=zd(e),r=Qd(n),i=new K(Math.cos(r),0,-Math.sin(r)),a=[];for(let o=0;o<t.length;o++){let s=new xd(e===0?t[o]:null);s.group.position.copy(Yd),s.group.rotation.y=r+.6,this.scene.add(s.group),a.push(s),this.audio.play(`deal`,.8);let c=n.clone().add(i.clone().multiplyScalar((o-.5)*.4));c.y+=o*.004;let l=Yd.clone(),u=s.group.rotation.y,d=this.tweens.run(230,e=>{s.group.position.lerpVectors(l,c,e),s.group.position.y+=Math.sin(Math.PI*e)*.4,s.group.rotation.y=u+(r-u)*e});o<t.length-1?await this.tweens.delay(90):await d}this.hole.set(e,a),e===0&&(a.forEach((e,n)=>(e.setCard(t[n]),void 0)),await Promise.all(a.map((e,t)=>this.flipCard(e,!0,280,t*70))),this.overlay.setHole(t))}async flipCard(e,t,n,r=0){r&&await this.tweens.delay(r),this.audio.play(`flip`);let i=e.flip.rotation.x,a=t?0:Math.PI,o=e.group.position.y;await this.tweens.run(n,t=>{e.flip.rotation.x=i+(a-i)*t,e.group.position.y=o+Math.sin(Math.PI*t)*.22},gf)}removeCard(e){this.scene.remove(e.group),e.dispose()}async turn(e){this.overlay.setActive(e),this.humanToAct=e===0,e===0&&this.audio.play(`tick`,.6),e!==0&&this.figures.get(e)?.setExpression(`thinking`)}async action(e,t,n,r){this.overlay.setActive(null),e===0&&(this.humanToAct=!1);let i=this.figures.get(e);i&&!this.out.has(e)&&i.setExpression(this.moodBase.get(e)??`neutral`);let a=this.hand.player(e),o=r?`ALL IN`:t===`raise`?`RAISE ${$(a.streetBet)}`:t===`bet`?`BET ${$(a.streetBet)}`:t.toUpperCase();if(this.overlay.setTag(e,o,t===`fold`?`muted`:r?`hot`:t===`raise`||t===`bet`?`strong`:``),this.refreshStacks(),t===`fold`){this.audio.play(`fold`),this.overlay.setFolded(e,!0),e!==0&&i?.setFolded(!0),e===0&&this.overlay.setHole(null);let t=this.hole.get(e)??[];this.hole.delete(e),await Promise.all(t.map((e,t)=>{let n=e.group.position.clone(),r=Xd.clone().add(new K(t*.05,.02*t,0));return this.tweens.run(320,t=>{e.group.position.lerpVectors(n,r,t),e.group.position.y+=Math.sin(Math.PI*t)*.3}).then(()=>this.removeCard(e))}))}else n>0?(this.betAmounts.set(e,a.streetBet),r&&this.audio.play(`allin`),r&&e!==0&&!this.pip&&this.showInset(e,2200,this.seatNames.get(e)??``,`All in`),await this.dropBet(e,a.streetBet,260),r&&await this.tweens.delay(500)):await this.tweens.delay(220)}async gatherBets(){let e=[];for(let[t,n]of this.betAmounts){if(n<=0)continue;let r=this.bets.get(t);this.audio.play(`chips`,.6);let i=r.group.position.clone();this.overlay.setBet(t,0),e.push(this.tweens.run(380,e=>{r.group.position.lerpVectors(i,Ud,e)},gf).then(()=>{r.set(0),r.group.position.copy(Bd(t))}))}this.betAmounts.clear(),await Promise.all(e);let t=this.hand?.potTotal()??0;this.pot.set(t),this.overlay.setPot(t,Wd)}async street(e){await this.gatherBets();for(let[e]of this.figures)this.overlay.setTag(e,``);let t=this.board.length,n=[];for(let r=t;r<e.length;r++){let i=new xd(e[r]);i.group.position.copy(Yd),this.scene.add(i.group),this.board.push(i);let a=Yd.clone(),o=$d(r),s=(r-t)*140;n.push(this.tweens.delay(s).then(()=>this.tweens.run(260,e=>{i.group.position.lerpVectors(a,o,e),i.group.position.y+=Math.sin(Math.PI*e)*.35})).then(()=>this.flipCard(i,!0,300)).then(()=>this.overlay.setBoard(e.slice(0,r+1))))}await Promise.all(n)}async showdown(e,t,n){this.shownHands.set(e,{cards:t,description:n});let r=this.hole.get(e)??[];this.overlay.setTag(e,n.toUpperCase(),`strong`),e!==0&&(r.forEach((e,n)=>e.setCard(t[n])),await Promise.all(r.map((e,t)=>this.flipCard(e,!0,320,t*80))),await this.tweens.delay(250))}async payout(e,t,n){if(this.betAmounts.size>0&&await this.gatherBets(),n){this.refreshStacks();return}this.payouts.set(e,(this.payouts.get(e)??0)+t);let r=this.pot.group.position.clone(),i=Bd(e);this.overlay.setTag(e,`WINS ${$(t)}`,`hot`),this.audio.play(t>=3e3?`win`:`chips`),this.pot.set(t),await this.tweens.run(520,e=>{this.pot.group.position.lerpVectors(r,i,e),this.pot.group.position.y=Math.sin(Math.PI*e)*.2},gf),this.pot.set(0),this.pot.group.position.copy(Ud),this.overlay.setPot(0),this.refreshStacks(),this.figures.get(e)?.setExpression(`happy`)}async handEnd(e){for(let[t,n]of Object.entries(e.outcomes)){let r=Number(t),i=this.figures.get(r);if(!i||!n)continue;let a=e.moods[r],o=a&&a.clarity>=60?`tilted`:`neutral`;this.moodBase.set(r,o),a&&i.setTilt((a.clarity-25)/60),n.badBeat?i.setExpression(`shocked`):n.net<0&&Math.abs(n.net)>.2*Math.max(1,n.stackAfter)?i.setExpression(`annoyed`):n.net>0&&i.setExpression(`happy`)}let t=e.hand.events.some(e=>e.type===`showdown`);e.hand.players.some(t=>t.stack===0&&!e.winners.includes(t.seat))?(this.pendingResult=async()=>{this.showResult(e.hand,e.winners,t),await this.tweens.delay(t?2400:1200)},await this.tweens.delay(500)):(this.showResult(e.hand,e.winners,t),await this.tweens.delay(t?2400:1200))}showResult(e,t,n){let r=e=>e===0?`You`:this.seatNames.get(e)??``,i=e=>this.payouts.get(e)??0;if(!n){let e=t[0];if(e===void 0)return;this.overlay.showResult(`${r(e)} ${e===0?`take`:`takes`} ${$(i(e))}. Everyone else folded.`,[]);return}let a=[...e.players.filter(e=>!e.folded)].sort((e,n)=>Number(t.includes(n.seat))-Number(t.includes(e.seat))).map(e=>{let n=this.shownHands.get(e.seat);return{name:r(e.seat),cards:n?.cards??e.hole,description:n?.description??``,winner:t.includes(e.seat),amount:i(e.seat),you:e.seat===0}}),o=a[0],s=t.length>1?`Split pot: ${t.map(r).join(` and `)} with ${o.description}`:`${o.name} ${o.you?`win`:`wins`} ${$(o.amount)} with ${o.description}`;this.overlay.showResult(s,a)}},bf=class{root;fold;passive;aggressive;sizing;slider;amountEl;confirm;spot=null;onAction=()=>{};constructor(e){this.root=e,this.fold=e.querySelector(`.fold`),this.passive=e.querySelector(`.passive`),this.aggressive=e.querySelector(`.aggressive`),this.sizing=e.querySelector(`.sizing`),this.slider=e.querySelector(`input[type=range]`),this.amountEl=e.querySelector(`.amount`),this.confirm=e.querySelector(`.confirm`),this.fold.addEventListener(`click`,()=>this.send({type:`fold`})),this.passive.addEventListener(`click`,()=>{this.spot&&this.send(this.spot.legal.canCheck?{type:`check`}:{type:`call`})}),this.aggressive.addEventListener(`click`,()=>{this.sizing.classList.toggle(`show`),this.syncAmount()}),this.slider.addEventListener(`input`,()=>this.syncAmount()),this.confirm.addEventListener(`click`,()=>{if(!this.spot)return;let e=Number(this.slider.value);this.send(this.spot.legal.canBet?{type:`bet`,amount:e}:{type:`raise`,amount:e})});for(let t of e.querySelectorAll(`.quick`))t.addEventListener(`click`,()=>this.quick(t.dataset.size))}show(e){this.spot=e;let{legal:t}=e;this.fold.disabled=t.canCheck;let n=!t.canCheck&&t.callAmount>=t.maxTo-e.streetBet;this.passive.textContent=t.canCheck?`Check`:n?`Call ${$(t.callAmount)} · all in`:`Call ${$(t.callAmount)}`;let r=t.canBet||t.canRaise;this.aggressive.disabled=!r,this.aggressive.textContent=t.canBet?`Bet`:`Raise`;let i=t.canBet?t.minBet:t.minRaiseTo;this.slider.min=String(i),this.slider.max=String(t.maxTo),this.slider.step=String(Math.max(1,Math.min(e.bigBlind/2,25))),this.slider.value=String(i),this.sizing.classList.remove(`show`),this.syncAmount(),this.root.classList.add(`show`)}hide(){this.spot=null,this.root.classList.remove(`show`),this.sizing.classList.remove(`show`)}potFraction(e){let{legal:t,pot:n,streetBet:r}=this.spot,i=t.canCheck?0:t.callAmount;return r+i+Math.round((n+i)*e)}quick(e){if(!this.spot)return;let{legal:t}=this.spot,n=t.canBet?t.minBet:t.minRaiseTo,r;switch(e){case`min`:r=n;break;case`half`:r=this.potFraction(.5);break;case`threeq`:r=this.potFraction(.75);break;case`pot`:r=this.potFraction(1);break;default:r=t.maxTo}r=Math.round(r/25)*25,r=Math.max(n,Math.min(t.maxTo,r)),this.slider.value=String(r),this.syncAmount()}syncAmount(){if(!this.spot)return;let{legal:e}=this.spot,t=Number(this.slider.value),n=t>=e.maxTo,r=e.canBet?`Bet`:`Raise to`;this.amountEl.textContent=n?`All in · ${$(t)}`:`${r} ${$(t)}`,this.confirm.textContent=n?`All in`:e.canBet?`Bet`:`Raise`}send(e){this.hide(),this.onAction(e)}},xf=[`♣`,`♦`,`♥`,`♠`];function Sf(e){let t=u[m(e)],n=h(e);return`<div class="pcard ${n===1||n===2?`red`:``}"><span class="rank">${t===`T`?`10`:t}</span><span class="suit">${xf[n]}</span></div>`}var Cf=class{root;holeEl;infoEl;toastEl;anchored=new Map;plates=new Map;tmp=new K;toastTimer=null;level=null;handNumber=0;tournamentName=``;boardEl;boardCards=[];potAmount=0;meEl;standingsEl;resultEl;constructor(e,t,n,r,i,a,o,s){this.root=e,this.meEl=a,this.standingsEl=o,this.resultEl=s,o.addEventListener(`click`,()=>this.hideStandings()),this.holeEl=t,this.infoEl=n,this.toastEl=r,this.boardEl=i}showResult(e,t){let n=this.resultEl;n.innerHTML=`<div class="rhead">${e}</div>`+t.map(e=>`<div class="rrow ${e.winner?`win`:``} ${e.you?`you`:``}"><span class="cards">${e.cards.map(Sf).join(``)}</span><span class="rname">${e.name}</span><span class="rdesc">${e.winner&&e.amount?`${e.description} · ${$(e.amount)}`:e.description}</span></div>`).join(``),n.classList.add(`show`)}hideResult(){this.resultEl.classList.remove(`show`)}setBoard(e){if(e.length===this.boardCards.length&&e.every((e,t)=>e===this.boardCards[t]))return;let t=e.length>this.boardCards.length;this.boardCards=[...e];let n=e.map((n,r)=>`<div class="slot ${t&&r>=e.length-(e.length===3?3:1)?`new`:``}">${Sf(n)}</div>`);for(let t=e.length;t<5;t++)n.push(`<div class="slot empty"></div>`);this.boardEl.querySelector(`.cards`).innerHTML=n.join(``),this.renderPot()}renderPot(){let e=this.boardEl.querySelector(`.potline`);e.textContent=this.potAmount>0?`POT ${$(this.potAmount)}`:``,this.boardEl.classList.toggle(`show`,this.boardCards.length>0||this.potAmount>0)}anchor(e,t,n,r=0){let i=this.anchored.get(e);if(i)i.pos.copy(t);else{let a=document.createElement(`div`);a.className=n,this.root.appendChild(a),i={el:a,pos:t.clone(),offsetY:r},this.anchored.set(e,i)}return i.el}plate(e,t,n,r){let i=e===0?this.meEl:this.anchor(`plate${e}`,t,`plate`,0);e===0&&(i.className=`plate me`),i.innerHTML=`<div class="tag"></div><div class="pos"></div><div class="name"></div><div class="stack"></div>`,i.querySelector(`.name`).textContent=n,i.querySelector(`.stack`).textContent=$(r),i.dataset.seat=String(e),this.plates.set(e,i)}dealerPlate(e,t){let n=this.anchor(`plateDealer`,e,`plate dealer`,0);n.innerHTML=`<div class="tag"></div><div class="pos show">DEALER</div><div class="name"></div>`,n.querySelector(`.name`).textContent=t,n.dataset.seat=`-1`,this.plates.set(-1,n)}setStack(e,t){let n=this.plates.get(e);n&&(n.querySelector(`.stack`).textContent=t>0?$(t):`ALL IN`)}setTag(e,t,n=``){let r=this.plates.get(e);if(!r)return;let i=r.querySelector(`.tag`);i.textContent=t,i.className=`tag ${n}`,i.classList.toggle(`show`,t.length>0)}setPosition(e,t){let n=this.plates.get(e)?.querySelector(`.pos`);n&&(n.textContent=t,n.classList.toggle(`show`,t.length>0),n.classList.toggle(`btn`,t===`BTN`))}showStandings(e,t,n){let r=this.standingsEl;r.innerHTML=`<div class="shead">${t}</div><ol>${[...e].sort((e,t)=>e.finish&&t.finish?e.finish-t.finish:e.finish?1:t.finish?-1:t.stack-e.stack).map((e,t)=>`<li class="${e.seat===0?`you`:``} ${e.finish?`out`:``}"><span class="rank">${e.finish?wf(e.finish):t+1}</span><span class="nm">${e.name}</span><span class="pos ${e.position===`BTN`?`btn`:``}">${e.position}</span><span class="st">${e.finish?`OUT`:$(e.stack)}</span></li>`).join(``)}</ol>`,r.classList.add(`show`);let i=String(Date.now());r.dataset.token=i,window.setTimeout(()=>{r.dataset.token===i&&r.classList.remove(`show`)},n)}hideStandings(){this.standingsEl.classList.remove(`show`)}setSpeaking(e,t){(e===0?this.meEl:this.plates.get(e))?.classList.toggle(`speaking`,t)}setActive(e){for(let[t,n]of this.plates)n.classList.toggle(`active`,t===e)}setFolded(e,t){this.plates.get(e)?.classList.toggle(`folded`,t)}setOut(e,t){let n=this.plates.get(e);n&&(n.classList.add(`out`),n.querySelector(`.stack`).textContent=`OUT · ${wf(t)}`)}setBet(e,t,n){let r=this.anchor(`bet${e}`,n??this.anchored.get(`bet${e}`)?.pos??new K,`bet`,20);r.textContent=t>0?$(t):``,r.classList.toggle(`show`,t>0)}setPot(e,t){this.potAmount=e,this.renderPot()}setHole(e){this.holeEl.innerHTML=e?e.map(Sf).join(``):``,this.holeEl.classList.toggle(`show`,!!e)}setInfo(e){e.level&&(this.level=e.level),e.handNumber!==void 0&&(this.handNumber=e.handNumber);let t=this.level;this.infoEl.textContent=`${this.tournamentName}${this.handNumber?` · Hand ${this.handNumber}`:``}${t?` · Blinds ${$(t.sb)}/${$(t.bb)}${t.ante?` · Ante ${$(t.ante)}`:``}`:``}`}toast(e,t=2200){this.toastEl.textContent=e,this.toastEl.classList.add(`show`),this.toastTimer&&clearTimeout(this.toastTimer),this.toastTimer=window.setTimeout(()=>this.toastEl.classList.remove(`show`),t)}panelLeft=null;update(e,t,n){for(let r of this.anchored.values()){this.tmp.copy(r.pos).project(e);let i=this.tmp.z>1||this.panelLeft!==null&&(this.tmp.x*.5+.5)*t>this.panelLeft-20,a=(this.tmp.x*.5+.5)*t,o=(-this.tmp.y*.5+.5)*n+r.offsetY,s=r.el.offsetWidth/2+8;s>8&&(a=Math.min(t-s,Math.max(s,a))),r.el.style.transform=`translate(-50%, -50%) translate(${a.toFixed(1)}px, ${o.toFixed(1)}px)`,r.el.style.visibility=i?`hidden`:`visible`}}say(e,t,n,r){let i=this.anchor(`say${e}`,t,`bubble`,-14);i.textContent=n,i.classList.add(`show`);let a=String(Date.now());i.dataset.token=a,window.setTimeout(()=>{i.dataset.token===a&&i.classList.remove(`show`)},r)}clear(){for(let e of this.anchored.values())e.el.remove();this.anchored.clear(),this.plates.clear(),this.meEl.className=`plate me`,this.meEl.innerHTML=``,this.hideResult(),this.setHole(null),this.potAmount=0,this.boardCards=[],this.boardEl.classList.remove(`show`)}};function wf(e){let t=[`th`,`st`,`nd`,`rd`],n=e%100;return e+(t[(n-20)%10]||t[n]||t[0])}var Tf=[`preflop`,`flop`,`turn`,`river`];function Ef(e,t){let n=t===`preflop`?0:t===`flop`?3:t===`turn`?4:5;return e.board.slice(0,n)}function Df(e){let t=r(e.handNumber*7919+1),n=new Map,i=new Map;for(let t of e.players)i.set(t.seat,`never`);let a=`preflop`;for(let t of e.events)t.type===`street`&&(a=t.street),t.type===`action`&&t.action.type===`fold`&&i.set(t.seat,a);let o=new Set([`preflop`]);for(let t of e.events)t.type===`street`&&o.add(t.street);for(let r of Tf){if(!o.has(r))break;let a=Ef(e,r),s=e.players.filter(e=>{let t=i.get(e.seat);return t===`never`||Tf.indexOf(t)>=Tf.indexOf(r)}),c=new Map;if(s.length===1)c.set(s[0].seat,1);else if(a.length===5){let e=s.map(e=>({seat:e.seat,score:C([...e.hole,...a])})),t=Math.max(...e.map(e=>e.score)),n=e.filter(e=>e.score===t);for(let r of e)c.set(r.seat,r.score===t?1/n.length:0)}else for(let e of s){let n=s.filter(t=>t.seat!==e.seat).map(e=>[[e.hole[0],e.hole[1]]]);c.set(e.seat,ne(e.hole,a,n.length,{rng:t,samples:240,ranges:n}))}n.set(r,c)}return n}var Of=class{root;onResume=()=>{};onQuit=()=>{};onSettings=()=>{};onReset=()=>{};constructor(e){this.root=e}get isOpen(){return this.root.classList.contains(`show`)}render(e){this.root.innerHTML=`<div class="panel">${e}</div>`,this.root.classList.add(`show`)}close(){this.root.classList.remove(`show`),this.root.innerHTML=``}pause(e,t){this.render(`
      <div class="eyebrow">Paused</div>
      <div class="stack">
        <button class="primary resume">Resume</button>
        <button class="row replay" ${e?``:`disabled`}>Last hand, with hole cam</button>
        <button class="row settings">Settings</button>
        <button class="row quit">Quit to menu</button>
      </div>`),this.root.querySelector(`.resume`).addEventListener(`click`,()=>this.onResume()),this.root.querySelector(`.replay`).addEventListener(`click`,()=>this.onReplayRequest()),this.root.querySelector(`.settings`).addEventListener(`click`,()=>this.settings(t,()=>this.pause(e,t))),this.root.querySelector(`.quit`).addEventListener(`click`,()=>this.onQuit())}onReplayRequest=()=>{};replay(e,t,n,r){let i=e[n],a=e=>t.find(t=>t.seat===e)?.name??`Seat ${e}`,o=Df(i),s=e=>o.get(e),c=Tf.filter(e=>o.has(e)),l=new Map,u=`preflop`;for(let e of i.events)if(e.type===`street`&&(u=e.street),e.type===`post`&&(l.get(`preflop`)??l.set(`preflop`,[]).get(`preflop`)).push(`${a(e.seat)} posts ${$(e.amount)}`),e.type===`action`){let t=e.action,n=t.type===`fold`?`folds`:t.type===`check`?`checks`:t.type===`call`?`calls ${$(e.amount)}`:t.type===`bet`?`bets ${$(t.amount)}`:`raises to ${$(t.amount)}`;(l.get(u)??l.set(u,[]).get(u)).push(`${a(e.seat)} ${n}${e.allIn?` (all in)`:``}`)}let d=i.events.at(-1),f=d?.type===`end`?d.winners:[],p=i.players.map(e=>{let t=c.map(t=>{let n=s(t)?.get(e.seat);return`<td>${n===void 0?`<span class="dim">—</span>`:`${Math.round(n*100)}%`}</td>`}).join(``),n=i.board.length>=3?E(C([...e.hole,...i.board])):``;return`<tr class="${f.includes(e.seat)?`win`:``} ${e.folded?`folded`:``}"><td class="pname">${a(e.seat)}</td><td class="cards">${e.hole.map(Sf).join(``)}</td>${t}<td class="desc">${e.folded?`folded`:n}</td></tr>`}).join(``),m=c.map(e=>`<div class="street"><div class="sname">${e}${e===`preflop`?``:` <span class="cards">${Ef(i,e).slice(e===`flop`?0:e===`turn`?3:4).map(Sf).join(``)}</span>`}</div><div class="acts">${(l.get(e)??[]).join(` · `)}</div></div>`).join(``);this.render(`
      <div class="replayhead">
        <button class="link back">Back</button>
        <div class="eyebrow">Hand ${i.handNumber} · hole cam</div>
        <div class="nav"><button class="link prev" ${n>0?``:`disabled`}>Older</button><button class="link next" ${n<e.length-1?``:`disabled`}>Newer</button></div>
      </div>
      <div class="replaybody">
        <table class="eqtable"><thead><tr><th></th><th></th>${c.map(e=>`<th>${e}</th>`).join(``)}<th></th></tr></thead><tbody>${p}</tbody></table>
        <div class="streets">${m}</div>
      </div>`),this.root.querySelector(`.back`).addEventListener(`click`,r),this.root.querySelector(`.prev`).addEventListener(`click`,()=>this.replay(e,t,n-1,r)),this.root.querySelector(`.next`).addEventListener(`click`,()=>this.replay(e,t,n+1,r))}settings(e,t){let n=e.settings;this.render(`
      <div class="eyebrow">Settings</div>
      <div class="stack">
        <label class="row toggle"><span>Sound</span><input type="checkbox" class="sound" ${n.sound?`checked`:``}></label>
        <label class="row toggle"><span>Dave’s room (off: the dark room)</span><input type="checkbox" class="room" ${n.room?`checked`:``}></label>
        <label class="row toggle"><span>Table talk</span>
          <select class="banter"><option value="1" ${n.banter===1?`selected`:``}>Normal</option><option value="0.5" ${n.banter===.5?`selected`:``}>Less</option><option value="0" ${n.banter===0?`selected`:``}>Off</option></select></label>
        <button class="row danger reset">Reset career and bot memories</button>
        <button class="primary back">Done</button>
      </div>`);let r=()=>{n.sound=this.root.querySelector(`.sound`).checked,n.room=this.root.querySelector(`.room`).checked,n.banter=Number(this.root.querySelector(`.banter`).value),this.onSettings(n)};this.root.querySelector(`.sound`).addEventListener(`change`,r),this.root.querySelector(`.room`).addEventListener(`change`,r),this.root.querySelector(`.banter`).addEventListener(`change`,r),this.root.querySelector(`.reset`).addEventListener(`click`,()=>{confirm(`Wipe your career, trophies and what the bots remember about you?`)&&this.onReset()}),this.root.querySelector(`.back`).addEventListener(`click`,t)}career(t,n,r){let i=t.record,a=i.finishes.slice(1).map((e,t)=>`<span class="fin"><b>${wf(t+1)}</b> ${e}</span>`).join(``),o=`<div class="crow"><div class="cname">${i.played} ${i.played===1?`night`:`nights`} · ${i.wins} won · ${i.handsPlayed} hands</div>
        <div class="cfin">${a}</div>
        <div class="cbest">${i.bestHand?`Best hand: ${i.bestHand.description}`:`No showdowns won yet`}${i.biggestPot?` · Biggest pot: ${$(i.biggestPot)}`:``}</div></div>`,s=[...e].map(e=>({c:e,r:t.rivals[e.id]})).sort((e,t)=>(t.r?.knockouts??0)-(e.r?.knockouts??0)||(t.r?.games??0)-(e.r?.games??0)).map(({c:e,r:t})=>`<div class="rival ${t?``:`never`}">
          <img src="${n}${e.id}.png" alt="" draggable="false">
          <div class="rname">${e.name}</div>
          ${t?`<div class="rrec" title="Nights you finished ahead, nights he did">${t.wins}–${t.losses}</div>
               <div class="rko"><b>${t.knockouts}</b> KO${t.knockouts===1?``:`s`}</div>
               <div class="rkob"><b>${t.knockedOutBy}</b> on you</div>`:`<div class="rrec">—</div><div class="rko">Never played</div><div class="rkob"></div>`}
        </div>`).join(``),c=rt.map(e=>{let n=t.trophies[e.id];return`<div class="trophy ${n?`got`:``}"><div class="tn">${e.name}</div><div class="tb">${e.blurb}</div>${n&&n.count>1?`<div class="tc">×${n.count}</div>`:``}</div>`}).join(``);this.render(`
      <div class="replayhead"><button class="link back">Back</button><div class="eyebrow">Career</div><div></div></div>
      <div class="replaybody">
        <div class="career">${o}</div>
        <div class="eyebrow" style="margin-top:14px">Rivals · record · knockouts</div>
        <div class="rivals">${s}</div>
        <div class="eyebrow" style="margin-top:14px">Trophies · ${Object.keys(t.trophies).length} of ${rt.length}</div>
        <div class="trophies">${c}</div>
      </div>`),this.root.querySelector(`.back`).addEventListener(`click`,r)}},kf=!1,Af=class{root;constructor(e){this.root=e}render(e){this.root.innerHTML=e,this.root.classList.add(`show`)}hide(){this.root.classList.remove(`show`),this.root.innerHTML=``}select(e,t,n,r){let i=[],a=e.map(e=>`<button class="pcardc" data-id="${e.id}">
          <div class="bubble"></div>
          <div class="face"><img src="${t}${e.id}.png" alt="" draggable="false"></div>
          <div class="pname">${e.name}</div>
          <div class="tick">✓</div>
        </button>`).join(``),o=!kf;this.render(`
      ${o?`<video class="intro" autoplay muted playsinline preload="auto"><source src="./intro.mp4" type="video/mp4"></video><button class="link skip">Skip</button>`:``}
      <div class="screen pick ${o?`waiting`:``}">
        <div class="pickhead">
          <div class="brand">Poker Night<span>at Dave's</span></div>
          <div class="eyebrow">Who's coming tonight? <span class="count">Pick 5</span></div>
          <button class="link random">Random five</button>
        </div>
        <div class="pstrip">
          <button class="link arrow prev" aria-label="Earlier">‹</button>
          <div class="pgrid">${a}</div>
          <button class="link arrow next" aria-label="Later">›</button>
        </div>
        <div class="pickfoot">
          <div class="namerow"><label>They'll call you</label><input class="name" maxlength="14" value="${n.replace(/"/g,``)}" /></div>
          <button class="primary deal" disabled>Deal</button>
          <div class="links"><button class="link go-career">Career</button><button class="link go-settings">Settings</button></div>
        </div>
      </div>`);let s=this.root;o&&this.playIntro(()=>this.onReveal?.());let c=s.querySelector(`.count`),l=s.querySelector(`.deal`),u=s.querySelector(`.name`),d=t=>e.find(e=>e.id===t),f=null,p=e=>s.querySelector(`.pcardc[data-id="${e}"] .bubble`),m=s.querySelector(`.pgrid`),h=()=>(m.querySelector(`.pcardc`)?.offsetWidth??200)+12;s.querySelector(`.prev`).addEventListener(`click`,()=>m.scrollBy({left:-h()*2,behavior:`smooth`})),s.querySelector(`.next`).addEventListener(`click`,()=>m.scrollBy({left:h()*2,behavior:`smooth`})),m.addEventListener(`wheel`,e=>{Math.abs(e.deltaY)>Math.abs(e.deltaX)&&(m.scrollLeft+=e.deltaY,e.preventDefault())},{passive:!1});let g=e=>{let t=s.querySelector(`.pcardc[data-id="${e}"]`);if(!t)return!1;let n=t.offsetLeft-m.offsetLeft-m.scrollLeft;return n+t.offsetWidth*.6>0&&n+t.offsetWidth*.4<m.clientWidth},_=(e,t,n=!1)=>{if(!t)return;f&&(window.clearTimeout(f.timer),p(f.id).classList.remove(`show`,`pop`));let r=p(e);r.textContent=t,r.classList.toggle(`pop`,n),r.classList.add(`show`),f={id:e,timer:window.setTimeout(()=>{r.classList.remove(`show`,`pop`),f&&f.id===e&&(f=null)},3500)}},v=()=>{for(let e of s.querySelectorAll(`.pcardc`)){let t=i.includes(e.dataset.id);e.classList.toggle(`on`,t),e.classList.toggle(`full`,!t&&i.length>=5)}c.textContent=i.length>=5?`Table’s full`:`Pick ${5-i.length} more`,l.disabled=i.length!==5};for(let e of s.querySelectorAll(`.pcardc`))e.addEventListener(`click`,()=>{let t=e.dataset.id,n=d(t),r=i.indexOf(t);r>=0?(i.splice(r,1),_(t,n.dropped,!0)):i.length<5?(i.push(t),_(t,n.picked,!0)):_(t,n.pitch[Math.floor(Math.random()*n.pitch.length)]),v()});s.querySelector(`.random`).addEventListener(`click`,()=>{i.length=0;let t=[...e].sort(()=>Math.random()-.5).slice(0,5);for(let e of t)i.push(e.id);_(t[0].id,t[0].picked,!0),v()}),l.addEventListener(`click`,()=>r.deal(u.value.trim()||n,i.map(d))),s.querySelector(`.go-career`).addEventListener(`click`,r.career),s.querySelector(`.go-settings`).addEventListener(`click`,r.settings);let y=window.setInterval(()=>{if(!s.contains(l)){window.clearInterval(y);return}if(f)return;let t=e.filter(e=>!i.includes(e.id)&&e.pitch.some(e=>e)&&g(e.id));if(t.length===0)return;let n=t[Math.floor(Math.random()*t.length)];_(n.id,n.pitch[Math.floor(Math.random()*n.pitch.length)])},4500);window.setTimeout(()=>{let t=e.find(e=>g(e.id))??e[0];_(t.id,t.pitch[0])},o?2500:500);let b=()=>window.setTimeout(()=>{!s.contains(m)||m.scrollLeft>30||(m.scrollTo({left:160,behavior:`smooth`}),window.setTimeout(()=>{s.contains(m)&&m.scrollLeft<300&&m.scrollTo({left:0,behavior:`smooth`})},700))},800);o?this.onReveal=b:b(),v()}onReveal=null;playIntro(e){let t=this.root.querySelector(`video.intro`),n=this.root.querySelector(`.screen.pick`),r=()=>{kf||(kf=!0,n.classList.remove(`waiting`),t.remove(),this.root.querySelector(`.skip`)?.remove(),e())};t.addEventListener(`ended`,r,{once:!0}),t.addEventListener(`error`,r,{once:!0}),t.addEventListener(`click`,r),this.root.querySelector(`.skip`).addEventListener(`click`,r),t.play().catch(r),window.setTimeout(()=>{t.paused&&r()},1500)}results(e,t,n){let r=e.standings.map(e=>`<li class="${e.seat===0?`you`:``}"><span>${e.finish?wf(e.finish):`—`}</span><span>${e.name}</span><span>${$(e.stack)}</span></li>`).join(``),i=e.humanFinish===1?`You won.`:e.humanFinish===2?`Second. So close.`:`${wf(e.humanFinish)} place.`;this.render(`
      <div class="screen results">
        <div class="eyebrow">${e.tournament} · ${e.handsPlayed} hands</div>
        <h2>${i}</h2>
        ${e.earned.length?`<div class="earned">${e.earned.map(e=>`<span>🏆 ${e.name}</span>`).join(``)}</div>`:``}
        <ol>${r}</ol>
        <div class="row">
          <button class="primary again">Play again</button>
          <button class="link menu">Menu</button>
        </div>
      </div>`),this.root.querySelector(`.again`).addEventListener(`click`,t),this.root.querySelector(`.menu`).addEventListener(`click`,n)}},jf=e=>{let t=document.querySelector(e);if(!t)throw Error(`missing ${e}`);return t},Mf=new Cf(jf(`#overlay`),jf(`#hole`),jf(`#info`),jf(`#toast`),jf(`#board`),jf(`#me`),jf(`#standings`),jf(`#result`)),Nf=new of(jf(`#stage`),jf(`#safe-probe`)),Pf=new yf(jf(`#game`),Mf,Nf);Pf.attachInset(jf(`#pip`));var Ff=new bf(jf(`#actions`)),If=new Af(jf(`#screens`)),Lf=new Of(jf(`#panels`)),Rf=jf(`#fast`),zf=jf(`#menu`),Bf=ut(),Vf=!1,Hf=null,Uf=null;Pf.setSpeed(()=>Vf?4:1),Rf.addEventListener(`click`,()=>{Vf=!Vf,Rf.classList.toggle(`on`,Vf)});function Wf(e,t){return e===-1?n:t.seats.find(t=>t.seat===e)?.name??``}function Gf(){Uf&&(Uf.density=Bf.settings.banter),Pf.audio.setEnabled(Bf.settings.sound),Pf.setRoom(Bf.settings.room),dt(Bf)}Pf.audio.setEnabled(Bf.settings.sound),Pf.setRoom(Bf.settings.room),Lf.onSettings=Gf,Lf.onReset=()=>{ft(),Bf=ut(),Lf.close(),Hf&&=(Hf.stop(),null),Kf()};function Kf(){Lf.close(),Ff.hide(),If.select(e,`./portraits/`,Bf.name,{deal:(e,t)=>{Bf.name=e,dt(Bf),qf(t)},career:()=>Lf.career(Bf,`./portraits/`,()=>Lf.close()),settings:()=>Lf.settings(Bf,()=>Lf.close())})}function qf(e){If.hide(),Lf.close(),Mf.clear(),Mf.tournamentName=t;let n=i(`night:${Date.now()}:${Math.random()}`),a=r(n),o=new mt;Uf=new nt(r(n^1540483477)),Uf.density=Bf.settings.banter;let s=Uf,c=null,l=e=>{if(!e)return;let t=e.conversation?e.last?Math.min(8e3,4e3+e.text.length*55):Math.max(7500,4e3+e.text.length*55):Math.min(7500,3200+e.text.length*50);Pf.speak(e.seat,e.targetSeat,e.text,t,e.trigger,Wf(e.seat,u),e.conversation)},u=new qe({lineup:e,humanName:Bf.name,rng:a,memories:Bf.memories,speed:()=>Vf?4:1,presenter:{async present(e){o.onEvent(e),e.type===`action`&&e.seat===0&&Ff.hide(),e.type===`turn`&&e.seat!==0&&Ff.hide();let t={ids:new Map(u.seats.map(e=>[e.seat,e.id])),names:new Map(u.seats.map(e=>[e.seat,e.name])),clarity:e=>u.bots.get(e)?.stats.clarity??0,stance:e=>u.bots.get(e)?.character.aiStance??`meh`,traits:e=>{let t=u.bots.get(e)?.character;return{talk:t?.talk??1,trash:t?.trash??1}},iq:e=>u.bots.get(e)?.stats.iq??0};if(c=t,l(s.onEvent(e,t)),await Pf.present(e),e.type===`bust`&&u.tournament.active().length===2){let e=s.headsUp(t);e&&Pf.speak(e.seat,e.targetSeat,e.text,4500,e.trigger,Wf(e.seat,u))}e.type===`turn`&&e.seat===0&&u.hand&&Jf(u,e.legal,e.deadline)}}});u.onDeadline=e=>Jf(u,u.humanLegal,e),Hf=u;let d=window.setInterval(()=>{Hf===u?!u.isPaused&&c&&l(s.tick(c)):window.clearInterval(d)},1500);Ff.onAction=e=>void u.humanAct(e),u.run().then(n=>{if(Hf!==u)return;Hf=null,Bf.memories={...Bf.memories,...u.memories()};let r=ht(Bf,{humanFinish:n.humanFinish,handsPlayed:u.tournament.handsPlayed},o);dt(Bf),Ff.hide(),Lf.close(),If.results({...n,handsPlayed:u.tournament.handsPlayed,tournament:t,earned:r},()=>qf(e),Kf)})}function Jf(e,t,n){let r=e.hand;if(!r||!t||e.isPaused)return;let i=r.player(0);Ff.show({legal:t,pot:r.potTotal(),streetBet:i.streetBet,bigBlind:r.bigBlind,deadline:n})}function Yf(){let e=Hf;if(!e)return;e.pause(),Ff.hide();let t=e.seats.map(e=>({seat:e.seat,name:e.name}));Lf.onResume=()=>{Lf.close(),e.resume(),e.humanLegal&&Jf(e,e.humanLegal,null)},Lf.onQuit=()=>{Lf.close(),e.stop(),Hf=null,Kf()},Lf.onReplayRequest=()=>{let n=e.history;n.length&&Lf.replay(n,t,n.length-1,()=>Lf.pause(n.length>0,Bf))},Lf.pause(e.history.length>0,Bf)}zf.addEventListener(`click`,()=>{Hf&&(Lf.isOpen||Yf())}),window.__scene=Pf,Kf();
//# sourceMappingURL=index-BmCTPncG.js.map