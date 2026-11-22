Adapted from MotionSites type-and-text-motion.md #13 (MIT).

# Count-up numbers & counter preloader

Real numbers roll up from zero when their row comes into view, each slightly later and longer than the last (proof
bars, below-hero facts, a single big figure). Plus a short counter opening: 000 -> 100 in huge numerals with the
client's own words cycling, then the hero entrance plays.

**Needs:** real client numbers (years, branches, orders, customers served). Drop an unconfirmed number or tag it
`[client to confirm]`. In the hero, numbers never lead: at most one small line.

## Parameters
- easeOutCubic `1 - (1 - t)^3`. In a row: duration `1500 + i x 80` ms, delay `480 + i x 90` ms, so counting starts as
  the row's entrance lands. Single big figure: 2 s.
- IntersectionObserver threshold 0.25, once. `font-variant-numeric: tabular-nums`; fixed decimals; prefix/suffix
  (`+`, `%`, `km`, `/7`) outside the animated digits.
- The **final value is in the HTML**, so no-JS users, crawlers and reduced-motion users see real numbers; JS resets to 0
  just before animating.
- Compact proof bar: icon, value `clamp(18px, 2.2vw, 26px)` `-.025em`, label `clamp(11px, 1.2vw, 12.5px)` in
  `--muted`; 4 columns, 2x2 at ≤720px.
- Big figure: `clamp(48px, 10vw, 96px)`, weight 300, `-.04em`, lh 1; label 13-15px, `margin-top:16px`; columns
  stagger 0.15 s.

## Code: count-up
```html
<!-- values from content JSON (e.g. content/stats.json) -->
<div class="stats-grid" data-count-group>
  <div class="stat"><span class="stat-val" data-count="[placeholder]" data-from="stats.years" data-suffix="">[placeholder]</span><span class="stat-label">[placeholder: label]</span></div>
  <div class="stat"><span class="stat-val" data-count="[placeholder]" data-from="stats.branches">[placeholder]</span><span class="stat-label">[placeholder: label]</span></div>
  <div class="stat"><span class="stat-val" data-count="[placeholder]" data-decimals="1" data-from="stats.rating">[placeholder]</span><span class="stat-label">[placeholder: label]</span></div>
</div>
```
```css
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:920px;margin:0 auto;text-align:center}
.stat{display:flex;flex-direction:column;align-items:center;gap:6px}
.stat-val{font:clamp(18px,2.2vw,26px) var(--font-display);letter-spacing:-.025em;color:var(--ink);font-variant-numeric:tabular-nums}
.stat-label{font:clamp(11px,1.2vw,12.5px) var(--font-body);color:var(--muted)}
.stat-big{font:300 clamp(48px,10vw,96px)/1 var(--font-display);letter-spacing:-.04em;font-variant-numeric:tabular-nums}
@media (max-width:720px){.stats-grid{grid-template-columns:repeat(2,1fr)}}
```
```js
function countUp(el, { duration = 2000, delay = 0 } = {}) {
  const to = parseFloat(el.dataset.count), dec = +(el.dataset.decimals || 0);
  if (!isFinite(to)) return;                                   // placeholder not filled: leave the text alone
  const nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const fmt = (v) => (el.dataset.prefix || '') + nf.format(v) + (el.dataset.suffix || '');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = fmt(to); return; }
  el.textContent = fmt(0);
  setTimeout(() => {
    const t0 = performance.now();
    requestAnimationFrame(function f(now) {
      const t = Math.min(1, (now - t0) / duration);
      el.textContent = fmt(to * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(f);
    });
  }, delay);
}
const countIO = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  countIO.unobserve(e.target);
  if (e.target.hasAttribute('data-count-group')) {
    e.target.querySelectorAll('[data-count]').forEach((el, i) => countUp(el, { duration: 1500 + i * 80, delay: 480 + i * 90 }));
  } else countUp(e.target);
}), { threshold: 0.25 });
document.querySelectorAll('[data-count-group], [data-count]:not([data-count-group] [data-count])').forEach((el) => countIO.observe(el));
```

