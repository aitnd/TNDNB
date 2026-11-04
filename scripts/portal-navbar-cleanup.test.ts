import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Masthead Redesign & Utility Buttons Removal (Hallmark N6)', () => {
  const navbarPath = path.resolve(process.cwd(), 'components/Navbar.tsx');
  const mobileNavPath = path.resolve(process.cwd(), 'components/MobileBottomNav.tsx');
  const footerPath = path.resolve(process.cwd(), 'components/Footer.tsx');
  const globalsCssPath = path.resolve(process.cwd(), 'app/globals.css');

  it('Navbar.tsx đã xóa hoàn toàn khối utilityGroup và 5 nút tiện ích (Giải trí, Ôn tập, Thi trực tuyến, Tải App, Tra cứu ĐC)', () => {
    const content = fs.readFileSync(navbarPath, 'utf8');
    expect(content).not.toContain('styles.utilityGroup');
    expect(content).not.toContain('href="/giai-tri"');
    expect(content).not.toContain('href="/ontap"');
    expect(content).not.toContain('href="/ontap/online-exam"');
    expect(content).not.toContain('href="/ontap/download"');
    expect(content).not.toContain('href="/tra-cuu-dia-chi"');
    expect(content).toContain('mastheadMetaBar');
  });

  it('MobileBottomNav.tsx và Footer.tsx không còn chứa các đường dẫn nội bộ /ontap, /ontap/online-exam, /ontap/download', () => {
    const mobileContent = fs.readFileSync(mobileNavPath, 'utf8');
    const footerContent = fs.readFileSync(footerPath, 'utf8');

    expect(mobileContent).not.toContain("href: '/ontap'");
    expect(footerContent).not.toContain('href="/ontap"');
    expect(footerContent).not.toContain('href="/ontap/online-exam"');
    expect(footerContent).not.toContain('href="/ontap/download"');
  });

  it('app/globals.css khóa đầy đủ Hallmark Design Tokens và comment pre-emit critique', () => {
    const css = fs.readFileSync(globalsCssPath, 'utf8');
    expect(css).toContain('Hallmark · pre-emit critique:');
    expect(css).toContain('--color-paper:');
    expect(css).toContain('--color-ink:');
    expect(css).toContain('--color-accent:');
    expect(css).toContain('--color-signal:');
    expect(css).toContain('--font-display:');
    expect(css).toContain('--font-mono:');
  });
});
