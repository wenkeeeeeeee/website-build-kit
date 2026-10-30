# Website build playbook

Methods that worked, and the mistakes that cost time, from past multi-variant website builds.
Read this before starting a website job. The brief template is `website-build-template.md`, the subagent brief
is `variant-agent-brief.md`, the scripts are in `tools/web/` and the working shop plumbing is in `starter/`.

## 1. Project layout
```
WebsiteProjects/<Project>/
  index.html            hub: one <li><strong>V1 · Name</strong><span>one line</span><a class="go" href="variants/01-x/site/">Open</a></li> per variant
  docs/                 BRIEF.md, BRAND-INSIGHTS.md (research), SPEC.md (short)
  content/              client data as JSON (products, recipes, gifting, reviews, certifications), copy.md,
                        OPEN-QUESTIONS.md, images/{web,cutout}, generated/ (AI images, storyboards)
  references/<nn>-<name>/   captures and notes (local only)
  variants/_shared/     shared cart, effects library, starter copy
  variants/<nn>-<name>/{clone,site,ref,tools}/   clone and ref stay local; only site/ is published
```
- The hub list format matters: `export-site.py` builds the published README from it.
- Preview with `tools/web/serve.py` (not `python -m http.server`: stale JS, videos that will not loop or seek).

## 2. Order of work that was fastest
1. **Content kit first.** Pull the client's products, prices, reviews, certificates and images into
   `content/`. Every unknown becomes a visible `[client to confirm]` tag on the page and a line in OPEN-QUESTIONS.md.
   Write the brand rules down once in BRAND-INSIGHTS.md (names to feature or avoid, banned phrases, dietary claims, tone).
