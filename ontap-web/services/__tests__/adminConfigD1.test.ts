// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as firestore from 'firebase/firestore';
import * as d1Client from '../d1Client';
import { getUsageConfig, saveUsageConfig, getGitHubConfig, saveGitHubConfig } from '../adminConfigService';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<typeof import('firebase/firestore')>('firebase/firestore');
  return {
    ...actual,
    doc: vi.fn(() => ({ id: 'mock_doc' })),
    getDoc: vi.fn(),
    setDoc: vi.fn()
  };
});

describe('adminConfigService (Ruling 2.3 — Cloudflare KV 100% Single Source of Truth, No Firestore Fallback)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('getUsageConfig đọc từ KV API, merge với DEFAULT_CONFIG và lưu xuống localStorage cache', async () => {
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue({
      isMaintenanceWeb: true,
      maintenanceMessage: 'Đang nâng cấp KV',
      guest: { limit: 15 }
    });

    const cfg = await getUsageConfig();
    expect(cfg.isMaintenanceWeb).toBe(true);
    expect(cfg.maintenanceMessage).toBe('Đang nâng cấp KV');
    expect(cfg.guest.limit).toBe(15);
    expect(localStorage.getItem('ontap_usage_config_cache')).toContain('Đang nâng cấp KV');
    expect(firestore.getDoc).not.toHaveBeenCalled();
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
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('getUsageConfig trả về in-memory DEFAULT_CONFIG khi cả KV và cache đều trống mà KHÔNG gọi Firestore', async () => {
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue(null);

    const cfg = await getUsageConfig();
    expect(cfg.guest.limit).toBe(5);
    expect(firestore.getDoc).not.toHaveBeenCalled();
  });

  it('saveUsageConfig lưu thành công vào KV và localStorage, KHÔNG gọi Firestore setDoc', async () => {
    const saveSpy = vi.spyOn(d1Client, 'saveD1Config').mockResolvedValue(true);

    const currentCfg = await getUsageConfig();
    const updatedCfg = { ...currentCfg, maintenanceMessage: 'Cấu hình chuẩn từ KV' };

    await expect(saveUsageConfig(updatedCfg)).resolves.toBeUndefined();
    expect(saveSpy).toHaveBeenCalledWith('usage_config', updatedCfg, expect.anything());
    expect(firestore.setDoc).not.toHaveBeenCalled();
    expect(localStorage.getItem('ontap_usage_config_cache')).toContain('Cấu hình chuẩn từ KV');
  });

  it('saveUsageConfig ném lỗi rõ ràng khi saveD1Config = false, KHÔNG fallback ghi Firestore', async () => {
    vi.spyOn(d1Client, 'saveD1Config').mockResolvedValue(false);

    const currentCfg = await getUsageConfig();
    const updatedCfg = { ...currentCfg, maintenanceMessage: 'Lỗi kết nối KV' };

    await expect(saveUsageConfig(updatedCfg)).rejects.toThrow(
      'Không thể lưu cấu hình lên Cloudflare KV API'
    );
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('getGitHubConfig và saveGitHubConfig thuần KV, không đụng Firestore', async () => {
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue({ owner: 'aitnd', repo: 'TNDNB-CUSTOM' });
    const ghCfg = await getGitHubConfig();
    expect(ghCfg.repo).toBe('TNDNB-CUSTOM');
    expect(firestore.getDoc).not.toHaveBeenCalled();

    const saveSpy = vi.spyOn(d1Client, 'saveD1Config').mockResolvedValue(true);
    await expect(saveGitHubConfig({ owner: 'aitnd', repo: 'TNDNB-NEW' })).resolves.toBeUndefined();
    expect(saveSpy).toHaveBeenCalledWith('github_config', { owner: 'aitnd', repo: 'TNDNB-NEW' }, expect.anything());
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});
