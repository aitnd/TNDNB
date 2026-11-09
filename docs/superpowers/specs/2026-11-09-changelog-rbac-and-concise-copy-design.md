# Thiết kế Kỹ thuật: Phân quyền RBAC cho Lịch sử Cập nhật & Chuẩn hóa Nội dung Người dùng

- **Ngày:** 2026-11-09
- **Phân loại (Superpowers v7.0.2):** `Bounded Change`
- **Tác giả:** `project-idea-validator`

---

## 1. Mục tiêu & Phạm vi (Bounded Scope)

1. **Bảo mật thông tin kỹ thuật nội bộ (RBAC):** Giới hạn quyền xem tab `[💻 Kỹ thuật (Dev)]` (`CHANGELOG_DEV.md`) chỉ dành cho 3 vai trò quản trị cấp cao: `'admin'`, `'quan_ly'`, và `'lanh_dao'`.
2. **Tối giản nội dung phía Người dùng (`CHANGELOG.md`):** Viết lại bản `[3.22.0]` và `[3.21.0]` theo đúng phong cách ngắn gọn, súc tích của bản `[3.19.0]` (mỗi gạch đầu dòng 1 câu dễ hiểu, tuyệt đối không xuất hiện tên component/hạ tầng của Dev).
3. **Sửa lỗi hiển thị Markdown (`**bold**`):** Parse cú pháp `**...**` thành thẻ `<strong>...</strong>` trong giao diện hiển thị lịch sử cập nhật.

---

## 2. Chi tiết Thiết kế Kỹ thuật

### 2.1. Logic Phân quyền Tab (RBAC) trong UI Components
Áp dụng đồng bộ trên 4 tệp:
- [ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogModal.tsx)
- [ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/ChangelogScreen.tsx)
- [ChangelogModal.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogModal.tsx)
- [ChangelogScreen.tsx](file:///d:/Antigravity/TNDNB/ontap-win/components/ChangelogScreen.tsx)

**Cách thức kiểm tra quyền:**
- Lấy `userProfile` từ `useAppStore(state => state.userProfile)`.
- Khai báo biến kiểm tra quyền:
  ```ts
  const DEV_ROLES = ['admin', 'quan_ly', 'lanh_dao'];
  const canViewDevChangelog = Boolean(userProfile?.role && DEV_ROLES.includes(userProfile.role));
  ```
- Nếu `canViewDevChangelog === false`:
  - Ẩn hoàn toàn cụm nút chuyển đổi Tab `[👤 Người dùng]` / `[💻 Kỹ thuật (Dev)]`.
  - Ép trạng thái `activeTab` luôn là `'user'` để không bao giờ hiển thị `CHANGELOG_DEV_DATA`.

### 2.2. Hàm Render Inline Bold (`**text**` -> `<strong>`)
- Viết hàm tiện ích nhỏ gọn ngay trong component (không cần cài thêm thư viện ngoài theo đúng tinh thần Ponytail YAGNI):
  ```tsx
  const renderFormattedItem = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };
  ```

### 2.3. Đồng bộ Dữ liệu `CHANGELOG.md`
Cập nhật nội dung `[3.22.0]` và `[3.21.0]` trong:
- [CHANGELOG.md](file:///d:/Antigravity/TNDNB/CHANGELOG.md)
- [ontap-web/CHANGELOG.md](file:///d:/Antigravity/TNDNB/ontap-web/CHANGELOG.md)
- [ontap-win/CHANGELOG.md](file:///d:/Antigravity/TNDNB/ontap-win/CHANGELOG.md)
- [public/ontap/CHANGELOG.md](file:///d:/Antigravity/TNDNB/public/ontap/CHANGELOG.md)
- Chạy lại script tạo bundle tĩnh (`ontap-web/lib/changelogData.ts` và `ontap-win/lib/changelogData.ts`) để cập nhật dữ liệu nạp sẵn tức thì.
