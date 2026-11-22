---
name: build
description: Build a client's website variants end to end (research, 3 tone-led variants plus 1 free variant, hero review, full sites, checks, publish to Vercel). Use when the user gives a client name with links or notes and asks to build websites for them, or types /website-build-kit:build.
argument-hint: "Client: <name> Links: <links> References: <optional> Variants: 3 + 1 free Notes: <optional>"
---

# Build websites for a client

The lead (client, links, references, variants, notes) is: $ARGUMENTS

If that is empty, the lead is in the user's message. Missing variants means 3 + 1 free; missing references means none.

KIT = `${CLAUDE_PLUGIN_ROOT}` (this kit's files, read-only: never edit them).

Read first, and keep to them at every step: `KIT/AGENTS.md` ("Which rule wins" settles any conflict),
`KIT/prompts/office/taste.md` (the quality bar), `KIT/prompts/office/level.md` (the sites that show how good a hero must
be), `KIT/prompts/office/motion.md` and `KIT/prompts/office/site-types.md`.
They are the same rules the office build threads use; this skill only sets the order of work.

Build websites for this client in this thread.

1. Get ready.
   - Make a folder WebsiteProjects/<client name> and work only inside it.
   - Save the lead into docs/LEAD.md.
   - Copy `KIT/tools/web` into the project as `tools/` and run `npm install` and `npm i -D playwright` there (this
     brings gsap, lenis, three and ogl). Also make sure Chromium for Playwright, ffmpeg and yt-dlp are installed.
   - Check that gh and Vercel are logged in. If not, tell me and stop.
   - Run a local preview on a free port in the background: `python tools/serve.py . <port>`.

2. Learn the business.
   - Open every link and search the business name online.
   - Save their logo, real photos and videos.
   - Write down what they sell and the prices, who their customers are, what customers worry about, how people order,
     and the words the business uses. Their posts give the facts and voice, never the look or level.
   - Note the main thing a customer decides or does here (pick a table, plan a weekend, find a size).
   - Write the story the client wants to tell in one sentence, and what visitors need to see or feel to believe it.
     This drives every variant.
   - Set the direction from the category's best, not from a list ("Direction" in `site-types.md`):
     - The target: who this client should be seen beside. My words come first (luxury, premium, a brand I name);
       otherwise the best-known brands in the client's exact category, at the level I want, often above where the
       client is today.
     - Open 3-5 of them and capture each (`node tools/contact-sheet.cjs <urls> --out refs/category` and
       `node tools/hero-frames.cjs <urls> --out refs/category`). Write what they actually do as the Category look: type
       (size, case, weight, style), photography (subject, light, crop, size on screen), background and colour, space
       and density, motion, copy voice, and what makes them feel expensive or trusted. It is the brief for every
       variant and the register each is judged against. Drop any that fail "The bar" in `level.md`; if fewer than
       three pass, add the best of a neighbouring business (an emcee beside performers and personal brands).
     - Pick the Level: 2-3 sites in `level.md`, chosen by what this client's hero will be made of (a person, a product,
       food, a place) and then by business, captured with `node tools/hero-frames.cjs <urls> --out refs/level`. They
       show how good every hero must be and beat the Category look on type scale, colour confidence, staging and space;
       they're never references.
     - Pick the site type and the nearest tone hint (playful, modern and professional, or luxury and premium) for
       motion and interaction levels only. Where the hint and the Category look disagree, the Category look wins.
     - Write 3-5 character words for how this client should feel at the target level, from the Category look and my
       words, checked against the client's facts, never copied from another client.
   - Compare the hero material with the Level and Category look imagery. Where it falls short, write the gap and the fix (new
     shots with a shot list, or faithful renders of the real product labelled "Render for illustration") and never
     frame weak photos as the hero ("Material against the target" in `taste.md`).
   - If something is unknown, write [client to confirm]. Never make up prices, reviews or claims.

3. Find inspiration, then the looks, then the ideas.
   - Before writing looks and ideas, browse for fresh thinking well beyond websites: Behance and Dribbble case studies,
     Instagram brand posts, ad campaigns, packaging, film title sequences, exhibitions and magazine spreads, for this
     category, its neighbours and anything that shares the customer's feeling. Note 3-5 striking finds in
     docs/PITCH.md under "Inspiration", each with its link and the one thought or technique worth taking. Take the
     thought, never the look, layout or imagery.
   - Looks first: for each of the 4 variants, write the visual move that makes its hero sit beside the Level sites:
     how the subject is staged (what it is, how big, cut out or full-bleed, what it overlaps), the colour that owns the
     first screen, and the one type move. Each look is its own in staging and colour; header, section order and
     components may be shared when that's strongest. Never a weaker look just to be different. At least one look comes
     from outside the web: a poster, packaging, a film title, an album cover or a magazine spread.
   - Then about 10 one-line ideas, each a "what if" for how a look carries through the page below the hero, built
     around the client's story and what the customer decides or does (the run-sheet as the scroll, the menu as a record
     crate), drawing on those finds. Playful: maps, games, 3D rooms or card packs below the hero. Modern and
     professional or luxury: ideas that explain, guide or show the real thing (a route, a before-and-after, a
     calculator), with no games, toys, props or rituals. Keep the 4 that fit their looks; the idea never puts a gimmick
     in the hero.
   - Read the variant names, looks and references in other `WebsiteProjects/*/docs/PITCH.md` only so nothing repeats
     and no Benchmark leads for a third client in a row.
   - References: at most one per variant, and only when its look or idea needs a motion technique the kit's recipes
     (`KIT/prompts/techniques/INDEX.md`) don't cover. Find it in the Benchmarks of
     `KIT/prompts/office/reference-library.md` (optional, keeping its "Craft only" and "No back-to-back reuse" rules) or
     Awwwards, capture it with `node tools/contact-sheet.cjs <url> --out refs`, and name the one technique to take,
     never the layout, section order, hero, colour or imagery. No reference is fine. Any reference I paste gets its own
     variant.

