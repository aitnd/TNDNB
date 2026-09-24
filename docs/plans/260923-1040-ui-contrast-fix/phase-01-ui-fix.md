# Phase 1: Cải thiện UI Contrast cho Upload Release

## Bước 1: Điều chỉnh "Đã chọn" trong `UsageConfigPanel.tsx`
1. Mở file `ontap-web/components/UsageConfigPanel.tsx`.
2. Tìm đến đoạn code render danh sách file (khoảng dòng 788-797):
   ```tsx
   {selectedFiles.length > 0 && (
       <div className="mt-4 p-4 border rounded-lg dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50">
           <h5 className="font-bold mb-2 text-gray-800 dark:text-gray-200">Đã chọn:</h5>
           <ul className="list-disc pl-5 text-gray-800 dark:text-gray-200">
               {selectedFiles.map(f => (
                   <li key={f.name}>{f.name}</li>
               ))}
           </ul>
       </div>
   )}
   ```
3. Đảm bảo thay đổi đã thêm class text cho dark/light mode. Lưu file.

## Bước 2: Điều chỉnh thông báo lỗi trong `UploadStatus.tsx`
1. Mở file `ontap-web/components/Admin/UploadStatus.tsx`.
2. Tìm đến đoạn return khi có `error`.
3. Thay thế class tailwind ở thẻ `div` chứa thông báo từ:
   `mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 rounded flex items-center justify-between`
   thành:
   `mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-600 dark:text-red-400 rounded flex items-center justify-between`
4. Lưu file.

## Bước 3: Kiểm tra
1. Chạy lại dự án bằng lệnh `npm run dev` hoặc `yarn dev`.
2. Truy cập panel cấu hình hệ thống, thử chọn một vài file để đảm bảo chữ "Đã chọn:" và tên file dễ đọc.
3. Test case lỗi upload (có thể tắt kết nối mạng trước khi bấm nút) để hiện thông báo "Có lỗi xảy ra khi phát hành", đảm bảo màu đỏ hiển thị chuẩn, không bị tối ở cả chế độ Dark và Light.
