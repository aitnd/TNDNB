import { supabase } from '../utils/supabaseClient';
import { auth } from '../utils/firebaseClient';

export const sanitizeFileName = (fileName: string): string => {
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  let baseName = fileName.substring(0, fileName.lastIndexOf('.'));
  baseName = baseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/__+/g, '_')
    .replace(/--+/g, '-');
  return `${baseName}${extension}`;
};

export interface UploadOptions {
  category: 'image' | 'document';
  kind?: 'thumbnail' | 'content' | 'document';
  timeoutMs?: number; // Mặc định 5000ms
  authToken?: string;
}

export interface UploadAssetParams extends UploadOptions {
  file: File;
}

export interface PortalUploadResult {
  url: string;
  storage: 'cloudflare_r2' | 'supabase_fallback';
  fileName: string;
  fileSize: number;
  fileType: string;
  key?: string;
  warning?: string;
}

const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Lấy Bearer token xác thực (ưu tiên Firebase ID token của người dùng hiện tại, fallback Admin Secret)
 */
export async function resolveAuthToken(explicitToken?: string): Promise<string | null> {
  if (explicitToken && explicitToken.trim()) {
    return explicitToken.trim();
  }

  try {
    if (auth?.currentUser) {
      const idToken = await auth.currentUser.getIdToken();
      if (idToken) return idToken;
    }
  } catch (err) {
    console.warn('[PortalMediaService] Không thể lấy Firebase ID Token:', err);
  }

  return process.env.NEXT_PUBLIC_ADMIN_API_SECRET || null;
}

/**
 * Tải file lên Cloudflare R2 qua Worker Endpoint
 */
export async function uploadToCloudflareWorker(
  file: File,
  options: UploadOptions
): Promise<PortalUploadResult> {
  const workerBase = (process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || '').replace(/\/+$/, '');
  if (!workerBase) {
    throw new Error('Chưa cấu hình NEXT_PUBLIC_CLOUDFLARE_API_URL');
  }

  const token = await resolveAuthToken(options.authToken);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', options.category);
  if (options.kind) {
    formData.append('kind', options.kind);
  }

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Timeout sau ${timeoutMs}ms kết nối Cloudflare Worker`));
  }, timeoutMs);

  try {
    const res = await fetch(`${workerBase}/api/v1/portal/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData,
      signal: controller.signal
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      throw new Error(errJson?.message || `Worker phản hồi lỗi HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      url: data.url,
      storage: 'cloudflare_r2',
      fileName: data.fileName || file.name,
      fileSize: file.size,
      fileType: file.type || data.contentType,
      key: data.key
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Graceful Fallback: Tải file lên Supabase Storage truyền thống khi Worker gặp sự cố hoặc timeout
 */
export async function uploadToSupabaseFallback(
  file: File,
  options: UploadOptions
): Promise<PortalUploadResult> {
  const cleanName = sanitizeFileName(file.name);
  const isImage = options.category === 'image';
  const bucket = isImage ? 'post_images' : 'post_files';

  let prefix = 'file';
  if (options.kind === 'thumbnail') prefix = 'thumbnail';
  else if (options.kind === 'content') prefix = 'content';

  const fileName = `${prefix}_${Date.now()}_${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (uploadError) {
    throw new Error(`[Supabase Fallback Thất Bại] ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    url: publicUrlData.publicUrl,
    storage: 'supabase_fallback',
    fileName: fileName,
    fileSize: file.size,
    fileType: file.type,
    warning: 'Đã tự động lùi về lưu trữ Supabase Storage do kết nối Cloudflare R2 tạm thời gián đoạn.'
  };
}

/**
 * Hàm upload media dùng chung toàn Root Portal với cơ chế Graceful Fallback tự động 5s
 */
export async function uploadPortalMedia(
  file: File,
  options: UploadOptions
): Promise<PortalUploadResult> {
  try {
    // 1. Thử tải lên Cloudflare R2 trước
    return await uploadToCloudflareWorker(file, options);
  } catch (workerError: any) {
    console.warn(
      `[PortalMediaService] Tải lên Cloudflare R2 không thành công (${workerError?.message}). Kích hoạt Graceful Fallback sang Supabase Storage...`
    );
    // 2. Tự động lùi về Supabase Storage
    return await uploadToSupabaseFallback(file, options);
  }
}

/**
 * Wrapper tương thích chữ ký uploadPortalAsset({ file, category, kind, authToken, timeoutMs })
 */
export async function uploadPortalAsset(
  params: UploadAssetParams
): Promise<PortalUploadResult> {
  const { file, ...options } = params;
  return await uploadPortalMedia(file, options);
}

/**
 * Adapter cho TinyMCE Self-hosted
 */
export function createTinyMceUploadHandler(): (
  blobInfo: any,
  progress: (percent: number) => void
) => Promise<string> {
  return (blobInfo: any, _progress: (percent: number) => void): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const file = blobInfo.blob() as File;
        if (file.size > 10 * 1024 * 1024) {
          return reject('Lỗi: Ảnh quá lớn, vui lòng chọn ảnh dưới 10MB.');
        }

        const result = await uploadPortalMedia(file, {
          category: 'image',
          kind: 'content'
        });

        resolve(result.url);
      } catch (err: any) {
        reject(err?.message || 'Không thể tải ảnh nội dung lên máy chủ.');
      }
    });
  };
}
