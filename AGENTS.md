# Website build kit

Methods, scripts, skills and a working shop starter for building client websites fast. Every website build here
follows these rules (Claude, Codex, others). They override any skill that says it must be used, including a superpowers
session-start hook if installed.

## Where things are
- `prompts/website-playbook.md`: methods, the quality bar, publishing. Its table says which sections each role reads.
- `prompts/new-project-prompt.md`, `website-build-template.md`, `variant-agent-brief.md`: briefs for the lead and subagents.
- `starter/`: working plumbing (basket with WhatsApp/marketplace checkout, filtered catalogue, product page, quote form,
  stores). Copy it into a project, swap the data, redesign everything visible.
- `tools/web/`: preview server, page checker, export, hero film, scroll and 3D effects, cut-outs (`npm install` in it
  once).
- `prompts/office/`: the AI office. Run orders: `research.md`, `build.md`, `deepen.md`. Standards: `taste.md`,
  `motion.md`, `site-types.md`, `reference-library.md`. A lead gets 10-20 minutes of research and a plan the user
  reviews, then heroes the user approves as pictures, then full variants published to Vercel.
- `prompts/techniques/`: one-effect recipes with working code, looked up from its `INDEX.md` only for effects a concept
  already chose. `prompts/office/craft-numbers.md`: starting values for type, motion and common bugs.
- `.claude/skills/`: the design and debugging skills used on these builds.
- `WebsiteProjects/<Client>/`: each new build goes here.

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
