# Handoff prompt for the next session

Paste this into a new Claude Code session on the Mobile repository.

---

You are continuing work on Re-RPG, a phone-first roguelike in the `re-rpg` folder of this repo, on
branch `claude/re-rpg-mobile-architecture-t26won` (check it out from origin if the checkout is on
another branch; run `npm ci` in `re-rpg` if `node_modules` is missing).

Read, in this order, before doing anything:
1. `re-rpg/docs/NEXT.md`: state, working loop, scope and the ordered backlog. Start here.
2. `re-rpg/docs/WORLD.md`: the world file (dialogue, everyday lines, on-kill hooks, node rules,
   quests, special runs), the story vocabulary (conditions and effects), the world editor and the
   import procedure.
3. `re-rpg/docs/CARDS.md`: the card model, the card editor and the import procedure.
4. `re-rpg/docs/PLAYTESTS.md`: what to do with every run log I send (save it, `npm run playtest`
   against the screen-1 mirror, both sim tables, a "Phone test N" write-up in BALANCE.md). The
   latest reading is the top section of `re-rpg/docs/BALANCE.md`.
5. `re-rpg/docs/DECISIONS.md` entries #55 to #72 (the world and quest editor, battle effects,
   ambience, the story-in-data review, blocks, the run-log procedure, one card per enemy,
   branching cards with Regen and Blackjack, three cards before every card, and the story switched
   off).
   The whole file is the history of why things are the way they are; look up any older number
   you meet.

Ground rules:
- I design on my phone. Cards are edited in the card editor and story in the world editor; I send
  an exported `cards.json` or `world.json` and you import it with the exact procedure in CARDS.md
  or WORLD.md, stopping on any validator problem. Never hand-edit card numbers or story in
  TypeScript. A new mechanic or story capability is an engine change with tests first, then a
  schema field, an editor control and a validator rule.
- When I send a run log, follow `docs/PLAYTESTS.md` every time. Run the simulator, and compare
  how often it reaches and beats the boss with how often I did. Write the result as the next
  "Phone test" in BALANCE.md. Recommend changes; make them only when I say so.
- Only the warrior is being balanced; wizard and shaman data are frozen by the validator.
- Every change: `npm run check` green, commit with the attribution lines the session gives you,
  `git push -u origin claude/re-rpg-mobile-architecture-t26won`, then poll `origin/gh-pages` until
  its latest commit message contains your hash.
- Record any design decision as the next numbered entry in DECISIONS.md and keep NEXT.md's "Start
  here" true when you finish a task. NEXT.md is the current state only, no history.
- Verify UI in a real browser: build, start `npx vite preview --port 4174 --strictPort` in its own
  command, drive the game with Playwright at 844x390 (editors at 390x844) via `window.__rerpg`, and
  look at screenshots of what you changed. Keep the editors clean and phone friendly.
- Report what was actually wrong and what you verified, not just what you changed. If a step
  fails, say so with the output.

First task: confirm the branch, run `npm run check`, and tell me the test count and the latest
commit hash. Then wait: the focus is balance, with the story switched off (DECISIONS #72). I
will send run logs (follow PLAYTESTS.md) and card exports (follow CARDS.md).
