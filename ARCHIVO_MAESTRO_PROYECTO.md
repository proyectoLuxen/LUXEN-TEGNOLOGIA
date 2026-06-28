# Archivo maestro del proyecto - LUXEN TECNOLOGÍA

Este documento explica qué contiene el proyecto, para qué sirve cada archivo, qué está listo, qué falta definir y qué debes subir a GitHub Pages.

## Resumen ejecutivo

El proyecto es una tienda-catálogo estática para LUXEN TECNOLOGÍA.

La página no procesa pagos dentro del sitio, no tiene carrito, no guarda datos personales y no usa backend. Su función es mostrar productos con fotos, precios, descripción, ficha técnica y botones de acción.

Los botones hacen esto:

- `Comprar por WhatsApp`: abre WhatsApp con mensaje específico del producto.
- `Ver en Mercado Libre`: abre la publicación externa cuando existe enlace válido.
- `Pagar con Mercado Pago`: solo se muestra si en el futuro agregas un enlace de Mercado Pago al producto.

## Estado actual

- Sitio listo para GitHub Pages.
- Catálogo cargando 8 productos.
- Inicio mostrando productos reales con imágenes.
- Páginas internas creadas.
- Vista individual por producto funcionando con `producto.html?id=...`.
- Imágenes optimizadas en WebP.
- Diseño responsive para celular y computadora.
- Botón flotante de WhatsApp activo.
- Enlaces de Mercado Libre configurados para 7 productos.
- Mercado Pago oculto porque no hay enlaces reales todavía.
- Respaldo local agregado para que el catálogo también cargue al abrir `index.html` con doble clic.

## Estructura principal

### Archivos HTML

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página de inicio. Presenta marca, beneficios, productos destacados y flujo de compra. |
| `catalogo.html` | Catálogo completo con 8 productos y filtros por categoría. |
| `producto.html` | Página dinámica de detalle. Usa el parámetro `?id=` para mostrar cada producto. |
| `como-comprar.html` | Explica cómo comprar: elegir producto, confirmar por WhatsApp y usar enlaces externos. |
| `envios.html` | Explica cobertura, tiempos, costos y seguimiento de envío sin inventar datos fijos. |
| `politicas.html` | Resume políticas comerciales, pagos, garantías, cambios y privacidad básica. |
| `contacto.html` | Página de contacto con WhatsApp Business y datos públicos disponibles. |
| `404.html` | Página amable para enlaces no encontrados. |

### Carpetas públicas

| Carpeta | Contenido | Se sube a GitHub |
|---|---|---|
| `assets/` | Logos e imágenes optimizadas para la web. | Sí |
| `css/` | Estilos visuales del sitio. | Sí |
| `js/` | Lógica de navegación, catálogo, producto y datos de respaldo. | Sí |
| `data/` | Datos editables en JSON. | Sí |

### Archivos de configuración pública

| Archivo | Para qué sirve | Se sube a GitHub |
|---|---|---|
| `README.md` | Instrucciones rápidas de uso, edición y publicación. | Sí |
| `ARCHIVO_MAESTRO_PROYECTO.md` | Este documento maestro del proyecto. | Opcional, recomendado |
| `robots.txt` | Indicación básica para buscadores. | Sí |
| `sitemap.xml` | Mapa de URLs del sitio. Debe actualizarse cuando tengas URL final. | Sí |
| `.nojekyll` | Evita procesamiento innecesario de GitHub Pages. | Sí |
| `.gitignore` | Protege carpetas fuente si usas Git local. | Sí, aunque no protege cargas manuales |

## Carpeta limpia para subir a GitHub

Se creó una carpeta llamada:

```text
PUBLICAR_GITHUB_PAGES/
```

Esa carpeta contiene únicamente los archivos públicos que debes subir a GitHub.

Cuando uses la página web de GitHub para cargar archivos, entra a `PUBLICAR_GITHUB_PAGES/` y sube el contenido de esa carpeta, no la carpeta completa como carpeta anidada.

Debe quedar así en GitHub:

```text
/
├── index.html
├── catalogo.html
├── producto.html
├── css/
├── js/
├── data/
├── assets/
└── ...
```

