Adapted from MotionSites surfaces-and-buttons.md #6 (MIT).

# Animated gradient border ring (@property conic spin, hover ring)

A thin conic-gradient border travels round a pill non-stop, drawing the eye to the one CTA that matters; a calmer
version shows the ring only on hover. One ring per page at most.

**Needs:** nothing.

## Parameters
- Spinning ring: `inset:-3px; padding:3px`,
  `conic-gradient(from var(--border-angle), accent, deep, accent, deep, accent)` with `--accent` and a deep shade of the
  page ground, **3s linear infinite** via a registered `@property` (linear: a constant spin, not a reveal).
- Hover ring: `inset:-2px`, a two-tone gradient from `--accent` fading in over 0.3s, its position drifting over **6s**;
  the inner surface keeps the page colour; the button scales 1.05 on hover.
- Logo variant: 36px circle with a 2px ring, `scale(1.1)` on hover with the gradient direction reversed.
- `@property` works in Chrome/Edge 85+, Safari 16.4+, Firefox 128+; elsewhere the ring renders static, which is fine.

## Code
```html
<span class="ring-spin"><a class="btn-fill" href="#order"><span>Order now</span></a></span>
<a class="ring-hover" href="#work"><span>See the work</span></a>
```
```css
:root{ --ring-deep: color-mix(in oklab, var(--bg), black 70%); }
@property --border-angle{syntax:'<angle>';inherits:false;initial-value:0deg}
.ring-spin{position:relative;display:inline-block;border-radius:50px}
.ring-spin::before{content:"";position:absolute;inset:-3px;padding:3px;border-radius:inherit;pointer-events:none;
  background:conic-gradient(from var(--border-angle),var(--accent),var(--ring-deep),var(--accent),var(--ring-deep),var(--accent));
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor;          /* Chrome/Safari legacy keyword */
          mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          mask-composite:exclude;      /* standard */
  animation:border-spin 3s linear infinite}
@keyframes border-spin{to{--border-angle:360deg}}

.ring-hover{position:relative;display:inline-block;border-radius:999px;isolation:isolate;text-decoration:none;
  transition:transform .3s var(--ease-out)}
.ring-hover::before{content:"";position:absolute;inset:-2px;border-radius:inherit;z-index:-1;opacity:0;
  background:linear-gradient(90deg,var(--accent),color-mix(in oklab,var(--accent),black 25%),var(--accent));
  background-size:200% 100%;transition:opacity .3s var(--ease-out);animation:gradient-shift 6s var(--ease-in-out) infinite}
.ring-hover>span{display:block;border-radius:inherit;padding:14px 28px;background:var(--surface);color:var(--ink);
  font:500 14px/1 var(--font-body)}
.ring-hover:hover,.ring-hover:focus-visible{transform:scale(1.05)}
.ring-hover:hover::before,.ring-hover:focus-visible::before{opacity:1}
.ring-hover:active{transform:scale(.98)}
@keyframes gradient-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@media (prefers-reduced-motion:reduce){.ring-spin::before,.ring-hover::before{animation:none}}
```

Keep the mask in this cross-browser form: it cuts out the content box, so only the ring paints and clicks pass through.

**Phone:** the spinning ring is cheap; keep it. The hover ring never shows on touch, so show it on `:active` or at
`opacity:1` under `@media (hover:none)` for the one main CTA.

**Reduced motion:** both rings stop as a static gradient border.
