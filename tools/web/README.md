# Website build tools

Small, general scripts from past website builds. Use them on any static website project laid out as
`<project>/index.html` (hub), `content/`, `docs/`, `variants/_shared/`, `variants/<nn>-<name>/site/`.
How and when to use them: `prompts/website-playbook.md`.

| Script | What it does | Run |
|---|---|---|
| `serve.py` | Local preview with no caching and byte-range support (videos loop and seek; edits show on reload) | `python tools/web/serve.py <project> 8080` |
| `check-pages.cjs` | Screenshots at the client's real screen sizes; flags console errors, 404s, sections taller than one screen, white strip above the footer, sideways scroll. Own headless browser, so parallel agents can use it | `node tools/web/check-pages.cjs <url> [<url>...] --sizes 1920x870,1536x700 --out shots` |
| `export-site.py` | Copies the publishable part into the separate repo folder (keeps `.git`), writes the README from the hub list | `python tools/web/export-site.py <project> <repo> [--skip 08-old]` |
| `film.py` | Hero film: `animatic` from storyboard keyframes, `stitch` from AI image-to-video clips; web encodes, poster, reduced-motion still | `python tools/web/film.py animatic --frames <dir> --holds 3,4,3,2 --out <site>/assets/film` |
| `cutout.py` | Remove studio shadows from cut-outs, turn a dark logo into a white mask, make a contact sheet on a coloured background | `python tools/web/cutout.py shadow in.png out.webp --max 320` |

Needs: Python 3 with Pillow and numpy (`cutout.py`), ffmpeg and ffprobe on PATH (`film.py`), Node with Playwright
for `check-pages.cjs` (`npm i -D playwright` in `tools/web` or the project; it falls back to the installed Chrome
when Playwright's own browser is not installed).
