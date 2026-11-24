#!/usr/bin/env node
// Browse reference galleries (Awwwards, 21st.dev) like a visitor, in your own headless browser.
//
//   node find-refs.cjs <listing>[@pages] [<listing> ...] [--scrolls 5] [--out refs/browse]
//   node find-refs.cjs awards [--out refs/awards]
//   node find-refs.cjs live <awwwards site page> [...]
//
// <listing> is a full URL or a shortcut:
//   aw:<category or tag>   https://www.awwwards.com/websites/<slug>/   (e.g. aw:events, aw:sites_of_the_day, aw:scrolling)
//   aw?<words>             https://www.awwwards.com/websites/?text=<words>
//   21st:<section>         https://21st.dev/community/components/s/<section>   (e.g. 21st:hero, 21st:background)
// Category and tag slugs: open https://www.awwwards.com/websites/ and read the Category and Tag filters.
// @pages walks the listing's numbered pages: aw:sites_of_the_month@all, aw:sites_of_the_day@10 (default: 1 page).
//
// `awards` is the award pool, best first: Sites of the Year, Sites of the Month and every Honors category (all
// pages), then the newest 10 pages of Sites of the Day. A site already shown in an earlier list is not shown again.
// For older Sites of the Day: aw:sites_of_the_day@30.
//
// For each listing it scrolls the page, saves numbered sheets of the thumbnails (<name>-1.jpg ..., 24 per sheet) and
// writes <name>.md: every entry by number with its link. Look at the sheets, pick, then:
//   `live` turns an Awwwards site page (https://www.awwwards.com/sites/<slug>) into the live site's address, so you
//   can study the real site with hero-frames.cjs --motion.
// If a page shows a login wall or a block, say so to whoever sent you: the user will log in for you.

const fs = require('fs');
const path = require('path');

let chromium;
try { ({ chromium } = require('playwright')); } catch (e) {
  try { ({ chromium } = require(path.join(__dirname, 'node_modules', 'playwright'))); } catch (e2) {
    console.error('Playwright is missing: run `npm install` in tools/web (or `npm i -D playwright`).');
    process.exit(1);
  }
}

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(name);
  if (i === -1) return dflt;
  const v = args[i + 1];
  args.splice(i, 2);
  return v;
};
const out = opt('--out', 'refs/browse');
const scrolls = Math.max(1, parseInt(opt('--scrolls', '5'), 10) || 5);

const expand = (s) => {
  if (/^https?:\/\//.test(s)) return s;
  if (s.startsWith('aw:')) return `https://www.awwwards.com/websites/${s.slice(3).replace(/^\/|\/$/g, '')}/`;
  if (s.startsWith('aw?')) return `https://www.awwwards.com/websites/?text=${encodeURIComponent(s.slice(3))}`;
  if (s.startsWith('21st:')) return `https://21st.dev/community/components/s/${s.slice(5)}`;
  return s;
};
const slug = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60);

async function launch() {
  try { return await chromium.launch({ channel: 'chrome', headless: true }); } catch (e) { return chromium.launch({ headless: true }); }
}

async function dismiss(page) {
  for (const label of ['GOT IT', 'Got it', 'Accept', 'Accept all', 'I agree', 'OK']) {
    try { await page.getByRole('button', { name: label, exact: true }).first().click({ timeout: 600 }); return; } catch (e) {}
    try { await page.click(`text="${label}"`, { timeout: 400 }); return; } catch (e) {}
  }
}

const AWARDS = ['sites_of_the_year@all', 'sites_of_the_month@all',
  ...['typography', 'no-code', 'ecommerce', 'product', 'portfolio', 'business-services'].map((c) => `winner_category_${c}@all`),
  'sites_of_the_day@10'].map((s) => `aw:${s}`);
const shown = new Set(); // sites already on a sheet in this run

