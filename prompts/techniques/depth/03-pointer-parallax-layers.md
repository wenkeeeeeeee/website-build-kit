Adapted from MotionSites depth-and-interaction.md #3 (MIT).

# Pointer parallax depth layers

Stacked transparent layers drift with or against the pointer by different amounts, giving a still photo real depth.
Cheap and subtle; good when the client has few photos but clean cut-outs (motion.md, "Layered depth").

**Needs:** layered cut-outs: a backdrop plus 1-2 cut-out layers (subject, foreground) with clean edges.

## Parameters
- Normalised pointer `[-0.5, 0.5]`, eased with **lerp 0.12** per frame; the loop stops once settled.
- Depths (px per unit of pointer): far backdrop **-12 x / -4 y** (moves against the cursor), subject **+18 / +8**,
  foreground **+22 / +10**. Vertical is about 0.35-0.45x horizontal: horizontal parallax reads stronger, vertical motion
  feels seasick.
- Overscan every layer (`inset:-4%`, 108% size) so edges never show. Only when the source is at least 1.2x its display
  size, so the overscan doesn't soften the photo.

## Code
```html
<div class="px-scene">
  <img class="px-layer" style="--dx:-12;--dy:-4" src="img/web/backdrop.webp" alt="">
  <img class="px-layer" style="--dx:18;--dy:8"   src="img/cutout/subject.webp" alt="Product name">
  <img class="px-layer" style="--dx:22;--dy:10"  src="img/cutout/foreground.webp" alt="">
</div>
```
```css
.px-scene{position:relative;height:100vh;height:100dvh;overflow:hidden;--mx:0;--my:0}
.px-layer{position:absolute;inset:-4%;width:108%;height:108%;object-fit:cover;pointer-events:none;will-change:transform;
  transform:translate3d(calc(var(--mx) * var(--dx) * 1px),calc(var(--my) * var(--dy) * 1px),0)}
```
```js
(() => {
  const scene = document.querySelector('.px-scene');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
  const loop = () => {
    x += (tx - x) * 0.12; y += (ty - y) * 0.12;
    scene.style.setProperty('--mx', x.toFixed(4)); scene.style.setProperty('--my', y.toFixed(4));
    raf = (Math.abs(tx - x) > 0.0005 || Math.abs(ty - y) > 0.0005) ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  if (fine) {
    addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; kick(); }, { passive: true });
  } else {
    // Touch: the layers separate as the scene scrolls through the screen (vertical only, gentle).
    addEventListener('scroll', () => {
      const r = scene.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - (r.bottom / (innerHeight + r.height))));  // 0 entering, 1 leaving
      tx = 0; ty = (p - 0.5) * 1.6;
      kick();
    }, { passive: true });
  }
})();
```

**Phone:** give a lighter version that keeps the idea. The code above swaps the pointer for scroll position: layers
part vertically as the scene passes, still eased. Keep the phone scene short (one screen, no pinning).

**Reduced motion:** the layers stay still at their resting place; the photo is complete as is.