No debe quedar así:

```text
/
└── PUBLICAR_GITHUB_PAGES/
    └── index.html
```

Si queda anidado, GitHub Pages no encontrará el inicio correctamente.

## Archivos que no debes subir manualmente

Estas carpetas son fuentes de trabajo, no publicación:

- `DOCUMENTOS/`
- `IMAGENES Y VIDEOS - PRODUCTOS/`
- `LOGOS TIENDA/`
- `LUXEN_TECNOLOGIA_Kit_Empresarial_V4/`
- `ESPECIFICACION_CODEX_TIENDA_CATALOGO_GITHUB.md`

Aunque `.gitignore` las protege si usas Git, GitHub web no respeta `.gitignore` cuando arrastras archivos manualmente. Por eso la forma más segura es subir solo el contenido de `PUBLICAR_GITHUB_PAGES/`.

## Datos del negocio

Archivo:

```text
data/site.json
```

Contiene:

- Nombre de marca: `LUXEN TECNOLOGÍA`
- Slogan: `Servicios y Ventas de Tecnología`
- WhatsApp: `55 4919 5931`
- Número internacional para WhatsApp: `525549195931`
- Textos de envío, pago, facturación y disponibilidad
- Logo y recursos sociales

Pendientes dentro del negocio:

- Correo público.
- Horario de atención.
- Ciudad o zona pública.
- Dominio o URL final de GitHub Pages.
- Redes sociales públicas si se van a mostrar.

## Datos de productos

Archivo:

```text
data/productos.json
```

Contiene los 8 productos del catálogo:

| # | Producto | Precio | Mercado Libre | Mercado Pago | Imagen |
|---|---|---:|---|---|---|
| 1 | Audífonos Xiaomi TWS-7 Negros Sweat Proof con Estuche de Carga | $999.00 MXN | Sí | No | Sí |
| 2 | Audífonos Samsung TWS-7 Negros | $999.00 MXN | Sí | No | Sí |
| 3 | Skullcandy TWS-7 Super Bass Sweatproof con Estuche de Carga, Negro | $999.00 MXN | Sí | No | Sí |
| 4 | Cargador Apple Original 35 W con Doble Puerto USB-C, Blanco | $976.00 MXN | Sí | No | Sí |
| 5 | Cargador Apple 35 W Doble USB-C para iPhone 14 Pro Max y 14 Plus, Blanco | $976.00 MXN | Sí | No | Sí |
| 6 | JBL TWS-7 Super Bass Sweatproof Sports con Estuche de Carga, Negro | $999.00 MXN | Sí | No | Sí |
| 7 | Cargador Apple 35 W Doble USB-C con Cable Tipo C, Blanco | $1,270.00 MXN | Sí | No | Sí |
| 8 | Cable Apple USB-C a Lightning, 1 m, Blanco | $590.00 MXN | Falta confirmar | No | Sí |

## Enlaces faltantes

### Mercado Pago

No hay enlaces de Mercado Pago configurados. Por eso el sitio no muestra botones de Mercado Pago.

Para activar un botón de Mercado Pago en un producto:

1. Abre `data/productos.json`.
2. Busca el producto.
3. Coloca el enlace en:

```json
"linkMercadoPago": "https://..."
```

### Mercado Libre

Falta confirmar el enlace correcto para:

```text
Cable Apple USB-C a Lightning, 1 m, Blanco
```

El documento fuente repetía el enlace del kit cargador + cable. Para no mandar al cliente a un producto incorrecto, el botón de Mercado Libre está oculto en ese producto.

## Imágenes

Las imágenes públicas están en:

```text
assets/productos/
```

Todas las imágenes públicas fueron optimizadas a `.webp`.

Productos sin imagen:

```text
Ninguno.
```

Archivo visual destacado:

```text
assets/productos/hero-productos.webp
```

Sirve como imagen principal del inicio y Open Graph.

## Cómo funciona la carga del catálogo

El sitio intenta cargar primero:

```text
data/site.json
data/productos.json
```

Eso funciona perfecto en GitHub Pages.

