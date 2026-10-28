# New website project: starter prompt

Paste a block below into a new thread and fill in the {{fields}}. The long instructions live in
`website-playbook.md` and `website-build-template.md`; this prompt only carries what is specific to the client.

## With references

````markdown
New website project: {{CLIENT NAME}}
Client site / brand source: {{URL or "none, brief attached"}}
Folder: WebsiteProjects/{{Client Name}}/

References (one variant each):
1. {{URL}}
2. {{URL}}
3. {{URL}}

Read prompts/website-playbook.md and follow prompts/website-build-template.md.
Use the scripts in tools/web/ and start the plumbing from starter/.

Decisions (already made, don't ask me):
- Mode: Inspiration (adapt the references' layout, components and motion; no exact copies)
- Pages: {{home, shop, product, about, stores, contact...}}
- Ordering: {{basket → marketplace shop / WhatsApp / booking form / none}}
- Client's screen: {{1920x870 at 125% zoom (~1536x700)}}. Every section must fit that.
- Images: client's own + generated; no new photography. {{Brand assets: logo file path}}
- Brand rules: {{names to feature or avoid, banned phrases, dietary claims, tone}}
- Publish: {{yes → new GitHub repo + Vercel project / not yet}}

How to run it:
1. Content kit first (client data, images, logo, open questions).
2. Copy starter/ and swap in the client's data.
3. Build the variants in parallel, one agent per variant, from prompts/variant-agent-brief.md.
4. Check each with tools/web/check-pages.cjs, then give me the preview links.
Don't stop between steps unless something is blocked. Short updates only.
````

## No references (choose the directions yourself)

````markdown
New website: {{CLIENT NAME}} ({{client site URL or "brief attached"}})
Folder: WebsiteProjects/{{Client Name}}/
No reference URLs: choose the directions yourself.

Read prompts/website-playbook.md, use tools/web/, start the plumbing from starter/.

- Plumbing: copy starter/ (basket, catalogue with filters, product page, quote form, stores) and put in
  the client's data. Drop pages that don't fit the client, add ones they need.
- Directions: build {{3}} variants. Pick them from the taste-skill direction library, choosing what suits
  this client's products and audience. Tell me the picks in one line each, then build without waiting for me.
- Each variant must look like its own site, not the same site with new colours.

Decisions: client's screen {{1920x870 at 125% (~1536x700)}}, every section fits; ordering {{marketplace /
WhatsApp / other}}; brand rules {{...}}; logo {{path}}; publish {{yes/no}}.

Run: content kit → plumbing from starter/ → variants in parallel (prompts/variant-agent-brief.md, own
headless browser each) → check-pages.cjs → preview links. Short updates only.
````

## One line, when in a hurry
```
New site for {{CLIENT}} ({{URL}}), references {{URL1}}, {{URL2}}, {{URL3}} (or "pick 3 directions yourself"). Follow prompts/website-playbook.md, plumbing from starter/; screen {{1920x870 at 125%}}; brand rules: {{…}}; publish: {{yes/no}}. Go.
```

## Before you send it
- **Fill in every decision.** A blank becomes a question back to you, which costs a round trip.
- **Brand rules up front.** Most late fixes come from these (a supplier name not to feature, a banned phrase).
- **Pages and ordering.** Naming them stops the agents guessing.
- **Logo file path.** The logo intro, footer and header all need it.
- **Publish yes/no.** Decide whether the GitHub and Vercel setup should happen from the start.

## While it runs
- Send feedback as one screenshot plus one line ("doesn't fit", "white gap", "too plain"). The playbook already
  explains what those mean, so the fixes come faster.
- When something new is learned, say "add this to the playbook" so the next project benefits too.

Full options (clone mode, capture depth, stop points): `website-build-template.md`.
