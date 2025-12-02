'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc, documentId, getDocs, orderBy, Timestamp } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import styles from './ClassDetailView.module.css'
import { FaArrowLeft, FaEdit, FaUserTie, FaUsers } from 'react-icons/fa'
import UserName from './UserName' // 💖 IMPORT USER NAME 💖

interface Course {
    id: string
    name: string
    description?: string
    createdAt: any
    teacherIds?: string[]
    headTeacherId?: string // Giáo viên chủ nhiệm
}

interface UserData {
    uid: string
    fullName: string
    email: string
    role: string
    class?: string
    phoneNumber?: string
    birthDate?: string
    address?: string
    courseId?: string
}

interface HistoryItem {
    id: string;
    type: 'Ôn tập' | 'Thi thử' | 'Thi Trực Tuyến';
    title: string;
    score: number;
    total: number;
    date: Timestamp;
}

interface ClassDetailViewProps {
    course: Course
    onBack: () => void
    onEdit: () => void
}

export default function ClassDetailView({ course, onBack, onEdit }: ClassDetailViewProps) {
    const { user } = useAuth()
    const [students, setStudents] = useState<UserData[]>([])
    const [teachers, setTeachers] = useState<UserData[]>([])
    const [headTeacher, setHeadTeacher] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    // History Modal State
    const [viewingHistoryStudent, setViewingHistoryStudent] = useState<UserData | null>(null)
    const [studentHistory, setStudentHistory] = useState<HistoryItem[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)

    // Permissions
    const canManage = user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role)

    // 1. Fetch Students in Course
    useEffect(() => {
        if (!course.id) return
        const q = query(collection(db, 'users'), where('courseId', '==', course.id), where('role', '==', 'hoc_vien'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserData[]
            setStudents(list)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [course.id])

    // 2. Fetch Teachers (assigned to course)
    useEffect(() => {
        if (!course.teacherIds || course.teacherIds.length === 0) {
            setTeachers([])
            return
        }
        // Firestore 'in' query supports up to 10 items. If > 10, we might need multiple queries or client-side filter.
        // Assuming < 10 teachers per course for now.
        // 💖 FIX: Query by documentId() instead of 'uid' field 💖
        const q = query(collection(db, 'users'), where(documentId(), 'in', course.teacherIds))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserData[]
            setTeachers(list)
        })
        return () => unsubscribe()
    }, [course.teacherIds])

    // 3. Fetch/Resolve Head Teacher
    useEffect(() => {
        const resolveHeadTeacher = async () => {
            if (course.headTeacherId) {
                // If explicitly set
                const docRef = doc(db, 'users', course.headTeacherId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setHeadTeacher({ uid: docSnap.id, ...docSnap.data() } as UserData)
                }
            } else if (teachers.length > 0) {
                // Default to first teacher in list if not set
                setHeadTeacher(teachers[0])
            } else {
                setHeadTeacher(null)
            }
        }
        resolveHeadTeacher()
    }, [course.headTeacherId, teachers])

    // 4. Fetch Student History
    const handleViewHistory = async (student: UserData) => {
        setViewingHistoryStudent(student)
        setLoadingHistory(true)
        setStudentHistory([])

        try {
            const q = query(collection(db, 'exam_results'), where('studentId', '==', student.uid))
            const snapshot = await getDocs(q)
            const list: HistoryItem[] = []

            snapshot.forEach(doc => {
                const data = doc.data()
                let type: HistoryItem['type'] = 'Ôn tập'
                let title = 'Bài tập'

                if (data.roomId) {
                    type = 'Thi Trực Tuyến'
                    title = `Phòng thi ${data.roomId}`
                } else if (data.quizId === 'exam-quiz' || data.quizId === 'thithu2') {
                    type = 'Thi thử'
                    title = data.quizTitle || 'Đề thi thử'
                } else {
                    title = data.quizTitle || 'Bài ôn tập'
                }

                list.push({
                    id: doc.id,
                    type,
                    title,
                    score: data.score,
                    total: data.totalQuestions,
                    date: data.submitted_at || data.completedAt || Timestamp.now()
                })
            })

            // Sort by date desc
            list.sort((a, b) => b.date.seconds - a.date.seconds)
            setStudentHistory(list)
        } catch (err) {
            console.error("Error fetching history:", err)
            alert("Lỗi tải lịch sử: " + err)
        } finally {
            setLoadingHistory(false)
        }
    }



    return (
        <div className={styles.container}>
            {/* HEADER */}
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>{course.name}</h2>
                    <p className={styles.description}>{course.description || 'Chưa có mô tả'}</p>
                </div>
                <div className={styles.actions}>
                    <button onClick={onBack} className={styles.buttonBack}>
                        <FaArrowLeft /> Quay lại
                    </button>
                    {canManage && (
                        <button onClick={onEdit} className={styles.buttonEdit}>
                            <FaEdit /> Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            {/* INFO SECTION */}
            <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                    <FaUserTie /> Thông tin Lớp học
                </h3>
                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Danh sách Giáo viên</span>
                        <div style={{ marginTop: '8px' }}>
                            {teachers.length > 0 ? teachers.map(t => (
                                <div key={t.uid} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                    <UserName name={t.fullName} role={t.role} />
                                    {course.headTeacherId === t.uid && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: '#52c41a',
                                            backgroundColor: '#f6ffed',
                                            border: '1px solid #b7eb8f',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontWeight: 500
                                        }}>
                                            Chủ nhiệm
                                        </span>
                                    )}
                                </div>
                            )) : (
                                <span className={styles.infoValue}>Chưa có giáo viên</span>
                            )}
                        </div>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Sĩ số</span>
                        <span className={styles.infoValue}>{students.length} học viên</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Ngày tạo</span>
                        <span className={styles.infoValue}>
                            {course.createdAt ? new Date(course.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '---'}
                        </span>
                    </div>
                </div>
            </div>

            {/* STUDENT LIST */}
            <div className={styles.studentSection}>
                <h3 className={styles.sectionTitle}>
                    <FaUsers /> Danh sách Học viên
                </h3>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Họ và tên</th>
                                <th>Năm sinh</th>
                                <th>Địa chỉ</th>
                                <th>Điểm cao nhất</th>
                                <th>Điểm gần nhất</th>
                                <th>Điểm thi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className={styles.emptyState}>Đang tải danh sách...</td></tr>
                            ) : students.length > 0 ? (
                                students.map((s, index) => (
                                    <tr key={s.uid}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div
                                                onClick={() => handleViewHistory(s)}
                                                style={{ cursor: 'pointer', color: '#1890ff', fontWeight: 500 }}
                                            >
                                                <UserName name={s.fullName} role={s.role} courseId={course.id} />
                                            </div>
                                        </td>
                                        <td>{s.birthDate ? s.birthDate.split('/').pop() : '---'}</td>
                                        <td>{s.address || '---'}</td>
                                        <td><span className={styles.scorePlaceholder}>---</span></td>
                                        <td><span className={styles.scorePlaceholder}>---</span></td>
                                        <td><span className={styles.scorePlaceholder}>---</span></td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={7} className={styles.emptyState}>Lớp chưa có học viên nào.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* HISTORY MODAL */}
            {viewingHistoryStudent && (
                <div className={styles.modalOverlay} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className={styles.modalContent} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Lịch sử học tập: {viewingHistoryStudent.fullName}</h2>
                            <button
                                onClick={() => setViewingHistoryStudent(null)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                            >
                                &times;
                            </button>
                        </div>

                        {loadingHistory ? (
                            <p>Đang tải dữ liệu...</p>
                        ) : (
                            <div className={styles.tableContainer}>
                                <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Loại</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Bài thi</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Điểm số</th>
                                            <th style={{ padding: '12px', textAlign: 'left' }}>Ngày làm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentHistory.length > 0 ? studentHistory.map(item => (
                                            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.8rem',
                                                        backgroundColor: item.type === 'Thi Trực Tuyến' ? '#e6f7ff' : item.type === 'Thi thử' ? '#fff7e6' : '#f6ffed',
                                                        color: item.type === 'Thi Trực Tuyến' ? '#1890ff' : item.type === 'Thi thử' ? '#fa8c16' : '#52c41a',
                                                        border: `1px solid ${item.type === 'Thi Trực Tuyến' ? '#91d5ff' : item.type === 'Thi thử' ? '#ffd591' : '#b7eb8f'}`
                                                    }}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px' }}>{item.title}</td>
                                                <td style={{ padding: '12px', fontWeight: 600 }}>
                                                    {item.score} / {item.total}
                                                </td>
                                                <td style={{ padding: '12px', color: '#8c8c8c' }}>
                                                    {new Date(item.date.seconds * 1000).toLocaleDateString('vi-VN')} {new Date(item.date.seconds * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#8c8c8c' }}>
                                                    Học viên chưa có lịch sử làm bài.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
