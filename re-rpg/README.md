# Re-RPG

A roguelike RPG for phones, played in landscape. Pick a class, explore a randomised map, fight turn-based side-view battles with a dealt hand of skills, loot binding gear and tomes, die, and come back stronger.

Design docs live in [`docs/`](docs/): start with [`DECISIONS.md`](docs/DECISIONS.md), then [`GAME_DESIGN.md`](docs/GAME_DESIGN.md), [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) and [`POC_PLAN.md`](docs/POC_PLAN.md).

## Stack

Phaser 4 · TypeScript · Vite 8 · Vitest · Firebase (Hosting, Auth, Firestore; optional, see `docs/FIREBASE_SETUP.md`)

## Play

Latest build of the working branch: **https://brucemccoy75-dev.github.io/Mobile/** (open on a phone, rotate to landscape, add to home screen for fullscreen).

## Develop

```sh
npm install
npm run dev          # http://localhost:5173, also on your LAN IP for phone testing
npm test             # unit tests for src/core (pure logic, no Phaser)
npm run typecheck
npm run build        # -> dist/
npm run preview      # serve dist/ for a production check
```

Phone testing: run `npm run dev`, open the LAN URL it prints on your phone, rotate to landscape. Add to home screen for fullscreen.

Smoke test against a build (needs Playwright available):

```sh
npm run build && (npm run preview -- --port 4173 &) && node scripts/smoke.cjs
```

## Layout

```
src/core/   pure game logic: rng, combat, map, loot, run, meta, sim   (unit tested)
src/data/   content as data: classes, sets, skills, items, enemies
src/game/   Phaser scenes, UI, input, rendering
src/save/   SaveStore interface, local + Firebase adapters
```

## Deploy

GitHub Actions (`.github/workflows/re-rpg.yml`) runs typecheck, tests and build on every push, publishes `dist/` to the `gh-pages` branch (served at the link above), and deploys to Firebase Hosting on pushes to `main` once the `FIREBASE_SERVICE_ACCOUNT` secret and `FIREBASE_PROJECT_ID` variable are set (see `docs/FIREBASE_SETUP.md`).
