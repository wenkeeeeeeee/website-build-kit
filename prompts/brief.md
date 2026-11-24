# Builder brief: variants 1-3

Fill in the {{fields}} and send one copy per variant, all in one message so they run at the same time.

---

You are designing and building variant {{N}} of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}.**

Your job is a site the owner approves on sight: modern, creative, and the best way to show what this business offers.
You find your own references on Awwwards and 21st.dev and adapt them closely: the design comes from the references,
the content from the client. The only rules are `{{KIT}}/prompts/rules.md` (read it first) and the facts below.

## The client
- Facts and material: `{{PROJECT}}/docs/FACTS.md` (read all of it) and the files in `{{PROJECT}}/content/`.
- Your tone: {{the V{{N}} line from "Tones" in FACTS.md}}.
- What the user said before: {{from FACTS.md, word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.

## Hero phase (about 40 minutes)

### 1. Find your references (about 15 minutes)
This step decides everything. Take it seriously.
1. **Know your material.** Read the Material list in FACTS.md: what the client really has (photos, videos, products,
   people, places, logo), in what orientation and quality. You can only build what this material can carry, so look
   for references that show this kind of material at its best.
2. **Write the customer line:** in one sentence, what a customer must understand and feel within 5 seconds of landing.
3. **Decide where to look.** Ask what this business really delivers to its customer and what would show that best.
   Look at it from several angles: what the customer gets, where it happens, what it looks and sounds like, how it
   feels. The client's own category is only one place to look, and often not the best: pick the categories and
   searches whose sites show that kind of thing best. Each of your references can come from a different one.
4. **Browse Awwwards and 21st.dev** with your own headless browser:
   ```
   node {{KIT}}/tools/web/find-refs.cjs aw:<category or tag> aw?<words> 21st:hero --out {{VARIANT}}/ref/browse
   ```
   Awwwards categories and tags are listed at https://www.awwwards.com/websites/ (e.g. `aw:sites_of_the_day`, or any
   category, tag or search that fits your step 3). On 21st.dev, `21st:hero` and other sections. Look at the sheets
   and pick the heroes worth a closer look.
5. **Open them live.** `node {{KIT}}/tools/web/find-refs.cjs live <awwwards site page>` gives the real address. Study
   8-10 heroes with `node {{KIT}}/tools/web/hero-frames.cjs <url> [<url> ...] --motion --out {{VARIANT}}/ref`: the
   opening, the scroll and the hover, not just a thumbnail. Only modern, creative work: skip anything basic, template-
   like or dated (many 21st.dev heroes are plain SaaS templates).
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
reference (URL), what you changed from it and why, and what you took from each supporting one; the `hero-*.jpg` and
`motion-*.jpg` paths from step 3; generated images or video you'd like (what, where, a ready prompt), or "none".

## Rest phase (about 45 minutes)
The approved hero stays as it is, apart from the user's changes above. Everything below it, and the pages this
business really needs, comes from references too, found and adapted the same way as the hero.

### 1. References for the rest (about 15 minutes)
1. List the sections and pages this business needs, and what each must show or do.
2. Start with your lead reference: scroll its whole home page and open its inner pages. Then browse for the sections
   it doesn't cover: Awwwards categories and tags that fit (`aw:transitions`, `aw:scrolling`, `aw:animation` and any
   others from https://www.awwwards.com/websites/) and 21st.dev sections (`21st:features`, `21st:testimonials`,
   `21st:cta`, `21st:footer`, `21st:text`, `21st:scroll-area`, `21st:background` or any section name).
3. Study them moving: `node {{KIT}}/tools/web/contact-sheet.cjs <url> [<url> ...] --moving --out {{VARIANT}}/ref/rest`
   takes a frame every half screen while the page is still scrolling, so you see how each section enters and how it
   hands over to the next, not just where it rests.
4. Pick one reference for each section and one for how sections hand over to each other. Add one line to
   `{{PROJECT}}/references/claims.md`: `V{{N}} rest | <section>: <url> | <section>: <url> | ... | hand-over: <url>`. A site
   another variant already claimed is off-limits.

### 2. Build the rest
Adapt each section's reference closely, as you did the hero: its layout, proportions, type scale and motion, filled
with the client's material and words. The spaces between sections follow the hand-over reference: no section simply
stops where the next one starts. The whole site keeps the hero's type, colours and feel.

The working plumbing (basket ending in a filled-in WhatsApp message, catalogue, product page, quote form) is in
`{{PROJECT}}/variants/_shared/starter`: copy the parts you need into your site, keep them working, redesign everything
visible. Every control (dropdown, date picker, stepper) is built in the site's design, never the browser's default.

### 3. Look at it beside the references
`node {{KIT}}/tools/web/contact-sheet.cjs <your home page> <your section references> --moving --out {{VARIANT}}/ref/rest`
and look at `all.jpg`: fix any section that drifts from its reference or sits still where its reference moves. Then
`node {{KIT}}/tools/web/check-pages.cjs <each page> --phone --header <header height> --out {{VARIANT}}/ref` and fix what
looks wrong.

**Report** (under 120 words): the URL, the pages, each section with its reference, the `all.jpg` path, anything
`[client to confirm]`.

## Working rules
- Your own headless browser only (`find-refs.cjs`, `hero-frames.cjs`, `contact-sheet.cjs`, `check-pages.cjs`), never the Playwright or
  chrome-devtools MCP tools: other agents share them. The preview runs at {{PREVIEW}}/variants/{{nn-name}}/site/;
  don't start another server.
- Stay in your folder `{{VARIANT}}`; the only shared file you write is `references/claims.md`. No git.
- No plans, gates, TDD or extra reports. Bash heredocs with quotes can fail on Windows: write scripts to files.
