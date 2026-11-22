Adapted from MotionSites layout-and-ui.md #1 (MIT).

# Hero composition patterns

Ways to place copy over a full-bleed visual so the subject stays the biggest thing on screen. Pick by how much of the
visual must stay clear. Avoid dead-centre copy, the weakest default. The headline always sits in the scene, never in a
column beside a picture. Where the words sit is part of each variant's look: no two variants of one client use the
same pattern, and the short line and button go wherever the visual leaves calm space, not always bottom-left.

**Needs:** one full-bleed visual of the real subject (film, scrubbed frames, 3D or a sharp photo) with a calm area for
the copy.

## The patterns

- **A. Bottom-anchored centre stack.** Page grid `auto 1fr auto` (header / hero / bottom row). The hero uses
  `align-items:flex-end` with a large bottom gap, so the top two-thirds of the visual stay clean. The bottom row holds
  the short line and the button (`space-between`), a column on phones. No facts row or stats in the hero ("The hero" in
  `office/taste.md`); they go right below.
- **B. Bottom-left editorial.** Copy `position:absolute; bottom:0; left:0`, `max-width 42rem`. H1 at the level's scale
  (`office/craft-numbers.md`), tight. Sub line in `--muted`, 14px, `max-width 28rem`. One solid button (no glass).
- **C. Split top/bottom (`justify-content: space-between`).** Headline across the top; one line and the action
  bottom-right; height `calc(100svh - header)`. A magazine cover, the subject filling the middle.
- **E. Four-corner HUD.** Header top, centred headline in the top third, the short line and one button
  bottom-left, the bottom-right corner left clear. Text colour flips per breakpoint to match the
  visual behind it.
- **H. Ghost-type stage.** A giant word behind a cut-out subject (type/11-giant-type.md): the short line and one button
  centred under the subject, or in whichever corner stays clear.

## Code

```css
/* A. Bottom-anchored centre stack */
.page{position:relative;z-index:1;display:grid;grid-template-rows:auto 1fr auto;min-height:100vh;min-height:100svh}
.hero{display:flex;align-items:flex-end;justify-content:center;
  padding:8px 24px var(--hero-gap,clamp(36px,12vh,96px));text-align:center}
.hero-copy{display:flex;flex-direction:column;align-items:center;max-width:860px;width:100%}
.hero-foot{display:flex;align-items:center;justify-content:space-between;gap:24px;
  color:var(--muted);font:400 15px/1.4 var(--font-body);
  padding:0 clamp(20px,5vw,72px) max(4vh,env(safe-area-inset-bottom))}
@media (max-width:900px){
  .hero{padding:20px 20px clamp(32px,9vh,64px)}
  .hero-foot{flex-direction:column;gap:12px;padding:0 20px max(3vh,env(safe-area-inset-bottom))}
}

/* B. Bottom-left editorial */
.hero-b{position:relative;min-height:100svh}
.hero-b .copy{position:absolute;left:0;bottom:clamp(40px,8vh,64px);max-width:42rem;padding:0 clamp(24px,4vw,48px)}
.hero-b h1{margin:0;font:600 clamp(56px,7vw,120px)/.95 var(--font-display);letter-spacing:-.03em;color:var(--ink)}
.hero-b p{max-width:28rem;font:400 14px/1.5 var(--font-body);color:var(--muted)}

/* C. Split top/bottom */
.hero-c{display:flex;flex-direction:column;justify-content:space-between;
  height:calc(100svh - var(--header-h,72px));padding:4vh clamp(24px,4vw,48px) 6vh}

/* E. Four-corner HUD */
.hero-e{position:relative;min-height:100svh;display:grid;grid-template-rows:1fr auto;padding:12vh clamp(20px,4vw,48px) 5vh}
.hero-e h1{align-self:start;justify-self:center;text-align:center}
.hero-e .corner-bl{grid-row:2;justify-self:start;max-width:24rem}
.hero-e .corner-br{grid-row:2;justify-self:end;display:inline-flex;align-items:center;gap:10px;color:var(--ink)}
.hero-e .play{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:var(--bg)}
```

The bottom row holds only the short line and the one button, from content data:
```html
<footer class="hero-foot">
  <p data-from="hero.line">[placeholder]</p>
  <a class="btn" href="#order" data-from="hero.action">[placeholder]</a>
</footer>
```

**Phone:** the visual comes first or sits behind the words, headline and button clear of the subject. A and B keep their
low copy; C and E stack into one bottom block; H keeps the giant word but drops the corner word below 600px.

**Reduced motion:** static layouts. Any entrance you add ends in this finished state.
