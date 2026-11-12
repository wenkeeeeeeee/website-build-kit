Adapted from MotionSites surfaces-and-buttons.md #5 (MIT).

# Sliding-fill buttons (+ hard offset shadow)

On hover a colour panel wipes across the button from one side and the label inverts above it. Two flavours: a fast
accent wipe on a dark pill, and a slow paper wipe on a dark button with an icon tilt and a hard offset shadow
(editorial, museum, print feel).

**Needs:** nothing.

## Parameters
- Accent wipe: `::after` `translateX(-100%) -> 0` over **0.4s** `var(--ease-out)`; paired buttons wipe from opposite
  sides. Pill `border-radius:50px`, `padding:12px 26px`, 15px / 500.
- Paper wipe: panel `translateX(-101%) -> 0` over **700ms** `var(--ease-out)`; label colour flips; icon
  `scale(1.1) rotate(-12deg) translateY(-4px)`; the button lifts `translateY(-2px)` and gains
  `box-shadow: 3px 3px 0` in `--ink` at 50%; `:active` resets lift and shadow. A 1px border in the dark colour keeps the
  edge crisp under the light panel.
- `isolation:isolate` + `z-index:-1` paints the panel above the button background and below the label, with no extra
  wrappers.
- The wipe can take the client's shape: give the panel a `clip-path` edge (a wave, a torn edge, a brush end) that matches
  the site's section joins.

## Code
```html
<a class="btn-fill" href="#order"><span>Order now</span></a>
<a class="btn-fill btn-fill--from-right" href="#menu"><span>See the menu</span></a>
<a class="btn-paper" href="#visit"><svg class="btn-paper__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg><span>Plan a visit</span></a>
```
```css
.btn-fill{position:relative;display:inline-flex;align-items:center;gap:8px;overflow:hidden;isolation:isolate;
  border-radius:50px;padding:12px 26px;background:var(--ink);color:var(--bg);font:500 15px/1 var(--font-body);
  text-decoration:none;transition:color .4s var(--ease-out)}
.btn-fill::after{content:"";position:absolute;inset:0;z-index:-1;background:var(--accent);
  transform:translateX(-100%);transition:transform .4s var(--ease-out)}
.btn-fill--from-right::after{transform:translateX(100%)}
.btn-fill:hover,.btn-fill:focus-visible{color:var(--accent-ink)}
.btn-fill:hover::after,.btn-fill:focus-visible::after{transform:translateX(0)}
.btn-fill:active{transform:scale(.98)}

.btn-paper{position:relative;display:inline-flex;align-items:center;gap:10px;overflow:hidden;isolation:isolate;
  padding:14px 24px;border:1px solid var(--ink);border-radius:6px;background:var(--ink);color:var(--bg);
  font:500 15px/1 var(--font-body);text-decoration:none;
  box-shadow:0 1px 2px color-mix(in oklab,var(--ink) 5%,transparent);
  transition:transform .3s var(--ease-out),box-shadow .3s var(--ease-out),color .7s var(--ease-out)}
.btn-paper::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--surface);transform:translateX(-101%);
  transition:transform .7s var(--ease-out)}
.btn-paper:hover,.btn-paper:focus-visible{color:var(--ink);transform:translateY(-2px);
  box-shadow:3px 3px 0 color-mix(in oklab,var(--ink) 50%,transparent)}
.btn-paper:hover::before,.btn-paper:focus-visible::before{transform:translateX(0)}
.btn-paper:active{transform:none;box-shadow:none}
.btn-paper__icon{width:18px;height:18px;transition:transform .7s var(--ease-out)}
.btn-paper:hover .btn-paper__icon{transform:scale(1.1) rotate(-12deg) translateY(-4px)}
.btn-fill:focus-visible,.btn-paper:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){
  .btn-fill::after,.btn-paper,.btn-paper::before,.btn-paper__icon{transition-duration:.01s}
}
```

The icon tilt is a playful-tone move. For a professional tone keep the wipe and drop the tilt and offset shadow.

**Phone:** run the wipe on press as well (`:active::after{transform:translateX(0)}`) so a tap shows it before the page
changes. The offset-shadow lift is skipped on touch.

**Reduced motion:** the wipe becomes an instant colour swap; nothing moves.
