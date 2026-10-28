# Next session notes

## Start here (updated 2026-10-27)

**State.** Branch `claude/re-rpg-mobile-architecture-t26won`, folder `re-rpg/`, live on GitHub
Pages at https://brucemccoy75-dev.github.io/Mobile/ (deploys ~70 s after a push; poll
`origin/gh-pages` for "Deploy re-rpg <sha>"). 234 tests pass (`npm run check`). The game today is:

- **Node overworld** (DECISIONS #37): a static node network per screen over an authored
  terrain, contents rolled per run, tap a reachable node to travel, swipe to pan. Screen 1 has a
  painted backdrop (`public/art/c/map1.jpg`, DECISIONS #39); screen 2 still uses the tileset.
  Dark plates under markers. Dev overlay with `?dev` in the URL.
- **Dialogue with options** at every node (DECISIONS #35), relations and deaths per screen in
  meta v5, Wren the rat-keeper at the start node, Tam the tinker's re-arm quest, Andre's
  escalating gate lines, Wren replacing Andre at relation ≤ −2, your ghost (DECISIONS #36) is
  switched off (`GHOST_ENABLED`, #54) and kept for a special encounter later.
- **Combat**: every round starts with a hand of 3 (#53), duos, target arrow, sweeps hit every enemy at once (#47), remove guard / remove buffs modifiers run before the hit (#48), fixed enemy rotations, flat gear attack (#31), equipment caps
  (#33), Bind Wound 25% once per fight, shop heal 35%, shrine half (#38, #39). Luck (#50): every class has 5; luck × 0.2% per card is a critical hit (+50%) and a bonus turn (once per round), 1% each at base (#52); luck × 1.2 adds to the rare odds of rewards, the shop and level-ups.
- **Progression**: EXP levels 1–10 per class; each level is +1 max HP for good and a 25% rare card from the run's families, else 15 gold (#49); the warrior tree (#46) is Bulwark and Berserker (2
  points each), then Paladin and Shadow Knight (2 each, behind them), then Weaponmaster (1, behind
  both); Shadow Knight holds Minor leech, Leech and Death Touch (whose Backfire, #51, costs all
  your HP if the target survives); Paladin and Weaponmaster are empty until filled in the editor; wizard and shaman nodes are
  still free; heirlooms every run that has a family. Nothing drops
  without a node, the general tomes included (#42); basics are per class (warrior has no Ward);
  all four special tomes are fleeting; duos 30% on screen 1; selling pays 25%.

**Working loop.** Edit → `npm run check` (typecheck, cards:validate, tests, build) → `nohup npx
vite preview --port 4174 --strictPort &` (start it in its own command; `pkill` in a chained
command kills the chain) → Playwright at 844×390 with `window.__rerpg` (write a throwaway script
per check; Test Mode is driven by setting registry `testSetup` and calling `TestMode.fight()`,
then `Combat.act()` and polling `busy`) → commit with the attribution lines → `git push -u origin
<branch>` → poll gh-pages. Record decisions in `docs/DECISIONS.md` (next number is 59).

**Cards.** Every card is a record in `src/data/cards.json`; the game compiles it at load. The
designer edits cards in the in-game card editor (title screen → card editor, `editor.html`) and
sends back an exported `cards.json`; the import is the fixed procedure in `docs/CARDS.md`
(validate, check, pinned numbers, sim, commit). Never hand-edit card numbers in TypeScript. A new
mechanic (status, trigger, target shape) is an engine change with tests first, then a schema and
editor field, then cards.

**Scope.** Only the warrior is being balanced. Wizard and shaman cards, families and trees are
frozen by the validator and out of scope until the warrior is done.

**Watch in the next fresh run.** Both warrior families cost 2 points (#43), so the first family
lands at level 3, about seven kills in. Does a no-family warrior die before the boss, does a
one-family warrior reach it, and does holding a fleeting Mighty Blow for the boss feel like a
choice? If singles still cost nothing after a node, the next lever is gear max HP no longer
healing (proposed in the #42 review, declined for now). The last two fresh runs reached Wren and
died there (run log in docs/audit is from before #42; export a new one).

**World and quests (in progress, DECISIONS #55).** `src/data/world.json` holds the dialogue, each enemy's everyday lines (`defaults`) and per-node rules; `docs/WORLD.md` is the model and the import procedure. Phases: (1) the file, defaults and node rules: done; (2) the world editor page (`world.html`, title screen → world editor; Nodes, Quests, Words, Enemies), mobile first: done; (3) quests as data (`quests` in world.json: giver node, type, targets, lines, rewards, conditions, chains), Wren and screen 2's givers moved into it: done; (4) special runs (20%, a special quest pins its own nodes): done, but no special quest exists yet: the first one is the designer's to write. Screen 1 first. Default lines: 10–20 per enemy, written with the designer later.

**Quests (the other open track).** First cut is GAME_DESIGN §7b and DECISIONS #19: one giver per
screen, fetch / hunt / escort rolled from the run seed. Code: `src/core/quest/index.ts`
(`generateQuest`, `questReady`, kinds and rewards, tests in `quest.test.ts`), `src/data/quests.ts`
(giver voices and lines, Wren's voice for screen 1), `src/game/scenes/QuestScene.ts` (the
hand-in screen), and the overworld's giver and NPC spots (`questGiver`, `npcSpot` on the map,
`currentQuest` / `turnInQuest` in `src/game/session.ts`). Dialogue with options at nodes is
DECISIONS #35 (`src/core/dialogue`, `src/data/dialogue.ts`). The queued design item is a quest
generator that speaks node ids (targets that place themselves on the node map, multi-step
chains, lore on completion). Any quest change: tests in `quest.test.ts` first, then the scene,
then a Playwright check on the overworld.

**Next, in order:** (1) card balance through editor imports (docs/CARDS.md; fill Paladin and
Weaponmaster; give the sim a Shadow Knight loadout; watch the fresh-run questions above); (2) the quest system; then the
older queue: screen-2 painting (prompt in docs/ART.md, layout in `art-src/layout-screen2.png`),
life on the painting, painted node icons, Wren's still.
