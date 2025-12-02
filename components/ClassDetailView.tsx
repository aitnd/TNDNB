'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore'
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
        const q = query(collection(db, 'users'), where('uid', 'in', course.teacherIds))
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

    // Handle Head Teacher Change
    const handleHeadTeacherChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newHeadId = e.target.value
        try {
            await updateDoc(doc(db, 'courses', course.id), {
                headTeacherId: newHeadId
            })
            // Local state update will happen via parent's realtime listener -> prop update
        } catch (err: any) {
            alert('Lỗi cập nhật GVCN: ' + err.message)
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
                        <span className={styles.infoLabel}>Giáo viên Chủ nhiệm</span>
                        {canManage ? (
                            <select
                                className={styles.select}
                                value={course.headTeacherId || (teachers.length > 0 ? teachers[0].uid : '')}
                                onChange={handleHeadTeacherChange}
                            >
                                {teachers.length > 0 ? (
                                    teachers.map(t => (
                                        <option key={t.uid} value={t.uid}>{t.fullName}</option>
                                    ))
                                ) : (
                                    <option value="">Chưa có giáo viên</option>
                                )}
                            </select>
                        ) : (
                            <span className={styles.infoValue}>
                                {headTeacher ? <UserName name={headTeacher.fullName} role={headTeacher.role} /> : 'Chưa cập nhật'}
                            </span>
                        )}
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
                                        <td><UserName name={s.fullName} role={s.role} courseId={course.id} /></td>
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
        </div>
    )
}
