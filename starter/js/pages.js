// Page-specific behaviour, chosen by <body data-page="...">. Each block fills the hooks its page has.
import { site, products, byId, cardHTML, priceHTML, esc, tbc, waLink } from './app.js';

const page = document.body.dataset.page;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Any page: product grids. <div data-products></div> = all, data-products="featured" or "id1,id2".
document.querySelectorAll('[data-products]').forEach((el) => {
  const v = el.dataset.products;
  const list = !v ? products : v === 'featured' ? products.filter((p) => p.featured) : v.split(',').map((id) => byId[id]).filter(Boolean);
  el.innerHTML = list.map(cardHTML).join('');
});

// Any page: store lists from data/stores.json. <ul data-stores></ul>
const storeEls = document.querySelectorAll('[data-stores]');
if (storeEls.length) {
  const st = await (await fetch('data/stores.json')).json();
  const outlet = (o) => `<li><strong>${tbc(o.name)}</strong>${o.address ? `<br>${tbc(o.address)}` : ''}${o.mapUrl ? ` <a href="${esc(o.mapUrl)}" target="_blank" rel="noopener">Map</a>` : ''}</li>`;
  storeEls.forEach((el) => {
    el.innerHTML = st.groups.map((g) => `<li class="store"><h3>${esc(g.name)}</h3><ul>${g.outlets.map(outlet).join('')}</ul></li>`).join('');
  });
}

// Shop: category filter, search and sort. Category is kept in the URL (shop.html?cat=Category%20A).
if (page === 'shop') {
  const grid = document.querySelector('[data-shop-grid]');
  const chips = document.querySelector('[data-filter-cats]');
  const search = document.querySelector('[data-filter-search]');
  const sort = document.querySelector('[data-filter-sort]');
  const count = document.querySelector('[data-filter-count]');
  const cats = [...new Set(products.map((p) => p.category))];
  let cat = new URLSearchParams(location.search).get('cat') || '';
  if (!cats.includes(cat)) cat = '';
  chips.innerHTML = ['', ...cats].map((c) => `<button type="button" class="chip" data-cat="${esc(c)}" aria-pressed="${c === cat}">${c ? esc(c) : 'All'}</button>`).join('');
  const price = (p) => p.sizes[0].price ?? Infinity;
  const render = () => {
    const q = search.value.trim().toLowerCase();
    let list = products.filter((p) => (!cat || p.category === cat) && (!q || `${p.name} ${p.summary} ${p.category}`.toLowerCase().includes(q)));
    if (sort.value === 'price-asc') list = [...list].sort((a, b) => price(a) - price(b));
    if (sort.value === 'price-desc') list = [...list].sort((a, b) => (price(b) === Infinity ? -1 : price(b)) - (price(a) === Infinity ? -1 : price(a)));
    if (sort.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    grid.innerHTML = list.length ? list.map(cardHTML).join('') : '<p class="empty">No products match. Try another filter.</p>';
    count.textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  };
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.dataset.cat;
    chips.querySelectorAll('[data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const url = new URL(location.href);
    if (cat) url.searchParams.set('cat', cat); else url.searchParams.delete('cat');
    history.replaceState(null, '', url);
    render();
  });
  search.addEventListener('input', render);
  sort.addEventListener('change', render);
  render();
}

