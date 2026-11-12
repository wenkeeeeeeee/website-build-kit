# Subagent brief: build one variant from a reference

Fill in the {{fields}} and send one copy per variant, all in one message so they run in parallel.

---

You are building one website variant for {{CLIENT}}, adapting a reference's design language. Other agents build other
variants alongside you: stay inside your own folder.

**Phase: {{hero | rest}}.** The free variant has no reference: run `hero-frames.cjs` on your hero alone and judge it by
"The check" in `taste.md` and whether someone would remember it tomorrow.
- **hero (25 minutes):** build only the header and hero, at full craft with the real material, then run
  `node {{KIT}}/tools/web/hero-frames.cjs <your hero url> <lead reference url> --out ref` and go through the sheet as
  "The check" in `taste.md` says. Fix and re-run until each frame belongs beside the reference's. Report the sheet path:
  the user approves the hero from it before anything else is built.
- **rest (30 minutes):** the hero in your folder is approved: keep it, apart from changes listed here. Build everything
  below it and every page to the same level.

Run `date +%s` now; 5 minutes before the end, stop adding and start checking. Spend the time on craft: a fast, plain
result is a failed one.

## Your variant
- Folder: `{{PROJECT ROOT}}/variants/{{nn-name}}/` (site in `site/`, your reference captures in `ref/`).
- Direction: {{from `PITCH.md`: one sentence on what the hero is made of and what it does. Not a style word.}}
- Tone: {{playful | modern and professional, from `PITCH.md`}}. Buyer's path: {{from `PITCH.md`}}.
- Yours alone, shared with no other variant: how the buyer's path is told {{section order along the path}}; signature
  moment {{the one scroll set-piece}}; business tool {{finder, picker, dial or quote builder}}; basket name {{or none}};
  header {{its own shape}}; type pair {{fonts}}; palette {{from the client's world}}.
- Hero: {{method and recipe from "The hero" in `taste.md`; what each scroll step shows; the words; from your column of
  `PITCH.md`}}. Material: {{the exact clips and photos it uses, with sizes, from "Hero material" in `PITCH.md`}}. If
  the material can't carry a step, change the step rather than fake it, and say so in your report.
- Changes from the user: {{for a repeat hero round or the rest phase, their words; otherwise none}}.
- Reference: {{URLs, each marked Benchmark or Awwwards, and the part to take from each}}. What I saw at a glance:
  {{2-4 lines: header, hero, signature sections, motion}}.
- Adapting the reference: {{how its components map to {{CLIENT}}: which products/sections, which colours (from the
  client's world, not the reference's), what to avoid}}. Fit layout and components to the client; don't reproduce the
  reference.
- Facts: {{3-5 lines: what the business sells, where, proof (reviews, certificates), how people order}}.

## Five rules that beat your direction
1. **The hero delivers the business core and stays clean,** as "The hero" in `taste.md` says: what this business is,
   sells and is for, its main visual what the customer came for. A title with some photos is never enough. The opening
   lands there, never hiding or delaying it.
2. **The whole page matches the hero and its reference.** Take what gives the reference its impact (scale, imagery,
   colour, composition), not a small effect. Sections below at the same level, images treated like the hero's, never
   cards and text on a plain background.
3. **It carries the whole business,** like every variant ("The body" in `taste.md`), services and ways to book
   included. Your direction changes how it's told, never how much; what doesn't fit the home page story gets a designed
   inner page.
4. **It's built to sell:** "Will they buy?" in `taste.md`, in the tone set above.
5. **Every line is specific to this client.** Write from `PITCH.md` in the customer's words, and place all of "Must say"
   across the page: their problem by name, how this works, real proof, what it costs, how to start. A line that could
   sit on a competitor's site gets rewritten with this client's facts.

## Read first
In `{{PROJECT ROOT}}`: `docs/PITCH.md`, `content/copy.md`, `content/OPEN-QUESTIONS.md`. In `{{KIT}}`:
`prompts/office/taste.md`, `prompts/office/motion.md` and section 3 of `prompts/website-playbook.md`; sections 4 and 5
only for the effects and image work you're doing.

## How to build
1. **Go through every reference.** From your variant folder, run
   `node {{KIT}}/tools/web/contact-sheet.cjs <urls> --out ref --steps 24` and look at every frame. For live sites, also
   save the HTML, CSS and JS into `ref/source/` and read how the motion is built: easing, durations, pinning, section
   hand-overs. If a sheet shows a wall, loader or black page, use research's capture in `{{PROJECT ROOT}}/references/`.
2. **Load the skills:** `taste-skill` and `frontend-design` now, `image-to-code` when a reference is a still image, and
   `impeccable` for a polish pass on the home page at the end. If a name isn't listed for you, read
   `{{KIT}}/.claude/skills/<name>/SKILL.md`. This brief's concept, palette and fonts beat any skill's direction.
3. **Copy the plumbing (hero phase only; in the rest phase your site is already there).** From the project root, run
   `mkdir -p variants/{{nn-name}} && cp -r {{BASE}} variants/{{nn-name}}/site`, where `{{BASE}}` is
   `variants/_shared/starter` or a finished variant. Check the result is `variants/{{nn-name}}/site/index.html`, not one
   level up.
4. **Redesign everything visible.** It already has the data, cart, catalogue filters and inner pages: keep every page
   working. Rebuild the home page around the reference's components, and restyle the header, footer, page heroes, cards,
   colours, type and motion on every page, so it's its own variant, not a reskin. Remove what you don't use. Name your
   variant in the comment on line 1 of the main stylesheet.
5. **Build the signature moment with the kit,** as `PITCH.md` names it, not your own code: `scrub.js`, `prologue.js`,
   `stair.js`, `hotspots.js`, `film-control.js` in `{{KIT}}/tools/web/`, and `gl-guard.js` for any WebGL. Other
   libraries are in `{{PROJECT ROOT}}/variants/_shared/vendor/`.
6. **Assets you may use:** {{list: content/images/web and cutout, generated images, clean cut-outs}}. Copy what you use
   into `site/assets/`. New cut-outs: `python {{KIT}}/tools/web/cutout.py`, reviewed on a coloured background.
   {{Third-party branded packs: don't make them the hero subject.}} Never use the reference's images, logos,
   illustrations or copy.
7. **Browsers and preview.** Use your own headless browser (`{{KIT}}/tools/web/check-pages.cjs`, or Node Playwright from
   that folder), never the Playwright or chrome-devtools MCP tools: they share one browser with the other agents. The
   preview is running: your site is at {{http://127.0.0.1:8080}}/variants/{{nn-name}}/site/. Don't start another server
   on that port.

## Rules
- **Brand:** {{names to feature / never feature, banned phrases, required phrasing, dietary rules}}. Don't invent claims,
  prices or facts: unknowns show as `[client to confirm]`. No reference brand names or copy anywhere.
- **Stay in your folder:** no edits to content/, variants/_shared/, the hub, tools/ or other variants. No git commits.
- **Quality bar:** the playbook's section 3, measured at {{1920x870}} and {{1536x700}} below the sticky header. Every
  page has a title, description and share image for this variant.
- **Client's world:** the client's object runs through the site, inner pages too ("The body" in `taste.md`), as your
  `PITCH.md` column says. Well made and clear of the copy.
- **Motion:** meet the seven points in `motion.md` at your tone's level, following your column's motion plan, built
  with each section (opening and set-piece first). A section that only fades in is unfinished. Working code: only the
  matching recipes from `{{KIT}}/prompts/techniques/INDEX.md`; values from `{{KIT}}/prompts/office/craft-numbers.md`.
- **Lean workflow:** no gates, plans, reports, TDD, fixtures or docs files. No unlazy skill, no superpowers planning,
  TDD, verification or worktree skills.
- **Before you finish:**
  - `check-pages.cjs --phone --header <your header height>` at both sizes on the home page and each inner page; fix
    what looks off.
  - Re-run `hero-frames.cjs`: the hero still matches the approved one. Do the customer walk ("Will they buy?") at phone
    size.
  - Run `contact-sheet.cjs` on your site, its lead reference and one category leader from "Category look" in
    `PITCH.md`, side by side. Fix a hero or section that looks weaker, or a site that wouldn't belong beside the leader.
    On your sheet, apply "Boxes and lines" in `taste.md`.
  - Check printed fonts against "Type" in `taste.md`. Grep the site for reference names and banned words.
  - Open every dropdown, date picker and quantity stepper and screenshot it open: none may show the browser's default
    look.

## Report back (under 200 words)
Hero phase: the hero URL, the `hero-frames` sheet path, what each scroll step shows, any step the material couldn't
carry. Rest phase: folder and URL; the direction in 3-4 lines; which reference components you adapted and how; the
opening, set-piece and motion graphics built; palette and fonts; anything unconfirmed.
