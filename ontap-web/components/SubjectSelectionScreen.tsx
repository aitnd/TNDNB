import React, { useMemo, useState } from 'react';
import type { Subject, UserProgressData } from '../types';
import { ArrowLeftIcon3D, ChevronRightIcon3D, BookOpenIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';
import { useNavigate } from 'react-router-dom';
import { searchQuestions } from '../utils/searchUtils';

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
  const licenses = useAppStore(state => state.licenses);
  const incorrectQuestionIds = useAppStore(state => state.incorrectQuestionIds);
  const setCurrentQuiz = useAppStore(state => state.setCurrentQuiz);
  const navigate = useNavigate();
  
  const allQuestions = useMemo(() => 
    licenses.flatMap(l => l.subjects?.flatMap(s => s.questions || []) || []), 
  [licenses]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const filteredQs = useMemo(() => searchQuestions(allQuestions, searchTerm), [allQuestions, searchTerm]);

  const handlePracticeIncorrect = () => {
    const incorrectQs = allQuestions.filter(q => incorrectQuestionIds.includes(q.id));
    if (incorrectQs.length === 0) return alert("Tuyệt vời, bạn không có câu sai nào!");
    
    setCurrentQuiz({
      id: 'incorrect_practice',
      title: `Luyện tập câu sai (${incorrectQs.length} câu)`,
      questions: incorrectQs,
    });
    navigate('/ontap/lambai');
  };

  const handleSearchPractice = () => {
    if (filteredQs.length === 0) return alert("Không tìm thấy câu hỏi nào!");
    setCurrentQuiz({
      id: 'search_practice',
      title: `Kết quả tìm kiếm (${filteredQs.length} câu)`,
      questions: filteredQs,
    });
    navigate('/ontap/lambai');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right pb-24">
      <div className="relative text-center mb-8 pt-4">
        <button 
          onClick={() => { triggerHaptic('light'); onBack(); }} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card p-2 rounded-xl shadow-sm border border-border active:scale-95 transition-all text-foreground min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-muted"
          aria-label="Quay lại"
        >
          <ArrowLeftIcon3D className="h-6 w-6 text-primary" />
        </button>
        <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-sm">
          <BookOpenIcon3D className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Chọn Môn học</h1>
        <p className="text-sm text-muted-foreground mt-2">Chọn một môn chuyên ngành để bắt đầu ôn tập trọng tâm.</p>
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Tìm kiếm câu hỏi theo từ khóa..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        />
        {searchTerm && (
          <button 
            onClick={handleSearchPractice}
            className="w-full min-h-[44px] mt-2 bg-primary text-primary-foreground font-semibold p-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm tabular-nums"
          >
            Luyện tập {filteredQs.length} câu tìm được
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 gap-4">
        <button
          onClick={handlePracticeIncorrect}
          className="flex-1 min-h-[44px] bg-destructive/10 text-destructive hover:bg-destructive/15 font-semibold p-3 rounded-xl shadow-sm active:scale-[0.98] transition-all text-center border border-destructive/20 tabular-nums"
        >
          Luyện câu sai ({incorrectQuestionIds.length})
        </button>
      </div>

      <div className="space-y-3">
        {subjects.map((subject, index) => {
          const subjectProgress = progress[subject.id];
          const hasProgress = subjectProgress && subjectProgress.lastScore !== null;
          const completionRate = hasProgress ? (subjectProgress.highScore! / subject.questions.length) * 100 : 0;
          
          return (
            <button
              key={subject.id}
              onClick={() => { triggerHaptic('medium'); onSelect(subject); }}
              className="w-full group relative overflow-hidden flex flex-col p-5 bg-card text-card-foreground rounded-2xl text-left border border-border shadow-sm active:scale-[0.99] transition-all hover:border-primary/50"
            >
              {hasProgress && (
                <div className="absolute top-0 left-0 h-1 bg-primary rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }}></div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="flex-none w-10 h-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-foreground text-sm tabular-nums group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground leading-snug mb-0.5">{subject.name}</h3>
                    <p className="text-xs font-medium text-muted-foreground tabular-nums">{subject.questions.length} câu hỏi ôn tập</p>
                  </div>
                </div>
                <ChevronRightIcon3D className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>

              {hasProgress && (
                <div className="mt-3 pt-3 border-t border-border flex justify-between items-end">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider">Điểm cao nhất</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {subjectProgress.highScore}/{subject.questions.length}
                      </span>
                    </div>
                  </div>
                  {subjectProgress.lastScoreTimestamp && (
                    <span className="text-[10px] font-medium text-muted-foreground tabular-nums">
                      Cập nhật {formatDate(subjectProgress.lastScoreTimestamp)}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelectionScreen;
