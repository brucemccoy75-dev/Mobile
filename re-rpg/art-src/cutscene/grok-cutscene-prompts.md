# Opening cutscene: prompts for Grok

It plays once per run, between choosing your heirloom cards and first entering the map.

The story: the hero strolls through the woods, a bit full of himself. He pushes into a clearing,
finds it packed with monsters, and a boar and a hex imp come flying at him. The mood is cheeky,
not grim: he's the one who gets the surprise.

## How to make it

1. **Lock the 3D hero first** (step 0). Attach `art-src/title-reference/character-sheet.jpg` and
   `art-src/hero_warrior_styleC.jpg`, generate the hero turnaround, and keep the best one.
2. **One still per shot.** Attach the step-0 hero and the character sheet to every image prompt.
   The same hero in every still is what keeps him the same in every clip.
3. **Animate each still** with its video prompt (image-to-video), about 5–6 seconds each.
4. **Landscape 16:9** for everything. Phones vary, so keep the action in the middle: the sides
   may be trimmed on wider screens.
5. Send the clips back as MP4. They become a scene the player can tap to skip, then the map
   starts. Sound is optional: the game has none yet, so a clip's audio may be dropped.

The style clause goes at the end of every image prompt:

> stylized 3D animated feature-film look, soft toon shading, chunky proportions about 4 heads
> tall, oversized hands and weapon, clean bold silhouettes, warm golden sunlight through a lush
> forest, saturated but soft colours, same character design as the reference images, 16:9 cinematic
> frame, no text, no logo, no watermark

---

## 0. The hero in 3D (reference only, not in the cutscene)

**Image:**
> Character turnaround sheet of the bearded warrior hero from the attached reference, rebuilt as a
> stylized 3D animated character: messy brown hair and full beard, determined scowl, orange tabard
> with a brown belt and buckles over grey chainmail, round wooden shield with an iron boss, short
> straight sword, brown leather boots, olive trousers with grey knee guards. Front, three-quarter
> and side views, neutral pose, plain light grey background. [style clause]

Pick the image where he looks most like the 2D hero, and attach it from here on.

---

## 1. The stroll (about 6 s)

**Image:**
> The bearded warrior hero from the attached reference strolls along a sun-dappled forest path,
> sword resting casually on his shoulder, shield on his back, chest puffed out, a small smug half
> smile, mid-stride. Tall trees, ferns, floating pollen in god rays, a few butterflies. Camera at
> hip height, slightly in front of him, three-quarter view. [style clause]

**Video:**
> The hero walks toward the camera along the forest path with a confident, bouncy swagger. He
> twirls the sword once on his shoulder, swats lazily at a butterfly and misses, then shrugs it
> off and keeps strutting. The camera tracks backward at his pace, smooth and steady. Light,
> playful mood, golden light flickering through the leaves. No dialogue.

---

## 2. Into the clearing (about 5 s)

**Image:**
> Over-the-shoulder shot from behind the bearded warrior hero as he parts a curtain of leafy
> branches with his shield hand. Beyond him, a sunlit forest clearing packed with monsters from the
> attached character sheet, all frozen mid-activity and staring straight at him: a brown boar, a
> purple hex imp with a glowing pentagram orb, a heap of grey red-eyed rats, a dark armoured shell
> beetle, and a small hooded purple necromancer holding a skull staff. [style clause]

**Video:**
> The hero pushes the branches aside and steps forward, then stops dead. Every monster in the
> clearing slowly turns its head toward him at the same moment. A leaf drifts down between them.
> A tiny, awkward beat of total silence. The camera pushes in slightly over his shoulder.
> Comedic timing, no dialogue.

---

## 3. "Oh no." (about 4 s)

**Image:**
> Close-up of the bearded warrior hero's face, front view: eyes wide, eyebrows shot up, beard
> bristling, a bead of sweat on his temple, mouth a tight wobbly line. Blurred forest clearing
> behind him, warm light on his face. [style clause]

**Video:**
> Hold on the hero's face. His eyes go wide, one eyebrow twitches, he swallows hard (a visible
> gulp), and his eyes dart left and right as if counting the monsters. A tiny forced smile. The
> camera does a slow comedic zoom in. Cheeky cartoon timing, no dialogue.

---

## 4. Incoming! (about 5 s)

**Image:**
> Dynamic low-angle action shot in the forest clearing: the brown boar from the attached
> character sheet charging straight at the camera, tusks first, dust kicking up. Beside it, the
> purple hex imp flying straight at the camera with its arms out and cackling, its pentagram orb
> blazing. In the foreground, the back of the bearded warrior hero's head and his raised round
> shield. Motion blur, energetic, golden light. [style clause]

**Video:**
> The boar charges and the hex imp launches into the air, both flying straight at the hero and
> the camera. The hero yelps silently and throws his shield up. The camera shakes. Just before
> impact, a bright white flash fills the frame. Fast, punchy, comedic action, no dialogue.

The white flash at the end hands over to the game: the map fades in from white.

---

## If something drifts

- **The hero changes** (a different face, beard, colours): re-run the still with only the
  step-0 image attached, and add "exactly the same character as the attached image".
- **Extra or wrong monsters**: list only the ones you want, and add "no other creatures".
- **Too dark or grim**: add "lighthearted, family animated film, bright".
- **The clip moves too much or too little**: say the one action you want in the first sentence
  of the video prompt, and keep the rest short.
