Adapted from MotionSites type-and-text-motion.md #12 (MIT).

# Giant type word assembling from blocks

A full-width word built from flat polygons (verticals, diagonals, crossbars). On load each block slides up from below
the SVG's edge in a quick cascade while the whole word settles from a 3% zoom, like type being set in metal. Good for
a section opener or footer word in a precise, constructed tone (architecture, engineering, institutions).

**Use it only for a giant type word, never the client's logo.** The logo is always the original file, never redrawn
or rebuilt from shapes (`taste.md`). Pick a short word from the client's world (2-5 letters with straight strokes:
A, E, F, H, I, K, L, M, N, T, V, W, X, Y, Z).

**Needs:** nothing.

## Parameters
- Each block `translateY(120 user units) -> 0` plus fade, **1.2 s** `var(--ease-out)`, stagger **60 ms** after 100 ms.
- Parent `scale(1.03 -> 1)` 1.4 s.
- Stroke weight 14 units on a 100-unit cap height; letter gap about 66 units.
- Fill `var(--ink)` on `var(--bg)`.

## Code
```html
<p class="wm" role="img" aria-label="[placeholder: the word]">
  <svg viewBox="0 0 494 100" aria-hidden="true" focusable="false">
    <g>                                     <!-- N -->
      <polygon style="--i:0" points="0,0 14,0 14,100 0,100"/>
      <polygon style="--i:1" points="200,0 214,0 214,100 200,100"/>
      <polygon style="--i:2" points="0,0 33,0 214,100 181,100"/>
    </g>
    <g transform="translate(280,0)">        <!-- H -->
      <polygon style="--i:3" points="0,0 14,0 14,100 0,100"/>
      <polygon style="--i:4" points="200,0 214,0 214,100 200,100"/>
      <polygon style="--i:5" points="14,43 200,43 200,57 14,57"/>
    </g>
  </svg>
</p>
```
```css
.wm{margin:0}
.wm svg{display:block;width:100%;height:auto;fill:var(--ink);overflow:hidden;animation:wm-settle 1.4s var(--ease-out) both}
.wm polygon{animation:wm-block 1.2s var(--ease-out) both;animation-delay:calc(100ms + var(--i) * 60ms)}
@keyframes wm-block{from{transform:translateY(120px);opacity:0}}
@keyframes wm-settle{from{transform:scale(1.03)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.wm svg,.wm polygon{animation:none}}
```
CSS `px` on SVG children equals user units, so 120px is more than the 100-unit cap height and each block starts fully
below the viewBox (the SVG clips it). Letter recipes: **M** = two verticals + two diagonals meeting at the bottom
centre; **A/V** = two diagonals + optional bar; **E/F** = one vertical + three/two bars; **T** = one bar + one vertical.

For a section below the fold, pause the animations (`animation-play-state:paused`) and run them when an
IntersectionObserver adds a class. With GSAP: `gsap.from('.wm polygon', { y: 120, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .06 })`.

**Phone:** works as is (it scales with width). Check the word still reads at 360px; pick a shorter word if not.

**Reduced motion:** the word renders assembled.
