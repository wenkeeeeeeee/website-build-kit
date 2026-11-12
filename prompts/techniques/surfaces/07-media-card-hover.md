Adapted from MotionSites surfaces-and-buttons.md #7 (MIT).

# Media card hover: icon-to-label pill and zoom

Cards for work, projects, rooms or products. On hover a small round icon in the corner opens into a labelled pill
("View project"), and the image zooms 5%. Clean at rest, a clear response on hover. Cards suit things people compare;
elsewhere prefer photos that bleed, overlap or take the client's shape (taste.md, "Boxes and lines").

**Needs:** the client's photos (one per card). A clip only if it fits the page's video budget (below).

## Parameters
- Pill: a 36px circle that opens to **148-168px** by animating `clip-path` (not width) over 0.3s `var(--ease-in-out)`;
  the label fades in with a **100ms** delay; the icon turns `rotate(-45deg) -> 0`. Light pill on dark media, `--ink`
  pill on light media.
- Media: `aspect-ratio` per card (e.g. `329/246`, `1/1`), radius 16px, a placeholder background close to the photo's
  average colour; zoom `scale(1.05)` over 0.7s `var(--ease-out)`. Only when the source is at least 1.2x its display
  size, so the zoom stays sharp.
- Below the card: description 13-14px in `--muted`, title 14-15px semibold, `margin-top 16px / 4px`.
- Optional wider grid: 12 columns, spans **7/5/5/7**, radius 24px with a 1px `--line` stroke, a halftone overlay at 20%
  (see `surfaces/08-texture-overlays.md`). Give at least one card an unusual crop or tilt so the grid isn't plain boxes.
- Video in cards: stills by default. A page has at most 3 videos with one playing at a time, so a card clip shows its
  poster and plays only while hovered, paused on leave. Never loop a short clip to fill time.

## Code
```html
<a class="mcard" href="work/project.html">
  <div class="mcard__media" style="aspect-ratio:329/246;background:var(--surface)">
    <img src="img/project.webp" alt="Finished kitchen, oak and steel" loading="lazy">
    <span class="mcard__pill">
      <svg class="mcard__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      <span class="mcard__label">View project</span>
    </span>
  </div>
  <p class="mcard__desc">One line on what was done.</p>
  <h3 class="mcard__title">Project name</h3>
</a>
```
```css
.mcard{display:block;color:inherit;text-decoration:none}
.mcard__media{position:relative;border-radius:16px;overflow:hidden}
.mcard__media img,.mcard__media video{display:block;width:100%;height:100%;object-fit:cover;
  transition:transform .7s var(--ease-out)}
.mcard:hover .mcard__media img,.mcard:hover .mcard__media video,
.mcard:focus-visible .mcard__media img{transform:scale(1.05)}
.mcard__pill{position:absolute;left:16px;bottom:16px;height:36px;width:148px;border-radius:999px;
  background:var(--surface);color:var(--ink);display:flex;align-items:center;white-space:nowrap;
  clip-path:inset(0 calc(100% - 36px) 0 0 round 18px);
  transition:clip-path .3s var(--ease-in-out)}
.mcard:hover .mcard__pill,.mcard:focus-visible .mcard__pill{clip-path:inset(0 0 0 0 round 18px)}
.mcard__icon{flex:none;width:36px;transform:rotate(-45deg);transition:transform .3s var(--ease-in-out)}
.mcard:hover .mcard__icon,.mcard:focus-visible .mcard__icon{transform:none}
.mcard__label{font:500 13px/1 var(--font-body);opacity:0;transition:opacity .2s var(--ease-out)}
.mcard:hover .mcard__label,.mcard:focus-visible .mcard__label{opacity:1;transition-delay:.1s}
.mcard__desc{margin:16px 0 0;font:400 14px/1.6 var(--font-body);color:var(--muted)}
.mcard__title{margin:4px 0 0;font:600 15px/1.3 var(--font-body);color:var(--ink)}
.mcard:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:16px}

/* wider grid */
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
.bento>*:nth-child(4n+1),.bento>*:nth-child(4n+4){grid-column:span 7}
.bento>*:nth-child(4n+2),.bento>*:nth-child(4n+3){grid-column:span 5}
@media (max-width:767px){.bento>*{grid-column:1 / -1}}

/* touch: show the open pill */
@media (hover:none){.mcard__pill{clip-path:inset(0 0 0 0 round 18px)}.mcard__label{opacity:1}.mcard__icon{transform:none}}
@media (prefers-reduced-motion:reduce){
  .mcard__media img,.mcard__media video,.mcard__pill,.mcard__icon,.mcard__label{transition:none}
}
```
```js
// Optional: a card clip plays only while hovered (poster otherwise). Count it toward the page's 3-video limit.
document.querySelectorAll('.mcard video').forEach((v) => {
  v.preload = 'none'; v.muted = true; v.playsInline = true;
  const card = v.closest('.mcard');
  card.addEventListener('pointerenter', () => { if (matchMedia('(hover:hover)').matches) v.play().catch(() => {}); });
  card.addEventListener('pointerleave', () => v.pause());
});
```

**Phone:** the pill shows open with its label, and the press gives a quick `scale(.98)` on the card. No zoom.

**Reduced motion:** the pill and zoom change instantly; card clips stay on their poster.
