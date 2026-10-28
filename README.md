# Website build kit

Everything an AI coding agent (Claude Code, Codex and others) needs to build multi-variant client websites fast:
methods that worked, a working shop starter, helper scripts and the design skills. No client data.

## Use it
1. Clone this repo (in T3 Code: pick the environment → **Add existing project** → clone).
2. Once per machine: `cd tools/web && npm install`. Needs Node 18+ and Python 3, plus Chrome for the browser
   tools. `cutout.py` needs Pillow and numpy; `film.py` needs ffmpeg.
3. Start a thread in this project and paste a prompt from `prompts/new-project-prompt.md`, filled in.
   The build goes into `WebsiteProjects/<Client>/`, which git ignores, so client work never lands in this repo.
4. Before each new project, run `git pull` to get the latest methods.

Skills in `.claude/skills/` load automatically in Claude Code for this project only, and `.mcp.json` adds the
Playwright and chrome-devtools servers (Claude asks before using them). Nothing is installed globally.
For Codex, copy the skills into its skills folder (for example `cp -r .claude/skills/* ~/.codex/skills/`).

## What's inside
| Path | Contents |
|---|---|
| `AGENTS.md` / `CLAUDE.md` | Working rules every agent follows |
| `prompts/` | Playbook (read first), new-project prompt, full build template, subagent brief |
| `starter/` | Static shop plumbing: basket with WhatsApp/marketplace checkout, catalogue filters, product page, quote form, stores. All business details in `starter/data/` |
| `tools/web/` | `serve.py` preview server, `check-pages.cjs` screen-fit checker, `export-site.py` publisher, `film.py` hero film, `cutout.py` cut-outs |
| `.claude/skills/` | Design and debugging skills, see `THIRD_PARTY.md` |

## Improving it
When a build teaches something new, add it to `prompts/website-playbook.md` in general terms (no client names,
numbers or links), commit and push.
