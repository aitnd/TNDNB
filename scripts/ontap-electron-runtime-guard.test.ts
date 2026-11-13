import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { isElectronRuntime } from '../ontap-web/utils/deployConfig';

const rootDir = process.cwd();

/**
 * Xóa comment block/line để kiểm tra code thực thi (tránh false-positive trên JSX comment).
 */
function stripComments(source: string): string {
  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

describe('Regression: Chống crash "require is not defined" & nhận diện nhầm Electron trên WebView', () => {
  it('ontap-web/App.tsx không gọi CommonJS require() cho WindowsLoginScreen và dùng ESM import an toàn', () => {
    const appSource = fs.readFileSync(path.resolve(rootDir, 'ontap-web/App.tsx'), 'utf8');
    const activeCode = stripComments(appSource);

    expect(activeCode).not.toMatch(/\brequire\s*\(\s*['"]\.\/components\/WindowsLoginScreen['"]\s*\)/);
    expect(activeCode).not.toMatch(/\brequire\s*\(/);
    expect(appSource).toMatch(/import\s+WindowsLoginScreen\s+from\s+['"]\.\/components\/WindowsLoginScreen['"]|React\.lazy\(\(\)\s*=>\s*import\(['"]\.\/components\/WindowsLoginScreen['"]\)\)/);
  });

  it('ontap-web/App.tsx không dùng navigator.userAgent để bật màn hình WindowsLoginScreen trên HTTP/HTTPS webview', () => {
    const appSource = fs.readFileSync(path.resolve(rootDir, 'ontap-web/App.tsx'), 'utf8');
    const activeCode = stripComments(appSource);

    expect(activeCode).not.toMatch(/userAgent[\s\S]{0,80}electron/i);
    expect(activeCode).not.toMatch(/isElectron\s*=.*userAgent/);
  });

  it('ontap-win/App.tsx và ontap-win/routes/AppRoutes.tsx không gọi runtime require() và không nhận diện Electron chỉ từ userAgent', () => {
    const winAppSource = fs.readFileSync(path.resolve(rootDir, 'ontap-win/App.tsx'), 'utf8');
    const winRoutesSource = fs.readFileSync(path.resolve(rootDir, 'ontap-win/routes/AppRoutes.tsx'), 'utf8');

    const activeWinApp = stripComments(winAppSource);
    const activeWinRoutes = stripComments(winRoutesSource);

    expect(activeWinApp).not.toMatch(/\brequire\s*\(/);
    expect(activeWinRoutes).not.toMatch(/\brequire\s*\(/);
    expect(activeWinApp).not.toMatch(/userAgent[\s\S]{0,80}electron/i);
    expect(activeWinRoutes).not.toMatch(/userAgent[\s\S]{0,80}electron/i);
    expect(winRoutesSource).toMatch(/import\s+WindowsLoginScreen\s+from\s+['"]\.\.\/components\/WindowsLoginScreen['"]/);
  });

  it('isElectronRuntime trả về false trên HTTP/HTTPS webview dù userAgent chứa "Electron", chỉ true khi có bridge hoặc file:', () => {
    expect(
      isElectronRuntime({
        electron: undefined,
        location: { protocol: 'http:' },
      })
    ).toBe(false);

    expect(
      isElectronRuntime({
        electron: { isElectron: false },
        location: { protocol: 'https:' },
      })
    ).toBe(false);

    expect(
      isElectronRuntime({
        electron: { isElectron: true },
        location: { protocol: 'http:' },
      })
    ).toBe(true);

    expect(
      isElectronRuntime({
        electron: undefined,
        location: { protocol: 'file:' },
      })
    ).toBe(true);
  });

  it('Bundle đã build trong public/ontap/assets không chứa lời gọi bare require("./components/WindowsLoginScreen")', () => {
    const assetsDir = path.resolve(rootDir, 'public/ontap/assets');
    expect(fs.existsSync(assetsDir), 'Thư mục public/ontap/assets phải tồn tại sau build').toBe(true);

    const jsFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);

    for (const file of jsFiles) {
      const bundle = fs.readFileSync(path.join(assetsDir, file), 'utf8');
      expect(bundle, `${file} không được chứa require("./components/WindowsLoginScreen")`).not.toContain(
        'require("./components/WindowsLoginScreen")'
      );
      expect(bundle, `${file} không được chứa require('./components/WindowsLoginScreen')`).not.toContain(
        "require('./components/WindowsLoginScreen')"
      );
    }
  });
});
