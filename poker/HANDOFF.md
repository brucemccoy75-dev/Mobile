# Handoff: Poker Night at Dave's

Read this first in a new session. It says what exists, how to work on it, and what is left.

## Where things are

- Branch: `claude/magical-wozniak-04xz9z` in `brucemccoy75-dev/Mobile`. All work lives in `poker/`.
  Other projects live on other branches; never touch them.
- Live build: https://brucemccoy75-dev.github.io/Mobile/poker/ . Every push that touches `poker/`
  runs `.github/workflows/poker.yml`, which tests, builds and publishes `dist/` into the `poker/`
  folder of the `gh-pages` branch. The player must reload to get a new build.
- Design: `poker/DESIGN.md` (approved). Portrait spec and prompts: `poker/docs/portraits.md`.

## Commands (run inside `poker/`)

```sh
npm install
npm test                 # 58 tests: engine, bots, controller, banter, career, conversations
npm run build            # typecheck + production build
npm run sim -- --n 100   # bot-only tournaments, prints finishes and tendencies per type
python3 tools/key-portrait.py in.jpg public/portraits/<id>.png   # green-screen to transparent PNG
```

Verify visually with Playwright in headless Chromium (pre-installed): serve `dist/` with
`npx vite preview --port 4173`, drive the page at viewport 844x390 with `isMobile`, click
`button.primary` then `.tcard[data-key=...]`, act through `#actions .passive` / `.fold`, screenshot.
`window.__scene` exposes the scene (`director`, `showInset(seat, ms, name, caption)`, `hideInset()`).

## Architecture in one paragraph

`src/engine` is the pure poker (cards, 7-card evaluator, hand state machine with side pots,
tournament loop). `src/bots` is the AI: equity, four policies (nit, tourist, calculator, pro), stats
IQ/Read/Clarity, opponent profiles, the roster in `characters.ts`. `src/game/table.ts` runs a
tournament with the human in seat 0 and emits events to a presenter; `banter.ts` picks lines and runs
two-man conversations; `career.ts` is the save file and trophies. `src/scene` is Three.js: table,
figures (`figures.ts`: drawn placeholder, or a portrait standee when `public/portraits/<id>.png`
exists), cards, chips, camera `director.ts`, synthesized `audio.ts`. `src/ui` is HTML overlay:
plates, board, action bar, panels, screens. `src/main.ts` wires it all. `src/content/lines.ts` holds
every character's lines; `src/content/conversations.ts` the two-man exchanges.

## Characters: internal id, display name, type, portrait status

The ids never change (saves, memories and file names depend on them). Only names changed.

| id | name | type | AI stance | portrait |
|---|---|---|---|---|
| harold | David Sr (~70, thin, bald, white shirt; David's father) | nit | anti | **done** |
| dolores | Paul (40s, average build with slightly big arms, dark hair, tank top, tribal armbands) | nit | meh | prompt ready |
| marvin | Kevin | nit | anti | needed |
| chad | Bawb (late 40s, short, fit, buzzed stubble, white tee) | tourist | pro | **done** |
| trish | Tim | tourist | meh | needed |
| benny | Luca | tourist | pro | needed |
| wen | Jonathan | calculator | pro | needed |
| priya | Will | calculator | meh | needed |
| ulrich | Menafee | calculator | anti | needed |
| sal | Jack (16, big, blond, backwards cap, glasses) | pro | anti | **done** |
| nadia | David (early 50s, thin, thinning hair, light blue button-up) | pro | pro | **done** |
| jimmy | Bruce (late 40s, thin, grey beard, black tee, sly) | pro | meh | **done** |
| dealer | Skynet (Dave's android dealer, white panels, black visor, bow tie) | — | — | **done** |

Tables: Kids Table = nits + tourists; Adult Table = all; Real Poker = calculators + pros.

## Portrait pipeline (per character)

1. Owner sends a physical description. Write the prompt: the style block from `docs/portraits.md`
   plus the description, ending with the flat `#00b140` green background line and "clothing is not
   green". Update that character's entry in `docs/portraits.md`.
2. Owner generates and uploads the image (JPEG is fine).
3. `python3 tools/key-portrait.py <upload> public/portraits/<id>.png`, commit, push. The engine picks
   it up with no code change. Check it in the speaker panel with `showInset`.
4. Later, expression variants `<id>_happy.png` etc. are in the spec but the engine does not load them
   yet; add that in `figures.ts` when the first set exists (swap the standee's texture on
   `setExpression`).

## Lines rewrite (per persona)

Each character has about 46 lines in `src/content/lines.ts`, tagged by trigger (see
`src/content/triggers.ts`) and mood, with a few `tilted` variants. The tests require every trigger
covered for every character and at least 100 lines per type. To rewrite a persona:

1. Owner sends two or three sentences: who the real person is, how he talks, one running joke, any
   catchphrase. Keep the poker personality type as is unless told otherwise.
2. Rewrite all of that character's lines in that voice. Keep `{target}` and `{hand}` placeholders,
   keep the trigger coverage, keep it funny first, raw tone allowed, no slurs.
3. Update the bio in `characters.ts`. Run `npm test`. Push.
4. Jack is first: he is sixteen now and the lines still sound like a sixty-year-old grinder.

The dealer is a robot named Skynet; its lines in `lines.ts` under `dealer` still read as a human dealer and want a robot voice.

Conversations in `conversations.ts` are character-neutral and need no rewrite, but new exchanges
about the real crew's running jokes fit there.

## Conventions

- Commit messages: a short title, a body saying why, then the attribution lines the session is given.
- Never force-push. Never commit to other branches. CI must stay green.
- Large multi-file edits worked best as a Python patch script run with `python3 -I script.py`,
  asserting each old string exists and replacing exactly once.

## Open items, in order

1. Portraits for the eight remaining characters (above).
2. Lines rewrite per persona, Jack first.
3. Expression variants and the texture swap in `figures.ts`.
4. Tuning from real play: nits may feel too passive; tourists' aggression; banter density.
5. Later from the design: text-to-speech, cash games.
6. The re-rpg and map3d workflows on their own branches force-publish the whole Pages site and would
   wipe `gh-pages/poker/`; rerunning our workflow restores it. Fix those workflows if it bites.
