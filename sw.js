const CACHE_NAME = "dusab-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/logo.png"
];

// ইনস্টল ইভেন্ট - ফাইল ক্যাশ করা
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ফেচ ইভেন্ট - অফলাইনে কাজ করার জন্য
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
