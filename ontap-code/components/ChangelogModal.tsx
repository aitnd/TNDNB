import * as React from 'react';
import { X } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
}

const CHANGELOG_CONTENT = `
# Changelog

## [v3.7.0] - 2025-12-16
### 🚀 Tính năng mới
- **Hệ thống Thi Trực Tuyến (Online Exam):**
  - Tích hợp hoàn toàn module Thi Trực Tuyến vào hệ thống.
  - Thêm trang chờ thi (\`/thitructuyen\`) với giao diện mới.
  - Hỗ trợ học viên đăng nhập và tham gia phòng thi bằng mã phòng.
  - Giáo viên/Quản lý có thể truy cập trang Quản lý thi từ TopNavbar.

### 🎨 Giao diện & Trải nghiệm
- **Điều hướng:**
  - Thêm nút "Thi trực tuyến" vào thanh TopNavbar (Ứng dụng Ôn tập).
  - Thêm liên kết "Thi trực tuyến" vào Menu chính và Footer (Trang chủ).
  - Cập nhật Sitemap để hỗ trợ SEO cho trang thi.
- **Trang Thi Trực Tuyến:**
  - Cập nhật thông tin Footer và Logo đơn vị.
  - Tối ưu hóa luồng đăng nhập và chuyển hướng người dùng.

### 🛠️ Kỹ thuật
- Cấu hình script build để hỗ trợ deploy đồng thời cả Next.js và React app lên Vercel.
- Dọn dẹp code quản lý thi cũ khỏi hệ thống Next.js để tránh xung đột.
- Sửa các lỗi giao diện và logic nhỏ khác.

---

## [v3.6.0] - 2024-12-15
### 🌟 Tính năng
- Cập nhật giao diện Dashboard.
- Tối ưu hóa hiệu năng tải trang.
`;

const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            🚀 Lịch sử cập nhật
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans">{CHANGELOG_CONTENT}</pre>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;