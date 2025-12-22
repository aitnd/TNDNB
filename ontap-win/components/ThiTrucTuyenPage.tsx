import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, rtdb } from '../services/firebaseClient';
import { supabase } from '../services/supabaseClient';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, set, update, onDisconnect, serverTimestamp as rtdbTimestamp } from 'firebase/database';
import ExamQuizScreen2 from './ExamQuizScreen2';
import { toast } from 'sonner';

const ThiTrucTuyenPage: React.FC = () => {
    const { user } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [autoJoinMessage, setAutoJoinMessage] = useState('');

    // Exam State
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [examRoom, setExamRoom] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [examProfile, setExamProfile] = useState<any>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let email = username.trim();
            // Tự động thêm domain nếu nhập SBD (không có @)
            if (!email.includes('@')) {
                email = `${email}@daotaothuyenvien.com`;
            }

            await signInWithEmailAndPassword(auth, email, password);
            // App.tsx sẽ tự động chuyển hướng
        } catch (err: any) {
            console.error(err);
            setError('Tên đăng nhập hoặc mật khẩu không đúng.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-Join Logic
    useEffect(() => {
        const checkAutoJoin = async () => {
            if (user && user.uid) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const courseId = userData.courseId;

                        if (courseId) {
                            const q = query(
                                collection(db, 'exam_rooms'),
                                where('course_id', '==', courseId),
                                where('status', 'in', ['waiting', 'in_progress']),
                                orderBy('created_at', 'desc'),
                                limit(1)
                            );
                            const snapshot = await getDocs(q);
                            if (!snapshot.empty) {
                                const room = snapshot.docs[0];
                                setRoomId(room.id); // Pre-fill Room ID
                                setAutoJoinMessage(`Đã tìm thấy phòng thi cho lớp ${userData.courseName || ''}. Vui lòng nhấn "VÀO THI NGAY".`);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Auto-join check failed:", err);
                }
            }
        };
        checkAutoJoin();
    }, [user]);

    const handleJoinRoom = async () => {
        if (!roomId) {
            toast.error("Vui lòng nhập mã phòng thi.");
            return;
        }
        setLoading(true);
        try {
            const roomDoc = await getDoc(doc(db, 'exam_rooms', roomId));
            if (!roomDoc.exists()) {
                toast.error("Phòng thi không tồn tại.");
                setLoading(false);
                return;
            }
            const roomData = roomDoc.data();
            if (roomData.status === 'finished') {
                toast.error("Phòng thi đã kết thúc.");
                setLoading(false);
                return;
            }
            if (roomData.password && roomData.password !== password) {
                toast.error("Mật khẩu phòng thi không đúng.");
                setLoading(false);
                return;
            }

            // Fetch Questions based on License (Supabase)
            const licenseId = roomData.license_id;

            let query = supabase
                .from('questions')
                .select('*')
                .eq('license_id', licenseId);

            if (roomData.subject_id) {
                query = query.eq('subject_id', roomData.subject_id);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Supabase Error:", error);
                toast.error("Lỗi kết nối dữ liệu câu hỏi.");
                setLoading(false);
                return;
            }

            if (!data || data.length === 0) {
                toast.error("Không tìm thấy câu hỏi phù hợp!");
                setLoading(false);
                return;
            }

            const allQuestions = data.map((q: any) => ({
                id: q.id,
                content: q.question,
                options: q.options,
                correctAnswerId: q.correct_answer,
                explanation: q.explanation,
                image: q.image
            }));

            // Shuffle and pick 30
            const shuffled = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 30);

            setQuestions(shuffled);
            setExamRoom({ id: roomDoc.id, ...roomData });

            // Prepare User Profile & RTDB
            if (user) {
                const userDocSnap = await getDoc(doc(db, 'users', user.uid));
                const userData = userDocSnap.exists() ? userDocSnap.data() : null;
                setExamProfile(userData);

                // --- RTDB: Initialize Progress Node ---
                const userRef = ref(rtdb, `exam_progress/${roomDoc.id}/${user.uid}`);
                const initialData = {
                    user_name: userData?.fullName || user.displayName || user.email,
                    user_email: user.email,
                    user_sbd: user.email?.split('@')[0] || '',
                    status: 'doing', // joined -> doing
                    joined_at: rtdbTimestamp(),
                    total_questions: shuffled.length,
                    score: 0,
                    time_left: (roomData.duration || 45) * 60,
                    last_updated: rtdbTimestamp()
                };
                await set(userRef, initialData);
                // Optional: Handle disconnect
                onDisconnect(userRef).update({ status: 'offline' });
                // --------------------------------------
            }
            // --------------------------------------

            setIsExamStarted(true);
            toast.success("Đã vào phòng thi thành công!");

        } catch (error) {
            console.error("Error joining room:", error);
            toast.error("Lỗi khi vào phòng thi.");
        } finally {
            setLoading(false);
        }
    };

    const handleProgressUpdate = async (index: number, timeLeft: number, answers: any) => {
        if (!user || !examRoom) return;

        // Calculate temporary score
        let correctCount = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswerId) correctCount++;
        });
        const currentScore = (correctCount / questions.length) * 10;

        const userRef = ref(rtdb, `exam_progress/${examRoom.id}/${user.uid}`);
        update(userRef, {
            current_question_index: index,
            time_left: timeLeft,
            answers_count: Object.keys(answers).length,
            score: currentScore, // Live score
            last_updated: rtdbTimestamp(),
            status: 'doing'
        }).catch(err => console.error("RTDB Update Error:", err));
    };

    const handleFinishExam = async (answers: any) => {
        if (!user || !examRoom) return;

        // Calculate Score
        let correctCount = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswerId) correctCount++;
        });
        const score = (correctCount / questions.length) * 10;
        const isPass = score >= 5;

        try {
            // --- RTDB: Update Status to Submitted ---
            const userRef = ref(rtdb, `exam_progress/${examRoom.id}/${user.uid}`);
            await update(userRef, {
                status: 'submitted',
                score: score,
                time_left: 0,
                finished_at: rtdbTimestamp()
            });
            // ----------------------------------------

            await addDoc(collection(db, 'exam_results'), {
                room_id: examRoom.id,
                user_id: user.uid,
                user_name: examProfile?.fullName || user.email,
                score: score,
                correct_count: correctCount,
                total_questions: questions.length,
                answers: answers,
                submitted_at: serverTimestamp(),
                is_pass: isPass
            });
            toast.success(`Đã nộp bài! Điểm số: ${score.toFixed(1)}`);
            setIsExamStarted(false);
            setExamRoom(null);
            setQuestions([]);
        } catch (error) {
            console.error("Error submitting exam:", error);
            toast.error("Lỗi khi nộp bài.");
        }
    };

    if (isExamStarted && examRoom && questions.length > 0) {
        return (
            <div className="min-h-screen bg-gray-100 p-4">
                <ExamQuizScreen2
                    quiz={{
                        id: examRoom.id,
                        title: examRoom.name,
                        questions: questions,
                        timeLimit: (examRoom.duration || 45) * 60
                    }}
                    onFinish={handleFinishExam}
                    onBack={() => {
                        if (window.confirm("Bạn có chắc muốn thoát? Kết quả sẽ không được lưu.")) {
                            setIsExamStarted(false);
                        }
                    }}
                    userName={examProfile?.fullName || user?.email || ''}
                    userProfile={examProfile}
                    selectedLicense={{ id: examRoom.license_id, name: `Hạng ${examRoom.license_id}`, subjects: [] }}
                    onProgressUpdate={handleProgressUpdate}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-[#333]">
            {/* HEADER */}
            <div className="bg-white">
                <div className="w-full h-[150px] bg-cover bg-center relative" style={{ backgroundImage: "url('assets/img/banner1.png')" }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-200 opacity-50"></div>
                    <div className="container mx-auto h-full flex items-center px-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <img src="assets/img/logo1.ico" alt="Logo" className="h-24 w-24 object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'} />
                            <div className="text-blue-800 uppercase font-bold drop-shadow-sm">
                                <h1 className="text-3xl">CÔNG TY CP TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h1>
                                <h2 className="text-xl text-red-600 mt-1">NINH BINH CONSULTING AND EDUCATION JOINT STOCK COMPANY</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-grow bg-white flex justify-center pt-10 pb-20">
                <div className="w-full max-w-4xl px-4">
                    {!user ? (
                        <>
                            <div className="text-center mb-8 text-sm text-gray-700 space-y-1">
                                <p>Vui lòng nhập tài khoản và mật khẩu để đăng nhập.</p>
                                <p>Nếu bạn chưa có tài khoản hoặc quên mật khẩu vui lòng liên hệ giám thị coi thi!</p>
                                <p>Nếu bạn muốn tra kết quả học tập, hãy vào <a href="/ontap" className="text-blue-600 font-bold hover:underline">TRA CỨU ĐIỂM</a></p>
                                <p>Nếu bạn muốn ôn tập hoặc thi thử, hãy vào <a href="/ontap" className="text-blue-600 font-bold hover:underline">THI THỬ</a></p>
                            </div>

                            <div className="max-w-md mx-auto">
                                <fieldset className="border border-gray-300 p-6 rounded-sm shadow-sm">
                                    <legend className="px-2 text-gray-700 font-bold text-sm">Thông tin đăng nhập</legend>
                                    <form onSubmit={handleLogin} className="space-y-4 mt-2">
                                        <div className="flex items-center">
                                            <label className="w-32 text-sm font-bold text-gray-700">Số báo danh:</label>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="flex-1 border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 rounded-sm"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <label className="w-32 text-sm font-bold text-gray-700">Mật khẩu:</label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="flex-1 border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-blue-400 rounded-sm"
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                                        <div className="flex justify-end mt-6">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-[#2962ff] text-white px-6 py-1.5 text-sm font-bold rounded-sm hover:bg-blue-700 transition-colors shadow-sm"
                                            >
                                                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                            </button>
                                        </div>
                                    </form>
                                </fieldset>
                            </div>
                        </>
                    ) : (
                        <div className="max-w-md mx-auto">
                            {/* CẢNH BÁO TÀI KHOẢN (Chỉ hiện nếu không phải mail hệ thống) */}
                            {user.email && !user.email.endsWith('@daotaothuyenvien.com') && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 shadow-sm">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-700">
                                                Bạn đang đăng nhập là <strong className="font-bold">{user.displayName || user.email}</strong>.
                                            </p>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Nếu đây là tài khoản cá nhân, vui lòng đăng xuất để đăng nhập bằng <strong>Số Báo Danh</strong>.
                                            </p>
                                            <div className="mt-2">
                                                <button
                                                    onClick={async () => {
                                                        await auth.signOut();
                                                        window.location.href = '/ontap/thitructuyen';
                                                    }}
                                                    className="text-sm font-bold text-red-600 hover:text-red-800 underline"
                                                >
                                                    Đăng xuất & Đăng nhập lại
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-blue-700 uppercase">Khu vực Thi Trực Tuyến</h2>
                                <p className="text-gray-600 mt-2">Xin chào, <strong className="text-blue-900">{user.displayName || user.email}</strong></p>
                            </div>
                            <fieldset className="border border-gray-300 p-6 rounded-sm shadow-sm bg-blue-50/30">
                                <legend className="px-2 text-blue-800 font-bold text-sm bg-white border border-gray-200 rounded shadow-sm">Vào Phòng Thi</legend>
                                <div className="space-y-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Mã phòng thi (Room ID):</label>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã phòng do giám thị cung cấp..."
                                            value={roomId}
                                            onChange={e => setRoomId(e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 rounded-sm shadow-inner"
                                        />
                                        {autoJoinMessage && <p className="text-green-600 text-xs mt-1 font-bold">{autoJoinMessage}</p>}
                                    </div>
                                    <button
                                        onClick={handleJoinRoom}
                                        disabled={loading}
                                        className="w-full bg-[#2962ff] text-white px-4 py-2.5 text-sm font-bold rounded-sm hover:bg-blue-700 transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
                                    >
                                        {loading ? <span className="animate-spin">⏳</span> : <span>VÀO THI NGAY</span>}
                                        {!loading && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>}
                                    </button>
                                </div>
                            </fieldset>
                            <div className="mt-6 text-center">
                                <a href="/ontap" className="text-sm text-gray-500 hover:text-blue-600 hover:underline">
                                    &larr; Quay lại Ôn tập
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-[#0d47a1] text-white py-4 text-center text-xs space-y-1">
                <p className="uppercase font-bold">Công ty cổ phần Tư vấn và Giáo dục Ninh Bình</p>
                <p>Đường Triệu Việt Vương - Phường Hoa Lư - Tỉnh Ninh Bình</p>
                <p>022.96.282.969</p>
                <p>ninhbinheduco.jsc@gmail.com</p>
                <p>giaoducninhbinh@daotaothuyenvien.com</p>
            </div>
        </div>
    );
};

export default ThiTrucTuyenPage;
