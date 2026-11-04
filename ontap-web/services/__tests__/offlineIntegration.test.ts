// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as d1Client from '../d1Client';
import * as offlineService from '../offlineService';
import { fetchLicenses } from '../dataService';
import { getUsageConfig } from '../adminConfigService';
import { extractAllQuestionImageUrls } from '../../utils/imageHelper';

describe('E2E Offline-First & R2 Image Precache Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('Kịch bản E2E: Học viên mở app lần 1 (Online) -> Ngắt mạng (Offline) -> Mở lại vẫn có đủ bộ đề, cấu hình và URL ảnh R2', async () => {
    const initialSnapshot = {
      version: 10,
      contentHash: 'hash-v10',
      updatedAt: Date.now(),
      licenses: [
        {
          id: 'thuyentruong-h1',
          name: 'Thuyền trưởng hạng nhất - T1',
          subjects: [
            {
              id: 'luat',
              name: 'Pháp luật đường thủy',
              questions: [
                {
                  id: 't1_luat_q67',
                  text: 'Biển báo nào báo hiệu cấm vượt?',
                  image: '/question-images/img_t1_luat_q67.jpg',
                  correctAnswerId: 'a1',
                  answers: [{ id: 'a1', text: 'Biển A' }]
                }
              ]
            }
          ]
        }
      ]
    };

    // 1. Lần mở đầu tiên (Online): Tải từ D1 và lưu xuống Offline Storage
    let memoryStore: any[] = [];
    vi.spyOn(offlineService, 'getLicensesOffline').mockImplementation(async () => memoryStore);
    vi.spyOn(offlineService, 'saveLicensesOffline').mockImplementation(async (lics) => {
      memoryStore = lics;
    });
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockResolvedValue(initialSnapshot as any);
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue({
      isMaintenanceWeb: false,
      free_user: { limit: 25 }
    });

    const firstLoadLicenses = await fetchLicenses();
    const firstLoadConfig = await getUsageConfig();
    expect(firstLoadLicenses).toHaveLength(1);
    expect(firstLoadConfig.free_user.limit).toBe(25);

    // 2. Giả lập mất mạng hoàn toàn (Offline Mode): Mọi cuộc gọi mạng đều ném lỗi
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockRejectedValue(new Error('Network Disconnected'));
    vi.spyOn(d1Client, 'fetchMetaVersion').mockResolvedValue(null);
    vi.spyOn(d1Client, 'fetchD1Config').mockResolvedValue(null);

    const offlineLicenses = await fetchLicenses();
    const offlineConfig = await getUsageConfig();
    const imageUrls = extractAllQuestionImageUrls(offlineLicenses, 'https://cdn.tndnb.vn');

    expect(offlineLicenses).toHaveLength(1);
    expect(offlineLicenses[0].id).toBe('thuyentruong-h1');
    expect(offlineConfig.free_user.limit).toBe(25);
    expect(imageUrls).toEqual(['https://cdn.tndnb.vn/question-images/t1_luat_q67.png']);
  });
});
