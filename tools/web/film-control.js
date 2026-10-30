// Background film behaviour: pause button (WCAG 2.2.2), pause when off screen, no autoplay under reduced motion.
//   <section>
//     <video data-film muted loop playsinline preload="none" poster="film-poster.webp" data-still="film-still.webp">
//       <source src="film-1280.mp4" type="video/mp4" media="(max-width: 1100px)">
//       <source src="film-1920.webm" type="video/webm"><source src="film-1920.mp4" type="video/mp4">
//     </video>
//     <button type="button" data-film-btn aria-label="Pause the film"></button>
//   </section>
// Load it as a module. The `.is-paused` class on the button is yours to style.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('video[data-film]').forEach((video) => {
  const wrap = video.closest('section, figure') || video.parentElement;
  const btn = wrap.querySelector('[data-film-btn]');
  let userPaused = reduce, inView = false;

  if (reduce && video.dataset.still) video.poster = video.dataset.still;
  const sync = () => {
    if (!userPaused && inView) { video.preload = 'auto'; video.play().catch(() => {}); } else video.pause();
    if (btn) {
      btn.classList.toggle('is-paused', userPaused);
      btn.setAttribute('aria-label', userPaused ? 'Play the film' : 'Pause the film');
    }
  };
  btn?.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(wrap);
  sync();
});
