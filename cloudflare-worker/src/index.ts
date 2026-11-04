import { WorkerEnv } from './types';
import { buildCorsHeaders } from './middleware/auth';
import { handleQuestionsRoutes } from './routes/questions';
import { handleConfigRoutes } from './routes/config';
import { handleAlertsRoutes } from './routes/alerts';
import { handleReleasesProxyRoutes } from './routes/releasesProxy';

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

      if (pathname.startsWith('/releases/')) {
        return await handleReleasesProxyRoutes(request, env, corsHeaders, ctx);
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
