# Title screen: prompts for Grok

Attach both reference images with every prompt:

- `montage.jpg`: the composition. The hero faces the enemies, Knight Andre looms behind, the forest
  backdrop, and open sky at the top for the title.
- `character-sheet.jpg`: who each character is, so they stay on-model.

The screen is landscape. Phones range from 16:9 to 21:9, so ask for 21:9 (2560x1184) and keep
everything important inside the central 16:9 area. The "New run" button sits in the lower middle,
so keep that area calm; the small links run along the bottom edge.

## A. Key art with the logo

> Using the two attached images as character and style references, create a polished, modern
> mobile game title screen for a fantasy roguelike card RPG called "Re-RPG". Keep every character
> exactly on-model with the reference: the bearded warrior hero in an orange tabard over grey
> chainmail, round wooden shield and short sword, in the left foreground facing right. Facing him
> from the right: Knight Andre, a huge brute in a mismatched iron helmet with a spiked tree-trunk
> club and a blue loincloth with a gold key, looming large in the background; a small hooded
> purple necromancer with a skull staff and a tiny skeleton; a purple hex imp holding a glowing
> pentagram orb; a brown boar; a dark armoured shell beetle; a heap of grey rats with red eyes.
> Same art style as the references: flat vector, cel-shaded, thick uniform dark outlines, chunky
> proportions, flat fills with one shadow tone. Elevate it into key art: a dramatic low camera,
> the hero mid-stride with sword raised, warm golden rim light from the top left against the cool
> forest, soft god rays through the canopy, drifting embers and leaves, gentle depth of field on
> the background trees. Logo "Re-RPG" at the top centre, in a bold chunky fantasy display font
> with a forged-gold bevel, a dark outline and a subtle glow, readable on a phone. Leave the lower
> middle of the image calm (ground and shadow) for a button. Keep the characters and the logo
> inside the central 16:9 area. Landscape 21:9, 2560x1184. No other text, no UI, no watermark,
> no extra characters.

## B. Key art without the logo (the game draws the title)

Use prompt A, but replace the logo sentence with:

> Leave the top centre as open, softly lit sky with no text, for a logo added later.

## C. The logo alone

> A game logo reading "Re-RPG" for a flat vector fantasy roguelike. A bold chunky display font,
> forged-gold bevel, thick dark outline, a small sword or shield motif worked into the R, a subtle
> warm glow. Centred on a plain flat dark navy background (#0b0f1a) so it can be cut out. No other
> text. 2048x768.

## Tips

- If a character drifts off-model, re-run with only the character sheet attached and say "match
  these characters exactly".
- If the logo comes out misspelled, use prompt B for the art and prompt C for the logo separately;
  the game can layer them.
- Send the result back and it can go in as the title backdrop. The cut-out, placement and the
  "New run" button position are code.
