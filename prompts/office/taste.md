# Taste standard

This decides what counts as good, taken from the user's feedback and the sites they approved. Where a brief and this
file disagree, the brief wins only if the user said so. Each rule lives in one place: when a lesson comes in, sharpen
the rule it belongs to rather than adding a new one.

## The hero
Attractive, creative and modern, alive with motion graphics and animation, in the tone and direction set in
`PITCH.md`. It's what the user judges first, so it's built and approved as pictures before the rest of the site
(`build.md`, step 4). This applies to the home page and every page hero.

- **It shows what the customer came for.** The car, the dish, the pets, the gift, the service and its result, the skin
  clearing. That subject is the biggest thing on screen at every scroll step. A logo, mood or metaphor isn't what anyone
  came for, and prices, ratings and counts never lead: at most one small line.
- **It says the core in seconds,** in a clean first screen: a headline set into the scene, a short line, one line of
  facts and one action. No paragraphs. Claims come only from the client, or show as `[client to confirm]`.
- **It moves.** Every hero has motion graphics and animation: an opening that lands in 1–3 seconds and never blocks,
  a main visual that keeps moving gently at rest, and a scroll move wherever the product suits it, pinned for 1–3
  screens, smooth both ways, with a shorter phone version. Scroll recipes:
  - **Turn and open:** the product turns, opens or comes apart with parts named.
  - **Result over time:** the problem clears step by step, with the days shown.
  - **Build-up:** items arrive one by one into the finished thing.
  - **Reveal:** something personal appears, such as a name printing onto the product.
  - **Place:** the room fills, the camera walks in, day turns to night.
  - **Gather:** the camera pulls back from one subject to the whole range.
- **The tone sets the energy.** Playful: bold colour, bounce, and something the visitor does to the client's object
  (hold, inflate, light, uncover), with optional sound. Modern and professional: precise, calm motion that explains
  the product, and a move customers know from the category's best sites, never a game. Nothing gates the site.
- **It's made of what the client really has** ("Hero material" in `PITCH.md`). Real footage cropped clean, never
  stretched: low-res clips go side by side at full height or sharp over a blurred copy. Photos only where sharp; a flat
  photo can tilt, slide, mask and change light, but can't turn like 3D. Cut-outs only with clean edges. When photos are
  too weak, build a 3D, drawn or type-led version of the real subject, never clip art.
- **What fails:** a title with photos; a photo in a box; headline left and picture right with a stats row; a full-screen
  picture with no headline; effects covering the subject; a move the material can't carry; a hero with no motion.
- **The check:** run `hero-frames.cjs` on the hero and its lead reference. At every frame and on the phone, the subject
  is the biggest thing, a stranger knows what's sold, they'd stop scrolling, and it belongs beside the reference.

## The body
- **It fits the hero.** Every section continues the hero's direction: the same scale, image treatment, colour, type and
  motion, on inner pages too, so the site reads as one piece. Sections with only a heading, a paragraph and a picture,
  or motion that's only fade-ins, fail.
- **The client's object runs through the site:** the intro, section transitions, image frames and small details. A
  balloon stylist's site had balloons flying up in the intro, carrying each section change, and framing the photos.
- **One signature set-piece** of 2–4 pinned screens, then sections that each fit one screen with their own motion
  graphic. Meet `motion.md`. Home pages run about 8–19 screens.
- **A tool that fits the business,** answering a question customers really ask and ending in a WhatsApp message, and
  plumbing in the business's language ("try-on list", not "basket").
- **Each variant is its own world:** its own hero idea, header, type pair, palette and way of telling each step of the
  buyer's path. The path can repeat; the telling can't. Never one shared recipe across variants.
- **Every variant carries the whole business:** every product with its price, every page in `PITCH.md`, the proof,
  offers, questions, locations and ways to order. Catalogues, recipes, gifts and awards the client has, the site has.
- **Sounds like it knows the business.** A skin-condition site talks about the itch, the flare-ups, why they come back,
  how the cream works, real results and the price. Each section gets a heading, a line or two of real facts and one
  thing to do: not paragraphs, not bare headlines. No invented slogans or claims.
- **Real proof beside the mood.** Real photos of rooms, staff and equipment; campaign images labelled as illustration.
  Keep the client's own languages, real branch names, live open status and honest `[client to confirm]` tags.

## Will they buy?
A variant can look impressive and still lose the sale.
- **The buyer's path sets the order.** Each home page section answers the buyer's question at that point (What is it?
  Is it for me? Is it real? How much? How do I get it?), and you can say which.
- **Buying basics in every variant:** real people, products or premises early; a price or "from" price once the customer
  wants the thing, usually just below the hero and on every item; warranty, delivery and payment terms beside it;
  proof before the ask; the main action in the header and always within reach on a phone.
