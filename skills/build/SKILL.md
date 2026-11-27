---
name: build
description: Build a client's website variants end to end (short research, 3 variants with crafted heroes plus 1 free variant, hero review, full sites, publish to Vercel). Use when the user gives a client name with links or notes and asks to build websites for them, or types /website-build-kit:build.
argument-hint: "Client: <name> Links: <links> References: <optional> Variants: 3 + 1 free Notes: <optional>"
---

# Build websites for a client

The lead (client, links, references, variants, notes) is: $ARGUMENTS

If that is empty, the lead is in the user's message. Missing variants means 3 + 1 free.

KIT = `${CLAUDE_PLUGIN_ROOT}`, or the KIT path you were given (read-only: never edit it). Read `KIT/prompts/rules.md`.
You are the lead: you research, send the builders, show the user their work and publish. Builders design.

1. **Get ready (5 minutes).**
   - Make `WebsiteProjects/<client name>` and work only inside it. Save the lead word for word to `docs/LEAD.md`.
   - Copy `KIT/tools/web` into the project as `tools/` and run `npm install` there. Make sure Playwright's Chromium,
     ffmpeg and yt-dlp are installed.
   - Check that gh and Vercel are logged in. If not, tell the user and stop.
   - Start `python tools/serve.py . <free port>` in the background with the maximum timeout.
   - Start the award pool in the background: `node tools/find-refs.cjs awards --out ../_awards` (Sites of the Year,
     Sites of the Month, every Honors category, recent Sites of the Day, as numbered sheets). `WebsiteProjects/_awards`
     is shared by every build on this machine: the first run takes several minutes, later runs check every list again
     and add the winners since, in about a minute. Run it as your tool's own background task, so you are told when it
     exits, and wait on that, or on its last line `DONE`. Never write your own check for it (`pgrep -f` finds the
     check itself and never says done). Then copy `../_awards` to `references/awards`. Every builder goes through it
     before looking anywhere else, so it must be there before step 3.
   - **Rework of variants already built:** if the lead points to a repo of existing variants, don't start over.
     Clone it as the project folder (pull if it is already there) and add `docs/`, `content/`, `tools/`, `references/`
     and `ref/` to its `.gitignore`. Research only what is missing (facts from the client's links and the sites' own
     text; the material is in each `site/assets/`). Write each variant's hero idea into
     `references/claims.md` and copy the starter (step 3), then run only the phases the notes ask for. Publishing is
     a commit and push to the same repo.

2. **Research (about 10 minutes):** run `KIT/prompts/research.md`. It writes `docs/FACTS.md` (facts, material, tones)
   and prepares `content/`.

3. **Heroes.** Send every builder in one message, so they run at the same time:
   - V1-V3: `KIT/prompts/brief.md`, each with its own tone from FACTS.md, `Phase: hero`, and under "Hero ideas
     already used" the ideas from earlier rounds or that the user rejected.
   - V4: `KIT/prompts/brief-free.md`, `Phase: hero`.
   Folders `variants/01-<name>` to `04-<name>` (short names, changeable later). Before any Higgsfield spend, ask the
   user. While they work, copy `KIT/starter`
   into `variants/_shared/starter` with the client's data (`data/`), for the rest phase.
   If a builder says a site blocked it or asked for a login, tell the user which site and wait: the user logs in for
   you in the browser, then you browse that site for the builder and pass on what it needs.

4. **Show the user the heroes, then wait.** Per variant: its `hero-*.jpg` sheet as an image (the hero beside its
   level references; V4's alone) and its motion sheet, the idea in one line, the level reference links and what each
   set, the generated objects or images it would like,
   and the local link. Before you show them, hold each hero against the user's words in FACTS.md: if one goes
   against them (a feel, a rejected idea, a client who would not be proud of it), say so beside it. Hold V4 also against the two tests in its brief (fits, unexpected), and send it back if its
   first screen reads as a usual website or a plain software screen. If you were given
   a FRONT_DESK thread, also send it a message starting `HERO REVIEW` with the
   same. Then wait for "go", changes or a redo. A redo sends the brief again with the user's words in "Changes".

5. **Build the rest.** Send the approved variants' briefs again with `Phase: rest` and the user's changes; each
   builder finds references for its sections and the hand-overs between them. When the
   user supplies generated images, pass them to the builder that asked.

6. **Check.** `node tools/check-pages.cjs <every page> --phone --out check`. Look at the shots and fix anything broken
   (sideways scroll, overlaps, dead links, default browser controls).

7. **Publish.** A hub page linking every variant, then a private GitHub repo and Vercel project with this machine's
   logins ("Publishing" in `KIT/prompts/methods.md`). Don't publish docs, content, tools or `ref/` folders. Check every
   page opens, then send the user the live links, the local link and what to confirm with the client. If you were
   given a FRONT_DESK thread, also send it a message starting `LIVE` with the same.

After that the user sends tweaks in this thread: pass each to the builder brief of that variant (`Phase: rest`, the
user's words in "Changes"), or fix small things yourself.

Keep updates short. No gates, long plans, TDD, reports or worktrees: skip the unlazy skill and the superpowers
planning, TDD, verification and worktree skills.
