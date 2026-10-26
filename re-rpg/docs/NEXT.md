# Next session notes

## 0. Start here (updated 2026-10-26, evening)

**State.** Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`, live on GitHub
Pages at https://brucemccoy75-dev.github.io/Mobile/ (deploys ~70 s after a push; poll
`origin/gh-pages` for "Deploy re-rpg <sha>"). 182 tests pass (`npm run check`). Last commit:
see `git log`. Everything below in sections 1–14 is history; the game today is:

- **Node overworld** (DECISIONS #37): a static node network per screen over an authored
  terrain, contents rolled per run, tap a reachable node to travel, swipe to pan. Screen 1 has a
  painted backdrop (`public/art/c/map1.jpg`, DECISIONS #39); screen 2 still uses the tileset.
  Dark plates under markers. Dev overlay with `?dev` in the URL.
- **Dialogue with options** at every node (DECISIONS #35), relations and deaths per screen in
  meta v5, Wren the rat-keeper at the start node, Tam the tinker's re-arm quest, Andre's
  escalating gate lines, Wren replacing Andre at relation ≤ −2, your ghost at the node you died
  on (DECISIONS #36).
- **Combat**: duos, target arrow, fixed enemy rotations, flat gear attack (#31), equipment caps
  (#33), Bind Wound 25% once per fight, shop heal 35%, shrine half (#38, #39).
- **Progression**: EXP levels 1–10 per class, skill trees with only the two free nodes so far,
  heirlooms every run.

**Working loop.** Edit → `npm run check` → `npm run build` → `nohup npx vite preview --port
4174 --strictPort &` (start it in its own command; `pkill` in a chained command kills the chain)
→ Playwright at 844×390 with `window.__rerpg` (scripts in the scratchpad were throwaway; write a
new one per check) → commit with the attribution lines → `git push -u origin <branch>` → poll
gh-pages. Record decisions in `docs/DECISIONS.md` (next number is 41).

**Done this session: the buff/debuff audit (DECISIONS #40).** The engine and the chips were
already in step; the card was the liar (it said 4 against the beetle's DEF 1, so 3 landed from
round 1 and 2 while hardened). Now `src/core/combat/status.test.ts` pins apply/tick/end timing
for every status, `previewDamage` (core/combat/damage.ts) feeds the card headline the number the
chosen target will take with the reason in the unit ("2 damage · armour, hardened"), and
retargeting redraws the hand. Screenshots: `docs/audit/status-2026-10-26/`. Scripts that drove
Test Mode from Playwright were throwaway (registry `testSetup` + `TestMode.fight()`, then
`Combat.act()` and poll `busy`; map taps through the canvas rect, the game is 1169 wide at
844×390). Open question for play: the chip count flips from HARDENED 2 to 1 at the round
boundary; if that still confuses, the fix is in the chip (show ticks left after this round),
not the engine.

**Then, in order:** screen-2 painting (prompt in docs/ART.md, layout in
`art-src/layout-screen2.png`); life on the painting (lake shimmer, cloud shadows); painted
node icons; fill the skill trees; a quest generator that speaks node ids; Wren's still.

---

# Earlier notes (2026-10-25)

Read section 0 first; the rest is the record of how we got here.

## 1. Where the game is

- Live: https://brucemccoy75-dev.github.io/Mobile/ (GitHub Pages, ~70 s after a push,
  CDN cache up to 10 min). Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`.