- **Persuasion beats show.** If a spectacular section delays the price, hides the action or slows the phone, cut it down.
- **Customer walk.** On a phone, read the home page from landing to the WhatsApp message. At each screen: do I know what
  this is, do I trust it, do I know what to do next? Fix every "no".

## Boxes and lines
Cards, frames, dividers and colour bands are allowed where they suit, but they are every builder's default and the user
has called the result too boxy.
- Cards suit things people compare, such as products with prices or plans. Elsewhere, mix in photos that bleed off the
  edge, cut-outs, overlaps, shapes from the client's world, and text set straight on the page.
- When you use a box, design it: the client's shape, an unusual crop, a tilt, an overlap, the product breaking out.
- Joins between sections are designed and varied: a wave, a torn or cut edge, a line the client's object draws, an image
  crossing into the next section. Never the same straight edge or ruled line after every section.
- **Check:** if most contact-sheet frames are plain rounded boxes on a background, rework them.

## Look and category
- **Stay in the category.** A bar looks like a bar at night, a clinic like a clinic, a scooter brand like a mobility
  brand, not a racing game, fintech dashboard or sale poster. Put the hero beside the category leaders from research:
  if it doesn't belong there, or the brand's own marketing team wouldn't publish it, redo it.
- **Colour from the brand and category,** never from a metaphor. Bold colour suits playful brands; studio light or a dark
  stage suits technology and premium products. Red with gold and brush calligraphy reads festive for Chinese clients,
  so avoid it unless the client is festive. Keep clear of a famous namesake's colours and look.
- **A redo keeps the level of the variant the user liked:** its tone and image treatment, with a new idea, layout and
  hero. If a variant is still rejected after several rounds, start again from the plain starter with a new concept and
  new references.
- **The original logo,** never redrawn or restyled. No clip art for a product the client hasn't photographed: use the
  nearest real photo, labelled, and list the gap in `OPEN-QUESTIONS.md`.
- **"Branding" is storytelling:** one story with transitions between products, and no cards, prices or adverts until a
  quiet shop link at the end. The main action still stays in the header.

## Rejected on sight
- **Copying a reference's details and missing its impact.** Take what makes it striking first: scale, imagery, colour.
- **Variants that look alike,** or at different levels of completeness.
- **Messy layering:** words over busy images, accidental overlaps, things sliding under the sticky header.
- **The same thing twice:** a list in the hero and again below, a second film right after a film hero, a tool repeating
  another section. At most three videos on a home page, one playing at a time.
- **Controls that are only controls:** a dial or tab nudged to reveal text. Interactions are physical acts from the
  client's world with a big visible result.
- **Text left half faded** by scroll position. Lines wipe or mask in at full brightness; check rendered screenshots.
- **Inner pages weaker than the home page.**
- **Bad images:** cut-off products, odd ratios, circles cut from square photos, stretched low-res, slow zooms on blurry
  stills.
- **Bad motion:** short clips rewinding or looping to fill time, jitter, scroll lag, a heavy first load.
- **Browser-default controls:** a white date popup, number spinner arrows or an OS dropdown on a designed page. Draw lists,
  dates, steppers and buttons in the site's own style.
- **Small breakages:** white gaps at edges, sections that don't fit one screen, cards that change height and shift the page.

## Type
Fonts are the fastest way a site reads as machine-made, so they come from the client's world.
- **Not these**, unless the client's own brand uses them: Inter, Inter Tight, Fraunces, Figtree, DM Sans, DM Serif,
  DM Mono, Instrument Serif, Instrument Sans, Bricolage Grotesque, Manrope, Sora, Syne, Outfit, Plus Jakarta Sans,
  Space Grotesk, Playfair Display, Cormorant, Newsreader, Archivo, Bodoni Moda, JetBrains Mono.
- **Start from what's really there:** the client's signage, packaging, menu and posters. Find a free face with the same
  character on Fontshare, Velvetyne, Open Foundry, Collletttivo or the less-used end of Google Fonts, licensed for
  commercial web use and self-hosted as `woff2`.
- **One face with a point of view, one quiet face to read.** If the pair would suit any other client, pick again. The
  display face must carry the client's languages; Noto only for a script with no better option.
- **Other tells:** small uppercase mono labels above every heading, "01 / 02 / 03" numbering, one italic word in a
  headline, cream paper with a serif by default, gradient text, glass cards.

## Media
Build with what exists. Ask the client for images or clips only when they lift the idea, with ready-to-paste prompts that
have no text or audio. If an idea looks bad with stills, clips won't save it.
