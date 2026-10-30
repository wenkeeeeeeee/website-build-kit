// Screenshot pages at the client's real screen sizes and flag what clients keep noticing.
//
//   node check-pages.cjs <url> [<url> ...] [--sizes 1920x870,1536x700] [--out shots] [--header 100] [--full] [--phone]
//
// For every page and size it saves a screenshot and reports:
//   - console errors and failed requests (404s)
//   - sections taller than one screen below the sticky header (main > section, header-level panels, footer)
//   - a footer that does not reach the bottom of the window when scrolled to the end (white strip above it)
//   - horizontal overflow
//   - words colliding with a button or link on the first screen
//   - missing share-preview and language tags (once per page)
// --phone adds a real phone emulation (390x844, touch). It skips the one-screen rule and also counts small tap
// targets. Use it: an element off the side widens a phone's page, which a narrow desktop window never shows.
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
const phone = flag('--phone');
if (phone) sizes.push([390, 844, 'phone']);
const urls = args;
if (!urls.length) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(0, 18).join('\n')); process.exit(0); }

(async () => {
  const { chromium } = loadPlaywright();
  // Bundled Chromium if installed (`npx playwright install chromium`), otherwise the installed Chrome.
  const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
  fs.mkdirSync(out, { recursive: true });
  let problems = 0;
  for (const url of urls) {
    let tagsChecked = false;
    for (const [w, h, kind] of sizes) {
      const isPhone = kind === 'phone';
      const context = await browser.newContext({ viewport: { width: w, height: h }, isMobile: isPhone, hasTouch: isPhone });
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 140)); });
      page.on('requestfailed', (r) => { if (!/ABORTED/.test(r.failure()?.errorText)) errors.push(`failed: ${r.url().slice(-80)}`); });   // the browser drops a <video> source it swaps out
      page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()}: ${r.url().slice(-80)}`); });
      await page.goto(url, { waitUntil: 'networkidle' }).catch((e) => errors.push(String(e).slice(0, 140)));
      await page.waitForTimeout(3000);   // let intros and entrance animations finish
      const name = url.replace(/^https?:\/\//, '').replace(/[^\w]+/g, '_').slice(-80) + `_${w}x${h}`;
      await page.screenshot({ path: path.join(out, name + '.png'), fullPage: full });
      const report = await page.evaluate(({ hdr, w, isPhone }) => {
        const vh = innerHeight, tall = [];
        const shown = (el) => {
          const cs = getComputedStyle(el);
          return cs.visibility !== 'hidden' && +cs.opacity > 0.1 && !el.closest('[aria-hidden="true"], [inert], [hidden]');
        };
        const label = (el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 30);
        // Collisions: a control against anything else, on the words rather than the block around them. Text on text is
        // skipped: tight headlines and stacked collages do it on purpose.
        const boxes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const t = walker.currentNode, el = t.parentElement;
          if (!t.textContent.trim() || /^(SCRIPT|STYLE|NOSCRIPT|OPTION)$/.test(el.tagName) || !shown(el)) continue;
          const range = document.createRange(); range.selectNodeContents(t);
          const r = range.getBoundingClientRect();
          boxes.push({ el: el.closest('a, button') || el, r: { left: r.left, right: r.right, width: r.width, top: r.top + r.height * 0.2, bottom: r.bottom - r.height * 0.2, height: r.height * 0.6 } });
        }
        document.querySelectorAll('a, button').forEach((el) => { const r = el.getBoundingClientRect(); if (shown(el) && r.height < 100) boxes.push({ el, r }); });
        const onScreen = boxes.filter(({ r }) => r.width > 2 && r.height > 2 && r.top < vh && r.bottom > 0 && r.left < w && r.right > 0);
        const collisions = [];
        onScreen.forEach((a, i) => onScreen.slice(i + 1).forEach((b) => {
          if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el) || !a.el.closest('a, button') && !b.el.closest('a, button')) return;
          const ow = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
          const oh = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
          if (ow > 3 && oh > 3 && ow * oh > 0.1 * Math.min(a.r.width * a.r.height, b.r.width * b.r.height)) {
            const pair = [label(a.el), label(b.el)].sort().map((t) => `"${t}"`).join(' and ');
            if (!collisions.includes(pair)) collisions.push(pair);
          }
        }));
        // Tap targets on phones; links inside running text are fine.
        const small = !isPhone ? [] : [...document.querySelectorAll('a, button, select, input:not([type=hidden])')].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width && r.height && r.height < 32 && r.bottom + scrollY > 0 && shown(el) && !(getComputedStyle(el).display === 'inline' && el.closest('p'));
        }).map(label);
        const meta = (sel) => document.querySelector(sel)?.getAttribute('content') || '';
        const tags = {
          lang: document.documentElement.lang, description: meta('meta[name=description]'),
          ogTitle: meta('meta[property="og:title"]'), ogImage: meta('meta[property="og:image"]'),
        };
        for (const el of document.querySelectorAll('main > section, main > div > section, body > section, footer')) {
          const r = el.getBoundingClientRect();
          const limit = el.tagName === 'FOOTER' ? vh : vh - hdr;   // the footer may be exactly one screen tall
          if (r.height > limit + 2 && !el.matches('[data-allow-tall]')) tall.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : el.className ? '.' + String(el.className).split(' ')[0] : ''} ${Math.round(r.height)}px`);
        }
        scrollTo(0, document.documentElement.scrollHeight);
        const f = document.querySelector('footer');
        const gap = f ? Math.round(f.getBoundingClientRect().top) : null;
        // Compare with the size asked for: on a phone an overflowing page widens innerWidth along with it.
        return { tall, collisions, small, tags, footerTopAtEnd: gap, overflowPx: Math.max(0, document.documentElement.scrollWidth - w) };
      }, { hdr: header, w, isPhone });
      await page.waitForTimeout(300);
      const footerGap = report.footerTopAtEnd > 0 && report.footerTopAtEnd < h ? report.footerTopAtEnd : 0;
      const issues = [
        ...errors.map((e) => `console/network: ${e}`),
        ...(isPhone ? [] : report.tall.map((t) => `taller than one screen: ${t}`)),
        ...report.collisions.slice(0, 5).map((c) => `collision on the first screen: ${c}`),
        ...(report.small.length ? [`${report.small.length} tap target(s) under 32px tall, e.g. ${report.small.slice(0, 3).join(' | ')}`] : []),
        ...(footerGap ? [`page shows ${footerGap}px above the footer when scrolled to the end (white strip?)`] : []),
        ...(report.overflowPx > 1 ? [`horizontal overflow: page is ${report.overflowPx}px wider than the window`] : []),
      ];
      if (!tagsChecked) {
        tagsChecked = true;
        const { lang, description, ogTitle, ogImage } = report.tags;
        if (!lang) issues.push('tag: <html> has no lang');
        if (!description) issues.push('tag: no meta description');
        if (!ogTitle || !ogImage) issues.push('tag: no og:title / og:image, so a link shared on WhatsApp shows no preview');
        else if (/^https:/.test(url) && !/^https?:/.test(ogImage)) issues.push('tag: og:image must be a full https:// address once published');
      }
      problems += issues.length;
      console.log(`${issues.length ? 'CHECK' : 'ok   '} ${w}x${h} ${url}`);
      issues.forEach((i) => console.log(`        - ${i}`));
      await context.close();
    }
  }
  await browser.close();
  console.log(`\nScreenshots in ${path.resolve(out)}. ${problems ? problems + ' item(s) to look at.' : 'Nothing flagged.'}`);
  console.log('Long-list pages (catalogue grid, recipe article) may be tall on purpose: mark with data-allow-tall.');
})();
