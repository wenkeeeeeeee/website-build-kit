// Show what a scroll hero does, frame by frame, so a person can judge it from pictures, not from a description.
//
//   node hero-frames.cjs <url> [<url> ...] [--out shots] [--screens 3] [--size 1536x700] [--motion] [--video]
//
// For each page: frames at 0, 33, 66 and 100% of the first --screens screens of scrolling, one frame on the way back up
// at 33% (a scrubbed hero must look the same in both directions), and a phone frame at the top. Writes
// <out>/hero-<slug>.jpg per page and <out>/hero-all.jpg with one labelled row per page, so a variant's hero and its
// references sit side by side at the same scroll points. Own headless browsers, so parallel agents never share one.
//
// --motion also writes <out>/motion-<slug>.jpg: the opening at 0.3, 0.8, 1.5 and 3 seconds, eight frames taken while
// the hero is still scrolling (never settled), and a hover on the first button at 0.12 and 0.4 seconds. Stills hide
// cheap motion; this sheet shows the in-between states a visitor actually sees.
// --video also records <out>/video-<slug>.webm of the load, the scroll and the hover, for a person to watch.
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
const screens = Number(opt('--screens', '3'));
const [width, height] = opt('--size', '1536x700').split('x').map(Number);
const flag = (name) => { const i = args.indexOf(name); if (i >= 0) args.splice(i, 1); return i >= 0; };
const motion = flag('--motion');
const video = flag('--video');
const urls = args;
if (!urls.length) { console.error('Usage: node hero-frames.cjs <url> [<url> ...] [--out shots] [--screens 3]'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
const slug = (u) => u.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(-60);
const limit = (work, ms, fallback) => Promise.race([work, new Promise((done) => setTimeout(done, ms, fallback))]);

async function clearGates(page) {
  const word = '^(?:accept|accept all|accept cookies|allow|allow all|agree|i agree|ok|okay|got it|yes|enter|close|×|x)(?=$|[\\s.!,])';
  for (const frame of page.frames()) {
    const clicked = await limit(frame.evaluate((source) => {
      const re = new RegExp(source, 'i');
      for (const el of document.querySelectorAll('button, [role="button"], a')) {
        const text = (el.innerText || '').trim();
        const box = el.getBoundingClientRect();
        if (text.length <= 24 && re.test(text) && box.width > 0 && box.bottom > 0 && box.top < innerHeight) { el.click(); return true; }
      }
      return false;
    }, word).catch(() => false), 3000, false);
    if (clicked) { await page.waitForTimeout(800); return; }
  }
}

// Wheel, not scrollTo: smooth-scroll libraries and scrubbed timelines only follow real scrolling.
async function wheelTo(page, target) {
  let y = await page.evaluate(() => scrollY);
  for (let tries = 0; Math.abs(y - target) > 5 && tries < 60; tries++) {
    const step = Math.max(-height / 2, Math.min(height / 2, target - y));
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(140);
    const next = await page.evaluate(() => scrollY);
    if (next === y) break;
    y = next;
  }
  await page.waitForTimeout(900);
}

async function open(browser, url, phone) {
  const context = await browser.newContext(phone
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: PHONE_UA }
    : { viewport: { width, height }, userAgent: USER_AGENT });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => { if (/net::ERR/.test(e.message)) throw e; });
  await page.waitForTimeout(6000);
  await clearGates(page);
  await page.waitForTimeout(1500);
  return { context, page };
}

async function capture(browser, url) {
  const frames = [];
  const { context, page } = await open(browser, url, false);
  await page.mouse.move(width / 2, height / 2);
  const run = screens * height;
  for (const f of [0, 1 / 3, 2 / 3, 1]) {
    await wheelTo(page, Math.round(run * f));
    frames.push({ label: `${Math.round(f * 100)}%`, shot: await page.screenshot({ type: 'jpeg', quality: 62 }) });
  }
  await wheelTo(page, Math.round(run / 3));
  frames.push({ label: 'back up to 33%', shot: await page.screenshot({ type: 'jpeg', quality: 62 }) });
  await context.close();
  const phone = await open(browser, url, true);
  frames.push({ label: 'phone', shot: await phone.page.screenshot({ type: 'jpeg', quality: 62 }), phone: true });
  await phone.context.close();
  return frames;
}

