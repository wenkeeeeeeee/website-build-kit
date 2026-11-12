---
name: build
description: Build a client's website variants end to end (research, 3 tone-led variants plus 1 free variant, hero review, full sites, checks, publish to Vercel). Use when the user gives a client name with links or notes and asks to build websites for them, or types /website-build-kit:build.
argument-hint: "Client: <name> Links: <links> References: <optional> Variants: 3 + 1 free Notes: <optional>"
---

# Build websites for a client

The lead (client, links, references, variants, notes) is: $ARGUMENTS

If that is empty, the lead is in the user's message. Missing variants means 3 + 1 free; missing references means none.

KIT = `${CLAUDE_PLUGIN_ROOT}` (this kit's files, read-only: never edit them).

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
     and the words the business uses.
   - Note the main thing a customer decides or does here (pick a table, plan a weekend, find a size).
   - Decide the tone the site should have (for example premium and calm, bold streetwear, warm and homely, playful) from
     how the business looks and talks, who its customers are and what similar businesses do. Write it down with the
     reason.
   - If something is unknown, write [client to confirm]. Never make up prices, reviews or claims.

3. Study references and look for ideas.
   - Capture my references while scrolling with `node tools/contact-sheet.cjs <urls> --out refs`, or grab frames from
     videos, and write down what makes each one impressive.
   - Open the Benchmarks list in `KIT/prompts/office/reference-library.md`. Use any that suit this business and the tone
     you chose (pick a 3D one only if you'll really build the hero in 3D), and take their craft, not their subject.
   - Take at least one idea from outside the web: a poster, packaging, a film title sequence, a game menu, an album
     cover or a magazine spread.
   - Look at what's already in WebsiteProjects/. Reuse ideas that worked, but give them a fresh take for this client.
   - Write 10 one-line ideas, each a "what if" built around what the customer decides or does (the menu as a record
     crate, sizing as a fitting room), from a beautiful classic site to something playful like a map, a game, a 3D room
     or a card pack. Keep the ones someone would screenshot and send to a friend.

4. Plan the variants.
   - Variants 1-3 follow the tone you chose. Base each one on a reference, a Benchmark or one of your ideas, whichever
     suits best.
   - Variant 4 is free: explore on your own and make something we haven't built before (modern, futuristic, playful like
     a game, or anything else that fits the business). It still has to sell.
   - For each variant, plan what the hero shows and how it moves (using the client's real photos and products), the
     order of the sections, fonts that match the tone (avoid common ones like Inter, DM Sans or Playfair), and colours
     from their brand.
   - Before coding, make design images of each variant's hero and two key sections (with an image generator if you have
     one, otherwise quick rough HTML mock-ups, screenshotted). Pick the boldest version and build that.
   - All four should feel clearly different, at the same high quality.

5. Build the heroes first, then wait for me.
   - Build only the header and hero of each variant.
   - The hero shows what customers came for, big and clear, says what the business is in a few words, and has one
     button, or lets you try the idea right there if it's interactive.
   - It must move: a quick opening, gentle movement while idle, and an animation as you scroll that also works on
     phones.
   - Screenshot each hero at a few scroll points and on a phone, beside its reference:
     `node tools/hero-frames.cjs <hero url> <reference url> --out shots`.
   - Show me the tone you chose and why, the screenshots, the one-line idea for each variant and the local links, and
     wait for "go".

6. Build the rest of each site.
   - Every section matches the hero's style and animation, and the variant's idea carries through the page.
   - Show every product with its price, real reviews or proof, and a clear order button that is always easy to reach on
     phones.
   - Add one small helpful tool (like a size finder) that sends a WhatsApp message with the order. It can be part of the
     variant's idea. `KIT/starter` has a working basket, catalogue and WhatsApp checkout you can copy and restyle.
   - Avoid boring rows of boxes. Use big photos, cut-outs and overlaps.
   - The other pages must look as good as the home page.
   - Components: take buttons, menus, dropdowns, date pickers, quantity steppers, sliders, tabs and text effects from
     reactbits.dev (`node tools/reactbits.cjs list`, then `get <Name> --out <site>/js/reactbits`), 21st.dev or
     ui.aceternity.com (check each licence), rewrite them in plain JS and CSS, and restyle them in the site's own fonts,
     colours and shapes. Never leave a browser-default control: no white date popup, no number spinner arrows, no system
     dropdown, no plain grey button. "Controls in the site's design" in `KIT/prompts/website-playbook.md` says how.
   - For any effect your idea needs, open only the matching recipe listed in `KIT/prompts/techniques/INDEX.md`, and take
     timings and sizes from `KIT/prompts/office/craft-numbers.md`. Where they disagree with this skill, this skill wins.

7. Check everything.
   - Run `node tools/check-pages.cjs <every page url> --phone --out check` and look at every
     screenshot. It also flags a white flash in the first half-second, a headline font that didn't load, videos that
     don't play, broken images, sideways scroll and a menu that wraps.
   - Open every dropdown, date picker, stepper and menu, hover every button, and screenshot them open. Redo any that
     looks plain, default or off-style.
   - Fix anything broken, messy, hard to read or slow.
   - Put each variant next to its reference (`node tools/contact-sheet.cjs <variant url> <reference url> --out compare`).
     If it looks weaker, improve it. For the free variant, ask: would someone remember this site tomorrow?

8. Publish.
   - Make a main page that links to all variants.
   - Put it online with the server's own GitHub and Vercel logins, as a private repo.
   - Don't publish the docs, content, tools or screenshot folders.
   - Check every page opens.
   - Send me the live links, the local link and the list of things to confirm with the client.

No gates, long plans, TDD, reports or worktrees: skip the unlazy skill and the superpowers planning, TDD,
verification and worktree skills. Never copy a reference's images, logos or text. Don't use Higgsfield. AI-made video is fine, but only from free tools.
Keep updates short and don't stop anywhere else. After that, I'll send tweaks in this thread.
