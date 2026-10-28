# Website build kit

Methods, scripts, skills and a working shop starter for building client websites fast. Every website build in this
repo follows these rules (Claude, Codex, others). They override any skill that says it must be used, including a
superpowers session-start hook if one is installed.

## Where things are
- `prompts/website-playbook.md`: read first. Methods, the quality bar, publishing.
- `prompts/new-project-prompt.md`, `website-build-template.md`, `variant-agent-brief.md`: briefs for the lead and the subagents.
- `starter/`: working plumbing (basket with WhatsApp/marketplace checkout, catalogue with filters, product page,
  quote form, stores). Copy it into a project, swap the data, redesign everything visible.
- `tools/web/`: preview server, page checker, export, hero film and cut-out scripts (run `npm install` in it once).
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
- The design and build skills: `image-to-code`, `design-taste-frontend`, `frontend-design`, `impeccable`,
  plus Playwright and chrome-devtools for screenshots.

## How to work
- Clone by mirroring the reference's source.
- Check each variant with one desktop screenshot plus a check that no reference assets or brand names remain.
- Build independent variants in parallel with subagents, and keep screenshot review inside them.
- No reports, per-variant docs or re-runs of checks unless the user asks.
- Give the user preview links at the end of each step.
- When something new is learned, add it to `prompts/website-playbook.md` in general terms (no client names).