- Last commit on the branch: `d28b508` "Equipment caps" (DECISIONS #33). 140 tests pass.
- Two screens (`SCREEN_COUNT = 2`): screen 1 boss Knight Andre (gatekeeper, 52/7),
  screen 2 boss Warden (62/8). Stills exist for screen-1 enemies only; screen-2 enemies
  (Ogre, Iron Knight, Witch, Harpies, Warden) still use placeholders.
- Per-class progression exists (EXP 1–10, skill tree, heirlooms every run) but each
  tree has only its two free nodes. There is nothing to spend points on yet.
- Animation pipeline is parked (code kept, manifest `{}`); stills breathe and fade in.

## 2. Objectives (user's words, 2026-10-25) and the current gap

1. **RNG should matter.** A bad card combo should hurt; some runs should end early.
   Gap: overflow discards for free, basics always present, no enemy counters a family,
   shrines heal to full. Runs almost never die on screen 1.
2. **Fights fun and fast.** Deck quality plus knowledge of enemies should beat RNG over time.
   Gap: enemy intents are rolled, so knowledge gives no edge. Nothing to study.
3. **Power growth real.** Beating screen 1 should take 5–10 deaths, same per screen.
   Gap: trees are empty; the growth curve is untestable until they are filled.
4. **Overworld feels amateur.** Too zoomed out (17×8 tiles visible), moves too fast
   (110 ms/step, linear), whole map visible so it reads as scattered.
5. **Something crazy.** Ghosts of your previous deaths (see §4).

## 3. Proposal: hand-authored maps, random contents (DECIDE TOMORROW)

User's thought: ghosts "at the same tile" only make sense if maps are static, and
authored maps may also fix the overworld feel. My view: yes, and it is the right call
even without ghosts.

Why authored layouts win here:
- The game's replay value is the deck, the roster and the progression, not map
  exploration. Two to five small screens do not need procedural variety.
- Flow can be designed: solo boar first, first duo at the fork, shrine just before the
  boss, the chest behind the detour wall. The generator cannot teach.
- Landmarks make story possible ("the broken bridge", "Andre's gate") and make deaths
  memorable. Ghosts, signposts and quest givers all want fixed places.
- Objective 2 again: knowing *where* the harpies wait is player knowledge beating RNG.
- Hades, Dark Souls and Slay the Spire all pair a fixed structure with random content.

What stays random per run (so runs still differ):
- Which enemy species stands at each fight node (drawn from the screen's roster, with
  the duo roll), guard identities, loot, shop lines, quest, heirloom offers, chest gold.
- Optionally: which of the POI slots is the shrine vs the chest this run.

Implementation sketch (small):
- Author each screen as an ASCII grid in `src/data/maps/screen1.txt` (one char per
  tile: `.` grass `#` forest `r` road `~` water `^` rock, plus letters for entry,
  boss, fight nodes, POI slots, quest giver, NPC, guards). Easy for the user to edit.
- A `parseMap()` replaces `generateMap()` in `startScreen`; keep `validate()`
  (reachability of boss, POIs, guards, giver, NPC) and the prop placer from
  `tiles.ts`. Keep the generator as a drafting tool: generate, dump to ASCII, hand-edit.
- Screen 1 should be smaller than 48×24. Try 32×18 with the same POI count.
- Later: 2–3 authored variants per screen if sameness ever becomes a complaint.

## 4. Ghost design (the "crazy" idea, agreed as interesting)

- On death, record `{screen, tile, deck, stats, equipment, killer}` in meta (telemetry
  already has most of it per fight).
- Next run on that screen, a Ghost stands at the death tile. If the death was at a
  fight node, the Ghost joins that encounter as the duo partner of the species that
  killed you (existing `PendingEncounter.extra`); otherwise it is its own encounter.
- The Ghost is a player combatant driven by a simple policy (reuse the sim policy),
  so it plays your old cards against you. Beat it: recover that run's gold and one
  heirloom tome. Lose: the Ghost keeps the loot and gains +2 max HP, up to a cap.
- Keep one Ghost per screen per class (latest death). Test Mode gets a "spawn ghost".
- Cheaper cousin: Knight Andre remembers your most-played card from the last attempt
  and opens with a counter intent for it.

## 5. Other recommendations from the review (in suggested order)

1. **Fixed enemy rotations + studied reveal.** Each enemy follows a scripted intent
   rotation. After 3 kills of a species the panel shows the next two moves. Add a
   fast-forward toggle for studied enemies. Biggest lever for objective 2.
2. **Overworld feel.** Camera zoom ~1.6×, step 110 → ~220 ms with a two-frame bob and
   a shadow blob, fog of war (reveal radius ~4), camera leads the move direction,
   fades on screen change. Partly superseded by §3 if maps become authored.
3. **Fill the trees** (10 nodes per class): family nodes (cost 2–5) plus passive nodes
   (+2 starting max HP per rank, draw 4 on round 1, heirloom offer 5 keep 2, start
   with a free shop heal). Target: first Knight Andre kill around level 4–5.
4. **Make RNG bite.** Enemy affinities (Shell Beetle halves attacks until Exposed,
   Hex Imp immune to magic debuffs, Rat Pack doubles vs Guard), overflow exhausts
   instead of discarding, shrines heal 50%.
5. **Tuning tools.** Sim "studied" policy that plays rotations; death-cause histogram
   by level from telemetry (killer per fight is already recorded).
6. **Boss relics.** More entries in boss loot tables (the intended lever if capped
   gear makes bosses walls). Watch run logs: geared tank beat Andre 13% in the greedy
   sim after caps, Warden 5%.

## 6. Backlog that was already queued

- Screen-2 enemy stills (Ogre, Iron Knight, Witch, Harpies) and Warden boss.
- Backdrops for grass/road, swamp, arena (only `bg_forest.jpg` exists).
- Sweep/taunt cards for duos. Legacy fold-in. Animation pipeline (parked).

## 7. Working loop and conventions (so a new session starts fast)

- `npm run check` (typecheck + vitest, 140 tests), `npm run sim -- --runs 200 [--tier 2]
  [--duel enemy]`, `npm run build`, headless check with Playwright at 844×390.
- Deploy: commit (message file + attribution lines) and `git push -u origin <branch>`,
  then poll gh-pages for "Deploy re-rpg <sha>" by hash.
- Do not `pkill` the vite preview in the same shell as a commit chain (exit 144); use
  nohup and separate calls.
- Art: `scripts/cut-sprite.py <src> <out_dir> <name> <height>` for stills,
  `scripts/pack-tiles.py` for the CraftPix tilesets (sources in gitignored
  `art-src/packs/`). Style sheet and prompts in `docs/ART.md`.
- Decisions go in `docs/DECISIONS.md` (next number is 34). Balance in `docs/BALANCE.md`.
- Key files: `src/core/combat/engine.ts` (multi-enemy step), `src/data/enemies.ts`,
  `src/data/packs.ts` (duo pairs), `src/data/items.ts` (caps), `src/data/progression.ts`
  (trees), `src/core/meta/index.ts` (meta v4, heirloom rolls), `src/game/session.ts`,
  `src/core/map/generate.ts` (LAYOUT rules), `src/game/scenes/OverworldScene.ts`
  (TILE 48, step 110 ms), `src/game/scenes/CombatScene.ts`, `src/game/ui/Card.ts`.
- User preferences: landscape phone first; "faster not easier"; trash 3–4 rounds,
  bosses 10+ rounds; no card-level depth ("too complicated"); nothing shared between
  classes; Test Mode runs are excluded from telemetry.

## 8. Questions to settle tomorrow

1. Authored maps: yes/no, and screen-1 size (32×18 proposed).
2. Which POI contents stay random per run (shrine/chest slot shuffle or fixed)?
3. Ghost loot rule (gold + one tome?) and whether a Ghost can appear on screen 2.
4. Fixed enemy rotations: fully scripted, or scripted with one random slot?
5. Tree contents per class: which 3–4 new families, which passives.

## 9. Blend: the Spire graph as the road network (added 2026-10-26)

User's point: mobile roguelikes (Slay the Spire style, see screenshot in the session)
use a branching node graph with legible risk/reward. Easy for us to switch to, but it
loses the RPG explore factor. The user wants a blend.

Proposed blend, "routes are roads":
- Each screen is an authored tile map whose roads form a Spire-style DAG: ~3 lanes of
  clearings converging on the boss gate. Each clearing holds one node: fight, elite
  (guaranteed duo, better loot), ? event, shrine, shop, chest.
- Signposts at forks show the next 1–2 node icons per branch, so lane risk is readable.
- A parchment map button draws the discovered graph in the Spire style over fog of
  war. Undiscovered side content never appears on it.
- Exploration lives off the graph: dead-end side paths, chests behind detour walls,
  quest giver and NPC in side clearings, ghosts, signpost lore.
- Daylight budget per screen (sun dial in HUD). Each step spends it. After dusk,
  remaining fight nodes roll duos at a higher rate and the shrine fades. Backtracking
  stays allowed; wandering is paid for in a visible currency. This keeps objective 1
  (runs can end early) while allowing exploration.
- No random road encounters: fights only at nodes, so routes can be planned.
- Tap a node to auto-walk the road with the camera zoomed in; short legs between
  clearings fix the "too fast / too empty" feel.

Build order if accepted: (1) ASCII map format with lanes + node letters, (2) node
contents rolled per run from the roster, (3) daylight counter + HUD dial + dusk rules,
(4) signposts, (5) parchment overlay scene (largest piece), (6) ghosts at nodes.

Open questions: daylight budget size (steps), what dusk does to the boss (nothing,
or +1 ATK), whether shops/shrines are fixed slots or shuffled per run, and whether an
elite lane should be visible from the screen entry or only after the first fork.

## 10. Identity check: not a Spire clone (added 2026-10-26)

User concern: the routes-as-roads blend (§9) drifts toward recreating Slay the Spire;
a strong, funny, well-written story may be the real differentiator.

Agreed position:
- The combat verb is cards, so the comparison is unavoidable. The identity is "an RPG
  wearing cards": stats, gear, hand of 3 and one draw per round, levels and trees that
  persist across deaths, a world you walk. Design test: "would a 90s JRPG do this?"
- Closest relative is Hades, not Spire: growth across deaths, story told through dying.
- Drop from §9: the parchment DAG overlay and the lane icon vocabulary (the one image
  everyone recognises). Keep: authored lanes drawn as roads, fog, side clearings,
  daylight budget, no random road encounters, tap-to-walk between clearings.
- Replace icons with written signposts in the game's voice. They carry risk/reward
  legibility and the comedy at the same time.
- Death is the narrative engine ("Re-"): dialogue keyed to meta counters we already
  track (deaths per screen, killer species, class level). Quest giver, NPC, Knight
  Andre and the child necromancer each have an escalating script across deaths. The
  Ghost speaks (telemetry gives it material).
- Story work needs a small dialogue system: lines keyed by speaker + condition
  (deaths >= n, killedBy, level, bossDefeated), authored in a data file, shown as a
  speech box on the overworld. Cheap to build; the writing is the real work.

Tomorrow's first decision: confirm this direction, then start with the ASCII map
format and the dialogue data format so writing can begin in parallel with code.

## 11. Dialogue with options at every encounter; choices change the run (added 2026-10-26)

User direction (confirmed): every encounter opens with a short dialogue that has
options, skippable once the player has passed that screen. Choices plus RNG can
change what the run contains, up to rotating bosses. Reference: Hades. Example given:
the friendly quest giver becomes the screen-1 boss, swinging your own iron mace at
you, because you killed her pet rats.

Design that keeps it buildable:
- **Dialogue data**, not code: `src/data/dialogue.ts` entries
  `{ id, speaker, when: Condition[], lines: string[], options: Option[] }`, where
  `Option = { text, effects: Effect[], next?: id }`. Conditions read run flags, meta
  counters (deaths on this screen, killedBy, class level, relations) and RNG rolls.
  Effects: set a run flag, change a relation counter (persistent, per character),
  gold/HP/card/item deltas, start the fight, skip the fight, mark a boss variant.
- **One speech box scene** overlaid on the overworld (and before combat): portrait,
  lines, 2–3 option buttons. Tap-through. Same scene serves NPCs, signposts, ghosts.
- **Skippable**: once the player's class has beaten the screen (or seen that node
  once), the box collapses to one line with a "…" tap and a Skip button; default
  option is applied on skip. Never skippable the first time.
