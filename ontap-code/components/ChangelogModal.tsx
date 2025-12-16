import React from 'react';
import { XMarkIcon, InformationCircleIcon } from './icons';

interface ChangelogModalProps {
  onClose: () => void;
}

const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 md:p-8 max-w-2xl w-full m-4 animate-slide-in-right"
        onClick={(e) => e.stopPropagation()} // Ngăn việc click bên trong modal làm đóng modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <InformationCircleIcon className="h-6 w-6" />
            Lịch sử cập nhật
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Đóng"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="text-sm text-left text-muted-foreground max-h-[70vh] overflow-y-auto pr-2 space-y-4">
          <div>
            <p className="font-semibold text-foreground"><strong>Phiên bản v3.5.1 (16/12/2025 - System Upgrade):</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>🛠️ <strong>Hệ Thống Admin:</strong> Ra mắt công cụ quét và sửa dữ liệu học viên lỗi (Orphaned Data).</li>
              <li>👤 <strong>Avatar:</strong> Hiển thị ảnh đại diện người dùng trong trang quản lý.</li>
              <li>⚡ <strong>Technical:</strong> Tối ưu hóa hiệu năng và sửa lỗi giao diện nhỏ.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground"><strong>Phiên bản v3.5.0 (15/12/2025 - Quản Lý Thành Viên):</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>✅ <strong>Xác thực Thành viên:</strong> Phân biệt "Học Viên Lớp" (Verified) và Thành viên tự do. Hiển thị dấu tích xanh và tên màu xanh dương.</li>
              <li>🏫 <strong>Quản lý lớp học:</strong> Tự động reset trạng thái khi xóa lớp/xóa học viên. Làm nổi bật Giáo viên chủ nhiệm (GVCN).</li>
              <li>⏱️ <strong>Sửa lỗi:</strong> Cập nhật Timer thi thử chuẩn 45 phút.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground"><strong>Phiên bản v3.4.0 (Cập nhật Âm nhạc):</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>🎵 <strong>Nhạc nền Jingle Bells:</strong> Tự động phát nhạc Giáng sinh vui nhộn khi mở ứng dụng (với Theme Noel).</li>
              <li>🔊 <strong>Điều khiển nhạc:</strong> Nút Bật/Tắt nhạc tiện lợi ở góc màn hình.</li>
              <li>🖼️ <strong>Hình nền mới:</strong> Cập nhật hình nền Giáng sinh chất lượng cao.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground"><strong>Phiên bản v3.3.1 (Cập nhật giao diện):</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>🔴 <strong>Theme Noel Đỏ Rực:</strong> Chuyển đổi theme Giáng Sinh sang tông màu Đỏ chủ đạo (Red Tone) cho cả nền và biểu tượng.</li>
              <li>🎨 <strong>Nền đỏ rượu vang:</strong> Sử dụng màu nền đỏ đậm sang trọng kết hợp với các icon đỏ tươi tạo hiệu ứng nổi bật.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-foreground"><strong>Phiên bản v3.3.0 (Cập nhật Giáng Sinh):</strong></p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>🎄 <strong>Giao diện mới:</strong> Ra mắt chủ đề "Giáng Sinh" (Noel) với tông màu Xanh - Đỏ - Vàng ấm áp.</li>
              <li>✨ <strong>Chế độ mặc định:</strong> Ứng dụng tự động chuyển sang giao diện Giáng Sinh để chào đón mùa lễ hội.</li>
              <li>🎨 <strong>Cải tiến UI:</strong> Tối ưu hóa độ tương phản cho chế độ nền tối (dark mode) của theme mới.</li>
            </ul>
          </div>
          {/* ... Các phiên bản cũ hơn ... */}
          <div className="pt-4 border-t border-border mt-4">
            <p className="font-semibold text-foreground text-xs uppercase tracking-wider mb-2">Lịch sử phát triển</p>
            <div className="space-y-3 pl-2 border-l-2 border-muted">
              <div className="relative">
                <span className="absolute -left-[13px] top-1.5 h-2 w-2 rounded-full bg-blue-500"></span>
                <p className="font-bold text-sm">v3.3.0 - 10/12/2025</p>
                <p className="text-xs">Theme Giáng Sinh & Bản build ổn định.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[13px] top-1.5 h-2 w-2 rounded-full bg-purple-500"></span>
                <p className="font-bold text-sm">v3.0.0 - 14/11/2025 🌟</p>
                <p className="text-xs">Official Release: daotaothuyenvien.com</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[13px] top-1.5 h-2 w-2 rounded-full bg-orange-500"></span>
                <p className="font-bold text-sm">v2.0.0 - 09/11/2025</p>
                <p className="text-xs">Core Engine Update & Fix Deploy.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[13px] top-1.5 h-2 w-2 rounded-full bg-green-500"></span>
                <p className="font-bold text-sm">v1.0.0 - 20/10/2025 🐣</p>
                <p className="text-xs">Alpha Test Version.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChangelogModal;