# Next session notes

## Start here (updated 2026-11-01)

**Just shipped: the tutorial (#96).** A new player's first New run is the Training Grounds, a short
off-the-record run with set fights, set hands and no death, and fifteen lessons over a dimmed
screen. Skip leaves it; the title's Tutorial button replays it. The words are `tutorial.lessons` in
`world.json` (world editor → Tutorial tab). Wait for the designer's phone verdict on it; then
backlog item 1 (pacing and balance) is next, starting from the next run log.

**State.** Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`, live on GitHub
Pages at https://brucemccoy75-dev.github.io/Mobile/ (designer tools: add `?dev`). After a push,
poll `origin/gh-pages` for "Deploy re-rpg <sha>", **then** poll the live site until its main JS
contains your 7-character hash; that is the build stamp the title shows at the bottom left. Pages
publishes some time after the branch updates, and the page is cached for 10 minutes
(`max-age=600`; there is no service worker), so ask the designer to check the title's
`build <hash>` when a change "isn't there" (#75, #95). Fetch with a `?t=<now>` query so a cache
cannot answer. 369 tests pass (`npm run check`: typecheck, cards:validate, world:validate, tests,
build). The game today is:

- **Title** (#95): New run / Continue, **Tutorial** (#96), **Demo mode**, export run log, wipe save
  (asks twice), fullscreen. With `?dev` (or `localStorage rerpg:dev = 1`) a 2×2 block top left adds Test Mode,
  the card editor, the world editor and the art-style switch.
- **Tutorial** (#96): a new player's first New run (no `done` in `meta.tutorial`) goes to the
  Training Grounds (`map_training.jpg`, `src/data/maps/training.ts`). It is a warrior run, off the
  record on a copy of the meta, with 30 gold and no heirlooms:
  - the road: start, a Boar, a Hex Imp, the shrine, the shop, the chest, a Shell Beetle and Rat
    Pack duo, an Adept Necromancer;
  - the fights deal set hands (`ordered`) and the hero cannot drop below 1 HP (`floor`);
  - lessons dim the screen but one target and wait for "Got it" or for the thing itself;
  - Skip, or finishing, saves `done` and goes to class select;
  - the heirloom lesson shows once, on the first real run that offers heirlooms;
  - saves from before #96 that have played count as done.
- **Run start** (#94): class select and heirlooms over a muted Grok valley (`menu_valley.jpg`); the
  heirloom choices are the real cards (tap to keep two, press and hold to read).
- **Node overworld** (#37): a static node network per screen over an authored terrain, contents
  rolled per run (shaped by node rules, #55); tap a reachable node to travel, swipe to pan. `?dev`
  shows the road overlay.
  - Screen 1, the Gate Road (`map1.jpg`, #39), 20 nodes. The south spur's end is the door to the
    Treasure Dungeon (below).
  - Screen 2, the Frozen Pass (`map2.jpg`, #76): 48×27 tiles, 40 nodes, crossing tracks, painted
    at twilight with a village, a rope bridge and a watchtower (#90); battles on a blue frozen
    lake at twilight (`bg_tundra.jpg`, #80, #89).
  - Fight nodes show just their enemies (a duo both). About 15% of single-enemy fights are a
    surprise: another enemy waits ("That's no Boar!").
  - The shrine asks before it heals, so it can be saved. Shops buy one card, starting cards too
    (#81).
- **Enemies**:
  - screen 1: Boar, Shell Beetle, Hex Imp, Adept Necromancer, Rat Pack; Knight Andre at the gate;
  - screen 2: Frost Ogre, Frozen Knight, Icy Witch, Snow Harpies; The Frost Warden (#84; the
    pale five cut on green, #91);
  - the Treasure Dungeon (#84): Wrath Wraith, The Midden Queen, The Hogpile, Spiteful Alpaca,
    Bramble Hornet. They have weakness traits as gold chips and battle barks (#83). One visit a
    run, behind a prompt: three fights at +50%, then a chest with Doomsday Armor, Doomsday Device
    or a goat that sells for 150.
- **The story is switched off** (#72) while the designer balances: `STORY.enabled = false` in
  `src/data/world.ts`. No quests, special runs, dialogue, on-kill hooks or Wren; Knight Andre
  always holds the gate; the story nodes are plain dots. `world.json` and the world editor keep
  everything; set the switch to `true` to bring it back. The ghost is also off (`GHOST_ENABLED`,
  #54).
- **Combat**:
  - a hand of 3 before every card (#53, #70); one card per enemy alive (#68);
  - branching cards on HP below a percent, a debuffed enemy, a coin you call, or a hand of
    blackjack against 16 (#69, #88);
  - Bellow stuns the enemy for its next action and leaves you Weak; Trickster's right call
    debuffs the enemy; Blackjack is beat-16 for 200% or nothing and Exposed (#88);
  - enemies can be stunned (#88);
  - ATK and DEF for every fighter, green when buffed, red when debuffed (#77);
  - statuses that land together play together (#64); sweeps hit every enemy at once (#47);
  - remove guard and remove buffs (#48), backfire (#51); luck: crits and bonus turns (#50, #52);
  - cursed enemies from class level 3 (5% of fight nodes, a prompt first), traits as red chips,
    3× gold and EXP, the cursed pool (Cursed Counter) (#73, #78);
  - duo intent panels sit over their own enemy, above the sprites (#92).
- **Cards** (#85–#87): parchment tinted by kind with dark ink, 212×126, in a Grok frame by theme
  (swords, shields, subtle magic, bones). Tags sit on the top edge; press and hold reads a card at
  2×. A card may carry written `text` (#93).
- **Battle effects** (#59–#66, #79): slash, fireball, lightning, frost, arcane, heal, poison cloud,
  the Grok curse skull, sandwich, playing cards, coin, coloured shields and deflections.
- **Gear**: small flat items. Boss items break the caps: Gatekeeper's Eye, Warden's Seal, and
  Andre's Earthen set (Armor Weak-proof, Blade 50% pierce, Relic 20-gold reshuffle; #82). The
  dungeon's Doomsday pieces cost 1 HP per attack (#84).
- **Progression**: levels 1–10 per class (#49); warrior tree Bulwark, Berserker → Paladin, Shadow
  Knight → Weaponmaster (#46); Paladin and Weaponmaster are empty. Nothing drops without a node
  (#42).

**Demo mode** (title; #93, was level select #76): pick screen 1 or 2 and play it with a hand of
Doom (every play kills every enemy), off the record: never saved, logged or counted, and the
saved run and the meta are untouched. `scene('Title').startLevel(i)` still starts a plain
level-select run, and `startDemo(i)` a demo, for scripts.

**Two editors, phone first** (title screen with `?dev`, or `editor.html` / `world.html` directly; #95): the **card editor** (`editor.html`, `docs/CARDS.md`)
and the **world editor** (`world.html`, `docs/WORLD.md`: Nodes, Quests, Words, Enemies, Tutorial). The
designer edits on the phone and sends an exported `cards.json` or `world.json`; the import is the
fixed procedure in the matching doc (validate, check, pinned tests only, commit). Never hand-edit
card numbers or story in TypeScript. A new mechanic or story capability is an engine change with
tests first, then a schema field, an editor control and a validator rule.

**Scripts for the tutorial**: `scene('Title').startTraining()` starts a training run. A lesson is a
16 px Text at depth 250 in the active scene; its "Got it" is a Text you can click by position.
Clicks must be scaled from game coordinates to the canvas (the game is 1169×540 inside an
844×390 page).

**Working loop.** Edit → `npm run check` → start `npx vite preview --port 4174 --strictPort` in its
own command → Playwright at 844×390 (the game) or 390×844 (the editors) with `window.__rerpg`
(Test Mode: set registry `testSetup`, call `TestMode.fight()`, then `Combat.act()` and poll
`busy`; a map run: `scene('Title').startLevel(i)` or `startDemo(i)`; to answer a dialogue from a
script, `scene('Dialogue').choose(d, option)`; a card tap needs the hand dealt, about 2.5 s into
a fight) → commit with
the attribution lines → `git push -u origin <branch>` → poll gh-pages and the live JS. The preview
server is stopped after 2 hours in the background; start it again when a check needs it. Record
decisions in
`docs/DECISIONS.md` (next number is 97). Screenshots of checks go in `docs/audit/<topic>-<date>/`.

**Run logs** (`docs/PLAYTESTS.md`, DECISIONS #67). When the designer sends a run log, always:
1. save it in `docs/playtests/`;
2. run `npm run playtest -- <log>` (real runs next to the screen-1 mirror: how often each reaches
   and beats the boss);
3. run `npm run sim -- --screen --class warrior` and `npm run sim -- --class warrior`;
4. write it up as the next "Phone test N" at the top of `docs/BALANCE.md`;
5. recommend, and change nothing without the designer.

Latest: **Phone test 8** (2026-10-28):
- fresh and Berserker runs reach Wren 0% (mirror 0%);
- 63–75% of deaths come in duos;
- levels shorten fights but don't add wins.

Since then, with no run log yet: one card per enemy alive (#68), and the gate is Knight Andre
(#72). Also #81 (surprises, the shrine prompt, selling), #82 (the Earthen set), #84 (the dungeon
door) and #88 (card redesigns). The latest mirror (BALANCE.md, #88): the shortest road reaches
Andre 15.9–60.9%, and he is beaten for the first time. The next run log is the first real test of
all of it.

**Art by API** (#75; docs/ART.md): make art yourself with `scripts/grok.py` (images, edits of a
reference image, video; `--resolution 2k --aspect …`). Rules learned this cycle:
- paint maps first and trace the roads, or edit an existing painting and check the trace region
  by region at full size (#76, #90);
- generate pale characters on flat green and cut them with `cut-green.py`, not on white (#91);
- edit an existing backdrop to keep its framing and feet line (#80, #89);
- moderation refuses "death" wording; cartoon wording passes (#85).

The key arrives in the designer's first message. Save it to `re-rpg/.env.local` (git ignores it)
before anything else, and never write it into a commit, a doc or the chat.

Open art notes:
- the hero's overworld walk "looks kind of weird" (designer, 2026-10-31): revisit, not now;
- the ice "golem" on the screen-2 battle lake reads as an ice heap (one more edit, about $0.10);
- not started: walk sheets for the other classes, front and back walk views, the opening cutscene
  (`art-src/cutscene/`), painted node icons.

**Scope.** Only the warrior is being balanced. Wizard and shaman cards, families and trees are
frozen by the validator until the warrior is done.

## Backlog, in order

1. **Pacing and balance** (the story stays off for it, #72; next):
   - the latest real reading is still Phone test 8 (2026-10-28; BALANCE.md). Since then: one card
     per enemy (#68), the shrine prompt and selling (#81), the Earthen set (#82), the dungeon door
     (#84), and #88's card redesigns;
   - #88 made the warrior clearly stronger: the shortest road reaches Knight Andre 15.9–60.9%, and
     he is beaten for the first time, mostly through Bellow's stun. Levers if too strong: Bellow
     once per fight, a longer Weak, a stun chance;
   - with the designer: what a full clear should cost, growth within a run against across runs,
     fill Paladin and Weaponmaster through editor imports, screen 2's pacing (40 nodes, one shop,
     one shrine);
   - sim: model loot and the shop in the screen mirror, so it predicts a run instead of flooring
     it.
2. **Remaining hard-coded story → data** (from the #61 review):
   - Wren at the gate (`OverworldScene` encounter, `WREN_GRUDGE`) as `screens[i].gate: [{when, boss, trigger}]`.
   - Her boss-win payoff (`CombatScene`: +9 relation, `wren_beaten`) as an on-kill hook for a
     custom boss (the validator allows only roster ids today).
   - The start node's words per screen (`giver:wren` only on screen 1) as `screens[i].start`.
   - Node labels ("camp", "a voice", "someone") as a node-rule `label`.
   - One variable set (`{weapon}`, `{species}`…) for every dialogue, not only before fights.
3. **World editor performance**: every change rebuilds the page and re-runs validate and diff.
   Re-render only the edited panel; validate, diff and save the draft when idle. Matters once the
   library holds ~300 entries.
4. **Dead code**: the generated-map path (`src/core/map/generate.ts`, `encounter.ts`, `findPath`)
   and `generateQuest` / `GIVERS` are used only by tests; switch those tests to the authored map
   and `questFromDef`, then delete (keep `costField`). `RunState` still carries threat / POI fields
   for old saves. The #69/#71 running-total Blackjack status is in the engine but no card uses it
   since #88.
5. **Story, when the switch goes back on** (#72): each enemy's everyday lines (10–20 each, by
   personality, with the designer), the first special-run quest, and lines for Tam's node on
   screen 2.
7. Small:
   - plain level select has no button since #93 (offer it as a toggle in the demo panel if wanted);
   - Cursed Counter's and Trickster's long text step down to small type (press and hold reads
     them at 2×);
   - dialogue `chance` conditions draw from the quest stream (move them to their own stream).
