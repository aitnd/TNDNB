import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import nextConfig from '../next.config.mjs';

describe('Root Portal Monorepo Split-Deployment Config', () => {
  it('root package.json có script build:portal độc lập cho Vercel và build:ontap:cf cho Cloudflare Pages', () => {
    const pkgPath = path.resolve(process.cwd(), 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.scripts['build:portal']).toBe('next build');
    expect(pkg.scripts['build:ontap:cf']).toContain('CF_PAGES=1');
  });

  it('next.config.mjs trả về destination /ontap/index.html khi chưa đặt NEXT_PUBLIC_ONTAP_STANDALONE_URL', async () => {
    delete process.env.NEXT_PUBLIC_ONTAP_STANDALONE_URL;
    const rules = await nextConfig.rewrites!();
    const ontapRule = (rules as any[]).find((r: any) => r.source === '/ontap/:path*');
    expect(ontapRule.destination).toBe('/ontap/index.html');
  });

  it('next.config.mjs tự động proxy/rewrite sang Cloudflare Pages domain khi đặt NEXT_PUBLIC_ONTAP_STANDALONE_URL', async () => {
    process.env.NEXT_PUBLIC_ONTAP_STANDALONE_URL = 'https://ontap.tndnb.vn/';
    const rules = await nextConfig.rewrites!();
    const ontapRule = (rules as any[]).find((r: any) => r.source === '/ontap/:path*');
    expect(ontapRule.destination).toBe('https://ontap.tndnb.vn/ontap/:path*');
    delete process.env.NEXT_PUBLIC_ONTAP_STANDALONE_URL;
  });
});
