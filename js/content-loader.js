/* ============================================================
   SYDNEY BLOOMS — Dynamic content loader for public pages
   Keys are authoritative from content-schema.js
   ============================================================ */

async function loadPageContent() {
  try {
    const [content, contact, products] = await Promise.all([
      fetch('/api/content').then(r => r.ok ? r.json() : {}),
      fetch('/api/contact').then(r => r.ok ? r.json() : {}),
      fetch('/api/products').then(r => r.ok ? r.json() : []),
    ]);

    // Merge both stores; contact keys never collide with content keys
    const all = { ...content, ...contact };

    document.querySelectorAll('[data-content]').forEach(el => {
      const key = el.dataset.content;
      const schema = CONTENT_SCHEMA[key] || CONTACT_SCHEMA[key];
      const val = all[key] ?? schema?.fallback;
      if (val !== undefined && val !== null) el.textContent = val;
      else if (schema === undefined) console.warn(`[content-loader] unknown key: "${key}"`);
    });

    renderProducts(products);
  } catch (err) {
    console.error('[content-loader] failed to load:', err);
  }
}

function makeCard(p, linkHref) {
  const name  = String(p.name || '').replace(/</g, '&lt;');
  const desc  = String(p.description || '').replace(/</g, '&lt;');
  const price = String(p.price || '');
  const tag   = p.tag ? `<p class="card__tag">${String(p.tag).replace(/</g,'&lt;')}</p>` : '';
  return `
    <article class="card reveal">
      <div class="card__img-wrap">
        <img src="${p.image_path || ''}" alt="${name}" class="card__img" loading="lazy">
      </div>
      <div class="card__body">
        ${tag}
        <h3 class="card__title">${name}</h3>
        <p class="card__desc">${desc}</p>
        <div class="card__footer">
          <span class="card__price">${price}</span>
          <a href="${linkHref}" class="btn btn--outline btn--sm">Enquire</a>
        </div>
      </div>
    </article>`;
}

function renderProducts(products) {
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const featured = ['bouquet', 'wedding', 'seasonal']
      .map(cat => products.find(p => p.category === cat))
      .filter(Boolean);
    featuredGrid.innerHTML = featured.map(p => makeCard(p, 'contact.html')).join('');
    observeReveal();
  }

  ['bouquet', 'wedding', 'seasonal'].forEach(cat => {
    const grid = document.getElementById(`grid-${cat}`);
    if (!grid) return;
    const items = products.filter(p => p.category === cat);
    grid.innerHTML = items.length
      ? items.map(p => makeCard(p, 'contact.html')).join('')
      : '<p style="color:var(--muted);font-style:italic;">No products in this category yet.</p>';
    observeReveal();
  });
}

function observeReveal() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

loadPageContent();
