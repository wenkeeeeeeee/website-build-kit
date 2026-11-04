# Research agent: run order

You have **10 minutes** for this lead, or up to **20** when the category is unusual or your first references fail the
bar, so skim and decide as a person would. Your task message gives `CLIENT`, `PROJECT`
(its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id) and `ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds
the user's message, and its notes beat these defaults.

## Ground rules
- Run `git -C KIT pull --ff-only` first. If that fails, carry on with the copy you have.
- Nobody is watching, so never ask anything. Work alone, with no subagents.
- Run `date +%s` now and after each step. **At 8 minutes (18 on the longer limit), stop gathering and write `PITCH.md`.**
- Quick is the goal, but shallow is a failure: under 4 minutes usually means you skipped something.
- Don't read other folders in `WebsiteProjects` or use memories. Re-check every fact at its source.
- Build 3 variants unless `LEAD.md` gives a number.
- Any link in `LEAD.md` that isn't the client's own (Awwwards, Dribbble, Behance, another brand) is a user reference.
  Build one variant per reference, and never drop or replace them.

## Steps
1. **Read for context (4 minutes).** This decides whether the site sounds like it knows the business.
   - **Open the client's links,** up to 10 pages: product pages, About, FAQ, reviews, promotions, and any Linktree or
     menu link. Use web fetch or one headless browser script.
   - **Never skip a link for a login wall.** Open it in real Chrome with a desktop user agent: Facebook and Instagram
     still show the bio, links and some photos. Other tricks are in section 8 of `KIT/prompts/website-playbook.md`; read
     only that section.
   - **Canva sites** (`*.my.canva.site`) need a real browser: wait 8 seconds, scroll to the end, collect the image URLs,
     and open one or two to read the prices.
   - **Then always search beyond the client's links, before any concept:** Google and Google Images in real Chrome for
     the business name with its town, in each language it uses; Instagram and TikTok reels with sound using `yt-dlp`;
     Linktree, Maps, mall directory, press, blogs and reviews. Never write "not found" for photos, video or a menu until
     these are done.
   - **Check what you find.** Names repeat, so confirm each result is this business. The client's own menu and posts
     beat snippets. Note where each found image came from, and mark any from someone else's page `[client to confirm]`,
     because using it needs permission.
   - **Think like the customer.** What were they searching for or worried about before finding this business? Who pays,
     on what device, what do they compare it with, and what made past customers buy? Capture it in their words, from
     reviews, comments and the client's copy. This becomes the buyer's path.
   - **Collect** every client field in `PITCH.md`, 6–10 products or dishes with prices, the logo and 6–8 usable photos.
     Save images to `PROJECT/content/images/`. Look at every photo you keep, and delete any stock picture or shared menu
     template. Don't download everything or read a whole catalogue.
   - **Before moving on, you need real prices, a sharp logo and photos at least 1000px wide.** If any is missing, spend
     the spare time on it, up to the gathering limit. Menus are often the best source of prices and sharp photos.
2. **Decide (1 minute).** Pick the tone from "Tone" in `KIT/prompts/office/site-types.md` and write the buyer's path (see
   "What makes a concept"). Read `KIT/prompts/office/site-types.md`, the "The hero", "What the approved sites do" and
   "Type" parts of `taste.md`, `KIT/prompts/office/motion.md`, and the effects list in `KIT/tools/web/README.md`. Pick the
   site type, or split the variants across two if the evidence honestly points both ways. Write one rough concept per
   variant, to finish after step 3.
3. **References (4 minutes).** Weak references are the costliest mistake here. **Never pick from a thumbnail, title,
   snippet or library description: open the page and go through it first.**

   **The bar: always creative, attractive and premium, in the way that suits this client's business.** Fitting the
   client's category never makes up for missing this. A reference passes only if its sheet shows:
   - **Creative:** a real idea in its layout, imagery or art direction, not a template.
   - **Attractive:** real visual impact, a site you'd remember and want to show someone.
   - **Premium for this business:** high-end craft at the right level. A snack brand and a private clinic look premium
     in different ways.

   Name two frames or parts that prove this. If you can't, drop it, however well it fits. It must also suit the tone you
   picked: a playful reference can't lead a professional client, or the other way round.

   **Motion earns extra points but isn't required.** A strong design with little animation can pass. When two references
   are otherwise equal, pick the one with stronger animation and motion graphics. Motion never rescues a plain design.

   **These fail, even in the right category:** anything basic or plain; template layouts; cream or beige with a serif and
   thin lines; calm spa colours; stacks of text and photos; loud colours or giant type with no real idea behind them;
   ordinary local business sites. A gallery listing proves nothing, so the bar applies to anything from Awwwards too.

   **If the user pasted references:** run `node KIT/tools/web/contact-sheet.cjs <all reference urls> --out PROJECT/references
   --steps 8` once, go through every sheet, and write what to take from each. If one is blocked, use web fetch for its
   description. Don't search for others.

   **Otherwise, always search, even if the library has something close:**
   1. **Open the category's leaders first.** Name 4–6 of the best-known brands in the client's exact category, worldwide
      and local, and open them in the same `contact-sheet.cjs` run as your shortlist (step 7). Write in `PITCH.md` what
      they share: subject, palette, type, tone and level. That's the category look, and every variant stays recognisably
      inside it.
   2. **Search for creative work, not just the category.** Category words alone find plain sites, so put a design term in
      every search, matching the tone: creative, art direction, 3D, immersive, scroll animation, interactive
      storytelling, plus the tone's words from `site-types.md`. Run WebSearch for
      `site:awwwards.com/inspiration <design term>` and `site:awwwards.com/sites <design term> <family term>`, 1–2 per
      variant, then find the live site each good result describes. Awwwards blocks browsers, so don't open it directly.
   3. **Don't stop at Awwwards, Behance and Dribbble.** They're starting points, and a reference can come from anywhere if
      it suits. Try FWA, CSS Design Awards, Godly, Siteinspire, design studios' own portfolios and strong brands abroad.
   4. Add the client's family from "Design families" in `site-types.md`, because designs travel between categories that
      sell the same way.
   5. Read `reference-library.md`, starting with "Benchmarks" and "Rejected". Use a Benchmark whenever it fits the
      client's business and tone: open it like the rest, and it counts as a reference. Other entries are only leads.
   6. Run `node KIT/tools/web/gallery-scan.cjs "<terms>" "<terms>" ... --out PROJECT/references/scan` (about 15 seconds) for
      Behance and Dribbble parts. It prints each project's URL.
   7. Open a shortlist of 6–8 at once:
      `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references --steps 8` (about 2 minutes, one sheet per page).
      Go through every sheet top to bottom. A cookie wall, loader, black page or repeated frame doesn't count as opened,
      so drop that page.
   8. Keep a page only if it passes the bar across the whole page, not just one strong screen: most frames must clear it.
      Name what gives it impact (scale, imagery, colour, composition), then the part to take, and how both would tell this
      client's story. A reference from another category can lead a variant only if the result would still read as this
      business beside the category leaders. Otherwise it gives one technique, such as a transition, layout or motion. Take
      its impact and craft, not its subject: the finished site still looks like the client's own business.
   9. **If fewer than 3 pass, or what you have is weak, explore other categories instead of lowering the bar.** Look for any
      strong site with a similar object, feeling or job. A physio could learn from sports, cars, medical devices, biotech,
      fashion or product launches. The category look from step 1 still holds. Keep going until the gathering limit, then
      use what passes and note the gap.

   **What to end with:**
   - **At least 2 references per variant:** a lead that passes the bar across the whole page, plus others for specific
     parts. A reference is never kept for one detail alone. They're sources to take from, not sites to copy, and one can
     feed two variants.
   - **Benchmarks and new finds both count.** Use Benchmarks where they fit the business and tone, and search for new
     ones wherever they don't. If you're short, keep searching until the limit rather than noting the gap early.
   - **Check your picks cold.** Before writing `PITCH.md`, open each kept reference's sheet again as if you'd never seen
     it. Drop and replace any where a cookie banner, loader or pop-up covers frames, most frames are static text and
     photos, the look is on the fail list, or it doesn't suit the tone. Say in "References opened" that you did this.
   - **Every variant is led by a reference that passes the bar.** One can lead two variants if it truly suits both. Prefer
     a live site, because it shows how a page behaves. A strong Behance or Dribbble still can lead too, if `PITCH.md` pairs
     it with a live site or says how the page will move.
   - **If the product suits a scroll-driven hero** ("Scroll in the hero" in `taste.md`), at least one lead reference shows
     a strong one, and the sheet frames prove it.
   - Rewrite each rough concept around what its references really do, and add your picks to `reference-library.md` under
     "To try".
4. **Write `PROJECT/docs/PITCH.md`** in the format below, and add anything unknown to `PROJECT/content/OPEN-QUESTIONS.md`.
5. **Open the build thread.** Skip this if the task message says `STOP_BEFORE_BUILD`. Load
   `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with:
   - title: `CLIENT`
   - projectId: `ZERILAB_PROJECT_ID`
   - modelSelection: `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}`, so builders get the best model
   - message: `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...` with the
     real values.
