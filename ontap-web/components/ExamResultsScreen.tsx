import React, { useState, useMemo, useEffect } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, TrophyIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';

interface ExamResultsScreenProps {
    quiz: Quiz;
    userAnswers: UserAnswers;
    score: number;
    onRetry: () => void;
    onBack: () => void;
    userName: string;
}

const ExamResultsScreen: React.FC<ExamResultsScreenProps> = ({ quiz, userAnswers, score, onRetry, onBack, userName }) => {
    const [filter, setFilter] = useState<'all' | 'incorrect'>('all');
    const [completionDate] = useState(() => new Date());

    const totalQuestions = quiz.questions.length;
    const isPass = score >= 25; // Exam mode pass threshold

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
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right font-quiz-default">
            <div className={`rounded-3xl shadow-2xl p-6 md:p-10 text-center mb-8 overflow-hidden relative ${
                isPass 
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-950/20 dark:to-green-900/10' 
                : 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-rose-950/20 dark:to-red-900/10'
            }`}>
                <div className="relative z-10">
                    {isPass ? (
                        <TrophyIcon3D className="h-32 w-32 mx-auto text-yellow-500 mb-4 drop-shadow-xl animate-bounce" />
                    ) : (
                        <div className="h-32 w-32 mx-auto mb-4 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full">
                            <XIcon3D className="h-20 w-20 text-red-500" />
                        </div>
                    )}
                    
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Kết quả Thi thử</h1>

                    <div className="my-4 text-slate-600 dark:text-slate-400">
                        <p className="text-lg">Thí sinh: <span className="font-bold text-slate-900 dark:text-white">{userName}</span></p>
                        <p className="text-sm">Ngày thi: {formattedDate}</p>
                    </div>

                    <p className={`text-2xl md:text-3xl font-black mb-6 drop-shadow-sm ${isPass ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPass ? 'CHÚC MỪNG, ANH/CHỊ ĐÃ ĐẠT!' : 'RẤT TIẾC, ANH/CHỊ KHÔNG ĐẠT.'}
                    </p>
                    
                    <div className={`inline-flex flex-col items-center justify-center w-40 h-40 md:w-52 md:h-52 rounded-full border-8 bg-white dark:bg-slate-900 shadow-inner ${
                        isPass ? 'border-green-500/30 text-green-600' : 'border-red-500/30 text-red-600'
                    }`}>
                        <p className="text-5xl md:text-6xl font-black">{score}</p>
                        <p className="text-sm md:text-base font-bold opacity-70">/ {totalQuestions} CÂU</p>
                    </div>
                </div>
            </div>

            <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Chi tiết bài làm</h2>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto">
                        <button 
                            onClick={() => { triggerHaptic('light'); setFilter('all'); }} 
                            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Tất cả
                        </button>
                        <button 
                            onClick={() => { triggerHaptic('light'); setFilter('incorrect'); }} 
                            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${filter === 'incorrect' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' : 'text-slate-500'}`}
                        >
                            Câu sai ({totalQuestions - score})
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
                                {question.image && (
                                    <div className="mb-4 rounded-lg overflow-hidden">
                                        <img src={question.image} alt="Câu hỏi" className="w-full h-auto object-cover max-h-80" />
                                    </div>
                                )}
                                <div className="space-y-2">
                                    {question.answers.map(answer => {
                                        const isUserAnswer = answer.id === userAnswerId;
                                        const isCorrectAnswer = answer.id === correctAnswerId;

                                        let itemClass = "flex items-center p-3 rounded-md text-sm ";
                                        if (isCorrectAnswer) {
                                            itemClass += "bg-success/10 text-success";
                                        } else if (isUserAnswer) {
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

            <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-4">
                <button
                    onClick={() => { triggerHaptic('light'); onBack(); }}
                    className="w-full md:w-auto px-10 py-4 bg-slate-800 dark:bg-slate-700 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 active:scale-95 transition-all shadow-lg"
                >
                    Về trang chủ
                </button>
                <button
                    onClick={() => { triggerHaptic('medium'); onRetry(); }}
                    className={`w-full md:w-auto px-10 py-4 font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all shadow-lg ${
                        isPass ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                >
                    {isPass ? 'Thi lại' : 'Thi lại ngay'}
                </button>
            </div>
        </div>
    );
};

export default ExamResultsScreen;