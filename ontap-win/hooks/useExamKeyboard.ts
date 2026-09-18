import { useEffect } from 'react';
import type { Question } from '../types';

export const useExamKeyboard = (
  onNext: () => void,
  onPrev: () => void,
  onSelectAnswer: (answerId: string) => void,
  currentQuestion: Question | undefined
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (['input', 'textarea'].includes(tag)) return;
      
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
      
      const keyMap: Record<string, number> = { '1':0, '2':1, '3':2, '4':3, 'a':0, 'b':1, 'c':2, 'd':3 };
      const idx = keyMap[e.key.toLowerCase()];
      if (idx !== undefined && currentQuestion?.answers?.[idx]) {
        onSelectAnswer(currentQuestion.answers[idx].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, onNext, onPrev, onSelectAnswer]);
};
