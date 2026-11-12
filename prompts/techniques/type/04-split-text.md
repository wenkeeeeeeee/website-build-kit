Adapted from MotionSites type-and-text-motion.md #4 (MIT).

# Split-text headline entrances (masked line/word pull-up, soft word rise, character cascade)

Headlines that assemble by line, word or letter. The masked pull-up (type rising out of a slot) is the editorial move
for giant display words and stacked statements; the character cascade reads like a sentence written across the screen.
Lines arrive at full brightness, never half-faded.

**Needs:** nothing.

## Parameters
- Masked lines (hand-written): `translateY(110%) -> 0` inside `overflow:hidden`, 0.7 s `var(--ease-out)`, delays
  `0.4 + i x 0.14 s`. Stacked display words at line-height .88-.92, e.g. right-aligned uppercase 600 at
  `clamp(2rem, 9vw, 9rem)`.
- Masked words: inner word `translateY(110%) -> 0`, **1.2 s** `var(--ease-out)`, stagger **60 ms** (letter blocks) to
  **80 ms** (words); optional parent `scale(1.03 -> 1)` over the same time.
- Soft word rise (no mask): `y 20px` plus opacity, stagger 80 ms, about 0.8 s.
- Rise with a small overshoot, for section headings triggered on scroll: per word `y 50 -> -5 -> 0`, opacity
  `0 -> .5 -> 1` at 0/50/100%, 0.7 s, stagger 100 ms. Words `inline-block` with `margin-right:.28em`.
- Character cascade: `translateX(-18px)` plus opacity 0 to rest, 500 ms per char, **30 ms** step, starting at 200 ms;
  subhead at 800 ms, actions 1200 ms.
- The mask needs room: pad the clip box `.06em .15em .14em` with an equal negative margin, or descenders get cut.
- Words stay unbreakable (`white-space:nowrap` on the word wrapper); inline elements such as `<strong>` keep their
  styling after splitting.

## Code: hand-written masked lines (CSS only)
```html
<h1 class="mask-lines">
  <span class="ml"><span style="--i:0">First</span></span>
  <span class="ml"><span style="--i:1">second</span></span>
  <span class="ml"><span style="--i:2">third</span></span>
</h1>
```
```css
.mask-lines{margin:0;font:600 clamp(2rem,9vw,9rem)/.88 var(--font-display);text-transform:uppercase;text-align:right;letter-spacing:-.02em;color:var(--ink)}
.ml{display:block;overflow:hidden;padding:.06em .15em .14em;margin:-.06em -.15em -.14em}
.ml>span{display:block;animation:ml-up .7s var(--ease-out) both;animation-delay:calc(.4s + var(--i) * .14s)}
@keyframes ml-up{from{transform:translateY(110%)}}
@media (prefers-reduced-motion:reduce){.ml>span{animation:none}}
```

## Code: automatic splitter
```css
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
```
```js
// modes: 'words' (masked pull-up) | 'chars' (lateral cascade) | 'plain' (bare word spans) | 'plain-chars'
function splitText(root, mode = 'words') {
  if (root.dataset.splitDone) return;
  root.dataset.splitDone = '1';
  // Letter spans can be spelled out by screen readers, so char modes hide the split copy and add one clean copy.
  const charMode = mode === 'chars' || mode === 'plain-chars';
  const plain = (root.innerText || root.textContent).replace(/\s+/g, ' ').trim();
  let i = 0;
  const span = (cls, text) => { const s = document.createElement('span'); s.className = cls; if (text != null) s.textContent = text; return s; };
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === Node.ELEMENT_NODE) return walk(n);       // keeps <strong>, <br>
    if (n.nodeType !== Node.TEXT_NODE) return;
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.append(' '); return; }
      if (charMode) {
        const w = span(mode === 'chars' ? 'sc-w' : 'sp-w');
        w.setAttribute('aria-hidden', 'true');
        for (const ch of part) { const c = span(mode === 'chars' ? 'sc-c' : 'sp', ch); c.style.setProperty('--i', i++); w.append(c); }
        frag.append(w);
      } else if (mode === 'plain') {
        const w = span('sp', part); w.style.setProperty('--i', i++); frag.append(w);
      } else {
        const o = span('sw-o'), inner = span('sw-i', part);
        inner.style.setProperty('--i', i++); o.append(inner); frag.append(o);
      }
    });
    n.replaceWith(frag);
  });
  walk(root);
  if (charMode) root.prepend(span('sr-only', plain));
  return i;   // number of pieces
}
// Hero (on load): split, then add .is-in after the first paint.
document.querySelectorAll('[data-split-text]:not([data-split-scroll])').forEach((el) => {
  splitText(el, el.dataset.splitText);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));
});
// Below the fold: add .is-in when the heading enters view.
const splitIO = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('is-in'); splitIO.unobserve(e.target); }
}), { threshold: 0.1 });
document.querySelectorAll('[data-split-scroll]').forEach((el) => { splitText(el, el.dataset.splitText); splitIO.observe(el); });
```
```css
/* masked word pull-up */
.sw-o{display:inline-block;overflow:hidden;vertical-align:top;padding:0 .06em .14em;margin:0 -.06em -.14em}
.sw-i{display:inline-block;transform:translateY(110%);transition:transform var(--dur,1.2s) var(--ease-out);
  transition-delay:calc(var(--start,0ms) + var(--i) * var(--step,60ms))}
.is-in .sw-i{transform:none}
/* soft word rise (no mask) */
.split-soft .sw-o{overflow:visible}
.split-soft .sw-i{transform:translateY(20px);opacity:0;transition-property:transform,opacity;--dur:.8s;--step:80ms}
.split-soft.is-in .sw-i{transform:none;opacity:1}
/* rise with a small overshoot (section headings) */
.split-over .sw-o{overflow:visible;margin-right:.28em}
.split-over .sw-i{transform:translateY(50px);opacity:0;transition:none}
.split-over.is-in .sw-i{animation:sw-over .7s var(--ease-out) both;animation-delay:calc(var(--i) * 100ms)}
@keyframes sw-over{0%{opacity:0;transform:translateY(50px)}50%{opacity:.5;transform:translateY(-5px)}100%{opacity:1;transform:none}}
/* per-character lateral cascade */
.sc-w{display:inline-block;white-space:nowrap}
.sc-c{display:inline-block;opacity:0;transform:translateX(-18px);transition:opacity .5s var(--ease-out),transform .5s var(--ease-out);
  transition-delay:calc(var(--start,200ms) + var(--i) * 30ms)}
.is-in .sc-c{opacity:1;transform:none}
.sp-w{display:inline-block;white-space:nowrap}
@media (prefers-reduced-motion:reduce){.sw-i,.sc-c{transition:none!important;animation:none!important;transform:none!important;opacity:1!important}}
```
```html
<h1 data-split-text="words" style="font-size:clamp(4rem,20vw,18rem);line-height:.85;letter-spacing:-.07em">Word</h1>
<h2 data-split-text="words" data-split-scroll class="split-soft">A short section heading.</h2>
<h2 data-split-text="words" data-split-scroll class="split-over">Another heading.</h2>
<h1 data-split-text="chars">A sentence written<br>across the screen.</h1>
```
With GSAP SplitText (npm, or `js/vendor/SplitText.min.js`): split with `mask: 'lines'`, then
`gsap.from(split.lines, { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .08 })`.

**Phone:** works as is. Keep stagger totals under about 1 s for a hero headline; check the mask padding at the phone
font size.

**Reduced motion:** no transitions; text renders at rest. Char modes keep one clean screen-reader copy.
