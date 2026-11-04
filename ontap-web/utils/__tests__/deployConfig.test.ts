import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { resolveDeployTargetConfig } from '../deployConfig';

describe('Monorepo Dual-Target Deployment Config (ontap-web)', () => {
  it('trả về cấu hình Cloudflare Pages Standalone (base="/", outDir="dist") khi CF_PAGES="1" hoặc VITE_DEPLOY_TARGET="cloudflare"', () => {
    const cfConfig = resolveDeployTargetConfig({ CF_PAGES: '1' });
    expect(cfConfig).toEqual({
      target: 'cloudflare_pages',
      viteBase: '/',
      outDir: 'dist',
      serviceWorkerUrl: '/sw-pwa.js'
    });

    const explicitCf = resolveDeployTargetConfig({ VITE_DEPLOY_TARGET: 'cloudflare' });
    expect(explicitCf.target).toBe('cloudflare_pages');
    expect(explicitCf.outDir).toBe('dist');
  });

  it('trả về cấu hình Vercel Embedded mặc định (base="/ontap/", outDir="../public/ontap") khi không có cờ CF_PAGES', () => {
    const vercelConfig = resolveDeployTargetConfig({});
    expect(vercelConfig).toEqual({
      target: 'vercel_embedded',
      viteBase: '/ontap/',
      outDir: '../public/ontap',
      serviceWorkerUrl: '/ontap/sw-pwa.js'
    });
  });

  it('file public/_redirects và public/_headers tồn tại và ánh xạ đầy đủ /ontap/* + SPA fallback cho Cloudflare Pages', () => {
    const redirectsPath = path.resolve(process.cwd(), 'public/_redirects');
    const headersPath = path.resolve(process.cwd(), 'public/_headers');

    expect(fs.existsSync(redirectsPath)).toBe(true);
    expect(fs.existsSync(headersPath)).toBe(true);

    const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
    expect(redirectsContent).toContain('/ontap/sw-pwa.js /sw-pwa.js 200');
    expect(redirectsContent).toContain('/ontap/manifest.json /manifest.json 200');
    expect(redirectsContent).toContain('/* /index.html 200');

    const headersContent = fs.readFileSync(headersPath, 'utf8');
    expect(headersContent).toContain('Service-Worker-Allowed: /');
  });
});
