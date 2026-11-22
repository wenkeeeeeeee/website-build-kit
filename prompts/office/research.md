# Research agent: run order

You have **15 minutes** for this lead, or up to **25** when the category is unusual or its leaders fail the level. Your task message gives `CLIENT`, `PROJECT` (its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id) and
`ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds the user's message; its notes beat these defaults.

Run `git -C KIT pull --ff-only` first. Never ask anything; work alone, no subagents. Rules conflict? "Which rule wins"
in `KIT/AGENTS.md`. Don't read other `WebsiteProjects` folders or use memories, except the variant names, directions and
references in their `docs/PITCH.md`, read only so no idea repeats and no Benchmark leads for a third client in a row. Run `date +%s` now and after each step; at 13 minutes (23 on the longer limit) stop gathering and write
`PITCH.md`. Build 3 variants plus 1 free variant unless `LEAD.md` gives a number.

## 1. The business (5 minutes)
Everything depends on this, so it comes first and gets the most time.
- **Open the client's links,** up to 10 pages: products, About, FAQ, reviews, promotions, any Linktree or menu. Never skip
  one for a login wall: open it in real Chrome with a desktop user agent. Canva sites need a real browser, an 8-second
  wait and a scroll to the end. More tricks: section 8 of `KIT/prompts/website-playbook.md`.
- **Search beyond them** as section 8 of the playbook says.
- **Think like the customer:** what they want or worry about, who pays and on what device, what they compare it with,
  what made past customers buy, in their own words from reviews and comments.
- **Set the target and read the category's best** ("Direction" in `site-types.md`): the user's words first, otherwise
  the best-known brands in the client's exact category at the level the user wants, often above where the client is
  today. Open 3–5 of them and capture each into `PROJECT/references/category/` (`contact-sheet.cjs --steps 8` and
  `hero-frames.cjs`). Drop any that fail "The bar" in `level.md`; if fewer than three pass, add the best of a
  neighbouring business ("Direction" in `site-types.md`). Not references: write what the ones that pass actually do as
  "Category look" (type, photography, background and colour, space, motion, copy voice, and what makes them feel
  expensive or trusted). It is the brief every builder gets and the register every variant is judged against.
- **Pick the Level:** 2–3 sites from `KIT/prompts/office/level.md`, chosen by what this client's hero will be made of
  (a person, a product, food, a place) and then by business, as its "How to use it" says. Capture their heroes into
  `PROJECT/references/level/` with `hero-frames.cjs`. They show how good every hero must be; any site in the set may
  also be a variant's lead target (step 3).
- **Collect** every client field in `PITCH.md`, 6–10 products with prices, the logo, and photos and clips into
  `PROJECT/content/images/` and `PROJECT/content/video/`. Delete stock pictures and shared templates. The client's
  posts give facts, products and voice, never the look or level.
- **List the hero material:** each clip's length, size and whether it has a clean stretch of the real thing happening;
  each photo's size and whether it's sharp at full height; what could be cut out with a clean edge. Then compare it with
  the Level and Category look imagery and note the gap and the fix ("Material against the target" in `taste.md`).

## 2. Direction and ideas (5 minutes)
- **Direction:** the Category look, the tone hint and 3–5 character words for this client at the target level
  ("Direction" in `site-types.md`). Every variant uses them, and every builder is briefed with all three.
- **Site type and pages:** `site-types.md`.
- **Buyer's path:** who buys, what brings them, their top three doubts with the proof for each, when the price appears
  (after they want the thing, so rarely in the hero, but within about 1.5 screens), and the action. Every home page follows it.
- **Core:** one line: what this business is, what it sells, who it's for.
- **Story:** the story the client wants to tell in one sentence, and what visitors need to see or feel to believe it.
  It drives every variant.
- **Inspiration (2 minutes).** Browse for fresh thinking well beyond websites: Behance and Dribbble case studies,
  Instagram brand posts, ad campaigns, packaging, film title sequences, exhibitions and magazine spreads, for this
  category, its neighbours and anything that shares the customer's feeling. Note 3–5 striking finds in `PITCH.md` under
  "Inspiration", each with its link and the one thought worth taking. Take the thought, never the look.
- **Ideas:** about 10 one-line "what if" ideas built around the story, the client's world (its material, shape, tools
  or setting) and what the customer decides or does (the run-sheet as the scroll, the menu as a record crate, sizing as
  a fitting room), drawing on the Inspiration notes. Playful: anything from a beautiful classic site to a map, a game, a
  3D room or a card pack. Modern and professional or luxury: ideas that explain, guide or show the real thing (a route,
  a before-and-after, a calculator), with no games, toys, props or rituals. Take at least one from outside the web.
  Keep the 4 strongest that a customer would find useful and remember; one that could sit on any business in the
  category gets replaced.
- **The free variant (always last):** your own idea from the client's own object, something we haven't built before,
  in the client's tone (a game only for a playful client), still at the level. A stranger must still see this business
  at a glance, and it carries the same content, prices and action.

## 3. Targets and looks (4 minutes)
Builders do their best work aiming at real sites, not at a list of rules. Each variant gets two concrete targets,
different from the other variants' targets.
1. **Two targets per variant, the free variant included:** a **lead**, whose hero staging, scale and motion the variant
   adapts, and a **second** that lends one part (a transition, a section, a type treatment). A reference the user pasted
   in `LEAD.md` is a lead and gets its own variant.
2. **Where to find them:** the level set in `level.md` (any group whose staging suits the idea, not only the client's
   own group), the Benchmarks in `reference-library.md` (respect "Craft only", "No back-to-back reuse" and "Rejected"),
   and Awwwards: WebSearch `site:awwwards.com/sites <tone words> <what the hero does>` and
   `site:awwwards.com/inspiration <the same>`, such as "playful gift scroll animation" or "premium electric scooter 3D
   product". Prefer Site of the Day, Site of the Month and Developer Award winners. Awwwards blocks browsers: open the
   live site each result names.
3. **Open every candidate.** Run `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references --steps 8` for the
   whole page and `node KIT/tools/web/hero-frames.cjs <urls> --out PROJECT/references` for the hero. A cookie wall,
   loader or repeated frame doesn't count as opened.
4. **The bar:** each target passes "The bar" in `level.md`, suits this business and tone, and has a hero made of similar
   material (photos for photos, a product for a product, a person for a person). Name two frames that prove it, or drop
   it.
5. **Looks as one set.** No two variants share a lead, and the four leads stage their subject differently. For each
   variant write its look: what the lead lends (staging, scale, motion), what from the client's world the hero is built
   with ("The look is made from the client's world" in `taste.md`), and the variant's own colour, kind of display type
   and place for the words. Never a target's images, colours, copy or logo; with the logo hidden, the variant must not
   pass for its lead. If two looks would look alike with the colours hidden, change a lead. Header, section order and
   components may be shared when that's strongest.
6. **The hero per variant:** what it's made of (from the hero material, or the fix in "Material against the target" in
   `taste.md`), the look, and the hero recipe from "The hero" in `taste.md`.

## 4. Write the plan
Write `PROJECT/docs/PITCH.md` in the format below; add unknowns to `PROJECT/content/OPEN-QUESTIONS.md`.

Without `STOP_BEFORE_BUILD`: load `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with title `CLIENT`,
projectId `ZERILAB_PROJECT_ID`, modelSelection `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}` and
message `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...`, then
report the minutes taken, the looks and the thread's `link` in under 80 words.

