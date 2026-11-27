# Methods

Technical how-to for lookup: project layout, media, known bugs, publishing and sourcing. No design advice: design comes
from the references.

## Project layout
```
WebsiteProjects/<Client>/
  index.html               hub: one <li><strong>V1 · Name</strong><span>one line</span><a class="go" href="variants/01-x/site/">Open</a></li> per variant
  docs/                    LEAD.md, FACTS.md
  content/                 the client's prepared photos, videos and data
  references/claims.md     each variant's hero idea and section references
  tools/                   copy of the kit's tools/web, with node_modules
  variants/_shared/starter working plumbing for the rest phase
  variants/<nn>-<name>/{site,ref}/   only site/ is published
```
- Keep the hub format: `export-site.py` builds the published README from it.
- Preview with `tools/serve.py`; `python -m http.server` gives stale JS and videos that won't loop or seek.

## Media
- **Cut-outs:** `cutout.py shadow` removes studio shadows; review on a coloured background (`cutout.py sheet`). Pale or
  grey subjects lose pixels: pick another image rather than tune thresholds. Never draw the product in SVG or canvas
  instead of a photo.
- **Video:** `film.py stitch` joins clips; for one camera move through several shots, start each clip on the last
  frame of the one before, no crossfades. A short clip can play once and hold its last frame rather than loop (a
  rewind or seam shows). Encode TV-range yuv420p (`film.py`). Serve a 1280 mp4 for screens up to 1100px, a 1920 webm
  and mp4 above, a poster, and a still for reduced motion. `preload="auto"` on the first video only. Pause anything off
  screen and give looping film a pause button (`film-control.js`).
- **Scroll-scrubbed video:** `frames.py` cuts 100-150 webp frames (desktop and phone sets); `scrub.js` draws them on a
  sticky canvas. One continuous shot with slow, one-direction camera motion.
- **3D:** a real model (the client's file, a licensed model, or image-to-3D from the client's photo, cleaned up), lit
  by an HDRI (`RGBELoader`) or `RoomEnvironment`, soft contact shadow, tone mapping, sRGB output. Compress with
  `npx gltf-transform optimize`. Render it beside the product photo: if it looks worse, use the photo. Sources: Sketchfab
  (CC), Poly Haven, ambientCG; Tripo or Meshy free tiers for image-to-3D.
- **Any WebGL:** load `gl-guard.js` first, a still behind the canvas for missing WebGL and reduced motion, pause off
  screen, one canvas per page where you can.
- **Travelling thread:** one fixed full-page layer behind the content (a WebGL canvas for 3D pieces, or plain fixed
  elements). Each section holds small empty placeholders, its stations. On every frame each piece reads the rectangles of
  its current and next station and moves between them by that section's scroll progress (GSAP ScrollTrigger), changing
  shape or role at each station. Measure again on resize. On a phone use fewer stations; with reduced motion the pieces
  sit at their stations without travelling. Each layout gives the thread its own space at its station, so it stays
  full size and never crosses text: check both in the `--moving` frames, desktop and `--phone`.
- **Weight:** about 1-3.5 MB of images and under 4 MB of video on a home page. Over that, lazy-load before cutting
  quality.

## Bugs to design against
| Bug | Fix |
|---|---|
| White flash on load | `html, body { background: … }` first; media starts at opacity 0 and fades in on `loadeddata` |
| Page blank if a script fails | The resting state is visible; JS forces the final state if an entrance hasn't run |
| Layout jumps | Reserve every image and video aspect ratio; fixed-height lines for changing words |
| Sticky header doesn't stick | `overflow-x: clip` on body, not `hidden` |
| Pinned scene starts or ends empty | Keep the last state visible; start reveals partly open |
| Reveal never fires | `clip-path: inset(0 0 100% 0)` has no visible area: leave a 2px strip, threshold 0 |
| Scrubbed video stutters | Seek only when `!video.seeking`; ease toward the target each frame |
| Animations fight | Cancel the previous `requestAnimationFrame`; lock repeat triggers for 650-1000ms |
| Hover-only ideas on phones | Under `(hover: none)`, a tap, scroll or self-running version |
| Menu leaves the page scrolling | Lock scroll while open (stop Lenis too); close on link, Esc and resize |
| Browser-default controls | Build dropdowns, dates and steppers in the site's design; hide number spinners |
| No preview when shared | `og:title`, `og:description`, a 1200x630 `og:image` (`og-images.cjs`), full `https://` once live |

## Agents and browsers
- Parallel agents each run their own headless browser (`find-refs.cjs`, `hero-frames.cjs`, `check-pages.cjs`). The
  Playwright MCP browser is one shared page: only the lead uses it.
- Pass `--header <height>` and `--phone` to `check-pages.cjs`.
- Background shell commands, the preview server included, stop after 2 hours: restart it when links stop loading.

## Publishing
- A separate repo folder (`WebsiteProjects/<client>-website`), linked to a private GitHub repo and a Vercel project that
  redeploys on every push to `main`. Use the machine's own logins.
- **New site:** `gh repo create <owner>/<name> --private --source . --push`, then `vercel project add <name>`,
  `vercel link --yes --project <name>`, `vercel git connect <repo url> --yes`, and push once more.
- **Each publish:** every `og:image` a full `https://` address. `python tools/export-site.py <project> <repo>`. In the
  repo: `git add -A`, check `git status --short`, commit, confirm with `git log --oneline -1`, push. Always
  `git -C <repo>` or an absolute path.
- **Check live:** curl until each page returns 200, and confirm `docs/FACTS.md` returns 404.
- **Identity:** commit with the machine's normal git identity; an email not on the Vercel account deploys as Blocked
  (fix: `git rebase --root --exec "git commit --amend --no-edit --reset-author"`).
- `--skip <folder>` keeps a variant local. To remove a published one, re-export without it and push.

## Sourcing
- **Search past the client's links,** in each language it uses: Google and Google Images with the name and town,
  Instagram and TikTok reels (`yt-dlp`), Maps, marketplaces, press, blogs, reviews. Confirm each result is the same
  business; mark images from someone else's page `[client to confirm]`. Where sources disagree, use the most recent
  and mark it `[client to confirm]`.
- **Instagram** without login lists about 12 post codes; `https://www.instagram.com/p/<code>/media/?size=l` returns the
  full image; `/p/<code>/` with the `facebookexternalhit/1.1` user agent gives the caption in `og:title`.
- **Facebook, Instagram, TikTok** are login-walled, but headless Chrome still gets the bio text.
- **Shopee** blocks logged-out listings, but the page still loads `shop/get_shop_base_v2` with the description, rating
  and banner: capture it in real Chrome (headful) and log the `/api/v4/` responses.
- **Linktree** pages often lead to the real menu; Canva menus (`*.my.canva.site`) have high-res page images.
