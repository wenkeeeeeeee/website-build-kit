Adapted from MotionSites layout-and-ui.md #4 (MIT).

# Expanding capsule menu

The nav is part of the show: a 48 px square with a burger opens sideways into a ~290 px capsule that reveals 2-4 links,
while the logo sits in its own pill beside it and a solid action pill sits right. For minimal heroes where a full link
row would be noise. Ported to a solid surface (no glass), and the opening is a `clip-path` wipe, not a width animation.

**Needs:** nothing beyond the logo and 2-4 page links.

## Values
- Capsule 48 px tall, radius 14 px, `--surface` fill. It always has its open width (290 px); closed, a
  `clip-path: inset(0 calc(100% - 48px) 0 0 round 14px)` shows only the burger square. Open wipes to
  `inset(0 0 0 0 round 14px)` over ~0.55 s on `--ease-out` (playful tone only: a slight overshoot such as
  `cubic-bezier(.34,1.25,.64,1)`).
- The toggle's inner disc scales `1 → .75` and gains a faint tint; links fade and slide `x 15 → 0` after ~120 ms.
- 3-bar icon: `18×12` box, 1.5 px bars, open offsets `±5.25px` + `±45deg`.
- Clip-path clips clicks too, and the closed links are `inert`, so the hidden area can't be hit.

## Code
```html
<nav class="capnav" aria-label="Primary">
  <a class="cap cap--logo" href="./"><img src="images/logo.svg" alt="Home"></a>
  <div class="cap cap--menu" data-open="false">
    <button class="cap__toggle" aria-expanded="false" aria-controls="cap-links" aria-label="Menu">
      <span class="cap__bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
    <div class="cap__links" id="cap-links"><a href="#about">About</a><a href="#menu">Menu</a><a href="#visit">Visit</a></div>
  </div>
  <a class="cap-cta" href="#order">Order</a>
</nav>
```
```css
.capnav{position:fixed;top:16px;left:16px;right:16px;z-index:50;display:flex;align-items:center;gap:8px}
.cap{height:48px;border-radius:14px;display:flex;align-items:center;color:var(--ink);background:var(--surface)}
.cap--logo{padding:0 20px;transition:transform .2s var(--ease-out)}
.cap--logo img{height:22px;width:auto}
.cap--logo:hover{transform:scale(1.02)}
.cap--menu{width:290px;overflow:hidden;clip-path:inset(0 calc(100% - 48px) 0 0 round 14px);
  transition:clip-path .55s var(--ease-out)}
.cap--menu[data-open="true"]{clip-path:inset(0 0 0 0 round 14px)}
.cap__toggle{position:relative;flex:none;width:48px;height:48px;border:0;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}
.cap__toggle::before{content:"";position:absolute;inset:0;border-radius:14px;background:color-mix(in srgb,var(--ink) 0%,transparent);
  transition:transform .3s var(--ease-out),background-color .3s var(--ease-out)}
.cap--menu[data-open="true"] .cap__toggle::before{transform:scale(.75);background:color-mix(in srgb,var(--ink) 10%,transparent)}
.cap__toggle:focus-visible{outline:2px solid var(--accent);outline-offset:-4px}
.cap__links{display:flex;gap:20px;padding:0 20px;white-space:nowrap;opacity:0;transform:translateX(15px);visibility:hidden;
  transition:opacity .3s var(--ease-out),transform .3s var(--ease-out),visibility 0s .3s}
.cap--menu[data-open="true"] .cap__links{opacity:1;transform:none;visibility:visible;transition-delay:.12s,.12s,0s}
.cap__links a{color:var(--ink);opacity:.85;text-decoration:none;font:400 16px/1 var(--font-body)}
.cap__links a:hover{opacity:1}
.cap-cta{margin-left:auto;height:48px;display:inline-flex;align-items:center;padding:0 24px;border-radius:999px;
  background:var(--accent);color:var(--accent-ink);text-decoration:none;transition:transform .2s var(--ease-out)}
.cap-cta:hover{transform:scale(1.03)}
.cap-cta:active{transform:scale(.97)}
.cap__bars{position:relative;width:18px;height:12px}
.cap__bars i{position:absolute;left:0;width:100%;height:1.5px;border-radius:2px;background:currentColor;
  transition:transform .35s var(--ease-out),opacity .2s var(--ease-out)}
.cap__bars i:nth-child(1){top:0}.cap__bars i:nth-child(2){top:5.25px}.cap__bars i:nth-child(3){bottom:0}
[aria-expanded="true"] .cap__bars i:nth-child(1){transform:translateY(5.25px) rotate(45deg)}
[aria-expanded="true"] .cap__bars i:nth-child(2){opacity:0;transform:scaleX(0)}
[aria-expanded="true"] .cap__bars i:nth-child(3){transform:translateY(-5.25px) rotate(-45deg)}
@media (max-width:640px){.cap--menu{display:none}}   /* phones use layout recipe #5 */
@media (prefers-reduced-motion:reduce){.cap--menu,.cap__links,.cap__bars i,.cap__toggle::before{transition-duration:.01s}}
```
```js
(() => {
  const menu = document.querySelector('.cap--menu');
  const btn = menu.querySelector('.cap__toggle');
  const links = menu.querySelector('.cap__links');
  const set = (open) => { btn.setAttribute('aria-expanded', String(open)); menu.dataset.open = String(open); links.inert = !open; };
  set(false);
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.dataset.open === 'true') { set(false); btn.focus(); } });
})();
```

**Phone:** below 640 px the capsule hides and the mobile menu (layout recipe #5) takes over, with logo and action
still in the bar.

**Reduced motion:** the capsule opens and closes instantly; nothing else changes.
