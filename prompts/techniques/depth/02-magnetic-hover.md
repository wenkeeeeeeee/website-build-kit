Adapted from MotionSites depth-and-interaction.md #2 (MIT).

# Magnetic hover

When the cursor comes within a generous radius, an element (product cut-out, main CTA, logo) eases toward it by a
fraction of the distance, then floats back slowly when the cursor leaves. It adds weight and life. Use it on the hero
subject or the primary button, not on everything.

**Needs:** nothing (works best on a cut-out of the client's product).

## Parameters
- Activation zone: the element's box plus 150px (40-80px for buttons).
- Strength 3: the element moves 1/3 of the cursor's offset from its centre (2-4 is the sweet spot).
- Asymmetric easing: `transform .3s var(--ease-out)` while tracking, `.6s var(--ease-in-out)` on release. The return is
  slower than the pull.
- Measure the untransformed wrapper, move an inner element, or the moving box feeds back into its own measurement.
  Positioning transforms (like centring with `translateX(-50%)`) belong on the wrapper.
- `translate3d` + `will-change:transform`; fine pointers with motion allowed only.

## Code
```html
<div class="magnet" data-padding="150" data-strength="3"><img class="magnet-inner" src="img/cutout/product.webp" alt="Product name"></div>
```
```js
function magnet(wrap, { padding = 150, strength = 3 } = {}) {
  const inner = wrap.firstElementChild;
  if (!matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
    return touchPress(wrap, inner);
  }
  inner.style.willChange = 'transform';
  let active = false, raf = 0, mx = 0, my = 0;
  const update = () => {
    raf = 0;
    const r = wrap.getBoundingClientRect();          // wrapper is never transformed
    const dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
    const inside = Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding;
    if (inside) {
      if (!active) { active = true; inner.style.transition = 'transform .3s var(--ease-out)'; }
      inner.style.transform = `translate3d(${dx / strength}px, ${dy / strength}px, 0)`;
    } else if (active) {
      active = false;
      inner.style.transition = 'transform .6s var(--ease-in-out)';
      inner.style.transform = 'translate3d(0,0,0)';
    }
  };
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
}

// Touch: the element leans a little toward the finger on press and settles back on release.
function touchPress(wrap, inner) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  wrap.addEventListener('pointerdown', (e) => {
    const r = wrap.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / 8, dy = (e.clientY - (r.top + r.height / 2)) / 8;
    inner.style.transition = 'transform .2s var(--ease-out)';
    inner.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(.97)`;
  });
  const release = () => { inner.style.transition = 'transform .6s var(--ease-in-out)'; inner.style.transform = ''; };
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => wrap.addEventListener(t, release));
}

document.querySelectorAll('.magnet').forEach((el) => magnet(el, { padding: +el.dataset.padding || 150, strength: +el.dataset.strength || 3 }));
```

**Phone:** give a lighter version that keeps the idea. The code above leans the element toward the finger on press and
lets it settle back, so a tap still feels weighted. A hero subject can also keep a slow idle drift at rest.

**Reduced motion:** no pull and no lean; the element stays in place.
