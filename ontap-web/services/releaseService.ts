import { getUsageConfig } from './adminConfigService';

export interface AppRelease {
  version: string;
  release_notes?: string;
  created_at?: string;
}

const GITHUB_API_URL = 'https://api.github.com/repos/aitnd/TNDNB/releases';

import { normalizeVersion } from '../utils/versionUtils';

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
      return data.map((rel: any) => ({
        version: normalizeVersion(rel.tag_name),
        release_notes: rel.body || 'Cập nhật hiệu suất và vá lỗi',
        created_at: rel.published_at || rel.created_at
      }));
    }
  } catch (err) {
    console.error('Error fetching github releases:', err);
  }

  // Fallback to app_links in firestore
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