## Code: counter preloader
Prefer the client's object or logo as the opening; use a counter only when numbers suit the concept. It must never
block: it tracks real loading (hero poster decoded, fonts ready), is capped so the hero shows within 3 s, can be
skipped by click, key, wheel or touch, and shows once per session. Decide "seen" in an inline `<head>` script so the
loader never flashes on repeat visits:
```html
<script>try{if(sessionStorage.getItem('intro-seen')==='1')document.documentElement.classList.add('intro-seen')}catch(e){}</script>
```
```html
<div class="loader" role="status" aria-label="Loading">
  <span class="loader__word">[placeholder: client word 1]</span>
  <span class="loader__count">000</span>
  <div class="loader__bar"><i></i></div>
</div>
```
```css
.intro-seen .loader{display:none}
.loader{position:fixed;inset:0;z-index:9999;background:var(--bg);color:var(--ink);transition:opacity .6s var(--ease-out),visibility .6s}
.loader.is-done{opacity:0;visibility:hidden}
.loader__word{position:absolute;inset:0;display:grid;place-items:center;font:400 clamp(2.25rem,6vw,4.5rem)/1 var(--font-display)}
.loader__count{position:absolute;right:5vw;bottom:6vh;font:400 clamp(3.75rem,10vw,8rem)/1 var(--font-display);font-variant-numeric:tabular-nums}
.loader__bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--line)}
.loader__bar i{display:block;height:100%;transform-origin:left;transform:scaleX(0);background:var(--accent)}
```
```js
function swapWord(el, text) {                         // exit up, enter from below
  const out = el.animate([{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-20px)' }],
    { duration: 250, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });   // --ease-in-out
  out.onfinish = () => {
    el.textContent = text; out.cancel();
    el.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 350, easing: 'cubic-bezier(.16,1,.3,1)' });                    // --ease-out
  };
}
// words: the client's own words from content data (products, places), never slogans
function runLoader(onDone, { words = [], every = 700, max = 2200, ready } = {}) {
  const el = document.querySelector('.loader');
  if (!el) return onDone && onDone();
  const count = el.querySelector('.loader__count'), bar = el.querySelector('.loader__bar i'), word = el.querySelector('.loader__word');
  let done = false, loaded = false;
  const finish = () => {
    if (done) return; done = true;
    el.classList.add('is-done'); onDone && onDone(); setTimeout(() => el.remove(), 700);
    ['click', 'keydown', 'wheel', 'touchstart'].forEach((t) => removeEventListener(t, finish));
  };
  try { sessionStorage.setItem('intro-seen', '1'); } catch {}
  if (document.documentElement.classList.contains('intro-seen') || matchMedia('(prefers-reduced-motion: reduce)').matches) return finish();
  ['click', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, finish, { passive: true }));
  (ready || Promise.resolve()).then(() => { loaded = true; });
  let w = 0;
  const wid = words.length > 1 ? setInterval(() => { w = (w + 1) % words.length; swapWord(word, words[w]); }, every) : 0;
  const t0 = performance.now();
  requestAnimationFrame(function f(now) {
    if (done) return clearInterval(wid);
    const t = (now - t0) / max;
    const p = loaded ? Math.min(1, t * 1.6) : Math.min(.9, t);   // runs ahead once loaded; never waits past max
    count.textContent = String(Math.round(p * 100)).padStart(3, '0');
    bar.style.transform = `scaleX(${p})`;
    if (p < 1 && t < 1) requestAnimationFrame(f);
    else { clearInterval(wid); setTimeout(finish, 200); }
  });
}
const poster = document.querySelector('.hero img, .hero video');
const ready = Promise.all([document.fonts.ready, poster && poster.decode ? poster.decode().catch(() => {}) : null]);
runLoader(() => document.documentElement.classList.add('hero-go'), { words: CONTENT.loaderWords, ready });
```
Gate hero entrances on `.hero-go` (e.g. `.hero-go .in-rise{animation-play-state:running}`) so they play after the
loader, not behind it. Better: land the last number or word exactly on its twin in the hero.

**Phone:** count-up works as is. Keep the loader under 2 s on phones; drop it if the hero is already ready.

**Reduced motion:** numbers show their final value at once; the loader is skipped.
