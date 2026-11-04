import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Portal Homepage Editorial Redesign (Hallmark H2 Split Diptych & S1 Header)', () => {
  const pagePath = path.resolve(process.cwd(), 'app/page.tsx');
  const pageCssPath = path.resolve(process.cwd(), 'app/page.module.css');

  it('app/page.tsx đã gỡ bỏ hoàn toàn ctaBanner (/ontap) và tích hợp bố cục editorialDiptych + briefingColumn', () => {
    const content = fs.readFileSync(pagePath, 'utf8');
    expect(content).not.toContain('styles.ctaBanner');
    expect(content).not.toContain('Vào ôn tập ngay');
    expect(content).not.toContain('href="/ontap"');
    expect(content).toContain('editorialDiptych');
    expect(content).toContain('leadStory');
    expect(content).toContain('briefingColumn');
    expect(content).toContain('sectionIndex');
  });

  it('app/page.module.css tuân thủ Hallmark Gate 38a (không in nghiêng tiêu đề) và dùng đường kẻ mảnh Editorial', () => {
    const css = fs.readFileSync(pageCssPath, 'utf8');
    expect(css).toContain('.editorialDiptych');
    expect(css).toContain('.leadStory');
    expect(css).toContain('.briefingList');
    expect(css).not.toContain('border-radius: 50px');
  });
});
