const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.webmanifest':'application/manifest+json','.png':'image/png'};
http.createServer((req,res)=>{
  const file = {'/':'index.html','/style.css':'style.css','/app.js':'app.js','/model.js':'model.js','/install.js':'install.js','/sw.js':'sw.js','/manifest.webmanifest':'manifest.webmanifest','/icons/icon-192.png':'icons/icon-192.png','/icons/icon-512.png':'icons/icon-512.png','/icons/icon-maskable-512.png':'icons/icon-maskable-512.png'}[req.url.split('?')[0]];
  if(!file){res.writeHead(404);return res.end('Not found');}
  fs.readFile(path.join(__dirname,file),(err,data)=>{res.writeHead(err?500:200,{'Content-Type':types[path.extname(file)],'X-Content-Type-Options':'nosniff'});res.end(err?'Unable to load file':data);});
}).listen(process.env.PORT || 3000,'0.0.0.0');
