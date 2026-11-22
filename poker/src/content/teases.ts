// Things the table knows about each man and will throw at him when he loses a pot, folds to a bet,
// checks, calls down with nothing, or just sits there. Anyone can say these; the man they are about
// is addressed by name. Kept apart from the character line sets so every voice can needle every man.

export const TEASES: Record<string, string[]> = {
  // David Sr: seventy, bald, folds everything, David's father.
  harold: [
    'David Sr, you’ve folded more hands tonight than the rest of us have been dealt.',
    'Easy, David Sr. Nobody’s taking the house. Dave already did.',
    'That’s the same fold you made in 1974, David Sr. I’ve seen the footage.',
    'David Sr, blink twice if David is making you play.',
    'Your son plays nothing like you, David Sr. You should talk to him. Loudly. Right now.',
    'David Sr, the blinds come around whether you fold or not. It’s not a parking meter.',
    'Careful, David Sr. Big pot. Your hip can’t take it.',
    'David Sr just played a hand. Somebody write down the date.',
  ],
  // Paul: everything by hand, honey, bees, D&D with his wife as DM.
  dolores: [
    'Maybe you can craft two new cards, Paul. Those ones aren’t working.',
    'Paul, you can’t sew your way out of that one.',
    'Did the bees tell you to do that, Paul? The bees are wrong.',
    'Paul, if you show me one card I’ll give you half off the pot. That’s the deal, right?',
    'Roll for it, Paul. Natural one. Your wife would’ve let you re-roll.',
    'That’s a full homestead fold, Paul. Hand-made. Took you four years.',
    'Paul, you raised your own horse and you still can’t raise a pot.',
    'Jar that one, Paul. Put it on the fridge next to the bee note.',
  ],
  // Kevin: drunk, crazy, imaginary.
  marvin: [
    'Kevin, nobody invited you, and now nobody’s paying you either.',
    'Kevin, you can’t fold what you can’t see. You can’t see the cards. We’ve been over this.',
    'That was a real pot, Kevin. You’re not. Think about who lost more.',
    'Kevin just bet with his elbow. The elbow had a better hand.',
    'Kevin, the bathroom is that way. The pot is this way. Pick one.',
    'Whoever imagined Kevin, imagine him better.',
    'Kevin’s cup just folded. Kevin, follow the cup.',
    'Kevin, that’s the third time you’ve called me Dave. I’m not Dave. Dave isn’t Dave right now either.',
  ],
  // Bawb: softball, Kara's hamstring, Division II, clown school.
  chad: [
    'Bawb, put the phone down. Bedford can lose without you.',
    'Kara pulled her hamstring and you pulled that, Bawb. Both season-ending.',
    'That’s a Pinkerton fold, Bawb. Your words.',
    'Bawb, second year of clown school and that’s the act you went with.',
    'Bawb, you log every pitch in Division II and you didn’t log that bet.',
    'She said no, Bawb, and so does that board.',
    'Bawb just checked in the fourth quarter. Souhegan would be proud.',
    'Bawb, the chairs are good. The hand was not.',
  ],
  // Tim: anime towels, bowels, snacks he cannot have, misunderstands the rules.
  trish: [
    'Tim, that hand’s like your towels. Forty dollars and nobody wants it.',
    'Tim, it’s not a bunt. There are no bunts. Stop saying bunt.',
    'Tim, go sit near the pretzels. Don’t touch them. Just be near them. Like with the pot.',
    'That fold’s on TowelZoneDotBiz now, Tim. Tier three.',
    'Tim, you called the river and you can’t even call your gastroenterologist back.',
    'Easy, Tim. Your colon’s heard enough tonight.',
    'Tim, you misread that board the way you misread the shipping policy.',
    'Tim, the biz is important. The hand was not.',
  ],
  // Luca: GTA, failed proposals, clown school with Bawb.
  benny: [
    'Luca, that’s your fourth proposal and she said no again.',
    'Luca, you didn’t finish GTA and you didn’t finish that hand. Pattern.',
    'That was a balloon proposal of a bet, Luca. Forty minutes of nothing at altitude.',
    'Luca, she honked. The table honked. Everybody honked.',
    'Luca, you can’t check at a Celtics game either. We watched.',
    'Thirty slides and the answer was still no, Luca. Same as that call.',
    'Luca, clown school has a class for that. You failed it.',
    'Luca, which way is your car. Genuinely. It’s time.',
  ],
  // Jonathan: standings, NHIAA letters, the jersey.
  wen: [
    'Jonathan, write the NHIAA about that one. They’ve got the folder ready.',
    'That’s a fifth-seed fold, Jonathan. On the tiebreaker.',
    'Jonathan, the standings say you’re last. I checked. You taught me.',
    'Jonathan, you drove here in a jersey to do that.',
    'Jonathan lost a pot and he’s already got a spreadsheet for it.',
    'Jonathan, the discus girl throws farther than you just bet.',
    'Mercy rule, Jonathan. Fifth inning. Parents in the car.',
    'Jonathan, Bedford would’ve folded there. You told us. Twice.',
  ],
  // Will: hates things, laminated plans, thirty-slide deck, trying for a baby on a schedule.
  priya: [
    'Will, there was no slot for that in the plan. I checked the laminate.',
    'Will, you hate the game, you hate the dip, and now you hate that river. Consistent.',
    'That was slide twelve of a thirty-slide fold, Will.',
    'Will, re-laminate. That hand doesn’t fit.',
    'Will, you had a Q and A for the proposal and no questions for that bet.',
    'Will, month fourteen and still no results. Same as tonight.',
    'Will just lost a pot on schedule. Four o’clock. The sadness slot.',
    'Will, the turtleneck says you’re above this. The chips say otherwise.',
  ],
  // Menafee: never shows up; the empty chair.
  ulrich: [
    'Menafee, say something. Anything. Blink.',
    'The chair played that better than you did, Menafee. The chair is you. Hm.',
    'Menafee, if you’re going to lose, at least show up to do it.',
    'Menafee folded. I think. Hard to tell. The chair rolled a little.',
    'Menafee, your wife called. She also can’t find you.',
    'Good hand, Menafee. Good game. Good nothing.',
    'Menafee’s got the best poker face at the table. Also no face.',
    'Menafee, I’ve seen more action from the ottoman.',
  ],
  // Jack: sixteen, respectful, school, snacks, no licence.
  sal: [
    'Jack, it’s a school night and that was a school fold.',
    'Jack, you’re sixteen. That hand was six.',
    'Respectfully, Jack, no.',
    'Jack, the snacks are in the kitchen. Your chips are in my stack.',
    'Jack, you can’t drive yet and you can’t drive a hand either.',
    'Somebody call Jack’s mom. Not about the pot. About the pot.',
    'Jack, you called that “sir” and then called it with nothing.',
    'Jack lost his allowance. Jack doesn’t have an allowance. Jack lost Dave’s allowance.',
  ],
  // David: hothead, castration policy for checking, hummus and pretzels.
  nadia: [
    'David, you checked. Bring the pliers. Your rule.',
    'Easy, David. The hummus didn’t do anything to you.',
    'David’s turning the colour of the pretzel bag.',
    'David, the vessel in your forehead just folded before you did.',
    'David, your father folded that same hand. Quieter.',
    'David, breathe. The pot’s not going anywhere. It’s going to me.',
    'David just lost a hand and the pretzels are about to hear about it.',
    'David, you yelled at a check and then did that.',
  ],
  // Bruce: the commute, tired, layoffs, loves the machines.
  jimmy: [
    'Bruce, that fold took longer than your commute.',
    'Bruce, an AI could’ve lost that pot faster.',
    'Bruce, restructure that. Go on. Say “restructure”.',
    'Bruce just got laid off from the hand. Two paragraphs. The second one was about parking.',
    'Go home, Bruce. You said it. We’re saying it now.',
    'Bruce, Route 3 is still a parking lot. So’s your stack.',
    'Bruce, the machines are coming for your job and they still wouldn’t have called that.',
    'Bruce lost the pot and is somehow more tired.',
  ],
};
