import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseClient';
import { collection, query, where, onSnapshot, getDoc, doc, documentId } from 'firebase/firestore';
import { UserProfile } from '../types';
import { FaUserTie, FaUsers, FaArrowLeft, FaSchool, FaGraduationCap, FaThLarge, FaList, FaHistory } from 'react-icons/fa';
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
    return map[r] || role; // Fallback to original if not found
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

            // 1. Get latest user data to find courseId
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

            // 2. Fetch Course (Reactive)
            const courseDocRef = doc(db, 'courses', courseId);
            unsubCourse = onSnapshot(courseDocRef, (courseSnap) => {
                if (courseSnap.exists()) {
                    const courseData = { id: courseSnap.id, ...courseSnap.data() } as Course;
                    setCourse(courseData);

                    // Fetch License Name if available
                    if (courseData.licenseId) {
                        import('../services/dataService').then(({ fetchLicenses }) => {
                            fetchLicenses().then(ls => {
                                const l = ls.find(x => x.id === courseData.licenseId);
                                if (l) setLicenseName(l.name);
                            });
                        });
                    }

                    // 3. Fetch Teachers (Reactive based on courseData.teacherIds)
                    if (unsubTeachers) unsubTeachers(); // Unsubscribe previous if IDs changed

                    if (courseData.teacherIds && courseData.teacherIds.length > 0) {
                        try {
                            // Use 'in' query for specific IDs (limit 10)
                            // Filter out any potential empty strings or duplicates
                            const cleanIds = [...new Set(courseData.teacherIds.filter(id => id && id.trim() !== ''))].slice(0, 10);

                            if (cleanIds.length > 0) {
                                const teacherQuery = query(collection(db, 'users'), where(documentId(), 'in', cleanIds));
                                unsubTeachers = onSnapshot(teacherQuery, (snap) => {
                                    setTeachers(snap.docs.map(d => {
                                        const data = d.data();
                                        return { uid: d.id, ...data, photoURL: data.photoURL || getDefaultAvatar(data.role) } as UserData;
                                    }));
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

                    // 4. Fetch Classmates (Reactive)
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

                            // Fetch latest results
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
                        });
                    } else {
                        // Already subscribed to students for this courseId
                        setLoading(false);
                    }
                } else {
                    setCourse(null);
                    setLoading(false);
                }
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="w-full max-w-5xl mx-auto p-4 animate-slide-in-right">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                        <FaSchool className="text-teal-600" /> Lớp Của Tôi
                    </h1>
                    <button onClick={onBack} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                        Quay lại
                    </button>
                </div>
                <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <p className="text-gray-500">Bạn chưa được phân lớp.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 animate-slide-in-right">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors font-medium"
                    >
                        <FaArrowLeft /> Quay lại Dashboard
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <FaSchool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                {course.name}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-0.5">{course.description || 'Chưa có mô tả'}</p>
                            {licenseName && (
                                <div className="mt-2 inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">
                                    <FaGraduationCap />
                                    <span>Chứng chỉ: {licenseName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full text-green-600">
                            <FaUserTie />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Giáo viên</p>
                            <p className="font-bold text-lg">{teachers.length}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <FaUsers />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Học viên</p>
                            <p className="font-bold text-lg">{classmates.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* LEFT COL: TEACHERS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 sticky top-20">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white border-b pb-3 border-gray-100 dark:border-slate-700">
                            <FaUserTie className="text-green-500" /> Đội ngũ Giáo viên
                        </h3>
                        <div className="space-y-3">
                            {teachers.map(t => (
                                <div key={t.uid} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group cursor-pointer">
                                    <div className="relative">
                                        <img
                                            src={t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}&background=random`}
                                            alt={t.fullName}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-600 group-hover:scale-105 transition-transform"
                                        />
                                        {course.headTeacherId === t.uid && (
                                            <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 border-2 border-white">
                                                <FaGraduationCap size={10} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{t.fullName}</p>
                                        <p className="text-[11px] text-gray-400">{getRoleDisplayName(t.role)}</p>
                                        {course.headTeacherId === t.uid && (
                                            <span className="inline-flex items-center text-[10px] font-bold text-yellow-600">
                                                ★ GV Chủ Nhiệm
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {teachers.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Chưa có thông tin giáo viên.</p>}
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: CLASSMATES */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 min-h-[500px]">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                                    title="Dạng lưới"
                                >
                                    <FaThLarge />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
                                    title="Dạng danh sách"
                                >
                                    <FaList />
                                </button>
                            </div>
                            <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{classmates.length} thành viên</span>
                        </div>

                        {classmates.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <div className="bg-gray-100 dark:bg-slate-700 p-6 rounded-full mb-4">
                                    <FaUsers className="text-gray-300 w-12 h-12" />
                                </div>
                                <p className="text-gray-500 font-medium">Lớp chưa có học viên nào khác.</p>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {classmates.map(s => (
                                    <div key={s.uid} className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>

                                        <div className="flex items-start gap-4 relative z-10">
                                            <div className="relative">
                                                <img
                                                    src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}&background=random`}
                                                    alt={s.fullName}
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm group-hover:border-blue-500 transition-colors"
                                                />
                                                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors text-base">
                                                    {s.fullName}
                                                </h4>
                                                <div className="space-y-1.5 mt-2">
                                                    <p className="text-xs text-gray-500 flex items-center gap-1.5 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-100 dark:border-slate-600 w-fit">
                                                        <span>🎂</span> {s.birthDate || '--/--'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate flex items-center gap-1.5" title={s.address}>
                                                        <span>📍</span> {s.address || 'Chưa cập nhật'}
                                                    </p>
                                                </div>
                                                {/* Custom Badge for My Class View */}
                                                {(s.uid === userProfile.id) && (
                                                    <div className="mt-2">
                                                        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">
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
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300">
                                        <tr>
                                            <th className="px-4 py-3 rounded-l-lg">Học viên</th>
                                            <th className="px-4 py-3">Ngày sinh</th>
                                            <th className="px-4 py-3">Bài làm gần nhất</th>
                                            <th className="px-4 py-3">Thời gian</th>
                                            <th className="px-4 py-3 rounded-r-lg">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {classmates.map(s => {
                                            const result = studentLatestResults[s.uid] || { type: '--', time: '--', score: '--' };
                                            return (
                                                <tr key={s.uid} className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                                        <img
                                                            src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}`}
                                                            className="w-8 h-8 rounded-full border border-gray-200"
                                                        />
                                                        <div>
                                                            <p>{s.fullName}</p>
                                                            {s.uid === userProfile.id && <span className="text-[10px] font-bold text-teal-600 border border-teal-100 bg-teal-50 px-1 rounded">Tôi</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">{s.birthDate || '--'}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                                        ${result.type.includes('Ôn') ? 'bg-blue-100 text-blue-700' :
                                                                result.type.includes('Thử') ? 'bg-purple-100 text-purple-700' :
                                                                    result.type === '--' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'}`
                                                        }>
                                                            {result.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500">{result.time}</td>
                                                    <td className="px-4 py-3 font-bold text-teal-600">{result.score}</td>
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
