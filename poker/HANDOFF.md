# Handoff: Poker Night at Dave's

Read this first in a new session. It says what exists, how it works, how to work on it, and what is
left. It is kept current; when a system changes, change its paragraph here.

## Where things are

- Branch `claude/magical-wozniak-04xz9z` in `brucemccoy75-dev/Mobile`. All work lives in `poker/`.
  Other projects live on other branches; never touch them.
- Live build: https://brucemccoy75-dev.github.io/Mobile/poker/ . Every push that touches `poker/`
  runs `.github/workflows/poker.yml`, which tests, builds and publishes `dist/` into the `poker/`
  folder of the `gh-pages` branch. The player must hard-reload to get a new build.
- `DESIGN.md` is the approved design, updated as decisions changed. `docs/portraits.md` has the
  portrait style block and every character's prompt.

## Commands (run inside `poker/`)

```sh
npm install
npm test                 # 67 tests: engine, bots, controller, banter, thinking, career, conversations
npm run build            # typecheck + production build
npm run sim -- --n 100   # bot-only nights (mixed lineups): finishes and tendencies per type and man
python3 tools/key-portrait.py in.jpg public/portraits/<id>.png   # green-screen to transparent PNG
```

Verify visually with Playwright in headless Chromium (pre-installed, launch with
`--use-gl=swiftshader --enable-unsafe-swiftshader`): serve `dist/` with `npx vite preview --port 4173`
and open `http://localhost:4173/` (not the Pages path: the preview serves `dist/` at the root and
falls back to index.html for anything else, which 404s the bundle). Kill stale previews first
(`pkill -f "vite preview"`). Viewport 844x390 with `isMobile`; also try 932x430 and 1024x768 (the
stage letterboxes). Flow: `.skip` (the intro), `.random`, `.deal`; act through `#actions .passive`
/ `.fold`; screenshot. `window.__scene` exposes the scene: `showInset(seat, ms, name, caption)`,
`hideInset()`, `speak(seat, target, text, ms, trigger, name)`, `vaporise(seat)`. To see the career
page with data, write a `pihkh.save.v2` JSON into localStorage (shape in `career.ts`), reload,
skip, click `.go-career`.

Measuring banter and bet sizes: run a `TableController` with a scripted human and feed its events
to a `Banter` with a fake clock (see `banter.test.ts` for the pattern); for sizes, drive a
`Tournament` with `Bot.decide` directly and bucket raises by street. Both were done as scratch
scripts; rebuild them from the tests when needed.

## Architecture

- `src/engine`: pure poker. Cards, 7-card evaluator, the hand state machine (blinds, antes, heads-up
  rules, min-raise, side pots, uncalled bets returned), the sit-and-go loop. Seeded RNG.
- `src/bots`: the AI. Monte Carlo equity with range sampling, 169 preflop classes, four policies
  (nit, tourist, calculator, pro) in `policy.ts`, stats IQ/Read/Clarity in `stats.ts`, opponent
  profiles, the roster in `characters.ts`.
- `src/game`: `table.ts` runs a night with the human in seat 0 and emits events to a presenter
  (pause, history, human actions, no shot clock but timing tracked); `banter.ts` decides who says
  what; `thinking.ts` generates the think-aloud lines; `career.ts` is the save.
