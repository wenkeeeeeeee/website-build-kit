# Website starter (plumbing, not a design)

Copy this folder to `variants/<nn-name>/site`, then swap the data and redesign everything visible.
Static HTML/CSS/vanilla JS, no build step. Serve it over HTTP (it fetches JSON), e.g. `python tools/web/serve.py site 8080`.

**Pages:** `index.html` home · `shop.html` catalogue with category/search/sort filters · `product.html?id=<id>` product page from JSON · `about.html` story · `stores.html` where to buy · `contact.html` contact + wholesale quote form.

**Data (the only place business details live):**
- `data/site.json`: brand, tagline, currency, WhatsApp number (`intl` for links, `display` for text), email, address, hours, marketplace name/URL, socials, quote purposes, basket storage key.
- `data/products.json`: id, name, category, copy, image, sizes with prices (`null` = "[client to confirm price]"), `featured`, optional per-product `marketplaceUrl`.
- `data/stores.json`: retailer groups and their outlets.

**Code:** `js/app.js` loads the data, fills `data-site`, `data-wa`, `data-marketplace`, `data-social`, `data-email` hooks, renders cards and handles add-to-basket (`data-add-to-cart data-id="..."`; comma-separated ids add a set). `js/pages.js` runs per page (`<body data-page>`). `js/cart/` is the basket and drawer. `css/site.css` is a bare layout to replace. `assets/img/*.svg` are placeholders.

**Checkout:** the basket is saved in localStorage. "Send my order on WhatsApp" opens `wa.me/<number>` with the order and subtotal pre-written; the marketplace link opens the product's own `marketplaceUrl` (if only that product is in the basket) or the store URL, and copies the order list. Clear `marketplace.url` to hide it. The quote form builds its own WhatsApp message live.

Keep the `data-*` hooks when redesigning; restyle or rename classes freely. Replace every `[client to confirm]` before launch.
