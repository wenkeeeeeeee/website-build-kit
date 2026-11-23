# Builder brief: variants 1-3

Fill in the {{fields}} and send one copy per variant, all in one message so they run at the same time.

---

You are designing and building variant {{N}} of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}.**

Your job is a hero the owner approves on sight: modern, creative, and the best way to show what this business offers.
You find your own references, choose your own idea and design everything yourself. The only rules are
`{{KIT}}/prompts/rules.md` (read it first) and the facts below.

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
6. **Three ideas.** Write three different hero ideas that deliver your customer line, each in one line, from what you
   saw. Pick the strongest for this business and its customer, not the safest.
7. **Lead plus two.** Choose one **lead reference** (how its hero is laid out, staged and moves) and up to two
   **supporting** ones (a motion, an interaction or a detail).
8. **Claim it.** Open `{{PROJECT}}/references/claims.md` (create it if missing). If another variant already claimed
   your lead site, or a hero layout like yours, choose again from step 6. Otherwise add one line:
   `V{{N}} | <lead url> | <its hero layout in your own words: where the picture, words and action sit, what moves> | <your idea>`.
   Read the file again: if a line above yours took the same site or layout, you move, not them.

If a site shows a login wall or blocks you, stop and tell whoever sent you which site: the user will log in for you.

### 2. Build the hero (about 25 minutes)
- Build the header and hero in `{{VARIANT}}/site/` (`index.html`, `css/`, `js/`, `assets/`), with the client's real
  material copied into `site/assets/`. Adapt how the lead reference lays out, stages and moves things to your idea;
  take the supporting references' details. Everything visible is the client's: their photos, words, brand and colours.
- Libraries are in `{{PROJECT}}/tools/node_modules` (GSAP with all plugins, Lenis, three.js, ogl). Copy what you use
  into `site/js/vendor/`. 21st.dev components are React: port the part you need to plain JS.
- Skills: `impeccable` or `frontend-design` for polish once your direction is set. Don't use skills that hand out
  ready-made directions or generate design images (taste-skill and its variants, imagegen, image-to-code, brandkit).
- Want a generated image or video? Don't make it: put a placeholder and list it in your report (rules.md).

### 3. Look at it beside the lead
`node {{KIT}}/tools/web/hero-frames.cjs <your hero url> <lead url> --motion --out {{VARIANT}}/ref`
Look at both rows cold. Is yours as modern and alive as the lead? Does it show this business better than anything
else could? Could it pass for the reference with the logo hidden? Fix what fails. No console errors; it works at
phone width.

**Report** (under 150 words): the hero URL; the customer line; the three ideas and which you built; the lead
reference (URL) and what you took from it and from each supporting one; the `hero-*.jpg` and `motion-*.jpg` paths
from step 3; generated images or video you'd like (what, where, a ready prompt), or "none".

## Rest phase (about 30 minutes)
The approved hero stays as it is, apart from the user's changes above. Build everything below it, and the pages this
business really needs, at the same level and in the same design. The working plumbing (basket ending in a filled-in
WhatsApp message, catalogue, product page, quote form) is in `{{PROJECT}}/variants/_shared/starter`: copy the parts
you need into your site, keep them working, redesign everything visible. Every control (dropdown, date picker,
stepper) is built in the site's design, never the browser's default.

Before you finish: `node {{KIT}}/tools/web/check-pages.cjs <each page> --phone --header <header height> --out {{VARIANT}}/ref`
and fix what looks wrong. Report (under 100 words): the URL, the pages, anything `[client to confirm]`.

## Working rules
- Your own headless browser only (`find-refs.cjs`, `hero-frames.cjs`, `check-pages.cjs`), never the Playwright or
  chrome-devtools MCP tools: other agents share them. The preview runs at {{PREVIEW}}/variants/{{nn-name}}/site/;
  don't start another server.
- Stay in your folder `{{VARIANT}}`; the only shared file you write is `references/claims.md`. No git.
- No plans, gates, TDD or extra reports. Bash heredocs with quotes can fail on Windows: write scripts to files.
