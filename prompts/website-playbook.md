# Website build playbook

Methods and lessons from past builds. Look things up here: nobody needs to read all of it.

| You are | Read |
|---|---|
| Research agent | Section 8 |
| Build lead | Sections 1, 6 and 7 |
| Builder | Section 3, plus the parts of 4 and 5 you're using |
| Running a build by hand | Sections 1 and 2, then as needed. The brief template is `website-build-template.md` |

Scripts are in `tools/web/`, the working shop plumbing is in `starter/`, and the subagent brief is
`variant-agent-brief.md`.

## 1. Project layout
```
WebsiteProjects/<Project>/
  index.html            hub: one <li><strong>V1 · Name</strong><span>one line</span><a class="go" href="variants/01-x/site/">Open</a></li> per variant
  docs/                 LEAD.md, PITCH.md, BRAND-INSIGHTS.md
  content/              client data as JSON, copy.md, OPEN-QUESTIONS.md, images/{web,cutout}, generated/
  references/<nn>-<name>/   captures and notes (local only)
  variants/_shared/     shared cart, effects library, starter copy, vendor libraries
  variants/<nn>-<name>/{clone,site,ref,tools}/   only site/ is published
```
- `export-site.py` builds the published README from the hub list, so keep that format.
- Hub names are short and plain ("V1 · Green Shop"), with a one-line description.
- Preview with `tools/web/serve.py`, not `python -m http.server`, which gives stale JS and videos that won't loop or seek.

## 2. Order of work
1. **Content kit first.** Pull products, prices, reviews, certificates and images into `content/`. Every unknown becomes
   a visible `[client to confirm]` tag and a line in `OPEN-QUESTIONS.md`. Write brand rules once in `BRAND-INSIGHTS.md`.
2. **Plumbing from `starter/`.** Copy it, swap in the data, and drop or add pages. It has the basket (WhatsApp and/or
   marketplace checkout), catalogue with filters, product page, quote form and stores list.
3. **One subagent per variant folder,** using `variant-agent-brief.md`. Each copies the plumbing and redesigns everything
   visible, in 20-45 minutes. They never touch shared files, and the lead adds hub entries afterwards.
4. **Lead review:** one desktop screenshot per variant, `check-pages.cjs --phone`, a grep for reference names and banned
   words, then publish.

**One concept per variant, from the client's own world.** Vary the story spine and page furniture too: identical
briefs on one starter come back as three reskins. The buyer's path order can repeat; how each step is told can't. See "What makes a concept" in `office/research.md`.

**Shape the plumbing to the business.** Rename the basket rather than adding something new: a shoot list, a try-on list,
a confidential request. It still ends in one filled-in WhatsApp message. Add one tool (lens picker, frame finder, branch
map, booking form) only when it answers a question customers really ask.

## 3. The quality bar
Every item here came back from a client as a change request.

**Layout**
- **Every section fits one screen** at the client's real window, below the sticky header. A common one is 1920x870 at
  125% zoom (about 1536x700 CSS px). Measure with `check-pages.cjs`, not by eye.
- **In split sections, the text sets the height.** A photo with `height: 100%` stretches the row. Fix:
  `.media { position: relative; min-height: 300px } .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover }`
- **No white gaps.** Full-bleed coloured sections on a white page get square bottom corners.
- **Heroes are clean,** as "The hero" in `office/taste.md` says. On page heroes, title, copy and button stack on one left
  edge with artwork on the right.
- **Nothing plain below the hero.** Add real components on photos: code tags, hover actions that do something (WhatsApp
  with a pre-written message, "Add to my quote" that fills the form), cut-outs floating in panels.
- **Keep scroll cues and decoration away from buttons.** Hide scroll cues on short and phone screens.

**Header, footer and forms**
- **Sticky header:** `body { overflow-x: hidden }` breaks `position: sticky`, so use `overflow-x: clip`.
- **Footer:** rich (closing invitation, links, certificates) but no taller than one screen, with no cut-off watermark
  logos. Give it `min-height: 100svh; display: flex; flex-direction: column` with top padding for the floating header,
  and its first band `flex: 1`, so the end of the page shows no white strip.
- **Forms:** fields three across, live preview beside the form, and `label { align-content: start }` so a hint under one
  field doesn't stretch the others.

**Phones**
- Run `check-pages.cjs --phone` on every variant. An off-screen element widens the whole page.
- The phone hero is a plain stack: words, button, then the visual, never art over copy.
- A closed side drawer or menu needs `overflow: hidden` on its fixed wrapper.

**Sharing and audiences**
- **Share preview:** clients send the link on WhatsApp first. Every page needs `og:title`, `og:description` and a 1200x630
  `og:image` made from the variant's hero, with a full `https://` address when published.
- **Hero film pause button:** WCAG 2.2.2 asks for one when motion loops past 5s. `film-control.js` does this.
- **Sensitive services** (victims, health, legal): the first screen says what to do in danger, with the emergency number
  and "no names needed". That is the one addition to the clean hero. Nothing public happens without consent, and there
  are no stock victims or staged distress: symbols, cities and paperwork carry the story.
