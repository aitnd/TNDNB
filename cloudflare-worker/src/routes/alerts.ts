import { WorkerEnv } from '../types';

export async function handleAlertsRoutes(
  request: Request,
  env: WorkerEnv,
  corsHeaders: Record<string, string>
): Promise<Response> {
  return new Response(
    JSON.stringify({ message: 'Alerts routes not implemented yet' }),
    {
      status: 501,
      headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    }
  );
}
