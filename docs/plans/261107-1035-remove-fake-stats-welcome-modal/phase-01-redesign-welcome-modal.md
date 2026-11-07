# Phase 01: Tái Thiết Kế WelcomeModal Đơn Cột Tối Giản, Ấm Cúng

> **Mã kế hoạch**: `261107-1035-remove-fake-stats-welcome-modal`  
> **Tài liệu**: Kế hoạch kỹ thuật chi tiết Phase 01  
> **Mục tiêu**: Loại bỏ triệt để cả khối thông số tự tạo và khối 3 bullet points, chuyển đổi [`WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) thành thẻ trung tâm (`max-w-lg`) tối giản, thân thiện.

---

## 1. Mục Tiêu Kỹ Thuật (Objectives)

1. **Xóa bỏ triệt để nội dung tự tạo & quảng cáo**:
   - Xóa bỏ khối cột phải "THÔNG SỐ HỆ THỐNG HỌC LIỆU" (các con số `100%`, `30 câu / đề`, `24/7`).
   - Xóa bỏ khối 3 bullet points tính năng (`Ôn luyện theo từng môn`, `Tự động lưu câu hay sai`, `Hỗ trợ làm bài ngoại tuyến`).
2. **Loại bỏ bố cục 2 cột phức tạp**:
   - Xóa các class `grid grid-cols-1 md:grid-cols-12`, `md:col-span-7`, `md:col-span-5`.
3. **Chuẩn hóa Thẻ Đơn Căn Giữa (`max-w-lg text-center`)**:
   - Thẻ hiển thị cân đối ở trung tâm màn hình với `min-h-[78vh] flex items-center justify-center`.
   - Áp dụng hệ thống semantic token nhất quán: `bg-card`, `text-card-foreground`, `border-border`, `rounded-2xl`, `shadow-lg`.
   - Bánh lái `HelmIcon3D` nổi bật ở đầu thẻ.
   - Tiêu đề: **Ứng Dụng Ôn Tập**.
   - Lời chào ngắn gọn, ấm cúng, chuẩn mực học vụ.
   - Cụm nút hành động chính cân đối: **[Bắt đầu ôn tập]** và **[Đăng nhập học viên]**.
   - Chân trang hiển thị đơn vị đào tạo và hotline: **Công ty CP Tư vấn và Giáo dục Ninh Bình** • Hotline: `0229 628 2969` (gắn `tabular-nums`).
4. **Dọn dẹp mã nguồn sạch sẽ**:
   - Xóa toàn bộ import `lucide-react`. Chỉ giữ lại `React` và `HelmIcon3D`.

---

## 2. Mã Nguồn Hoàn Chỉnh Mới Của `WelcomeModal.tsx`

```tsx
import React from 'react';
import { HelmIcon3D } from './icons';

export interface WelcomeModalProps {
  onStart: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onLoginClick, onRegisterClick }) => {
  return (
    <div className="min-h-[78vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full bg-card text-card-foreground border border-border rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 text-center flex flex-col items-center">
        {/* Biểu tượng bánh lái 3D */}
        <HelmIcon3D className="h-20 w-20 text-primary mb-4" />

        {/* Tag hệ thống */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
          <span>Hệ thống Đào tạo &amp; Sát hạch Thủy nội địa</span>
        </div>

        {/* Tiêu đề chính */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
          Ứng Dụng Ôn Tập
        </h1>

        {/* Lời chào trân trọng, ấm cúng */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
          Chào mừng anh/chị đã đến với ứng dụng ôn tập, thi thử trắc nghiệm chứng chỉ chuyên môn thuyền viên và người lái phương tiện thủy nội địa.
        </p>

        {/* Cụm nút hành động chính */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            Bắt đầu ôn tập
          </button>
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto min-h-[46px] px-8 py-3 rounded-xl font-semibold text-base border border-border bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            Đăng nhập học viên
          </button>
        </div>

        {/* Nút đăng ký */}
        <div className="mt-4">
          <button
            onClick={onRegisterClick}
            className="text-sm font-medium text-primary hover:underline min-h-[36px]"
          >
            Chưa có tài khoản? Đăng ký ngay →
          </button>
        </div>

        {/* Chân trang thông tin đào tạo */}
        <div className="w-full pt-4 border-t border-border text-xs text-muted-foreground leading-relaxed mt-6">
          Đơn vị đào tạo: <strong className="text-foreground font-semibold">Công ty CP Tư vấn và Giáo dục Ninh Bình</strong> • Hotline: <span className="font-semibold text-foreground tabular-nums">0229 628 2969</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
```

---

## 3. Danh Mục Kiểm Tra Khi Thi Công (Execution Checklist)

- [ ] Thay thế nội dung [`ontap-web/components/WelcomeModal.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/components/WelcomeModal.tsx) bằng cấu trúc thẻ đơn tối giản trên.
- [ ] Xác nhận không còn import bất kỳ icon nào từ `lucide-react`.
- [ ] Xác nhận không còn chuỗi `Thông số Hệ thống Học liệu`, `100%`, `30 câu / đề`, `24/7`.
- [ ] Xác nhận không còn 3 gạch đầu dòng tính năng `Ôn luyện theo từng môn`, `Tự động lưu câu hay sai`, `Hỗ trợ làm bài ngoại tuyến`.
- [ ] Xác nhận không còn `md:col-span-7`, `md:col-span-5`.
- [ ] Kiểm tra cú pháp TypeScript bằng `npx tsc --noEmit`.