async function browse(browser, listing) {
  const at = listing.match(/@(\d+|all)$/);
  const maxPages = at ? (at[1] === 'all' ? 200 : Math.max(1, parseInt(at[1], 10))) : 1;
  const url = expand(at ? listing.slice(0, at.index) : listing);
  const name = slug(url);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    let entries = [];
    let pagesRead = 0;
    for (let n = 1; n <= maxPages; n++) {
      const pageUrl = new URL(url);
      if (n > 1) pageUrl.searchParams.set('page', String(n));
      const found = await readListing(page, pageUrl.href, n === 1);
      if (found === null) break;
      pagesRead = n;
      const fresh = found.filter((e) => !entries.some((x) => x.href === e.href));
      if (!fresh.length) break; // past the last page
      entries.push(...fresh);
    }
    const total = entries.length;
    entries = entries.filter((e) => !shown.has(e.href));
    entries.forEach((e) => shown.add(e.href));
    await sheets(page, url, name, entries, `${total} entries on ${pagesRead} page(s), ${total - entries.length} already shown in an earlier list`);
  } catch (e) {
    console.log(`FAILED ${url}: ${e.message.split('\n')[0]}`);
  } finally {
    await page.close();
  }
}

// One page of a listing: its gallery cards, or null if the page failed.
async function readListing(page, url, first) {
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => null);
  if (!res && !first) return null;
  {
    await page.waitForTimeout(first ? 2500 : 1200);
    await dismiss(page);
    const status = res ? res.status() : 0;
    const title = await page.title();
    if (status === 404) { if (first) console.log(`NOT FOUND ${url}: check the category, tag or section name.`); return first ? [] : null; }
    else if (status >= 400 || /just a moment|access denied|attention required|\blog ?in\b|\bsign ?in\b/i.test(title)) {
      console.log(`BLOCKED ${url} (status ${status}, "${title}"): ask the user to log in for you.`);
    }
    // Scroll down so the gallery loads more cards and their thumbnails.
    for (let i = 0; i < scrolls * 2; i++) { await page.mouse.wheel(0, 450); await page.waitForTimeout(first ? 500 : 300); }
    await page.waitForTimeout(1000);
    // Entries: links that wrap a picture or video (the gallery cards), with a label and the thumbnail address.
    const isAww = /awwwards\.com/.test(url);
    let entries = await page.$$eval('a', (as) => {
      const seen = new Set();
      const list = [];
      const pick = (el) => {
        if (!el) return '';
        const abs = (s) => { try { return s ? new URL(s, location.href).href : ''; } catch (e) { return ''; } };
        if (el.tagName === 'VIDEO') return abs(el.poster || (el.querySelector('source') || {}).src || el.currentSrc || '');
        const source = el.closest('picture') && el.closest('picture').querySelector('source');
        const set = el.getAttribute('data-srcset') || el.getAttribute('srcset')
          || (source && (source.getAttribute('data-srcset') || source.getAttribute('srcset'))) || '';
        const fromSet = set ? set.split(',').pop().trim().split(' ')[0] : '';
        const src = el.getAttribute('data-src') || (el.currentSrc && !/^data:/.test(el.currentSrc) ? el.currentSrc : '') || fromSet || el.src || '';
        return /^data:/.test(src) ? '' : abs(src);
      };
      for (const a of as) {
        const media = [...a.querySelectorAll('img, video')];
        if (!media.length && !a.querySelector('picture, canvas, iframe')) continue;
        const href = a.href.split('#')[0];
        if (!href || seen.has(href) || /\/(login|signup|pricing|jobs|academy|market)\b/.test(href)) continue;
        seen.add(href);
        const card = a.closest('li, article, figure, [class*="card"], [class*="item"]') || a;
        let label = (a.getAttribute('aria-label') || a.title || a.textContent || '').trim().replace(/\s+/g, ' ');
        if (!label) label = card.textContent.trim().replace(/\s+/g, ' ');
        const big = media.map(pick).filter(Boolean).filter((s) => !/avatar|thumb_user|logo/i.test(s));
        let thumb = big[0] || '';
        if (!thumb) {
          const more = [...card.querySelectorAll('img, video')].map(pick).filter((s) => s && !/avatar|thumb_user|logo/i.test(s));
          thumb = more[0] || '';
        }
        list.push({ href, label: label.slice(0, 70), thumb });
      }
      return list;
    });
    if (isAww) entries = entries.filter((e) => /\/sites\//.test(e.href));
    return entries;
  }
}

