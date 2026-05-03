/* ============================================================
   SYDNEY BLOOMS — Dynamic content loader for public pages
   ============================================================ */

async function loadPageContent() {
  try {
    const [content, contact, products] = await Promise.all([
      fetch('/api/content').then(r => r.json()),
      fetch('/api/contact').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
    ]);

    // Fill elements that have data-content attributes
    document.querySelectorAll('[data-content]').forEach(el => {
      const key = el.dataset.content;
      const val = content[key] ?? contact[key];
      if (val !== undefined) el.textContent = val;
    });

    // Render product grids if present
    renderProducts(products);
  } catch {
    // Server not running — page still renders with fallback HTML
  }
}

function makeCard(p, linkHref) {
  return `
    <article class="card reveal">
      <div class="card__img-wrap">
        <img src="${p.image_path || ''}" alt="${p.name}" class="card__img" loading="lazy">
      </div>
      <div class="card__body">
        ${p.tag ? `<p class="card__tag">${p.tag}</p>` : ''}
        <h3 class="card__title">${p.name}</h3>
        <p class="card__desc">${p.description || ''}</p>
        <div class="card__footer">
          <span class="card__price">${p.price || ''}</span>
          <a href="${linkHref}" class="btn btn--outline btn--sm">Enquire</a>
        </div>
      </div>
    </article>`;
}

function renderProducts(products) {
  // Home page: one featured card per category
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    const categories = ['bouquet', 'wedding', 'seasonal'];
    const featured = categories
      .map(cat => products.find(p => p.category === cat))
      .filter(Boolean);
    featuredGrid.innerHTML = featured.map(p => makeCard(p, 'contact.html')).join('');
    observeReveal();
  }

  // Shop page: grouped by category
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
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
}

loadPageContent();
