import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchMetaVersion, fetchQuestionsSnapshot, fetchD1Config } from '../d1Client';

describe('d1Client Service (Cloudflare Worker API Client)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetchMetaVersion gọi đúng endpoint /api/v1/meta/version và trả về dữ liệu', async () => {
    const mockMeta = {
      id: 'questions_bank',
      version: 3,
      contentHash: 'hash-abc',
      totalQuestions: 900,
      updatedAt: 1762240000000
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockMeta
      })
    );

    const res = await fetchMetaVersion();
    expect(res).toEqual(mockMeta);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/meta/version'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('fetchQuestionsSnapshot ném lỗi rõ ràng khi HTTP status !== 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503
      })
    );

    await expect(fetchQuestionsSnapshot()).rejects.toThrow('D1 Snapshot HTTP 503');
  });

  it('fetchD1Config trả về null khi gặp 404 hoặc mất mạng', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      })
    );

    const cfg = await fetchD1Config('usage_config');
    expect(cfg).toBeNull();
  });
});
