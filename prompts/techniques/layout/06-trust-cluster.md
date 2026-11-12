Adapted from MotionSites layout-and-ui.md #6 (MIT).

# Overlapping trust cluster with pill

A compact proof chip: three small coins overlap and tuck into the start of a pill that carries one real claim. It can
be the hero's one small line of facts (taste.md allows at most one), above or below the headline, instead of a loose
logo row.

**Needs:** three real items for the coins: customer photos used with permission, real partner or stockist logos, or
the client's own marks. Plus one real claim from the client. No stock faces, no invented counts.

## Values
- Size token `--s: clamp(36px, 4.5vw, 42px)` (34 px at ≤420 px).
- Coins are **rings, not discs**: an outer ring in `--surface` with a hairline border, `padding 5px`, around a circle
  holding the photo or logo (a letter glyph at `0.34 × --s` only as a build stand-in).
- Overlap `margin-left: −0.42 × --s`; z-order 1 / 2 / 4; the pill sits at z 3 so the last coin overlaps it.
- Pill: same height and border, `margin-left: −0.42 × --s`, `padding-left: 0.58 × --s` so the text clears the coin;
  500 weight, `--muted`, `clamp(12px, 1.4vw, 13.5px)`.
- Hover lift −2 / −4 / −2 px over .35 s. Margin below `clamp(16px, 2.5vh, 26px)`.
- Photo alternative: 3 × 32 px avatars, overlap −8 px, a 2 px ring in the page colour, plus the claim in 14 px muted.

## Code
```html
<div class="trust">
  <span class="coin"><img src="images/proof/1.webp" alt=""></span>
  <span class="coin"><img src="images/proof/2.webp" alt=""></span>
  <span class="coin"><img src="images/proof/3.webp" alt=""></span>
  <span class="trust-pill" data-from="proof.claim">[placeholder]</span>
</div>
```
Only real client numbers. Until the client confirms, the pill shows `[client to confirm]` and the claim goes in
`OPEN-QUESTIONS.md`.
```css
.trust{--s:clamp(36px,4.5vw,42px);display:inline-flex;align-items:center;margin-bottom:clamp(16px,2.5vh,26px)}
.coin{position:relative;width:var(--s);height:var(--s);flex:none;border-radius:50%;padding:5px;
  background:var(--surface);border:1px solid var(--line);transition:transform .35s var(--ease-out)}
.coin>img,.coin>span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;object-fit:cover;
  background:var(--bg);color:var(--ink);font:700 calc(var(--s) * .34)/1 var(--font-body)}
.coin+.coin{margin-left:calc(var(--s) * -.42)}
.coin:nth-child(1){z-index:1}.coin:nth-child(2){z-index:2}.coin:nth-child(3){z-index:4}
.trust:hover .coin:nth-child(1),.trust:hover .coin:nth-child(3){transform:translateY(-2px)}
.trust:hover .coin:nth-child(2){transform:translateY(-4px)}
.trust-pill{position:relative;z-index:3;display:inline-flex;align-items:center;height:var(--s);
  margin-left:calc(var(--s) * -.42);padding:0 16px 0 calc(var(--s) * .58);border-radius:999px;
  background:var(--surface);border:1px solid var(--line);color:var(--muted);
  font:500 clamp(12px,1.4vw,13.5px)/1 var(--font-body);white-space:nowrap}
@media (max-width:420px){.trust{--s:34px}}
@media (prefers-reduced-motion:reduce){.coin{transition:none}}
```

**Phone:** the cluster stays one line, so keep the claim to about 30 characters (check at 360 px with
`check-pages.cjs --phone`). The hover lift simply doesn't happen on touch, which is fine.

**Reduced motion:** no lift; the chip is static.
