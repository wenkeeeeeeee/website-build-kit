# Website build tools

Small, general scripts from past website builds, for any static project laid out as `<project>/index.html` (hub),
`content/`, `docs/`, `variants/_shared/`, `variants/<nn>-<name>/site/`. How and when to use them:
`prompts/website-playbook.md`.

| Script | What it does | Run |
|---|---|---|
| `serve.py` | Local preview, no caching, byte-range support (videos loop and seek; edits show on reload) | `python tools/web/serve.py <project> 8080` |
| `check-pages.cjs` | Screenshots at the client's real screen sizes. Flags console errors, 404s, sections taller than one screen, a white strip above the footer, sideways scroll (naming the elements causing it), words colliding with buttons on the first screen, missing share and language tags, a white or blank first paint (saves `<name>-early.png` at 350 ms), an H1 web font that didn't load, autoplay videos paused or failed, broken images, header links wrapping onto two rows. `--phone` adds real phone emulation and small tap targets. Own headless browser, so parallel agents can use it; real Chrome first so MP4 heroes play | `node tools/web/check-pages.cjs <url> [<url>...] --sizes 1920x870,1536x700 --phone --out shots` |
| `gallery-scan.cjs` | Skims Behance and Dribbble: one thumbnail image plus links per search, about 15 seconds. Awwwards blocks browsers: use WebSearch | `node tools/web/gallery-scan.cjs "fine dining website" "pasta brand" --out shots` |
| `hero-frames.cjs` | Scroll-hero frames at 0, 33, 66 and 100%, on the way back up, and on a phone, one labelled row per page, so a hero and its references compare at the same scroll points. Flags a hero that doesn't move or sits behind a gate | `node tools/web/hero-frames.cjs <hero url> <reference url> --out shots --screens 3` |
| `contact-sheet.cjs` | Scrolls pages like a visitor, up to 4 at once: one image per page plus `all.jpg`, side by side for spotting lookalike variants. Clears cookie walls, prints fonts and sections. Own headless browsers | `node tools/web/contact-sheet.cjs <url> [<url>...] --out shots` |
| `og-images.cjs` | A 1200x630 share image per variant, linked by full address. Run before export, with the preview up | `node tools/web/og-images.cjs <project> <preview url> <live url>` |
| `export-site.py` | Copies the publishable part into the separate repo folder (keeps `.git`), writes the README from the hub list and a `.vercelignore` keeping internal notes off the live site | `python tools/web/export-site.py <project> <repo> [--skip 08-old]` |
| `film.py` | Hero film: `animatic` from storyboard keyframes, `stitch` from AI image-to-video clips; web encodes, poster, reduced-motion still | `python tools/web/film.py animatic --frames <dir> --holds 3,4,3,2 --out <site>/assets/film` |
| `film-control.js` | Drop-in for background films: pause button, pause off screen, still under reduced motion | copy into `<site>/js/`, see its header comment |
| `frames.py` | Frame sequence for a scroll-scrubbed hero, from a video or keyframes (desktop + phone sets, `frames.json`) | `python tools/web/frames.py film.mp4 --out <site>/assets/scrub/hero --count 120` |
| `scrub.js` | Drop-in: plays those frames on a sticky canvas on scroll; `data-at` text steps, `--p` progress, reduced-motion still | copy into `<site>/js/`, see its header comment |
| `stair.js` + `stair.css` | 3D hero (three.js, no build): a spiral of floating steps with product cut-outs as stops, the camera climbing on scroll; plain grid under reduced motion | copy both, plus `three.module.js` and `three.core.js` from the npm package `three` (`build/`) into `<site>/js/vendor/three/`; see the header comment |
| `gl-guard.js` | Load first on any WebGL page: frees contexts when a page closes, reloads dead canvases, probes for WebGL | plain `<script>` in `<head>`, see its header comment |
| `prologue.js` | Long scroll-driven brand opening: elements fade and move by scroll windows, frame sequences scrub over their own run, glowing particle canvas, clickable act labels | copy into the site; see its header comment |
| `hotspots.js` | Shop-the-look dots that stay on the product under `object-fit: cover` at any size | copy into `<site>/js/`, see its header comment |
| `reactbits.cjs` | Fetches React Bits components (animated text, backgrounds, small UI) on demand into a git-ignored cache, lists them with the libraries each needs, and copies one into a site with a license header. They are React, so port the one you pick to plain JS | `node tools/web/reactbits.cjs list [name]`, `node tools/web/reactbits.cjs get Aurora --out <site>/js/reactbits` |
| `cutout.py` | Removes studio shadows from cut-outs, turns a dark logo into a white mask, makes a contact sheet on a coloured background | `python tools/web/cutout.py shadow in.png out.webp --max 320` |

`npm install` here also brings GSAP with its plugins, Lenis, three.js and ogl (the WebGL library most React Bits backgrounds use), for the motion in `prompts/office/motion.md`.

Needs: Python 3 with Pillow and numpy (`cutout.py`), ffmpeg and ffprobe on PATH (`film.py`), `yt-dlp` for client reels,
Node with Playwright for `check-pages.cjs` (`npm i -D playwright` in `tools/web` or the project; it uses the installed
Chrome first, else Playwright's own Chromium).
