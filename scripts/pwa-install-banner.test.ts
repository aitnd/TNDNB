import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Global PWA Install Banner & App Branding "Giáo dục Ninh Bình" (Phase 04 Verification)', () => {
  const rootDir = process.cwd();

  it('TC-CP07: manifest.json và public/ontap/manifest.json đổi tên ứng dụng thành "Giáo dục Ninh Bình"', () => {
    const webManifest = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'ontap-web/public/manifest.json'), 'utf8'));
    const portalManifest = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'public/ontap/manifest.json'), 'utf8'));

    expect(webManifest.name).toBe('Giáo dục Ninh Bình');
    expect(webManifest.short_name).toBe('Giáo dục Ninh Bình');
    expect(portalManifest.name).toBe('Giáo dục Ninh Bình');
    expect(portalManifest.short_name).toBe('Giáo dục Ninh Bình');
  });

  it('TC-CP08: ontap-web/index.html có đầy đủ meta tags PWA cho iOS & Android với tên "Giáo dục Ninh Bình"', () => {
    const htmlCode = fs.readFileSync(path.resolve(rootDir, 'ontap-web/index.html'), 'utf8');

    expect(htmlCode).toContain('apple-mobile-web-app-title" content="Giáo dục Ninh Bình"');
    expect(htmlCode).toContain('application-name" content="Giáo dục Ninh Bình"');
    expect(htmlCode).toContain('apple-mobile-web-app-capable" content="yes"');
    expect(htmlCode).toContain('apple-touch-icon');
  });

  it('TC-CP09: PwaInstallBanner được tích hợp vào WelcomeModal, LicenseSelectionScreen và Dashboard', () => {
    const welcomeModal = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/WelcomeModal.tsx'), 'utf8');
    const licenseSelect = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/LicenseSelectionScreen.tsx'), 'utf8');
    const dashboard = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/Dashboard.tsx'), 'utf8');

    expect(welcomeModal).toContain('PwaInstallBanner');
    expect(licenseSelect).toContain('PwaInstallBanner');
    expect(dashboard).toContain('PwaInstallBanner');
  });

  it('TC-CP10: PwaInstallBanner TUYỆT ĐỐI không được gắn vào ExamQuizScreen và QuizScreen để tránh phân tâm thi cử', () => {
    const examQuiz = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/ExamQuizScreen.tsx'), 'utf8');
    const practiceQuiz = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/QuizScreen.tsx'), 'utf8');

    expect(examQuiz).not.toContain('PwaInstallBanner');
    expect(practiceQuiz).not.toContain('PwaInstallBanner');
  });

  it('TC-CP11: PwaInstallBanner có tiêu đề "Cài đặt Giáo dục Ninh Bình vào màn hình chính" và hỗ trợ 3 luồng cài đặt', () => {
    const bannerCode = fs.readFileSync(path.resolve(rootDir, 'ontap-web/components/PwaInstallBanner.tsx'), 'utf8');
    
    expect(bannerCode).toContain('Cài đặt Giáo dục Ninh Bình vào màn hình chính');
    expect(bannerCode).toMatch(/__deferredPwaPrompt|beforeinstallprompt/);
    expect(bannerCode).toContain('Thêm vào MH chính');
    expect(bannerCode).toMatch(/Android|Hướng dẫn cài đặt|Cài đặt ứng dụng/);
  });
});
