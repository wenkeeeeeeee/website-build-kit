// Make the share preview for every variant: a 1200x630 image of its hero, linked by full https address.
//
//   node og-images.cjs <project> <preview url> <live url>
//
// Writes site/assets/og.jpg per variant and points every page's og:image at it, plus the hub at the first variant.
// Run it just before export-site.py, with the preview server up. WhatsApp shows nothing for a relative address.
const path = require('path');
const fs = require('fs');

function loadPlaywright() {
  for (const base of [__dirname, process.cwd(), path.join(process.cwd(), 'tools')]) {
    try { return require(require.resolve('playwright', { paths: [base] })); } catch { /* next */ }
  }
  console.error('Playwright not found. Run: npm i -D playwright   (in tools/web or the project)');
  process.exit(1);
}

const [project, preview, live] = process.argv.slice(2).map((a) => a.replace(/\/$/, ''));
if (!live) { console.error('Usage: node og-images.cjs <project> <preview url> <live url>'); process.exit(1); }
const TAG = /<meta property="og:image"[^>]*>/;

function setImage(file, image, title) {
  let html = fs.readFileSync(file, 'utf8');
  const tag = `<meta property="og:image" content="${image}">`;
  if (TAG.test(html)) html = html.replace(TAG, tag);
  else html = html.replace('</head>', `${title ? `<meta property="og:title" content="${title}">\n` : ''}${tag}\n</head>`);
  fs.writeFileSync(file, html);
}

(async () => {
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
  const root = path.join(project, 'variants');
  const names = fs.readdirSync(root).filter((n) => /^\d\d-/.test(n) && fs.existsSync(path.join(root, n, 'site')));
  for (const name of names) {
    const site = path.join(root, name, 'site');
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(`${preview}/variants/${name}/site/`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    fs.mkdirSync(path.join(site, 'assets'), { recursive: true });
    await page.screenshot({ path: path.join(site, 'assets', 'og.jpg'), type: 'jpeg', quality: 80 });
    await page.close();
    const image = `${live}/variants/${name}/site/assets/og.jpg`;
    for (const f of fs.readdirSync(site).filter((x) => x.endsWith('.html'))) setImage(path.join(site, f), image);
    console.log(name, image);
  }
  const hub = path.join(project, 'index.html');
  const title = (fs.readFileSync(hub, 'utf8').match(/<title>([^<]*)<\/title>/) || [])[1];
  setImage(hub, `${live}/variants/${names[0]}/site/assets/og.jpg`, title);
  await browser.close();
  process.exit(0);
})();
