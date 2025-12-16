import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FaUsers, FaChalkboardTeacher, FaPlus, FaArrowLeft, FaSearch, FaTrash, FaUserTie, FaHistory, FaTimes, FaSchool, FaThLarge, FaList, FaPaperPlane, FaGraduationCap, FaEdit, FaSave, FaSort, FaSortUp, FaSortDown, FaCheckCircle } from 'react-icons/fa';
import { db } from '../services/firebaseClient';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, arrayUnion, addDoc, arrayRemove, serverTimestamp, onSnapshot, documentId } from 'firebase/firestore';
import { UserProfile } from '../types';
import { getExamHistory, ExamResult } from '../services/historyService';
import { sendNotification } from '../services/notificationService';
import { getDefaultAvatar } from '../services/userService';

interface Course {
    id: string;
    name: string;
    description?: string;
    headTeacherId?: string;
    teacherIds?: string[];
    createdAt?: any;
    createdBy?: string;
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
    courseName?: string;
    email?: string;
    phoneNumber?: string;
    cccd?: string;          // Renamed from citizenId
    cccdDate?: string;      // Renamed from citizenIdDate
    cccdPlace?: string;     // Renamed from citizenIdPlace
    class?: string;         // Renamed from className
    courseCode?: string;
    isVerified?: boolean;
}

interface ClassManagementScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
}

const getRoleDisplayName = (role: string) => {
    switch (role) {
        case 'admin': return 'Quản trị viên';
        case 'lanh_dao': return 'Lãnh đạo';
        case 'quan_ly': return 'Quản lý';
        case 'giao_vien': return 'Giáo viên';
        case 'hoc_vien': return 'Học viên';
        default: return role;
    }
};

const getRoleRank = (role: string) => {
    if (role === 'admin') return 10;
    if (role === 'lanh_dao') return 5;
    if (role === 'quan_ly') return 2;
    if (role === 'giao_vien') return 1;
    return 0;
};

const safeLower = (s: string | undefined | null) => (s || '').toLowerCase();

