// Screenshot pages at the client's real screen sizes and flag what clients keep noticing.
// Early-frame, font, video, image and overflow-naming checks adapted from MotionSites shoot.py (MIT, © 2026 MotionSites).
//
//   node check-pages.cjs <url> [<url> ...] [--sizes 1920x870,1536x700] [--out shots] [--header 100] [--full] [--phone]
//
// For every page and size it saves a screenshot and reports:
//   - console errors and failed requests (404s)
//   - sections taller than one screen below the sticky header (main > section, header-level panels, footer)
//   - a footer that does not reach the bottom of the window when scrolled to the end (white strip above it)
//   - horizontal overflow, naming the elements that stick out furthest
//   - words colliding with a button or link on the first screen
//   - header links that wrap onto a second row (desktop sizes)
//   - autoplay videos that are paused or failed, and images that failed to load
//   - missing share-preview and language tags, an H1 web font that did not load, and a white or blank first paint
//     (an extra <name>-early.png taken 350 ms after navigation, first size only) (once per page)
// --phone adds a real phone emulation (390x844, touch). It skips the one-screen rule and also counts small tap
// targets. Use it: an element off the side widens a phone's page, which a narrow desktop window never shows.
// It runs its own headless Chrome (real Chrome first, so H.264 MP4 heroes play; bundled Chromium otherwise), so parallel
// agents never fight over one shared browser (the Playwright MCP browser is shared, and is throttled to ~1fps when its
// window is in the background).
// Needs Playwright: `npm i -D playwright` once in this folder or the project (it looks in both).
const path = require('path');
const fs = require('fs');

function loadModule(name, optional) {
  const tries = [__dirname, process.cwd(), path.join(process.cwd(), 'tools')];
  for (const base of tries) {
    try { return require(require.resolve(name, { paths: [base] })); } catch { /* next */ }
  }
  if (optional) return null;
  console.error(`${name} not found. Run: npm i -D ${name}   (in tools/web or the project)`);
  process.exit(1);
}

