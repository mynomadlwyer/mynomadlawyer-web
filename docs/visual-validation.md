# Validación de la réplica local

Actualizado: 22-09-2026. Estado: **validación parcial; fase 1 pendiente de completar en navegador**.

## Confirmado

- Auditoría de las diez páginas públicas del original antes de generar componentes; portada inspeccionada a 1440, 1280, 1024, 768, 430 y 390 px.
- Build estático de diez rutas. Comprobación de 254 archivos y 1.003 referencias locales sin destinos faltantes; módulos JavaScript con sintaxis válida.
- Las diez rutas locales responden HTTP 200. Una ruta inexistente devuelve 404. Un POST al formulario local devuelve 405, sin procesamiento ni almacenamiento. Resultados en `validation/http-checks.json`.
- Sin scripts remotos, iframes, tokens de formulario ni recursos de carga automática externos en la salida. CSP bloquea conexiones y envíos. Los enlaces externos explícitos se conservan.
- Capturas y medidas de escritorio de Home, About us y Services comparadas con el original a 1440 px el 17-09-2026.

| Página | Altura original | Altura local | Diferencias geométricas superiores a 1 px en elementos medidos | Imágenes rotas |
| --- | ---: | ---: | ---: | ---: |
| Home | 6156 px | 6156 px | 0 | 0 |
| About us | 2322 px | 2322 px | 0 | 0 |
| Services | 2165 px | 2165 px | 0 | 0 |

Las medidas abarcan header, headings, secciones y footer; no son una prueba de igualdad píxel a píxel. La inspección visual de las capturas de Home confirma coincidencia estrecha del header, hero, saltos de línea y logos. El distintivo reCAPTCHA local es una representación estática y presenta diferencias frente al original.

Evidencia: `validation/home-1440-original.png`, `validation/home-1440-local.png`, y los pares de About us y Services. Las dimensiones de imagen difieren del viewport nominal por el tratamiento de escala y scrollbar de la herramienta.

## Comparaciones descartadas

En la primera ronda con dos pestañas, el ajuste de viewport afectó a la pestaña local mientras la original permaneció a 1440 px. Por tanto, los registros de 1280, 1024, 768, 430 y 390 px en `validation/measurements.json` **no son comparaciones válidas**. Se conservan identificados como `invalid-mismatched-viewports` para trazabilidad. Los tres registros de 1440 px se identifican como `valid-desktop-comparison`.

Los archivos `validation/*-768-original.png` y `validation/*-390-original.png` también corresponden al escritorio y no deben interpretarse como capturas responsive válidas. Las capturas originales independientes de `inspection/` sí se tomaron durante la auditoría responsive, pero el sistema de capturas largas introdujo escalado y artefactos de unión. Sus recortes `validation/*-audit-crop.png` solo sirven para examinar contenido, no para medir diferencias contra una captura de viewport local.

## Pendiente para cerrar la fase 1

1. Repetir original y réplica en una sola pestaña controlada, comprobar `innerWidth` y capturar ambos al mismo viewport: 1440, 768 y 390 px en cada página. Completar los anchos intermedios de la portada.
2. Comparar también secciones tras scroll y footer; corregir las diferencias que se observen.
3. Probar en navegador local apertura/cierre del menú móvil y navegación, selector de idioma, consentimiento y persistencia, acordeones del modal, controles y expansión de reseñas, y validación del formulario con datos ficticios.
4. Revisar focus, teclado, animaciones, overflow y errores de consola. La revisión estática de código no sustituye estas pruebas.

El usuario autorizó explícitamente la reapertura después de verificar la ubicación. El 22-09-2026 se completaron copia, build, comprobaciones y reinicio desde la nueva carpeta (ver location-verification.md). La apertura autorizada devuelve «Browser is not available: iab» y el inventario de navegadores está vacío. La solicitud de apertura mediante el panel de la aplicación quedó en cola; un segundo inventario tampoco encontró navegadores. Ya no falta autorización: falta una conexión de navegador disponible. No se han podido completar nuevas pruebas visuales ni de interacción en esta sesión.

## Límites intencionados

Traducción externa desconectada, reseñas sin sincronización, reCAPTCHA visual y formulario sin envío. Las preferencias de cookies son locales y no activan integraciones. No se ha realizado ningún despliegue ni configurado infraestructura externa.

