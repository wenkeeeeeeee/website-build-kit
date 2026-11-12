Adapted from MotionSites scroll.md #5 (MIT).

# Sticky stacking cards that scale down

Cards pin near the top one after another. Each new card slides over the last; those underneath shrink slightly with a
sliver of their top edge showing, like a deck being dealt. For 3-5 case studies, products, plans or process steps:
things people compare or follow in order.

**Needs:** 3-5 items, each with a real photo or two and a line of facts from the content data.

## Parameters
- Each card sits in its own sticky slot (`sticky; top:0; height:85vh`), offset `top: i * 28px` so earlier cards peek
  out above. Slot padding-top `max(12vh, header height + 16px)` clears the sticky header.
- Target scale per card `1 - (n - 1 - i) * 0.03` (3 cards: .94, .97, 1), interpolated from 1 at section progress
  `i/n` to the target at progress 1. `transform-origin: top center`.
- Cards: radii 40-60px, a 2px `var(--line)` border on `var(--surface)`, an inner image grid (40% column with two
  stacked images, 60% column with one tall image) at 40-60px radii. Design the box: the client's shape, an unusual
  crop or a product breaking out of the frame, not a plain rounded rectangle.
- Each card must fit one screen at 1536x700 below the header: check with `check-pages.cjs` (kit) or a Playwright
  screenshot.
- The scale eases toward its target each frame, so nothing snaps.

## Code
```html
<section class="stack">
  <div class="stack-slot"><article class="stack-card" style="--i:0">…</article></div>
  <div class="stack-slot"><article class="stack-card" style="--i:1">…</article></div>
  <div class="stack-slot"><article class="stack-card" style="--i:2">…</article></div>
</section>
```
```css
.stack{position:relative;padding-bottom:10vh;background:var(--bg)}
.stack-slot{position:sticky;top:0;height:85vh;display:flex;justify-content:center;align-items:flex-start;
  padding:max(12vh,calc(var(--header-h,64px) + 16px)) 16px 0}
.stack-card{position:relative;top:calc(var(--i) * 28px);width:min(1200px,100%);transform-origin:top center;will-change:transform;
  border-radius:clamp(40px,5vw,60px);border:2px solid var(--line);background:var(--surface);color:var(--ink);
  padding:clamp(16px,2vw,32px)}
.stack-card h3{font-family:var(--font-display)}
.stack-card p{font-family:var(--font-body)}
```
```js
(function stackCards(section) {
  const cards = [...section.querySelectorAll('.stack-card')];
  const n = cards.length;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // keep sticky, skip scaling
  const cur = cards.map(() => 1);
  let raf = 0;
  const update = () => {
    raf = 0; let busy = false;
    const r = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
    cards.forEach((card, i) => {
      const target = 1 - (n - 1 - i) * 0.03;
      const t = Math.min(1, Math.max(0, (p - i / n) / (1 - i / n)));
      const want = 1 + (target - 1) * t;
      cur[i] += (want - cur[i]) * 0.15;                                  // ease toward target
      if (Math.abs(want - cur[i]) > 0.0005) busy = true; else cur[i] = want;
      card.style.transform = `scale(${cur[i].toFixed(4)})`;
    });
    if (busy) raf = requestAnimationFrame(update);
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  update();
})(document.querySelector('.stack'));
```
GSAP version (each card starts scaling as its own slot pins): per card, `gsap.to(card, { scale: target, ease: 'none',
scrollTrigger: { trigger: slots[i], start: 'top top', endTrigger: '.stack', end: 'bottom bottom', scrub: 0.6 } })`.

**Phone:** keep it; it is light. Radii 24-32px, inner images in one column, slot height about 75svh so a card plus
the header fits; 3 cards rather than 5.

**Reduced motion:** cards still stick and stack (the visitor drives it); no scaling.
