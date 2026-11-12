# Website build playbook

Methods and lessons from past builds, for lookup.

| You are | Read |
|---|---|
| Research agent | Section 8 |
| Build lead | Sections 1, 6 and 7 |
| Builder | Section 3, plus the parts of 4 and 5 you're using |
| Running a build by hand | Sections 1 and 2, then as needed. The brief template is `website-build-template.md` |

Scripts: `tools/web/`. Shop plumbing: `starter/`. Subagent brief: `variant-agent-brief.md`.

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
- Keep the hub format: `export-site.py` builds the published README from it.
- Hub names short and plain ("V1 · Green Shop"), with a one-line description.
- Preview with `tools/web/serve.py`; `python -m http.server` gives stale JS and videos that won't loop or seek.

## 2. Order of work
1. **Content kit first:** products, prices, reviews, certificates and images into `content/`. Each unknown gets a visible
   `[client to confirm]` tag and a line in `OPEN-QUESTIONS.md`. Brand rules go once in `BRAND-INSIGHTS.md`.
2. **Plumbing from `starter/`:** copy it, swap in the data, drop or add pages. It has the basket (WhatsApp and/or
   marketplace checkout), filtered catalogue, product page, quote form and stores list.
3. **One subagent per variant folder,** with `variant-agent-brief.md`: hero first for approval, then the rest (step 4 of
   `office/build.md`). They never touch shared files; the lead adds hub entries after.
4. **Lead review:** one desktop screenshot per variant, `check-pages.cjs --phone`, a grep for reference names and banned
   words, then publish.

**One concept per variant, from the client's own world,** with its own story spine and page furniture: identical briefs
on one starter come back as three reskins. The buyer's path order can repeat; its telling can't (step 2 of
`office/research.md`).

**Shape the plumbing to the business.** Rename the basket rather than add something (shoot list, try-on list,
confidential request); it still ends in one filled-in WhatsApp message. Add one tool (lens picker, frame finder, branch
map, booking form) only if it answers a question customers really ask.

## 3. The quality bar
**Layout**
- **Every section fits one screen** below the sticky header, at the client's real window (often 1920x870 at 125% zoom,
  about 1536x700 CSS px). Measure with `check-pages.cjs`, not by eye.
- **In split sections the text sets the height;** a photo with `height: 100%` stretches the row. Fix:
  `.media { position: relative; min-height: 300px } .media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover }`
- **No white gaps.** Full-bleed coloured sections on a white page get square bottom corners.
- **Heroes, page heroes included, follow "The hero" in `office/taste.md`:** the subject leads, never text one side and a
  picture the other.
- **Nothing plain below the hero.** Real components on photos: code tags, hover actions that do something (WhatsApp with
  a pre-written message, "Add to my quote" filling the form), cut-outs floating in panels.
- **Scroll cues and decoration stay away from buttons.** Hide scroll cues on short and phone screens.

**Header, footer and forms**
- **Sticky header:** `body { overflow-x: hidden }` breaks `position: sticky`; use `overflow-x: clip`.
- **Footer:** rich (closing invitation, links, certificates), at most one screen tall, no cut-off watermark logos. Give it
  `min-height: 100svh; display: flex; flex-direction: column`, top padding for the floating header, and its first band
  `flex: 1`, so no white strip ends the page.
- **Forms:** fields three across, live preview beside the form, `label { align-content: start }` so a hint under one
  field doesn't stretch the others.
- **Controls in the site's design, never the browser's.** The browser's own date popup, number spinner arrows and
  dropdown list (white or grey OS panel, blue highlight) look broken on a designed site. Build every control from the
  variant's fonts, colours, radius, borders and motion, with hover, pressed, focus-visible, selected and disabled
  states, and the same focus ring on all of them:
  - **Choice of 2-6:** chips or segmented buttons, all visible, rather than a dropdown. Radios as selectable cards.
  - **Longer lists:** a button that opens a styled list panel (`role="listbox"`, `aria-expanded`), with arrow keys,
    Enter, Esc and type-ahead, and a hidden input carrying the value for the form.
  - **Dates:** a calendar panel in the site's style with past and closed days disabled, or, for bookings, chips of the
    next available days and times.
  - **Numbers:** a stepper, minus, value, plus, with buttons styled like the site's, at least 44px, the minus disabled
    at the minimum. Hide the native arrows with `appearance: textfield` and `::-webkit-inner-spin-button { display: none }`.
  - **Checkboxes and switches:** drawn in the site's style, at least `accent-color` set to the brand colour.
  - **Buttons:** every button uses the variant's button styles, including in the basket, menus and dialogs.
  - Set `color-scheme: dark` on dark sites, so scrollbars, autofill and any native leftover match too.
  - Open every dropdown, calendar and stepper during the check and screenshot it open.

**Phones**
- Run `check-pages.cjs --phone` on every variant: one off-screen element widens the whole page.
- The phone hero keeps the subject biggest: visual first or behind the words, headline and button clear of it, never art
  over copy.
