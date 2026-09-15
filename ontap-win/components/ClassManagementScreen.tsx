import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebaseClient';
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, deleteDoc, addDoc, serverTimestamp, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { Course, UserProfile } from '../types';
import ClassDetailClient from './ClassDetail/ClassDetailClient';
import ClassList from './ClassDetail/ClassList';
import { AddEditCourseModal } from './ClassDetail/Modals';
import { getExamHistory } from '../services/historyService';

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

const ClassManagementScreen: React.FC<ClassManagementScreenProps> = ({ userProfile, usageConfig, onBack }) => {
    // --- STATE ---
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const [courses, setCourses] = useState<Course[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [headTeacherNames, setHeadTeacherNames] = useState<Record<string, string>>({});
    const [creatorProfiles, setCreatorProfiles] = useState<Record<string, {name: string, role: string}>>({});
    const [classStats, setClassStats] = useState<Record<string, number>>({});

    const selectedCourse = React.useMemo(() => {
        if (!courseId) return null;
        return courses.find(c => c.id === courseId) || null;
    }, [courseId, courses]);

    const [studentLatestResults, setStudentLatestResults] = useState<Record<string, any>>({});
    const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});
    const [subjectStats, setSubjectStats] = useState<any[]>([]);
    const [allClassHistories, setAllClassHistories] = useState<any[]>([]);

    // Course Search State
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const [licenses, setLicenses] = useState<any[]>([]);

    // Modal States
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const getRoleConfigKey = (role: string): string => {
        if (role === 'admin') return 'admin';
        if (role === 'lanh_dao') return 'leader';
        if (role === 'quan_ly') return 'manager';
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
            const unsub = onSnapshot(q, (snapshot) => {
                setLicenses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            });
            return unsub;
        };
        const unsubPromise = fetchLicenses();
        return () => { unsubPromise.then(unsub => unsub()); };
    }, []);

    // Course List Listener
    useEffect(() => {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let coursesData = snapshot.docs.map(doc => ({
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

            // Fetch head teacher & creator profiles
            const relevantUserIds = [...new Set([
                ...coursesData.map(c => c.headTeacherId),
                ...coursesData.map(c => c.createdBy)
            ].filter(Boolean))] as string[];

            if (relevantUserIds.length > 0) {
                const fetchUsers = async () => {
                    const names: Record<string, string> = {};
                    const profiles: Record<string, any> = {};
                    
                    await Promise.all(relevantUserIds.map(async (uid) => {
                        try {
                            const udoc = await getDoc(doc(db, 'users', uid));
                            if (udoc.exists()) {
                                const data = udoc.data();
                                names[uid] = data.full_name || data.fullName || 'Chưa cập nhật';
                                profiles[uid] = {
                                    name: data.full_name || data.fullName || 'Không tên',
                                    role: data.role || 'user'
                                };
                            }
                        } catch(e) {  }
                    }));
                    setHeadTeacherNames(prev => ({...prev, ...names}));
                    setCreatorProfiles(prev => ({...prev, ...profiles}));
                };
                fetchUsers();
            }
        });
        return () => unsubscribe();
    }, [viewListPermission, userProfile.id]);

    // Fetch Stats when a course is selected
    useEffect(() => {
        if (!selectedCourse) return;

        const qStudents = query(collection(db, 'users'), where('courseId', '==', selectedCourse.id), where('role', '==', 'hoc_vien'));
        const unsubscribeStudents = onSnapshot(qStudents, (snapshot) => {
            const studentIds = snapshot.docs.map(d => d.id);
            if (studentIds.length === 0) {
                setDeviceCounts({});
                setStudentLatestResults({});
                return;
            }

            // Listen for active sessions (devices)
            const qSessions = query(collection(db, 'login_sessions'), where('userId', 'in', studentIds.slice(0, 30)), where('status', '==', 'active'));
            const unsubSessions = onSnapshot(qSessions, (snap) => {
                const counts: Record<string, number> = {};
                snap.docs.forEach(doc => {
                    const data = doc.data();
                    counts[data.userId] = (counts[data.userId] || 0) + 1;
                });
                setDeviceCounts(counts);
            }, (error) => {
            });

            // Listen for latest results
            const fetchLatestResults = async () => {
                const resultsMap: Record<string, any> = {};
                const allHistories: any[] = [];

                await Promise.all(studentIds.map(async (uid) => {
                    try {
                        const history = await getExamHistory(uid);
                        if (history && history.length > 0) {
                            allHistories.push(...history.map((h: any) => ({ ...h, uid })));
                            const latest = history[0];
                            resultsMap[uid] = {
                                type: latest.quizTitle || latest.type || 'Bài thi',
                                time: latest.completedAt ? latest.completedAt.toLocaleString('vi-VN') : '---',
                                score: `${latest.score}/${latest.totalQuestions} câu`
                            };
                        } else {
                            resultsMap[uid] = { type: '--', time: '--', score: '--' };
                        }
                    } catch (e) {
                        console.error(`Error fetching history for ${uid}`, e);
                        resultsMap[uid] = { type: 'Lỗi', time: '--', score: '--' };
                    }
                }));
                setStudentLatestResults(resultsMap);
                setAllClassHistories(allHistories);
            };
            
            fetchLatestResults();

            return () => {
                unsubSessions();
            };
        }, (error) => {
            setDeviceCounts({});
            setStudentLatestResults({});
        });

        return () => unsubscribeStudents();
    }, [selectedCourse]);

    // Recalculate Subject Stats when histories, licenses, or selectedCourse changes
    useEffect(() => {
        if (!selectedCourse) {
            setSubjectStats([]);
            return;
        }

        const license = licenses.find((l: any) => l.id === selectedCourse.licenseId || l.code === selectedCourse.licenseId || l.name === selectedCourse.licenseId);
        const subjects = license?.subjects || [];
        
        const statsMap: Record<string, { scores: number[], userMaxScores: Record<string, {max: number, total: number}> }> = {};
        
        allClassHistories.forEach(h => {
            const title = h.quizTitle || h.type || '';
            if (!statsMap[title]) statsMap[title] = { scores: [], userMaxScores: {} };
            
            statsMap[title].scores.push(h.score || 0);

            const uid = h.uid || 'unknown';
            const currentMax = statsMap[title].userMaxScores[uid]?.max || -1;
            if ((h.score || 0) > currentMax) {
                statsMap[title].userMaxScores[uid] = {
                    max: h.score || 0,
                    total: h.totalQuestions || 0
                };
            }
        });

        const isMockTest = (title: string) => title.toLowerCase().includes('thi thử') || title.toLowerCase().includes('tổng hợp');

        const buildStat = (title: string) => {
             const data = statsMap[title] || { scores: [], userMaxScores: {} };
             const scores = data.scores;
             const userIds = Object.keys(data.userMaxScores);
             const studentsCount = userIds.length;
             
             let passedCount = 0;
             userIds.forEach(uid => {
                 const best = data.userMaxScores[uid];
                 if (isMockTest(title)) {
                     if (best.max >= 25) passedCount++;
                 } else {
                     if (best.max === best.total && best.total > 0) passedCount++;
                 }
             });

             if (scores.length === 0) return { name: title, highest: null, lowest: null, average: null, count: 0, studentsCount: 0, passedCount: 0 };
             
             return {
                 name: title,
                 highest: Math.max(...scores),
                 lowest: Math.min(...scores),
                 average: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1),
                 count: scores.length,
                 studentsCount,
                 passedCount
             };
        };

        const historyTitles = Object.keys(statsMap).filter(k => !isMockTest(k));
        const allSubjects = Array.from(new Set([ ...subjects.map((s: any) => s.name), ...historyTitles ]));

        const newSubjectStats = allSubjects.map(name => buildStat(name));
        
        // Add Thi Thu (mock test) stats matching keywords
        const keys = Object.keys(statsMap).filter(k => isMockTest(k));
        let mockScores: number[] = [];
        let mockUserMax: Record<string, {max: number, total: number}> = {};

        keys.forEach(k => {
            mockScores.push(...statsMap[k].scores);
            // Merge user max scores
            Object.keys(statsMap[k].userMaxScores).forEach(uid => {
                 const m1 = statsMap[k].userMaxScores[uid];
                 const m2 = mockUserMax[uid] || { max: -1, total: 0 };
                 if (m1.max > m2.max) mockUserMax[uid] = m1;
            });
        });

        const mockStudentsCount = Object.keys(mockUserMax).length;
        let mockPassedCount = 0;
        Object.keys(mockUserMax).forEach(uid => {
             const best = mockUserMax[uid];
             if (best.max >= 25) mockPassedCount++;
        });

        const finalMockStat = mockScores.length > 0 ? {
             name: 'Thi thử (Tổng hợp)',
             highest: Math.max(...mockScores),
             lowest: Math.min(...mockScores),
             average: (mockScores.reduce((a, b) => a + b, 0) / mockScores.length).toFixed(1),
             count: mockScores.length,
             studentsCount: mockStudentsCount,
             passedCount: mockPassedCount
        } : { name: 'Thi thử (Tổng hợp)', highest: null, lowest: null, average: null, count: 0, studentsCount: 0, passedCount: 0 };

        setSubjectStats([...newSubjectStats, finalMockStat]);
    }, [selectedCourse, licenses, allClassHistories]);


    // --- HANDLERS ---
    const handleSaveCourse = async (data: any) => {
        try {
            if (editingCourse) {
                // Update
                await updateDoc(doc(db, 'courses', editingCourse.id), {
                    ...data,
                    updatedAt: serverTimestamp()
                });
            } else {
                // Create
                await addDoc(collection(db, 'courses'), {
                    ...data,
                    createdAt: serverTimestamp(),
                    createdBy: userProfile.id,
                    headTeacherId: userProfile.role === 'giao_vien' ? userProfile.id : null, 
                    teacherIds: userProfile.role === 'giao_vien' ? [userProfile.id] : [],
                    status: 'active'
                });
            }
            setShowAddEditModal(false);
            setEditingCourse(null);
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Có lỗi xảy ra khi lưu thông tin lớp.");
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
            // Logic to unassign students usually goes on the server side or triggered here
            // For now, keep it simple as the previous implementation
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
        setShowAddEditModal(true);
    };

    const canFinishClass = React.useMemo(() => {
        const perm = roleConfig.courseFinish || 'none';
        if (perm === 'all') return true;
        if (perm === 'none') return false;
        if (!selectedCourse) return false;
        return selectedCourse.createdBy === userProfile.id || 
               selectedCourse.headTeacherId === userProfile.id || 
               (selectedCourse.teacherIds && selectedCourse.teacherIds.includes(userProfile.id));
    }, [roleConfig.courseFinish, selectedCourse, userProfile.id]);

    const canDisableAccounts = React.useMemo(() => {
        const perm = roleConfig.courseDisableAccounts || 'none';
        if (perm === 'all') return true;
        if (perm === 'none') return false;
        if (!selectedCourse) return false;
        return selectedCourse.createdBy === userProfile.id || 
               selectedCourse.headTeacherId === userProfile.id || 
               (selectedCourse.teacherIds && selectedCourse.teacherIds.includes(userProfile.id));
    }, [roleConfig.courseDisableAccounts, selectedCourse, userProfile.id]);

    const handleFinishCourse = async (courseId: string) => {
        try {
            await updateDoc(doc(db, 'courses', courseId), {
                status: 'finished',
                updatedAt: serverTimestamp()
            });

            const q = query(collection(db, 'users'), where('courseId', '==', courseId), where('role', '==', 'hoc_vien'));
            const querySnapshot = await getDocs(q);
            
            const { writeBatch } = await import('firebase/firestore');
            const batch = writeBatch(db);
            querySnapshot.forEach((userDoc) => {
                batch.update(doc(db, 'users', userDoc.id), {
                    status: 'disabled',
                    updatedAt: Date.now()
                });
            });
            await batch.commit();
            
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire('Thành công', 'Đã kết thúc lớp học và vô hiệu hóa tài khoản tất cả học viên.', 'success');
            });
        } catch (error) {
            console.error("Error finishing course:", error);
            alert("Có lỗi xảy ra khi kết thúc lớp.");
        }
    };

    const handleReopenCourse = async (courseId: string) => {
        try {
            await updateDoc(doc(db, 'courses', courseId), {
                status: 'active',
                updatedAt: serverTimestamp()
            });
            
            import('sweetalert2').then(({ default: Swal }) => {
                Swal.fire('Thành công', 'Đã mở lại lớp học. Vui lòng kích hoạt thủ công tài khoản học viên nếu cần thiết.', 'success');
            });
        } catch (error) {
            console.error("Error reopening course:", error);
            alert("Có lỗi xảy ra khi mở lại lớp.");
        }
    };

    // --- RENDER ---
    if (!selectedCourse) {
        return (
            <>
                <ClassList 
                    courses={courses}
                    loadingCourses={loadingCourses}
                    courseSearchTerm={courseSearchTerm}
                    setCourseSearchTerm={setCourseSearchTerm}
                    onSelectCourse={(course) => navigate(`/ontap/class-manager/${course.id}`)}
                    onEditCourse={openEditCourseModal}
                    onDeleteCourse={handleDeleteCourse}
                    onAddCourse={() => { setEditingCourse(null); setShowAddEditModal(true); }}
                    onBack={onBack}
                    userProfile={userProfile}
                    headTeacherNames={headTeacherNames}
                    creatorProfiles={creatorProfiles}
                    licenses={licenses}
                    canCreateClass={canCreateClass}
                    classStats={classStats}
                />

                {showAddEditModal && (
                    <AddEditCourseModal 
                        course={editingCourse}
                        licenses={licenses}
                        onClose={() => setShowAddEditModal(false)}
                        onSave={handleSaveCourse}
                    />
                )}
            </>
        );
    }

    // --- DETAIL VIEW ---
    return (
        <ClassDetailClient 
            course={selectedCourse} 
            onBack={() => navigate('/ontap/class-manager')} 
            userProfile={userProfile} 
            studentLatestResults={studentLatestResults}
            deviceCounts={deviceCounts}
            subjectStats={subjectStats}
            creatorProfiles={creatorProfiles}
            canAssignMembers={canAssignMembers}
            canFinishClass={canFinishClass}
            canDisableAccounts={canDisableAccounts}
            onFinishCourse={handleFinishCourse}
            onReopenCourse={handleReopenCourse}
        />
    );
};

export default ClassManagementScreen;
