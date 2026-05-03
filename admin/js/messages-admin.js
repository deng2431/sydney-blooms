let messages = [];

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function updateBadge(count) {
  const badge = document.getElementById('unreadBadge');
  if (badge) { badge.textContent = count || ''; badge.style.display = count ? 'inline' : 'none'; }
}

function render(msgs) {
  const tbody = document.getElementById('messagesList');
  if (!msgs.length) {
    tbody.innerHTML = `
      <tr><td colspan="5">
        <div class="empty-inbox">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
          <p>No messages yet. Enquiries from your contact form will appear here.</p>
        </div>
      </td></tr>`;
    return;
  }
  tbody.innerHTML = msgs.map(m => `
    <tr class="msg-row ${m.read ? '' : 'unread'}" data-id="${m.id}" onclick="toggleMsg(${m.id})">
      <td><span class="unread-dot"></span></td>
      <td>
        <strong>${esc(m.name)}</strong><br>
        <span style="font-size:0.82rem;color:var(--muted)">${esc(m.email)}</span>
      </td>
      <td>${esc(m.subject || '(no subject)')}</td>
      <td style="white-space:nowrap">${fmt(m.created_at)}</td>
      <td class="actions" onclick="event.stopPropagation()">
        <button class="btn btn-ghost btn-sm" onclick="deleteMsg(${m.id})">Delete</button>
      </td>
    </tr>
    <tr class="msg-expand" id="expand-${m.id}">
      <td colspan="5">
        <div class="msg-meta">${m.phone ? 'Phone: ' + esc(m.phone) + ' &nbsp;·&nbsp; ' : ''}Sent ${fmt(m.created_at)}</div>
        <div class="msg-body">${esc(m.message)}</div>
        <div class="msg-actions">
          ${!m.read ? `<button class="btn btn-outline btn-sm" onclick="markRead(${m.id})">Mark as read</button>` : ''}
          <button class="btn btn-danger btn-sm" onclick="deleteMsg(${m.id})">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

window.toggleMsg = async function (id) {
  const expand = document.getElementById(`expand-${id}`);
  const isOpen = expand.classList.toggle('open');
  if (isOpen) {
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.read) await markRead(id);
  }
};

window.markRead = async function (id) {
  await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
  messages = messages.map(m => m.id === id ? { ...m, read: true } : m);
  render(messages);
  updateBadge(messages.filter(m => !m.read).length);
};

window.deleteMsg = async function (id) {
  if (!confirm('Delete this message? This cannot be undone.')) return;
  await fetch(`/api/messages/${id}`, { method: 'DELETE' });
  messages = messages.filter(m => m.id !== id);
  render(messages);
  updateBadge(messages.filter(m => !m.read).length);
  toast('Message deleted');
};

(async () => {
  await loadSidebar();
  await requireAuth();

  const res = await fetch('/api/messages');
  messages = res.ok ? await res.json() : [];
  if (!res.ok) toast('Could not load messages', 'error');
  render(messages);
  updateBadge(messages.filter(m => !m.read).length);

  document.getElementById('markAllBtn').addEventListener('click', async () => {
    await fetch('/api/messages/read-all', { method: 'PUT' });
    messages = messages.map(m => ({ ...m, read: true }));
    render(messages);
    updateBadge(0);
    toast('All messages marked as read');
  });
})();
