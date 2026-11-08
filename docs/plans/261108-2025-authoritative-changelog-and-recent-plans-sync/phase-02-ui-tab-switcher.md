# Phase 02: Tích Hợp Tab Switcher (Người Dùng vs. Kỹ Thuật Dev) & Bảo Toàn Auto-Updater Windows

> **Mã kế hoạch**: `261108-2025-authoritative-changelog-and-recent-plans-sync`  
> **Tài liệu**: Kế hoạch kỹ thuật chi tiết Phase 02 (Đã cập nhật sau Independent Review)  
> **Tệp tác động**:
> - [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx)
> - [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx)
> - [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)
> - [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx)
> - [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx)
> - [`ontap-win/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/TopNavbar.tsx)  
> **Mục tiêu**: Giữ nguyên vẹn layout và theme hiện tại của các màn hình Changelog, khôi phục cơ chế nạp Markdown raw (`?raw`) kèm Tab Switcher (`[👤 Người dùng]` / `[💻 Kỹ thuật (Dev)]`), đồng thời **bảo toàn tuyệt đối 100% khối Electron Auto-Updater và Cập nhật Gói Đề Thi trong `ontap-win/components/ChangelogModal.tsx`**.

---

## 1. Mục Tiêu Kỹ Thuật & Phát Hiện Từ Independent Review

1. **Khôi phục nạp Markdown trực tiếp bằng `?raw` trên `ChangelogScreen.tsx` (Web & Win) và `ontap-web/components/ChangelogModal.tsx`**:
   - `import changelogUserRaw from '../CHANGELOG.md?raw';`
   - `import changelogDevRaw from '../../CHANGELOG_DEV.md?raw';`
   - Parse đồng bộ qua `useMemo(() => parseChangelog(...), [])`: **0ms latency, chạy ngoại tuyến 100%**.
2. **Thanh Chuyển Đổi Tab Switcher (Segmented Control)**:
   - `[👤 Người dùng]` (Mặc định): Hiển thị nội dung từ `CHANGELOG.md` (đầy đủ 46+ phiên bản lịch sử từ `v3.22.0` về `v3.6.0`).
   - `[💻 Kỹ thuật (Dev)]`: Hiển thị nội dung từ `CHANGELOG_DEV.md`.
   - Trong `ChangelogModal.tsx`: Hiển thị bản mới nhất (`activeData.slice(0, 1)`) kèm nút `"Xem tất cả"` dẫn tới `/ontap/changelog` (nơi hiển thị toàn bộ danh sách lịch sử).
3. **[CRITICAL FIX] Bảo toàn Electron Auto-Updater & Question Sync trong `ontap-win/components/ChangelogModal.tsx`**:
   - **KHÔNG ĐƯỢC** ghi đè `ontap-win/components/ChangelogModal.tsx` bằng code của bản Web!
   - Giữ nguyên 100% phần `window.electron` (`downloadUpdate`, `installUpdate`, `onUpdateProgress`), `handleCheckDataUpdate`, `handleUpdateData` (`🔄 Cập nhật Gói Đề Thi`) ở nửa trên của Modal (dòng 16–287).
   - Chỉ nâng cấp khối `{/* Changelog Content */}` ở nửa dưới (dòng 289–338) để đọc từ `parseChangelog(changelogUserRaw)` / `parseChangelog(changelogDevRaw)` kèm Tab Switcher, và dùng `userChangelog[0]?.version || '3.22.0'` làm fallback cho `latestVersion` khi GitHub Releases không trả về bản mới hơn.
4. **[CRITICAL FIX] Đồng bộ hàm `getLatestVersion()` và xóa bỏ fallback cứng `'3.19.2'` trong `TopNavbar.tsx` (Web & Win)**:
   - Trong `ontap-web/components/ChangelogModal.tsx`:
     ```typescript
     export const getLatestVersion = async (): Promise<string> => {
       try {
         const parsed = parseChangelog(changelogUserRaw);
         return parsed.length > 0 ? parsed[0].version : '3.22.0';
       } catch {
         return '3.22.0';
       }
     };
     ```
   - Trong `ontap-web/components/TopNavbar.tsx` và `ontap-win/components/TopNavbar.tsx`: Đổi fallback `'3.19.2'` thành `'3.22.0'` để thanh điều hướng luôn hiển thị đúng `v3.22.0` ngay lập tức.

---

## 2. Review Focus (Impeccable v4.8.0 & Taste-Skill v2.5.0)

1. **Touch Targets (Rule 01)**: Nút tab `min-h-[40px] px-4 sm:px-6`, nút quay lại `min-h-[44px] min-w-[44px]`.
2. **Tabular Numerics (Rule 12)**: Luôn gắn `tabular-nums` cho số hiệu phiên bản (`v3.22.0`) và ngày tháng (`08/11/2026`).
3. **Zero Layout Shift (Rule 38)**: Nạp đồng bộ qua `useMemo`, `CLS = 0`.
4. **Windows Updater Integrity**: Đảm bảo `window.electron` và `handleUpdateData` trong `ontap-win/components/ChangelogModal.tsx` còn nguyên vẹn 100%.

---

## 3. Implementation Steps (TDD Enriched)

### Task 2: Nâng Cấp `ChangelogScreen`, `ChangelogModal` & `TopNavbar` (Web & Win)

**Files:**
- Modify: [`ontap-web/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx)
- Modify: [`ontap-web/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx)
- Modify: [`ontap-web/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/TopNavbar.tsx)
- Modify: [`ontap-win/components/ChangelogScreen.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx)
- Modify: [`ontap-win/components/ChangelogModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx)
- Modify: [`ontap-win/components/TopNavbar.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/components/TopNavbar.tsx)
- Test: [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts)

- [ ] **Step 2.1 [RED]**: Thêm test cases `TC-CP04` (kiểm tra `ChangelogScreen.tsx` & `ChangelogModal.tsx` nạp `?raw` + Tab Switcher) và `TC-CP05` (kiểm tra `ontap-win/components/ChangelogModal.tsx` bảo toàn `window.electron` & `handleUpdateData` đồng thời có Tab Switcher) vào [`scripts/changelog-parser.test.ts`](file:///d:/Antigravity/TNDNB/scripts/changelog-parser.test.ts).
- [ ] **Step 2.2 [FAIL]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` — xác nhận FAIL.
- [ ] **Step 2.3 [GREEN]**: Cập nhật 6 tệp giao diện trên cả `ontap-web` và `ontap-win`.
- [ ] **Step 2.4 [PASS]**: Chạy `npx vitest run scripts/changelog-parser.test.ts` — xác nhận PASS 100%.
- [ ] **Step 2.5 [COMMIT]**:
  ```bash
  git add ontap-web/components/ChangelogScreen.tsx ontap-web/components/ChangelogModal.tsx ontap-web/components/TopNavbar.tsx ontap-win/components/ChangelogScreen.tsx ontap-win/components/ChangelogModal.tsx ontap-win/components/TopNavbar.tsx scripts/changelog-parser.test.ts
  git commit -m "feat(changelog): integrate dual-tab markdown viewer across web & win while preserving Electron updater"
  ```
