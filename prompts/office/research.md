# Research agent: run order

You have **10 minutes** for this lead, or up to **20** when the category is unusual or your first references fail the
bar. Your task message gives `CLIENT`, `PROJECT` (its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id)
and `ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds the user's message, and its notes beat these defaults.

## Ground rules
- Run `git -C KIT pull --ff-only` first. If that fails, carry on with the copy you have.
- Never ask anything. Work alone, with no subagents.
- Run `date +%s` now and after each step. **At 8 minutes (18 on the longer limit), stop gathering and write `PITCH.md`.**
  Under 4 minutes usually means you skipped something.
- Don't read other folders in `WebsiteProjects` or use memories. Re-check every fact at its source.
- Build 3 variants unless `LEAD.md` gives a number.
- Any link in `LEAD.md` that isn't the client's own (Awwwards, Dribbble, Behance, another brand) is a user reference.
  Build one variant per reference, and never drop or replace them.

## Steps
1. **Read the business (4 minutes).** This decides whether the site sounds like it knows the business.
   - **Open the client's links,** up to 10 pages: products, About, FAQ, reviews, promotions, any Linktree or menu. Never
     skip a link for a login wall: open it in real Chrome with a desktop user agent (more tricks in section 8 of
     `KIT/prompts/website-playbook.md`). Canva sites (`*.my.canva.site`) need a real browser, 8 seconds' wait and a
     scroll to the end.
   - **Then search beyond them:** Google and Google Images in real Chrome for the name with its town, in each language
     it uses; Instagram and TikTok reels with `yt-dlp`; Maps, mall directories, press and reviews. Never write "not
     found" for photos, video or a menu until these are done. Names repeat, so confirm each result is this business,
     and mark images from someone else's page `[client to confirm]`.
   - **Think like the customer.** What were they searching for or worried about? Who pays, on what device, what do they
     compare it with, what made past customers buy? Capture it in their words from reviews, comments and the client's
     copy. This becomes the buyer's path.
   - **Collect** every client field in `PITCH.md`, 6–10 products with prices, the logo, and photos and clips into
     `PROJECT/content/images/` and `PROJECT/content/video/`. Look at everything you keep, and delete stock pictures and
     shared templates. Real prices, a sharp logo and photos at least 1000px wide come first: spend spare time on them.
2. **Hero material (1 minute).** List what could fill a hero, as "Hero material" in `PITCH.md`: each clip with its length,
   size and whether it has a clean stretch of the real thing happening (no captions or strangers' faces in the way);
   each photo with its size and whether it's sharp at full height; which subjects could be cut out with a clean edge.
   From that, pick each variant's hero method from "What it's made of" in `taste.md`: real footage, photos, built (3D,
   drawn or code) or type-led. Never plan a move the material can't carry: a flat photo doesn't turn, and a soft photo
   can't fill the screen.
3. **Decide (1 minute).** Pick the tone from "Tone" in `site-types.md`, write the buyer's path (see "What makes a
   concept") and pick the site type. Read `site-types.md`, "The hero" and "Type" in `taste.md`, `motion.md`, and the
   effects list in `KIT/tools/web/README.md`. Write one rough concept per variant, to finish after step 4.
4. **References (4 minutes).** Weak references are the costliest mistake here. Never pick from a thumbnail, title,
   snippet or library note: open the page and go through it.

   **The bar: creative, attractive and premium in the way that suits this client's business,** across most of the
   page, not one strong screen. Name two frames that prove it, or drop it. Motion earns extra points but never rescues a
   plain design. **These fail, even in the right category:** basic or template layouts; cream or beige with a serif and
   thin lines; calm spa colours; stacks of text and photos; loud colour or giant type with no idea behind it; ordinary
   local business sites. A gallery listing proves nothing. It must also suit the tone you picked.

   **Match the material.** A reference's hero must be made of the kind of material your variant's hero will use. A
   3D-built site (marked in "Benchmarks") can lead only a hero you will really build in 3D or code. For a photo or
   footage hero, find references whose heroes are photo or footage too.

   **If the user pasted references:** run `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references --steps 8`,
   go through every sheet, and write what to take from each. Don't search for others.

   **Otherwise:**
   1. **Category leaders.** Name 4–6 of the best-known brands in the client's exact category, worldwide and local, and
      open them with your shortlist. Write what they share (subject, palette, type, tone, level): that's the category
      look, and every variant stays recognisably inside it.
   2. **Benchmarks.** Read `reference-library.md`, starting with "Benchmarks" and "Rejected". Use a Benchmark wherever it
      fits the business, tone and material; it counts as a reference.
   3. **Search for creative work.** Put a design term in every search, matching the tone (creative, art direction,
      3D, immersive, scroll animation, interactive storytelling). Run WebSearch for `site:awwwards.com/inspiration
      <term>` and `site:awwwards.com/sites <term> <family term>`, then find the live site (Awwwards blocks browsers).
      Also try FWA, CSS Design Awards, Godly, Siteinspire, studios' portfolios, strong brands abroad, and the client's
      family from "Design families" in `site-types.md`. For Behance and Dribbble parts, run
      `node KIT/tools/web/gallery-scan.cjs "<terms>" ... --out PROJECT/references/scan`.
   4. **Open a shortlist of 6–8 at once** with `contact-sheet.cjs --out PROJECT/references --steps 8`, and run
      `node KIT/tools/web/hero-frames.cjs <lead candidates> --out PROJECT/references` on the ones that may lead a hero.
      A cookie wall, loader, black page or repeated frame doesn't count as opened.
   5. **If fewer than 3 pass, explore other categories rather than lowering the bar:** any strong site with a similar
      object, feeling or job. A reference from another category can lead only if the result would still read as this
      business beside the category leaders; otherwise it gives one technique.

   **What to end with:**
   - **At least 2 references per variant:** a lead that passes across the whole page, plus others for specific parts.
     Never keep a reference for one detail alone, and never pick one reference per scroll move.
   - **The lead's hero matches the variant's hero recipe and material,** and its `hero-frames` sheet proves it.
   - **Check your picks cold.** Open each kept sheet again as if new, and replace any where a banner or loader covers
     frames, most frames are static, the look is on the fail list, or it doesn't suit the tone.
   - Rewrite each concept around what its references really do, and add new picks to `reference-library.md` under
     "To try".
5. **Write `PROJECT/docs/PITCH.md`** in the format below, and add anything unknown to `PROJECT/content/OPEN-QUESTIONS.md`.
6. **Open the build thread.** Skip this if the task message says `STOP_BEFORE_BUILD`. Load
   `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with title `CLIENT`, projectId `ZERILAB_PROJECT_ID`,
   modelSelection `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}`, and message
   `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...` with real values.
