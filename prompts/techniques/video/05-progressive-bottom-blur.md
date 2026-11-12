Adapted from MotionSites video-and-media.md #5 (MIT).

# Progressive bottom blur (masked backdrop-filter)

Instead of darkening the footage, the bottom of the film goes out of focus and sharpens toward the middle: a camera-like
depth-of-field band that protects bottom-aligned titles and keeps the colours. Use it for bottom-anchored heroes over a
film or photo.

**Needs:** a film or photo behind bottom-aligned copy.

**Parameters:** blur 24px, mask `linear-gradient(to top, #000 0%, transparent 45%)`, no colour overlay. The stepped
version stacks 2 / 4 / 8 / 16px layers with shrinking masks so the blur builds toward the bottom.

```html
<div class="bottom-blur" aria-hidden="true"></div>
<!-- or: <div class="pblur" aria-hidden="true"><i></i><i></i><i></i><i></i></div> -->
```
```css
.bottom-blur{position:absolute;inset:0;z-index:1;pointer-events:none;
  -webkit-backdrop-filter:blur(24px);backdrop-filter:blur(24px);
  -webkit-mask-image:linear-gradient(to top,#000 0%,transparent 45%);mask-image:linear-gradient(to top,#000 0%,transparent 45%)}
/* Smoother stepped version */
.pblur{position:absolute;left:0;right:0;bottom:0;height:55%;z-index:1;pointer-events:none}
.pblur>i{position:absolute;inset:0}
.pblur>i:nth-child(1){-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);-webkit-mask-image:linear-gradient(to top,#000,transparent 100%);mask-image:linear-gradient(to top,#000,transparent 100%)}
.pblur>i:nth-child(2){-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);-webkit-mask-image:linear-gradient(to top,#000,transparent 75%);mask-image:linear-gradient(to top,#000,transparent 75%)}
.pblur>i:nth-child(3){-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);-webkit-mask-image:linear-gradient(to top,#000,transparent 50%);mask-image:linear-gradient(to top,#000,transparent 50%)}
.pblur>i:nth-child(4){-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);-webkit-mask-image:linear-gradient(to top,#000,transparent 25%);mask-image:linear-gradient(to top,#000,transparent 25%)}
```
This is a static blur on the media layer, not a text entrance. Don't let it soften the subject itself: keep it below the
subject's lower edge.

**Phone:** `backdrop-filter` over a full-screen film is heavy on low-end phones. Below 768px use the single-layer
`.bottom-blur`, not the stepped `.pblur`.

**Reduced motion:** static; nothing to change.
