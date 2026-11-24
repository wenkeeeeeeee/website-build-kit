# Builder brief: variant 4 (free)

Fill in the {{fields}} and send it with the other briefs.

---

You are designing and building variant 4 of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}.**

**You are free of the kit** (no method, no style, any tone), with one brief: **turn what this business's customer
does into a format from another medium** (a game, a toy, a collectible, a map, an instrument, a scene) and fill it
with the client's real products, services, prices and contact. Not a website that looks good: a thing the customer
plays with, and through playing understands what the business offers and gets in touch. Ask what the customer
actually does with this business (chooses, books, compares, tries, collects, travels, celebrates) and which format
would let them do that on the page. Write three such ideas in one line each and build the boldest one this client's
content can really fill.

Three limits only:
- Invent nothing: no prices, reviews, claims or numbers the client hasn't published. Unknowns: `[client to confirm]`.
- The client's real contact (WhatsApp, phone, booking link) works.
- It works on a phone.

**Made assets are welcome.** Your format may need a world the client's photos can't give: illustration, 3D, a map,
pieces, cards, a scene. Make them yourself in code (SVG, canvas, CSS, three.js, shaders) at a finish that looks
designed, not placeholder. Made assets never pretend to be the client's own photos, people, place or work, and they
make no claims. For generated images or video, use a placeholder and list them in your report (what, where, a ready
prompt): the user makes simple ones, and Higgsfield costs credits, so it only runs with the user's approval.

## What you have
- Facts and material: `{{PROJECT}}/docs/FACTS.md` and `{{PROJECT}}/content/`.
- What the user said before: {{from FACTS.md, word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.
- Tools if you want them: `{{KIT}}/tools/web/` (`find-refs.cjs` browses Awwwards and 21st.dev; the award winners are already in `{{PROJECT}}/references/awards/`; `hero-frames.cjs
  --motion` records a hero moving, `contact-sheet.cjs --moving` records a whole page scrolling, `check-pages.cjs
  --phone`), libraries in `{{PROJECT}}/tools/node_modules`.

## Hero phase (about 45 minutes)
Build the header and hero in `{{VARIANT}}/site/`. Check it moving with
`node {{KIT}}/tools/web/hero-frames.cjs <your hero url> --motion --out {{VARIANT}}/ref`.
**Report** (under 150 words): the hero URL, the three ideas and the format you built, what the customer does in it,
anything that inspired it, the `hero-*.jpg` and `motion-*.jpg` paths, generated media you'd like or "none".

## Rest phase (about 30 minutes)
Build the rest of the site and the pages the business needs, at the hero's level and in the same format. Plumbing you may reuse:
`{{PROJECT}}/variants/_shared/starter`. Report (under 100 words): the URL, the pages, anything `[client to confirm]`.

## Working rules
Your own headless browser only, never the Playwright or chrome-devtools MCP tools. The preview runs at
{{PREVIEW}}/variants/{{nn-name}}/site/. Stay in `{{VARIANT}}`. No git.
