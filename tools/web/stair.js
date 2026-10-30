/* stair.js: a 3D spiral of floating steps with product cut-outs; the camera climbs it as you scroll.
 * (Adapted from the "camera travels a spiral staircase" hero pattern; three.js r180, no build step.)
 *
 * <section class="stair" data-stair style="height: 640vh">               <- scroll length
 *   <div class="stair-stage">                                            <- sticky, 100svh
 *     <canvas class="stair-canvas" aria-hidden="true"></canvas>
 *     <div class="stair-intro" data-key="intro">headline</div>          <- shown on the opening wide shot
 *     <ol class="stair-stops">
 *       <li data-img="assets/img/stair/rose-water.webp" data-href="product.html?slug=rose-water">caption</li>
 *     </ol>
 *     <div class="stair-outro" data-key="outro">closing line</div>      <- shown on the final wide shot
 *   </div>
 * </section>
 *
 * import { initStair } from './stair.js'; initStair(section, CONFIG)  (see DEFAULTS for the config keys).
 * Classes set: .is-on on the caption in view, .is-static under reduced motion / no WebGL (show a plain grid),
 * .is-ready once the first frame has rendered. --p (0..1) on the section.
 */
import * as THREE from './vendor/three/three.module.min.js';

const DEFAULTS = {
  sky: ['#9a9a9a', '#e6e6e6'],      // background gradient, top to bottom
  fog: null,                        // defaults to the gradient's middle
  step: '#f4f1ea',                  // step colour
  stepMetal: 0,                     // 0 matte, ~0.6 brass
  stepShape: 'slab',                // 'slab' (long stone steps) or 'tray' (round trays)
  shapes: ['#8f1d2c', '#2e6a8a', '#f2b544', '#1c1c1c'],   // floating flat shapes
  dots: '#151515',
  floaters: [],                     // small food cut-outs drifting around: [{ src, size }]
  steps: 34,                        // number of steps
  radius: 2.6,
  turn: 0.42,                       // radians per step
  rise: 0.36,                       // height per step
  productHeight: 1.45,
  hold: 0.42,                       // share of each leg the camera rests on a stop
  shadows: true,
};

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function gradientTexture([top, bottom]) {
  const c = document.createElement('canvas');
  c.width = 4; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, top); grd.addColorStop(0.55, top); grd.addColorStop(1, bottom);
  // keep the top third flat so the header always sits on the same colour
  const mid = new THREE.Color(top).lerp(new THREE.Color(bottom), 0.5);
  grd.addColorStop(0.78, '#' + mid.getHexString());
  g.fillStyle = grd; g.fillRect(0, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function blobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,.42)'); grd.addColorStop(0.55, 'rgba(0,0,0,.16)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

// seeded random so the composition is the same on every visit
function rng(seed) { return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646; }

const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const bez = (a, m, b, t, out) => out.copy(a).multiplyScalar((1 - t) * (1 - t))
  .addScaledVector(m, 2 * (1 - t) * t).addScaledVector(b, t * t);

