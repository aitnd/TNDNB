import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '..');

describe('Changelog Parser Test Suite (Plan 261108-2025)', () => {
  it('TC-CP01: parseChangelog phân tích chính xác semver header, ngày tháng, và đa section', async () => {
    const { parseChangelog, getSectionConfig } = await import('../ontap-web/utils/parseChangelog');

    const sample = `
## [3.22.0] - 2026-11-08
### Tính năng mới
- Thêm Tab Switcher giữa Nhật ký Người dùng và Kỹ thuật
- Thêm cơ chế tìm kiếm đa năng

### Giao diện & Trải nghiệm
- Làm mới giao diện Modal Nhật ký Thay đổi

### Sửa lỗi & Khắc phục
- Sửa lỗi hiển thị tiếng Việt

## [3.21.0] - 2026-11-04
### Kỹ thuật & Hạ tầng
- Tối ưu hóa bundle Vite
    `.trim();

    const versions = parseChangelog(sample);

    expect(versions.length).toBe(2);

    // Version 1
    expect(versions[0].version).toBe('3.22.0');
    expect(versions[0].isLatest).toBe(true);
    expect(versions[0].date).toBe('08/11/2026');
    expect(versions[0].sections.length).toBe(3);

    expect(versions[0].sections[0].title).toBe('Tính năng mới');
    expect(versions[0].sections[0].items).toEqual([
      'Thêm Tab Switcher giữa Nhật ký Người dùng và Kỹ thuật',
      'Thêm cơ chế tìm kiếm đa năng',
    ]);
    expect(versions[0].sections[0].color).toBe('text-emerald-500');

    expect(versions[0].sections[1].title).toBe('Giao diện & Trải nghiệm');
    expect(versions[0].sections[1].color).toBe('text-blue-500');

    expect(versions[0].sections[2].title).toBe('Sửa lỗi & Khắc phục');
    expect(versions[0].sections[2].color).toBe('text-amber-500');

    // Version 2
    expect(versions[1].version).toBe('3.21.0');
    expect(versions[1].isLatest).toBe(false);
    expect(versions[1].date).toBe('04/11/2026');
    expect(versions[1].sections.length).toBe(1);
    expect(versions[1].sections[0].title).toBe('Kỹ thuật & Hạ tầng');
    expect(versions[1].sections[0].color).toBe('text-purple-500');

    // Test getSectionConfig helper directly
    expect(getSectionConfig('Bảo mật dữ liệu').color).toBe('text-red-500');
    expect(getSectionConfig('Mục khác không xác định').color).toBe('text-slate-500');
  });

  it('TC-CP02: parseChangelog phân tích file CHANGELOG_DEV.md', async () => {
    const { parseChangelog } = await import('../ontap-web/utils/parseChangelog');
    const changelogDevPath = path.resolve(rootDir, 'CHANGELOG_DEV.md');
    const rawContent = fs.readFileSync(changelogDevPath, 'utf8');

    const versions = parseChangelog(rawContent);

    expect(versions.length).toBeGreaterThanOrEqual(4);

    const latest = versions[0];
    expect(latest.version).toBe('3.21.0');
    expect(latest.isLatest).toBe(true);
    expect(latest.sections.length).toBeGreaterThan(0);
    expect(latest.sections[0].items.length).toBeGreaterThan(0);

    // Kiểm tra tất cả các version được parse đều có format hợp lệ
    for (const v of versions) {
      expect(v.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(v.sections.length).toBeGreaterThan(0);
    }
  });

  it('TC-CP03: parseChangelog xử lý an toàn chuỗi rỗng / null / văn bản lạ', async () => {
    const { parseChangelog } = await import('../ontap-web/utils/parseChangelog');

    expect(parseChangelog('')).toEqual([]);
    expect(parseChangelog(null as any)).toEqual([]);
    expect(parseChangelog(undefined as any)).toEqual([]);
    expect(parseChangelog(12345 as any)).toEqual([]);
    expect(parseChangelog('Văn bản ngẫu nhiên không có tiêu đề markdown')).toEqual([]);
    expect(parseChangelog('## Tiêu đề không có version trong ngoặc vuông')).toEqual([]);
    expect(parseChangelog('## [2026-11-08] Tiêu đề chỉ có ngày mà không có version')).toEqual([]);

    // Trường hợp có gạch đầu dòng mà không có ### section title -> tự tạo section mặc định 'Cập nhật'
    const fallbackSample = `
## [1.0.0] - 2026-01-01
- Tính năng không nằm dưới section
    `.trim();
    const fallbackRes = parseChangelog(fallbackSample);
    expect(fallbackRes.length).toBe(1);
    expect(fallbackRes[0].sections.length).toBe(1);
    expect(fallbackRes[0].sections[0].title).toBe('Cập nhật');
    expect(fallbackRes[0].sections[0].items).toEqual(['Tính năng không nằm dưới section']);
  });

  it('TC-CP04: ontap-win utils/parseChangelog.ts đồng bộ 100% với ontap-web', async () => {
    const web = await import('../ontap-web/utils/parseChangelog');
    const win = await import('../ontap-win/utils/parseChangelog');

    expect(typeof web.parseChangelog).toBe('function');
    expect(typeof win.parseChangelog).toBe('function');
    expect(typeof web.getSectionConfig).toBe('function');
    expect(typeof win.getSectionConfig).toBe('function');

    const sample = `## [3.22.0] - 2026-11-08\n### Tính năng mới\n- Test item`;
    const webRes = web.parseChangelog(sample);
    const winRes = win.parseChangelog(sample);

    expect(webRes.length).toBe(winRes.length);
    expect(webRes[0].version).toBe(winRes[0].version);
    expect(webRes[0].date).toBe(winRes[0].date);
    expect(webRes[0].isLatest).toBe(winRes[0].isLatest);
    expect(webRes[0].sections[0].title).toBe(winRes[0].sections[0].title);
    expect(webRes[0].sections[0].items).toEqual(winRes[0].sections[0].items);
    expect(webRes[0].sections[0].color).toBe(winRes[0].sections[0].color);
    expect(webRes[0].sections[0].bgColor).toBe(winRes[0].sections[0].bgColor);
  });
});
