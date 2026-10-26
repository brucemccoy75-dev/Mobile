# Re-RPG — Art Direction & Pipeline

Status: **style chosen — Style C (flat vector / cel-shaded)**, picked from the warrior test on the phone. Section 0 is the style sheet every new asset follows; sections 1–6 are the pipeline and the (finished) style test.

## 0. Style sheet — Style C

Canonical reference: `art-src/hero_warrior_styleC.jpg` (bearded warrior, round shield forward, short sword). Feed it as the style/image reference for every new character prompt. Runner-up Style A (pixel) lives at `public/art/a/` and is switchable from the title screen (`art C · vector` / `art A · pixel`) for comparison only; no new Style A assets.

Fixed clauses, appended verbatim to every character/enemy prompt:

> flat vector cel-shaded, chunky proportions about 4 heads tall, oversized hands and weapon, thick uniform dark outline, flat fills, two tones per material (base + one shadow), no texture, no gradients, warm orange and leather against cool grey mail, strict side view facing right, light from top-left, plain white background

- Enemies: same clauses but **facing left**; bosses may go to 5 heads tall and fill more of the frame.
- Battle size: hero 176 px tall on a 192 px canvas (`hero_<class>.png`) plus a `@2x` (352 on 384). Normal enemies ≈ 150 px, tier-2 ≈ 190, bosses ≈ 250 (on 2× canvases 320/400/512).
- Backdrops (next test): *"flat vector illustration game background, <biome>, layered paper-cut shapes in three depths, soft two-tone sky, clean flat ground along the bottom third, thick outlines only on foreground shapes, no characters, no text, 1280x540"*. One per biome: grass, forest, swamp, road/clearing, and the two boss arenas.
- Tiles: flat 32 px at 2× (64 on screen) with the same two-tone rule; thick outlines only on object tiles (trees, rocks, POIs), never on ground fills, or the grid shows.
- Cut-out process: median-of-corners background key (tolerance 60), border flood fill, 3 px edge erosion, crop to bounds, LANCZOS resize to the battle height, paste bottom-centre. Keep the source JPG under `art-src/`.

Next assets in order: Boar (screen 1 enemy, facing left) and the forest backdrop, then the other four screen-1 enemies.

### Combat backdrops

One per overworld tile type, 1280×540-ish landscape, stored as `public/art/c/bg_<tile>.jpg` (source JPG under `art-src/`). The flat ground must start at a fixed fraction of the height (`BACKDROP_HORIZON`, 0.84 after cropping the dark bottom strip); CombatScene puts the combatants' feet on that line, extends the ground colour under the hand, and lays dark fades under the HUD and the cards. The fight picks `bg_<tile>` from the tile the encounter started on (`PendingEncounter.tile`); only `bg_forest` exists, so every tile falls back to it. Next: grass/road clearing, swamp, and the two boss arenas, same prompt with the biome swapped.

### Animation from generated video (parked)

