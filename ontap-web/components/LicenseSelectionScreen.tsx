import React from 'react';
import { License } from '../types';
import { 
    CaptainIcon3D, 
    EngineerIcon3D, 
    AnchorIcon3D, 
    HelmIcon3D, 
    CertificateIcon3D, 
    LifebuoyIcon3D,
    ArrowLeftIcon3D 
} from './icons';
import { triggerHaptic } from '../utils/nativeUX';

interface LicenseSelectionScreenProps {
  licenses: License[];
  onSelect: (license: License) => void;
  onBack: () => void;
}

const getLicenseIcon = (license: License): React.ReactNode => {
    const defaultIconClass = "h-14 w-14 mx-auto text-primary mb-2 object-contain";
    const name = license.name.toLowerCase();

    if (name.includes('thuyền trưởng')) return <CaptainIcon3D className={defaultIconClass} />;
    if (name.includes('máy trưởng')) return <EngineerIcon3D className={defaultIconClass} />;
    if (name.includes('thủy thủ')) return <AnchorIcon3D className={defaultIconClass} />;
    if (name.includes('lái phương tiện')) return <HelmIcon3D className={defaultIconClass} />;
    if (name.includes('chứng chỉ')) return <CertificateIcon3D className={defaultIconClass} />;
    return <LifebuoyIcon3D className={defaultIconClass} />;
};

const LicenseSelectionScreen: React.FC<LicenseSelectionScreenProps> = ({ licenses, onSelect, onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right pb-24">
      <div className="relative text-center mb-8 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card p-2 rounded-2xl shadow-sm border border-border active:scale-95 transition-all text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-6 w-6 text-primary" />
        </button>
        <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm">
          <AnchorIcon3D className="h-12 w-12 text-primary drop-shadow-sm" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">Chọn Hạng Bằng</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium px-4">Vui lòng chọn hạng bằng muốn ôn tập và thi thử.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {licenses.map(license => {
          const totalQuestions = license.subjects.reduce((sum, subject) => sum + subject.questions.length, 0);
          return (
            <button
              key={license.id}
              onClick={() => { triggerHaptic('medium'); onSelect(license); }}
              className="group relative flex flex-col items-center justify-between p-6 bg-card text-card-foreground rounded-2xl text-center border border-border shadow-sm hover:border-primary/60 hover:shadow-md active:scale-[0.98] transition-all min-h-[190px]"
            >
              <div className="mb-3 transform group-hover:scale-105 transition-transform duration-300">
                {getLicenseIcon(license)}
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground leading-snug mb-3">{license.name}</h3>
              <div className="bg-secondary px-3 py-1.5 rounded-full border border-border">
                <p className="text-xs font-semibold text-primary tabular-nums">
                  {license.subjects.length} môn • {totalQuestions} câu
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LicenseSelectionScreen;
