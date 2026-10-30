# New website project: the prompt

Copy the block below into a **new thread** in the mok-kit project on shaun-studio, fill in what you know and send it.
Leave anything else empty: the agent decides it and tells you what it picked. Attach the logo and any client
photos to the message (the server can't see files on your laptop).

````markdown
Run `git pull` first, then read AGENTS.md and prompts/website-playbook.md.

NEW WEBSITE
Client:
Website / socials / marketplace links:
What they sell and who buys it:
References, one variant each (empty = pick directions yourself from the taste-skill library):
-
-
-
Number of variants: 3
Pages (empty = choose for this business):
Ordering (WhatsApp / marketplace link / booking form / none; empty = choose):
Brand rules (names to avoid, claims not to make, tone; empty = no claims you can't source):
Client's screen: 1920x870 at 125% zoom (~1536x700); every section fits below the header
Publish: not yet

How to run it:
- Anything I left empty: decide it yourself and send me your decisions in one short message. Don't ask me.
- Folder: WebsiteProjects/<Client>/. Content kit first, unknowns marked [client to confirm].
- Plumbing from starter/ with the client's data, then build the variants in parallel, one subagent each
  (prompts/variant-agent-brief.md). With references: Inspiration mode, no exact copies.
- Each variant gets one concept from this client's own world, stated in a sentence before building. Send me the list.
- Check each with tools/web/check-pages.cjs --phone, then send me the preview links.
- Don't stop between steps unless something is blocked. Short updates only.
````

## Shorter, when you're in a hurry
```
git pull, read AGENTS.md + the playbook. New site for <client> (<links>), <3> variants, references: <urls or "pick yourself">. Decide anything I didn't say and tell me your picks. Preview links when done.
```

## Tips
- **The more links, the better the content.** Website, Instagram, Facebook, Shopee/Lazada, Linktree, Google Maps:
  the agent pulls products, prices, photos and reviews from them.
- **Brand rules save the most rework.** A supplier name not to feature, a phrase the client hates, "don't claim halal".
- **Feedback:** one screenshot plus one line ("doesn't fit", "white gap", "too plain"). The playbook explains what
  those mean.
- **Publish later:** when the client is happy, say "publish V2 and V3". Check with your boss which GitHub and Vercel
  account it should use.
- **Learned something new?** Say "add this to the playbook in general terms (no client names)", then push it
  from a machine with write access to the kit repo.
- Full options (clone mode, capture depth, stop points): `website-build-template.md`.
