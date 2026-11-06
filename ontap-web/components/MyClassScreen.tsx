import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseClient';
import { collection, query, where, onSnapshot, getDoc, doc, documentId } from 'firebase/firestore';
import { toast } from 'sonner';
import { UserProfile } from '../types';
import { FaUserTie, FaUsers, FaArrowLeft, FaSchool, FaGraduationCap, FaThLarge, FaList } from 'react-icons/fa'; 
import { getExamHistory } from '../services/historyService';
import { getDefaultAvatar } from '../services/userService';

const getRoleDisplayName = (role?: string) => {
    if (!role) return 'Thành viên';
    const r = role.toLowerCase().trim();
    const map: Record<string, string> = {
        'admin': 'Quản trị viên',
        'quan_ly': 'Quản lý',
        'lanh_dao': 'Lãnh đạo',
        'giao_vien': 'Giáo viên',
        'hoc_vien': 'Học viên',
        'phu_huynh': 'Phụ huynh'
    };
    return map[r] || role;
};

interface Course {
    id: string;
    name: string;
    description?: string;
    headTeacherId?: string;
    teacherIds?: string[];
    licenseId?: string;
}

interface UserData {
    uid: string;
    fullName: string;
    role: string;
    birthDate?: string;
    address?: string;
    photoURL?: string;
    courseId?: string;
}

interface MyClassScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
}

