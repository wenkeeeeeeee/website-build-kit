# Deepen: finish the chosen variant

The client picked a variant and agreed the quotation. Its pages already work, so this is the slow work the first build
skipped. Follow `KIT/AGENTS.md` and `KIT/prompts/website-playbook.md`.

1. **Full content kit.** Go through every client source properly, following the links you find. Section 8 of the
   playbook has the tricks for login walls, Shopee and Instagram. Add to:
   - `content/`: all products or services, prices, reviews, certificates, hours, branches and contacts, and
     `content/copy.md` with the client's real wording, quoted exactly.
   - `content/images/`: all usable photos. Check them by looking, not by file name.
   - `docs/BRAND-INSIGHTS.md` and `content/OPEN-QUESTIONS.md`. Where sources disagree, use the most recent and mark it
     `[client to confirm]`.
2. **Fill in the site.** Swap the full data into the chosen variant's `site/`, clear the answered `[client to confirm]`
   tags, and add any page or tool the client now needs, ending in WhatsApp. New pages and sections meet
   `KIT/prompts/office/motion.md`, and this is the time to finish any motion the first build dropped.
   - Everything in `data/` is public. Internal notes, research fields and "do not feature" remarks stay in
     `content/OPEN-QUESTIONS.md`. Check image paths, and write whole sentences rather than cut-off summaries.
   - A name on the do-not-feature list may still be a real menu item, so list the item without the brand name.
3. **Check.** Run `check-pages.cjs --phone --header <height>` on every page and fix what it flags, then go through the
   "Rejected on sight" list in `taste.md`.
4. **Publish** as in section 7 of the playbook, and report the live links here.
