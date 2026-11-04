import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Version Synchronization & Changelog Verification (v3.21.0)', () => {
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

  it('tất cả 4 gói (root, ontap-web, ontap-win, cloudflare-worker) đều có version === "3.21.0"', () => {
    packageJsonPaths.forEach((pkgPath) => {
      expect(fs.existsSync(pkgPath), `File ${pkgPath} phải tồn tại`).toBe(true);
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      expect(pkg.version, `Package tại ${pkgPath} phải có version 3.21.0`).toBe('3.21.0');
    });
  });

  it('tất cả 4 file CHANGELOG đều có mục ghi chú phát hành "## [3.21.0]"', () => {
    changelogPaths.forEach((logPath) => {
      expect(fs.existsSync(logPath), `File ${logPath} phải tồn tại`).toBe(true);
      const content = fs.readFileSync(logPath, 'utf8');
      expect(content, `File ${logPath} phải chứa mục ## [3.21.0]`).toContain('## [3.21.0]');
    });
  });
});
