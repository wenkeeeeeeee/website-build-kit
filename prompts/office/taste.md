# Taste standard

What counts as good, from the user's feedback and approved sites. Where it sits among the kit's files: "Which rule
wins" in `AGENTS.md`. Each rule lives in one place: a new lesson sharpens its rule rather than adding one.

Layout, type, colour and design are the builder's own choice, made from the tone, the client's business and products,
and the variant's references. This file says what the site must do, not how it must look.

## The free variant (V4)
No limits: any tone, layout, type, colour, medium or idea, references optional, the colour method (`colour.md`)
welcome. Nothing else in this file binds it. It still uses the client's real business, products, prices and ways to
order, invents no claims, and works.

## The hero
Attractive, creative, modern and alive with motion graphics, in the tone and direction in `PITCH.md`. The user judges
it first, so it's approved as pictures before the rest is built (`build.md`, step 4). Applies to the home page and
every page hero.

- **It shows what the customer came for:** the car, the dish, the pets, the gift, the service and its result, the skin
  clearing. Never only a logo, mood or metaphor.
- **It says the core in seconds** and gives one clear action. No paragraphs. Claims only from the client, or shown as
  `[client to confirm]`.
- **It moves:** an opening that never blocks (`motion.md`), something alive at rest, and a scroll move wherever the
  product suits it, smooth both ways and working on phones. Some scroll moves that have worked:
  - **Turn and open:** the product turns, opens or comes apart, parts named.
  - **Result over time:** the problem clears step by step, days shown.
  - **Build-up:** items arrive one by one into the finished thing.
  - **Reveal:** something personal appears, such as a name printing onto the product.
  - **Place:** the room fills, the camera walks in, day turns to night.
  - **Gather:** the camera pulls back from one subject to the whole range.
- **The tone sets the energy.** Playful: bold, bouncy, something the visitor does to the client's object (hold,
  inflate, light, uncover), optional sound. Modern and professional (luxury included): precise motion that explains
  the product, never a game, prop or ritual. Nothing gates the site.
- **It's made of what the client really has** ("Hero material" in `PITCH.md`): footage and photos cropped clean, never
  stretched or blurry. Photos too weak or missing: the client's own clips, then licensed stock of the real thing
  labelled "Photo for illustration" and listed in `OPEN-QUESTIONS.md`.
- **The check:** run `hero-frames.cjs` on the hero beside a category leader from "Category look" and the variant's
  references. A stranger knows what's sold, they'd stop scrolling, and it belongs beside them without copying them.

## The body
- **It fits the hero:** one site, not a hero with a template below it, inner pages too. Sections of only heading,
  paragraph and picture, or only fade-ins, fail.
- **The client's object runs through the site:** the intro, section transitions, image frames, small details.
- **One signature set-piece** (`motion.md`), placed after the first price and action. Home pages run about 6–10
  screens.
- **A tool that fits the business,** answering a real customer question and ending in a WhatsApp message; plumbing in
  the business's language ("try-on list", not "basket").
- **Each variant is its own world:** its own hero idea, layout, type, palette and telling of each step of the buyer's
  path. The path can repeat; the telling can't. Never one shared recipe across variants.
- **Every variant carries the whole business:** every product with its price (on a Branding site, after the story), every
  page in `PITCH.md`, the proof, offers, questions, locations and ways to order. Catalogues, recipes, gifts and awards
  the client has, the site has.
- **It sounds like it knows the business.** A skin-condition site talks about the itch, flare-ups, why they return, how
  the cream works, real results and the price. Short and specific: no paragraphs, no bare headlines, no invented
  slogans or claims.
- **Real proof beside the mood:** real photos of rooms, staff and equipment; campaign images labelled as illustration.
  Keep the client's languages, real branch names, live open status and honest `[client to confirm]` tags.

## Will they buy?
Looking impressive can still lose the sale.
- **The buyer's path sets the order.** Each home page section answers the buyer's question at that point (What is it?
  Is it for me? Is it real? How much? How do I get it?), and you can say which.
- **Buying basics in every variant:** real people, products or premises up front; a price or "from" price and the main
  action within about 1.5 screens of the top, with warranty, delivery and payment terms beside it; proof before the
  ask; the main action always in reach on a phone. Branding sites may hold prices until after the story, with the shop
  link in the header throughout.
- **Persuasion beats show.** Cut down any spectacular section that delays the price, hides the action or slows the phone.
- **Customer walk.** On a phone, read the home page from landing to the WhatsApp message. At each screen: do I know what
  this is, do I trust it, do I know what to do next? Fix every "no".

## Look and category
- **Stay in the category.** A bar looks like a bar at night, a clinic like a clinic, a scooter brand like a mobility
  brand, not a racing game, fintech dashboard or sale poster. If the brand's own marketing team wouldn't publish it,
  redo it.
- **Colour from the brand and the client's world,** never a metaphor. V3 and V4 may explore a mood pair and one
  clashing accent where it suits, louder for playful, quieter for professional (`colour.md`), never copied from its
  examples. Red with gold and brush calligraphy reads festive for Chinese clients: avoid it unless the client is
  festive. Keep clear of a famous namesake's colours and look.
- **A redo keeps the level of the variant the user liked** with a new idea, layout and hero. Still rejected after
  several rounds: restart from the plain starter with a new concept and new references.
- **The original logo,** never redrawn or restyled.
- **"Branding" is storytelling:** one story with transitions between products; no cards, prices or adverts until a quiet
  shop link at the end. The main action stays in the header.

## Rejected on sight
- **Copying a reference:** its images, logo, copy or colours, or a page that could pass for it with the logo hidden.
  Adapt how it stages and moves things to this client.
- **Variants that look alike,** or at different levels of completeness.
- **Too boxy:** most of the page is rows of cards on a flat background.
- **Messy layering:** words over busy images, accidental overlaps, things sliding under the sticky header.
- **The same thing twice:** a list in the hero and again below, a second film right after a film hero, a tool repeating
  another section. At most three videos on a home page, one playing at a time.
- **Controls that are only controls:** a dial or tab nudged to reveal text. Interactions answer a customer question with
  a visible result (a size found, a price worked out, a lot compared).
- **Text left half faded** by scroll position.
- **Inner pages weaker than the home page.**
- **Bad images:** cut-off products, odd ratios, stretched low-res, slow zooms on blurry stills.
- **Bad motion:** short clips rewinding or looping to fill time, jitter, scroll lag, a heavy first load.
- **Browser-default controls:** a white date popup, number spinner arrows, an OS dropdown. Draw them in the site's style.
- **Small breakages:** white gaps at edges, sections that don't fit one screen, cards changing height and shifting the
  page.

## Type
The only font rule: not these, unless the client's own brand uses them, because they read as machine-made: Inter,
Inter Tight, Fraunces, Figtree, DM Sans, DM Serif, DM Mono, Instrument Serif, Instrument Sans, Bricolage Grotesque,
Manrope, Sora, Syne, Outfit, Plus Jakarta Sans, Space Grotesk, Playfair Display, Cormorant, Newsreader, Archivo,
Bodoni Moda, JetBrains Mono.

## Media
Build with what exists. Ask the client for images or clips only when they lift the idea, with ready-to-paste prompts
without text or audio. If an idea looks bad with stills, clips won't save it.
