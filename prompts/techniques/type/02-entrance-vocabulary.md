Adapted from MotionSites type-and-text-motion.md #2 (MIT).

# Fail-safe entrance system with a motion vocabulary

A sturdier `01-rise-entrance.md`. Each element picks a verb (scale, soft rise, mask, pop, button, side slide, stat)
and a delay. The page can never be stuck blank, and each element's `transform` is released when its animation ends so
hover effects work. Use it for rich load choreography with no framework.

**Needs:** nothing.

## Parameters
- Rest state visible (`opacity:1`); hiding comes only from `animation-fill-mode: both`.
- Duration 1.05 s, `var(--ease-out)`, delay from `--d` (default .08 s). The lede gets 1.25 s.
- Vocabulary: `in-scale` opacity 0, `scale(.84)` (logo, alternating nav items); `in-soft` `translateY(14px)`;
  `in-mask` `translateY(40%)` inside an overflow-hidden line; `in-pop` `scale(.9) -> 1.03 @70% -> 1` (badges, playful
  tone only; professional uses `in-soft`); `in-btn` `translateY(18px) scale(.94)`; `in-side` `translateX(22px)`
  (secondary actions); `in-stat` `translateY(20px)`.
- Example timeline: logo .08; nav items .16/.28/.40/.52 (alternating scale/soft); header action .34; badge .22;
  H1 line 1 .42, line 2 .62; lede .82; primary action .96; secondary 1.10.
- After `animationend` the element gets `.is-in` (`animation:none` plus final values); otherwise the transform held by
  fill-mode overrides `:hover{transform}`.
- JS fallback: after two frames, if no animation is running or finished, force `.is-in` on everything.

## Code
```css
.appear{animation-duration:1.05s;animation-fill-mode:both;animation-timing-function:var(--ease-out);animation-delay:var(--d,.08s)}
.appear--scale{animation-name:in-scale}
.appear--soft {animation-name:in-soft}
.appear--mask {animation-name:in-mask}
.appear--pop  {animation-name:in-pop}
.appear--btn  {animation-name:in-btn}
.appear--side {animation-name:in-side}
.appear--stat {animation-name:in-stat}
.appear.is-in{animation:none;opacity:1;transform:none;clip-path:none}
@keyframes in-scale{from{opacity:0;transform:scale(.84)}}
@keyframes in-soft {from{opacity:0;transform:translateY(14px)}}
@keyframes in-mask {from{opacity:0;transform:translateY(40%)}}
@keyframes in-pop  {0%{opacity:0;transform:scale(.9)}70%{opacity:1;transform:scale(1.03)}100%{opacity:1;transform:scale(1)}}
@keyframes in-btn  {from{opacity:0;transform:translateY(18px) scale(.94)}}
@keyframes in-side {from{opacity:0;transform:translateX(22px)}}
@keyframes in-stat {from{opacity:0;transform:translateY(20px)}}
.headline-line{display:block;overflow:hidden;padding:.06em .15em .14em}  /* room for descenders */
@media (prefers-reduced-motion:reduce){
  .appear{animation:none!important;opacity:1;transform:none;clip-path:none}
}
```
```html
<a class="logo appear appear--scale" style="--d:.08s">...</a>
<span class="badge appear appear--soft" style="--d:.22s">Label</span>
<h1>
  <span class="headline-line appear appear--mask" style="--d:.42s">First line</span>
  <span class="headline-line appear appear--mask" style="--d:.62s">second line.</span>
</h1>
<p class="lede appear appear--soft" style="--d:.82s;animation-duration:1.25s">...</p>
<a class="btn appear appear--btn" style="--d:.96s">Primary</a>
<a class="btn appear appear--side" style="--d:1.10s">Secondary</a>
```
```js
const appearEls = document.querySelectorAll('.appear');
appearEls.forEach((el) => el.addEventListener('animationend', (e) => {
  if (e.target === el) el.classList.add('is-in');     // ignore bubbling from children
}));
requestAnimationFrame(() => requestAnimationFrame(() => {
  const running = [...appearEls].some((el) =>
    (el.getAnimations ? el.getAnimations() : []).some((a) => a.playState === 'running' || a.playState === 'finished'));
  if (!running) appearEls.forEach((el) => el.classList.add('is-in'));
}));
```

**Phone:** works as is; shorten the timeline so the headline and action land within about 1 s.

**Reduced motion:** every `.appear` renders at rest with no animation.
