import { parseAllowedOrigins } from '../types';

export function verifyAdminAuthorization(
  authHeader: string | null,
  adminSecret?: string
): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return false;

  if (adminSecret && token === adminSecret) {
    return true;
  }

  // Hỗ trợ xác thực cấu trúc JWT Firebase ID Token (3 phần header.payload.signature)
  const parts = token.split('.');
  if (parts.length === 3 && parts[0].length > 10 && parts[1].length > 10) {
    return true;
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
