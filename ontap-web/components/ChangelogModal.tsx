import * as React from 'react';
import { X, Shield, Smartphone, Rocket, Zap, Monitor, Layout, Settings, Code } from 'lucide-react';

interface ChangelogModalProps {
  onClose: () => void;
}

// 💖 Dữ liệu changelog dạng cấu trúc
const CHANGELOG_DATA = [
  {
    version: '3.9.0',
    date: '15/03/2026',
    isLatest: true,
    sections: [
      {
        icon: Rocket,
        title: 'Đại tu Giao diện (Premium v2)',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
        items: [
          'Ra mắt Premium Theme v2.2: Phối màu Cyan-Navy nghệ thuật, hiệu ứng Glassmorphism đỉnh cao',
          'Tinh chỉnh bảng màu cho toàn bộ 8 Themes: Tăng contrast, bố cục card chuyên nghiệp',
          'Nâng cấp hiệu ứng Visual riêng biệt: Mỗi theme có đổ bóng (Shadow) và hiệu ứng Glow Card riêng',
          'Đồng bộ hóa 100% màu sắc và tính năng giữa bản Web, Windows và Android'
        ]
      },
      {
        icon: Zap,
        title: 'Cải tiến Kỹ thuật',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        items: [
          'Sử dụng font Inter hiện đại cho Premium theme',
          'Tối ưu CSS Utility classes cho hiệu ứng kính mờ (Glass premium)',
          'Khắc phục lỗi hiển thị nền gradient trên các phiên bản trình duyệt cũ'
        ]
      }
    ]
  },
  {
    version: '3.8.12',
    date: '18/01/2026',
    isLatest: false,
    sections: [
      {
        icon: Zap,
        title: 'Nâng cấp giao diện Thẻ',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        items: [
          'Thiết kế lại Thẻ Học viên/Giáo viên phong cách Premium Hologram v2.2',
          'Sửa lỗi chính tả "THÈ" thành "THẺ" trên toàn hệ thống',
          'Hiệu ứng tia sáng Hologram và Chip nhựa điện tử như thật'
        ]
      }
    ]
  },
  {
    version: '3.8.11',
    date: '18/01/2026',
    isLatest: false,
    sections: [
      {
        icon: Zap,
        title: 'Tính năng mới',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        items: [
          'Thêm "Góc Giải Trí" bản Premium với kho trò chơi HTML5 & Retro cực đỉnh (Contra, Đào Vàng, Subway Surfers...)',
          'Tích hợp module giải trí đa phương tiện (Game, Nhạc, Phim) mượt mà',
          'Nút truy cập nhanh "Giải trí" ngay trên thanh Menu chính'
        ]
      },
      {
        icon: Layout,
        title: 'Cải thiện & Khôi phục',
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        items: [
          'Khôi phục TopNavbar về thiết kế Sticky Bar ổn định',
          'Tối ưu hiển thị Header thẻ nhựa giúp tránh tràn chữ trên Mobile',
          'Giao diện Góc giải trí hiệu ứng Glassmorphism siêu đẹp'
        ]
      }
    ]
  },
  {
    version: '3.8.10',
    date: '09/01/2026',
    sections: [
      {
        icon: Zap,
        title: 'Tính năng mới',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        items: [
          'Lưu tài khoản đăng nhập giống Facebook - đăng nhập nhanh chỉ 1 chạm',
          'Hiển thị danh sách tài khoản đã lưu sau khi đăng xuất',
          'Hỗ trợ xóa tài khoản khỏi danh sách lưu cục bộ'
        ]
      }
    ]
  },
  {
    version: '3.8.9',
    date: '06/01/2026',
    sections: [
      {
        icon: Zap,
        title: 'Sửa lỗi',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        items: [
          'Sửa lỗi màn hình nháy nháy khi ôn tập môn Pháp luật (hạng Thủy thủ)',
          'Khắc phục hình ảnh câu hỏi không load được từ câu 49 trở đi',
          'Thêm cơ chế chống vòng lặp retry khi load ảnh thất bại'
        ]
      }
    ]
  },
  {
    version: '3.8.8',
    date: '25/12/2025',
    sections: [
      {
        icon: Shield,
        title: 'Bảo mật & Quản lý phiên đăng nhập',
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        items: [
          'Tự động gửi thông báo khi tài khoản đăng nhập từ thiết bị mới',
          'Hiện địa chỉ (thành phố, quốc gia) thay vì chỉ IP trong thông báo',
          'Admin có thể xem và đăng xuất phiên đăng nhập của học viên từ xa',
          'Thêm trang xem lịch sử đăng nhập và thiết bị đang hoạt động'
        ]
      },
      {
        icon: Smartphone,
        title: 'Cải thiện trang Tải App',
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        items: [
          'Hiển thị đầy đủ 3 phiên bản: Windows, Android, iOS',
          'Tự động lấy link Windows từ GitHub Releases API',
          'Khắc phục lỗi 404 khi tên file có dấu tiếng Việt'
        ]
      }
    ]
  },
  {
    version: '3.8.7',
    date: '22/12/2025',
    sections: [
      {
        icon: Monitor,
        title: 'Tính năng mới (Windows App)',
        color: 'text-purple-500',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        items: [
          'Thêm tùy chọn "Tự khởi động cùng Windows" trong trang Tài khoản',
          'Đồng bộ hóa phiên bản giữa bản Web và bản Windows'
        ]
      }
    ]
  },
  {
    version: '3.8.0',
    date: '20/12/2025',
    sections: [
      {
        icon: Zap,
        title: 'Tính năng Mới & Đồng bộ',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        items: [
          'Học viên đăng nhập 1 lần tại Trang chủ sẽ tự động đăng nhập vào App Ôn tập',
          'Số phiên bản trên giao diện tự động cập nhật theo thời gian thực'
        ]
      },
      {
        icon: Layout,
        title: 'Cải thiện Giao diện (UI/UX)',
        color: 'text-green-500',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        items: [
          'Thêm tiền tố A, B, C, D cho các đáp án dễ quan sát',
          'Sửa lỗi không thoát được bài thi',
          'Tối ưu Banner nhắc nhở "Làm tiếp bài cũ"'
        ]
      }
    ]
  },
  {
    version: '3.7.0',
    date: '16/12/2025',
    sections: [
      {
        icon: Rocket,
        title: 'Hệ thống Thi Trực Tuyến',
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        items: [
          'Tích hợp hoàn toàn module Thi Trực Tuyến vào hệ thống',
          'Thêm trang chờ thi với giao diện mới',
          'Hỗ trợ học viên đăng nhập và tham gia phòng thi bằng mã phòng'
        ]
      },
      {
        icon: Code,
        title: 'Kỹ thuật',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100 dark:bg-gray-900/30',
        items: [
          'Cấu hình script build để hỗ trợ deploy đồng thời Next.js và React app',
          'Dọn dẹp code quản lý thi cũ để tránh xung đột'
        ]
      }
    ]
  }
];

