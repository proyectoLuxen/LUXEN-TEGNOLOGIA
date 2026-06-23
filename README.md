# LUXEN TECNOLOGÍA - Tienda catálogo estática

Sitio estático para GitHub Pages con catálogo de productos tecnológicos, videos, preguntas frecuentes, compra por WhatsApp, cotización por mayoreo, servicios técnicos y enlaces externos a Mercado Libre cuando existen en los datos.

## Abrir localmente

Puedes abrir `index.html` directamente con doble clic. El sitio incluye un respaldo local en `js/data-inline.js` para que el catálogo cargue aunque el navegador bloquee `fetch()` desde archivos locales.

Para una prueba más parecida a GitHub Pages, usa un servidor estático:

```powershell
python -m http.server 8080
```

Luego abre `http://localhost:8080`.

## Editar datos generales

Los datos públicos del negocio están en `data/site.json`.

Campos importantes:

- `whatsappNumero`: número con código de país, sin espacios ni signos.
- `whatsappVisible`: número como se muestra al cliente.
- `correoContacto`: deja `PENDIENTE_DEFINIR` si no hay correo público.
- `dominio`: completa cuando exista dominio o URL final de GitHub Pages.
- `mensajeWhatsAppGeneral`: mensaje del botón flotante.

## Agregar o editar productos

Edita `data/productos.json`. Cada producto debe tener:

- `id` único en minúsculas, sin espacios ni acentos.
- `nombre`, `precio`, `precioTexto`, `descripcionCorta` y `descripcionLarga`.
- `imagenes` e `imagenPrincipal` con rutas dentro de `assets/images/productos/`.
- `whatsappTexto` con el mensaje específico del producto.
- `linkMercadoLibre` solo si el enlace correcto existe.
- `linkMercadoPago` solo si existe un enlace público autorizado.
- `mayoreoDisponible`, `cantidadMinimaMayoreo`, `precioMayoreo`, `mensajeMayoreo` y `whatsappTextoMayoreo` para controlar la sección de mayoreo.

Si un enlace no existe, déjalo vacío para que el botón no se muestre.

## Mayoreo

La V2 muestra cotización por mayoreo en tarjetas y detalle de producto cuando:

```json
"mayoreoDisponible": true
```

No se deben inventar precios ni cantidades mínimas. Si todavía no hay datos autorizados, deja:

```json
"cantidadMinimaMayoreo": null,
"precioMayoreo": null
```

El botón `Cotizar mayoreo` abre WhatsApp con el nombre real del producto y campos para cantidad aproximada y ciudad de entrega.

## Servicios técnicos

La página nueva está en:

```text
servicios-tecnicos.html
```

Usa:

- `js/servicios.js` para renderizar tarjetas de servicio y mensajes de WhatsApp.
- `assets/servicios/CREDITOS_IMAGENES.md` para documentar imágenes externas.

En esta V2 no se usaron fotos externas de servicios; la página utiliza íconos tipográficos propios para no simular trabajos, instalaciones o personal no documentado.

## Videos y preguntas frecuentes

La página de videos está en:

```text
videos.html
```

Incluye:

- Video destacado de YouTube.
- Tarjetas tipo blog con temas de compra, mayoreo y soporte.
- Preguntas frecuentes en formato acordeón.
- Formulario para enviar preguntas por WhatsApp.

El sitio es estático, así que no guarda preguntas en una base de datos. El formulario prepara un mensaje de WhatsApp para recibir la duda por el canal de atención.

Para cambiar el video principal, edita:

```text
videos.html
data/site.json
```

El video actual usa:

```text
https://youtu.be/3UrWzc8OV8I
```

## Agregar imágenes

Guarda imágenes públicas optimizadas en `assets/images/productos/`.

Recomendaciones:

- Usa nombres sin espacios ni acentos.
- Prefiere `.webp` para producto.
- No borres las fotos originales si sirven como respaldo.
- No subas facturas, documentos fiscales, datos de cliente ni comprobantes.

## Publicar en GitHub Pages subiendo archivos manualmente

La forma más segura es usar la carpeta limpia:

```text
PUBLICAR_GITHUB_PAGES/
```

En la versión separada del proyecto, la carpeta final para subir manualmente es:

```text
C:\Users\carlo\Desktop\TIENDA_LUXEN_SEPARADA\01_PUBLICAR_GITHUB_PAGES\
```

1. Crea un repositorio nuevo en GitHub.
2. Entra a `PUBLICAR_GITHUB_PAGES/` en tu computadora.
3. Selecciona todo el contenido de esa carpeta.
4. En GitHub, usa `Add file > Upload files`.
5. Arrastra esos archivos y carpetas.
6. Confirma el commit.
7. En GitHub, entra a `Settings > Pages`.
8. En `Build and deployment`, selecciona `Deploy from a branch`.
9. Elige la rama `main` y carpeta `/root`.
10. Guarda y espera la URL pública.
11. Actualiza `sitemap.xml` con la URL real.

No subas manualmente las carpetas fuente `DOCUMENTOS/`, `IMAGENES Y VIDEOS - PRODUCTOS/`, `LOGOS TIENDA/` ni `LUXEN_TECNOLOGIA_Kit_Empresarial_V4/`.

## Dominio propio

Cuando tengas dominio:

1. Configura el dominio en `Settings > Pages`.
2. Agrega el archivo `CNAME` con el dominio si GitHub lo solicita.
3. Actualiza `data/site.json` y `sitemap.xml`.
4. Revisa que todos los enlaces internos carguen con rutas relativas.

## No subir al repositorio público

- Facturas.
- PDFs fiscales.
- Datos de clientes.
- RFC, CURP, INE o datos bancarios.
- Archivos `.env`, tokens, contraseñas o API keys.
- Documentos fuente de Word.
- ZIPs con material privado.

## Pendientes antes de publicación final

- Definir correo público.
- Definir horario de atención.
- Definir ciudad o zona pública, si se desea mostrar.
- Confirmar URL final de GitHub Pages o dominio.
- Confirmar si habrá enlaces de Mercado Pago.
- Confirmar enlace correcto de Mercado Libre para el cable USB-C a Lightning.
- Confirmar disponibilidad/stock real por producto.
- Confirmar precios o cantidades mínimas de mayoreo, si se desean mostrar públicamente.
- Confirmar cobertura, horario y alcance comercial de servicios técnicos.
- Confirmar título oficial del video de YouTube si deseas mostrarlo públicamente.
- Definir nuevas preguntas frecuentes conforme lleguen dudas reales.
- Revisar políticas comerciales con el alcance real de cambios, devoluciones y garantías.

## Archivo maestro

La explicación completa del proyecto está en:

```text
ARCHIVO_MAESTRO_PROYECTO.md
```

## Checklist de publicación

- [ ] No hay facturas ni documentos privados en el repositorio.
- [ ] `data/site.json` tiene el WhatsApp correcto.
- [ ] Cada producto tiene imagen principal.
- [ ] Cada producto tiene precio y descripción.
- [ ] Los enlaces de Mercado Libre abren la publicación correcta.
- [ ] Los productos sin enlace no muestran botones vacíos.
- [ ] `sitemap.xml` usa la URL pública real.
- [ ] La página se probó en móvil y escritorio.
