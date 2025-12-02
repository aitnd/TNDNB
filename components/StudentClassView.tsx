'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, query, where, onSnapshot, doc, getDoc, documentId } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import styles from './StudentClassView.module.css'
import { FaUserTie, FaUsers, FaIdCard } from 'react-icons/fa'
import UserName from './UserName' // 💖 IMPORT USER NAME 💖

interface Course {
    id: string
    name: string
    description?: string
    headTeacherId?: string
    teacherIds?: string[]
}

interface UserData {
    uid: string
    fullName: string
    email: string
    role: string
    birthDate?: string
    address?: string
    phoneNumber?: string
}

export default function StudentClassView() {
    const { user } = useAuth()
    const [course, setCourse] = useState<Course | null>(null)
    const [headTeacher, setHeadTeacher] = useState<UserData | null>(null)
    const [classmates, setClassmates] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)

    // 1. Fetch Course Info
    useEffect(() => {
        if (!user?.courseId) {
            setLoading(false)
            return
        }

        const fetchCourse = async () => {
            try {
                const docRef = doc(db, 'courses', user.courseId!)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() } as Course)
                }
            } catch (err) {
                console.error("Error fetching course:", err)
            }
        }
        fetchCourse()
    }, [user?.courseId])

    // 2. Fetch Teachers (assigned to course)
    const [teachers, setTeachers] = useState<UserData[]>([])
    useEffect(() => {
        if (!course?.teacherIds || course.teacherIds.length === 0) {
            setTeachers([])
            return
        }
        // 💖 FIX: Query by documentId() instead of 'uid' field 💖
        const q = query(collection(db, 'users'), where(documentId(), 'in', course.teacherIds))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserData[]
            setTeachers(list)
        })
        return () => unsubscribe()
    }, [course?.teacherIds])

    // Resolve Head Teacher from teachers list
    useEffect(() => {
        if (course?.headTeacherId) {
            const found = teachers.find(t => t.uid === course.headTeacherId)
            if (found) setHeadTeacher(found)
        } else if (teachers.length > 0) {
            setHeadTeacher(teachers[0])
        }
    }, [course?.headTeacherId, teachers])

    // 3. Fetch Classmates
    useEffect(() => {
        if (!user?.courseId) return

        const q = query(
            collection(db, 'users'),
            where('courseId', '==', user.courseId),
            where('role', '==', 'hoc_vien')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs
                .map(doc => ({ uid: doc.id, ...doc.data() } as UserData))
                .filter(u => u.uid !== user.uid) // Exclude self
            setClassmates(list)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [user?.courseId, user?.uid])

    if (loading) return <div className={styles.container}>Đang tải thông tin lớp học...</div>

    if (!user?.courseId || !course) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyState}>
                    <h3>Bạn chưa tham gia lớp học nào.</h3>
                    <p>Vui lòng liên hệ giáo viên để được thêm vào lớp.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {/* Header Card */}
            <div className={styles.headerCard}>
                <h1 className={styles.courseName}>{course.name}</h1>
                <p className={styles.courseDesc}>{course.description || 'Chưa có mô tả'}</p>
            </div>

            <div className={styles.grid}>
                {/* Left Column: My Info & Head Teacher */}
                <div className={styles.leftCol}>
                    {/* Head Teacher */}
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <FaUserTie style={{ color: '#52c41a' }} />
                            Giáo viên ({teachers.length})
                        </h3>
                        {teachers.length > 0 ? (
                            <div className={styles.teacherList}>
                                {teachers.map(t => (
                                    <div key={t.uid} className={styles.headTeacher} style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>
                                        <div className={styles.avatar}>
                                            {t.fullName ? t.fullName.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <div className={styles.teacherInfo}>
                                            <h4>
                                                {t.fullName}
                                                {/* 💖 GHI CHÚ CHỦ NHIỆM 💖 */}
                                                {course.headTeacherId === t.uid && (
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        backgroundColor: '#f6ffed',
                                                        color: '#52c41a',
                                                        border: '1px solid #b7eb8f',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        marginLeft: '8px',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        Chủ nhiệm
                                                    </span>
                                                )}
                                            </h4>
                                            <p>{t.email}</p>
                                            <p>{t.phoneNumber}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#8c8c8c', fontStyle: 'italic' }}>Chưa cập nhật Giáo viên</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Classmates */}
                <div className={styles.rightCol}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>
                            <FaUsers style={{ color: '#722ed1' }} />
                            Danh sách Bạn học ({classmates.length})
                        </h3>

                        <div className={styles.classmateList}>
                            {classmates.length > 0 ? classmates.map(mate => (
                                <div key={mate.uid} className={styles.classmateItem}>
                                    <div className={styles.miniAvatar}>
                                        {mate.fullName ? mate.fullName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className={styles.classmateName}>{mate.fullName}</div>
                                    <div className={styles.classmateDetail}>
                                        {mate.birthDate ? mate.birthDate.split('/').pop() : '---'}
                                    </div>
                                    <div className={styles.classmateDetail}>
                                        {mate.address || '---'}
                                    </div>
                                </div>
                            )) : (
                                <div className={styles.emptyState}>
                                    Chưa có bạn học nào khác trong lớp này.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
