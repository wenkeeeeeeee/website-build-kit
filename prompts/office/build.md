# Build thread: run order

This thread takes one lead from `PITCH.md` to a live site: full variants with every page working, published to Vercel.
Target: **30–45 minutes here**, so the client is live within an hour of reaching Front Desk. Your first message gives
`CLIENT`, `PROJECT`, `KIT`, `PORT` and `FRONT_DESK`. Don't redo the research, don't ask the user anything, and don't stop
between steps unless something is blocked. Short updates only.

1. **Update the kit.** Run `git -C KIT pull --ff-only`. If that fails, carry on with the copy you have. Read
   `KIT/AGENTS.md` and sections 1, 6 and 7 of `KIT/prompts/website-playbook.md`. `PITCH.md` supplies the decisions. Mode is
   Inspiration. If `LEAD.md` asks for Clone mode, read `KIT/prompts/website-build-template.md` too.
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
   First check each concept: if something other than the product, or a customer using it, is the hero, the palette
   comes from a metaphor, the look doesn't match the tone, or the section order skips a step of the buyer's path,
   rewrite it in `PITCH.md` before briefing.
5. **Hub.** Write `PROJECT/index.html`, in the format in section 1 of the playbook, with short plain names.
6. **Quick check (3 minutes).**
   - Run `check-pages.cjs` once on each variant's home page, click through to one inner page, and grep for reference names.
   - **Hero:** check each first screen against "The hero" in `taste.md`. If `PITCH.md` plans a scroll-driven hero, scroll
     it down and back up: it must scrub smoothly, show something true at each step and hand over cleanly. It must deliver
     the Core line in `PITCH.md`, look
     clean, and never be just a title and photos. Move anything that crowds it below.
   - **Level:** run `contact-sheet.cjs` on each variant and its lead reference, and go through both. If a hero, or the body
     below it, looks clearly weaker than the reference, send it back to be fixed.
   - **Category:** put each hero beside two category leaders from "Category look" in `PITCH.md`, not only its own lead
     reference. Ask what a stranger would say this company sells, and whether the brand's own marketing team would
     publish it. If the user liked another variant, this one must look at least as premium. Send back anything that fails.
   - **Customer walk:** on a phone-size screen, walk each variant's home page as "Will they buy?" in `taste.md` says, and
     check the buying basics and the tone. Send back any variant where a customer wouldn't know what it is, trust it,
     or know how to buy.
   - **Boxes and lines:** on each contact sheet, send back a variant where most frames are plain rounded boxes on a
     background, or every section ends in the same straight edge or ruled line, as "Boxes and lines" in `taste.md` says.
   - **Fonts:** compare the fonts it prints against "Type" in `taste.md`, and replace any banned one.
   - **Coverage:** compare the variants against `content/` and `PITCH.md`, and add anything one left out, so all cover the
     same products, prices, pages, proof and ways to order.
   - Beyond that, fix only what's broken, such as errors, dead links and missing images.
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
- **Redoing one variant:** keep the level, tone and image treatment of any variant the user liked, and change the idea,
  layout and hero. Never pick a direction just because the other variants haven't used it. Open the category leaders
  again and run the Category check before publishing.
- **An extra variant, even from the user's own idea, gets references too.** Search and open real sites first, using the
  bar in step 3 of `research.md`, then name what to take from each. Never brief a Builder with no outside reference.
- **When the user rejects something or repeats a correction,** add the lesson to `taste.md` or
  `KIT/prompts/website-playbook.md` straight away, in general terms with no client names, and push it if you can. Don't
  wait for "wrap up", because the next client shouldn't hit the same problem.
- **"Deepen V2", or the client picked one:** follow `KIT/prompts/office/deepen.md`.
- **"Wrap up":** read the user's tweaks in this thread, write the lessons into `KIT/prompts/website-playbook.md`, or
  `taste.md` if they are about taste, in general terms with no client names. Add references that worked or failed
  to `reference-library.md`. List what you added in your reply.