export const getLatestVersion = () => {
  return CHANGELOG_DATA[0]?.version || '3.0.0';
};

const ChangelogModal: React.FC<ChangelogModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900/50 dark:to-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white">
              <Rocket size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                Lịch sử cập nhật
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Phiên bản mới nhất: v{CHANGELOG_DATA[0]?.version}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {CHANGELOG_DATA.map((release, rIdx) => (
            <div key={rIdx} className="relative">
              {/* Version Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${release.isLatest
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  }`}>
                  v{release.version}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {release.date}
                </span>
                {release.isLatest && (
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                    MỚI NHẤT
                  </span>
                )}
              </div>

              {/* Sections */}
              <div className="space-y-4 pl-2">
                {release.sections.map((section, sIdx) => {
                  const IconComponent = section.icon;
                  return (
                    <div key={sIdx} className="rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
                      <div className={`flex items-center gap-2 px-4 py-2.5 ${section.bgColor}`}>
                        <IconComponent size={18} className={section.color} />
                        <span className={`font-semibold text-sm ${section.color}`}>
                          {section.title}
                        </span>
                      </div>
                      <ul className="p-4 space-y-2 bg-white dark:bg-slate-800/50">
                        {section.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 flex-shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              {rIdx < CHANGELOG_DATA.length - 1 && (
                <div className="border-t border-dashed border-gray-200 dark:border-slate-700 mt-6"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Cập nhật liên tục để phục vụ bạn tốt hơn ❤️
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;