# Portraits for Poker Night at Dave's

How to get player art that drops straight into the engine, and the prompts to generate it.

## What the engine needs

The engine shows each player two ways: small at the table (about 60 px tall on a phone) and large in
the speaker panel. The figures today are matte, simple, clay-like shapes under one warm overhead lamp.
Art that matches that reads well at both sizes.

Deliver, per character:

- **One square PNG, 1024 x 1024, transparent background.** Head and shoulders, facing camera, eye
  level, centred, the head filling roughly 55 to 65 percent of the frame height, chin around 70
  percent down. Nothing below the chest. No hands, cards, chips, tables or text.
- **File name = character id**: `harold.png`, `dolores.png`, `marvin.png`, `chad.png`, `trish.png`,
  `benny.png`, `wen.png`, `priya.png`, `ulrich.png`, `sal.png`, `nadia.png`, `jimmy.png`, `dealer.png`.
  (The ids are the original placeholder ids; they never changed, only the display names did.)
- Put them in `poker/public/portraits/`. The engine mounts any portrait it finds there in place of the
  drawn figure, at the table and in the speaker panel; characters without one keep the drawn figure.
- To key a green-screen image yourself: `python3 tools/key-portrait.py in.jpg public/portraits/<id>.png`.

Optional, later: expression variants as `<id>_happy.png`, `<id>_annoyed.png`, `<id>_shocked.png`,
`<id>_thinking.png`, `<id>_tilted.png`. Start with the neutral one per character; the engine can keep
using drawn expressions until the variants exist.

## Keeping thirteen faces in one style

- Use the **same style block** (below) at the start of every prompt, the same aspect ratio, and the
  same session or seed where the tool allows it.
- Generate one character you like first, then reference it for the rest: Midjourney `--sref` on that
  image for style (and `--cref` for expression variants of the same man), or image-to-image at low
  strength in Stable Diffusion. GPT image models take a reference image in the conversation.
- Ask for a flat solid green background, exactly `#00b140`, no gradient, no vignette, no shadow, and
  add "clothing is not green". I key it out and pull the green spill off the edges. A checkerboard
  "transparent" JPEG does not work: the checkerboard is baked into the pixels.
- Generate four candidates per character and pick; do not accept the first.

## Style block (paste first, every time)

> Stylised 3D-rendered character portrait, head and shoulders, facing the camera at eye level,
> centred, square. Matte clay-like skin, simplified rounded features, slightly caricatured
> proportions, big readable expression. One warm key light from above like a lamp over a poker
> table, soft shadows. Clean, no text, no watermark, no hands, no props. Consistent with a set of
> thirteen portraits in the same style. Flat solid green background, exactly #00b140, no gradient, no
> vignette, no shadow on the background. Clothing is not green.

## The thirteen

Each prompt is the style block plus the lines below. Ages and clothes carry the personality; keep the
New Hampshire, Dave's-basement feel. Ask for a plain neutral expression on the base portrait (eyebrows
level, eyes calm, mouth closed and straight); the expression variants come later.

**David Sr** (`harold.png`) — nit, retired accountant, scared money. David's father. Done.
> The same man as in the reference image, twenty years older, about seventy, clearly his father: the
> same long narrow face, long straight nose, thin lips, light eyebrows and slim neck, but now
> completely bald with a smooth scalp and no hair at the sides, deeper lines around the eyes and
> mouth, slightly sunken cheeks, pale eyebrows gone grey, wearing a white business button-up shirt
> buttoned to the top, no tie. Neutral expression.

**Paul** (`dolores.png`) — nit, fourth-grade teacher. Done.
> An ordinary white man in his forties with an average build, regular shoulders and a normal neck,
> arms just a little thicker than average like a guy who does yard work, short dark hair, a plain
> friendly everyday face, wearing a plain grey tank top so his upper arms are visible, with solid
> black tribal armband tattoos ringing each upper arm, thick bands of plain black ink with no
> lettering or pictures. Neutral expression. (Not "heavyset", which came out fat, and not "muscular"
> or "lifts weights", which came out as a bodybuilder.)

**Kevin** (`marvin.png`) — nit, actuary; the imaginary one, drunk and unhinged. Done.
> A heavyset white man in his late forties with a big round face, double chin, thick neck and heavy
> shoulders, messy dark hair sticking up on one side, flushed red cheeks and nose, wearing a wrinkled
> dark plaid shirt with the collar askew and one button undone. He looks wildly drunk and unhinged:
> eyes wide and glassy and pointing in slightly different directions, one eyebrow way up, a huge
> lopsided grin showing teeth, a little sweat on his forehead, the face of a man who just had the
> greatest idea of his life at two in the morning. (The crazy face is his base expression.)

