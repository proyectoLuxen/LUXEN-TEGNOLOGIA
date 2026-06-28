(async function () {
  const app = window.LuxenStore;

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function renderList(items) {
    if (!items || !items.length) return '';
    return `<ul class="check-list">${items.map((item) => `<li>${app.escapeHTML(item)}</li>`).join('')}</ul>`;
  }

  function renderFicha(ficha) {
    if (!ficha || !Object.keys(ficha).length) return '';
    return `
      <div class="spec-grid">
        ${Object.entries(ficha).map(([label, value]) => `
          <div>
            <dt>${app.escapeHTML(label)}</dt>
            <dd>${app.escapeHTML(value)}</dd>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderWholesaleDetail(product, site) {
    if (!app.hasWholesale(product)) return '';

    const wholesaleHref = app.wholesaleUrl(product, site);
    const minPieces = Number.isFinite(product.cantidadMinimaMayoreo)
      ? `<span>A partir de ${product.cantidadMinimaMayoreo} piezas</span>`
      : '<span>Cotiza por volumen</span>';
    const wholesalePrice = app.isDefined(product.precioMayoreo)
      ? `<span>Precio por pieza: ${app.escapeHTML(product.precioMayoreo)}</span>`
      : '<span>Precio mayorista sujeto a cotización</span>';

    return `
      <section class="wholesale-panel" aria-labelledby="wholesale-title">
        <span class="eyebrow">Compra por mayoreo</span>
        <h2 id="wholesale-title">¿Buscas varias piezas de este producto?</h2>
        <p>Solicita una cotización personalizada. Confirmamos disponibilidad, precio por volumen y opciones de entrega antes de procesar tu pedido.</p>
        <div class="wholesale-facts">
          <span>Precio especial por volumen</span>
          ${minPieces}
          ${wholesalePrice}
        </div>
        ${wholesaleHref ? `<a class="button button-wholesale wholesale-cta" href="${app.escapeHTML(wholesaleHref)}" ${app.externalAttrs()}>Cotizar mayoreo por WhatsApp</a>` : ''}
      </section>
    `;
  }

  function renderGallery(product) {
    const images = product.imagenes?.length ? product.imagenes : [{ src: product.imagenPrincipal, alt: product.nombre }];
    return `
      <div class="product-gallery">
        <div class="gallery-main">
          <img id="gallery-main-image" src="${app.escapeHTML(images[0].src)}" alt="${app.escapeHTML(images[0].alt || product.nombre)}">
        </div>
        ${images.length > 1 ? `
          <div class="gallery-thumbs" aria-label="Imágenes del producto">
            ${images.map((image, index) => `
              <button type="button" class="${index === 0 ? 'is-active' : ''}" data-src="${app.escapeHTML(image.src)}" data-alt="${app.escapeHTML(image.alt || product.nombre)}">
                <img src="${app.escapeHTML(image.src)}" alt="" loading="lazy">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  function updateProductMeta(product, site) {
    document.title = `${product.nombre} | ${site.nombreMarca}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', product.descripcionCorta);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogTitle) ogTitle.setAttribute('content', `${product.nombre} | ${site.nombreMarca}`);
    if (ogDescription) ogDescription.setAttribute('content', product.descripcionCorta);
    if (ogImage) ogImage.setAttribute('content', product.imagenPrincipal);
  }

  function renderProduct(product, site, products) {
    const root = document.getElementById('product-root');
    if (!root) return;

    const status = app.statusFor(product);
    const related = products
      .filter((item) => item.id !== product.id && item.categoria === product.categoria)
      .slice(0, 3);

    root.innerHTML = `
      <nav class="breadcrumb" aria-label="Ruta">
        <a href="index.html">Inicio</a>
        <span>/</span>
        <a href="catalogo.html">Catálogo</a>
        <span>/</span>
        <span>${app.escapeHTML(product.nombre)}</span>
      </nav>
      <section class="product-detail">
        ${renderGallery(product)}
        <div class="product-summary">
          <span class="eyebrow">${app.escapeHTML(product.categoria)}</span>
          <h1>${app.escapeHTML(product.nombre)}</h1>
          ${product.marca ? `<p class="product-brand">Marca: ${app.escapeHTML(product.marca)}</p>` : ''}
          <strong class="detail-price">${app.escapeHTML(product.precioTexto)}</strong>
          <p><span class="status-pill ${status.className}">${status.text}</span> ${app.escapeHTML(product.stockTexto)}</p>
          <p>${app.escapeHTML(product.descripcionLarga)}</p>
          ${renderWholesaleDetail(product, site)}
          <div class="detail-actions">
            ${app.actionButtons(product, site)}
          </div>
          <p class="note">${app.escapeHTML(site.avisoEnvioCorto)}</p>
        </div>
      </section>
      <section class="content-section two-column">
        <div>
          <h2>Características</h2>
          ${renderList(product.caracteristicas)}
        </div>
        <div>
          <h2>Qué incluye</h2>
          ${renderList(product.incluye)}
        </div>
      </section>
      <section class="content-section">
        <h2>Ficha técnica</h2>
        ${renderFicha(product.fichaTecnica)}
      </section>
      ${product.garantia ? `
        <section class="content-section">
          <h2>Garantía</h2>
          <p>${app.escapeHTML(product.garantia)}</p>
        </section>
      ` : ''}
      <section class="content-section notice-band">
        <h2>Antes de comprar</h2>
        <p>${app.escapeHTML(site.avisoDisponibilidad)}</p>
        <p>${app.escapeHTML(site.facturacionTexto)}</p>
      </section>
      ${related.length ? `
        <section class="content-section">
          <div class="section-heading">
            <span class="eyebrow">También puede interesarte</span>
            <h2>Productos relacionados</h2>
          </div>
          <div class="product-grid product-grid--compact">
            ${related.map((item) => app.productCard(item, site)).join('')}
          </div>
        </section>
      ` : ''}
    `;

    root.querySelector('.gallery-thumbs')?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-src]');
      if (!button) return;
      const image = root.querySelector('#gallery-main-image');
      image.src = button.dataset.src;
      image.alt = button.dataset.alt;
      root.querySelectorAll('.gallery-thumbs button').forEach((thumb) => thumb.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  }

  function renderNotFound() {
    const root = document.getElementById('product-root');
    if (!root) return;
    root.innerHTML = `
      <section class="empty-panel">
        <h1>Producto no encontrado</h1>
        <p>El producto solicitado no existe en el catálogo actual o el enlace está incompleto.</p>
        <a class="button button-primary" href="catalogo.html">Volver al catálogo</a>
      </section>
    `;
  }

  try {
    const [site, products] = await Promise.all([app.getSite(), app.getProducts()]);
    const id = params().get('id');
    const product = products.find((item) => item.id === id);
    if (!product) {
      renderNotFound();
      return;
    }
    updateProductMeta(product, site);
    renderProduct(product, site, products);
  } catch (error) {
    console.error(error);
    renderNotFound();
  }
})();
