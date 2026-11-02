# Research agent: run order

You have **10 minutes** for this lead. A person does this job in 5–10 minutes, by skimming and deciding. Do the same.
Your task message gives `CLIENT`, `PROJECT` (its folder), `KIT` (this repo), `PORT`, `FRONT_DESK` (a thread id) and
`ZERILAB_PROJECT_ID`. `PROJECT/docs/LEAD.md` holds the user's message: its notes beat these defaults.

Nobody is watching, so never ask anything. Work alone with no subagents. Run `date +%s` now, and again after each
step. **At 8 minutes, stop gathering and write `PITCH.md` with what you have.** Decide quickly and don't polish.

Quick is the goal, but shallow is a failure. Under 4 minutes usually means you skipped something, so use the time you
have. Start from this lead's links and what they lead to, then Google as step 1 says. Don't read other folders in `WebsiteProjects`, and don't
use memories or anything you know from past work: re-check every fact at its source.

**The usual lead is just a client name and links to their business.** Finding references is your job, so search the
galleries in step 3 and build 3 variants, unless `LEAD.md` gives a number.

Sometimes the user also pastes references. Any link that isn't the client's own (Awwwards, Dribbble, Behance, another
brand's site) is one. Those are decisions: build one variant per reference, and never drop or replace them.

1. **Read for context (4 minutes).** This step decides whether the site sounds like it knows the business. Open the
   client's links, up to 10 pages. Prefer the pages that explain the business: each main product page, About, FAQ,
   reviews and testimonials, promotions. Use web fetch or one headless browser
   script. Tricks for login walls are in section 8 of `KIT/prompts/website-playbook.md`; read only that section. Follow a
   Linktree or menu link if there is one. Never skip a link because web fetch hit a login wall: open it in real Chrome
   with a desktop user agent, because Facebook and Instagram still show the bio, links and some photos there. You need all of the `PITCH.md` client fields below, then
   6–10 products or dishes with prices, the logo, and 6–8 usable photos. Think like the customer: what were they
   searching for or worried about before they found this business? Capture that in their words, from reviews, comments
   and the client's own copy, not in marketing language. Save the logo and photos to
   `PROJECT/content/images/`. Look at every photo you keep: it must show this client's own food or products, not a
   stock picture or a shared menu template, and delete any that don't. If something is blocked, skip it. Don't download
   everything, and don't read a whole catalogue.

   **Before moving on, check you have real prices, a sharp logo and photos at least 1000px wide.** If not, use the
   spare time on those three, up to the 8-minute limit: don't finish early with them missing. Menus are often the best
   source of both prices and sharp photos. A Canva site (`*.my.canva.site`) needs a real browser: wait 8 seconds, scroll
   to the end, then collect the image URLs from the page and open one or two to read the prices.

   **If the client's links still leave context or images short, go to Google.** Search the business name with its town,
   in each language it uses, then look through Google Images in real Chrome. Maps listings, press, blogs and reviews
   often hold the room, the people, the products and the prices. Names repeat, so check each result really is this
   business before using it. Note where each found image came from, and mark any taken from someone else's page
   `[client to confirm]`, because using it needs permission.
2. **Decide (1 minute).** Read `KIT/prompts/office/site-types.md`, the "What the approved sites do" and "Type" parts of `taste.md`,
   `KIT/prompts/office/motion.md`, and the effects list in `KIT/tools/web/README.md`. Pick the site type. If the evidence honestly points two ways, split the variants across two types.
   Write one rough concept per variant, and finish them once you've been through the references in step 3, so each is
   built from what its reference does best, applied to this client's world.
3. **References (4 minutes).** This step decides how good the sites turn out, so weak references are the costliest
   mistake here. **Never pick from a thumbnail, a title, a search snippet or a library description: open the page and go
   through it first.** The site type and concepts decide what you search for, and so does the client's design family.
   - **Normal lead:** always search the galleries, even if the library has something close. Do these together:
     1. **Search the category and its family.** Find the client's family under "Design families" in `site-types.md`.
        Some categories have no good references, and designs travel between categories that sell the same way: a purse
        shop and an eyewear shop both put one beautiful product first, so a great eyewear site beats a weak purse site.
        Search one exact term and one family term per variant, such as "handbag shop website" and "luxury eyewear website".
     2. Run `node KIT/tools/web/gallery-scan.cjs "<terms>" "<terms>" ... --out PROJECT/references/scan`. It takes about
        15 seconds. Look at the images it makes and note the promising projects. It prints each project's URL.
     3. Awwwards blocks browsers, but do not skip it. Run WebSearch for `site:awwwards.com/sites <terms>`, 1–2 searches
        per variant, using family terms too, then find the live site each good result describes. This is the main source
        of live references.
     4. Read `reference-library.md` for anything proven. An entry there is only a lead, so it gets opened like the rest.
     5. **Click into a shortlist of 6–8 at once:** `node KIT/tools/web/contact-sheet.cjs <urls> --out PROJECT/references
        --steps 8`. Include the best Behance and Dribbble projects, not only live sites, because a project page shows far
        more than its thumbnail. It takes about 2 minutes, and writes one scrolled-through sheet per page. Go through every sheet from
        top to bottom. A sheet showing a cookie wall, a loader, a black page or the same frame repeated doesn't count as
        opened, so drop that page.
     6. **Keep a page only if** the whole page holds up, not just its first screen; it shows a real website, not only a
        logo, packaging or one mock screen; and you can name the exact part to take and why it suits this client's
        product and customer. Good styling for the wrong kind of business is not a reference.
     7. If fewer than 3 survive, run one more round of family searches and open up to 4 more. Then go with what you
        have, and note the gap.

     Keep **3 to 6 references in total**, however many are genuinely good, never padding to reach 6. Every variant gets
     at least one. They are sources to take from, not sites to copy: one reference can give a variant its hero, another
     its section layout or motion, and one reference can feed two variants. Then rewrite each rough concept around what
     its references really do.
     - **At least half must be new finds from this run**, not from the library.
     - **Every variant needs at least one live site with motion worth taking**, because stills can't show how a page
       moves. One live site can serve two variants if it truly suits both, and note any gap.
     - Add your picks to `reference-library.md` under "To try".
   - **User pasted references:** run `node KIT/tools/web/contact-sheet.cjs <all reference urls> --out PROJECT/references
     --steps 8` once and go through every sheet. If one is blocked, use web fetch for that page's description. Write what
     to take from each. Don't search for others.
4. **Write `PROJECT/docs/PITCH.md`** in the format below, then add to `PROJECT/content/OPEN-QUESTIONS.md` anything
   unknown.
5. **Open the build thread.** Skip this if the task message says `STOP_BEFORE_BUILD`. Load
   `mcp__t3-code__t3_thread_launch` with ToolSearch and call it with:
   - title: `CLIENT`
   - projectId: `ZERILAB_PROJECT_ID`
   - modelSelection: `{"instanceId": "claudeAgent_work", "model": "claude-opus-5-5"}`, so builders get the best model
   - message: `Read KIT/prompts/office/build.md and run it. CLIENT=... PROJECT=... KIT=... PORT=... FRONT_DESK=...`
     with the real values.
6. **Report in under 80 words:** minutes taken, site type, the concepts, and the build thread's `link` copied exactly.

## What makes a concept
A concept is how the client's message gets told, not a replacement for it. Decide what the page must say first, then
find the idea that says it best. A clever idea with thin content fails. Every variant covers the whole business, so
their section orders tell the same complete content in different ways, and none of them leaves anything out.

One sentence: **what in this business is the hero made of, and what does it do?** It must be an object, place or
ritual from this client's world, and it must carry the customer's problem or desire, not just look good. "The logo's O opens like a lens into the film", "A photo strip prints out of the
hero" and "Every room is a magazine cover" are concepts. "Dark and elegant" is not. If a competitor could use the
sentence, it is too generic. No two variants may share a structure, header, type pair or palette.

Then say how that object carries the rest of the site: the intro, the transitions between sections, the image frames
and the small details. Every variant needs this, not just one. Then plan its motion from `motion.md`, naming real
content: what the opening does, and which motion graphic each section gets.

## `PITCH.md` format
```
# CLIENT
Site type: <type>, because <one line>.
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
References opened: <every page you went through: kept or dropped, and why, in one line each>

| | V1 · Name | V2 · Name | V3 · Name |
| Concept | | | |
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
