# 💡 BRIEF: Khắc phục lỗi xác thực Monetag (Installation Error) - Phương án chèn thẻ <script> thô vào <head>

**Ngày tạo:** 2026-06-30  
**Brainstorm cùng:** Lập trình viên chính  

---

## 1. PHÂN TÍCH TÌNH TRẠNG HIỆN TẠI
Qua hình ảnh anh cung cấp và kiểm tra thực tế mã nguồn HTML trả về từ máy chủ `www.daotaothuyenvien.com`:

1. **Cấu hình Zone ID:**
   - File Service Worker (`sw.js`) ở root: có mã vùng **`11218490`** (Khớp 100% với file JS anh tải xuống).
   - Thẻ Script nhúng: có mã vùng **`254797`** (Khớp 100% với code snippet trong popup).
   - **Kết luận:** Zone IDs hoàn toàn chính xác.

2. **Lý do lỗi "Installation error" vẫn xuất hiện:**
   Khi kiểm tra mã nguồn HTML tĩnh của `www.daotaothuyenvien.com`, thẻ nhúng Monetag đang được hiển thị dưới dạng:
   ```html
   <script>(self.__next_s=self.__next_s||[]).push(["https://quge5.com/88/tag.min.js",{"data-zone":"254797","data-cfasync":"false","id":"monetag-multitag"}])</script>
   ```
   - **Nguyên nhân:** Do ta đang dùng component `<Script>` của Next.js với `strategy="beforeInteractive"`. Next.js sẽ chuyển đổi thẻ script này vào một hàng đợi dạng JavaScript (`self.__next_s.push`) để tải sau khi tải trang, nhằm tối ưu hóa SEO và tốc độ.
   - **Vấn đề:** Bot quét của Monetag là bot quét HTML tĩnh đơn giản, nó không thực thi JavaScript. Khi quét qua trang web của anh, nó tìm kiếm chính xác chuỗi `<script src="https://quge5.com/88/tag.min.js" data-zone="254797" ...>` ở trong mã nguồn HTML. Vì không tìm thấy thẻ script thô này, nó lập tức báo lỗi **"Installation error"**.

---

## 2. GIẢI PHÁP ĐỀ XUẤT
Thay vì dùng `<Script>` component của Next.js (bị biến đổi thành script loader), ta sẽ tự định nghĩa thẻ `<head>` thô và chèn trực tiếp thẻ `<script>` HTML chuẩn vào trong `app/layout.tsx`.

### Sửa đổi cụ thể trong `app/layout.tsx`:
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        {/* Nhúng thẻ script thô của Monetag trực tiếp vào head để bot dễ dàng phát hiện */}
        <script 
          src="https://quge5.com/88/tag.min.js" 
          data-zone="254797" 
          async 
          data-cfasync="false"
        ></script>
      </head>
      <body className={rubik.className} suppressHydrationWarning={true}>
        ...
```

Và gỡ bỏ component `<Script id="monetag-multitag" ... />` ở cuối body.

---

## 3. BƯỚC TIẾP THEO
→ Chạy lệnh `/plan` để lên kế hoạch thi công chính thức.
