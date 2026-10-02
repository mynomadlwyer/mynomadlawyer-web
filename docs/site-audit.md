# Auditoría de My Nomad Lawyer

Fecha: 16-09-2026. Fuente única confirmada: https://mynomadlawyer.com, que redirige a https://www.mynomadlawyer.com/.

Inspección base completada ANTES de crear componentes: navegación pública, HTML/CSS, estilos calculados, controles y capturas. Evidencias en `docs/inspection/`. No se ha accedido a administración, datos autenticados ni código de servidor.

## 1. Sitemap y 2. Rutas

Las diez rutas devolvieron HTTP 200 y se abrieron en el navegador:

| Ruta | Título | Acceso |
| --- | --- | --- |
| `/` | Home | Header, footer |
| `/about-us/` | About us | Header, footer |
| `/services-my-nomad-lawyer/` | Our services | Header, footer, CTAs |
| `/why-choose-us/` | Why choose us? | Header, footer, CTAs |
| `/contact/` | Contact us | Header, footer, CTAs |
| `/testimonials/` | Testimonials | Sitemap, footer |
| `/privacy-policy/` | Privacy policy | Footer |
| `/cookies-policy/` | Cookies policy | Footer |
| `/accessibility-statement/` | Accessibility Statement | Footer |
| `/legal-notice/` | Legal notice | Footer |

`/page-sitemap.xml` lista las seis páginas comerciales. Las cuatro legales se descubren desde el footer. Anchor `#content` para Skip to content. No hay login, checkout ni blog enlazados en la navegación inspeccionada.

El footer conserva enlaces a un antiguo dominio de pruebas: no se utilizó como referencia; sus rutas se verificaron exclusivamente en el dominio confirmado y se resolverán localmente. GTranslate utiliza traducción dinámica, no rutas `/es/`.

## 3. Secciones

Jerarquía en `docs/page-structure.md`; texto y widgets exactos en `inspection/architecture.json` y HTML públicos. Se conservan el inglés/español mezclados, la grafía «profesional» y los textos legales incompletos. Testimonials muestra un hero y una sección beige vacía.

## 4. Componentes reutilizables

Header, Navigation, MobileMenu, selector de idioma, heroes, títulos con cursiva verde, CTAs rectangulares, tarjetas de beneficios/servicios, bloques de imagen y texto, logos, carrusel de reseñas, ContactForm, Footer, banda de financiación, CookieConsent y controles flotantes.

## 5. Fuentes

| Uso | Fuente | Valores observados |
| --- | --- | --- |
| Texto / navegación | DM Sans | 15–17px; pesos 300/400/500/700; line-height usual 1.5 |
| Títulos | Cormorant Garamond | pesos 600/700, énfasis cursiva |
| H1 Home 1440px | Cormorant Garamond | 70/70px, 600 |
| H1 Home 1280px | Cormorant Garamond | 56/56px |
| H1 Home 1024/768px | Cormorant Garamond | 45/45px |
| H1 Home 430/390px | Cormorant Garamond | 31/31px |
| Títulos de sección desktop | Cormorant Garamond | 47/47, 60/52, 60/60 o 60/71px según bloque |
| Navegación | DM Sans | 16px / 25px |
| Botones | Roboto declarado; contenido DM Sans | 15px, peso 500, padding 12px 24px |

Elementor también declara Roboto y Roboto Slab. Se conservan fuentes locales para mantener la cascada original. No se sustituyen tipografías.

## 6. Paleta, medidas y layout

| Elemento | Valor |
| --- | --- |
| Verde | `#083D04` |
| Beige | `#EAE6CE` |
| Blanco | `#FFFFFF` |
| Texto | `#383838` |
| Títulos negros | `#000000` |
| Gris de navegación/separadores | `#636363` |
| Overlay Home | `#021E00`, opacity 0.76, multiply |
| Azul cookies | `#1863DC` |
| Header | altura calculada 180px, position relative, padding-top 10px |
| Logo header | width 130px |
| Container header | max-width 1600px |
| Container base Elementor | max-width 1140px |
| Secciones amplias | 1400/1600px según bloque |
| Hero Home interior desktop | max-width 875px, contenido útil 855px |
| Hero Home móvil | max-width 300px; padding exterior 60px 40px |
| Heroes interiores desktop | padding vertical 80px |
| Secciones principales | padding vertical 60/80/100px |
| Widgets | separación base 20px |
| Tarjetas Home desktop | border 1px verde; margin 30px; padding 50px |
| Botones/campos | radio 0, borde 1px |
| Reseñas | tarjetas blancas con radio y borde tenue |
| Cookie banner | inferior izquierdo, width 440px, radio 6px, sombra |

