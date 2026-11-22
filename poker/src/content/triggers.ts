// When a character might say something. The banter engine fires these from table events.
export type Trigger =
  | 'dealtIn'          // new hand, cards arrive
  | 'foldPreflop'      // the speaker folds before the flop
  | 'raise'            // the speaker opens or bets
  | 'reraise'          // the speaker raises over a bet
  | 'callBig'          // the speaker calls a large bet
  | 'allIn'            // the speaker shoves
  | 'facingAllIn'      // the speaker is thinking about calling a shove
  | 'winNoShowdown'    // everyone folded to the speaker
  | 'bluffWorked'      // as above, with nothing
  | 'winShowdown'      // the speaker won at showdown; {target} lost
  | 'loseShowdown'     // the speaker lost at showdown; {target} won
  | 'badBeatTaken'     // the speaker lost as a big favourite to {target}
  | 'badBeatGiven'     // the speaker got there as an underdog against {target}
  | 'bluffCaught'      // the speaker bet the river with air and {target} called
  | 'targetFoldsToMe'  // {target} folded to the speaker's bet
  | 'targetCallsMeDown'// {target} called the speaker's value bet and lost
  | 'stackedTarget'    // the speaker busted {target}
  | 'stackedByTarget'  // {target} busted the speaker
  | 'targetTank'       // {target} took forever
  | 'targetInstant'    // {target} acted instantly
  | 'targetChecks'     // {target} just checked, and the speaker has opinions about checking
  | 'shortStack'       // the speaker is short
  | 'chipLeader'       // the speaker has a big stack
  | 'playerOut'        // {target} just busted (speaker is a bystander)
  | 'headsUp'          // two left
  | 'idle';            // table chatter

export type Mood = 'calm' | 'tilted' | 'any';

export interface Line {
  t: Trigger;
  s: string;
  /** Only said in this mood. Default: any. */
  m?: Mood;
}

export const L = (t: Trigger, s: string, m?: Mood): Line => (m ? { t, s, m } : { t, s });
