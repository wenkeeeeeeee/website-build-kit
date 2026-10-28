// Cart drawer: accessible slide-in basket. Restyle it freely with CSS (classes prefixed cd-).
//   mountCartDrawer({ cart, title: 'Your basket', marketplaceName: 'Marketplace store' });
// Page hooks: <button data-cart-open>Basket <span data-cart-count>0</span></button>
// Add-to-basket buttons are handled in app.js. Checkout opens WhatsApp with the order written out;
// the second link opens the marketplace store and copies the order list to the clipboard.
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function mountCartDrawer({ cart, title = 'Your basket', checkoutLabel = 'Send my order on WhatsApp', marketplaceName = '', emptyText = 'Your basket is empty.' }) {
  const fmt = cart.money;
  const root = document.createElement('div');
  root.className = 'cd-root';
  root.innerHTML = `
    <div class="cd-overlay" data-cd-close></div>
    <aside class="cd-drawer" role="dialog" aria-modal="true" aria-labelledby="cd-title" tabindex="-1">
      <header class="cd-head"><h2 class="cd-title" id="cd-title">${esc(title)}</h2>
        <button class="cd-close" type="button" data-cd-close aria-label="Close basket">×</button></header>
      <ul class="cd-lines" aria-live="polite"></ul>
      <p class="cd-empty">${esc(emptyText)}</p>
      <footer class="cd-foot">
        <div class="cd-subtotal"><span>Subtotal</span><strong data-cd-subtotal>${fmt(0)}</strong></div>
        <p class="cd-note" data-cd-note hidden></p>
        <a class="cd-checkout" data-cd-checkout href="#" target="_blank" rel="noopener">${esc(checkoutLabel)}</a>
        <a class="cd-market" data-cd-market href="#" target="_blank" rel="noopener">Or order on our ${esc(marketplaceName || 'marketplace store')}</a>
        <p class="cd-fine">We reply on WhatsApp to confirm stock, delivery and payment.</p>
      </footer>
    </aside>`;
  document.body.appendChild(root);
  root.inert = true;
  const drawer = root.querySelector('.cd-drawer');
  const list = root.querySelector('.cd-lines');
  const note = root.querySelector('[data-cd-note]');
  const market = root.querySelector('[data-cd-market]');
  let lastFocus = null;

  function render() {
    const items = cart.items();
    list.innerHTML = items.map((i, n) => `
      <li class="cd-line">
        ${i.image ? `<img class="cd-thumb" src="${esc(i.image)}" alt="" width="64" height="64" loading="lazy">` : '<span class="cd-thumb" aria-hidden="true"></span>'}
        <div class="cd-info"><p class="cd-name">${esc(i.name)}</p>${i.size ? `<p class="cd-size">${esc(i.size)}</p>` : ''}
          <p class="cd-price">${i.unitPrice != null ? fmt(i.unitPrice) : '[client to confirm price]'}</p></div>
        <div class="cd-qty" role="group" aria-label="Quantity for ${esc(i.name)}">
          <button type="button" data-cd-dec="${n}" aria-label="One fewer">−</button><span>${i.qty}</span><button type="button" data-cd-inc="${n}" aria-label="One more">+</button>
        </div>
        <button type="button" class="cd-remove" data-cd-remove="${n}" aria-label="Remove ${esc(i.name)}">Remove</button>
      </li>`).join('');
    root.classList.toggle('is-empty', items.length === 0);
    root.querySelector('[data-cd-subtotal]').textContent = fmt(cart.subtotal());
    note.hidden = !cart.hasUnpriced();
    note.textContent = 'Some prices are still to be confirmed; we will quote them on WhatsApp.';
    const co = root.querySelector('[data-cd-checkout]');
    co.href = cart.whatsappUrl();
    co.setAttribute('aria-disabled', String(items.length === 0));
    const mUrl = cart.marketplaceUrl();
    market.hidden = !mUrl;
    market.href = mUrl || '#';
    document.querySelectorAll('[data-cart-count]').forEach((el) => { el.textContent = String(cart.count()); });
  }

  function trap(e) {
    if (e.key === 'Escape') return close();
    if (e.key !== 'Tab') return;
    const f = [...drawer.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null);
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
  function open() {
    lastFocus = document.activeElement;
    render();
    root.inert = false;
    root.classList.add('is-open');
    document.documentElement.classList.add('cd-locked');
    document.addEventListener('keydown', trap);
    setTimeout(() => drawer.focus({ preventScroll: true }), 30);
  }
  function close() {
    root.classList.remove('is-open');
    root.inert = true;
    document.documentElement.classList.remove('cd-locked');
    document.removeEventListener('keydown', trap);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-cd-close],[data-cd-inc],[data-cd-dec],[data-cd-remove],[data-cd-checkout],[data-cd-market]');
    if (!t) return;
    const items = cart.items();
    if (t.hasAttribute('data-cd-close')) return close();
    if (t.hasAttribute('data-cd-checkout')) {
      if (!items.length) e.preventDefault();
      return;
    }
    if (t.hasAttribute('data-cd-market')) {
      if (items.length && navigator.clipboard) navigator.clipboard.writeText(cart.orderText()).catch(() => {});
      if (items.length) { note.hidden = false; note.textContent = 'Your list is copied, ready to paste in the store chat.'; }
      return;
    }
    const i = items[+(t.dataset.cdInc ?? t.dataset.cdDec ?? t.dataset.cdRemove)];
    if (!i) return;
    if (t.hasAttribute('data-cd-inc')) cart.setQty(i.id, i.size, i.qty + 1);
    else if (t.hasAttribute('data-cd-dec')) cart.setQty(i.id, i.size, i.qty - 1);
    else cart.remove(i.id, i.size);
  });
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-cart-open]')) { e.preventDefault(); open(); }
  });
  cart.onChange(render);
  render();
  return { open, close, render, root };
}

