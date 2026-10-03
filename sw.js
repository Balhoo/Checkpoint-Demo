const PREFIX = 'checkpoint:' + self.registration.scope + '::';
const CACHE = PREFIX + "3c7753b3ea6e8fd7";
const ASSETS = ["./assets/index-C9ITqw5I.js","./assets/index-RcSqZodK.css","./icon.svg","./index.html","./manifest.webmanifest"].map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    if(event.request.mode === 'navigate') return await cache.match(new URL('./index.html', self.registration.scope).href, {ignoreVary:true}) || fetch(event.request);
    // The precache contains only static public files. Ignore server Vary: Origin
    // differences between installation fetches and module-script requests.
    return await cache.match(event.request, {ignoreVary:true}) || fetch(event.request);
  }));
});