(async function () {
  const app = window.LuxenStore;

  const services = [
    {
      code: 'MP',
      title: 'Mantenimiento preventivo',
      description: 'Limpieza y revisión general para ayudar a conservar el rendimiento del equipo.'
    },
    {
      code: 'MC',
      title: 'Mantenimiento correctivo',
      description: 'Revisión de fallas reportadas para orientar una solución de software o hardware.'
    },
    {
      code: 'DX',
      title: 'Diagnóstico de fallas',
      description: 'Revisión inicial para identificar posibles problemas de software o hardware.'
    },
    {
      code: 'LI',
      title: 'Limpieza interna de equipos',
      description: 'Limpieza física interna cuando el equipo y las condiciones lo permiten.'
    },
    {
      code: 'OP',
      title: 'Optimización de rendimiento',
      description: 'Revisión de programas, almacenamiento y configuración para mejorar el funcionamiento general.'
    },
    {
      code: 'IN',
      title: 'Instalación y configuración de software',
      description: 'Apoyo para instalación y configuración de programas requeridos por el usuario.'
    },
    {
      code: 'ML',
      title: 'Eliminación de malware y limpieza de sistema',
      description: 'Revisión del sistema para atender software no deseado y mejorar la estabilidad.'
    },
    {
      code: 'SO',
      title: 'Formateo e instalación de sistema operativo',
      description: 'Instalación de sistema operativo cuando el diagnóstico y respaldo lo permiten.'
    },
    {
      code: 'BR',
      title: 'Respaldo y recuperación básica de información',
      description: 'Apoyo para respaldo o recuperación básica cuando el estado del equipo lo permite.'
    },
    {
      code: 'AC',
      title: 'Actualización de componentes',
      description: 'Orientación para ampliar o reemplazar componentes compatibles con el equipo.'
    },
    {
      code: 'RH',
      title: 'Revisión de hardware',
      description: 'Revisión de componentes físicos, ventilación, almacenamiento y funcionamiento general.'
    },
    {
      code: 'PR',
      title: 'Configuración de periféricos y redes básicas',
      description: 'Apoyo para impresoras, accesorios, conexiones y redes básicas del entorno de trabajo.'
    }
  ];

  function serviceMessage(service) {
    return `Hola, necesito información sobre el servicio técnico: ${service.title}.

Tipo de equipo:
Marca y modelo:
Problema o síntoma:
Ciudad:
¿Pueden ayudarme con diagnóstico y cotización?`;
  }

  function serviceButton(service, site) {
    const href = app.whatsappUrl(site, serviceMessage(service));
    if (!href) return '';
    return `<a class="button button-muted whatsapp-button" href="${app.escapeHTML(href)}" ${app.externalAttrs()}>Consultar por WhatsApp</a>`;
  }

  function renderServices(site) {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = services.map((service) => `
      <article class="service-card">
        <span class="service-card__icon" aria-hidden="true">${app.escapeHTML(service.code)}</span>
        <h3>${app.escapeHTML(service.title)}</h3>
        <p>${app.escapeHTML(service.description)}</p>
        ${serviceButton(service, site)}
      </article>
    `).join('');
  }

  function bindGeneralButtons(site) {
    const href = app.whatsappUrl(site, site.mensajeWhatsAppServicioTecnico);
    if (!href) return;
    document.querySelectorAll('#service-hero-whatsapp, #service-final-whatsapp').forEach((link) => {
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  try {
    const site = await app.getSite();
    renderServices(site);
    bindGeneralButtons(site);
  } catch (error) {
    console.error(error);
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.innerHTML = '<p class="empty-state">No se pudo cargar la información de servicios.</p>';
    }
  }
})();
