# Re-RPG — POC Plan

Goal: a playable, tunable 2-screen loop on a phone via URL. Placeholder art is fine; the loop and the numbers are the product.

## Milestones

| # | Milestone | Done when | Est. |
|---|---|---|---|
| 0 | **Scaffold** ✅ | Vite + TS + Phaser 4 + Vitest; landscape canvas (fixed 540 logical height, width follows aspect) with rotate overlay; CI workflow with Firebase Hosting deploy; Playwright smoke test; seeded RNG with streams | done |
| 1 | **Combat core (headless)** ✅ | `core/combat` resolves a full fight from data; deck/hand dealing, statuses, two-step intents, boss phases; 39 Vitest cases; `npm run sim` runs gauntlets per class/loadout and duels; baseline in `docs/BALANCE.md` | done |
| 2 | **Combat scene** ✅ | Side view with placeholder shapes, HP bars, status chips, intent + posture tell, dealt hand of cards plus Attack/Defend, event-log animation playback, class select, mini-gauntlet (4 fights then Gatekeeper, HP carried) with a dev toggle to start with the rolled set's tomes | done |
| 3 | **Map gen + overworld** | Seeded screen generator with road, danger tiles, POIs, guards, boss; tap-to-move A*; threat meter; encounters open combat and return | 1.5–2 days |
| 4 | **Loot + meta** | Drop tables, pick-1-of-N reward scene, compare panel for binding swaps, tomes with deck-cap swap, discovery + MetaState save, death screen, heirloom; `SaveStore` local adapter | 1.5 days |
| 4b | **Cloud save** | Firebase project, anonymous auth, Firestore doc per uid, sync adapter + merge rules, "Link Google" button | 0.5–1 day |
| 5 | **Screen 2 + bosses + shop + tuning** | Boss cycles, shop, shrine, screen transition, victory; run the simulator and adjust until fresh runs mostly die before Boss 1 and ~3 unlocks reach it | 1–2 days |
| 6 | **Art pass (optional for POC)** | Swap rectangles for a CC0 16px tileset and sprites; tweens/shake/floating damage numbers | 1 day |

Roughly two focused weeks to a tunable POC.

## Fast-POC tactics

- **Shapes first.** Rectangles and circles with labels until milestone 5. Art never blocks the loop.
- **Content in one file per type.** `data/skills.ts`, `data/items.ts`, `data/enemies.ts`. Add rows, not code.
- **Sim before scene.** Every balance change is validated headless in seconds, then felt on the phone.
- **Debug menu** behind a triple tap: set seed, grant item, jump to boss, show RNG streams.
- **Phone testing loop**: `npm run dev --host` on LAN, or push → Pages URL in ~1 min.

## Stack versions (pin these at scaffold time)

- Phaser 4.2, TypeScript 5.9, Vite 8 (rolldown), Vitest 5. A* is written in-repo (grid is tiny, no dependency).

## Files created at milestone 0

```
package.json  vite.config.ts  tsconfig.json  index.html
src/main.ts
src/game/scenes/Boot.ts
src/core/rng.ts  (+ rng.test.ts)
.github/workflows/deploy.yml
public/manifest.webmanifest
```
