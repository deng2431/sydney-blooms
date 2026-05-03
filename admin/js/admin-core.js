/* ============================================================
   SYDNEY BLOOMS — Admin Core
   Auth guard · toast · sidebar · unread badge · API helper
   ============================================================ */

const $ = id => document.getElementById(id);

const API = (path, opts = {}) =>
  fetch(`/api${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts })
    .then(async r => {
      const json = await r.json();
      if (!r.ok) throw Object.assign(new Error(json.error || 'Something went wrong'), { status: r.status });
      return json;
    });

function toast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.className = `toast ${type} show`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3500);
}

async function loadSidebar() {
  const placeholder = document.getElementById('adminSidebar');
  if (!placeholder) return;
  try {
    const html = await fetch('/admin/partials/sidebar.html').then(r => r.text());
    placeholder.outerHTML = html;
    const page = location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar__link').forEach(link => {
      if (link.getAttribute('href') === page) link.classList.add('active');
    });
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      location.href = '/admin/index.html';
    });
  } catch {
    /* sidebar fails gracefully */
  }
}

async function requireAuth() {
  const res = await fetch('/api/auth/check');
  if (res.status === 401) { location.href = '/admin/index.html'; return; }
  loadUnreadCount();
}

async function loadUnreadCount() {
  try {
    const { count } = await API('/messages/unread-count');
    const badge = document.getElementById('unreadBadge');
    if (badge) { badge.textContent = count || ''; badge.style.display = count ? 'inline' : 'none'; }
  } catch {}
}
