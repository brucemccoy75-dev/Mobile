# Re-RPG — Art Direction & Pipeline

Status: style exploration. Nothing here is final; the point is to pick a style on the phone before producing sets.

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

## 3. The style test (do this first)

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

1. Style test (section 3): three folders, four assets each, compare on the phone. Half a day of generation.
2. Pick one. Write its style sheet: palette, outline, light direction, proportion guide, one reference image per category.
3. Produce in this order: backdrops (6) → hero base + 6 gear layers → the 5 screen-1 enemies → tileset → POIs → effects → screen-2 enemies and bosses.
4. For sheets from sprite tools, clean in Aseprite; pack with free-tex-packer; drop into `public/art/<style>/`.

## 6. Licensing notes

Check each tool's terms for commercial use and whether outputs can be trademarked. Keep prompts and source files in the repo under `art-src/` (ignored from the build) so the set can be regenerated or handed to an artist.
