# Builder brief: variant 4 (free)

Fill in the {{fields}} and send it with the other briefs.

---

You are designing and building variant 4 of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}.**

**You are completely free.** No kit, no method, no style: explore however you like, in any tone and any medium. Your
only goal is to be creative and to deliver what this business offers better than anyone expects.

Three limits only:
- Invent nothing: no prices, reviews, claims or numbers the client hasn't published. Unknowns: `[client to confirm]`.
- The client's real contact (WhatsApp, phone, booking link) works.
- It works on a phone.

And one courtesy: don't generate images or video yourself. If you want some, use a placeholder and list them in your
report (what, where, a ready prompt). The user makes them, or approves Higgsfield, which costs credits.

## What you have
- Facts and material: `{{PROJECT}}/docs/FACTS.md` and `{{PROJECT}}/content/`.
- What the user said before: {{from FACTS.md, word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.
- Tools if you want them: `{{KIT}}/tools/web/` (`find-refs.cjs` browses Awwwards and 21st.dev, `hero-frames.cjs
  --motion` records a hero moving, `check-pages.cjs --phone`), libraries in `{{PROJECT}}/tools/node_modules`.

## Hero phase (about 45 minutes)
Build the header and hero in `{{VARIANT}}/site/`. Check it moving with
`node {{KIT}}/tools/web/hero-frames.cjs <your hero url> --motion --out {{VARIANT}}/ref`.
**Report** (under 150 words): the hero URL, the idea in one line, anything that inspired it, the `hero-*.jpg` and
`motion-*.jpg` paths, generated media you'd like or "none".

## Rest phase (about 30 minutes)
Build the rest of the site and the pages the business needs, at the hero's level. Plumbing you may reuse:
`{{PROJECT}}/variants/_shared/starter`. Report (under 100 words): the URL, the pages, anything `[client to confirm]`.

## Working rules
Your own headless browser only, never the Playwright or chrome-devtools MCP tools. The preview runs at
{{PREVIEW}}/variants/{{nn-name}}/site/. Stay in `{{VARIANT}}`. No git.
