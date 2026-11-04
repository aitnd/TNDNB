# Phase 04: Tối Ưu Ảnh Câu Hỏi (Cloudflare R2 CDN + PWA Offline Cache)

Status: Pending
Dependencies: Phase 02, Phase 03

> **Thuộc kế hoạch:** [plan.md](file:///d:/Antigravity/TNDNB/docs/plans/261104-0856-cloudflare-r2-d1-offline-upgrade/plan.md)  
> **Mục tiêu:** Đảm bảo 100% ảnh câu hỏi tải tức thì (<10ms từ Cloudflare VN Edge hoặc 0ms từ `CacheStorage`) và hiển thị đầy đủ ngay cả khi học viên bị mất mạng giữa buổi thi trên cả `ontap-web` và `ontap-win`. Tuyệt đối không chạm vào `ontap-web/public/sw.js` (Monetag).

---

## Implementation Steps (TDD Enriched)

### Task 4.1: Xây dựng `ontap-web/utils/imageHelper.ts` & Cập nhật `ontap-win/utils/imageHelper.ts`

- **Files:**
  - Create: [d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-win/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-win/utils/imageHelper.ts)
  - Modify: [d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx)
  - Test: [d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts)
- **Interfaces:**
  - Consumes: `License`, `Question` từ `../types`
  - Produces:
    - `export function resolveQuestionImageUrl(question: { id: string; image?: string | null }, r2BaseUrl?: string): string | null`
    - `export function extractAllQuestionImageUrls(licenses: License[], r2BaseUrl?: string): string[]`
    - `export function precacheAllQuestionImages(licenses: License[]): void`

#### Step 4.1.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/imageHelper.test.ts):

```typescript
import { describe, it, expect, vi } from 'vitest';
import {
  resolveQuestionImageUrl,
  extractAllQuestionImageUrls,
  precacheAllQuestionImages
} from '../imageHelper';

describe('R2 Image Helper & Precache Trigger (ontap-web)', () => {
  it('resolveQuestionImageUrl trả về null nếu câu hỏi không có ảnh', () => {
    expect(resolveQuestionImageUrl({ id: 'nvmt_1', image: null })).toBeNull();
  });

  it('resolveQuestionImageUrl giữ nguyên URL https:// của R2 hoặc chuẩn hóa đường dẫn tương đối sang R2 CDN', () => {
    expect(
      resolveQuestionImageUrl(
        { id: 'nvmt_10', image: 'https://cdn.tndnb.vn/question-images/nvmt_10.png' },
        'https://cdn.tndnb.vn'
      )
    ).toBe('https://cdn.tndnb.vn/question-images/nvmt_10.png');

    expect(
      resolveQuestionImageUrl(
        { id: 'nvmt_14', image: '/question-images/img_m3_nvmt_q14.jpg' },
        'https://cdn.tndnb.vn'
      )
    ).toBe('https://cdn.tndnb.vn/question-images/nvmt_14.png');
  });

  it('extractAllQuestionImageUrls lọc danh sách URL ảnh duy nhất không trùng lặp từ License[]', () => {
    const licenses: any = [
      {
        id: 'm1',
        name: 'M1',
        subjects: [
          {
            id: 's1',
            name: 'S1',
            questions: [
              { id: 'q1', image: null, answers: [] },
              { id: 'q2', image: '/question-images/old2.jpg', answers: [] },
              { id: 'q2', image: '/question-images/old2.jpg', answers: [] }
            ]
          }
        ]
      }
    ];

    const urls = extractAllQuestionImageUrls(licenses, 'https://cdn.tndnb.vn');
    expect(urls).toEqual(['https://cdn.tndnb.vn/question-images/q2.png']);
  });

  it('precacheAllQuestionImages gửi postMessage PRECACHE_QUESTION_IMAGES tới Service Worker controller', () => {
    const postMessageSpy = vi.fn();
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        serviceWorker: {
          controller: { postMessage: postMessageSpy }
        }
      },
      configurable: true
    });

    const licenses: any = [
      {
        id: 'm1',
        name: 'M1',
        subjects: [
          {
            id: 's1',
            name: 'S1',
            questions: [{ id: 'nvmt_10', image: 'https://cdn.tndnb.vn/question-images/nvmt_10.png', answers: [] }]
          }
        ]
      }
    ];

    precacheAllQuestionImages(licenses);
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: 'PRECACHE_QUESTION_IMAGES',
      urls: ['https://cdn.tndnb.vn/question-images/nvmt_10.png']
    });
  });
});
```

#### Step 4.1.2: Chạy test — xác nhận FAIL
```powershell
npx --prefix ontap-web vitest run utils/__tests__/imageHelper.test.ts
```
Expected output:
```text
FAIL  utils/__tests__/imageHelper.test.ts
Error: Failed to resolve import "../imageHelper" from "utils/__tests__/imageHelper.test.ts".
```

#### Step 4.1.3: Implement tối thiểu (GREEN)
1. Tạo [d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/imageHelper.ts):
```typescript
import type { License } from '../types';

export const getR2PublicBaseUrl = (overrideBase?: string): string => {
  const raw =
    overrideBase ||
    (import.meta as any).env?.VITE_R2_PUBLIC_URL ||
    'https://cdn.tndnb.vn';
  return String(raw).replace(/\/+$/, '');
};

export function resolveQuestionImageUrl(
  question: { id: string; image?: string | null },
  r2BaseUrl?: string
): string | null {
  if (!question || !question.image) return null;
  const trimmed = question.image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const base = getR2PublicBaseUrl(r2BaseUrl);
  return `${base}/question-images/${question.id}.png`;
}

export function extractAllQuestionImageUrls(
  licenses: License[],
  r2BaseUrl?: string
): string[] {
  const urlSet = new Set<string>();
  for (const lic of licenses || []) {
    for (const sub of lic.subjects || []) {
      for (const q of sub.questions || []) {
        const resolved = resolveQuestionImageUrl(q, r2BaseUrl);
        if (resolved) {
          urlSet.add(resolved);
        }
      }
    }
  }
  return Array.from(urlSet);
}

export function precacheAllQuestionImages(licenses: License[]): void {
  try {
    const urls = extractAllQuestionImageUrls(licenses);
    if (urls.length === 0) return;

    if (
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRECACHE_QUESTION_IMAGES',
        urls
      });
    }
  } catch {
    // Không chặn luồng chính nếu trình duyệt không hỗ trợ SW
  }
}
```

2. Cập nhật [d:/Antigravity/TNDNB/ontap-win/utils/imageHelper.ts](file:///d:/Antigravity/TNDNB/ontap-win/utils/imageHelper.ts):
```typescript
import React from 'react';

export const getR2FallbackUrl = (questionId: string, originalUrl?: string | null): string | null => {
  if (originalUrl && /^https?:\/\//i.test(originalUrl)) {
    return originalUrl;
  }
  const r2Base = ((import.meta as any).env?.VITE_R2_PUBLIC_URL || 'https://cdn.tndnb.vn').replace(/\/+$/, '');
  return `${r2Base}/question-images/${questionId}.png`;
};

export function getLocalImageSrc(question: { id: string; image?: string | null }): string | null {
  if (!question.image) return null;
  const ext = '.png';
  const isElectron = (window as any).electron?.isElectron;
  const resourcesPath = (window as any).electron?.resourcesPath;

  if (isElectron && resourcesPath && !(import.meta as any).env?.DEV) {
    const normalizedPath = resourcesPath.replace(/\\/g, '/');
    return `file://${normalizedPath}/question_images/${question.id}${ext}`;
  }

  return `/question_images/${question.id}${ext}`;
}

