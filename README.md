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
/website-build-kit:build Client: <name> Links: <links> References: <optional> Variants: 5 Notes: <optional>
```

## How a build runs
1. **Research** (about 10 minutes): the client's facts, prepared photos and videos, and a tone for each variant.
2. **Heroes:** five builders at once. Variants 1 and 2 each go through Awwwards' award winners first (Sites of the
   Year, of the Month, Honors, of the Day), then other lists and 21st.dev, and rebuild a different hero that fits this
   business best with the client's own material. Variants 3-5 each brainstorm 5-6 hero objects or scenes from the client's world, claim
   one no other variant uses, and build it to the level of award winners (studied for finish, not layout); that
   object then travels the whole page as its thread. A corporate tone stays calm and precise.
3. **Review:** each hero is shown beside its lead or level references. You approve, change or redo.
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
