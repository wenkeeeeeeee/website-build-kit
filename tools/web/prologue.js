/* prologue.js: a long, scroll-driven brand opening (a "film" you scroll through, no video length limits).
 *
 * <section class="pro" data-pro style="height: 950vh">        <- scroll length = how long the story lasts
 *   <div class="pro-stage">                                   <- position: sticky; top: 0; height: 100svh
 *     <canvas class="pro-embers" data-embers data-colors="#e2a93f,#d9481a,#a3201a"></canvas>
 *     <div data-in=".08 .14" data-out=".2 .24">…</div>      <- gets --t (0→1 entering) and --u (0→1 leaving)
 *     <canvas data-seq="film/seq" data-run=".6 .85"></canvas> <- frame sequence (frames.py) scrubbed over its run
 *     <nav data-acts><a data-act="0 .2" data-go=".02">Act</a>…</nav>   <- act labels, click to jump
 *   </div>
 * </section>
 *
 * Everything else is CSS: use calc() with var(--t), var(--u), var(--p) (whole progress) and
 * var(--mx)/var(--my) (pointer, -1..1, smoothed). Elements get .is-on while visible (t > 0 and u < 1).
 * Embers: glowing threads + gold dust drawn on a canvas; they drift up, swirl away from the pointer and
 * get pushed by scroll speed. Under prefers-reduced-motion the section gets .is-calm: embers are drawn once
 * and stay still, frame sequences still follow the scroll (user-driven), CSS should drop big transforms.
 */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const pair = (s) => (s || '').trim().split(/\s+/).map(Number);

function sprite(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  return c;
}

