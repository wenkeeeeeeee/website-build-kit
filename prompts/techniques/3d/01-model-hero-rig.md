Adapted from MotionSites 3d-and-webgl.md #1 (MIT).

# Real 3D model hero rig (three.js + GLB), subject centred

A real model of the client's product the visitor can grab and turn, framed exactly on a stage element in the middle of
the hero, with the headline set into the scene above it and the line, facts and action below. It settles in with a short
turn, sways gently at rest, and falls back to a still if anything fails. Use it when the object is the story and a GLB
exists or can be made (hardware, bottles, eyewear, sneakers, packaging). Heavy: one per page, as the signature.
The source's copy-left/stage-right layout is dropped: the subject is the biggest thing at every step (taste, "The hero").

**Needs:** a GLB of the client's real product (3-5 MB max, textures 1-2K) and a still render or photo of it at the
default angle.

## Parameters
- Lens **fov 30deg** (product-shot look). The model is re-centred on its bounding sphere and scaled to **unit radius**,
  so any GLB frames the same way; camera distance is solved so the sphere fills **90%** of the stage's shorter side.
- **`camera.setViewOffset`**: the camera looks straight at the model (no skew), but the projection is shifted so the
  model's centre lands on the centre of `[data-stage]`. CSS decides where the stage sits; resize keeps it there.
- Rig `pivot > spin > holder > model`: **holder** = centring + unit scale + authored-orientation fix; **spin** = user
  rotation + inertia; **pivot** = intro turn + idle sway + scroll turn. Each concern owns one group.
- Drag **0.006 rad/px**, vertical at 0.6x; rotations are **premultiplied** onto the spin quaternion around the screen
  axes, so dragging right always turns the visible face right (no gimbal lock). Release keeps the smoothed velocity and
  decays it (friction 3.5/s, max 12 rad/s); a pause of >90ms before lifting kills the throw.
- Zoom: wheel / trackpad pinch / two-finger pinch, clamped **1 to 1.8**, smoothed. Start zoom is the minimum, so a
  downward wheel over the hero scrolls the page; trackpad pinch (`ctrlKey`) is always captured.
- Idle: after **1.8s** without input the sway fades in (yaw +-0.22 rad, pitch +-0.06, lift 0.03, ~11s period) and the
  model levels itself upright, keeping its yaw. This is the "alive at rest" from `motion.md`.
- Intro: canvas fades in over 0.9s while the pivot turns from -0.9 rad and scales 0.9 to 1 over 1.6s (expo out,
  matching `--ease-out`). Shaders compile first (`compileAsync`) so the first frame doesn't hitch.
- Light: `RoomEnvironment` through PMREM (sigma 0.04) + one key `DirectionalLight` (1.5); `NeutralToneMapping` keeps
  product colours honest (`ACESFilmicToneMapping` for a filmic look).
- Loader: a 140 x 2px bar on real download progress (shimmer when size is unknown). The still sits behind the canvas
  from the start (playbook: every 3D scene keeps a still behind it) and fades once the model is ready.
- Performance: DPR clamped to 2, rendering paused off screen, `ResizeObserver` on canvas and stage. Optimise the model:
  `npx gltf-transform optimize in.glb model.glb --compress draco --texture-compress webp --texture-size 2048`.

## Files
- `js/vendor/three/three.module.js` and `three.core.js` (from `node_modules/three/build`).
- `js/vendor/three/addons/loaders/GLTFLoader.js`, `DRACOLoader.js`, `environments/RoomEnvironment.js`, plus
  `utils/BufferGeometryUtils.js` and `utils/SkeletonUtils.js` (GLTFLoader imports both) from
  `node_modules/three/examples/jsm`, keeping the folder layout.
- Draco decoder: copy `examples/jsm/libs/draco/gltf/` to `js/vendor/three/addons/libs/draco/gltf/`. If the GLB isn't
  Draco-compressed, drop the DRACOLoader lines instead.
- `js/gl-guard.js` from `tools/web/`, loaded first in `<head>`.

