# Builder brief: one variant

Fill in the {{fields}} and send one copy per variant, all in one message so they run in parallel.

---

You are designing and building one website variant for {{CLIENT}}, a real client. Other agents build other variants
alongside you: stay inside your own folder. **Phase: {{hero | rest}}.**

**You are free** in idea, layout, type, colour, medium and motion. The rules are short: `{{KIT}}/prompts/office/taste.md`
(read it first) and the facts below. The owner approves heroes on sight, beside the best sites in the category.

## The client
- Facts: {{3-6 lines from PITCH.md: what they sell, where, prices, proof, how people order, languages}}.
- Tone and character: {{tone}}; {{the 3-5 character words}}. {{For variant 4: free in tone too.}}
- What the owner said before: {{the user's past rejections and likes for this client, in their own words; or none}}.
- Your starting point: {{the client's thing this variant builds from, one line from PITCH.md; different for each
  variant}}. A better idea from the same client's world wins.
- Material: {{the prepared photos, films, cut-outs and any 3D model, with paths and sizes}}. Copy what you use into
  `site/assets/`.
- Category sites to beat: {{two URLs from "The bar" in reference-library.md, plus the category leaders from PITCH.md}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise none}}.

## Hero phase ({{45}} minutes; 60 for variant 4)
1. **Learn and look (about 15 minutes).** Read `{{PROJECT}}/docs/PITCH.md` and `content/copy.md`. Open the design lab,
   the category sites and 2-3 creative references from anywhere ("The bar" and "Craft references" in
   `{{KIT}}/prompts/office/reference-library.md`, Awwwards, games, packaging, film titles) with
   `node {{KIT}}/tools/web/contact-sheet.cjs <urls> --out ref`, and look properly.
2. **Write three different hero ideas** in one line each ("The idea" in `taste.md`). Build the strongest, not the
   safest.
3. **Build the header and hero** at full craft with the real material. Copy the plumbing first:
   `cp -r {{BASE}} variants/{{nn-name}}/site` from the project root ({{BASE}} is `variants/_shared/starter`), check that
   `variants/{{nn-name}}/site/index.html` exists. Tools: `{{KIT}}/prompts/office/motion.md`.
4. **Check it like the owner:** `node {{KIT}}/tools/web/hero-frames.cjs <your hero url> <a category site> --motion --out ref`.
   Look at the sheets cold, the motion sheet too. Would the owner stop scrolling and approve it beside the category
   site? Does it look like this business and no other? If not, redo it. No console errors.

Report (under 150 words): the hero URL, the idea in one line, the three ideas you considered, the references and what
you took from each, fonts and palette, and the `hero-*.jpg` and `motion-*.jpg` paths.

## Rest phase (30 minutes)
The approved hero stays as it is, apart from changes listed above. Build everything below it and every page to the
same level: the whole business, the buyer's path, one tool ending in WhatsApp ("Will they buy?" in `taste.md`).
The starter has working data, basket, catalogue and inner pages: keep them working, redesign everything visible, and
remove what you don't use. Build every control in the site's design (section 3 of `{{KIT}}/prompts/website-playbook.md`).

Before you finish: `node {{KIT}}/tools/web/check-pages.cjs <each page> --phone --header <header height>` and fix what
looks off; re-run `hero-frames.cjs --motion`; walk the home page at phone size as a customer; open every dropdown, date
picker and stepper. Report (under 150 words): folder and URL, what each section does, anything unconfirmed.

## Rules
- Everything in `taste.md`. No invented facts: `[client to confirm]`. {{Brand rules: names never to feature, phrases,
  claims not to make}}.
- Your own headless browser only (`check-pages.cjs`, `hero-frames.cjs` or Node Playwright), never the Playwright or
  chrome-devtools MCP tools: other agents share them. The preview runs at {{http://127.0.0.1:PORT}}/variants/{{nn-name}}/site/;
  don't start another server.
- Stay in your folder: no edits to `content/`, `variants/_shared/`, the hub, tools or other variants. No git.
- Skills that help: `taste-skill`, `frontend-design`, `impeccable` (if a name isn't listed for you, read
  `{{KIT}}/.claude/skills/<name>/SKILL.md`). No plans, reports, TDD, gates or worktrees.
- Bash heredocs with quotes can fail on Windows: write helper scripts to files.
