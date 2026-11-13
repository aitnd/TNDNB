import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Quiz, UserAnswers, License, UserProfile } from '../types';
import { getLocalImageSrc, handleImageError } from '../utils/imageHelper';
import { useFontScale } from '../hooks/useFontScale';
import { ZoomBar } from './ZoomBar';
import { useExamKeyboard } from '../hooks/useExamKeyboard';
import { useAppStore } from '../stores/useAppStore';

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
        className={`w-[14px] h-[14px] border inline-block cursor-pointer bg-card relative rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
            checked
                ? 'border-primary dark:border-sky-400 bg-primary/10 dark:bg-sky-950/50'
                : 'border-slate-400 dark:border-slate-500 hover:border-slate-600 dark:hover:border-slate-400'
        }`}
    >
        {checked && (
            <div className="absolute top-[2px] left-[2px] w-[8px] h-[8px] bg-primary dark:bg-sky-400 rounded-[2px] shadow-sm"></div>
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
                <div className="flex justify-between items-start pb-4 border-b border-border dark:border-slate-700">
                    <div className="flex gap-4 items-start">
                        <img
                            src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`}
                            alt="Avatar"
                            className="w-[100px] h-[130px] border border-border dark:border-slate-700 object-cover p-1 bg-card rounded-[2px]"
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
                        <div className="bg-[#f0ad4e] text-black p-2 rounded-md text-sm w-48 shadow-sm">
                            <p className="font-bold">Đang thi</p>
                            <p>Thời gian: 45 phút</p>
                            <p>Bù giờ: 0 phút</p>
                            <p>Còn lại: <span className="font-bold tabular-nums">{formatTime(timeLeft)}</span></p>
                        </div>
                        <button onClick={handleBackWithConfirm} className="text-sm text-muted-foreground hover:text-destructive font-semibold transition-colors">Thoát</button>
                    </div>
                </div>

                <div className="flex mt-4 gap-4">
                    {/* Left Column: Question Content (Read-only) */}
                    <div className="flex-1 border border-border dark:border-slate-700 bg-card rounded-md p-4 flex flex-col justify-between min-h-[500px]">
                        <div>
                            <p className="font-bold mb-4 border-b border-dashed border-border dark:border-slate-700 pb-2 text-foreground">Nội dung câu hỏi</p>
                            <p className="font-bold text-red-600 dark:text-red-400 mb-2 tabular-nums">Câu {currentQuestionIndex + 1}:</p>
                            <p className="mb-4 font-semibold text-foreground leading-relaxed" style={{ fontSize: 'calc(1rem * var(--content-scale, 1))' }}>{currentQuestion.text}</p>

                            {currentQuestion.image && (
                                <div className="mb-4 flex justify-start">
                                    <img
                                        src={getLocalImageSrc(currentQuestion) || currentQuestion.image}
                                        alt="Hình ảnh câu hỏi"
                                        className="max-w-full h-auto max-h-60 object-contain border border-border dark:border-slate-700 rounded-md bg-white/5 dark:bg-slate-900/40 p-1"
                                        onError={(e) => handleImageError(e, currentQuestion.image)} loading="lazy" />
                                </div>
                            )}

                            <div className="space-y-4">
                                {currentQuestion.answers.map((answer, index) => (
                                    <div key={answer.id} className="flex items-start">
                                        <span className="font-bold mr-2 text-muted-foreground min-w-[20px]">{String.fromCharCode(65 + index)}.</span>
                                        <p className="text-foreground leading-relaxed" style={{ fontSize: 'calc(1rem * var(--content-scale, 1))' }}>{answer.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0} className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md border border-border dark:border-slate-700 flex items-center font-semibold hover:bg-muted dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                Trở lại
                            </button>
                            {currentQuestionIndex < quiz.questions.length - 1 && (
                                <button onClick={() => setCurrentQuestionIndex(p => Math.min(quiz.questions.length - 1, p + 1))} className="bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 px-4 py-2 rounded-md flex items-center font-semibold hover:bg-primary/90 dark:hover:bg-sky-400 transition-colors shadow-sm">
                                    Tiếp tục
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Answer Sheet (Interactive) */}
                    <div className="w-[200px] flex-none flex flex-col">
                        <div className="border border-border dark:border-slate-700 rounded-md overflow-hidden bg-card shadow-sm">
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
                            <button onClick={handleFinishQuiz} className="bg-primary dark:bg-sky-500 text-primary-foreground dark:text-slate-950 px-8 py-2 rounded-md font-semibold hover:bg-primary/90 dark:hover:bg-sky-400 transition-colors w-full shadow-sm">Nộp bài</button>
                        </div>
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
