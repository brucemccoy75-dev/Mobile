# Poker, I Hardly Knew Her

A web-based, phone-friendly 3D poker game. Vite + TypeScript + Three.js.

## Develop

```sh
cd poker
npm install
npm run dev        # http://localhost:5173, also reachable from a phone on the same network
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ locally
```

## Hosting

Pushes to this branch that touch `poker/` run `.github/workflows/poker.yml`, which builds
`dist/` and publishes it to the `poker/` folder of the `gh-pages` branch. GitHub Pages serves it at

https://brucemccoy75-dev.github.io/Mobile/poker/

The workflow only writes inside `gh-pages/poker/`, so it never touches the other projects
published from this repository.
