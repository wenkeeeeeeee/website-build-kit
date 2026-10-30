# Website build tools

Small, general scripts from past website builds. Use them on any static website project laid out as
`<project>/index.html` (hub), `content/`, `docs/`, `variants/_shared/`, `variants/<nn>-<name>/site/`.
How and when to use them: `prompts/website-playbook.md`.

| Script | What it does | Run |
|---|---|---|
| `serve.py` | Local preview with no caching and byte-range support (videos loop and seek; edits show on reload) | `python tools/web/serve.py <project> 8080` |
| `check-pages.cjs` | Screenshots at the client's real screen sizes; flags console errors, 404s, sections taller than one screen, white strip above the footer, sideways scroll, words colliding with buttons on the first screen, missing share and language tags. `--phone` adds a real phone emulation and small tap targets. Own headless browser, so parallel agents can use it | `node tools/web/check-pages.cjs <url> [<url>...] --sizes 1920x870,1536x700 --phone --out shots` |
| `export-site.py` | Copies the publishable part into the separate repo folder (keeps `.git`), writes the README from the hub list | `python tools/web/export-site.py <project> <repo> [--skip 08-old]` |
| `film.py` | Hero film: `animatic` from storyboard keyframes, `stitch` from AI image-to-video clips; web encodes, poster, reduced-motion still | `python tools/web/film.py animatic --frames <dir> --holds 3,4,3,2 --out <site>/assets/film` |
| `film-control.js` | Drop-in module for background films: pause button, pause off screen, still under reduced motion | copy into `<site>/js/`, see its header comment |
| `frames.py` | Frame sequence for a scroll-scrubbed hero, from a video or from keyframes (desktop + phone sets, `frames.json`) | `python tools/web/frames.py film.mp4 --out <site>/assets/scrub/hero --count 120` |
| `scrub.js` | Drop-in module: plays those frames on a sticky canvas as you scroll; `data-at` text steps, `--p` progress, reduced-motion still | copy into `<site>/js/`, see its header comment |
| `stair.js` + `stair.css` | 3D hero (three.js, no build): a spiral of floating steps with product cut-outs as stops; the camera climbs it as you scroll, plain grid under reduced motion | copy both, plus `three.module.min.js` and `three.core.min.js` from the npm package `three` (`build/`) into `<site>/js/vendor/three/`; see the header comment |
| `gl-guard.js` | Load first on any WebGL page: frees contexts when a page closes, reloads dead canvases, probes for WebGL | plain `<script>` in `<head>`, see its header comment |
| `prologue.js` | Long scroll-driven brand opening: elements fade and move by scroll windows, frame sequences scrub over their own run, glowing particle canvas, clickable act labels | copy into the site; see its header comment |
| `hotspots.js` | Shop-the-look dots that stay on the product under `object-fit: cover` at any size | copy into `<site>/js/`, see its header comment |
| `cutout.py` | Remove studio shadows from cut-outs, turn a dark logo into a white mask, make a contact sheet on a coloured background | `python tools/web/cutout.py shadow in.png out.webp --max 320` |

Needs: Python 3 with Pillow and numpy (`cutout.py`), ffmpeg and ffprobe on PATH (`film.py`), Node with Playwright
for `check-pages.cjs` (`npm i -D playwright` in `tools/web` or the project; it falls back to the installed Chrome
when Playwright's own browser is not installed).