const ClassManagementScreen: React.FC<ClassManagementScreenProps> = ({ userProfile, onBack }) => {
    // --- STATE ---
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [headTeacherNames, setHeadTeacherNames] = useState<Record<string, string>>({});

    // State for filtering "No Class" students
    const [filterNoClass, setFilterNoClass] = useState(true);

    const [students, setStudents] = useState<UserData[]>([]);
    const [teachers, setTeachers] = useState<UserData[]>([]);
    const [availableStudents, setAvailableStudents] = useState<UserData[]>([]);
    const [availableTeachers, setAvailableTeachers] = useState<UserData[]>([]);
    const [studentLatestResults, setStudentLatestResults] = useState<Record<string, any>>({});

    // UI State
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const [studentSearchTerm, setStudentSearchTerm] = useState('');
    const [teacherSearchTerm, setTeacherSearchTerm] = useState('');
    const [addingStudent, setAddingStudent] = useState(false);
    const [addingTeacher, setAddingTeacher] = useState(false);
    // Bulk Add State
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [isBulkAdding, setIsBulkAdding] = useState(false);
    // --- NEW FEATURES STATES ---
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyStudent, setHistoryStudent] = useState<UserData | null>(null);
    const [studentHistory, setStudentHistory] = useState<ExamResult[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [roomDetails, setRoomDetails] = useState<Record<string, any>>({}); // Added for History Display

    const [showEditStudentModal, setShowEditStudentModal] = useState(false);
    const [editStudent, setEditStudent] = useState<UserData | null>(null);
    const [savingStudent, setSavingStudent] = useState(false);
    const [isEditingMode, setIsEditingMode] = useState(false); // New state for View/Edit mode toggle

    // Missing State Restoration
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseDesc, setNewCourseDesc] = useState('');
    const [setAsHeadTeacher, setSetAsHeadTeacher] = useState(false);

    // Notification State
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [notifTarget, setNotifTarget] = useState<{ type: 'class' | 'user', id: string, name: string } | null>(null);
    const [notifTitle, setNotifTitle] = useState('');
    const [notifMessage, setNotifMessage] = useState('');
    const [notifType, setNotifType] = useState<'system' | 'class' | 'personal' | 'reminder' | 'special' | 'attention'>('system');
    const [notifExpiry, setNotifExpiry] = useState('');
    const [sendingNotif, setSendingNotif] = useState(false);

    // Default to 'list' view
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [licenses, setLicenses] = useState<any[]>([]);



    // Edit Course State
    const [showEditCourseModal, setShowEditCourseModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editCourseName, setEditCourseName] = useState('');
    const [editCourseDesc, setEditCourseDesc] = useState('');
    const [editCourseLicenseId, setEditCourseLicenseId] = useState('');
    const [newCourseLicenseId, setNewCourseLicenseId] = useState('');

    // --- PAGINATION & SORTING STATE ---
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<keyof UserData | 'status' | 'recentExam' | 'time' | 'score'>('fullName');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const canCreateClass = getRoleRank(userProfile.role) >= 2;
    const canManageStudents = ['admin', 'quan_ly', 'lanh_dao', 'giao_vien'].includes(userProfile.role);
    const canAddTeachers = getRoleRank(userProfile.role) >= 2;
    const canRemoveTeachers = getRoleRank(userProfile.role) >= 2;
    const getExamType = (item: ExamResult) => {
        if (item.roomId) return 'Thi Trực Tuyến';
        // Improved logic to match HistoryScreen
        if (item.quizId === 'exam-quiz' || item.quizId === 'thithu2' || item.type === 'Thi thử' || (item.quizTitle && item.quizTitle.includes('Thi thử'))) return 'Thi thử';
        return 'Ôn tập';
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'Thi Trực Tuyến':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Thi thử':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getDisplayName = (item: ExamResult) => {
        if (item.roomId && roomDetails[item.roomId]) {
            const r = roomDetails[item.roomId];
            return `Phòng thi ${r.name} / ${r.course_name || 'Tự do'} / ${r.license_name || ''}`;
        }
        return item.quizTitle || (item.roomId ? `Phòng thi ${item.roomId}` : item.type);
    };


    // --- EFFECTS ---
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const q = query(collection(db, 'courses'));
                const snap = await getDocs(q);
                const fetchedCourses = snap.docs.map(d => ({ id: d.id, ...d.data() } as Course));
                setCourses(fetchedCourses);

                const heads = new Set(fetchedCourses.map(c => c.headTeacherId).filter(Boolean));
                const names: Record<string, string> = {};
                for (const uid of Array.from(heads)) {
                    if (uid) {
                        try {
                            const uSnap = await getDoc(doc(db, 'users', uid));
                            if (uSnap.exists()) names[uid] = uSnap.data().fullName;
                        } catch (e) { }
                    }
                }
                setHeadTeacherNames(names);

            } catch (err) { console.error(err); }
            finally { setLoadingCourses(false); }
        };
        fetchCourses();

        // Fetch Licenses for dropdown
        import('../services/dataService').then(({ fetchLicenses }) => {
            fetchLicenses().then(setLicenses).catch(console.error);
        });
    }, [userProfile]);

    useEffect(() => {
        if (!selectedCourse) return;

        let unsubTeachers: (() => void) | undefined;
        let unsubStudents: (() => void) | undefined;

        if (selectedCourse.teacherIds && selectedCourse.teacherIds.length > 0) {
            try {
                const cleanIds = [...new Set(selectedCourse.teacherIds.filter(id => id && id.trim() !== ''))].slice(0, 10);
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
                console.error("Teacher fetch error:", e);
                setTeachers([]);
            }
        } else {
            setTeachers([]);
        }

        const q = query(collection(db, 'users'), where('courseId', '==', selectedCourse.id));
        unsubStudents = onSnapshot(q, async (snap) => {
            const list = snap.docs.map(d => {
                const data = d.data();
                return { uid: d.id, ...data, photoURL: data.photoURL || getDefaultAvatar(data.role) } as UserData;
            });
            setStudents(list);

            const resultsMap: Record<string, any> = {};
            await Promise.all(list.map(async (s) => {
                try {
                    const history = await getExamHistory(s.uid);
                    if (history && history.length > 0) {
                        const latest = history[0];
                        resultsMap[s.uid] = {
                            type: latest.quizTitle || latest.type || 'Bài thi',
                            time: latest.completedAt ? latest.completedAt.toLocaleString('vi-VN') : '--',
                            score: `${latest.score}/${latest.totalQuestions} câu`,
                            rawDate: latest.completedAt
                        };
                    } else {
                        resultsMap[s.uid] = { type: '--', time: '--', score: '--' };
                    }
                } catch (e) { resultsMap[s.uid] = { type: 'Lỗi', time: '--', score: '--' }; }
            }));
            setStudentLatestResults(resultsMap);
        });

        return () => {
            if (unsubTeachers) unsubTeachers();
            if (unsubStudents) unsubStudents();
        }

    }, [selectedCourse]);

    // --- HELPER FUNCTIONS FOR LIST ---
    const getFilteredAndSortedStudents = useMemo(() => {
        let result = [...students];

        // 1. Search
        if (studentSearchTerm) {
            const lower = studentSearchTerm.toLowerCase();
            result = result.filter(s =>
                s.fullName?.toLowerCase().includes(lower) ||
                s.email?.toLowerCase().includes(lower) ||
                s.phoneNumber?.includes(lower)
            );
        }

        // 2. Sorting
        result.sort((a, b) => {
            let valA: any = a[sortField as keyof UserData];
            let valB: any = b[sortField as keyof UserData];

            if (sortField === 'status') {
                valA = (a.isVerified || a.courseId) ? 1 : 0;
                valB = (b.isVerified || b.courseId) ? 1 : 0;
            }

            if (!valA) valA = '';
            if (!valB) valB = '';

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [students, studentSearchTerm, sortField, sortDirection]);

    const totalPages = Math.ceil(getFilteredAndSortedStudents.length / itemsPerPage);
    const paginatedStudents = getFilteredAndSortedStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: keyof UserData | 'status' | 'recentExam' | 'time' | 'score') => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };



    const getSortIcon = (field: keyof UserData | 'status' | 'recentExam' | 'time' | 'score') => {
        if (sortField !== field) return <FaSort className="ml-1 text-gray-300 inline" />;
        return sortDirection === 'asc' ? <FaSortUp className="ml-1 text-blue-500 inline" /> : <FaSortDown className="ml-1 text-blue-500 inline" />;
    };

    useEffect(() => {
        if (showAddStudentModal) {
            const fetchAvailStudents = async () => {
                const q = query(collection(db, 'users'), where('role', 'in', ['hoc_vien']));
                const snap = await getDocs(q);
                const allS = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserData));
                setAvailableStudents(allS.filter(s => s.courseId !== selectedCourse?.id || !s.courseId));
            };
            fetchAvailStudents();
        }
    }, [showAddStudentModal, selectedCourse]);

    useEffect(() => {
        if (showAddTeacherModal) {
            const fetchAvailTeachers = async () => {
                const q = query(collection(db, 'users'), where('role', 'in', ['giao_vien', 'admin', 'quan_ly', 'lanh_dao']));
                const snap = await getDocs(q);
                const allT = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserData));
                setAvailableTeachers(allT.filter(t => !(selectedCourse?.teacherIds || []).includes(t.uid)));
            };
            fetchAvailTeachers();
        }
    }, [showAddTeacherModal, selectedCourse]);


    // --- HISTORY MODAL EFFECT ---
    useEffect(() => {
        if (showHistoryModal && historyStudent) {
            setLoadingHistory(true);
            const loadHistory = async () => {
                const hist = await getExamHistory(historyStudent.uid);
                // Sort by descending
                hist.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
                setStudentHistory(hist);

                // Fetch Room Details logic from HistoryScreen
                const roomIds = Array.from(new Set(hist.filter(item => item.roomId).map(item => item.roomId!)));
                if (roomIds.length > 0) {
                    const details: Record<string, any> = {};
                    await Promise.all(roomIds.map(async (rid) => {
                        try {
                            const roomSnap = await getDoc(doc(db, 'exam_rooms', rid));
                            if (roomSnap.exists()) details[rid] = roomSnap.data();
                        } catch (e) { }
                    }));
                    setRoomDetails(details);
                }

                setLoadingHistory(false);
            };
            loadHistory();
        }
    }, [showHistoryModal, historyStudent]);


    // --- HANDLERS ---
    const handleCreateClass = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'courses'), {
                name: newCourseName,
                description: newCourseDesc,
                teacherIds: [],
                createdAt: serverTimestamp(),
                createdBy: userProfile.id,
                licenseId: newCourseLicenseId
            });
            setShowCreateModal(false);
            setNewCourseName('');
            setNewCourseDesc('');
            setNewCourseLicenseId('');
            window.location.reload();
        } catch (e) { console.error(e); }
    };

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCourse) return;
        try {
            await updateDoc(doc(db, 'courses', editingCourse.id), {
                name: editCourseName,
                description: editCourseDesc,
                licenseId: editCourseLicenseId
            });

            // Sync to all students if license changed
            if (editingCourse.licenseId !== editCourseLicenseId) {
                const q = query(collection(db, 'users'), where('courseId', '==', editingCourse.id));
                const snap = await getDocs(q);
                const batchPromises = snap.docs.map(d => updateDoc(doc(db, 'users', d.id), {
                    defaultLicenseId: editCourseLicenseId || null
                }));
                await Promise.all(batchPromises);
            }

            alert('Cập nhật lớp học thành công!');
            // Update local state
            setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, name: editCourseName, description: editCourseDesc, licenseId: editCourseLicenseId } : c));
            if (selectedCourse?.id === editingCourse.id) {
                setSelectedCourse(prev => prev ? ({ ...prev, name: editCourseName, description: editCourseDesc, licenseId: editCourseLicenseId }) : null);
            }
            setShowEditCourseModal(false);
        } catch (e) { console.error(e); alert('Lỗi khi cập nhật lớp.'); }
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa lớp này? Hành động này không thể hoàn tác!')) return;
        try {
            // Remove courseId from all students in this course and reset verified status
            const q = query(collection(db, 'users'), where('courseId', '==', courseId));
            const snap = await getDocs(q);

            const updates = snap.docs.map(studentDoc => updateDoc(doc(db, 'users', studentDoc.id), {
                courseId: null,
                courseName: null,
                class: null,
                isVerified: false
            }));
            await Promise.all(updates);

            // Delete the course document
            await import('firebase/firestore').then(({ deleteDoc }) => deleteDoc(doc(db, 'courses', courseId)));

            setCourses(prev => prev.filter(c => c.id !== courseId));
            alert('Đã xóa lớp học!');
            if (selectedCourse?.id === courseId) setSelectedCourse(null);
        } catch (e) { console.error(e); alert('Lỗi khi xóa lớp.'); }
    };

    const openEditCourseModal = (course: Course, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingCourse(course);
        setEditCourseName(course.name);
        setEditCourseDesc(course.description || '');
        setEditCourseLicenseId(course.licenseId || '');
        setShowEditCourseModal(true);
    };

    const handleAddStudentToClass = async (studentId: string) => {
        if (!selectedCourse) return;

        // Find the student to check if they are already in a class
        const student = availableStudents.find(s => s.uid === studentId);
        if (student && student.courseId) {
            alert(`Học viên này đang học lớp ${student.courseName || student.courseId}. Vui lòng xóa khỏi lớp cũ trước khi thêm vào lớp mới.`);
            return;
        }

        setAddingStudent(true);
        try {
            await updateDoc(doc(db, 'users', studentId), {
                courseId: selectedCourse.id,
                courseName: selectedCourse.name,
                class: selectedCourse.name, // Đồng bộ trường class
                isVerified: true, // Tự động verified khi vào lớp
                defaultLicenseId: selectedCourse.licenseId || null,
                updatedAt: serverTimestamp()
            });
            setAvailableStudents(prev => prev.filter(x => x.uid !== studentId)); // Remove from list
            alert(`Đã thêm học viên vào lớp ${selectedCourse.name}`);
        } catch (e) {
            console.error(e);
            alert("Lỗi khi thêm học viên.");
        } finally {
            setAddingStudent(false);
        }
    };

    const handleAddTeacherToClass = async (teacherId: string) => {
        if (!selectedCourse) return;
        setAddingTeacher(true);
        try {
            const courseRef = doc(db, 'courses', selectedCourse.id);
            await updateDoc(courseRef, {
                teacherIds: arrayUnion(teacherId),
                ...(setAsHeadTeacher ? { headTeacherId: teacherId } : {})
            });
            setAvailableTeachers(prev => prev.filter(x => x.uid !== teacherId));
            if (setAsHeadTeacher) {
                setSelectedCourse(prev => prev ? ({ ...prev, headTeacherId: teacherId }) : null);
            }
            setSelectedCourse(prev => {
                if (!prev) return null;
                return { ...prev, teacherIds: [...(prev.teacherIds || []), teacherId] };
            });

        } catch (e) { console.error(e); }
        finally { setAddingTeacher(false); }
    };

    const handleRemoveTeacherFromClass = async (teacherId: string) => {
        if (!selectedCourse) return;
        if (!confirm('Bạn có chắc chắn xoá giáo viên này khỏi lớp?')) return;

        try {
            const courseRef = doc(db, 'courses', selectedCourse.id);
            await updateDoc(courseRef, {
                teacherIds: arrayRemove(teacherId),
                ...(selectedCourse.headTeacherId === teacherId ? { headTeacherId: null } : {})
            });

            setSelectedCourse(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    teacherIds: (prev.teacherIds || []).filter(id => id !== teacherId),
                    headTeacherId: prev.headTeacherId === teacherId ? undefined : prev.headTeacherId
                };
            });
        } catch (e) { console.error("Error removing teacher:", e); }
    };

    const handleRemoveStudentFromClass = async (studentId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa học viên này khỏi lớp?')) return;
        try {
            await updateDoc(doc(db, 'users', studentId), {
                courseId: null,
                courseName: null,
                class: null,
                isVerified: false
            });
        } catch (e) { console.error(e); }
    };

    // --- BULK ADD LOGIC ---
    const toggleSelectOne = (uid: string) => {
        const newSet = new Set(selectedStudentIds);
        if (newSet.has(uid)) newSet.delete(uid);
        else newSet.add(uid);
        setSelectedStudentIds(newSet);
    };

    const toggleSelectAll = (filteredStudents: UserData[]) => {
        if (selectedStudentIds.size === filteredStudents.length && filteredStudents.length > 0) {
            setSelectedStudentIds(new Set()); // Deselect all
        } else {
            const newSet = new Set(filteredStudents.map(s => s.uid));
            setSelectedStudentIds(newSet);
        }
    };

    const handleBulkAddStudents = async () => {
        if (selectedStudentIds.size === 0 || !selectedCourse) return;
        if (!confirm(`Bạn có chắc muốn thêm ${selectedStudentIds.size} học viên vào lớp ${selectedCourse.name}?`)) return;

        setIsBulkAdding(true);
        try {
            const promises = Array.from(selectedStudentIds).map(async (uid) => {
                const student = availableStudents.find(s => s.uid === uid);
                if (!student) return;

                // 1. Update Student Doc
                const userRef = doc(db, 'users', uid);
                await updateDoc(userRef, {
                    courseId: selectedCourse.id,
                    courseName: selectedCourse.name,
                    isVerified: true,
                    defaultLicenseId: selectedCourse.licenseId || null,
                    class: selectedCourse.name,
                    updatedAt: serverTimestamp()
                });

                // 2. Add to Course 'students' array
                const courseRef = doc(db, 'courses', selectedCourse.id);
                await updateDoc(courseRef, {
                    students: arrayUnion(uid)
                });
            });

            await Promise.all(promises);

            alert(`Đã thêm thành công ${selectedStudentIds.size} học viên!`);
            setShowAddStudentModal(false);
            setSelectedStudentIds(new Set());
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi thêm nhiều học viên.');
        } finally {
            setIsBulkAdding(false);
        }
    };

    const handleOpenNotifModal = (type: 'class' | 'user', id: string, name: string) => {
        setNotifTarget({ type, id, name });
        setNotifTitle('');
        setNotifMessage('');
        setShowNotifModal(true);
    };

    const handleSendNotificationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!notifTarget || !userProfile.id) return;
        setSendingNotif(true);
        try {
            const expiryDate = notifExpiry ? new Date(notifExpiry) : null;

            // FORCE Global 'all' target for Special/Attention types to ensure Marquee visibility
            const isSpecial = notifType === 'special' || notifType === 'attention';
            const finalTargetType = isSpecial ? 'all' : notifTarget.type;
            const finalTargetId = isSpecial ? null : notifTarget.id;

            await sendNotification(
                notifTitle,
                notifMessage,
                notifType,
                finalTargetType,
                finalTargetId,
                userProfile.id,
                userProfile.full_name,
                expiryDate
            );
            alert('Gửi thông báo thành công!');
            setShowNotifModal(false);
        } catch (error) {
            console.error(error);
            alert('Lỗi khi gửi thông báo. Có thể thiếu Index Firestore.');
        } finally {
            setSendingNotif(false);
        }
    };

    const handleSaveStudentInfo = async () => {
        if (!editStudent) return;
        setSavingStudent(true);
        try {
            const cleanValue = (val: any) => (val === undefined ? null : val);

            await updateDoc(doc(db, 'users', editStudent.uid), {
                fullName: cleanValue(editStudent.fullName),
                birthDate: cleanValue(editStudent.birthDate),
                email: cleanValue(editStudent.email),
                phoneNumber: cleanValue(editStudent.phoneNumber),
                address: cleanValue(editStudent.address),
                cccd: cleanValue(editStudent.cccd),         // Updated
                cccdDate: cleanValue(editStudent.cccdDate), // Updated
                cccdPlace: cleanValue(editStudent.cccdPlace), // Updated
                class: cleanValue(editStudent.class),       // Updated
                courseCode: cleanValue(editStudent.courseCode),
                role: cleanValue(editStudent.role)
            });
            alert("Đã cập nhật thông tin học viên!");
            setShowEditStudentModal(false);
            setIsEditingMode(false); // Reset mode
        } catch (e) {
            console.error("Error updating user:", e);
            alert("Lỗi khi cập nhật thông tin.");
        } finally {
            setSavingStudent(false);
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
                                <input className="w-full p-2 border rounded dark:bg-slate-700" placeholder="Tên lớp" value={newCourseName} onChange={e => setNewCourseName(e.target.value)} required />
                                <div className="mb-2">
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hạng bằng (Mặc định)</label>
                                    <select className="w-full p-2 border rounded dark:bg-slate-700" value={newCourseLicenseId} onChange={e => setNewCourseLicenseId(e.target.value)}>
                                        <option value="">-- Chọn hạng bằng --</option>
                                        {licenses.map(l => (
                                            <option key={l.id} value={l.id}>{l.name}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Học viên sẽ tự động được gán hạng bằng này khi ôn tập.</p>
                                </div>
                                <textarea className="w-full p-2 border rounded dark:bg-slate-700" placeholder="Mô tả" value={newCourseDesc} onChange={e => setNewCourseDesc(e.target.value)} />
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
                                    <input className="w-full p-2 border rounded dark:bg-slate-700" placeholder="Tên lớp" value={editCourseName} onChange={e => setEditCourseName(e.target.value)} required />
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Hạng bằng mặc định</label>
                                        <select className="w-full p-2 border rounded dark:bg-slate-700" value={editCourseLicenseId} onChange={e => setEditCourseLicenseId(e.target.value)}>
                                            <option value="">-- Không chọn --</option>
                                            {licenses.map(l => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <textarea className="w-full p-2 border rounded dark:bg-slate-700" placeholder="Mô tả" value={editCourseDesc} onChange={e => setEditCourseDesc(e.target.value)} />
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

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
                        <FaSchool className="text-teal-600" /> Quản lý Lớp học
                    </h1>
                    <button onClick={onBack} className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                        Back Dashboard
                    </button>
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
                            {courses.map(course => {
                                // Permission Check
                                const canEditThis = ['admin', 'quan_ly', 'lanh_dao'].includes(userProfile.role) || (userProfile.role === 'giao_vien' && (course.headTeacherId === userProfile.id || (course.teacherIds || []).includes(userProfile.id)));
                                const canDeleteThis = ['admin', 'quan_ly', 'lanh_dao'].includes(userProfile.role);

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
                                                        {licenses.find(l => l.id === course.licenseId)?.name || course.licenseId}
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
        <div className="w-full max-w-7xl mx-auto p-4 animate-slide-in-right relative">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                    <FaSchool className="w-32 h-32 transform rotate-12" />
                </div>
                <div className="relative z-10">
                    <button onClick={onBack} className="absolute top-0 left-0 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition flex items-center gap-1 backdrop-blur-sm">
                        <FaArrowLeft /> Quay lại Dashboard
                    </button>
                    <div className="mt-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                                <FaChalkboardTeacher className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{selectedCourse.name}</h1>
                                <p className="opacity-90">{selectedCourse.description || 'Chưa có mô tả'}</p>
                            </div>
                        </div>

                        {selectedCourse.licenseId && (
                            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold shadow-sm mt-2">
                                <FaGraduationCap />
                                {licenses.find(l => l.id === selectedCourse.licenseId)?.name || selectedCourse.licenseId}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ADD STUDENT MODAL */}
            {showAddStudentModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddStudentModal(false)}>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl p-6 h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowAddStudentModal(false)} className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-full border border-gray-200 dark:border-slate-600"><FaTimes /></button>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="text-gray-800 dark:text-white">Thêm Học Viên vào {selectedCourse.name}</span>
                            {selectedCourse.licenseId && (
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                                    Hạng: {licenses.find(l => l.id === selectedCourse.licenseId)?.name || selectedCourse.licenseId}
                                </span>
                            )}
                        </h2>

                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tìm kiếm tên, email, sđt..." value={studentSearchTerm} onChange={e => setStudentSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800 px-4 cursor-pointer" onClick={() => setFilterNoClass(!filterNoClass)}>
                                <input type="checkbox" checked={filterNoClass} onChange={e => setFilterNoClass(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none">Chỉ hiện học viên chưa có lớp</label>
                            </div>
                        </div>

                        {/* HEADERS */}
                        {/* HEADERS */}
                        <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase px-3 pb-2 border-b border-gray-100 dark:border-slate-700 items-center">
                            <div className="col-span-1 flex justify-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                    checked={availableStudents.filter(s => {
                                        const matchSearch = safeLower(s.fullName).includes(safeLower(studentSearchTerm)) || safeLower(s.email).includes(safeLower(studentSearchTerm)) || safeLower(s.phoneNumber).includes(safeLower(studentSearchTerm));
                                        const matchClass = filterNoClass ? !s.courseId : true;
                                        return matchSearch && matchClass;
                                    }).length > 0 && selectedStudentIds.size === availableStudents.filter(s => {
                                        const matchSearch = safeLower(s.fullName).includes(safeLower(studentSearchTerm)) || safeLower(s.email).includes(safeLower(studentSearchTerm)) || safeLower(s.phoneNumber).includes(safeLower(studentSearchTerm));
                                        const matchClass = filterNoClass ? !s.courseId : true;
                                        return matchSearch && matchClass;
                                    }).length}
                                    onChange={() => toggleSelectAll(availableStudents.filter(s => {
                                        const matchSearch = safeLower(s.fullName).includes(safeLower(studentSearchTerm)) || safeLower(s.email).includes(safeLower(studentSearchTerm)) || safeLower(s.phoneNumber).includes(safeLower(studentSearchTerm));
                                        const matchClass = filterNoClass ? !s.courseId : true;
                                        return matchSearch && matchClass;
                                    }))}
                                />
                            </div>
                            <div className="col-span-4">Học viên</div>
                            <div className="col-span-2">Ngày sinh/SĐT</div>
                            <div className="col-span-2">Địa chỉ</div>
                            <div className="col-span-2">Lớp (Tự điền)</div>
                            <div className="col-span-1 text-center">Thao tác</div>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-2 mt-2">
                            {availableStudents
                                .filter(s => {
                                    const matchSearch = safeLower(s.fullName).includes(safeLower(studentSearchTerm)) || safeLower(s.email).includes(safeLower(studentSearchTerm)) || safeLower(s.phoneNumber).includes(safeLower(studentSearchTerm));
                                    const matchClass = filterNoClass ? !s.courseId : true;
                                    return matchSearch && matchClass;
                                })
                                .map(s => (
                                    <div key={s.uid} className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border transition ${selectedStudentIds.has(s.uid) ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'bg-gray-50 border-transparent hover:bg-gray-100 dark:bg-slate-700/50 dark:hover:bg-slate-700'}`}>

                                        {/* Checkbox */}
                                        <div className="col-span-1 flex justify-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                checked={selectedStudentIds.has(s.uid)}
                                                onChange={() => toggleSelectOne(s.uid)}
                                            />
                                        </div>

                                        {/* Name & Basic Info */}
                                        <div className="col-span-4 flex items-center gap-3 overflow-hidden">
                                            <img src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}`} className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0" />
                                            <div className="min-w-0">
                                                <p className="font-bold text-sm truncate text-gray-900 dark:text-white" title={s.fullName}>{s.fullName}</p>
                                                <p className="text-xs text-gray-500 truncate" title={s.email}>{s.email}</p>
                                            </div>
                                        </div>

                                        {/* DOB & Phone */}
                                        <div className="col-span-2 text-sm text-gray-700 dark:text-gray-300">
                                            <div className="text-xs text-gray-500">{s.birthDate || '--/--/----'}</div>
                                            <div className="font-medium">{s.phoneNumber || '---'}</div>
                                        </div>

                                        {/* Address */}
                                        <div className="col-span-2 text-sm text-gray-700 dark:text-gray-300">
                                            <p className="line-clamp-2 text-xs" title={s.address || s.cccdPlace}>
                                                {s.address || s.cccdPlace || '---'}
                                            </p>
                                        </div>

                                        {/* Class (Self-filled) */}
                                        <div className="col-span-2 text-sm">
                                            <div className="text-xs text-gray-900 dark:text-gray-100 font-medium truncate" title={s.class}>
                                                {s.class || '---'}
                                            </div>
                                            {/* Show current course if exists */}
                                            {s.courseName && (
                                                <div className="text-[10px] text-yellow-600 bg-yellow-50 px-1 rounded inline-block mt-1 truncate max-w-full">
                                                    Đang học: {s.courseName}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => handleAddStudentToClass(s.uid)}
                                                disabled={addingStudent}
                                                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-transform active:scale-95"
                                                title="Thêm vào lớp"
                                            >
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        {/* BULK ACTION FOOTER */}
                        {selectedStudentIds.size > 0 && (
                            <div className="absolute bottom-6 right-6 left-6 flex justify-center z-10 animate-bounce-in">
                                <button
                                    onClick={handleBulkAddStudents}
                                    disabled={isBulkAdding}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-xl hover:bg-blue-700 hover:scale-105 transition flex items-center gap-2 font-bold text-lg disabled:opacity-70 disabled:scale-100"
                                >
                                    {isBulkAdding ? (
                                        <>Adding...</>
                                    ) : (
                                        <>
                                            <FaPlus /> Thêm {selectedStudentIds.size} học viên
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )
            }

            {/* ADD TEACHER MODAL */}
            {
                showAddTeacherModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAddTeacherModal(false)}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl p-6 h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowAddTeacherModal(false)} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full"><FaTimes /></button>
                            <h2 className="text-xl font-bold mb-4">Thêm Giáo Viên</h2>
                            <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded mb-4">
                                <input type="checkbox" checked={setAsHeadTeacher} onChange={e => setSetAsHeadTeacher(e.target.checked)} className="w-5 h-5 text-yellow-600" />
                                <label className="text-sm font-medium">Đặt làm GVCN</label>
                            </div>
                            <div className="relative mb-4">
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                <input className="w-full pl-10 pr-4 py-2 border rounded dark:bg-slate-700" placeholder="Tìm kiếm giáo viên..." value={teacherSearchTerm} onChange={e => setTeacherSearchTerm(e.target.value)} />
                            </div>
                            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                                {availableTeachers
                                    .filter(t => safeLower(t.fullName).includes(safeLower(teacherSearchTerm)) || safeLower(t.email).includes(safeLower(teacherSearchTerm)))
                                    .map(t => (
                                        <div key={t.uid} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 transition">
                                            <div className="flex items-center gap-3">
                                                <img src={t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}`} className="w-10 h-10 rounded-full" />
                                                <div>
                                                    <p className="font-bold text-sm">{t.fullName}</p>
                                                    <p className="text-xs text-gray-500">{t.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => handleAddTeacherToClass(t.uid)} disabled={addingTeacher} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50 text-sm">Thêm</button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/*  NEW MODALS: HISTORY & EDIT  */}
            {/* VIEW HISTORY MODAL (UPDATED UI) */}
            {
                showHistoryModal && historyStudent && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowHistoryModal(false)}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-5xl p-6 h-[80vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setShowHistoryModal(false)} className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-full"><FaTimes /></button>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaHistory className="text-blue-500" /> Lịch sử làm bài: <span className="text-blue-600">{historyStudent.fullName}</span>
                            </h2>

                            <div className="flex-1 overflow-y-auto">
                                {loadingHistory ? (
                                    <div className="p-10 text-center text-gray-500">Đang tải lịch sử...</div>
                                ) : studentHistory.length === 0 ? (
                                    <div className="p-10 text-center text-gray-500 italic">Học viên này chưa làm bài thi nào.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm border-collapse">
                                            <thead className="bg-gray-50 dark:bg-slate-700 sticky top-0 text-gray-500 uppercase text-xs">
                                                <tr>
                                                    <th className="p-4 font-semibold">Loại</th>
                                                    <th className="p-4 font-semibold">Bài thi</th>
                                                    <th className="p-4 font-semibold text-center">Điểm số</th>
                                                    <th className="p-4 font-semibold">Giờ nộp</th>
                                                    <th className="p-4 font-semibold">Ngày nộp</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                                {studentHistory.map((item) => {
                                                    const type = getExamType(item);
                                                    return (
                                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                                            <td className="p-4 align-middle">
                                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getTypeStyles(type)}`}>
                                                                    {type}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 align-middle font-medium text-gray-900 dark:text-gray-100">
                                                                {getDisplayName(item)}
                                                            </td>
                                                            <td className="p-4 align-middle text-center">
                                                                <span className="font-bold text-blue-600 dark:text-blue-400">{item.score}</span>
                                                                <span className="text-gray-400 text-xs"> / {item.totalQuestions}</span>
                                                            </td>
                                                            <td className="p-4 align-middle text-gray-500">
                                                                {new Date(item.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                            </td>
                                                            <td className="p-4 align-middle text-gray-500">
                                                                {new Date(item.completedAt).toLocaleDateString('vi-VN')}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* EDIT STUDENT MODAL */}
            {
                showEditStudentModal && editStudent && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowEditStudentModal(false)}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl p-6 relative animate-scale-up max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { setShowEditStudentModal(false); setIsEditingMode(false); }} className="absolute top-4 right-4 bg-gray-100 dark:bg-slate-700 p-2 rounded-full hover:bg-gray-200 transition"><FaTimes /></button>

                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                {isEditingMode ? <><FaEdit className="text-yellow-500" /> Cập Nhật Thông Tin</> : <><FaUserTie className="text-blue-500" /> Hồ Sơ Học Viên</>}
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Col 1 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Họ và Tên</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.fullName}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Ngày sinh</label>
                                        <input
                                            type="date"
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.birthDate || ''}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, birthDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Lớp học (Khóa học)</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 bg-gray-50 border-transparent cursor-default`}
                                            value={editStudent.courseName || editStudent.courseCode || '--'}
                                            readOnly={true}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Ngày cấp CCCD</label>
                                        <input
                                            type={isEditingMode ? "date" : "text"}
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.cccdDate || ''}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, cccdDate: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Địa chỉ</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.address || ''}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Col 2 */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Số điện thoại</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.phoneNumber || ''}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Lớp học (tự điền)</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.class || ''}
                                            placeholder="Ví dụ: Thợ máy k2"
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, class: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Số CCCD</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.cccd || ''}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, cccd: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Nơi cấp</label>
                                        <input
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.cccdPlace || ''}
                                            readOnly={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, cccdPlace: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Vai trò</label>
                                        <select
                                            className={`w-full p-2.5 border rounded-lg dark:bg-slate-700 ${!isEditingMode ? 'bg-gray-50 border-transparent cursor-default appearance-none pointer-events-none' : 'focus:ring-2 focus:ring-blue-500'}`}
                                            value={editStudent.role}
                                            disabled={!isEditingMode}
                                            onChange={e => setEditStudent({ ...editStudent, role: e.target.value })}
                                        >
                                            <option value="hoc_vien">Học viên</option>
                                            <option value="student">Học sinh</option>
                                            <option value="teacher">Giáo viên</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-slate-700">
                                {!isEditingMode ? (
                                    <>
                                        <button onClick={() => setShowEditStudentModal(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium">Đóng</button>
                                        <button onClick={() => setIsEditingMode(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg font-medium transition-transform active:scale-95">
                                            <FaEdit /> Chỉnh sửa
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setIsEditingMode(false)} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-700 font-medium">Hủy bỏ</button>
                                        <button onClick={handleSaveStudentInfo} disabled={savingStudent} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg font-medium transition-transform active:scale-95">
                                            <FaSave /> {savingStudent ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* NOTIFICATION MODAL */}
            {
                showNotifModal && notifTarget && createPortal(
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" onClick={() => setShowNotifModal(false)}>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md animate-scale-up" onClick={e => e.stopPropagation()}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <FaPaperPlane className="text-yellow-500" /> Gửi Thông Báo
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">To: <span className="font-bold text-blue-600">{notifTarget.name}</span></p>
                            <form onSubmit={handleSendNotificationSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Loại thông báo</label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={notifType}
                                        onChange={(e: any) => setNotifType(e.target.value)}
                                    >
                                        <option value="system">Bình thường</option>
                                        {/* Permission Check for Special Types */}
                                        {['admin', 'lanh_dao', 'quan_ly'].includes(userProfile.role) && (
                                            <>
                                                <option value="attention">⚠️ Chú ý (Chạy chữ vàng)</option>
                                                <option value="special">🚨 ĐẶC BIỆT (Chạy chữ đỏ)</option>
                                            </>
                                        )}
                                    </select>
                                </div>

                                {(notifType === 'special' || notifType === 'attention') && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Hiệu lực chạy chữ đến</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={notifExpiry}
                                            onChange={e => setNotifExpiry(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Sau thời gian này, thông báo sẽ ngừng chạy ngang màn hình.</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tiêu đề</label>
                                    <input className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tiêu đề..." value={notifTitle} onChange={e => setNotifTitle(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tin nhắn</label>
                                    <textarea className="w-full px-4 py-2 border rounded-lg dark:bg-slate-700 h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Nội dung..." value={notifMessage} onChange={e => setNotifMessage(e.target.value)} required />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={() => setShowNotifModal(false)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Hủy</button>
                                    <button type="submit" disabled={sendingNotif} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-lg font-medium">{sendingNotif ? 'Đang gửi...' : 'Gửi Ngay'}</button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )
            }


            {/* HEADER DETAIL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors font-medium">
                        <FaArrowLeft /> Quay lại danh sách
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <FaSchool className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                                {selectedCourse.name}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{selectedCourse.description}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => handleOpenNotifModal('class', selectedCourse.name, selectedCourse.name)} className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition flex items-center gap-2 font-medium">
                        <FaPaperPlane /> Thông báo cả lớp
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* TEACHERS COLUMN */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 sticky top-20">
                        <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-slate-700 mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800 dark:text-white">
                                <FaUserTie className="text-green-500" /> Giáo viên
                            </h3>
                            {canAddTeachers && <button onClick={() => setShowAddTeacherModal(true)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-full transition-colors"><FaPlus size={14} /></button>}
                        </div>

                        <div className="space-y-3">
                            {teachers.map(t => (
                                <div key={t.uid} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors group relative cursor-pointer">
                                    <div className="relative">
                                        <img src={t.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.fullName)}`} className="w-10 h-10 rounded-full border border-gray-200" />
                                        {selectedCourse.headTeacherId === t.uid && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full p-0.5 border-2 border-white"><FaGraduationCap size={10} /></div>}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">{t.fullName}</p>
                                        <p className="text-[11px] text-gray-400 truncate">{getRoleDisplayName(t.role)}</p>
                                        {selectedCourse.headTeacherId === t.uid && <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200 mt-1 inline-block">GVCN</span>}
                                    </div>

                                    {canRemoveTeachers && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleRemoveTeacherFromClass(t.uid); }}
                                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-all absolute right-2"
                                            title="Xóa giáo viên"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {teachers.length === 0 && <p className="text-sm text-gray-500 italic text-center py-4">Chưa có giáo viên.</p>}
                        </div>
                    </div>
                </div>

                {/* STUDENTS COLUMN */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-xl flex items-center gap-2 text-gray-800 dark:text-white">
                                    <FaUsers className="text-blue-500" /> Học viên ({students.length})
                                </h3>
                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 ml-4">
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
                            </div>

                            {canManageStudents && (
                                <button onClick={() => setShowAddStudentModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 hover:shadow-lg transition flex items-center gap-2 text-sm font-medium">
                                    <FaPlus /> Thêm Học Viên
                                </button>
                            )}
                        </div>

                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {paginatedStudents.map(s => {
                                    const result = studentLatestResults[s.uid] || { type: '--', time: '--', score: '--' };
                                    return (
                                        <div key={s.uid} className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-100 to-transparent -mr-8 -mt-8 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>

                                            <div className="flex items-start gap-4 relative z-10">
                                                <div className="relative">
                                                    <img
                                                        src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}&background=random`}
                                                        alt={s.fullName}
                                                        className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-600 shadow-sm group-hover:border-blue-500 transition-colors"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 transition-colors text-base flex items-center gap-1">
                                                        {s.fullName}
                                                        {(s.isVerified || s.courseId) && <FaCheckCircle className="text-green-500 text-xs shrink-0" />}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">{s.email}</p>

                                                    {/* Mini Result in Card */}
                                                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-600 text-xs">
                                                        <div className="flex justify-between text-gray-500">
                                                            <span>Kết quả mới:</span>
                                                            <span className="font-bold text-teal-600">{result.score}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2 mt-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleOpenNotifModal('user', s.uid, s.fullName)} className="text-yellow-600 bg-yellow-50 hover:bg-yellow-100 p-1.5 rounded text-xs flex items-center gap-1" title="Nhắn tin">
                                                            <FaPaperPlane />
                                                        </button>

                                                        <button onClick={() => { setEditStudent(s); setShowEditStudentModal(true); }} className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded text-xs flex items-center gap-1" title="Sửa thông tin">
                                                            <FaEdit />
                                                        </button>

                                                        <button onClick={() => { setHistoryStudent(s); setShowHistoryModal(true); }} className="text-purple-600 bg-purple-50 hover:bg-purple-100 p-1.5 rounded text-xs flex items-center gap-1" title="Xem lịch sử">
                                                            <FaHistory />
                                                        </button>

                                                        {canManageStudents && (
                                                            <button onClick={() => handleRemoveStudentFromClass(s.uid)} className="text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded text-xs flex items-center gap-1" title="Xóa">
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-300 select-none">
                                        <tr>
                                            <th onClick={() => handleSort('fullName')} className="px-4 py-3 rounded-l-lg cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Học viên {getSortIcon('fullName')}</div>
                                            </th>
                                            <th onClick={() => handleSort('birthDate')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Ngày sinh {getSortIcon('birthDate')}</div>
                                            </th>
                                            <th onClick={() => handleSort('recentExam')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Bài làm gần nhất {getSortIcon('recentExam')}</div>
                                            </th>
                                            <th onClick={() => handleSort('time')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Thời gian {getSortIcon('time')}</div>
                                            </th>
                                            <th onClick={() => handleSort('score')} className="px-4 py-3 cursor-pointer hover:bg-gray-200 transition">
                                                <div className="flex items-center">Điểm {getSortIcon('score')}</div>
                                            </th>
                                            <th className="px-4 py-3 text-center rounded-r-lg">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {paginatedStudents.map(s => {
                                            const result = studentLatestResults[s.uid] || { type: '--', time: '--', score: '--' };
                                            return (
                                                <tr key={s.uid} className="group hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                                                        <img src={s.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.fullName)}`} className="w-8 h-8 rounded-full border border-gray-200" />
                                                        <div>
                                                            <p className="flex items-center gap-1">
                                                                {s.fullName}
                                                                {((s as any).isVerified || (s as any).courseId) && <FaCheckCircle className="text-green-500 text-xs" />}
                                                            </p>
                                                            <p className="text-xs text-gray-500 font-normal">{s.email}</p>
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
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => handleOpenNotifModal('user', s.uid, s.fullName)} className="text-yellow-500 hover:bg-yellow-50 p-2 rounded-lg transition" title="Gửi tin nhắn"><FaPaperPlane /></button>

                                                            <button onClick={() => { setEditStudent(s); setShowEditStudentModal(true); }} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition" title="Sửa thông tin"><FaEdit /></button>

                                                            <button onClick={() => { setHistoryStudent(s); setShowHistoryModal(true); }} className="text-purple-500 hover:bg-purple-50 p-2 rounded-lg transition" title="Xem lịch sử thi"><FaHistory /></button>

                                                            {canManageStudents && (
                                                                <button onClick={() => handleRemoveStudentFromClass(s.uid)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition" title="Xóa khỏi lớp"><FaTrash /></button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        {students.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="text-center py-10 text-gray-400 italic">Lớp chưa có học viên nào.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>


                        )}

                        {/* PAGINATION CONTROLS */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 gap-4">
                                <div className="text-sm text-gray-500">
                                    Hiển thị trang <span className="font-bold text-gray-900 dark:text-gray-200">{currentPage}</span> / <span className="font-semibold">{totalPages}</span>
                                    <span className="mx-2">|</span>
                                    Tổng <span className="font-bold text-blue-600">{getFilteredAndSortedStudents.length}</span> kết quả
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        className="border border-gray-300 dark:border-slate-600 rounded-md text-sm p-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200"
                                        value={itemsPerPage}
                                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    >
                                        <option value={5}>5 / trang</option>
                                        <option value={10}>10 / trang</option>
                                        <option value={20}>20 / trang</option>
                                        <option value={50}>50 / trang</option>
                                    </select>

                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                        >
                                            Đầu
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                        >
                                            Trước
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                        >
                                            Sau
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                                        >
                                            Cuối
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

        </div >
    );
};

export default ClassManagementScreen;
