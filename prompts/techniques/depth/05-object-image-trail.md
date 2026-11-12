Adapted from MotionSites depth-and-interaction.md #5 (MIT).

# Object image trail

Moving the mouse over a big closing block spawns images of the client's own things at the cursor (dishes, products,
finished jobs, the object cut out), each slightly turned, shrinking and fading away. Use it only when the trail is the
client's object, so it says something (motion.md); a trail of generic thumbnails is decoration and doesn't count.

**Needs:** 4-8 of the client's photos or clean cut-outs of their object, small (about 240px wide webp).

## Parameters
- Spawn at most every **80ms**; random rotation **-10deg...+10deg**; life **1000ms**, ending at `opacity 0, scale(.6)`.
- Images about 200-240px, radius 12px (or none for cut-outs, which read better without a box), soft shadow.
- A large calm container: `padding-block:18vh`, radius 40px, subtle shadow, heading 48 -> 80px. The section still fits
  one screen at 1536x700.
- Position each image with `transform` only (no animated left/top).

## Code
```html
<section class="trail-area">
  <h2 class="trail-area__title">Come and taste it</h2>
  <a class="btn" href="#order">Order on WhatsApp</a>
</section>
```
```css
.trail-area{position:relative;overflow:hidden;padding:18vh 1.5rem;border-radius:40px;background:var(--surface);
  text-align:center;box-shadow:0 4px 16px color-mix(in oklab,var(--ink) 8%,transparent)}
.trail-area>*:not(.trail-img){position:relative;z-index:2}
.trail-area__title{font:400 clamp(48px,6vw,80px)/1 var(--font-display);letter-spacing:-.02em;margin:0 0 3rem;color:var(--ink)}
.trail-img{position:absolute;left:0;top:0;z-index:1;pointer-events:none;border-radius:12px;object-fit:cover;
  box-shadow:0 10px 30px color-mix(in oklab,var(--ink) 15%,transparent)}
.trail-img--cutout{border-radius:0;box-shadow:none;object-fit:contain}
```
```js
function imageTrail(area, srcs, { every = 80, life = 1000, size = 220, cutout = false } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  srcs.forEach((s) => { const i = new Image(); i.src = s; });           // preload
  let last = 0, n = 0;
  const spawn = (x, y, delay = 0) => {
    const img = document.createElement('img');
    img.src = srcs[n++ % srcs.length]; img.alt = ''; img.className = 'trail-img' + (cutout ? ' trail-img--cutout' : '');
    img.style.width = `${size}px`; img.style.aspectRatio = '4 / 3';
    const rot = (Math.random() * 20 - 10).toFixed(1);
    const at = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${rot}deg)`;
    area.append(img);
    img.animate([
      { opacity: 1, transform: `${at} scale(1)` },
      { opacity: 0, transform: `${at} scale(.6)` },
    ], { duration: life, delay, easing: 'cubic-bezier(.65,0,.35,1)' /* = --ease-in-out */, fill: 'both' })
      .onfinish = () => img.remove();
  };
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    area.addEventListener('pointermove', (e) => {
      const now = performance.now();
      if (now - last < every) return;
      last = now;
      const r = area.getBoundingClientRect();
      spawn(e.clientX - r.left, e.clientY - r.top);
    });
  } else {
    // Touch: a tap on empty space throws a small burst of three around the finger.
    area.addEventListener('pointerdown', (e) => {
      if (e.target.closest('a,button')) return;
      const r = area.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      [[-40, -20], [30, -40], [10, 30]].forEach(([dx, dy], k) => spawn(x + dx, y + dy, k * 80));
    });
  }
}
imageTrail(document.querySelector('.trail-area'), ['img/trail/1.webp', 'img/trail/2.webp', 'img/trail/3.webp', 'img/trail/4.webp']);
```
(Web Animations can't read CSS variables for easing, so the `--ease-in-out` curve is written out. Match it to the
variant's token.)

**Phone:** give a lighter version that keeps the idea. The code above throws a burst of three images on a tap of empty
space (images at `size: 140` on phones). The heading and button stay clear and clickable.

**Reduced motion:** no trail. Place two or three of the images still and slightly turned around the heading so the
block still shows the client's things.
