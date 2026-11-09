# Phase 01: Chuẩn Hóa Nội Dung Người Dùng Súc Tích & Render Inline Markdown Đẹp Mắt

> **Mã kế hoạch**: `261109-0650-changelog-rbac-and-concise-copy`  
> **Tài liệu**: Đặc tả kỹ thuật Phase 01  
> **Tệp tác động**:
> - [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md) (Viết lại bản `[3.22.0]` và `[3.21.0]` theo chuẩn `[3.19.0]`)
> - [`ontap-web/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md) (Đồng bộ nội dung chuẩn)
> - [`ontap-win/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md) (Đồng bộ nội dung chuẩn)
> - [`public/ontap/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/public/ontap/CHANGELOG.md) (Đồng bộ bản tĩnh Cổng thông tin)
> - [`update_changelogs.js`](file:///d:/Antigravity/TNDNB/update_changelogs.js) (Cập nhật script đồng bộ)
> - [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) (Tích hợp hàm `renderInlineMarkdown`)
> - [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx) (Tích hợp hàm `renderInlineMarkdown`)
> - [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx) (Tích hợp hàm `renderInlineMarkdown` ở phần hiển thị changelog dưới dòng 289)
> - [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) (Tích hợp hàm `renderInlineMarkdown`)  
> **Mục tiêu**: Loại bỏ 100% thuật ngữ nội bộ của Dev khỏi nhật ký cập nhật của Người dùng, viết lại các bản phát hành theo văn phong thực tế, dễ hiểu của học viên; đồng thời xử lý triệt để lỗi hiển thị dấu `**` thô bằng hàm chuyển đổi Markdown inline sang thẻ `<strong>` trang nhã.

---

## 1. Bối Cảnh & Vấn Đề Cần Giải Quyết

### 1.1 Lỗi "Ngôn Ngữ Kỹ Thuật" Trong Nhật Ký Người Dùng (Jargon Leakage)
- Hiện tại, mục `## [3.22.0]` và `## [3.21.0]` trong [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md) chứa quá nhiều thuật ngữ nội bộ, tên component mã nguồn và hạ tầng kỹ thuật: `WelcomeModal`, `LicenseSelectionScreen`, `First Fold Focus`, `Zero-Noise Console`, `Dexie/IndexedDB`, `Cloudflare KV/R2/D1`, `TinyMCE`, `Monorepo`,...
- Học viên, thí sinh và người dùng phổ thông khi mở bảng tin cập nhật chỉ muốn biết trong 5 giây: **"Phiên bản này mang lại lợi ích gì cho việc học và thi của tôi?"**.
- Tiêu chuẩn vàng đã được thiết lập rất thành công tại bản `## [3.19.0]`: Mỗi gạch đầu dòng là 1 câu tiếng Việt ngắn gọn, tập trung thẳng vào giá trị thực tế của học viên.

### 1.2 Lỗi Hiển Thị Cú Pháp Markdown Thô (`**bold**`)
- Trên giao diện hiện tại của cả 4 component ([`ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx), [`ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx)), các dòng gạch đầu dòng được in bằng `<span>{item}</span>`.
- Hậu quả: Dấu sao `**Tiêu đề:**` bị hiển thị nguyên văn ra màn hình, gây mất thẩm mỹ và tạo cảm giác ứng dụng chưa hoàn thiện.

---

## 2. Đặc Tả Nội Dung Markdown Chuẩn Cho Người Dùng (`CHANGELOG.md`)

Mục `## [3.22.0]` và `## [3.21.0]` được chuẩn hóa lại 100% tiếng Việt thuần túy, không chứa bất kỳ từ khóa Dev nào:

```markdown
## [3.22.0] - 2026-11-08

### Nâng cấp Trải nghiệm Thi thử Di động & Tối ưu Hệ thống (Web & App Win)
- **Tối ưu phòng thi trên điện thoại:** Thu gọn phần thông tin cá nhân khi đang làm bài, giúp câu hỏi và 4 đáp án hiển thị trọn vẹn ngay trên màn hình mà không cần cuộn trang.
- **Nhắc làm bài dở gọn gàng:** Thay nút nổi che màn hình bằng thanh nhắc nhỏ ở đầu trang, có nút bỏ qua để học viên thoải mái chọn đề thi khác.
- **Cài đặt ứng dụng nhanh:** Hỗ trợ cài đặt ứng dụng **"Giáo dục Ninh Bình"** ra màn hình chính điện thoại kèm hướng dẫn chi tiết cho cả iPhone và Android.
- **Giao diện bảng điều khiển mới:** Đưa Thẻ học viên và nút **"Vào Ôn Tập / Thi Thử"** lên đầu trang, gom các mục phụ vào menu góc phải gọn gàng.
- **Đăng nhập & Vận hành mượt mà:** Tự động ghi nhớ tài khoản đăng nhập, tăng tốc độ mở trang tin tức và đồng bộ phông chữ tiếng Việt rõ nét trên mọi thiết bị.

## [3.21.0] - 2026-11-04

### Tăng tốc Tải ảnh Đề thi & Học Ngoại tuyến (Web & App Win)
- **Tải ảnh đề thi siêu tốc:** Nâng cấp đường truyền giúp toàn bộ hình ảnh câu hỏi sát hạch hiển thị tức thì và sắc nét.
- **Ôn tập không cần mạng:** Tự động lưu dữ liệu câu hỏi vào thiết bị sau lần mở đầu tiên, giúp học viên ôn luyện và thi thử mượt mà ngay cả khi mất kết nối mạng.
- **Cập nhật phần mềm nhanh hơn (Windows):** Tối ưu tốc độ tải bản cập nhật mới trên máy tính, khắc phục tình trạng tải chậm vào giờ cao điểm.
- **Giao diện Cổng thông tin mới:** Thiết kế lại trang tin tức nhà trường theo phong cách trang trọng, rõ ràng và dễ theo dõi lịch học, lịch thi.
```

---

## 3. Thiết Kế Kỹ Thuật: Hàm Render Inline Markdown (`renderInlineMarkdown`)

Để không phải cài thêm thư viện markdown cồng kềnh (tuân thủ nguyên tắc Ponytail YAGNI), chúng ta triển khai hàm render inline gọn nhẹ trực tiếp trong các component hoặc trích xuất thành helper dùng chung:

```tsx
/**
 * Hàm phân tách cú pháp **in đậm** thành thẻ <strong> đẹp mắt
 * Đầu vào: "**Tối ưu phòng thi:** Thu gọn thông tin cá nhân..."
 * Đầu ra: [<strong key="0" className="font-semibold text-foreground">Tối ưu phòng thi:</strong>, " Thu gọn thông tin cá nhân..."]
 */
export const renderInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};
```

### 3.1 Thay Thế Trong Giao Diện
Tại điểm render các item trong danh sách changelog:
```tsx
// CŨ:
<li key={iIdx} className="flex items-start gap-2.5 text-sm text-foreground font-normal leading-relaxed">
  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
  <span>{item}</span>
</li>

// MỚI:
<li key={iIdx} className="flex items-start gap-2.5 text-sm text-foreground font-normal leading-relaxed">
  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"></span>
  <span>{renderInlineMarkdown(item)}</span>
</li>
```

---

## 4. Quy Trình Thực Thi TDD Chi Tiết (TDD Bite-Sized Steps)

### Task 1: Chuẩn Hóa Bản Tin Người Dùng Súc Tích & Render Inline Markdown

> **Review Focus**:
> - Đọc kỹ [`DESIGN.md`](file:///d:/Antigravity/TNDNB/docs/plans/261109-0650-changelog-rbac-and-concise-copy/DESIGN.md) Mục 2.3 & Mục 3.
> - **Tiêu chuẩn Impeccable v4.8.0 & Taste-Skill v2.5.0**:
>   * *Rule 01*: Nút quay lại và nút đóng modal giữ diện tích chạm tối thiểu $44 \times 44\text{px}$ (`min-h-[44px] min-w-[44px]`).
>   * *Rule 05*: Chữ in đậm `<strong className="font-bold text-foreground">` đạt độ tương phản màu sắc $> 7:1$ (WCAG AAA).
>   * *Rule 12*: Giữ nguyên lớp `tabular-nums` trên số phiên bản và ngày tháng để CLS = 0.
>   * *Rule 24*: Zero AI Slop — Loại bỏ hoàn toàn các câu văn hoa mỹ rườm rà, tập trung 100% vào lợi ích học tập của thí sinh.
> - **Ràng Buộc Bất Biến**:
>   * *Invariant 1*: Tuyệt đối không chỉnh sửa [`ExamQuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ExamQuizScreen.tsx) và [`QuizScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/QuizScreen.tsx) (`0 bytes diff`).
>   * *Invariant 2*: Trong [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx), bảo toàn nguyên vẹn 100% logic tự động cập nhật Electron và tải đề thi ngầm từ dòng 16 đến dòng 287.

**Files:**
- Test: [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts)
- Modify: [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md)
- Modify: [`ontap-web/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md)
- Modify: [`ontap-win/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md)
- Modify: [`public/ontap/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/public/ontap/CHANGELOG.md)
- Modify: [`update_changelogs.js`](file:///d:/Antigravity/TNDNB/update_changelogs.js)
- Modify: [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx)
- Modify: [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx)
- Modify: [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx)
- Modify: [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx)

---

- [ ] **Step 1.1: Viết test thất bại (RED)**
  Bổ sung các test cases `TC-RBAC01`, `TC-RBAC02`, `TC-RBAC04` vào [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts):
  ```typescript
  // Danh sách các từ khóa Dev cấm tuyệt đối xuất hiện trong CHANGELOG người dùng
  const FORBIDDEN_DEV_KEYWORDS = [
    'WelcomeModal',
    'LicenseSelectionScreen',
    'ExamQuizScreen',
    'Dashboard',
    '/ontap/settings',
    'Cloudflare KV',
    'Cloudflare R2',
    'Cloudflare D1',
    'Firestore',
    'Dexie',
    'IndexedDB',
    'Monorepo',
    'Next.js',
    'Vercel',
    'TinyMCE',
    'Zero-Noise Console',
    'First Fold Focus',
    'Hallmark Editorial',
    'resumeSessionAvailable',
    'deferredPrompt',
  ];

  it('TC-RBAC01: CHANGELOG.md (Người dùng) tại mục [3.22.0] và [3.21.0] tuyệt đối KHÔNG chứa bất kỳ từ khóa Dev nội bộ nào', () => {
    const userLog = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    const relevantMatch = userLog.match(/## \[3\.22\.0\][\s\S]*?(?=## \[3\.20\.0\])/);
    expect(relevantMatch, 'Phải tìm thấy nội dung mục 3.22.0 và 3.21.0').not.toBeNull();
    
    const relevantContent = relevantMatch![0];
    FORBIDDEN_DEV_KEYWORDS.forEach((keyword) => {
      expect(
        relevantContent.includes(keyword),
        `Từ khóa DEV nội bộ "${keyword}" không được phép xuất hiện trong CHANGELOG.md người dùng`
      ).toBe(false);
    });
  });

  it('TC-RBAC02: Nội dung CHANGELOG.md đồng bộ chính xác trên cả 4 vị trí (root, ontap-web, ontap-win, public/ontap)', () => {
    const rootLog = fs.readFileSync(path.resolve(rootDir, 'CHANGELOG.md'), 'utf8');
    const webLog = fs.readFileSync(path.resolve(rootDir, 'ontap-web/CHANGELOG.md'), 'utf8');
    const winLog = fs.readFileSync(path.resolve(rootDir, 'ontap-win/CHANGELOG.md'), 'utf8');
    const portalLog = fs.readFileSync(path.resolve(rootDir, 'public/ontap/CHANGELOG.md'), 'utf8');

    expect(webLog).toBe(rootLog);
    expect(winLog).toBe(rootLog);
    expect(portalLog).toBe(rootLog);
  });

  it('TC-RBAC04: Cả 4 component đều tích hợp hàm renderInlineMarkdown hoặc chuyển đổi **text** thành <strong>', () => {
    const filesToCheck = [
      path.resolve(rootDir, 'ontap-web/components/ChangelogModal.tsx'),
      path.resolve(rootDir, 'ontap-web/components/ChangelogScreen.tsx'),
      path.resolve(rootDir, 'ontap-win/components/ChangelogModal.tsx'),
      path.resolve(rootDir, 'ontap-win/components/ChangelogScreen.tsx'),
    ];

    filesToCheck.forEach((filePath) => {
      const code = fs.readFileSync(filePath, 'utf8');
      expect(code, `File ${filePath} phải có logic render inline markdown`).toMatch(
        /renderInlineMarkdown|<strong|renderFormattedItem/
      );
    });
  });
  ```

- [ ] **Step 1.2: Chạy test — xác nhận FAIL**
  ```powershell
  npx vitest run scripts/changelog-parser.test.ts
  ```
  *Kỳ vọng*: Test `TC-RBAC01` FAIL vì `CHANGELOG.md` hiện tại chứa các từ khóa Dev (`First Fold Focus`, `WelcomeModal`, `Zero-Noise Console`, `Dexie`, `Cloudflare`,...), và `TC-RBAC04` FAIL vì các component chưa có hàm `renderInlineMarkdown`.

- [ ] **Step 1.3: Implement — Chuẩn hóa nội dung CHANGELOG người dùng (GREEN)**
  Cập nhật mục `## [3.22.0]` và `## [3.21.0]` trong:
  - [`CHANGELOG.md`](file:///d:/Antigravity/TNDNB/CHANGELOG.md)
  - [`ontap-web/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md)
  - [`ontap-win/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md)
  - [`public/ontap/CHANGELOG.md`](file:///d:/Antigravity/TNDNB/public/ontap/CHANGELOG.md)
  - [`update_changelogs.js`](file:///d:/Antigravity/TNDNB/update_changelogs.js)

  *Nội dung chuẩn hóa*:
  ```markdown
  ## [3.22.0] - 2026-11-08

  ### Nâng cấp Trải nghiệm Thi thử Di động & Tối ưu Hệ thống (Web & App Win)
  - **Tối ưu phòng thi trên điện thoại:** Thu gọn phần thông tin cá nhân khi đang làm bài, giúp câu hỏi và 4 đáp án hiển thị trọn vẹn ngay trên màn hình mà không cần cuộn trang.
  - **Nhắc làm bài dở gọn gàng:** Thay nút nổi che màn hình bằng thanh nhắc nhỏ ở đầu trang, có nút bỏ qua để học viên thoải mái chọn đề thi khác.
  - **Cài đặt ứng dụng nhanh:** Hỗ trợ cài đặt ứng dụng **"Giáo dục Ninh Bình"** ra màn hình chính điện thoại kèm hướng dẫn chi tiết cho cả iPhone và Android.
  - **Giao diện bảng điều khiển mới:** Đưa Thẻ học viên và nút **"Vào Ôn Tập / Thi Thử"** lên đầu trang, gom các mục phụ vào menu góc phải gọn gàng.
  - **Đăng nhập & Vận hành mượt mà:** Tự động ghi nhớ tài khoản đăng nhập, tăng tốc độ mở trang tin tức và đồng bộ phông chữ tiếng Việt rõ nét trên mọi thiết bị.

  ## [3.21.0] - 2026-11-04

  ### Tăng tốc Tải ảnh Đề thi & Học Ngoại tuyến (Web & App Win)
  - **Tải ảnh đề thi siêu tốc:** Nâng cấp đường truyền giúp toàn bộ hình ảnh câu hỏi sát hạch hiển thị tức thì và sắc nét.
  - **Ôn tập không cần mạng:** Tự động lưu dữ liệu câu hỏi vào thiết bị sau lần mở đầu tiên, giúp học viên ôn luyện và thi thử mượt mà ngay cả khi mất kết nối mạng.
  - **Cập nhật phần mềm nhanh hơn (Windows):** Tối ưu tốc độ tải bản cập nhật mới trên máy tính, khắc phục tình trạng tải chậm vào giờ cao điểm.
  - **Giao diện Cổng thông tin mới:** Thiết kế lại trang tin tức nhà trường theo phong cách trang trọng, rõ ràng và dễ theo dõi lịch học, lịch thi.
  ```

- [ ] **Step 1.4: Implement — Tích hợp `renderInlineMarkdown` vào `ontap-web` (GREEN)**
  - Trong [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx) và [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx):
    ```tsx
    const renderInlineMarkdown = (text: string) => {
      if (!text) return text;
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={index} className="font-bold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };
    ```
  - Thay thế `{item}` bằng `{renderInlineMarkdown(item)}`.

- [ ] **Step 1.5: Implement — Tích hợp `renderInlineMarkdown` vào `ontap-win` (GREEN)**
  - Trong [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx) và phần hiển thị dưới dòng 289 của [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx):
    ```tsx
    const renderInlineMarkdown = (text: string) => {
      if (!text) return text;
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return (
            <strong key={index} className="font-semibold text-gray-900 dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };
    ```
  - Thay thế `{item}` bằng `{renderInlineMarkdown(item)}`.
  - **Bảo toàn tuyệt đối 100% dòng 16–287 trong `ontap-win/components/ChangelogModal.tsx`**.

- [ ] **Step 1.6: Chạy test — xác nhận PASS**
  ```powershell
  npx vitest run scripts/changelog-parser.test.ts
  ```
  *Kỳ vọng*: `TC-RBAC01`, `TC-RBAC02`, `TC-RBAC04` đều PASS 100%.

- [ ] **Step 1.7: Commit**
  ```bash
  git add CHANGELOG.md ontap-web/CHANGELOG.md ontap-win/CHANGELOG.md public/ontap/CHANGELOG.md update_changelogs.js ontap-web/components/ChangelogModal.tsx ontap-web/components/ChangelogScreen.tsx ontap-win/components/ChangelogModal.tsx ontap-win/components/ChangelogScreen.tsx scripts/changelog-parser.test.ts
  git commit -m "feat(changelog): rewrite user changelog copy without dev jargon and render inline bold markdown"
  ```

