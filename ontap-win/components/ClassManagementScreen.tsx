import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseClient';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc, 
    addDoc, 
    serverTimestamp, 
    where,
    QuerySnapshot,
    DocumentData,
    QueryDocumentSnapshot,
    Unsubscribe
} from 'firebase/firestore';
import { FaUserGraduate, FaChalkboardTeacher, FaSchool, FaPlus, FaSearch, FaTrash, FaEdit, FaTimes, FaArrowLeft, FaUserTie } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { Course, UserProfile } from '../types';
import ClassDetailClient from './ClassDetail/ClassDetailClient';

interface ClassManagementScreenProps {
    userProfile: UserProfile;
    usageConfig?: any;
    onBack: () => void;
}

const getRoleWeight = (role: string) => {
    switch (role) {
        case 'admin': return 100;
        case 'lanh_dao': return 80;
        case 'quan_ly': return 60;
        case 'giao_vien': return 40;
        case 'hoc_vien': return 20;
        case 'guest': return 0;
        default: return 0;
    }
};

const getRoleRank = (role: string) => {
    switch (role) {
        case 'admin': return 4;
        case 'lanh_dao': return 3;
        case 'quan_ly': return 2;
        case 'giao_vien': return 1;
        default: return 0;
    }
};

const safeLower = (s: string | undefined | null) => (s || '').toLowerCase();

