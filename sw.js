const CACHE="orar-v4";
const APP_SHELL=["./","index.html","manifest.webmanifest","icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("orar-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.mode==="navigate"){
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(response=>{
   const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy));return response;
  }).catch(()=>caches.match(e.request).then(response=>response||caches.match("./"))));
 }else{
  e.respondWith(caches.match(e.request).then(response=>response||fetch(e.request)));
 }
});