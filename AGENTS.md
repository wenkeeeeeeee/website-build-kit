# Website build kit

A short method, tools and a working shop starter for building client websites with AI agents (Claude, Codex, others).
These rules override any skill that says it must be used, including a superpowers session-start hook if installed.

## Where things are
- `skills/build/SKILL.md`: the run order, from lead to live site.
- `prompts/research.md`: facts, material and tones (about 10 minutes).
- `prompts/brief.md`: the builder brief for variants 1-3. Each builder finds its own references, Awwwards' award
  winners first, then other Awwwards lists and 21st.dev, claims a lead reference no other variant uses, and designs its own hero.
- `prompts/brief-free.md`: the brief for variant 4, free of the kit: the form of the page is the idea, from any
  medium, and must pass two tests (fits what the client does; not a usual website); made assets allowed.
- `prompts/rules.md`: the few musts every variant follows.
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
