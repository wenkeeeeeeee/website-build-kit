// Cart: a small, framework-free basket that sends the order as a pre-written WhatsApp message,
// or opens the marketplace store. All business details come from data/site.json via app.js.
//   const cart = createCart({ products, site });
const MAX_QTY = 99;

export function createCart({ products, site, storage = globalThis.localStorage }) {
  const storageKey = site.storageKey || 'cart-v1';
  const money = (n) => (site.currency || '$') + (Math.round(n * 100) / 100).toFixed(2);
  const byId = new Map(products.map((p) => [p.id, p]));
  const listeners = new Set();
  let lines = load();

  function load() {
    try {
      const raw = storage && storage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((l) => byId.has(l.id) && l.qty > 0) : [];
    } catch {
      return [];
    }
  }
  function save() {
    try {
      storage && storage.setItem(storageKey, JSON.stringify(lines));
    } catch {
      /* storage full or blocked: keep the in-memory cart */
    }
    listeners.forEach((fn) => fn(api));
  }
  const find = (id, size) => lines.find((l) => l.id === id && (l.size ?? null) === (size ?? null));
  const priceOf = (id, size) => {
    const p = byId.get(id);
    const s = p && (p.sizes || []).find((x) => (x.label ?? null) === (size ?? null));
    return s && typeof s.price === 'number' ? s.price : null;
  };

  const api = {
    add(id, size = null, qty = 1) {
      if (!byId.has(id) || qty < 1) return;
      size = size ?? byId.get(id).sizes?.[0]?.label ?? null;
      const l = find(id, size);
      if (l) l.qty = Math.min(MAX_QTY, l.qty + qty);
      else lines.push({ id, size, qty: Math.min(MAX_QTY, qty) });
      save();
    },
    setQty(id, size, qty) {
      const l = find(id, size);
      if (!l) return;
      if (qty < 1) lines = lines.filter((x) => x !== l);
      else l.qty = Math.min(MAX_QTY, Math.floor(qty));
      save();
    },
    remove(id, size) {
      lines = lines.filter((l) => !(l.id === id && (l.size ?? null) === (size ?? null)));
      save();
    },
    clear() {
      lines = [];
      save();
    },
    items() {
      return lines.map((l) => {
        const p = byId.get(l.id);
        const unitPrice = priceOf(l.id, l.size);
        return { id: l.id, size: l.size, qty: l.qty, name: p.name, image: p.image || null, unitPrice, lineTotal: unitPrice == null ? null : unitPrice * l.qty };
      });
    },
    count: () => lines.reduce((n, l) => n + l.qty, 0),
    subtotal: () => api.items().reduce((s, i) => s + (i.lineTotal || 0), 0),
    hasUnpriced: () => api.items().some((i) => i.unitPrice == null),
    money,
    orderText() {
      const rows = api.items().map((i) => `${i.qty} x ${i.name}${i.size ? ` (${i.size})` : ''}${i.lineTotal != null ? ` - ${money(i.lineTotal)}` : ''}`);
      return rows.join('\n') + (rows.length ? `\nSubtotal: ${money(api.subtotal())}${api.hasUnpriced() ? ' + items to price' : ''}` : '');
    },
    // One product in the basket with its own marketplace link: go straight to it; otherwise the store.
    marketplaceUrl() {
      const ids = [...new Set(lines.map((l) => l.id))];
      const only = ids.length === 1 ? byId.get(ids[0]) : null;
      return (only && only.marketplaceUrl) || site.marketplace?.url || '';
    },
    whatsappUrl() {
      // Compact ASCII lines keep the encoded link short (long wa.me links get truncated).
      const rows = api.items().map((i) => `${i.qty} x ${i.name}${i.size ? ` (${i.size})` : ''}`);
      const text = `Hi ${site.brand}, I'd like to order:\n${rows.join('\n')}\nSubtotal: ${money(api.subtotal())}${api.hasUnpriced() ? ' + items to price' : ''}`;
      return `https://wa.me/${site.whatsapp.intl}?text=${encodeURIComponent(text)}`;
    },
    onChange(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
  return api;
}
