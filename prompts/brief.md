# Builder brief: variants 1-3

Fill in the {{fields}} and send one copy per variant, all in one message so they run at the same time.

---

You are designing and building variant {{N}} of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}. Hero mode: {{reference | crafted}}.**

Your job is a site the owner approves on sight: modern, creative, and the best way to show what this business offers.
You find your own references on Awwwards and 21st.dev and adapt them closely: the design comes from the references,
the content from the client. The only rules are `{{KIT}}/prompts/rules.md` (read it first) and the facts below.

## The client
- Facts and material: `{{PROJECT}}/docs/FACTS.md` (read all of it) and the files in `{{PROJECT}}/content/`.
- Your tone: {{the V{{N}} line from "Tones" in FACTS.md}}.
- What the user said before: {{from FACTS.md, in full and word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.
- Hero ideas already used (crafted mode): {{every hero idea and lead layout in claims.md, or "none"}}.

## Hero phase (about 45 minutes)
**Reference mode** (the usual one) follows steps 1-3. **Crafted mode** follows "Hero mode: crafted" below instead of
steps 1 and 2, then step 3.

### 1. Find your references (about 20 minutes)
This step decides everything. Take it seriously.
1. **Know your material.** Read the Material list in FACTS.md: what the client really has (photos, videos, products,
   people, places, logo), in what orientation and quality. You can only build what this material can carry, so look
   for references that show this kind of material at its best.
2. **Write the customer line:** in one sentence, what a customer must understand and feel within 5 seconds of landing.
3. **Decide what you're looking for.** Ask what this business really delivers to its customer and what would show
   that best: what the customer gets, where it happens, what it looks and sounds like, how it feels. A site from any
   category can be right if it shows that kind of thing well; the client's own category is only one of them.
4. **Go through the award winners first.** The best references are Awwwards' award winners: Sites of the Year, Sites
   of the Month, every Honors category (Typography, No-code, E-commerce, Product, Portfolio, Business & Services) and
   Sites of the Day. The lead has saved them all as numbered sheets in `{{PROJECT}}/references/awards/` (if that
   folder is missing, run `node {{KIT}}/tools/web/find-refs.cjs awards --out {{PROJECT}}/references/awards`). Look at
   every sheet, and note every site that could deliver what you decided in step 3 and suits your material.
   Only if the award pool has too few that fit, look further, as an alternative:
   ```
   node {{KIT}}/tools/web/find-refs.cjs aw:sites_of_the_day@30 aw:<category or tag> aw?<words> 21st:hero --out {{VARIANT}}/ref/browse
   ```
   (older Sites of the Day, any Awwwards category, tag or search from https://www.awwwards.com/websites/, 21st.dev
   sections).
5. **Open them live.** `node {{KIT}}/tools/web/find-refs.cjs live <awwwards site page>` gives the real address. Study
   8-10 heroes with `node {{KIT}}/tools/web/hero-frames.cjs <url> [<url> ...] --motion --out {{VARIANT}}/ref`: the
   opening, the scroll and the hover, not just a thumbnail. Award winners first; anything from outside the pool must
   be as modern and creative (many 21st.dev heroes are plain SaaS templates).
6. **Three candidates.** Pick three of the heroes you studied that could carry this client's material and your
   customer line. For each, one line: how this client's photos, video and words would sit in that exact hero. Pick
   the one that shows this business best, not the safest.
7. **Lead plus two.** The pick is your **lead reference**: your hero takes its layout, proportions, type scale, how it
   stages the media and how it moves on load, scroll and hover. Up to two **supporting** references each give one
   detail (a motion, an interaction).
8. **Claim it.** Open `{{PROJECT}}/references/claims.md` (create it if missing). If another variant already claimed
   your lead site, or a hero layout like it, choose again from step 6. Otherwise add one line:
   `V{{N}} | <lead url> | <its hero layout in your own words: where the picture, words and action sit, what moves> | <how the client's material fills it>`.
   Read the file again: if a line above yours took the same site or layout, you move, not them.

If a site shows a login wall or blocks you, stop and tell whoever sent you which site: the user will log in for you.

### 2. Build the hero (about 25 minutes)
- Build the header and hero in `{{VARIANT}}/site/` (`index.html`, `css/`, `js/`, `assets/`), with the client's real
  material copied into `site/assets/`. Rebuild the lead reference's hero with the client's content: the same
  composition and proportions, the same scale of type and media, the same staging and the same motion (what moves,
  when, how far, how fast). Change only what the client's material or the rules force. Add the supporting references'
  details. Everything visible is the client's: their photos, words and brand.
- Libraries are in `{{PROJECT}}/tools/node_modules` (GSAP with all plugins, Lenis, three.js, ogl). Copy what you use
  into `site/js/vendor/`. 21st.dev components are React: port the part you need to plain JS.
- Skills: `impeccable` or `frontend-design` for polish once your direction is set. Don't use skills that hand out
  ready-made directions or generate design images (taste-skill and its variants, imagegen, image-to-code, brandkit).
- Want a generated image or video? Don't make it: put a placeholder and list it in your report (rules.md).

### 3. Look at it beside the lead
`node {{KIT}}/tools/web/hero-frames.cjs <your hero url> <lead url> --motion --out {{VARIANT}}/ref`
Look at both rows cold. Someone comparing them should see the same hero (layout, scale, staging, motion) carrying
different content. Fix every place where yours drifts from the lead, unless the client's material forced it. Is yours
as modern and alive as the lead? No console errors; it works at phone width.

**Report** (under 150 words): the hero URL; the customer line; the three candidates and which you built; the lead
reference (URL, and the award list it came from, or why nothing in the pool fit), what you changed from it and why, and what you took from each supporting one; the `hero-*.jpg` and
`motion-*.jpg` paths from step 3; generated images or video you'd like (what, where, a ready prompt), or "none".
Crafted mode reports the ideas and the pick, the thread sentence and route, and each quality reference and what it
set, in place of the candidates and the lead.

### Hero mode: crafted
The hero is an object or scene made from the client's own world, not a reference rebuilt. References set the level of
finish, never the layout.
1. **Ideas (about 10 minutes).** Know your material and write the customer line (step 1, parts 1 and 2). Then write
   5-6 hero objects or scenes from the client's world: its materials, tools, workplace, signature product, awards,
   places. For each, one line: what the visitor sees, what they can do to it, and what they understand about the
   business within 5 seconds.
2. **Cut and pick.** Drop any that is a photo and a headline in a new arrangement, or that repeats a hero idea already
   used (above, and `{{PROJECT}}/references/claims.md`). Pick the most creative one that still plainly reads as this
   business, and claim it: `V{{N}} | crafted | <the idea in one line>`.
3. **The level (about 10 minutes).** Study 3-5 heroes live with `hero-frames.cjs --motion`: from the award pool, then
   `aw:3d`, `aw:webgl`, `aw:experimental`, and Codrops demos for technique. Note how they load in, how they answer the
   cursor, and how finished their materials and light are. Yours must reach that level in its own layout.
4. **The thread starts here.** The hero object works best when it is also the thread (rest phase, step 5): write its
   sentence and route now, so the hero is built to travel.
5. **Build (about 25 minutes).** One strong subject, with the client's name or wordmark built into it rather than set
   beside it; a real cursor or drag interaction, with a touch version; a load-in. Use the client's photos or renders as
   textures; a 3D product built in code only if it looks as good as a photo.
6. **Needs a generated object?** Build a rough version first, put the idea and a ready prompt in your report, and wait
   (rules.md).

In step 3, set your quality references beside your hero instead of a lead: the same finish and life, in your own layout.

## Rest phase (about 55 minutes)
The approved hero stays as it is, apart from the user's changes above. Everything below it, and the pages this
business really needs, starts from references found the same way as the hero's, then takes your own layout, motion
and interaction ideas (step 5).

### 1. References for the rest (about 15 minutes)
1. List the sections and pages this business needs, and what each must show or do.
2. Start with your lead reference: scroll its whole home page and open its inner pages. Then the award pool in
   `{{PROJECT}}/references/awards/` again, this time for the sections and pages of award winners that fit yours. Only
   for what the pool doesn't cover, browse further as an alternative: Awwwards categories and tags (`aw:transitions`,
   `aw:scrolling`, `aw:animation` and any others from https://www.awwwards.com/websites/) and 21st.dev sections
   (`21st:features`, `21st:testimonials`, `21st:cta`, `21st:footer`, `21st:text`, `21st:scroll-area`,
   `21st:background` or any section name).
3. Study them moving: `node {{KIT}}/tools/web/contact-sheet.cjs <url> [<url> ...] --moving --out {{VARIANT}}/ref/rest`
   takes a frame every half screen while the page is still scrolling, so you see how each section enters and how it
   hands over to the next, not just where it rests.
4. Pick one reference for each section, and for a corporate tone one more for how sections hand over to each other.
   Add one line to `{{PROJECT}}/references/claims.md`:
   `V{{N}} rest | <section>: <url> | <section>: <url> | ... | hand-over: <url, or "thread">`. A site another variant
   already claimed is off-limits.
5. **Brainstorm the layout and motion together (about 15 minutes).** The references are a starting point, not the
   limit: most reference sections are plain and barely move, so the layout, scrolling animation and interaction through
   the rest of the site are yours to invent too.
   1. **The thread first.** Choose one thing from the client's own world (the logo or its parts, the signature product,
      the place, how the work gets done) that stays on screen through the whole page and carries the visitor from
      section to section. Write it as one sentence: what it is, what it does in the hero, what the visitor can do to
      it, and what it does as they scroll. Then write its route: where it starts, its station in each section (what it
      becomes or does there: a bullet, the marker of the active item, a frame around a photo, a page turning) and how
      it ends at the contact. The thread is the hand-over between sections. It is best when it collects what the
      visitor chose on the way and hands that to the contact or brief form. In crafted mode the thread is your hero
      object, on the route you wrote in the hero phase.
   2. **Then each section, around its station.** Write its layout (the reference's, reshaped, or your own when that
      serves the section better), how it moves as the visitor scrolls, and one thing the visitor can do with it (drag,
      hover, tap, scrub), designed as one idea with the thread and built from the client's own material, its photos and
      video first. Go past stacked rows, fades and slide-ups and past what the references do: the scroll should feel
      like part of the client's world. At least 2-3 sections are the visitor's to control (drag, scrub, hover), each
      working by touch too. Photos show whole at their own ratio, never cropped into thin strips. No plain stacks of 3D
      slabs or blocks.
   3. **Corporate tone: no thread.** When the user or `FACTS.md` asks for a corporate tone, skip the thread. Each section
      gets smooth, clean animation and motion instead: calm reveals, gentle movement in the photos, precise transitions
      between sections (from the hand-over reference), and motion that shows information rather than play.

### 2. Build the rest
Build each section from your step 5 idea: its layout and motion, filled with the client's material and words. Where
the idea keeps the reference's layout, adapt it closely, as you did the hero (proportions, type scale, and its motion
where that's stronger than yours). The thread travels its route ("Travelling thread" in `{{KIT}}/prompts/methods.md`);
for a corporate tone the spaces between sections follow the hand-over reference. No section simply stops where the next
one starts. The whole site keeps the hero's type, colours and feel.

The working plumbing (basket ending in a filled-in WhatsApp message, catalogue, product page, quote form) is in
`{{PROJECT}}/variants/_shared/starter`: copy the parts you need into your site, keep them working, redesign everything
visible. Every control (dropdown, date picker, stepper) is built in the site's design, never the browser's default.

### 3. Look at it beside the references
`node {{KIT}}/tools/web/contact-sheet.cjs <your home page> <your section references> --moving --out {{VARIANT}}/ref/rest`
and look at `all.jpg`, then run your home page again with `--moving --phone`. These frames are the screen while
scrolling, the only place pinned sections show right (full-page shots show them wrong). Fix any section that lost its
step 5 idea, sits still where its reference moves, fell back to a plain stack of rows, or where the thread drops out,
misses its station or passes over text. Then
`node {{KIT}}/tools/web/check-pages.cjs <each page> --phone --header <header height> --out {{VARIANT}}/ref` and fix what
looks wrong.

**Report** (under 180 words): the URL, the pages, the thread sentence (or "corporate: none"), each section with its
reference and its layout and motion idea, the `all.jpg` path, anything
`[client to confirm]`.

## Working rules
- Your own headless browser only (`find-refs.cjs`, `hero-frames.cjs`, `contact-sheet.cjs`, `check-pages.cjs`), never the Playwright or
  chrome-devtools MCP tools: other agents share them. The preview runs at {{PREVIEW}}/variants/{{nn-name}}/site/;
  don't start another server.
- Stay in your folder `{{VARIANT}}`; the only shared file you write is `references/claims.md`. No git.
- No plans, gates, TDD or extra reports. Bash heredocs with quotes can fail on Windows: write scripts to files.
