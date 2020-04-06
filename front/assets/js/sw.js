const cacheName = 'Aureus Sales';
const staticAssests = ['./','./index.html']
self.addEventListener("install", function(event) {
	const cache = await   caches.open(cacheName);
	await cache.addAll(staticAssests);
 return self.skipWaiting();
});

self.addEventListener('activate',function(event){
	self.client.claim();
})