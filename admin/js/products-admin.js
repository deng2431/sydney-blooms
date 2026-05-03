let allProducts = [];

async function loadProducts() {
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
      <td><strong>${esc(p.name)}</strong></td>
      <td><span class="badge ${p.category}">${p.category}</span></td>
      <td>${esc(p.price || '—')}</td>
      <td>${esc(p.tag || '—')}</td>
      <td class="actions">
        <button class="btn btn-outline btn-sm" onclick="openEditModal(${p.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${p.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

window.openAddModal = function () {
  $('modalTitle').textContent = 'Add Product';
  $('productForm').reset();
  $('productId').value = '';
  $('imagePreview').className = 'img-preview';
  $('currentImagePath').value = '';
  openModal();
};

window.openEditModal = function (id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  $('modalTitle').textContent       = 'Edit Product';
  $('productId').value              = id;
  $('productCategory').value        = p.category;
  $('productName').value            = p.name;
  $('productDescription').value     = p.description || '';
  $('productPrice').value           = p.price || '';
  $('productTag').value             = p.tag || '';
  $('productSortOrder').value       = p.sort_order || 0;
  $('currentImagePath').value       = p.image_path || '';
  if (p.image_path) {
    const prev = $('imagePreview');
    prev.src = p.image_path;
    prev.className = 'img-preview show';
  }
  openModal();
};

window.deleteProduct = async function (id) {
  const p = allProducts.find(x => x.id === id);
  if (!confirm(`Delete "${p?.name}"? This cannot be undone.`)) return;
  try {
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    toast(`"${p?.name}" deleted`);
    await loadProducts();
  } catch { toast('Could not delete product', 'error'); }
};

function openModal()  { $('productModal').classList.add('open'); document.body.style.overflow = 'hidden'; }
window.closeModal = function () { $('productModal').classList.remove('open'); document.body.style.overflow = ''; };

$('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id   = $('productId').value;
  const form = new FormData($('productForm'));
  try {
    const res  = await fetch(id ? `/api/products/${id}` : '/api/products', { method: id ? 'PUT' : 'POST', body: form });
    const json = await res.json();
    if (json.error) { toast(json.error, 'error'); return; }
    toast(id ? 'Product updated' : 'Product created');
    closeModal();
    await loadProducts();
  } catch { toast('Could not save product', 'error'); }
});

$('productImage').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const prev = $('imagePreview');
  const url  = URL.createObjectURL(file);
  prev.onload = () => URL.revokeObjectURL(url);
  prev.src = url;
  prev.className = 'img-preview show';
});

$('productModal').addEventListener('click', (e) => { if (e.target === $('productModal')) closeModal(); });

(async () => {
  await loadSidebar();
  await requireAuth();
  await loadProducts();
})();
