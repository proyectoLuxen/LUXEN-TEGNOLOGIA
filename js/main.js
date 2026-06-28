(function () {
  const pendingValue = 'PENDIENTE_DEFINIR';

  const state = {
    site: null,
    products: null
  };

  const availability = {
    disponible: {
      text: 'Disponible',
      className: 'is-available'
    },
    'bajo-stock': {
      text: 'Bajo stock',
      className: 'is-low'
    },
    agotado: {
      text: 'Agotado',
      className: 'is-out'
    },
    'sobre-pedido': {
      text: 'Sobre pedido',
      className: 'is-order'
    }
  };

  function isDefined(value) {
    return Boolean(value) && value !== pendingValue;
  }

  function escapeHTML(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function encodeAttribute(value) {
    return escapeHTML(value).replaceAll('`', '&#096;');
  }

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function inlineFallback(kind) {
    const inline = window.LuxenInlineData;
    if (!inline || !inline[kind]) {
      return null;
    }
    return cloneData(inline[kind]);
  }

  async function fetchJSON(path, kind) {
    const fallback = inlineFallback(kind);

    if (window.location.protocol === 'file:' && fallback) {
      return fallback;
    }

    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${path}`);
      }
      return response.json();
    } catch (error) {
      if (fallback) {
        return fallback;
      }
      throw error;
    }
  }

  async function getSite() {
    if (!state.site) {
      state.site = await fetchJSON('data/site.json', 'site');
    }
    return state.site;
  }

  async function getProducts() {
    if (!state.products) {
      const products = await fetchJSON('data/productos.json', 'products');
      state.products = products.slice().sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
    return state.products;
  }

  function whatsappUrl(site, message) {
    if (!isDefined(site.whatsappNumero)) {
      return '';
    }
    const text = message || site.mensajeWhatsAppGeneral || 'Hola, me interesa conocer más sobre sus productos.';
    return `https://wa.me/${site.whatsappNumero}?text=${encodeURIComponent(text)}`;
  }

  function isValidHttpUrl(value) {
    if (!isDefined(value)) return false;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch (error) {
      return false;
    }
  }

  function externalAttrs() {
    return 'target="_blank" rel="noopener noreferrer"';
  }

  function statusFor(product) {
    return availability[product.disponibilidad] || availability.disponible;
  }

  function productUrl(product) {
    return `producto.html?id=${encodeURIComponent(product.id)}`;
  }

  function hasWholesale(product) {
    return product.mayoreoDisponible === true;
  }

  function wholesaleText(product) {
    if (!hasWholesale(product)) return '';
    if (isDefined(product.precioMayoreo)) {
      return `Precio por volumen: ${product.precioMayoreo}`;
    }
    if (Number.isFinite(product.cantidadMinimaMayoreo)) {
      return `Precio especial a partir de ${product.cantidadMinimaMayoreo} piezas.`;
    }
    return product.mensajeMayoreo || 'Solicita precio por mayoreo';
  }

  function wholesaleMessage(product) {
    return product.whatsappTextoMayoreo || `Hola, me interesa comprar ${product.nombre} por mayoreo.

Cantidad aproximada:
Ciudad de entrega:
¿Me puedes compartir precio por volumen, disponibilidad y tiempo de entrega?`;
  }

  function wholesaleUrl(product, site) {
    if (!hasWholesale(product)) return '';
    return whatsappUrl(site, wholesaleMessage(product));
  }

  function wholesaleBadge(product) {
    if (!hasWholesale(product)) return '';
    return `
      <div class="wholesale-badge">
        <strong>Mayoreo disponible</strong>
        <span>${escapeHTML(wholesaleText(product))}</span>
      </div>
    `;
  }

  function actionButtons(product, site, options = {}) {
    const compact = options.compact;
    const wpHref = whatsappUrl(site, product.whatsappTexto);
    const disabled = product.disponibilidad === 'agotado';
    const wholesaleHref = wholesaleUrl(product, site);
    const parts = [];

    if (compact) {
      parts.push(`<a class="button button-detail" href="${productUrl(product)}">Ver detalles</a>`);
    }

    if (wpHref) {
      parts.push(`<a class="button button-whatsapp whatsapp-button" href="${encodeAttribute(wpHref)}" ${externalAttrs()}>Comprar por WhatsApp</a>`);
    }

    if (wholesaleHref) {
      parts.push(`<a class="button button-wholesale wholesale-cta" href="${encodeAttribute(wholesaleHref)}" ${externalAttrs()}>Cotizar mayoreo</a>`);
    }

    if (isValidHttpUrl(product.linkMercadoPago) && !disabled) {
      parts.push(`<a class="button button-payment external-payment-button" href="${encodeAttribute(product.linkMercadoPago)}" ${externalAttrs()}>Pagar con Mercado Pago</a>`);
    }

    if (isValidHttpUrl(product.linkMercadoLibre)) {
      parts.push(`<a class="button button-marketplace external-marketplace-button" href="${encodeAttribute(product.linkMercadoLibre)}" ${externalAttrs()}>Ver en Mercado Libre</a>`);
    }

    return parts.join('');
  }

  function productCard(product, site) {
    const status = statusFor(product);
    return `
      <article class="product-card">
        <a class="product-card__media" href="${productUrl(product)}" aria-label="Ver detalles de ${encodeAttribute(product.nombre)}">
          <img src="${encodeAttribute(product.imagenPrincipal)}" alt="${encodeAttribute(product.imagenes?.[0]?.alt || product.nombre)}" loading="lazy">
        </a>
        <div class="product-card__body">
          <div class="product-card__meta">
            <span class="status-pill ${status.className}">${status.text}</span>
            <span>${escapeHTML(product.categoria)}</span>
          </div>
          <h3><a href="${productUrl(product)}">${escapeHTML(product.nombre)}</a></h3>
          <p>${escapeHTML(product.descripcionCorta)}</p>
          <strong class="price">Precio por pieza: ${escapeHTML(product.precioTexto)}</strong>
          ${wholesaleBadge(product)}
          <div class="product-card__actions">
            ${actionButtons(product, site, { compact: true })}
          </div>
        </div>
      </article>
    `;
  }

  function renderHeader(site) {
    const header = document.getElementById('site-header');
    if (!header) return;

    const current = document.body.dataset.page || '';
    const links = [
      ['index', 'Inicio', 'index.html'],
      ['videos', 'Videos', 'videos.html'],
      ['catalogo', 'Catálogo', 'catalogo.html'],
      ['servicios-tecnicos', 'Servicios técnicos', 'servicios-tecnicos.html'],
      ['mayoreo', 'Mayoreo', 'como-comprar.html#mayoreo'],
      ['como-comprar', 'Cómo comprar', 'como-comprar.html'],
      ['envios', 'Envíos', 'envios.html'],
      ['contacto', 'Contacto', 'contacto.html']
    ];

    header.innerHTML = `
      <div class="header-shell">
        <a class="brand" href="index.html" aria-label="Ir al inicio">
          <img src="${encodeAttribute(site.logoWebp || site.logo)}" alt="${encodeAttribute(site.nombreMarca)}" width="116" height="72">
          <span>
            <strong>${escapeHTML(site.nombreMarca)}</strong>
            <small>${escapeHTML(site.slogan)}</small>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="site-nav">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Navegación principal">
          ${links.map(([key, label, href]) => `<a href="${href}" ${current === key ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
        </nav>
        <a class="header-cta" href="${encodeAttribute(whatsappUrl(site))}" ${externalAttrs()}>WhatsApp</a>
      </div>
    `;

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', (event) => {
      if (event.target.matches('a')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });
  }

  function renderFooter(site) {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const contact = [];
    if (isDefined(site.whatsappVisible)) contact.push(`<a href="${encodeAttribute(whatsappUrl(site))}" ${externalAttrs()}>WhatsApp ${escapeHTML(site.whatsappVisible)}</a>`);
    if (isDefined(site.correoContacto)) contact.push(`<a href="mailto:${encodeAttribute(site.correoContacto)}">${escapeHTML(site.correoContacto)}</a>`);

    footer.innerHTML = `
      <div class="footer-shell">
        <div class="footer-brand">
          <img src="${encodeAttribute(site.logoWebp || site.logo)}" alt="${encodeAttribute(site.nombreMarca)}" width="96" height="60">
          <p>${escapeHTML(site.descripcionCorta)}</p>
        </div>
        <div>
          <h2>Navegación</h2>
          <a href="videos.html">Videos</a>
          <a href="catalogo.html">Catálogo</a>
          <a href="servicios-tecnicos.html">Servicios técnicos</a>
          <a href="como-comprar.html#mayoreo">Mayoreo</a>
          <a href="como-comprar.html">Cómo comprar</a>
          <a href="envios.html">Envíos</a>
          <a href="politicas.html">Políticas</a>
        </div>
        <div>
          <h2>Contacto</h2>
          ${contact.join('') || '<span>Contacto pendiente de definir</span>'}
          <span>${escapeHTML(site.pais || 'México')}</span>
        </div>
        <div>
          <h2>Compra</h2>
          <span>Venta de productos tecnológicos.</span>
          <span>Atención por mayoreo bajo cotización.</span>
          <span>Servicios técnicos de software y hardware.</span>
          <span>${escapeHTML(site.avisoDisponibilidad)}</span>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="current-year"></span> ${escapeHTML(site.nombreMarca)}.</span>
        <span>Precios y disponibilidad sujetos a confirmación.</span>
      </div>
    `;

    const year = footer.querySelector('#current-year');
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function renderFloatingWhatsapp(site) {
    const existing = document.querySelector('.floating-whatsapp');
    if (existing) existing.remove();
    const href = whatsappUrl(site);
    if (!href) return;
    const link = document.createElement('a');
    link.className = 'floating-whatsapp';
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', 'Abrir WhatsApp');
    link.textContent = 'WhatsApp';
    document.body.appendChild(link);
  }

  function bindWhatsappLinks(site) {
    document.querySelectorAll('[data-whatsapp-message]').forEach((link) => {
      const message = link.getAttribute('data-whatsapp-message');
      const href = whatsappUrl(site, message);
      if (!href) return;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  async function renderFeaturedProducts(site) {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    const products = await getProducts();
    const featured = products.filter((product) => product.destacado).slice(0, 6);
    const visible = featured.length ? featured : products.slice(0, 6);
    grid.innerHTML = visible.map((product) => productCard(product, site)).join('');
  }

  function updateCommonMeta(site) {
    const icon = document.querySelector('link[rel="icon"]');
    if (icon && site.favicon) {
      icon.href = site.favicon;
    }
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && site.ogImage) {
      ogImage.setAttribute('content', site.ogImage);
    }
  }

  const ready = document.addEventListener('DOMContentLoaded', async () => {
    try {
      const site = await getSite();
      renderHeader(site);
      renderFooter(site);
      renderFloatingWhatsapp(site);
      bindWhatsappLinks(site);
      await renderFeaturedProducts(site);
      updateCommonMeta(site);
      document.body.classList.add('is-ready');
    } catch (error) {
      console.error(error);
      document.body.classList.add('has-data-error');
    }
  });

  window.LuxenStore = {
    actionButtons,
    escapeHTML,
    externalAttrs,
    getProducts,
    getSite,
    hasWholesale,
    bindWhatsappLinks,
    isDefined,
    isValidHttpUrl,
    productCard,
    productUrl,
    ready,
    statusFor,
    wholesaleBadge,
    wholesaleMessage,
    wholesaleText,
    wholesaleUrl,
    whatsappUrl
  };
})();
