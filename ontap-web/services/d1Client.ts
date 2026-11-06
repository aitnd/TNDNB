import type { License } from '../types';

export interface D1MetaVersion {
  id: string;
  version: number;
  contentHash: string;
  totalQuestions: number;
  updatedAt: number;
}

export interface D1QuestionsSnapshot {
  version: number;
  contentHash: string;
  updatedAt: number;
  licenses: License[];
}

export const getCloudflareApiBase = (): string => {
  const envUrl = (import.meta as any).env?.VITE_CLOUDFLARE_API_URL;
  return (envUrl || 'https://api.daotaothuyenvien.com').replace(/\/+$/, '');
};

export const isCloudflareApiConfigured = (): boolean => {
  const base = getCloudflareApiBase();
  return Boolean(base && base !== 'undefined');
};

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 2500
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchMetaVersion(): Promise<D1MetaVersion | null> {
  try {
    const res = await fetchWithTimeout(`${getCloudflareApiBase()}/api/v1/meta/version`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    return (await res.json()) as D1MetaVersion;
  } catch {
    return null;
  }
}

export async function fetchQuestionsSnapshot(): Promise<D1QuestionsSnapshot> {
  const res = await fetchWithTimeout(
    `${getCloudflareApiBase()}/api/v1/questions/snapshot`,
    {
      method: 'GET',
      headers: { Accept: 'application/json' }
    },
    10000
  );
  if (!res.ok) {
    throw new Error(`D1 Snapshot HTTP ${res.status}`);
  }
  return (await res.json()) as D1QuestionsSnapshot;
}

export async function fetchD1Config<T = any>(key: string): Promise<T | null> {
  try {
    const res = await fetchWithTimeout(`${getCloudflareApiBase()}/api/v1/config/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function saveD1Config<T = any>(
  key: string,
  data: T,
  authToken?: string
): Promise<boolean> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const res = await fetchWithTimeout(`${getCloudflareApiBase()}/api/v1/config/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchD1Alerts(params?: {
  marquee?: boolean;
  role?: string;
  userId?: string;
}): Promise<any[]> {
  try {
    const qs = new URLSearchParams();
    if (params?.marquee) qs.set('marquee', 'true');
    if (params?.role) qs.set('role', params.role);
    if (params?.userId) qs.set('userId', params.userId);
    const queryStr = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetchWithTimeout(`${getCloudflareApiBase()}/api/v1/alerts${queryStr}`, {
      method: 'GET',
      headers: { Accept: 'application/json' }
    });
    if (!res.ok) return [];
    return (await res.json()) as any[];
  } catch {
    return [];
  }
}
