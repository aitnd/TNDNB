import { WorkerEnv } from '../types';
import { verifyPortalUploadAuth } from '../middleware/auth';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
]);

const ALLOWED_IMAGE_EXTS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg'
]);

const ALLOWED_DOC_MIMES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-rar-compressed',
  'application/octet-stream'
]);

const ALLOWED_DOC_EXTS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.zip',
  '.rar'
]);

export function cleanFileName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');
  const extension = lastDot !== -1 ? fileName.substring(lastDot).toLowerCase() : '';
  let baseName = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;
  baseName = baseName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${baseName || 'file'}${extension}`;
}

export function detectContentType(fileName: string, mimeType?: string): string {
  if (mimeType && mimeType !== 'application/octet-stream') {
    return mimeType;
  }
  const ext = (fileName.substring(fileName.lastIndexOf('.')) || '').toLowerCase();
  switch (ext) {
    case '.pdf':
      return 'application/pdf';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.xls':
      return 'application/vnd.ms-excel';
    case '.xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case '.zip':
      return 'application/zip';
    case '.rar':
      return 'application/x-rar-compressed';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return mimeType || 'application/octet-stream';
  }
}

export async function handlePortalUploadRoute(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const jsonHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'METHOD_NOT_ALLOWED',
        message: 'Endpoint chỉ hỗ trợ phương thức POST multipart/form-data.'
      }),
      { status: 405, headers: jsonHeaders }
    );
  }

  // 1. Xác thực Bearer Token
  const isAuthorized = await verifyPortalUploadAuth(request, env);
  if (!isAuthorized) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'UNAUTHORIZED',
        message: 'Yêu cầu mã xác thực Bearer token hợp lệ để upload tài nguyên vào hệ thống.'
      }),
      { status: 401, headers: jsonHeaders }
    );
  }

  // 2. Phân tích FormData
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'BAD_REQUEST',
        message: `Lỗi đọc dữ liệu multipart/form-data: ${err?.message || 'Invalid format'}`
      }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const file = formData.get('file');
  const category = (formData.get('category') as string | null)?.trim();
  const kind = (formData.get('kind') as string | null)?.trim() || (category === 'image' ? 'content' : 'document');

  if (!file || !(file instanceof File)) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'BAD_REQUEST',
        message: 'Thiếu tệp dữ liệu upload (field "file").'
      }),
      { status: 400, headers: jsonHeaders }
    );
  }

  if (!category || (category !== 'image' && category !== 'document')) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'BAD_REQUEST',
        message: 'Trường "category" phải là "image" hoặc "document".'
      }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const ext = (file.name.substring(file.name.lastIndexOf('.')) || '').toLowerCase();

  // 3. Kiểm tra kích thước & Whitelist định dạng
  if (category === 'image') {
    if (file.size > MAX_IMAGE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'PAYLOAD_TOO_LARGE',
          message: `Kích thước tệp ảnh (${sizeMb} MB) vượt quá giới hạn tối đa cho phép (10 MB).`
        }),
        { status: 413, headers: jsonHeaders }
      );
    }

    const isValidMime = file.type ? ALLOWED_IMAGE_MIMES.has(file.type.toLowerCase()) : false;
    const isValidExt = ALLOWED_IMAGE_EXTS.has(ext);

    if (!isValidMime && !isValidExt) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'BAD_REQUEST',
          message: `Định dạng tệp ảnh '${file.type || ext}' không được hỗ trợ. Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF, SVG.`
        }),
        { status: 400, headers: jsonHeaders }
      );
    }
  } else {
    // category === 'document'
    if (file.size > MAX_DOCUMENT_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'PAYLOAD_TOO_LARGE',
          message: `Kích thước tài liệu (${sizeMb} MB) vượt quá giới hạn tối đa cho phép (25 MB).`
        }),
        { status: 413, headers: jsonHeaders }
      );
    }

    const isValidMime = file.type ? ALLOWED_DOC_MIMES.has(file.type.toLowerCase()) : false;
    const isValidExt = ALLOWED_DOC_EXTS.has(ext);

    if (!isValidMime && !isValidExt) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'BAD_REQUEST',
          message: `Định dạng tệp '${file.type || ext}' không được hỗ trợ. Chỉ chấp nhận tài liệu giáo trình (PDF, Word, Excel, ZIP/RAR).`
        }),
        { status: 400, headers: jsonHeaders }
      );
    }
  }

  // 4. Sinh R2 Key theo cấu trúc chuẩn
  const cleanName = cleanFileName(file.name);
  const timestamp = Date.now();
  let key: string;

  if (category === 'image') {
    if (kind === 'thumbnail') {
      key = `portal/images/thumbnail_${timestamp}_${cleanName}`;
    } else {
      key = `portal/images/content_${timestamp}_${cleanName}`;
    }
  } else {
    key = `portal/documents/${timestamp}_${cleanName}`;
  }

  const contentType = detectContentType(file.name, file.type);

  // 5. Lưu vào Cloudflare R2 Bucket
  try {
    const fileBuffer = await file.arrayBuffer();
    await env.ASSETS_BUCKET.put(key, fileBuffer, {
      httpMetadata: {
        contentType: contentType
      }
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: `Không thể ghi dữ liệu vào Cloudflare R2 bucket: ${err?.message || 'R2 put operation failed'}`
      }),
      { status: 500, headers: jsonHeaders }
    );
  }

  // 6. Trả về kết quả
  const cdnBase = (env.CDN_BASE_URL || 'https://cdn.daotaothuyenvien.com').replace(/\/+$/, '');
  const url = `${cdnBase}/${key}`;

  return new Response(
    JSON.stringify({
      ok: true,
      url,
      key,
      fileName: key.split('/').pop()!,
      originalName: file.name,
      category,
      kind,
      size: file.size,
      contentType,
      uploadedAt: timestamp,
      storage: 'cloudflare_r2'
    }),
    { status: 200, headers: jsonHeaders }
  );
}
