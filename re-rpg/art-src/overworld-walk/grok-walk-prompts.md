# Overworld hero walk: prompts for Grok

On the map today the hero is the battle still, with a small squash on each step. A walk cycle
makes him look like he's walking. He's small on the map (about 60 px tall on a phone), so **4
frames is plenty**, and fewer frames are easier to keep consistent.

Every frame is a side view **facing right** on a **plain white background**; the game flips him
for walking left. Attach `art-src/hero_warrior_styleC.jpg` every time.

## Option 1 (recommended): four edits of the same hero

Image tools redraw a whole sheet inconsistently, but they are good at changing one thing in a
picture you give them. Attach the hero image and ask for one pose change at a time. The face,
gear and colours stay put because every frame starts from the same picture.

Use this opening for each edit, then add one of the frame lines below:

> Edit the attached image. Keep the character exactly the same: same face, beard, hair, orange
> tabard, chainmail, belt, round wooden shield, short sword, boots, colours, outline thickness
> and size. Keep the flat vector cel-shaded style with thick dark outlines, the strict side view
> facing right, and the plain white background. Only change the legs and arms into this walking
> pose:

- **Frame 1 (contact, right foot forward):**
  > right leg stepping forward with the heel touching the ground, left leg stretched behind with
  > the toes on the ground, body at normal height, shield arm slightly back, sword arm slightly
  > forward.
- **Frame 2 (passing, left foot lifted):**
  > right leg straight under the body carrying the weight, left knee bent and lifted as it swings
  > forward, body slightly higher than normal, arms close to the body.
- **Frame 3 (contact, left foot forward):**
  > left leg stepping forward with the heel touching the ground, right leg stretched behind with
  > the toes on the ground, body at normal height, shield arm slightly forward, sword arm slightly
  > back.
- **Frame 4 (passing, right foot lifted):**
  > left leg straight under the body carrying the weight, right knee bent and lifted as it swings
  > forward, body slightly higher than normal, arms close to the body.

Keep his size and position the same in all four; they will be lined up on the feet anyway. If
one frame changes his face or gear, re-run only that frame.

## Option 2: the whole sheet in one go

Quicker if it works. Check that all four look like the same person.

> A walk cycle sprite sheet of the attached character: 4 frames in a single horizontal row,
> evenly spaced, same size, every frame the exact same character as the reference (same face,
> beard, orange tabard, chainmail, round shield, short sword, colours). Frames in order: right
> foot forward contact, passing with the left knee lifted, left foot forward contact, passing
> with the right knee lifted. The feet of every frame sit on the same baseline. Strict side view
> facing right, flat vector cel-shaded, thick uniform dark outline, flat fills with one shadow
> tone, plain white background, no shadows on the ground, no text, no grid lines.

## Option 3: cut-out parts (if the frames won't match)

I rig the parts and swing the legs in code, so the hero can never drift. It is less lively than
drawn frames but perfectly consistent.

> Using the attached character, draw his parts separately, laid out apart on a plain white
> background with space between each, all at the same scale as the full character, flat vector
> cel-shaded with the same thick dark outline: (1) head, torso and tabard with the shield on his
> arm, no legs; (2) the near leg from hip to boot, straight; (3) the far leg from hip to boot,
> straight, slightly darker; (4) the sword arm holding the sword, from the shoulder. Strict side
> view facing right, no text.

## What happens when you send them

I cut each frame out, line them up on the feet, pack them into a sprite sheet, and the map plays
the walk while he moves and stands still when he stops. Send each frame as its own image, or the
sheet. Walking up or down the map stays the side view for now. Front and back views could come
later the same way.
