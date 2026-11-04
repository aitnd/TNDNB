import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('PWA Service Worker (sw-pwa.js) Offline Image Cache Specification', () => {
  const swPath = fs.existsSync(path.resolve(process.cwd(), 'public/sw-pwa.js'))
    ? path.resolve(process.cwd(), 'public/sw-pwa.js')
    : path.resolve(process.cwd(), 'ontap-web/public/sw-pwa.js');
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