With `STOP_BEFORE_BUILD`, end with the review package:
- The business in three lines; the target, the Category look (with the leaders' hero sheets), the Level sites and the character; the Core and Story lines; the buyer's path; what the category expects.
- The hero material: usable clips and photos with sizes, and what's missing.
- Per variant: name, its look and the idea below the hero; the hero (recipe, what each scroll step shows, the words);
  section order; type pair and palette; its two targets with their sheet files and what each lends. Show the Level
  and lead `hero-frames` sheets as images.
- What's unconfirmed, and one line saying the heroes are built first and shown as frames before the rest.

Then stop and wait. If the user sends changes, update `PITCH.md`, say what changed, and wait again.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.
Target: <who this client should be seen beside, from the user's words or the category's best, and at what level>
Category look: <the 3-5 brands opened, with URLs and sheet files; what they do: type (size, case, weight, style),
  photography (subject, light, crop, size on screen), background and colour, space and density, motion, copy voice;
  what makes them feel expensive or trusted. Every builder gets this, and every variant is judged beside it>
Level: <the 2-3 sites from level.md matching what the hero is made of, with URLs and hero sheet files in
  references/level/; they beat the Category look on type scale, colour confidence, staging and space>
Tone hint: <playful | modern and professional | luxury and premium>, for motion and interaction levels only
Character: <3-5 words for how this client should feel at the target level, from the Category look and the user's
  words, checked against the client's facts>
Buyer's path: <who buys and on what device; what brings them; top 3 doubts, each with its proof; when the price
  appears; the action>
Core: <one line: what this business is, what it sells and who it's for>
Story: <the client's story in one sentence, and what visitors need to see or feel to believe it>
Inspiration: <3-5 finds from beyond websites, each with its link and the thought or technique taken>
Ideas: <the ~10 "what if" lines; mark the 4 kept>
Facts: <what they sell, where, how to order, WhatsApp number, 6-10 products with prices>
The customer: <who they are, and the problem, worry or desire that brings them, in their words>
How it works: <the process, ingredients, method or how to use it, with real numbers and steps>
Proof: <named reviews, before/after, numbers, stockists, awards, certificates, people and places>
Offers: <packages, was and now prices, delivery, guarantees, payment methods>
Questions: <what customers ask before buying, with the client's answers>
Languages: <each language the client uses, and key lines in each, quoted exactly>
Must say: <the 6-10 most important messages that every variant must carry>
Their words: <slogans and phrases, quoted exactly>
Rules: <names to avoid, claims not to make, photo traps>. Unknowns show as [client to confirm].
Pages: <the pages for this site type, from site-types.md>
Ordering: <basket to WhatsApp or marketplace, quote form, booking or none, and what the basket is called>
Screen: 1920x870 at 125% zoom (about 1536x700), unless LEAD.md says otherwise
Hero material: <each clip: file, length, size, clean stretch or not; each photo: file, size, sharp at full height or
  not; clean cut-outs; what's missing; against the Level and Category look imagery: the gap and the fix (a product:
  faithful renders; people and places: the best single photo and a shoot list)>
