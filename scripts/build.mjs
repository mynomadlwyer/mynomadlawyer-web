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

export async function build(){
  const out=path.join(root,'dist');await fs.mkdir(out,{recursive:true});await fs.cp(path.join(root,'public'),out,{recursive:true});
  const components={};for(const name of await fs.readdir(path.join(root,'src/components')))if(name.endsWith('.html'))components[name.slice(0,-5)]=await fs.readFile(path.join(root,'src/components',name),'utf8');
  const expand=html=>html.replace(/<!-- component:(\w+) -->/g,(_,name)=>{if(!(name in components))throw Error('Unknown component '+name);return components[name];});
  const routes=[];
  for(const name of await fs.readdir(path.join(root,'src/pages'))){
    const page=JSON.parse(await fs.readFile(path.join(root,'src/pages',name),'utf8'));routes.push(page.path);
    let body='';for(const section of page.sections)body+=expand(await fs.readFile(path.join(root,'src/sections',section),'utf8'));
    const html=`<!doctype html><html lang="en-US"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${generateMetaTags(page)}<title>${escape(page.title)}</title><meta name="description" content="${escape(page.description||SITE_DESC)}">${generateJSONLD(page)}<link rel="icon" href="/images/84e5eefaf2-cropped-favicon-my-nomad-lawyer-32x32.jpg"><link rel="apple-touch-icon" href="/images/91088eb8b1-cropped-favicon-my-nomad-lawyer-180x180.jpg">${page.styles.map(s=>`<link rel="stylesheet" href="${s}">`).join('')}<link rel="stylesheet" href="/styles/local.css"><script type="module" src="/scripts/app.js"></script></head><body class="${escape(page.bodyClass)}"><a class="screen-reader-text skip-link" href="#content">Skip to content</a>${components.Header}<div id="page" class="site grid-container container hfeed"><main id="content" class="site-content" tabindex="-1"><div class="${escape(page.wrapper)}">${body}</div></main></div>${components.Footer}${components.FloatingContact}${components.CookieConsent}${page.hasForm?components.RecaptchaBadge||'':''}</body></html>`;
    const dir=path.join(out,page.path);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'index.html'),html);
  }
  await fs.writeFile(path.join(out,'page-sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>'+SITE_URL+r+'</loc></url>').join('')+'</urlset>');
  await fs.writeFile(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+SITE_URL+'/page-sitemap.xml\n');
  return routes;
}
if(process.argv[1]===path.join(import.meta.dirname,'build.mjs'))console.log('Built '+(await build()).length+' static pages in dist/.');
