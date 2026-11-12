Adapted from MotionSites layout-and-ui.md #5 (MIT).

# Mobile menu: burger morph + staggered overlay, drawer or bottom sheet

A phone menu that feels designed rather than toggled. The burger folds into an X, an overlay (or a side drawer, or a
bottom sheet) fades in, and the links arrive one after another. Use it on every page with navigation below
768-1024 px. Surfaces are solid in the variant's colours, not frosted.

**Needs:** nothing beyond the page list and the main action.

## Values
- Burger: three bars 18-24 × 1.5-2 px, gap 5 px; open = top `translateY(bar + gap) rotate(45deg)` (7 px for 2 px bars),
  middle `opacity 0`, bottom mirrored; 0.25-0.3 s. The button is a 44-48 px circle above the overlay.
- 2-line burger (light pages): `32 × 1.5px`, gap 6 px; hover scales the lines to 24 / 40 px (`scaleX`), open
  `±3.75px` + `±45deg`.
- Icon-crossfade alternative: Menu and X icons stacked in one grid cell; Menu goes to `rotate(90deg) scale(.5) opacity 0`
  while X arrives from `rotate(-90deg) scale(.5)`, 300 ms; press `scale(.9)`.
- Full-screen overlay: near-opaque `--bg`, opacity .28-.5 s. Links 28-40 px, 500-600, rising `translateY(20px) → 0`,
  stagger `100 + i × 80 ms`; a trailing action at ~400 ms. On close, delays reset to 0 so the menu leaves at once.
- Drawer: `width 85%; max-width 24rem`, `translateX(100%) → 0` over 500 ms on `--ease-out`, link stagger
  `150 + i × 70 ms`, a tinted scrim that closes on tap.
- Bottom sheet: `--surface`, inset 12 px, radius 16 px, `translateY(100%) → 0` 500 ms on `--ease-out`, backdrop at 60 %,
  links 28-32 px with a 50 ms stagger.
- Behaviour: `aria-expanded`, `aria-controls`, a label toggling "Open menu"/"Close menu"; Escape closes and returns focus
  to the burger; a link or the backdrop closes; resizing to desktop closes; page scroll locked while open (call
  `lenis.stop()` / `lenis.start()` too if Lenis runs); the closed menu is `inert`; safe-area padding top and bottom.
- Put the main action (WhatsApp, order, book) in the menu and keep it in the bar as well.

## Overlay
```html
<button class="burger" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button>
<div class="menu" id="mobile-menu">
  <nav class="menu-links" aria-label="Mobile">
    <a href="#menu" style="--i:0">Menu</a>
    <a href="#story" style="--i:1">Story</a>
    <a href="#visit" style="--i:2">Visit</a>
    <a href="#order" class="menu-cta" style="--i:4">Order on WhatsApp</a>
  </nav>
</div>
```
```css
.burger{display:none;position:relative;z-index:80;width:44px;height:44px;border-radius:999px;place-content:center;gap:5px;cursor:pointer;
  background:var(--surface);border:1px solid var(--line)}
.burger span{display:block;width:18px;height:2px;border-radius:1px;background:var(--ink);
  transition:transform .3s var(--ease-out),opacity .2s var(--ease-out)}
.menu-open .burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.menu-open .burger span:nth-child(2){opacity:0}
.menu-open .burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.menu{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;justify-content:center;
  padding:max(96px,calc(env(safe-area-inset-top) + 88px)) 24px max(32px,env(safe-area-inset-bottom));
  background:color-mix(in srgb,var(--bg) 96%,transparent);
  opacity:0;visibility:hidden;transition:opacity .28s var(--ease-out),visibility 0s linear .28s}
.menu-open .menu{opacity:1;visibility:visible;transition:opacity .28s var(--ease-out)}
.menu-links a{display:block;padding:12px 0;color:var(--ink);text-decoration:none;
  font:500 clamp(28px,8vw,40px)/1.1 var(--font-display);letter-spacing:-.02em;
  opacity:0;transform:translateY(20px);transition:opacity .5s var(--ease-out),transform .5s var(--ease-out)}
.menu-open .menu-links a{opacity:1;transform:none;transition-delay:calc(100ms + var(--i) * 80ms)}
body.menu-open{overflow:hidden}
@media (max-width:767px){.burger{display:grid}}
@media (min-width:768px){.menu{display:none}}
@media (prefers-reduced-motion:reduce){.burger span,.menu,.menu-links a{transition-duration:.001s!important;transition-delay:0s!important}}
```
```js
(function mobileMenu(burger) {
  const menu = document.getElementById(burger.getAttribute('aria-controls'));
  const desktop = matchMedia('(min-width: 768px)');
  const isOpen = () => document.body.classList.contains('menu-open');
  const set = (open) => {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.inert = !open;
    if (window.lenis) open ? window.lenis.stop() : window.lenis.start();
    if (open) menu.querySelector('a, button')?.focus({ preventScroll: true });
  };
  menu.inert = true;
  burger.addEventListener('click', () => set(!isOpen()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a') || e.target === menu) set(false); });
  document.addEventListener('click', (e) => { if (e.target.closest('[data-menu-close]')) set(false); });   // scrims, backdrops
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { set(false); burger.focus(); } });
  desktop.addEventListener('change', (e) => { if (e.matches) set(false); });
})(document.querySelector('.burger'));
```
The closed overlay needs nothing more; a closed drawer or sheet sits inside a fixed wrapper with `overflow: hidden`
(playbook, "Phones") so it never widens the page.

