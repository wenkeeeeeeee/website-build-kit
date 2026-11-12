Adapted from MotionSites scroll.md #6 (MIT).

# Scroll-linked opposing marquee rows

Two rows of photos slide sideways as you scroll down, the top row right, the bottom row left. A wall of work, dishes,
rooms or products, often right after the hero; let it carry the join into the next section.

**Needs:** 8-16 client photos that crop well to 420x270 (landscape). Stills, not clips.

## Parameters
- `offset = (innerHeight - sectionRect.top) * 0.3` (0 when the section's top enters). Row A `translateX(base + offset)`,
  row B `translateX(base - offset)`; the offset eases toward its target each frame.
- Each row's content is tripled and starts at `base = -33.333%` (one set to the left), so neither direction shows an
  empty edge. Mark the duplicate sets `aria-hidden="true"`.
- Tiles 420 x 270px (260 x 168 on phones), radius 16px, `object-fit:cover`, 12px gaps between tiles and rows; section
  padding-top about 12vh.
- Stills only: clips in tiles would loop short clips and exceed the video limit.
- `.scroll-rows` is not an ancestor of anything sticky, so `overflow:hidden` is fine here.

## Code
```html
<section class="scroll-rows">
  <div class="sr-row" data-dir="1"><!-- set of tiles, then 2 more copies with aria-hidden="true" --></div>
  <div class="sr-row" data-dir="-1"><!-- same --></div>
</section>
```
```css
.scroll-rows{overflow:hidden;padding:12vh 0 5vh;display:grid;gap:12px;background:var(--bg)}
.sr-row{display:flex;gap:12px;width:max-content;will-change:transform;transform:translate3d(-33.333%,0,0)}
.sr-row img{width:420px;height:270px;flex:none;border-radius:16px;object-fit:cover;display:block}
@media (max-width:640px){.sr-row img{width:260px;height:168px}}
```
```js
(function scrollRows(section, factor = 0.3) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rows = [...section.querySelectorAll('.sr-row')];
  let cur = 0, raf = 0;
  const update = () => {
    raf = 0;
    const target = (innerHeight - section.getBoundingClientRect().top) * factor;
    cur += (target - cur) * 0.12;                                        // ease toward target
    if (Math.abs(target - cur) < 0.1) cur = target; else raf = requestAnimationFrame(update);
    rows.forEach((row) => { row.style.transform = `translate3d(calc(-33.333% + ${cur * +row.dataset.dir}px),0,0)`; });
  };
  const tick = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  cur = (innerHeight - section.getBoundingClientRect().top) * factor;
  update();
})(document.querySelector('.scroll-rows'));
```
Hover on a tile should do something real (open the item, add it to the list); nothing below the hero stays plain.

**Phone:** works as is with the smaller tiles; lower `factor` to about 0.2 so rows don't race.

**Reduced motion:** rows sit still at the base offset. If every tile matters, also list the items in a plain grid or
link elsewhere on the page.
