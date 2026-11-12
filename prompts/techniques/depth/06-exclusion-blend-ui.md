Adapted from MotionSites depth-and-interaction.md #6 (MIT).

# Exclusion-blend overlay UI and custom cursor

All fixed UI (wordmark, nav, caption, price, cursor) is light with `mix-blend-mode: exclusion`, so it inverts by
itself: light over dark footage, dark over the light sections that later slide beneath it. One fixed layer survives a
page that goes film -> dark -> light. Add a round custom cursor with the same blend, drawn from the client's object.

**Needs:** nothing. A small icon of the client's object for the cursor, if there is one.

## Parameters
- Overlay elements: `position:fixed; color:white; mix-blend-mode:exclusion; pointer-events:none` (back on for real
  links), `z-index:20`; corners at 32px desktop / 16px phone. White is required: exclusion only inverts cleanly from
  white. Brand colour comes from the page beneath.
- One family at weight 500, `letter-spacing:-.04em`; nav 13-15px, collection label 30px, price-size numbers 80px.
- Cursor: 48px SVG (circle `r=22.75`, stroke 2.5) with the client's mark or object inside, centred on the pointer,
  hidden below 1024px and on touch; the native cursor is hidden only for fine pointers.
- Entrance stagger: logo 0, nav .15, caption .3, product info .45s (`opacity 0, y 12 -> 0`, 0.6s `var(--ease-out)`).
- **Stacking gotcha:** blending happens against what is painted inside the same stacking context. Keep blended elements
  as direct children of `body` (or of the media's wrapper). A parent with `transform`, `filter`, `opacity < 1`,
  `isolation` or `will-change` traps the blend, so animate the blended element itself, not a wrapper.
- Check the main action stays readable over every section it crosses; the WhatsApp/order button itself can sit outside
  the blend layer in the variant's normal button style.

## Code
```html
<div class="ui-blend ui-blend--logo">WORDMARK</div>
<nav class="ui-blend ui-blend--nav"><a href="#range">Range</a><a href="#visit">Visit</a><a href="#basket">Basket</a></nav>
<div class="ui-blend ui-blend--info">Item name <span class="ui-blend__price">[price from content data]</span></div>
<div class="cursor" aria-hidden="true">
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22.75" stroke="#fff" stroke-width="2.5"/>
    <path d="M17 24h14M24 17v14" stroke="#fff" stroke-width="2.5"/><!-- swap for the client's object icon --></svg>
</div>
```
```css
.ui-blend{position:fixed;z-index:20;color:#fff;mix-blend-mode:exclusion;pointer-events:none;
  font:500 15px/1 var(--font-body);letter-spacing:-.04em;
  animation:ui-in .6s var(--ease-out) both}
.ui-blend a{pointer-events:auto;color:inherit;text-decoration:none}
.ui-blend a:focus-visible{outline:2px solid #fff;outline-offset:4px}
.ui-blend--logo{top:32px;left:32px;animation-delay:0s}
.ui-blend--nav{top:32px;right:32px;width:330px;display:flex;justify-content:space-between;animation-delay:.15s}
.ui-blend--info{right:32px;bottom:80px;width:330px;text-align:center;animation-delay:.45s}
.ui-blend__price{display:block;margin-top:8px;font:500 80px/1 var(--font-display);font-variant-numeric:tabular-nums}
@keyframes ui-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@media (max-width:640px){.ui-blend--logo{top:16px;left:16px}.ui-blend--nav{top:16px;right:16px;width:auto;gap:20px}
  .ui-blend--info{left:0;right:0;bottom:48px;width:auto}.ui-blend__price{font-size:48px}}
.cursor{position:fixed;left:0;top:0;z-index:50;pointer-events:none;mix-blend-mode:exclusion;will-change:transform;
  transition:scale .2s var(--ease-out)}
.cursor.is-down{scale:.85}
@media (hover:none),(pointer:coarse),(max-width:1023px){.cursor{display:none}}
@media (hover:hover) and (pointer:fine) and (min-width:1024px){html.has-cursor,html.has-cursor a,html.has-cursor button{cursor:none}}
@media (prefers-reduced-motion:reduce){.ui-blend{animation:none}}
```
```js
(() => {
  const cur = document.querySelector('.cursor');
  if (!matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches) return;
  document.documentElement.classList.add('has-cursor');
  addEventListener('pointermove', (e) => { cur.style.transform = `translate3d(${e.clientX - 24}px, ${e.clientY - 24}px, 0)`; }, { passive: true });
  addEventListener('pointerdown', () => cur.classList.add('is-down'));
  addEventListener('pointerup', () => cur.classList.remove('is-down'));
})();
```
Keep a visible focus style for keyboard users even when the native cursor is hidden.

**Phone:** the blended overlay works as is (it is just fixed text). The custom cursor is off on touch; nothing replaces
it, since taps already get each control's own press state.

**Reduced motion:** the overlay appears without the stagger; the cursor still follows the pointer (that is direct
feedback, not decoration).