- **Two languages:** keep the client's own words as short mottos and headings beside the translation, marked
  `lang="ms"` or the right code.
- **Older audiences:** body text 19-20px, nothing under 16px, 7:1 body contrast, no translucent grey text, buttons 48px+
  with words, named chapter labels, phone and WhatsApp as visible buttons, a "Skip the film" link, calm motion. Check
  the digits: slashed zeros make prices hard to read.

**Transitions**

Smoothness comes from choreography, so a screenshot or frame counter won't show it.
- **Design every join.** Hand over with a colour wash, an object carried across, a pinned panel the next slides over, or
  an image growing into the next section. Stacked sections that fade up read as basic. Never mark a change of section
  with a hard straight edge between flat colour bands, a ruled line or a border: the user rejects them on sight. Where
  two backgrounds meet, blend them, let an image or object cross the join, or leave generous space.
- **Scroll-linked motion** eases toward its target each frame, so nothing snaps. Triggered reveals stagger over 0.6-1s on
  a long ease-out such as `cubic-bezier(.16,1,.3,1)`, never linear or bouncy.
- **One motion language per variant,** including hover and press states on everything clickable.
- **Animate only `transform`, `opacity` and `clip-path`,** never height, top or margin.
- **Pages join up too,** with a short wipe or the View Transitions API.
- GSAP and Lenis come with the kit's tools. What every variant must have is in `office/motion.md`.

## 4. Hero effects
Ways to make the hero's one main visual, not extra layers. Skip to what you're using.

**Openings**
- **Logo intro:** the logo as a CSS mask (`cutout.py logo`), filled with a gradient swept by animating
  `background-position`, then a FLIP into the header logo. About 2.3s, skippable by click, key, wheel or touch, and
  skipped under reduced motion.
- **Intro as preloader:** wait for the hero poster to decode (cap about 3s), and land the intro's shape exactly on its
  twin in the hero. Show it once per session, decided by an inline `<head>` script that adds a class to `<html>` before
  first paint, or the page flashes.
- **Long brand opening** (`prologue.js`), for Branding sites in the luxury tone only, never in front of a shop: dark ground, light beam, embers, the logo swept in gold, then the story in acts,
  about 9-10 screens, with act labels and "Skip the story". Never loop or ping-pong a short clip, because clients notice
  the rewind: scrub it over scroll.
- **Storytelling brands:** the home page is one story whose transitions carry you between products, with no cards or
  prices until a quiet shop link at the end. A still per scene beats short clips for long stories.

**Film**
- **Pipeline:** 4 storyboard keyframes at 16:9, `film.py animatic` as a same-day placeholder, image-to-video per keyframe
  pair, then `film.py stitch`. Prompts: locked camera, same angle in every keyframe, backdrop colour as a hex, the left
  ~45% empty for the headline, no text, logos, faces (hands only) or packaging.
- **Placing it:** right-aligned at full section height with a feathered left edge
  (`mask-image: linear-gradient(90deg, transparent, #000 14%)`). Sample the section background from the film's edge
  colours. Steps beside the film follow `currentTime`, and clicking a step seeks.
- **Encoding:** TV-range yuv420p, with any zoom rendered on a 4x frame (both are in `film.py`).
- **Serving:** a 1280 mp4 for screens up to 1100px (`<source media="(max-width: 1100px)">`), a 1920 webm and mp4 for the
  rest, a poster, and a separate still for reduced motion. `preload="auto"` on the first film only, `preload="none"` below
  it. Pause anything off screen (`film-control.js`).
- **Scroll-scrubbed film:** `frames.py` cuts 100-150 webp frames (1280w plus a 720w phone set, 3-14 MB), and `scrub.js` draws
  them on a sticky canvas, coarse-to-fine. Hero about 300vh, other pinned scenes 200vh or less. Use one continuous shot
  with slow one-direction camera motion. Build with stand-in frames, never time copy to the film, and re-cut the final
  film into the same folder.

**3D and canvas**
- **3D hero, no video needed.** When a client says "still basic", 3D scroll beats a film. `stair.js` gives a spiral of
  floating steps with product cut-outs, the camera climbing between stops. Or build the product in three.js: for tubes,
  rings and extrusions (eyewear, bottles, watches, furniture), real millimetres with `RoomEnvironment` reflections look
  like a studio shot. Scroll takes it apart, labels name the parts, and it can crossfade into a real photo.
- **Any WebGL:** load `gl-guard.js` first, keep a still behind the canvas for missing WebGL and reduced motion, and pause
  off screen. One canvas per page where you can.
- **No photos:** a cursor-driven ink fluid (github.com/PavelDoGreat/WebGL-Fluid-Simulation, MIT: keep its credit) with
  frosted shapes drifting toward the logo. Keep the palette light, and keep it off the copy on phones.
- A canvas-drawn scene is a good stopgap until real footage exists. Keep it behind a `data-mode` switch.

