import { WorkerEnv } from '../types';
import { verifyAdminAuthorization } from '../middleware/auth';

export async function handleAlertsRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const url = new URL(request.url);
  const isMarqueeOnly = url.searchParams.get('marquee') === 'true';
  const roleFilter = url.searchParams.get('role') || '';
  const userId = url.searchParams.get('userId') || '';

  if (request.method === 'GET') {
    const res = await env.DB.prepare(
      `SELECT * FROM alerts ORDER BY created_at DESC LIMIT 50`
    ).all();

    const now = Date.now();
    const rows = res.results || [];
    const filtered = rows
      .map((r: any) => {
        const targetRoles: string[] = JSON.parse(r.target_roles_json || '[]');
        const readBy: string[] = JSON.parse(r.read_by_json || '[]');
        const deletedBy: string[] = JSON.parse(r.deleted_by_json || '[]');
        return {
          id: r.id,
          title: r.title,
          message: r.message,
          type: r.type,
          targetType: r.target_type,
          targetId: r.target_id,
          targetName: r.target_name,
          targetRoles,
          senderId: r.sender_id,
          senderName: r.sender_name || 'Hệ thống',
          createdAt: { seconds: Math.floor(Number(r.created_at) / 1000) },
          expiryDate: r.expiry_date ? { seconds: Math.floor(Number(r.expiry_date) / 1000) } : null,
          _rawExpiryMs: r.expiry_date ? Number(r.expiry_date) : null,
          read: userId ? readBy.includes(userId) : false,
          readBy,
          deletedBy
        };
      })
      .filter((item) => {
        if (userId && item.deletedBy.includes(userId)) return false;
        if (item.targetRoles.length > 0 && roleFilter && !item.targetRoles.includes(roleFilter)) {
          return false;
        }
        if (isMarqueeOnly) {
          if (item.type !== 'special' && item.type !== 'attention') return false;
          if (item._rawExpiryMs && item._rawExpiryMs <= now) return false;
        }
        return true;
      });

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    });
  }

  if (request.method === 'POST') {
    if (!verifyAdminAuthorization(request.headers.get('Authorization'), env.ADMIN_API_SECRET)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    const payload: any = await request.json();
    const id = payload.id || `alert_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();
    await env.DB.prepare(
      `INSERT INTO alerts (id, title, message, type, target_type, target_id, target_name, target_roles_json, sender_id, sender_name, created_at, expiry_date, read_by_json, deleted_by_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', '[]')`
    )
      .bind(
        id,
        payload.title,
        payload.message,
        payload.type || 'attention',
        payload.targetType || 'all',
        payload.targetId || null,
        payload.targetName || null,
        JSON.stringify(payload.targetRoles || []),
        payload.senderId || 'admin',
        payload.senderName || 'Hệ thống',
        now,
        payload.expiryDateMs || null
      )
      .run();

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  if (request.method === 'DELETE') {
    if (!verifyAdminAuthorization(request.headers.get('Authorization'), env.ADMIN_API_SECRET)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400, headers: corsHeaders });
    }
    await env.DB.prepare(`DELETE FROM alerts WHERE id = ?`).bind(id).run();
    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
  });
}
