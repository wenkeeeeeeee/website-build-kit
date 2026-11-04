# Subagent brief: build one variant from a reference

Fill in the {{fields}} and send one copy per variant, all in the same message so they run in parallel.

---

You are building one website variant for {{CLIENT}}, adapting the design language of a reference. Other agents are
building other variants alongside you, so stay inside your own folder.

You have **30 minutes**. Run `date +%s` now, and at 25 minutes stop adding and start checking. Spend the time on craft:
a fast, plain result is a failed one.

## Your variant
- Folder: `{{PROJECT ROOT}}/variants/{{nn-name}}/` (site in `site/`, your reference captures in `ref/`).
- Concept: {{one sentence: what in this business is the hero made of? Not a style word.}}
- Tone: {{playful | modern and professional, from `PITCH.md`}}. Buyer's path: {{from `PITCH.md`}}.
- Yours alone, shared with no other variant: how the buyer's path is told {{section order along the path}}; signature moment {{the one scroll
  set-piece}}; business tool {{finder, picker, dial or quote builder}}; basket name {{or none}}; header {{its own
  shape}}; type pair {{fonts}}; palette {{from the client's world}}.
- Hero: {{its visual idea, words and anything else on the first screen, and whether it's scroll-driven and what each
  scroll step shows, from your column of `PITCH.md`}}.
- Reference: {{URLs and the part to take from each, or "taste-skill direction: <name>"}}. What I saw at a glance:
  {{2-4 lines: header, hero, signature sections, motion}}.
- Direction for {{CLIENT}}: {{one line idea}}. {{How the reference's components map to the client: which
  products/sections, which colours (from the client's world, not the reference's), what to avoid}}.
  Fit the layout and components to the client rather than reproducing the reference.
- Facts: {{3-5 lines: what the business sells, where, proof (reviews, certificates), how people order}}.

## Five rules that beat your concept
1. **The hero delivers the business core and stays clean.** Follow "The hero" in `taste.md`: it says what this business
   is, what it sells and who it's for, in a clean, attractive and creative first screen with no heavy text. Its main
   visual is what the customer came for, shown so they want it. A title with some photos is never enough. The opening must land there, never hide or delay it.
2. **The whole page matches the hero and its reference.** Take what gives the reference its impact (scale, imagery,
   colour, composition), not just a small effect. Design the sections below at the same level, and treat their images the
   same way as the hero's. Don't fall back on cards and text on a plain background.
3. **This variant carries the whole business, as every other variant does.** Every product or service with its price,
   every page in `PITCH.md`, and all the proof, offers, questions, locations and ways to order or book. Your concept
   changes how it's told, never how much. If something doesn't fit the home page story, give it a designed inner page.
4. **It's built to sell.** Follow "Will they buy?" in `taste.md`: sections in the buyer's path order, the buying
   basics, and persuasion over show, in the tone set above.
5. **Every line is specific to this client.** Write from `PITCH.md`, in the customer's words, and place all of "Must
   say" across the page: their problem by name, how this works, real proof, what it costs, how to start. If a line could
   sit on a competitor's site, rewrite it with this client's facts.

## Read first
In `{{PROJECT ROOT}}`: `docs/PITCH.md`, `content/copy.md` and `content/OPEN-QUESTIONS.md`. In `{{KIT}}`:
`prompts/office/taste.md`, `prompts/office/motion.md` and section 3 of `prompts/website-playbook.md`. Use sections 4 and
5 only for the effects and image work you're doing.

## How to build
1. **Go through every reference.** From your variant folder, run
   `node {{KIT}}/tools/web/contact-sheet.cjs <urls> --out ref --steps 24` and look at every frame. For live sites, also save
   the HTML, CSS and JS into `ref/source/` and read how the motion is built: easing, durations, pinning and how sections
   hand over. If a sheet shows a wall, loader or black page, use the one research saved in `{{PROJECT ROOT}}/references/`.
2. **Load the skills.** `taste-skill` and `frontend-design` now, `image-to-code` when a reference is a still image, and
   `impeccable` for a polish pass on the home page at the end. If a name isn't listed for you, read
   `{{KIT}}/.claude/skills/<name>/SKILL.md`. This brief's concept, palette and fonts beat any skill's direction.
3. **Copy the plumbing.** From the project root, run
   `mkdir -p variants/{{nn-name}} && cp -r {{BASE}} variants/{{nn-name}}/site`, where `{{BASE}}` is `variants/_shared/starter`
   or a finished variant. Check the result is `variants/{{nn-name}}/site/index.html`, not one level up.
4. **Redesign everything visible.** It already has the data, cart, catalogue filters and inner pages, so keep every page
   working. Rebuild the home page around the reference's components, and restyle the header, footer, page heroes, cards,
   colours, type and motion on every page, so it's its own variant and not a reskin. Remove what you don't use. Name your
   variant in the comment on line 1 of the main stylesheet.
5. **Build the signature moment with the kit,** as `PITCH.md` names it, rather than writing your own: `scrub.js`,
   `prologue.js`, `stair.js`, `hotspots.js`, `film-control.js` in `{{KIT}}/tools/web/`, and `gl-guard.js` for any WebGL.
   Other libraries are in `{{PROJECT ROOT}}/variants/_shared/vendor/`.
6. **Assets you may use:** {{list: content/images/web and cutout, generated images, clean cut-outs}}. Copy what you use
   into `site/assets/`. New cut-outs: `python {{KIT}}/tools/web/cutout.py`, reviewed on a coloured background. {{Third-party
   branded packs: don't make them the hero subject.}} Never use the reference's images, logos, illustrations or copy.
7. **Browsers and preview.** Use your own headless browser (`{{KIT}}/tools/web/check-pages.cjs`, or Node Playwright from
   that folder), never the Playwright or chrome-devtools MCP tools, because they share one browser with the other agents.
   The preview is already running: your site is at {{http://127.0.0.1:8080}}/variants/{{nn-name}}/site/. Don't start another
   server on that port.

## Rules
- **Brand:** {{names to feature / never feature, banned phrases, required phrasing, dietary rules}}. Don't invent claims,
  prices or facts: unknowns show as `[client to confirm]`. No reference brand names or copy anywhere.
- **Stay in your folder:** no edits to content/, variants/_shared/, the hub, tools/ or other variants. No git commits.
- **Quality bar:** the playbook's section 3, measured at {{1920x870}} and {{1536x700}} below the sticky header. Every page has a
  title, description and share image for this variant.
- **Client's world:** carry the client's own object through the intro, transitions, image frames and small details, on
  inner pages too, as your column of `PITCH.md` says. Keep it well made and clear of the copy.
- **Motion:** meet the seven points in `motion.md` at the level your tone allows, following your column's motion plan. Build it with each section,
  starting with the opening and the set-piece. A section that only fades in is unfinished.
- **Lean workflow:** no gates, plans, reports, TDD, fixtures or docs files. Don't use the unlazy skill or the superpowers
  planning, TDD, verification or worktree skills.
- **Before you finish:** run `check-pages.cjs --phone --header <your header height>` at both sizes on the home page and each
  inner page, and fix what looks off. Check your first screen against "The hero" in `taste.md`, and do the customer walk
  from "Will they buy?" at phone size. Check "Boxes and lines" in `taste.md` on your contact sheet: keep the boxes and
  dividers that earn their place, make them creative, and rework the rest. Run `contact-sheet.cjs` on
  your site, its lead reference and one category leader from "Category look" in `PITCH.md`, and compare them side by
  side: if your hero or any section looks weaker, or your site wouldn't belong beside the category leader, fix it. Check
  the printed fonts against "Type" in `taste.md`. Grep the site for reference names and banned words.

## Report back (under 200 words)
Folder and URL; the concept in 3-4 lines; which reference components you adapted and how; the opening, set-piece and
motion graphics you built; palette and fonts; anything unconfirmed.
