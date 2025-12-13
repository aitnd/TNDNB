import React from 'react';
import { HelmIcon3D, InformationCircleIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeModalProps {
  onStart: () => void;
  onLoginClick: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onStart, onLoginClick }) => {
  const { theme } = useTheme();

  return (
    <div className="text-center p-4 animate-slide-in-right">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto relative">
        {theme === 'tri-an' ? (
          <img src="https://i.postimg.cc/MH9hVp8S/happy-techers-day.jpg" alt="Icon Chúc mừng Ngày Nhà giáo" className="h-24 w-24 mx-auto mb-4 rounded-full object-cover" />
        ) : theme === 'noel' ? (
           // Icon cho Noel, tạm thời dùng HelmIcon nhưng màu đỏ/vàng của theme sẽ tự áp dụng
           // Nếu muốn icon riêng có thể thay thế ở đây
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
      </div>
    </div>
  );
};

export default WelcomeModal;