// Product page: product.html?id=product-one (falls back to the first product).
if (page === 'product') {
  const p = byId[new URLSearchParams(location.search).get('id')] || products[0];
  document.title = `${p.name} | ${site.brand}`;
  const set = (sel, html) => document.querySelectorAll(sel).forEach((el) => { el.innerHTML = html; });
  set('[data-p-name]', esc(p.name));
  set('[data-p-category]', `<a href="shop.html?cat=${encodeURIComponent(p.category)}">${esc(p.category)}</a>`);
  set('[data-p-summary]', tbc(p.summary));
  set('[data-p-description]', tbc(p.description));
  set('[data-p-notes]', (p.notes || []).map((n) => `<li>${tbc(n)}</li>`).join(''));
  set('[data-p-details]', tbc(p.details));
  document.querySelectorAll('[data-p-image]').forEach((img) => { img.src = p.image; img.alt = p.name; });

  const add = document.querySelector('[data-p-add]');
  const qty = document.querySelector('[data-qty]');
  const sizeSel = document.querySelector('[data-p-size]');
  sizeSel.innerHTML = p.sizes.map((s, i) => `<option value="${i}">${esc(s.label)}</option>`).join('');
  sizeSel.closest('label').hidden = p.sizes.length < 2;
  const setSize = () => {
    const s = p.sizes[+sizeSel.value || 0];
    set('[data-p-price]', priceHTML(p, s, 'pdp-price'));
    add.dataset.id = p.id;
    add.dataset.size = s.label;
  };
  const setQ = (n) => { qty.value = Math.max(1, Math.min(99, n || 1)); add.dataset.qty = qty.value; };
  sizeSel.addEventListener('change', setSize);
  document.querySelectorAll('[data-qty-step]').forEach((b) => b.addEventListener('click', () => setQ(+qty.value + +b.dataset.qtyStep)));
  qty.addEventListener('input', () => setQ(+qty.value));
  setSize();
  setQ(1);
  document.querySelectorAll('[data-p-ask]').forEach((a) => { a.href = waLink(`Hi ${site.brand}, a question about ${p.name}: `); });
  document.querySelectorAll('[data-p-market]').forEach((a) => {
    const u = p.marketplaceUrl || site.marketplace?.url;
    if (u) a.href = u; else a.hidden = true;
  });
  const others = document.querySelector('[data-p-others]');
  if (others) others.innerHTML = products.filter((x) => x !== p).slice(0, 4).map(cardHTML).join('');
}

// Contact / wholesale: a quote form that writes the WhatsApp message live.
if (page === 'contact') {
  const form = document.querySelector('[data-quote]');
  const preview = document.querySelector('[data-quote-preview]');
  const send = document.querySelector('[data-quote-send]');
  form.elements.purpose.innerHTML = site.quotePurposes.map((t) => `<option>${esc(t)}</option>`).join('');
  form.querySelector('[data-quote-qty]').innerHTML = products.map((p) => `<label class="q-item"><span>${esc(p.name)}</span><input type="number" min="0" max="9999" step="1" value="0" name="qty-${esc(p.id)}" inputmode="numeric" aria-label="${esc(p.name)}, quantity"></label>`).join('');
  const update = () => {
    const f = new FormData(form);
    const lines = products.map((p) => [p, +f.get(`qty-${p.id}`) || 0]).filter(([, n]) => n > 0);
    const total = lines.reduce((s, [, n]) => s + n, 0);
    const text = [
      `Hi ${site.brand}, I would like a quote.`,
      `For: ${f.get('purpose')}`,
      lines.length ? lines.map(([p, n]) => `${n} x ${p.name}`).join('\n') : 'Products: not sure yet, please advise',
      total ? `Total: ${total} units` : '',
      f.get('date') ? `Needed by: ${f.get('date')}` : '',
      f.get('area') ? `Deliver to: ${f.get('area')}` : '',
      f.get('name') ? `Name: ${f.get('name')}${f.get('company') ? `, ${f.get('company')}` : ''}` : '',
      f.get('note') ? `Note: ${f.get('note')}` : '',
    ].filter(Boolean).join('\n');
    preview.textContent = text;
    send.href = waLink(text);
    document.querySelectorAll('[data-quote-total]').forEach((el) => { el.textContent = String(total); });
  };
  form.addEventListener('input', update);
  form.addEventListener('submit', (e) => { e.preventDefault(); window.open(send.href, '_blank', 'noopener'); });
  // Buttons elsewhere can preset the purpose: <button data-quote-preset="Gift orders">
  document.querySelectorAll('[data-quote-preset]').forEach((b) => b.addEventListener('click', () => {
    form.elements.purpose.value = b.dataset.quotePreset;
    update();
    form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  update();
}
