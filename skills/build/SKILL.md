---
name: build
description: Build a client's website variants end to end (research, 3 variants plus 1 free variant, hero review, full sites, checks, publish to Vercel). Use when the user gives a client name with links or notes and asks to build websites for them, or types /website-build-kit:build.
argument-hint: "Client: <name> Links: <links> References: <optional> Variants: 3 + 1 free Notes: <optional>"
---

# Build websites for a client

The lead (client, links, references, variants, notes) is: $ARGUMENTS

If that is empty, the lead is in the user's message. Missing variants means 3 + 1 free.

KIT = `${CLAUDE_PLUGIN_ROOT}` (read-only: never edit it). Read `KIT/AGENTS.md` and `KIT/prompts/office/taste.md` first:
taste.md is the whole quality bar. Everything else in the kit is a toolbox to open when needed.

1. **Get ready.**
   - Make `WebsiteProjects/<client name>` and work only inside it. Save the lead into `docs/LEAD.md`.
   - Copy `KIT/tools/web` into the project as `tools/` and run `npm install` and `npm i -D playwright` there (gsap,
     lenis, three, ogl). Make sure Chromium for Playwright, ffmpeg and yt-dlp are installed.
   - Check that gh and Vercel are logged in. If not, tell me and stop.
   - Start `python tools/serve.py . <free port>` in the background with the maximum timeout.

2. **Learn the business** (about 15 minutes; `KIT/prompts/office/research.md` steps 1-3 say how).
   - Open every link and search beyond them. Save the logo, products and prices, proof, ways to order, and every usable
     photo and clip. Never invent prices, reviews or claims: `[client to confirm]`.
   - Note what the customer does here, the buyer's path, the tone and 3-5 character words
     (`KIT/prompts/office/site-types.md`), and what I said about any earlier round for this client, word for word.
   - Open 2-3 of the best brands in the client's category and the nearest category sites in "The bar" in
     `KIT/prompts/office/reference-library.md`. They set the level.

3. **Prepare the material.** Crop clean, one grade, upscale only while sharp, cut out products, cut short film loops
   from their clips (`tools/cutout.py`, `tools/film.py`). Where a 3D model would lift the product or place, get a good
   one ("3D and media" in `reference-library.md`). Save it all in `content/`.

4. **Plan lightly.** Write `docs/PITCH.md` (the format at the end of `research.md`): the facts, the material, and one
   starting point per variant, the client's thing it builds from, different for each. Copy `KIT/starter` into
   `variants/_shared/starter` with the client's data, pages and a basket named for the business.

5. **Build the heroes, then wait for me.** Send one builder per variant, all in one message, each with
   `KIT/prompts/variant-agent-brief.md` filled in (`Phase: hero`). Each learns, writes three ideas, builds the
   strongest, and checks it with `node tools/hero-frames.cjs <hero url> <category site> --motion`. Look at every sheet
   beside its category site; send a weak hero back once. Then show me per variant: the hero and motion sheets as
   images, the idea in one line, its palette as named swatches with hex, its references and what each gave, and the
   local link. Wait for "go" or changes.

6. **Build the rest.** Send each brief again with `Phase: rest`. Every page at the hero's level, the whole business,
   one tool ending in WhatsApp, every control in the site's design ("Will they buy?" in `taste.md`).

7. **Check.** `node tools/check-pages.cjs <every page> --phone --out check` and look at the shots. Each variant beside
   two category sites: fix anything weaker or broken, and anything that could pass for a reference with the logo
   hidden.

8. **Publish.** A hub page linking every variant, then a private GitHub repo and Vercel project with the server's own
   logins (section 7 of `KIT/prompts/website-playbook.md`). Don't publish docs, content, tools or screenshots. Check
   every page opens, then send me the live links, the local link and what to confirm with the client.

After that I'll send tweaks in this thread. When I approve a hero, copy its folder and brief to
`WebsiteProjects/_approved/<slug>-<variant>/`.

No gates, long plans, TDD, reports or worktrees: skip the unlazy skill and the superpowers planning, TDD, verification
and worktree skills. Never copy a reference's images, logos or text. Never use Higgsfield; generated images and video
only from free tools. Keep updates short and don't stop anywhere else.
