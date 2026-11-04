import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGitHubReleases } from '../UpdateService';

describe('UpdateService with Cloudflare Worker Release Proxy (ontap-win)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('ưu tiên gọi endpoint /releases/list trên Cloudflare Worker trước api.github.com', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          tag_name: 'v3.21.0',
          draft: false,
          prerelease: false,
          body: 'Tăng tốc CDN Cloudflare',
          published_at: '2026-11-04T00:00:00Z'
        }
      ]
    });
    vi.stubGlobal('fetch', fetchMock);

    const releases = await getGitHubReleases();
    expect(releases).toHaveLength(1);
    expect(releases[0].version).toBe('3.21.0');
    expect(fetchMock.mock.calls[0][0]).toContain('/releases/list');
  });
});
