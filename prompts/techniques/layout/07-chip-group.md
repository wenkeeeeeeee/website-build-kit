Adapted from MotionSites layout-and-ui.md #7 (MIT).

# Selectable chip group with check and summary

Services or interests as multi-select pills instead of checkboxes. A picked chip fills and a check pops in; below, a
summary ("You're asking about: A, B") appears with the action. For enquiry and quote forms, booking choices and filters
(a choice of 2-6 options). Nothing changes height: the check slot and summary space are reserved, and only opacity,
transform and clip-path move.

**Needs:** the client's real list of services or options (from content data).

## Values
- Inactive: `--surface` fill, `--ink` text, hairline `--line` border, hover tint. Active: `--ink` fill, `--bg` text,
  very soft shadow.
- Check: scale 0 → 1 with a slight rotate, ~0.4s on `--ease-out` (playful tone only: overshoot
  `cubic-bezier(.34,1.56,.64,1)`). Its 14px slot is always there, so chips never change width or reflow the row.
- Summary: the empty hint (12px, 50%) and the panel share one fixed-height grid cell. On the first pick the hint fades
  out and the panel wipes in (`clip-path` + `translateY`), so the page below never shifts.
- Copy: a short question as the title, "Select all that apply" in `--muted`.
- `aria-pressed` on the buttons, `aria-live="polite"` on the summary.
- The action fills the quote form or the WhatsApp message with the picks ("Add to my quote"), not a dead link.

## Code
```html
<fieldset class="chips">
  <legend>What do you need?</legend>
  <p class="hint">Select all that apply</p>
  <div class="chip-row">
    <!-- one per option from content data -->
    <button type="button" class="chip" aria-pressed="false">Option one<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></button>
    <button type="button" class="chip" aria-pressed="false">Option two<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></button>
    <button type="button" class="chip" aria-pressed="false">Option three<svg class="check" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></button>
  </div>
  <div class="summary" aria-live="polite">
    <p class="summary-empty">Pick one or more above.</p>
    <div class="summary-box">
      <span class="summary-text"></span><a class="summary-go" href="#quote">Add to my quote →</a>
    </div>
  </div>
</fieldset>
```
```css
.chips{border:0;margin:0;padding:0;color:var(--ink)}
.chips legend{padding:0;font:500 24px/1.2 var(--font-display);letter-spacing:-.02em;margin-bottom:8px}
.hint{margin:0 0 3vh;color:var(--muted)}
.chip-row{display:flex;flex-wrap:wrap;gap:10px}
.chip{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:10px 14px 10px 20px;border-radius:999px;cursor:pointer;
  font:500 15px/1 var(--font-body);background:var(--surface);color:var(--ink);border:1px solid var(--line);
  transition:background-color .2s var(--ease-out),color .2s var(--ease-out),border-color .2s var(--ease-out),box-shadow .2s var(--ease-out),transform .15s var(--ease-out)}
.chip:hover{background:color-mix(in srgb,var(--ink) 6%,var(--surface))}
.chip:active{transform:scale(.96)}
.chip:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.chip[aria-pressed=true]{background:var(--ink);color:var(--bg);border-color:var(--ink);box-shadow:0 4px 6px -1px rgb(0 0 0/.06)}
.chip .check{width:14px;height:14px;flex:none;opacity:0;transform:scale(0) rotate(-45deg);
  fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round;stroke-linejoin:round;
  transition:opacity .2s var(--ease-out),transform .45s var(--ease-out)}
.chip[aria-pressed=true] .check{opacity:1;transform:none}
.summary{display:grid;margin-top:20px}
.summary>*{grid-area:1/1}                       /* hint and panel share one cell: no height change */
.summary-empty{margin:0;align-self:center;font-size:12px;opacity:.5;transition:opacity .25s var(--ease-out)}
.summary-box{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;
  background:var(--surface);border:1px solid var(--line);border-radius:16px;
  opacity:0;transform:translateY(8px);clip-path:inset(0 0 100% 0 round 16px);visibility:hidden;
  transition:opacity .4s var(--ease-out),transform .4s var(--ease-out),clip-path .4s var(--ease-out),visibility 0s .4s}
.summary.has .summary-empty{opacity:0}
.summary.has .summary-box{opacity:1;transform:none;clip-path:inset(0 0 0 0 round 16px);visibility:visible;transition-delay:0s}
.summary-go{color:var(--accent);font:600 12px/1 var(--font-body);letter-spacing:.06em;text-transform:uppercase;text-decoration:none;white-space:nowrap}
@media (prefers-reduced-motion:reduce){.chip,.chip .check,.summary-empty,.summary-box{transition:none}}
```
```js
(function chipGroup(root) {
  const chips = [...root.querySelectorAll('.chip')];
  const summary = root.querySelector('.summary');
  const text = root.querySelector('.summary-text');
  const update = () => {
    const picked = chips.filter((c) => c.getAttribute('aria-pressed') === 'true').map((c) => c.textContent.trim());
    summary.classList.toggle('has', picked.length > 0);
    if (picked.length) text.textContent = `You're asking about: ${picked.join(', ')}`;
    root.dispatchEvent(new CustomEvent('chips:change', { detail: picked }));   // fill the form / WhatsApp message
  };
  chips.forEach((c) => c.addEventListener('click', () => {
    c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'));
    update();
  }));
})(document.querySelector('.chips'));
```
If the summary can wrap to two lines on a phone, give `.summary` a `min-height` that fits two lines.

**Phone:** chips wrap and stay 44px tall; the summary action sits under the text (`flex-direction: column;
align-items: flex-start` below 480px).

**Reduced motion:** picks and the summary switch instantly; nothing moves.
