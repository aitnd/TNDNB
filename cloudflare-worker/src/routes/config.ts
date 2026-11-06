import { WorkerEnv } from '../types';
import { verifyAdminAuthorization } from '../middleware/auth';

export async function handleConfigRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const key = decodeURIComponent(url.pathname.replace('/api/v1/config/', '').split('/')[0]);

  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing config key' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  if (request.method === 'GET') {
    const val = await env.CONFIG_KV.get(key);

    if (val === null) {
      return new Response(JSON.stringify(null), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    return new Response(val, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
      }
    });
  }

  if (request.method === 'PUT') {
    const isAuthorized = await verifyAdminAuthorization(
      request.headers.get('Authorization'),
      env.ADMIN_API_SECRET,
      env
    );
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const bodyObj = await request.json();
    const now = Date.now();
    await env.CONFIG_KV.put(key, JSON.stringify(bodyObj));

    return new Response(JSON.stringify({ ok: true, key, updatedAt: now }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
