# Phase 01: Khôi Phục Bộ Parser Markdown Gốc & Hỗ Trợ Đọc File Raw Kép

> **Mã kế hoạch**: `261108-2025-authoritative-changelog-and-recent-plans-sync`  
> **Tài liệu**: Kế hoạch kỹ thuật chi tiết Phase 01  
> **Tệp tác động**:
> - [`ontap-web/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/parseChangelog.ts) (khôi phục & nâng cấp)
> - [`ontap-win/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-win/utils/parseChangelog.ts) (khôi phục & nâng cấp)  
> **Mục tiêu**: Khôi phục lại bộ phân tích cú pháp Markdown gốc đã chứng minh hiệu quả trong lịch sử dự án, nâng cấp khả năng nhận diện thông minh đa section và hỗ trợ nạp song song cả 2 nguồn tài liệu raw: Người dùng (`CHANGELOG.md`) và Kỹ thuật (`CHANGELOG_DEV.md`).

---

## 1. Mục Tiêu Kỹ Thuật (Objectives)

1. **Khôi phục nguyên lý kiến trúc gốc**:
   - Sử dụng tính năng bundling native của Vite `?raw` (`import changelogRaw from '.../CHANGELOG.md?raw'`).
   - Đảm bảo dữ liệu changelog được nhúng trực tiếp vào bundle tại thời điểm build: **0ms độ trễ mạng, 100% độc lập ngoại tuyến, không thể bị hỏng do remote API**.
2. **Bộ Parser Thông Minh Nhận Diện Section Bằng Regex (Smart Section Classifier)**:
   - Thay vì so sánh chuỗi cứng (exact match), nâng cấp bộ nhận diện từ khóa linh hoạt:
     - Chứa từ khóa `tính năng`, `feature`, `added`, `mới`: Gán icon `Sparkles`, màu `text-emerald-500`, nền `bg-emerald-100 dark:bg-emerald-900/30`.
     - Chứa từ khóa `giao diện`, `ui`, `ux`, `hiển thị`, `trải nghiệm`, `changed`: Gán icon `Rocket`, màu `text-blue-500`, nền `bg-blue-100 dark:bg-blue-900/30`.
     - Chứa từ khóa `sửa lỗi`, `vá lỗi`, `khắc phục`, `fix`, `bug`: Gán icon `Wrench`, màu `text-amber-500`, nền `bg-amber-100 dark:bg-amber-900/30`.
     - Chứa từ khóa `bảo mật`, `security`: Gán icon `Shield`, màu `text-red-500`, nền `bg-red-100 dark:bg-red-900/30`.
     - Chứa từ khóa `kỹ thuật`, `dev`, `infra`, `hạ tầng`, `database`, `build`, `refactor`: Gán icon `Code`, màu `text-purple-500`, nền `bg-purple-100 dark:bg-purple-900/30`.
     - Tiêu chuẩn mặc định: Gán icon `List`, màu `text-slate-500`, nền `bg-slate-100 dark:bg-slate-900/30`.
3. **Trích xuất chính xác Phiên bản & Ngày tháng**:
   - Nhận diện `## [3.22.0] - 2026-11-08`:
     - Tách số phiên bản `3.22.0`.
     - Tách ngày phát hành `2026-11-08` và định dạng sang tiếng Việt `08/11/2026`.
     - Gán cờ `isLatest: index === 0` cho phiên bản đầu tiên.

---

## 2. Mã Nguồn Chuẩn Bị Triển Khai (`parseChangelog.ts`)

