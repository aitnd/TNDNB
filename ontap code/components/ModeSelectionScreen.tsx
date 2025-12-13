import React from 'react';
import { BookOpenIcon3D, PracticeIcon3D, ArrowPathIcon3D, ClipboardListIcon3D } from './icons';

interface ModeSelectionScreenProps {
  onModeSelect: (mode: 'practice' | 'exam' | 'online_exam') => void;
  licenseName: string;
  userName: string;
  onSwitchLicense: () => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onModeSelect, licenseName, userName, onSwitchLicense }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right">
      <div className="relative text-center mb-10">
         <div className="absolute right-0 top-0">
             <button 
                onClick={onSwitchLicense} 
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-all duration-300 py-1 px-2 rounded-md hover:bg-secondary"
                title="Chọn lại hạng bằng"
            >
                <ArrowPathIcon3D className="h-4 w-4" />
                <span>Chọn lại hạng bằng</span>
            </button>
         </div>

        <h1 className="text-4xl font-bold text-foreground">
          Chào anh/chị {userName}!
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Anh/chị đang học hạng bằng <span className="font-semibold text-primary">{licenseName}</span>.
        </p>
        <p className="text-lg text-muted-foreground mt-1">
          Hãy chọn một chế độ để bắt đầu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice Mode */}
        <button
          onClick={() => onModeSelect('practice')}
          className="group bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center hover:bg-primary/10 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-ring"
        >
          <BookOpenIcon3D className="h-16 w-16 mx-auto text-primary mb-4 transition-transform group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-card-foreground">Ôn tập</h2>
          <p className="text-muted-foreground mt-2">Luyện tập từng môn để nắm vững kiến thức.</p>
        </button>

        {/* Exam Mode */}
        <button
          onClick={() => onModeSelect('exam')}
          className="group bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center hover:bg-destructive/10 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-ring"
        >
          <PracticeIcon3D className="h-16 w-16 mx-auto text-destructive mb-4 transition-transform group-hover:scale-110" />
          <h2 className="text-2xl font-bold text-card-foreground">Thi thử</h2>
          <p className="text-muted-foreground mt-2">Làm bài thi 30 câu ngẫu nhiên trong 45 phút.</p>
        </button>

        {/* Online Exam Mode */}
        <button
            onClick={() => onModeSelect('online_exam')}
            className="group bg-card text-card-foreground p-8 rounded-2xl shadow-lg text-center hover:bg-green-500/10 transition-all duration-300 transform hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-ring"
        >
            <ClipboardListIcon3D className="h-16 w-16 mx-auto text-green-500 mb-4 transition-transform group-hover:scale-110" />
            <h2 className="text-2xl font-bold text-card-foreground">Thi Online</h2>
            <p className="text-muted-foreground mt-2">Làm bài thi 30 câu ngẫu nhiên trong 60 phút với giao diện mô phỏng.</p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;