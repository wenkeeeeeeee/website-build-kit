# Research agent: run order

You have **13 minutes** for this lead, or up to **23** when the category is unusual or your first references fail the
bar. Your task message gives `CLIENT`, `PROJECT` (its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id) and
`ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds the user's message; its notes beat these defaults.

Run `git -C KIT pull --ff-only` first. Never ask anything; work alone, no subagents. Rules conflict? "Which rule wins"
in `KIT/AGENTS.md`. Don't read other `WebsiteProjects` folders or use memories, except the variant names, directions and
references in their `docs/PITCH.md`, read only so no idea repeats and no Benchmark leads for a third client in a row. Run `date +%s` now and after each step; at 11 minutes (21 on the longer limit) stop gathering and write
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
  `hero-frames.cjs`). Not references: write what they actually do as "Category look" (type, photography, background and
  colour, space, motion, copy voice, and what makes them feel expensive or trusted). It is the brief every builder
  gets and the level every variant is judged against.
- **Collect** every client field in `PITCH.md`, 6–10 products with prices, the logo, and photos and clips into
  `PROJECT/content/images/` and `PROJECT/content/video/`. Delete stock pictures and shared templates. The client's
  posts give facts, products and voice, never the look or level.
- **List the hero material:** each clip's length, size and whether it has a clean stretch of the real thing happening;
  each photo's size and whether it's sharp at full height; what could be cut out with a clean edge. Then compare it with
  the Category look's imagery and note the gap and the fix ("Material against the target" in `taste.md`).

## 2. Direction, inspiration and ideas (4 minutes)
- **Direction:** the Category look, the tone hint and 3–5 character words for this client at the target level
  ("Direction" in `site-types.md`). Every variant uses them, and every builder is briefed with all three.
- **Site type and pages:** `site-types.md`.
- **Buyer's path:** who buys, what brings them, their top three doubts with the proof for each, when the price appears
  (after they want the thing, so rarely in the hero, but within about 1.5 screens), and the action. Every home page follows it.
- **Core:** one line: what this business is, what it sells, who it's for.
- **Story:** the story the client wants to tell in one sentence, and what visitors need to see or feel to believe it.
  It drives every variant.
- **Look for inspiration first (3 minutes).** Before writing ideas, browse for fresh thinking well beyond websites:
  Behance and Dribbble case studies, Instagram brand posts, ad campaigns, packaging, film title sequences, exhibitions
  and magazine spreads, for this category, its neighbours and anything that shares the customer's feeling. Note 3–5
  striking finds in `PITCH.md` under "Inspiration", each with its link and the one thought or technique worth taking (a
  way of showing the product, a story device, a type or image treatment). Take the thought, never the look, layout or
  imagery.
- **Ideas before references.** Write 10 one-line "what if" ideas, drawing on the Inspiration notes, built around the story and what the customer decides
  or does (the menu as a record crate, sizing as a fitting room), in the tone. Playful: anything from a beautiful classic
  site to a map, a game, a 3D room or a card pack. Modern and professional or luxury: ideas that explain, guide or show
  the real thing (a fitting room, a route, a before-and-after, a calculator), with no games, toys, props or rituals.
  Take at least one from outside the web: a poster, packaging, a film title sequence, an album cover, a magazine spread.
  Pick the 3 strongest that fit the tone, plus the free one: ideas a customer would find useful and remember. An idea
  that could sit on any business in the category gets replaced.
- **A direction per idea:** one sentence on what the hero is made of and does, from this client's world and the hero
  material. Then the hero recipe from "The hero" in `taste.md`, and a look inside the Category look and the character. Variants differ in idea and layout, never in tone, and never
  by picking a weaker look just to be different.
- **The free variant (always last):** your own idea from the client's own object, something we haven't built before,
  in the client's tone (a game only for a playful client). It needs no reference; its freedom is in the idea, not the
  tone. A stranger must still see this business at a glance, and it carries the same content, prices and action.

## 3. References (4 minutes): techniques for each idea, from Benchmarks and Awwwards only
References come after the ideas. They lend a motion or craft technique to make each idea look and move well; they never
set its layout, section order, hero, colour or imagery, and the level comes from the category leaders. Only these
sources, plus any reference the user pasted in `LEAD.md`, which always gets its own variant.
1. **Benchmarks.** Read "Benchmarks" and "Rejected" in `reference-library.md` and pick the Benchmarks whose craft
   serves each direction in this tone. Their "Made of" must match the hero material. Respect "Craft only" and "No
   back-to-back reuse" there.
2. **Awwwards, whenever it has the technique the idea needs.** WebSearch `site:awwwards.com/sites <tone words> <what the hero does>` and
   `site:awwwards.com/inspiration <the same>`, such as "playful gift scroll animation" or "premium electric scooter 3D
   product". Prefer Site of the Day, Site of the Month and Developer Award winners. Awwwards blocks browsers: open the
   live site each result names.
3. **Open every candidate.** Run `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references --steps 8` for the
   whole page and `node KIT/tools/web/hero-frames.cjs <urls> --out PROJECT/references` for the hero. A cookie wall,
   loader or repeated frame doesn't count as opened.
4. **The bar:** creative, attractive and premium in the way that suits this business, across most of the page, in the
   right tone, with a hero made of the same kind of material. Name two frames that prove it, or drop it. Plain layouts,
   beige with a serif, and loud colour with no idea behind it fail, even on Awwwards.
5. **End with at least 2 per variant** (the free variant needs none; it takes one only if it helps the craft): a lead
   whose craft the variant borrows most, plus one for specific parts. Name the one or two techniques to take from each (a transition, a
   type treatment, how the scroll is paced). If a reference's layout seems better than the idea, rethink the idea; don't
   adopt the layout. Never one reference per scroll move or detail. Reopen each
   kept sheet cold and replace anything weak. If Awwwards has nothing better, use the closest Benchmark and say so;
   don't search elsewhere.

## 4. Write the plan
Write `PROJECT/docs/PITCH.md` in the format below; add unknowns to `PROJECT/content/OPEN-QUESTIONS.md`.

Without `STOP_BEFORE_BUILD`: load `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with title `CLIENT`,
projectId `ZERILAB_PROJECT_ID`, modelSelection `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}` and
message `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...`, then
report the minutes taken, the directions and the thread's `link` in under 80 words.

