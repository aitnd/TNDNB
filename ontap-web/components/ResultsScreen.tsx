import React, { useState, useMemo, useEffect } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, TrophyIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';
import { resolveQuestionImageFallbackUrl } from '../utils/imageHelper';

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

    useEffect(() => {
        triggerHaptic('success');
    }, []);

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

    const displayName = userName?.trim() ? userName : 'Học viên ẩn danh';

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right font-quiz-default pb-20">
            {/* Summary Card */}
            <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-8 md:p-10 text-center mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <TrophyIcon3D className="h-24 w-24 mx-auto text-amber-500 mb-3 drop-shadow-sm" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2 uppercase tracking-tight">Kết quả Ôn tập</h1>

                    <div className="my-3 text-muted-foreground text-sm">
                        <p className="text-base">Học viên: <span className="font-bold text-foreground">{displayName}</span></p>
                        <p className="text-xs mt-1">Hoàn thành lúc: <span className="tabular-nums font-semibold">{formattedDate}</span></p>
                    </div>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-primary/20 flex flex-col items-center justify-center bg-card shadow-inner">
                                <p className="text-4xl md:text-5xl font-black text-primary tabular-nums">{score}</p>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tabular-nums">/{totalQuestions} Câu</p>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-xs font-bold shadow-sm tabular-nums">
                                {percentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Card */}
            <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-bold text-foreground uppercase tracking-tight">Chi tiết bài làm</h2>
                    <div className="flex bg-muted p-1 rounded-xl w-full md:w-auto border border-border">
                        <button 
                            onClick={() => { triggerHaptic('light'); setFilter('all'); }} 
                            className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${filter === 'all' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
                        >
                            Tất cả ({totalQuestions})
                        </button>
                        <button 
                            onClick={() => { triggerHaptic('light'); setFilter('incorrect'); }} 
                            className={`flex-1 md:flex-none px-5 py-2 text-xs font-semibold rounded-lg transition-all ${filter === 'incorrect' ? 'bg-card text-destructive shadow-sm' : 'text-muted-foreground'}`}
                        >
                            Câu sai <span className="tabular-nums font-bold">({totalQuestions - score})</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredQuestions.length > 0 ? filteredQuestions.map((question) => {
                        const userAnswerId = userAnswers[question.id];
                        const correctAnswerId = question.correctAnswerId;

                        return (
                            <div key={question.id} className="p-4 border-b border-border last:border-b-0">
                                <p className="font-semibold text-base mb-3 text-foreground leading-snug">
                                    <span className="mr-2 text-primary tabular-nums">Câu {quiz.questions.findIndex(q => q.id === question.id) + 1}:</span>
                                    {question.text}
                                </p>
                                {question.image && (
                                    <div className="mb-4 rounded-xl overflow-hidden border border-border bg-muted/20">
                                        <img
                                            src={question.image}
                                            alt="Câu hỏi"
                                            className="w-full h-auto object-contain max-h-80 mx-auto"
                                            loading="lazy"
                                            onError={(e) => {
                                                const fallback = resolveQuestionImageFallbackUrl(question);
                                                if (fallback && e.currentTarget.src !== fallback && !e.currentTarget.src.endsWith(fallback)) {
                                                    e.currentTarget.src = fallback;
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    {question.answers.map(answer => {
                                        const isUserAnswer = answer.id === userAnswerId;
                                        const isCorrectAnswer = answer.id === correctAnswerId;

                                        let itemClass = "flex items-center p-3 rounded-xl text-sm border ";
                                        if (isCorrectAnswer) {
                                            itemClass += "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold";
                                        } else if (isUserAnswer) {
                                            itemClass += "bg-destructive/10 border-destructive/30 text-destructive font-semibold";
                                        } else {
                                            itemClass += "bg-card border-border text-muted-foreground opacity-75";
                                        }

                                        return (
                                            <div key={answer.id} className={itemClass}>
                                                {isCorrectAnswer ? <CheckIcon3D className="h-4 w-4 mr-2.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : isUserAnswer ? <XIcon3D className="h-4 w-4 mr-2.5 text-destructive flex-shrink-0" /> : <div className="w-4 h-4 mr-2.5 flex-shrink-0"></div>}
                                                <span>{answer.text}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-center text-muted-foreground py-8 font-medium">Tuyệt vời! Anh/chị đã trả lời đúng tất cả các câu hỏi.</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row justify-center items-center gap-3">
                <button
                    onClick={() => { triggerHaptic('light'); onBack(); }}
                    className="w-full md:w-auto min-h-[44px] px-8 py-2.5 bg-secondary text-secondary-foreground border border-border font-semibold rounded-xl hover:bg-muted active:scale-[0.98] transition-all"
                >
                    Các môn khác
                </button>
                <button
                    onClick={() => { triggerHaptic('medium'); onRetry(); }}
                    className="w-full md:w-auto min-h-[44px] px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                >
                    Làm lại
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;
