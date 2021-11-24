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