import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const SITE_URL='https://mynomadlawyer.com';
const SITE_NAME='My Nomad Lawyer';
const SITE_DESC='Professional legal services for expats, nomads & investors in Spain. EU-certified lawyer. Personalized support in English, Spanish & Italian.';
const GA_ID='G-H58VFG64ML';
const LOGO_URL=SITE_URL+'/images/a4edee01c1-cropped-logotipo-my-nomad-lawyer.jpg';
const OG_IMAGE=SITE_URL+'/images/b4ebcbf6cc-logotipo-uni-pablo-olavide-ok.png';

async function loadConfig(){
  try{return JSON.parse(await fs.readFile(path.join(root,'src/config.json'),'utf8'));}
  catch{return {};}
}

function generateJSONLD(page){
  const base={
    "@context":"https://schema.org",
    "@graph":[
      {
        "@type":"WebPage",
        "@id":SITE_URL+page.path,
        "url":SITE_URL+page.path,
        "name":page.title,
        "isPartOf":{"@id":SITE_URL+"/#website"},
        "about":{"@id":SITE_URL+"/#organization"},
        "description":page.description||SITE_DESC,
        "inLanguage":"en-US",
        "potentialAction":[{"@type":"ReadAction","target":[SITE_URL+page.path]}]
      },
      {
        "@type":"WebSite",
        "@id":SITE_URL+"/#website",
        "url":SITE_URL+"/",
        "name":SITE_NAME,
        "publisher":{"@id":SITE_URL+"/#organization"},
        "inLanguage":"en-US"
      },
      {
        "@type":"Organization",
        "@id":SITE_URL+"/#organization",
        "name":SITE_NAME,
        "url":SITE_URL+"/",
        "logo":{
          "@type":"ImageObject",
          "@id":SITE_URL+"/#logo",
          "url":LOGO_URL,
          "contentUrl":LOGO_URL,
          "width":999,
          "height":999,
          "caption":SITE_NAME
        }
      }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(base)}</script>`;
}

function generateMetaTags(page){
  const url=SITE_URL+page.path;
  const desc=page.description||SITE_DESC;
  return `
<!-- SEO Meta Tags -->
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${url}">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="website">
<meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="532">
<meta property="og:image:height" content="201">
<meta property="og:image:type" content="image/png">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" hreflang="en" href="${url}">
<link rel="alternate" hreflang="es" href="${url}?lang=es">
<link rel="alternate" hreflang="it" href="${url}?lang=it">
<link rel="alternate" hreflang="x-default" href="${url}">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`;
}

function maintenancePage(body){
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive, noimageindex, nosnippet">
<meta name="googlebot" content="noindex, nofollow, noarchive">
<meta name="bingbot" content="noindex, nofollow, noarchive">
<meta name="referrer" content="no-referrer">
<title>Mantenimiento | My Nomad Lawyer</title>
<meta name="description" content="Sitio web temporalmente en mantenimiento. My Nomad Lawyer.">
<meta http-equiv="X-Robots-Tag" content="noindex, nofollow">
<link rel="icon" href="/images/84e5eefaf2-cropped-favicon-my-nomad-lawyer-32x32.jpg">
<link rel="apple-touch-icon" href="/images/91088eb8b1-cropped-favicon-my-nomad-lawyer-180x180.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Helvetica+Neue:Arial,sans-serif&display=swap">
<link rel="stylesheet" href="/styles/maintenance.css">
</head>
<body class="mnt-body">
${body}
</body>
</html>`;
}

function renderTemplate(str,vars){
  return str.replace(/\{\{(\w+)\}\}/g,(m,key)=>key in vars?vars[key]:m);
}

export async function build(){
  const config=await loadConfig();
  const maintenance=Boolean(config.maintenance);
  const out=path.join(root,'dist');await fs.mkdir(out,{recursive:true});await fs.cp(path.join(root,'public'),out,{recursive:true});
  const components={};for(const name of await fs.readdir(path.join(root,'src/components')))if(name.endsWith('.html'))components[name.slice(0,-5)]=await fs.readFile(path.join(root,'src/components',name),'utf8');
  const expand=html=>html.replace(/<!-- component:(\w+) -->/g,(_,name)=>{if(!(name in components))throw Error('Unknown component '+name);return components[name];});
  const pages=[];
  for(const name of await fs.readdir(path.join(root,'src/pages')))
    pages.push(JSON.parse(await fs.readFile(path.join(root,'src/pages',name),'utf8')));
  const esByEnPath=new Map();
  for(const page of pages)if(page.slug.endsWith('-es'))esByEnPath.set(page.path.replace('/es/','/'),page.path);
  const routes=[];
  for(const page of pages){
    routes.push(page.path);
    const dir=path.join(out,page.path);await fs.mkdir(dir,{recursive:true});
    if(maintenance){
      await fs.writeFile(path.join(dir,'index.html'),maintenancePage(components.Maintenance));
      continue;
    }
    const isSpanish=page.slug.endsWith('-es');
    const lang=isSpanish?'es-ES':'en-US';
    const ogLocale=isSpanish?'es_ES':'en_US';
    const enPath=isSpanish?page.path.replace('/es/','/'):page.path;
    const esPath=esByEnPath.get(enPath)||'/es/';
    const enUrl=SITE_URL+enPath;
    const esUrl=SITE_URL+esPath;
    const header=renderTemplate(components.Header,{
      ALT_EN:enPath,
      ALT_ES:esPath,
      LANG_CODE:isSpanish?'ES':'EN',
      LANG_FLAG:isSpanish?'/icons/es.svg':'/icons/en.svg',
      LANG_LABEL:isSpanish?'Español':'English'
    });
    let body='';for(const section of page.sections)body+=expand(await fs.readFile(path.join(root,'src/sections',section),'utf8'));
    const metaTags=`
<!-- SEO Meta Tags -->
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="canonical" href="${SITE_URL+page.path}">
<meta property="og:locale" content="${ogLocale}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escape(page.title)}">
<meta property="og:description" content="${escape(page.description||SITE_DESC)}">
<meta property="og:url" content="${SITE_URL+page.path}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:image" content="${OG_IMAGE}">
<meta property="og:image:width" content="532">
<meta property="og:image:height" content="201">
<meta property="og:image:type" content="image/png">
<meta name="twitter:card" content="summary_large_image">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="es" href="${esUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}');
</script>`;
    const jsonld=`<script type="application/ld+json">${JSON.stringify({
      "@context":"https://schema.org",
      "@graph":[
        {
          "@type":"WebPage",
          "@id":SITE_URL+page.path,
          "url":SITE_URL+page.path,
          "name":page.title,
          "isPartOf":{"@id":SITE_URL+"/#website"},
          "about":{"@id":SITE_URL+"/#organization"},
          "description":page.description||SITE_DESC,
          "inLanguage":lang,
          "potentialAction":[{"@type":"ReadAction","target":[SITE_URL+page.path]}]
        },
        {
          "@type":"WebSite",
          "@id":SITE_URL+"/#website",
          "url":SITE_URL+"/",
          "name":SITE_NAME,
          "publisher":{"@id":SITE_URL+"/#organization"},
          "inLanguage":"en-US"
        },
        {
          "@type":"Organization",
          "@id":SITE_URL+"/#organization",
          "name":SITE_NAME,
          "url":SITE_URL+"/",
          "logo":{
            "@type":"ImageObject",
            "@id":SITE_URL+"/#logo",
            "url":LOGO_URL,
            "contentUrl":LOGO_URL,
            "width":999,
            "height":999,
            "caption":SITE_NAME
          }
        }
      ]
    })}</script>`;
    const html=`<!doctype html><html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${metaTags}<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description||SITE_DESC)}">${jsonld}<link rel="icon" href="/images/84e5eefaf2-cropped-favicon-my-nomad-lawyer-32x32.jpg"><link rel="apple-touch-icon" href="/images/91088eb8b1-cropped-favicon-my-nomad-lawyer-180x180.jpg">${page.styles.map(s=>`<link rel="stylesheet" href="${s}">`).join('')}<link rel="stylesheet" href="/styles/local.css"><script type="module" src="/scripts/app.js"></script></head><body class="${escape(page.bodyClass)}"><a class="screen-reader-text skip-link" href="#content">Skip to content</a>${header}<div id="page" class="site grid-container container hfeed"><main id="content" class="site-content" tabindex="-1"><div class="${escape(page.wrapper)}">${body}</div></main></div>${components.Footer}${components.FloatingContact}${components.CookieConsent}${page.hasForm?components.RecaptchaBadge||'':''}</body></html>`;
    await fs.writeFile(path.join(dir,'index.html'),html);
  }
  const sitemapPath=path.join(out,'page-sitemap.xml');
  if(maintenance){
    await fs.writeFile(sitemapPath,'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    await fs.writeFile(path.join(out,'404.html'),maintenancePage(components.Maintenance));
    await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
    await fs.writeFile(path.join(out,'_headers'),'/*\n  X-Robots-Tag: noindex, nofollow, noarchive\n');
  }else{
    await fs.writeFile(sitemapPath,'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>'+SITE_URL+r+'</loc></url>').join('')+'</urlset>');
    await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+SITE_URL+'/page-sitemap.xml\n');
    await fs.rm(path.join(out,'_headers'),{force:true});
    await fs.rm(path.join(out,'404.html'),{force:true});
  }
  return {routes,maintenance};
}
if(process.argv[1]===path.join(import.meta.dirname,'build.mjs')){
  const result=await build();
  console.log(result.maintenance
    ? `Built ${result.routes.length} pages in maintenance mode (indexing blocked) in dist/.`
    : `Built ${result.routes.length} static pages in dist/.`);
}
