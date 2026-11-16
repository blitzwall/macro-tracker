const V='macro-v2',CORE=['./','index.html','manifest.json','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{await c.addAll(CORE);await c.add('vendor/zxing.min.js').catch(()=>{})}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);
 if(u.origin!==location.origin){ // only the barcode library is cached; food databases and AI calls always go to the network
  if(u.hostname==='cdn.jsdelivr.net'&&u.pathname.includes('@zxing/library'))e.respondWith(caches.match(q).then(h=>h||fetch(q).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(q,c));return r})));return}
 if(q.mode==='navigate'){e.respondWith(fetch(q).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put('index.html',c))}return r}).catch(()=>caches.match('index.html')));return}
 e.respondWith(caches.match(q).then(h=>{const n=fetch(q).then(r=>{if(r.ok){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}return r}).catch(()=>h);return h||n}))});