## Code
```html
<!-- in <head> -->
<script src="js/gl-guard.js"></script>
<script type="importmap">{"imports":{"three":"./js/vendor/three/three.module.js","three/addons/":"./js/vendor/three/addons/"}}</script>

<section class="hero3d" data-model="models/product.glb">
  <canvas class="hero3d__canvas" aria-hidden="true"></canvas>
  <h1 class="hero3d__title">Headline from the content data</h1>
  <div class="hero3d__stage" data-stage tabindex="0" role="group" aria-label="3D view of the product. Drag or use the arrow keys to rotate.">
    <img class="hero3d__still" src="images/product-still.webp" alt="The product, front three-quarter view">
    <div class="hero3d__loader is-indeterminate" role="status"><span class="hero3d__bar"><i></i></span><span>Loading</span></div>
  </div>
  <div class="hero3d__foot">
    <p class="hero3d__line">One short line.</p>
    <p class="hero3d__facts">One line of facts</p>
    <a class="btn" href="#order">Main action</a>
  </div>
</section>
```
```css
.hero3d{position:relative;isolation:isolate;min-height:100vh;min-height:100svh;display:grid;
  grid-template-rows:auto minmax(0,1fr) auto;justify-items:center;text-align:center;gap:2vh;
  padding:calc(var(--header-h,64px) + 3vh) clamp(20px,5vw,72px) 4vh;overflow:hidden;background:var(--bg);color:var(--ink)}
.hero3d__canvas{position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1;pointer-events:none;
  opacity:0;transition:opacity .9s var(--ease-out)}
.hero3d.is-ready .hero3d__canvas{opacity:1}
.hero3d.is-fallback .hero3d__canvas{display:none}
.hero3d__title{position:relative;z-index:2;margin:0;max-width:18ch;font:500 clamp(36px,5vw,72px)/.98 var(--font-display);letter-spacing:-.03em}
.hero3d__foot{position:relative;z-index:2;display:grid;justify-items:center;gap:1.2vh;font-family:var(--font-body)}
.hero3d__line{margin:0;font-size:17px;line-height:1.5}
.hero3d__facts{margin:0;font-size:15px;color:var(--muted)}
/* The stage is the box the model is framed on, and it takes the drag */
.hero3d__stage{position:relative;z-index:0;width:100%;align-self:stretch;min-height:clamp(280px,52vh,760px);display:grid;place-items:center;
  cursor:grab;touch-action:pan-y;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;outline:none}
.hero3d__stage:active{cursor:grabbing}
.hero3d__stage:focus-visible{box-shadow:inset 0 0 0 1px var(--line)}
.hero3d__stage>*{grid-area:1/1}
.hero3d__still{width:auto;max-width:88%;max-height:100%;height:auto;object-fit:contain;transition:opacity .6s var(--ease-out)}
.hero3d.is-ready .hero3d__still{opacity:0}
.hero3d__loader{align-self:end;display:grid;justify-items:center;gap:12px;font:500 12px/1 var(--font-mono);color:var(--muted);transition:opacity .4s}
.hero3d__bar{width:140px;height:2px;border-radius:2px;background:var(--line);overflow:hidden}
.hero3d__bar i{display:block;width:100%;height:100%;background:var(--accent);transform-origin:left;transform:scaleX(var(--p,0));transition:transform .2s linear}
.hero3d__loader.is-indeterminate .hero3d__bar i{width:40%;transform:none;animation:hero3d-bar 1.1s var(--ease-in-out) infinite}
@keyframes hero3d-bar{from{translate:-100% 0}to{translate:250% 0}}
.hero3d.is-ready .hero3d__loader,.hero3d.is-fallback .hero3d__loader{opacity:0;pointer-events:none}
.hero3d.is-fallback .hero3d__stage{cursor:default}
@media (max-width:860px){.hero3d__stage{min-height:48svh}}
@media (prefers-reduced-motion:reduce){
  .hero3d__canvas,.hero3d__still{transition:none}
  .hero3d__loader.is-indeterminate .hero3d__bar i{animation:none;width:100%;opacity:.4}
}
```
```html
<script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const DRACO_PATH = './js/vendor/three/addons/libs/draco/gltf/';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function modelHero(root, opts = {}) {
  const o = {
    src: root.dataset.model,
    fov: 30, fill: 0.9,          // lens; share of the stage's shorter side the bounding sphere fills
    zoomMin: 1, zoomMax: 1.8,    // start = min, so a downward wheel scrolls the page
    dragSpeed: 0.006, friction: 3.5, idleAfter: 1800,
    sway: { yaw: 0.22, pitch: 0.06, lift: 0.03, speed: 0.55 },
    rightOnIdle: true,           // level the model again when idle (keeps its yaw)
    baseRotation: [0, 0, 0],     // fix the model's authored orientation (radians)
    exposure: 1,
    ...opts,
  };
  const canvas = root.querySelector('.hero3d__canvas');
  const stage = root.querySelector('[data-stage]');
  const loaderEl = root.querySelector('.hero3d__loader');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const noop = { setTurn() {}, destroy() {} };
  let renderer, raf = 0, ready = false, visible = true, dead = false;

  const dropLoader = () => setTimeout(() => loaderEl?.remove(), 500);
  const showFallback = () => {                 // the still is already in place behind the canvas
    if (dead) return;
    dead = true; ready = false; cancelAnimationFrame(raf); raf = 0;
    root.classList.remove('is-ready'); root.classList.add('is-fallback');
    dropLoader();
  };
  if (!o.src || navigator.connection?.saveData || !(window.__glOK?.() ?? true)) { showFallback(); return noop; }
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    window.__glTrack?.(renderer);
  } catch (e) { showFallback(); return noop; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = o.exposure;
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); showFallback(); });

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  scene.environment = pmrem.fromScene(room, 0.04).texture;
  room.dispose?.(); pmrem.dispose();
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(2.5, 3.5, 4);
  scene.add(key);
  const camera = new THREE.PerspectiveCamera(o.fov, 1, 0.05, 200);

  // Rig: pivot (intro + idle sway + scroll turn) > spin (user rotation + inertia) > holder (centre + unit scale) > model
  const pivot = new THREE.Group(), spin = new THREE.Group(), holder = new THREE.Group();
  holder.rotation.set(...o.baseRotation);
  spin.add(holder); pivot.add(spin); scene.add(pivot);

  let baseDist = 10, zoomT = o.zoomMin, zoom = zoomT, turnT = 0, turn = 0;
  let vx = 0, vy = 0, dragging = false, swayW = 0, last = 0, introStart = 0, lastInput = performance.now();
  const AX_X = new THREE.Vector3(1, 0, 0), AX_Y = new THREE.Vector3(0, 1, 0);
  const dq = new THREE.Quaternion(), upright = new THREE.Quaternion(), eul = new THREE.Euler(0, 0, 0, 'YXZ');
  const rotateBy = (ax, ay) => {               // premultiply = rotate about screen axes
    spin.quaternion.premultiply(dq.setFromAxisAngle(AX_Y, ax));
    spin.quaternion.premultiply(dq.setFromAxisAngle(AX_X, ay));
  };

  // Framing: project the model's centre onto the stage element's centre
  function layout() {
    const W = canvas.clientWidth, H = canvas.clientHeight;
    if (!W || !H) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H, false);
    const c = canvas.getBoundingClientRect();
    let s = stage.getBoundingClientRect();
    if (!s.width || !s.height) s = c;
    const sx = s.left - c.left + s.width / 2, sy = s.top - c.top + s.height / 2;
    camera.aspect = W / H;
    camera.setViewOffset(W, H, W / 2 - sx, H / 2 - sy, W, H);
    const fitPx = o.fill * Math.min(s.width, s.height);          // on-screen diameter of the unit sphere
    baseDist = H / (fitPx * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.updateProjectionMatrix();
    wake();
  }

  function tick(now) {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    const rm = reduce.matches;
    let busy = false;
    if (!dragging && (vx || vy)) {                               // inertia
      if (rm) { vx = vy = 0; }
      else {
        rotateBy(vx * dt, vy * dt);
        const k = Math.exp(-o.friction * dt); vx *= k; vy *= k;
        if (Math.hypot(vx, vy) < 0.02) vx = vy = 0; else busy = true;
      }
    }
    zoom = rm ? zoomT : zoom + (zoomT - zoom) * (1 - Math.exp(-dt * 10));
    if (Math.abs(zoomT - zoom) > 1e-4) busy = true; else zoom = zoomT;
    turn = rm ? turnT : turn + (turnT - turn) * (1 - Math.exp(-dt * 8));   // scroll turn eases toward its target
    if (Math.abs(turnT - turn) > 1e-4) busy = true; else turn = turnT;
    camera.position.set(0, 0, Math.max(1.6, baseDist / zoom));

    const intro = rm ? 1 : easeOutExpo(Math.min(1, (now - introStart) / 1600));
    if (intro < 1) busy = true;

    const idle = !rm && !dragging && !vx && !vy && now - lastInput > o.idleAfter;
    swayW += ((idle ? 1 : 0) - swayW) * (1 - Math.exp(-dt * (idle ? 1.2 : 6)));
    if (o.rightOnIdle && swayW > 0.001) {                        // level out, keep the yaw
      eul.setFromQuaternion(spin.quaternion); eul.x = 0; eul.z = 0;
      spin.quaternion.slerp(upright.setFromEuler(eul), (1 - Math.exp(-dt * 1.5)) * swayW);
    }
    const t = (now / 1000) * o.sway.speed;
    pivot.rotation.set(swayW * o.sway.pitch * Math.sin(t * 1.3 + 1), (1 - intro) * -0.9 + turn + swayW * o.sway.yaw * Math.sin(t), 0);
    pivot.position.y = swayW * o.sway.lift * Math.sin(t * 1.7);
    pivot.scale.setScalar(0.9 + 0.1 * intro);

    renderer.render(scene, camera);
    if (visible && !dead && (busy || dragging || !rm)) raf = requestAnimationFrame(tick);   // reduced motion: on demand
  }
  function wake() { if (!raf && visible && ready) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  const poke = () => { lastInput = performance.now(); wake(); };

  // Drag to rotate (one pointer), pinch to zoom (two pointers)
  const pointers = new Map();
  let lastX = 0, lastY = 0, lastT = 0, pinch = 0;
  stage.addEventListener('pointerdown', (e) => {
    if (!ready || (e.pointerType === 'mouse' && e.button !== 0)) return;
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) { dragging = true; vx = vy = 0; lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp; }
    else if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    poke();
  });
  stage.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch > 0) zoomT = clamp(zoomT * (d / pinch), o.zoomMin, o.zoomMax);
      pinch = d;
    } else {
      const dx = e.clientX - lastX, dy = e.clientY - lastY, dms = Math.max(1, e.timeStamp - lastT);
      lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp;
      const ax = dx * o.dragSpeed;
      const ay = e.pointerType === 'touch' ? 0 : dy * o.dragSpeed * 0.6;   // touch: vertical swipes scroll the page
      rotateBy(ax, ay);
      vx = 0.75 * vx + 0.25 * (ax / dms) * 1000;                   // rad/s, smoothed
      vy = 0.75 * vy + 0.25 * (ay / dms) * 1000;
    }
    poke();
  });
  const release = (e) => {
    if (!pointers.delete(e.pointerId)) return;
    if (pointers.size === 1) {                                     // pinch -> drag: re-seed
      const [p] = [...pointers.values()];
      lastX = p.x; lastY = p.y; lastT = e.timeStamp; pinch = 0; vx = vy = 0;
    } else if (pointers.size === 0) {
      dragging = false;
      if (e.type === 'pointercancel' || e.timeStamp - lastT > 90 || reduce.matches) vx = vy = 0;
      vx = clamp(vx, -12, 12); vy = clamp(vy, -12, 12);
    }
    poke();
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  // Wheel / trackpad pinch zoom; at the limits the page scrolls normally
  stage.addEventListener('wheel', (e) => {
    if (!ready) return;
    const dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    const atLimit = dy > 0 ? zoomT <= o.zoomMin + 1e-3 : zoomT >= o.zoomMax - 1e-3;
    if (atLimit && !e.ctrlKey) return;
    e.preventDefault();
    zoomT = clamp(zoomT * Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0015)), o.zoomMin, o.zoomMax);
    poke();
  }, { passive: false });

  // Keyboard: arrows rotate 15deg, +/- zoom
  stage.addEventListener('keydown', (e) => {
    if (!ready) return;
    const step = 0.26;
    const turns = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (turns[e.key]) rotateBy(...turns[e.key]);
    else if (e.key === '+' || e.key === '=') zoomT = clamp(zoomT * 1.15, o.zoomMin, o.zoomMax);
    else if (e.key === '-') zoomT = clamp(zoomT / 1.15, o.zoomMin, o.zoomMax);
    else return;
    e.preventDefault();
    poke();
  });

  // Load: re-centre on the bounding sphere, scale to unit radius, compile, reveal
  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
  const loader = new GLTFLoader().setDRACOLoader(draco);
  loader.load(o.src, (gltf) => {
    draco.dispose();
    if (dead) return;
    const model = gltf.scene;
    model.updateMatrixWorld(true);
    const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
    if (!(sphere.radius > 0) || !Number.isFinite(sphere.radius)) { showFallback(); return; }
    model.position.sub(sphere.center);
    holder.scale.setScalar(1 / sphere.radius);
    holder.add(model);
    layout();
    const reveal = () => {
      if (dead) return;
      ready = true;
      introStart = lastInput = performance.now();
      root.classList.add('is-ready');
      dropLoader();
      wake();
    };
    renderer.compileAsync(scene, camera).then(reveal, reveal);    // no shader hitch on the first frame
  }, (e) => {
    if (!loaderEl || !e.lengthComputable || !e.total) return;
    loaderEl.classList.remove('is-indeterminate');
    loaderEl.style.setProperty('--p', Math.min(1, e.loaded / e.total).toFixed(3));
  }, () => { draco.dispose(); showFallback(); });

  const ro = new ResizeObserver(() => layout());
  ro.observe(canvas); ro.observe(stage);
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) wake(); });
  io.observe(root);
  reduce.addEventListener('change', wake);
  document.fonts?.ready.then(() => layout());

  return {
    setTurn(rad) { turnT = rad; wake(); },   // for a scroll set-piece; eased in tick()
    destroy() { dead = true; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); },
  };
}

const hero = modelHero(document.querySelector('.hero3d'));
// Options: modelHero(el, { baseRotation: [0, Math.PI / 4, 0], fill: 0.8, zoomMax: 2.2, rightOnIdle: false });
</script>
```

