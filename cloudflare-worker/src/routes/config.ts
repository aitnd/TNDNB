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
    const row: any = await env.DB.prepare(
      `SELECT key, value_json, updated_at FROM app_configs WHERE key = ?`
    )
      .bind(key)
      .first();

    if (!row) {
      return new Response(JSON.stringify(null), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    return new Response(row.value_json, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120'
      }
    });
  }

  if (request.method === 'PUT') {
    const isAuthorized = verifyAdminAuthorization(
      request.headers.get('Authorization'),
      env.ADMIN_API_SECRET
    );
    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const bodyObj = await request.json();
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO app_configs (key, value_json, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`
    )
      .bind(key, JSON.stringify(bodyObj), now)
      .run();

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
