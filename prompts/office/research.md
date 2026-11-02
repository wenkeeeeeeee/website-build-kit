# Research agent: run order

You have **10 minutes** for this lead, so skim and decide as a person would. Your task message gives `CLIENT`, `PROJECT`
(its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id) and `ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds
the user's message, and its notes beat these defaults.

## Ground rules
- Run `git -C KIT pull --ff-only` first. If that fails, carry on with the copy you have.
- Nobody is watching, so never ask anything. Work alone, with no subagents.
- Run `date +%s` now and after each step. **At 8 minutes, stop gathering and write `PITCH.md`.**
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
   - **Think like the customer.** What were they searching for or worried about before finding this business? Capture it
     in their words, from reviews, comments and the client's copy.
   - **Collect** every client field in `PITCH.md`, 6–10 products or dishes with prices, the logo and 6–8 usable photos.
     Save images to `PROJECT/content/images/`. Look at every photo you keep, and delete any stock picture or shared menu
     template. Don't download everything or read a whole catalogue.
   - **Before moving on, you need real prices, a sharp logo and photos at least 1000px wide.** If any is missing, spend
     the spare time on it, up to the 8-minute limit. Menus are often the best source of prices and sharp photos.
2. **Decide (1 minute).** Read `KIT/prompts/office/site-types.md`, the "The hero", "What the approved sites do" and
   "Type" parts of `taste.md`, `KIT/prompts/office/motion.md`, and the effects list in `KIT/tools/web/README.md`. Pick the
   site type, or split the variants across two if the evidence honestly points both ways. Write one rough concept per
   variant, to finish after step 3.
3. **References (4 minutes).** Weak references are the costliest mistake here. **Never pick from a thumbnail, title,
   snippet or library description: open the page and go through it first.**

   **The bar: modern, attractive, and full of animation and motion graphics.** Fitting the client's category never makes
   up for missing this. A reference passes only if its sheet shows:
   - **A changing world:** something big assembles, transforms, floods the screen or takes over, rather than text and
     photos sliding up.
   - **Motion that fills the screen and carries the content.** A thin line or small decoration doesn't count.
   - **Real visual impact:** a site you'd remember and want to show someone.

   Name two frames in its sheet that prove this. If you can't, drop it, however well it fits.

   **These fail, even in the right category:** cream or beige with a serif and thin lines; calm spa colours; stacks of text
   and photos; loud colours or giant type with only fades behind them; device mockups on a plain backdrop; ordinary local
   business sites. A gallery listing proves nothing, so the bar still applies to anything from Awwwards.

   **If the user pasted references:** run `node KIT/tools/web/contact-sheet.cjs <all reference urls> --out PROJECT/references
   --steps 8` once, go through every sheet, and write what to take from each. If one is blocked, use web fetch for its
   description. Don't search for others.

   **Otherwise, always search the galleries, even if the library has something close:**
   1. **Search for motion first.** Category words alone find plain sites, so put a motion term in every search: scroll
      animation, WebGL, 3D, immersive, interactive storytelling. Run WebSearch for `site:awwwards.com/inspiration <motion term>`
      and `site:awwwards.com/sites <motion term> <family term>`, 1–2 per variant, then find the live site each good result
      describes. Awwwards blocks browsers, so don't open it directly. FWA and CSS Design Awards winners are worth a search too.
   2. Add the client's family from "Design families" in `site-types.md`, because designs travel between categories that
      sell the same way.
   3. Read `reference-library.md`, starting with "Benchmarks" and "Rejected". An entry is only a lead, so open it like the
      rest.
   4. Run `node KIT/tools/web/gallery-scan.cjs "<terms>" "<terms>" ... --out PROJECT/references/scan` (about 15 seconds) for
      Behance and Dribbble parts. It prints each project's URL.
   5. Open a shortlist of 6–8 at once:
      `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references --steps 8` (about 2 minutes, one sheet per page).
      Go through every sheet top to bottom. A cookie wall, loader, black page or repeated frame doesn't count as opened,
      so drop that page.
   6. Keep a page only if it passes the bar, the whole page holds up, and you can name the exact moving part to take and how
      it would tell this client's story. Any category is fine. Take its motion and craft, not its subject: the finished
      site still looks like the client's own business.
   7. **If fewer than 3 pass, or what you have is weak, explore other categories instead of lowering the bar.** Look for any
      strong site with a similar object, feeling or job. A physio could learn from sports, cars, medical devices, biotech,
      fashion or product launches. Keep going until the 8-minute limit, then use what passes and note the gap.

   **What to end with:**
   - **3 to 6 references in total,** never padded. Every variant gets at least one. They're sources to take from, not
     sites to copy: one can give a hero and another a layout, and one can feed two variants.
   - **At least half are new finds from this run,** not from the library. If you're short, keep searching until the
     8-minute limit rather than noting the gap early.
   - **Every variant is led by a live site that passes the bar,** because stills can't show how a page moves. One live site
     can lead two variants if it truly suits both. A Behance or Dribbble still can only add a specific part beside it.
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
6. **Report in under 80 words:** minutes taken, site type, the concepts, and the build thread's `link` copied exactly.

## What makes a concept
A concept is how the client's message gets told, not a replacement for it. Work in this order:
1. **Content.** Decide what the page must say, then find the idea that says it best. Every variant tells the same
   complete content in a different order.
2. **Core.** Write the Core line, and plan each hero by "The hero" in `taste.md`. If an idea looks good but hides the
   core or crowds the hero, change the idea.
3. **Concept.** One sentence: **what in this business is the hero made of, and what does it do?** It must be an object,
   place or ritual from this client's world that carries the customer's problem or desire. "The logo's O opens like a
   lens into the film" and "Every room is a magazine cover" are concepts. "Dark and elegant" is not. If a competitor
   could use the sentence, it's too generic.
4. **Look.** Design from what the real place looks like, with real footage and photos leading, not from the logo or
   poster colours. No two variants may share a structure, header, type pair or palette.
5. **Reach.** Say how the object carries the intro, transitions, image frames and small details, in every variant. If a
   section still works with the object deleted, the object is decoration and the section is a template.
6. **Motion.** Plan it from `motion.md` with real content: what the opening does, and each section's motion graphic.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.
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
Searches run: <each Behance, Dribbble and Awwwards search, exact or family, and which picks came from it>
References opened: <every page you went through: kept or dropped, why, and for kept pages the two frames that prove the bar>

| | V1 · Name | V2 · Name | V3 · Name |
| Concept | | | |
| Hero (its one visual, headline, short line and button, and how they deliver the Core) | | | |
| Signature moment (how it works, and the kit effect it's built with) | | | |
| Client's object through the site (intro, transitions, image frames, details) | | | |
| Motion plan (opening, motion graphic per section, alive at rest, page change) | | | |
| Business tool (finder, picker, dial or quote builder, ending in WhatsApp) | | | |
| Section order, with what each section tells the customer | | | |
| Header | | | |
| Type pair (each font, where it comes from, and what in the client's world it answers to) | | | |
| Palette | | | |
| References (URL and sheet file: which part to take and why it suits this client, one or more per variant) | | | |
```
