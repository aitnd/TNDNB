import React from 'react';
import { BookOpenIcon3D, PracticeIcon3D, ArrowPathIcon3D } from './icons';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: 'practice' | 'exam' | 'online_exam') => void;
  licenseName: string;
  userName: string;
  onSwitchLicense: () => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect, licenseName, userName, onSwitchLicense }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right pb-20">
      <div className="relative text-center mb-10 pt-2">
        <div className="flex justify-end mb-4">
          <button
            onClick={onSwitchLicense}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all py-1.5 px-3 rounded-xl bg-card border border-border hover:bg-muted"
            title="Chọn lại hạng bằng"
          >
            <ArrowPathIcon3D className="h-4 w-4 text-primary" />
            <span>Chọn lại hạng bằng</span>
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Chào anh/chị {userName}!
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Anh/chị đang học hạng bằng <span className="font-semibold text-primary">{licenseName}</span>.
        </p>
        <p className="text-base text-muted-foreground mt-1">
          Hãy chọn một chế độ để bắt đầu ôn luyện hoặc thi thử.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Practice Mode */}
        <button
          onClick={() => onModeSelect('practice')}
          className="group bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm text-center hover:border-primary/60 hover:shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <BookOpenIcon3D className="h-16 w-16 mx-auto text-primary mb-4 transition-transform group-hover:scale-105" />
          <h2 className="text-2xl font-bold text-foreground">Ôn tập</h2>
          <p className="text-sm text-muted-foreground mt-2">Luyện tập từng môn chuyên ngành để nắm vững kiến thức.</p>
        </button>

        {/* Exam Mode (Unified) */}
        <button
          onClick={() => onModeSelect('online_exam')}
          className="group bg-card text-card-foreground p-8 rounded-2xl border border-border shadow-sm text-center hover:border-primary/60 hover:shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <PracticeIcon3D className="h-16 w-16 mx-auto text-primary mb-4 transition-transform group-hover:scale-105" />
          <h2 className="text-2xl font-bold text-foreground">Thi thử</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Làm bài thi sát hạch <span className="tabular-nums font-semibold text-foreground">30 câu</span> ngẫu nhiên trong <span className="tabular-nums font-semibold text-foreground">45 phút</span>.
          </p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;
