import React, { useState, useMemo, useEffect } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, TrophyIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';
import { calculateIsPass } from '../utils/examUtils';
import { resolveQuestionImageFallbackUrl } from '../utils/imageHelper';

interface ExamResultsScreenProps {
    quiz: Quiz;
    userAnswers: UserAnswers;
    score: number;
    onRetry: () => void;
    onBack: () => void;
    userName: string;
    examType: 'Ôn tập' | 'Thi thử';
}

const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({ quiz, userAnswers, score, onRetry, onBack, userName, examType }) => {
    const [filter, setFilter] = useState<'all' | 'incorrect'>('all');
    const [completionDate] = useState(() => new Date());

    const totalQuestions = quiz.questions.length;
    const isPass = calculateIsPass(score, totalQuestions, examType);
    const displayName = userName?.trim() ? userName : 'Học viên ẩn danh';

    useEffect(() => {
        if (isPass) {
            triggerHaptic('success');
        } else {
            triggerHaptic('error');
        }
    }, [isPass]);

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
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right font-quiz-default pb-20">
            {/* Pass/Fail Banner Card */}
            <div className={`rounded-2xl border p-6 md:p-10 text-center mb-8 relative shadow-sm ${
                isPass 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-card-foreground' 
                : 'bg-destructive/10 border-destructive/30 text-card-foreground'
            }`}>
                <div className="relative z-10">
                    {isPass ? (
                        <TrophyIcon3D className="h-28 w-28 mx-auto text-amber-500 mb-3 drop-shadow-sm" />
                    ) : (
                        <div className="h-24 w-24 mx-auto mb-3 flex items-center justify-center bg-destructive/15 rounded-2xl border border-destructive/30">
                            <XIcon3D className="h-14 w-14 text-destructive" />
                        </div>
                    )}
                    
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2 uppercase tracking-tight">Kết quả Thi thử</h1>

                    <div className="my-3 text-muted-foreground text-sm">
                        <p className="text-base">Thí sinh: <span className="font-bold text-foreground">{displayName}</span></p>
                        <p className="text-xs mt-1">Ngày thi: <span className="tabular-nums font-semibold">{formattedDate}</span></p>
                    </div>

                    <p className={`text-xl md:text-2xl font-black mb-6 ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                        {isPass ? 'CHÚC MỪNG, ANH/CHỊ ĐÃ ĐẠT!' : 'RẤT TIẾC, ANH/CHỊ CHƯA ĐẠT.'}
                    </p>
                    
                    <div className={`inline-flex flex-col items-center justify-center w-36 h-36 md:w-44 md:h-44 rounded-full border-4 bg-card shadow-inner ${
                        isPass ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'border-destructive/30 text-destructive'
                    }`}>
                        <p className="text-4xl md:text-5xl font-black tabular-nums">{score}</p>
                        <p className="text-xs md:text-sm font-semibold opacity-75 uppercase tabular-nums">/ {totalQuestions} CÂU</p>
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
                    Về trang chủ
                </button>
                <button
                    onClick={() => { triggerHaptic('medium'); onRetry(); }}
                    className="w-full md:w-auto min-h-[44px] px-8 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
                >
                    Thi lại đề mới
                </button>
            </div>
        </div>
    );
};

export default ExamResultsScreen;
