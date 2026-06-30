# 💡 BRIEF: Sửa lỗi hiển thị Huy hiệu Quyền (MiniRoleBadge) cho Admin/Lãnh đạo

**Ngày tạo:** 2026-06-30  
**Brainstorm cùng:** Lập trình viên chính  

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Học viên và giáo viên/quản lý phản hồi: **Huy hiệu Admin không hiển thị** ở cạnh tên trên TopNavbar, Thẻ Giáo viên/Học viên, và trang Hồ sơ cá nhân (`/ontap/profile`), dù tên của Admin vẫn có màu tím đặc trưng (`text-purple-600`).

### 🔍 Nguyên nhân gốc rễ (Root Cause)
Lỗi nằm ở phần thiết lập hiệu ứng chuyển động Framer Motion trong component [MiniRoleBadge.tsx](file:///d:/Antigravity/TNDNB/ontap-web/components/Badges/MiniRoleBadge.tsx):

```typescript
initial={{ scale: 0.8, opacity: 0 }}
animate={isPremiumRole ? {
  scale: [1, 1.1, 1],
  boxShadow: [
    '0 0 2px rgba(234, 179, 8, 0.4)',
    '0 0 8px rgba(239, 68, 68, 0.7)',
    '0 0 2px rgba(234, 179, 8, 0.4)'
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut'
  }
} : { scale: 1, opacity: 1 }}
```

- Khi tài khoản có vai trò cao cấp (premium roles gồm `admin`, `super_admin`, `lanh_dao`), biến `isPremiumRole` là `true`.
- Trạng thái `animate` tương ứng dành cho premium role **chỉ định dạng `scale` và `boxShadow` mà bỏ quên thuộc tính `opacity: 1`**.
- Vì `initial` đặt `opacity: 0`, nên khi render cho Admin/Lãnh đạo, huy hiệu vẫn giữ nguyên độ mờ là `0` (ẩn hoàn toàn) và chạy hiệu ứng lấp lánh vô hình.
- Trong khi đó, các vai trò thông thường (như `giao_vien`, `hoc_vien`) có `isPremiumRole === false`, chạy nhánh `{ scale: 1, opacity: 1 }` nên lại hiển thị bình thường.

---

## 2. GIẢI PHÁP ĐỀ XUẤT
Sửa đổi thuộc tính `animate` của `MiniRoleBadge` trong cả phiên bản Web và Win, thêm thuộc tính `opacity: 1` vào nhánh premium roles để kích hoạt hiển thị cho Admin/Lãnh đạo.

### Sửa đổi cụ thể:
```typescript
animate={isPremiumRole ? {
  scale: [1, 1.1, 1],
  opacity: 1, // <--- BỔ SUNG Ở ĐÂY
  boxShadow: [
    '0 0 2px rgba(234, 179, 8, 0.4)',
    '0 0 8px rgba(239, 68, 68, 0.7)',
    '0 0 2px rgba(234, 179, 8, 0.4)'
  ],
  ...
} : { scale: 1, opacity: 1 }}
```

---

## 3. PHẠM VI ẢNH HƯỞNG (Scope)
Sửa đồng bộ 2 file:
1. `d:\Antigravity\TNDNB\ontap-web\components\Badges\MiniRoleBadge.tsx`
2. `d:\Antigravity\TNDNB\ontap-win\components\Badges\MiniRoleBadge.tsx`

---

## 4. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** 🟢 Rất dễ (sửa 1 dòng thuộc tính css/animation).
- **Thời gian xử lý:** ~5 phút.
- **Rủi ro:** 🟢 Không có rủi ro hệ thống.

---

## 5. BƯỚC TIẾP THEO
→ Chạy lệnh `/plan` để lên kế hoạch thi công chính thức.
