import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Quiz, UserAnswers, License, UserProfile } from '../types';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';
import { useFontScale } from '../hooks/useFontScale';
import { ZoomBar } from './ZoomBar';
import { useExamKeyboard } from '../hooks/useExamKeyboard';

interface ExamQuizScreenProps {
    quiz: Quiz;
    onFinish: (answers: UserAnswers) => void;
    onBack: () => void;
    userName: string;
    userProfile: UserProfile | null;
    selectedLicense: License | null;
    initialIndex?: number;
    initialAnswers?: UserAnswers;
    initialTime?: number;
    onProgressUpdate?: (index: number, timeLeft: number, answers: UserAnswers) => void;
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Square Checkbox Component matching the reference design
const SquareCheckbox = ({ checked, onChange, ariaLabel }: { checked: boolean, onChange: () => void, ariaLabel?: string }) => (
    <div
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange?.();
            }
        }}
        onClick={onChange}
        className={`w-[14px] h-[14px] border inline-block cursor-pointer bg-card relative rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
            checked
                ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-950/50'
                : 'border-slate-400 dark:border-slate-500 hover:border-slate-600 dark:hover:border-slate-400'
        }`}
    >
        {checked && (
            <div className="absolute top-[2px] left-[2px] w-[8px] h-[8px] bg-primary dark:bg-sky-400 rounded-xs shadow-xs"></div>
        )}
    </div>
);

// Helper for date formatting
const formatDate = (dateString?: string) => {
    if (!dateString) return '---';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateString;
};

