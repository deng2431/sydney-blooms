/* ============================================================
   SYDNEY BLOOMS — Admin Panel JS
   ============================================================ */

/* ---- Utilities ---- */
const $ = id => document.getElementById(id);
const API = (path, opts = {}) =>
  fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts })
    .then(r => r.json());

function toast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

/* ---- Auth guard (run on all admin pages except login) ---- */
async function requireAuth() {
  const res = await fetch('/api/auth/check');
  if (res.status === 401) { location.href = '/admin/index.html'; }
}

/* ---- Logout ---- */
document.addEventListener('click', async (e) => {
  if (e.target.closest('#logoutBtn')) {
    await fetch('/api/auth/logout', { method: 'POST' });
    location.href = '/admin/index.html';
  }
});

/* ---- Mark active sidebar link ---- */
(function markActive() {
  const page = location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar__link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === page) link.classList.add('active');
  });
})();

/* ============================================================
   PAGE: LOGIN
   ============================================================ */
const loginForm = $('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const alert = $('loginAlert');
    alert.className = 'alert';
    const data = { username: $('username').value, password: $('password').value };
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.ok) {
      location.href = '/admin/dashboard.html';
    } else {
      alert.textContent = json.error || 'Invalid credentials';
      alert.className = 'alert error';
    }
  });
}

/* ============================================================
   PAGE: DASHBOARD
   ============================================================ */
if ($('dashStats')) {
  (async () => {
    await requireAuth();
    const products = await API('/products');
    $('statTotal').textContent    = products.length;
    $('statBouquet').textContent  = products.filter(p => p.category === 'bouquet').length;
    $('statWedding').textContent  = products.filter(p => p.category === 'wedding').length;
    $('statSeasonal').textContent = products.filter(p => p.category === 'seasonal').length;
  })();
}

/* ============================================================
   PAGE: PRODUCTS
   ============================================================ */
if ($('productsTable')) {
  let allProducts = [];

  async function loadProducts() {
    await requireAuth();
    allProducts = await API('/products');
    renderTable();
  }

  function renderTable() {
    const tbody = $('productsTable');
    if (!allProducts.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No products yet. Click "Add Product" to create one.</td></tr>';
      return;
    }
    tbody.innerHTML = allProducts.map(p => `
      <tr>
        <td><img src="${p.image_path || ''}" alt="${p.name}" class="product-thumb" onerror="this.style.display='none'"></td>
        <td><strong>${p.name}</strong></td>
        <td><span class="badge ${p.category}">${p.category}</span></td>
        <td>${p.price || '—'}</td>
        <td>${p.tag || '—'}</td>
        <td class="actions">
          <button class="btn btn-outline btn-sm" onclick="openEditModal(${p.id})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id}, '${p.name.replace(/'/g,"\\'")}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.openAddModal = function () {
    $('modalTitle').textContent = 'Add Product';
    $('productForm').reset();
    $('productId').value = '';
    $('imagePreview').className = 'img-preview';
    $('currentImagePath').value = '';
    openModal();
  };

  window.openEditModal = async function (id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    $('modalTitle').textContent = 'Edit Product';
    $('productId').value        = id;
    $('productCategory').value  = p.category;
    $('productName').value      = p.name;
    $('productDescription').value = p.description || '';
    $('productPrice').value     = p.price || '';
    $('productTag').value       = p.tag || '';
    $('productSortOrder').value = p.sort_order || 0;
    $('currentImagePath').value = p.image_path || '';
    if (p.image_path) {
      const prev = $('imagePreview');
      prev.src = p.image_path;
      prev.className = 'img-preview show';
    }
    openModal();
  };

  window.deleteProduct = async function (id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    toast(`"${name}" deleted`);
    await loadProducts();
  };

  $('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('productId').value;
    const form = new FormData($('productForm'));
    const method = id ? 'PUT' : 'POST';
    const url    = id ? `/api/products/${id}` : '/api/products';
    const res = await fetch(url, { method, body: form });
    const json = await res.json();
    if (json.error) { toast(json.error, 'error'); return; }
    toast(id ? 'Product updated' : 'Product created');
    closeModal();
    await loadProducts();
  });

  $('productImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const prev = $('imagePreview');
    prev.src = URL.createObjectURL(file);
    prev.className = 'img-preview show';
  });

  function openModal()  { $('productModal').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeModal() { $('productModal').classList.remove('open'); document.body.style.overflow = ''; }
  window.closeModal = closeModal;
  $('productModal').addEventListener('click', (e) => { if (e.target === $('productModal')) closeModal(); });

  loadProducts();
}

/* ============================================================
   PAGE: CONTENT
   ============================================================ */
if ($('contentForm')) {
  (async () => {
    await requireAuth();
    const content = await API('/content');
    Object.entries(content).forEach(([key, value]) => {
      const el = document.querySelector(`[data-key="${key}"]`);
      if (el) el.value = value;
    });
  })();

  $('contentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    document.querySelectorAll('[data-key]').forEach(el => {
      body[el.dataset.key] = el.value;
    });
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    json.ok ? toast('Content saved') : toast(json.error, 'error');
  });
}

/* ============================================================
   PAGE: CONTACT
   ============================================================ */
if ($('contactForm')) {
  (async () => {
    await requireAuth();
    const info = await API('/contact');
    Object.entries(info).forEach(([key, value]) => {
      const el = document.querySelector(`[data-key="${key}"]`);
      if (el) el.value = value;
    });
  })();

  $('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    document.querySelectorAll('[data-key]').forEach(el => {
      body[el.dataset.key] = el.value;
    });
    const res = await fetch('/api/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    json.ok ? toast('Contact info saved') : toast(json.error, 'error');
  });
}
