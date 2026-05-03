(async () => {
  await loadSidebar();
  await requireAuth();

  const content = await API('/content');
  Object.entries(content).forEach(([key, value]) => {
    const el = document.querySelector(`[data-key="${key}"]`);
    if (el) el.value = value;
  });

  $('contentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {};
    document.querySelectorAll('[data-key]').forEach(el => { body[el.dataset.key] = el.value; });
    try {
      await API('/content', { method: 'PUT', body: JSON.stringify(body) });
      toast('Content saved');
    } catch { toast('Could not save content', 'error'); }
  });
})();
