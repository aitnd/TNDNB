import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db, rtdb } from '../services/firebaseClient';
import { supabase } from '../services/supabaseClient';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, set, update, onDisconnect, serverTimestamp as rtdbTimestamp } from 'firebase/database';
import ExamQuizScreen from './ExamQuizScreen';
import { toast } from 'sonner';
import { BadgeService } from '../services/badgeService';

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
            
            // --- BADGE LOGIC ---
            // 1. Hoàn thành 1 đề thi
            await BadgeService.unlockBadge(user.uid, 'achievement_1');
            // 2. Điểm tuyệt đối
            if (score >= 10 && questions.length > 0) {
                await BadgeService.unlockBadge(user.uid, 'achievement_perfect');
            }
            
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
            <div className="min-h-screen bg-background p-4">
                <ExamQuizScreen
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
        <div className="min-h-screen flex flex-col font-sans bg-background text-foreground">
            {/* HEADER */}
            <div className="bg-card border-b border-border shadow-sm">
                <div className="w-full py-6 px-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img src="/ontap/assets/img/logo1.ico" alt="Logo" className="h-16 w-16 object-contain" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/100?text=LOGO'} loading="lazy" />
                            <div>
                                <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight">CÔNG TY CP TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h1>
                                <h2 className="text-xs md:text-sm font-semibold text-primary mt-0.5">HỆ THỐNG SÁT HẠCH TRỰC TUYẾN THỦY NỘI ĐỊA</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-grow flex justify-center items-center py-10 px-4">
                <div className="w-full max-w-md">
                    {!user ? (
                        <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            <div className="text-center mb-6 space-y-1">
                                <h2 className="text-xl font-bold tracking-tight text-foreground">Đăng nhập Phòng thi</h2>
                                <p className="text-xs text-muted-foreground">Nhập Số báo danh và mật khẩu do Hội đồng thi cung cấp.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Số báo danh</label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Ví dụ: SBD123"
                                        className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                        required
                                    />
                                </div>
                                {error && <p className="text-destructive text-xs text-center bg-destructive/10 border border-destructive/20 p-2.5 rounded-xl">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full min-h-[44px] bg-primary text-primary-foreground font-semibold py-2.5 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 mt-2"
                                >
                                    {loading ? 'Đang xử lý...' : 'Đăng nhập vào thi'}
                                </button>
                            </form>

                            <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground space-y-1">
                                <p>Cần hỗ trợ tra cứu kết quả? <a href="/ontap" className="text-primary font-semibold hover:underline">Về Trang Ôn tập</a></p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-sm p-6 md:p-8">
                            {user.email && !user.email.endsWith('@daotaothuyenvien.com') && (
                                <div className="bg-amber-500/10 border border-amber-500/30 text-foreground p-3.5 rounded-xl mb-5 text-xs leading-relaxed">
                                    <p>
                                        Đang đăng nhập: <strong className="font-bold text-primary">{user.displayName || user.email}</strong>.
                                    </p>
                                    <p className="mt-1 text-muted-foreground">
                                        Nếu thi chính thức, vui lòng đăng xuất để đăng nhập bằng <strong>Số Báo Danh</strong>.
                                    </p>
                                    <div className="mt-2">
                                        <button
                                            onClick={async () => {
                                                await auth.signOut();
                                                window.location.href = '/ontap/online-exam';
                                            }}
                                            className="text-xs font-semibold text-destructive hover:underline"
                                        >
                                            Đăng xuất & Đăng nhập lại
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">Phòng Thi Trực Tuyến</h2>
                                <p className="text-xs text-muted-foreground mt-1">Xin chào, <strong className="text-foreground">{user.displayName || user.email}</strong></p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Mã phòng thi (Room ID)</label>
                                    <input
                                        type="text"
                                        placeholder="Nhập mã phòng do giám thị cung cấp..."
                                        value={roomId}
                                        onChange={e => setRoomId(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-background border border-border text-foreground rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                                    />
                                    {autoJoinMessage && <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-1.5 font-medium">{autoJoinMessage}</p>}
                                </div>
                                <button
                                    onClick={handleJoinRoom}
                                    disabled={loading}
                                    className="w-full min-h-[44px] bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-sm flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <span className="animate-spin">⏳ Đang vào phòng...</span> : <span>VÀO THI NGAY</span>}
                                </button>
                            </div>

                            <div className="mt-6 text-center">
                                <a href="/ontap" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                    &larr; Quay lại Ôn tập
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="bg-card border-t border-border py-4 text-center text-xs text-muted-foreground space-y-1">
                <p className="uppercase font-semibold text-foreground">Công ty CP Tư vấn và Giáo dục Ninh Bình</p>
                <p>Đường Triệu Việt Vương - Phường Hoa Lư - Tỉnh Ninh Bình</p>
                <p className="tabular-nums font-medium">Hotline: 0229 628 2969</p>
            </div>
        </div>
    );
};

export default ThiTrucTuyenPage;
