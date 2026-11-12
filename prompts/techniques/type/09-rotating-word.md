Adapted from MotionSites type-and-text-motion.md #9 (MIT).

# Rotating word slot (zero-reflow)

One word in a sentence cycles through real alternatives ("Cakes for ___": birthdays, weddings, offices), adding range
without extra copy. All words share one grid cell, so the slot is as wide as the longest word and the sentence never
reflows.

**Needs:** 3-5 real alternatives from the client's own offer (content data), never invented roles or slogans.

## Parameters
- Interval **2 s**; enter `opacity 0, translateY(8px)` to rest in **0.4 s** `var(--ease-out)`, exit upward.
- Same face, weight and style as the sentence: no italic or second-face accent word. Colour may shift to
  `var(--accent)` if the variant uses it elsewhere.
- Copy stays still while people read it: the code starts when the slot comes on screen, runs one full cycle and lands back on the main
  word.

## Code
```html
<p class="role-line">[placeholder: lead-in] <span class="rotator" data-interval="2000" data-cycles="1" aria-hidden="true">
  <span class="is-active">[placeholder: word 1]</span><span>[placeholder: word 2]</span><span>[placeholder: word 3]</span>
</span><span class="sr-only">[placeholder: word 1, word 2 and word 3]</span> [placeholder: rest of sentence].</p>
```
```css
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.rotator{display:inline-grid;vertical-align:bottom;font:inherit;color:var(--accent,inherit)}
.rotator>span{grid-area:1/1;justify-self:start;opacity:0;transform:translateY(8px);
  transition:opacity .4s var(--ease-out),transform .4s var(--ease-out)}
.rotator>span.is-active{opacity:1;transform:none}
.rotator>span.is-leaving{opacity:0;transform:translateY(-8px)}
```
```js
document.querySelectorAll('.rotator').forEach((r) => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = [...r.children];
  const cycles = +(r.dataset.cycles || 1);
  let i = Math.max(0, items.findIndex((s) => s.classList.contains('is-active')));
  let steps = 0, id = 0;
  const step = () => {
    const prev = items[i];
    prev.classList.replace('is-active', 'is-leaving');
    setTimeout(() => prev.classList.remove('is-leaving'), 400);
    i = (i + 1) % items.length;
    items[i].classList.add('is-active');
    if (++steps >= items.length * cycles) clearInterval(id);   // lands back on word 1
  };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !id) id = setInterval(step, +r.dataset.interval || 2000);
  }).observe(r);
});
```
Single-span version (text swapped): animate the old text out with WAAPI (`translateY(0 -> -20px)`, opacity 1 -> 0,
250 ms) and the new one in (`20px -> 0`, 350 ms, the `--ease-out` curve).

**Phone:** works as is. Check the longest word still fits the line at 360px.

**Reduced motion:** no cycling; the first word shows and the screen-reader copy lists them all.