- **Relations** live in meta per character (quest giver, imp, child necromancer,
  Knight Andre, the Ghost): a small integer each. They are the memory that makes
  the world react across deaths.
- **Boss variants**: the gate resolves the boss at arrival from flags, e.g.
  `bossFor(session)`: default Knight Andre; `killed_rats && relation.giver <= -2`
  → the quest giver, built from a template plus the player's equipped weapon (her
  attack is named after it and uses its ATK). Variants are EnemyDefs produced by a
  factory, so the combat engine does not change. Each variant needs one still.
- **RNG portions**: which character occupies a "?" clearing, what the imp's book
  turns out to be, which of two favours the giver asks for. Rolled from the run seed.
- **Scope guard**: 4–5 characters, 2–3 options per box, 2 boss variants per screen
  to start. Options affect flags, not new mechanics. The writing is the real work;
  the system is small. Keep Test Mode able to set flags/relations to jump to any state.

Build order: speech box scene + dialogue data format → first encounter scripts
(imp's book, giver's rats) → relations in meta v5 → `bossFor` with the giver variant
and her still → skip rules → ghost lines from telemetry.

## 12. Status after the build session (2026-10-26)

Shipped on the branch, live on Pages (DECISIONS #34–#36):
- Authored three-lane maps for both screens, nodes (single/elite), guards, signposts, 72 px
  tiles, hero and enemy stills on the map, fog of war, daylight budget with dusk rules. The
  generator is behind the title's map toggle and on branch `overworld-procedural`.
- Dialogue with options at every encounter (speech box, data-driven, conditions and effects),
  relations and deaths-per-screen in meta v5, skippable once the screen is beaten. Wren the
  rat-keeper is screen 1's giver. Writing for all 11 enemies, both gates, 8 signposts, Wren,
  the ghost.
- Wren replaces Andre at the gate at relation ≤ −2 and swings your weapon. Your ghost waits
  where you died and joins that fight; beating it returns gold and a card.

Still open, in suggested order:
1. Wren still (prompt in docs/ART.md). Screen-2 stills (Ogre, Iron Knight, Witch, Harpies,
   Warden) now matter more because they stand on the map.
2. Fixed rotations already exist for most enemies; the "studied" reveal (next two moves after
   3 kills) and a fast-forward toggle are not built.
3. Fill the skill trees (nothing to spend points on).
4. Tune daylight (75 steps on screen 1 for a ~30-step direct walk) and dusk duo rate from run logs.
5. Enemy affinities, overflow-exhausts, shrine 50%: not built; decide after a few logs.
6. More dialogue consequences: the escort NPC, the shop keeper, Andre's running gag past 5 deaths,
   Gerald as a possible ally. A per-character "memory" line on the title screen.

## 13. Node overworld (2026-10-26, later)

Daylight and fog are gone; the map is a static node network over the authored terrain with per-run
contents (DECISIONS #37). The back-and-forth quest scenario works end to end (Wren → fight →
Wren → tinker → re-armed fight → tinker). Next for this layer:
1. A quest system that uses nodes properly: "go to node X", "escort from n back to start", hunts
   that re-arm specific nodes; replace the hunt/fetch/escort generator's tile logic with node ids.
2. A second screen-1 story NPC and a screen-2 arc (the Warden's marsh has only Wren's rats as a
   thread so far).
3. Marker polish: an "entered" tick on cleared calm nodes, a route preview line when a node is
   tapped, the ghost marker offset.
4. Bag tuning from play: 13 open slots, 1 shop, 1 shrine, 3 treasures, 8 monsters (3 unknown).

## 14. Painted map shipped (2026-10-26)

Screen 1 has its painting; the roads were traced to it (north loop row 2, west side column 10).
Open: the screen-2 painting from `art-src/layout-screen2.png`; a little life on the painting (lake
shimmer, drifting cloud shadows, fireflies at clearings); painted node icons to replace the prop
sprites; the Wren still.
