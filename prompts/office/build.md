# Build thread: run order

This thread takes one lead from `PITCH.md` to a live site: full variants with every page working, published to Vercel.
Target: **30–45 minutes here**, so the client is live within an hour of reaching Front Desk. Your first message gives
`CLIENT`, `PROJECT`, `KIT`, `PORT` and `FRONT_DESK`. Don't redo the research, don't ask the user anything, and don't stop
between steps unless something is blocked. Short updates only.

1. **Update the kit.** Run `git -C KIT pull --ff-only`. If that fails, carry on with the copy you have. Read
   `KIT/AGENTS.md`, `KIT/prompts/website-playbook.md` and `KIT/prompts/website-build-template.md`: this is the method, and
   `PITCH.md` supplies the decisions. Mode is Inspiration unless `LEAD.md` says otherwise.
2. **Preview.** Start `python KIT/tools/web/serve.py PROJECT PORT` as a background command with the maximum timeout.
3. **Shared plumbing (8 minutes).** Do this yourself, before any Builder starts.
   - Turn `PITCH.md` into the content kit: `content/*.json` in the shapes `KIT/starter/data/` uses, and `content/copy.md`
     with the client's real wording. Research already saved the images and `OPEN-QUESTIONS.md`.
   - Copy `KIT/starter` to `PROJECT/variants/_shared/starter`, swap in the data, keep the pages `PITCH.md` lists, and
     rename the basket for the business. The starter is a shop, so for other site types change the pages and the
     wording. Everything in `data/` is public, so no internal notes.
   - Run `npm --prefix KIT/tools/web install`. Copy `node_modules/gsap/dist`, `lenis/dist` and `three/build` from
     `KIT/tools/web` into `PROJECT/variants/_shared/vendor/` as `gsap`, `lenis` and `three`, for the Builders to use.
   - Open it once with `check-pages.cjs`. Every page must work, because all the variants copy it.
4. **Builders (30 minutes).** Fill in `KIT/prompts/variant-agent-brief.md` once per variant, using its column of
   `PITCH.md`, and send all the subagents in one message so they run in parallel, each with `run_in_background: false`.
5. **Hub.** Write `PROJECT/index.html`, in the format in section 1 of the playbook, with short plain names.
6. **Quick check (3 minutes).** Run `check-pages.cjs` once on each variant's home page, click through to one inner page,
   and grep for reference names. Fix only what's broken, such as errors, dead links and missing images. Design review is
   the user's job, so don't redesign anything.
7. **Publish (3 minutes).** Follow section 7 of the playbook. `SLUG` is the client's name in lowercase with hyphens, and
   `REPO` is `WebsiteProjects/SLUG-website`.
   - If `gh repo view <owner>/SLUG-website` finds a repo, clone or reuse it, and it keeps its Vercel project. Otherwise
     make a private repo and Vercel project as the playbook says, once the first commit exists.
   - Run `node KIT/tools/web/og-images.cjs PROJECT http://127.0.0.1:PORT https://SLUG-website.vercel.app`, then
     `python KIT/tools/web/export-site.py PROJECT REPO`.
   - Commit and push, then check with curl that the hub and every variant return 200, and that `docs/PITCH.md` returns
     404. If notes are reachable, fix that before anything else.
8. **Report.** Load `mcp__t3-code__t3_thread_send` with ToolSearch and send `FRONT_DESK` a message in this form, where
   minutes run from the time `PROJECT/docs/LEAD.md` was written:

   `LIVE: CLIENT in <minutes> min. Hub: https://SLUG-website.vercel.app/ V1 · Name: <url>, V2 · Name: <url> ... Local: http://127.0.0.1:PORT/ To confirm: <short list>.`

   If that fails, post the same text here.

## After that
- Tweaks arrive here from the user or forwarded by Front Desk. Make them, check that page, then export and push again,
  and reply with the live link.
- If previews stop loading, restart the server: background commands end after 2 hours.
- If the client rejects a whole round, don't rebuild yet. Ask the user questions first.
- **"Deepen V2", or the client picked one:** follow `KIT/prompts/office/deepen.md`.
- **"Wrap up":** read the user's tweaks in this thread, write the lessons into `KIT/prompts/website-playbook.md`, or
  `taste.md` if they are about taste, in general terms with no client names. Add references that worked or failed
  to `reference-library.md`. List what you added in your reply.