function embers(canvas, section) {
  const ctx = canvas.getContext('2d');
  const colors = (canvas.dataset.colors || '#e2a93f,#d9481a,#a3201a').split(',');
  const nThreads = +(canvas.dataset.threads || 70), nDust = +(canvas.dataset.dust || 160);
  // pre-rendered glowing sprites: a glowing thread (slightly curved) and a speck of gold dust
  const threadSprites = colors.slice(1).map((col) => sprite(64, (g, s) => {
    g.translate(s / 2, s / 2);
    g.shadowColor = col; g.shadowBlur = 10;
    g.strokeStyle = col; g.lineWidth = 2.2; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-18, 4); g.quadraticCurveTo(0, -6, 18, -2); g.stroke();
    g.shadowBlur = 0; g.strokeStyle = 'rgba(255,214,150,.75)'; g.lineWidth = .8;
    g.beginPath(); g.moveTo(-14, 2); g.quadraticCurveTo(0, -5, 14, -2); g.stroke();
  }));
  const dustSprite = sprite(32, (g, s) => {
    const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    r.addColorStop(0, 'rgba(255,236,190,1)'); r.addColorStop(.25, colors[0]); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, s, s);
  });
  let W = 0, H = 0, dpr = 1;
  const parts = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const spawn = (p, anywhere) => {
    p.x = rnd(0, W); p.y = anywhere ? rnd(0, H) : H + rnd(10, 80);
    p.vx = rnd(-.15, .15); p.vy = -rnd(.12, .5) * (p.kind ? 1 : .7);
    p.rot = rnd(0, 6.28); p.vr = rnd(-.01, .01); p.s = p.kind ? rnd(.45, 1.1) : rnd(.25, 1);
    p.a = rnd(.35, 1); p.ph = rnd(0, 6.28);
    return p;
  };
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener('resize', resize);
  for (let i = 0; i < nThreads; i++) parts.push(spawn({ kind: 1, spr: threadSprites[i % threadSprites.length] }, true));
  for (let i = 0; i < nDust; i++) parts.push(spawn({ kind: 0 }, true));

  const draw = (dt, mouse, push) => {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    const t = performance.now() / 1000;
    for (const p of parts) {
      if (dt) {
        // drift, a slow sideways sway, swirl away from the pointer, and a shove from scroll speed
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (mouse.on && d2 < 160 * 160) {
          const f = (1 - Math.sqrt(d2) / 160) * .9;
          p.vx += (dx / 160) * f * .35 - dy / 160 * f * .25;
          p.vy += (dy / 160) * f * .35 + dx / 160 * f * .25;
        }
        p.vy -= push * (p.kind ? .06 : .09);
        p.vx *= .985; p.vy = p.vy * .985 - .004;
        p.x += (p.vx + Math.sin(t * .6 + p.ph) * .12) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        if (p.y < -60 || p.x < -80 || p.x > W + 80 || p.y > H + 120) spawn(p, false);
      }
      const tw = .65 + .35 * Math.sin(t * 1.7 + p.ph);
      ctx.globalAlpha = p.a * tw;
      if (p.kind) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(p.s, p.s);
        ctx.drawImage(p.spr, -32, -32); ctx.restore();
      } else {
        const s = 14 * p.s; ctx.drawImage(dustSprite, p.x - s / 2, p.y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  };
  return { draw, resize };
}

class Seq {
  constructor(canvas) {
    this.c = canvas; this.g = canvas.getContext('2d');
    this.fx = parseFloat(canvas.dataset.fx || '.5'); this.fy = parseFloat(canvas.dataset.fy || '.5');
    this.imgs = []; this.n = 0; this.want = 0; this.drawn = -1;
    this.ready = this.init();
  }
  async init() {
    const base = this.c.dataset.seq.replace(/\/$/, '');
    const meta = await fetch(base + '/frames.json').then((r) => r.json());
    this.dir = meta.mobile && innerWidth < 800 ? base + '/m' : base;
    this.n = meta.count;
    this.resize();
    addEventListener('resize', () => this.resize());
    await this.load(0);
    for (const s of [12, 6, 3, 1]) for (let i = 0; i < this.n; i += s) this.load(i);
  }
  load(i) {
    if (this.imgs[i]) return this.imgs[i].p;
    const im = new Image(); im.decoding = 'async';
    im.src = `${this.dir}/${String(i + 1).padStart(4, '0')}.webp`;
    im.p = im.decode().then(() => { im.ok = true; this.drawn = -1; }, () => {});
    return (this.imgs[i] = im).p;
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.c.width = Math.round(this.c.clientWidth * dpr); this.c.height = Math.round(this.c.clientHeight * dpr);
    this.drawn = -1;
  }
  set(r) { this.want = r * (this.n - 1); }
  draw(cur) {
    if (!this.n) return;
    let i = Math.round(cur), k = -1;
    for (let d = 0; d < this.n && k < 0; d++) { if (this.imgs[i - d]?.ok) k = i - d; else if (this.imgs[i + d]?.ok) k = i + d; }
    if (k < 0 || k === this.drawn) return;
    const im = this.imgs[k], W = this.c.width, H = this.c.height;
    const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    this.g.clearRect(0, 0, W, H);
    this.g.drawImage(im, (W - w) * this.fx, (H - h) * this.fy, w, h);
    this.drawn = k;
  }
}

export function initPrologue(section) {
  if (!section || section.__pro) return;
  section.__pro = true;
  if (calm) section.classList.add('is-calm');
  const els = [...section.querySelectorAll('[data-in]')].map((el) => ({ el, i: pair(el.dataset.in), o: el.dataset.out ? pair(el.dataset.out) : null, t: -1, u: -1 }));
  const seqs = [...section.querySelectorAll('[data-seq]')].map((c) => ({ s: new Seq(c), run: pair(c.dataset.run || '0 1'), cur: 0 }));
  const emberCanvas = section.querySelector('[data-embers]');
  const fx = emberCanvas ? embers(emberCanvas, section) : null;
  const acts = [...section.querySelectorAll('[data-act]')].map((a) => ({ a, r: pair(a.dataset.act) }));

  const mouse = { x: -999, y: -999, on: false }, m = { x: 0, y: 0 }, ms = { x: 0, y: 0 };
  section.addEventListener('pointermove', (e) => {
    const r = section.querySelector('.pro-stage').getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.on = true;
    m.x = (mouse.x / r.width) * 2 - 1; m.y = (mouse.y / r.height) * 2 - 1;
  });
  section.addEventListener('pointerleave', () => { mouse.on = false; m.x = 0; m.y = 0; });

  let p = 0, lastY = scrollY, push = 0, visible = true, raf = 0, last = performance.now();
  const progress = () => {
    const r = section.getBoundingClientRect(), run = r.height - innerHeight;
    return run > 0 ? clamp01(-r.top / run) : 0;
  };
  const apply = () => {
    section.style.setProperty('--p', p.toFixed(4));
    for (const e of els) {
      const t = clamp01((p - e.i[0]) / Math.max(1e-4, e.i[1] - e.i[0]));
      const u = e.o ? clamp01((p - e.o[0]) / Math.max(1e-4, e.o[1] - e.o[0])) : 0;
      if (Math.abs(t - e.t) > 1e-4) { e.el.style.setProperty('--t', t.toFixed(4)); e.t = t; }
      if (Math.abs(u - e.u) > 1e-4) { e.el.style.setProperty('--u', u.toFixed(4)); e.u = u; }
      e.el.classList.toggle('is-on', t > 0 && u < 1);
    }
    for (const q of seqs) q.s.set(clamp01((p - q.run[0]) / Math.max(1e-4, q.run[1] - q.run[0])));
    for (const { a, r } of acts) { if (p >= r[0] && p < r[1]) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current'); }
  };
  const frame = (now) => {
    raf = 0;
    const dt = Math.min(3, (now - last) / 16.67); last = now;
    ms.x += (m.x - ms.x) * .06 * dt; ms.y += (m.y - ms.y) * .06 * dt;
    section.style.setProperty('--mx', ms.x.toFixed(3)); section.style.setProperty('--my', ms.y.toFixed(3));
    push *= .9;
    for (const q of seqs) { q.cur += (q.s.want - q.cur) * Math.min(1, .25 * dt); q.s.draw(q.cur); }
    if (fx && !calm) fx.draw(dt, mouse, push);
    if (visible) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  addEventListener('scroll', () => {
    const y = scrollY; push = Math.max(-6, Math.min(6, push + (y - lastY) * .02)); lastY = y;
    p = progress(); apply(); kick();
  }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(section);
  for (const { a } of acts) a.addEventListener('click', (e) => {
    e.preventDefault();
    const run = section.offsetHeight - innerHeight;
    scrollTo({ top: section.offsetTop + parseFloat(a.dataset.go || a.dataset.act) * run, behavior: calm ? 'auto' : 'smooth' });
  });
  p = progress(); apply();
  if (fx && calm) fx.draw(0, mouse, 0);
  kick();
}

document.querySelectorAll('[data-pro]').forEach(initPrologue);
