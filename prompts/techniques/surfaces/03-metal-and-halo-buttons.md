Adapted from MotionSites surfaces-and-buttons.md #3 (MIT).

# Metal and halo button finishes

Finishes that make a CTA feel machined rather than flat. **(a) Metal** brushed gradients with a light sweep on hover, for
monochrome, tool, auto or tech brands. **(b) Halo pill**, the single bright object on a dark hero. Use one finish per
variant, on every button of that kind (header, basket, dialogs too).

**Needs:** nothing. Colours come from the variant's tokens.

## Parameters
- **Sweep shine:** a 115deg band `transparent 20-30% -> --shine ~50% -> transparent 70-76%`, moving from
  `translateX(-120..-130%)` to `+120..130%` over 0.6-0.65s on hover. `isolation:isolate` + `z-index:-1` makes it pass
  between the fill and the label.
- **Metal solid:** three-stop vertical gradient from `--surface` darkening toward `--ink` by 10% and 20%, 1px border, a
  bright inset top line. Hover lifts the gradient and adds a soft glow in `--accent`.
- **Metal tab** (nav, filters): darker 105deg gradient built from `--bg` mixed toward `--ink` (16% / 28%), radius 7px,
  height 40px, padding 0 18px. Hover brightens it and adds a faint glow.
- Geometry: height 40-42px (48px+ for older audiences), radius 6px (crisp) or 999px (pill), weight 500,
  `letter-spacing:-.02em`, `line-height:1`, 0.35s transitions on background, border, shadow and colour.
- **Halo pill:** `--ink` fill on a dark page, `--bg` text, weight 600, three stacked glows of `--ink` at 15/32/12%;
  hover `translateY(-2px) scale(1.02)` with a stronger glow.
- Icon nudge: arrow-up-right `translate(2px,-2px)`, chevron `+1px` x. Press `scale(.98)`.

## Code
```css
:root{ --shine: rgb(255 255 255 / .45); }  /* light highlight; lower it on pale buttons */

.btn{position:relative;isolation:isolate;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;gap:8px;
  height:42px;padding:0 18px;border-radius:6px;font:500 14px/1 var(--font-body);letter-spacing:-.02em;white-space:nowrap;
  cursor:pointer;text-decoration:none;
  transition:background .35s var(--ease-out),border-color .35s var(--ease-out),box-shadow .35s var(--ease-out),
             color .35s var(--ease-out),transform .2s var(--ease-out)}
.btn::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:linear-gradient(115deg,transparent 20%,var(--shine) 48%,transparent 76%);
  transform:translateX(-130%);transition:transform .65s var(--ease-in-out)}
.btn:hover::after,.btn:focus-visible::after{transform:translateX(130%)}
.btn:active{transform:scale(.98)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}

.btn--metal{color:var(--ink);border:1px solid var(--surface);
  background:linear-gradient(180deg,var(--surface) 0%,
    color-mix(in oklab,var(--surface),var(--ink) 10%) 48%,
    color-mix(in oklab,var(--surface),var(--ink) 20%) 100%);
  box-shadow:inset 0 1px 0 color-mix(in oklab,var(--surface),white 60%)}
.btn--metal:hover{
  background:linear-gradient(180deg,var(--surface) 0%,
    color-mix(in oklab,var(--surface),var(--accent) 6%) 42%,
    color-mix(in oklab,var(--surface),var(--accent) 18%) 100%);
  box-shadow:inset 0 1px 0 white,0 0 22px color-mix(in oklab,var(--accent) 35%,transparent),
             0 8px 18px color-mix(in oklab,var(--ink) 12%,transparent)}
.btn .icon{transition:transform .25s var(--ease-out)}
.btn:hover .icon{transform:translate(2px,-2px)}

.tab-metal{position:relative;overflow:hidden;display:inline-flex;align-items:center;height:40px;padding:0 18px;border-radius:7px;
  color:var(--ink);font:400 14px/1 var(--font-body);letter-spacing:-.01em;
  border:1px solid color-mix(in oklab,var(--ink) 55%,transparent);
  background:linear-gradient(105deg,var(--bg) 0%,color-mix(in oklab,var(--bg),var(--ink) 16%) 48%,
                                   color-mix(in oklab,var(--bg),var(--ink) 28%) 100%);
  transition:background .35s var(--ease-out),border-color .35s var(--ease-out),box-shadow .35s var(--ease-out)}
.tab-metal::before{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(115deg,transparent 30%,color-mix(in oklab,var(--shine) 35%,transparent) 50%,transparent 70%);
  transform:translateX(-120%);transition:transform .6s var(--ease-in-out)}
.tab-metal:hover,.tab-metal[aria-selected="true"]{border-color:color-mix(in oklab,var(--ink) 90%,transparent);
  background:linear-gradient(105deg,color-mix(in oklab,var(--bg),var(--ink) 6%) 0%,
    color-mix(in oklab,var(--bg),var(--ink) 22%) 45%,color-mix(in oklab,var(--bg),var(--ink) 40%) 100%);
  box-shadow:0 0 18px color-mix(in oklab,var(--accent) 18%,transparent)}
.tab-metal:hover::before{transform:translateX(120%)}

.btn-halo{display:inline-flex;align-items:center;border-radius:999px;background:var(--ink);color:var(--bg);
  font:600 14.5px/1 var(--font-body);padding:13px 28px;border:0;cursor:pointer;
  box-shadow:0 0 0 1px color-mix(in oklab,var(--ink) 15%,transparent),0 0 22px color-mix(in oklab,var(--ink) 32%,transparent),
             0 0 44px color-mix(in oklab,var(--ink) 12%,transparent);
  transition:transform .3s var(--ease-out),box-shadow .3s var(--ease-out)}
.btn-halo:hover,.btn-halo:focus-visible{transform:translateY(-2px) scale(1.02);
  box-shadow:0 0 0 1px color-mix(in oklab,var(--ink) 25%,transparent),0 0 30px color-mix(in oklab,var(--ink) 45%,transparent),
             0 0 64px color-mix(in oklab,var(--ink) 18%,transparent)}
.btn-halo:active{transform:scale(.98)}

@media (prefers-reduced-motion:reduce){
  .btn::after,.tab-metal::before{transition:none}
  .btn-halo:hover{transform:none}
}
```
```html
<a class="btn btn--metal" href="#order">Order on WhatsApp <svg class="icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg></a>
<button class="tab-metal" aria-selected="true">All models</button>
<a class="btn-halo" href="#book">Book a fitting</a>
```

The halo pill only reads on a dark hero. On a light page use the metal solid instead.

**Phone:** hover never fires, so the press state carries it: keep `:active{transform:scale(.98)}` and, if wanted, run
the sweep once on `:active` too. Keep the button 44px+ tall.

**Reduced motion:** the sweep and lift are switched off; colour and border changes stay as the hover response.
