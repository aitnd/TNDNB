import { WorkerEnv } from '../types';

interface UpstreamReleaseAsset {
  name: string;
  browser_download_url?: string;
  [key: string]: unknown;
}

interface UpstreamRelease {
  tag_name?: string;
  assets?: UpstreamReleaseAsset[];
  [key: string]: unknown;
}

export async function handleReleasesProxyRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>,
  _ctx?: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const { pathname } = url;
  const owner = env.GITHUB_OWNER || 'aitnd';
  const repo = env.GITHUB_REPO || 'TNDNB';
  const mode = env.RELEASE_UPSTREAM_MODE || 'github_proxy';

  // 1. Endpoint GET /releases/list (Thay thế gọi trực tiếp api.github.com/repos/aitnd/TNDNB/releases)
  if (pathname === '/releases/list' && request.method === 'GET') {
    const ghHeaders: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'TNDNB-Edge-Proxy/1.0'
    };
    if (env.GITHUB_TOKEN) {
      ghHeaders['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
    }

    const upstreamRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases`,
      { headers: ghHeaders }
    );

    if (!upstreamRes.ok) {
      return new Response(JSON.stringify({ error: 'Upstream GitHub API error' }), {
        status: upstreamRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const rawReleases = (await upstreamRes.json()) as UpstreamRelease[];
    const rewritten = rawReleases.map((rel) => ({
      ...rel,
      assets: Array.isArray(rel.assets)
        ? rel.assets.map((asset) => ({
            ...asset,
            browser_download_url: `${url.origin}/releases/download/${encodeURIComponent(asset.name)}`
          }))
        : []
    }));

    return new Response(JSON.stringify(rewritten), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  }

  // 2. Endpoint GET/HEAD /releases/download/:filename (Phục vụ electron-updater generic provider)
  if (pathname.startsWith('/releases/download/')) {
    const filename = decodeURIComponent(pathname.replace('/releases/download/', ''));
    if (!filename || filename.includes('..')) {
      return new Response('Invalid filename', { status: 400, headers: corsHeaders });
    }

    const isMetadataYml = filename.endsWith('.yml') || filename.endsWith('.yaml');
    const cacheControl = isMetadataYml
      ? 'public, s-maxage=60, stale-while-revalidate=120'
      : 'public, max-age=604800, s-maxage=604800, immutable';

    // Chế độ Fallback 1 chạm: Đọc trực tiếp từ Cloudflare R2 Bucket
    if (mode === 'r2_direct' && env.ASSETS_BUCKET) {
      const r2Key = `releases/${filename}`;
      const r2Object = await env.ASSETS_BUCKET.get(r2Key);
      if (!r2Object) {
        return new Response('Release artifact not found in R2', {
          status: 404,
          headers: corsHeaders
        });
      }

      return new Response(r2Object.body as any, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': isMetadataYml ? 'text/yaml; charset=utf-8' : 'application/octet-stream',
          'Content-Length': String(r2Object.size),
          ETag: r2Object.etag,
          'Accept-Ranges': 'bytes',
          'Cache-Control': cacheControl,
          'X-Release-Source': 'cloudflare-r2'
        }
      });
    }

    // Chế độ mặc định (Phương án 2): Proxy qua Cloudflare Edge từ GitHub Releases
    const targetUrl = `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(filename)}`;
    const proxyHeaders: Record<string, string> = {
      'User-Agent': 'TNDNB-Electron-Updater-Proxy/1.0'
    };
    const rangeHeader = request.headers.get('Range');
    if (rangeHeader) {
      proxyHeaders['Range'] = rangeHeader;
    }

    const ghResponse = await fetch(targetUrl, {
      method: request.method,
      headers: proxyHeaders,
      redirect: 'follow'
    });

    if (!ghResponse.ok && ghResponse.status !== 206) {
      return new Response(`Upstream error ${ghResponse.status}`, {
        status: ghResponse.status,
        headers: corsHeaders
      });
    }

    const responseHeaders = new Headers(corsHeaders);
    responseHeaders.set('Cache-Control', cacheControl);
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('X-Release-Source', 'github-edge-proxy');

    const contentLength = ghResponse.headers.get('Content-Length');
    if (contentLength) responseHeaders.set('Content-Length', contentLength);
    const contentRange = ghResponse.headers.get('Content-Range');
    if (contentRange) responseHeaders.set('Content-Range', contentRange);
    const contentType = ghResponse.headers.get('Content-Type');
    if (contentType) responseHeaders.set('Content-Type', contentType);

    return new Response(ghResponse.body, {
      status: ghResponse.status,
      headers: responseHeaders
    });
  }

  return new Response('Not Found', { status: 404, headers: corsHeaders });
}
