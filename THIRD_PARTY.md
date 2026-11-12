# Third-party skills

The skills in `.claude/skills/` are unmodified copies from these open-source projects. Each keeps its own
license; the full texts are in `licenses/`.

| Skills | Source | License |
|---|---|---|
| `frontend-design` | [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) | Apache-2.0 (`licenses/frontend-design.LICENSE`) |
| `dispatching-parallel-agents`, `systematic-debugging` | [obra/superpowers](https://github.com/obra/superpowers) | MIT (`licenses/superpowers.LICENSE`) |
| `design-critique`, `accessibility-review`, `ux-copy` | [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) (design) | Apache-2.0 (`licenses/design.LICENSE`) |
| `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 (`licenses/impeccable.LICENSE`) |
| `chrome-devtools`, `a11y-debugging`, `debug-optimize-lcp`, `troubleshooting` | [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Apache-2.0 (`licenses/chrome-devtools-mcp.LICENSE`) |
| `taste-skill` (design-taste-frontend) | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT (`licenses/taste-skill.LICENSE`) |
| `soft-skill`, `minimalist-skill`, `brutalist-skill`, `gpt-tasteskill`, `stitch-skill` | [Leonxlnx/taste-skill-classics](https://github.com/Leonxlnx/taste-skill-classics) | MIT (`licenses/taste-skill-classics.LICENSE`) |
| `image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit` | [Leonxlnx/imagegen-skills](https://github.com/Leonxlnx/imagegen-skills) | MIT (`licenses/imagegen-skills.LICENSE`) |

React Bits (https://reactbits.dev, MIT + Commons Clause) is not stored in this kit. Its license allows the
components inside a website but not redistribution on their own or in a bundle, so `tools/web/reactbits.cjs` fetches
them on demand into a git-ignored cache, and each ported file keeps a header crediting the source.

`prompts/techniques/` and `prompts/office/craft-numbers.md` are adapted from the MotionSites skill
([Motionsites-AI/claude-skill](https://github.com/Motionsites-AI/claude-skill), MIT, `licenses/motionsites.LICENSE`):
rewritten to plain JS with local libraries, with recipes that clash with our rules left out. Its examples and media are
not MIT and are not included. `tools/web/check-pages.cjs` adapts a few checks from its `shoot.py`.

Installed as plugins from the original repos, `impeccable` also adds edit hooks and review sub-agents, which are
not part of these copies.
