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
5. **Lead review**: one desktop screenshot per variant plus `check-pages.cjs`, a grep for reference names and
   banned words, then publish.

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
  the client says.

## 4. Hero first impressions
- **Logo intro**: the client logo as a CSS mask (`cutout.py logo`), filled with a gradient and swept by animating
  `background-position` (a translated child band is too faint), a small sparkle, then a FLIP into the header logo.
  About 2.3s, skippable by click, key or wheel, skipped under reduced motion.
- **Hero film pipeline**: storyboard keyframes (4, at 16:9) -> `film.py animatic` as a placeholder the same day ->
  image-to-video per keyframe pair -> `film.py stitch`. Prompt rules: locked camera, same angle and framing in every
  keyframe (check them side by side before generating clips), backdrop colour stated as a hex, the left ~45% empty
  for the headline, no text, logos, faces (hands only) or packaging, and nothing that breaks the brand rules.
- **Placing the film**: the video sits right-aligned at full section height with a feathered left edge
  (`mask-image: linear-gradient(90deg, transparent, #000 14%)`); the section background is sampled from the film's
  own edge colours, not the brief's swatch. Steps beside the film follow `currentTime`; clicking a step seeks.
- Encodes must be TV-range yuv420p, and any zoom must be rendered on a 4x frame (both are in `film.py`).
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
- When no clean photos exist: cut products out of a busy banner with GrabCut plus a hand-placed outline polygon.
  Render the crop with a 50px grid, read the corners off it, and intersect the result with the GrabCut mask.
  Simple products can also be drawn in code (SVG/canvas).

## 6. Agents and browsers
- Parallel agents must each run their **own headless browser** (`check-pages.cjs`, or a node script requiring
  Playwright). The Playwright MCP browser is one shared page; agents navigating it at once break each other.
- Agents pass `--header <their header height>` to `check-pages.cjs` so the fit check measures below the header.
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