// Share of sampled pixels that are near-white, and of those matching the commonest colour (a flat, blank frame).
function samplePixels(buffer, PNG) {
  try {
    const { width, height, data } = PNG.sync.read(buffer);
    let white = 0, n = 0;
    const counts = new Map();
    for (let y = 1; y < height; y += 3) for (let x = 1; x < width; x += 3) {
      const i = (y * width + x) * 4;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (r > 240 && g > 240 && b > 240) white++;
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      counts.set(key, (counts.get(key) || 0) + 1);
      n++;
    }
    const [key, top] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    const hex = '#' + [key >> 10, (key >> 5) & 31, key & 31].map((c) => (c << 3).toString(16).padStart(2, '0')).join('');
    return { white: white / n, flat: top / n, hex };
  } catch { return null; }
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
if (!urls.length) {
  const lines = fs.readFileSync(__filename, 'utf8').split('\n');
  console.log(lines.slice(0, lines.findIndex((l) => !l.startsWith('//'))).join('\n'));
  process.exit(0);
}

(async () => {
  const { chromium } = loadModule('playwright');
  const pngjs = loadModule('pngjs', true);
  // Real Chrome plays H.264 MP4s; Playwright's bundled Chromium cannot (videos stay black). Same order as hero-frames.cjs.
  let realChrome = true;
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => { realChrome = false; return chromium.launch(); });
  if (!realChrome) console.log('browser: bundled Chromium (Chrome not installed): MP4 (H.264) videos will not play here, so video errors may be false.\n');
  fs.mkdirSync(out, { recursive: true });
  let problems = 0;
  for (const url of urls) {
    let firstSize = true;
    for (const [w, h, kind] of sizes) {
      const isPhone = kind === 'phone';
      const context = await browser.newContext({ viewport: { width: w, height: h }, isMobile: isPhone, hasTouch: isPhone });
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => {   // a failed load's console line has no address on it, so add one (Chrome asks for /favicon.ico when none is linked)
        if (m.type() === 'error') errors.push(m.text().slice(0, 140) + (/^Failed to load resource/.test(m.text()) && m.location()?.url ? ` (${m.location().url.slice(-60)})` : ''));
      });
      page.on('requestfailed', (r) => { if (!/ABORTED/.test(r.failure()?.errorText)) errors.push(`failed: ${r.url().slice(-80)}`); });   // the browser drops a <video> source it swaps out
      page.on('response', (r) => { if (r.status() >= 400) errors.push(`${r.status()}: ${r.url().slice(-80)}`); });
      const name = url.replace(/^https?:\/\//, '').replace(/[^\w]+/g, '_').slice(-80) + `_${w}x${h}`;
      let early = null;
      if (firstSize) {
        // First paint: a frame 350 ms in, before fonts, images and intros have settled.
        await page.goto(url, { waitUntil: 'commit' }).catch((e) => errors.push(String(e).slice(0, 140)));
        await page.waitForTimeout(350);
        early = await page.screenshot({ path: path.join(out, name + '-early.png') }).catch(() => null);
        await page.waitForLoadState('networkidle').catch(() => {});
      } else {
        await page.goto(url, { waitUntil: 'networkidle' }).catch((e) => errors.push(String(e).slice(0, 140)));
      }
      await page.waitForTimeout(3000);   // let intros and entrance animations finish
      const settled = await page.screenshot({ path: path.join(out, name + '.png'), fullPage: full });
      const report = await page.evaluate(async ({ hdr, w, isPhone }) => {
        await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]);
        const vh = innerHeight, tall = [];
        const shown = (el) => {
          const cs = getComputedStyle(el);
          return cs.visibility !== 'hidden' && +cs.opacity > 0.1 && !el.closest('[aria-hidden="true"], [inert], [hidden]');
        };
        const label = (el) => (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 30);
        const tagName = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '');
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
        // Header links on two rows (or one link's words on two lines) at desktop sizes.
        const navWraps = [];
        if (!isPhone) {
          const navs = [...document.querySelectorAll('header nav')];
          if (!navs.length) navs.push(...[...document.querySelectorAll('nav, header')].filter((n) => n.getBoundingClientRect().top < 200).slice(0, 1));
          for (const nav of navs) {
            const links = [...nav.querySelectorAll('a')].filter((a) => { const r = a.getBoundingClientRect(); return r.width > 2 && r.height > 2 && r.top < 200 && shown(a); });
            const rows = [];
            for (const a of links) {
              const r = a.getBoundingClientRect(), mid = (r.top + r.bottom) / 2;
              if (!rows.some((y) => Math.abs(y - mid) < Math.max(8, r.height / 2))) rows.push(mid);
              const range = document.createRange(); range.selectNodeContents(a);
              const lines = new Set([...range.getClientRects()].filter((q) => q.width > 1).map((q) => Math.round(q.top / 4)));
              if (lines.size > 1 && a.textContent.trim()) navWraps.push(`link "${label(a)}" breaks onto two lines`);
            }
            if (rows.length > 1) navWraps.push(`${tagName(nav)} links sit on ${rows.length} rows`);
          }
        }
        // Videos and images that did not load or play.
        const videos = [...document.querySelectorAll('video')].map((v) => {
          const r = v.getBoundingClientRect();
          return {
            src: (v.currentSrc || v.src || v.querySelector('source')?.src || '(no src)').split('/').pop().slice(0, 40),
            ready: v.readyState, paused: v.paused, error: v.error ? v.error.code : null, autoplay: v.autoplay,
            onScreen: r.width > 0 && r.height > 0 && r.top < vh && r.bottom > 0,
          };
        });
        const brokenImages = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.getAttribute('src'))).map((i) => (i.currentSrc || i.src).split('/').pop().slice(0, 50));
        // Fonts: what loaded, and whether the H1's first font is one of them.
        const loaded = [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/["']/g, '')))];
        const h1 = [...document.querySelectorAll('h1')].find((e) => e.getBoundingClientRect().width > 0) || document.querySelector('h1');
        let h1Font = null;
        if (h1) {
          const cs = getComputedStyle(h1), stack = cs.fontFamily, first = stack.split(',')[0].trim().replace(/["']/g, '');
          const faces = [...document.fonts].filter((f) => f.family.replace(/["']/g, '').toLowerCase() === first.toLowerCase());
          const system = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-\w+|-apple-system|blinkmacsystemfont|segoe ui|helvetica( neue)?|arial|times( new roman)?|georgia|verdana|tahoma|courier( new)?|inherit|initial)$/i.test(first);
          h1Font = { stack: stack.slice(0, 60), size: cs.fontSize, first, system, defined: faces.length > 0, loaded: faces.some((f) => f.status === 'loaded') };
        }
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
        // Compare with the size asked for: on a phone an overflowing page widens innerWidth along with it.
        const overflowPx = Math.max(0, document.documentElement.scrollWidth - w);
        // Name what sticks out: elements past the right edge that also stick out of their own parent, and which no
        // ancestor clips. Widest first.
        let wide = [];
        if (overflowPx > 1) {
          const clipped = (el) => { for (let p = el.parentElement; p && p !== document.body && p !== document.documentElement; p = p.parentElement) if (/hidden|clip|auto|scroll/.test(getComputedStyle(p).overflowX)) return true; return false; };
          wide = [...document.body.querySelectorAll('*')].map((e) => ({ e, r: e.getBoundingClientRect() }))
            .filter(({ e, r }) => r.width && r.right > w + 1 && r.right > e.parentElement.getBoundingClientRect().right + 1 && getComputedStyle(e).position !== 'fixed' && !clipped(e))
            .sort((a, b) => b.r.right - a.r.right).slice(0, 5).map(({ e, r }) => `${tagName(e)} (right edge ${Math.round(r.right + scrollX)}px)`);
        }
        scrollTo(0, document.documentElement.scrollHeight);
        const f = document.querySelector('footer');
        const gap = f ? Math.round(f.getBoundingClientRect().top) : null;
        return { tall, collisions, small, tags, footerTopAtEnd: gap, overflowPx, wide, navWraps, videos, brokenImages, loaded, h1Font };
      }, { hdr: header, w, isPhone });
      await page.waitForTimeout(300);
      const footerGap = report.footerTopAtEnd > 0 && report.footerTopAtEnd < h ? report.footerTopAtEnd : 0;
      const videoIssues = report.videos.filter((v) => v.error !== null || (v.autoplay && v.paused && v.onScreen)).map((v) =>
        v.error !== null
          ? `video ${v.src} failed (error ${v.error}${v.error === 4 && !realChrome ? ': this Chromium cannot play MP4, check in Chrome' : ''})`
          : `video ${v.src} has autoplay but is paused (readyState ${v.ready})`);
      const issues = [
        ...errors.filter((e) => { const u = /^Failed to load resource.*\((.+)\)$/.exec(e); return !u || !errors.some((x) => x !== e && x.endsWith(u[1].slice(-40))); })
          .map((e) => `console/network: ${e}`),
        ...(isPhone ? [] : report.tall.map((t) => `taller than one screen: ${t}`)),
        ...report.collisions.slice(0, 5).map((c) => `collision on the first screen: ${c}`),
        ...(report.small.length ? [`${report.small.length} tap target(s) under 32px tall, e.g. ${report.small.slice(0, 3).join(' | ')}`] : []),
        ...(footerGap ? [`page shows ${footerGap}px above the footer when scrolled to the end (white strip?)`] : []),
        ...(report.overflowPx > 1 ? [`horizontal overflow: page is ${report.overflowPx}px wider than the window` + (report.wide.length ? `; sticking out: ${report.wide.join(', ')}` : '')] : []),
        ...[...new Set(report.navWraps)].slice(0, 3).map((n) => `header nav wraps: ${n}`),
        ...videoIssues,
        ...(report.brokenImages.length ? [`${report.brokenImages.length} image(s) failed to load, e.g. ${report.brokenImages.slice(0, 3).join(' | ')}`] : []),
      ];
      const notes = [];
      if (report.videos.length) notes.push(`videos: ${report.videos.map((v) => `${v.src} ready${v.ready} ${v.error !== null ? 'error' + v.error : v.paused ? 'paused' : 'playing'}`).join(' | ')}`);
      if (firstSize) {
        firstSize = false;
        const { lang, description, ogTitle, ogImage } = report.tags;
        if (!lang) issues.push('tag: <html> has no lang');
        if (!description) issues.push('tag: no meta description');
        if (!ogTitle || !ogImage) issues.push('tag: no og:title / og:image, so a link shared on WhatsApp shows no preview');
        else if (/^https:/.test(url) && !/^https?:/.test(ogImage)) issues.push('tag: og:image must be a full https:// address once published');
        const hf = report.h1Font;
        notes.unshift(`fonts loaded: ${report.loaded.join(', ') || 'none'} | h1: ${hf ? `${hf.stack} ${hf.size}` : 'no h1'}`);
        if (hf && !hf.system && !hf.loaded) issues.push(`font: the H1's "${hf.first}" ${hf.defined ? 'did not load' : 'has no @font-face'}, so it shows a fallback`);
        // A white or flat first paint, unless the settled page looks the same (a white or flat design).
        if (early && pngjs) {
          const a = samplePixels(early, pngjs.PNG), b = samplePixels(settled, pngjs.PNG);
          if (a && b && a.white > 0.9 && b.white < 0.6) issues.push(`white flash: the frame 350 ms in is ${Math.round(a.white * 100)}% white (${name}-early.png)`);
          else if (a && b && a.flat > 0.998 && b.flat < 0.9) issues.push(`blank first paint: the frame 350 ms in is plain ${a.hex}, nothing on it (${name}-early.png)`);
        }
      }
      problems += issues.length;
      console.log(`${issues.length ? 'CHECK' : 'ok   '} ${w}x${h} ${url}`);
      issues.forEach((i) => console.log(`        - ${i}`));
      notes.forEach((n) => console.log(`        · ${n}`));
      await context.close();
    }
  }
  await browser.close();
  console.log(`\nScreenshots in ${path.resolve(out)}. ${problems ? problems + ' item(s) to look at.' : 'Nothing flagged.'}`);
  console.log('Long-list pages (catalogue grid, recipe article) may be tall on purpose: mark with data-allow-tall.');
})();
