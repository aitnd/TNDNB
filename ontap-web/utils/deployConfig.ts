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

export interface ElectronRuntimeSnapshot {
  electron?: { isElectron?: boolean };
  location?: { protocol?: string };
}

/**
 * Chỉ xác định môi trường Electron desktop khi có bridge preload `window.electron.isElectron`
 * hoặc đang chạy bằng giao thức `file:`. Không dựa vào `navigator.userAgent` để tránh nhận nhầm
 * trình duyệt / webview nhúng (IDE webview, in-app browser) đang mở URL HTTP/HTTPS.
 */
export function isElectronRuntime(win?: ElectronRuntimeSnapshot | null): boolean {
  const target =
    win ?? (typeof window !== 'undefined' ? (window as unknown as ElectronRuntimeSnapshot) : undefined);
  if (!target) return false;
  return Boolean(target.electron?.isElectron) || target.location?.protocol === 'file:';
}
