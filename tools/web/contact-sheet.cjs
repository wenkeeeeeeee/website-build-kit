// Scroll through pages like a visitor and make one image per page, plus a side-by-side of them all.
//
//   node contact-sheet.cjs <url> [<url> ...] [--out shots] [--steps 12] [--size 1536x700] [--parallel 4]
//
// Writes <out>/<slug>.jpg (the page, scrolled through) and <out>/all.jpg (one row per page, for spotting variants
// that look alike), and prints each page's fonts, canvas and video counts and section list.
// It runs its own headless browsers, so parallel agents never fight over one shared browser. Pages open
// --parallel at a time, each in its own browser, because a page in a background tab stops animating.
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
const steps = Number(opt('--steps', '12'));
const parallel = Number(opt('--parallel', '4'));
const PAGE_LIMIT = 90000;
const [width, height] = opt('--size', '1536x700').split('x').map(Number);
const urls = args;
if (!urls.length) { console.error('Usage: node contact-sheet.cjs <url> [<url> ...] [--out shots] [--steps 12]'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const slug = (u) => u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(-60);
const asImg = (buf) => `<img src="data:image/jpeg;base64,${buf.toString('base64')}">`;

// A frozen page or frame must never stall the run, so whatever talks to a page has a time limit.
const limit = (work, ms, fallback) => Promise.race([work, new Promise((done) => setTimeout(done, ms, fallback))]);

async function sheet(browser, shots, columns, file, pageWidth) {
  const page = await browser.newPage({ viewport: { width: pageWidth, height: 800 } });
  await page.setContent(`<style>body{margin:0;display:grid;grid-template-columns:repeat(${columns},1fr);gap:6px;background:#222}img{width:100%;display:block}</style>${shots.map(asImg).join('')}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: file, type: 'jpeg', quality: 75, fullPage: true });
  await page.close();
}

// Cookie banners, age gates and popups hide the page they sit on, in any language, and consent boxes can sit in a frame.
async function dismissGates(page) {
  const words = 'accept|accept all|accept cookies|allow|allow all|agree|i agree|ok|okay|got it|yes|enter|i am of legal age|close|×|x'
    + '|accetta|accetta tutto|accetto|tout accepter|accepter|j\'accepte|aceptar|aceptar todo|aceitar|akzeptieren|alle akzeptieren|zustimmen|accepteren|同意|同意する|すべて受け入れる|동의';
  for (let pass = 0; pass < 2; pass++) {
    for (const frame of page.frames()) {
      const clicked = await limit(frame.evaluate((source) => {
        const word = new RegExp(source, 'i');
        for (const el of document.querySelectorAll('button, [role="button"], a, input[type="button"], input[type="submit"]')) {
          const text = (el.innerText || el.value || '').trim();
          const box = el.getBoundingClientRect();
          const onScreen = box.width > 0 && box.height > 0 && box.bottom > 0 && box.top < innerHeight;
          if (text.length <= 24 && word.test(text) && onScreen && getComputedStyle(el).visibility !== 'hidden') {
            el.click();
            return true;
          }
        }
        return false;
      }, `^(?:${words})(?=$|[\s.!,])`).catch(() => false), 3000, false);
      if (clicked) { await page.waitForTimeout(600); break; }
    }
  }
}

async function capture(browser, url) {
  const page = await browser.newPage({ viewport: { width, height }, userAgent: USER_AGENT });
  // Gallery pages keep loading forever, and Behance can answer 403 and still load, so don't wait on either.
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => { if (/net::ERR/.test(e.message)) throw e; });
  await page.bringToFront();
  await page.waitForTimeout(6000);
  // Accepting cookies reloads some sites, which replays their loading intro.
  const loadedAt = () => page.evaluate(() => performance.timeOrigin).catch(() => 0);
  const before = await loadedAt();
  await dismissGates(page);
  await page.waitForTimeout(1500);
  if (await loadedAt() !== before) await page.waitForTimeout(8000);
  await page.mouse.move(width / 2, height / 2);
  // Loading intros lock the page at one screen until they finish.
  const pageHeight = () => page.evaluate(() => document.documentElement.scrollHeight);
  let total = await pageHeight();
  for (let waited = 0; total <= height + 5 && waited < 10000; waited += 500) {
    await page.waitForTimeout(500);
    total = await pageHeight();
  }
  // Slider sites move on the wheel without the document ever scrolling, so wheel them one screen per step.
  const slider = total <= height + 5;
  const shots = [];
  for (let i = 0; i < steps; i++) {
    if (slider && i > 0) {
      await page.mouse.wheel(0, height);
      await page.waitForTimeout(1000);
    }
    const target = slider ? 0 : Math.round((total - height) * i / Math.max(1, steps - 1));
    let y = await page.evaluate(() => scrollY);
    // Wheel, not scrollTo: smooth-scroll libraries ignore scrollTo, and reveals need real scrolling.
    while (y < target - 5) {
      await page.mouse.wheel(0, Math.min(height, target - y));
      await page.waitForTimeout(160);
      const next = await page.evaluate(() => scrollY);
      if (next === y) break;
      y = next;
    }
    await page.waitForTimeout(800);
    shots.push(await page.screenshot({ type: 'jpeg', quality: 60 }));
  }
  const info = await page.evaluate(() => {
    const fonts = {};
    for (const el of [...document.querySelectorAll('h1,h2,h3,p,a,button,span')].slice(0, 500)) {
      const f = getComputedStyle(el).fontFamily.split(',')[0].replace(/"/g, '');
      fonts[f] = (fonts[f] || 0) + 1;
    }
    return {
      title: document.title,
      height: document.documentElement.scrollHeight,
      fonts: Object.entries(fonts).sort((a, b) => b[1] - a[1]).slice(0, 4).map((x) => x[0]),
      canvas: document.querySelectorAll('canvas').length,
      video: document.querySelectorAll('video').length,
      sections: [...document.querySelectorAll('main > section, body > section, footer')].slice(0, 24).map((s) => {
        const h = s.querySelector('h1,h2,h3');
        return `${s.offsetHeight}px ${(h ? h.innerText : s.className || s.tagName).toString().replace(/\s+/g, ' ').slice(0, 50)}`;
      }),
    };
  });
  await page.close();
  return { shots, info };
}

(async () => {
  const { chromium } = loadPlaywright();
  // Real Chrome first: galleries turn away Playwright's bundled headless browser.
  const launch = () => chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(parallel, urls.length) }, async () => {
    const browser = await launch();
    while (next < urls.length) {
      const i = next++;
      results[i] = await limit(
        capture(browser, urls[i]).catch((e) => ({ error: e.message.split('\n')[0] })),
        PAGE_LIMIT,
        { error: `gave up after ${PAGE_LIMIT / 1000} seconds` },
      );
    }
    await limit(browser.close(), 5000);
  }));
  const browser = await launch();
  const rows = [];
  for (const [i, url] of urls.entries()) {
    const { shots, info, error } = results[i];
    if (error) { console.log(`\n${url}\n  FAILED: ${error}`); continue; }
    const file = path.join(out, `${slug(url)}.jpg`);
    await sheet(browser, shots, 3, file, 1800);
    const blocked = /attention required|just a moment|access denied|forbidden|verify you are/i.test(info.title);
    if (blocked) console.log(`\n${url}\n  BLOCKED: the site served a wall ("${info.title}"), so this sheet shows nothing useful.`);
    else if (info.height <= height + 5) console.log(`\n${url}\n  NOTE: the document did not scroll, so this sheet was wheeled instead. If every frame is the same, a gate or loader is hiding it.`);
    console.log(`\n${url}\n  ${file}\n  ${JSON.stringify(info, null, 1).replace(/\n\s*/g, ' ')}`);
    const at = (f) => shots[Math.min(shots.length - 1, Math.round((shots.length - 1) * f))];
    rows.push(at(0), at(0.25), at(0.5), at(0.75), at(1));
  }
  if (rows.length) await sheet(browser, rows, 5, path.join(out, 'all.jpg'), 2400);
  await limit(browser.close(), 5000);
  process.exit(0);
})();
