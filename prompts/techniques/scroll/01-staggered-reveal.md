Adapted from MotionSites scroll.md #1 (MIT).

# Viewport-triggered staggered reveal (+ corner objects)

Blocks below the hero fade and rise once as they enter the viewport, with per-item delays so a group cascades. The
corner version frames a centred heading with four of the client's cut-outs sliding in toward the corners. A supporting
move only: a reveal alone is not motion with a job, and sections that only fade up read as basic. Pair it with the
section's real motion graphic and a designed join.

**Needs:** nothing for the plain reveal; four clean cut-outs of the client's objects for the corner version.

## Parameters
- Default: `opacity 0, y 30px` to rest, **0.7s**, `var(--ease-out)`, once. Large headings y 40px; media blocks y 60px,
  0.9s; two-column splits from `x -40px` / `x +40px`; card grids `scale(.95)` plus fade.
- Trigger: IntersectionObserver `threshold .15`, `rootMargin: 0px 0px -10% 0px` (the reader sees it happen). Eager:
  `threshold 0`, `rootMargin 50px`.
- Stagger `base + i x step`: list `150 + i*120ms`, panel rows `300 + i*110ms`, nav links `100 + i*100ms`, stat
  columns `i*150ms` (y 30, 0.8s), grid cards `i*100ms` (y 20, 0.7s). Keep a group's whole cascade within 0.6-1s.
- Corner objects: `x +-80px`, 0.9s, delays .10 / .15 / .25 / .30s; sizes 120 to 210px by breakpoint.
- Hide targets only when JS runs (`.js` on `<html>`), so content never vanishes if a script fails.
- `threshold` is a fraction of the element: a block taller than about 6.6 viewports never reaches 0.15; use
  `threshold: 0` plus `rootMargin` for very tall blocks.
- Never start a reveal from `clip-path: inset(0 0 100% 0)`: it has no visible area and never fires the observer. Leave
  a 2px strip.
- Never put `overflow:hidden` on an ancestor of a sticky element; use `overflow-x:clip`.

## Code
```html
<script>document.documentElement.classList.add('js')</script> <!-- in <head> -->
<ul data-stagger="120" data-stagger-base="150">
  <li data-reveal>…</li><li data-reveal>…</li><li data-reveal>…</li>
</ul>
<section class="about">
  <img class="decor decor--tl" data-reveal style="--x:-80px;--y:0px;--dur:.9s;--d:.10s" src="images/cutout-1.webp" alt="">
  <img class="decor decor--tr" data-reveal style="--x:80px;--y:0px;--dur:.9s;--d:.15s" src="images/cutout-2.webp" alt="">
  <img class="decor decor--bl" data-reveal style="--x:-80px;--y:0px;--dur:.9s;--d:.25s" src="images/cutout-3.webp" alt="">
  <img class="decor decor--br" data-reveal style="--x:80px;--y:0px;--dur:.9s;--d:.30s" src="images/cutout-4.webp" alt="">
  <h2 data-reveal style="--y:40px">About</h2>
</section>
```
```css
.js [data-reveal]{opacity:0;transform:translate3d(var(--x,0px),var(--y,30px),0);
  transition:opacity var(--dur,.7s) var(--ease-out) var(--d,0s),
             transform var(--dur,.7s) var(--ease-out) var(--d,0s)}
.js [data-reveal="scale"]{transform:scale(.95)}
.js [data-reveal].is-in{opacity:1;transform:none}
.about{position:relative;min-height:100vh;display:grid;place-items:center;padding:10vh 20px;overflow-x:clip;
  background:var(--bg);color:var(--ink)}
.about h2{font-family:var(--font-display)}
.decor{position:absolute;width:clamp(120px,14vw,210px);height:auto;pointer-events:none}
.decor--tl{top:4%;left:clamp(1%,2vw,4%)} .decor--tr{top:4%;right:clamp(1%,2vw,4%)}
.decor--bl{bottom:8%;left:clamp(3%,5vw,10%);width:clamp(100px,12vw,180px)}
.decor--br{bottom:8%;right:clamp(3%,5vw,10%);width:clamp(130px,15vw,220px)}
@media (prefers-reduced-motion:reduce){.js [data-reveal]{opacity:1;transform:none;transition:none}}
```
```js
document.querySelectorAll('[data-stagger]').forEach((group) => {
  const step = +group.dataset.stagger, base = +(group.dataset.staggerBase || 0);
  group.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--d', `${base + i * step}ms`));
});
const revealIO = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => revealIO.observe(el));
```

**Phone:** works as is. Shrink corner objects (the clamp does it) and keep them off the heading and buttons; drop the
bottom pair if they crowd the copy.

**Reduced motion:** everything shows at rest, no transition.