6. **Report.** Without `STOP_BEFORE_BUILD`: in under 80 words, the minutes taken, site type, the concepts, and the build
   thread's `link` copied exactly. With `STOP_BEFORE_BUILD`: the review package below, because the user checks it
   before anything is built.

## Review package
For `STOP_BEFORE_BUILD`, so the user can approve or change the plan before building. Plain and short, no tables:
- Site type; tone and why; the Core line; the buyer's path.
- The category leaders you opened, and what they share.
- For each variant: its name and concept; the hero (what the customer sees, the scroll steps if any, the words); the
  section order; the type pair and palette; and every reference it uses, as the URL, its sheet file in
  `PROJECT/references/` and what it takes from it.
- What's missing or unconfirmed, such as photos, prices or claims.

Then stop and wait. If the user sends changes, update `PITCH.md`, say what changed, and wait again. If a change needs new
references, search and open them by the same rules first.

## What makes a concept
A concept is how the client's message gets told, not a replacement for it. Work in this order:
1. **Buyer's path.** Write it from what you found about the customer: who buys and on what device, what brings them,
   what they compare it with, their top three doubts with the proof that answers each, when the price appears (after
   the customer wants the thing, so rarely in the hero), and the
   action. This is the order of every home page. Every variant tells the same complete content along it; the concept
   changes how each step is told, never which steps there are.
