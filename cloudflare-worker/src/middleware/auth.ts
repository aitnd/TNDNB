import { parseAllowedOrigins, WorkerEnv } from '../types';

export async function verifyAdminAuthorization(
  authHeader: string | null,
  adminSecret?: string,
  env?: WorkerEnv
): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return false;

  // 1. Kiểm tra Admin API Secret
  if (adminSecret && token === adminSecret) {
    return true;
  }

  // 2. Kiểm tra Firebase ID Token từ project thi-tnd
  if (env) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonStr = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8');
        const payload = JSON.parse(jsonStr);
        const now = Math.floor(Date.now() / 1000);

        const projectId = env.FIREBASE_PROJECT_ID || 'thi-tnd';
        const isIssuerValid = payload.iss === `https://securetoken.google.com/${projectId}`;
        const isAudienceValid = payload.aud === projectId;
        const isNotExpired = payload.exp && payload.exp > now;

        if (isIssuerValid && isAudienceValid && isNotExpired) {
          return true;
        }
      }
    } catch {
      // Bỏ qua lỗi parse
    }
  }

  return false;
}

export async function verifyPortalUploadAuth(
  request: Request,
  env: WorkerEnv
): Promise<boolean> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return false;

  // 1. Kiểm tra Admin API Secret cấu hình trong wrangler.toml/Cloudflare Dashboard
  if (env.ADMIN_API_SECRET && token === env.ADMIN_API_SECRET) {
    return true;
  }

  // 2. Xác thực Firebase ID Token của người dùng đang đăng nhập trên Root Portal
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode base64url payload
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);
    const now = Math.floor(Date.now() / 1000);

    const projectId = env.FIREBASE_PROJECT_ID || 'thi-tnd';
    const isIssuerValid = payload.iss === `https://securetoken.google.com/${projectId}`;
    const isAudienceValid = payload.aud === projectId;
    const isNotExpired = payload.exp && payload.exp > now;

    if (isIssuerValid && isAudienceValid && isNotExpired) {
      return true;
    }
  } catch (_e) {
    return false;
  }

  return false;
}

export function buildCorsHeaders(
  origin: string | null,
  allowedOriginsRaw: string
): Record<string, string> {
  const allowedList = parseAllowedOrigins(allowedOriginsRaw);
  let allowOrigin = '*';

  if (origin && origin !== 'null' && !origin.startsWith('file://')) {
    if (allowedList.includes('*') || allowedList.includes(origin)) {
      allowOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Range, If-None-Match',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, ETag, CF-Cache-Status',
    'Access-Control-Max-Age': '86400'
  };
}
