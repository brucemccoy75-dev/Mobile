import type { Dialogue } from '@core/dialogue';

/**
 * The writing (DECISIONS #35). Every encounter opens with a few lines and two or three options;
 * options set flags, move a relation, cost or pay a little, and then start the fight or let you
 * walk on. Entries are tried in order, so the variants with conditions come first.
 *
 * Relations (persistent, in meta): wren (the rat-keeper), gerald (the child necromancer's
 * skeleton), imp, andre. Run flags: rats_promise, imp_book, met_gerald, bribed_boar.
 */
export const DIALOGUE: Dialogue[] = [
  // ---------------------------------------------------------------- Wren, the rat-keeper (screen 1 quest giver)
  { id: 'wren_grudge', trigger: 'giver:wren', speaker: 'Wren', when: [{ relation: 'wren', max: -2 }],
    lines: ['You.', 'I counted them, you know. Every one. They had names.', 'Go on, take your work. I will see you at the gate.'],
    options: [{ text: 'At the gate?', effects: [{ flag: 'wren_warned' }] }, { text: '…I should go.', effects: [] }] },
  { id: 'wren_again', trigger: 'giver:wren', speaker: 'Wren', when: [{ deaths: 'screen', min: 1 }, { flag: 'wren_met', is: false }],
    lines: ['Back from the dead, is it. Mind the rats.', 'They remember you. I have no idea how. They are rats.'],
    options: [{ text: 'I will leave them be.', effects: [{ flag: 'wren_met' }, { flag: 'rats_promise' }, { relation: 'wren', delta: 1 }], default: true }, { text: 'I make no promises.', effects: [{ flag: 'wren_met' }] }, { text: 'Rats are rats.', effects: [{ flag: 'wren_met' }, { relation: 'wren', delta: -1 }] }] },
  { id: 'wren_intro', trigger: 'giver:wren', speaker: 'Wren', when: [{ flag: 'wren_met', is: false }],
    lines: ['Mind the rats. They are mine. All of them.', 'Yes. Those too. The ones with the little collars.', 'Nobody asked you to like them. Just leave them be.'],
    options: [{ text: 'I will leave them be.', effects: [{ flag: 'wren_met' }, { flag: 'rats_promise' }, { relation: 'wren', delta: 1 }], default: true }, { text: 'I make no promises.', effects: [{ flag: 'wren_met' }] }, { text: 'Rats are rats.', effects: [{ flag: 'wren_met' }, { relation: 'wren', delta: -1 }] }] },

  // ---------------------------------------------------------------- screen 1 enemies (pre-fight)
  { id: 'boar_bribed', trigger: 'pre_fight:boar', speaker: 'Boar', portrait: 'enemy_boar', when: [{ flag: 'bribed_boar' }],
    lines: ['It remembers the apple. It wants another apple.', 'It is not going to get another apple.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Fine. Another apple. (4 gold)', when: [{ gold: { min: 4 } }], effects: [{ gold: -4 }, { skip: true }] }] },
  { id: 'boar', trigger: 'pre_fight:boar', speaker: 'Boar', portrait: 'enemy_boar',
    lines: ['It looks at you. It looks at the road. It looks at you again.', 'It has decided something.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Roll it an apple. (4 gold)', when: [{ gold: { min: 4 } }], effects: [{ gold: -4 }, { flag: 'bribed_boar' }, { skip: true }] }] },

  { id: 'beetle', trigger: 'pre_fight:shell_beetle', speaker: 'Shell Beetle', portrait: 'enemy_shell_beetle',
    lines: ['It is eating something. You decide not to look at what.', 'It has not noticed you. It may never notice anything.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Edge around it, slowly. (costs daylight)', when: [{ daylight: { min: 7 } }], effects: [{ daylight: -6 }, { skip: true }] }] },

  { id: 'imp_book_known', trigger: 'pre_fight:hex_imp', speaker: 'Hex Imp', portrait: 'enemy_hex_imp', when: [{ flag: 'imp_book' }],
    lines: ['You again. Did you find out what the book is yet?', 'No? Then we fight. Those are the rules. I did not make the rules.', 'I did make the rules.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'It is a cookbook.', effects: [{ relation: 'imp', delta: 1 }, { next: 'imp_cookbook' }] }] },
  { id: 'imp', trigger: 'pre_fight:hex_imp', speaker: 'Hex Imp', portrait: 'enemy_hex_imp',
    lines: ['Wait. Wait wait wait. Before the hitting.', 'Do you know anything about this book? I found it. It hums. I cannot read.', 'Say something clever and I might let you pass. I might not. I am an imp.'],
    options: [
      { text: 'Never seen it. Fight.', effects: [{ fight: true }], default: true },
      { text: 'Let me have a look.', effects: [{ flag: 'imp_book' }, { next: 'imp_look' }] },
      { text: 'It is a cookbook.', effects: [{ flag: 'imp_book' }, { next: 'imp_cookbook' }] },
    ] },
  { id: 'imp_look', trigger: 'imp_look', speaker: 'Hex Imp', portrait: 'enemy_hex_imp',
    lines: ['It is warm. Something in it is written in your handwriting, which is impossible.', 'The imp snatches it back.', '"Enough looking. Hitting now."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },
  { id: 'imp_cookbook', trigger: 'imp_cookbook', speaker: 'Hex Imp', portrait: 'enemy_hex_imp',
    lines: ['A cookbook. Of course. The hum is the recipes.', 'The imp is so pleased it forgets to hex you. It may even have left something behind.'],
    options: [{ text: 'Let it go.', effects: [{ relation: 'imp', delta: 1 }, { tome: 'random' }, { skip: true }], default: true }, { text: 'Fight it anyway.', effects: [{ relation: 'imp', delta: -2 }, { fight: true }] }] },

  { id: 'necro_gerald', trigger: 'pre_fight:adept_necromancer', speaker: 'Adept Necromancer', portrait: 'enemy_adept_necromancer', when: [{ relation: 'gerald', min: 1 }],
    lines: ['Gerald says hello. Gerald remembers you.', 'Gerald would like to fight you again. I told him you were busy. He insists.'],
    options: [{ text: 'Hello, Gerald. Fight.', effects: [{ relation: 'gerald', delta: 1 }, { fight: true }], default: true }, { text: 'Tell Gerald I said no.', effects: [{ relation: 'gerald', delta: -1 }, { fight: true }] }] },
  { id: 'necro', trigger: 'pre_fight:adept_necromancer', speaker: 'Adept Necromancer', portrait: 'enemy_adept_necromancer',
    lines: ['The robe is three sizes too big. Something small and bony peers out of the sleeve.', '"Do you want to see my skeleton? His name is Gerald. He does a dance."'],
    options: [
      { text: '…Sure. Show me.', effects: [{ flag: 'met_gerald' }, { relation: 'gerald', delta: 1 }, { next: 'necro_dance' }] },
      { text: 'Go home, kid.', effects: [{ relation: 'gerald', delta: -1 }, { fight: true }] },
      { text: 'Fight.', effects: [{ fight: true }], default: true },
    ] },
  { id: 'necro_dance', trigger: 'necro_dance', speaker: 'Adept Necromancer', portrait: 'enemy_adept_necromancer',
    lines: ['Gerald does the dance. It is a good dance. It goes on a little long.', '"Now he wants to fight you. Gerald does. Not me. I am just here."'],
    options: [{ text: 'Fine, Gerald. Fight.', effects: [{ fight: true }], default: true }] },

  { id: 'rats_promised', trigger: 'pre_fight:rat_pack', speaker: 'Rat Pack', portrait: 'enemy_rat_pack', when: [{ flag: 'rats_promise' }],
    lines: ['The rats are wearing tiny collars. One of the collars has a bell.', 'You promised Wren. The rats seem to know this.'],
    options: [{ text: 'Shoo them off. (costs daylight)', when: [{ daylight: { min: 9 } }], effects: [{ daylight: -8 }, { relation: 'wren', delta: 1 }, { skip: true }], default: true }, { text: 'A promise is a promise, but… fight.', effects: [{ flag: 'broke_promise' }, { relation: 'wren', delta: -2 }, { fight: true }] }] },
  { id: 'rats', trigger: 'pre_fight:rat_pack', speaker: 'Rat Pack', portrait: 'enemy_rat_pack',
    lines: ['The rats are wearing tiny collars. Someone loves these rats.', 'The rats do not love you.'],
    options: [{ text: 'Fight.', effects: [{ relation: 'wren', delta: -1 }, { fight: true }], default: true }, { text: 'Shoo them off. (costs daylight)', when: [{ daylight: { min: 9 } }], effects: [{ daylight: -8 }, { skip: true }] }] },

  // ---------------------------------------------------------------- screen 2 enemies
  { id: 'ogre', trigger: 'pre_fight:ogre', speaker: 'Ogre', portrait: 'enemy_ogre',
    lines: ['"Toll."', 'It holds out a hand the size of a door. It has clearly said this word before and nothing else.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Pay the toll. (12 gold)', when: [{ gold: { min: 12 } }], effects: [{ gold: -12 }, { skip: true }] }] },
  { id: 'knight', trigger: 'pre_fight:iron_knight', speaker: 'Iron Knight', portrait: 'enemy_iron_knight',
    lines: ['The armour is empty. You are almost sure the armour is empty.', 'It raises its sword with great formality, as if introducing you to someone.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Bow back.', effects: [{ next: 'knight_bow' }] }] },
  { id: 'knight_bow', trigger: 'knight_bow', speaker: 'Iron Knight', portrait: 'enemy_iron_knight',
    lines: ['It is delighted. Something inside the helmet rattles approvingly.', 'It still intends to kill you. But politely.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },
  { id: 'witch', trigger: 'pre_fight:witch', speaker: 'Witch', portrait: 'enemy_witch',
    lines: ['"I know what you did to the rats."', 'You may not have done anything to the rats. She says it anyway.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Wren sent you?', when: [{ relation: 'wren', max: -1 }], effects: [{ next: 'witch_wren' }] }] },
  { id: 'witch_wren', trigger: 'witch_wren', speaker: 'Witch', portrait: 'enemy_witch',
    lines: ['"Wren sends nobody. Wren comes herself. I am just early."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },
  { id: 'harpies', trigger: 'pre_fight:harpies', speaker: 'Harpies', portrait: 'enemy_harpies',
    lines: ['Three of them, arguing about who saw you first.', 'They settle it by all diving at once.'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },

  // ---------------------------------------------------------------- gates
  { id: 'andre_5', trigger: 'gate:gatekeeper', speaker: 'Knight Andre', portrait: 'enemy_gatekeeper', when: [{ deaths: 'screen', min: 5 }],
    lines: ['"I have started naming the bruises after you."', '"This one is called Tuesday."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Why do you guard this gate?', effects: [{ next: 'andre_why' }] }] },
  { id: 'andre_2', trigger: 'gate:gatekeeper', speaker: 'Knight Andre', portrait: 'enemy_gatekeeper', when: [{ deaths: 'screen', min: 2 }],
    lines: ['"Back again. I recognised the walk."', '"The walk is the same. The dying is the same. Try something new, little one."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Why do you guard this gate?', effects: [{ next: 'andre_why' }] }] },
  { id: 'andre_1', trigger: 'gate:gatekeeper', speaker: 'Knight Andre', portrait: 'enemy_gatekeeper', when: [{ deaths: 'screen', min: 1 }],
    lines: ['"You again. The road sends me the same ones until they stop coming."', '"You have not stopped coming. Good."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Why do you guard this gate?', effects: [{ next: 'andre_why' }] }] },
  { id: 'andre_0', trigger: 'gate:gatekeeper', speaker: 'Knight Andre', portrait: 'enemy_gatekeeper',
    lines: ['A giant in three different suits of armour, none of them his size, leaning on a club that used to be a tree.', '"A visitor. I will make this quick. I always say that. It is never quick."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'Why do you guard this gate?', effects: [{ next: 'andre_why' }] }] },
  { id: 'andre_why', trigger: 'andre_why', speaker: 'Knight Andre', portrait: 'enemy_gatekeeper',
    lines: ['"Someone has to. The last one left. Before that, the one before him left."', '"I do not think anyone is on the other side any more. I have not checked. Checking is not guarding."'],
    options: [{ text: 'Fight.', effects: [{ relation: 'andre', delta: 1 }, { fight: true }], default: true }] },

  { id: 'wren_gate', trigger: 'gate:wren', speaker: 'Wren',
    lines: ['Wren is standing where the giant should be. The giant is sitting against the wall, looking relieved.', '"I told you I would see you at the gate. Is that your {weapon}? It is now."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }, { text: 'I am sorry about the rats.', effects: [{ relation: 'wren', delta: 1 }, { next: 'wren_sorry' }] }] },
  { id: 'wren_sorry', trigger: 'wren_sorry', speaker: 'Wren',
    lines: ['"Sorry." She weighs the word. It does not weigh much.', '"Tell it to Tuppence. And Bell. And the one with no name, who liked you."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },

  { id: 'warden_2', trigger: 'gate:warden', speaker: 'The Warden', when: [{ deaths: 'screen', min: 2 }],
    lines: ['"The marsh keeps what it takes. It has kept you twice."', '"It is getting attached."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },
  { id: 'warden_0', trigger: 'gate:warden', speaker: 'The Warden',
    lines: ['Something stands up out of the water that was not shaped like a person until it decided to be.', '"You passed Andre. Andre is soft. I am not Andre."'],
    options: [{ text: 'Fight.', effects: [{ fight: true }], default: true }] },

  // ---------------------------------------------------------------- signposts, in the game's voice
  { id: 'sign_1_0', trigger: 'sign:sign_1_0', speaker: 'Signpost', lines: ['NORTH: the long way round the lake. A chest, the shrine, and whatever got there first.', 'STRAIGHT ON: the gate road. Shop ahead.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_1_1', trigger: 'sign:sign_1_1', speaker: 'Signpost', lines: ['SOUTH: the woods, the warren, and a chest nobody came back from.', 'STRAIGHT ON: the gate road. Andre does not like visitors after dark.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_1_2', trigger: 'sign:sign_1_2', speaker: 'Signpost', lines: ['The road turns down to the gate from here.', 'Someone has carved "GERALD WAS HERE" into the post. The letters are very small.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_1_3', trigger: 'sign:sign_1_3', speaker: 'Signpost', lines: ['UP: the gate road, past the warren.', 'BEHIND YOU: the far chest, and someone shouting for help in a voice that sounds tired of it.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_2_0', trigger: 'sign:sign_2_0', speaker: 'Signpost', lines: ['NORTH: dry ground, mostly. A chest, a shrine, two things that want you.', 'STRAIGHT ON: the Warden. The sign is damp in a way signs should not be.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_2_1', trigger: 'sign:sign_2_1', speaker: 'Signpost', lines: ['SOUTH: the drowned way. Slow going.', 'STRAIGHT ON: the Warden. Under that, scratched: "the rats got big".'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_2_2', trigger: 'sign:sign_2_2', speaker: 'Signpost', lines: ['The marsh road descends to the Warden from here. It does not say what the Warden is.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
  { id: 'sign_2_3', trigger: 'sign:sign_2_3', speaker: 'Signpost', lines: ['UP: the Warden’s road.', 'BEHIND YOU: the far chest, and the lost one, who is not shouting any more.'], options: [{ text: 'Walk on.', effects: [{ skip: true }] }] },
];
