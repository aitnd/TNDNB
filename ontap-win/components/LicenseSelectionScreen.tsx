import React from 'react';
import type { License, Theme } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ArrowLeftIcon3D, 
  AnchorIcon3D,
  CaptainIcon3D,
  EngineerIcon3D,
  HelmIcon3D,
  CertificateIcon3D,
  LifebuoyIcon3D
} from './icons';

interface LicenseSelectionScreenProps {
  licenses: License[];
  onSelect: (license: License) => void;
  onBack: () => void;
}

const getLicenseIcon = (license: License, theme: Theme): React.ReactNode => {
    const defaultIconClass = "h-14 w-14 mx-auto text-primary mb-3 object-contain";
    const imageIconClass = "h-14 w-14 mx-auto mb-3 object-cover rounded-full border-2 border-border/20 shadow-sm";
    const noelIconClass = "h-14 w-14 mx-auto mb-3 object-contain drop-shadow-lg";
    const name = license.name.toLowerCase();

    if (theme === 'noel') {
        if (name.includes('thuyền trưởng')) return <img src="/assets/img/hat.png" alt="Captain Hat" className={noelIconClass} />;
        if (name.includes('máy trưởng')) return <img src="/assets/img/gift4.png" alt="Chief Engineer" className={noelIconClass} />;
        if (name.includes('thủy thủ')) return <img src="/assets/img/bell.png" alt="Sailor" className={noelIconClass} />;
        if (name.includes('lái phương tiện')) return <img src="/assets/img/tree.png" alt="Helm" className={noelIconClass} />;
        if (name.includes('chứng chỉ')) return <img src="/assets/img/star-gold.png" alt="Certificate" className={noelIconClass} />;
        return <img src="/assets/img/gift5.png" alt="Default" className={noelIconClass} />;
    }

    if (theme === 'tri-an') {
        switch (license.id) {
            // === NEW BOOK ICONS for Thuyền trưởng ===
            case 'thuyentruong-h1':
                return <img src="https://i.postimg.cc/Vs76y54F/8.jpg" alt={license.name} className={imageIconClass} />;
            case 'thuyentruong-h2':
                return <img src="https://i.postimg.cc/Pf6xGNK4/9.jpg" alt={license.name} className={imageIconClass} />;
            case 'thuyentruong-h3':
                return <img src="https://i.postimg.cc/Vs76y54W/7.jpg" alt={license.name} className={imageIconClass} />;
            
            // Original themed icons (transparent)
            case 'thuythu':
                return <AnchorIcon3D className={defaultIconClass} />;
            case 'lai-phuong-tien':
                return <HelmIcon3D className={defaultIconClass} />;

            // === IMAGES that need rounding ===
            case 'maytruong-h1':
                return <img src="https://i.postimg.cc/zDpm90H6/undefined.jpg" alt={license.name} className={imageIconClass} />;
            case 'maytruong-h2':
                return <img src="https://i.postimg.cc/wMwSLjdc/Teachers-day-background-design-art-illustration.jpg" alt={license.name} className={imageIconClass} />;
            case 'maytruong-h3':
                return <img src="https://i.postimg.cc/NFdWmjwH/Hinh-thiep.jpg" alt={license.name} className={imageIconClass} />;
            
            case 'thomay':
                return <img src="https://i.postimg.cc/cJYy2WQN/hinh-nen-3.jpg" alt={license.name} className={imageIconClass} />;
            case 'caotoc':
                return <img src="https://i.postimg.cc/dQWMQybn/5.jpg" alt={license.name} className={imageIconClass} />;
            case 'ven-bien':
                return <img src="https://i.postimg.cc/zDdmDgs0/6.jpg" alt={license.name} className={imageIconClass} />;
            case 'antoan-ven-bien':
                return <img src="https://i.postimg.cc/ZYFWdtv0/BOARD.webp" alt={license.name} className={imageIconClass} />;
            case 'antoan-xang-dau':
                return <img src="https://i.postimg.cc/T2k82Dzc/4.jpg" alt={license.name} className={imageIconClass} />;
            case 'antoan-hoa-chat':
                return <img src="https://i.postimg.cc/mZVx08Ff/World-Teacher-s-Day-Flowers-Border-Pink.jpg" alt={license.name} className={imageIconClass} />;

            // Default for any other 'chứng chỉ' - use the original journal icon
            default:
                if (name.includes('chứng chỉ')) {
                    return <CertificateIcon3D className={defaultIconClass} />;
                }
                return <LifebuoyIcon3D className={defaultIconClass} />;
        }
    }

    // Default behavior for other themes
    if (name.includes('thuyền trưởng')) return <CaptainIcon3D className={defaultIconClass} />;
    if (name.includes('máy trưởng')) return <EngineerIcon3D className={defaultIconClass} />;
    if (name.includes('thủy thủ')) return <AnchorIcon3D className={defaultIconClass} />;
    if (name.includes('lái phương tiện')) return <HelmIcon3D className={defaultIconClass} />;
    if (name.includes('chứng chỉ')) return <CertificateIcon3D className={defaultIconClass} />;
    return <LifebuoyIcon3D className={defaultIconClass} />;
};

const LicenseSelectionScreen: React.FC<LicenseSelectionScreenProps> = ({ licenses, onSelect, onBack }) => {
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right">
      <div className="relative text-center mb-10">
        <button 
          onClick={onBack} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-3 rounded-full shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 transform hover:scale-110"
          aria-label="Quay lại"
        >
            <ArrowLeftIcon3D className="h-10 w-10 text-primary" />
        </button>
        {theme === 'noel' ? (
            <img src="/assets/img/tree.png" alt="Tree" className="h-20 w-20 mx-auto mb-4 object-contain drop-shadow-lg" />
        ) : (
            <AnchorIcon3D className="h-20 w-20 mx-auto text-primary mb-4" />
        )}
        
        <h1 className="text-4xl font-bold text-foreground">Chọn Hạng Bằng</h1>
        <p className="text-lg text-muted-foreground mt-2">Anh/chị vui lòng chọn hạng bằng muốn ôn tập và thi thử.</p>
      </div>

      <div className="bg-card p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {licenses.map(license => {
            const totalQuestions = license.subjects.reduce((sum, subject) => sum + subject.questions.length, 0);
            return (
              <button
                key={license.id}
                onClick={() => onSelect(license)}
                className="group w-full p-4 bg-background rounded-lg text-center hover:bg-primary/10 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-ring focus:outline-none"
              >
                {getLicenseIcon(license, theme)}
                <h3 className="text-md font-bold text-primary">{license.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{license.subjects.length} môn - {totalQuestions} câu</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default LicenseSelectionScreen;