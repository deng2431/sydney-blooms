# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

```bash
# Start the server (required — public pages fetch content from the API at runtime)
node server.js
# or with auto-restart on file changes:
node --watch server.js
```

Site: http://localhost:3000  
Admin panel: http://localhost:3000/admin (login: `admin` / see `.env`)

PostgreSQL must be running before the server starts:
```bash
sudo service postgresql start
```

## Architecture

This is a **Node.js + Express** app serving a flower shop website. There is no build step and no frontend framework.

### How content flows

The public HTML pages (`index.html`, `shop.html`, `about.html`, `contact.html`) are served as static files by Express. On page load, `js/content-loader.js` fetches from three API endpoints and populates the page:

- `[data-content="<key>"]` elements are filled from `/api/content` or `/api/contact`
- `#featuredGrid` (home) and `#grid-bouquet/wedding/seasonal` (shop) are built dynamically from `/api/products`

This means **the server must be running** for the public pages to show real content. The fallback text hardcoded in the HTML is shown if the API is unreachable.

### Database

PostgreSQL with three tables:

| Table | Purpose |
|-------|---------|
| `products` | All flower catalogue cards (category, name, description, price, tag, image_path, sort_order) |
| `site_content` | Key/value store for page text (hero headline, about story paragraphs, etc.) |
| `contact_info` | Key/value store for contact details (address, phone, email, hours) |

Schema and seed data: `migrations/001_init.sql`  
Run once on a fresh database: `psql $DATABASE_URL -f migrations/001_init.sql`

Direct DB access: `psql postgresql://sydneyblooms:blooms2025@localhost:5432/sydneyblooms`

### Admin panel

All admin pages live in `admin/`. They are plain HTML files with no server-side rendering — auth is checked client-side on load via `GET /api/auth/check`, which redirects to the login page if the JWT cookie is missing or expired.

`admin/js/admin.js` handles all four admin pages in one file, branching by checking which key DOM element exists (`#loginForm`, `#dashStats`, `#productsTable`, `#contentForm`, `#contactForm`).

### Auth

`POST /api/auth/login` validates username/password against `.env` values, issues a `httpOnly` JWT cookie (24h expiry). All mutating API routes are protected by `server/middleware/requireAuth.js`, which verifies the cookie on each request.

### Image uploads

Product images are uploaded via `multer` (5MB limit, images only) and saved to `images/` with a `product-<timestamp>.<ext>` filename. The stored `image_path` is an absolute path like `/images/product-123.jpg`. To replace a product image without uploading a new file, the current path is sent as the hidden field `image_path` in the form.

### CSS design tokens

All colours, fonts, and spacing are defined as CSS variables in `css/style.css` under `:root`. The admin panel imports Google Fonts directly and redefines the same variables in `admin/css/admin.css` — they are not shared. The colour palette: `--cream` (#FDFAF6), `--sage` (#8FAF8F), `--blush` (#D4A5A5), `--charcoal` (#2C2C2C).

## Adding a new content field

1. Add a `INSERT INTO site_content` row in `migrations/001_init.sql` (for documentation and future fresh installs)
2. Insert the row into the running DB directly: `psql $DATABASE_URL -c "INSERT INTO site_content (key,value) VALUES ('my_key','default') ON CONFLICT DO NOTHING;"`
3. Add `data-content="my_key"` to the HTML element on the relevant public page
4. Add the editable field to `admin/content.html` with `data-key="my_key"`

## Adding a new product category

`category` is a free-text `VARCHAR` in the `products` table. To add a new category beyond `bouquet`, `wedding`, `seasonal`:

1. Add it to the `<select>` in `admin/products.html`
2. Add a `#grid-<category>` element and section in `shop.html`
3. `js/content-loader.js` → add the new category to the loop in `renderProducts()`
4. Add a CSS `.badge.<category>` colour rule in `admin/css/admin.css`
