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
- Put them in `poker/public/portraits/`. I will mount them in the scene and the panel.

Optional, later: expression variants as `<id>_happy.png`, `<id>_annoyed.png`, `<id>_shocked.png`,
`<id>_thinking.png`, `<id>_tilted.png`. Start with the neutral one per character; the engine can keep
using drawn expressions until the variants exist.

## Keeping thirteen faces in one style

- Use the **same style block** (below) at the start of every prompt, the same aspect ratio, and the
  same session or seed where the tool allows it.
- Generate one character you like first, then reference it for the rest: Midjourney `--sref` on that
  image for style (and `--cref` for expression variants of the same man), or image-to-image at low
  strength in Stable Diffusion. GPT image models take a reference image in the conversation.
- Ask for a transparent background where the tool supports it (GPT image models do). Otherwise ask for
  a flat dark background, `#0a120d`, and I will key it out.
- Generate four candidates per character and pick; do not accept the first.

## Style block (paste first, every time)

> Stylised 3D-rendered character portrait, head and shoulders, facing the camera at eye level,
> centred, square. Matte clay-like skin, simplified rounded features, slightly caricatured
> proportions, big readable expression. One warm key light from above like a lamp over a poker
> table, soft shadows, dark neutral background. Clean, no text, no watermark, no hands, no props.
> Consistent with a set of thirteen portraits in the same style.

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

**Bawb** (`chad.png`) — tourist, loud, bachelor-party energy.
> A man about thirty, big grin, sunburned nose, backwards baseball cap, green basketball jersey over
> a t-shirt, gold-rimmed sunglasses pushed up on the cap, thick neck, eyebrows up like he just had an
> idea.

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
> A man in his mid forties, sharp features, short dark hair with grey at the temples, fitted dark
> blazer over a t-shirt, a knowing smirk, eyes locked on the viewer like he is counting seconds.

**Dave** (`dealer.png`) — the host, deals every hand, long-suffering.
> A man in his late forties, kind tired face, neat short hair, crisp white shirt, black vest and a
> small black bow tie, the patient expression of a man dealing his eleventh hour of cards in his own
> basement.

## Expression variants (when you want them)

Append to the character's prompt, keeping everything else identical:

- `_happy`: "same man, same clothes and lighting, pleased grin, eyes crinkled"
- `_annoyed`: "same man, same clothes and lighting, annoyed, brows down, mouth tight"
- `_shocked`: "same man, same clothes and lighting, shocked, eyes wide, mouth open"
- `_thinking`: "same man, same clothes and lighting, thinking hard, brow furrowed, eyes down"
- `_tilted`: "same man, same clothes and lighting, flushed and furious, jaw clenched"

Make the neutral set first and check it in the game before spending time on variants.
