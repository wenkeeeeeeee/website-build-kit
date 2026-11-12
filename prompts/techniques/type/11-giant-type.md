Adapted from MotionSites type-and-text-motion.md #11 (MIT).

# Giant display type as image (ghost word behind subject, edge-to-edge word, watermark, scattered words)

Type set so large it becomes architecture. The client's subject stays the biggest, sharpest thing on screen: the word
sits behind or around it, never instead of it.
- **Ghost word behind a cut-out subject:** a viewport-wide word sits *between* the background and a transparent
  product, so the subject stands in front of the letters. Instant depth and a poster composition.
- **Edge-to-edge word:** anchored at the bottom or top of a section, almost touching both edges. Good as a section
  opener or footer sign-off. Use a word from the client's world, set in type; never redraw or restyle the logo.
- **Watermark:** a section's key word repeated huge at low opacity behind it (pricing, closing call), with content over it.
- **Scattered words:** a 3-word headline broken across the viewport (left / right / indented) over the subject's film
  or photo, with one short real fact tucked into a gap.

**Needs:** ghost word: one clean cut-out of the product or subject (PNG/WebP with alpha). The others: nothing, or a
film/photo for scattered words.

## Parameters
- Ghost word: condensed heavy display face, uppercase, `clamp(90px, 28vw, 380px)`, lh 1, `letter-spacing:-.02em`,
  nowrap, solid `--ink` or `--bg` on a saturated `--stage` ground, `top:18%`. The subject is anchored at the bottom
  (`object-fit:contain; object-position:bottom center`) and covers the lower half of the letters. Scale it up only as
  far as the image stays sharp (the source used x1.68 desktop, x1.25 mobile). Z-order: background, word (2), subject (3),
  grain (50), UI (60).
- Photographic version: title `clamp(4.5rem,14vw,14rem)` / lh .78, width `min(94vw,1780px)`, `top: clamp(122px,19vh,205px)`,
  light `--ink` over a landscape, with the subject cut-out at `bottom:5vh`.
- Edge-to-edge word: `19-26vw` (stepping 26/24/22/20/19vw by breakpoint), lh .85, `letter-spacing:-.07em`, weight 500;
  optional superscript mark `position:absolute; top:.65em; right:-.3em; font-size:.31em`.
- Watermark: `clamp(120px, 30vw, 521px)`, uppercase condensed, `letter-spacing:-4px`, solid `--ink` at `opacity .08-.1`,
  centred 50px below middle, `aria-hidden`. Echo title alternative: ~9rem / 800 / `-.05em` / lh .9, dropping to
  3.5rem ≤1024px. Decorative low contrast is an intended exception: record it with the impeccable hook ignore (playbook 6).
- Scattered: words `14vw` (phone) / `13vw`, lh .95, `-.04em`, lowercase; at top 18% left, top 38% right, top 58% left
  18-28%; a note `max-width 240px; 15px` at top 46%; facts 36-48px with rotated hairlines (`96x1px`, `--line`,
  `rotate(±20deg)`) and 12-14px labels; a bottom gradient to `--bg`. Keep words off the busiest part of the image.
- For an **exact** full-width fit, measure and scale after `document.fonts.ready` (vw sizes drift with font metrics).
  Animate the word in with the masked pull-up (`04-split-text.md`).

