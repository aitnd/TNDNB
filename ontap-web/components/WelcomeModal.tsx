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