With `STOP_BEFORE_BUILD`, end with the review package:
- The business in three lines; the target, the Category look (with the leaders' hero sheets) and the character; the Core and Story lines; the buyer's path; what the category expects.
- The hero material: usable clips and photos with sizes, and what's missing.
- Per variant: name and the idea behind it; the hero (recipe, what each scroll step shows, the words); section order;
  type pair and palette; each reference as URL, Benchmark or Awwwards, its sheet files and the technique it gives. Show the lead's
  `hero-frames` sheet as an image.
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
Tone hint: <playful | modern and professional | luxury and premium>, for motion and interaction levels only
Character: <3-5 words for how this client should feel at the target level, from the Category look and the user's
  words, checked against the client's facts>
Buyer's path: <who buys and on what device; what brings them; top 3 doubts, each with its proof; when the price
  appears; the action>
Core: <one line: what this business is, what it sells and who it's for>
Story: <the client's story in one sentence, and what visitors need to see or feel to believe it>
Inspiration: <3-5 finds from beyond websites, each with its link and the thought or technique taken>
Ideas: <the 10 "what if" lines; mark the 3 picked and the free one>
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
  not; clean cut-outs; what's missing; against the Category look's imagery: the gap and the fix (new shots with a shot
  list, or faithful renders of the real product)>
Sources read: <each client link and search, and what it gave or why it was blocked>
References opened: <every page: Benchmark or Awwwards, kept or dropped, why, and the two frames that prove the bar>

| | V1 · Name | V2 · Name | V3 · Name |
| Direction | | | |
| Hero (recipe; what each scroll step shows; the motion graphics; the words) | | | |
| Signature moment (how it works, and the kit effect it's built with) | | | |
| Client's object through the site | | | |
| Motion plan (opening, motion per section, alive at rest, page change) | | | |
| Business tool (ending in WhatsApp) | | | |
| Section order (the buyer's path, and how this variant tells each step) | | | |
| Header | | | |
| Type pair (each font and what in the client's world it answers to) | | | |
| Palette (from the client's world; V3 and V4 only, if they use `colour.md`: the mood pair, the accent and where the accent goes, picked from 3-5 candidates tried on the hero material, with why) | | | |
| References (URL, Benchmark or Awwwards, sheet files, the technique to take; at least 2) | | | |
```
