Adapted from MotionSites surfaces-and-buttons.md #8 (MIT).

# Texture overlays: film grain, noise inside type, halftone, dot grid

A barely-there texture that removes the flat digital look of video, solid colour fields and gradients, and hides
compression banding: a fixed page grain, noise blended over a hero film, an animated grain, noise inside giant poster
type, a halftone screen over photos, a faint dot grid behind technical heroes. Pick the one that matches the client's
material (print, film, paper, screen); it supports the treatment, it is not the motion.

**Needs:** nothing.

## Parameters
- Page grain: `feTurbulence fractalNoise baseFrequency .9 numOctaves 4 stitchTiles stitch`, rect opacity `.08` inside
  the SVG x layer opacity `.4` (about 3% effective), 200px tile, fixed, z-index 50-100 above content,
  `pointer-events:none`. UI that must stay crisp (header) may sit above it.
- Film grain: `baseFrequency .85 numOctaves 3`, `opacity .7`, `mix-blend-mode: overlay` (shows in mid-tones, vanishes on
  pure black and white, exactly where banding lives). Section noise: `.9 / 4 octaves`, `opacity .15`.
- Animated grain: an oversized noise tile jittered with `steps(6)` over 1s at about `.08`.
- Text noise (multiply): `baseFrequency .9, numOctaves 2`, alpha `.35`, composite `in` SourceGraphic. Watermark noise
  (overlay): `baseFrequency .5`, `feFuncA slope .075`.
- Halftone: dots of `--ink` at **4x4px**, `opacity .2`, `multiply`. Dot grid: dots of `--ink` at **24x24px**,
  `opacity .05`.

## Code
```html
<div class="page-grain" aria-hidden="true"></div>
```
```css
:root{
  --noise-a:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  --noise-b:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
/* fixed page-wide grain */
.page-grain{position:fixed;inset:0;z-index:100;pointer-events:none;opacity:.4;background-size:200px 200px;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")}
/* over a film: last child of a position:relative; overflow:hidden media box */
.noise-overlay{position:absolute;inset:0;pointer-events:none;opacity:.7;mix-blend-mode:overlay;background-image:var(--noise-a)}
.bg-noise{position:absolute;inset:0;pointer-events:none;opacity:.15;background-image:var(--noise-b)}
/* animated grain (parent needs overflow:hidden) */
.grain-anim{position:absolute;inset:-50%;pointer-events:none;opacity:.08;mix-blend-mode:overlay;
  background-image:var(--noise-a);animation:grain 1s steps(6) infinite}
@keyframes grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-5%,3%)}40%{transform:translate(4%,-6%)}
  60%{transform:translate(-3%,5%)}80%{transform:translate(6%,2%)}}
.halftone{position:absolute;inset:0;pointer-events:none;opacity:.2;mix-blend-mode:multiply;
  background-image:radial-gradient(circle,var(--ink) 1px,transparent 1px);background-size:4px 4px}
.dot-grid{position:absolute;inset:0;pointer-events:none;opacity:.05;
  background-image:radial-gradient(var(--ink) 1px,transparent 1px);background-size:24px 24px}
@media (prefers-reduced-motion:reduce){.grain-anim{animation:none}}
```
Noise inside text (define once per page, then `filter:url(#text-grain)`):
```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false">
  <filter id="text-grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0"/>
    <feComposite in2="SourceGraphic" operator="in" result="noise"/>
    <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
  </filter>
  <filter id="watermark-grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.075"/></feComponentTransfer>
    <feComposite in2="SourceGraphic" operator="in" result="noise"/>
    <feBlend in="SourceGraphic" in2="noise" mode="overlay"/>
  </filter>
</svg>
<h2 class="poster-word" style="filter:url(#text-grain)">Poster type</h2>
```

Halftone and grain go over photos, never over copy people read. Check rendered screenshots: on a light page the grain
must not grey the body text.

**Phone:** overlay grain is a static tile and cheap, so keep it. SVG filters on large text are expensive: use them on
one or two elements and drop them at 1024px and below (`@media (max-width:1024px){.poster-word{filter:none}}`).

**Reduced motion:** the animated grain stops and stays as a still texture; everything else is static already.
