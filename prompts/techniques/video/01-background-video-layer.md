Adapted from MotionSites video-and-media.md #1 (MIT).

# Cinematic background video layer

A muted full-bleed film fills the hero and the UI floats over it. The footage gives all the depth, so no decorative blobs.
Use it when the client's own film carries the mood. Pick one scrim from `04-edge-blend-scrims.md`, or none when the frame has calm dark space behind the copy.

**Needs:** a film from the client (or a free AI tool), encoded with `film.py`, plus a poster and a separate still for reduced motion.

**Parameters**
- Absolute, `object-fit: cover`. The section background is the colour of the film's edges, so nothing flashes before the first frame.
- `muted autoplay playsinline` and `video.muted = true` as a property too (iOS needs all of them).
- `object-position: 70% center` (or wherever the subject is) so portrait crops keep the subject.
- Entrance: opacity 0 → 1 over 1.8s on `var(--ease-out)`. Optional settle `scale(1.05) → 1`: only when the source is at least 1.2x its display size.
- Or a delayed reveal: keep the poster during the headline intro and fade the film in at about 2.8s.
- Pause off screen (IntersectionObserver).
- Loop only a long film whose ends match. Never loop a short clip: let it end on its last frame, or scrub it over scroll with `scrub.js`. A loop past 5s needs a pause button (`film-control.js`).
- Serving (playbook): a 1280 mp4 for screens up to 1100px, a 1920 webm + mp4 above, `preload="auto"` on this first film only, `preload="none"` on any film below it. Home-page film total under 4 MB, at most 3 videos per page.

```html
<section class="vhero">
  <video class="vhero__media vhero__media--settle" poster="img/hero-poster.jpg"
         muted playsinline preload="auto" aria-hidden="true">
    <source src="videos/hero-1280.mp4" type="video/mp4" media="(max-width: 1100px)">
    <source src="videos/hero-1920.webm" type="video/webm">
    <source src="videos/hero-1920.mp4" type="video/mp4">
  </video>
  <img class="vhero__still" src="img/hero-still.jpg" alt="" aria-hidden="true">
  <div class="vhero__content">…headline set into the scene, one line, one action…</div>
</section>
```
```css
.vhero{position:relative;min-height:100vh;min-height:100svh;overflow:hidden;background:var(--bg);isolation:isolate;color:var(--on-media, #fff)}
.vhero__media,.vhero__still{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% center;z-index:-2;pointer-events:none}
.vhero__still{display:none}
.vhero__media--settle{opacity:0;transform:scale(1.05);transition:opacity 1.8s var(--ease-out),transform 1.8s var(--ease-out)}
.vhero__media--settle.is-ready{opacity:1;transform:none}
.vhero__content{position:relative;min-height:inherit;display:flex;flex-direction:column;padding-block:clamp(2rem,10vh,7rem)}
@media (prefers-reduced-motion:reduce){
  .vhero__media{display:none}
  .vhero__still{display:block}
}
```
Drop the `scale(1.05)` (keep only the opacity fade) when the source is not at least 1.2x its display size.

```js
function mountVideo(video, { revealDelay = 0, loop = false } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { video.pause(); return; } // the still shows instead
  video.muted = true;            // some browsers ignore the attribute for autoplay
  video.playsInline = true;
  video.loop = loop;             // true only for a long film with matching ends
  const reveal = () => setTimeout(() => video.classList.add('is-ready'), revealDelay);
  video.readyState >= 2 ? reveal() : video.addEventListener('loadeddata', reveal, { once: true });
  video.play().catch(() => {});  // autoplay can be refused (low-power mode): the poster remains
  new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()))
    .observe(video);
}
mountVideo(document.querySelector('.vhero__media'));
// Delayed reveal, letting the headline intro own the first ~3s:
// mountVideo(el, { revealDelay: 2800 });
```

**Phone:** use `100svh` with a `100vh` fallback so browser chrome doesn't crop. The 1280 source serves phones. Re-check the focal point at 375x812 and change `object-position` per breakpoint. The subject stays the biggest thing, with the headline and button clear of it.

**Reduced motion:** the film is hidden and the separate still shows. Nothing waits on the film.