async function captureMotion(browser, url) {
  const frames = [];
  const context = await browser.newContext({ viewport: { width, height }, userAgent: USER_AGENT,
    ...(video ? { recordVideo: { dir: out, size: { width: Math.round(width / 2), height: Math.round(height / 2) } } } : {}) });
  const page = await context.newPage();
  const start = Date.now();
  await page.goto(url, { waitUntil: 'commit', timeout: 60000 }).catch((e) => { if (/net::ERR/.test(e.message)) throw e; });
  for (const t of [300, 800, 1500, 3000]) {
    await page.waitForTimeout(Math.max(0, t - (Date.now() - start)));
    frames.push({ label: `opening ${t / 1000}s`, shot: await page.screenshot({ type: 'jpeg', quality: 58 }) });
  }
  await page.waitForTimeout(3000);
  await clearGates(page);
  await page.mouse.move(width / 2, height / 2);
  const step = (screens * height) / 48;
  for (let i = 1; i <= 48; i++) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(40);
    if (i % 6 === 0) frames.push({ label: `mid-scroll ${Math.round((i / 48) * 100)}%`, shot: await page.screenshot({ type: 'jpeg', quality: 58 }) });
  }
  await page.waitForTimeout(900);
  await wheelTo(page, 0);
  const target = await page.evaluate(() => {
    for (const el of document.querySelectorAll('a.btn, .button, button, [class*="cta"], a[href*="wa.me"], header a')) {
      const b = el.getBoundingClientRect();
      if (b.width > 30 && b.height > 18 && b.top > 0 && b.bottom < innerHeight) return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    }
    return null;
  });
  if (target) {
    await page.mouse.move(target.x, target.y, { steps: 4 });
    await page.waitForTimeout(120);
    frames.push({ label: 'hover 0.12s', shot: await page.screenshot({ type: 'jpeg', quality: 58 }) });
    await page.waitForTimeout(280);
    frames.push({ label: 'hover 0.4s', shot: await page.screenshot({ type: 'jpeg', quality: 58 }) });
  }
  const rec = page.video();
  await context.close();
  if (rec) {
    const file = path.join(out, `video-${slug(url)}.webm`);
    await rec.saveAs(file).catch(() => {});
    await rec.delete().catch(() => {});
    console.log(`  video: ${file}`);
  }
  return frames;
}

const motionHtml = (url, frames) => `<h2>${url}: motion</h2><div class="m">${frames.map((f) => `<figure><img src="data:image/jpeg;base64,${f.shot.toString('base64')}"><figcaption>${f.label}</figcaption></figure>`).join('')}</div>`;

const cell = (f) => `<figure${f.phone ? ' class="p"' : ''}><img src="data:image/jpeg;base64,${f.shot.toString('base64')}"><figcaption>${f.label}</figcaption></figure>`;
const row = (url, frames) => `<h2>${url}</h2><div class="r">${frames.map(cell).join('')}</div>`;

async function sheet(browser, html, file) {
  const page = await browser.newPage({ viewport: { width: 2600, height: 800 } });
  await page.setContent(`<style>body{margin:0;padding:10px;background:#1b1b1b;color:#ddd;font:15px system-ui}h2{font-size:15px;margin:14px 0 6px}
    .r{display:grid;grid-template-columns:repeat(5,1fr) .42fr;gap:6px;align-items:start}.m{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}figure{margin:0}img{width:100%;display:block}
    figcaption{padding:3px 0;font-size:13px;color:#aaa}</style>${html}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: file, type: 'jpeg', quality: 78, fullPage: true });
  await page.close();
}

(async () => {
  const { chromium } = loadPlaywright();
  const launch = () => chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const results = await Promise.all(urls.map(async (url) => {
    const browser = await launch();
    const r = await limit(capture(browser, url).catch((e) => ({ error: e.message.split('\n')[0] })), 120000, { error: 'gave up after 120 seconds' });
    await limit(browser.close(), 5000);
    return r;
  }));
  const browser = await launch();
  const rows = [];
  for (const [i, url] of urls.entries()) {
    const r = results[i];
    if (r.error) { console.log(`${url}\n  FAILED: ${r.error}`); continue; }
    const file = path.join(out, `hero-${slug(url)}.jpg`);
    await sheet(browser, row(url, r), file);
    rows.push(row(url, r));
    console.log(`${url}\n  ${file}`);
    if (motion) {
      const m = await limit(captureMotion(browser, url).catch((e) => ({ error: e.message.split('\n')[0] })), 120000, { error: 'gave up after 120 seconds' });
      if (m.error) console.log(`  motion FAILED: ${m.error}`);
      else { const mf = path.join(out, `motion-${slug(url)}.jpg`); await sheet(browser, motionHtml(url, m), mf); console.log(`  motion: ${mf}`); }
    }
    const still = Math.abs(r[0].shot.length - r[3].shot.length) < r[0].shot.length * 0.01;
    if (still) console.log('  NOTE: the first and last frames look the same. Either the hero is static, or a gate or intro (click, bounce, hold) is in front: get past it by hand and judge the hero, not the gate.');
  }
  if (rows.length) {
    await sheet(browser, rows.join(''), path.join(out, 'hero-all.jpg'));
    console.log(`side by side: ${path.join(out, 'hero-all.jpg')}`);
  }
  await limit(browser.close(), 5000);
  process.exit(0);
})();
