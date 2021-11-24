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

self.addEventListener('activate', (e) => {
	e.waitUntil(caches.keys().then((keyList) => {
	  return Promise.all(keyList.map((key) => {
		if (key === cacheName) return;
		return caches.delete(key);
	  }));
	}));
  });

self.addEventListener('fetch', (e) => {
	if (e.request.url.includes("ginkobus-pwa")) {
		e.respondWith(networkFirstStrategy(e));
	} else {
		e.respondWith(cacheFirstStrategy(e));
	}
});

async function cacheFirstStrategy(e) {
	const resourceFromCache = await caches.match(e.request);
	console.info(`[Service Worker] Fetching resource from cache: ${e.request.url}`);
	if (resourceFromCache) {
		return resourceFromCache;
	}

	const response = await fetch(e.request);
	const cache = await caches.open(cacheName);
	console.info(`[Service Worker] Caching new resource: ${e.request.url}`);
	cache.put(e.request, response.clone());
	return response;
}

async function networkFirstStrategy(e) {
	const cache = await caches.open(cacheName);
	const resourceFromCache = await cache.match(e.request);
	try {
		const response = await fetch(e.request);
		cache.put(e.request, response.clone());
		return response;
	} catch {
		return resourceFromCache;
	}
}