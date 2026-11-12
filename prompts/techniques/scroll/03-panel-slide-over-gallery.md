Adapted from MotionSites scroll.md #3 (MIT).

# Panel slide-over + scattered growing gallery + blend outro

A full-bleed hero stays sticky while a dark panel slides up over it, carrying a sparse, asymmetric grid of tall images
that grow toward the page centre as they enter and shrink as they leave. At the end a light veil fades over everything
and a giant pill button scales in from the corner. Fixed UI stays legible through exclusion blending
(`depth/06-exclusion-blend-ui.md`). Suits many tall photos: fashion, archive, portfolio, menu.

**Needs:** about 8-12 tall (2:3) client photos, sharp at their display size, and a hero still or film.

## Parameters
- Panel top padding `40vh`; it slides over the sticky hero for the first 100vh.
- Columns 2 / 3 / 4 at `<640 / <1024 / >=1024px`; cells `aspect-ratio: 2/3`.
- Scatter rule per row `r`: primary column `a = (2r + r mod 2) mod cols`; every 3rd row adds a second image at
  `(a + 2) mod cols` (or `a + 1` if equal); other cells stay empty.
- Scale per frame: enter `min(1, (vh - top) / (0.6*vh))`, exit `min(1, bottom / (0.4*vh))`, `scale = min(enter, exit)`,
  0 off screen. Left-half cards `transform-origin: right bottom`, right-half `left bottom`.
- Outro over one screen: veil `opacity 0 to 1`; button `scale(0 to 1)` from `right bottom`; pill radius 1335px, desktop
  330 x 174px, label 110px (72px phone), `-.04em`. The label is the variant's main action (e.g. the WhatsApp order),
  not a generic "view".
- Exclusion needs near-white on near-black: the button stays `--blend-light` (default `#fff`) whatever the palette,
  reading light-on-dark over the panel and dark-on-light over the veil. Where that clashes with the palette, use two
  plain button states keyed to the veil progress instead.
- Measure the cell, scale the image (`getBoundingClientRect()` includes transforms).
- With Lenis the direct scroll mapping is already eased. Without it, lerp each value every frame
  (`cur += (target - cur) * .12`).

## Code
```html
<section class="pg-hero">
  <!-- hero film served as in video/01 (poster, 1280/1920 sources, preload="auto"); a still works too -->
  <video src="video/hero-1920.mp4" poster="images/hero-poster.webp" autoplay muted playsinline preload="auto" aria-hidden="true"></video>
</section>
<section class="pg-panel"><div class="pg-grid" id="pgGrid"></div></section>
<section class="pg-outro" aria-label="End"></section>
<div class="pg-veil" aria-hidden="true"></div>
<a class="pg-cta" href="#order"><span>order</span></a>
```
```css
.pg-hero{position:sticky;top:0;height:100vh;height:100svh;z-index:0;overflow:hidden}
.pg-hero video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.pg-panel{position:relative;z-index:10;background:var(--ink);padding-top:40vh;min-height:100vh}
.pg-grid{display:grid;grid-template-columns:repeat(var(--cols,4),1fr)}
.pg-cell{aspect-ratio:2/3}
.pg-card{display:block;width:100%;height:100%;object-fit:cover;transform:scale(0);will-change:transform}
.pg-outro{position:relative;z-index:10;height:100vh;background:var(--ink)}
.pg-veil{position:fixed;inset:0;z-index:12;background:var(--bg);opacity:0;pointer-events:none} /* keep below the sticky header */
.pg-cta{position:fixed;right:32px;bottom:32px;z-index:20;width:330px;height:174px;border-radius:1335px;
  background:var(--blend-light,#fff);display:flex;align-items:center;justify-content:center;
  transform:scale(0);transform-origin:right bottom;mix-blend-mode:exclusion;text-decoration:none;pointer-events:none}
.pg-cta span{color:var(--blend-light,#fff);mix-blend-mode:exclusion;font:500 110px/1 var(--font-display);letter-spacing:-.04em}
@media (max-width:640px){.pg-cta{left:16px;right:16px;bottom:60px;width:auto;height:100px}.pg-cta span{font-size:72px}}
```
```js
(() => {
  const IMAGES = ['images/p1.webp', 'images/p2.webp', 'images/p3.webp' /* … ~10, from content data */];
  const grid = document.getElementById('pgGrid');
  const veil = document.querySelector('.pg-veil'), cta = document.querySelector('.pg-cta');
  const outro = document.querySelector('.pg-outro');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cells = [], cols = 0, ticking = false;
  function buildLayout(count, c) {
    const out = []; let placed = 0, r = 0;
    while (placed < count) {
      const row = new Array(c).fill(-1);
      const a = (r * 2 + (r % 2)) % c;
      row[a] = placed++;
      if (r % 3 === 0 && placed < count) { let b = (a + 2) % c; if (b === a) b = (a + 1) % c; row[b] = placed++; }
      out.push(...row); r++;
    }
    return out;
  }
  function render() {
    const c = innerWidth < 640 ? 2 : innerWidth < 1024 ? 3 : 4;
    if (c === cols) return;
    cols = c;
    grid.style.setProperty('--cols', c);
    grid.replaceChildren(...buildLayout(IMAGES.length, c).map((idx, k) => {
      const cell = document.createElement('div'); cell.className = 'pg-cell';
      if (idx >= 0) {
        const img = new Image(); img.src = IMAGES[idx]; img.alt = ''; img.decoding = 'async'; img.loading = 'lazy'; img.className = 'pg-card';
        img.style.transformOrigin = (k % c) < c / 2 ? 'right bottom' : 'left bottom';   // grow toward the centre
        cell.append(img);
      }
      return cell;
    }));
    cells = [...grid.querySelectorAll('.pg-card')].map((img) => [img.parentElement, img]);
  }
  function frame() {
    ticking = false;
    const vh = innerHeight;
    const rects = cells.map(([cell]) => cell.getBoundingClientRect());   // read all…
    cells.forEach(([, img], i) => {                                      // …then write (no layout thrash)
      const r = rects[i];
      let s = reduce ? 1 : 0;
      if (!reduce && r.bottom > 0 && r.top < vh) s = Math.min(1, (vh - r.top) / (vh * 0.6), r.bottom / (vh * 0.4));
      img.style.transform = `scale(${s.toFixed(4)})`;
    });
    const p = Math.min(1, Math.max(0, 1 - outro.getBoundingClientRect().top / vh));
    veil.style.opacity = p.toFixed(3);
    cta.style.transform = `scale(${p.toFixed(4)})`;
    cta.style.pointerEvents = p > 0.9 ? 'auto' : 'none';
  }
  const tick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  render(); frame();
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', () => { render(); tick(); });
})();
```
Pause the hero film once the panel covers it (past 100vh): `film-control.js` (kit) or an IntersectionObserver.

**Phone:** two columns; the button spans the width near the bottom. Works on touch as is. Keep the main action in the
header too, since the outro button only appears at the end.

**Reduced motion:** images sit at full size; the veil and button still follow scroll because the visitor drives them.
