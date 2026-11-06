import { describe, it, expect } from 'vitest';
import { handleConfigRoutes } from '../src/routes/config';
import { handleAlertsRoutes } from '../src/routes/alerts';
import workerApp from '../src/index';

describe('KV Config & D1 Alerts Routes & R2 Assets', () => {
  it('GET /api/v1/config/usage_config trả về JSON cấu hình đã lưu trong KV', async () => {
    const mockKv: any = {
      get: async (key: string) => {
        if (key === 'usage_config') {
          return JSON.stringify({ isMaintenanceWeb: false, showPortalAds: true });
        }
        return null;
      }
    };

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/config/usage_config', { method: 'GET' });
    const res = await handleConfigRoutes(req, { CONFIG_KV: mockKv } as any, {});
    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.isMaintenanceWeb).toBe(false);
    expect(body.showPortalAds).toBe(true);
  });

  it('PUT /api/v1/config/usage_config chặn 401 nếu không có Admin Bearer Token', async () => {
    const req = new Request('https://www.daotaothuyenvien.com/api/v1/config/usage_config', {
      method: 'PUT',
      body: JSON.stringify({ isMaintenanceWeb: true })
    });
    const res = await handleConfigRoutes(req, { ADMIN_API_SECRET: 'secret-123' } as any, {});
    expect(res.status).toBe(401);
  });

  it('PUT /api/v1/config/usage_config ghi thành công vào KV khi có Admin Bearer Token', async () => {
    let savedKey = '';
    let savedVal = '';
    const mockKv: any = {
      put: async (key: string, val: string) => {
        savedKey = key;
        savedVal = val;
      }
    };

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/config/usage_config', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer secret-123',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ isMaintenanceWeb: true })
    });
    const res = await handleConfigRoutes(req, { ADMIN_API_SECRET: 'secret-123', CONFIG_KV: mockKv } as any, {});
    expect(res.status).toBe(200);
    expect(savedKey).toBe('usage_config');
    expect(JSON.parse(savedVal).isMaintenanceWeb).toBe(true);
  });

  it('GET /api/v1/alerts lọc các thông báo còn hạn và đúng role', async () => {
    const futureTs = Date.now() + 3600_000;
    const expiredTs = Date.now() - 3600_000;
    const mockDb: any = {
      prepare: () => ({
        all: async () => ({
          results: [
            {
              id: 'alert_1',
              title: 'Thông báo khẩn',
              message: 'Lịch thi mới',
              type: 'special',
              target_type: 'all',
              target_roles_json: '[]',
              created_at: Date.now(),
              expiry_date: futureTs,
              read_by_json: '[]',
              deleted_by_json: '[]'
            },
            {
              id: 'alert_expired',
              title: 'Đã hết hạn',
              message: 'Cũ',
              type: 'attention',
              target_type: 'all',
              target_roles_json: '[]',
              created_at: Date.now() - 7200_000,
              expiry_date: expiredTs,
              read_by_json: '[]',
              deleted_by_json: '[]'
            }
          ]
        })
      })
    };

    const req = new Request('https://www.daotaothuyenvien.com/api/v1/alerts?marquee=true');
    const res = await handleAlertsRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const list: any = await res.json();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('alert_1');
  });

  it('GET /question-images/* đọc từ ASSETS_BUCKET với cache-control immutable', async () => {
    const mockR2: any = {
      get: async (key: string) => {
        if (key === 'nvmt_1.png') {
          return {
            body: new ReadableStream(),
            httpEtag: '"etag-123"',
            writeHttpMetadata: (headers: Headers) => {
              headers.set('Content-Type', 'image/png');
            }
          };
        }
        return null;
      }
    };

    const req = new Request('https://www.daotaothuyenvien.com/question-images/nvmt_1.png', {
      method: 'GET'
    });
    const res = await workerApp.fetch(req, {
      ASSETS_BUCKET: mockR2,
      ALLOWED_ORIGINS: 'https://www.daotaothuyenvien.com'
    } as any);

    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });
});
