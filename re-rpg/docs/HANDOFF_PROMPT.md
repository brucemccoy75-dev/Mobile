# Handoff prompt for the next session

Paste this into a new Claude Code session on the Mobile repository. The repo copy has no key; the
designer's own copy has the xAI key on the last line.

---

You are continuing work on Re-RPG, a phone-first roguelike in the `re-rpg` folder of this repo, on
branch `claude/re-rpg-mobile-architecture-t26won`. It is live at
https://brucemccoy75-dev.github.io/Mobile/ (designer tools: add `?dev`).

**Next up: a tutorial system for new players.** Read the docs below, warm up, then ask me the open
questions in NEXT.md's backlog item 1 before building anything.

Read, in this order, before doing anything:
1. `re-rpg/docs/NEXT.md`: the current state of the game, the working loop, scope and the ordered
   backlog (item 1 is the tutorial). Start here.
2. `re-rpg/docs/DECISIONS.md` entries #76 to #95, the last session:
   - #76 screen 2's map, and level select;
   - #77 ATK and DEF in battle;
   - #78 cursed traits;
   - #79 the curse skull;
   - #80 and #89 the tundra battle backdrop;
   - #81 surprise fights, the shrine prompt, selling;
   - #82 the Earthen set;
   - #83 and #84 the Treasure Dungeon and its five, and the frost five;
   - #85–#87 parchment cards and press-and-hold;
   - #88 Trickster, Blackjack and Bellow;
   - #90 map 2 at twilight;
   - #91 cutting pale sprites on green;
   - #92 duo intent panels;
   - #93 demo mode;
   - #94 the run-start screens;
   - #95 the title.

   The whole file is the history of why things are the way they are; look up any older number you
   meet.
3. `re-rpg/docs/CARDS.md` and `re-rpg/docs/WORLD.md`: the card and world models, the two editors
   and their import procedures.
4. `re-rpg/docs/PLAYTESTS.md`: what to do with every run log I send. The latest reading is the
   top section of `re-rpg/docs/BALANCE.md`.
5. `re-rpg/docs/ART.md`, "Generating art with the API" and the notes after it: how to make art with
   Grok (maps painted first and traced, pale characters on green, edits that keep framing).

Warm-up, before anything else:
1. Check out the branch from origin if the checkout is on another branch (`git fetch origin
   claude/re-rpg-mobile-architecture-t26won`, then `git checkout -B <branch>
   origin/<branch>`), and run `npm ci` in `re-rpg` if `node_modules` is missing.
2. Save my xAI key (last line of this message) to `re-rpg/.env.local` as `XAI_API_KEY=<key>` with
   mode 600. Git ignores that file; confirm with `git check-ignore -v`. Check that
   `python3 scripts/grok.py models` lists the Grok Imagine models. Never put the key in a commit,
   a doc or the chat: the repo is public.
3. Run `npm run check` (typecheck, both validators, tests, build). It should pass with 355 tests.
4. Start the preview server in its own background command, `npx vite preview --port 4174
   --strictPort` (after `npx vite build`), and load the title once with Playwright at 844×390 to
   see it renders. The server is stopped after 2 hours; start it again when a check needs it.
5. Confirm the live site serves the latest commit: its main JS contains the 7-character hash
   (the title's `build <hash>`).
6. Tell me the test count, the latest commit hash, whether the key works, and whether the live
   build matches. Then ask me the tutorial questions.

Ground rules:
- I design on my phone. Cards are edited in the card editor and story in the world editor; I send
  an exported `cards.json` or `world.json` and you import it with the exact procedure in CARDS.md
  or WORLD.md, stopping on any validator problem. Never hand-edit card numbers or story in
  TypeScript. A new mechanic or story capability is an engine change with tests first, then a
  schema field, an editor control and a validator rule. If I ask you directly for a card change,
  you may edit `cards.json` and say so.
- When I send a run log, follow `docs/PLAYTESTS.md` every time: save it, `npm run playtest`, both
  sim tables, the next "Phone test" in BALANCE.md. Recommend changes; make them only when I say so.
- Art: generate it yourself with `scripts/grok.py`. Show me the options before you ship a new
  look; tell me the cost.
- Only the warrior is being balanced; wizard and shaman data are frozen by the validator.
- Ask clarifying questions before a large feature; for small fixes, just do them.
- Every change: `npm run check` green, commit with the attribution lines the session gives you,
  `git push -u origin claude/re-rpg-mobile-architecture-t26won`, then poll `origin/gh-pages` until
  its latest commit message contains your hash, then poll the live site until its main JS contains
  that hash. Only then say it is live.
- Record any design decision as the next numbered entry in DECISIONS.md (next is #96) and keep
  NEXT.md's "Start here" true when you finish a task. NEXT.md is the current state only, no
  history.
- Verify UI in a real browser: drive the game with Playwright at 844×390 (and a smaller phone,
  667×375, for layout) via `window.__rerpg`, the editors at 390×844, and look at screenshots of
  what you changed. Keep screenshots small (jpg) in `docs/audit/<topic>-<date>/`.
- Report what was actually wrong and what you verified, not just what you changed. If a step
  fails, say so with the output.

xAI key (my copy of this prompt has it on the next line; the repo copy does not):
