Adapted from MotionSites video-and-media.md #3 (MIT).

# Background-video framing

Geometry tricks that put the film's subject where the layout needs it, without re-editing the film. Use them when the
focal point collides with the copy, sits too high or low, or crops badly on portrait screens.

**Needs:** a film (see `01-background-video-layer.md`). A and E need a source at least 1.2x its display size, or the
film goes soft.

**Variants**
- **A. Oversize + top anchor:** `width:120%; height:120%`, centred, `top:0`, `object-position:top`. Keeps the top of the frame (sky, horizon) and trims edges and bottom.
- **B. Vertical offset:** `translateY(15-20%)` on an `inset:0` cover film pushes the subject below the headline. Only when the exposed band blends into the section ground (dark film edge, or a scrim from `04-edge-blend-scrims.md`).
- **C. Lower band:** the film fills only the area below the headline (from about 30vh down), and a `bg → transparent → bg` gradient dissolves it into a light page.
- **D. Focal crop for portrait:** `object-position: 70% center` (or `right bottom` from 1024px) keeps a right-side subject when a phone crops the sides.
- **E. Bleed scale:** `scale(1.05)` hides encoder edge lines and 1px letterbox slivers.
- **F. In-flow block on phones:** below 1024px the film is a block in the flow (`1/1` on phones, `16/9` on tablets) placed **first**, above the copy, so the subject leads and no text sits over busy footage; from 1024px it is the full background again, with the copy over it (never copy one side, film the other).
- **Light pages on phones:** inset the film to 80% x 80%, centred, so it reads as a floating screen, not a cropped mess.

```css
/* A. Oversize, top-anchored */
.video--oversize{position:absolute;left:50%;top:0;width:120%;height:120%;transform:translateX(-50%);object-fit:cover;object-position:top center}
/* B. Vertical offset */
.video--shift{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:translateY(17%)}
/* C. Lower band dissolving into a light page */
.video-band{position:absolute;left:0;right:0;bottom:0;top:clamp(180px,30vh,300px);z-index:0}
.video-band video{width:100%;height:100%;object-fit:cover}
.video-band::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(to bottom,var(--bg) 0%,transparent 50%,var(--bg) 100%)}
/* D. Focal crop */
.video--focal{object-position:70% center}
@media (min-width:1024px){.video--focal{object-position:right bottom}}
/* E. Bleed */
.video--bleed{transform:scale(1.05)}
/* F. Film first on phones, background on desktop */
.vframe{display:flex;flex-direction:column;background:var(--bg)}
.vframe__media{order:1;position:relative;aspect-ratio:1/1;overflow:hidden}
.vframe__copy{order:2;position:relative;z-index:10;padding:clamp(1.5rem,6vh,3rem) 1.5rem}
.vframe__media video{width:100%;height:100%;object-fit:cover;object-position:right}
@media (min-width:768px){.vframe__media{aspect-ratio:16/9}}
@media (min-width:1024px){
  .vframe{display:block;position:relative;min-height:100vh;min-height:100svh}
  .vframe__copy{background:transparent;min-height:inherit;display:flex;flex-direction:column;justify-content:center;padding-block:clamp(2rem,10vh,7rem)}
  .vframe__media{position:absolute;inset:0;aspect-ratio:auto;z-index:0}
  .vframe__media video{object-position:right bottom}
}
```
```html
<section class="vframe">
  <div class="vframe__media"><video muted playsinline autoplay preload="auto" poster="img/hero-poster.jpg" src="videos/hero.mp4" aria-hidden="true"></video></div>
  <div class="vframe__copy">…headline, one line, one action…</div>
</section>
```
Serving, loop rules and off-screen pause: `01-background-video-layer.md`.

**Phone:** retest the focal point at 375x812; usually change `object-position` per breakpoint rather than the
transform. F gives the film its own block above the copy.

**Reduced motion:** framing is static; show the still from `01-background-video-layer.md` in the same frame.