- A closed side drawer or menu needs `overflow: hidden` on its fixed wrapper.

**Sharing and audiences**
- **Share preview** (clients share on WhatsApp first): every page has `og:title`, `og:description` and a 1200x630
  `og:image` from the variant's hero, a full `https://` address when published.
- **Hero film pause button:** WCAG 2.2.2 asks for one when motion loops past 5s. `film-control.js` does it.
- **Sensitive services** (victims, health, legal): the first screen says what to do in danger, with the emergency number
  and "no names needed", the one addition to the clean hero. Nothing public without consent; no stock victims or staged
  distress: symbols, cities and paperwork carry the story.
- **Two languages:** the client's own words as short mottos and headings beside the translation, marked `lang="ms"` or
  the right code.
- **Older audiences:** body 19-20px, nothing under 16px, 7:1 body contrast, no translucent grey text, buttons 48px+ with
  words, named chapter labels, phone and WhatsApp as visible buttons, a "Skip the film" link, calm motion. No slashed
  zeros: they make prices hard to read.

**Transitions**

Smoothness is choreography; screenshots and frame counters won't show it.
- **Design every join:** a colour wash, an object carried across, a pinned panel the next slides over, an image growing
  into the next section. Stacked sections fading up read as basic. Edges where sections meet: "Boxes and lines" in
  `office/taste.md`.
- **Scroll-linked motion** eases toward its target each frame, so nothing snaps. Triggered reveals stagger over 0.6-1s on
  a long ease-out such as `cubic-bezier(.16,1,.3,1)`, never linear or bouncy.
- Motion language, hover and press states, which properties to animate, page changes: `office/motion.md`, which every
  variant must meet. GSAP, Lenis, three.js and ogl come with the kit's tools, and `tools/web/reactbits.cjs` fetches
  React Bits components.

## 4. Hero effects
Ways to make the hero's one main visual, not extra layers. Skip to what you use.

**Openings**
- **Logo intro:** the logo as a CSS mask (`cutout.py logo`), filled with a gradient swept by animating
  `background-position`, then a FLIP into the header logo. About 2.3s, skippable by click, key, wheel or touch, skipped
  under reduced motion.
- **Intro as preloader:** wait for the hero poster to decode (cap about 3s); land the intro's shape exactly on its twin
  in the hero. Once per session, decided by an inline `<head>` script adding a class to `<html>` before first paint (or
  the page flashes).
- **Long brand opening** (`prologue.js`): only when the user asks, on a luxury Branding site, never in front of a shop.
  Dark ground, light beam, embers, the logo swept in gold, then the story in acts over about 9-10 screens, with act
  labels and "Skip the story". Never loop or ping-pong a short clip (clients see the rewind): scrub it over scroll.
- **Storytelling brands** ("Branding" in `office/taste.md`): a still per scene beats short clips for long stories.

**Film**
- **Source:** footage from the client or user, or AI video from a free tool. Never Higgsfield or a paid tool; no hero
  depends on AI video. `film.py stitch` joins clips.
- **Placing:** right-aligned, full section height, left edge feathered
  (`mask-image: linear-gradient(90deg, transparent, #000 14%)`). Sample the section background from the film's edge
  colours. Steps beside the film follow `currentTime`; clicking a step seeks.
- **Encoding:** TV-range yuv420p, any zoom rendered on a 4x frame (both in `film.py`).
- **Serving:** a 1280 mp4 for screens up to 1100px (`<source media="(max-width: 1100px)">`), a 1920 webm and mp4 above, a
  poster, and a separate still for reduced motion. `preload="auto"` on the first film only, `preload="none"` below.
  Pause anything off screen (`film-control.js`).
- **Scroll-scrubbed film:** `frames.py` cuts 100-150 webp frames (1280w plus a 720w phone set, 3-14 MB); `scrub.js` draws
  them on a sticky canvas, coarse-to-fine. Hero about 300vh, other pinned scenes 200vh or less. One continuous shot,
  slow one-direction camera motion. Build with stand-in frames, never time copy to the film, re-cut the final film into
  the same folder.

**3D and canvas**
- **3D hero, no video needed.** When a client says "still basic", 3D scroll beats a film. `stair.js`: a spiral of
  floating steps with product cut-outs, the camera climbing between stops. Or the product in three.js: tubes, rings and
  extrusions (eyewear, bottles, watches, furniture) in real millimetres with `RoomEnvironment` reflections look like a
  studio shot. Scroll takes it apart, labels name the parts, and it can crossfade into a real photo.
- **Any WebGL:** load `gl-guard.js` first, a still behind the canvas for missing WebGL and reduced motion, pause off
  screen. One canvas per page where you can.
- **Ink fluid** (github.com/PavelDoGreat/WebGL-Fluid-Simulation, MIT: keep its credit): a cursor-driven background behind
  the real subject, never the hero alone. Light palette, off the copy on phones.
- A canvas-drawn scene is a good stopgap until real footage exists, behind a `data-mode` switch.

