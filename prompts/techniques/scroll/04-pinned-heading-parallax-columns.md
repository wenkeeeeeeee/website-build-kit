Adapted from MotionSites scroll.md #4 (MIT).

# Pinned heading with counter-drifting photo columns (+ single-element parallax)

A heading stays pinned in the centre for about two screens while two columns of tilted square photos pass on either
side, one faster than the page, one slower. Also included: one photo drifting against the scroll beside a quote.

**Needs:** 6+ sharp square client photos (work, dishes, rooms, products); one portrait for the single-element version.

## Parameters
- Section `min-height: 300vh`; pinned layer `sticky; top:0; height:100vh` underneath (z 1); columns over it (z 2).
- Columns run in the outer tracks of a 3-track grid (`1fr min(40vw,560px) 1fr`) so photos pass beside the heading,
  never over it.
- Cards `aspect-ratio 1`, `max-width 320px`, `rotate -4deg / +3deg`, shadow `0 30px 60px` in
  `color-mix(in srgb, var(--ink) 35%, transparent)`, radius 20px. Give the boxes the client's shape or crop where it
  fits.
- Column speeds `-0.6` (rises faster) and `0.3` (lags), applied as `(progress - 0.5) * speed * innerHeight`.
- Single-element parallax: `offset = clamp(-(elementCentre - viewportCentre) * 0.2, -200px, 200px)`, measured on the
  untransformed parent.
- No eyebrow label and no italic accent word in the heading.

## Code
```html
<section class="pp">
  <div class="pp__pin"><h2>Heading from the content data</h2></div>
  <div class="pp__cols">
    <div class="pp__col" data-speed="-0.6"><figure class="pp__card"><img src="images/w1.webp" alt="…"></figure><!-- ×3 --></div>
    <div class="pp__col" data-speed="0.3"><figure class="pp__card"><img src="images/w4.webp" alt="…"></figure><!-- ×3 --></div>
  </div>
</section>
<!-- GSAP + ScrollTrigger from npm or a local copy -->
<script src="js/vendor/gsap.min.js"></script>
<script src="js/vendor/ScrollTrigger.min.js"></script>
```
```css
.pp{position:relative;min-height:300vh;background:var(--bg);color:var(--ink)}
.pp__pin{position:sticky;top:0;height:100vh;display:grid;place-items:center;text-align:center;z-index:1}
.pp__pin h2{max-width:min(40vw,560px);font-family:var(--font-display)}
.pp__cols{position:absolute;inset:0;z-index:2;display:grid;grid-template-columns:1fr min(40vw,560px) 1fr;
  max-width:1400px;margin:0 auto;padding:30vh 24px;pointer-events:none}
.pp__col{display:flex;flex-direction:column;gap:30vh;will-change:transform}
.pp__col:nth-child(1){grid-column:1}
.pp__col:nth-child(2){grid-column:3;padding-top:40vh}
.pp__col:nth-child(1) .pp__card{margin-left:auto}
.pp__card{pointer-events:auto;aspect-ratio:1;width:100%;max-width:320px;margin:0;border-radius:20px;overflow:hidden;
  box-shadow:0 30px 60px color-mix(in srgb,var(--ink) 35%,transparent)}
.pp__card:nth-child(odd){rotate:-4deg}
.pp__card:nth-child(even){rotate:3deg}
.pp__card img{width:100%;height:100%;object-fit:cover}
@media (max-width:640px){
  .pp{min-height:auto}
  .pp__pin{position:relative;height:auto;padding:12vh 20px 4vh}
  .pp__pin h2{max-width:none}
  .pp__cols{position:relative;inset:auto;grid-template-columns:1fr 1fr;gap:16px;padding:0 16px 10vh}
  .pp__col:nth-child(2){grid-column:2;padding-top:12vh}
  .pp__col{gap:16px}
}
```
```js
gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mm = gsap.matchMedia();
mm.add('(min-width: 641px)', () => {
  if (reduce) return;
  document.querySelectorAll('.pp__col').forEach((col) => {
    const s = parseFloat(col.dataset.speed);
    gsap.fromTo(col, { y: () => -0.5 * s * innerHeight }, {
      y: () => 0.5 * s * innerHeight, ease: 'none',
      scrollTrigger: { trigger: '.pp', start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
    });   // scrub 0.8 eases toward the scroll target
  });
});
// Phone: half-speed drift on the two-up stack, no pin
mm.add('(max-width: 640px)', () => {
  if (reduce) return;
  gsap.to('.pp__col:nth-child(2)', { y: () => -0.15 * innerHeight, ease: 'none',
    scrollTrigger: { trigger: '.pp', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
});

// Single-element parallax: <div class="parallax-frame"><img data-parallax="0.2" …></div>
(() => {
  const items = [...document.querySelectorAll('[data-parallax]')];
  if (!items.length || reduce) return;
  const cur = new Map(items.map((el) => [el, 0]));
  let raf = 0;
  const update = () => {
    raf = 0; let busy = false;
    items.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const delta = r.top + r.height / 2 - innerHeight / 2;
      const target = Math.max(-200, Math.min(200, -delta * parseFloat(el.dataset.parallax)));
      const y = cur.get(el) + (target - cur.get(el)) * 0.12;            // ease toward target
      cur.set(el, y); if (Math.abs(target - y) > 0.1) busy = true;
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    });
    if (busy) raf = requestAnimationFrame(update);
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
  update();
})();
```
With Lenis, share one clock: `lenis.on('scroll', ScrollTrigger.update)` and drive `lenis.raf` from `gsap.ticker`.

**Phone:** no pin. The heading comes first, then a two-up tilted stack where the right column drifts at half speed.

**Reduced motion:** columns and the portrait sit still; the heading still pins on desktop.
