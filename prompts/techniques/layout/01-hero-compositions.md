Adapted from MotionSites layout-and-ui.md #1 (MIT).

# Hero composition patterns

Ways to place copy over a full-bleed visual so the subject stays the biggest thing on screen. Pick by how much of the
visual must stay clear. Avoid dead-centre copy, the weakest default. The headline always sits in the scene, never in a
column beside a picture.

**Needs:** one full-bleed visual of the real subject (film, scrubbed frames, 3D or a sharp photo) with a calm area for
the copy.

## The patterns

- **A. Bottom-anchored centre stack + facts line.** Page grid `auto 1fr auto` (header / hero / facts). The hero uses
  `align-items:flex-end` with a large bottom gap, so the top two-thirds of the visual stay clean. The bottom row is one
  line of facts (`space-between`), a column on phones. Not a big stats row: one small line of counts at most.
- **B. Bottom-left editorial.** Copy `position:absolute; bottom:0; left:0`, `max-width 42rem`. H1 36 → 60px, medium
  weight, tight. Sub line in `--muted`, 14px, `max-width 28rem`. Buttons: one solid, one outlined ghost (no glass).
- **C. Split top/bottom (`justify-content: space-between`).** Badge and headline top-left; one line and the action
  bottom-left; height `calc(100svh - header)`. A magazine cover, the subject filling the middle.
- **E. Four-corner HUD.** Header top, centred headline in the top third, short blurb + actions bottom-left, a
  "Watch the film · 1:35" link bottom-right with a 24px solid play disc. Text colour flips per breakpoint to match the
  visual behind it.
- **H. Ghost-type stage.** A giant word behind a cut-out subject (type/11-giant-type.md): short label top-left, copy and
  round arrow buttons bottom-left, a big condensed action word bottom-right.

## Code

```css
/* A. Bottom-anchored centre stack */
.page{position:relative;z-index:1;display:grid;grid-template-rows:auto 1fr auto;min-height:100vh;min-height:100svh}
.hero{display:flex;align-items:flex-end;justify-content:center;
  padding:8px 24px var(--hero-gap,clamp(36px,12vh,96px));text-align:center}
.hero-copy{display:flex;flex-direction:column;align-items:center;max-width:860px;width:100%}
.facts-line{display:flex;align-items:center;justify-content:space-between;gap:24px;
  color:var(--muted);font:400 13.5px/1.3 var(--font-body);letter-spacing:-.015em;
  padding:0 clamp(20px,5vw,72px) max(4vh,env(safe-area-inset-bottom))}
@media (max-width:900px){
  .hero{padding:20px 20px clamp(32px,9vh,64px)}
  .facts-line{flex-direction:column;gap:12px;padding:0 20px max(3vh,env(safe-area-inset-bottom))}
}

/* B. Bottom-left editorial */
.hero-b{position:relative;min-height:100svh}
.hero-b .copy{position:absolute;left:0;bottom:clamp(40px,8vh,64px);max-width:42rem;padding:0 clamp(24px,4vw,48px)}
.hero-b h1{margin:0;font:500 clamp(36px,4.2vw,60px)/1.02 var(--font-display);letter-spacing:-.03em;color:var(--ink)}
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

The facts line reads from content data; unknowns show as `[client to confirm]`:
```html
<footer class="facts-line">
  <span data-from="facts.0">[placeholder]</span>
  <span data-from="facts.1">[placeholder]</span>
  <span data-from="facts.2">[placeholder]</span>
</footer>
```

**Phone:** the visual comes first or sits behind the words, headline and button clear of the subject. A and B keep their
low copy; C and E stack into one bottom block; H keeps the giant word but drops the corner word below 600px.

**Reduced motion:** static layouts. Any entrance you add ends in this finished state.
