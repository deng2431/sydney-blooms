(async () => {
  await loadSidebar();
  await requireAuth();

  const info = await API('/contact');
  Object.entries(info).forEach(([key, value]) => {
    const el = document.querySelector(`[data-key="${key}"]`);
    if (el) el.value = value;
  });

  $('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    document.querySelectorAll('[data-key]').forEach(el => { body[el.dataset.key] = el.value; });
    try {
      await API('/contact', { method: 'PUT', body: JSON.stringify(body) });
      toast('Contact info saved');
    } catch { toast('Could not save contact info', 'error'); }
  });
})();