const ClassManagementScreen: React.FC<ClassManagementScreenProps> = ({ userProfile, usageConfig, onBack }) => {
    // --- STATE ---
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [headTeacherNames, setHeadTeacherNames] = useState<Record<string, string>>({});

    const [studentLatestResults, setStudentLatestResults] = useState<Record<string, any>>({});
    const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});

    // Course Search State
    const [courseSearchTerm, setCourseSearchTerm] = useState('');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const [newCourseLicenseId, setNewCourseLicenseId] = useState('');

    const [licenses, setLicenses] = useState<any[]>([]);

    // Edit Course State
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editCourseName, setEditCourseName] = useState('');
    const [editCourseDesc, setEditCourseDesc] = useState('');
    const [editCourseLicenseId, setEditCourseLicenseId] = useState('');

    const getRoleConfigKey = (role: string): string => {
        if (role === 'admin') return 'admin';
        if (role === 'lanh_dao' || role === 'quan_ly') return 'manager';
        if (role === 'giao_vien') return 'teacher';
        if (role === 'hoc_vien') return 'verified_user';
        return 'guest';
    };

    const userRole = userProfile?.role || 'guest';
    const roleConfig = usageConfig?.[getRoleConfigKey(userRole)] || {};

    const viewListPermission = roleConfig.courseViewList || 'managed';
    const createDeletePermission = roleConfig.courseCreateDelete || 'none';
    const editPermission = roleConfig.courseEdit || 'none';
    const canAssignMembers = roleConfig.courseAssignMembers || false;

    const canCreateClass = createDeletePermission === 'all' || createDeletePermission === 'managed';

    // --- DATA FETCHING ---
    // Fetch Licenses
    useEffect(() => {
        const fetchLicenses = async () => {
            const q = query(collection(db, 'licenses'));
            const unsub = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
                setLicenses(snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({ id: d.id, ...d.data() })));
            });
            return unsub;
        };
        const unsubPromise = fetchLicenses();
        return () => { unsubPromise.then(unsub => unsub()); };
    }, []);

    // Course List Listener
    useEffect(() => {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
            let coursesData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...doc.data()
            })) as Course[];

            // Lọc danh sách lớp dựa trên courseViewList
            if (viewListPermission === 'managed') {
                coursesData = coursesData.filter(c => 
                    c.createdBy === userProfile.id || 
                    c.headTeacherId === userProfile.id || 
                    (c.teacherIds && c.teacherIds.includes(userProfile.id))
                );
            } else if (viewListPermission === 'none') {
                coursesData = [];
            }

            setCourses(coursesData);
            setLoadingCourses(false);

            // Fetch head teacher names
            const headTeacherIds = [...new Set(coursesData.map(c => c.headTeacherId).filter(Boolean))] as string[];
            if (headTeacherIds.length > 0) {
                const teachersQ = query(collection(db, 'users'), where('role', '==', 'giao_vien'));
                onSnapshot(teachersQ, (teacherSnap: QuerySnapshot<DocumentData>) => {
                    const names: Record<string, string> = {};
                    teacherSnap.forEach((tDoc: QueryDocumentSnapshot<DocumentData>) => {
                        const data = tDoc.data();
                        if (headTeacherIds.includes(tDoc.id)) {
                            names[tDoc.id] = data.full_name || data.fullName || 'Chưa cập nhật';
                        }
                    });
                    setHeadTeacherNames(names);
                });
            }
        });
        return () => unsubscribe();
    }, [viewListPermission, userProfile.id]);

    // Fetch Stats when a course is selected
    useEffect(() => {
        if (!selectedCourse) return;

        const qStudents = query(collection(db, 'users'), where('courseId', '==', selectedCourse.id), where('role', '==', 'hoc_vien'));
        let unsubSessions: Unsubscribe | undefined;
        let unsubResults: Unsubscribe | undefined;

        const unsubscribeStudents = onSnapshot(qStudents, (snapshot: QuerySnapshot<DocumentData>) => {
            const studentIds = snapshot.docs.map((d: QueryDocumentSnapshot<DocumentData>) => d.id);
            if (studentIds.length === 0) {
                setDeviceCounts({});
                setStudentLatestResults({});
                return;
            }

            // Cleanup previous sub-listeners before re-subscribing
            if (unsubSessions) unsubSessions();
            if (unsubResults) unsubResults();

            // Listen for active sessions (devices)
            const qSessions = query(collection(db, 'login_sessions'), where('userId', 'in', studentIds.slice(0, 30)), where('status', '==', 'active'));
            unsubSessions = onSnapshot(qSessions, (snap: QuerySnapshot<DocumentData>) => {
                const counts: Record<string, number> = {};
                snap.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data();
                    counts[data.userId] = (counts[data.userId] || 0) + 1;
                });
                setDeviceCounts(counts);
            });

            // Listen for latest results
            const qResults = query(collection(db, 'exam_results'), where('studentId', 'in', studentIds.slice(0, 30)), orderBy('createdAt', 'desc'));
            unsubResults = onSnapshot(qResults, (snap: QuerySnapshot<DocumentData>) => {
                const latest: Record<string, any> = {};
                snap.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
                    const data = doc.data();
                    if (!latest[data.studentId]) {
                        latest[data.studentId] = {
                            score: data.score,
                            time: data.createdAt?.toDate() ? data.createdAt.toDate().toLocaleDateString('vi-VN') : '---',
                            type: data.type || 'Thi thử'
                        };
                    }
                });
                setStudentLatestResults(latest);
            });
        });

        return () => {
            unsubscribeStudents();
            if (unsubSessions) unsubSessions();
            if (unsubResults) unsubResults();
        };
    }, [selectedCourse]);


    // --- HANDLERS ---
    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'courses'), {
                name: newCourseName,
                description: newCourseDesc,
                licenseId: newCourseLicenseId || null,
                createdAt: serverTimestamp(),
                createdBy: userProfile.id,
                headTeacherId: userProfile.role === 'giao_vien' ? userProfile.id : null, 
                teacherIds: userProfile.role === 'giao_vien' ? [userProfile.id] : [],
                status: 'active'
            });
            setShowCreateModal(false);
            setNewCourseName('');
            setNewCourseDesc('');
            setNewCourseLicenseId('');
        } catch (error) {
            console.error("Error creating class:", error);
            alert("Có lỗi xảy ra khi tạo lớp.");
        }
    };

    const handleDeleteCourse = async (courseId: string) => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;

        // Kiểm tra quyền xóa
        if (createDeletePermission === 'none') {
            alert('Bạn không có quyền xóa lớp học!');
            return;
        }
        if (createDeletePermission === 'managed') {
            if (course.createdBy !== userProfile.id) {
                alert('Bạn chỉ được phép xóa lớp học do chính mình tạo!');
                return;
            }
        }

        if (!confirm('Bạn có chắc chắn muốn xóa lớp học này? Tất cả học viên sẽ bị đẩy ra khỏi lớp!')) return;
        try {
            // Unassign all students
            const q = query(collection(db, 'users'), where('courseId', '==', courseId));
            onSnapshot(q, async (snap: QuerySnapshot<DocumentData>) => {
                const updates = snap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => updateDoc(doc(db, 'users', d.id), { courseId: null, courseName: null }));
                await Promise.all(updates);
            });

            await deleteDoc(doc(db, 'courses', courseId));
        } catch (error) {
            console.error("Error deleting class:", error);
            alert("Lỗi khi xóa lớp.");
        }
    };

    const openEditCourseModal = (course: Course, e: React.MouseEvent) => {
        e.stopPropagation();

        // Kiểm tra quyền sửa
        if (editPermission === 'none') {
            alert('Bạn không có quyền sửa thông tin lớp học!');
            return;
        }
        if (editPermission === 'managed') {
            const isManager = course.createdBy === userProfile.id || course.headTeacherId === userProfile.id || (course.teacherIds && course.teacherIds.includes(userProfile.id));
            if (!isManager) {
                alert('Bạn chỉ được phép sửa lớp học do chính mình quản lý!');
                return;
            }
        }

        setEditingCourse(course);
        setEditCourseName(course.name);
        setEditCourseDesc(course.description || '');
        setEditCourseLicenseId(course.licenseId || '');
        setShowEditCourseModal(true);
    };

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourse) return;
        try {
            await updateDoc(doc(db, 'courses', editingCourse.id), {
                name: editCourseName,
                description: editCourseDesc,
                licenseId: editCourseLicenseId || null,
                updatedAt: serverTimestamp()
            });
            setShowEditCourseModal(false);
            setEditingCourse(null);
        } catch (error) {
            console.error("Error updating course", error);
            alert("Cập nhật thất bại.");
        }
    };


    // --- RENDER ---
    if (!selectedCourse) {
        return (
            <div className="w-full max-w-6xl mx-auto p-4 animate-slide-in-right relative">
                {/* Create Modal */}
                {showCreateModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Tạo Lớp Học Mới</h2>
                            <form onSubmit={handleCreateClass} className="space-y-4">
                                <input className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Tên lớp" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} required />
                                <div className="mb-2">
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hạng bằng (Mặc định)</label>
                                    <select className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" value={newCourseLicenseId} onChange={e => setNewCourseLicenseId(e.target.value)}>
                                        <option value="">-- Chọn hạng bằng --</option>
                                        {licenses.map((l: any) => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Học viên sẽ tự động được gán hạng bằng này khi ôn tập.</p>
                                </div>
                                <textarea className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Mô tả" value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                    <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded">Tạo</button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Edit Course Modal */}
                {
                    showEditCourseModal && editingCourse && createPortal(
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
                                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Chỉnh Sửa Lớp Học</h2>
                                <form onSubmit={handleUpdateCourse} className="space-y-4">
                                    <input className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Tên lớp" value={editCourseName} onChange={e => setEditCourseName(e.target.value)} required />
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hạng bằng mặc định</label>
                                        <select className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" value={editCourseLicenseId} onChange={e => setEditCourseLicenseId(e.target.value)}>
                                            <option value="">-- Không chọn --</option>
                                            {licenses.map((l: any) => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea className="w-full p-2 border rounded dark:bg-slate-700 dark:text-white" placeholder="Mô tả" value={editCourseDesc} onChange={e => setEditCourseDesc(e.target.value)} />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={() => setShowEditCourseModal(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Lưu Thay Đổi</button>
                                    </div>
                                </form>
                            </div>
                        </div>,
                        document.body
                    )
                }

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                        <FaSchool className="text-teal-600" /> Quản lý Lớp học
                    </h1>
                    <button onClick={onBack} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors shadow-sm">
                        Back Dashboard
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8 relative max-w-xl group animate-slide-in-right" style={{animationDelay: '0.1s'}}>
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400 group-focus-within:text-teal-500 text-lg transition-colors duration-300" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-800 border-2 border-transparent focus:border-teal-500 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all duration-300 hover:-translate-y-0.5"
                        placeholder="Tìm kiếm lớp học..."
                        value={courseSearchTerm}
                        onChange={(e) => setCourseSearchTerm(e.target.value)}
                    />
                    {courseSearchTerm && (
                        <button 
                            onClick={() => setCourseSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* Course List */}
                {
                    loadingCourses ? (
                        <div className="p-20 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div></div>
                    ) : courses.length === 0 ? (
                        <div className="text-center p-12 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                            <FaSchool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-2">Chưa có lớp học nào</h3>
                            {canCreateClass && <button onClick={() => setShowCreateModal(true)} className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition">Tạo Lớp Ngay</button>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {canCreateClass && (
                                <div onClick={() => setShowCreateModal(true)} className="bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-white cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                                    <div className="bg-white/20 p-4 rounded-full mb-3 group-hover:bg-white/30 transition-colors"><FaPlus className="w-8 h-8" /></div>
                                    <h3 className="font-bold text-lg">Thêm Lớp Mới</h3>
                                </div>
                            )}
                            {courses
                                .filter((c: Course) => safeLower(c.name).includes(safeLower(courseSearchTerm)) || safeLower(c.description).includes(safeLower(courseSearchTerm)))
                                .map((course: Course) => {
                                // Permission Check
                                const canEditThis = editPermission === 'all' || (editPermission === 'managed' && (course.createdBy === userProfile.id || course.headTeacherId === userProfile.id || (course.teacherIds || []).includes(userProfile.id)));
                                const canDeleteThis = createDeletePermission === 'all' || (createDeletePermission === 'managed' && course.createdBy === userProfile.id);

                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course)}
                                        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative"
                                    >
                                        {(canEditThis || canDeleteThis) && (
                                            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {canEditThis && (
                                                    <button
                                                        onClick={(e) => openEditCourseModal(course, e)}
                                                        className="p-2 bg-white/90 text-blue-600 rounded-full shadow-sm hover:bg-blue-50"
                                                        title="Sửa lớp"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                )}
                                                {canDeleteThis && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.id); }}
                                                        className="p-2 bg-white/90 text-red-600 rounded-full shadow-sm hover:bg-red-50"
                                                        title="Xóa lớp"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                            <FaChalkboardTeacher className="text-white/30 w-20 h-20 transform -rotate-12 group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                                                <h3 className="font-bold text-xl text-white truncate">{course.name}</h3>
                                                {course.licenseId && (
                                                    <span className="text-xs text-yellow-300 font-mono bg-black/30 px-1 rounded ml-2">
                                                        {licenses.find((l: any) => l.id === course.licenseId)?.name || course.licenseId}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                                {course.description || 'Chưa có mô tả khóa học.'}
                                            </p>
                                            <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-gray-100 dark:border-slate-700">
                                                <span className={`flex items-center gap-1 ${course.headTeacherId ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                                                    <FaUserTie /> GVCN: {course.headTeacherId ? (headTeacherNames[course.headTeacherId] || '...') : 'Chưa có'}
                                                </span>
                                                <span className="text-blue-600 group-hover:underline flex items-center gap-1">Chi tiết <FaArrowLeft className="rotate-180" /></span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                }
            </div >
        );
    }

    // --- DETAIL VIEW ---
    return (
        <ClassDetailClient 
            course={selectedCourse} 
            onBack={() => setSelectedCourse(null)} 
            userProfile={userProfile} 
            studentLatestResults={studentLatestResults}
            deviceCounts={deviceCounts}
            canAssignMembers={canAssignMembers}
        />
    );
};

export default ClassManagementScreen;
