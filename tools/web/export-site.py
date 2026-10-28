"""Copy the publishable part of a website project into a separate folder that is its own git repo (and Vercel project).

Kept: the hub index.html, docs/, content/*.json and *.md (no image caches), variants/_shared/ and every
variants/<nn>-*/site/. Left out: clones, reference captures, tools, QA output, screenshots, zips.
The README is written from the hub's variant list, so renaming a variant on the hub renames it everywhere.

Usage: python export-site.py <projectRoot> <repoDir> [--title "Client: website variants"] [--skip 08-old-variant ...]
Then in <repoDir>: git add -A, check `git status --short`, commit, push. Vercel redeploys on push to main.
"""
import argparse
import html
import os
import re
import shutil

ap = argparse.ArgumentParser()
ap.add_argument('project')
ap.add_argument('repo')
ap.add_argument('--title', default=None)
ap.add_argument('--skip', nargs='*', default=[], help='variant folders to keep local only')
a = ap.parse_args()
ROOT, OUT = os.path.abspath(a.project), os.path.abspath(a.repo)
SKIP_DIRS = {'_qa', 'qa', 'shots', 'ref', '__pycache__', 'node_modules', '.git'}
SKIP_EXT = {'.zip', '.psd', '.mov'}

keep = ['index.html', 'docs', 'variants/_shared']
content = os.path.join(ROOT, 'content')
if os.path.isdir(content):
    keep += [f'content/{f}' for f in os.listdir(content) if f.endswith(('.json', '.md'))]
variants = os.path.join(ROOT, 'variants')
keep += [f'variants/{d}/site' for d in sorted(os.listdir(variants)) if d not in a.skip and os.path.isdir(os.path.join(variants, d, 'site'))]


def copy_tree(src, dst):
    for base, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        os.makedirs(os.path.join(dst, os.path.relpath(base, src)), exist_ok=True)
        for f in files:
            if os.path.splitext(f)[1].lower() not in SKIP_EXT:
                shutil.copy2(os.path.join(base, f), os.path.join(dst, os.path.relpath(base, src), f))


# Clear everything except .git and Vercel's local files (.vercel, .env*, .gitignore), then copy fresh.
os.makedirs(OUT, exist_ok=True)
for name in os.listdir(OUT):
    if name in ('.git', '.vercel', '.gitignore') or name.startswith('.env'):
        continue
    p = os.path.join(OUT, name)
    shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
for k in keep:
    src, dst = os.path.join(ROOT, k), os.path.join(OUT, k)
    if not os.path.exists(src):
        continue
    if os.path.isdir(src):
        copy_tree(src, dst)
    else:
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)

# The published hub links only to the finished sites: drop internal-clone links and skipped variants.
hub = os.path.join(OUT, 'index.html')
rows = []
if os.path.exists(hub):
    s = open(hub, encoding='utf8').read()
    s = re.sub(r'\s*<p class="small">Internal[\s\S]*?</p>', '', s)
    for d in a.skip:
        s = re.sub(r'\s*<li>[^\n]*variants/' + re.escape(d) + r'/[^\n]*</li>', '', s)
    open(hub, 'w', encoding='utf8').write(s)
    # <li><strong>Name</strong><span>Description</span><a ... href="variants/<dir>/site/">
    for name, desc, href in re.findall(r'<li><strong>(.*?)</strong><span>(.*?)</span><a[^>]*href="([^"]+)"', s):
        rows.append(f'| {html.unescape(name)} | {html.unescape(desc)} | `{href}` |')
    title = a.title or html.unescape((re.search(r'<h1>(.*?)</h1>', s) or [None, 'Website variants'])[1])
    lede = html.unescape(re.sub(r'<[^>]+>', '', (re.search(r'<p class="lede">(.*?)</p>', s, re.S) or [None, ''])[1]))
else:
    title, lede = a.title or 'Website variants', ''

open(os.path.join(OUT, 'README.md'), 'w', encoding='utf8').write(f"""# {title}
{lede}

| Variant | What it is | Folder |
|---|---|---|
{chr(10).join(rows)}

**Run locally:** `python serve.py . 8080` (or any static server with byte-range support) in this folder, then open http://127.0.0.1:8080/ for the hub page.

Static HTML, CSS and vanilla JS: no build step. `content/` holds the client data, `variants/_shared/` the shared pieces, `docs/` the brief.
""")
total = sum(os.path.getsize(os.path.join(b, f)) for b, _, fs in os.walk(OUT) if '.git' not in b for f in fs)
print(f'exported {len(keep)} paths ({len(rows)} variants on the hub) to {OUT}, {total / 1e6:.1f} MB')
