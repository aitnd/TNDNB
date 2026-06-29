import type { Subject, UserProgressData } from '../types';
import { ArrowLeftIcon3D, ChevronRightIcon3D, BookOpenIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';

interface SubjectSelectionScreenProps {
  subjects: Subject[];
  progress: UserProgressData;
  onSelect: (subject: Subject) => void;
  onBack: () => void;
}

const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `(${day}/${month} ${hours}:${minutes})`;
};

const SubjectSelectionScreen: React.FC<SubjectSelectionScreenProps> = ({ subjects, progress, onSelect, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right pb-24">
      <div className="relative text-center mb-10 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 active:scale-90 transition-all font-bold text-slate-600"
          aria-label="Quay lại"
        >
            <ArrowLeftIcon3D className="h-8 w-8 text-slate-800 dark:text-white" />
        </button>
        <div className="bg-blue-100 dark:bg-blue-900/30 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <BookOpenIcon3D className="h-12 w-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Chọn Môn học</h1>
        <p className="text-base text-slate-500 mt-2">Chọn một môn để bắt đầu ôn tập.</p>
      </div>

      <div className="space-y-4">
          {subjects.map((subject, index) => {
            const subjectProgress = progress[subject.id];
            const hasProgress = subjectProgress && subjectProgress.lastScore !== null;
            const completionRate = hasProgress ? (subjectProgress.highScore! / subject.questions.length) * 100 : 0;
            
            return (
              <button
                key={subject.id}
                onClick={() => { triggerHaptic('medium'); onSelect(subject); }}
                className="w-full group relative overflow-hidden flex flex-col p-5 bg-white dark:bg-slate-800 rounded-3xl text-left border border-slate-200 dark:border-slate-700 shadow-md active:scale-[0.97] transition-all hover:border-blue-300"
              >
                {hasProgress && (
                  <div className="absolute top-0 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }}></div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex-none w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-slate-800 dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight mb-1">{subject.name}</h3>
                      <p className="text-sm font-bold text-slate-400 capitalize">{subject.questions.length} câu hỏi ôn tập</p>
                    </div>
                  </div>
                  <ChevronRightIcon3D className="h-6 w-6 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>

                {hasProgress && (
                  <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700/50 flex justify-between items-end">
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Điểm cao nhất</span>
                        <span className="text-sm font-black text-green-600">{subjectProgress.highScore}/{subject.questions.length}</span>
                      </div>
                    </div>
                    {subjectProgress.lastScoreTimestamp && (
                      <span className="text-[10px] font-bold text-slate-300 italic">
                        Cập nhật {formatDate(subjectProgress.lastScoreTimestamp)}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
      </div>
    </div>
  );
};

export default SubjectSelectionScreen;