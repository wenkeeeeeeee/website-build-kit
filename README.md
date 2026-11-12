# Website build kit

Everything an AI coding agent (Claude Code, Codex and others) needs to build multi-variant client websites fast:
proven methods, a working shop starter, helper scripts and the design skills. No client data.

## Use it as a Claude Code skill (recommended)
Once per machine, in a terminal:
```
claude plugin marketplace add https://github.com/wenkeeeeeeee/website-build-kit
claude plugin install website-build-kit@website-build-kit
```
Then turn on auto-update once: in a Claude Code session run `/plugin` → **Marketplaces** → `website-build-kit` →
**Enable auto-update**. New threads pick up kit changes on their own; a running session needs `/reload-plugins`.

Start a build in any thread with:
```
/website-build-kit:build Client: <name> Links: <links> References: <optional> Notes: <optional>
```
The skill is in `skills/build/SKILL.md`. It reads the kit's files from the installed copy and copies `tools/web` into
each project.

## Use it as a cloned project
1. Clone this repo (in T3 Code: pick the environment → **Add existing project** → clone).
2. Once per machine: `cd tools/web && npm install`. Needs Node 18+, Python 3 and Chrome for the browser tools;
   `cutout.py` needs Pillow and numpy, `film.py` needs ffmpeg.
3. Start a thread in this project and paste a filled-in prompt from `prompts/new-project-prompt.md`. The build goes into
   `WebsiteProjects/<Client>/`, which git ignores, so client work never lands in this repo.
4. Run `git pull` before each new project for the latest methods.

Skills in `.claude/skills/` load automatically in Claude Code for this project only. Nothing is installed globally.
The browser checks run their own headless Chrome, so no browser MCP server is needed. For Codex, copy the skills
into its skills folder (e.g. `cp -r .claude/skills/* ~/.codex/skills/`).

## What's inside
| Path | Contents |
|---|---|
| `AGENTS.md` / `CLAUDE.md` | Working rules every agent follows |
| `prompts/` | Playbook, new-project prompt, full build template, subagent brief |
| `prompts/office/` | The AI office: run orders for research and build threads, role briefs, taste standard, site types, reference library |
| `starter/` | Static shop plumbing: basket with WhatsApp/marketplace checkout, catalogue filters, product page, quote form, stores. All business details in `starter/data/` |
| `tools/web/` | `serve.py` preview server, `check-pages.cjs` desktop and phone checker, `export-site.py` publisher, `film.py` and `film-control.js` hero film, `frames.py` and `scrub.js` scroll film, `stair.js` 3D hero, `gl-guard.js` WebGL safety, `prologue.js` brand opening, `hotspots.js` shop-the-look dots, `cutout.py` cut-outs |
| `.claude/skills/` | Design and debugging skills, see `THIRD_PARTY.md` |

## Improving it
When a build teaches something new, add it to `prompts/website-playbook.md` in general terms (no client names, numbers
or links), commit and push.
