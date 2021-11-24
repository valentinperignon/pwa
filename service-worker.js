const cacheName = 'ginkobus-v1';
const appFiles = [
	'index.html',
	'app.js',
	'style.css',
	'icons/icon-512.png',
	'icons/icon-256.png',
	'icons/icon-64.png'
];

self.addEventListener('install', (e) => {
	console.info('[Service Worker] Install');

	e.waitUntil((async () => {
		const cache = await caches.open(cacheName);
		console.info('[Service Worker] Caching all: app shell content');
		await cache.addAll(appFiles);
	})());
});

self.addEventListener('fetch', (e) => {
	e.respondWith((async () => {
		const resourceFromCache = await caches.match(e.request);
		console.info(`[Service Worker] Fetching resource: ${e.request.url}`);
		if (resourceFromCache) {
			return resourceFromCache;
		}

		const response = await fetch(e.request);
		const cache = caches.open(cacheName);
		console.info(`[Service Worker] Caching new resource: ${e.request.url}`);
		cache.put(e.request, response.clone());
		return response;
	})());
});