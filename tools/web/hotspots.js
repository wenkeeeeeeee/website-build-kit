// Shop-the-look hotspots on a cropped photo. Positions are fractions of the IMAGE, not of the box, so a dot stays
// on the product whatever object-fit: cover and object-position crop away at any screen size.
//   <figure style="position:relative">
//     <img src="look.webp" width="1600" height="1000" alt="..." style="width:100%;height:100%;object-fit:cover">
//     <div data-hs data-hs-x=".42" data-hs-y=".31">
//       <button class="hs-dot" type="button" aria-expanded="false" aria-label="Shop the look: Product name"></button>
//       <div class="hs-card">...product image, name, add-to-basket...</div>
//     </div>
//   </figure>
// Load it as a module. Style [data-hs] as position:absolute, and show .hs-card under [data-hs].is-open. `.is-left`
// means open it to the left of the dot: near the right edge of the photo there is no room on the right.
const CARD_ROOM = 290;
const all = [...document.querySelectorAll('[data-hs]')];

function place(hs) {
  const img = hs.parentElement.querySelector('img');
  const bw = img.clientWidth, bh = img.clientHeight;
  const iw = img.naturalWidth || +img.getAttribute('width'), ih = img.naturalHeight || +img.getAttribute('height');
  const s = Math.max(bw / iw, bh / ih), dw = iw * s, dh = ih * s;
  const [px, py] = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
  const x = (bw - dw) * px + +hs.dataset.hsX * dw, y = (bh - dh) * py + +hs.dataset.hsY * dh;
  hs.style.left = `${x}px`; hs.style.top = `${y}px`;
  hs.classList.toggle('is-left', x > bw - CARD_ROOM);
}
const close = () => all.forEach((h) => {
  h.classList.remove('is-open');
  h.querySelector('.hs-dot')?.setAttribute('aria-expanded', 'false');
});

all.forEach((hs) => {
  const dot = hs.querySelector('.hs-dot');
  dot?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !hs.classList.contains('is-open');
    close();
    hs.classList.toggle('is-open', open);
    dot.setAttribute('aria-expanded', String(open));
  });
  const img = hs.parentElement.querySelector('img');
  if (img.complete) place(hs); else img.addEventListener('load', () => place(hs));
});
if (all.length) {
  addEventListener('resize', () => all.forEach(place));
  document.addEventListener('click', (e) => { if (!e.target.closest('[data-hs]')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
