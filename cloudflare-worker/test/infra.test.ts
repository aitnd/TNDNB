import { describe, it, expect } from 'vitest';
import { verifyAdminAuthorization, buildCorsHeaders } from '../src/middleware/auth';
import workerApp from '../src/index';

const mockEnv: any = {
  GITHUB_OWNER: 'aitnd',
  GITHUB_REPO: 'TNDNB',
  RELEASE_UPSTREAM_MODE: 'github_proxy',
  ALLOWED_ORIGINS: 'https://tndnb.vn,http://localhost:5173',
  ADMIN_API_SECRET: 'test-only-mock-val'
};

describe('Auth & CORS Middleware + Worker Healthcheck', () => {
  it('verifyAdminAuthorization từ chối request thiếu Bearer token hoặc sai secret', () => {
    const mockSecret = 'test-only-mock-val';
    const fakeThreePart = ['header_mock', 'payload_mock', 'sig'].join('.');
    expect(verifyAdminAuthorization(null, mockSecret)).toBe(false);
    expect(verifyAdminAuthorization(`Bearer wrong`, mockSecret)).toBe(false);
    expect(verifyAdminAuthorization(`Bearer ${fakeThreePart}`, mockSecret)).toBe(false);
    expect(verifyAdminAuthorization(`Bearer ${mockSecret}`, mockSecret)).toBe(true);
  });

  it('buildCorsHeaders trả về đúng Access-Control-Allow-Origin cho origin hợp lệ và Electron file://', () => {
    const headersWeb = buildCorsHeaders('http://localhost:5173', mockEnv.ALLOWED_ORIGINS);
    expect(headersWeb['Access-Control-Allow-Origin']).toBe('http://localhost:5173');

    const headersElectron = buildCorsHeaders('file://', mockEnv.ALLOWED_ORIGINS);
    expect(headersElectron['Access-Control-Allow-Origin']).toBe('*');
  });

  it('GET /api/v1/health trả về status 200 kèm thông tin mode và CORS headers', async () => {
    const req = new Request('https://api.tndnb.vn/api/v1/health', {
      method: 'GET',
      headers: { Origin: 'http://localhost:5173' }
    });
    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
    const body = await res.json();
    expect(body).toEqual({
      ok: true,
      service: 'tndnb-edge-api',
      releaseMode: 'github_proxy'
    });
  });

  it('OPTIONS preflight request trả về 204 No Content', async () => {
    const req = new Request('https://api.tndnb.vn/api/v1/config/usage_config', {
      method: 'OPTIONS',
      headers: { Origin: 'https://tndnb.vn' }
    });
    const res = await workerApp.fetch(req, mockEnv);
    expect(res.status).toBe(204);
    expect(res.headers.get('Access-Control-Allow-Methods')).toContain('PUT');
  });
});
