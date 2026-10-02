// Read-only collection of the public frontend for the site audit.
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('docs/inspection');
const origin = 'https://www.mynomadlawyer.com';
const home = await fs.readFile(path.join(root, 'home.html'), 'utf8');
const sitemap = await fs.readFile(path.join(root, 'page-sitemap.xml'), 'utf8');
const urls = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>x[1]));
for (const m of home.matchAll(/href=["'](https:\/\/(?:www\.)?mynomadlawyer\.com\/[^"'#?]*)["']/g)) {
  if (!/\.(css|js|png|jpg|xml|ico|svg)$/.test(m[1]) && !/wp-|feed/.test(m[1])) urls.add(m[1]);
}
const index=[];
for (const url of urls) {
  const slug=new URL(url).pathname.split('/').filter(Boolean).join('--') || 'home';
  const response=await fetch(url);
  const html=await response.text();
  await fs.writeFile(path.join(root,slug+'.html'),html);
  index.push({url,slug,status:response.status,title:html.match(/<title>(.*?)<\/title>/s)?.[1],headings:[...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g)].map(x=>({level:x[1],text:x[2].replace(/<[^>]+>/g,'').trim()}))});
}
await fs.writeFile(path.join(root,'routes.json'),JSON.stringify(index,null,2));
console.log(JSON.stringify(index,null,2));