2. **Core.** Write the Core line, and plan each hero by "The hero" in `taste.md`. If an idea looks good but hides the
   core or crowds the hero, change the idea.
3. **Concept.** One sentence: **what in this business is the hero made of, and what does it do?** It must be an object,
   place or ritual from this client's world that carries the customer's problem or desire. "The logo's O opens like a
   lens into the film" and "Every room is a magazine cover" are concepts. "Dark and elegant" is not. If a competitor
   could use the sentence, it's too generic. The hero shows what the customer came for, as "Show what the customer
   came for" in `taste.md` says: the product, the service and its result, the dish, or the change the product makes. A
   metaphor (a road, a ledger, a stage) can carry transitions or one section, never the hero or the palette.
4. **Look.** Use the tone from step 2 of the run order. Design from what the real place looks like, with real footage and photos leading, not from the logo or
   poster colours. Stay inside the category look. No two variants may share a structure, header or type pair. Palettes
   can share the brand's colours and differ in proportion and accent. They come from the brand and the category look,
   never from a metaphor. Variants differ in idea and layout first: a weaker or off-category look is never the price
   of being different, so never pick a direction just because no other variant has used it.
5. **Reach.** Say how the object carries the intro, transitions, image frames and small details, in every variant. If a
   section still works with the object deleted, the object is decoration and the section is a template.
6. **Motion.** Plan it from `motion.md` at the level the tone allows, with real content. Each piece of motion serves a
   step of the buyer's path, and none of it delays the core, the price or the action.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.
Tone: <playful | modern and professional>, because <what the business is about, what customers come for, the client's voice, the category leaders>
Buyer's path: <who buys and on what device; what brings them; what they compare it with; top 3 doubts, each with the
  proof that answers it; when the price appears; the action>
Core: <one line: what this business is, what it sells and who it's for>
Facts: <what they sell, where, how to order, WhatsApp number, 6-10 products with prices>
The customer: <who they are, and the exact problem, worry or desire that brings them, in their words. List each
  specific need or situation the business serves: conditions, occasions, uses. Be concrete>
Why it matters: <why the problem happens or why the choice is hard, and how this business answers it>
How it works: <the process, ingredients, method or how to use it, with real numbers and steps>
Proof: <named reviews and quotes, before/after, numbers, stockists, awards, certificates, people and places>
Compared with: <what customers use instead, and why this is different, with no competitor names>
Offers: <packages, was and now prices, savings, promo codes, delivery, guarantees, payment methods>
Questions: <what customers ask or doubt before buying, with the client's answers>
Languages: <each language the client uses, and key lines in each, quoted exactly>
Must say: <the 6-10 most important messages, specific to this client, that every variant must carry>
Their words: <slogans and phrases, quoted exactly>
Rules: <names to avoid, claims not to make, photo traps>. Unknowns show as [client to confirm].
Pages: <the pages for this site type, from site-types.md>
Ordering: <basket to WhatsApp or marketplace, quote form, booking or none, and what the basket is called>
Screen: 1920x870 at 125% zoom (about 1536x700), unless LEAD.md says otherwise
Images: <file: what it shows, sharp enough for full width or not, and its source if not the client's own page>
Sources read: <each client link and Google search, and what it gave or why it was blocked>
Category look: <the 4-6 category leaders opened, with sheet files, and what they share: subject, palette, type, tone, level>
Searches run: <each reference search, where it ran, exact or family, and which picks came from it>
References opened: <every page you went through: kept or dropped, why, and for kept pages the two frames or parts that prove the bar>

| | V1 · Name | V2 · Name | V3 · Name |
| Concept | | | |
| Hero (its visual idea, whether it's scroll-driven and what each scroll step shows, how client photos are treated or what's made in code, the words and what else is on the first screen, and how it delivers the Core) | | | |
| Signature moment (how it works, and the kit effect it's built with) | | | |
| Client's object through the site (intro, transitions, image frames, details) | | | |
| Motion plan (opening, motion graphic per section, alive at rest, page change) | | | |
| Business tool (finder, picker, dial or quote builder, ending in WhatsApp) | | | |
| Section order: the buyer's path, with the question each section answers and how this variant tells it | | | |
| Header | | | |
| Type pair (each font, where it comes from, and what in the client's world it answers to) | | | |
| Palette | | | |
| References (URL and sheet file: what gives it impact, the part to take, and why it suits this client, one or more per variant) | | | |
```
