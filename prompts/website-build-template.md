# {{PROJECT NAME}} Website References

1. {{reference URL}}
2. {{reference URL}}
3. {{reference URL}}
<!-- add or remove lines as needed -->

**Objective:** Build {{N}} alternative websites for {{client website / brand source URL}}, one per reference above. {{Optional: what the site must achieve, e.g. sell products, get bookings, collect inquiries.}}

**Before starting:** read `prompts/website-playbook.md` (methods and lessons from past builds) and use the scripts in `tools/web/` (preview server, page checker, export, film, cut-outs) and start the plumbing from `starter/`.

**Client's screen:** {{e.g. 1920x870 at 125% zoom = about 1536x700}}. Every section must fit one screen at these sizes below the sticky header.

**Mode:** {{pick one and delete the others}}
- **Clone → Adapt:** copy each reference first by mirroring its own HTML, CSS, JS and assets (internal use only, never deployed), with the animations working. Then adapt the content and layout to the client's current website.
- **Inspiration:** take the layout, motion and visual style from the references, and build with the client's content from the start.

**Step 1: Capture (light).** For each live reference: one full-page screenshot at desktop, tablet and mobile, one short scroll video, and the page source (HTML, CSS, JS, images, fonts). Note the key sections and animations in `references/<nn>-<name>/notes.md`. Don't do frame-by-frame or per-hover captures unless the source can't be mirrored. For still references (Dribbble, Behance), save the images and a few lines of ideas.

**Step 2: Short plan.** Write `docs/PLAN.md`: a variant → reference → direction table, the build order, and one line of intent per variant. Keep it under a page. No gates, fixtures or test-first steps.

**Step 3: Build.** Build each variant in `variants/<nn>-<name>/`. Clone mode: mirror the reference's source, strip analytics and tracking, add `noindex`. When the source can't be mirrored, use image-to-code on the screenshots. Check desktop with one screenshot. {{Tablet and mobile: "check them too" / "desktop only for now"}}. {{"Stop and show me each clone before adapting" / "Don't stop, build all clones then adapt"}}.

**Step 4: Adapt.** Build the shared pieces once first: the content kit from the client site, and a copy of `starter/` with the client data swapped in ({{cart / booking / form}}). Then adapt the other variants **in parallel, one subagent per variant folder**, using `prompts/variant-agent-brief.md`: each starts from a copy of that plumbing and redesigns everything visible around its reference, with the client's copy, images, logo and colours. Each agent runs its own headless browser (`tools/web/check-pages.cjs`), never the shared Playwright MCP. Per variant: build → no reference assets or brand names left → `check-pages.cjs` at the client's screen sizes (no console errors, sections fit, no white gaps) → fix → report. The lead adds the hub entries.

**Step 5: Publish** {{if wanted}}. `python tools/web/export-site.py <project> <repo>` into the separate repo folder (GitHub + Vercel, which redeploys on push), check `git status --short`, commit, confirm the commit with `git log -1`, push, then check the live URLs.

**Working rules (speed):**
- Run independent variants in parallel with subagents, and keep screenshot review inside them.
- Don't write gates, test suites, QA toolkits, reports or per-variant docs unless I ask.
- Don't re-run checks that already passed. Don't build custom tooling when a simple approach works (for example, choose a different photo instead of writing image processing).
- Give me the preview links at the end of each step (and the live links after publishing).
- Preview with `python tools/web/serve.py <project> 8080`, not `python -m http.server`.

**Skills:** use if installed, and tell me which are missing, but don't stop for them.
- `image-to-code`, only when building from screenshots
- `design-taste-frontend`, `frontend-design`, `impeccable`, for the Adapt look
- `playwright` or `chrome-devtools-mcp`, for screenshots
- {{any extra skills}}

**Notes:** {{anything else: tech stack, deadlines, "internal prototype only", etc.}}
