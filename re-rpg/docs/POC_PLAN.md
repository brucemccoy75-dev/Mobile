# Re-RPG — POC Plan

Goal: a playable, tunable 2-screen loop on a phone via URL. Placeholder art is fine; the loop and the numbers are the product.

## Milestones

| # | Milestone | Done when | Est. |
|---|---|---|---|
| 0 | **Scaffold** ✅ | Vite + TS + Phaser 4 + Vitest; landscape canvas (fixed 540 logical height, width follows aspect) with rotate overlay; CI workflow with Firebase Hosting deploy; Playwright smoke test; seeded RNG with streams | done |
| 1 | **Combat core (headless)** ✅ | `core/combat` resolves a full fight from data; deck/hand dealing, statuses, two-step intents, boss phases; 39 Vitest cases; `npm run sim` runs gauntlets per class/loadout and duels; baseline in `docs/BALANCE.md` | done |
| 2 | **Combat scene** ✅ | Side view with placeholder shapes, HP bars, status chips, intent + posture tell, dealt hand of cards plus Attack/Defend, event-log animation playback, class select, mini-gauntlet (4 fights then Gatekeeper, HP carried) with a dev toggle to start with the rolled set's tomes | done |
| 3 | **Map gen + overworld** ✅ | Seeded 48×24 screen generator (road with bends, biome by distance from road, rock/water blobs, east arena, 4 POIs placed by danger-weighted path cost, a guard on each approach tile, connectivity validation); A* with per-tile cost; threat meter; tap-to-move with path preview and mid-walk retarget; chests (gold placeholder), shrine heal, guards, boss, screen 2 and victory; 14 map tests | done |
| 4 | **Loot + meta** ✅ | 22 items across three slots (stat modifiers, class limits, set tags); loot pool from rolled set + discoveries minus held; rarity by source and screen; pick-1-of-2 on kills, 1-of-3 at chests and bosses; compare panel for binding gear swaps; deck-cap swap for tomes; discovery, death/win recording, heirloom; RunEnd screen; localStorage `SaveStore` with Continue on the title; 24 new tests | done |
| 4b | **Cloud save** ✅ (code) | `SyncedSaveStore` (local-first, one merge pull per session, debounced push, offline-safe) over a lazily loaded Firebase adapter (anonymous auth, Firestore `players/{uid}`, Link Google with account-collision fallback); Firestore rules; CI embeds the web config from secrets; `docs/FIREBASE_SETUP.md`. Needs a Firebase project to go live. | done |
| 5 | **Shop + tuning** ✅ | Shop with per-screen stock (2 items, a tome when the pool has one, a 50% heal), rarity-priced and screen-scaled, binding swaps via shared panels; balance pass on shaman, Cryomancy, Warden and two sim-policy flaws, recorded in `docs/BALANCE.md` | done |
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