**Bawb** (`chad.png`) — tourist, loud, the life of the party. Done.
> A white man in his late forties, short and fit, a compact runner's build with narrow shoulders, a
> very round head and a round fit face. His whole head is covered in short dark buzzed stubble, the
> same length all over, with a matching short stubbly beard across his jaw, chin and upper lip, no
> shine anywhere. Small ears, plain white t-shirt. A plain, neutral, relaxed expression: eyebrows level,
> eyes open and calm, mouth closed and straight, neither smiling nor frowning, just looking at you.
> (Do not say "Popeye", "bald" or "square chin": the generator turns those into Mr. Clean.)

**Tim** (`trish.png`) — tourist, cruise-ship regular, superstitious. Done.
> A white man clearly in his mid to late thirties, an adult with a few lines at the eyes and a tired
> look, stocky and a bit overweight but not huge, with a round face, a five o'clock shadow of dark
> stubble across his jaw and upper lip, and medium-length wild brown hair poking out messily from
> under a red baseball cap worn backwards, not long hair, just untidy tufts at the sides and front.
> Wearing a black video-game themed t-shirt with a generic colourful pixel-art space-invader style
> graphic on the chest, no words or logos. Neutral expression. ("Soft face" and "double chin" came
> out as a fat teenager.)

**Luca** (`benny.png`) — tourist, big night out, overconfident. Done.
> An ordinary white man clearly in his mid twenties, an adult, average build, average height, with an
> unremarkable everyday face, short neat dark hair, clean-shaven with just a hint of stubble, wearing
> a plain black crew-neck t-shirt with nothing on it. Nothing distinctive about him at all. Neutral
> expression.

**Jonathan** (`wen.png`) — calculator, statistician, literal.
> A man in his mid forties, rimless glasses, close-cropped hair, grey quarter-zip over a collared
> shirt, completely deadpan expression, precise and unbothered, eyes slightly narrowed as if measuring
> you.

**Will** (`priya.png`) — calculator, chess coach, patient condescension.
> A man in his late thirties, neat dark beard, brown cardigan over a plain shirt, a small chess-piece
> pin on the collar, calm half-lidded eyes, the faint smile of a teacher who already sees your next
> three moves.

**Menafee** (`ulrich.png`) — calculator, structural engineer, blunt.
> A man about fifty, crew cut, square face, heavy brow, red and black flannel shirt, flat direct
> stare, mouth a straight line, built like he carries beams for fun.

**Jack** (`sal.png`) — pro, the best player at the table, and sixteen.
> A sixteen-year-old boy, big for his age, broad shoulders and a heavy build, round full face, fairly
> long blond hair falling out from under a backwards baseball cap, rectangular glasses, a plain hoodie,
> a confident half smirk with eyes fixed on the viewer like he already knows what you have.

**David** (`nadia.png`) — pro, online crusher, bored by live play. Done.
> A thin white man in his early fifties with a long narrow face, short light brown hair that is
> thinning on top with a slightly receded hairline, neatly combed, a long straight nose, thin lips,
> light eyebrows, a slim neck, wearing a light blue business button-up shirt with the collar open, no
> tie. A friendly, open expression: eyebrows relaxed, warm eyes with a little crinkle, a small easy
> closed-mouth smile, the look of a man who is glad you came.

**Bruce** (`jimmy.png`) — pro, The Clock, reads timing.
> A white man in his late forties, thin face and build, short full beard of mixed black and grey,
> short dark hair going grey at the sides, a fairly large nose, plain black t-shirt, a sly knowing look
> with a slight squint and a one-sided smirk, like he's counting how long you took to decide.

**Skynet** (`dealer.png`) — Dave's robot, deals every hand, long-suffering. Done.
> A sleek humanoid robot in the style of a modern general-purpose android: smooth white and silver
> body panels with slim dark joints, a narrow black glossy visor for a face with no eyes or mouth, a
> small elegant head, and a dealer's touch: a tiny black bow tie fixed to the chest plate and a black
> vest pattern across the torso panels. Calm, patient, long-suffering posture, head tilted very
> slightly as if it has dealt this hand a thousand times. (Use "matte clay-like surfaces" instead of
> "skin" in the style block, and leave brand names out: generators refuse or distort them.)

## Expression variants (when you want them)

Append to the character's prompt, keeping everything else identical:

- `_happy`: "same man, same clothes and lighting, pleased grin, eyes crinkled"
- `_annoyed`: "same man, same clothes and lighting, annoyed, brows down, mouth tight"
- `_shocked`: "same man, same clothes and lighting, shocked, eyes wide, mouth open"
- `_thinking`: "same man, same clothes and lighting, thinking hard, brow furrowed, eyes down"
- `_tilted`: "same man, same clothes and lighting, flushed and furious, jaw clenched"

Make the neutral set first and check it in the game before spending time on variants.
