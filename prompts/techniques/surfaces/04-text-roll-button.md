Adapted from MotionSites surfaces-and-buttons.md #4 (MIT).

# Text-roll button with rotating arrow chip

The label is stacked twice in a 20px window. On hover the stack slides up so a fresh copy rolls in from below, and an
arrow in a round chip at the right edge turns. For primary and header CTAs.

**Needs:** nothing.

## Parameters
- Window height = line-height = **20px**; roll `translateY(-50%)` over **500ms** `var(--ease-in-out)`.
- Asymmetric padding `8px 8px 8px 20-24px` so the chip hugs the right edge; chip 24px (header) / 28-32px (hero), in
  `--accent-ink` with the button colour as the arrow colour.
- Arrow `rotate(-45deg)` on hover (right arrow becomes up-right), same duration and easing.
- Colours: `--accent` fill with a slightly darker hover, or `--ink` with a light chip. Large-chip variant: chip 36-40px,
  hover gap `8 -> 12px`, chip `scale(1.1)`.
- Text arrows in plain links nudge `translateX(2px)` over 200ms.
- The client's object can replace the arrow inside the chip (a small drawn icon of it), turning the same way.

## Code
```html
<a class="btn-roll" href="#contact">
  <span class="btn-roll__label"><span class="btn-roll__inner">
    <span>Get a quote</span><span aria-hidden="true">Get a quote</span>
  </span></span>
  <span class="btn-roll__chip" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  </span>
</a>
```
```css
.btn-roll{display:inline-flex;align-items:center;gap:12px;padding:8px 8px 8px 24px;border-radius:999px;
  background:var(--accent);color:var(--accent-ink);font:500 14px/20px var(--font-body);text-decoration:none;
  transition:background-color .3s var(--ease-out),transform .2s var(--ease-out)}
.btn-roll:hover{background:color-mix(in oklab,var(--accent),black 10%)}
.btn-roll:active{transform:scale(.98)}
.btn-roll:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.btn-roll__label{display:block;height:20px;overflow:hidden}
.btn-roll__inner{display:flex;flex-direction:column;transition:transform .5s var(--ease-in-out)}
.btn-roll__inner>span{display:block;height:20px;white-space:nowrap}
.btn-roll:hover .btn-roll__inner,.btn-roll:focus-visible .btn-roll__inner{transform:translateY(-50%)}
.btn-roll__chip{width:32px;height:32px;border-radius:999px;background:var(--accent-ink);color:var(--accent);
  display:grid;place-items:center;flex:none}
.btn-roll__chip svg{transition:transform .5s var(--ease-in-out)}
.btn-roll:hover .btn-roll__chip svg,.btn-roll:focus-visible .btn-roll__chip svg{transform:rotate(-45deg)}
.btn-roll--dark{background:var(--ink);color:var(--bg);font-size:13px;padding-left:20px}
.btn-roll--dark .btn-roll__chip{width:24px;height:24px;background:var(--bg);color:var(--ink)}
@media (prefers-reduced-motion:reduce){.btn-roll__inner,.btn-roll__chip svg{transition:none}}
```

Gotcha: the 20px window clips descenders if the font's line box is tall; raise both heights together.

**Phone:** run the roll on press (`.btn-roll:active .btn-roll__inner{transform:translateY(-50%)}`) and keep the
scale-down. Button 44px+ tall (add padding if the chip is 24px).

**Reduced motion:** the label and arrow change instantly; the colour change stays.
