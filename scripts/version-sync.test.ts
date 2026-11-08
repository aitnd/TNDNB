import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Version Synchronization & Authoritative Changelog Verification (v3.22.0)', () => {
  const rootDir = process.cwd();

  const packageJsonPaths = [
    path.resolve(rootDir, 'package.json'),
    path.resolve(rootDir, 'ontap-web/package.json'),
    path.resolve(rootDir, 'ontap-win/package.json'),
    path.resolve(rootDir, 'cloudflare-worker/package.json'),
  ];

  const changelogPaths = [
    path.resolve(rootDir, 'CHANGELOG.md'),
    path.resolve(rootDir, 'ontap-web/CHANGELOG.md'),
    path.resolve(rootDir, 'ontap-win/CHANGELOG.md'),
    path.resolve(rootDir, 'CHANGELOG_DEV.md'),
  ];

  it('TC-VS01: tất cả 4 gói (root, ontap-web, ontap-win, cloudflare-worker) đều có version === "3.22.0"', () => {
    packageJsonPaths.forEach((pkgPath) => {
      expect(fs.existsSync(pkgPath), `File ${pkgPath} phải tồn tại`).toBe(true);
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      expect(pkg.version, `Package tại ${pkgPath} phải có version 3.22.0`).toBe('3.22.0');
    });
  });

  it('TC-VS02: tất cả 4 file CHANGELOG đều có mục ghi chú phát hành "## [3.22.0]"', () => {
    changelogPaths.forEach((logPath) => {
      expect(fs.existsSync(logPath), `File ${logPath} phải tồn tại`).toBe(true);
      const content = fs.readFileSync(logPath, 'utf8');
      expect(content, `File ${logPath} phải chứa mục ## [3.22.0]`).toContain('## [3.22.0]');
    });
  });

  it('TC-VS03: CHANGELOG.md đã khôi phục đầy đủ lịch sử với số phiên bản >= 40 và kết thúc tại 3.6.0', () => {
    const changelogContent = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    const versionMatches = changelogContent.match(/^## \[[0-9]+\.[0-9]+\.[0-9]+\]/gm);
    expect(versionMatches, 'Phải tìm thấy các phiên bản ## [x.y.z]').not.toBeNull();
    expect(versionMatches!.length, 'Số lượng phiên bản lịch sử phải đạt tối thiểu 40 phiên bản').toBeGreaterThanOrEqual(40);
    expect(changelogContent).toContain('## [3.6.0]');
  });

  it('TC-VS04: ontap-web/CHANGELOG.md và ontap-win/CHANGELOG.md phải đồng bộ 100% nội dung với CHANGELOG.md gốc', () => {
    const rootChangelog = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    const webChangelog = fs.readFileSync(path.resolve(rootDir, 'ontap-web/CHANGELOG.md'), 'utf8');
    const winChangelog = fs.readFileSync(path.resolve(rootDir, 'ontap-win/CHANGELOG.md'), 'utf8');

    expect(webChangelog, 'ontap-web/CHANGELOG.md phải khớp hoàn toàn với CHANGELOG.md').toBe(rootChangelog);
    expect(winChangelog, 'ontap-win/CHANGELOG.md phải khớp hoàn toàn với CHANGELOG.md').toBe(rootChangelog);
  });

  it('TC-VS05: CHANGELOG.md mục [3.22.0] phải chia đủ 3 section màu sắc (Tính năng, Giao diện, Sửa lỗi)', () => {
    const content = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    const v3220Section = content.split('## [3.21.0]')[0];
    expect(v3220Section).toContain('### 🌟 Tính năng mới');
    expect(v3220Section).toContain('### 🚀 Giao diện & Trải nghiệm');
    expect(v3220Section).toContain('### 🔧 Sửa lỗi & Ổn định hệ thống');
  });

  it('TC-VS06: CHANGELOG_DEV.md mục [3.22.0] phải chia đủ 4 section kỹ thuật (Kiến trúc, UI, Bảo mật, Test)', () => {
    const content = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG_DEV.md'), 'utf8');
    const v3220Section = content.split('## [3.21.0]')[0];
    expect(v3220Section).toContain('### 💻 Kiến trúc & Core Engine');
    expect(v3220Section).toContain('### 🚀 Frontend & Responsive UI');
    expect(v3220Section).toContain('### 🛡️ Bảo mật, API & Persistence');
    expect(v3220Section).toContain('### 🧪 Kiểm thử & Build Pipeline');
  });
});
