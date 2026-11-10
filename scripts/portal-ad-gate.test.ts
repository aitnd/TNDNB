import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Ad Gating & Console Hygiene Suite (TDD)', () => {
  const rootDir = process.cwd();
  const adLoaderPath = path.resolve(rootDir, 'app/components/PortalAdLoader.tsx');
  const navbarPath = path.resolve(rootDir, 'components/Navbar.tsx');
  const quanLyPagePath = path.resolve(rootDir, 'app/quan-ly/page.tsx');

  describe('Phase 01: Core Ad Role & Route Gating (PortalAdLoader)', () => {
    it('TC-GATE01: PortalAdLoader must import usePathname, define isAdminRoute, and evaluate shouldAllowAds', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toMatch(/import\s*\{[^}]*usePathname[^}]*\}\s*from\s*['"]next\/navigation['"]/);
      expect(content).toMatch(/isAdminRoute\s*=\s*Boolean\(\s*pathname\?\.startsWith\(['"]\/quan-ly['"]\)\s*\|\|\s*pathname\?\.startsWith\(['"]\/login['"]\)\s*\)/);
      expect(content).toMatch(/shouldAllowAds\s*=\s*isAuthReady\s*&&\s*!isAdminRoute\s*&&\s*!isPrivilegedUser/);
    });

    it('TC-GATE02: PortalAdLoader must import useAuth, define isPrivilegedUser for admin/quan_ly/lanh_dao, and gate ads', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toMatch(/import\s*\{[^}]*useAuth[^}]*\}\s*from\s*['"](\.\.\/context\/AuthContext|\.\.\/\.\.\/context\/AuthContext)['"]/);
      expect(content).toMatch(/isPrivilegedUser\s*=\s*Boolean\(\s*user\s*&&\s*\[['"]admin['"],\s*['"]quan_ly['"],\s*['"]lanh_dao['"]\]\.includes\(user\.role\)\s*\)/);
    });

    it('TC-GATE03: PortalAdLoader must implement Auth Ready Guard to prevent FOUA when auth is loading', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toMatch(/isAuthReady\s*=\s*!authLoading/);
      expect(content).toMatch(/if\s*\(!isAuthReady\)\s*\{\s*injectHideAdSenseCompletely\(\);\s*return;\s*\}/);
    });

    it('TC-GATE04: PortalAdLoader must declare purgeAllAdSenseDomAndScripts and purge all AdSense, Adsterra, and Monetag DOM/scripts', () => {
      const content = fs.readFileSync(adLoaderPath, 'utf8');
      expect(content).toContain('purgeAllAdSenseDomAndScripts');
      expect(content).toContain('.adsbygoogle');
      expect(content).toContain('ins.adsbygoogle');
      expect(content).toContain('.google-auto-placed');
      expect(content).toContain('iframe[id^="aswift"]');
      expect(content).toContain('iframe[id^="google_ads"]');
      expect(content).toContain('#google-vignette');
      expect(content).toContain('portal-adsense-script');
      expect(content).toContain('portal-adsterra-script');
      expect(content).toContain('portal-monetag-script');
      expect(content).toContain('ADSENSE_HIDE_ALL_CSS');
    });
  });
});
