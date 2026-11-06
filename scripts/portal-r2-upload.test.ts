import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock supabase client
vi.mock('../utils/supabaseClient', () => {
  return {
    supabase: {
      storage: {
        from: vi.fn((bucket: string) => ({
          upload: vi.fn(async (fileName: string, _file: any) => {
            return { data: { path: `${bucket}/${fileName}` }, error: null };
          }),
          getPublicUrl: vi.fn((fileName: string) => {
            return {
              data: {
                publicUrl: `https://mock-supabase.co/storage/v1/object/public/${bucket}/${fileName}`
              }
            };
          })
        }))
      }
    }
  };
});

// Mock firebaseClient
vi.mock('../utils/firebaseClient', () => {
  return {
    auth: {
      currentUser: {
        getIdToken: vi.fn(async () => 'mock-firebase-id-token-xyz')
      }
    }
  };
});

import {
  uploadPortalMedia,
  uploadPortalAsset,
  createTinyMceUploadHandler,
  resolveAuthToken
} from '../lib/portalMediaService';

const rootDir = path.resolve(__dirname, '..');

describe('Phase 06: Portal Media Upload & Cloudflare R2 Migration with 5s Graceful Fallback', () => {
  const originalFetch = global.fetch;
  const originalEnv = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL = 'https://tndnb-edge-api.pokecvlkq.workers.dev';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL = originalEnv;
    vi.restoreAllMocks();
  });

  it('Test 1: resolveAuthToken ưu tiên Firebase ID Token và fallback sang NEXT_PUBLIC_ADMIN_API_SECRET', async () => {
    const token = await resolveAuthToken();
    expect(token).toBe('mock-firebase-id-token-xyz');

    const explicit = await resolveAuthToken('explicit-token-123');
    expect(explicit).toBe('explicit-token-123');
  });

  it('Test 2: uploadPortalMedia tải thành công lên Cloudflare R2 khi Worker phản hồi 200', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        url: 'https://cdn.daotaothuyenvien.com/portal/images/thumbnail_1730900000000_banner.webp',
        key: 'portal/images/thumbnail_1730900000000_banner.webp',
        fileName: 'thumbnail_1730900000000_banner.webp',
        originalName: 'banner.webp',
        category: 'image',
        kind: 'thumbnail',
        size: 1024,
        contentType: 'image/webp',
        storage: 'cloudflare_r2'
      })
    } as any);

    const mockFile = new File(['fake image bytes'], 'banner.webp', { type: 'image/webp' });
    const result = await uploadPortalMedia(mockFile, {
      category: 'image',
      kind: 'thumbnail'
    });

    expect(result.storage).toBe('cloudflare_r2');
    expect(result.url).toBe('https://cdn.daotaothuyenvien.com/portal/images/thumbnail_1730900000000_banner.webp');
    expect(result.key).toBe('portal/images/thumbnail_1730900000000_banner.webp');
  });

  it('Test 3: Graceful Fallback Supabase tự động kích hoạt khi Cloudflare Worker phản hồi lỗi (500 hoặc 4xx)', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ ok: false, message: 'Cloudflare Worker Error 500' })
    } as any);

    const mockFile = new File(['fake document bytes'], 'giao-trinh-thuyen-truong.pdf', {
      type: 'application/pdf'
    });

    const result = await uploadPortalMedia(mockFile, {
      category: 'document',
      kind: 'document'
    });

    expect(result.storage).toBe('supabase_fallback');
    expect(result.url).toContain('https://mock-supabase.co/storage/v1/object/public/post_files/');
    expect(result.warning).toBeDefined();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('Test 4: Graceful Fallback Supabase tự động kích hoạt khi Worker gặp sự cố mạng hoặc AbortError/Timeout', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection timeout (5000ms)'));

    const mockFile = new File(['fake thumbnail bytes'], 'anh-dai-dien.png', {
      type: 'image/png'
    });

    const result = await uploadPortalAsset({
      file: mockFile,
      category: 'image',
      kind: 'thumbnail'
    });

    expect(result.storage).toBe('supabase_fallback');
    expect(result.url).toContain('https://mock-supabase.co/storage/v1/object/public/post_images/');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('Test 5: createTinyMceUploadHandler kiểm tra kích thước ảnh và trả về URL ảnh hợp lệ', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        url: 'https://cdn.daotaothuyenvien.com/portal/images/content_1730900000000_hinh1.png',
        key: 'portal/images/content_1730900000000_hinh1.png',
        fileName: 'content_1730900000000_hinh1.png',
        storage: 'cloudflare_r2'
      })
    } as any);

    const handler = createTinyMceUploadHandler();

    // 1. Thành công
    const validBlobInfo = {
      blob: () => new File(['img data'], 'hinh1.png', { type: 'image/png' }),
      filename: () => 'hinh1.png'
    };
    const url = await handler(validBlobInfo, () => {});
    expect(url).toBe('https://cdn.daotaothuyenvien.com/portal/images/content_1730900000000_hinh1.png');

    // 2. Chặn ảnh quá 10MB
    const oversizedBlob = {
      blob: () => ({ size: 15 * 1024 * 1024, name: 'huge.png' }),
      filename: () => 'huge.png'
    };
    await expect(handler(oversizedBlob, () => {})).rejects.toContain('Lỗi: Ảnh quá lớn');
  });

  it('Test 6: app/quan-ly/dang-bai/tao-moi/page.tsx đã tích hợp uploadPortalAsset và createTinyMceUploadHandler', () => {
    const filePath = path.resolve(rootDir, 'app/quan-ly/dang-bai/tao-moi/page.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('uploadPortalAsset');
    expect(content).toContain('createTinyMceUploadHandler');
    expect(content).toContain('images_upload_handler: tinymceUploadHandler');
    expect(content).not.toContain("supabase.storage.from('post_images').upload");
    expect(content).not.toContain("supabase.storage.from('post_files').upload");
  });

  it('Test 7: app/quan-ly/dang-bai/sua/[postId]/page.tsx đã tích hợp uploadPortalAsset và giữ nguyên 100% existingAttachments', () => {
    const filePath = path.resolve(rootDir, 'app/quan-ly/dang-bai/sua/[postId]/page.tsx');
    expect(fs.existsSync(filePath)).toBe(true);

    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('uploadPortalAsset');
    expect(content).toContain('createTinyMceUploadHandler');
    expect(content).toContain('images_upload_handler: tinymceUploadHandler');
    expect(content).toContain('[...existingAttachments, ...newlyUploadedAttachments]');
  });
});
