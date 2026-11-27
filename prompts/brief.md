# Builder brief: variants 1-5

Fill in the {{fields}} and send one copy per variant, all in one message so they run at the same time.

---

You are designing and building variant {{N}} of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}. Hero: {{reference (V1-V2) |
crafted (V3-V5)}}.**

Your job is a site the owner approves on sight: modern, creative, and the best way to show what this business offers.
**Aim for something rarely seen**, from the first screen to the footer: never a usual website, and never safe because
nobody asked for more. A **reference hero** is built from the one Awwwards or 21st.dev hero that shows this business best, adapted closely. A
**crafted hero** is your own object or scene from the client's world, with references setting only the level of
finish. Either way, the sections below are your own layout, motion and interaction at the craft level of their
references, and the content is always the client's. The only rules are `{{KIT}}/prompts/rules.md` (read it first) and the facts below.

## The client
- Facts and material: `{{PROJECT}}/docs/FACTS.md` (read all of it) and the files in `{{PROJECT}}/content/`.
- Your tone: {{the V{{N}} line from "Tones" in FACTS.md}}.
- What the user said before: {{from FACTS.md, in full and word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.
- Hero ideas already used: {{this client's earlier rounds and the user's rejections, or "none"}}. The other
  variants' ideas are in `{{PROJECT}}/references/claims.md`. Never repeat either.
- Seeds: the "Seeds" list in FACTS.md, things from the client's world to start your ideas from.

## Hero phase (about 45 minutes)

### 1. Know the client (about 5 minutes)
1. **Know your material.** Read the Material list in FACTS.md: what the client really has (photos, videos, products,
   people, places, logo), in what orientation and quality. You can only build what this material can carry.
2. **Write the customer line:** in one sentence, what a customer must understand and feel within 5 seconds of landing.

**Corporate tone** only when the user's own words above ask for it (never a guess of yours, the lead's or research's),
either hero: you still brainstorm and build your own idea as below; only the feel changes. Not playful: calm, smooth,
precise motion, and an interaction that shows the business rather than a game. Calm is still rarely seen.

The awards: Awwwards' award winners (Sites of the Year, Sites of the Month, every Honors category, Sites of the Day)
are saved as numbered sheets in `{{PROJECT}}/references/awards/` (if that folder is missing, run
`node {{KIT}}/tools/web/find-refs.cjs awards --out {{PROJECT}}/references/awards`). Look there first.
`node {{KIT}}/tools/web/find-refs.cjs live <awwwards site page>` gives a site's real address. If a site shows a login
wall or blocks you, stop and tell whoever sent you which site: the user will log in for you.

### 2a. Reference hero (V1-V2, about 40 minutes)
1. **Decide what you're looking for.** Ask what this business really delivers to its customer and what would show
   that best: what the customer gets, where it happens, what it looks and sounds like, how it feels. A site from any
   category can be right if it shows that kind of thing well; the client's own category is only one of them.
2. **Go through every award sheet** and note every site that could deliver that and suits your material. Only if the
   pool has too few that fit, look further, as an alternative:
   ```
   node {{KIT}}/tools/web/find-refs.cjs aw:sites_of_the_day@30 aw:<category or tag> aw?<words> 21st:hero --out {{VARIANT}}/ref/browse
   ```
   (older Sites of the Day, any Awwwards category, tag or search from https://www.awwwards.com/websites/, 21st.dev
   sections).
3. **Open them live.** Study 8-10 heroes with
   `node {{KIT}}/tools/web/hero-frames.cjs <url> [<url> ...] --motion --out {{VARIANT}}/ref`: the opening, the scroll
   and the hover, not just a thumbnail. Anything from outside the pool must be as modern and creative (many 21st.dev
   heroes are plain SaaS templates).
4. **Three candidates.** Pick three that could carry this client's material and your customer line. For each, one
   line: how this client's photos, video and words would sit in that exact hero. Pick the one that fits this business
   best, not the safest.
5. **Lead plus two.** The pick is your **lead reference**: your hero takes its layout, proportions, type scale, how it
   stages the media and how it moves on load, scroll and hover. Up to two **supporting** references each give one
   detail (a motion, an interaction).
6. **Claim it** in `{{PROJECT}}/references/claims.md` (create it if missing):
   `V{{N}} | <lead url> | <its hero layout in your own words: where the picture, words and action sit, what moves> | <how the client's material fills it>`.
   Read the file again: if a line above yours took the same site, layout or idea, choose again from step 4.
7. **Build (about 20 minutes).** Rebuild the lead reference's hero with the client's content: the same composition and
   proportions, the same scale of type and media, the same staging and the same motion (what moves, when, how far, how
   fast). Change only what the client's material or the rules force. Add the supporting references' details.
8. **Look at it beside the lead:**
   `node {{KIT}}/tools/web/hero-frames.cjs <your hero url> <lead url> --motion --out {{VARIANT}}/ref`. Someone comparing
   the rows should see the same hero (layout, scale, staging, motion) carrying different content. Fix every place
   where yours drifts, unless the client's material forced it.

### 2b. Crafted hero (V3-V5, about 40 minutes)
1. **Ideas.** Start from the seeds. Write 5-6 hero objects or scenes from the client's world: its materials, tools,
   workplace, signature product, awards, places. For each, one line: what the visitor sees, what they can do to it, and what they
   understand about the business within 5 seconds.
2. **Cut and pick.** Drop any that is a photo and a headline in a new arrangement, or that repeats a hero idea already
   used (above, and in `{{PROJECT}}/references/claims.md`). Pick the most creative one that still plainly reads as this
   business. Claim it: `V{{N}} | <the idea in one line> | <what the visitor does to it>`. Read the file again: if a
   line above yours is the same idea or close to it, you pick again, not them.
3. **The level (about 10 minutes).** Find 3-5 heroes that set how finished and alive yours must be: the award sheets
   first, then `find-refs.cjs aw:3d aw:webgl aw:experimental aw:<category or tag> --out {{VARIANT}}/ref/browse` and
   Codrops demos (tympanus.net/codrops) for technique. Study them with `hero-frames.cjs --motion`: how they load in,
   how they answer the cursor, how finished their materials and light are. They never set your layout.
4. **The thread starts here.** The hero object works best when it is also the thread (rest phase, step 5): write its
   sentence and route now, so the hero is built to travel. Corporate tone: the thread too, moving calmly and precisely.
5. **Build (about 20 minutes).** One strong subject, with the client's name or wordmark built into it rather than set
   beside it; a real cursor or drag interaction, with a touch version; a load-in. The object and the wordmark say what
   the business is, with at most one short line beside them; the action sits in the header. No headline block. Use
   the client's photos or renders as textures; a 3D product built in code only if it looks as good as a photo.
6. **Look at it beside the level:**
   `node {{KIT}}/tools/web/hero-frames.cjs <your hero url> <your level references> --motion --out {{VARIANT}}/ref`. Is
   yours as finished and alive as they are, in its own layout? Does it read as this business within 5 seconds? Fix
   what falls short.

### 3. Either hero
- Build the header and hero in `{{VARIANT}}/site/` (`index.html`, `css/`, `js/`, `assets/`), with the client's real
  material copied into `site/assets/`. Everything visible is the client's: their photos, words and brand.
- Libraries are in `{{PROJECT}}/tools/node_modules` (GSAP with all plugins, Lenis, three.js, ogl). Copy what you use
  into `site/js/vendor/`. 21st.dev components are React: port the part you need to plain JS.
- Skills: `impeccable` or `frontend-design` for polish once your direction is set. Don't use skills that hand out
  ready-made directions or generate design images (taste-skill and its variants, imagegen, image-to-code, brandkit).
- **Propose 1-2 generated objects or scenes** that would lift the hero beyond the client's photos, each with a ready
  prompt and a rough mock-up (built in code or from the client's photos, saved as `{{VARIANT}}/ref/proposal-<n>.jpg`).
  Don't generate them yourself: the lead shows them to the user, who decides whether to spend (rules.md). Your hero
  works without them.
- No console errors; it works at phone width.

**Report** (under 150 words): the hero URL; the customer line; the `hero-*.jpg` and `motion-*.jpg` paths; your 1-2
generated proposals (what, where, the ready prompt, the mock-up path). Reference hero: the three candidates,
the lead (URL, and the award list it came from, or why nothing in the pool fit), what you changed from it and why,
and what each supporting one gave. Crafted hero: the 5-6 ideas and which you built, the thread sentence and route, and each level reference and what it set.

## Rest phase (about 55 minutes)
The approved hero stays as it is, apart from the user's changes above. Everything below it, and the pages this
business really needs, is your own layout, motion and interaction (step 5). References set the level of craft and
motion, not the layout.

### 1. References for the rest (about 15 minutes)
1. List the sections and pages this business needs, and what each must show or do.
2. Start with your lead or level references: scroll their whole home pages and open their inner pages. Then the award pool
   in `{{PROJECT}}/references/awards/` again, then design-craft lists: `aw:3d`, `aw:webgl`, `aw:experimental`,
   `aw:transitions`, `aw:scrolling`, `aw:animation`, and Codrops demos. Not sites from the client's own industry: they
   pull you back to its usual pages. 21st.dev only for a component's code.
3. Study them moving: `node {{KIT}}/tools/web/contact-sheet.cjs <url> [<url> ...] --moving --out {{VARIANT}}/ref/rest`
   takes a frame every half screen while the page is still scrolling, so you see how each section enters and how it
   hands over to the next, not just where it rests.
4. Pick one reference for each section, and for a corporate tone one more for how sections hand over to each other.
   Add one line to `{{PROJECT}}/references/claims.md`:
   `V{{N}} rest | <section>: <url> | <section>: <url> | ... | hand-over: <url, or "none">`. A site another variant
   already claimed is off-limits.
5. **Brainstorm the layout and motion together (about 15 minutes).** The references set the level; the layout,
   scrolling animation and interaction through the rest of the site are yours to invent.
   1. **The thread first.** One thing from the client's own world that stays on screen through the whole page and
      carries the visitor from section to section. A crafted hero's object is the thread, on the route you wrote in the
      hero phase; with a reference hero, choose it now (the logo or its parts, the signature product, the place, how
      the work gets done). Its sentence: what it is, what it does in the hero, what the visitor can do to it, what it
      does as they scroll. Its route, checked against the sections you now have: where it starts, its station in each
      section (what it becomes or does there, and what the visitor does with it) and how it ends at the contact. It
      stays a real object the visitor drags or uses, never shrunk to a marker in the margin: each layout gives it its
      own space, so it never covers text. The thread is the hand-over between sections. It is best when it collects
      what the visitor chose on the way and hands that to the contact or brief form.
   2. **Then each section, around its station.** Write its layout, how it moves as the visitor scrolls, and one thing
      the visitor can do with it (drag, hover, tap, scrub), designed as one idea with the thread and built from the
      client's own material, its photos and video first. The scroll should feel like part of the client's world:
      - The hero's world comes back as the stage of at least two later sections.
      - Each section has its own form: neighbouring sections never share a layout, and scale and background change
        between them.
      - Show a few chosen items through the interaction, not every item as rows, tables or logo grids; a full list
        belongs on an inner page.
      - At least 2-3 sections are the visitor's to control, each working by touch too. Photos show whole at their own
        ratio, never cropped into thin strips.
   3. **Corporate tone: calmer, still your own.** When the user's own words ask for a corporate tone, still
      brainstorm each section's layout, motion and interaction as in part 2, but make all of it calm, smooth and clean:
      calm reveals, gentle movement in the photos, precise transitions between sections (from the hand-over reference),
      and interactions that show information rather than play. The thread still travels its route, calmly and
      precisely, never playfully.

### 2. Build the rest
Build each section from your step 5 idea: its layout and motion, filled with the client's material and words, at the
craft and motion level of its reference. The thread travels its route ("Travelling thread" in `{{KIT}}/prompts/methods.md`);
for a corporate tone it moves as calmly as the hand-over reference. No section simply stops where the next
one starts. The whole site keeps the hero's type, colours and feel.

The working plumbing (basket ending in a filled-in WhatsApp message, catalogue, product page, quote form) is in
`{{PROJECT}}/variants/_shared/starter`: copy the parts you need into your site, keep them working, redesign everything
visible. Every control (dropdown, date picker, stepper) is built in the site's design, never the browser's default.

### 3. Look at it beside the references
`node {{KIT}}/tools/web/contact-sheet.cjs <your home page> <your section references> --moving --out {{VARIANT}}/ref/rest`
and look at `all.jpg`, then run your home page again with `--moving --phone`. These frames are the screen while
scrolling, the only place pinned sections show right (full-page shots show them wrong). Fix any section that lost its
step 5 idea, reads like a template, shares its neighbour's layout, sits still where its reference moves, or where the
thread drops out, shrinks to a marker, misses its station or passes over text. Then
`node {{KIT}}/tools/web/check-pages.cjs <each page> --phone --header <header height> --out {{VARIANT}}/ref` and fix what
looks wrong.

**Report** (under 180 words): the URL, the pages, the thread sentence, each section with its
reference and its layout and motion idea, the `all.jpg` path, anything
`[client to confirm]`.

## Working rules
- Your own headless browser only (`find-refs.cjs`, `hero-frames.cjs`, `contact-sheet.cjs`, `check-pages.cjs`), never the Playwright or
  chrome-devtools MCP tools: other agents share them. The preview runs at {{PREVIEW}}/variants/{{nn-name}}/site/;
  don't start another server.
- Stay in your folder `{{VARIANT}}`; the only shared file you write is `references/claims.md`. No git.
- No plans, gates, TDD or extra reports. Bash heredocs with quotes can fail on Windows: write scripts to files.