export function initStair(section, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  const stage = section.querySelector('.stair-stage');
  const canvas = section.querySelector('canvas');
  const stops = [...section.querySelectorAll('.stair-stops > li')];
  const intro = section.querySelector('[data-key="intro"]');
  const outro = section.querySelector('[data-key="outro"]');
  const captions = [intro, ...stops, outro];

  const goStatic = () => {
    section.classList.add('is-static');
    stops.forEach((li) => {
      if (li.querySelector('.stop-img')) return;
      const img = new Image();
      img.className = 'stop-img'; img.alt = ''; img.loading = 'lazy'; img.src = li.dataset.img;
      li.prepend(img);
    });
    captions.forEach((c) => c && c.classList.add('is-on'));
  };

  let renderer;
  try {
    if (reduce) throw new Error('reduced motion');
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  } catch (e) { goStatic(); return; }

  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  if (cfg.shadows) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }

  const scene = new THREE.Scene();
  scene.background = gradientTexture(cfg.sky);
  const fogCol = new THREE.Color(cfg.fog || new THREE.Color(cfg.sky[0]).lerp(new THREE.Color(cfg.sky[1]), 0.45));
  scene.fog = new THREE.Fog(fogCol, 9, 34);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);

  scene.add(new THREE.HemisphereLight(0xffffff, new THREE.Color(cfg.sky[0]).multiplyScalar(0.6), 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1);
  sun.position.set(6, 18, 9);
  if (cfg.shadows) {
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera; sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 50;
    sun.shadow.bias = -0.0004; sun.shadow.radius = 5;
  }
  scene.add(sun, sun.target);

  // ---------- the spiral ----------
  const R = cfg.radius, N = cfg.steps;
  const theta = (i) => i * cfg.turn;
  const stepY = (i) => i * cfg.rise;
  const at = (i, r = R, dy = 0) => new THREE.Vector3(Math.cos(theta(i)) * r, stepY(i) + dy, Math.sin(theta(i)) * r);
  const stepMat = new THREE.MeshStandardMaterial({ color: cfg.step, roughness: cfg.stepMetal ? 0.35 : 0.72, metalness: cfg.stepMetal });
  const stepGeo = cfg.stepShape === 'tray'
    ? new THREE.CylinderGeometry(0.78, 0.74, 0.07, 48)
    : new THREE.ExtrudeGeometry(roundedRect(1.9, 0.7, 0.08), { depth: 0.09, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 6 });
  if (cfg.stepShape !== 'tray') stepGeo.rotateX(-Math.PI / 2);
  const steps = new THREE.Group();
  for (let i = 0; i < N; i++) {
    const m = new THREE.Mesh(stepGeo, stepMat);
    m.position.copy(at(i));
    m.rotation.y = -theta(i);
    m.receiveShadow = true; m.castShadow = true;
    steps.add(m);
    if (cfg.stepShape === 'tray') {   // brass rim
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.77, 0.025, 8, 48), stepMat);
      rim.rotation.x = Math.PI / 2; rim.position.copy(m.position).y += 0.04;
      steps.add(rim);
    }
  }
  scene.add(steps);

  // ---------- products on the steps ----------
  const loader = new THREE.TextureLoader();
  const blob = blobTexture();
  const n = stops.length;
  const firstStep = 3, lastStep = N - 4;
  const stopStep = stops.map((_, k) => Math.round(firstStep + (k * (lastStep - firstStep)) / Math.max(1, n - 1)));
  const products = stops.map((li, k) => {
    const i = stopStep[k];
    const base = at(i, cfg.stepShape === 'tray' ? R + 0.34 : R + 0.66, cfg.stepShape === 'tray' ? 0.04 : 0.11);
    const h = parseFloat(li.dataset.h || cfg.productHeight);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ transparent: true, alphaTest: 0.04, depthWrite: true, fog: false }));
    plane.scale.set(h * 0.7, h, 1);
    plane.position.copy(base).y += h / 2;
    plane.userData = { k, h, base, href: li.dataset.href };
    loader.load(li.dataset.img, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      plane.material.map = t; plane.material.needsUpdate = true;
      const a = t.image.width / t.image.height;
      plane.scale.set(h * a, h, 1);
      dirty = true;
    });
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.scale.set(h * 0.95, h * 0.5, 1);
    shadow.position.copy(base).y += 0.012;
    scene.add(plane, shadow);
    return plane;
  });

  // ---------- floating shapes ----------
  const rand = rng(cfg.seed || 7);
  const decor = new THREE.Group();
  const topY = stepY(N - 1);
  const shapeMats = cfg.shapes.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, side: THREE.DoubleSide }));
  const tri = new THREE.Shape(); tri.moveTo(0, 0.75); tri.lineTo(0.68, -0.42); tri.lineTo(-0.68, -0.42); tri.closePath();
  const geos = [
    new THREE.CylinderGeometry(0.62, 0.62, 0.07, 48),
    new THREE.ExtrudeGeometry(tri, { depth: 0.06, bevelEnabled: false }),
    new THREE.TorusGeometry(0.62, 0.045, 10, 64),
    new THREE.CylinderGeometry(0.42, 0.42, 0.07, 40),
  ];
  // keep shapes off the products and out of the camera's path to each one
  const camPt = (pr, d) => pr.userData.base.clone().setY(pr.position.y).add(new THREE.Vector3(pr.userData.base.x, 0, pr.userData.base.z).normalize().multiplyScalar(d));
  const near = (p) => products.some((pr) => pr.position.distanceTo(p) < 1.8 || camPt(pr, 1.9).distanceTo(p) < 1.5 || camPt(pr, 3.8).distanceTo(p) < 2.2);
  for (let s = 0, tries = 0; s < 22 && tries < 400; tries++) {
    const ang = rand() * Math.PI * 2, rad = R + 0.9 + rand() * 3.4, y = -1 + rand() * (topY + 3);
    const p = new THREE.Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad);
    if (near(p)) continue;
    const g = geos[s % geos.length];
    const m = new THREE.Mesh(g, shapeMats[(s * 3 + 1) % shapeMats.length]);
    m.position.copy(p);
    const sc = 0.55 + rand() * 1.1;
    m.scale.setScalar(sc);
    m.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    m.userData.spin = new THREE.Vector3((rand() - 0.5) * 0.25, (rand() - 0.5) * 0.3, (rand() - 0.5) * 0.2);
    m.castShadow = true;
    decor.add(m); s++;
  }
  const dotMat = new THREE.MeshStandardMaterial({ color: cfg.dots, roughness: 0.4 });
  const dotGeo = new THREE.SphereGeometry(0.07, 16, 12);
  for (let s = 0; s < 46; s++) {
    const ang = rand() * Math.PI * 2, rad = R + 0.4 + rand() * 4.5;
    const m = new THREE.Mesh(dotGeo, dotMat);
    m.position.set(Math.cos(ang) * rad, -1 + rand() * (topY + 3), Math.sin(ang) * rad);
    if (near(m.position)) continue;
    m.scale.setScalar(0.6 + rand() * 1.8);
    m.userData.bob = rand() * 6;
    decor.add(m);
  }
  cfg.floaters.forEach((f, idx) => {
    loader.load(f.src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      for (let c = 0; c < (f.count || 3); c++) {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, alphaTest: 0.05 }));
        const a = t.image.width / t.image.height, s = (f.size || 0.5) * (0.8 + rand() * 0.5);
        sp.scale.set(s * a, s, 1);
        const ang = rand() * Math.PI * 2, rad = R + 1 + rand() * 3;
        sp.position.set(Math.cos(ang) * rad, -0.5 + rand() * (topY + 2), Math.sin(ang) * rad);
        if (near(sp.position)) continue;
        sp.material.rotation = rand() * 6.28;
        sp.userData.bob = rand() * 6 + idx;
        decor.add(sp);
      }
      dirty = true;
    });
  });
  scene.add(decor);

  // ---------- camera keys: intro wide, one per product, outro wide ----------
  const fovTan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const up = new THREE.Vector3(0, 1, 0);
  let keys = [];
  const buildKeys = () => {
    const aspect = camera.aspect;
    const narrow = aspect < 0.95;
    keys = [];
    const ax = (y) => new THREE.Vector3(0, y, 0);
    const i0 = stopStep[0] - 2.5;
    // intro: from low and wide, looking up the spiral
    keys.push({ pos: at(i0, R + 13, -1.6), look: ax(topY * 0.42) });
    products.forEach((pl) => {
      const { h, base } = pl.userData;
      const centre = base.clone().setY(base.y + h * 0.52);
      const out = new THREE.Vector3(base.x, 0, base.z).normalize();
      const dist = h / ((narrow ? 0.34 : 0.62) * 2 * fovTan);
      const pos = centre.clone().addScaledVector(out, dist).addScaledVector(up, h * 0.42);
      // put the product in the right third (captions sit on the left); centred on phones
      const fwd = centre.clone().sub(pos).normalize();
      const right = new THREE.Vector3().crossVectors(fwd, up).normalize();
      const halfW = dist * fovTan * aspect;
      const look = centre.clone().addScaledVector(right, narrow ? 0 : -0.36 * halfW).addScaledVector(up, narrow ? -h * 0.62 : 0);
      keys.push({ pos, look });
    });
    const iN = stopStep[n - 1] + 3;
    keys.push({ pos: at(iN, R + 12.5, 2.2), look: ax(topY * 0.55) });
    // wide shots: push the spiral to the right so the headline has the left side
    if (!narrow) [keys[0], keys[keys.length - 1]].forEach((key) => {
      const fwd = key.look.clone().sub(key.pos);
      const halfW = fwd.length() * fovTan * aspect;
      const right = new THREE.Vector3().crossVectors(fwd.normalize(), up).normalize();
      key.look.addScaledVector(right, -0.3 * halfW);
    });
    // wide control points between keys: swing out and look at the spiral's axis
    for (let k = 0; k < keys.length - 1; k++) {
      const a = keys[k], b = keys[k + 1];
      const mid = a.pos.clone().add(b.pos).multiplyScalar(0.5);
      const flat = new THREE.Vector3(mid.x, 0, mid.z);
      const r = Math.max(flat.length(), 1);
      a.mPos = flat.normalize().multiplyScalar(r + (k === 0 || k === keys.length - 2 ? 2 : 5.5)).setY(mid.y + 1.2);
      a.mLook = new THREE.Vector3(0, (a.look.y + b.look.y) / 2, 0);
    }
  };

  // ---------- state ----------
  let target = 0, current = 0, visible = true, dirty = true, raf = 0, last = performance.now();
  const mouse = new THREE.Vector2(), mouseS = new THREE.Vector2();
  const pos = new THREE.Vector3(), look = new THREE.Vector3(), lookTmp = new THREE.Vector3();

  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    buildKeys();
    dirty = true;
  };

  const progress = () => {
    const r = section.getBoundingClientRect();
    const run = r.height - innerHeight;
    return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
  };

  let shown = -1;
  const place = (p) => {
    const K = keys.length - 1;
    const u = Math.min(K - 1e-6, p * K);
    const k = Math.floor(u), f = u - k;
    const h = cfg.hold / 2;
    const t = ease(Math.min(1, Math.max(0, (f - h) / (1 - 2 * h))));
    const a = keys[k], b = keys[k + 1];
    bez(a.pos, a.mPos, b.pos, t, pos);
    bez(a.look, a.mLook, b.look, t, look);
    // captions: the key we rest on, with a little slack either side of the hold
    const on = f < h + 0.06 ? k : f > 1 - h - 0.06 ? k + 1 : -1;
    if (on !== shown) {
      shown = on;
      captions.forEach((c, i) => c && c.classList.toggle('is-on', i === on));
      section.querySelectorAll('[data-stair-go]').forEach((a) => {
        if (+a.dataset.stairGo === on) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      });
      section.dataset.key = on;
    }
    section.style.setProperty('--p', p.toFixed(4));
  };

  const frame = (now) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    current += (target - current) * Math.min(1, dt * 7);
    if (Math.abs(target - current) < 0.00005) current = target;
    place(current);
    mouseS.lerp(mouse, Math.min(1, dt * 3));
    camera.position.copy(pos).add(lookTmp.set(mouseS.x * 0.35, mouseS.y * 0.2, 0).applyQuaternion(camera.quaternion));
    camera.lookAt(look);
    const time = now / 1000;
    decor.children.forEach((m) => {
      if (m.userData.spin) { m.rotation.x += m.userData.spin.x * dt; m.rotation.y += m.userData.spin.y * dt; m.rotation.z += m.userData.spin.z * dt; }
      if (m.userData.bob !== undefined) m.position.y += Math.sin(time * 0.6 + m.userData.bob) * 0.0016;
    });
    products.forEach((pl) => {   // face the camera around the vertical axis
      pl.rotation.y = Math.atan2(camera.position.x - pl.position.x, camera.position.z - pl.position.z);
    });
    sun.position.set(camera.position.x * 0.2 + 6, look.y + 14, camera.position.z * 0.2 + 9);
    sun.target.position.set(0, look.y, 0);
    renderer.render(scene, camera);
    if (!section.classList.contains('is-ready')) section.classList.add('is-ready');
    dirty = false;
    if (visible) raf = requestAnimationFrame(frame);
  };
  const kick = () => { if (!raf && visible) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  // click a product to open it
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
    ndc.copy(mouse);
    ray.setFromCamera(ndc, camera);
    canvas.style.cursor = ray.intersectObjects(products).length ? 'pointer' : '';
  });
  canvas.addEventListener('click', () => {
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(products)[0];
    if (hit && hit.object.userData.href) location.href = hit.object.userData.href;
  });

  // jump links: a[data-stair-go="2"] scrolls to that key (0 = intro)
  section.querySelectorAll('[data-stair-go]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const K = keys.length - 1, k = +a.dataset.stairGo;
    const run = section.offsetHeight - innerHeight;
    scrollTo({ top: section.offsetTop + (k / K) * run, behavior: 'smooth' });
  }));

  resize();
  addEventListener('resize', resize);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); }).observe(section);
  const onScroll = () => { target = progress(); kick(); };
  addEventListener('scroll', onScroll, { passive: true });
  target = current = progress();
  kick();
  return { keys: () => keys.length };
}
