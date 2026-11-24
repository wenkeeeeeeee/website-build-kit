# Builder brief: variant 4 (free)

Fill in the {{fields}} and send it with the other briefs.

---

You are designing and building variant 4 of a website for {{CLIENT}}, a real business. Other agents build other
variants at the same time: stay in your own folder. **Phase: {{hero | rest}}.**

**You are free of the kit:** no method, no style, any medium. This variant is your own exploration. Invent the whole
experience yourself, the way a studio makes an interactive piece for one client: a world, a place, an object, a
journey or a scene the visitor explores, made out of this client's business. Nobody hands you a reference or a
layout; you find it by exploring and trying things. Your job is a page nobody expects from this kind of business
that still fits what this client does: the client is proud of it and their customer remembers it. Fill it with the
client's real products, services, prices and contact, so the customer understands what the business offers and gets
in touch.

**Your idea is the form of the page:** what the visitor sees and does on the first screen, how the page itself works,
and how they move through what the business offers. It can come from any medium or world. A theme, pattern, palette
or font laid on a usual layout is not an idea.

1. **Know the client first.** Read all of `{{PROJECT}}/docs/FACTS.md`, `{{PROJECT}}/docs/LEAD.md` and any notes from
   earlier rounds in `{{PROJECT}}/docs/`: what they do, for whom, what is at stake for their customers, the tone, and
   everything the user has said about this client, including what was rejected and why.
2. **Explore, then write three ideas.** Look at the business from every side: what the customer goes through with
   it, the objects, places, sounds, rituals and moments of its world, what it would be if it were not a website.
   Then write three ideas, each a different form, one line each: what the visitor sees, what they do, and how that
   shows the business.
3. **Test each idea twice. It must pass both.**
   - **Fits.** It suits what this client does, who their customers are and the feel the user asked for, and the
     client would proudly show it to their most important customer. Nothing in it makes light of the customers,
     their families, their worries or their occasion. A game or a toy fits only when the business itself is playful.
   - **Unexpected.** Picture the first screen. Would a visitor recognise it as a usual website (a headline and button
     beside a picture, a hero above a stack of sections, a theme laid on a template) or as a plain software screen (a
     dashboard, a chart, an app screen)? Then it fails. An interactive tool designed as part of your world passes.

   The feel the user asks for (professional, calm, premium, warm) decides how the page feels, never its form: an
   unexpected form can be calm and respectful. Drop every idea that fails either test and write new ones until one
   passes both.
4. **Try before you choose.** Build a rough first screen of the two strongest ideas that pass (about 10 minutes
   each), look at them moving, and keep the one that surprises most while still fitting. Then build it properly.

Four limits only:
- Invent nothing: no prices, reviews, claims or numbers the client hasn't published. Unknowns: `[client to confirm]`.
- The client's real contact (WhatsApp, phone, booking link) works and stays in reach.
- It works on a phone.
- It passes both tests in step 3, on the first screen and below it.

**Made assets are welcome.** Your form may need a world the client's photos can't give: illustration, 3D, objects,
a scene. Make them yourself in code (SVG, canvas, CSS, three.js, shaders) at a finish that looks designed, not
placeholder. Made assets never pretend to be the client's own photos, people, place or work, and they
make no claims. For generated images or video, use a placeholder and list them in your report (what, where, a ready
prompt): the user makes simple ones, and Higgsfield costs credits, so it only runs with the user's approval.

## What you have
- Facts and material: `{{PROJECT}}/docs/FACTS.md` and `{{PROJECT}}/content/`.
- What the user said before: {{from FACTS.md, in full and word for word, or "none"}}.
- Changes from the user: {{their words for a repeat round or the rest phase; otherwise "none"}}.
- Tools if you want them: `{{KIT}}/tools/web/` (`find-refs.cjs` browses Awwwards and 21st.dev, and the award
  winners are already in `{{PROJECT}}/references/awards/`; `hero-frames.cjs --motion` records a first screen moving;
  `contact-sheet.cjs --moving` records a whole page scrolling; `check-pages.cjs --phone`), libraries in
  `{{PROJECT}}/tools/node_modules`.

## Hero phase (about 60 minutes, including the two tries)
Build the first screen in `{{VARIANT}}/site/`: your form, with a header only if the form needs one. Check it moving
with `node {{KIT}}/tools/web/hero-frames.cjs <your hero url> --motion --out {{VARIANT}}/ref`, then put both tests to
the frames, not to your plan: if the result reads as a usual website, change it.
**Report** (under 150 words): the hero URL; the three ideas and which test each failed and why; the two you tried
and why you kept one; why it fits this client and why it is not a usual website; anything that inspired it; the
`hero-*.jpg` and `motion-*.jpg` paths; generated media you'd like, or "none".

## Rest phase (about 30 minutes)
Build the rest in the same form, at the first screen's level: pages and sections only where the form needs them,
with every service, price and the contact still reachable. A form that turns into a usual website below the first
screen fails the same test. Plumbing you may reuse: `{{PROJECT}}/variants/_shared/starter`.
**Report** (under 100 words): the URL, the pages, anything `[client to confirm]`.

## Working rules
Your own headless browser only, never the Playwright or chrome-devtools MCP tools. The preview runs at
{{PREVIEW}}/variants/{{nn-name}}/site/. Stay in `{{VARIANT}}`. No git.
