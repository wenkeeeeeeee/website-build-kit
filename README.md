# Website build kit

A short method, tools and a working shop starter for building multi-variant client websites with AI coding agents
(Claude Code, Codex and others). No client data.

## Use it as a Claude Code skill
Once per machine, in a terminal:
```
claude plugin marketplace add https://github.com/wenkeeeeeeee/website-build-kit
claude plugin install website-build-kit@website-build-kit
```
Then in a session: `/plugin` → **Marketplaces** → `website-build-kit` → **Enable auto-update**. A running session needs
`/reload-plugins` to pick up changes.

Start a build in any thread with:
```
/website-build-kit:build Client: <name> Links: <links> References: <optional> Variants: 3 + 1 free Notes: <optional>
```

## How a build runs
1. **Research** (about 10 minutes): the client's facts, prepared photos and videos, and a different tone for each of
   variants 1-3.
2. **Heroes:** four builders at once. Variants 1-3 each go through Awwwards' award winners first (Sites of the Year,
   of the Month, Honors, of the Day), then other Awwwards lists and 21st.dev if needed, pick a lead reference no other
   variant uses, and design a hero from it with the client's own material. Variant 4 is free of the kit.
3. **Review:** each hero is shown beside its lead reference. You approve, change or redo.
4. **Full sites, check, publish** to a private GitHub repo and Vercel.

## What's inside
| Path | Contents |
|---|---|
| `AGENTS.md` | Working rules every agent follows |
| `skills/build/SKILL.md` | The run order |
| `prompts/` | Research, the two builder briefs, the rules and the technical methods |
| `starter/` | Static shop plumbing: basket with WhatsApp/marketplace checkout, catalogue filters, product page, quote form, stores. All business details in `starter/data/` |
| `tools/web/` | Preview server, reference browser, hero and page checkers, publisher, film, scroll and 3D helpers, cut-outs |
| `.claude/skills/` | Polish, accessibility and debugging skills, see `THIRD_PARTY.md` |

Needs Node 18+, Python 3 and Chrome; `cutout.py` needs Pillow and numpy, `film.py` needs ffmpeg.

## Improving it
Keep it short. When a build teaches something, fix the rule it belongs to in general terms (no client names, numbers or
links) and delete whatever it contradicts.
