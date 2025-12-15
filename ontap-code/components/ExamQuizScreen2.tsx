import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { Quiz, UserAnswers, License } from '../types';

interface ExamQuizScreen2Props {
    quiz: Quiz;
    onFinish: (answers: UserAnswers) => void;
    onBack: () => void;
    userName: string;
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

const ExamQuizScreen2: React.FC<ExamQuizScreen2Props> = ({
    quiz,
    onFinish,
    onBack,
    userName,
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
                    <div className="flex gap-4 items-center">
                        <img src="https://i.postimg.cc/8PDn1wfM/favicon.png" alt="Avatar" className="w-20 h-[100px] border border-gray-300 object-contain p-1" />
                        <div className="text-sm">
                            <p>Số báo danh:</p>
                            <p>Ngày sinh:</p>
                            <p className="mt-2">Họ tên: <span className="font-bold text-blue-700">{userName || 'Học viên'}</span></p>
                            <p>Hạng bằng: <span className="font-bold text-blue-700">{selectedLicense?.name || 'Thuyền trưởng hạng ba - T3'}</span></p>
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

                <div className="flex mt-4 gap-4">
                    {/* Left Column: Question Content (Read-only) */}
                    <div className="flex-1 border border-gray-400 rounded-md p-4 flex flex-col justify-between min-h-[500px]">
                        <div>
                            <p className="font-bold mb-4 border-b border-dashed border-gray-400 pb-2">Nội dung câu hỏi</p>
                            <p className="font-bold text-red-600 mb-2">Câu :{currentQuestionIndex + 1}</p>
                            <p className="mb-4 font-semibold">{currentQuestion.text}</p>

                            {currentQuestion.image && (
                                <div className="mb-4 flex justify-start">
                                    <img
                                        src={currentQuestion.image}
                                        alt="Hình ảnh câu hỏi"
                                        className="max-w-full h-auto max-h-60 object-contain border border-gray-300 rounded-md"
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                {currentQuestion.answers.map((answer, index) => (
                                    <div key={answer.id} className="flex items-start">
                                        <span className="font-bold mr-2 text-gray-700 min-w-[20px]">{String.fromCharCode(65 + index)}.</span>
                                        <p>{answer.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-8">
                            <button onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))} disabled={currentQuestionIndex === 0} className="bg-[#f0ad4e] text-black px-4 py-2 rounded-md border border-gray-400 flex items-center font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                                Trở lại
                            </button>
                            {currentQuestionIndex < quiz.questions.length - 1 && (
                                <button onClick={() => setCurrentQuestionIndex(p => Math.min(quiz.questions.length - 1, p + 1))} className="bg-[#f0ad4e] text-black px-4 py-2 rounded-md border border-gray-400 flex items-center font-semibold hover:bg-yellow-500 transition-colors">
                                    Tiếp tục
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Answer Sheet (Interactive) */}
                    <div className="w-[200px] flex-none flex flex-col">
                        <div className="border border-gray-300 rounded-md">
                            <table className="w-full border-collapse text-xs">
                                <thead className="sticky top-0 bg-[#f0ad4e] z-10">
                                    <tr>
                                        <th className="border border-gray-400 p-2">Câu</th>
                                        <th className="border border-gray-400 p-2">a</th>
                                        <th className="border border-gray-400 p-2">b</th>
                                        <th className="border border-gray-400 p-2">c</th>
                                        <th className="border border-gray-400 p-2">d</th>
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
                                            {q.answers.slice(0, 4).map((a) => (
                                                <td key={a.id} className="border border-gray-400 p-2 text-center">
                                                    <SquareCheckbox
                                                        checked={userAnswers[q.id] === a.id}
                                                        onChange={() => handleAnswerSelect(q.id, a.id)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center mt-4 pt-2 border-t border-gray-200">
                            <button onClick={handleFinishQuiz} className="bg-[#337ab7] text-white px-8 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors w-full">Nộp bài</button>
                        </div>
                    </div>
                </div>

                <div className="mt-4 bg-[#005a9c] text-white p-4 rounded-b-md flex items-center gap-4 text-xs">
                    <img src="https://i.postimg.cc/8PDn1wfM/favicon.png" alt="Logo" className="h-16 w-16 object-contain" />
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
