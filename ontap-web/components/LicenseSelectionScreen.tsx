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
import { triggerHaptic } from '../utils/nativeUX';

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
        if (name.includes('thuyền trưởng')) return <img src="/assets/img/hat.png" alt="Captain Hat" className={noelIconClass} loading="lazy" />;
        if (name.includes('máy trưởng')) return <img src="/assets/img/gift4.png" alt="Chief Engineer" className={noelIconClass} loading="lazy" />;
        if (name.includes('thủy thủ')) return <img src="/assets/img/bell.png" alt="Sailor" className={noelIconClass} loading="lazy" />;
        if (name.includes('lái phương tiện')) return <img src="/assets/img/tree.png" alt="Helm" className={noelIconClass} loading="lazy" />;
        if (name.includes('chứng chỉ')) return <img src="/assets/img/star-gold.png" alt="Certificate" className={noelIconClass} loading="lazy" />;
        return <img src="/assets/img/gift5.png" alt="Default" className={noelIconClass} loading="lazy" />;
    }

    if (theme === 'tri-an') {
        switch (license.id) {
            // === NEW BOOK ICONS for Thuyền trưởng ===
            case 'thuyentruong-h1':
                return <img src="https://i.postimg.cc/Vs76y54F/8.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'thuyentruong-h2':
                return <img src="https://i.postimg.cc/Pf6xGNK4/9.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'thuyentruong-h3':
                return <img src="https://i.postimg.cc/Vs76y54W/7.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            
            // Original themed icons (transparent)
            case 'thuythu':
                return <AnchorIcon3D className={defaultIconClass} />;
            case 'lai-phuong-tien':
                return <HelmIcon3D className={defaultIconClass} />;

            // === IMAGES that need rounding ===
            case 'maytruong-h1':
                return <img src="https://i.postimg.cc/zDpm90H6/undefined.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'maytruong-h2':
                return <img src="https://i.postimg.cc/wMwSLjdc/Teachers-day-background-design-art-illustration.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'maytruong-h3':
                return <img src="https://i.postimg.cc/NFdWmjwH/Hinh-thiep.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            
            case 'thomay':
                return <img src="https://i.postimg.cc/cJYy2WQN/hinh-nen-3.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'caotoc':
                return <img src="https://i.postimg.cc/dQWMQybn/5.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'ven-bien':
                return <img src="https://i.postimg.cc/zDdmDgs0/6.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'antoan-ven-bien':
                return <img src="https://i.postimg.cc/ZYFWdtv0/BOARD.webp" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'antoan-xang-dau':
                return <img src="https://i.postimg.cc/T2k82Dzc/4.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;
            case 'antoan-hoa-chat':
                return <img src="https://i.postimg.cc/mZVx08Ff/World-Teacher-s-Day-Flowers-Border-Pink.jpg" alt={license.name} className={imageIconClass} loading="lazy" />;

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
    <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right pb-24">
      <div className="relative text-center mb-10 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-all font-bold text-slate-600"
          aria-label="Quay lại"
        >
            <ArrowLeftIcon3D className="h-8 w-8 text-slate-800 dark:text-white" />
        </button>
        <div className="bg-indigo-100 dark:bg-indigo-900/30 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
          {theme === 'noel' ? (
              <img src="/assets/img/tree.png" alt="Tree" className="h-14 w-14 object-contain drop-shadow-lg animate-pulse" loading="lazy" />
          ) : (
              <AnchorIcon3D className="h-14 w-14 text-indigo-600 drop-shadow-md" />
          )}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Chọn Hạng Bằng</h1>
        <p className="text-base md:text-lg text-slate-500 mt-2 font-medium px-4">Vui lòng chọn hạng bằng muốn ôn tập và thi thử.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {licenses.map(license => {
          const totalQuestions = license.subjects.reduce((sum, subject) => sum + subject.questions.length, 0);
          return (
            <button
              key={license.id}
              onClick={() => { triggerHaptic('medium'); onSelect(license); }}
              className="group relative overflow-hidden flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-800 rounded-[2.5rem] text-center border-2 border-slate-100 dark:border-slate-700 shadow-xl active:scale-90 transition-all hover:border-indigo-500/50 hover:shadow-indigo-500/10"
            >
              <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                {getLicenseIcon(license, theme)}
              </div>
              <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white leading-tight mb-2">{license.name}</h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                <p className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-widest">{license.subjects.length} môn • {totalQuestions} câu</p>
              </div>
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default LicenseSelectionScreen;