**Bugs to avoid**
- **Pinned scenes never start or end empty:** fading out at progress 1 or in from 0 shows a blank screen while the stage
  scrolls. Keep the last state visible; start reveals partly open.
- **A reveal from `clip-path: inset(0 0 100% 0)` has no visible area** and never fires IntersectionObserver. Leave a 2px
  strip, threshold 0.
- **Shared CSS:** theme defaults in `:where(.x)`, generic rules in `.pro :where([data-in])`, so a variant's styles win
  whatever the load order.

## 5. Images
- No new photography: the client's images, generated images (`content/generated/`) and clean cut-outs.
- Real photos for rooms, staff and equipment; generated images for mood.
- **Treat weak client photos first** (as "It's made of what the client really has" in `office/taste.md` says): one grade
  across the site and a tone-fitting treatment in every section, not just the hero; never scaled past sharp, cut out
  only where the edge is clean.
- Crop or skip third-party watermarks. Packs showing a supplier's brand are never the hero subject.
- `cutout.py shadow` removes studio shadows. Always review on a coloured background (`cutout.py sheet`). Pale or grey
  subjects lose pixels: pick another image rather than tune thresholds.
- Round slots need a round crop from the product alone. Catalogue shots square and centred.
- Display fonts may lack glyphs (Anton has no curly quotes): check punctuation.
- Check the image-generation quota before planning AI images.
- `hotspots.js` positions are fractions of the image, so dots stay on the product under `object-fit: cover`.
- No clean photos: cut products from a busy banner with GrabCut plus a hand-placed outline polygon, corners read off a
  50px grid. Simple products can be drawn in SVG or canvas.

## 6. Agents and browsers
- Parallel agents each run their **own headless browser** (`check-pages.cjs` or a Playwright node script). The Playwright
  MCP browser is one shared page, throttled to about 1fps in the background: call `page.bringToFront()` first.
- Pass `--header <height>` and `--phone` to `check-pages.cjs`; without the real header height every one-screen section is
  flagged.
- Background shell commands, the dev server included, stop after 2 hours. Restart it when links stop loading.
- Impeccable hook findings: fix readable text failing AA, usually by dropping the opacity. Decorative `aria-hidden` giant
  words are an intended exception: record it with
  `impeccable hooks ignore-value low-contrast "*" --file <page> --reason "..."` and say so.

## 7. Publishing
- A **separate repo folder** (`WebsiteProjects/<client>-website`), linked to a private GitHub repo and a Vercel project
  that redeploys on every push to `main`.
- **New site:** `gh repo create <owner>/<name> --private --source . --push`, then `vercel project add <name>`,
  `vercel link --yes --project <name>`, `vercel git connect <repo url> --yes`, and push once more to deploy.
- **Each publish:** every `og:image` a full `https://` address (Builders leave it relative). Run
  `python tools/web/export-site.py <project> <repo>`. In the repo: `git add -A`, check `git status --short` (a silent
  `git add` failure once showed only "Everything up-to-date"), commit, confirm with `git log --oneline -1`, push.
- Always `git -C <repo>` or an absolute path: a typo once committed in the parent folder.
- **Check live:** curl until the new page returns 200 (usually within a minute), and confirm `docs/PITCH.md` returns 404.
  The export's `.vercelignore` keeps internal notes out.
- **Identity:** commit with the machine's normal git identity. An email not on the Vercel account deploys as **Blocked**
  (fix: `git rebase --root --exec "git commit --amend --no-edit --reset-author"`).
- **Weight:** about 1-3.5 MB of images and under 4 MB of film on a home page. Over that, find what should be
  `loading="lazy"` or `preload="none"` before cutting quality.
- `--skip <folder>` keeps a variant local. To remove a published one, re-export without it and push.
- After publishing, WhatsApp the link to yourself and check the preview card.

## 8. Sourcing when the client has no website
- **Shopee** blocks logged-out listings, but the page still loads `shop/get_shop_base_v2` with the description, rating and
  banner. Capture it in real Chrome (`channel: 'chrome'`, headful) and log the `/api/v4/` responses. Images:
  `https://down-my.img.susercontent.com/file/<id>`.
- **Instagram** without login lists about 12 post codes. `https://www.instagram.com/p/<code>/media/?size=l` returns the
  full image; `/p/<code>/` with the `facebookexternalhit/1.1` user agent gives the caption in `og:title`. Bloggers' collab
  posts often carry the best facts.
- **Facebook, Instagram and TikTok** are login-walled, but headless Chrome still gets the bio text.
- **Linktree** pages often lead to the real menu. Canva menus (`*.my.canva.site`) have high-res page images.
- **Always search past the client's links,** in real Chrome: Google and Google Images for the name with its town, in each
  language it uses; Instagram and TikTok reels with sound (`yt-dlp`); Maps, mall directories, press, blogs and reviews.
  Confirm each result is the same business; mark images from someone else's page `[client to confirm]`.
- Where sources disagree, use the most recent and mark it `[client to confirm]`.
- If the marketplace shop lists no items, WhatsApp is the main checkout and the shop link comes second.
