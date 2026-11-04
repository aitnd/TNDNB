import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleReleasesProxyRoutes } from '../src/routes/releasesProxy';

describe('Cloudflare Worker Releases CDN Proxy & R2 Fallback Switch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('Mode github_proxy: GET /releases/download/latest.yml proxy tới GitHub Releases và đính kèm Cache-Control s-maxage=60', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('version: 3.21.0\npath: Onthi-3.21.0-x64-Setup.exe\n', {
          status: 200,
          headers: { 'Content-Type': 'text/yaml' }
        })
      )
    );

    const env: any = {
      GITHUB_OWNER: 'aitnd',
      GITHUB_REPO: 'TNDNB',
      RELEASE_UPSTREAM_MODE: 'github_proxy'
    };

    const req = new Request('https://api.tndnb.vn/releases/download/latest.yml');
    const res = await handleReleasesProxyRoutes(req, env, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=60');
    const text = await res.text();
    expect(text).toContain('version: 3.21.0');
    expect(fetch).toHaveBeenCalledWith(
      'https://github.com/aitnd/TNDNB/releases/latest/download/latest.yml',
      expect.objectContaining({ redirect: 'follow' })
    );
  });

  it('Mode r2_direct (Fallback): GET /releases/download/latest.yml đọc trực tiếp từ R2 Bucket ASSETS_BUCKET', async () => {
    const mockR2Bucket: any = {
      get: vi.fn().mockResolvedValue({
        body: 'version: 3.21.0-r2\n',
        size: 19,
        etag: 'etag-r2-1'
      })
    };

    const env: any = {
      GITHUB_OWNER: 'aitnd',
      GITHUB_REPO: 'TNDNB',
      RELEASE_UPSTREAM_MODE: 'r2_direct',
      ASSETS_BUCKET: mockR2Bucket
    };

    const req = new Request('https://api.tndnb.vn/releases/download/latest.yml');
    const res = await handleReleasesProxyRoutes(req, env, {});
    expect(res.status).toBe(200);
    expect(mockR2Bucket.get).toHaveBeenCalledWith('releases/latest.yml');
    expect(await res.text()).toBe('version: 3.21.0-r2\n');
  });

  it('GET /releases/list proxy GitHub Releases API và rewrite browser_download_url sang worker domain', async () => {
    const mockGitHubReleases = [
      {
        tag_name: 'v3.21.0',
        assets: [
          {
            name: 'Onthi-Setup-3.21.0.exe',
            browser_download_url: 'https://github.com/aitnd/TNDNB/releases/download/v3.21.0/Onthi-Setup-3.21.0.exe'
          }
        ]
      }
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockGitHubReleases), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );

    const env: any = {
      GITHUB_OWNER: 'aitnd',
      GITHUB_REPO: 'TNDNB',
      RELEASE_UPSTREAM_MODE: 'github_proxy'
    };

    const req = new Request('https://api.tndnb.vn/releases/list');
    const res = await handleReleasesProxyRoutes(req, env, {});
    expect(res.status).toBe(200);
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=60');
    const data: any = await res.json();
    expect(data[0].assets[0].browser_download_url).toBe(
      'https://api.tndnb.vn/releases/download/Onthi-Setup-3.21.0.exe'
    );
  });
});
