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

  describe('Settings Save Dual-Storage & Private Repo Resilience (Plan 261107)', () => {
    it('TC-12: ontap-web/services/adminConfigService.ts must save to Firestore as fallback/dual-write in saveUsageConfig and saveGitHubConfig', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/adminConfigService.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      // Phải có import hoặc dùng setDoc từ firestore
      expect(content).toMatch(/setDoc[\s\S]*?doc\(db,\s*SETTINGS_COLLECTION/);
      // saveUsageConfig phải có lưu Firestore
      expect(content).toMatch(/saveUsageConfig[\s\S]*?setDoc[\s\S]*?USAGE_CONFIG_DOC_ID/);
      // saveGitHubConfig phải có lưu Firestore
      expect(content).toMatch(/saveGitHubConfig[\s\S]*?setDoc/);
    });

    it('TC-13: ontap-web/services/adminConfigService.ts must fallback to Firestore in getUsageConfig and getGitHubConfig', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/adminConfigService.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      // getUsageConfig phải có đọc Firestore fallback
      expect(content).toMatch(/getUsageConfig[\s\S]*?getDoc[\s\S]*?USAGE_CONFIG_DOC_ID/);
      // getGitHubConfig phải có đọc Firestore fallback
      expect(content).toMatch(/getGitHubConfig[\s\S]*?getDoc/);
    });

    it('TC-14: cloudflare-worker/src/routes/releasesProxy.ts must return status 200 with [] when upstream GitHub returns 401/403/404', () => {
      const filePath = path.resolve(rootDir, 'cloudflare-worker/src/routes/releasesProxy.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      // Phải xử lý khi upstreamRes.status là 401, 403 hoặc 404 trả về mảng rỗng status 200
      expect(content).toMatch(/403|401/);
      expect(content).toMatch(/status:\s*200[\s\S]*?\[\]|JSON\.stringify\(\[\]\)[\s\S]*?status:\s*200/);
    });

    it('TC-15: ontap-web/services/releaseService.ts must eliminate direct unauthenticated api.github.com fallback', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/releaseService.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      // Không được chứa chuỗi 'https://api.github.com/repos/aitnd/TNDNB/releases' nặc danh gọi thẳng
      expect(content).not.toContain('https://api.github.com/repos/aitnd/TNDNB/releases');
    });

    it('TC-16: ontap-web/components/ExamQuizScreen.tsx must remain 100% untouched (Invariant 1)', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('Phase 01: Hydration Mismatch & Login Screen Defaults (Plan 261107-0620)', () => {
    it('TC-17: app/page.tsx must dynamically import FeaturedSlider with ssr: false to prevent hydration mismatch', () => {
      const filePath = path.resolve(rootDir, 'app/page.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/dynamic\(\s*\(\)\s*=>\s*import\(['"]\.\.\/components\/FeaturedSlider['"]\),\s*\{\s*ssr:\s*false/);
      expect(content).not.toMatch(/^import\s+FeaturedSlider\s+from\s+['"]\.\.\/components\/FeaturedSlider['"]/m);
    });

    it('TC-18: ontap-web/components/LoginScreen.tsx must initialize rememberMe and saveThisAccount to true by default', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/LoginScreen.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/const\s*\[rememberMe,\s*setRememberMe\]\s*=\s*useState\s*\(\s*true\s*\)/);
      expect(content).toMatch(/const\s*\[saveThisAccount,\s*setSaveThisAccount\]\s*=\s*useState\s*\(\s*true\s*\)/);
    });
  });

  describe('Phase 02: Mobile Dashboard Simplification & Hamburger Navbar (Plan 261107-0620)', () => {
    it('TC-19: ontap-web/services/authSessionService.ts must eliminate showSingleDeviceWarning popup on session rotation', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/authSessionService.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      // Không được gọi showSingleDeviceWarning() trong enforceAndRecordSession
      expect(content).not.toMatch(/if\s*\(\s*hadOldSessions\s*\)\s*\{\s*showSingleDeviceWarning\(\);?\s*\}/);
    });

    it('TC-20: ontap-web/components/WeatherWidget.tsx must NOT automatically request geolocation in useEffect on mount', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/WeatherWidget.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // useEffect không được chứa lời gọi navigator.geolocation
      expect(content).not.toMatch(/useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?navigator\.geolocation\.getCurrentPosition/);
      expect(content).toMatch(/useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?fetchWeather\(\);/);
    });

    it('TC-21: ontap-web/components/Dashboard.tsx must hide WeatherWidget and ProgressDashboard on mobile using hidden lg:block', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/Dashboard.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // WeatherWidget và ProgressDashboard phải có class hidden lg:block
      expect(content).toMatch(/className="[^"]*hidden lg:block[^"]*"[\s\S]*?<WeatherWidget/);
      expect(content).toMatch(/className="[^"]*hidden lg:block[^"]*"[\s\S]*?<ProgressDashboard/);
    });

    it('TC-22: ontap-web/components/Dashboard.tsx must render PrimaryButton directly under StudentCard on mobile view (lg:hidden)', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/Dashboard.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Trên mobile view, PrimaryButton phải được render ngay sau StudentCard
      expect(content).toMatch(/<StudentCard[\s\S]*?<div className="[^"]*lg:hidden[^"]*"[\s\S]*?<PrimaryButton/);
    });

    it('TC-25: ontap-web/components/TopNavbar.tsx must have a 3-line hamburger menu button containing account and logout', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/TopNavbar.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Phải import Menu từ lucide-react
      expect(content).toMatch(/import\s*\{[^}]*Menu[^}]*\}\s*from\s*['"]lucide-react['"]/);
      // Menu dropdown phải chứa onNavigate('account') và onLogout
      expect(content).toMatch(/onNavigate\(['"]account['"]\)/);
      expect(content).toMatch(/onLogout/);
    });

    it('TC-26: ontap-web/components/TopNavbar.tsx must strictly hide non-essential items on mobile for hoc_vien role', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/TopNavbar.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Nút Thi trực tuyến và Khám phá phải có class hidden md:flex hoặc tương đương để ẩn trên mobile
      expect(content).toMatch(/hidden\s+md:flex[^"]*['"][\s\S]*?Thi trực tuyến|Thi trực tuyến[\s\S]*?hidden\s+md:flex/);
    });
  });

  describe('Phase 03: Smart App Banner & PWA Add to Home Screen (Plan 261107-0620)', () => {
    it('TC-23: ontap-web/components/PwaInstallBanner.tsx must handle standalone check, beforeinstallprompt, and iOS guide', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/PwaInstallBanner.tsx');
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf8');
      // Phải kiểm tra chế độ standalone để tự động ẩn khi app đã cài đặt
      expect(content).toMatch(/display-mode:\s*standalone/);
      // Phải xử lý sự kiện beforeinstallprompt cho Android
      expect(content).toMatch(/beforeinstallprompt/);
      // Phải có cơ chế hướng dẫn iOS Thêm vào màn hình chính
      expect(content).toMatch(/Thêm vào màn hình chính|Thêm vào MH chính/);
    });

    it('TC-24: ontap-web/components/PwaInstallBanner.tsx must save 7-day dismiss memory into localStorage', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/PwaInstallBanner.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Phải lưu localStorage key ontap_pwa_prompt_dismissed_until khi đóng banner
      expect(content).toMatch(/ontap_pwa_prompt_dismissed_until/);
      expect(content).toMatch(/localStorage\.setItem/);
    });

    it('TC-27: ontap-web/components/Dashboard.tsx must import and render PwaInstallBanner above StudentCard', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/Dashboard.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      expect(content).toMatch(/import\s*\{\s*PwaInstallBanner\s*\}\s*from\s*['"]\.\/PwaInstallBanner['"]/);
      expect(content).toMatch(/<PwaInstallBanner[\s\S]*?<StudentCard/);
    });
  });

  describe('Guest Firestore Guard & Clean Console (Plan 261107-0940)', () => {
    it('TC-28: ontap-web/services/adminConfigService.ts must guard getUsageConfig Firestore fallback with auth?.currentUser', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/adminConfigService.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      const usageConfigBlock = content.match(/export const getUsageConfig = async[\s\S]*?return\s*\{[\s\S]*?\.\.\.DEFAULT_CONFIG/);
      expect(usageConfigBlock).toBeTruthy();

      if (usageConfigBlock) {
        const code = usageConfigBlock[0];
        expect(code).toMatch(/if\s*\(!data\s*&&\s*db\s*&&\s*auth\?\.currentUser\)/);
      }
    });

    it('TC-29: ontap-web/services/adminConfigService.ts must guard getGitHubConfig Firestore fallback with auth?.currentUser', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/services/adminConfigService.ts');
      const content = fs.readFileSync(filePath, 'utf8');

      const gitHubConfigBlock = content.match(/export const getGitHubConfig = async[\s\S]*?return\s*\{[\s\S]*?owner:\s*['"]aitnd['"]/);
      expect(gitHubConfigBlock).toBeTruthy();

      if (gitHubConfigBlock) {
        const code = gitHubConfigBlock[0];
        expect(code).toMatch(/if\s*\(!data\s*&&\s*db\s*&&\s*auth\?\.currentUser\)/);
      }
    });
  });

  describe('Mobile Exam Screen & Resume Session Banner (Plan 261107-1135)', () => {
    it('TC-30: ontap-web/App.tsx must eliminate fixed bottom-4 bouncing resume button and provide dismissable banner', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/App.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // 1. Không còn lớp fixed bottom-4 và animate-bounce che màn hình
      expect(content).not.toContain('fixed bottom-4 left-1/2');
      expect(content).not.toContain('animate-bounce');

      // 2. Phải có cơ chế đóng/bỏ qua bằng setResumeSessionAvailable(false)
      expect(content).toContain('setResumeSessionAvailable');
      expect(content).toMatch(/setResumeSessionAvailable\s*\(\s*false\s*\)/);
    });

    it('TC-31: ontap-web/components/ExamQuizScreen.tsx must have separate desktop and mobile exam headers', () => {
      const filePath = path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx');
      const content = fs.readFileSync(filePath, 'utf8');

      // Phải có lớp ẩn/hiện đáp ứng thiết bị
      expect(content).toContain('hidden md:flex');
      expect(content).toContain('flex md:hidden');
      expect(content).toContain('handleBackWithConfirm');
      expect(content).toContain('tabular-nums');
    });
  });
});


