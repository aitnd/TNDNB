import React, { useState, useMemo, useEffect } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, ArrowLeftIcon3D } from './icons';

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

  // Safety Check
  if (!quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Chưa có câu hỏi nào trong chủ đề này.</h2>
        <button
          onClick={onBack}
          className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const currentQuestion = useMemo(() => quiz.questions[currentQuestionIndex], [quiz.questions, currentQuestionIndex]);

  // Safety check for out of bounds index
  if (!currentQuestion) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Có lỗi xảy ra khi tải câu hỏi.</h2>
        <button onClick={onBack} className="bg-primary text-primary-foreground py-2 px-4 rounded-lg">Quay lại</button>
      </div>
    )
  }

  const isAnswered = useMemo(() => userAnswers[currentQuestion.id] !== undefined, [userAnswers, currentQuestion.id]);
  const selectedAnswer = useMemo(() => userAnswers[currentQuestion.id] || null, [userAnswers, currentQuestion.id]);

  // Auto-save logic
  useEffect(() => {
    onProgressUpdate?.(currentQuestionIndex, 0, userAnswers);
  }, [currentQuestionIndex, userAnswers]);


  const handleFinishQuiz = () => {
    onFinish(userAnswers);
  };

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswered) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    if (isLastQuestion) {
      handleFinishQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const progressPercentage = ((currentQuestionIndex) / quiz.questions.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6 animate-slide-in-right font-quiz-default">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-6 md:p-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4 relative">
            <button
              onClick={onBack}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/50 p-3 rounded-full shadow-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card transition-all duration-300 transform hover:scale-110"
              aria-label="Quay lại"
            >
              <ArrowLeftIcon3D className="h-10 w-10" />
            </button>
            <h1 className="text-xl font-bold text-foreground text-center flex-grow">{quiz.title}</h1>
            <button
              onClick={handleFinishQuiz}
              className={'bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-bold py-2 px-4 rounded-lg transition-colors duration-300'}
            >
              Kết thúc
            </button>
          </div>
          <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Câu {currentQuestionIndex + 1} / {quiz.questions.length}</span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-foreground">{currentQuestion.text}</h2>
          {currentQuestion.image && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img src={currentQuestion.image} alt="Câu hỏi" className="w-full h-auto object-cover max-h-80" />
            </div>
          )}

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, index) => {
              const isSelected = selectedAnswer === answer.id;
              let buttonClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-between text-lg';

              const isCorrect = answer.id === currentQuestion.correctAnswerId;
              if (isAnswered) {
                if (isCorrect) {
                  buttonClass += ' bg-success/10 border-success text-success';
                } else if (isSelected && !isCorrect) {
                  buttonClass += ' bg-destructive/10 border-destructive text-destructive';
                } else {
                  buttonClass += ' border-border text-muted-foreground';
                }
              } else {
                if (isSelected) {
                  buttonClass += ' bg-primary/10 border-primary ring-2 ring-primary text-primary-foreground';
                } else {
                  buttonClass += ' bg-background hover:bg-muted border-border text-foreground';
                }
              }

              return (
                <button
                  key={answer.id}
                  onClick={() => handleAnswerSelect(answer.id)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <span className="flex-grow"><span className='font-bold mr-2'>{String.fromCharCode(65 + index)}. </span>{answer.text}</span>
                  {isAnswered && (
                    <>
                      {isCorrect && <CheckIcon3D className="h-6 w-6 text-success ml-3" />}
                      {isSelected && !isCorrect && <XIcon3D className="h-6 w-6 text-destructive ml-3" />}
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
                  className="bg-success text-success-foreground font-bold py-3 px-8 rounded-lg hover:bg-success/90 transition-all duration-300 animate-slide-in-right"
                >
                  {currentQuestionIndex === quiz.questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}
                </button>
              ) : (
                <div className="h-[48px]"></div> // Placeholder to prevent layout jump
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;