```typescript
import { Rocket, Zap, Shield, Monitor, Code, Settings, List, Sparkles, Wrench } from 'lucide-react';

export interface ChangelogSection {
  icon: any;
  title: string;
  color: string;
  bgColor: string;
  items: string[];
}

export interface ChangelogVersion {
  version: string;
  date: string;
  isLatest: boolean;
  sections: ChangelogSection[];
}

export const getSectionConfig = (title: string): { icon: any; color: string; bgColor: string } => {
  const lower = title.toLowerCase();

  if (/tính năng|feature|added|mới/i.test(lower)) {
    return { icon: Sparkles, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' };
  }
  if (/giao diện|ui|ux|hiển thị|trải nghiệm|changed/i.test(lower)) {
    return { icon: Rocket, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/30' };
  }
  if (/sửa lỗi|vá lỗi|khắc phục|fix|bug/i.test(lower)) {
    return { icon: Wrench, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30' };
  }
  if (/bảo mật|security/i.test(lower)) {
    return { icon: Shield, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/30' };
  }
  if (/kỹ thuật|dev|infra|hạ tầng|database|build|refactor/i.test(lower)) {
    return { icon: Code, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/30' };
  }

  return { icon: List, color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-slate-900/30' };
};

export const parseChangelog = (text: string): ChangelogVersion[] => {
  if (!text || typeof text !== 'string') return [];
  const versions: ChangelogVersion[] = [];
  const lines = text.split('\n');

  let currentVersion: ChangelogVersion | null = null;
  let currentSection: ChangelogSection | null = null;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    if (line.startsWith('## ')) {
      const header = line.substring(3);
      const versionMatch = header.match(/\[(.*?)\]/);
      const version = versionMatch ? versionMatch[1] : '';

      if (!version || /^\d{4}-\d{2}-\d{2}$/.test(version)) {
        continue;
      }

      let date = '';
      const dateMatch = header.match(/\d{4}-\d{2}-\d{2}/);
      if (dateMatch) {
        const d = new Date(dateMatch[0]);
        date = d.toLocaleDateString('vi-VN');
      }

      currentVersion = {
        version,
        date: date || 'N/A',
        isLatest: versions.length === 0,
        sections: []
      };
      versions.push(currentVersion);
      currentSection = null;
      continue;
    }

    if (!currentVersion) continue;

    if (line.startsWith('### ')) {
      const title = line.substring(4).trim();
      const config = getSectionConfig(title);

      currentSection = {
        icon: config.icon,
        title,
        color: config.color,
        bgColor: config.bgColor,
        items: []
      };
      currentVersion.sections.push(currentSection);
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const item = line.substring(2).trim();
      if (currentSection) {
        currentSection.items.push(item);
      } else {
        const defaultTitle = 'Cập nhật';
        const config = getSectionConfig(defaultTitle);
        currentSection = {
          icon: config.icon,
          title: defaultTitle,
          color: config.color,
          bgColor: config.bgColor,
          items: [item]
        };
        currentVersion.sections.push(currentSection);
      }
    }
  }

  return versions;
};
```

---

## 3. Implementation Steps (TDD Enriched)

### Task 1: Bộ Tiện Ích `parseChangelog.ts` (Web & Win)

**Files:**
- Create: [`ontap-web/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/parseChangelog.ts)
- Create: [`ontap-win/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-win/utils/parseChangelog.ts)
- Test: [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts)

**Interfaces:**
- Consumes: `text: string` (Raw markdown input từ `CHANGELOG.md` hoặc `CHANGELOG_DEV.md`)
- Produces: `ChangelogVersion[]` (Mảng đối tượng phiên bản với mảng sections chuẩn hóa)

- [ ] **Step 1.1: Viết test thất bại (RED)**
  Tạo test case `TC-CP01`, `TC-CP02`, `TC-CP03` trong [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts):
  ```typescript
  describe('Changelog Parser Test Suite', () => {
    it('TC-CP01: parseChangelog phân tích chính xác semver header và ngày tháng', async () => {
      const { parseChangelog } = await import('../ontap-web/utils/parseChangelog');
      const sample = `## [3.22.0] - 2026-11-08\n### Tính năng mới\n- Thêm Tab Switcher`;
      const res = parseChangelog(sample);
      expect(res.length).toBe(1);
      expect(res[0].version).toBe('3.22.0');
      expect(res[0].isLatest).toBe(true);
      expect(res[0].sections[0].title).toBe('Tính năng mới');
      expect(res[0].sections[0].items[0]).toBe('Thêm Tab Switcher');
    });
  });
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  Run: `npx vitest run scripts/changelog-parser.test.ts`
  Expected: FAIL với lỗi `Cannot find module '../ontap-web/utils/parseChangelog'`

- [ ] **Step 1.3: Implement tối thiểu (GREEN)**
  Tạo [`ontap-web/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-web/utils/parseChangelog.ts) và [`ontap-win/utils/parseChangelog.ts`](file:///d:/Antigravity/TNDNB/ontap-win/utils/parseChangelog.ts) theo mã nguồn ở Mục 2.

- [ ] **Step 1.4: Chạy test — xác nhận PASS**
  Run: `npx vitest run scripts/changelog-parser.test.ts`
  Expected: PASS 100%

- [ ] **Step 1.5: Commit**
  ```bash
  git add ontap-web/utils/parseChangelog.ts ontap-win/utils/parseChangelog.ts scripts/changelog-parser.test.ts
  git commit -m "feat(changelog): restore and enhance parseChangelog parser utility with smart regex sections"
  ```
