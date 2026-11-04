import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isVersionLower, getGitHubReleases } from './UpdateService';
import * as adminConfigService from './adminConfigService';

vi.mock('./adminConfigService', () => ({
  getUsageConfig: vi.fn()
}));

global.fetch = vi.fn();

describe('UpdateService version sorting & comparison', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly compare versions', () => {
    expect(isVersionLower('3.19.1', '3.19.2')).toBe(true);
    expect(isVersionLower('3.19.2', '3.19.1')).toBe(false);
    expect(isVersionLower('3.19.2', '3.19.2')).toBe(false);
    expect(isVersionLower('3.18.9', '3.19.0')).toBe(true);
    expect(isVersionLower('4.0.0', '3.9.9')).toBe(false);
  });

  it('should filter draft and prerelease and sort correctly', async () => {
    const mockReleases = [
      { tag_name: 'v3.19.1', draft: false, prerelease: false },
      { tag_name: 'v3.19.3', draft: true, prerelease: false },
      { tag_name: 'v3.19.4-beta', draft: false, prerelease: true },
      { tag_name: 'v3.19.2', draft: false, prerelease: false },
      { tag_name: 'v3.20.0', draft: false, prerelease: false }
    ];

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockReleases
    });

    const releases = await getGitHubReleases();
    expect(releases).toHaveLength(3);
    // Should sort descending
    expect(releases[0].version).toBe('3.20.0');
    expect(releases[1].version).toBe('3.19.2');
    expect(releases[2].version).toBe('3.19.1');
  });

  it('should fallback to config if fetch fails', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));
    
    (adminConfigService.getUsageConfig as any).mockResolvedValue({
      app_links: { version: '3.18.0' }
    });

    const releases = await getGitHubReleases();
    expect(releases).toHaveLength(1);
    expect(releases[0].version).toBe('3.18.0');
  });
});
