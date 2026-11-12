Adapted from MotionSites video-and-media.md #6 (MIT).

# Cursor-scrubbed video (delta scrub, split dual-video)

A paused clip whose timeline follows horizontal mouse movement: a product turns on a turntable, a lid opens, a head
turns. It feels like a live 3D object without WebGL. On touch, scroll drives the same timeline instead.
- **A. Delta scrub:** relative horizontal movement moves the playhead forward or back.
- **B. Split dual-video:** two clips; left of centre scrubs clip A, right of centre scrubs clip B; a dead zone at the centre holds frame 0.

**Needs:** a turntable or opening clip of the client's real product (one for A, two for B), one slow continuous move.

**Parameters**
- Sensitivity 0.8: crossing the full viewport width scrubs 80% of the clip. `Δt = (Δx / innerWidth) × 0.8 × duration`, clamped to `[0, duration]`. Relative mapping, so the first mouse move never jumps.
- **Seek queue:** never set `currentTime` while a seek is in flight. Store the target; on `seeked`, seek again only if the target moved. Without this the decoder floods and the image freezes.
- Split: dead zone `max(30px, width × 0.05)` each side of centre; progress = distance past the dead-zone edge ÷ remaining half-width; keep showing the last active side inside the dead zone.
- Mouse mode from 1024px on hover devices. Below that, or on touch, scroll through the hero scrubs the clip (never an autoplay loop).
- `muted playsinline preload="auto"`, no autoplay, `object-position: 70% center`.
- Encode with tiny GOPs so seeks land instantly (the difference between silky and steppy):
  `ffmpeg -i in.mp4 -an -c:v libx264 -crf 20 -g 6 -keyint_min 6 -pix_fmt yuv420p -movflags +faststart scrub.mp4` (`-g 1` = all-intra, silkiest; check size).
- Keep the clip inside the home-page film budget (under 4 MB), then load it fully before scrubbing so every seek is local: `fetch(url).then(r => r.blob()).then(b => { video.src = URL.createObjectURL(b); })`.
- The clip counts toward the 3-videos-per-page limit (B uses two).

**A. Delta scrub**
```html
<section class="scrub-hero">
  <video class="scrub-video" muted playsinline preload="auto" poster="img/turn-poster.jpg" src="videos/turn.mp4" aria-hidden="true"></video>
  <div class="scrub-hero__copy">…</div>
</section>
```
```css
.scrub-hero{position:relative;min-height:100vh;min-height:100svh;overflow:hidden;background:var(--bg)}
.scrub-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:70% center;z-index:0}
.scrub-hero__copy{position:relative;z-index:1}
```
```js
// One seek queue, used by both mouse and scroll.
function seekQueue(video) {
  let target = 0, busy = false;
  const flush = () => {
    if (Math.abs(video.currentTime - target) < 1 / 60) { busy = false; return; }
    busy = true;
    video.currentTime = target;              // 'seeked' fires when the frame is decoded
  };
  video.addEventListener('seeked', flush);
  return { set(t) { target = Math.max(0, Math.min(video.duration || 0, t)); if (!busy) flush(); }, get: () => target };
}

function cursorScrubVideo(video, section, { sensitivity = 0.8, query = '(min-width: 1024px) and (hover: hover)' } = {}) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // poster stays
  const mq = matchMedia(query);
  const q = seekQueue(video);
  let prevX = null;
  video.muted = true; video.playsInline = true; video.loop = false; video.pause();

  addEventListener('mousemove', (e) => {
    if (!mq.matches || !video.duration) return;
    if (prevX === null) { prevX = e.clientX; return; }
    const dx = e.clientX - prevX; prevX = e.clientX;
    q.set(q.get() + (dx / innerWidth) * sensitivity * video.duration);
  }, { passive: true });

  // Touch and small screens: scroll through the section drives the timeline.
  let ticking = false;
  const onScroll = () => {
    if (mq.matches || ticking || !video.duration) return;
    ticking = true;
    requestAnimationFrame(() => {
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight * 0.5)));
      q.set(p * (video.duration - 0.05));
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
}
cursorScrubVideo(document.querySelector('.scrub-video'), document.querySelector('.scrub-hero'));
```
For a longer touch scrub, make the section 150-200vh with the film `position: sticky; top: 0; height: 100svh`, or use the
kit's `scrub.js` with frames from `frames.py`.

**B. Split dual-video with dead zone**
```html
<div class="dual" aria-hidden="true">
  <video class="dual__v" id="vidA" src="videos/turn-a.mp4" muted playsinline preload="auto" poster="img/turn-a.jpg"></video>
  <video class="dual__v" id="vidB" src="videos/turn-b.mp4" muted playsinline preload="auto"></video>
</div>
```
```css
.dual{position:absolute;inset:0;z-index:0;opacity:0;transition:opacity .3s var(--ease-out);pointer-events:none;overflow:hidden}
.dual.is-ready{opacity:1}
.dual__v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
```
```js
(() => {
  const wrap = document.querySelector('.dual');
  const A = document.getElementById('vidA'), B = document.getElementById('vidB');
  const show = (v) => { A.style.visibility = v === A ? 'visible' : 'hidden'; B.style.visibility = v === B ? 'visible' : 'hidden'; };
  Promise.all([A, B].map((v) => (v.readyState >= 2 ? 0 : new Promise((r) => v.addEventListener('loadeddata', r, { once: true })))))
    .then(() => wrap.classList.add('is-ready'));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none)').matches) {
    show(A); return;      // touch: clip A's first frame, or scroll-scrub A with cursorScrubVideo's scroll branch
  }
  let mouseX = innerWidth / 2, active = B;
  show(active);
  addEventListener('mousemove', (e) => { mouseX = e.clientX; }, { passive: true });
  (function frame() {
    const w = innerWidth, c = w / 2, dz = Math.max(30, w * 0.05);
    let p = -1;
    if (mouseX < c - dz)      { active = A; p = (c - dz - mouseX) / (c - dz); }
    else if (mouseX > c + dz) { active = B; p = (mouseX - c - dz) / (w - c - dz); }
    show(active);
    if (active.duration && !active.seeking) {        // never seek while seeking
      const t = p < 0 ? 0 : Math.min(1, p) * (active.duration - 0.05);
      if (Math.abs(active.currentTime - t) > 0.02) active.currentTime = t;
    }
    requestAnimationFrame(frame);
  })();
})();
```
Pause the rAF loop when the hero is off screen (IntersectionObserver), as `film-control.js` does for films.

**Phone:** scroll scrubs the clip through the hero (A), or B shows clip A and can scrub it on scroll. Never fall back to
an autoplay loop. Keep the copy clear of the subject.

**Reduced motion:** the poster frame stays as a still. The mouse scrub is user-driven, so you may drop the early return
to keep it for fine pointers.
