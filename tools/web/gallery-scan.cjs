// Skim design galleries the way a person does: run searches, get one thumbnail image per search, pick by eye.
//
//   node gallery-scan.cjs "<search terms>" ["<more terms>" ...] [--out shots]
//
// Every search runs on Behance and Dribbble at once, in about 15 seconds. Writes
// <out>/<source>-<terms>.jpg and prints up to 12 links with titles per search, in the order they appear on the page.
// Awwwards blocks automated browsers, so search it with WebSearch or WebFetch instead.
const path = require('path');
const fs = require('fs');

function loadPlaywright() {
  for (const base of [__dirname, process.cwd(), path.join(process.cwd(), 'tools')]) {
    try { return require(require.resolve('playwright', { paths: [base] })); } catch { /* next */ }
  }
  console.error('Playwright not found. Run: npm i -D playwright   (in tools/web or the project)');
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : def; };
const out = opt('--out', 'shots');
const terms = args;
if (!terms.length) { console.error('Usage: node gallery-scan.cjs "<search terms>" ["<more terms>" ...] [--out shots]'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const SOURCES = [
  { name: 'behance', url: (t) => `https://www.behance.net/search/projects/${encodeURIComponent(t)}`, link: /behance\.net\/gallery\/\d+/ },
  { name: 'dribbble', url: (t) => `https://dribbble.com/search/${t.trim().replace(/\s+/g, '-')}`, link: /dribbble\.com\/shots\/\d+/ },
];

async function scan(browser, source, term) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1500 }, userAgent: USER_AGENT });
  try {
    // Behance can answer 403 and still load, so judge by what is on the page, not the status.
    await page.goto(source.url(term), { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    await page.mouse.wheel(0, 1200);
    await page.waitForTimeout(1500);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(500);
    const links = await page.$$eval('a[href]', (anchors) => anchors.map((a) => ({
      url: a.href.split('?')[0],
      title: (a.getAttribute('aria-label') || a.title || (a.querySelector('img') || {}).alt || a.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70),
    })));
    const seen = new Set();
    const hits = links.filter((l) => source.link.test(l.url) && !seen.has(l.url) && seen.add(l.url)).slice(0, 12);
    const file = path.join(out, `${source.name}-${term.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 60 });
    return { source: source.name, term, file, hits };
  } catch (e) {
    return { source: source.name, term, error: e.message.split('\n')[0], hits: [] };
  } finally {
    await page.close();
  }
}

(async () => {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const jobs = terms.flatMap((term) => SOURCES.map((source) => scan(browser, source, term)));
  for (const r of await Promise.all(jobs)) {
    console.log(`\n${r.source} · ${r.term}${r.error ? ` · FAILED: ${r.error}` : ` · ${r.hits.length} links · ${r.file}`}`);
    for (const h of r.hits) console.log(`  ${h.url}  ${h.title}`);
  }
  await browser.close();
})();
