Adapted from MotionSites layout-and-ui.md #9 (MIT).

# Desktop grid that becomes a phone scroll-snap rail

Three or four large cards people compare (plans, packages, set menus, service tiers) form a grid on desktop and a
native, swipeable, snapping rail on tablet and phone. Beats stacking three tall cards. Cards are solid and designed
in the variant's style (taste.md, "Boxes and lines"), not glass.

**Needs:** 3-4 real offers with real prices and what's included, from content data.

## Values
- Desktop: 3 columns, 24 px gap, `max-width 1100px`.
- ≤1024 px: `display:flex; overflow-x:auto; scroll-snap-type:x mandatory`, cards `flex: 0 0 min(320px, 82vw)`,
  `scroll-snap-align:center`, 16 px gap. The rail bleeds to the screen edges (negative inline margin equal to the
  gutter, plus `scroll-padding-inline`). Scrollbar hidden.
- Cards: `--surface` fill, `1px solid var(--line)`, radius 44 px (or the client's own shape), padding `5vh 24px`,
  height capped so the section still fits one screen at 1536×700 below the header: `min-height: min(580px, 64vh)`.
  An optional diagonal sheen `::before` from a faint `--ink` tint to transparent at 50 %.
- Hover (desktop only): `translateY(-12px) scale(1.01)`, border switches to `--accent`, .6 s on `--ease-out`.
- Inside: tier name 1.1 rem in `--muted`; price 2.8 rem / 500 / −.02em; one line of description; checklist rows with
  28 px round checks; the variant's primary button pinned with `margin-top:auto`.
- Billing or size toggle: 52 × 28 track, 20 px knob, `translateX(24px)`, .3 s on `--ease-in-out`, `role="switch"`,
  drawn in the site's style (playbook, "Controls in the site's design").

## Code
```css
.plans{--gutter:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:6vh auto 0}
.plan{position:relative;overflow:hidden;display:flex;flex-direction:column;min-height:min(580px,64vh);padding:5vh 24px;border-radius:44px;
  color:var(--ink);background:var(--surface);border:1px solid var(--line);
  transition:transform .6s var(--ease-out),border-color .6s var(--ease-out)}
.plan::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:linear-gradient(135deg,color-mix(in srgb,var(--ink) 6%,transparent) 0%,transparent 50%)}
.plan .price{font:500 2.8rem/1 var(--font-display);letter-spacing:-.02em}
.plan .btn-plan{margin-top:auto;align-self:center}      /* use the variant's button class */
@media (hover:hover){.plan:hover{border-color:var(--accent);transform:translateY(-12px) scale(1.01)}}
@media (max-width:1024px){
  .plans{display:flex;gap:16px;max-width:none;overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;
    margin-inline:calc(-1 * var(--gutter));padding:0 var(--gutter) 8px;scroll-padding-inline:var(--gutter);scrollbar-width:none}
  .plans::-webkit-scrollbar{display:none}
  .plan{flex:0 0 min(320px,82vw);scroll-snap-align:center;min-height:min(520px,70svh)}
}

.toggle{position:relative;width:52px;height:28px;padding:0;border:1px solid var(--line);border-radius:999px;background:var(--surface);cursor:pointer;
  transition:background-color .3s var(--ease-in-out)}
.toggle::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--ink);
  transition:transform .3s var(--ease-in-out),background-color .3s var(--ease-in-out)}
.toggle[aria-checked=true]{background:var(--accent)}
.toggle[aria-checked=true]::after{transform:translateX(24px);background:var(--accent-ink)}
.toggle:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
@media (prefers-reduced-motion:reduce){.plan,.toggle,.toggle::after{transition:none}}
```
```html
<button class="toggle" role="switch" aria-checked="false" aria-label="Show yearly prices"
        onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') !== 'true')"></button>
```
Prices come from content data; any price not confirmed shows `[client to confirm]`.

**Phone:** the rail is the phone version. Let the next card peek (82vw) so people know to swipe, and keep each card's
action inside the card.

**Reduced motion:** no hover lift; the rail still scrolls and snaps natively.
