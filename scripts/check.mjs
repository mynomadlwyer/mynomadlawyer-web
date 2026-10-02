import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {build} from './build.mjs';

const root=path.resolve(import.meta.dirname,'../dist');
const routes=await build();
const failures=[];let references=0;
async function exists(file){try{return await fs.stat(file);}catch{return null;}}
async function reference(value,from,{asset=false}={}){
 value=value.replaceAll('&amp;','&').trim();
 if(!value||value.startsWith('#')||value.startsWith('data:'))return;
 if(/^(?:https?:)?\/\//i.test(value)){if(asset)failures.push(`Remote asset in ${from}: ${value}`);return;}
 if(/^(mailto:|tel:)/i.test(value))return;
 if(/^[a-z]+:/i.test(value)){failures.push(`Unexpected protocol in ${from}: ${value}`);return;}
 const url=new URL(value,'http://local'+from);
 let target=path.join(root,decodeURIComponent(url.pathname));
 let stat=await exists(target);
 if(stat?.isDirectory()){target=path.join(target,'index.html');stat=await exists(target);}
 references++;
 if(!stat?.isFile())failures.push(`Missing target in ${from}: ${value}`);
}
async function walk(dir){const entries=await fs.readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(root);
assert.equal(routes.length,10,'Expected all ten audited routes');
for(const file of files){
 const rel='/'+path.relative(root,file).replaceAll('\\','/');
 const ext=path.extname(file);
 if(!['.html','.css','.js'].includes(ext))continue;
 const text=await fs.readFile(file,'utf8');
 if(text.includes('mynomad'+'layer.com'))failures.push(`Incorrect reference domain in ${rel}`);
 if(ext==='.html'){
  if(/<iframe\b|<script\b[^>]*src=["']https?:/i.test(text))failures.push(`External runtime in ${rel}`);
  if(/\son\w+\s*=|<!-- component:/i.test(text))failures.push(`Unprocessed template or inline handler in ${rel}`);
  if(/name=["'][^"']*(?:nonce|token)/i.test(text))failures.push(`Form token in ${rel}`);
  if(!text.includes("connect-src 'none'")||!text.includes("form-action 'none'"))failures.push(`Missing local-only policy in ${rel}`);
  for(const tag of text.matchAll(/<(?:a|img|script|link|source|video|form)\b[^>]*>/gi)){
   const html=tag[0],isLink=/^<a\b|^<form\b/i.test(html);
   for(const attr of html.matchAll(/\b(?:src|href|action|poster|data-gt-lazy-src)=["']([^"']*)["']/gi))await reference(attr[1],rel,{asset:!isLink});
   for(const attr of html.matchAll(/\bsrcset=["']([^"']*)["']/gi))for(const item of attr[1].split(','))await reference(item.trim().split(/\s+/)[0],rel,{asset:true});
  }
  for(const url of text.matchAll(/url\(\s*["']?([^\s)'"<>]+)["']?\s*\)/gi))await reference(url[1],rel,{asset:true});
 }
 if(ext==='.css')for(const url of text.matchAll(/url\(\s*["']?([^\s)'"<>]+)["']?\s*\)/gi))await reference(url[1],rel,{asset:true});
 if(ext==='.js'){
  const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(result.status!==0)failures.push(`JavaScript syntax: ${rel}: ${result.stderr}`);
  for(const entry of text.matchAll(/from\s+['"]([^'"]+)['"]/g))await reference(entry[1],rel,{asset:true});
 }
}
assert.equal(failures.length,0,failures.join('\n'));
console.log(`PASS: ${routes.length} routes, ${files.length} files, ${references} local references; JavaScript syntax and isolation checks passed.`);
console.log('This static check does not replace visual or browser interaction tests.');
