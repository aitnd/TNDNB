import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as d1Client from '../d1Client';
import * as offlineService from '../offlineService';
import { fetchLicenses, syncQuestionsInBackground } from '../dataService';

const sampleLicenses = [
  {
    id: 'maytruong-h1',
    name: 'Máy trưởng H1',
    subjects: [
      {
        id: 'nvmt',
        name: 'Nghiệp vụ',
        questions: [
          {
            id: 'nvmt_1',
            text: 'Câu 1',
            image: 'https://cdn.tndnb.vn/question-images/nvmt_1.png',
            correctAnswerId: 'nvmt_1_1',
            answers: [{ id: 'nvmt_1_1', text: 'Đáp án A' }]
          }
        ]
      }
    ]
  }
];

describe('Offline-First dataService (ontap-web)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('trả về ngay dữ liệu từ IndexedDB nếu đã có cache offline (Zero-Spinner)', async () => {
    vi.spyOn(offlineService, 'getLicensesOffline').mockResolvedValue(sampleLicenses);
    vi.spyOn(offlineService, 'getLocalSyncMeta').mockReturnValue({
      version: 2,
      contentHash: 'same-hash',
      syncedAt: Date.now()
    });
    const snapshotSpy = vi.spyOn(d1Client, 'fetchQuestionsSnapshot');
    vi.spyOn(d1Client, 'fetchMetaVersion').mockResolvedValue({
      id: 'questions_bank',
      version: 2,
      contentHash: 'same-hash',
      totalQuestions: 1,
      updatedAt: Date.now()
    });

    const data = await fetchLicenses();
    expect(data).toEqual(sampleLicenses);
    expect(snapshotSpy).not.toHaveBeenCalled();
  });

  it('tải từ D1 Snapshot và lưu vào IndexedDB nếu lần đầu mở app chưa có dữ liệu local', async () => {
    vi.spyOn(offlineService, 'getLicensesOffline').mockResolvedValue([]);
    const saveSpy = vi.spyOn(offlineService, 'saveLicensesOffline').mockResolvedValue();
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockResolvedValue({
      version: 3,
      contentHash: 'new-hash-3',
      updatedAt: Date.now(),
      licenses: sampleLicenses
    });

    const data = await fetchLicenses();
    expect(data).toEqual(sampleLicenses);
    expect(saveSpy).toHaveBeenCalledWith(sampleLicenses, {
      version: 3,
      contentHash: 'new-hash-3'
    });
  });

  it('syncQuestionsInBackground tự động tải snapshot mới khi phát hiện contentHash trên D1 thay đổi', async () => {
    vi.spyOn(offlineService, 'getLocalSyncMeta').mockReturnValue({
      version: 1,
      contentHash: 'old-hash',
      syncedAt: 1000
    });
    vi.spyOn(d1Client, 'fetchMetaVersion').mockResolvedValue({
      id: 'questions_bank',
      version: 2,
      contentHash: 'updated-hash',
      totalQuestions: 1,
      updatedAt: 2000
    });
    vi.spyOn(d1Client, 'fetchQuestionsSnapshot').mockResolvedValue({
      version: 2,
      contentHash: 'updated-hash',
      updatedAt: 2000,
      licenses: sampleLicenses
    });
    const saveSpy = vi.spyOn(offlineService, 'saveLicensesOffline').mockResolvedValue();

    const updated = await syncQuestionsInBackground();
    expect(updated).toEqual(sampleLicenses);
    expect(saveSpy).toHaveBeenCalledWith(sampleLicenses, {
      version: 2,
      contentHash: 'updated-hash'
    });
  });
});
