const CACHE_NAME = "dusab-cache-dynamic";
const urlsToCache = [
  "/dusab/",
  "/dusab/index.html",
  "/dusab/logo.png"
];

// ইনস্টল ইভেন্ট - বেসিক ফাইল ক্যাশ করা
self.addEventListener("install", event => {
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কার সাথে সাথে একটিভ হবে
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// এক্টিভেট ইভেন্ট - পুরনো ক্যাশ ক্লিন করা
self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

// ফেচ ইভেন্ট - Network-First Strategy
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // ইন্টারনেট থাকলে নতুন ডেটা আনবে এবং ক্যাশ আপডেট করবে
        return caches.open(CACHE_NAME).then(cache => {
          // POST রিকোয়েস্ট ক্যাশ করা যায় না, তাই সেটি বাদ রাখা হয়েছে
          if (event.request.method === "GET") {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // ইন্টারনেট না থাকলে বা ফেইল করলে ক্যাশ থেকে দেখাবে
        return caches.match(event.request);
      })
  );
});
