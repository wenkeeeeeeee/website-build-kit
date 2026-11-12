Adapted from MotionSites layout-and-ui.md #9 (MIT).

# Desktop grid that becomes a phone scroll-snap rail

3-4 large cards people compare (plans, packages, set menus, service tiers): a grid on desktop, a native snapping swipe
rail on tablet and phone. Beats stacking three tall cards. Solid cards in the variant's style, not glass.

**Needs:** 3-4 real offers with real prices and what's included, from content data.

## Values
- Desktop: 3 columns, 24px gap, `max-width 1100px`.
- ≤1024px: `display:flex; overflow-x:auto; scroll-snap-type:x mandatory`, cards `flex: 0 0 min(320px, 82vw)`,
  `scroll-snap-align:center`, 16px gap. The rail bleeds to the screen edges (negative inline margin equal to the
  gutter, plus `scroll-padding-inline`). Scrollbar hidden.
- Cards: `--surface` fill, `1px solid var(--line)`, radius 44px (or the client's own shape), padding `5vh 24px`,
  `min-height: min(580px, 64vh)` so the section still fits one screen at 1536×700 below the header. Optional diagonal
  sheen `::before` from a faint `--ink` tint to transparent at 50%.
- Hover (desktop only): `translateY(-12px) scale(1.01)`, border to `--accent`, .6s on `--ease-out`.
- Inside: tier name 1.1rem in `--muted`; price 2.8rem / 500 / −.02em; one line of description; checklist rows with
  28px round checks; the variant's primary button pinned with `margin-top:auto`.
- Billing or size toggle: 52 × 28 track, 20px knob, `translateX(24px)`, .3s on `--ease-in-out`, `role="switch"`,
  drawn in the site's style, not a browser default.

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

**Phone:** the rail is the phone version. The next card peeks (82vw) so people know to swipe; each card's action stays
inside the card.

**Reduced motion:** no hover lift; the rail still scrolls and snaps natively.
