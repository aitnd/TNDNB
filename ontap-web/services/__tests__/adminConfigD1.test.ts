// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as d1Client from '../d1Client';
import { getUsageConfig } from '../adminConfigService';

describe('adminConfigService with Cloudflare D1 & Offline Cache', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('getUsageConfig đọc từ D1 API, merge với DEFAULT_CONFIG và lưu xuống localStorage cache', async () => {
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue({
      isMaintenanceWeb: true,
      maintenanceMessage: 'Đang nâng cấp D1',
      guest: { limit: 15 }
    });

    const cfg = await getUsageConfig();
    expect(cfg.isMaintenanceWeb).toBe(true);
    expect(cfg.maintenanceMessage).toBe('Đang nâng cấp D1');
    expect(cfg.guest.limit).toBe(15);
    expect(localStorage.getItem('ontap_usage_config_cache')).toContain('Đang nâng cấp D1');
  });

  it('getUsageConfig đọc từ localStorage cache khi học viên mất mạng (fetchD1Config trả về null)', async () => {
    localStorage.setItem(
      'ontap_usage_config_cache',
      JSON.stringify({ isMaintenanceWin: true, guest: { limit: 8 } })
    );
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue(null);

    const cfg = await getUsageConfig();
    expect(cfg.isMaintenanceWin).toBe(true);
    expect(cfg.guest.limit).toBe(8);
  });
});
