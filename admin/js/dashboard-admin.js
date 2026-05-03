(async () => {
  await loadSidebar();
  await requireAuth();

  const products = await API('/products');
  $('statTotal').textContent    = products.length;
  $('statBouquet').textContent  = products.filter(p => p.category === 'bouquet').length;
  $('statWedding').textContent  = products.filter(p => p.category === 'wedding').length;
  $('statSeasonal').textContent = products.filter(p => p.category === 'seasonal').length;
})();