Status: the boar and imp idle loops are out of the build (the imp's keyed edges and loop seam looked worse than a still). Stills fade in from a step back and breathe with a slow scale bob in CombatScene; attacks lunge, deaths fade. The pipeline below stays for when the game loop is fun enough to polish.

Idle loops (and later deaths) come from short Grok videos of the cut-out still: `python3 scripts/video-to-sheet.py art-src/<name>_<anim>_styleC.mp4 <name> <anim> <height@2x> [--once]`. The script extracts frames at 10 fps, keys the plain background, anchors every frame on the feet of its largest blob (so camera drift vanishes), scales the median body height to the target, and picks the 1.5–2.5 s window whose end frame best matches its start (`--once` keeps the whole clip for one-shots). It writes `public/art/c/<name>_<anim>@2x.png` and records frame size, count and fps in `src/data/anims.json`; BootScene loads every entry and CombatScene plays `anim_<id>_idle` when it exists, falling back to the still. Prompt the video with: *camera locked, no zoom, character stays centred, plain white background, subtle motion only, ends in the same pose it starts*. Pass `--until <s>` to stop before a 4th-wall break, `--anchor full` for hoverers (pins the drop shadow so the bob survives), and `--pause 6` to hold six seconds between loops; the loop is rotated to end on its calmest frame so the hold looks like standing still. Keep idles ≤ 20 frames; a 17-frame boar idle is ~1.8 MB.

### Tileset in use: CraftPix vector freebies

The overworld draws from two free CraftPix packs (itch mirrors: [Summer Fantasy](https://free-game-assets.itch.io/free-summer-fantasy-top-down-vector-tileset), [Dark Swamp](https://free-game-assets.itch.io/free-dark-swamp-top-down-vector-tileset)). Their license allows commercial use without credit but forbids redistributing the source files, so the raw packs live in `art-src/packs/` (gitignored) and only the packed, half-size game sheets are committed: `public/art/c/ground.png` (96 px cells: summer 1-56, swamp 1-56 recoloured so its outer green matches summer grass, flat water) and `props.png/.json` (trees, bushes, rocks, boulders, reeds, chest, tent, tower, campfire). Regenerate with `python3 scripts/pack-tiles.py` after unzipping the packs to `art-src/packs/summer` and `art-src/packs/swamp`.

`src/game/tiles.ts` maps the grid onto the sheet: roads use the narrow path pieces by 4-neighbour mask; arena and swamp use the blob edge/corner pieces (thin shapes degrade to islands); forest is grass plus a tree per tile; rock tiles are boulders; props are hashed from seed and position so they never change between visits. Known gaps: water has no shore tiles yet, and noisy swamp placement produces many single islands.

### Tileset candidates considered

| Pack | Cost | License | Notes |
|---|---|---|---|
| CraftPix / "Free Game Assets" vector top-down freebies: Summer Fantasy, Dark Swamp, Simple Summer, Crystal Plains | free | CraftPix freebie: commercial OK, no credit, no resale of source | 256 px vector tiles (PNG + AI/EPS), downscale to 64. Summer = grass/road/forest, Swamp = swamp. Closest match to Style C; paid siblings ≈ $5.50 each. |
| andreholtz "2D Cartoon Forest Tileset" | $2.99 | commercial OK, no credit | 48 px flat tiles + .AI source, 100+ tiles, forest only. |
| RhosGFX "Vector RPG Overworld" (demo) | free demo (CC0), full $4.99 | CC0 demo | 64 px cute/cartoony; demo is bare-bones. |
| Kenney Map Pack / RPG Base | free | CC0 | Very simple flat tiles, vector sources; fine as a placeholder grid, too plain for shipping. |
| Pixel Frog "Tiny Swords" | free | custom: commercial OK, no redistribution | 64 px chunky pixel-cartoon; reads flat at phone scale but is pixel art, so a style mismatch risk. |

## 1. The three pipelines

| Asset | Tolerance for AI | Recommended source |
|---|---|---|
| Battle backdrops (one per biome), portraits, title/key art | High: one image, no consistency across frames | General image models (Midjourney, Flux, DALL·E). Iterate fast. |
| Overworld tileset, POI icons | Medium: must sit on a grid and tile seamlessly | Retro Diffusion (tileset mode) or PixelLab; else a pack (Kenney, 0x72, Pixel Crawler, Tiny Swords). |
| Hero paper doll (body + gear layers), enemies, attack animations | Low: 20+ frames × 3 layers must match pixel-for-pixel | PixelLab (animated sheets + equipment from a reference) to test; otherwise a modular pack (LPC is free, CC-BY-SA) or a commission. General models cannot do this. |

Rule of thumb: generate **paintings** with AI, **sheets** with sprite tools or people.

## 2. Technical specs (what the game loads)

Logical canvas is 540 px tall, 960–1260 wide. Pixel art must scale by integers to stay crisp, so pick one of:

- **A. 16 px tiles at 3×** (48 px on screen, current `TILE`). Classic, forgiving to draw, lots of packs. Small on the eye.
- **B. 32 px tiles at 2×** (64 px on screen, `TILE` moves to 64). More detail, AI-friendlier, fewer tiles per screen (≈18 × 8). **Recommended if the style is pixel art.**

For non-pixel styles (painterly, vector) scale is free; author at 2× the display size.

### Overworld
- Tileset: one sheet, grid = tile size. Tiles: road (centre + 4 edges + 4 corners for autotile), grass ×3 variants, forest (ground + tree), swamp ×2, water, rock, arena floor, arena wall.
- POI icons on the same grid: chest (closed/open), shop, shrine (lit/spent), quest giver, escort NPC, guard marker, boss marker, entry marker.
- Hero overworld: 32 × 48 per frame (for B), 4 directions × 4 walk frames + 1 idle each. Enemy "prowler" sprites later: same grid.

### Battle (side view)
- Hero and enemies: **128 × 128 per frame** (bosses 192 × 192), facing right for the hero, left for enemies. Transparent PNG sheets, one row per animation:
  - idle 4 · attack 6 · cast 6 · block 2 · hurt 2 · death 6 · (hero only) victory 4
- **Hero paper doll**: separate sheets with the *identical* frame grid and timing: `base_<class>.png`, `body_<item>.png`, `weapon_<item>.png`, `relic_<item>.png` (a glow/trinket layer). The game stacks them and plays the same animation key on each. Any item without a layer falls back to no overlay, so coverage can grow item by item.
- Backdrops: **1280 × 540** per biome, drawn so the lower third is open ground where the combatants stand: `bg_road`, `bg_grass`, `bg_forest`, `bg_swamp`, `bg_arena` (boss), `bg_shrine`. The fight picks the backdrop from the tile the encounter started on; guards use their POI's tile; bosses use `bg_arena`.
- Effects: hit spark 4 frames, block flash 3, heal glow 4, burn 4, curse 4; 64 × 64.

### Files and naming
```
public/art/<style>/
  tiles/tileset.png + tileset.json      (Phaser tilemap or atlas)
  world/hero_<class>.png + .json         (TexturePacker / free-tex-packer atlas)
  battle/hero/<class>/base.png + .json
  battle/hero/layers/body_<item>.png, weapon_<item>.png, relic_<item>.png
  battle/enemies/<enemy_id>.png + .json
  battle/bg/bg_<biome>.png
  fx/<effect>.png + .json
  portraits/<giver_id>.png               (256 × 256)
```
A manifest (`art.json`) lists what exists; anything missing keeps today's placeholder shape, so a style can be tested with four files.

## 3. The style test (done — C won)

Three candidates. For each, make the **same four assets**: one battle backdrop (forest), the warrior idle (one frame is enough), the Boar (one frame), and a 3 × 3 patch of grass/forest/road tiles. Drop them under `public/art/<style>/` and compare on the phone in landscape. Judge: readability at arm's length, how the hero reads against the backdrop, and how much work a full set would be.

### Style A — 16-bit pixel art (SNES / early-GBA)
Crisp 32 px, 1 px dark outline, 3–4 shades per material, limited palette (~32 colours), slight dithering only on large areas.
- Backdrop prompt (general model): *"16-bit pixel art side-scrolling RPG battle background, dense temperate forest at dusk, flat open dirt ground across the bottom third, no characters, limited 32-colour palette, clean pixel clusters, no text, 1280x540"*
- Hero prompt (PixelLab / Retro Diffusion, character mode): *"32-bit style pixel art warrior, side view facing right, battle idle stance, orange tabard over chainmail, round shield, short sword, 128x128, transparent background, 1px dark outline, no text"*
- Enemy prompt: *"pixel art wild boar, side view facing left, lowered head, tusks, 128x128, transparent background, same palette and outline as reference"*
- Tiles prompt (tileset mode): *"top-down 32x32 pixel art tileset, grassland with dirt road autotiles and dense forest, seamless, 3 grass variants, limited palette, no shadows"*

### Style B — Painterly stylised (Slay the Spire / Darkest Dungeon lite)
Hand-painted look, visible brush texture, strong silhouettes, desaturated backgrounds with saturated characters.
- Backdrop: *"stylised hand-painted 2D game battle background, misty forest clearing, muted greens and browns, strong depth with foreground trees framing the sides, empty flat ground along the bottom, no characters, no text, 1280x540"*
- Hero: *"stylised painted 2D RPG warrior, three-quarter side view facing right, battle-ready stance, orange tabard over mail, round shield and short sword, bold silhouette, clean edges, transparent background, 512x512"* (one frame: this style animates with squash-and-stretch tweens, not frame sheets)
- Enemy: *"stylised painted wild boar, side view facing left, menacing, same lighting as the warrior, transparent background, 512x512"*
- Tiles: painterly tiles are the weak spot. Use large 2 × 2 painted "patches" with soft edges instead of a strict tileset, or keep tiles pixel/flat and paint only backdrops.

### Style C — Flat vector / cel-shaded (clean mobile look)
Flat colour shapes, 2–3 tone shading, thick consistent outline, very readable small.
- Backdrop: *"flat vector illustration game background, forest clearing, layered paper-cut trees in three depths, soft gradient sky, clean flat ground along the bottom, no characters, no text, 1280x540"*
- Hero: *"flat vector cel-shaded 2D RPG warrior, side view facing right, chunky proportions, thick dark outline, orange tabard, round shield, short sword, transparent background, 512x512"*
- Enemy: *"flat vector cel-shaded wild boar, side view facing left, thick outline, transparent background, 512x512"*
- Tiles: *"flat vector top-down 64x64 game tiles, grass, dirt road with edges, dense forest canopy, seamless, thick outlines, consistent light from top-left"*

Keep every prompt's last clause fixed across a style (palette, outline, lighting) and feed the previous output as the style reference: that is what buys consistency.

## 4. Animation plan that survives any style

- Pixel style (A): frame sheets as specced; paper-doll layers.
- Painted / vector (B, C): **one or two frames per character plus tweens** (lunge, recoil, squash on hit, flash on block, tint on status). Gear is shown by swapping a weapon sprite pinned to a hand anchor and a body overlay; no per-frame redraw. This is far cheaper and reads well on a phone.

Either way the combat scene already drives everything from events (play, damage, block, status), so the renderer swaps without touching rules.

## 5. Process

1. ~~Style test~~ done: Style C chosen (section 0 is its style sheet).
2. Extend the style sheet with one reference image per category as each category's first asset lands.
3. Produce in this order: backdrops (6) → hero base + 6 gear layers → the 5 screen-1 enemies → tileset → POIs → effects → screen-2 enemies and bosses.
4. For sheets from sprite tools, clean in Aseprite; pack with free-tex-packer; drop into `public/art/<style>/`.

## 6. Licensing notes

Check each tool's terms for commercial use and whether outputs can be trademarked. Keep prompts and source files in the repo under `art-src/` (ignored from the build) so the set can be regenerated or handed to an artist.

## Wren, the rat-keeper (boss variant, needs a still)

Same flat vector cel-shaded style sheet as the others. Prompt:

> Full-body character still, flat vector cel-shaded style, thick clean outlines, limited palette, no
> background, transparent PNG. A small wiry woman in her fifties, weathered, hair tied back under a
> patched headscarf, a long waxed coat with many pockets, rats peeking from the pockets and one
> sitting on her shoulder wearing a tiny collar with a bell. She stands squarely, chin up, holding a
> heavy iron mace in both hands as if she has just taken it from someone. Expression: calm, hurt,
> decided. Side view facing left, feet on the ground line, about 320px tall at 1x.

Cut with `scripts/cut-sprite.py <src> public/art/c wren 230` and add `enemy_wren_c` to
`BootScene.ART_FILES`. Until then she is the purple placeholder.
