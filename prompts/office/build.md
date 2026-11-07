# Build thread: run order

This thread takes one lead from `PITCH.md` to a live site: full variants with every page working, published to Vercel.
Target: **about an hour of work here**, plus one stop for the user to approve the heroes as pictures. Your first message
gives `CLIENT`, `PROJECT`, `KIT`, `PORT` and `FRONT_DESK`. Don't redo the research and don't ask the user anything. Stop
only at the hero review in step 4, or if something is blocked. Short updates only.

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
4. **Heroes first (25 minutes), then the user's review.** The hero is judged from pictures, never from the plan.
   - **Before briefing,** open each variant's lead reference sheet: if a banner covers it, most frames are static, the
     look is on the fail list, or its hero isn't made of the same kind of material as this variant's (step 3 of
     `research.md`), replace it. Check each direction: if the hero isn't what the customer came for, the
     palette comes from a metaphor, the look doesn't suit the tone, or the plan needs a move the hero material can't
     carry, rewrite it in `PITCH.md`.
   - **Hero round.** Fill in `KIT/prompts/variant-agent-brief.md` once per variant with `Phase: hero`, and send all the
     subagents in one message, each with `run_in_background: false`. Each builds only its header and hero, with the
     real material, and returns its `hero-frames` sheet.
   - **Your check.** Go through each sheet against "The check" in `taste.md`, comparing the variant's row with its
     reference's row frame by frame. Send back any hero that fails, once, before the user sees it.
   - **Review.** Post, for each variant, its `hero-frames` sheet shown as an image (Markdown image with the absolute
     path), the local hero URL, the recipe in one line, and the reference beside it. If `FRONT_DESK` isn't `none`, also
     send it `HERO REVIEW: CLIENT` with the sheet paths and URLs, using `mcp__t3-code__t3_thread_send`. Then stop and
     wait. The user replies "go" or sends changes: make the changes in a new hero round, show the new sheets, and wait
     again.
   - **Rest of the site (30 minutes).** After "go", send each variant's brief again with `Phase: rest`, all in one
     message. The approved hero stays as it is.
5. **Hub.** Write `PROJECT/index.html`, in the format in section 1 of the playbook, with short plain names.
6. **Quick check (3 minutes).**
   - Run `check-pages.cjs` once on each variant's home page, click through to one inner page, and grep for reference names.
   - **Hero:** run `hero-frames.cjs` once more and check that it still matches the approved sheet, and that it hands
     over cleanly into the next section.
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
- **An extra variant, even from the user's own idea, gets references too.** Pick them from Benchmarks or Awwwards and open
  them, as step 3 of `research.md` says, then name what to take from each. Never brief a Builder with no outside reference,
  except for the free variant (step 2 of `research.md`), which is judged on whether someone would remember it tomorrow.
- **A redone hero goes through the same review:** build it, post its `hero-frames` sheet beside its reference, and
  wait for "go" before publishing.
- **When the user rejects something or repeats a correction,** note the lesson in `PROJECT/docs/LESSONS.md`, in general
  terms with no client names. At "wrap up" it goes into the kit by sharpening the rule it belongs to, not by adding
  another rule beside it.
- **"Deepen V2", or the client picked one:** follow `KIT/prompts/office/deepen.md`.
- **"Wrap up":** read `LESSONS.md` and the user's tweaks in this thread, and write the lessons into
  `KIT/prompts/website-playbook.md`, or `taste.md` if they are about taste, in general terms with no client names. Edit
  the existing rule each one belongs to, and delete any rule it contradicts. Add an Awwwards reference to Benchmarks in
  `reference-library.md` only if the user liked the variant built from it, and anything rejected to "Rejected". List what you added in your reply.
