import React, { useState, useMemo, useEffect } from 'react';
import type { Quiz, UserAnswers } from '../types';
import { CheckIcon3D, XIcon3D, TrophyIcon3D } from './icons';
import { triggerHaptic } from '../utils/nativeUX';

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

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-slide-in-right font-quiz-default">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-950/20 dark:to-blue-900/10 rounded-3xl shadow-xl p-8 md:p-12 text-center mb-8 relative overflow-hidden">
                <div className="relative z-10">
                    <TrophyIcon3D className="h-28 w-28 mx-auto text-yellow-500 mb-4 drop-shadow-lg" />
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tight">Kết quả Ôn tập</h1>

                    <div className="my-4 text-slate-600 dark:text-slate-400">
                        <p className="text-lg">Học viên: <span className="font-bold text-indigo-600 dark:text-indigo-400">{userName}</span></p>
                        <p className="text-sm">Hoàn thành lúc: {formattedDate}</p>
                    </div>

                    <div className="mt-6 flex flex-col items-center">
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-indigo-500/20 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-inner">
                                <p className="text-4xl md:text-5xl font-black text-indigo-600">{score}</p>
                                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase">/{totalQuestions} Câu</p>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg">
                                {percentage}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-card text-card-foreground rounded-2xl shadow-xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Chi tiết bài làm</h2>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto">
                        <button 
                            onClick={() => { triggerHaptic('light'); setFilter('all'); }} 
                            className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
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
                                        <img src={question.image} alt="Câu hỏi" className="w-full h-auto object-cover max-h-80" loading="lazy" />
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
                    Các môn khác
                </button>
                <button
                    onClick={() => { triggerHaptic('medium'); onRetry(); }}
                    className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-lg"
                >
                    Làm lại
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;