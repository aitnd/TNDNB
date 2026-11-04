export interface DeployTargetConfig {
  target: 'cloudflare_pages' | 'vercel_embedded';
  viteBase: string;
  outDir: string;
  serviceWorkerUrl: string;
}

export function resolveDeployTargetConfig(
  env: Record<string, string | undefined> = {}
): DeployTargetConfig {
  const isCloudflarePages =
    env.CF_PAGES === '1' ||
    env.CF_PAGES === 'true' ||
    env.VITE_DEPLOY_TARGET === 'cloudflare';

  if (isCloudflarePages) {
    return {
      target: 'cloudflare_pages',
      viteBase: '/',
      outDir: 'dist',
      serviceWorkerUrl: '/sw-pwa.js'
    };
  }

  return {
    target: 'vercel_embedded',
    viteBase: '/ontap/',
    outDir: '../public/ontap',
    serviceWorkerUrl: '/ontap/sw-pwa.js'
  };
}

export function getRuntimeServiceWorkerUrl(): string {
  const metaEnv = (import.meta as any).env || {};
  if (
    metaEnv.VITE_DEPLOY_TARGET === 'cloudflare' ||
    metaEnv.BASE_URL === '/'
  ) {
    return '/sw-pwa.js';
  }
  return '/ontap/sw-pwa.js';
}
