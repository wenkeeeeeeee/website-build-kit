Adapted from MotionSites layout-and-ui.md #11 (MIT).

# Infinite looping card slider

A card carousel that loops forever both ways with real CSS transitions: prev/next buttons, tap a card to focus it,
optional autoplay that pauses on hover and focus. For branches, testimonials, menus by day or case studies.

**Needs:** 4-6 real cards (branch photos and addresses, real reviews with names, projects).

## Values
- Track transition **640 ms** on `--ease-out` (testimonials: 0.8 s on `--ease-in-out`).
- Cards `flex: 0 0 clamp(300px, 19.4vw, 430px)`, height `min(220px, 32vh)`, padding 24 px, radius **24 px**, soft shadow
  `0 18px 52px` of `--shadow`; gap `clamp(16px, 1.15vw, 24px)`; phone `min(82vw, 330px)`.
- Round controls **54 px** in `--surface` with a soft shadow on photos (or bordered 48 px circles on plain pages),
  styled as the variant's buttons with hover, pressed and focus states.
- Autoplay **3 s**, paused on hover/focus. Cards that have passed fade and scale out (`opacity 0, scale(.9)`).
- Loop mechanism: render 3 copies, start in the middle copy; after a transition ends outside the middle copy, jump by
  ±N with transitions disabled. Only the middle copy is focusable.
- `--peek` places the active card: a positive gutter (`48px`) lines it up with page content; a negative value
  (`-18vw`) lets it bleed off the left edge for an editorial crop.
- Autoplay that runs longer than 5 s needs a visible pause control (WCAG 2.2.2, playbook "Sharing and audiences").

## Code
```html
<div class="slider" data-autoplay="3000">
  <div class="slider__viewport">
    <div class="slider__track">
      <article class="slider__card" tabindex="0" role="button" aria-label="Open card one">…</article>
      <!-- 4-6 cards from content data -->
    </div>
  </div>
  <div class="slider__nav">
    <button class="slider__btn" data-dir="-1" aria-label="Previous">←</button>
    <button class="slider__btn" data-dir="1"  aria-label="Next">→</button>
  </div>
</div>
```
```css
.slider__viewport{overflow:hidden}
.slider__track{--shift:0px;display:flex;gap:clamp(16px,1.15vw,24px);
  transform:translate3d(calc(var(--shift) + var(--peek,48px)),0,0);transition:transform 640ms var(--ease-out);will-change:transform}
.slider__track.is-jumping,.slider__track.is-jumping .slider__card{transition:none}
.slider__card{position:relative;flex:0 0 clamp(300px,19.4vw,430px);height:min(220px,32vh);padding:24px;border-radius:24px;overflow:hidden;
  background:var(--surface);color:var(--ink);box-shadow:0 18px 52px var(--shadow,rgb(0 0 0/.12));cursor:pointer;user-select:none;
  transition:opacity .5s var(--ease-out),transform .5s var(--ease-out)}
.slider__card.is-past{opacity:0;transform:scale(.9)}
.slider__card:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.slider__nav{display:flex;gap:14px;margin:2vh 0 0 48px}
.slider__btn{width:54px;height:54px;border-radius:999px;border:0;background:var(--surface);color:var(--ink);
  box-shadow:0 18px 36px rgb(0 0 0/.2);cursor:pointer;transition:transform .2s var(--ease-out)}
.slider__btn:hover{transform:scale(1.05)}
.slider__btn:active{transform:scale(.94)}
.slider__btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (max-width:640px){.slider__card{flex-basis:min(82vw,330px)}}
@media (prefers-reduced-motion:reduce){.slider__track,.slider__card{transition:none}}
```
```js
function initInfiniteSlider(root) {
  const track = root.querySelector('.slider__track');
  const originals = [...track.children];
  const n = originals.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [];
  track.replaceChildren();
  for (let set = 0; set < 3; set++) originals.forEach((card, i) => {
    const c = card.cloneNode(true);
    c.dataset.index = set * n + i;
    if (set !== 1) { c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; }   // only the middle copy is focusable
    track.append(c); cards.push(c);
  });
  let active = n;
  const update = () => {
    const step = cards[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
    track.style.setProperty('--shift', `${-step * active}px`);
    cards.forEach((c, i) => { c.classList.toggle('is-active', i === active); c.classList.toggle('is-past', i < active); });
  };
  const jump = (i) => {                              // teleport to the equivalent card, no transition
    track.classList.add('is-jumping');
    active = i; update();
    void track.offsetWidth;                          // commit before re-enabling transitions
    track.classList.remove('is-jumping');
  };
  const normalize = () => { if (active >= 2 * n) jump(active - n); else if (active < n) jump(active + n); };
  const go = (i) => { active = i; update(); if (reduce) normalize(); };
  const move = (dir) => { if (active + dir < 0 || active + dir > 3 * n - 1) normalize(); go(active + dir); };
  track.addEventListener('transitionend', (e) => { if (e.target === track && e.propertyName === 'transform') normalize(); });
  cards.forEach((c) => {
    c.addEventListener('click', () => go(+c.dataset.index));
    c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(+c.dataset.index); } });
  });
  root.querySelectorAll('[data-dir]').forEach((b) => b.addEventListener('click', () => move(+b.dataset.dir)));
  addEventListener('resize', () => jump(active));
  const ms = +root.dataset.autoplay || 0;
  if (ms && !reduce) {
    let timer = setInterval(() => move(1), ms);
    const stop = () => clearInterval(timer);
    const start = () => { stop(); timer = setInterval(() => move(1), ms); };
    root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);    root.addEventListener('focusout', start);
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(root);   // no autoplay off screen
  }
  jump(active);
}
document.querySelectorAll('.slider').forEach(initInfiniteSlider);
```

**Phone:** cards go to `min(82vw, 330px)` and the buttons stay. Phone: give a lighter version that keeps the idea:
add swipe by listening for a horizontal `pointerdown`/`pointerup` delta over 40 px and calling `move(±1)`, or switch the
track to the native scroll-snap rail in layout recipe #9.

**Reduced motion:** no autoplay; steps jump without a transition.
