import React from 'react';
import type { Subject, UserProgressData } from '../types';
import { ArrowLeftIcon3D, ChevronRightIcon3D, BookOpenIcon3D } from './icons';

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
    <div className="w-full max-w-2xl mx-auto p-4 animate-slide-in-right">
      <div className="relative text-center mb-10">
        <button 
          onClick={onBack} 
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-3 rounded-full shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 transform hover:scale-110"
          aria-label="Quay lại"
        >
            <ArrowLeftIcon3D className="h-10 w-10 text-primary" />
        </button>
        <BookOpenIcon3D className="h-20 w-20 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold text-foreground">Chọn Môn học</h1>
        <p className="text-lg text-muted-foreground mt-2">Chọn một môn để bắt đầu ôn tập.</p>
      </div>

      <div className="bg-card p-6 rounded-2xl shadow-lg">
        <div className="space-y-3">
          {subjects.map(subject => {
            const subjectProgress = progress[subject.id];
            const hasProgress = subjectProgress && subjectProgress.lastScore !== null;
            
            return (
              <button
                key={subject.id}
                onClick={() => onSelect(subject)}
                className="w-full flex items-center justify-between p-5 bg-background rounded-lg text-left hover:bg-primary/10 transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-ring focus:outline-none"
              >
                <div>
                  <h3 className="text-lg font-bold text-primary">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">{subject.questions.length} câu hỏi</p>
                </div>
                <div className="flex items-center gap-4">
                  {hasProgress && (
                    <div className="text-right text-sm">
                        <p className="text-muted-foreground flex items-center justify-end">
                            <span>Lần cuối:</span>
                            <span className="font-semibold text-primary ml-1">{subjectProgress.lastScore}/{subject.questions.length}</span>
                            {subjectProgress.lastScoreTimestamp && <span className="ml-1.5 text-xs text-muted-foreground/80">{formatDate(subjectProgress.lastScoreTimestamp)}</span>}
                        </p>
                        <p className="text-muted-foreground flex items-center justify-end mt-0.5">
                            <span>Cao nhất:</span>
                            <span className="font-semibold text-success ml-1">{subjectProgress.highScore}/{subject.questions.length}</span>
                            {subjectProgress.highScoreTimestamp && <span className="ml-1.5 text-xs text-muted-foreground/80">{formatDate(subjectProgress.highScoreTimestamp)}</span>}
                        </p>
                    </div>
                  )}
                  <ChevronRightIcon3D className="h-6 w-6 text-muted-foreground" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelectionScreen;