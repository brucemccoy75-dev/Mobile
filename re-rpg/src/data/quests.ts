// Quest flavour: who asks, and what they say. This is where story and lore
// attach later: every line here can reference the world, and templates can
// be gated by screen, class or discoveries.

export interface GiverVoice {
  name: string;
  title: string;
  /** Lines by quest kind; {target} is filled by the generator. */
  intro: Record<'fetch' | 'hunt' | 'escort', string>;
  accept: string;
  progress: string;
  complete: Record<'fetch' | 'hunt' | 'escort', string>;
  decline: string;
}

export const GIVERS: GiverVoice[] = [
  {
    name: 'Old Marrow', title: 'the road-warden',
    intro: {
      fetch: 'The wilds took my {target}. If you find one and carry it to me, I can make it better than it was. I keep what you bring.',
      hunt: 'The {target} have been at the road again. Put down {need} of them and I will pay in coin and kit.',
      escort: '{target} went looking for herbs past the treeline and never came back. Find them and walk them here. The wilds will notice you both.',
    },
    accept: 'Good. The road remembers those who help it.',
    progress: 'Not yet. Come back when it is done.',
    complete: {
      fetch: 'Hand it over. There. Same steel, better edge. It will serve you until the road ends.',
      hunt: 'Fewer teeth in the dark tonight. Take this.',
      escort: 'You brought them back breathing. That is rarer than you know. Take this.',
    },
    decline: 'Suit yourself. The road is long either way.',
  },
  {
    name: 'Sister Vell', title: 'of the quiet shrine',
    intro: {
      fetch: 'I have a blessing for a {target}, if you bring me one you have worn. The blessing costs the original; what returns is stronger.',
      hunt: 'The {target} dig at the old graves. Send {need} back to the earth and the shrine will reward you.',
      escort: '{target} carries something I need and is lost in the wilds. Bring them to me unharmed.',
    },
    accept: 'The shrine will light your way, a little.',
    progress: 'The work is not finished.',
    complete: {
      fetch: 'Blessed, and returned. Carry it well.',
      hunt: 'The graves are quieter. My thanks.',
      escort: 'Safe. Thank you. Take this for the road.',
    },
    decline: 'Then go with what blessing you have.',
  },
];

/** Screen 1's fixed giver on the authored map (DECISIONS #35). Her dialogue is in data/dialogue.ts. */
export const WREN: GiverVoice = {
  name: 'Wren', title: 'the rat-keeper',
  intro: {
    fetch: 'The rats took my {target}. They take things. If you find one, bring it here and I will make it better than it was. I keep what you bring. So do they.',
    hunt: 'The {target} have been at my rats. Put down {need} of them and I will pay. In coin. Not in rats.',
    escort: '{target} went past the warren and has not come back. The rats say they are alive. Bring them here.',
  },
  accept: 'Good. Mind the rats on the way.',
  progress: 'Not done. I would know. They would tell me.',
  complete: {
    fetch: 'There. Better than it was. Do not ask what it cost. It cost rats.',
    hunt: 'The rats will sleep tonight. Take this.',
    escort: 'Alive, then. The rats were right. They usually are. Take this.',
  },
  decline: 'Then go. Mind the rats.',
};

export const ESCORT_NAMES = ['Pell the forager', 'Tam the tinker', 'Ida the mapmaker', 'Brann the pilgrim'];
