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
New Hampshire, Dave's-basement feel.

**David Sr** (`harold.png`) — nit, retired accountant, scared money.
> A man in his late sixties, thin, neat grey side part, reading glasses pushed up on his forehead,
> beige cardigan over a checked shirt, worried eyebrows, lips pressed together like he just saw the
> bill. Neutral expression with a hint of dread.

**Paul** (`dolores.png`) — nit, fourth-grade teacher.
> A man in his mid forties, soft round face, short brown hair, sweater vest over a collared shirt,
> school lanyard just visible, patient tired eyes, the half smile of someone waiting for the class to
> settle down.

**Kevin** (`marvin.png`) — nit, actuary, fatalistic.
> A man in his late thirties, pale, slightly hollow cheeks, thinning dark hair, short-sleeve white
> dress shirt with a narrow tie, flat resigned expression, eyes that have already calculated how this
> ends.

**Bawb** (`chad.png`) — tourist, loud, the life of the party.
> A white man in his late forties, short and fit, completely bald, with a Popeye look: a jutting square
> chin, a slightly squinted eye, thick neck and compact broad shoulders, plain white t-shirt, a big
> easy grin like he just arrived at the party and is already the loudest guy in it.

**Tim** (`trish.png`) — tourist, cruise-ship regular, superstitious.
> A man in his mid fifties, deep tan, silver hair combed back, loud floral shirt, a beaded lucky
> bracelet visible at the shoulder line, warm chatty smile, crinkled eyes, a little too relaxed.

**Luca** (`benny.png`) — tourist, big night out, overconfident.
> A man in his late twenties, slicked dark hair, open-collared black shirt, thin gold chain, strong
> jaw, cocky raised eyebrow and a smirk, the look of someone who has told this story twice already.

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

**David** (`nadia.png`) — pro, online crusher, bored by live play.
> A man in his late twenties, pale from screens, messy hair, black hoodie, over-ear headphones
> around his neck, bored unimpressed expression, one eyebrow slightly raised, chewing on nothing.

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