4. Plan the variants.
   - Variants 1-3 are three looks with their ideas, in the direction you set. If you hid the logo and one could pass
     for its reference, change it.
   - Variant 4 is free: your own look and idea from the client's own object, something we haven't built before, in the
     client's tone (a game only for a playful client), still at the level. It still has to sell.
   - For each variant, plan what the hero is made of and how it moves (the client's real material, or the fix in "It's
     made of what the client really has" in `taste.md`: faithful renders for a product; for people and places the best
     single real photo and a shoot list), the order of the sections, fonts per "Type" in `taste.md` (its banned list
     included, scale from the level, case and weight from the Category look), and decided colour from the subject's
     world, light or dark. Variants 1 and 2: one colour or family owns the first screen, with no clashing accent.
     Variants 3 and 4 may explore a mood pair with one clashing accent where it suits (`KIT/prompts/office/colour.md`:
     search for fresh pairings, try 3-5 candidates on the hero material, pick the best fit; louder for playful, quieter
     and informational for corporate, never copied from its examples). Brief every builder agent with the Level sites,
     the Category look and the character words, not only the tone hint.
   - Before coding, make design images of each variant's hero and two key sections (with an image generator if you have
     one, otherwise quick rough HTML mock-ups, screenshotted). Pick the version that sits best beside the Level sites and fits the character,
     and build that.
   - All four at the same level, each clearly its own in hero staging and colour.

5. Build the heroes first, then wait for me.
   - Build only the header and hero of each variant, as "The hero" in `taste.md` says, with about 40 minutes for the
     round: only the subject staged big in its look, one bold type move, one short line and one button. No facts row,
     stats or idea gimmick in the hero.
   - It must move as `motion.md` says for the tone, with one motion idea: a quick opening, gentle movement while idle,
     and a scroll move (pinned at most one screen) that also works on phones.
   - Screenshot each hero at a few scroll points and on a phone, beside a Level site:
     `node tools/hero-frames.cjs <hero url> <level site url> --out shots`. Fix and re-run until it would sit in a row
     with the Level sites. I review the heroes myself; no extra review agent.
   - Show me the target, the Category look, the Level sites and the character words, the screenshots, each variant's
     look and idea in one line, its palette as named swatches with hex, its reference and technique if any, and the
     local links, and wait for "go".

6. Build the rest of each site.
   - Every section matches the hero's style and animation, and the variant's idea carries through the page. Each
     section has one main thing (the price and action, an object transition, the tool, a proof moment, the set-piece),
     never all of them; the client's object runs below the hero.
   - A price or "from" price and the main action come within about 1.5 screens of the top; the signature set-piece (at
     most 2-3 pinned screens) comes after them. Home pages run about 6-10 screens.
   - Show every product with its price, real reviews or proof, and a clear order button that is always easy to reach on
     phones.
   - Add one small helpful tool (like a size finder) that sends a WhatsApp message with the order. It can be part of the
     variant's idea. `KIT/starter` has a working basket, catalogue and WhatsApp checkout you can copy and restyle.
   - Avoid boring rows of boxes: big real photos, photos bleeding off the edge and text set on the page. Product grids
     stay straight and aligned ("Boxes and lines" in `taste.md`).
   - The other pages must look as good as the home page.
   - Components: take buttons, menus, dropdowns, date pickers, quantity steppers, sliders, tabs and text effects from
     reactbits.dev (`node tools/reactbits.cjs list`, then `get <Name> --out <site>/js/reactbits`), 21st.dev or
     ui.aceternity.com (check each licence), rewrite them in plain JS and CSS, and restyle them in the site's own fonts,
     colours and shapes. Never leave a browser-default control: no white date popup, no number spinner arrows, no system
     dropdown, no plain grey button. "Controls in the site's design" in `KIT/prompts/website-playbook.md` says how.
   - Motion per `motion.md` at the tone's level. For any effect your idea needs, open only the matching recipe listed
     in `KIT/prompts/techniques/INDEX.md`, and take timings and sizes from `KIT/prompts/office/craft-numbers.md`.

7. Check everything.
   - Run `node tools/check-pages.cjs <every page url> --phone --out check` and look at every
     screenshot. It also flags a white flash in the first half-second, a headline font that didn't load, a banned font,
     videos that don't play, broken images, sideways scroll and a menu that wraps.
   - Open every dropdown, date picker, stepper and menu, hover every button, and screenshot them open. Redo any that
     looks plain, default or off-style.
   - Fix anything broken, messy, hard to read or slow.
   - Put each variant next to two category leaders, a Level site and its reference if it has one
     (`node tools/contact-sheet.cjs <variant url> <leader urls> <level url> [reference url] --out compare`). If it looks
     weaker than the leaders or the Level site, improve it; if it shares the reference's layout, composition, colour or imagery, change it. For the
     free variant, also ask: would someone remember this site tomorrow?

8. Publish.
   - Make a main page that links to all variants.
   - Put it online with the server's own GitHub and Vercel logins, as a private repo.
   - Don't publish the docs, content, tools or screenshot folders.
   - Check every page opens.
   - Send me the live links, the local link and the list of things to confirm with the client.

No gates, long plans, TDD, reports or worktrees: skip the unlazy skill and the superpowers planning, TDD,
verification and worktree skills. Never copy a reference's images, logos or text. Don't use Higgsfield. AI-made video is fine, but only from free tools.
Keep updates short and don't stop anywhere else. After that, I'll send tweaks in this thread.
