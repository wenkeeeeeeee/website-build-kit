Adapted from MotionSites type-and-text-motion.md #1 (MIT).

# Staggered rise entrance (+ media settle)

The hero's first second: each element rises a few px into place in reading order (nav, eyebrow, headline lines, body,
action, proof line) while the background media settles from a slight zoom. Use it as the hero's opening reveal or as
the quiet entrance under a bigger opening.

**Needs:** nothing. The media settle needs a hero image or film at least 1.2x its display size.

## Parameters
- Rise: `opacity 0, translateY(20-28px)` (optionally `scale(.98)`) to rest, **0.85-1.1 s**, `var(--ease-out)`.
  Heavier: `y 40px`, 1 s. Or a masked rise: the line slides up out of an `overflow:hidden` slot (see `04-split-text.md`).
- Nav comes **down** from -10 to -20px (0.5-0.8 s); content comes **up**; secondary items may slide in sideways.
- Paragraphs: `y 20-24px`, 0.8-1 s.
- Media settle: `scale(1.12 -> 1)` 1.8 s (images); `scale(1.05 -> 1)` plus fade 1.8 s (video). Only when the source is
  at least 1.2x its display size.
- Timelines that work (start delays, s):
  - Minimal centred: headline 0, sub .2, action .4 (0.8 s, y 24).
  - Two-line headline: line 1 .25, line 2 .42, bottom-left copy .70, bottom-right copy .85.
  - Nav first: logo 0, links .10/.15/.20/.25/.30, nav actions .35/.40, title .4, line .5, primary .6, secondary .7.
  - Light page: nav down (0.8 s), media settle 1.8 s, eyebrow .2, heading .4, line .7, buttons .9.
  - Tight technical: nav 0, headline .06, sub .14, actions .22, proof line .34 (fade only, 1.1 s); y 14.
- 80-200 ms between siblings; the headline gets the longest duration; logos and fine print only fade. Professional
  tone: everything lands within about 1 s. Playful: up to about 1.5 s.

## Code
The **rest state is visible**; hiding comes only from `animation-fill-mode: both`, so a failed script never leaves a
blank page.
```css
@keyframes rise{from{opacity:0;transform:translateY(var(--rise,28px))}to{opacity:1;transform:none}}
@keyframes riseSoft{from{opacity:0;transform:translateY(var(--rise,20px))}to{opacity:1;transform:none}}
@keyframes dropIn{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:none}}
@keyframes settleZoom{from{transform:scale(var(--zoom-from,1.12))}to{transform:scale(1)}}
.in-rise{animation:rise var(--dur,1.1s) var(--ease-out) var(--d,0ms) both}
.in-fade{animation:riseSoft var(--dur,1s) var(--ease-out) var(--d,0ms) both}
.in-down{animation:dropIn .8s var(--ease-out) var(--d,0ms) both}
.in-zoom{animation:settleZoom 1.8s var(--ease-out) both}
/* masked line: rises inside a slot, so it appears at full brightness */
.in-line{display:block;overflow:hidden;padding:.06em .15em .14em;margin:-.06em -.15em -.14em}
.in-line>span{display:block;animation:lineUp var(--dur,1.1s) var(--ease-out) var(--d,0ms) both}
@keyframes lineUp{from{transform:translateY(110%)}}
@media (prefers-reduced-motion:reduce){.in-rise,.in-fade,.in-down,.in-zoom,.in-line>span{animation:none}}
```
```html
<header class="in-down">...</header>
<div class="hero__bg in-zoom" style="background-image:url(images/hero.webp)"></div>
<h1>
  <span class="in-line"><span style="--d:250ms">First line</span></span>
  <span class="in-line"><span style="--d:420ms">second line</span></span>
</h1>
<p class="in-fade" style="--d:700ms">Supporting line.</p>
<a class="btn in-fade" style="--d:850ms" href="#order">Primary action</a>
```
Gate the sequence on fonts so nothing re-lays out mid-animation:
```css
.in-rise,.in-fade,.in-line>span{animation-play-state:paused}
.fonts-ready .in-rise,.fonts-ready .in-fade,.fonts-ready .in-line>span{animation-play-state:running}
```
```js
document.fonts.ready.then(() => document.documentElement.classList.add('fonts-ready'));
setTimeout(() => document.documentElement.classList.add('fonts-ready'), 1500);   // never wait forever
```
If an opening or preloader runs first, gate on its class instead (e.g. `.hero-go .in-rise{animation-play-state:running}`).

**Phone:** same choreography, shorter rises (y 14-20), no media settle if the phone source is under 1.2x its display
size. Headline and action visible within the first second.

**Reduced motion:** all animations off; everything renders in its final state.
