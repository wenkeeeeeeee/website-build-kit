# Build thread: run order

This thread takes `PITCH.md` to live sites: 3 + 1 variants, every page working, published to Vercel, with one stop for
the user to approve the heroes as pictures. Your first message gives `CLIENT`, `PROJECT`, `KIT`, `PORT` and
`FRONT_DESK`. Don't redo the research or ask anything. Short updates only.

1. **Get ready.** `git -C KIT pull --ff-only` (if it fails, carry on). Read `KIT/AGENTS.md` and
   `KIT/prompts/office/taste.md`. Start `python KIT/tools/web/serve.py PROJECT PORT` in the background with the maximum
   timeout.
2. **Plumbing (10 minutes).**
   - `content/*.json` in the shapes `KIT/starter/data/` uses, and `content/copy.md` with the client's real wording.
   - Copy `KIT/starter` to `PROJECT/variants/_shared/starter`, swap in the data, keep the pages `PITCH.md` lists, rename
     the basket for the business. Everything in `data/` is public: no internal notes.
   - `npm --prefix KIT/tools/web install`, then copy `node_modules/gsap/dist`, `lenis/dist`, `three/build` (and
     `three/examples/jsm` if any variant uses 3D) and `ogl/src` into `PROJECT/variants/_shared/vendor/`.
   - Check the material research prepared; finish anything missing ("The material" in `taste.md`).
3. **Heroes.** Fill in `KIT/prompts/variant-agent-brief.md` once per variant with `Phase: hero` and send all four in
   one message, each with `run_in_background: false`. Each returns its `hero` and `motion` sheets.
   - **Your check:** each sheet beside its category site, as "The bar" in `taste.md` says. Send a weak one back once,
     with what's wrong, before the user sees it.
   - **Review:** post per variant its sheets as images (Markdown image, absolute path), the local URL, the idea in one
     line, its palette as named swatches with hex, and the references with what each gave. If `FRONT_DESK` isn't
     `none`, also send it `HERO REVIEW: CLIENT` with the sheet paths and URLs via `mcp__t3-code__t3_thread_send`. Stop
     and wait. Changes come back as a new hero round; "go" moves on.
4. **Rest of the site.** Send each brief again with `Phase: rest`, all in one message.
5. **Hub:** `PROJECT/index.html` in the format in section 1 of `KIT/prompts/website-playbook.md`.
6. **Quick check (5 minutes).** `check-pages.cjs --phone` on each home page and one inner page; each variant beside two
   category sites; grep for reference names; check fonts against "Type" in `taste.md`; all variants carry the same
   products, prices, pages and ways to order. Fix what's broken; send back a variant that fails `taste.md`.
7. **Publish** per section 7 of the playbook. `SLUG` is the client's name in lowercase with hyphens; `REPO` is
   `WebsiteProjects/SLUG-website`. Reuse the repo if `gh repo view <owner>/SLUG-website` finds one, otherwise make a
   private repo and Vercel project. Run `node KIT/tools/web/og-images.cjs PROJECT http://127.0.0.1:PORT
   https://SLUG-website.vercel.app` and `python KIT/tools/web/export-site.py PROJECT REPO`, commit, push, and curl: the
   hub and every variant return 200, `docs/PITCH.md` returns 404.
8. **Report.** Load `mcp__t3-code__t3_thread_send` with ToolSearch and send `FRONT_DESK`:
   `LIVE: CLIENT in <minutes> min. Hub: https://SLUG-website.vercel.app/ V1 · Name: <url> ... Local: http://127.0.0.1:PORT/ To confirm: <short list>.`
   If that fails, post it here.

## After that
- **Tweaks** from the user or Front Desk: make them, check that page, export, push, reply with the live link. Previews
  stop after 2 hours: restart the server.
- **A whole round rejected:** ask the user what missed before rebuilding.
- **Redoing a variant:** keep the level of any variant the user liked; new idea, layout and hero; same hero review.
- **The user rejects something or repeats a correction:** note the lesson in `PROJECT/docs/LESSONS.md`, in general
  terms.
- **An approved hero:** copy its folder and brief to `WebsiteProjects/_approved/<slug>-<variant>/` (local only).
- **"Deepen", or the client picked one:** `KIT/prompts/office/deepen.md`.
- **"Wrap up":** fold the lessons into `taste.md` (taste) or the playbook (method), in general terms with no client
  names. Sharpen the rule each belongs to, delete any rule it contradicts, and keep the files short.
