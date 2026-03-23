import React, { useState, useEffect } from 'react';
import { db } from '../services/firebaseClient';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { Course, UserProfile } from '../types';
import ClassDetailClient from './ClassDetail/ClassDetailClient';
import ClassList from './ClassDetail/ClassList';
import { AddEditCourseModal } from './ClassDetail/Modals';
import { getExamHistory } from '../services/historyService';

interface ClassManagementScreenProps {
    userProfile: UserProfile;
    onBack: () => void;
}

const getRoleRank = (role: string) => {
    switch (role) {
        case 'admin': return 4;
        case 'lanh_dao': return 3;
        case 'quan_ly': return 2;
        case 'giao_vien': return 1;
        default: return 0;
    }
};

const ClassManagementScreen: React.FC<ClassManagementScreenProps> = ({ userProfile, onBack }) => {
    // --- STATE ---
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loadingCourses, setLoadingCourses] = useState(true);
    const [headTeacherNames, setHeadTeacherNames] = useState<Record<string, string>>({});

    const [studentLatestResults, setStudentLatestResults] = useState<Record<string, any>>({});
    const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({});

    // Course Search State
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const [licenses, setLicenses] = useState<any[]>([]);

    // Modal States
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const canCreateClass = getRoleRank(userProfile.role) >= 2;

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
            const coursesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Course[];
            setCourses(coursesData);
            setLoadingCourses(false);

            // Fetch head teacher names
            const headTeacherIds = [...new Set(coursesData.map(c => c.headTeacherId).filter(Boolean))] as string[];
            if (headTeacherIds.length > 0) {
                const teachersQ = query(collection(db, 'users'), where('role', '==', 'giao_vien'));
                onSnapshot(teachersQ, (teacherSnap) => {
                    const names: Record<string, string> = {};
                    teacherSnap.forEach(tDoc => {
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
    }, []);

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
            });

            // Listen for latest results
            const fetchLatestResults = async () => {
                const resultsMap: Record<string, any> = {};
                await Promise.all(studentIds.map(async (uid) => {
                    try {
                        const history = await getExamHistory(uid);
                        if (history && history.length > 0) {
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
            };
            
            fetchLatestResults();

            return () => {
                unsubSessions();
            };
        });

        return () => unsubscribeStudents();
    }, [selectedCourse]);


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
        setEditingCourse(course);
        setShowAddEditModal(true);
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
                    onSelectCourse={setSelectedCourse}
                    onEditCourse={openEditCourseModal}
                    onDeleteCourse={handleDeleteCourse}
                    onAddCourse={() => { setEditingCourse(null); setShowAddEditModal(true); }}
                    onBack={onBack}
                    userProfile={userProfile}
                    headTeacherNames={headTeacherNames}
                    licenses={licenses}
                    canCreateClass={canCreateClass}
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
            onBack={() => setSelectedCourse(null)} 
            userProfile={userProfile} 
            studentLatestResults={studentLatestResults}
            deviceCounts={deviceCounts}
        />
    );
};

export default ClassManagementScreen;
