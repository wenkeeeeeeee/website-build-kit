Adapted from MotionSites type-and-text-motion.md #7 (MIT).

# Scramble / decode text (entrance + hover)

Characters resolve from random glyphs left to right, like a terminal decoding: on entrance for headline lines, on hover
for nav links and buttons. For tech, engineering and data businesses set in monospace; out of place for food, care,
craft or heritage brands.

**Needs:** a monospace face that suits the client (`var(--font-mono)`).

## Parameters
- Glyph set `A-Z a-z 0-9 !@#$%^&*()_+~|}{[]:;?><`.
- Entrance: tick **25 ms**, the reveal cursor advances **0.5 chars/tick**; up to **3** random glyphs run ahead of it
  and nothing beyond (the text grows). Spaces stay spaces. Line delays e.g. 200 / 500 / 700 / 1000 ms.
- Hover: everything scrambles, then resolves at **4 ticks per char**; leaving snaps back at once.
- Monospace keeps glyph widths constant, so nothing jitters. Reserve each line's width (`display:inline-block;
  min-width: Nch`) so the growing entrance never reflows its neighbours.
- Pair with a body line that simply rises (y 25 -> 0, 0.9 s, `var(--ease-out)`, 0.2 s delay).

## Code
```css
.mono{font-family:var(--font-mono);color:var(--ink)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
[data-scramble]{display:inline-block}   /* plus min-width: Nch per line */
```
```js
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';
const randGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

function scrambleIn(el, { delay = 0, speed = 0.5, lookahead = 3, tick = 25 } = {}) {
  const text = el.textContent;
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
  el.after(sr); el.setAttribute('aria-hidden', 'true');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.textContent = ' ';
  setTimeout(() => {
    let pos = 0;
    const id = setInterval(() => {
      pos += speed;
      const shown = Math.floor(pos);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i >= shown + lookahead) break;
        out += text[i] === ' ' ? ' ' : i < shown ? text[i] : randGlyph();
      }
      el.textContent = out || ' ';
      if (shown >= text.length) { clearInterval(id); el.textContent = text; }
    }, tick);
  }, delay);
}
function scrambleOnHover(el, { framesPerChar = 4, tick = 25 } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!matchMedia('(hover: hover)').matches) return;          // touch: no hover version
  const text = el.textContent; let id = 0;
  el.addEventListener('mouseenter', () => {
    let frame = 0; clearInterval(id);
    id = setInterval(() => {
      const revealed = Math.floor(frame / framesPerChar);
      el.textContent = [...text].map((c, i) => (c === ' ' ? ' ' : i < revealed ? c : randGlyph())).join('');
      if (revealed >= text.length) { clearInterval(id); el.textContent = text; }
      frame++;
    }, tick);
  });
  el.addEventListener('mouseleave', () => { clearInterval(id); el.textContent = text; });
}
document.querySelectorAll('[data-scramble]').forEach((el) => scrambleIn(el, { delay: +(el.dataset.delay || 0) }));
document.querySelectorAll('[data-scramble-hover]').forEach((el) => scrambleOnHover(el));
```
```html
<h1 class="mono"><span data-scramble data-delay="200">Line one</span><br><span data-scramble data-delay="500">Line two</span></h1>
<a href="#about"><span data-scramble-hover>About</span></a>
```

**Phone:** the entrance plays as on desktop. Hover scramble is off on touch; give the link a press state instead (a
short scramble on `pointerdown` that resolves before navigation, or a plain colour flip).

**Reduced motion:** text shows at once, no scramble.
