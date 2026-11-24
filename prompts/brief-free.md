# Builder brief: variant 4 (free)

Fill in the {{fields}} and send it with the other briefs.

---

You are designing and building variant 4 of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}.**

**You are free of the kit:** no method, no style, any medium. Explore freely. Your page may take a form nobody
expects from this kind of business, borrowed from any medium or world, as long as **the direction fits what this
client does**. Fill it with the client's real products, services, prices and contact, so the customer understands
what the business offers and gets in touch.

1. **Know the client first.** Read all of `{{PROJECT}}/docs/FACTS.md`, `{{PROJECT}}/docs/LEAD.md` and any notes from
   earlier rounds in `{{PROJECT}}/docs/`: what they do, for whom, what is at stake for their customers, the tone, and
   everything the user has said about this client, including what was rejected and why.
2. **Three ideas**, each a different direction, one line each.
3. **Test each idea.** Does the direction fit what this client does and the feel the user asked for? Would the client
   proudly show it to their most important customer? Does anything make light of the customers, their families,
   their worries or their occasion? A playful direction (a game, a toy) fits only when the business itself fits
   play. Drop every idea that fails and write new ones.
4. **Build the boldest idea that passes**, the one that most surprises while still fitting.

Four limits only:
- Invent nothing: no prices, reviews, claims or numbers the client hasn't published. Unknowns: `[client to confirm]`.
- The client's real contact (WhatsApp, phone, booking link) works.
- It works on a phone.
- The direction fits what the client does and the feel the user asked for (step 3).

**Made assets are welcome.** Your direction may need a world the client's photos can't give: illustration, 3D,
objects, a scene. Make them yourself in code (SVG, canvas, CSS, three.js, shaders) at a finish that looks
designed, not placeholder. Made assets never pretend to be the client's own photos, people, place or work, and they
make no claims. For generated images or video, use a placeholder and list them in your report (what, where, a ready
prompt): the user makes simple ones, and Higgsfield costs credits, so it only runs with the user's approval.

## What you have
- Facts and material: `{{PROJECT}}/docs/FACTS.md` and `{{PROJECT}}/content/`.
- What the user said before: {{from FACTS.md, in full and word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.
- Tools if you want them: `{{KIT}}/tools/web/` (`find-refs.cjs` browses Awwwards and 21st.dev; the award winners are already in `{{PROJECT}}/references/awards/`; `hero-frames.cjs
  --motion` records a hero moving, `contact-sheet.cjs --moving` records a whole page scrolling, `check-pages.cjs
  --phone`), libraries in `{{PROJECT}}/tools/node_modules`.

## Hero phase (about 45 minutes)
Build the header and hero in `{{VARIANT}}/site/`. Check it moving with
`node {{KIT}}/tools/web/hero-frames.cjs <your hero url> --motion --out {{VARIANT}}/ref`.
**Report** (under 150 words): the hero URL, the three ideas, which failed the test in step 3 and why,
the one you built and why it fits this client,
anything that inspired it, the `hero-*.jpg` and `motion-*.jpg` paths, generated media you'd like or "none".

## Rest phase (about 30 minutes)
Build the rest of the site and the pages the business needs, at the hero's level and in the same direction. Plumbing you may reuse:
`{{PROJECT}}/variants/_shared/starter`. Report (under 100 words): the URL, the pages, anything `[client to confirm]`.

## Working rules
Your own headless browser only, never the Playwright or chrome-devtools MCP tools. The preview runs at
{{PREVIEW}}/variants/{{nn-name}}/site/. Stay in `{{VARIANT}}`. No git.
