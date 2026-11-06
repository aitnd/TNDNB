import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');

describe('Console Errors & TinyMCE License Fixes (TDD Suite)', () => {
  describe('Phase 01: TinyMCE GPL License & Clean Plugins', () => {
    it('TC-01: app/quan-ly/dang-bai/tao-moi/page.tsx must have license_key: "gpl", promotion: false, and no duplicate plugins', () => {
      const filePath = path.resolve(rootDir, 'app/quan-ly/dang-bai/tao-moi/page.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Phải có license_key: 'gpl'
      expect(content).toMatch(/license_key:\s*['"]gpl['"]/);
      // Phải có promotion: false
      expect(content).toMatch(/promotion:\s*false/);

      // Trích xuất mảng plugins trong init={{ ... }}
      const initMatch = content.match(/init=\{\{[\s\S]*?plugins:\s*\[([\s\S]*?)\]/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        const pluginsStr = initMatch[1];
        const pluginItems = pluginsStr
          .split(',')
          .map(s => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);

        const codeCount = pluginItems.filter(p => p === 'code').length;
        const imageCount = pluginItems.filter(p => p === 'image').length;

        expect(codeCount).toBe(1);
        expect(imageCount).toBe(1);
      }
    });

    it('TC-02: app/quan-ly/dang-bai/sua/[postId]/page.tsx must have license_key: "gpl", promotion: false, and no duplicate plugins', () => {
      const filePath = path.resolve(rootDir, 'app/quan-ly/dang-bai/sua/[postId]/page.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/license_key:\s*['"]gpl['"]/);
      expect(content).toMatch(/promotion:\s*false/);

      const initMatch = content.match(/init=\{\{[\s\S]*?plugins:\s*\[([\s\S]*?)\]/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        const pluginsStr = initMatch[1];
        const pluginItems = pluginsStr
          .split(',')
          .map(s => s.trim().replace(/['"]/g, ''))
          .filter(Boolean);

        const codeCount = pluginItems.filter(p => p === 'code').length;
        const imageCount = pluginItems.filter(p => p === 'image').length;

        expect(codeCount).toBe(1);
        expect(imageCount).toBe(1);
      }
    });
  });

  describe('Phase 02: AuthContext Supabase setSession Elimination', () => {
    it('TC-03: context/AuthContext.tsx must NOT call supabase.auth.setSession', () => {
      const filePath = path.resolve(rootDir, 'context/AuthContext.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).not.toContain('supabase.auth.setSession');
      expect(content).not.toContain('LỖI KHI SETSESSION SUPABASE');
    });
  });

  describe('Phase 03: Footer Route Fix & Next.js Redirect', () => {
    it('TC-04: components/Footer.tsx must link to /tu-van-nghe-nghiep and NOT /tuyen-dung', () => {
      const filePath = path.resolve(rootDir, 'components/Footer.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('href="/tu-van-nghe-nghiep"');
      expect(content).not.toMatch(/href=['"]\/tuyen-dung['"]/);
    });

    it('TC-05: next.config.mjs must contain permanent redirect from /tuyen-dung to /danh-muc/gioi-thieu-viec-lam', () => {
      const filePath = path.resolve(rootDir, 'next.config.mjs');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/source:\s*['"]\/tuyen-dung['"]/);
      expect(content).toMatch(/destination:\s*['"]\/danh-muc\/gioi-thieu-viec-lam['"]/);
      expect(content).toMatch(/permanent:\s*true/);
    });
  });

  describe('Phase 05: Cloudflare Worker API & CDN Image Standardization', () => {
    it('TC-06: ontap-web/services/d1Client.ts must fallback to https://api.daotaothuyenvien.com', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/d1Client.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('https://api.daotaothuyenvien.com');
      expect(content).toMatch(/getCloudflareApiBase[\s\S]*?https:\/\/api\.daotaothuyenvien\.com/);
    });

    it('TC-07: ontap-web/utils/imageHelper.ts must fallback to https://cdn.daotaothuyenvien.com and sanitize supabase.co links', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/utils/imageHelper.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toContain('https://cdn.daotaothuyenvien.com');
      expect(content).toMatch(/getR2PublicBaseUrl[\s\S]*?https:\/\/cdn\.daotaothuyenvien\.com/);
      expect(content).toMatch(/supabase\.co/);
    });

    it('TC-08: next.config.mjs must rewrite /api/v1/:path* to https://api.daotaothuyenvien.com/api/v1/:path*', () => {
      const filePath = path.resolve(rootDir, 'next.config.mjs');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/source:\s*['"]\/api\/v1\/:path\*['"]/);
      expect(content).toMatch(/destination:\s*['"]https:\/\/api\.daotaothuyenvien\.com\/api\/v1\/:path\*['"]/);
    });

    it('TC-09: cloudflare-worker/wrangler.toml must configure FIREBASE_PROJECT_ID = "thi-tnd"', () => {
      const filePath = path.resolve(rootDir, 'cloudflare-worker/wrangler.toml');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/FIREBASE_PROJECT_ID\s*=\s*["']thi-tnd["']/);
      expect(content).not.toMatch(/FIREBASE_PROJECT_ID\s*=\s*["']tndnb-prod["']/);
    });

    it('TC-10: cloudflare-worker auth & config must support Firebase ID Token and return 200 on null KV key', () => {
      const authPath = path.resolve(rootDir, 'cloudflare-worker/src/middleware/auth.ts');
      const authContent = fs.readFileSync(authPath, 'utf8');

      // verifyAdminAuthorization phải hỗ trợ Firebase ID Token hoặc verifyPortalUploadAuth logic
      expect(authContent).toMatch(/verifyAdminAuthorization[\s\S]*?(securetoken\.google\.com|verifyPortalUploadAuth|env\.FIREBASE_PROJECT_ID)/);

      const configPath = path.resolve(rootDir, 'cloudflare-worker/src/routes/config.ts');
      const configContent = fs.readFileSync(configPath, 'utf8');

      // Khi val === null trong GET, phải trả về status 200 (không được trả về status 404 gây đỏ console)
      expect(configContent).not.toMatch(/if\s*\(\s*val\s*===\s*null\s*\)\s*\{\s*return\s+new\s+Response\([\s\S]*?status:\s*404/);
      expect(configContent).toMatch(/if\s*\(\s*val\s*===\s*null\s*\)\s*\{\s*return\s+new\s+Response\([\s\S]*?status:\s*200/);
    });

    it('TC-11: ontap-web dataService & offlineService must normalize question images to cdn.daotaothuyenvien.com', () => {
      const dataServicePath = path.resolve(rootDir, 'ontap-web/services/dataService.ts');
      const dataServiceContent = fs.readFileSync(dataServicePath, 'utf8');

      expect(dataServiceContent).toMatch(/cdn\.daotaothuyenvien\.com\/question-images/);

      const offlineServicePath = path.resolve(rootDir, 'ontap-web/services/offlineService.ts');
      const offlineServiceContent = fs.readFileSync(offlineServicePath, 'utf8');

      expect(offlineServiceContent).toMatch(/cdn\.daotaothuyenvien\.com\/question-images|sanitize|normalize/);
    });
  });
});
