const APP_SHELL_CACHE = 'tndnb-app-shell-v2';
const IMAGE_CACHE = 'tndnb-question-images-v1';
const BATCH_SIZE = 8;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(['/ontap/', '/ontap/index.html', '/ontap/manifest.json']).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== APP_SHELL_CACHE && key !== IMAGE_CACHE) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      )
    ])
  );
});

function isQuestionImageRequest(url) {
  return (
    url.pathname.includes('/question-images/') ||
    url.pathname.includes('/question_images/')
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Chiến lược Cache-First cho Ảnh câu hỏi (Hiển thị 0ms cả khi mất mạng)
  if (isQuestionImageRequest(url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }
        try {
          const networkResponse = await fetch(request, { mode: 'cors' });
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return new Response('', { status: 408, statusText: 'Offline Image Unavailable' });
        }
      })
    );
    return;
  }

  // 2. Chiến lược Network-First (fallback sang Cache) cho HTML Navigation của /ontap
  if (request.mode === 'navigate' && url.pathname.startsWith('/ontap')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(APP_SHELL_CACHE);
          return (await cache.match(request)) || (await cache.match('/ontap/index.html'));
        })
    );
  }
});

let isPrecaching = false;

async function precacheImagesInBatches(urls) {
  if (isPrecaching || !Array.isArray(urls) || urls.length === 0) return;
  isPrecaching = true;
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const missingUrls = [];

    for (const rawUrl of urls) {
      const matched = await cache.match(rawUrl);
      if (!matched) {
        missingUrls.push(rawUrl);
      }
    }

    for (let i = 0; i < missingUrls.length; i += BATCH_SIZE) {
      const batch = missingUrls.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (imgUrl) => {
          try {
            const res = await fetch(imgUrl, { mode: 'cors' });
            if (res && res.status === 200) {
              await cache.put(imgUrl, res);
            }
          } catch {}
        })
      );
      await new Promise((r) => setTimeout(r, 120));
    }
  } finally {
    isPrecaching = false;
  }
}

self.addEventListener('message', (event) => {
  const data = event.data;
  if (data && data.type === 'PRECACHE_QUESTION_IMAGES' && Array.isArray(data.urls)) {
    event.waitUntil(precacheImagesInBatches(data.urls));
  }
});
