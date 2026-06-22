(async function () {
  const app = window.LuxenStore;

  function uniqueCategories(products) {
    return [...new Set(products.map((product) => product.categoria).filter(Boolean))];
  }

  function renderFilters(products) {
    const filterShell = document.getElementById('catalog-filters');
    if (!filterShell) return;

    const categories = uniqueCategories(products);
    if (categories.length < 2) {
      filterShell.hidden = true;
      return;
    }

    filterShell.innerHTML = `
      <button class="filter-chip is-active" type="button" data-category="todos">Todos</button>
      ${categories.map((category) => `<button class="filter-chip" type="button" data-category="${app.escapeHTML(category)}">${app.escapeHTML(category)}</button>`).join('')}
    `;
  }

  function renderProducts(products, site, category = 'todos') {
    const grid = document.getElementById('catalog-grid');
    const count = document.getElementById('catalog-count');
    if (!grid) return;

    const visible = category === 'todos' ? products : products.filter((product) => product.categoria === category);
    grid.innerHTML = visible.map((product) => app.productCard(product, site)).join('');
    if (count) count.textContent = `${visible.length} producto${visible.length === 1 ? '' : 's'}`;
  }

  try {
    const [site, products] = await Promise.all([app.getSite(), app.getProducts()]);
    renderFilters(products);
    renderProducts(products, site);

    const filters = document.getElementById('catalog-filters');
    filters?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-category]');
      if (!button) return;
      filters.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('is-active'));
      button.classList.add('is-active');
      renderProducts(products, site, button.dataset.category);
    });
  } catch (error) {
    console.error(error);
    const grid = document.getElementById('catalog-grid');
    if (grid) {
      grid.innerHTML = '<p class="empty-state">No se pudo cargar el catálogo. Revisa los archivos de datos.</p>';
    }
  }
})();