## As the scroll set-piece (optional)
When the product suits it, pin the hero for 1-3 screens and let scroll turn it (taste, "Turn and open"). The model is
visible at progress 0 and 1, so the pin never starts or ends empty. Label parts as they face the camera.
```js
// after gsap.min.js + ScrollTrigger.min.js (js/vendor/), inside the module above
const mm = gsap.matchMedia();
mm.add({ desk: '(min-width: 861px)', phone: '(max-width: 860px)' }, (ctx) => {
  ScrollTrigger.create({ trigger: '.hero3d', start: 'top top', end: ctx.conditions.desk ? '+=200%' : '+=80%',
    pin: true, onUpdate: (s) => hero.setTurn(s.progress * Math.PI * 1.5) });
});
```

## Notes
- **Placing the model:** move or resize `[data-stage]` with CSS and the model follows. The canvas stays full-bleed so
  the model can overhang the stage slightly without clipping. A giant word behind the model (type folder) can carry
  the headline instead of the top row, as long as the subject stays biggest.
- **Orientation:** most GLBs face +Z. Fix sideways or lying models once with `baseRotation`, not in the rig.
- **Look:** a dark ground with the room environment reads as a studio shot. On a light ground set `exposure` about 0.9.
  For a ground shadow, add a squashed ellipse under the stage with
  `radial-gradient(closest-side, color-mix(in srgb, var(--ink) 35%, transparent), transparent)`.
- **Serving:** use `serve.py`; over `file://` the GLB fetch fails and the still stays.
- One WebGL canvas per page: don't add a shader backdrop or fluid behind this.

**Phone:** horizontal drags rotate, vertical swipes scroll the page (`touch-action: pan-y`), two-finger pinch zooms.
The layout already keeps the headline above and the action below the model; the stage shrinks to 48svh. Pin for at
most about one screen.

**Reduced motion:** no intro turn, sway, self-levelling or inertia; zoom and scroll turn snap; frames render only on
input. Drag still works because the visitor drives it.