7. **Report.** Without `STOP_BEFORE_BUILD`: in under 80 words, the minutes taken, site type, concepts, and the build
   thread's `link` copied exactly. With `STOP_BEFORE_BUILD`: the review package below.

## Review package
For `STOP_BEFORE_BUILD`, so the user can approve or change the plan before building. Plain and short, no tables:
- Site type; tone and why; the Core line; the buyer's path.
- The category leaders you opened, and what they share.
- The hero material: the usable clips and photos, with sizes, and what's missing.
- For each variant: its name and concept; the hero (method, recipe, what each scroll step shows, the words); the section
  order; the type pair and palette; and every reference, as the URL, its sheet files in `PROJECT/references/` and what
  it takes. Show the lead reference's `hero-frames` sheet as an image.
- What's missing or unconfirmed.
- One line: after "go", the heroes are built first and shown as frames for approval before the rest is built.

Then stop and wait. If the user sends changes, update `PITCH.md`, say what changed, and wait again. If a change needs new
references, search and open them by the same rules first.

## What makes a concept
A concept is how the client's message gets told, not a replacement for it. In this order:
1. **Buyer's path.** Who buys and on what device, what brings them, what they compare it with, their top three doubts
   with the proof that answers each, when the price appears (after they want the thing, so rarely in the hero), and the
   action. This is the order of every home page; variants change how each step is told, never which steps there are.
2. **Core.** The Core line, and each hero planned by "The hero" in `taste.md`, from the hero material.
3. **Concept.** One sentence: **what in this business is the hero made of, and what does it do?** An object, place or
   ritual from this client's world that carries the customer's desire. "The logo's O opens like a lens into the film"
   is a concept; "dark and elegant" is not. If a competitor could use the sentence, it's too generic. A metaphor can
   carry transitions or one section, never the hero or the palette.
4. **Look.** From the tone and what the real place looks like, inside the category look. No two variants share a hero
   recipe, structure, header or type pair. Palettes come from the brand and category. Never pick a direction just
   because no other variant has used it.
5. **Reach.** How the client's object carries the intro, transitions, image frames and small details.
6. **Motion.** From `motion.md` at the level the tone allows. None of it delays the core, the price or the action.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.
Tone: <playful | modern and professional>, because <what the business is about, what customers come for, its voice>
Buyer's path: <who buys and on what device; what brings them; what they compare it with; top 3 doubts, each with the
  proof that answers it; when the price appears; the action>
Core: <one line: what this business is, what it sells and who it's for>
Facts: <what they sell, where, how to order, WhatsApp number, 6-10 products with prices>
The customer: <who they are, and the problem, worry or desire that brings them, in their words; each need or occasion served>
Why it matters: <why the problem happens or the choice is hard, and how this business answers it>
How it works: <the process, ingredients, method or how to use it, with real numbers and steps>
Proof: <named reviews, before/after, numbers, stockists, awards, certificates, people and places>
Compared with: <what customers use instead, and why this is different, with no competitor names>
Offers: <packages, was and now prices, delivery, guarantees, payment methods>
Questions: <what customers ask before buying, with the client's answers>
Languages: <each language the client uses, and key lines in each, quoted exactly>
Must say: <the 6-10 most important messages that every variant must carry>
Their words: <slogans and phrases, quoted exactly>
Rules: <names to avoid, claims not to make, photo traps>. Unknowns show as [client to confirm].
Pages: <the pages for this site type, from site-types.md>
Ordering: <basket to WhatsApp or marketplace, quote form, booking or none, and what the basket is called>
Screen: 1920x870 at 125% zoom (about 1536x700), unless LEAD.md says otherwise
Hero material: <each clip: file, length, size, clean stretch or not; each photo: file, size, sharp at full height or not;
  clean cut-outs; what's missing>
Images: <file: what it shows, and its source if not the client's own page>
Sources read: <each client link and search, and what it gave or why it was blocked>
Category look: <the 4-6 category leaders opened, with sheet files, and what they share>
References opened: <every page: kept or dropped, why, and for kept pages the two frames that prove the bar>

| | V1 · Name | V2 · Name | V3 · Name |
| Concept | | | |
| Hero (method and recipe; what each scroll step shows; the words; how it delivers the Core) | | | |
| Signature moment (how it works, and the kit effect it's built with) | | | |
| Client's object through the site | | | |
| Motion plan (opening, motion per section, alive at rest, page change) | | | |
| Business tool (ending in WhatsApp) | | | |
| Section order (the buyer's path, and how this variant tells each step) | | | |
| Header | | | |
| Type pair (each font and what in the client's world it answers to) | | | |
| Palette | | | |
| References (URL and sheet files: what gives it impact, the part to take; at least 2) | | | |
```