**Bugs to avoid**
- **Pinned scenes must not start or end empty.** Anything that fades out at progress 1 or in from 0 shows a blank screen
  while the stage scrolls. Keep the last state visible, and start reveals partly open.
- **A reveal from `clip-path: inset(0 0 100% 0)` has no visible area** and never fires IntersectionObserver. Leave a 2px
  strip and use threshold 0.
- **Shared CSS:** put theme defaults in `:where(.x)` and generic rules in `.pro :where([data-in])`, so a variant's styles
  win whatever the load order.

## 5. Images
- No new photography: use the client's images, generated images (`content/generated/`) and clean cut-outs.
- Use real photos for rooms, staff and equipment, and generated images for mood.
- **Treat weak client photos before use.** Phone photos can't sit beside cinematic references as they are. Cut the people
  out, apply one strong grade across the site, scale them up and set them on bold colour. Keep this treatment in every
  section, not just the hero.
- Check client photos for third-party watermarks, and crop or skip them. Packs showing a supplier's brand must not be the
  hero subject.
- `cutout.py shadow` removes studio shadows. Always review on a coloured background (`cutout.py sheet`). Pale or grey
  subjects lose pixels, so choose another image instead of tuning thresholds.
- Round slots need a round crop made from the product alone. Keep catalogue shots square and centred.
- Display fonts may lack glyphs (Anton has no curly quotes), so check punctuation.
- Check the image-generation quota before planning AI images.
- `hotspots.js` positions are fractions of the image, so dots stay on the product under `object-fit: cover`.
- No clean photos: cut products from a busy banner with GrabCut plus a hand-placed outline polygon, reading corners off
  a 50px grid. Simple products can be drawn in SVG or canvas.

## 6. Agents and browsers
- Parallel agents each run their **own headless browser** (`check-pages.cjs` or a Playwright node script). The Playwright
  MCP browser is one shared page, and it's throttled to about 1fps in the background: call `page.bringToFront()` first.
- Pass `--header <height>` and `--phone` to `check-pages.cjs`. Without the real header height, every one-screen section is
  flagged.
- Background shell commands stop after 2 hours, including the dev server. Restart it when links stop loading.
- Impeccable hook findings: fix readable text that fails AA, usually by dropping the opacity. Decorative `aria-hidden` giant
  words are an intended exception: record it with
  `impeccable hooks ignore-value low-contrast "*" --file <page> --reason "..."` and say so.

## 7. Publishing
- Use a **separate repo folder** (`WebsiteProjects/<client>-website`), linked to a private GitHub repo and a Vercel project
  that redeploys on every push to `main`.
- **New site:** `gh repo create <owner>/<name> --private --source . --push`, then `vercel project add <name>`,
  `vercel link --yes --project <name>`, `vercel git connect <repo url> --yes`, and push once more to deploy.
- **Each publish:** make each `og:image` a full `https://` address, because Builders leave it relative. Run
  `python tools/web/export-site.py <project> <repo>`. In the repo, `git add -A`, check `git status --short`, commit, confirm
  with `git log --oneline -1`, then push. A silent `git add` failure once showed only "Everything up-to-date".
- Always use `git -C <repo>` or an absolute path: a typo once ran the commit in the parent folder.
- **Check live:** curl until the new page returns 200 (usually within a minute), and confirm `docs/PITCH.md` returns 404. The
  export's `.vercelignore` keeps internal notes out.
- **Identity:** commit with the machine's normal git identity. An email not on the Vercel account deploys as **Blocked**
  (fix: `git rebase --root --exec "git commit --amend --no-edit --reset-author"`).
- **Weight:** about 1-3.5 MB of images and under 4 MB of film on a home page. Over that, look for what should be
  `loading="lazy"` or `preload="none"` before cutting quality.
- A variant can stay local with `--skip <folder>`. To remove a published one, re-export without it and push.
- After publishing, send the link to yourself on WhatsApp and check the preview card.

## 8. Sourcing when the client has no website
- **Shopee** blocks logged-out listings, but the page still loads `shop/get_shop_base_v2` with the description, rating and
  banner. Capture it in real Chrome (`channel: 'chrome'`, headful) and log the `/api/v4/` responses. Images:
  `https://down-my.img.susercontent.com/file/<id>`.
- **Instagram** without login lists about 12 post codes. `https://www.instagram.com/p/<code>/media/?size=l` returns the
  full image, and `/p/<code>/` with the `facebookexternalhit/1.1` user agent gives the caption in `og:title`. Bloggers' collab
  posts often carry the best facts.
- **Facebook, Instagram and TikTok** are login-walled, but headless Chrome still gets the bio text.
- **Linktree** pages often lead to the real menu. Canva menus (`*.my.canva.site`) have high-res page images.
- **Always search past the client's links:** Google Images, reels with sound (`yt-dlp`), Maps, press, blogs and reviews. Check
  each result is the same business, and mark images from someone else's page `[client to confirm]`.
- Where sources disagree, use the most recent and mark it `[client to confirm]`.
- If the marketplace shop lists no items, make WhatsApp the main checkout and link the shop second.