## Drawer variant
Give the panel `id="mobile-menu"` and class `drawer`; add `<div class="drawer-scrim" data-menu-close></div>`.
```css
.drawer{position:fixed;top:0;right:0;bottom:0;z-index:70;width:85%;max-width:24rem;padding:96px 32px 32px;
  background:var(--surface);box-shadow:0 25px 50px -12px rgb(0 0 0/.25);
  transform:translateX(100%);transition:transform .5s var(--ease-out)}
.menu-open .drawer{transform:none}
.drawer a{display:block;padding:16px 0;border-bottom:1px solid var(--line);font:600 24px/1.2 var(--font-display);color:var(--ink);
  opacity:0;transform:translateX(32px);transition:opacity .5s var(--ease-out),transform .5s var(--ease-out)}
.menu-open .drawer a{opacity:1;transform:none;transition-delay:calc(150ms + var(--i) * 70ms)}
.drawer-scrim{position:fixed;inset:0;z-index:60;background:rgb(0 0 0/.4);opacity:0;pointer-events:none;transition:opacity .3s var(--ease-out)}
.menu-open .drawer-scrim{opacity:1;pointer-events:auto}
```

## Bottom-sheet variant
```html
<div class="sheet" id="mobile-menu">
  <div class="sheet__backdrop" data-menu-close></div>
  <div class="sheet__panel" role="dialog" aria-modal="true" aria-label="Menu">
    <a href="#menu" style="--i:0">Menu</a><a href="#story" style="--i:1">Story</a><a href="#visit" style="--i:2">Visit</a>
  </div>
</div>
```
```css
.sheet{position:fixed;inset:0;z-index:70;overflow:hidden;visibility:hidden;pointer-events:none;transition:visibility 0s .5s}
.menu-open .sheet{visibility:visible;pointer-events:auto;transition-delay:0s}
.sheet__backdrop{position:absolute;inset:0;background:rgb(0 0 0/.6);opacity:0;transition:opacity .5s var(--ease-out)}
.sheet__panel{position:absolute;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));padding:24px;border-radius:16px;
  background:var(--surface);color:var(--ink);transform:translateY(calc(100% + 24px));transition:transform .5s var(--ease-out)}
.menu-open .sheet__backdrop{opacity:1}
.menu-open .sheet__panel{transform:none}
.sheet__panel a{display:block;padding:6px 0;color:inherit;text-decoration:none;font:500 clamp(28px,8vw,32px)/1.15 var(--font-display);
  letter-spacing:-.02em;opacity:0;transform:translateY(16px);transition:opacity .5s var(--ease-in-out),transform .5s var(--ease-in-out)}
.menu-open .sheet__panel a{opacity:1;transform:none;transition-delay:calc(100ms + var(--i,0) * 50ms)}
@media (min-width:768px){.sheet{display:none}}
```

## 2-line burger (light pages)
Hover uses `scaleX` from the right edge instead of animating width.
```css
.burger2{display:flex;flex-direction:column;align-items:flex-end;gap:6px;background:none;border:0;padding:8px;cursor:pointer}
.burger2 i{display:block;width:32px;height:1.5px;background:var(--ink);transform-origin:right center;transition:transform .3s var(--ease-out)}
.burger2:hover i:first-child{transform:scaleX(.75)}.burger2:hover i:last-child{transform:scaleX(1.25)}
[aria-expanded="true"].burger2 i:first-child{transform-origin:center;transform:translateY(3.75px) rotate(45deg)}
[aria-expanded="true"].burger2 i:last-child{transform-origin:center;transform:translateY(-3.75px) rotate(-45deg)}
```

**Phone:** this is the phone pattern. Keep tap targets 44 px or more and the main action visible in the bar.

**Reduced motion:** the menu appears and leaves instantly with no stagger; the burger swaps to X without a tween.
