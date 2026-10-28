// Shared behaviour for every page: loads data/site.json and data/products.json, fills the business
// details into the HTML hooks, header menu, basket drawer, add-to-basket toast.
import { createCart } from './cart/cart.js';
import { mountCartDrawer } from './cart/cart-drawer.js';

const getJSON = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(`${url}: ${r.status}`); return r.json(); });
export const [site, products] = await Promise.all([getJSON('data/site.json'), getJSON('data/products.json')]);
export const byId = Object.fromEntries(products.map((p) => [p.id, p]));

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const money = (n) => site.currency + Number(n).toFixed(2);
// Escape text and highlight any "[client to confirm ...]" placeholder.
export const tbc = (s) => esc(s).replace(/\[client to confirm[^\]]*\]/g, (m) => `<span class="tbc">${m}</span>`);
export const waLink = (text) => `https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(text)}`;
const fill = (text) => String(text).replaceAll('{brand}', site.brand);

export function priceHTML(p, size = p.sizes[0], cls = 'price') {
  return size.price != null
    ? `<p class="${cls}">${money(size.price)} <span>/ ${esc(size.label)}</span></p>`
    : `<p class="${cls}">${esc(size.label)} · <span class="tbc">[client to confirm price]</span></p>`;
}
export const addBtn = (p, label = 'Add to basket', cls = 'btn') =>
  `<button class="${cls}" type="button" data-add-to-cart data-id="${esc(p.id)}" data-size="${esc(p.sizes[0].label)}">${label}</button>`;

// One product card. Restyle .card freely; keep the data-* hooks.
export function cardHTML(p) {
  const url = `product.html?id=${encodeURIComponent(p.id)}`;
  return `<article class="card" data-card>
    <a class="card-media" href="${url}" tabindex="-1" aria-hidden="true"><img src="${esc(p.image)}" alt="" width="320" height="320" loading="lazy"></a>
    <div class="card-body">
      <p class="card-cat">${esc(p.category)}</p>
      <h3 class="card-name"><a href="${url}">${esc(p.name)}</a></h3>
      <p class="card-line">${tbc(p.summary)}</p>
      ${priceHTML(p)}
      ${addBtn(p)}
    </div>
  </article>`;
}

// Business details into the page. Hooks:
//   data-site="brand|tagline|email|address|hours|whatsapp"  text from site.json
//   data-wa="Hi {brand}, ..."     WhatsApp link with a pre-written message
//   data-marketplace              marketplace store link (hidden if no URL)
//   data-social="instagram"       social link (hidden if empty)
//   data-email                    mailto link
//   data-product-links            list of links to every product
const siteText = { brand: site.brand, tagline: site.tagline, email: site.email, address: site.address, hours: site.hours, whatsapp: site.whatsapp.display, marketplace: site.marketplace?.name };
document.title = document.title.replaceAll('Brand Name', site.brand);
document.querySelectorAll('[data-site]').forEach((el) => { const v = siteText[el.dataset.site]; if (v != null) el.innerHTML = tbc(v); });
document.querySelectorAll('[data-wa]').forEach((a) => { a.href = waLink(fill(a.dataset.wa || 'Hi {brand}, ')); });
document.querySelectorAll('[data-marketplace]').forEach((a) => { if (site.marketplace?.url) a.href = site.marketplace.url; else (a.closest('li') || a).hidden = true; });
document.querySelectorAll('[data-social]').forEach((a) => { const u = site.socials?.[a.dataset.social]; if (u) a.href = u; else (a.closest('li') || a).hidden = true; });
document.querySelectorAll('[data-email]').forEach((a) => { a.href = `mailto:${site.email}`; });
document.querySelectorAll('[data-product-links]').forEach((ul) => {
  ul.innerHTML = products.map((p) => `<li><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></li>`).join('');
});

// Header: mobile menu and current page.
const menuBtn = document.querySelector('[data-menu-btn]');
if (menuBtn) menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('menu-open', open);
});
document.querySelectorAll('[data-nav] a').forEach((a) => { if (a.pathname === location.pathname) a.setAttribute('aria-current', 'page'); });

// Basket.
export const cart = createCart({ products, site });
export const drawer = mountCartDrawer({ cart, title: 'Your basket', marketplaceName: site.marketplace?.name });

// Add to basket: <button data-add-to-cart data-id="product-one" data-size="Standard" data-qty="1">.
// data-id="a,b,c" adds a set (first size of each). Shows a toast; set data-open-cart to open the drawer instead.
let toast, toastT;
function showToast(name) {
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.append(toast);
  }
  toast.innerHTML = `<div><p class="toast-h">Added to basket</p><p>${esc(name)}</p></div><button type="button" class="btn btn-sm" data-cart-open>View basket</button>`;
  toast.classList.add('is-on');
  clearTimeout(toastT);
  toastT = setTimeout(() => toast.classList.remove('is-on'), 3600);
}
document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add-to-cart]');
  if (!add) return;
  e.preventDefault();
  const ids = (add.dataset.id || '').split(',').filter((id) => byId[id]);
  if (!ids.length) return;
  const qty = Math.max(1, +(add.dataset.qty || 1));
  ids.forEach((id) => cart.add(id, ids.length === 1 ? add.dataset.size || null : null, qty));
  if (add.hasAttribute('data-open-cart')) drawer.open();
  else showToast(ids.length > 1 ? add.dataset.setName || 'A set' : byId[ids[0]].name);
});
