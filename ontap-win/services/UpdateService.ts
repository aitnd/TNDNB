import { getUsageConfig } from './adminConfigService';
import { normalizeVersion } from '../utils/versionUtils';

export interface AppRelease {
  version: string;
  release_notes?: string;
  created_at?: string;
}

const GITHUB_API_URL = 'https://api.github.com/repos/aitnd/TNDNB/releases';

export async function getLatestAppRelease(): Promise<AppRelease | null> {
  const releases = await getGitHubReleases();
  return releases.length > 0 ? releases[0] : null;
}

export async function getGitHubReleases(): Promise<AppRelease[]> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.map((release: any) => ({
        version: normalizeVersion(release.tag_name),
        release_notes: release.body || 'Cập nhật hiệu suất và vá lỗi',
        created_at: release.published_at || release.created_at
      }));
    }
  } catch (error) {
    console.warn('Lỗi gọi API GitHub Releases trực tiếp, fallback qua config:', error);
  }

  try {
    const config = await getUsageConfig();
    if (config && config.app_links && config.app_links.version) {
      return [{
        version: config.app_links.version,
        release_notes: 'Bản cập nhật quan trọng. Vui lòng tải về phiên bản mới nhất để trải nghiệm tốt hơn.',
        created_at: new Date().toISOString()
      }];
    }
  } catch (e) {
    console.error('Error fetching fallback app_links:', e);
  }
  
  return [];
}