Sources read: <each client link and search, and what it gave or why it was blocked>
References opened: <every page: Benchmark or Awwwards, kept or dropped, why, and the two frames that prove the bar>

| | V1 · Name | V2 · Name | V3 · Name | V4 · Name (free) |
| Idea (one line, from the client's world) | | | | |
| Lead target (URL; level set, Benchmark or Awwwards; sheet files; what it lends: staging, scale, motion) | | | | |
| Second target (URL; sheet files; the one part it lends) | | | | |
| Look (what the lead lends, built from the client's world; the variant's own colour, kind of display type and place for the words) | | | | |
| Hero (what it's made of; recipe; what each scroll step shows; the one motion idea; the words) | | | | |
| Signature moment (how it works, and the kit effect it's built with) | | | | |
| Client's world below the hero | | | | |
| Motion plan (opening, one main thing per section, alive at rest, page change) | | | | |
| Business tool (ending in WhatsApp; may be shared) | | | | |
| Section order (the buyer's path; may be shared) | | | | |
| Header (may be shared) | | | | |
| Type pair (each font and what in the client's world it answers to) | | | | |
| Palette (V1, V2: one decided colour or family from the subject's world owning the first screen, no clashing accent; V3, V4 if they use `colour.md`: the mood pair, the accent and where it goes, picked from 3-5 candidates tried on the hero material, with why) | | | | |```
