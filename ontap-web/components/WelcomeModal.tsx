import React from 'react';
import { HelmIcon3D, InformationCircleIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeModalProps {
  onStart: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onLoginClick, onRegisterClick }) => {
  const { theme } = useTheme();

  // === PREMIUM v2 THEME ===
  if (theme === 'premium') {
    return (
      <div className="text-center p-4 animate-slide-in-right min-h-[80vh] flex items-center justify-center">
        <div className="relative max-w-2xl mx-auto">
          {/* Glow effect phía sau card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-3xl opacity-20 blur-xl" />

          <div className="relative rounded-3xl p-8 md:p-12 border border-white/10"
            style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)' }}>

            {/* Icon với animation */}
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 opacity-20 animate-pulse" />
              <HelmIcon3D className="h-20 w-20 mx-auto text-cyan-400 relative z-10" />
            </div>

            {/* Gradient title */}
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text" style={{ WebkitTextFillColor: 'transparent' }}>
                Ứng Dụng Ôn tập
              </span>
            </h1>

            <p className="text-lg mb-2 font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Ôn thi chứng chỉ chuyên môn phương tiện thủy nội địa
            </p>

            <p className="text-sm mb-8" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Hệ thống câu hỏi cập nhật • Thi thử giống đề thật • Theo dõi tiến độ
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onStart}
                className="w-full sm:w-auto font-bold text-lg py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
                style={{ background: 'linear-gradient(135deg, hsl(187 96% 42%), hsl(217 91% 60%))', color: 'hsl(var(--primary-foreground))' }}
              >
                🚀 Bắt đầu Ôn tập
              </button>
              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto font-bold text-lg py-4 px-10 rounded-xl border border-white/20 hover:bg-white/5 transition-all duration-300"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                Đăng nhập
              </button>
            </div>

            <div className="mt-5">
              <button
                onClick={onRegisterClick}
                className="text-sm hover:underline font-medium"
                style={{ color: 'hsl(var(--primary))' }}
              >
                Chưa có tài khoản? Đăng ký ngay →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === THEME CŨ (giữ nguyên) ===
  return (
    <div className="text-center p-4 animate-slide-in-right">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto relative">
        {theme === 'tri-an' ? (
          <img src="https://i.postimg.cc/MH9hVp8S/happy-techers-day.jpg" alt="Icon Chúc mừng Ngày Nhà giáo" className="h-24 w-24 mx-auto mb-4 rounded-full object-cover" />
        ) : theme === 'noel' ? (
          <HelmIcon3D className="h-24 w-24 mx-auto text-primary mb-4" />
        ) : (
          <HelmIcon3D className="h-24 w-24 mx-auto text-primary mb-4" />
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
          Ứng Dụng Ôn tập
        </h1>

        {theme === 'tri-an' && (
          <p className="text-xl font-semibold text-primary mb-4">
            Phiên bản đặc biệt Tri Ân Thầy Cô
          </p>
        )}
        {theme === 'noel' && (
          <p className="text-xl font-semibold text-primary mb-4">
            Chào đón Giáng Sinh An Lành
          </p>
        )}

        <p className="text-lg text-muted-foreground mb-4">
          Chào mừng anh/chị đã đến với Ứng dụng Ôn tập, ôn thi chứng chỉ chuyên môn phương tiện thủy nội địa.
        </p>

        {theme === 'tri-an' && (
          <p className="text-lg text-muted-foreground mb-8 italic">
            "Nhân ngày Nhà giáo Việt Nam 20-11, kính chúc quý thầy cô luôn mạnh khỏe, hạnh phúc và thành công trong sự nghiệp trồng người."
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStart}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-bold text-lg py-4 px-10 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300 transform hover:scale-105"
          >
            Bắt đầu
          </button>
          <button
            onClick={onLoginClick}
            className="w-full sm:w-auto bg-secondary text-secondary-foreground font-bold text-lg py-4 px-10 rounded-lg hover:bg-secondary/80 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300"
          >
            Đăng nhập
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={onRegisterClick}
            className="text-primary hover:underline font-medium"
          >
            Chưa có tài khoản? Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;