// Minimal unskinned layout so the drawer works before the site styles it.
const base = document.createElement('style');
base.textContent = `.cd-root{position:fixed;inset:0;z-index:1000;pointer-events:none}
.cd-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0;transition:opacity .3s}
.cd-drawer{position:absolute;top:0;right:0;height:100%;width:min(440px,100vw);display:flex;flex-direction:column;background:#fff;transform:translateX(100%);transition:transform .35s ease;outline:none}
.cd-root.is-open{pointer-events:auto}.cd-root.is-open .cd-overlay{opacity:1}.cd-root.is-open .cd-drawer{transform:none}
.cd-head,.cd-foot{padding:20px 24px}.cd-head{display:flex;justify-content:space-between;align-items:center}
.cd-lines{list-style:none;margin:0;padding:0 24px;overflow:auto;flex:1}.cd-line{display:grid;grid-template-columns:64px 1fr auto;gap:12px;align-items:center;padding:14px 0}
.cd-line p{margin:0}.cd-thumb{width:64px;height:64px;object-fit:contain;background:#eee}.cd-remove{grid-column:2/4;justify-self:start;background:none;border:0;padding:0;text-decoration:underline;cursor:pointer}
.cd-empty{display:none;padding:0 24px;flex:1}.cd-root.is-empty .cd-empty{display:block}.cd-root.is-empty .cd-lines{display:none}
.cd-subtotal{display:flex;justify-content:space-between;margin-bottom:12px}.cd-checkout,.cd-market{display:block;text-align:center;padding:14px;margin-top:8px}
.cd-checkout{background:#222;color:#fff;text-decoration:none}.cd-market[hidden]{display:none}
.cd-checkout[aria-disabled=true]{opacity:.45;pointer-events:none}html.cd-locked{overflow:hidden}
.cd-qty button,.cd-close{min-width:36px;min-height:36px;cursor:pointer}
@media (prefers-reduced-motion:reduce){.cd-drawer,.cd-overlay{transition:none}}`;
document.head.prepend(base);
