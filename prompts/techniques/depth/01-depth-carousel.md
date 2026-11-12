Adapted from MotionSites depth-and-interaction.md #1 (MIT).

# Depth carousel with role slots and colour crossfade

A product or character carousel built from depth rather than sliding. One item is huge in the centre, two are small to
the sides, the rest are tiny at the back. Navigating moves items through these *roles*, and the section ground
crossfades to the active item's own colour (a colour wash, as the playbook's transitions ask). For 3-6 products,
flavours, colourways or characters, each with its own colour. Pairs with a giant word behind the subject.

**Needs:** 3-6 clean cut-outs of the client's products, same framing, bottom-aligned; one brand colour per item.

## Parameters
- One shared transition on every animated property: **650ms** `var(--ease-in-out)`, which also drives the colour wash.
- Every item has the same box (`height:92%`, `bottom:0`, centred) and roles are pure `transform` + `opacity`, with
  `transform-origin: bottom center`. Horizontal offsets use container units (`cqw`), so the section is a size container.
- Desktop roles (offset x / lift y / scale): centre `0 / 0 / 1.68` z 20; left `-20cqw / -13% / .30` opacity .85 z 10;
  right `+20cqw / -13% / .30` opacity .85 z 10; back `0 / -13% / .24` opacity .7 z 5.
- Phone (<640px): centre `0 / -24% / .82`; sides `-/+30cqw / -35% / .17`; back `0 / -35% / .14`.
- The source used `blur(2-4px)` on side and back items for depth of field. We animate only transform, opacity and
  clip-path, so depth here comes from scale and opacity. If the concept needs softness, use pre-blurred copies.
- Items `aspect-ratio:.6/1`, `object-fit:contain; object-position:bottom center`, `will-change:transform,opacity`.
  Preload all images.
- A 650ms lock ignores clicks mid-move.
- Controls: 48 -> 64px round outline buttons (2px `--ink` border, 26px arrow at stroke 2.25); hover `scale(1.08)` and a
  faint `--ink` fill over 150ms.

## Code
```html
<section class="dc" tabindex="0" aria-roledescription="carousel" aria-label="Flavours">
  <div class="dc-stage">
    <!-- data-bg comes from the content data: each item's own brand colour -->
    <img class="dc-item" src="img/cutout/a.webp" alt="Item A" data-bg="var(--item-a)" draggable="false">
    <img class="dc-item" src="img/cutout/b.webp" alt="Item B" data-bg="var(--item-b)" draggable="false">
    <img class="dc-item" src="img/cutout/c.webp" alt="Item C" data-bg="var(--item-c)" draggable="false">
    <img class="dc-item" src="img/cutout/d.webp" alt="Item D" data-bg="var(--item-d)" draggable="false">
  </div>
  <div class="dc-controls">
    <button class="dc-btn" data-dir="-1" aria-label="Previous">&larr;</button>
    <button class="dc-btn" data-dir="1" aria-label="Next">&rarr;</button>
  </div>
</section>
```
```css
.dc{container-type:size;position:relative;height:100vh;height:100dvh;overflow:hidden;
  background:var(--dc-bg,var(--bg));transition:background-color 650ms var(--ease-in-out);touch-action:pan-y}
.dc-stage{position:absolute;inset:0;z-index:3}
.dc-item{position:absolute;left:50%;bottom:0;height:92%;aspect-ratio:.6/1;object-fit:contain;object-position:bottom center;
  --x:0px;--y:0%;--s:1;
  transform:translateX(-50%) translate(var(--x),var(--y)) scale(var(--s));transform-origin:bottom center;
  will-change:transform,opacity;
  transition:transform 650ms var(--ease-in-out),opacity 650ms var(--ease-in-out)}
.dc-item[data-role=center]{--s:1.68;opacity:1;z-index:20}
.dc-item[data-role=left]  {--x:-20cqw;--y:-13%;--s:.30;opacity:.85;z-index:10}
.dc-item[data-role=right] {--x:20cqw;--y:-13%;--s:.30;opacity:.85;z-index:10}
.dc-item[data-role=back]  {--y:-13%;--s:.24;opacity:.7;z-index:5}
@media (max-width:639px){
  .dc-item[data-role=center]{--y:-24%;--s:.82}
  .dc-item[data-role=left]{--x:-30cqw;--y:-35%;--s:.17}
  .dc-item[data-role=right]{--x:30cqw;--y:-35%;--s:.17}
  .dc-item[data-role=back]{--y:-35%;--s:.14}
}
.dc-controls{position:absolute;z-index:60;left:50%;bottom:6vh;translate:-50% 0;display:flex;gap:16px}
.dc-btn{width:64px;height:64px;border-radius:50%;border:2px solid var(--ink);background:transparent;color:var(--ink);
  font-size:26px;cursor:pointer;transition:transform 150ms var(--ease-out),background-color 150ms var(--ease-out)}
.dc-btn:hover{transform:scale(1.08);background:color-mix(in oklab,var(--ink) 12%,transparent)}
.dc-btn:active{transform:scale(.96)}
.dc-btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (max-width:639px){.dc-btn{width:48px;height:48px}}
@media (prefers-reduced-motion:reduce){.dc,.dc-item{transition:none}}
```
```js
(function depthCarousel(root) {
  const items = [...root.querySelectorAll('.dc-item')];
  const N = items.length;
  const roleFor = (off) => (off === 0 ? 'center' : off === 1 ? 'right' : off === N - 1 ? 'left' : 'back');
  let active = 0, locked = false;
  items.forEach((img) => { const p = new Image(); p.src = img.src; });   // preload
  const render = () => {
    items.forEach((el, i) => {
      const role = roleFor((i - active + N) % N);
      el.dataset.role = role;
      el.setAttribute('aria-hidden', String(role !== 'center'));
    });
    root.style.setProperty('--dc-bg', items[active].dataset.bg);
  };
  const go = (dir) => {
    if (locked) return;
    locked = true;
    active = (active + (dir > 0 ? 1 : N - 1)) % N;
    render();
    setTimeout(() => { locked = false; }, 650);
  };
  root.querySelectorAll('.dc-btn').forEach((b) => b.addEventListener('click', () => go(+b.dataset.dir)));
  root.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
  let x0 = null;                                  // swipe
  root.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  root.addEventListener('pointerup', (e) => { if (x0 !== null && Math.abs(e.clientX - x0) > 40) go(e.clientX < x0 ? 1 : -1); x0 = null; });
  render();
})(document.querySelector('.dc'));
```

Each item's name, price and order action belong beside the centre item and change with it (taste.md: price on every
item). Keep them still while the item moves.

**Phone:** swipe works, and the phone roles keep the centre item biggest. Buttons stay 48px.

**Reduced motion:** items and colour switch instantly; the carousel still works by button, key and swipe.