Además existe este respaldo:

```text
js/data-inline.js
```

Ese archivo permite que el sitio también cargue productos cuando abres `index.html` directamente en Windows, sin servidor.

Importante:

- Si editas `data/site.json` o `data/productos.json`, el sitio publicado en GitHub Pages tomará esos JSON.
- Si quieres que también se actualice el modo de doble clic local, hay que regenerar `js/data-inline.js` con los mismos datos.

## Páginas dinámicas de producto

La página:

```text
producto.html
```

Muestra cada producto usando su ID.

Ejemplos:

```text
producto.html?id=audifonos-xiaomi-tws-7-negros-sweat-proof
producto.html?id=skullcandy-tws-7-super-bass-sweatproof
producto.html?id=cable-apple-usb-c-lightning-1m-blanco
```

Cada tarjeta del catálogo genera automáticamente el enlace correcto.

## Cómo subir manualmente a GitHub Pages

1. Crea un repositorio en GitHub.
2. Entra al repositorio.
3. Presiona `Add file > Upload files`.
4. Abre en tu computadora la carpeta:

   ```text
   PUBLICAR_GITHUB_PAGES/
   ```

5. Selecciona todo el contenido de esa carpeta.
6. Arrástralo a GitHub.
7. Confirma el commit.
8. Entra a `Settings > Pages`.
9. En `Build and deployment`, selecciona `Deploy from a branch`.
10. Elige rama `main` y carpeta `/root`.
11. Guarda.
12. Espera la URL pública.
13. Cuando tengas la URL, actualiza `sitemap.xml` reemplazando:

   ```text
   https://TU-USUARIO.github.io/TU-REPOSITORIO/
   ```

## Verificación realizada

Se verificó:

- `index.html` carga por servidor HTTP.
- `catalogo.html` carga 8 productos.
- `producto.html` carga productos por ID.
- Las imágenes públicas existen.
- El respaldo `js/data-inline.js` permite cargar productos aunque falten temporalmente los JSON.
- No hay productos sin imagen.
- Los productos muestran WhatsApp siempre.
- Mercado Libre se muestra solo cuando hay enlace.
- Mercado Pago no aparece porque no hay enlaces.
- Diseño responsive en móvil y escritorio.
- Menú móvil funcional.

## Pendientes antes de publicación comercial final

- Definir correo público.
- Definir horario de atención.
- Definir ciudad o zona pública.
- Confirmar stock real por producto.
- Confirmar enlace de Mercado Libre del cable Apple USB-C a Lightning.
- Agregar enlaces de Mercado Pago si se usarán.
- Actualizar `sitemap.xml` con la URL final.
- Revisar si deseas mostrar redes sociales.
- Revisar legalmente políticas si se usarán como políticas comerciales formales.

## Regla práctica para mantener el sitio

Para editar textos generales:

```text
data/site.json
```

Para editar productos:

```text
data/productos.json
```

Para cambiar diseño:

```text
css/styles.css
```

Para cambiar comportamiento:

```text
js/main.js
js/catalogo.js
js/producto.js
```

Para subir a GitHub manualmente:

```text
Subir solo el contenido de PUBLICAR_GITHUB_PAGES/
```

## Actualización V2 - mayoreo y servicios técnicos

La V2 agrega dos líneas comerciales sin rediseñar la identidad visual aprobada:

- Cotización por mayoreo en tarjetas de producto y página de detalle.
- Página profesional de servicios técnicos para equipos de cómputo.

### Archivos nuevos V2

| Archivo | Para qué sirve |
|---|---|
| `servicios-tecnicos.html` | Página pública de diagnóstico, mantenimiento, software y hardware. |
| `js/servicios.js` | Renderiza las tarjetas de servicio y genera mensajes de WhatsApp. |
| `assets/servicios/CREDITOS_IMAGENES.md` | Registra que no se usaron imágenes externas de servicios en esta versión. |

### Componentes nuevos o extendidos

