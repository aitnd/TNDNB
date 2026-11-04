import { describe, it, expect } from 'vitest';
import { handleConfigRoutes } from '../src/routes/config';
import { handleAlertsRoutes } from '../src/routes/alerts';

describe('D1 Config & Alerts Routes', () => {
  it('GET /api/v1/config/usage_config trả về JSON cấu hình đã lưu trong D1', async () => {
    const mockDb: any = {
      prepare: () => ({
        bind: () => ({
          first: async () => ({
            key: 'usage_config',
            value_json: JSON.stringify({ isMaintenanceWeb: false, showPortalAds: true }),
            updated_at: 1762240000000
          })
        })
      })
    };

    const req = new Request('https://api.tndnb.vn/api/v1/config/usage_config', { method: 'GET' });
    const res = await handleConfigRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const body: any = await res.json();
    expect(body.isMaintenanceWeb).toBe(false);
    expect(body.showPortalAds).toBe(true);
  });

  it('PUT /api/v1/config/usage_config chặn 401 nếu không có Admin Bearer Token', async () => {
    const req = new Request('https://api.tndnb.vn/api/v1/config/usage_config', {
      method: 'PUT',
      body: JSON.stringify({ isMaintenanceWeb: true })
    });
    const res = await handleConfigRoutes(req, { ADMIN_API_SECRET: 'secret-123' } as any, {});
    expect(res.status).toBe(401);
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

    const req = new Request('https://api.tndnb.vn/api/v1/alerts?marquee=true');
    const res = await handleAlertsRoutes(req, { DB: mockDb } as any, {});
    expect(res.status).toBe(200);
    const list: any = await res.json();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('alert_1');
  });
});
