Adapted from MotionSites depth-and-interaction.md #4 (MIT).

# Cursor-following spotlight reveal mask

Two aligned full-bleed images (outside/inside, before/after, day/night, raw/finished); a soft circle trailing the
cursor reveals the second. A "look inside" moment for heroes that explain how something works. The revealed image must
be the point, not decoration.

**Needs:** two aligned images of the same framing (a real photo pair, or a photo plus a matching drawn/rendered layer).

## Parameters
- Radius **260px**; cursor smoothing **lerp 0.1** per frame (the lag makes it feel physical).
- Feathered mask stops: `0 -> 1`, `.4 -> 1`, `.6 -> .75`, `.75 -> .4`, `.88 -> .12`, `1 -> 0`.
- Starts off-screen (`-999px`), then snaps to the first pointer position (no fly-in). The radius eases to 0 on pointer
  leave via an animatable `@property` (Chrome/Edge, Safari 16.4+, Firefox 128+; elsewhere it snaps).
- Base image settles `scale(1.12 -> 1)` over 1.8s `var(--ease-out)`, only when the source is at least 1.2x its display
  size. The heading has `pointer-events:none` so it never blocks the reveal.
- A CSS `radial-gradient` mask on custom properties is far cheaper than a canvas mask every frame.
- Keep the headline off the busiest part of the reveal image (no words over busy images).

## Code
```html
<section class="spot">
  <div class="spot__base"   style="background-image:url(img/web/outside.webp)"></div>
  <div class="spot__reveal" style="background-image:url(img/web/inside.webp)"></div>
  <div class="spot__content">...</div>
</section>
```
```css
@property --spot-r{syntax:'<length>';inherits:true;initial-value:0px}
.spot{position:relative;height:100vh;height:100dvh;overflow:hidden;background:var(--bg);
  --x:-999px;--y:-999px;--spot-r:0px;transition:--spot-r .45s var(--ease-out)}
.spot.is-lit{--spot-r:260px}
.spot__base,.spot__reveal{position:absolute;inset:0;background-position:center;background-size:cover;background-repeat:no-repeat}
.spot__base{z-index:1;animation:spot-settle 1.8s var(--ease-out) both}
.spot__reveal{z-index:3;pointer-events:none;
  -webkit-mask-image:radial-gradient(circle var(--spot-r) at var(--x) var(--y),#000 0%,#000 40%,rgba(0,0,0,.75) 60%,rgba(0,0,0,.4) 75%,rgba(0,0,0,.12) 88%,transparent 100%);
          mask-image:radial-gradient(circle var(--spot-r) at var(--x) var(--y),#000 0%,#000 40%,rgba(0,0,0,.75) 60%,rgba(0,0,0,.4) 75%,rgba(0,0,0,.12) 88%,transparent 100%);
  -webkit-mask-repeat:no-repeat;mask-repeat:no-repeat}
.spot__content{position:relative;z-index:5;height:100%;pointer-events:none}
.spot__content a,.spot__content button{pointer-events:auto}
@keyframes spot-settle{from{transform:scale(1.12)}to{transform:scale(1)}}
@media (hover:none){.spot{touch-action:pan-y}.spot.is-lit{--spot-r:160px}}
@media (prefers-reduced-motion:reduce){.spot__base{animation:none}}
```
(The `#000`/`rgba(0,0,0,x)` values are mask alpha, not colours.)
```js
(() => {
  const spot = document.querySelector('.spot');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let tx = 0, ty = 0, sx = 0, sy = 0, seeded = false, raf = 0;
  const loop = () => {
    const k = reduce ? 1 : 0.1;
    sx += (tx - sx) * k; sy += (ty - sy) * k;
    spot.style.setProperty('--x', sx.toFixed(1) + 'px');
    spot.style.setProperty('--y', sy.toFixed(1) + 'px');
    raf = (Math.abs(tx - sx) > 0.1 || Math.abs(ty - sy) > 0.1) ? requestAnimationFrame(loop) : 0;
  };
  const setTarget = (x, y) => {
    tx = x; ty = y;
    if (!seeded) { sx = x; sy = y; seeded = true; }    // no fly-in from off-screen
    spot.classList.add('is-lit');
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const local = (e) => { const r = spot.getBoundingClientRect(); setTarget(e.clientX - r.left, e.clientY - r.top); };

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    spot.addEventListener('pointermove', local);
    spot.addEventListener('pointerleave', () => spot.classList.remove('is-lit'));
  } else {
    // Touch: the spotlight sweeps with scroll; a tap or drag moves it to the finger.
    const fromScroll = () => {
      const r = spot.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
      setTarget(r.width * (0.2 + 0.6 * p), r.height * 0.55);
    };
    addEventListener('scroll', fromScroll, { passive: true });
    spot.addEventListener('pointerdown', local);
    spot.addEventListener('pointermove', (e) => { if (e.buttons) local(e); });
    fromScroll();
  }
})();
```
**Phone:** a smaller spotlight (160px) sweeps across with scroll; a tap or drag moves it to the finger. Vertical page
scroll still works (`touch-action:pan-y`).

**Reduced motion:** no settle zoom and no trailing lag; the spotlight jumps straight to the pointer or scroll position.
If the hidden image carries information, also show it plainly below as a small side-by-side pair.
