import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {build} from './build.mjs';
await build();
const root=path.resolve(import.meta.dirname,'../dist');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.xml':'application/xml; charset=utf-8','.txt':'text/plain'};
const port=Number(process.env.PORT||5173);
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);return res.end('Local preview: submissions are disabled.');}
 try{
  const url=new URL(req.url,'http://localhost');const rel=decodeURIComponent(url.pathname);let file=path.resolve(root,'.'+rel);
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);return res.end('Forbidden');}
  const stat=await fs.stat(file);if(stat.isDirectory())file=path.join(file,'index.html');
  const bytes=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('Page not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
