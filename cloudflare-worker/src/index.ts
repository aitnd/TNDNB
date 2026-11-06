import { WorkerEnv } from './types';
import { buildCorsHeaders } from './middleware/auth';
import { handleQuestionsRoutes } from './routes/questions';
import { handleConfigRoutes } from './routes/config';
import { handleAlertsRoutes } from './routes/alerts';
import { handleReleasesProxyRoutes } from './routes/releasesProxy';
import { handlePortalUploadRoute, detectContentType } from './routes/portalUpload';

export default {
  async fetch(request: Request, env: WorkerEnv, ctx?: ExecutionContext): Promise<Response> {
    const origin = request.headers.get('Origin');
    const corsHeaders = buildCorsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const { pathname } = url;

    try {
      if (pathname === '/api/v1/health') {
        return new Response(
          JSON.stringify({
            ok: true,
            service: 'tndnb-edge-api',
            releaseMode: env.RELEASE_UPSTREAM_MODE || 'github_proxy'
          }),
          {
            status: 200,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json; charset=utf-8'
            }
          }
        );
      }

      if (
        pathname.startsWith('/api/v1/meta/') ||
        pathname.startsWith('/api/v1/questions/') ||
        pathname.startsWith('/api/v1/licenses/')
      ) {
        return await handleQuestionsRoutes(request, env, corsHeaders);
      }

      if (pathname.startsWith('/api/v1/config/')) {
        return await handleConfigRoutes(request, env, corsHeaders);
      }

      if (pathname.startsWith('/api/v1/alerts')) {
        return await handleAlertsRoutes(request, env, corsHeaders);
      }

      if (pathname === '/api/v1/portal/upload') {
        return await handlePortalUploadRoute(request, env, corsHeaders);
      }

      if (pathname.startsWith('/releases/')) {
        return await handleReleasesProxyRoutes(request, env, corsHeaders, ctx);
      }

      if (pathname.startsWith('/portal-assets/')) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
        const key = decodeURIComponent(pathname.replace(/^\/portal-assets\//, ''));
        let object = await env.ASSETS_BUCKET.get(key);
        if (!object && !key.startsWith('portal/')) {
          object = await env.ASSETS_BUCKET.get(`portal/${key}`);
        }
        if (!object) {
          return new Response('Not Found', {
            status: 404,
            headers: corsHeaders
          });
        }
        const headers = new Headers(corsHeaders);
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        if (!headers.get('Content-Type')) {
          headers.set('Content-Type', detectContentType(key));
        }
        return new Response(request.method === 'HEAD' ? null : object.body, {
          status: 200,
          headers
        });
      }

      if (pathname.startsWith('/question-images/')) {
        if (request.method !== 'GET' && request.method !== 'HEAD') {
          return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
          });
        }
        const key = decodeURIComponent(pathname.replace(/^\/question-images\//, ''));
        let object = await env.ASSETS_BUCKET.get(key);
        if (!object) {
          object = await env.ASSETS_BUCKET.get(`question-images/${key}`);
        }
        if (!object) {
          return new Response('Not Found', {
            status: 404,
            headers: corsHeaders
          });
        }
        const headers = new Headers(corsHeaders);
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        if (!headers.get('Content-Type')) {
          if (key.endsWith('.png')) headers.set('Content-Type', 'image/png');
          else if (key.endsWith('.jpg') || key.endsWith('.jpeg')) headers.set('Content-Type', 'image/jpeg');
          else if (key.endsWith('.webp')) headers.set('Content-Type', 'image/webp');
          else if (key.endsWith('.svg')) headers.set('Content-Type', 'image/svg+xml');
        }
        return new Response(object.body, {
          status: 200,
          headers
        });
      }

      return new Response(JSON.stringify({ error: 'Not Found', path: pathname }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err?.message || 'Internal Server Error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
        }
      );
    }
  }
};