| Componente | Dónde vive | Función |
|---|---|---|
| `wholesale-badge` | `js/main.js` y `css/styles.css` | Muestra que hay mayoreo disponible sin inventar precio. |
| `wholesale-cta` | `js/main.js`, `producto.js` y HTML | Abre WhatsApp para cotización mayorista. |
| `service-card` | `js/servicios.js` y `css/styles.css` | Tarjeta visual para cada servicio técnico. |
| `service-category-card` | `servicios-tecnicos.html` y `css/styles.css` | Separa servicios de software y hardware. |
| `service-process-step` | `servicios-tecnicos.html` y `css/styles.css` | Explica el proceso de atención en cuatro pasos. |
| `whatsapp-button` | CSS/clases existentes extendidas | Identifica acciones hacia WhatsApp. |
| `external-payment-button` | `js/main.js` | Se muestra solo con enlace válido de Mercado Pago. |
| `external-marketplace-button` | `js/main.js` | Se muestra solo con enlace válido de Mercado Libre. |

### Datos de mayoreo

Los 8 productos quedaron con:

```json
"mayoreoDisponible": true
```

No se publicaron precios mayoristas ni cantidades mínimas porque no hay datos autorizados. Por eso cada producto conserva:

```json
"cantidadMinimaMayoreo": null,
"precioMayoreo": null
```

Cuando existan datos reales, edita cada producto en `data/productos.json`. El sitio solo muestra cantidad mínima o precio mayorista si esos campos tienen valores reales.

### Servicios técnicos

La página `servicios-tecnicos.html` incluye:

- Hero de servicios.
- 12 tarjetas de servicio.
- Separación entre software y hardware.
- Proceso de atención en cuatro pasos.
- CTA final por WhatsApp.

Los textos evitan prometer diagnóstico remoto definitivo, recuperación total, reparación inmediata o certificaciones no documentadas.

### Imágenes de servicios

No se usaron imágenes externas. Se creó:

```text
assets/servicios/CREDITOS_IMAGENES.md
```

Si después agregas fotos reales o imágenes libres de Pexels/Unsplash, registra ahí fuente, autor, licencia, URL y uso dentro del sitio.

### Pendientes V2

- Confirmar precios de mayoreo si se desean publicar.
- Confirmar cantidades mínimas por producto si existen.
- Confirmar cobertura, horario y alcance de servicios técnicos.
- Confirmar si habrá precios fijos para servicios técnicos.
- Confirmar enlaces de Mercado Pago.
- Confirmar enlace correcto de Mercado Libre para el cable Apple USB-C a Lightning.

## Actualización V3 - videos, FAQ y preguntas

La V3 agrega una sección de contenido para mejorar navegación, confianza y tráfico orgánico:

- Nueva pestaña `Videos`.
- Página `videos.html`.
- Video de YouTube incrustado.
- Tarjetas tipo blog con temas de compra, mayoreo y soporte.
- Preguntas frecuentes en formato acordeón.
- Formulario para enviar preguntas por WhatsApp.

### Archivos nuevos V3

| Archivo | Para qué sirve |
|---|---|
| `videos.html` | Página pública de videos, blog corto y preguntas frecuentes. |
| `js/videos.js` | Conecta el formulario de preguntas con WhatsApp. |

### Video principal

El video configurado es:

```text
https://youtu.be/3UrWzc8OV8I
```

También quedó registrado en:

```text
data/site.json
```

Campos agregados:

```json
"youtubeVideoPrincipalUrl": "https://youtu.be/3UrWzc8OV8I",
"youtubeVideoPrincipalId": "3UrWzc8OV8I",
"youtubeVideoPrincipalTitulo": "Video destacado del canal"
```

### Preguntas de usuarios

GitHub Pages no tiene base de datos ni backend propio. Por eso el formulario de `videos.html` no guarda preguntas dentro del sitio; prepara un mensaje de WhatsApp con:

- Tema.
- Nombre opcional.
- Pregunta.

Cuando existan preguntas reales frecuentes, se pueden convertir en respuestas públicas dentro de `videos.html`.

### Pendientes V3

- Confirmar el título oficial del video de YouTube.
- Agregar más videos del canal cuando estén listos.
- Convertir preguntas reales de clientes en nuevas entradas FAQ.
