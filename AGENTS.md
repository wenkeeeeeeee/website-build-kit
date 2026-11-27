# Website build kit

A short method, tools and a working shop starter for building client websites with AI agents (Claude, Codex, others).
These rules override any skill that says it must be used, including a superpowers session-start hook if installed.

## Where things are
- `skills/build/SKILL.md`: the run order, from lead to live site.
- `prompts/research.md`: facts, material and tones (about 10 minutes).
- `prompts/brief.md`: the builder brief for all five variants. V1 and V2 each build a hero from the Awwwards or
  21st.dev hero that fits this business best (award winners first), adapted closely. V3-V5 each brainstorm a hero object or scene
  from the client's world, with references setting only the level of finish. Every variant claims what it uses, so no
  two share. Below the hero, every layout, motion and interaction is the builder's own, carried by a thread, with
  references setting the craft level. The aim is something rarely seen; a corporate tone (only from the user's words)
  keeps it calm, never playful.
- `prompts/rules.md`: the few musts every variant follows.
- `prompts/office/colour.md`: an optional palette move (mood pair plus accent); each builder decides whether it fits.
- `prompts/methods.md`: technical lookup (layout, media, bugs, publishing, sourcing).
- `starter/`: working plumbing (basket with WhatsApp/marketplace checkout, catalogue, product page, quote form,
  stores). Copy it into a project, swap the data, redesign everything visible.
- `tools/web/`: preview server, `find-refs.cjs` (browse Awwwards and 21st.dev), `hero-frames.cjs` (a hero beside its
  reference, moving), `check-pages.cjs`, export, film, scroll and 3D helpers, cut-outs (`npm install` in it once).
- `.claude/skills/`: polish, accessibility and debugging skills.

## Which rule wins
1. The user's own words (`LEAD.md`, messages in the thread).
2. `prompts/rules.md`.
3. Everything else.

## Writing kit rules
- Keep the kit short. Design comes from each builder's own references, never from the kit: no design examples, layout
  advice, font lists or style rules.
- A new lesson fixes the rule it belongs to and deletes any rule it contradicts.

## Don't use these skills for website builds
- `unlazy`, and the superpowers planning, TDD, verification, code-review, worktree and brainstorming skills.
- Skills that hand out ready-made design directions or generate design images: `taste-skill` and its variants,
  `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code`, `brandkit`.

## Use when they help
- `impeccable`, `frontend-design`: polish once a direction is set.
- `dispatching-parallel-agents` for the variants, `systematic-debugging` for a real bug.
