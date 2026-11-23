# Website build kit

Methods, scripts, skills and a working shop starter for building client websites fast. Every website build here
follows these rules (Claude, Codex, others). They override any skill that says it must be used, including a superpowers
session-start hook if installed.

## Where things are
- `prompts/office/taste.md`: **the quality bar, the one file every builder must follow.** Everything else is a toolbox.
- `prompts/office/`: run orders `research.md`, `build.md`, `deepen.md`; toolboxes `motion.md` (libraries and motion
  craft), `site-types.md` (pages and tone), `reference-library.md` (the bar, references, code, 3D and media sources),
  `craft-numbers.md` (starting values and known bugs), `colour.md` (mood pair and accent, optional).
- `prompts/variant-agent-brief.md`: the builder brief. `prompts/website-playbook.md`: methods and publishing, for
  lookup. `prompts/new-project-prompt.md`, `website-build-template.md`: manual and Clone-mode builds.
- `starter/`: working plumbing (basket with WhatsApp/marketplace checkout, filtered catalogue, product page, quote form,
  stores). Copy it into a project, swap the data, redesign everything visible.
- `tools/web/`: preview server, page checker, `hero-frames.cjs` (with `--motion`), export, film, scroll and 3D effects,
  cut-outs (`npm install` in it once).
- `prompts/techniques/`: one-effect recipes with working code, from its `INDEX.md`, only for effects an idea needs.
- `.claude/skills/`: the design and debugging skills used on these builds.
- `WebsiteProjects/<Client>/`: each new build goes here.

## Which rule wins
One order for every build, whether it runs from the `/website-build-kit:build` skill or the office run orders:
1. The user's own words (`LEAD.md`, messages in the thread).
2. `PITCH.md`: the client's facts and each variant's plan.
3. `prompts/office/taste.md`.
4. Everything else: the run orders, toolboxes, playbook, recipes, the build skill's steps and any design skill.

## Writing kit rules
- Keep the kit short. Say what the site must achieve; idea, layout, type, colour, medium and motion are the builders'
  own exploration.
- Give no single design example: builders copy it into every variant.
- A new lesson fixes the rule it belongs to and deletes any rule it contradicts. Never add a rule beside it.

## Don't use these skills for website builds
- `unlazy`: no `GATES.md`, no gate-check runs, no hashed evidence.
- `superpowers:writing-plans`, `executing-plans`, `subagent-driven-development`: no long plans, no `.superpowers/sdd` ledger.
- `superpowers:test-driven-development`: no fixtures, self-tests or QA toolkits.
- `superpowers:verification-before-completion`, `requesting-code-review`, `using-git-worktrees`, `finishing-a-development-branch`.
- `superpowers:brainstorming` in build sessions. The brief is already the spec.

## Use when they help
- `dispatching-parallel-agents`, for independent variants.
- `systematic-debugging`, only for a real bug.
- The design and build skills: `image-to-code`, `design-taste-frontend`, `frontend-design`, `impeccable`, plus
  Playwright and chrome-devtools for screenshots.

## How to work
- Mirror the reference's source only in Clone mode, when the lead asks. Otherwise adapt references, never copy them.
- Check each variant with one desktop screenshot, `check-pages.cjs --phone`, and a check that no reference assets or
  brand names remain.
- Build independent variants in parallel with subagents; keep screenshot review inside them.
- No reports, per-variant docs or re-runs of checks unless the user asks.
- Give the user preview links at the end of each step.
- Note new lessons in the project's `docs/LESSONS.md` in general terms (no client names). At wrap-up each sharpens the
  kit rule it belongs to (`prompts/office/build.md`).