CSS público local y `home-responsive.json` conservan medidas por elemento. No hay un único container o tamaño de H2 para toda la web.

## 7. Breakpoints y responsive

Portada medida y capturada a 1440, 1280, 1024, 768, 430 y 390px. Las otras nueve páginas capturadas a 1440, 768 y 390px.

- Breakpoints de contenido: 1366, 1024 y 767px; el tema añade 768px.
- Hasta 1024: menú hamburguesa, footer en columna, varios bloques imagen/texto y consulta apilados.
- El menú abierto expande el header y desplaza el contenido, no es overlay lateral.
- Tablet: containers de 600px en varias secciones; servicios Home en distribución 3+2.
- Móvil: texto 15px, títulos reducidos, padding lateral 30/40px, logos/tarjetas apilados, separadores horizontales.
- Header no sticky; WhatsApp y preferencias fixed.
- Franjas con background-attachment fixed en escritorio grande; reglas específicas lo modifican en tamaños menores.

Las capturas largas del navegador presentan algunos artefactos de unión y carga diferida. La validación usa también capturas de viewport y medidas DOM con imágenes cargadas.

## 8. Assets públicos

`inspection/assets.json` registra URL, ruta local, tipo, tamaño y resultado: 221 recursos descargados correctamente; 29 CSS, 97 imágenes/iconos, 95 archivos de fuentes; unos 12.1 MB. Se añadieron los iconos públicos de WhatsApp y reCAPTCHA para sus controles locales; 223 recursos descargados en total, además de estilos observados y SVG inline.

Organización: `public/images/`, `public/icons/`, `public/fonts/`, `public/styles/`.

Incluyen logo, pasaporte, retrato de Gemma, mazo judicial, Justicia, mapa de España, fondos de heroes, logos de colaboradores/financiación, iconos de servicios, avatares/estrellas de reseñas, cookies y banderas. SVG inline adicionales en los componentes. No se detectaron vídeos.

Solo se descargan assets públicos referenciados por el frontend. La copia se destina al proyecto local indicado; no se presupone licencia general para redistribuir marcas/fotografías de terceros.

## 9. Animaciones e interacciones

- Menú móvil verificado abierto/cerrado; hamburguesa cambia por X.
- Dropdown EN muestra Spanish con bandera. Traducción delegada a GTranslate.
- Hero Home: fadeInDown; transiciones CSS de 0.3s en fondo/borde/opacidad/sombra.
- CTA blanco: hover/focus transparente, texto/borde blancos. CTA verde: hover/focus blanco, texto/borde verdes. Estados extraídos de CSS; la API no ofrece hover directo.
- Trustindex: siete reseñas, anterior/siguiente, autoavance configurado a 6s, Read more/Hide y adaptación al ancho. Controles inspeccionados en scroll.
- CookieYes: aceptar/rechazar, personalizar, cinco categorías, acordeones, toggle analítica, cierre y reapertura. Modal inspeccionado.
- Formulario: nombre/email y políticas obligatorios; motivo; fecha/hora como TEXTO libre; select Digital Nomad Visa / Real Estate / Other; mensaje. No se envió ningún formulario original.
- No se detectaron FAQs, pagos ni otros modales comerciales.

## 10. Integraciones

WordPress, GeneratePress 3.6.1 con tema hijo, Elementor 4.2.4, WPForms Lite, Trustindex/Google, CookieYes, GTranslate, Google Fonts, reCAPTCHA v3, WhatsApp y Yoast SEO. La política menciona Analytics; no basta para confirmar seguimiento activo.

La reconstrucción sustituye scripts WordPress/terceros por JS propio. No conserva tokens de formulario ni credenciales. No conecta backend ni trackers.

## 11. Límites y decisiones

- Consultas: UI y validación local; confirmación explícita de que no se envió nada.
- reCAPTCHA: representación visual, sin API ni clave.
- GTranslate: dropdown local; traducción externa desconectada, sin copy inventado.
- Reseñas: snapshot público con carrusel local, sin sincronización.
- Cookies: preferencias exclusivamente locales, sin activar servicios externos.
- Enlaces de navegación antiguos normalizados a rutas locales.
- Contenido legal literal; no se ha realizado una revisión jurídica.

## Implementación local y validación

Sitio estático modular implementado con plantillas de página, componentes compartidos, recursos locales y JS propio. Sin runtime WordPress. Sin GitHub, Cloudflare, DNS, CI/CD ni despliegues. Las diez rutas compilan y responden localmente. La validación visual es parcial: ver `docs/visual-validation.md` para evidencias válidas, comparaciones descartadas por anchos de pestaña distintos y pruebas pendientes por bloqueo de la herramienta de navegador.
