# {{PROJECT NAME}} Website References

1. {{reference URL}}
2. {{reference URL}}
3. {{reference URL}}
<!-- add or remove lines as needed -->

**Objective:** Build {{N}} alternative websites for {{client website / brand source URL}}, one per reference above. {{Optional: what the site must achieve, e.g. sell products, get bookings, collect inquiries.}}

**Before starting:** read `prompts/website-playbook.md`, use the scripts in `tools/web/` (preview server, page checker, export, film, cut-outs), and start the plumbing from `starter/`.

**Client's screen:** {{e.g. 1920x870 at 125% zoom = about 1536x700}}. Every section fits one screen at these sizes, below the sticky header.

**Mode:** {{pick one and delete the others}}
- **Clone → Adapt:** first copy each reference by mirroring its HTML, CSS, JS and assets (internal only, never deployed), animations working. Then adapt content and layout to the client's current website.
- **Inspiration:** take layout, motion and visual style from the references; build with the client's content from the start.

**Step 1: Capture (light).** Per live reference: one full-page screenshot at desktop, tablet and mobile, one short scroll video, and the page source (HTML, CSS, JS, images, fonts). Note key sections and animations in `references/<nn>-<name>/notes.md`. No frame-by-frame or per-hover captures unless the source can't be mirrored. Still references (Dribbble, Behance): save the images and a few lines of ideas.

**Step 2: Short plan.** `docs/PLAN.md`, under a page: a variant → reference → concept table (one sentence from the client's own world, not a style word), the build order, one line of intent per variant. No gates, fixtures or test-first steps.

**Step 3: Build** each variant in `variants/<nn>-<name>/`. Clone mode: mirror the reference's source, strip analytics and tracking, add `noindex`; if it can't be mirrored, use image-to-code on the screenshots. Check desktop with one screenshot. {{Tablet and mobile: "check them too" / "desktop only for now"}}. {{"Stop and show me each clone before adapting" / "Don't stop, build all clones then adapt"}}.

**Step 4: Adapt.** Build the shared pieces once first: the content kit from the client site, and a copy of `starter/` with the client data ({{cart / booking / form}}). Then adapt the other variants **in parallel, one subagent per variant folder**, with `prompts/variant-agent-brief.md`: each starts from a copy of that plumbing and redesigns everything visible around its reference, with the client's copy, images, logo and colours. Each runs its own headless browser (`tools/web/check-pages.cjs`), never the shared Playwright MCP. Per variant: build → no reference assets or brand names left → `check-pages.cjs --phone` at the client's screen sizes (no console errors, sections fit, no white gaps, nothing off the side or colliding on a phone) → fix → report. The lead adds the hub entries.

**Step 5: Publish** {{if wanted}}. `python tools/web/export-site.py <project> <repo>` into the separate repo folder (GitHub + Vercel, redeploying on push), check `git status --short`, commit, confirm with `git log -1`, push, check the live URLs.

**Working rules (speed):** those in `AGENTS.md` (parallel variants, no gates, test suites, QA toolkits, reports, per-variant docs or re-runs of passed checks unless I ask), plus:
- No custom tooling when a simple approach works (e.g. choose another photo instead of writing image processing).
- Preview links at the end of each step, and live links after publishing.
- Preview with `python tools/web/serve.py <project> 8080`, not `python -m http.server`.

**Skills:** use if installed; tell me which are missing, but don't stop for them.
- `image-to-code`, only when building from screenshots
- `design-taste-frontend`, `frontend-design`, `impeccable`, for the Adapt look
- `playwright` or `chrome-devtools-mcp`, for screenshots
- {{any extra skills}}

**Notes:** {{anything else: tech stack, deadlines, "internal prototype only", etc.}}
