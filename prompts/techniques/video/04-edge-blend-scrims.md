Adapted from MotionSites video-and-media.md #4 (MIT).

# Edge-blend scrims over video

Gradients that melt a film into the page colour and keep text legible, without a flat dark tint that kills the footage:
an eased bottom fade that doubles as the join to the next section; side letterboxing when the film has a capped width
on wide screens; a directional scrim on portrait where text sits over the busiest part of the frame.

**Needs:** a film or photo behind copy.

**Parameters**
- Eased bottom fade that starts late (about 79%) with many stops; a 2-stop gradient bands and looks cheap: 0 @78.8% → .23 @79.6 → .45 @81.4 → .75 @83.3 → .84 @85.2 → .888 @88 → .905 @91 → .96 @95 → 1 @100.
- Simple scrims (pick one, keep it subtle):
  - bottom fade into the page: 12-16rem tall, `linear-gradient(to top, var(--bg), transparent)`;
  - top fade under a transparent header: about 25vh, `linear-gradient(var(--bg), transparent)`;
  - full vertical: `rgba(0,0,0,.30) → transparent 45% → rgba(0,0,0,.60)`;
  - flat dim: .20 hero, .45 action band;
  - light theme: `linear-gradient(to top, var(--bg) 0%, color-mix(in srgb, var(--bg) 80%, transparent) 50%, transparent 100%)` behind bottom copy.
- Side letterbox: solid page colour beyond the film's edges, feathered over about 70px.
- Portrait text scrim: left→right .86 → .66 @42% → .20 @78% → .10; top→bottom .72 → .34 @24% → .34 @56% → .80 @82% → .97 @94% → 1.
- Media cards: `to top`, black 60% → transparent at 50%.
- Fade into the exact page colour (`var(--bg)`), never a different black, or the seam shows.
- **No scrim** is often strongest: film at 100%, copy where the frame is naturally dark. Choose footage with a dark empty zone.

```css
:root{--video-half:746px}  /* half the rendered film width, if capped */
.plate{position:absolute;inset:0;overflow:hidden;background:var(--bg)}
.plate video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.plate::after{content:"";position:absolute;inset:0;pointer-events:none;background:
  linear-gradient(to bottom,
    transparent 78.8%,
    color-mix(in srgb,var(--bg) 23%,transparent) 79.6%,
    color-mix(in srgb,var(--bg) 45%,transparent) 81.4%,
    color-mix(in srgb,var(--bg) 75%,transparent) 83.3%,
    color-mix(in srgb,var(--bg) 84%,transparent) 85.2%,
    color-mix(in srgb,var(--bg) 88.8%,transparent) 88%,
    color-mix(in srgb,var(--bg) 90.5%,transparent) 91%,
    color-mix(in srgb,var(--bg) 96%,transparent) 95%,
    var(--bg) 100%),
  linear-gradient(to right,
    var(--bg) calc(50% - var(--video-half)), transparent calc(50% - var(--video-half) + 70px),
    transparent calc(50% + var(--video-half) - 70px), var(--bg) calc(50% + var(--video-half)))}
/* Portrait: copy over the frame -> directional legibility scrim */
@media (max-aspect-ratio:11/10){
  .plate video{object-position:43% center}
  .plate::after{background:
    linear-gradient(to right,
      color-mix(in srgb,var(--bg) 86%,transparent),
      color-mix(in srgb,var(--bg) 66%,transparent) 42%,
      color-mix(in srgb,var(--bg) 20%,transparent) 78%,
      color-mix(in srgb,var(--bg) 10%,transparent)),
    linear-gradient(to bottom,
      color-mix(in srgb,var(--bg) 72%,transparent),
      color-mix(in srgb,var(--bg) 34%,transparent) 24%,
      color-mix(in srgb,var(--bg) 34%,transparent) 56%,
      color-mix(in srgb,var(--bg) 80%,transparent) 82%,
      color-mix(in srgb,var(--bg) 97%,transparent) 94%,
      var(--bg))}
}
/* Simple scrims */
.scrim-vertical{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,.3),transparent 45%,rgba(0,0,0,.6))}
.fade-bottom{position:absolute;left:0;right:0;bottom:0;height:16rem;pointer-events:none;background:linear-gradient(to top,var(--bg),transparent)}
.fade-top{position:absolute;left:0;right:0;top:0;height:25vh;pointer-events:none;background:linear-gradient(var(--bg),transparent)}
/* Media card scrim */
.media-card{position:relative;overflow:hidden}
.media-card::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,rgb(0 0 0/.6),transparent 50%)}
```

**Phone:** the portrait scrim switches on by aspect ratio. Check the copy is still clear of the subject.

**Reduced motion:** static; nothing to change.