export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  originalUrl?: string | null,
  questionId?: string
) {
  const img = e.currentTarget;
  if (img.dataset.fallbackAttempted === 'true') {
    img.style.display = 'none';
    return;
  }

  img.dataset.fallbackAttempted = 'true';
  const fallbackUrl = questionId
    ? getR2FallbackUrl(questionId, originalUrl)
    : originalUrl;

  if (fallbackUrl && img.src !== fallbackUrl) {
    img.src = fallbackUrl;
  } else {
    img.style.display = 'none';
  }
}
```

3. Cập nhật [d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx#L140-L144) sử dụng `resolveQuestionImageUrl(currentQuestion)` và preload ảnh câu kế tiếp.

#### Step 4.1.4: Chạy test — xác nhận PASS
```powershell
npx --prefix ontap-web vitest run utils/__tests__/imageHelper.test.ts
```
Expected output:
```text
 ✓ utils/__tests__/imageHelper.test.ts (4 tests) 6ms
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

#### Step 4.1.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s ontap-web/ ontap-win/
```

---

### Task 4.2: Nâng cấp `ontap-web/public/sw-pwa.js` (CacheStorage + Background Batch Pre-cache)

- **Files:**
  - Modify: [d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js)
  - Test: [d:/Antigravity/TNDNB/ontap-web/utils/__tests__/swPwa.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/swPwa.test.ts)
- **Interfaces:**
  - Consumes: Sự kiện `install`, `activate`, `fetch`, `message` (`{ type: 'PRECACHE_QUESTION_IMAGES', urls: string[] }`)
  - Produces:
    - `CacheStorage`: `'tndnb-question-images-v1'` (Cache-First cho ảnh câu hỏi) & `'tndnb-app-shell-v2'` (Stale-While-Revalidate cho App Shell)

#### Step 4.2.1: Viết test thất bại (RED)
Tạo file [d:/Antigravity/TNDNB/ontap-web/utils/__tests__/swPwa.test.ts](file:///d:/Antigravity/TNDNB/ontap-web/utils/__tests__/swPwa.test.ts):

```typescript
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('PWA Service Worker (sw-pwa.js) Offline Image Cache Specification', () => {
  const swPath = path.resolve(process.cwd(), 'public/sw-pwa.js');
  const swContent = fs.readFileSync(swPath, 'utf8');

  it('khai báo bộ nhớ CacheStorage chuyên biệt tndnb-question-images-v1 và tndnb-app-shell-v2', () => {
    expect(swContent).toContain('tndnb-question-images-v1');
    expect(swContent).toContain('tndnb-app-shell-v2');
  });

  it('xử lý sự kiện fetch với chiến lược Cache-First cho ảnh câu hỏi (/question-images/)', () => {
    expect(swContent).toContain("self.addEventListener('fetch'");
    expect(swContent).toContain('isQuestionImageRequest');
    expect(swContent).toContain('caches.open(IMAGE_CACHE)');
  });

  it('xử lý sự kiện message PRECACHE_QUESTION_IMAGES theo batch để không nghẽn mạng', () => {
    expect(swContent).toContain("self.addEventListener('message'");
    expect(swContent).toContain('PRECACHE_QUESTION_IMAGES');
    expect(swContent).toContain('BATCH_SIZE');
  });
});
```

#### Step 4.2.2: Chạy test — xác nhận FAIL
```powershell
npx --prefix ontap-web vitest run utils/__tests__/swPwa.test.ts
```
Expected output:
```text
FAIL  utils/__tests__/swPwa.test.ts
AssertionError: expected 'self.addEventListener(\'install\', (e…' to contain 'tndnb-question-images-v1'
```

#### Step 4.2.3: Implement tối thiểu (GREEN)
Cập nhật [d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js](file:///d:/Antigravity/TNDNB/ontap-web/public/sw-pwa.js):

```javascript
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
```

#### Step 4.2.4: Chạy test — xác nhận PASS
```powershell
npx --prefix ontap-web vitest run utils/__tests__/swPwa.test.ts
```
Expected output:
```text
 ✓ utils/__tests__/swPwa.test.ts (3 tests) 4ms
 Test Files  1 passed (1)
      Tests  3 passed (3)
```

#### Step 4.2.5: Kiểm tra / Chuẩn bị stage
```powershell
git status -s ontap-web/public/sw-pwa.js
```

---

## Tiêu Chí Nghiệm Thu Phase 04
- [x] `sw-pwa.js` hỗ trợ đầy đủ Cache-First cho ảnh câu hỏi và Background Batch Pre-cache 8 ảnh/lô.
- [x] `ontap-web/public/sw.js` (Monetag) được giữ nguyên vẹn 100%, không bị chỉnh sửa.
- [x] Tất cả unit test trong `imageHelper.test.ts` và `swPwa.test.ts` đều PASS.
