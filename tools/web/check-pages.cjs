// Screenshot pages at the client's real screen sizes and flag what clients keep noticing.
//
//   node check-pages.cjs <url> [<url> ...] [--sizes 1920x870,1536x700] [--out shots] [--header 100] [--full]
//
// For every page and size it saves a screenshot and reports:
//   - console errors and failed requests (404s)
//   - sections taller than one screen below the sticky header (main > section, header-level panels, footer)
//   - a footer that does not reach the bottom of the window when scrolled to the end (white strip above it)
//   - horizontal overflow
// It runs its own headless Chromium, so parallel agents never fight over one shared browser
// (the Playwright MCP browser is shared, and is throttled to ~1fps when its window is in the background).
// Needs Playwright: `npm i -D playwright` once in this folder or the project (it looks in both).
const path = require('path');
const fs = require('fs');

function loadPlaywright() {
  const tries = [__dirname, process.cwd(), path.join(process.cwd(), 'tools')];
  for (const base of tries) {
    try { return require(require.resolve('playwright', { paths: [base] })); } catch { /* next */ }
  }
  console.error('Playwright not found. Run: npm i -D playwright   (in tools/web or the project)');
  process.exit(1);
}

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : def; };
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? (args.splice(i, 1), true) : false; };
const sizes = opt('--sizes', '1920x870,1536x700').split(',').map((s) => s.split('x').map(Number));
const out = opt('--out', 'shots');
const header = Number(opt('--header', '100'));
const full = flag('--full');
const urls = args;
if (!urls.length) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(0, 14).join('\n')); process.exit(0); }

(async () => {
  const { chromium } = loadPlaywright();
  // Bundled Chromium if installed (`npx playwright install chromium`), otherwise the installed Chrome.
  const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
  fs.mkdirSync(out, { recursive: true });
  let problems = 0;
  for (const url of urls) {
    for (const [w, h] of sizes) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
      page.on('requestfailed', (r) => errors.push(`failed: ${r.url().slice(-80)}`));
      page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()}: ${r.url().slice(-80)}`); });
      await page.goto(url, { waitUntil: 'networkidle' }).catch((e) => errors.push(String(e).slice(0, 140)));
      await page.waitForTimeout(3000);   // let intros and entrance animations finish
      const name = url.replace(/^https?:\/\//, '').replace(/[^\w]+/g, '_').slice(-80) + `_${w}x${h}`;
      await page.screenshot({ path: path.join(out, name + '.png'), fullPage: full });
      const report = await page.evaluate((hdr) => {
        const vh = innerHeight, tall = [];
        for (const el of document.querySelectorAll('main > section, main > div > section, body > section, footer')) {
          const r = el.getBoundingClientRect();
          const limit = el.tagName === 'FOOTER' ? vh : vh - hdr;   // the footer may be exactly one screen tall
          if (r.height > limit + 2 && !el.matches('[data-allow-tall]')) tall.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : el.className ? '.' + String(el.className).split(' ')[0] : ''} ${Math.round(r.height)}px`);
        }
        scrollTo(0, document.documentElement.scrollHeight);
        const f = document.querySelector('footer');
        const gap = f ? Math.round(f.getBoundingClientRect().top) : null;
        return { tall, footerTopAtEnd: gap, overflowX: document.documentElement.scrollWidth > innerWidth + 1 };
      }, header);
      await page.waitForTimeout(300);
      const footerGap = report.footerTopAtEnd > 0 && report.footerTopAtEnd < h ? report.footerTopAtEnd : 0;
      const issues = [
        ...errors.map((e) => `console/network: ${e}`),
        ...report.tall.map((t) => `taller than one screen: ${t}`),
        ...(footerGap ? [`page shows ${footerGap}px above the footer when scrolled to the end (white strip?)`] : []),
        ...(report.overflowX ? ['horizontal overflow'] : []),
      ];
      problems += issues.length;
      console.log(`${issues.length ? 'CHECK' : 'ok   '} ${w}x${h} ${url}`);
      issues.forEach((i) => console.log(`        - ${i}`));
      await page.close();
    }
  }
  await browser.close();
  console.log(`\nScreenshots in ${path.resolve(out)}. ${problems ? problems + ' item(s) to look at.' : 'Nothing flagged.'}`);
  console.log('Long-list pages (catalogue grid, recipe article) may be tall on purpose: mark with data-allow-tall.');
})();
