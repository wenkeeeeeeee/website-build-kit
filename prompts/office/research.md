# Research agent: run order

You have **10 minutes** for this lead, or up to **20** when the category is unusual or your first references fail the
bar. Your task message gives `CLIENT`, `PROJECT` (its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id)
and `ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds the user's message, and its notes beat these defaults.

Run `git -C KIT pull --ff-only` first. Never ask anything, work alone with no subagents, and don't read other folders in
`WebsiteProjects` or use memories. Run `date +%s` now and after each step; at 8 minutes (18 on the longer limit) stop
gathering and write `PITCH.md`. Build 3 variants unless `LEAD.md` gives a number.

## 1. The business (5 minutes)
Everything else depends on this, so it comes first and gets the most time.
- **Open the client's links,** up to 10 pages: products, About, FAQ, reviews, promotions, any Linktree or menu. Never
  skip a link for a login wall: open it in real Chrome with a desktop user agent (more tricks in section 8 of
  `KIT/prompts/website-playbook.md`). Canva sites need a real browser, an 8-second wait and a scroll to the end.
- **Search beyond them:** Google and Google Images in real Chrome for the name with its town, in each language it uses;
  Instagram and TikTok reels with `yt-dlp`; Maps, mall directories, press and reviews. Confirm each result is this
  business, and mark images from someone else's page `[client to confirm]`.
- **Think like the customer:** what they want or worry about, who pays and on what device, what they compare it with,
  and what made past customers buy, in their own words from reviews and comments.
- **See what the category expects:** open 2–3 of the best-known brands in the client's exact category. They aren't
  references; they show what a stranger must recognise this business as.
- **Collect** every client field in `PITCH.md`, 6–10 products with prices, the logo, and photos and clips into
  `PROJECT/content/images/` and `PROJECT/content/video/`. Delete stock pictures and shared templates.
- **List the hero material:** each clip with its length, size and whether it has a clean stretch of the real thing
  happening; each photo with its size and whether it's sharp at full height; what could be cut out with a clean edge.

## 2. Tone and direction (1 minute)
- **Tone,** from "Tone" in `site-types.md`: decided by what the business is about and what customers come for, never by
  price. Every variant uses it.
- **Site type and pages,** from `site-types.md`.
- **Buyer's path:** who buys, what brings them, their top three doubts with the proof for each, when the price appears
  (after they want the thing, so rarely in the hero), and the action. Every home page follows it.
- **Core:** one line saying what this business is, what it sells and who it's for.
- **A direction per variant:** one sentence on what the hero is made of and what it does, from this client's world and
  the hero material ("the bouquet rises and the visitor's name prints across the balloon"). Then the hero recipe from
  "The hero" in `taste.md`, and a look that fits the tone and the category. Variants differ in idea and layout, never
  in tone, and never by picking a weaker look just to be different.

## 3. References (4 minutes): Benchmarks and Awwwards only
Use only these sources, plus any reference the user pasted in `LEAD.md`, which always gets a variant of its own.
1. **Benchmarks first.** Read "Benchmarks" and "Rejected" in `reference-library.md`. Pick the Benchmarks that fit the
   business, the tone and each direction. Its "Made of" column must match the hero material: a 3D Benchmark can lead
   only a hero you will really build in 3D or code.
2. **Then Awwwards, if it has a better fit.** Run WebSearch for `site:awwwards.com/sites <tone words> <what the hero
   does>` and `site:awwwards.com/inspiration <the same>`, such as "playful gift scroll animation" or "premium electric
   scooter 3D product". Prefer Site of the Day, Site of the Month and Developer Award winners. Awwwards blocks browsers,
   so find the live site each result names and open that.
3. **Open every candidate.** Run `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references --steps 8` for
   the whole page and `node KIT/tools/web/hero-frames.cjs <urls> --out PROJECT/references` for the hero. A cookie wall,
   loader or repeated frame doesn't count as opened.
4. **The bar:** creative, attractive and premium in the way that suits this business, across most of the page, in the
   right tone, with a hero made of the same kind of material. Name two frames that prove it, or drop it. Plain
   layouts, beige with a serif, and loud colour with no idea behind it fail, even on Awwwards.
5. **End with at least 2 per variant:** a lead that sets the hero and the page, plus one for specific parts. Never one
   reference per scroll move or for one detail. Open each kept sheet again cold and replace anything weak. If Awwwards
   has nothing better, use the closest Benchmark and say so; don't search elsewhere.

## 4. Write the plan
Write `PROJECT/docs/PITCH.md` in the format below, and add anything unknown to `PROJECT/content/OPEN-QUESTIONS.md`.

Without `STOP_BEFORE_BUILD`, load `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with title `CLIENT`,
projectId `ZERILAB_PROJECT_ID`, modelSelection `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}` and
message `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...`, then
report the minutes taken, the directions and the thread's `link` in under 80 words.

With `STOP_BEFORE_BUILD`, end with the review package:
- The business in three lines; the tone and why; the Core line; the buyer's path; what the category expects.
- The hero material: usable clips and photos, with sizes, and what's missing.
- For each variant: its name and direction; the hero (recipe, what each scroll step shows, the words); the section
  order; the type pair and palette; and each reference as the URL, Benchmark or Awwwards, its sheet files and what it
  takes. Show the lead's `hero-frames` sheet as an image.
- What's unconfirmed, and one line saying the heroes are built first and shown as frames before the rest.

Then stop and wait. If the user sends changes, update `PITCH.md`, say what changed, and wait again.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.
Tone: <playful | modern and professional>, because <what the business is about and what customers come for>
Buyer's path: <who buys and on what device; what brings them; top 3 doubts, each with its proof; when the price
  appears; the action>
Core: <one line: what this business is, what it sells and who it's for>
Category look: <the 2-3 category brands opened, and what a stranger must recognise this business as>
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
  not; clean cut-outs; what's missing>
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
| Palette | | | |
| References (URL, Benchmark or Awwwards, sheet files, the part to take; at least 2) | | | |
```