- `src/content`: `lines.ts` (every man's lines, by trigger and mood), `triggers.ts`,
  `conversations.ts` (two-man exchanges and Bruce's interjections), `teases.ts` (digs at each man),
  `openers.ts` (good-luck lines).
- `src/scene`: Three.js. `table-scene.ts` presents events (cards, chips, figures, the speaker panel
  rendered with a second camera into a scissor region, the result and standings cards, the laser);
  `figures.ts` (portrait standee from `public/portraits/<id>.png`, drawn placeholder otherwise);
  `cards.ts`, `chips.ts`, `audio.ts` (synthesised sounds, including `zap`), `director.ts` (the
  fixed camera and seat poses), `tween.ts`.
- `src/ui`: `stage.ts` (a fixed 1000x460 stage scaled to fit the visual viewport, safe areas
  respected; everything including menus and panels is laid out in stage units inside `#stage`,
  only `#rotate` sits outside), `overlay.ts` (name plates, board, hole cards, result and standings
  cards), `actions.ts`, `panels.ts` (pause menu, hole-cam replay, settings, career), `screens.ts`
  (intro video, the home/pick screen, results).
- `src/main.ts` wires it all. `src/sim` is the bot-only simulator.

## The game, as it stands

One format, Poker Night: pick any five of the twelve men on the home screen, everyone starts with
$10,000, blinds 50/100 rising every eight hands, antes from level four, until one man has
everything or you bust. No table tiers (Kids Table, Adult Table and Real Poker were built and
removed). Skynet, Dave's android, deals and vaporises whoever busts.

**Screens.** A skippable intro video plays once per visit over the home screen. The home screen is
a horizontal carousel of the twelve men (big cards, scroll-snap, gold arrow buttons, mouse wheel;
one nudge out and back when it appears so it reads as scrollable). One man pitches at a time and
only men on screen pitch, so it never scrolls on its own. The footer has the name entry, Deal,
Career and Settings. In the game: fixed TV camera, Skynet top centre with the five seats squeezed either side of him
(three left, two right; angles in `layout.ts`), the board large at the top, your cards and
stack bottom right, the action bar bottom left, dollar stacks under names, a standings card on hand
one and whenever the blinds go up, a result card mid-table at the end of each hand (who showed
what, who won), and the speaker panel down the right side. Results screen, then back home.

**Career** (`career.ts`, page in `panels.ts`). Save key `pihkh.save.v2` in localStorage:
- `record`: nights, wins, finishes by place, best hand, biggest pot, hands played.
- `rivals[id]` per man: `games`, `wins` (nights you finished ahead of him), `losses` (he finished
  ahead; a man still in when you bust counts as ahead), `knockouts` (you took his last chip),
  `knockedOutBy` (he took yours). `TournamentTracker` collects them from events;
  `recordTournament` applies them.
- `trophies`: First Blood, Regular (five wins), Pro Killer, Cleaner, Nemesis (five knockouts of one
  man), Nobody's Safe (every man knocked out once), Pure Air, The Nuts, Chip and a Chair, Rivered,
  Short Night, Scared Money.
- A version-1 save (records per table) is folded into `record` on first load; `clearSave` removes
  both keys. The page lists every man with portrait, record against you ("4–1"), knockouts each
  way, sorted by your knockouts; men never played are dimmed.

**Busting.** When a hand takes a man's last chip the result card waits (`pendingResult`), Skynet
says a `termination` line as `vaporise()` fires a red beam from the visor, the screen flashes, a
puff of smoke goes up, the figure is hidden and the `zap` sound plays. When it is you the beam comes
at the camera and the flash is hard. Then the result card shows. Busted seats go in `Banter.gone`
and never speak or get cast again.

## The bots

Stats run 0 to 100 and are hidden from the player. IQ is odds and position (below 45 he stops
thinking in ranges; low IQ adds noise to his equity). Read is how much he uses your history once
he has about 25 hands on you. Clarity is tilt: up on bad beats and big losses, down on wins and
quiet hands; at 55 he switches to tilted lines, and every point cuts effective IQ and Read by up to
half. `temper` multiplies tilt (David 2, Kevin 1.4). Tilt shows on the man himself: at each hand end
`Figure.setTilt()` flushes his portrait red from clarity 25 (none) to 85 (full). Types set the play style and how fast tilt
rises and falls (pros barely tilt, nits stay tilted).

| id | name | type | IQ | Read | Clarity | talk | trash |
|---|---|---|---|---|---|---|---|
| harold | David Sr | nit | 48 | 32 | 24 | 0.5 | 0.6 |
| dolores | Paul | nit | 52 | 38 | 14 | 1.1 | 0.8 |
| marvin | Kevin | tourist | 18 | 12 | 30 | 0.6 | 0.8 |
| chad | Bawb | pro | 93 | 86 | 22 | 0.9 | 0.5 |
| trish | Tim | tourist | 36 | 30 | 12 | 1.2 | 1.7 |
| benny | Luca | tourist | 22 | 18 | 30 | 1.1 | 1.0 |
| wen | Jonathan | calculator | 92 | 48 | 12 | 0.9 | 0.6 |
| priya | Will | calculator | 84 | 58 | 18 | 1.0 | 0.9 |
| ulrich | Menafee | tourist | 15 | 10 | 26 | 1.0 | 0 |
| sal | Jack | tourist | 30 | 24 | 16 | 1.3 | 1.1 |
| nadia | David | pro | 94 | 84 | 26 | 1.3 | 1.9 |
| jimmy | Bruce | pro | 82 | 90 | 22 | 1.1 | 1.3 |

The ids never change (saves, memories and portrait file names depend on them). `talk` is how often
a man speaks and lands in exchanges; `trash` how often he needles and how often Bruce butts in.

**Bet sizing and aggression** (`policy.ts`): `PREFLOP_MULT` for opens (2.2 to 4bb plus limpers),
`PREFLOP_RERAISE` for three-bets as a multiple of the raise in front (2.3 to 3.5x) and
`PREFLOP_FOURBET` for four-bets and later (2.0 to 2.5x), `POSTFLOP_RERAISE` for a raise over a bet
after the flop (2.3 to 3.5x the bet, not pot-based), `SIZE` for bets as a share of the pot, all
scaled by `SIZE_SCALE` per type (tourists 0.55, nits 0.85; tourists also x0.8 on preflop re-raises,
so they mostly min-raise). Tourists are loose-passive: they limp seven times in ten, call with
anything, bet about a quarter of the time they have something, and rarely raise a bet unless they
have the goods or are on tilt. Measured over the first sixteen hands of 25 bot-only nights, the
pot in big blinds runs median 10, three-quarters under 27, nine in ten under 80; the biggest pots
are now value bets against calling stations and a nit shoving aces, which is poker. The simulator
keeps the type order: calculators and pros win most nights, nits lose slowly, tourists lose fast.

## The banter engine (`banter.ts`)

Everything said at the table comes through `Banter.onEvent(event, table)`, which returns at most
one `Speech` per event, and `Banter.tick(table)`, which `main.ts` calls every 1.5 s while a night
runs (not while paused) so the table keeps talking between events: exchanges carry on and new ones
start while you sit on a decision, and the opening round lands on time. `main.ts` passes it to `TableScene.speak()`, which queues lines so the one
on screen stays until it has been up long enough to read (`readMs`, by length); stale reaction
lines that waited over 6 s are dropped, conversation lines keep their order. The speaker appears in
the right-hand panel with the line as caption; a line about someone cuts to him for a beat after.

Sources, in the order the engine tries them:
1. **The opening round.** On `tournamentStart` every man's last-spoke clock is reset (so nobody is
   owed a forced line) and two or three men, sometimes Skynet, say an opener from `openers.ts`
   four seconds apart before anything else. A man with his own `gameStart` lines (Tim) uses those.
2. **Reactions** to the game: triggers in `triggers.ts` (dealt in, folds, raises, calls, all-ins,
   showdowns, bad beats, bluffs, needles at whoever folded, called, tanked, snapped or checked,
   short stack, chip leader, player out, heads up, idle). Odds per trigger are in `onAction`,
   `onHandEnd` and the `turn` case, and they favour the plays that matter: opens, checks, preflop
   folds and snap calls are near-silent; raises over a bet, big bets (8bb or 60% of pot), big
   calls (5bb+), all-ins, bluffs, bad beats and knockouts speak. At hand end the odds scale with the
   pot against the average stack (x1 at 25%+, x0.5 at 10%+, x0.12 below), except knockouts and
   bad beats, which always get a word. `aggressorThisStreet()` tells a bet on this street from a
   carry-over, so "re-raise" and "facing" mean this street. `say()` gates by a global 1.8 s gap,
   a 9 s cooldown per man, the man's `talk` (times `trash` for needles) softened by how long he
   has been quiet, and picks an unused line of the right mood (tilted at clarity 55+).
3. **Teases** (`teases.ts`): eight personal digs per man that anyone can throw. A needle that lands
   on a man the table knows becomes a tease 75% of the time; idle chatter is a dig at a random man
   60% of the time; between hands somebody has a go at somebody (8%). Trigger `tease`.
4. **Thinking aloud** (`thinking.ts`): men with IQ 72 and up say what they are thinking as they
   act. The line is generated on the `action` event from the move he is making, so it always
   agrees with it: a fold credits the other man ("You've got the straight, don't you") or admits
   air, a call claims a pair or denies the read, a raise claims strength or denies the read, and it
   ends with the move ("Fold." "I'll call." "Raise."). Reads about a straight, flush or trips
   appear only when the board allows them; the street tag says how many cards are to come. Whether
   the claim is true depends on his cards, so a bluff comes with a lie and a value bet with the
   truth. Odds: facing a bet after the flop 22% (12% when folding), his own big move 12%, preflop
   4%. Trigger `thinking`. A man does not repeat his recent lines.
5. **Conversations** (`conversations.ts`, 155 exchanges tagged office, ai, spouse, weather, sports,
   dnd, kill): start only in quiet moments (1% per bot turn, 5% per hand end, 60 s after the last),
   pairs weighted by `talk` and silence, pinned to particular men with `who`, stance-gated with
   `needs`. A running exchange has the floor: `say()` returns nothing except `termination` until it
   ends, and a big pot abandons it rather than pausing it. `{A}`, `{B}`, `{you}`, `{gone}`.
6. **Interjections**: after an exchange he sat out, Bruce may get the last word from
   `INTERJECTIONS` (aimed at a man by id, by theme, or all-purpose; `{them}`); the exchange's final
   line holds the panel until his lands. Other men can get pools the same way, keyed by `who`.
7. **The kill aftermath**: after a `termination`, one `kill` exchange runs: concern for two lines,
   then snacks.

Rules that hold everywhere:
- Nobody names a man who is not at the table: `mentionsAbsent()` drops any line, tease, exchange or
  interjection whose text contains an absent character's name ("David Sr" matched before "David").
  "The boy" and "your father" still pass.
- Nobody stays silent: `silence()` weights every pick by quiet time, and after five quiet minutes
  a man may get a forced idle line. A test checks every survivor of twenty hands has spoken.
- Menafee never speaks (`LINES.ulrich` is empty); exchanges pinned to him have empty B lines so the
  panel shows the chair with no caption. Nobody at the table ever remarks on it.
- Volume lands around two lines a minute in simulated nights, nearly all reactions to real plays.
- Tests require every trigger in the coverage list for every man, a tilted line each, 100+ lines
  per type, well-formed exchanges (A first, alternating), and the behaviours above.

## The voices

Every man has his own line set (47 to 71 lines; Skynet 51). Lines are funny first, raw tone
allowed, no slurs. `{target}` and `{hand}` are substituted.

- **David Sr** (harold): seventy, played for nickels in 1974, calls his son "the boy", his hip has
  opinions, folds everything.
- **Paul** (dolores): everything by hand (clothes, car, horse), honey on sale, half off a gallon if
  you show one card, "full homestead", bees, D&D with his wife as DM. Makes the old jokes late.
- **Kevin** (marvin): drunk, loud, possibly imaginary, at a different party in his head, asks for
  the bathroom, calls everyone Dave.
- **Bawb** (chad) and **Jonathan** (wen): live updates from southern NH girls' softball, basketball
  and track (Bedford, Souhegan, Hollis-Brookline, Londonderry, Pinkerton, Alvirne, Salem, Windham,
  Merrimack), Kara's hamstring, the Dubois twins, the Division II standings, Jonathan's letters to
  the NHIAA, Bawb's chairs. Eight exchanges between them and five where someone else asks.
- **Tim** (trish): TowelZoneDotBiz (forty dollars, hacked by Disney Towels, the Thailand scouting
  trip in March, the towel that broke when he dropped it), his bowels (the cattle farm, the
  proctologist who whispered "don't get erect, Mark"; Mark is the proctologist's name), snacks he
  cannot have, trash talk half vicious and half misunderstanding the rules. The old jokes.
- **Luca** (benny) and **Will** (priya): the new GTA (Luca loves it, Will hates it), Christmas,
  clown school, failed proposals (balloon, Celtics game, bridge, thirty-slide deck), trying for
  children, Will's laminated plans.
- **Menafee** (ulrich): the empty chair. People talk to it.
- **Jack** (sal): sixteen, respectful trash talk ("sir", "respectfully"), school, driving, a job,
  where the snacks are. Never cast in unpinned "my wife" exchanges.
- **David** (nadia): hothead, the castration policy for checking (`targetChecks`), hummus and
  pretzels, tilts twice as hard. The old jokes, with pliers.
- **Bruce** (jimmy): dry, snide, never angry; the commute (Route 3, 93, seventy minutes), tired and
  wants to go home, praises capitalism, layoffs and AI taking jobs. Butts in with 37 interjections.
- **Skynet** (dealer): an android sent to end everyone, barely hiding it; misquotes the classics
  ("Futility is resistance", "Jim, I am your father", "Live long and perspire"); sixteen
  `termination` lines (Cylon detected, the weakest link, the Ryan Leaf of poker).

To add material for a man: lines in `lines.ts` under his id (keep every trigger covered), exchanges
in `conversations.ts` pinned with `who`, digs about him in `teases.ts`, and update his bio and
pitches in `characters.ts`. Run `npm test`.

## Portrait pipeline

All thirteen portraits are done. For a new one: write the prompt from the style block in
`docs/portraits.md` plus the description, ending with the flat `#00b140` green background line and
"clothing is not green"; the owner generates and uploads; `python3 tools/key-portrait.py <upload>
public/portraits/<id>.png`; commit. The engine picks it up with no code change. Expression variants
(`<id>_happy.png` etc.) are in the spec but not loaded yet; add the texture swap in `figures.ts` on
`setExpression` when the first set exists.

## Conventions

- Commit messages: a short title, a body saying why, then the attribution lines the session is given.
- Never force-push. Never commit to other branches. CI must stay green.
- Large multi-file edits worked best as a Python patch script run with `python3 -I script.py`,
  asserting each old string exists and replacing exactly once, writing each file only after all its
  replacements succeed.
- Keep this file and `DESIGN.md` current with every change that alters a system.

## Open items, in order

1. Expression variants and the texture swap in `figures.ts`.
2. Tuning from real play: banter density, bot busts in the first few hands, the blind schedule,
   the thinking-aloud rate.
3. Later from the design: text-to-speech, cash games.
4. The re-rpg and map3d workflows on their own branches force-publish the whole Pages site and would
   wipe `gh-pages/poker/`; rerunning our workflow restores it. Fix those workflows if it bites.
