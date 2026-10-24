# Re-RPG — Architecture & Framework

Status: planning draft (session 1). Target: mobile phones, landscape, playable in a browser from a URL first, wrapped as a native app later.

## 1. Framework decision

**Decision: Phaser 4 + TypeScript + Vite, shipped as a PWA on Firebase Hosting (this repo's GitHub Pages site stays with map3d). Wrap with Capacitor later for app stores.**

| Option | Verdict | Why |
|---|---|---|
| **Phaser 4 (TS, Vite)** | **Pick** | 2D-native, tilemaps, tweens, touch input, camera, A* plugins. Builds to static files, so the game is playable on any phone by opening a URL, which is the fastest POC loop there is. This repo already deploys to gh-pages. |
| Godot 4 | Good second choice | Excellent 2D and mobile export, but the web export is heavy (~30 MB+, needs SharedArrayBuffer headers that GitHub Pages cannot set) so "share a link" iteration is worse. Worth revisiting if we leave the web. |
| Unity | No for POC | Overkill, slow web builds, licensing noise. |
| PixiJS / raw canvas | No | We would rebuild what Phaser gives us (tilemaps, input, scenes, tweens). |
| React Native / Flutter | No | UI frameworks, not game engines. Turn-based combat UI is fine there but the overworld is not. |

Supporting tools:

- **Vite** for dev server and bundling; **Vitest** for unit tests on game logic.
- **Capacitor** (later) to wrap the built site for iOS/Android with haptics, storage and orientation lock plugins.
- **Tiled** optional for hand-authored tile art checks; procedural maps are generated in code.

## 2. Core principle: logic is a pure library, Phaser only renders it

```
src/
  core/        pure TypeScript, deterministic, no Phaser imports, 100% unit-testable
    rng.ts         seeded PRNG with named streams (map, encounter, loot, combat)
    combat/        turn resolver, deck/hand dealing, status effects, damage formula, enemy AI + intent lookahead
    map/           screen generator, A* + cost field, threat meter, POI/guard placement, validation
    loot/          drop tables, rarity, pool composition from meta state
    run/           RunState machine: class select -> overworld -> combat -> reward -> ... -> death/victory
    meta/          MetaState: discovered skills/items, death count, unlock gates
    sim/           headless runner: play N runs with scripted policies, print win rates
  data/        content as data (TS/JSON): classes, sets, skills, items, enemies, bosses
  game/        Phaser scenes & UI
    scenes/        Boot, Title, ClassSelect, Overworld, Combat, Reward, Shop, Death, Victory
    ui/            skill bar, HP bars, compare panel, toast, intents
    input/         tap-to-move controller, path preview
    render/        tilemap builder, sprite factories, fx
  save/        SaveStore interface: local-first (IndexedDB) + Firebase sync adapter
  main.ts
```

Why this split matters for *this* game:

- The user's stated balance target ("very hard to reach the first boss until a few deaths and unlocks") cannot be tuned by hand-playing on a phone. `core/sim` runs thousands of runs headless with a simple policy and reports "% of fresh runs that reach boss 1", "% with 1 unlock", etc.
- Loot pools, set rolls and map gen all pull from a **seeded RNG with separate streams**, so a run is reproducible from its seed and a loot roll never changes the map. Daily seeds and bug repros come for free.
- Content (skills, items, enemies) is data. Adding the 20th warrior set should be a JSON edit, not code.

Communication: `core` exposes plain functions and an event log (`CombatEvent[]`, `RunEvent[]`). Scenes replay events as animations. No scene mutates core state directly.

## 3. Key data model (sketch)

```ts
type ClassId = 'warrior' | 'wizard' | 'shaman';
type Slot = 'body' | 'weapon' | 'relic';

interface Stats { maxHp: number; atk: number; def: number; }

interface Modifier {                 // the synergy engine: everything is a modifier
  stat?: Partial<Stats>;             // flat stat changes: +5 atk, -20 maxHp
  trigger?: {                        // conditional effects (later: "deal dmg equal to amount healed")
    on: 'onHeal' | 'onHit' | 'onKill' | 'onTurnStart' | 'onDamaged' | 'onStatusApplied';
    effect: Effect;
  };
}

interface Item { id: string; name: string; slot: Slot; rarity: Rarity; classes?: ClassId[]; mods: Modifier[]; }

interface Skill {
  id: string; name: string; classId: ClassId; setId?: string; rarity: Rarity;
  effects: Effect[];                 // damage(mult), heal(amount), applyStatus(target, status, turns), guard...
  selfStatus?: StatusApply;          // e.g. Inferno applies Exposed to self
  endsTurn?: boolean;                // tax for healing skills
}

interface CombatState {              // per encounter
  deck: SkillId[]; hand: SkillId[]; discard: SkillId[];   // hand cap 3, oldest-out when full
  round: number; playerStatuses: Status[]; enemyStatuses: Status[];
  enemyIntent: EnemyMove; enemyNextTell: Posture;
}

interface Status { id: 'exposed'|'guard'|'burn'|'bleed'|'weak'; turns: number; magnitude?: number; }

interface Enemy { id: string; name: string; tier: 1|2|'boss1'|'boss2'; stats: Stats; moves: EnemyMove[] | WeightedMoveTable; drops: DropTableId; }
interface EnemyMove { id: string; intent: Intent; posture: Posture; effects: Effect[]; }

interface RunState {
  seed: string; classId: ClassId; setId: string;
  hp: number; gold: number; equipment: Record<Slot, Item|null>; deck: SkillId[];  // cap 6; Attack/Defend are basics, not in deck
  screenIndex: 0|1; map: ScreenMap; playerPos: Tile; clearedPois: string[];
  statuses: Status[]; log: RunEvent[];
}

interface MetaState {
  version: number; deaths: number; wins: number; bestScreen: number;
  discoveredSkills: string[]; discoveredItems: string[];
  unlockedSets: Record<ClassId, string[]>;
  updatedAt: number;                 // for cloud merge
}
```

## 4. Overworld presentation

**Recommendation: 2D top-down, 3/4 "Zelda / early Final Fantasy" view, 16 px tiles rendered at 3x (48 px on screen). Not true isometric.**

- Isometric costs: diamond grid pathfinding, depth sorting, far fewer free asset packs, and tiles look tiny on a 6" landscape phone. The payoff (depth) is small for a readable roguelike map.
- Top-down 3/4 gives Zelda-like readability, square-grid A*, trivial collision, and lots of CC0 art (Kenney Tiny Town/Dungeon, 0x72 Dungeon Tileset II) for the POC.
- Logical canvas is 540 px tall, width follows the device aspect (960 to 1260). At 48 px tiles that is roughly 20 to 26 × 11 tiles. Each **screen** is a bounded region of about **48 × 24 tiles**; the camera follows the player with a deadzone. Big enough to feel open, small enough to read as one "stage".
- Fog of war is optional later. For POC everything is visible so shops/chests work as visible lures, as specified.

## 5. Touch movement

**Recommendation: tap-to-move with A* and a visible path preview. Not a virtual joystick.**

- The game is encounter-paced, not twitch. Tap-to-move lets encounter rolls happen per tile stepped, which is what makes "hard to reach places" a real risk decision.
- Interaction: tap a tile → path draws → player walks. Tap again mid-walk to reroute. Tap a POI (chest/shop/boss) → walk to it and open on arrival. Hold to keep walking toward the finger (optional).
- Encounter check per tile entered: `p = baseRate[tileType] * screenMultiplier`. Roads ≈ 0, grass low, forest/swamp high. A **threat meter** on screen shows accumulated risk so random is legible, not unfair. Movement halts and the combat scene opens when a roll hits.
- Fixed **guard** encounters (visible enemy sprites) stand in front of chests and shops. These are not random; you must beat them to open the POI. This is the lever that makes loot "cost" encounters.

## 6. Screen generation

Each screen is procedurally generated from the run seed:

1. Lay a **main road** from the entry (west) to the boss arena (east) with a couple of bends.
2. Fill the rest with biome tiles whose danger grows with distance from the road.
3. Pick 1 shop, 2 chests, 1 shrine (heal) per screen. Place each where the *path cost* from the road is high (through forest), rejected if reachable with < N danger tiles. Chest value scales with its path cost.
4. Place guard encounters adjacent to each POI, and a boss sprite in the arena.
5. Flood-fill validation: every POI reachable, no sealed pockets. Regenerate on failure.
6. Screen 2 uses the same generator with higher enemy tier and danger rates.

## 7. Combat scene

Side view: player left, enemy right, HP bars top. Above the enemy: **current intent** (icon + number) and a smaller **posture tell** for next round. Bottom bar: the dealt **hand** (up to 3 cards) plus two fixed basics, **Attack** and **Defend**. Deck and discard counts shown small in a corner.

Turn flow:

`deal (round ≥ 1, oldest-out at cap 3) → player plays a hand card or a basic → resolve → enemy intent executes → statuses tick → advance intent/tell → repeat until a side dies`

Damage formula (POC, flat and readable): `dmg = max(1, round(atk * skillMult) - def * defMult)`. Exposed doubles damage taken. Guard blocks the next hit. Defend (basic) = Guard for one hit, no damage.

## 8. Persistence (Firebase, local-first)

Players must be able to log in on any device and keep past-loop gains.

- Game code depends only on `SaveStore { loadMeta, saveMeta, loadRun, saveRun, clearRun }`.
- **Local adapter**: IndexedDB (via `idb-keyval`), always written first. The game works fully offline.
- **Cloud adapter**: Firebase Auth + Firestore. **Anonymous auth on first launch** (no sign-in wall), later "Link Google account" upgrades the same uid so nothing is lost. One Firestore doc per uid: `{ meta: MetaState, run: RunState | null, updatedAt }`.
- **Sync rules**: push after every meta change and every run transition (debounced); pull on launch and on auth link. Conflict: MetaState merges by set-union of discovered entries and max of counters; RunState takes the newer `updatedAt`.
- Firestore security rules: a uid may read/write only its own doc. Anti-cheat is out of scope for POC.
- `MetaState` and `RunState` are versioned JSON with migration functions.
- Save points: run start, every overworld interaction, every reward taken, boss kill, screen change. Combat is not saved mid-fight: closing the app during a fight resumes on the map just before it (the encounter is rolled again). Death clears the run and saves meta.

## 9. Deployment & repo layout

- GitHub Actions: typecheck, test and build on every push; deploy `dist/` to Firebase Hosting on `main` (job skipped until the Firebase secret/variable exist).
- Re-RPG lives in its **own new repository** (this repo is the unrelated map3d project; these docs move over).
- PWA manifest with `"orientation": "landscape"`. Browsers cannot force landscape outside fullscreen, so show a "rotate your phone" overlay in portrait and call `screen.orientation.lock('landscape')` on first tap where supported. Capacitor wrap locks it for real.
- `touch-action: none`, `user-scalable=no`, safe-area insets for notches, `devicePixelRatio` capped at 2.

## 10. Testing & balance

- Vitest on `core/*` (combat math, map connectivity, loot pool composition, save migrations).
- `npm run sim -- --runs 5000 --class warrior --unlocks 0` prints reach-boss %, avg turns per fight, death cause histogram. Tune numbers until fresh runs die before boss 1 most of the time and 2–3 unlocks flip that.
- Playwright smoke test at phone-landscape viewport: boot → class select → first fight.
