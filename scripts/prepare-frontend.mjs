// One-time, reproducible conversion of the audited PUBLIC frontend into local templates.
// No WordPress executable scripts, form tokens or third-party runtime are retained.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {load} from '../docs/inspection/tooling/node_modules/cheerio/dist/esm/index.js';
const pages=JSON.parse(await fs.readFile('docs/inspection/routes.json','utf8'));
const assets=JSON.parse(await fs.readFile('docs/inspection/assets.json','utf8'));
const dynamic=JSON.parse(await fs.readFile('docs/inspection/dynamic.json','utf8'));
for(const dir of ['src/components','src/pages','src/sections','public/scripts'])await fs.mkdir(dir,{recursive:true});
const map=new Map(assets.map(x=>[x.url,x.local]));
const normalized=new Map(assets.map(x=>[new URL(x.url).pathname+x.url.split('?').slice(1).join('?'),x.local]));
function localize(text){
 for(const [url,local]of [...map].sort((a,b)=>b[0].length-a[0].length))text=text.split(url).join(local).split(url.replaceAll('&','&amp;')).join(local);
 return text.replace(/https?:\/\/(?:www\.)?mynomadlawyer\.com(?=\/)/g,'').replace(/https?:\/\/mynomadlawyer\.7por7\.com(?=\/)/g,'');
}
function clean(html){
 const $=load(localize(html),null,false);
 $('script,noscript,iframe,link').remove();
 $('*').each((i,e)=>{for(const attr of Object.keys(e.attribs||{}))if(/^on/i.test(attr)||/^data-(token|token-time|formid|pid|ti-|trustindex|css-url|no-translation)/.test(attr))$(e).removeAttr(attr);});
 $('[data-settings]').each((i,e)=>{const s=JSON.parse($(e).attr('data-settings')||'{}');if(s._animation)$(e).attr('data-animation',s._animation);$(e).removeAttr('data-settings');});
 $('.elementor-invisible').removeClass('elementor-invisible');
 $('img').each((i,e)=>{
  const img=$(e);for(const attr of ['src','data-gt-lazy-src']){const v=img.attr(attr);if(v?.startsWith('/wp-')){const match=assets.find(a=>new URL(a.url).pathname===v);if(match)img.attr(attr,match.local);}}
  img.removeAttr('data-src');
 });
 return $.html();
}
async function style(css){
 const text=localize(css);const file='/styles/observed-'+crypto.createHash('sha256').update(text).digest('hex').slice(0,10)+'.css';
 await fs.writeFile('public'+file,text);return file;
}
const commonDynamic=[];
for(const s of dynamic.styles)if(s.id==='cky-style'||s.css.startsWith('div.skiptranslate')||s.css.includes('.whatsapp-contact{'))commonDynamic.push(await style(s.css));
let first=true;
for(const page of pages){
 const $=load(await fs.readFile('docs/inspection/'+page.slug+'.html','utf8'));
 const styles=[];
 for(const e of $('style,link[rel="stylesheet"]').toArray()){
  if(e.tagName==='style')styles.push(await style($(e).text()));else {const local=map.get($(e).attr('href'));if(local)styles.push(local);}
 }
 if(first){
  $('.menu-item-gtranslate').replaceWith(clean(dynamic.language));
  const header=load(clean($('#masthead').toString()),null,false);
  header('.current-menu-item,.current_page_item').removeClass('current-menu-item current_page_item');header('[aria-current]').removeAttr('aria-current');
  header('.gt-current-lang').attr({'role':'button','tabindex':'0','aria-expanded':'false','aria-label':'Choose language'});
  await fs.writeFile('src/components/Header.html',header.html());
  await fs.writeFile('src/components/Footer.html',clean($('.site-footer').toString()));
  const form=load(clean($('#wpforms-332').toString()),null,false);
  form('input[type="hidden"],.wpforms-recaptcha-container,[data-field-id="8"],[data-field-id="9"],#wpforms-error-noscript,.wpforms-submit-spinner').remove();
  form('form').attr({'action':'#','data-local-form':'','novalidate':''}).removeAttr('method').removeAttr('enctype');
  form('form').append('<p class="local-form-status" role="status" hidden></p>');
  await fs.writeFile('src/components/ContactForm.html',form.html());
  const cookie=load(clean(dynamic.cookie),null,false);cookie('.cky-modal').removeClass('cky-modal-open').addClass('cky-hide');cookie('[aria-modal]').attr('aria-modal','true');
  const longDescription=await fs.readFile('docs/inspection/cookie-description-full.html','utf8');
  const description=cookie('.cky-preference-content-wrapper');description.html('<div class="cookie-description-short">'+description.html()+'</div><div class="cookie-description-long" hidden>'+clean(longDescription)+'</div>');
  await fs.writeFile('src/components/CookieConsent.html',clean(dynamic.notice+dynamic.revisit)+'<div class="cky-overlay cky-hide"></div>'+cookie.html());
  first=false;
 }
 // Shared form and reviews are editable independently of their page sections.
 $('#wpforms-332').replaceWith('<!-- component:ContactForm -->');
 const reviews=$('div.ti-widget').first();
 if(reviews.length){
  const r=load(clean(reviews.toString()),null,false);r('.ti-widget').removeAttr('style');
  r('.ti-widget-container').attr('class','ti-widget-container ti-col-4');
  r('.ti-review-item').each((i,e)=>{r(e).attr('data-review-index',i);r(e).find('.ti-date').text((i===0?'4':i===1?'5':i===2?'6':i===3?'11':'12')+' months ago');});
  r('.ti-read-more').attr({role:'button',tabindex:'0','aria-expanded':'false'}).text('Read more');
  await fs.writeFile('src/components/Reviews.html',r.html());
  $('.ti-widget').first().replaceWith('<!-- component:Reviews -->');$('.ti-widget').remove();
 }
 const names={home:['Hero','PartnerLogos','Benefits','Firm','Partners','GavelBanner','Services','Testimonials','Consultation'],'about-us':['Hero','Firm','Partners'],'services-my-nomad-lawyer':['Hero','Services'],'why-choose-us':['Hero','Introduction','Advantages','PersonalizedService','PhotoBanner','Expertise','ContactCTA'],contact:['Hero','Consultation'],testimonials:['Hero','EmptySection']};
 const sections=[];
 for(const [i,e]of $('[data-elementor-type="wp-page"] > section').toArray().entries()){
  const name=names[page.slug]?.[i]||'LegalContent';const file=page.slug+'/'+String(i+1).padStart(2,'0')+'-'+name+'.html';
  await fs.mkdir('src/sections/'+page.slug,{recursive:true});await fs.writeFile('src/sections/'+file,clean($(e).toString()));sections.push(file);
 }
 const wrapper=$('[data-elementor-type="wp-page"]').attr('class');
 await fs.writeFile('src/pages/'+page.slug+'.json',JSON.stringify({slug:page.slug,path:new URL(page.url).pathname,title:$('title').text(),description:$('meta[name="description"]').attr('content')||'',bodyClass:$('body').attr('class'),wrapper,styles:[...new Set([...styles,...commonDynamic])],sections,hasForm:page.slug==='home'||page.slug==='contact'},null,2));
}
await fs.writeFile('src/components/FloatingContact.html','<a class="whatsapp-contact" href="https://api.whatsapp.com/send?phone=34637456466" target="_blank" rel="noopener noreferrer" aria-label="Whatsapp"><img src="/icons/whatsapp.png" alt="Whatsapp" width="55" height="55"></a>');
console.log('Prepared 10 pages, shared components and independent section templates.');
