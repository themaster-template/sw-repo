const CACHE_NAME = 'my-blog-v2'; // غيّر الإصدار عند إجراء تحديثات كبيرة للقالب

const ASSETS = [
  '/', 
  '/favicon.ico'
];

// 1. التثبيت
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

// 2. تفعيل وتنظيف الكاش القديم
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))
  );
});

// 3. استراتيجية الاستدراك مع استثناء أدسنس
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // استثناء إعلانات أدسنس وخدمات جوجل (لا يتم تخزينها في الكاش أبداً)
  if (
    url.includes('pagead2.googlesyndication.com') ||
    url.includes('googlesyndication.com') ||
    url.includes('google-analytics.com') ||
    url.includes('doubleclick.net')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // لباقي ملفات موقعك: تقديمها من الكاش إذا وجدت، وإلا جلبها من الشبكة
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
