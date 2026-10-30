/* scrub.js: scroll-scrubbed frame sequence (the "video moves as you scroll" hero).
 *
 * Frames come from tools/web/frames.py (<dir>/0001.webp..., <dir>/m/ for phones, <dir>/frames.json).
 *
 * <section class="scrub" data-scrub="assets/scrub/hero" style="height: 400vh">   <- scroll length
 *   <div class="scrub-stage">                       <- position: sticky; top: 0; height: 100svh
 *     <canvas class="scrub-canvas" aria-hidden="true"></canvas>
 *     <div data-at="0-0.3">Shown while progress is between 0 and 0.3</div>
 *   </div>
 * </section>
 *
 * Options on the section: data-fit="cover|contain" (default cover), data-focus="0.7" (horizontal crop focus
 * for cover, 0 = left, 1 = right), data-still="last|first|0.5" (frame shown under reduced motion).
 * The section gets --p (0..1) and the "scrub" event ({detail: {p, frame}}); [data-at] children get .is-on.
 * Under prefers-reduced-motion the section gets .is-static, shows one still and every [data-at] is on.
 * Import as a module: import { initScrub } from './scrub.js'; initScrub();  (also runs itself on load).
 */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function ranges(section) {
  return [...section.querySelectorAll('[data-at]')].map((el) => {
    const [a, b] = el.dataset.at.split('-').map(Number);
    return { el, a, b };
  });
}

async function setup(section) {
  if (section.__scrub) return;
  section.__scrub = true;
  const base = section.dataset.scrub.replace(/\/$/, '');
  const canvas = section.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const meta = await fetch(base + '/frames.json').then((r) => r.json());
  const dir = meta.mobile && innerWidth < 800 ? base + '/m' : base;
  const n = meta.count;
  const imgs = new Array(n);
  const steps = ranges(section);
  const fit = section.dataset.fit || 'cover';
  const focus = parseFloat(section.dataset.focus || '0.5');
  let target = 0, current = 0, drawn = -1, visible = true, raf = 0;

  const src = (i) => `${dir}/${String(i + 1).padStart(4, '0')}.webp`;
  const load = (i) => {
    if (imgs[i]) return imgs[i].p;
    const im = new Image();
    im.decoding = 'async';
    im.src = src(i);
    imgs[i] = im;
    im.p = im.decode().then(() => { im.ok = true; drawn = -1; kick(); }, () => {});
    return im.p;
  };
  // nearest frame that has loaded, so fast scrolling never shows a blank canvas
  const nearest = (i) => {
    for (let d = 0; d < n; d++) {
      if (imgs[i - d]?.ok) return i - d;
      if (imgs[i + d]?.ok) return i + d;
    }
    return -1;
  };

  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    drawn = -1;
  };

  const draw = (i) => {
    const k = nearest(i);
    if (k < 0 || k === drawn) return;
    const im = imgs[k], cw = canvas.width, ch = canvas.height;
    const s = fit === 'contain' ? Math.min(cw / im.naturalWidth, ch / im.naturalHeight)
                                : Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(im, (cw - w) * focus, (ch - h) / 2, w, h);
    drawn = k;
  };

  const progress = () => {
    const r = section.getBoundingClientRect();
    const run = r.height - innerHeight;
    return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
  };

  const apply = (p) => {
    section.style.setProperty('--p', p.toFixed(4));
    for (const s of steps) s.el.classList.toggle('is-on', p >= s.a && p <= s.b);
    section.dispatchEvent(new CustomEvent('scrub', { detail: { p, frame: Math.round(current) } }));
  };

  const tick = () => {
    raf = 0;
    current += (target - current) * 0.2;
    if (Math.abs(target - current) < 0.05) current = target;
    draw(Math.round(current));
    if (current !== target || drawn !== Math.round(current)) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf && visible) raf = requestAnimationFrame(tick); };

  size();
  addEventListener('resize', () => { size(); draw(Math.round(current)); });

  if (reduce) {
    section.classList.add('is-static');
    const still = section.dataset.still || 'last';
    const i = still === 'first' ? 0 : still === 'last' ? n - 1 : Math.round(parseFloat(still) * (n - 1));
    await load(i);
    current = target = i;
    draw(i);
    for (const s of steps) s.el.classList.add('is-on');
    section.style.setProperty('--p', '1');
    return;
  }

  // load the first frame, then coarse-to-fine so the whole range is scrubbable early
  await load(0);
  draw(0);
  apply(0);
  (async () => {
    for (const stride of [16, 8, 4, 2, 1]) {
      const batch = [];
      for (let i = 0; i < n; i += stride) if (!imgs[i]) batch.push(load(i));
      await Promise.all(batch);
      kick();
    }
  })();

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(section);
  const onScroll = () => {
    const p = progress();
    target = p * (n - 1);
    apply(p);
    kick();
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

export function initScrub(root = document) {
  root.querySelectorAll('[data-scrub]').forEach((s) => setup(s));
}

initScrub();
