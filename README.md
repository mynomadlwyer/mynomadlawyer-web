# My Nomad Lawyer — réplica local

Reconstrucción estática de las diez páginas públicas de https://mynomadlawyer.com, inspeccionadas en septiembre de 2026. Recursos visuales y fuentes almacenados localmente. No requiere WordPress ni servicios externos para renderizar.

## Ejecutar

Requisito: Node.js 20.11 o posterior. Desde este directorio:

```powershell
Set-Location -LiteralPath 'C:\Users\PX\Nextcloud\MEGA\Projects\mynomadlawyer.com\mynomadlawyer-web'
npm run dev
```

Abrir http://127.0.0.1:5173. No hace falta `npm install`: la aplicación y su servidor no tienen dependencias de paquetes. El servidor escucha únicamente en la interfaz local. Para detenerlo, Ctrl+C. Tras editar archivos, reiniciar el servidor o ejecutar `npm run build` y recargar la página.

```sh
npm run build  # genera dist/
npm run check  # reconstruye y comprueba rutas, assets, JS y aislamiento
```

## Organización

- `src/pages/`: configuración de cada página, estilos y orden de secciones.
- `src/sections/`: contenido de cada sección, conservando textos y clases observados.
- `src/components/`: header, footer, formulario, reseñas y controles compartidos.
- `public/images/`, `public/icons/`, `public/fonts/`: recursos públicos descargados.
- `public/styles/`: CSS público inspeccionado y adaptado a recursos locales; `local.css` contiene los ajustes de interacción.
- `public/scripts/`: navegación, consentimiento, formulario y carrusel implementados localmente.
- `scripts/`: generador, servidor y comprobación estática.
- `docs/site-audit.md`, `docs/page-structure.md`: auditoría y estructura original.
- `docs/visual-validation.md`: alcance real de la validación, evidencias y pendientes.
- `docs/inspection/`: snapshots públicos, medidas e inventario de procedencia.

`scripts/prepare-frontend.mjs` es una herramienta de conversión inicial, no parte del arranque habitual. Requiere Cheerio en `docs/inspection/tooling` y sobrescribe las plantillas a partir de los snapshots. Las modificaciones habituales se hacen directamente en `src` y `public`.

## Comportamiento local

La navegación enlaza las diez rutas locales. Menú móvil, preferencias de cookies y carrusel tienen lógica propia. El formulario valida los campos sin transmitir ni guardar consultas. El selector de idioma conserva su interfaz y avisa de que la traducción externa está desconectada. Las reseñas son un snapshot, y reCAPTCHA solo se representa visualmente. Las preferencias de cookies se guardan en el navegador sin activar servicios de terceros.

Los enlaces externos explícitos, como WhatsApp, mantienen su destino público. No hay analytics, backend, claves ni llamadas automáticas a APIs externas. La política CSP impide conexiones y envíos de formularios. Los textos legales se conservan como contenido de referencia, sin revisión jurídica.

No se ha configurado GitHub, Cloudflare, DNS, CI/CD ni ningún despliegue. `dist/` es la salida estática; esta fase está preparada únicamente para uso local. Los assets mantienen los derechos de sus respectivos titulares.

