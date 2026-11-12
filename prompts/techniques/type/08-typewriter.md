Adapted from MotionSites type-and-text-motion.md #8 (MIT).

# Typewriter with zero-reflow caret and two-tone text

A short line types itself out with a blinking caret, optionally switching colour mid-sentence, then quick-reply pills
or an action appear. For a business that speaks to the customer directly (a booking desk, a contact page, a personal
service).

**Needs:** real reply options and contact details from the content data.

## Parameters
- **35-38 ms/char**, start delay **400-600 ms**. The caret disappears when typing ends. Keep the line short enough to
  finish within about 2 s.
- Caret: `2px x 1.1em`, `currentColor` or `var(--accent)`, `blink 1s step-end infinite`; `margin-right:-2px` cancels its
  own width so it never pushes a word to the next line.
- **Zero reflow:** the untyped remainder is rendered `color: transparent`, so the block holds its final size and line
  breaks from frame one. `white-space: pre-wrap` supports `\n`.
- Two-tone: split at a character index (e.g. first ~60% in `--ink`, the rest in `--muted`), good over a split-tone
  background. Keep the second tone at full contrast.
- Follow-ups: an action at typing end + ~200 ms; or reply pills at 400 ms (`opacity + translateY(8px)`, 0.4 s).
  Pills: `--surface` ground, `--ink` text, 1px `--line` border, 13-15px, `padding:.3em 1.25em`; hover inverts over
  200 ms. Each pill does something real: open WhatsApp with a pre-written message, jump to the form, copy the email.
- Large contact-headline version: 48 -> 76 px, `line-height 1.08`, tight tracking.

## Code
```html
<div class="persona">
  <p class="tw" data-text="[placeholder: one short line in the client's voice]" data-split="17"></p>
  <div class="replies">
    <a class="reply" data-wa="[placeholder: pre-written message]">[placeholder: reply 1]</a>
    <a class="reply" href="#booking">[placeholder: reply 2]</a>
    <button class="reply reply--outline" data-copy="[placeholder: contact.email]">Email: <u>[placeholder: contact.email]</u></button>
  </div>
</div>
```
```css
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.persona{max-width:36rem;color:var(--ink)}
.tw{font:400 clamp(18px,4vw,26px)/1.33 var(--font-display);margin:0 0 24px;white-space:pre-wrap}
.tw__a{color:inherit}
.tw__b{color:var(--muted)}                 /* second tone */
.tw__rest{color:transparent}
.tw__caret{display:inline-block;width:2px;height:1.1em;margin-right:-2px;vertical-align:-.15em;
  background:var(--accent,currentColor);animation:tw-blink 1s step-end infinite}
.tw.is-done .tw__caret{display:none}
@keyframes tw-blink{0%,100%{opacity:1}50%{opacity:0}}
.replies{display:flex;flex-wrap:wrap;row-gap:4px;opacity:0;transform:translateY(8px);transition:opacity .4s var(--ease-out),transform .4s var(--ease-out)}
.replies.is-in{opacity:1;transform:none}
.reply{display:inline-flex;align-items:center;gap:10px;white-space:nowrap;border-radius:999px;cursor:pointer;min-height:44px;
  background:var(--surface);color:var(--ink);border:1px solid var(--line);font:clamp(13px,1.2vw,15px) var(--font-body);
  padding:.3em 1.25em;margin:0 .2em .4em;transition:background-color .2s,color .2s}
.reply:hover{background:var(--ink);color:var(--bg)}
.reply--outline{background:transparent;color:var(--ink);border-color:var(--ink)}
.reply--outline:hover{background:var(--ink);color:var(--bg)}
@media (prefers-reduced-motion:reduce){.tw__caret{animation:none}.replies{transition:none}}
```
```js
function typewriter(el, { speed = 36, startDelay = 500, onDone } = {}) {
  const text = el.dataset.text.replace(/\\n/g, '\n');
  const split = el.dataset.split ? +el.dataset.split : text.length;   // chars before split use tone A
  const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = text;
  const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
  vis.innerHTML = '<span class="tw__a"></span><span class="tw__b"></span><span class="tw__caret"></span><span class="tw__rest"></span>';
  el.replaceChildren(sr, vis);
  const [a, b, , rest] = vis.children;
  const paint = (n) => {
    const k = Math.min(n, split);
    a.textContent = text.slice(0, k);
    b.textContent = text.slice(k, n);
    rest.textContent = text.slice(n);
  };
  const finish = () => { el.classList.add('is-done'); onDone && onDone(); };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { paint(text.length); return finish(); }
  paint(0);
  setTimeout(() => {
    let n = 0;
    const id = setInterval(() => { paint(++n); if (n >= text.length) { clearInterval(id); finish(); } }, speed);
  }, startDelay);
}
typewriter(document.querySelector('.tw'));
setTimeout(() => document.querySelector('.replies').classList.add('is-in'), 400);
// or: typewriter(el, { onDone: () => setTimeout(() => cta.classList.add('is-in'), 200) });
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(a.dataset.wa)}`;  // number from content data
});
document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); b.dataset.state = 'copied'; } catch {}   // https or localhost only
}));
```

**Phone:** works as is; pills wrap and stay at least 44px tall.

**Reduced motion:** the full line shows at once, no caret blink.
