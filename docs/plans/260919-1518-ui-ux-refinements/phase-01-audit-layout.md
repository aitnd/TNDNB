# Phase 1: Audit & Layout Fixes (Navbar Overlap)

## Objectives
- Ensure no content is obscured by the TopNavbar on any screen (Web & Win).
- Verify MobileHeader spacing for mobile platforms.

## Implementation Steps (TDD Enriched)

### Task 1.1: Audit TopNavbar positioning — Windows App

**Files:**
- [`ontap-win/routes/AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx#L126-L155)

**Phân tích hiện trạng:**

Wrapper gốc tại **dòng 127** đã có `pt-16` cho desktop:
```tsx
// AppRoutes.tsx:127
<div className={`min-h-screen bg-background text-foreground font-sans transition-colors duration-300 ${isMobileApp ? 'pb-24 pt-20' : 'pt-16'}`}>
```

TopNavbar render tại **dòng 148-152** bên trong `{!isMobileApp && (<>...</>)}`:
```tsx
// AppRoutes.tsx:146-155
{!isMobileApp && (
  <>
    <TopNavbar
      userProfile={userProfile}
      onNavigate={handleTopNavNavigate}
      onLogout={handleLogout}
    />
    <AlertMarquee />
  </>
)}
```

MobileHeader render tại **dòng 142-144** với `isMobileApp` guard:
```tsx
// AppRoutes.tsx:142-144
{isMobileApp && (
  <MobileHeader userProfile={userProfile} />
)}
```

**Kết luận:** `ontap-win/routes/AppRoutes.tsx` **ĐÃ CÓ** `pt-16` trên wrapper div (dòng 127). Navbar overlap trên Win **không bị** nếu `TopNavbar` height = `4rem` (64px = `h-16`).

**Hành động cần làm:**
1. Xác nhận `TopNavbar` component có class `fixed top-0` và `h-16` (hoặc tương đương 64px).
2. Nếu `TopNavbar` height khác 64px → cập nhật `pt-16` thành giá trị tương ứng.
3. Kiểm tra `AlertMarquee` có thêm chiều cao → nếu có, tăng padding tương ứng.

**Manual Check:**
```
1. Chạy app Win: cd ontap-win && npm run dev
2. Mở Dashboard → kiểm tra nội dung đầu tiên không bị che bởi navbar
3. Mở trang Quiz (/ontap/lambai) → xác nhận câu hỏi đầu tiên hiển thị đầy đủ
4. Mở trang Kết quả (/ontap/ketqua) → xác nhận tiêu đề không bị ẩn
5. Thu nhỏ cửa sổ xuống 800px width → kiểm tra lại
```

---

### Task 1.2: Audit TopNavbar positioning — Web App

**Files:**
- [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L405-L457)

**Phân tích hiện trạng:**

Wrapper gốc tại **dòng 406** đã có `pt-16` cho desktop:
```tsx
// App.tsx:406
<div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 ${isMobileApp ? 'pb-32' : 'pt-16'}`}>
```

TopNavbar render tại **dòng 418-428** bên trong `{!isMobileApp && (<>...</>)}`:
```tsx
// App.tsx:418-428
{!isMobileApp && (
  <>
    <TopNavbar
      userProfile={userProfile}
      onNavigate={handleTopNavNavigate}
      onLogout={handleLogout}
    />
    <AlertMarquee />
    <div className="pt-16" />
  </>
)}
```

⚠️ **Vấn đề phát hiện:** Dòng 426 có thêm `<div className="pt-16" />` — đây là **spacer div thừa** vì wrapper đã có `pt-16` ở dòng 406. Điều này tạo ra **khoảng trống 128px** (2×64px) trên Web desktop, đẩy nội dung xuống quá xa.

**Hành động cần làm:**
1. **Xóa** `<div className="pt-16" />` tại dòng 426 — wrapper `pt-16` đã đủ.
2. Hoặc: Nếu `AlertMarquee` cần thêm khoảng cách, thay bằng spacer phù hợp chỉ cho marquee.

**Code thay đổi:**
```tsx
// TRƯỚC (App.tsx:418-428)
{!isMobileApp && (
  <>
    <TopNavbar ... />
    <AlertMarquee />
    <div className="pt-16" />   // ← XÓA DÒNG NÀY
  </>
)}

// SAU
{!isMobileApp && (
  <>
    <TopNavbar ... />
    <AlertMarquee />
  </>
)}
```

**Manual Check:**
```
1. Chạy app Web: cd ontap-web && npm run dev
2. Mở http://localhost:5173/ontap/dashboard
3. Kiểm tra khoảng cách giữa TopNavbar và nội dung đầu tiên:
   - Đúng: ~64px padding (1 lần pt-16)
   - Sai: ~128px padding (nếu chưa xóa spacer div)
4. Inspect bằng DevTools: wrapper div phải chỉ có 1 lần padding-top: 4rem
5. Mở trang Quiz, Results → kiểm tra tương tự
```

---

### Task 1.3: Verify MobileHeader spacing

**Files:**
- [`ontap-win/routes/AppRoutes.tsx`](file:///d:/Antigravity/TNDNB/ontap-win/routes/AppRoutes.tsx#L127) — `pt-20` cho mobile
- [`ontap-web/App.tsx`](file:///d:/Antigravity/TNDNB/ontap-web/App.tsx#L406) — `pb-32` cho mobile

**Phân tích:**
- Win & Web: Kiểm tra file `MobileHeader.tsx` (chiều cao tự động + safe-area). Padding `pt-20` (80px) có thể bị thiếu nếu `AlertMarquee` hiển thị (hiện tại tính tĩnh).
- Cần tính toán động hoặc đảm bảo safe-area + chiều cao Marquee được cộng dồn vào `padding-top` chung.

**Manual Check (Mobile Emulation):**
```
1. Mở DevTools → Toggle device toolbar → chọn iPhone 14
2. Kiểm tra MobileHeader không che nội dung
3. Cuộn xuống → MobileBottomNav không che nội dung cuối
```
