# Poker Night at Dave's

A web-based, phone-friendly 3D poker game. Vite + TypeScript + Three.js.

## What is here

- `src/engine` — the poker: cards, 7-card evaluator, a No-Limit Hold'em hand with side pots, the sit-and-go loop. Pure TypeScript, fully tested.
- `src/bots` — equity, the four personalities (nit, tourist, calculator, pro), IQ / Read / Clarity stats, opponent profiles, the roster.
- `src/sim` — `npm run sim` plays bot-only tournaments and reports finishes and tendencies per type.
- `src/game` — the table controller (human seat, think times, pause, history), the banter engine, career (record, rivalries, trophies).
- `src/content` — every character's lines, two-man conversations, teases and openers.
- `src/scene` — the Three.js table, figures, cards, chips, the speaker panel, the dealer's laser, audio.
- `src/ui` — overlay labels, action bar, screens and panels.

## Develop

```sh
cd poker
npm install
npm run dev        # http://localhost:5173, also reachable from a phone on the same network
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ locally
npm test           # unit tests (engine, bots, controller, banter, thinking, career)
npm run sim -- --n 100   # bot-only nights for tuning
```

## Hosting

Pushes to this branch that touch `poker/` run `.github/workflows/poker.yml`, which builds
`dist/` and publishes it to the `poker/` folder of the `gh-pages` branch. GitHub Pages serves it at

https://brucemccoy75-dev.github.io/Mobile/poker/

The workflow only writes inside `gh-pages/poker/`, so it never touches the other projects
published from this repository.