2. **Plumbing from `starter/`.** Copy it, swap in the client's data, and drop or add pages to fit. It already has
   the basket (checks out by WhatsApp message and/or the client's marketplace shop), catalogue with filters,
   product page, quote form and stores list. With it, all variants can start in parallel straight away.
   Without a starter, finish one complete variant first and copy that.
3. **Every variant starts as a copy of the plumbing** and redesigns everything visible (home page rebuilt around
   the reference's components; header, footer, page heroes, cards, colours, type, motion restyled on every page).
   Built this way in parallel, a variant takes 20-45 minutes.
4. **Parallel subagents, one per variant folder**, using `variant-agent-brief.md`. They never touch shared files
   (content/, _shared/, the hub, other variants); the lead adds hub entries afterwards.
5. **Lead review**: one desktop screenshot per variant plus `check-pages.cjs --phone`, a grep for reference names
   and banned words, then publish.

**One concept per variant, taken from the client's own world.** The strongest variants are an idea, not a style:
a self-photo studio whose strip prints out of the hero; an optician whose logo's O opens into the campaign films;
a case-support team whose site is a case file with the seal under a target lock; a pasta shop whose menu is a
receipt. Before building, write one sentence for each variant: what in this business is the hero made of? "Dark
and elegant" is not a concept. "Each room is a magazine cover" is, and it tells you every section. Give each
variant its own structure as well as its own skin: identical briefs on one starter come back as three reskins of
one template, so vary the section order, the story spine and the page furniture, and keep only the plumbing shared.

**Shape the plumbing to the business.** The basket is a general list, so rename it instead of bolting on something
new: a shoot list for a studio, a try-on list for an optician, a confidential request for a support service. Each
still ends in one WhatsApp message with everything filled in. Add the one tool the business needs on top of it (a
lens picker, a frame finder, a branch map, a booking form) only when it answers a question customers really ask.

## 3. The quality bar (all of these came back as change requests)
- **Every section fits one screen** at the client's real window, below the sticky header. Ask for it; a common
  one is 1920x870 at 125% zoom (~1536x700 CSS px). Measure with `check-pages.cjs`, not by eye at 1440x900.
- **Split sections (text + photo): the text sets the height.** A photo with `height: 100%` in a grid cell falls
  back to its natural height and stretches the row. Fix:
  `.media { position: relative; min-height: 300px } .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover }`
- **No white gaps.** Full-bleed coloured sections sitting on a white page get square bottom corners (rounded ones
  show white wedges). The footer gets `min-height: 100svh; display: flex; flex-direction: column` with top padding
  for the floating header, and its first band `flex: 1`, so scrolling to the end shows no white strip.
- **Page heroes: one left edge.** Kicker, title, copy and button stacked on the left, artwork on the right. A
  title in the bottom-left with copy in the top-right reads as misaligned.
- **Nothing plain.** Add real components on photos: code tags, hover actions that do something (WhatsApp with
  a pre-written message, "Add to my quote" that fills the form), product cut-outs floating in panels.
- **Footer**: rich (closing invitation, links, certificates) but no taller than one screen; no cut-off giant
  watermark logos.
- **Forms**: fields three across, live preview next to the form, inputs pinned to the top of their row
  (`label { align-content: start }`) so a hint under one field does not stretch the others.
- **Names on the hub**: short and plain ("V1 · Green Shop", "V2 · Green Shop, upgraded"), one-line description.
- **Sticky header**: `body { overflow-x: hidden }` breaks `position: sticky`; use `overflow-x: clip`.
- Hero film pause button: WCAG 2.2.2 asks for one when motion loops longer than 5s. Mention it, then do what
  the client says. `film-control.js` does this.
- **Phones get checked too.** Run `check-pages.cjs --phone` on every variant; it takes no extra review. On a phone
  an off-screen element widens the whole page, and a hero collage built for desktop lands on its own buttons.
  At the phone width give the hero a plain stacked layout: words, buttons, then the artwork, never art over copy.
- **Scroll cues and decoration keep out of the buttons' way.** Hide a "scroll" cue on short and phone screens.
- **A closed drawer or menu off to the side** needs `overflow: hidden` on its fixed wrapper.
- **Share preview.** Clients send the link on WhatsApp first, and it looks broken with no image. Every page needs
  `og:title`, `og:description` and a 1200x630 `og:image`, and the image must be a full `https://` address when
  published. Make the image from the variant's hero, not the logo on white.
- **Sensitive services** (victims, health, legal): the first screen says what to do in danger, with the emergency
  number and "no names needed"; nothing public happens without consent; no stock victims or staged distress.
  Symbols, cities and paperwork carry the story instead of faces.
- **Two languages:** keep the client's own words in their language as short mottos and headings next to the
  translation, and mark them `lang="ms"` (or the right code) so screen readers pronounce them properly.
- **Older audiences:** body text 19-20px, nothing under 16px, 7:1 body contrast, no translucent grey text, buttons
  48px+ with words, chapter labels with names (not dots), phone and WhatsApp as visible buttons, a "Skip the film"
  link, calm motion. Check the digits in the body face: slashed zeros make prices hard to read.

## 4. Hero first impressions
- **Logo intro**: the client logo as a CSS mask (`cutout.py logo`), filled with a gradient and swept by animating
  `background-position` (a translated child band is too faint), a small sparkle, then a FLIP into the header logo.
  About 2.3s, skippable by click, key, wheel or touch, skipped under reduced motion.
- **The intro doubles as the preloader**: wait for the hero poster to decode (cap it at about 3s), and land the
  intro's shape exactly on its twin in the hero so nothing jumps. Show it once per session. Decide in an inline
  script in `<head>`, adding a class to `<html>` before first paint, or the page flashes first.
- **Hero film pipeline**: storyboard keyframes (4, at 16:9) -> `film.py animatic` as a placeholder the same day ->
  image-to-video per keyframe pair -> `film.py stitch`. Prompt rules: locked camera, same angle and framing in every
  keyframe (check them side by side before generating clips), backdrop colour stated as a hex, the left ~45% empty
  for the headline, no text, logos, faces (hands only) or packaging, and nothing that breaks the brand rules.
- **Placing the film**: the video sits right-aligned at full section height with a feathered left edge
  (`mask-image: linear-gradient(90deg, transparent, #000 14%)`); the section background is sampled from the film's
  own edge colours, not the brief's swatch. Steps beside the film follow `currentTime`; clicking a step seeks.
- Encodes must be TV-range yuv420p, and any zoom must be rendered on a 4x frame (both are in `film.py`).
- **Serving a film**: a 1280 mp4 for screens up to 1100px (`<source media="(max-width: 1100px)">`), a 1920 webm and
  mp4 for the rest, a poster, and a separate still for reduced motion. `preload="auto"` on the first film only, and
  `preload="none"` on every film below it. Pause anything off screen (`film-control.js`).
- **Scroll-scrubbed film** ("the video moves as you scroll"): `frames.py` cuts a film into 100-150 webp frames (1280w
  plus a 720w phone set, 3-14 MB), `scrub.js` draws them on a sticky canvas, loading coarse-to-fine so fast scrolling
  never shows a blank. Hero about 300vh, other pinned scenes 200vh or less. The film must be one continuous shot
  with slow one-direction camera motion; plain backdrops keep frames light, detailed textures make them heavy.
  Build with stand-in frames, never time copy to the film, and re-cut the final film into the same folder.
- **3D hero, no AI video needed.** When a client says "still basic", 3D scroll beats a film. Two ways that worked:
  (1) `stair.js`: a spiral of floating steps with real product cut-outs, the camera climbing from stop to stop, so
  the hero is also the product section. (2) Build the product itself in code: for objects made of tubes, rings and
  extrusions (eyewear, bottles, watches, furniture), three.js geometry in real millimetres with `RoomEnvironment`
  reflections looks like a studio shot and needs no model file. Scroll takes it apart or assembles it, labels name
  the parts, and it can crossfade into a real photo at the end.
- **Rules for any WebGL**: load `gl-guard.js` first, keep a still image behind the canvas for when WebGL is missing
  or the visitor prefers reduced motion, and pause rendering off screen. One canvas per page where you can.
- **Interactive canvas with no photos** suits a client with few images: a cursor-driven ink fluid
  (github.com/PavelDoGreat/WebGL-Fluid-Simulation, MIT: keep its credit in your file) with frosted shapes drifting
  toward the logo. Keep the palette light so dye never mixes to mud, and keep it off the copy on phones.
- **Long brand opening** (`prologue.js`): dark ground, a warm light beam, embers and gold dust, the logo swept in
  gold, then the story in acts, about 9-10 screens of scrolling, with act labels and "Skip the story". Never loop or
  ping-pong a short clip to make it last, because clients notice the rewind: scrub it over scroll and let generated
  layers carry the length.
- **Storytelling brands**: if "branding" means story to this client, the home page is ONE story whose transitions
  carry you from product to product, with no cards, prices or callouts until a quiet "find them in our shop" at
  the end. A still per scene ("same scene, change only X" for hand-offs) beats short clips for long stories.
- **Pinned scenes must not start or end empty**: anything that fades out at progress 1 or fades in from 0 shows a
  blank screen while the sticky stage scrolls in or out. Keep the last state visible on exit and start reveals
  partly open.
- Shared CSS for these effects: put theme defaults in `:where(.x)` and generic rules in `.pro :where([data-in])`, so
  a variant's own styles win whatever the load order.
- A reveal that starts at `clip-path: inset(0 0 100% 0)` has zero visible area and never fires
  IntersectionObserver. Leave a 2px strip showing and use threshold 0.
- A canvas-drawn interactive scene is a good stopgap until real footage exists; keep it behind a `data-mode`
  switch rather than deleting it.

## 5. Images
- No new photography: use the client's images, generated images (`content/generated/`), and clean cut-outs.
- Check client photos for third-party watermarks or brand marks (a supplier's logo in a corner); crop or skip them.
- Packs that show a third-party supplier's brand must not be the hero subject; lead with the product itself.
- `cutout.py shadow` removes studio shadows; always review on a coloured background (`cutout.py sheet`). Pale or
  grey subjects (glass, white surfaces, pale fruit) lose pixels: choose another image instead of tuning thresholds.
- Display fonts may lack glyphs (Anton has no curly quotes): check punctuation set in the display face.
- Check the image-generation quota before planning AI images (some free-tier keys allow zero images).
- Mix real and generated deliberately: real photos for rooms, staff and equipment (they prove the business exists),
  generated images for mood.
- Round slots need a round crop made from the food or product alone. Cutting a circle from a square photo shows the
  background in the corners. Keep product shots square and centred across a catalogue, not odd-ratio crops.
- `hotspots.js` for shop-the-look dots: positions are fractions of the image, so they stay on the product under
  `object-fit: cover`.
- When no clean photos exist: cut products out of a busy banner with GrabCut plus a hand-placed outline polygon.
  Render the crop with a 50px grid, read the corners off it, and intersect the result with the GrabCut mask.
  Simple products can also be drawn in code (SVG/canvas).

## 6. Agents and browsers
- Parallel agents must each run their **own headless browser** (`check-pages.cjs`, or a node script requiring
  Playwright). The Playwright MCP browser is one shared page; agents navigating it at once break each other.
- Agents pass `--header <their header height>` and `--phone` to `check-pages.cjs`. Without the real header height
  every exact-one-screen section is flagged.
- The Playwright MCP window is throttled to ~1fps in the background: animations look broken and timings lie.
  Call `page.bringToFront()` first, or step animations manually.
- Background shell commands stop after 2 hours (the dev server too). Restart it when links stop loading.
- Impeccable hook findings: fix readable text that fails AA (usually translucent text: drop the opacity);
  decorative `aria-hidden` giant words are an intended exception, record it with
  `impeccable hooks ignore-value low-contrast "*" --file <page> --reason "..."` and say so.

## 7. Publishing
- A **separate repo folder** (e.g. `WebsiteProjects/<client>-website`) linked to a private GitHub repo and a
  Vercel project that redeploys on every push to `main`. Nothing to do in Vercel after setup.
- `python tools/web/export-site.py <project> <repo>`, then in the repo: `git add -A`, check `git status --short`
  shows only what you expect, commit, **confirm with `git log --oneline -1` that the commit exists**, push.
  (Once `git add` failed silently and "Everything up-to-date" was the only sign.)
- Always run git with an absolute path or `git -C <repo>`: a typo once ran the commit in the parent folder.
- Check the live site with curl until the new page returns 200 (usually within a minute).
- Commit with the machine's normal git identity. A commit authored with an email that isn't on the Vercel account
  deploys as **Blocked** (fix: `git rebase --root --exec "git commit --amend --no-edit --reset-author"`).
- New separate site: `gh repo create <owner>/<name> --private --source . --push`, then `vercel project add <name>`,
  `vercel link --yes --project <name>`, `vercel git connect <repo url> --yes`, and push once more to deploy.
- After publishing, send the link to yourself on WhatsApp and check the preview card.
- Page weight of real shipped home pages: about 1-3.5 MB of images, under 4 MB of film. Over that, look for what
  should be `loading="lazy"` or `preload="none"` before cutting quality.
- A variant can stay local with `--skip <folder>`; removing a published variant = re-export without it and push.

## 8. Sourcing when the client has no website
- Shopee blocks shop listings for logged-out browsers (a "verify/traffic" page), but the page still loads
  `shop/get_shop_base_v2`, which has the shop description, rating, rating count and cover banner. Capture it with
  real Chrome (`channel: 'chrome'`, headful) and log the `/api/v4/` responses. Images: `https://down-my.img.susercontent.com/file/<id>`.
- Instagram without login: the profile page lists about 12 post codes. `https://www.instagram.com/p/<code>/media/?size=l`
  returns the full-size image, and fetching `/p/<code>/` with the `facebookexternalhit/1.1` user agent gives the caption
  in `og:title`. Collab posts by bloggers often carry the best facts (percentages, origin, stockists).
- Facebook, Instagram and TikTok pages are login-walled, but headless Chrome still gets the bio text. Linktree pages
  often lead to the real menu or catalogue; menus made on Canva sites (`*.my.canva.site`) have high-res page images.
- Sources often disagree (opening hours, prices): pick the most recent, mark it `[client to confirm]`.
- If the marketplace shop lists no items, make WhatsApp the main checkout and link the shop second.
