Adapted from MotionSites video-and-media.md #9 (MIT).

# Crossfading video scene switcher with adaptive text tone

Up to 3 of the client's scenes (rooms, branches, times of day, moods) with a row of named buttons; the chosen scene
crossfades in. An optional foreground cut-out (window frame, doorway, counter edge) sits on top with a gentle bob, as if
looking out from inside the place. Use it for "choose your atmosphere" heroes: a place to visit, a venue, a trip.

**Needs:** 2-3 long, seamless films of the client's real places (or one per scene), one poster each; optional clean
foreground cut-out PNG.

**Parameters**
- Max 3 scenes. Two `<video>` elements only (an A/B pair for the crossfade): the next scene's src is set on the hidden one, then it fades in. Only the first scene preloads (`preload="auto"`); the others load on first tap.
- Crossfade opacity 1000ms `var(--ease-in-out)`; lock input for the same 1000ms so taps can't stack. Pause the outgoing film after the fade.
- Each scene film is long with matching ends, or it ends on its last frame. Never loop a short clip. A loop past 5s needs a pause button (`film-control.js`).
- First film within the home-page film budget (under 4 MB); the switcher's two elements count toward the 3-videos-per-page limit.
- Foreground bob: `translateY(0 → -6px)` 3s `var(--ease-in-out)` infinite, constant `scale(1.03)` so edges never show (cut-out at least 1.2x its display size).
- Adaptive tone: when a bright scene is active, the hero copy switches to `var(--ink)` over 700ms; header and footer stay as they are.
- Buttons name the client's real scenes (branch names, rooms, times). Active = full colour + 1px underline; inactive opacity .5, hover .8. The result is the whole scene changing, so it is never a control that only reveals text.

```html
<section class="vswitch" data-tone="light">
  <div class="vswitch__media">
    <video class="is-active" src="videos/scene-1.mp4" poster="img/scene-1.jpg" muted playsinline preload="auto" aria-hidden="true"></video>
    <video muted playsinline preload="none" aria-hidden="true"></video>
  </div>
  <img class="vswitch__overlay" src="img/foreground-cutout.png" alt="" aria-hidden="true">
  <div class="vswitch__content">
    <h1>…</h1>
    <div class="vswitch__tabs" role="tablist" aria-label="Scene">
      <button role="tab" aria-selected="true"  data-src="videos/scene-1.mp4" data-poster="img/scene-1.jpg" data-tone="light">Scene one</button>
      <button role="tab" aria-selected="false" data-src="videos/scene-2.mp4" data-poster="img/scene-2.jpg" data-tone="light">Scene two</button>
      <button role="tab" aria-selected="false" data-src="videos/scene-3.mp4" data-poster="img/scene-3.jpg" data-tone="dark">Scene three</button>
    </div>
  </div>
</section>
```
```css
.vswitch{position:relative;height:100vh;height:100svh;overflow:hidden;background:var(--bg)}
.vswitch__media video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1s var(--ease-in-out)}
.vswitch__media video.is-active{opacity:1}
.vswitch__overlay{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;pointer-events:none;animation:bob 3s var(--ease-in-out) infinite}
@keyframes bob{0%,100%{transform:translateY(0) scale(1.03)}50%{transform:translateY(-6px) scale(1.03)}}
.vswitch__content{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;
  color:var(--on-media,#fff);transition:color .7s var(--ease-in-out)}
.vswitch[data-tone="dark"] .vswitch__content{color:var(--ink)}
.vswitch__tabs button{background:none;border:0;border-bottom:1px solid transparent;color:inherit;font:inherit;opacity:.5;
  min-height:44px;padding:6px 2px;cursor:pointer;transition:opacity .3s var(--ease-out),border-color .3s var(--ease-out)}
.vswitch__tabs button:hover{opacity:.8}
.vswitch__tabs button[aria-selected="true"]{opacity:1;border-bottom-color:currentColor}
@media (prefers-reduced-motion:reduce){.vswitch__overlay{animation:none;transform:scale(1.03)}.vswitch__media video{transition:none}}
```
```js
(() => {
  const root = document.querySelector('.vswitch');
  const [v0, v1] = root.querySelectorAll('.vswitch__media video');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let shown = v0, active = 0, locked = false;
  if (!reduce) v0.play().catch(() => {});
  new IntersectionObserver(([e]) => { if (reduce) return; e.isIntersecting ? shown.play().catch(() => {}) : shown.pause(); })
    .observe(root);
  tabs.forEach((tab, i) => tab.addEventListener('click', () => {
    if (i === active || locked) return;
    locked = true;
    const prev = shown, next = shown === v0 ? v1 : v0;
    next.poster = tab.dataset.poster; next.src = tab.dataset.src; next.preload = 'auto';
    const swap = () => {
      if (!reduce) next.play().catch(() => {});
      next.classList.add('is-active'); prev.classList.remove('is-active');
      tabs[active].setAttribute('aria-selected', 'false'); tab.setAttribute('aria-selected', 'true');
      root.dataset.tone = tab.dataset.tone || 'light';
      shown = next; active = i;
      setTimeout(() => { prev.pause(); locked = false; }, reduce ? 0 : 1000);   // matches the CSS crossfade
    };
    next.readyState >= 2 ? swap() : next.addEventListener('loadeddata', swap, { once: true });
  }));
})();
```
Add arrow-key movement between the tab buttons for keyboard users.

**Phone:** same switcher; only the active scene ever loads, and each new scene loads on tap. Keep the buttons 44px+ and
clear of the subject. Drop the foreground cut-out if it covers the subject on a narrow screen.

**Reduced motion:** no autoplay: each scene shows its poster, switching is an instant cut, and the cut-out stops bobbing.