## Code
```html
<!-- Ghost word behind a cut-out -->
<section class="ghost-stage">
  <div class="ghost-word" aria-hidden="true">[placeholder: word]</div>
  <img class="ghost-subject" src="images/cutout/subject.webp" alt="[placeholder: product name]">
  <div class="ghost-ui"><!-- headline, one line, action --></div>
</section>
<!-- Edge-to-edge word -->
<div class="mega-wrap"><p class="mega" data-fit aria-hidden="true">[placeholder: word]</p></div>
<!-- Watermark (inside a position:relative section) -->
<div class="ghost-mark" aria-hidden="true">[placeholder: word]</div>
```
```css
.ghost-stage{position:relative;height:100vh;height:100svh;overflow:hidden;background:var(--stage,var(--accent))}
.ghost-word{position:absolute;left:0;right:0;top:18%;z-index:2;display:flex;justify-content:center;
  font:400 clamp(90px,28vw,380px)/1 var(--font-display);letter-spacing:-.02em;
  text-transform:uppercase;white-space:nowrap;color:var(--bg);pointer-events:none;user-select:none}
.ghost-subject{position:absolute;left:50%;bottom:0;height:92%;z-index:3;
  transform:translateX(-50%) scale(var(--subject-scale,1.68));transform-origin:bottom center;object-fit:contain;object-position:bottom center}
.ghost-ui{position:relative;z-index:60}
@media (max-width:639px){.ghost-subject{height:60%;bottom:22%;--subject-scale:1.25}}

.mega-wrap{width:100%;overflow:hidden}
.mega{position:relative;display:inline-block;margin:0;white-space:nowrap;font:500 19vw/.85 var(--font-display);letter-spacing:-.07em;color:var(--ink)}

.ghost-mark{position:absolute;left:50%;top:calc(50% + 50px);translate:-50% -50%;z-index:0;margin:0;pointer-events:none;user-select:none;
  white-space:nowrap;text-transform:uppercase;letter-spacing:-4px;opacity:.08;color:var(--ink);
  font:400 clamp(120px,30vw,521px)/1 var(--font-display)}
```
```js
// Exact fit-to-width: the element must be display:inline-block; white-space:nowrap
function fitToWidth(el) {
  let lastW = 0;
  const fit = () => {
    const w = el.parentElement.clientWidth;
    if (!w || w === lastW) return;
    lastW = w;
    el.style.fontSize = '100px';
    el.style.fontSize = (100 * w / el.getBoundingClientRect().width).toFixed(2) + 'px';
  };
  new ResizeObserver(fit).observe(el.parentElement);
  if (document.fonts) document.fonts.ready.then(() => { lastW = 0; fit(); });
}
document.querySelectorAll('[data-fit]').forEach(fitToWidth);
```
Scattered words (the film follows the video rules: local file, poster, `preload` only if it is the first film):
```html
<section class="scatter">
  <video class="scatter__bg" src="video/hero.mp4" poster="images/hero-poster.webp" autoplay muted loop playsinline aria-hidden="true"></video>
  <h1><span class="scatter__w scatter__w--1">first</span> <span class="scatter__w scatter__w--2">second</span> <span class="scatter__w scatter__w--3">third</span></h1>
  <p class="scatter__note">[placeholder: one or two lines of real fact]</p>
  <div class="scatter__stat" style="right:6vw;top:14%;text-align:right">
    <div class="scatter__stat-row" style="justify-content:flex-end"><span class="scatter__rule" style="rotate:20deg"></span><span class="scatter__stat-num" data-from="stats.main">[placeholder]</span></div>
    <div class="scatter__label" data-from="stats.mainLabel">[placeholder]</div>
  </div>
</section>
```
Only real client numbers: fill `data-from` from the content JSON, or drop the fact. Only loop a film that is long and
seamless enough not to show a restart (`motion.md`); otherwise use a still.
```css
.scatter{position:relative;height:100vh;height:100svh;overflow:hidden;background:var(--bg);color:var(--ink)}
.scatter__bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.scatter h1{margin:0;font:inherit}
.scatter__w{position:absolute;margin:0;font:500 14vw/.95 var(--font-display);letter-spacing:-.04em}
.scatter__w--1{left:16px;top:18%}.scatter__w--2{right:16px;top:38%}.scatter__w--3{left:18%;top:58%}
.scatter__note{position:absolute;left:24px;top:46%;max-width:240px;font:15px/1.375 var(--font-body)}
.scatter__stat{position:absolute}
.scatter__stat-row{display:flex;align-items:center;gap:12px}
.scatter__stat-num{font:500 clamp(36px,4vw,48px) var(--font-display);letter-spacing:-.025em}
.scatter__rule{display:none;width:96px;height:1px;background:var(--line)}
.scatter__label{margin-top:4px;font:14px var(--font-body);color:var(--muted)}
@media (min-width:768px){.scatter__w{font-size:13vw}.scatter__w--1{left:40px}.scatter__w--2{right:40px}.scatter__w--3{left:28%}.scatter__rule{display:block}}
```

**Phone:** retest the subject/word overlap at 375px: the subject stays biggest and the headline and action stay clear
of it. Clip the root with `overflow-x:clip` so vw type never causes horizontal scroll.

**Reduced motion:** static type; any entrance (pull-up) renders at rest.
