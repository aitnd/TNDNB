import React, { useState, useMemo } from 'react';
import type { License, Subject } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { 
  ArrowLeftIcon3D, 
  AnchorIcon3D,
  BookOpenIcon3D,
  PracticeIcon3D,
} from './icons';

interface GiamKhaoSelectionScreenProps {
  licenses: License[];
  onSelectSubject: (subject: Subject, mode: 'practice' | 'online_exam') => void;
  onBack: () => void;
}

type GKStep = 'category' | 'mode' | 'subject';

const GiamKhaoSelectionScreen: React.FC<GiamKhaoSelectionScreenProps> = ({ licenses, onSelectSubject, onBack }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState<GKStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<'LT' | 'CM' | null>(null);

  // Tìm các hạng bằng Giám khảo
  const gkLicenses = useMemo(() => 
    licenses.filter(l => l.id.includes('giam-khao') || l.name.toLowerCase().includes('giám khảo')),
  [licenses]);

  // Tổng hợp tất cả môn học từ các bằng Giám khảo
  const allGKSubjects = useMemo(() => {
    const subs: Subject[] = [];
    gkLicenses.forEach(lic => {
      lic.subjects.forEach(s => {
        if (!subs.find(existing => existing.id === s.id)) {
          subs.push(s);
        }
      });
    });
    return subs;
  }, [gkLicenses]);

  // Phân loại môn học
  const ltChungKeywords = ['luật', 'biển báo', 'sa hình', 'văn hóa', 'nghị định', 'pháp luật', 'ký hiệu', 'tín hiệu', 'chung'];
  const categorizedSubjects = useMemo(() => {
    const lt = allGKSubjects.filter(s => {
      if (s.id.includes('lt-chung')) return true;
      const name = s.name.toLowerCase();
      return ltChungKeywords.some(kw => name.includes(kw));
    });
    const cm = allGKSubjects.filter(s => !lt.find(l => l.id === s.id));
    return { LT: lt, CM: cm };
  }, [allGKSubjects]);

  const currentCategorySubjects = selectedCategory ? categorizedSubjects[selectedCategory] : [];

  const handleCategoryClick = (cat: 'LT' | 'CM') => {
    setSelectedCategory(cat);
    setStep('mode');
  };

  const handleModeClick = (mode: 'practice' | 'exam') => {
    if (mode === 'practice') {
      setStep('subject');
    } else {
      startCategoryExam();
    }
  };

  const startCategoryExam = () => {
    if (!selectedCategory) return;
    const subjects = categorizedSubjects[selectedCategory];
    const allQuestions = subjects.flatMap(s => s.questions);
    
    // Đảo ngẫu nhiên và lấy 30 câu
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 30);
    
    const virtualSubject: Subject = {
      id: `gk_exam_${selectedCategory}_${Date.now()}`,
      name: selectedCategory === 'LT' ? 'Thi Thử Lý Thuyết Chung' : 'Thi Thử Chuyên Môn',
      questions: selected
    };

    onSelectSubject(virtualSubject, 'online_exam');
  };

  const handleBack = () => {
    if (step === 'subject') {
      setStep('mode');
    } else if (step === 'mode') {
      setStep('category');
    } else {
      onBack();
    }
  };

  if (gkLicenses.length === 0) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-900">
        <div className="p-12 bg-card/20 backdrop-blur-md rounded-3xl border border-dashed border-yellow-500/50 text-center italic text-yellow-500/70 shadow-2xl">
           <p className="text-xl font-bold mb-4">Hệ thống chưa cấu hình bộ đề Giám khảo.</p>
           <p className="text-sm">Vui lòng liên hệ quản trị viên để cập nhật dữ liệu.</p>
           <button onClick={onBack} className="mt-8 px-6 py-2 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors">Quay lại</button>
        </div>
      </div>
    );
  }

  const renderHeader = () => {
    let title = "TẬP HUẤN GIÁM KHẢO";
    let sub = "Nâng cao năng lực - Khẳng định vị thế";

    if (step === 'mode') {
      title = selectedCategory === 'LT' ? "LÝ THUYẾT CHUNG" : "CHUYÊN MÔN";
      sub = "Chọn chế độ tập huấn phù hợp";
    } else if (step === 'subject') {
      title = "DANH SÁCH MÔN HỌC";
      sub = "Chọn môn học cụ thể để bắt đầu ôn tập";
    }

    return (
      <div className="relative text-center mb-16">
        <button 
          onClick={handleBack} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl p-3 rounded-2xl shadow-2xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 border border-white/10 group"
        >
            <ArrowLeftIcon3D className="h-8 w-8 text-amber-500 group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <div className="inline-block p-6 rounded-[2.5rem] bg-gradient-to-br from-amber-400 via-yellow-500 to-yellow-600 shadow-[0_20px_50px_rgba(234,179,8,0.3)] mb-8 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
           <AnchorIcon3D className="h-16 w-16 text-slate-900 filter drop-shadow-lg" />
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-200 to-yellow-600 drop-shadow-2xl uppercase">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-4">
           <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-yellow-500/50" />
           <p className="text-lg md:text-xl text-amber-500/80 font-serif italic tracking-widest px-4">
              {sub}
           </p>
           <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-yellow-500/50" />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-start py-12 px-6 animate-fade-in relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#d4af37 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="w-full max-w-5xl">
        {renderHeader()}

        {step === 'category' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up">
            <button
              onClick={() => handleCategoryClick('LT')}
              className="group relative overflow-hidden p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all duration-500 shadow-2xl transform hover:-translate-y-2"
            >
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 border border-amber-500/20 shadow-2xl group-hover:scale-110 transition-all">
                  <BookOpenIcon3D className="h-14 w-14 text-amber-500" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">1.1 Lý thuyết chung</h3>
                <p className="text-slate-400">Kiến thức chung về Pháp luật, Biển báo, Quy tắc giao thông.</p>
              </div>
            </button>

            <button
              onClick={() => handleCategoryClick('CM')}
              className="group relative overflow-hidden p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all duration-500 shadow-2xl transform hover:-translate-y-2"
            >
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 border border-amber-500/20 shadow-2xl group-hover:scale-110 transition-all">
                  <PracticeIcon3D className="h-14 w-14 text-amber-500" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">1.2 Chuyên môn</h3>
                <p className="text-slate-400">Kiến thức về Nghiệp vụ Giám khảo và huấn luyện thực hành.</p>
              </div>
            </button>
          </div>
        )}

        {step === 'mode' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slide-up">
            <button
              onClick={() => handleModeClick('practice')}
              className="group relative overflow-hidden p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] text-center hover:border-emerald-500/50 transition-all duration-500 shadow-2xl transform hover:-translate-y-2"
            >
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-emerald-500/20 shadow-2xl">
                   <BookOpenIcon3D className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Ôn tập</h3>
                <p className="text-slate-400">Học chi tiết từng môn trong category.</p>
              </div>
            </button>

            <button
              onClick={() => handleModeClick('exam')}
              className="group relative overflow-hidden p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] text-center hover:border-amber-500/50 transition-all duration-500 shadow-2xl transform hover:-translate-y-2"
            >
              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-900 border border-amber-500/20 shadow-2xl">
                   <div className="text-yellow-500 font-black text-2xl">30</div>
                </div>
                <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Thi thử</h3>
                <p className="text-slate-400">Đề tổng hợp 30 câu ngẫu nhiên.</p>
                <div className="mt-4 text-amber-500/80 text-sm font-bold flex gap-4">
                   <span>⏱️ 45 phút</span>
                   <span>✅ 27/30</span>
                </div>
              </div>
            </button>
          </div>
        )}

        {step === 'subject' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {currentCategorySubjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => onSelectSubject(sub, 'practice')}
                className="group p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl text-left hover:border-amber-500/40 transition-all transform hover:scale-[1.02]"
              >
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{sub.name}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{sub.questions.length} câu hỏi</p>
              </button>
            ))}
          </div>
        )}

        <div className="mt-24 text-center">
            <p className="text-xs text-amber-500/40 font-black tracking-[0.5em] uppercase">Premium Teacher Training System</p>
        </div>
      </div>
    </div>
  );
};

export default GiamKhaoSelectionScreen;