const ExamQuizScreen: React.FC<ExamQuizScreenProps> = ({
    quiz,
    onFinish,
    onBack,
    userName,
    userProfile,
    selectedLicense,
    initialIndex = 0,
    initialAnswers = {},
    initialTime,
    onProgressUpdate
}) => {
    const isMobileApp = useAppStore(state => state.isMobileApp);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialIndex);
    const [userAnswers, setUserAnswers] = useState<UserAnswers>(initialAnswers);
    // Use initialTime if provided, else quiz limit, else default 3600
    const [timeLeft, setTimeLeft] = useState(initialTime !== undefined ? initialTime : (quiz.timeLimit ?? 3600));
    const { scale, setScale, increase, decrease } = useFontScale();

    const currentQuestion = useMemo(() => quiz.questions[currentQuestionIndex], [quiz.questions, currentQuestionIndex]);

    const latestAnswers = useRef(userAnswers);
    useEffect(() => {
        latestAnswers.current = userAnswers;
        // Auto-save on answer change
        onProgressUpdate?.(currentQuestionIndex, timeLeft, userAnswers);
    }, [userAnswers]);

    // Save on index change
    useEffect(() => {
        onProgressUpdate?.(currentQuestionIndex, timeLeft, userAnswers);
    }, [currentQuestionIndex]);

    // Save on time change (throttled? No, implicit via interval, but maybe too frequent? 
    // Let's rely on the separate interval or just save strictly. 
    // Ideally we shouldn't save every second. Let's debounce or save every 5s?
    // For simplicity/safety vs user request "F5 any time", saving every second is heavy for localStorage but acceptable for local-only app.
    // Optimization: Save every 5 seconds OR on significant events (Answer/Index change).
    // Implementation: specialized effect for time.
    useEffect(() => {
        if (timeLeft % 5 === 0) {
            onProgressUpdate?.(currentQuestionIndex, timeLeft, userAnswers);
        }
    }, [timeLeft]);

    const handleBackWithConfirm = () => {
        if (window.confirm('Anh/chị có chắc chắn muốn thoát khỏi bài thi không? Mọi tiến trình sẽ bị mất.')) {
            onBack();
        }
    };

    const addIncorrectQuestions = useAppStore(state => state.addIncorrectQuestions);
    const handleFinishQuiz = useCallback(() => {
        const finalAnswers = latestAnswers.current;
        const unansweredCount = quiz.questions.length - Object.keys(finalAnswers).length;
        const confirmationMessage = unansweredCount > 0
            ? `Anh/chị vẫn còn ${unansweredCount} câu chưa trả lời. Anh/chị có chắc chắn muốn nộp bài không?`
            : 'Anh/chị đã hoàn thành tất cả các câu hỏi. Anh/chị có muốn nộp bài không?';

        if (window.confirm(confirmationMessage)) {
            const incorrectIds = quiz.questions
                .filter(q => finalAnswers[q.id] !== undefined && finalAnswers[q.id] !== q.correctAnswerId)
                .map(q => q.id);
            if (incorrectIds.length > 0) {
                addIncorrectQuestions(incorrectIds);
            }
            onFinish(finalAnswers);
        }
    }, [quiz.questions, onFinish, addIncorrectQuestions]);

    const stableOnFinish = useRef(onFinish);
    useEffect(() => {
        stableOnFinish.current = onFinish;
    }, [onFinish]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(t => (t > 0 ? t - 1 : 0));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (timeLeft === 0) {
            alert('Đã hết giờ làm bài! Hệ thống sẽ tự động nộp bài của anh/chị.');
            stableOnFinish.current(latestAnswers.current);
        }
    }, [timeLeft]);

    const handleAnswerSelect = (questionId: string, answerId: string) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: answerId }));
    };

    useExamKeyboard(
        () => setCurrentQuestionIndex(prev => Math.min(prev + 1, quiz.questions.length - 1)),
        () => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0)),
        (answerId) => { if (currentQuestion) handleAnswerSelect(currentQuestion.id, answerId); },
        currentQuestion
    );

    // Safety: đề thi rỗng hoặc index vượt bounds (chống trắng trang khi data lỗi)
    if (!quiz.questions || quiz.questions.length === 0 || !currentQuestion) {
        return (
            <div className="w-full max-w-7xl mx-auto p-4 text-center">
                <h2 className="text-xl font-bold mb-4">Chưa có câu hỏi nào trong đề thi này.</h2>
                <button
                    onClick={onBack}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto font-sans text-foreground shadow-lg animate-slide-in-right rounded-md" style={{ '--content-scale': scale } as React.CSSProperties}>
            <div className="h-3 bg-yellow-700 rounded-t-md border-b-2 border-yellow-900"></div>
            <div className="bg-card p-4">
                {/* 1. Desktop Header: Giữ nguyên vẹn 100% cho màn hình máy tính (md:flex) */}
                <div className="hidden md:flex justify-between items-start pb-4 border-b border-border dark:border-slate-700">
                    <div className="flex gap-4 items-start">
                        <img
                            src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`}
                            alt="Avatar"
                            className="w-[100px] h-[130px] border border-border dark:border-slate-700 object-cover p-1 bg-card rounded-xs"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://i.postimg.cc/8PDn1wfM/favicon.png';
                            }} loading="lazy" />
                        <div className="text-sm space-y-1">
                            <p className="font-bold text-blue-700 dark:text-sky-400 text-lg uppercase">{userProfile?.full_name || userProfile?.fullName || userName || 'Học viên'}</p>
                            <p className="text-muted-foreground">Số báo danh: <span className="font-semibold text-foreground">{(userProfile?.email || '').split('@')[0] || '---'}</span></p>
                            <p className="text-muted-foreground">Ngày sinh: <span className="font-semibold text-foreground">{formatDate(userProfile?.birthDate)}</span></p>
                            <p className="text-muted-foreground">Địa chỉ: <span className="font-semibold text-foreground">{userProfile?.address || '---'}</span></p>
                            <p className="text-muted-foreground">Lớp: <span className="font-semibold text-foreground">{userProfile?.class || userProfile?.courseName || '---'}</span></p>
                            <p className="text-muted-foreground">Hạng bằng: <span className="font-bold text-red-600 dark:text-red-400 border border-red-500/50 dark:border-red-800 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40">{selectedLicense?.name || '---'}</span></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#f0ad4e] text-black p-2 rounded-md text-sm w-48 shadow-xs">
                            <p className="font-bold">Đang thi</p>
                            <p>Thời gian: 45 phút</p>
                            <p>Bù giờ: 0 phút</p>
                            <p>Còn lại: <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span></p>
                        </div>
                        <button onClick={handleBackWithConfirm} className="text-sm text-muted-foreground hover:text-destructive font-semibold transition-colors">Thoát</button>
                    </div>
                </div>

                {/* 2. Mobile Exam Header: Siêu mỏng (~38px), ẩn thông tin cá nhân, đưa câu hỏi lên First Fold */}
                <div className="flex md:hidden items-center justify-between pb-3 mb-2 border-b border-border dark:border-slate-800">
                    <button
                        onClick={handleBackWithConfirm}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                    >
                        ← Thoát
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-600 dark:text-red-400 border border-red-400/60 dark:border-red-800 px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 max-w-[120px] truncate">
                            {selectedLicense?.name || 'Sát hạch'}
                        </span>
                        <span className="text-xs font-semibold text-blue-600 dark:text-sky-400 tabular-nums">
                            Câu {currentQuestionIndex + 1}/{quiz.questions.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono font-bold text-xs tabular-nums shadow-xs">
                        <span>⏱️</span>
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className={`flex mt-4 gap-4 ${isMobileApp ? 'flex-col' : 'flex-col md:flex-row'}`}>
                    {/* Left Column: Question Content */}
                    <div className="flex-1 border border-border dark:border-slate-700 bg-card rounded-md p-4 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
                        <div>
                            <p className="font-bold mb-4 border-b border-dashed border-border dark:border-slate-700 pb-2 flex justify-between text-foreground">
                                <span>Nội dung câu hỏi</span>
                                <span className={`text-blue-600 dark:text-sky-400 font-semibold tabular-nums ${isMobileApp ? 'block' : 'block md:hidden'}`}>Câu {currentQuestionIndex + 1}/{quiz.questions.length}</span>
                            </p>
                            <p className={`font-bold text-red-600 dark:text-red-400 mb-2 tabular-nums ${isMobileApp ? 'hidden' : 'hidden md:block'}`}>Câu {currentQuestionIndex + 1}:</p>
                            <p className="mb-4 font-semibold text-foreground leading-relaxed" style={{ fontSize: 'calc(1.125rem * var(--content-scale, 1))' }}>{currentQuestion.text}</p>

                            {currentQuestion.image && (
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={currentQuestion.image}
                                        alt="Hình ảnh câu hỏi"
                                        className="max-w-full h-auto max-h-48 md:max-h-60 object-contain border border-border dark:border-slate-700 rounded-md bg-white/5 dark:bg-slate-900/40 p-1" loading="lazy" />
                                </div>
                            )}

                            <div className="space-y-3 md:space-y-4">
                                {currentQuestion.answers.map((answer, index) => {
                                    const isSelected = userAnswers[currentQuestion.id] === answer.id;
                                    return (
                                        <div 
                                            key={answer.id} 
                                            onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                                            className={`flex items-start p-3 md:p-2.5 rounded-xl transition-all border-2 cursor-pointer md:cursor-default md:pointer-events-none ${
                                                isSelected 
                                                ? 'border-blue-500 dark:border-sky-500 bg-blue-50/80 dark:bg-sky-950/30 shadow-xs' 
                                                : 'border-transparent hover:bg-muted/40 dark:hover:bg-slate-800/40'
                                            }`}
                                        >
                                            <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 transition-colors ${
                                                isSelected
                                                    ? 'bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 shadow-xs'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                                            }`}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <p className={`${isSelected ? 'font-bold text-blue-700 dark:text-sky-300' : 'text-foreground font-medium'} leading-relaxed`} style={{ fontSize: 'calc(1rem * var(--content-scale, 1))' }}>{answer.text}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between gap-4 mt-8">
                            <button 
                                onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(p => Math.max(0, p - 1)); }} 
                                disabled={currentQuestionIndex === 0} 
                                className="flex-1 bg-secondary text-secondary-foreground px-4 py-3 rounded-xl border border-border dark:border-slate-700 flex items-center justify-center font-bold hover:bg-muted dark:hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                Câu trước
                            </button>
                            {currentQuestionIndex < quiz.questions.length - 1 ? (
                                <button 
                                    onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(p => Math.min(quiz.questions.length - 1, p + 1)); }} 
                                    className="flex-1 bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 px-4 py-3 rounded-xl flex items-center justify-center font-bold hover:bg-primary/90 dark:hover:bg-sky-400 shadow-md transition-all"
                                >
                                    Câu tiếp
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { triggerHaptic('medium'); handleFinishQuiz(); }} 
                                    className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl flex items-center justify-center font-bold hover:bg-emerald-700 shadow-md transition-all"
                                >
                                    Nộp bài
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Hide Table on Mobile if too crowded, or show as grid) */}
                    <div className={`w-[200px] flex-none flex-col ${isMobileApp ? 'hidden' : 'hidden md:flex'}`}>
                        <div className="border border-border dark:border-slate-700 rounded-md overflow-hidden bg-card shadow-xs">
                            <table className="w-full border-collapse text-xs">
                                    <thead className="sticky top-0 bg-[#f0ad4e] text-black z-10">
                                        <tr>
                                            <th className="border border-border dark:border-slate-700 p-2 font-bold">Câu</th>
                                            <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">A</th>
                                            <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">B</th>
                                            <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">C</th>
                                            <th className="border border-border dark:border-slate-700 p-2 text-center font-bold">D</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quiz.questions.map((q, index) => {
                                            const isCurrent = currentQuestionIndex === index;
                                            return (
                                                <tr
                                                    key={q.id}
                                                    className={`transition-colors ${
                                                        isCurrent
                                                            ? 'bg-sky-100 dark:bg-sky-950/60'
                                                            : 'hover:bg-muted/40 dark:hover:bg-slate-800/40'
                                                    }`}
                                                >
                                                    <td
                                                        className={`border border-border dark:border-slate-700/80 p-2 text-center cursor-pointer whitespace-nowrap transition-colors ${
                                                            isCurrent
                                                                ? 'font-bold text-blue-700 dark:text-sky-300'
                                                                : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                        onClick={() => setCurrentQuestionIndex(index)}
                                                    >
                                                        Câu {index + 1}
                                                    </td>
                                                    {[0, 1, 2, 3].map((idx) => {
                                                        const a = q.answers[idx];
                                                        return (
                                                            <td key={idx} className="border border-border dark:border-slate-700/80 p-2 text-center">
                                                                {a && (
                                                                    <SquareCheckbox
                                                                        checked={userAnswers[q.id] === a.id}
                                                                        onChange={() => handleAnswerSelect(q.id, a.id)}
                                                                        ariaLabel={`Câu ${index + 1} đáp án ${String.fromCharCode(65 + idx)}`}
                                                                    />
                                                                )}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-center mt-4 pt-2 border-t border-border dark:border-slate-700">
                                <button
                                    onClick={handleFinishQuiz}
                                    className="bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 px-8 py-2 rounded-md font-semibold hover:bg-primary/90 dark:hover:bg-sky-400 transition-colors w-full shadow-xs"
                                >
                                    Nộp bài
                                </button>
                            </div>
                    </div>

                    <div className={`flex-wrap gap-2 justify-center p-2.5 bg-muted/30 dark:bg-slate-900/40 rounded-xl border border-border dark:border-slate-800 ${isMobileApp ? 'flex' : 'flex md:hidden'}`}>
                         {quiz.questions.map((q, index) => {
                                 const isAnswered = !!userAnswers[q.id];
                                 const isCurrent = currentQuestionIndex === index;
                                 return (
                                     <button
                                        key={q.id}
                                        onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(index); }}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                                            isCurrent
                                                ? 'bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 ring-2 ring-primary/40 scale-110 shadow-sm'
                                                : isAnswered
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700'
                                                    : 'bg-card text-muted-foreground border border-border dark:border-slate-700 hover:bg-muted/50'
                                        }`}
                                     >
                                         {index + 1}
                                     </button>
                                 );
                             })}
                    </div>
                </div>

                <div className="mt-4 bg-[#005a9c] text-white p-4 rounded-b-md flex items-center gap-4 text-xs">
                    <img src="https://i.postimg.cc/8PDn1wfM/favicon.png" alt="Logo" className="h-16 w-16 object-contain" loading="lazy" />
                    <div>
                        <p className="font-bold">CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</p>
                        <p>Địa chỉ: Đường Triệu Việt Vương, phường Hoa Lư, tỉnh Ninh Bình </p>
                    </div>
                </div>
            </div>
            <ZoomBar scale={scale} setScale={setScale} increase={increase} decrease={decrease} />
        </div>
    );
};

export default ExamQuizScreen;