async function sheets(page, url, name, entries, note) {
  {
    // A numbered contact sheet of the thumbnails (lazy galleries don't screenshot reliably).
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const shots = [];
    const per = 24;
    for (let start = 0; start < entries.length; start += per) {
      const chunk = entries.slice(start, start + per);
      const cards = chunk.map((e, i) => {
        const n = start + i + 1;
        const media = !e.thumb ? '<div class="none">no thumbnail</div>'
          : /\.(mp4|webm)(\?|$)/i.test(e.thumb) ? `<video src="${esc(e.thumb)}" muted preload="auto"></video>`
          : `<img src="${esc(e.thumb)}">`;
        return `<figure>${media}<figcaption><b>${n}</b> ${esc(e.label || '(no label)')}</figcaption></figure>`;
      }).join('');
      const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:16px;background:#111;color:#eee;font:14px system-ui}
        .g{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}figure{margin:0}img,video,.none{width:100%;aspect-ratio:4/3;object-fit:cover;background:#333;display:block;border-radius:4px}
        .none{display:grid;place-items:center;color:#888}figcaption{padding:6px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}b{color:#fc6}</style>
        <h3>${esc(url)}</h3><div class="g">${cards}</div>`;
      const sheet = await page.context().browser().newPage();
      await sheet.setViewportSize({ width: 1440, height: 900 });
      await sheet.setContent(html, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
      await sheet.waitForTimeout(1500);
      const file = path.join(out, `${name}-${shots.length + 1}.jpg`);
      await sheet.screenshot({ path: file, type: 'jpeg', quality: 75, fullPage: true });
      await sheet.close();
      shots.push(file);
    }
    if (!entries.length) {
      const file = path.join(out, `${name}-page.jpg`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: file, type: 'jpeg', quality: 72 });
      shots.push(file);
    }
    const md = [`# ${url}`, '', note, '', ...shots.map((s) => `- sheet: ${s}`), '', ...entries.map((e, i) => `${i + 1}. ${e.label || '(no label)'} | ${e.href}`)].join('\n');
    fs.writeFileSync(path.join(out, `${name}.md`), md + '\n');
    console.log(`${url}: ${entries.length} new (${note}), ${shots.length} sheet(s) -> ${path.join(out, name)}.md`);
  }
}

async function live(browser, urls) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const u of urls) {
    try {
      await page.goto(expand(u), { waitUntil: 'commit', timeout: 60000 });
      await page.waitForSelector('a', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(2500);
      const href = await page.$$eval('a', (as) => {
        const a = as.find((x) => /visit (the )?site|view site|live site|open site/i.test(x.textContent));
        return a ? a.href : '';
      });
      console.log(`${u} -> ${href || 'no live link found: open the page and look'}`);
    } catch (e) {
      console.log(`${u} -> FAILED ${e.message.split('\n')[0]}`);
    }
  }
  await page.close();
}

(async () => {
  if (!args.length) {
    console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1).filter((l, i, a) => a.slice(0, i + 1).every((x) => x.startsWith('//'))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    process.exit(1);
  }
  fs.mkdirSync(out, { recursive: true });
  const browser = await launch();
  try {
    if (args[0] === 'live') await live(browser, args.slice(1));
    else for (const l of args.flatMap((a) => (a === 'awards' ? AWARDS : [a]))) await browse(browser, l);
  } finally {
    await browser.close();
  }
})();
