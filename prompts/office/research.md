# Research agent: run order

About **20 minutes**. Your task message gives `CLIENT`, `PROJECT` (its folder), `KIT` (this repo), `PORT`,
`FRONT_DESK` (a thread id) and `ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds the user's message; its notes beat
everything here. Run `git -C KIT pull --ff-only` first. Work alone and never ask anything. Build 3 variants plus 1 free
unless `LEAD.md` says otherwise. Your job is facts, material and starting points; the builders design.

## 1. The business (8 minutes)
- **Open every client link** (products, about, FAQ, reviews, Linktree, menu). Login walls and marketplaces: section 8
  of `KIT/prompts/website-playbook.md`. Search past them: Google and Google Images with the town, Instagram and TikTok,
  maps, press and reviews.
- **Think like the customer:** what they want or worry about, what they compare, what made past customers buy, in their
  words.
- **Collect** the logo, products and prices, proof, ways to order, languages, and every usable photo and clip into
  `PROJECT/content/images/` and `PROJECT/content/video/`.
- **What the user said before:** if this client had earlier rounds, copy the user's rejections and likes, word for word.

## 2. The material (5 minutes)
Prepare it, so builders start from the best version: crop clean, one grade, upscale only while sharp, cut out products
with a clean edge (`KIT/tools/web/cutout.py`), cut short film loops from their clips (`KIT/tools/web/film.py`). Note
what each piece can carry (size, sharpness, clean stretch of film) and what's missing. Where a 3D model would lift a
product or place, get one ("3D and media" in `KIT/prompts/office/reference-library.md`) or say none exists.

## 3. Direction (5 minutes)
- **Site type, tone and character words:** `KIT/prompts/office/site-types.md`.
- **Buyer's path, Core and Story:** who buys and on what device, their top three doubts with the proof for each, the
  action; what the business is in one line; the story the client wants to tell.
- **The bar:** open 2-3 of the best-known brands in the client's exact category, plus the nearest category sites in
  "The bar" in `reference-library.md`.
- **Starting points:** one line per variant naming the client's thing it builds from ("The idea" in
  `KIT/prompts/office/taste.md`): a product, place, person, tool or object of this trade, or something the customer
  does here. Different for each variant. Builders may find a better one. Check other `WebsiteProjects/*/docs/PITCH.md`
  so no idea repeats.

## 4. Write the plan
Write `PROJECT/docs/PITCH.md` in the format below; unknowns go into `PROJECT/content/OPEN-QUESTIONS.md`.

Without `STOP_BEFORE_BUILD`: load `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with title `CLIENT`,
projectId `ZERILAB_PROJECT_ID`, modelSelection `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}` and
message `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...`, then
report the minutes taken, the starting points and the thread's `link` in under 80 words.

With `STOP_BEFORE_BUILD`: post the business in three lines, the tone and character, the material and what's missing,
and the starting point per variant, then wait. Update `PITCH.md` with any changes the user sends.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.  Tone: <tone>, because <one line>.  Character: <3-5 words>
Core: <what this business is, sells and for whom>.  Story: <one sentence>
Buyer's path: <who buys, device, top 3 doubts with proof, the action>
Owner said: <the user's past rejections and likes for this client, word for word; or none>
The bar: <category brands and category sites opened, with URLs>
Facts: <products and prices, where, how to order, WhatsApp, proof, offers, questions, languages, their words>
Rules: <names never to feature, claims not to make>. Unknowns show as [client to confirm].
Pages: <from site-types.md>.  Ordering: <basket to WhatsApp, quote form, booking>
Screen: 1920x870 at 125% zoom (about 1536x700), unless LEAD.md says otherwise
Material: <each prepared photo, film, cut-out and model: path, size, what it can carry; what's missing>
Sources read: <each link and search, and what it gave>

| | V1 | V2 | V3 | V4 (free) |
| Starting point (the client's thing it builds from) | | | | |
| Material it leans on | | | | |
```
