Adapted from MotionSites layout-and-ui.md #10 (MIT).

# Seamless infinite marquee (logos, image strip, giant text)

Endless horizontal strips: a stockist or partner ticker under the hero, a strip of tall photos between sections, or a
giant phrase ("… • … •") above the footer action. Edge-fade masks make items arrive rather than get cut. Use the
client's own photos, real partner logos or their real words.

**Needs:** real logos (SVG), 6+ of the client's photos, or one short phrase in the client's words.

## Values
- Always linear at constant **pixels per second** (~40-60px/s for logos): duration is computed from the group width,
  so phone and desktop feel the same.
- Logos `137 × 40px` contain, gap **64px**, 40-50% opacity. Image strip height `min(500px, 55vh)` desktop, 280px phone,
  radius 16px. Giant text: phrase + ` • ` repeated, ~40s per loop, `clamp(3rem,10vw,9rem)`, `-.04em`.
- The track holds the group twice and animates `translateX(0 → -50%)`. Each group carries its trailing gap as
  `padding-right`, so the halves are identical and the loop has no seam (a flex `gap` between groups puts −50% off by
  half a gap).
- Edge fade `mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)`. Pause on hover and off
  screen.
- Hover-bloom logo card: 160 × 96px pill in `--surface`; on hover an accent layer goes
  `scale(1.5) opacity 0 → scale(1) opacity 1` (.5s) and the logo flips to light (`brightness(0) invert(1)`).

## Code
```html
<div class="marquee" data-speed="50"><!-- px per second -->
  <div class="marquee__track">
    <div class="marquee__group">
      <img src="images/partners/one.svg" alt="Partner one"><img src="images/partners/two.svg" alt="Partner two"><img src="images/partners/three.svg" alt="Partner three">
      <!-- or: <span class="logo-card"><img src="images/partners/four.svg" alt="Partner four"></span> -->
    </div>
  </div>
</div>
```
```css
.marquee{overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.marquee__track{display:flex;width:max-content;animation:marquee var(--dur,20s) linear infinite}
.marquee__group{display:flex;align-items:center;flex:none;gap:var(--gap,64px);padding-right:var(--gap,64px)}
.marquee__group>img{width:137px;height:40px;object-fit:contain;opacity:.5}
.marquee:hover .marquee__track,.marquee.is-off .marquee__track{animation-play-state:paused}
@keyframes marquee{to{transform:translateX(-50%)}}
/* image strip */
.marquee--images{--gap:24px}
.marquee--images .marquee__group>img{height:min(500px,55vh);width:auto;border-radius:16px;object-fit:cover;opacity:1;
  box-shadow:0 10px 15px -3px rgb(0 0 0/.1),0 4px 6px -4px rgb(0 0 0/.1)}
@media (max-width:768px){.marquee--images .marquee__group>img{height:280px}}
/* giant text */
.marquee--text{--gap:0px}
.marquee--text .marquee__group{white-space:nowrap;font:500 clamp(3rem,10vw,9rem)/1 var(--font-display);text-transform:uppercase;letter-spacing:-.04em;color:var(--ink)}
/* hover-bloom logo card */
.logo-card{position:relative;overflow:hidden;flex:none;width:160px;height:96px;border-radius:999px;display:grid;place-items:center;
  background:var(--surface);border:1px solid var(--line);transition:border-color .3s var(--ease-out)}
.logo-card::before{content:"";position:absolute;inset:0;background:var(--accent);opacity:0;transform:scale(1.5);
  transition:opacity .5s var(--ease-out),transform .5s var(--ease-out)}
.logo-card img{position:relative;height:32px;width:auto;transition:filter .3s var(--ease-out)}
.logo-card:hover{border-color:var(--accent)}
.logo-card:hover::before{opacity:1;transform:scale(1)}
.logo-card:hover img{filter:brightness(0) invert(1)}
@media (prefers-reduced-motion:reduce){.marquee{overflow-x:auto}.marquee__track{animation:none}}
```
```js
document.querySelectorAll('.marquee').forEach((m) => {
  const track = m.querySelector('.marquee__track');
  const group = track.querySelector('.marquee__group');
  const originals = [...group.children];
  const build = () => {
    track.querySelectorAll('.marquee__group[aria-hidden]').forEach((g) => g.remove());
    let guard = 0;
    while (group.scrollWidth < m.clientWidth && guard++ < 10) originals.forEach((n) => {   // fill at least one screen
      const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); group.append(c);
    });
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.append(clone);
    track.style.setProperty('--dur', `${(group.scrollWidth / +(m.dataset.speed || 50)).toFixed(2)}s`);
  };
  const imgs = [...group.querySelectorAll('img')];
  Promise.all(imgs.map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))).then(build);
  new IntersectionObserver(([e]) => m.classList.toggle('is-off', !e.isIntersecting)).observe(m);   // pause off screen
});
```

**Phone:** runs as is; the image strip drops to 280px. No hover bloom on touch, which is fine.

**Reduced motion:** the strip stops and becomes a normal horizontal scroller with every item reachable.
