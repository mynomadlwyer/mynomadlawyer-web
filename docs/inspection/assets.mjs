import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {load} from './tooling/node_modules/cheerio/dist/esm/index.js';
const root=path.resolve('.');
const pages=JSON.parse(await fs.readFile('docs/inspection/routes.json','utf8'));
const assets=new Map(); const audit=[];
const decode=s=>s.replaceAll('&amp;','&');
function enqueue(value,base,kind){
 if(!value||value.startsWith('data:')||value.startsWith('#'))return;
 let u;try{u=new URL(decode(value),base);}catch{return;}
 if(!['https:','http:'].includes(u.protocol))return;
 if(u.hostname==='mynomadlawyer.7por7.com')u.hostname='www.mynomadlawyer.com';
 u.hash='';const url=u.href;
 if(assets.has(url))return;
 const ext=path.extname(u.pathname).toLowerCase();
 const type=kind||(['.woff','.woff2','.ttf','.eot'].includes(ext)?'font':ext==='.css'?'css':'image');
 const folder=type==='css'?'styles':type==='font'?'fonts':ext==='.svg'?'icons':'images';
 const name=path.basename(u.pathname).replace(/[^a-zA-Z0-9._-]/g,'-')||'resource';
 const filename=name+(path.extname(name)?'':type==='css'?'.css':'.bin');
 const local='/'+folder+'/'+crypto.createHash('sha256').update(url).digest('hex').slice(0,10)+'-'+filename;
 assets.set(url,{url,local,type,status:'pending'});
}
function cssRefs(css,base){for(const m of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) enqueue(m[1],base,/fonts.googleapis.com|\.css(?:\?|$)/.test(m[1])?'css':undefined);for(const m of css.matchAll(/@import\s+["']([^"']+)["']/g))enqueue(m[1],base,'css');}
for(const page of pages){
 const html=await fs.readFile('docs/inspection/'+page.slug+'.html','utf8');const $=load(html);
 $('link[rel="stylesheet"]').each((i,e)=>enqueue($(e).attr('href'),page.url,'css'));
 $('img,source,video,link[rel="icon"],link[rel="apple-touch-icon"]').each((i,e)=>{
  for(const a of ['src','poster','data-src','href'])enqueue($(e).attr(a),page.url);
  const srcset=$(e).attr('srcset');if(srcset)for(const s of srcset.split(','))enqueue(s.trim().split(/\s+/)[0],page.url);
 });
 $('style').each((i,e)=>cssRefs($(e).text(),page.url));$('[style]').each((i,e)=>cssRefs($(e).attr('style'),page.url));
 audit.push({slug:page.slug,url:page.url,title:$('title').text(),bodyClass:$('body').attr('class'),sections:$('.elementor-top-section').map((i,e)=>({id:$(e).attr('data-id'),headings:$(e).find('h1,h2,h3,h4').map((i,h)=>$(h).text().trim()).get(),widgets:$(e).find('[data-widget_type]').map((i,w)=>$(w).attr('data-widget_type')).get(),text:$(e).text().replace(/\s+/g,' ').trim()})).get(),links:$('a[href]').map((i,e)=>({text:$(e).text().trim(),href:$(e).attr('href')})).get(),scripts:$('script[src]').map((i,e)=>$(e).attr('src')).get(),animations:$('[data-settings]').map((i,e)=>({id:$(e).attr('data-id'),settings:$(e).attr('data-settings')})).get()});
}
await fs.writeFile('docs/inspection/architecture.json',JSON.stringify(audit,null,2));
const dynamic=JSON.parse(await fs.readFile('docs/inspection/dynamic.json','utf8'));
for(const s of dynamic.styles)cssRefs(s.css,'https://www.mynomadlawyer.com/');
const dynamicHtml=load([dynamic.cookie,dynamic.notice,dynamic.revisit,dynamic.language].join(''));
dynamicHtml('img').each((i,e)=>{for(const attr of ['src','data-gt-lazy-src'])enqueue(dynamicHtml(e).attr(attr),'https://www.mynomadlawyer.com/');});
const previous=JSON.parse(await fs.readFile('docs/inspection/assets.json','utf8'));
for(const old of previous)if(old.status==='downloaded'&&old.type!=='css'&&assets.has(old.url))assets.set(old.url,old);
async function download(item){
 try{
 const res=await fetch(item.url,{headers:{'User-Agent':'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36'},signal:AbortSignal.timeout(30000)});
 if(!res.ok)throw new Error('HTTP '+res.status);
 const bytes=Buffer.from(await res.arrayBuffer());item.bytes=bytes.length;item.contentType=res.headers.get('content-type');
 const filename=path.join(root,'public',item.local);await fs.mkdir(path.dirname(filename),{recursive:true});await fs.writeFile(filename,bytes);
 item.status='downloaded';if(item.type==='css'){item.raw=bytes.toString('utf8');cssRefs(item.raw,item.url);}
 }catch(e){item.status='failed';item.error=e.message;}
}
while([...assets.values()].some(x=>x.status==='pending')){
 const batch=[...assets.values()].filter(x=>x.status==='pending').slice(0,8);await Promise.all(batch.map(download));console.log('Assets: '+[...assets.values()].filter(x=>x.status!=='pending').length+'/'+assets.size);
}
for(const item of assets.values())if(item.raw){
 let css=item.raw;for(const [url,a]of assets)if(a.status==='downloaded')css=css.split(url).join(a.local);
 css=css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g,(match,q,url)=>{try{const a=assets.get(new URL(url,item.url).href);return a?.status==='downloaded'?`url("${a.local}")`:match;}catch{return match;}});
 await fs.writeFile(path.join(root,'public',item.local),css);delete item.raw;
}
await fs.writeFile('docs/inspection/assets.json',JSON.stringify([...assets.values()],null,2));
console.log(JSON.stringify({pages:audit.length,assets:assets.size,failed:[...assets.values()].filter(x=>x.status==='failed')},null,2));
