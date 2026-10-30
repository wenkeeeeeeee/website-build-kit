# Subagent brief: build one variant from a reference

Fill in the {{fields}} and send one copy per variant, all in the same message so they run in parallel.
Briefs like this have built three or more full variants in 20-45 minutes, all pages working.

---

You are building one new website variant for {{CLIENT}}, adapting the design language of a reference.
Other agents are building other variants in parallel in sibling folders, so stay strictly inside your own folder.

## Your variant
- Folder: `{{PROJECT ROOT}}/variants/{{nn-name}}/` (site in `site/`, your reference captures in `ref/`).
- Concept: {{one sentence: what in this business is the hero made of? Not a style word.}}
- Reference: {{URL, or "taste-skill direction: <name>"}}. What I saw at a glance: {{2-4 lines: header, hero,
  signature sections, motion}}. Study it properly yourself (all sections, motion, components) before designing.
- Direction for {{CLIENT}}: {{one line idea}}. {{How the reference's components map to the client: which
  products/sections, which colours (from the client's own world, not the reference's), what to avoid}}.
  Change the layout and components to fit the client rather than reproducing the reference.

## Project context (read first)
- Project root: `{{PROJECT ROOT}}`. Read `docs/BRIEF.md`, `docs/BRAND-INSIGHTS.md`, `content/copy.md`,
  `content/OPEN-QUESTIONS.md`.
- {{3-5 lines of facts: what the business sells, where, proof (reviews, certificates), how people order}}.

## How to build
1. Start from the plumbing in `{{BASE}}` (the project's starter copy, `variants/_shared/starter`, or a finished variant):
   `mkdir -p variants/{{nn-name}} && cp -r {{BASE}} variants/{{nn-name}}/site`
   (run from the project root; check the result is `variants/{{nn-name}}/site/index.html`, not one level up).
   It already has the data, cart, catalogue filters and inner pages. Keep every page working, but redesign
   everything visible: home page rebuilt around the reference's components; header, footer, page heroes, cards,
   colours, type and motion restyled on every page so it reads as its own variant, not a reskin. Remove leftovers
   you don't use. Name your variant in the comment on line 1 of the main stylesheet.
2. Assets you may use: {{list: content/images/web and cutout, generated images, clean cut-outs}}. Copy what you
   use into your own `site/assets/`. New cut-outs: `python tools/web/cutout.py` (kit root), reviewed on a
   coloured background. {{Third-party branded packs: don't make them the hero subject.}}
   Never use the reference's images, logos, illustrations or copy.
3. Reference capture: use your OWN headless browser (Node Playwright from `tools/web/node_modules`, or
   `node tools/web/check-pages.cjs`). Do NOT use the Playwright MCP or chrome-devtools MCP tools: they share one
   browser with the other agents. Keep captures in `ref/`.
4. Preview server is already running at {{http://127.0.0.1:8080/}} (serves the project root): your site is at
   {{http://127.0.0.1:8080}}/variants/{{nn-name}}/site/. Don't start another server on that port.

## Rules
- Brand: {{names to feature / never feature, banned phrases, required phrasing, dietary rules}}.
  Don't invent claims, prices or facts beyond the data; unknowns show as `[client to confirm]`. No reference
  brand names or reference copy anywhere in the site.
- Don't touch anything outside `variants/{{nn-name}}/` (no edits to content/, variants/_shared/, the hub, tools/,
  or other variants). No git commits.
- Quality bar: every section fits one screen at {{1920x870}} and at {{1536x700}} below the sticky header; photos
  in split sections fill their column instead of setting its height; no white gaps at the edges of full-bleed or
  rounded sections; no plain or empty-looking sections; the footer fits one screen and fills to the bottom of the
  window when scrolled to the end; page heroes keep one left edge; respect prefers-reduced-motion; no console
  errors; no jittering animation; on a phone no sideways scroll and no art over the copy or buttons; every page has
  a title, description and share image for this variant; films have a pause button; WebGL has `gl-guard.js` and a
  still behind it.
- Lean workflow: no gates, plans, reports, TDD, fixtures or docs files; don't use the unlazy skill or the
  superpowers planning/TDD/verification/worktree skills. Design skills are fine (`frontend-design`,
  `design-taste-frontend`, `impeccable`). Check with `check-pages.cjs --phone --header <your header height>` at both
  sizes on the home page and each inner page, fix what looks off, and grep the site for reference names and
  banned words.

## Report back (short)
Folder and URL; the concept in 3-4 lines; which reference components you adapted and how; palette and fonts;
anything unconfirmed or any caveat. Under 200 words.
