# Guía de Despliegue - My Nomad Lawyer

## Requisitos previos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Cloudflare](https://cloudflare.com) (plan gratuito suficiente)
- Dominio `mynomadlawyer.com` registrado y con DNS gestionado en Cloudflare

## Paso 1: Crear repositorio en GitHub

```bash
# Desde el directorio del proyecto
git init
git add .
git commit -m "Initial commit: static clone of mynomadlawyer.com"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mynomadlawyer-web.git
git push -u origin main
```

O crear el repositorio manualmente en https://github.com/new

## Paso 2: Configurar Cloudflare Pages

1. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. En el menú lateral: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Seleccionar el repositorio `mynomadlawyer-web`
4. Configuración de build:
   - **Build command**: `node scripts/build.mjs`
   - **Build output directory**: `dist`
   - **Node.js version**: 22 (o dejar que Cloudflare lo detecte automáticamente)
5. Guardar y desplegar

## Paso 3: Configurar dominio personalizado

1. En Cloudflare Pages, ir a **Custom domains**
2. Click en **Set up a custom domain**
3. Ingresar `mynomadlawyer.com`
4. Cloudflare configurará automáticamente los registros DNS (si el dominio está en Cloudflare)
5. Esperar a que se emita el certificado SSL (puede tardar hasta 24 horas)

## Paso 4: Verificar despliegue

- Visitar https://mynomadlawyer.com
- Verificar que todas las páginas cargan correctamente
- Verificar que las imágenes y estilos se muestran bien
- Probar el formulario de contacto (debe mostrar mensaje de éxito)

## Paso 5: Google Search Console

1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Añadir propiedad `https://mynomadlawyer.com`
3. Verificar propiedad (etiqueta meta en el HTML o DNS)
4. Enviar sitemap: `https://mynomadlawyer.com/page-sitemap.xml`
5. Solicitar indexación de las páginas principales

## Estructura del proyecto

```
mynomadlawyer-web/
├── src/                    # Código fuente
│   ├── components/         # Componentes HTML reutilizables
│   ├── pages/              # Definiciones de páginas (JSON)
│   └── sections/           # Secciones HTML de cada página
├── public/                 # Recursos estáticos
│   ├── images/             # 80 imágenes
│   ├── fonts/              # Fuentes
│   └── icons/              # Iconos
├── scripts/                # Scripts Node.js
│   ├── build.mjs           # Script de build
│   ├── serve.mjs           # Servidor local
│   └── check.mjs           # Verificación
├── dist/                   # Build generado (output para despliegue)
├── package.json
└── wrangler.toml           # Configuración Cloudflare Pages
```

## Modo Mantenimiento (proyecto parado)

El sitio se puede poner en "ventana de mantenimiento" con una sola bandera en `src/config.json`:

```json
{ "maintenance": true }
```

Con `maintenance: true` el build (`node scripts/build.mjs`) genera:

- La **ventana de mantenimiento** (`src/components/Maintenance.html`) en **todas** las rutas
  (`/`, `/es/`, `/about-us/`, …) más un `404.html` para rutas desconocidas.
- `robots.txt` con `Disallow: /` (bloquea a todos los rastreadores).
- Cabecera `X-Robots-Tag: noindex, nofollow, noarchive` en todas las respuestas
  (archivo `dist/_headers`).
- Meta `<meta name="robots" content="noindex, nofollow, noarchive, noimageindex, nosnippet">`
  en cada página.
- `page-sitemap.xml` **vacío** (sin URLs) para que no se pueda indexar nada.

Para volver a publicar la web: poner `"maintenance": false`, reconstruir y desplegar.

```bash
node scripts/build.mjs
wrangler pages deploy dist --project-name=mynomadlawyer --branch=master --commit-dirty=true
```

### URLs de despliegues antiguos

Cada despliegue de Cloudflare Pages conserva su propia URL (`https://<id>.mynomadlawyer.pages.dev`).
Aunque se borre el despliegue, el edge de Cloudflare puede seguir sirviendo su contenido antiguo
durante un tiempo (caché interna). Para neutralizarlas, se creó una *preview deployment* con el
**mismo nombre que el hostname antiguo** como nombre de rama; Cloudflare asigna entonces ese
hostname como alias de rama y pasa a servir el contenido nuevo (mantenimiento):

```bash
# Una vez por cada hostname antiguo que aún sirva contenido
wrangler pages deploy dist --project-name=mynomadlawyer --branch=<id-antiguo> --commit-dirty=true
```

Hostnames ya neutralizados: `425190b3`, `db9f745a`, `f5de5101`, `c8e8e0d6`.
Estos despliegues de rama deben mantenerse mientras dure el mantenimiento; si se borran, las URLs
antiguas volverían a 404 (o al contenido cacheado).

## Comandos útiles

```bash
# Build local
npm run build

# Servidor local
npm run dev

# Verificación
npm run check
```

## Notas importantes

- El sitio es 100% estático (sin backend)
- El formulario de contacto es estático (muestra mensaje de éxito sin enviar datos)
- El selector de idiomas (EN/ES) apunta a `/` y `/es/` (páginas estáticas en español)
- Google Analytics está configurado con ID G-H58VFG64ML
- El sitemap está en `/page-sitemap.xml`
- Con `maintenance: true` el sitio queda bloqueado para indexadores (ver sección anterior)
