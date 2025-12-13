import React, { useState, useMemo } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, TrophyIcon3D } from './icons';

interface ResultsScreenProps {
  quiz: Quiz;
  userAnswers: UserAnswers;
  score: number;
  onRetry: () => void;
  onBack: () => void;
  userName: string;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ quiz, userAnswers, score, onRetry, onBack, userName }) => {
  const [filter, setFilter] = useState<'all' | 'incorrect'>('all');
  const [completionDate] = useState(() => new Date());
  
  const totalQuestions = quiz.questions.length;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(completionDate);
  }, [completionDate]);

  const filteredQuestions = useMemo(() => {
    if (filter === 'incorrect') {
      return quiz.questions.filter(q => userAnswers[q.id] !== q.correctAnswerId);
    }
    return quiz.questions;
  }, [filter, quiz.questions, userAnswers]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right font-quiz-default">
        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8 text-center mb-8">
            <TrophyIcon3D className="h-24 w-24 mx-auto text-yellow-400 mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2">Kết quả Ôn tập</h1>

            <div className="my-4 text-muted-foreground">
                <p className="text-lg">Học viên: <span className="font-bold text-primary">{userName}</span></p>
                <p className="text-sm">Hoàn thành lúc: {formattedDate}</p>
            </div>

            <div className="bg-primary/10 inline-block p-6 rounded-xl border border-primary/20 mt-4">
                <p className="text-5xl font-extrabold text-primary">
                    {score} / {totalQuestions}
                </p>
                <p className="text-2xl font-semibold text-primary/80 mt-1">({percentage}%)</p>
            </div>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Xem lại bài làm</h2>
              <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      Tất cả
                  </button>
                  <button onClick={() => setFilter('incorrect')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${filter === 'incorrect' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      Chỉ câu sai ({quiz.questions.length - score})
                  </button>
              </div>
            </div>
            
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                {filteredQuestions.length > 0 ? filteredQuestions.map((question, index) => {
                    const userAnswerId = userAnswers[question.id];
                    const correctAnswerId = question.correctAnswerId;
                    
                    return (
                        <div key={question.id} className="p-4 border-b border-border last:border-b-0">
                            <p className="font-semibold text-lg mb-3 text-foreground">
                                <span className="mr-2">Câu {quiz.questions.findIndex(q => q.id === question.id) + 1}:</span>
                                {question.text}
                            </p>
                            <div className="space-y-2">
                                {question.answers.map(answer => {
                                    const isUserAnswer = answer.id === userAnswerId;
                                    const isCorrectAnswer = answer.id === correctAnswerId;
                                    
                                    let itemClass = "flex items-center p-3 rounded-md text-sm ";
                                    if(isCorrectAnswer) {
                                        itemClass += "bg-success/10 text-success";
                                    } else if(isUserAnswer) {
                                        itemClass += "bg-destructive/10 text-destructive";
                                    } else {
                                        itemClass += "bg-muted/50 text-muted-foreground";
                                    }

                                    return (
                                        <div key={answer.id} className={itemClass}>
                                            {isCorrectAnswer ? <CheckIcon3D className="h-5 w-5 mr-3 text-success" /> : isUserAnswer ? <XIcon3D className="h-5 w-5 mr-3 text-destructive" /> : <div className="w-5 h-5 mr-3"></div>}
                                            <span>{answer.text}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    );
                }) : (
                  <p className="text-center text-muted-foreground py-8">Tuyệt vời! Anh/chị đã trả lời đúng tất cả các câu hỏi.</p>
                )}
            </div>
        </div>
        
        <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
              onClick={onBack}
              className="w-full sm:w-auto bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-ring transition-all duration-300 transform hover:scale-105"
          >
              Các môn khác
          </button>
          <button
              onClick={onRetry}
              className="w-full sm:w-auto bg-secondary text-secondary-foreground font-bold py-3 px-8 rounded-lg hover:bg-muted focus:outline-none focus:ring-4 focus:ring-ring transition-colors duration-300"
          >
              Làm lại
          </button>
        </div>
    </div>
  );
};

export default ResultsScreen;