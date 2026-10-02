# Ubicación y ejecución verificadas

Fecha: 22-09-2026.

Directorio canónico del proyecto:
`C:\Users\PX\Nextcloud\MEGA\Projects\mynomadlawyer.com\mynomadlawyer-web`

El directorio inicial de la sesión era otra carpeta. Se copió el proyecto completo (sin el historial Git) a la ubicación solicitada y se verificaron por SHA-256 1.612 archivos de código, assets, herramientas y documentación: cero diferencias. La copia anterior se conserva como respaldo; no es necesaria para ejecutar esta versión.

Los comandos se ejecutaron con Set-Location a esta ruta y se comprobó Get-Location. El directorio predeterminado de la tarea de Codex no cambia automáticamente al copiar archivos.

## Archivos físicos

- package.json: raíz del proyecto.
- src/: fuentes.
- src/components/: Header, Footer, ContactForm, CookieConsent, Reviews, FloatingContact y RecaptchaBadge.
- src/pages/: diez configuraciones JSON de páginas/rutas.
- src/sections/: plantillas HTML por página.
- public/styles/: estilos locales.
- public/images/, public/icons/, public/fonts/: assets locales.
- public/scripts/: interacciones JavaScript locales.
- README.md: instrucciones de ejecución.
- docs/: auditoría, estructura, capturas y evidencias.
- dist/: build estático de producción.
- scripts/: build, servidor, comprobación y conversión inicial.

El árbol completo, incluidos assets, evidencias y dependencias auxiliares de auditoría, está en file-tree.txt. No se omiten subcarpetas.

## Ejecución reproducible

No se necesita instalar paquetes para ejecutar o compilar la web. Node.js 20.11 o posterior es el único requisito. Las dependencias auxiliares de auditoría también fueron copiadas, pero no intervienen en npm run dev/build/check.

- npm run build: diez páginas generadas.
- npm run check: 254 archivos, 1.003 referencias locales, sin errores.
- Primer arranque: HTTP 200.
- Cierre del proceso y comprobación de puerto liberado: correcto.
- Segundo arranque desde los mismos archivos: HTTP 200.
- Servidor limitado a 127.0.0.1:5173, sin exposición externa.

Evidencia de ubicación, fecha, PID y reinicio: validation/restart-check.json.

## Rutas

Todas las URLs usan la base http://127.0.0.1:5173. La salida física es relativa a este directorio:

| Página | Ruta URL | HTML generado |
| --- | --- | --- |
| Home | / | dist/index.html |
| About us | /about-us/ | dist/about-us/index.html |
| Services | /services-my-nomad-lawyer/ | dist/services-my-nomad-lawyer/index.html |
| Why choose us | /why-choose-us/ | dist/why-choose-us/index.html |
| Contact | /contact/ | dist/contact/index.html |
| Testimonials | /testimonials/ | dist/testimonials/index.html |
| Privacy policy | /privacy-policy/ | dist/privacy-policy/index.html |
| Cookies policy | /cookies-policy/ | dist/cookies-policy/index.html |
| Accessibility Statement | /accessibility-statement/ | dist/accessibility-statement/index.html |
| Legal notice | /legal-notice/ | dist/legal-notice/index.html |

No se han configurado despliegues, GitHub, Cloudflare, DNS ni CI/CD.