const MyClassScreen: React.FC<MyClassScreenProps> = ({ userProfile, onBack }) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [teachers, setTeachers] = useState<UserData[]>([]);
    const [classmates, setClassmates] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [studentLatestResults, setStudentLatestResults] = useState<Record<string, any>>({});
    const [licenseName, setLicenseName] = useState<string>('');

    useEffect(() => {
        let unsubCourse: (() => void) | undefined;
        let unsubTeachers: (() => void) | undefined;
        let unsubClassmates: (() => void) | undefined;

        const fetchData = async () => {
            if (!userProfile.id) return;

            const userDocRef = doc(db, 'users', userProfile.id);
            const userSnap = await getDoc(userDocRef);
            if (!userSnap.exists()) {
                setLoading(false);
                return;
            }
            const userData = userSnap.data();
            const courseId = userData.courseId;

            if (!courseId) {
                setLoading(false);
                return;
            }

            const courseDocRef = doc(db, 'courses', courseId);
            unsubCourse = onSnapshot(courseDocRef, (courseSnap) => {
                if (courseSnap.exists()) {
                    const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
                    setCourse(courseData);

                    if (courseData.licenseId) {
                        import('../services/dataService').then(({ fetchLicenses }) => {
                            fetchLicenses().then(ls => {
                                const l = ls.find(x => x.id === courseData.licenseId);
                                if (l) setLicenseName(l.name);
                            });
                        });
                    }

                    if (unsubTeachers) unsubTeachers();

                    if (courseData.teacherIds && courseData.teacherIds.length > 0) {
                        try {
                            const cleanIds = [...new Set(courseData.teacherIds.filter(id => id && id.trim() !== ''))].slice(0, 10);

                            if (cleanIds.length > 0) {
                                const teacherQuery = query(collection(db, 'users'), where(documentId(), 'in', cleanIds));
                                unsubTeachers = onSnapshot(teacherQuery, (snap) => {
                                    setTeachers(snap.docs.map(d => {
                                        const data = d.data();
                                        return { uid: d.id, ...data, photoURL: data.photoURL || getDefaultAvatar(data.role) } as UserData;
                                    }));
                                }, (error) => {
                                    console.error("Teacher listener error:", error);
                                    toast.error("Không thể cập nhật danh sách giáo viên.");
                                });
                            } else {
                                setTeachers([]);
                            }
                        } catch (e) {
                            console.error("Error creating teacher query:", e);
                            setTeachers([]);
                        }
                    } else {
                        setTeachers([]);
                    }

                    if (!unsubClassmates) {
                        const qStudents = query(
                            collection(db, 'users'),
                            where('courseId', '==', courseId),
                            where('role', '==', 'hoc_vien')
                        );
                        unsubClassmates = onSnapshot(qStudents, async (snap) => {
                            const list = snap.docs.map(d => {
                                const data = d.data();
                                return { uid: d.id, ...data, photoURL: data.photoURL || getDefaultAvatar(data.role) } as UserData;
                            });
                            setClassmates(list);

                            const resultsMap: Record<string, any> = {};
                            await Promise.all(list.map(async (s) => {
                                try {
                                    const history = await getExamHistory(s.uid);
                                    if (history && history.length > 0) {
                                        const latest = history[0];
                                        resultsMap[s.uid] = {
                                            type: latest.quizTitle || latest.type || 'Bài thi',
                                            time: latest.completedAt ? latest.completedAt.toLocaleString('vi-VN') : '--',
                                            score: `${latest.score}/${latest.totalQuestions} câu`
                                        };
                                    } else {
                                        resultsMap[s.uid] = { type: '--', time: '--', score: '--' };
                                    }
                                } catch (e) {
                                    console.error(`Error fetching history for ${s.uid}`, e);
                                    resultsMap[s.uid] = { type: 'Lỗi', time: '--', score: '--' };
                                }
                            }));
                            setStudentLatestResults(resultsMap);
                            setLoading(false);
                        }, (error) => {
                            console.error("Classmates listener error:", error);
                            toast.error("Không thể tải danh sách bạn học.");
                            setLoading(false);
                        });
                    } else {
                        setLoading(false);
                    }
                } else {
                    setCourse(null);
                    setLoading(false);
                }
            }, (error) => {
                console.error("Course listener error:", error);
                toast.error("Lỗi khi tải thông tin lớp học.");
                setLoading(false);
            });
        };

        fetchData();

        return () => {
            if (unsubCourse) unsubCourse();
            if (unsubTeachers) unsubTeachers();
            if (unsubClassmates) unsubClassmates();
        };
    }, [userProfile.id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="w-full max-w-5xl mx-auto p-4 animate-slide-in-right pb-24 pt-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                        <FaSchool className="text-primary" /> Lớp Của Tôi
                    </h1>
                    <button 
                        onClick={onBack} 
                        className="bg-card text-foreground px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors min-h-[44px] flex items-center font-medium"
                    >
                        Quay lại
                    </button>
                </div>
                <div className="text-center p-12 bg-card rounded-2xl border border-border shadow-sm">
                    <p className="text-muted-foreground font-medium">Bạn chưa được phân lớp.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-slide-in-right pb-24 pt-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors font-medium min-h-[44px]"
                    >
                        <FaArrowLeft /> Quay lại Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-3 rounded-2xl border border-primary/20">
                            <FaSchool className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-foreground">
                                {course.name}
                            </h1>
                            <p className="text-muted-foreground text-sm mt-0.5">{course.description || 'Chưa có mô tả'}</p>
                            {licenseName && (
                                <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold border border-primary/20">
                                    <FaGraduationCap />
                                    <span>Chứng chỉ: {licenseName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3">
                    <div className="bg-card px-4 py-3 rounded-2xl shadow-sm border border-border flex items-center gap-3">
                        <div className="bg-emerald-500/15 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
                            <FaUserTie className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Giáo viên</p>
                            <p className="font-bold text-lg text-foreground tabular-nums">{teachers.length}</p>
                        </div>
                    </div>
                    <div className="bg-card px-4 py-3 rounded-2xl shadow-sm border border-border flex items-center gap-3">
                        <div className="bg-primary/15 p-2.5 rounded-xl text-primary">
                            <FaUsers className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Học viên</p>
                            <p className="font-bold text-lg text-foreground tabular-nums">{classmates.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* LEFT COL: TEACHERS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-5 sticky top-24">
                        <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-foreground border-b border-border pb-3">
                            <FaUserTie className="text-emerald-500" /> Đội ngũ Giáo viên
                        </h3>
                        <div className="space-y-3">
                            {teachers.map(t => (
                                <div key={t.uid} className="flex items-center gap-3 p-2 hover:bg-muted/60 rounded-xl transition-colors group cursor-pointer">
                                    <div className="relative">
                                        <img
                                            src={t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=random`}
                                            alt={t.fullName}
                                            className="w-10 h-10 rounded-full object-cover border border-border group-hover:scale-105 transition-transform" loading="lazy" />
                                        {course.headTeacherId === t.uid && (
                                            <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-background">
                                                <FaGraduationCap size={10} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-sm text-foreground truncate">{t.fullName}</p>
                                        <p className="text-[11px] text-muted-foreground">{getRoleDisplayName(t.role)}</p>
                                        {course.headTeacherId === t.uid && (
                                            <span className="inline-flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                                ★ GV Chủ Nhiệm
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {teachers.length === 0 && <p className="text-sm text-muted-foreground italic text-center py-4">Chưa có thông tin giáo viên.</p>}
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: CLASSMATES */}
                <div className="lg:col-span-3">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 min-h-[500px]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex bg-muted rounded-xl p-1 border border-border">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-card shadow-sm text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Dạng lưới"
                                    aria-label="Xem dạng lưới"
                                >
                                    <FaThLarge />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-card shadow-sm text-primary font-bold' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Dạng danh sách"
                                    aria-label="Xem dạng danh sách"
                                >
                                    <FaList />
                                </button>
                            </div>
                            <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-full font-bold border border-primary/20 tabular-nums">
                                {classmates.length} thành viên
                            </span>
                        </div>

                        {classmates.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <div className="bg-muted p-5 rounded-2xl mb-4 text-muted-foreground">
                                    <FaUsers className="w-10 h-10" />
                                </div>
                                <p className="text-muted-foreground font-medium">Lớp chưa có học viên nào khác.</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {classmates.map(s => (
                                    <div key={s.uid} className="bg-card rounded-2xl p-4 border border-border hover:shadow-sm hover:border-primary/40 transition-all duration-200 group relative overflow-hidden">
                                        <div className="flex items-start gap-3.5 relative z-10">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}&background=random`}
                                                    alt={s.fullName}
                                                    className="w-12 h-12 rounded-full object-cover border border-border shadow-sm group-hover:border-primary transition-colors" loading="lazy" />
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-sm">
                                                    {s.fullName}
                                                </h4>
                                                <div className="space-y-1 mt-1.5">
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 tabular-nums">
                                                        <span>🎂</span> {s.birthDate || '--/--'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5" title={s.address}>
                                                        <span>📍</span> {s.address || 'Chưa cập nhật'}
                                                    </p>
                                                </div>
                                                {s.uid === userProfile.id && (
                                                    <div className="mt-2">
                                                        <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                                            Là tôi
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-xl">Học viên</th>
                                            <th className="px-4 py-3">Ngày sinh</th>
                                            <th className="px-4 py-3">Bài làm gần nhất</th>
                                            <th className="px-4 py-3">Thời gian</th>
                                            <th className="px-4 py-3 rounded-r-xl">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {classmates.map(s => {
                                            const result = studentLatestResults[s.uid] || { type: '--', time: '--', score: '--' };
                                            return (
                                                <tr key={s.uid} className="bg-card hover:bg-muted/40 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-foreground flex items-center gap-3">
                                                        <img
                                                            src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}`}
                                                            className="w-8 h-8 rounded-full border border-border" loading="lazy" alt="" />
                                                        <div>
                                                            <p className="font-semibold">{s.fullName}</p>
                                                            {s.uid === userProfile.id && <span className="text-[10px] font-bold text-primary border border-primary/20 bg-primary/10 px-1 rounded">Tôi</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{s.birthDate || '--'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold
                                                        ${result.type.includes('Ôn') ? 'bg-primary/10 text-primary' :
                                                                result.type.includes('Thử') ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' :
                                                                    result.type === '--' ? 'bg-muted text-muted-foreground' : 'bg-destructive/15 text-destructive'}`
                                                        }>
                                                            {result.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-muted-foreground tabular-nums text-xs">{result.time}</td>
                                                    <td className="px-4 py-3 font-bold text-primary tabular-nums">{result.score}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyClassScreen;
