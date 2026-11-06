import { describe, it, expect, vi } from 'vitest';
import workerApp from '../src/index';
import { cleanFileName, detectContentType } from '../src/routes/portalUpload';
import { verifyPortalUploadAuth } from '../src/middleware/auth';

function createMockR2Bucket() {
  const store = new Map<string, { body: Uint8Array; metadata: any; etag: string }>();

  return {
    store,
    async put(key: string, value: ArrayBuffer | Uint8Array, options?: any) {
      const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
      const etag = `etag-${Date.now()}`;
      store.set(key, {
        body: bytes,
        metadata: options?.httpMetadata || {},
        etag
      });
      return { key, etag };
    },
    async get(key: string) {
      const item = store.get(key);
      if (!item) return null;
      return {
        body: item.body,
        httpEtag: item.etag,
        writeHttpMetadata(headers: Headers) {
          if (item.metadata?.contentType) {
            headers.set('Content-Type', item.metadata.contentType);
          }
        }
      };
    }
  };
}

describe('Portal Media Upload & Assets Delivery Route', () => {
  const mockBucket = createMockR2Bucket();
  const mockEnv: any = {
    ASSETS_BUCKET: mockBucket,
    ALLOWED_ORIGINS: 'https://www.daotaothuyenvien.com,https://daotaothuyenvien.com',
    ADMIN_API_SECRET: 'test-admin-secret-2026',
    FIREBASE_PROJECT_ID: 'tndnb-prod',
    CDN_BASE_URL: 'https://cdn.daotaothuyenvien.com'
  };

  it('cleanFileName chuẩn hóa ký tự tiếng Việt, dấu cách và ký tự đặc biệt', () => {
    expect(cleanFileName('Giáo trình Thuyền trưởng Hạng 3 (2026).pdf')).toBe('giao-trinh-thuyen-truong-hang-3-2026.pdf');
    expect(cleanFileName('Ảnh Đại Diện @2026! đò ngang.png')).toBe('anh-dai-dien-2026-do-ngang.png');
    expect(cleanFileName('bài__viết---mới.docx')).toBe('bai-viet-moi.docx');
  });

  it('detectContentType nhận diện đúng MIME type từ extension', () => {
    expect(detectContentType('test.pdf')).toBe('application/pdf');
    expect(detectContentType('test.docx')).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    expect(detectContentType('test.webp')).toBe('image/webp');
    expect(detectContentType('test.png')).toBe('image/png');
  });

  it('verifyPortalUploadAuth chấp nhận Bearer ADMIN_API_SECRET hoặc Firebase ID Token hợp lệ', async () => {
    // 1. Không có header
    const reqNoAuth = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload');
    expect(await verifyPortalUploadAuth(reqNoAuth, mockEnv)).toBe(false);

    // 2. Token sai
    const reqWrong = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      headers: { Authorization: 'Bearer invalid-token' }
    });
    expect(await verifyPortalUploadAuth(reqWrong, mockEnv)).toBe(false);

    // 3. Admin Secret đúng
    const reqAdmin = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      headers: { Authorization: 'Bearer test-admin-secret-2026' }
    });
    expect(await verifyPortalUploadAuth(reqAdmin, mockEnv)).toBe(true);

    // 4. Firebase ID Token giả lập hợp lệ
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const payload = {
      iss: 'https://securetoken.google.com/tndnb-prod',
      aud: 'tndnb-prod',
      exp
    };
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const fakeFirebaseToken = `header.${base64Payload}.signature`;

    const reqFirebase = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      headers: { Authorization: `Bearer ${fakeFirebaseToken}` }
    });
    expect(await verifyPortalUploadAuth(reqFirebase, mockEnv)).toBe(true);
  });

  it('POST /api/v1/portal/upload từ chối khi không có token (401)', async () => {
    const formData = new FormData();
    formData.append('file', new File(['test image data'], 'image.png', { type: 'image/png' }));
    formData.append('category', 'image');

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      method: 'POST',
      body: formData
    });

    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('UNAUTHORIZED');
  });

  it('POST /api/v1/portal/upload từ chối file exe hoặc mime type không cho phép (400)', async () => {
    const formData = new FormData();
    formData.append('file', new File(['malware binary'], 'virus.exe', { type: 'application/x-msdownload' }));
    formData.append('category', 'document');

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-secret-2026'
      },
      body: formData
    });

    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe('BAD_REQUEST');
  });

  it('POST /api/v1/portal/upload tải ảnh thành công và lưu vào portal/images/', async () => {
    const imageContent = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]); // PNG header
    const file = new File([imageContent], 'Banner Tuyển Sinh.png', { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'image');
    formData.append('kind', 'thumbnail');

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-secret-2026'
      },
      body: formData
    });

    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.storage).toBe('cloudflare_r2');
    expect(body.key).toMatch(/^portal\/images\/thumbnail_\d+_banner-tuyen-sinh\.png$/);
    expect(body.url).toBe(`https://cdn.daotaothuyenvien.com/${body.key}`);
    expect(body.fileName).toBe(body.key.split('/').pop());
    expect(body.contentType).toBe('image/png');

    // Kiểm tra dữ liệu đã vào bucket R2
    const stored = await mockBucket.get(body.key);
    expect(stored).not.toBeNull();
  });

  it('POST /api/v1/portal/upload tải tài liệu thành công và lưu vào portal/documents/', async () => {
    const pdfContent = new TextEncoder().encode('%PDF-1.4 mock content');
    const file = new File([pdfContent], 'Giáo Trình Luật 2026.pdf', { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'document');

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/portal/upload', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer test-admin-secret-2026'
      },
      body: formData
    });

    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.storage).toBe('cloudflare_r2');
    expect(body.key).toMatch(/^portal\/documents\/\d+_giao-trinh-luat-2026\.pdf$/);
    expect(body.url).toBe(`https://cdn.daotaothuyenvien.com/${body.key}`);
    expect(body.contentType).toBe('application/pdf');
  });

  it('GET /portal-assets/* phục vụ file với Cache-Control immutable và ETag', async () => {
    // 1. Chuẩn bị file trong mock bucket
    const key = 'portal/images/thumbnail_demo.webp';
    await mockBucket.put(key, new Uint8Array([1, 2, 3, 4]), {
      httpMetadata: { contentType: 'image/webp' }
    });

    // 2. Request GET /portal-assets/portal/images/thumbnail_demo.webp
    const req = new Request(`https://www.daotaothuyenvien.com/portal-assets/${key}`, {
      method: 'GET'
    });
    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(res.headers.get('Content-Type')).toBe('image/webp');
    expect(res.headers.get('ETag')).toBeDefined();

    // 3. Request file không tồn tại trả về 404
    const reqNotFound = new Request(`https://www.daotaothuyenvien.com/portal-assets/portal/images/not-exist.png`, {
      method: 'GET'
    });
    const res404 = await workerApp.fetch(reqNotFound, mockEnv);
    expect(res404.status).toBe(404);
  });
});
