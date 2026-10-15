(function () {
  const pendingValue = 'PENDIENTE_DEFINIR';

  const state = {
    site: null,
    sitePromise: null,
    products: null
  };

  const icons = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.5a8.5 8.5 0 0 1-12.3 7.6L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.5z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>'
  };

  const availability = {
    disponible: { text: 'Disponible', className: 'is-available' },
    'bajo-stock': { text: 'Bajo stock', className: 'is-low' },
    agotado: { text: 'Agotado', className: 'is-out' },
    'sobre-pedido': { text: 'Sobre pedido', className: 'is-order' }
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

  async function fetchJSON(path) {
    const response = await fetch(path, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${path}`);
    }
    return response.json();
  }

  // Única fuente de datos del negocio (incluido el número de WhatsApp): data/site.json
  function getSite() {
    if (state.site) return Promise.resolve(state.site);
    if (!state.sitePromise) {
      state.sitePromise = fetchJSON('data/site.json').then((site) => {
        state.site = site;
        return site;
      });
    }
    return state.sitePromise;
  }

  async function getProducts() {
    if (!state.products) {
      const products = await fetchJSON('data/productos.json');
      state.products = products.slice().sort((a, b) => (a.orden || 0) - (b.orden || 0));
    }
    return state.products;
  }

  function whatsappUrl(site, message) {
    if (!isDefined(site.whatsappNumero)) {
      return '';
    }
    const text = message || site.mensajeWhatsAppGeneral || 'Hola, me interesa recibir información.';
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
    return product.mensajeMayoreo || 'Solicite precio por mayoreo';
  }

  function wholesaleMessage(product) {
    return product.whatsappTextoMayoreo || `Hola, me interesa comprar ${product.nombre} por mayoreo.

Cantidad aproximada:
Ciudad de entrega:
¿Me pueden compartir precio por volumen, disponibilidad y tiempo de entrega?`;
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
    const minimal = options.minimal;
    const wpHref = whatsappUrl(site, product.whatsappTexto);
    const disabled = product.disponibilidad === 'agotado';
    const wholesaleHref = wholesaleUrl(product, site);
    const parts = [];

    if (compact) {
      parts.push(`<a class="button button-detail" href="${productUrl(product)}">Ver detalles</a>`);
    }

    if (wpHref) {
      parts.push(`<a class="button button-whatsapp whatsapp-button" href="${encodeAttribute(wpHref)}" ${externalAttrs()}>${icons.chat}Comprar por WhatsApp</a>`);
    }

    if (minimal) {
      return parts.join('');
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

  function productCard(product, site, options = {}) {
    const status = statusFor(product);
    return `
      <article class="product-card">
        <a class="product-card__media" href="${productUrl(product)}" aria-label="Ver detalles de ${encodeAttribute(product.nombre)}">
          <img src="${encodeAttribute(product.imagenPrincipal)}" alt="${encodeAttribute(product.imagenes?.[0]?.alt || product.nombre)}" loading="lazy" decoding="async" width="600" height="600">
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
            ${actionButtons(product, site, { compact: true, minimal: options.minimal })}
          </div>
        </div>
      </article>
    `;
  }

  const navLinks = [
    ['inicio', 'Inicio', 'index.html'],
    ['nosotros', 'Nosotros', 'nosotros.html'],
    ['servicios', 'Servicios', 'servicios.html'],
    ['productos', 'Productos', 'catalogo.html'],
    ['contacto', 'Contacto', 'contacto.html']
  ];

  const pageSection = {
    index: 'inicio',
    nosotros: 'nosotros',
    servicios: 'servicios',
    'servicios-tecnicos': 'servicios',
    catalogo: 'productos',
    producto: 'productos',
    contacto: 'contacto'
  };

  function logoPicture(site, width, height, extraAttrs = '') {
    const webp = site.logoTransparente || 'assets/logo/luxen-logo-transparente.webp';
    const png = site.logoTransparentePng || 'assets/logo/luxen-logo-transparente.png';
    return `
      <picture>
        <source srcset="${encodeAttribute(webp)}" type="image/webp">
        <img src="${encodeAttribute(png)}" alt="${encodeAttribute(site.nombreMarca)}" width="${width}" height="${height}" ${extraAttrs}>
      </picture>
    `;
  }

  function renderHeader(site) {
    const header = document.getElementById('site-header');
    if (!header) return;

    const current = pageSection[document.body.dataset.page || ''] || '';
    const wa = whatsappUrl(site);

    header.innerHTML = `
      <div class="header-shell">
        <a class="brand" href="index.html" aria-label="${encodeAttribute(site.nombreMarca)}, ir al inicio">
          ${logoPicture(site, 480, 271)}
        </a>
        <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="site-nav">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Navegación principal">
          ${navLinks.map(([key, label, href]) => `<a href="${href}" ${current === key ? 'aria-current="page"' : ''}>${label}</a>`).join('')}
          ${wa ? `<a class="nav-whatsapp" href="${encodeAttribute(wa)}" ${externalAttrs()}>WhatsApp ${escapeHTML(site.whatsappVisible || '')}</a>` : ''}
        </nav>
        ${wa ? `<a class="button button-primary header-cta" href="${encodeAttribute(wa)}" ${externalAttrs()}>${icons.chat}WhatsApp</a>` : ''}
      </div>
    `;

    const toggle = header.querySelector('.nav-toggle');
    const nav = header.querySelector('.site-nav');
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      nav.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Abrir menú' : 'Cerrar menú');
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', (event) => {
      if (event.target.matches('a')) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });
  }

  function socialLinks(site) {
    return [
      ['Facebook', site.facebookUrl],
      ['YouTube', site.youtubeUrl],
      ['TikTok', site.tiktokUrl],
      ['Instagram', site.instagramUrl]
    ].filter(([, url]) => isValidHttpUrl(url));
  }

  function renderFooter(site) {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const wa = whatsappUrl(site);
    const social = socialLinks(site);

    footer.innerHTML = `
      <div class="footer-shell">
        <div class="footer-brand">
          <a class="footer-plate" href="index.html" aria-label="${encodeAttribute(site.nombreMarca)}, ir al inicio">
            ${logoPicture(site, 480, 271, 'loading="lazy"')}
          </a>
          <p>${escapeHTML(site.descripcionCorta)}</p>
        </div>
        <div>
          <h2>Empresa</h2>
          <ul class="footer-links">
            ${navLinks.map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h2>Información</h2>
          <ul class="footer-links">
            <li><a href="como-comprar.html">Cómo comprar</a></li>
            <li><a href="como-comprar.html#formas-de-pago">Formas de pago</a></li>
            <li><a href="como-comprar.html#mayoreo">Mayoreo</a></li>
            <li><a href="envios.html">Envíos</a></li>
            <li><a href="politicas.html">Políticas</a></li>
            <li><a href="videos.html">Videos y preguntas</a></li>
          </ul>
        </div>
        <div>
          <h2>Contacto</h2>
          <ul class="footer-contact">
            ${wa ? `<li><strong>WhatsApp</strong><a href="${encodeAttribute(wa)}" ${externalAttrs()}>${escapeHTML(site.whatsappVisible || 'Enviar mensaje')}</a></li>` : ''}
            ${isDefined(site.horario) ? `<li><strong>Horario</strong>${escapeHTML(site.horario)}</li>` : ''}
            ${isDefined(site.coberturaTexto) ? `<li><strong>Cobertura</strong>${escapeHTML(site.coberturaTexto)}</li>` : ''}
          </ul>
          ${social.length ? `<ul class="footer-social" aria-label="Redes sociales">${social.map(([label, url]) => `<li><a href="${encodeAttribute(url)}" ${externalAttrs()}>${label}</a></li>`).join('')}</ul>` : ''}
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="current-year"></span> ${escapeHTML(site.nombreMarca)}. ${escapeHTML(site.pais || 'México')}.</span>
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
    link.setAttribute('aria-label', `Escribir por WhatsApp al ${site.whatsappVisible || ''}`.trim());
    link.innerHTML = `${icons.chat}<span>WhatsApp</span>`;
    document.body.appendChild(link);
  }

  // Enlaces con mensaje prellenado: data-whatsapp-message="texto" o data-whatsapp-key="campo de site.json"
  function bindWhatsappLinks(site) {
    document.querySelectorAll('[data-whatsapp-message], [data-whatsapp-key]').forEach((link) => {
      const key = link.getAttribute('data-whatsapp-key');
      const message = key ? site[key] : link.getAttribute('data-whatsapp-message');
      const href = whatsappUrl(site, message);
      if (!href) return;
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  // Textos que dependen de site.json (número visible, horario, cobertura)
  function fillSiteText(site) {
    document.querySelectorAll('[data-site-text]').forEach((node) => {
      const value = site[node.getAttribute('data-site-text')];
      if (isDefined(value)) node.textContent = value;
    });
  }

  function renderSocialBlocks(site) {
    const social = socialLinks(site);
    document.querySelectorAll('[data-social-links]').forEach((node) => {
      if (!social.length) return;
      node.innerHTML = `
        <h3>Redes sociales</h3>
        <ul class="social-links">
          ${social.map(([label, url]) => `<li><a href="${encodeAttribute(url)}" ${externalAttrs()}>${label}</a></li>`).join('')}
        </ul>
      `;
    });
  }

  function bindContactForm(site) {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const feedback = document.getElementById('contact-feedback');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.elements.nombre.value.trim();
      const service = form.elements.servicio.value.trim();
      const message = form.elements.mensaje.value.trim();

      if (!name || !service || !message) {
        if (feedback) {
          feedback.textContent = 'Complete su nombre, el servicio de interés y su mensaje.';
          feedback.classList.add('is-error');
        }
        const firstEmpty = [form.elements.nombre, form.elements.servicio, form.elements.mensaje].find((field) => !field.value.trim());
        firstEmpty?.focus();
        return;
      }

      const text = `Hola, soy ${name}.\nServicio de interés: ${service}\n\n${message}`;
      const href = whatsappUrl(site, text);
      if (!href) return;

      if (feedback) {
        feedback.classList.remove('is-error');
        feedback.textContent = 'Abriendo WhatsApp con su mensaje listo para enviar.';
      }
      // Con 'noopener' window.open siempre devuelve null; se abre sin él y se corta la referencia
      const opened = window.open(href, '_blank');
      if (opened) {
        opened.opener = null;
      } else {
        window.location.href = href;
      }
    });
  }

  function injectStructuredData(site) {
    if (!isDefined(site.whatsappNumero) || document.getElementById('ld-organizacion')) return;
    const base = (site.dominio || 'https://tecnologicaluxen.com').replace(/\/$/, '');
    const digits = String(site.whatsappNumero);
    const phone = `+${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: site.nombreMarca,
      url: `${base}/`,
      logo: `${base}/${site.logoTransparentePng || 'assets/logo/luxen-logo-transparente.png'}`,
      image: `${base}/${site.ogImage || 'assets/og-luxen.jpg'}`,
      description: site.descripcionCorta,
      areaServed: 'MX',
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: phone,
        contactType: 'customer service',
        areaServed: 'MX',
        availableLanguage: 'es'
      }],
      sameAs: socialLinks(site).map(([, url]) => url)
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-organizacion';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }

  async function renderFeaturedProducts(site) {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    const limit = Number(grid.dataset.limit) || 4;
    try {
      const products = await getProducts();
      const featured = products.filter((product) => product.destacado);
      const visible = (featured.length ? featured : products).slice(0, limit);
      grid.innerHTML = visible.map((product) => productCard(product, site, { minimal: true })).join('');
    } catch (error) {
      console.error(error);
      grid.innerHTML = '<p class="empty-state">No se pudieron cargar los productos. <a href="catalogo.html">Ver catálogo</a>.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const site = await getSite();
      renderHeader(site);
      renderFooter(site);
      renderFloatingWhatsapp(site);
      bindWhatsappLinks(site);
      fillSiteText(site);
      renderSocialBlocks(site);
      bindContactForm(site);
      injectStructuredData(site);
      await renderFeaturedProducts(site);
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
    icons,
    isDefined,
    isValidHttpUrl,
    productCard,
    productUrl,
    statusFor,
    wholesaleBadge,
    wholesaleMessage,
    wholesaleText,
    wholesaleUrl,
    whatsappUrl
  };
})();
