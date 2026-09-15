import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Quiz, UserAnswers, License, UserProfile } from '../types';
import { triggerHaptic } from '../utils/nativeUX';
import { useAppStore } from '../stores/useAppStore';

interface ExamQuizScreen2Props {
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
const SquareCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <div
        onClick={onChange}
        className={`w-[14px] h-[14px] border border-[#999] inline-block cursor-pointer bg-white relative ${checked ? 'bg-[#333]' : ''}`}
    >
        {checked && (
            <div className="absolute top-[2px] left-[2px] w-[8px] h-[8px] bg-[#333]"></div>
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

const ExamQuizScreen2: React.FC<ExamQuizScreen2Props> = ({
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

    const handleFinishQuiz = useCallback(() => {
        const finalAnswers = latestAnswers.current;
        const unansweredCount = quiz.questions.length - Object.keys(finalAnswers).length;
        const confirmationMessage = unansweredCount > 0
            ? `Anh/chị vẫn còn ${unansweredCount} câu chưa trả lời. Anh/chị có chắc chắn muốn nộp bài không?`
            : 'Anh/chị đã hoàn thành tất cả các câu hỏi. Anh/chị có muốn nộp bài không?';

        if (window.confirm(confirmationMessage)) {
            onFinish(finalAnswers);
        }
    }, [quiz.questions.length, onFinish]);

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

    return (
        <div className="w-full max-w-7xl mx-auto font-sans text-black shadow-lg animate-slide-in-right rounded-md">
            <div className="h-3 bg-yellow-700 rounded-t-md border-b-2 border-yellow-900"></div>
            <div className="bg-white p-4">
                <div className="flex justify-between items-start pb-4 border-b border-gray-300">
                    <div className="flex gap-4 items-start">
                        <img
                            src={userProfile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`}
                            alt="Avatar"
                            className="w-[100px] h-[130px] border border-gray-300 object-cover p-1 bg-white"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://i.postimg.cc/8PDn1wfM/favicon.png';
                            }} loading="lazy" />
                        <div className="text-sm space-y-1">
                            <p className="font-bold text-blue-700 text-lg uppercase">{userProfile?.full_name || userProfile?.fullName || userName || 'Học viên'}</p>
                            <p>Số báo danh: <span className="font-semibold text-gray-800">{(userProfile?.email || '').split('@')[0] || '---'}</span></p>
                            <p>Ngày sinh: <span className="font-semibold text-gray-800">{formatDate(userProfile?.birthDate)}</span></p>
                            <p>Địa chỉ: <span className="font-semibold text-gray-800">{userProfile?.address || '---'}</span></p>
                            <p>Lớp: <span className="font-semibold text-gray-800">{userProfile?.class || userProfile?.courseName || '---'}</span></p>
                            <p>Hạng bằng: <span className="font-bold text-red-600 border border-red-500 px-1 rounded bg-red-50">{selectedLicense?.name || '---'}</span></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-[#f0ad4e] text-black p-2 rounded-md text-sm w-48">
                            <p className="font-bold">Đang thi</p>
                            <p>Thời gian: 45 phút</p>
                            <p>Bù giờ: 0 phút</p>
                            <p>Còn lại: <span className="font-bold">{formatTime(timeLeft)}</span></p>
                        </div>
                        <button onClick={handleBackWithConfirm} className="text-sm text-gray-600 hover:text-red-500 font-semibold">Thoát</button>
                    </div>
                </div>

                <div className={`flex mt-4 gap-4 ${isMobileApp ? 'flex-col' : 'flex-col md:flex-row'}`}>
                    {/* Left Column: Question Content */}
                    <div className="flex-1 border border-gray-400 rounded-md p-4 flex flex-col justify-between min-h-[400px] md:min-h-[500px]">
                        <div>
                            <p className="font-bold mb-4 border-b border-dashed border-gray-400 pb-2 flex justify-between">
                                <span>Nội dung câu hỏi</span>
                                <span className={`text-blue-600 ${isMobileApp ? 'block' : 'block md:hidden'}`}>Câu {currentQuestionIndex + 1}/{quiz.questions.length}</span>
                            </p>
                            <p className={`font-bold text-red-600 mb-2 ${isMobileApp ? 'hidden' : 'hidden md:block'}`}>Câu :{currentQuestionIndex + 1}</p>
                            <p className="mb-4 font-semibold text-lg">{currentQuestion.text}</p>

                            {currentQuestion.image && (
                                <div className="mb-4 flex justify-center">
                                    <img
                                        src={currentQuestion.image}
                                        alt="Hình ảnh câu hỏi"
                                        className="max-w-full h-auto max-h-48 md:max-h-60 object-contain border border-gray-300 rounded-md" loading="lazy" />
                                </div>
                            )}

                            <div className="space-y-3 md:space-y-4">
                                {currentQuestion.answers.map((answer, index) => {
                                    const isSelected = userAnswers[currentQuestion.id] === answer.id;
                                    return (
                                        <div 
                                            key={answer.id} 
                                            onClick={() => {
                                                triggerHaptic('light');
                                                handleAnswerSelect(currentQuestion.id, answer.id);
                                            }}
                                            className={`flex items-start p-3 md:p-2 rounded-xl transition-all border-2 cursor-pointer active:scale-[0.98] ${
                                                isSelected 
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                                : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className={`flex-none w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${
                                                isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                                            }`}>
                                                {String.fromCharCode(65 + index)}
                                            </div>
                                            <p className={`text-base ${isSelected ? 'font-bold text-blue-700' : 'text-gray-800'}`}>{answer.text}</p>
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
                                className="flex-1 bg-gray-100 text-black px-4 py-3 rounded-xl border border-gray-300 flex items-center justify-center font-bold hover:bg-gray-200 disabled:opacity-30"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                Câu trước
                            </button>
                            {currentQuestionIndex < quiz.questions.length - 1 ? (
                                <button 
                                    onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(p => Math.min(quiz.questions.length - 1, p + 1)); }} 
                                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center font-bold shadow-lg"
                                >
                                    Câu tiếp
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            ) : (
                                <button 
                                    onClick={() => { triggerHaptic('medium'); handleFinishQuiz(); }} 
                                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl flex items-center justify-center font-bold shadow-lg"
                                >
                                    Nộp bài
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Hide Table on Mobile if too crowded, or show as grid) */}
                    <div className={`w-[200px] flex-none flex-col ${isMobileApp ? 'hidden' : 'hidden md:flex'}`}>
                        <div className="border border-gray-300 rounded-md overflow-hidden">
                            <table className="w-full border-collapse text-xs">
                                    <thead className="sticky top-0 bg-[#f0ad4e] z-10">
                                        <tr>
                                            <th className="border border-gray-400 p-2">Câu</th>
                                            <th className="border border-gray-400 p-2 text-center">a-b-c-d</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quiz.questions.map((q, index) => (
                                            <tr key={q.id} className={currentQuestionIndex === index ? 'bg-cyan-200' : 'hover:bg-gray-50'}>
                                                <td
                                                    className={`border border-gray-400 p-2 font-bold text-center cursor-pointer whitespace-nowrap ${currentQuestionIndex === index ? 'text-black' : 'text-gray-500'}`}
                                                    onClick={() => setCurrentQuestionIndex(index)}
                                                >
                                                    Câu {index + 1}
                                                </td>
                                                <td className="border border-gray-400 p-2 text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        {q.answers.slice(0, 4).map((a) => (
                                                            <SquareCheckbox
                                                                key={a.id}
                                                                checked={userAnswers[q.id] === a.id}
                                                                onChange={() => handleAnswerSelect(q.id, a.id)}
                                                            />
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-center mt-4 pt-2 border-t border-gray-200">
                                <button onClick={handleFinishQuiz} className="bg-[#337ab7] text-white px-8 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors w-full">Nộp bài</button>
                            </div>
                    </div>

                    <div className={`flex-wrap gap-2 justify-center p-2 bg-gray-50 rounded-xl border border-gray-200 ${isMobileApp ? 'flex' : 'flex md:hidden'}`}>
                         {quiz.questions.map((q, index) => {
                                 const isAnswered = !!userAnswers[q.id];
                                 const isCurrent = currentQuestionIndex === index;
                                 return (
                                     <button
                                        key={q.id}
                                        onClick={() => { triggerHaptic('light'); setCurrentQuestionIndex(index); }}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                                            isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-300 scale-110' :
                                            isAnswered ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white text-gray-500 border border-gray-200'
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
        </div>
    );
};

export default ExamQuizScreen2;
