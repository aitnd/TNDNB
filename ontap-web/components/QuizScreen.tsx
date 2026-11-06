import React, { useState, useMemo, useEffect } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, ArrowLeftIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';
import { useFontScale } from '../hooks/useFontScale';
import { useAppStore } from '../stores/useAppStore';
import { resolveQuestionImageUrl, resolveQuestionImageFallbackUrl } from '../utils/imageHelper';

interface QuizScreenProps {
  quiz: Quiz;
  onFinish: (answers: UserAnswers) => void;
  onBack: () => void;
  initialIndex?: number;
  initialAnswers?: UserAnswers;
  onProgressUpdate?: (index: number, timeLeft: number, answers: UserAnswers) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({
  quiz,
  onFinish,
  onBack,
  initialIndex = 0,
  initialAnswers = {},
  onProgressUpdate
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialIndex);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>(initialAnswers);
  const { scale } = useFontScale();

  const currentQuestion = useMemo(() => quiz.questions?.[currentQuestionIndex], [quiz.questions, currentQuestionIndex]);
  const currentQuestionId = currentQuestion?.id;

  const isAnswered = useMemo(() => currentQuestionId ? userAnswers[currentQuestionId] !== undefined : false, [userAnswers, currentQuestionId]);
  const selectedAnswer = useMemo(() => currentQuestionId ? userAnswers[currentQuestionId] || null : null, [userAnswers, currentQuestionId]);
  const currentImageUrl = useMemo(
    () => (currentQuestion ? resolveQuestionImageUrl(currentQuestion) : null),
    [currentQuestion]
  );

  // Preload ảnh câu hỏi kế tiếp để chuyển câu không có độ trễ
  useEffect(() => {
    const nextQ = quiz.questions?.[currentQuestionIndex + 1];
    if (nextQ) {
      const nextUrl = resolveQuestionImageUrl(nextQ);
      if (nextUrl) {
        const img = new Image();
        img.src = nextUrl;
      }
    }
  }, [quiz.questions, currentQuestionIndex]);

  // Auto-save logic
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate(currentQuestionIndex, 0, userAnswers);
    }
  }, [currentQuestionIndex, userAnswers, onProgressUpdate]);

  // Safety Check
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4 text-foreground">Chưa có câu hỏi nào trong chủ đề này.</h2>
        <button
          onClick={onBack}
          className="min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-6 rounded-xl font-semibold shadow-sm transition-colors"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // Safety check for out of bounds index
  if (!currentQuestion) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4 text-foreground">Có lỗi xảy ra khi tải câu hỏi.</h2>
        <button 
          onClick={onBack} 
          className="min-h-[44px] bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-6 rounded-xl font-semibold shadow-sm transition-colors"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const removeIncorrectQuestion = useAppStore(state => state.removeIncorrectQuestion);
  const isPracticeMode = quiz.id === 'incorrect_practice';
  const addIncorrectQuestions = useAppStore(state => state.addIncorrectQuestions);

  const handleFinishQuiz = () => {
    const incorrectIds = quiz.questions
      .filter(q => userAnswers[q.id] !== undefined && userAnswers[q.id] !== q.correctAnswerId)
      .map(q => q.id);
    if (incorrectIds.length > 0) {
      addIncorrectQuestions(incorrectIds);
    }
    
    triggerHaptic('medium');
    onFinish(userAnswers);
  };

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswered && (!isPracticeMode || selectedAnswer === currentQuestion.correctAnswerId)) return;
    
    if (isPracticeMode && answerId === currentQuestion.correctAnswerId) {
      removeIncorrectQuestion(currentQuestion.id);
    }
    
    triggerHaptic('light');
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    if (isLastQuestion) {
      handleFinishQuiz();
    } else {
      triggerHaptic('light');
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 animate-slide-in-right font-quiz-default" style={{ '--content-scale': scale } as React.CSSProperties}>
      <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 md:p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4 relative">
            <button
              onClick={onBack}
              className="bg-card border border-border p-2 rounded-xl shadow-sm hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground"
              aria-label="Quay lại"
            >
              <ArrowLeftIcon3D className="h-6 w-6 text-primary" />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-foreground text-center flex-grow px-4 truncate">{quiz.title}</h1>
            <button
              onClick={handleFinishQuiz}
              className="min-h-[40px] bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
            >
              Kết thúc
            </button>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-2 overflow-hidden">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span className="tabular-nums font-medium">Câu {currentQuestionIndex + 1} / {quiz.questions.length}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Question & Answers Area */}
          <div className="flex-1 min-w-0">
            <h2 className="font-bold mb-5 text-foreground leading-snug" style={{ fontSize: 'calc(1.25rem * var(--content-scale, 1))' }}>
              {currentQuestion.text}
            </h2>
            {currentImageUrl && (
              <div className="mb-6 rounded-xl overflow-hidden border border-border bg-muted/20">
                <img
                  src={currentImageUrl}
                  alt="Hình minh họa câu hỏi"
                  className="w-full h-auto object-contain max-h-80 mx-auto"
                  loading="lazy"
                  onError={(e) => {
                    const fallback = resolveQuestionImageFallbackUrl(currentQuestion);
                    if (fallback && e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
                      e.currentTarget.src = fallback;
                    }
                  }}
                />
              </div>
            )}

            <div className="space-y-3">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer.id;
                let buttonClass = 'w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between min-h-[52px] ';

                const isCorrect = answer.id === currentQuestion.correctAnswerId;
                const showReveal = isAnswered && (!isPracticeMode || isSelected);

                if (showReveal) {
                  if (isCorrect) {
                    buttonClass += 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    buttonClass += 'bg-destructive/10 border-destructive/40 text-destructive font-semibold';
                  } else {
                    buttonClass += 'border-border text-muted-foreground opacity-60';
                  }
                } else {
                  if (isSelected) {
                    buttonClass += 'bg-primary/10 border-primary ring-2 ring-primary text-primary font-semibold';
                  } else {
                    buttonClass += 'bg-card hover:bg-muted/60 border-border text-foreground';
                  }
                }

                return (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerSelect(answer.id)}
                    disabled={isAnswered && (!isPracticeMode || selectedAnswer === currentQuestion.correctAnswerId)}
                    className={buttonClass}
                    style={{ fontSize: 'calc(1.05rem * var(--content-scale, 1))' }}
                  >
                    <span className="flex-grow">
                      <span className="font-bold mr-2 tabular-nums">{String.fromCharCode(65 + index)}. </span>
                      {answer.text}
                    </span>
                    {showReveal && (
                      <>
                        {isCorrect && <CheckIcon3D className="h-5 w-5 text-emerald-600 dark:text-emerald-400 ml-3 flex-shrink-0" />}
                        {isSelected && !isCorrect && <XIcon3D className="h-5 w-5 text-destructive ml-3 flex-shrink-0" />}
                      </>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <div className="text-right">
                {isAnswered ? (
                  <button
                    onClick={handleNext}
                    className="min-h-[44px] bg-primary text-primary-foreground font-semibold py-2.5 px-8 rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                  >
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                  </button>
                ) : (
                  <div className="h-[44px]"></div>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigation Grid */}
          <div className="w-full md:w-[240px] flex-none">
            <div className="flex flex-wrap gap-2 justify-center p-3.5 bg-muted/50 rounded-xl border border-border">
              {quiz.questions.map((q, index) => {
                const hasAnswered = userAnswers[q.id] !== undefined;
                const isCorrect = userAnswers[q.id] === q.correctAnswerId;
                const isCurrent = currentQuestionIndex === index;
                return (
                  <button
                    key={q.id}
                    onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(index); }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-xs tabular-nums transition-colors ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground ring-2 ring-ring shadow-sm'
                        : hasAnswered
                          ? isCorrect
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                          : 'bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
