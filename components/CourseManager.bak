'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import styles from './CourseManager.module.css'
import ClassDetailView from './ClassDetailView'

interface Course {
    id: string
    name: string
    description?: string
    createdAt: any
    teacherIds?: string[] // Danh sách ID giáo viên phụ trách
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
    courseId?: string
    courseName?: string
    cccd?: string
    cccdDate?: string
    cccdPlace?: string
    address?: string
    createdAt?: any
}

export default function CourseManager() {
    const { user } = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [newCourseName, setNewCourseName] = useState('')
    const [newCourseDesc, setNewCourseDesc] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Search & Filter
    const [searchTerm, setSearchTerm] = useState('')

    // Edit Modal State
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [editName, setEditName] = useState('')
    const [editDesc, setEditDesc] = useState('')
    const [editHeadTeacherId, setEditHeadTeacherId] = useState('')
    const [activeTab, setActiveTab] = useState<'info' | 'students' | 'teachers'>('info')

    // Student Management State
    const [allStudents, setAllStudents] = useState<UserData[]>([])
    const [studentSearchTerm, setStudentSearchTerm] = useState('')
    const [activeStudentTab, setActiveStudentTab] = useState<'in_course' | 'available'>('in_course')
    const [viewingStudent, setViewingStudent] = useState<UserData | null>(null)

    // Teacher Management State
    const [allTeachers, setAllTeachers] = useState<UserData[]>([])
    const [teacherSearchTerm, setTeacherSearchTerm] = useState('')
    const [activeTeacherTab, setActiveTeacherTab] = useState<'in_course' | 'available'>('in_course')

    // 💖 STATE CHO VIEW CHI TIẾT 💖
    const [viewingCourse, setViewingCourse] = useState<Course | null>(null)

    // Check permissions
    const isTeacher = user?.role === 'giao_vien';
    const canCreateDelete = user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role);

    // 1. Fetch Courses
    useEffect(() => {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let courseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Course[]

            // Filter for teachers: only see assigned courses
            if (isTeacher && user?.uid) {
                courseData = courseData.filter(c => c.teacherIds?.includes(user.uid));
            }

            setCourses(courseData)

            // Update viewingCourse if it exists (to reflect realtime changes)
            if (viewingCourse) {
                const updated = courseData.find(c => c.id === viewingCourse.id)
                if (updated) setViewingCourse(updated)
            }
        })
        return () => unsubscribe()
    }, [user, isTeacher, viewingCourse?.id])

    // 2. Fetch Students (When editing)
    useEffect(() => {
        if (editingCourse) {
            const q = query(collection(db, 'users'), where('role', '==', 'hoc_vien'))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const studentsData = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as UserData[]
                setAllStudents(studentsData)
            })
            return () => unsubscribe()
        }
    }, [editingCourse])

    // 3. Fetch Teachers (When editing)
    useEffect(() => {
        if (editingCourse) {
            // 💖 LẤY TẤT CẢ CÁC ROLE CÓ THỂ LÀ GIÁO VIÊN 💖
            const q = query(collection(db, 'users'), where('role', 'in', ['giao_vien', 'quan_ly', 'lanh_dao', 'admin']))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const teachersData = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as UserData[]
                setAllTeachers(teachersData)
            })
            return () => unsubscribe()
        }
    }, [editingCourse])

    // --- HANDLERS ---

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCourseName.trim()) return

        setLoading(true)
        setError(null)
        try {
            await addDoc(collection(db, 'courses'), {
                name: newCourseName,
                description: newCourseDesc,
                createdBy: user?.uid,
                createdAt: serverTimestamp(),
                teacherIds: [user?.uid] // Auto-assign creator
            })
            setNewCourseName('')
            setNewCourseDesc('')
            alert('Đã tạo khóa học thành công!')
        } catch (err: any) {
            console.error(err)
            setError('Lỗi khi tạo khóa học: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCourse = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return
        try {
            await deleteDoc(doc(db, 'courses', id))
            if (viewingCourse?.id === id) setViewingCourse(null) // Exit view if deleted
        } catch (err: any) {
            alert('Lỗi khi xóa: ' + err.message)
        }
    }

    const handleUpdateCourse = async () => {
        if (!editingCourse) return
        try {
            await updateDoc(doc(db, 'courses', editingCourse.id), {
                name: editName,
                description: editDesc,
                headTeacherId: editHeadTeacherId
            })
            alert('Cập nhật thông tin khóa học thành công!')
        } catch (err: any) {
            alert('Lỗi cập nhật: ' + err.message)
        }
    }

    const handleStudentCourseChange = async (studentId: string, action: 'add' | 'remove') => {
        if (!editingCourse) return
        try {
            const studentRef = doc(db, 'users', studentId)
            if (action === 'add') {
                await updateDoc(studentRef, {
                    courseId: editingCourse.id,
                    courseName: editingCourse.name,
                    isVerified: true
                })
            } else {
                await updateDoc(studentRef, {
                    courseId: null,
                    courseName: null,
                    isVerified: false
                })
            }
        } catch (err: any) {
            alert('Lỗi cập nhật học viên: ' + err.message)
        }
    }

    // 💖 TEACHER MANAGEMENT HANDLER 💖
    const handleTeacherCourseChange = async (teacherId: string, action: 'add' | 'remove') => {
        if (!editingCourse) return
        try {
            const courseRef = doc(db, 'courses', editingCourse.id)
            if (action === 'add') {
                await updateDoc(courseRef, {
                    teacherIds: arrayUnion(teacherId)
                })
            } else {
                await updateDoc(courseRef, {
                    teacherIds: arrayRemove(teacherId)
                })
            }
        } catch (err: any) {
            alert('Lỗi cập nhật giáo viên: ' + err.message)
        }
    }

    // --- FILTERING ---

    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Students
    const filteredStudents = allStudents.filter(s =>
        s.fullName?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.class?.toLowerCase().includes(studentSearchTerm.toLowerCase())
    )
    const studentsInCourse = filteredStudents.filter(s => s.courseId === editingCourse?.id)
    const studentsAvailable = filteredStudents.filter(s => s.courseId !== editingCourse?.id)

    // Teachers
    const filteredTeachers = allTeachers.filter(t =>
        t.fullName?.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
        t.email?.toLowerCase().includes(teacherSearchTerm.toLowerCase())
    )
    const teachersInCourse = filteredTeachers.filter(t => editingCourse?.teacherIds?.includes(t.uid))
    const teachersAvailable = filteredTeachers.filter(t => !editingCourse?.teacherIds?.includes(t.uid))

    // --- RENDER HELPERS ---

    const renderStudentTable = (students: UserData[], type: 'in_course' | 'available') => (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Lớp</th>
                        <th>SĐT</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? students.map(s => (
                        <tr key={s.uid}>
                            <td>
                                {s.fullName}
                                {type === 'available' && s.courseName && (
                                    <div style={{ fontSize: '0.75rem', color: '#faad14' }}>Đang học: {s.courseName}</div>
                                )}
                            </td>
                            <td>{s.email}</td>
                            <td>{s.class || '---'}</td>
                            <td>{s.phoneNumber || '---'}</td>
                            <td>
                                <button
                                    onClick={() => setViewingStudent(s)}
                                    className={`${styles.actionButton} ${styles.btnDetail}`}
                                >
                                    Chi tiết
                                </button>
                                {type === 'in_course' ? (
                                    <button
                                        onClick={() => handleStudentCourseChange(s.uid, 'remove')}
                                        className={`${styles.actionButton} ${styles.btnRemove}`}
                                    >
                                        Xóa khỏi khóa
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStudentCourseChange(s.uid, 'add')}
                                        className={`${styles.actionButton} ${styles.btnAdd}`}
                                    >
                                        Thêm vào khóa
                                    </button>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className={styles.emptyState}>
                                {type === 'in_course' ? 'Chưa có học viên nào.' : 'Không tìm thấy học viên nào khác.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    const renderTeacherTable = (teachers: UserData[], type: 'in_course' | 'available') => (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {teachers.length > 0 ? teachers.map(t => (
                        <tr key={t.uid}>
                            <td>{t.fullName}</td>
                            <td>{t.email}</td>
                            <td>{t.phoneNumber || '---'}</td>
                            <td>
                                {type === 'in_course' ? (
                                    <button
                                        onClick={() => handleTeacherCourseChange(t.uid, 'remove')}
                                        className={`${styles.actionButton} ${styles.btnRemove}`}
                                    >
                                        Xóa khỏi khóa
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleTeacherCourseChange(t.uid, 'add')}
                                        className={`${styles.actionButton} ${styles.btnAdd}`}
                                    >
                                        Thêm giáo viên
                                    </button>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className={styles.emptyState}>
                                {type === 'in_course' ? 'Chưa có giáo viên nào.' : 'Không tìm thấy giáo viên nào khác.'}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )

    return (
        <>
            {/* 💖 RENDER VIEW: DETAIL OR LIST 💖 */}
            {viewingCourse ? (
                <ClassDetailView
                    course={viewingCourse}
                    onBack={() => setViewingCourse(null)}
                    onEdit={() => {
                        setEditingCourse(viewingCourse)
                        setEditName(viewingCourse.name)
                        setEditDesc(viewingCourse.description || '')
                        setEditHeadTeacherId(viewingCourse.headTeacherId || '')
                        setActiveTab('info')
                    }}
                />
            ) : (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Quản lý Khóa học (Lớp thi)</h2>
                    </div>

                    {/* CREATE FORM */}
                    {canCreateDelete && (
                        <form onSubmit={handleAddCourse} className={styles.createForm}>
                            <input
                                type="text"
                                placeholder="Tên khóa học (VD: TM-K1)"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                required
                                className={styles.input}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="text"
                                placeholder="Mô tả (Tuỳ chọn)"
                                value={newCourseDesc}
                                onChange={(e) => setNewCourseDesc(e.target.value)}
                                className={styles.input}
                                style={{ flex: 2 }}
                            />
                            <button type="submit" disabled={loading} className={styles.buttonPrimary}>
                                {loading ? 'Đang tạo...' : 'Tạo Khóa học'}
                            </button>
                        </form>
                    )}

                    {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm khóa học..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchBar}
                    />

                    {/* COURSE LIST */}
                    <div className={styles.grid}>
                        {filteredCourses.map(course => (
                            <div key={course.id} className={styles.card}>
                                <h3 className={styles.cardTitle}>{course.name}</h3>
                                <p className={styles.cardDesc}>{course.description || 'Không có mô tả'}</p>

                                <div className={styles.cardActions}>
                                    <button
                                        onClick={() => setViewingCourse(course)}
                                        className={styles.buttonEdit}
                                    >
                                        {canCreateDelete ? 'Chi tiết / Quản lý' : 'Xem chi tiết'}
                                    </button>

                                    {canCreateDelete && (
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            className={styles.buttonDelete}
                                        >
                                            Xóa
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredCourses.length === 0 && <p style={{ color: '#8c8c8c' }}>Không tìm thấy khóa học nào.</p>}
                    </div>
                </div>
            )}

            {/* EDIT MODAL - Rendered regardless of view */}
            {editingCourse && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Chỉnh sửa: {editingCourse.name}</h2>
                            <button onClick={() => setEditingCourse(null)} className={styles.closeButton}>&times;</button>
                        </div>

                        <div className={styles.modalBody}>
                            {/* TABS */}
                            <div className={styles.tabContainer}>
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
                                >
                                    Thông tin cơ bản
                                </button>
                                <button
                                    onClick={() => setActiveTab('students')}
                                    className={`${styles.tabButton} ${activeTab === 'students' ? styles.activeTab : ''}`}
                                >
                                    Quản lý Học viên
                                </button>
                                <button
                                    onClick={() => setActiveTab('teachers')}
                                    className={`${styles.tabButton} ${activeTab === 'teachers' ? styles.activeTab : ''}`}
                                >
                                    Quản lý Giáo viên
                                </button>
                            </div>

                            {/* TAB CONTENT: INFO */}
                            {activeTab === 'info' && (
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tên khóa học</label>
                                        <input
                                            value={editName}
                                            onChange={e => setEditName(e.target.value)}
                                            className={styles.input}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ flex: 2 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Mô tả</label>
                                        <input
                                            value={editDesc}
                                            onChange={e => setEditDesc(e.target.value)}
                                            className={styles.input}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Giáo viên Chủ nhiệm</label>
                                        <select
                                            value={editHeadTeacherId}
                                            onChange={e => setEditHeadTeacherId(e.target.value)}
                                            className={styles.input}
                                            style={{ width: '100%' }}
                                        >
                                            <option value="">-- Chọn GVCN --</option>
                                            {allTeachers.map(t => (
                                                <option key={t.uid} value={t.uid}>{t.fullName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ paddingTop: '28px' }}>
                                        <button onClick={handleUpdateCourse} className={styles.buttonPrimary}>
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TAB CONTENT: STUDENTS */}
                            {activeTab === 'students' && (
                                <div>
                                    <input
                                        placeholder="Tìm kiếm học viên..."
                                        value={studentSearchTerm}
                                        onChange={e => setStudentSearchTerm(e.target.value)}
                                        className={styles.searchBar}
                                        style={{ marginBottom: '16px', padding: '8px 12px' }}
                                    />

                                    <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => setActiveStudentTab('in_course')}
                                            style={{
                                                fontWeight: activeStudentTab === 'in_course' ? 600 : 400,
                                                color: activeStudentTab === 'in_course' ? '#1890ff' : '#595959',
                                                background: 'none', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            Trong khóa ({studentsInCourse.length})
                                        </button>
                                        <span style={{ color: '#d9d9d9' }}>|</span>
                                        <button
                                            onClick={() => setActiveStudentTab('available')}
                                            style={{
                                                fontWeight: activeStudentTab === 'available' ? 600 : 400,
                                                color: activeStudentTab === 'available' ? '#52c41a' : '#595959',
                                                background: 'none', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            Thêm học viên
                                        </button>
                                    </div>

                                    {activeStudentTab === 'in_course'
                                        ? renderStudentTable(studentsInCourse, 'in_course')
                                        : renderStudentTable(studentsAvailable, 'available')
                                    }
                                </div>
                            )}

                            {/* TAB CONTENT: TEACHERS */}
                            {activeTab === 'teachers' && (
                                <div>
                                    <input
                                        placeholder="Tìm kiếm giáo viên..."
                                        value={teacherSearchTerm}
                                        onChange={e => setTeacherSearchTerm(e.target.value)}
                                        className={styles.searchBar}
                                        style={{ marginBottom: '16px', padding: '8px 12px' }}
                                    />

                                    <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={() => setActiveTeacherTab('in_course')}
                                            style={{
                                                fontWeight: activeTeacherTab === 'in_course' ? 600 : 400,
                                                color: activeTeacherTab === 'in_course' ? '#1890ff' : '#595959',
                                                background: 'none', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            Giáo viên phụ trách ({teachersInCourse.length})
                                        </button>
                                        <span style={{ color: '#d9d9d9' }}>|</span>
                                        <button
                                            onClick={() => setActiveTeacherTab('available')}
                                            style={{
                                                fontWeight: activeTeacherTab === 'available' ? 600 : 400,
                                                color: activeTeacherTab === 'available' ? '#52c41a' : '#595959',
                                                background: 'none', border: 'none', cursor: 'pointer'
                                            }}
                                        >
                                            Thêm giáo viên
                                        </button>
                                    </div>

                                    {activeTeacherTab === 'in_course'
                                        ? renderTeacherTable(teachersInCourse, 'in_course')
                                        : renderTeacherTable(teachersAvailable, 'available')
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div >
            )
            }

            {/* STUDENT DETAIL MODAL */}
            {
                viewingStudent && (
                    <div className={styles.modalOverlay} style={{ zIndex: 1100 }}>
                        <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Hồ sơ Học viên</h2>
                                <button onClick={() => setViewingStudent(null)} className={styles.closeButton}>&times;</button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.infoGrid}>
                                    <div>
                                        <span className={styles.infoLabel}>Họ và tên</span>
                                        <div className={styles.infoValue}>{viewingStudent.fullName}</div>
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Email</span>
                                        <div className={styles.infoValue}>{viewingStudent.email}</div>
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Số điện thoại</span>
                                        <div className={styles.infoValue}>{viewingStudent.phoneNumber || '---'}</div>
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Ngày sinh</span>
                                        <div className={styles.infoValue}>{viewingStudent.birthDate || '---'}</div>
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Lớp</span>
                                        <div className={styles.infoValue}>{viewingStudent.class || '---'}</div>
                                    </div>
                                    <div>
                                        <span className={styles.infoLabel}>Khóa học</span>
                                        <div className={styles.infoValue} style={{ color: viewingStudent.courseName ? '#1890ff' : 'inherit' }}>
                                            {viewingStudent.courseName || 'Chưa vào khóa'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Thông tin CCCD & Địa chỉ</h3>
                                    <div className={styles.infoGrid}>
                                        <div>
                                            <span className={styles.infoLabel}>Số CCCD</span>
                                            <div className={styles.infoValue}>{viewingStudent.cccd || '---'}</div>
                                        </div>
                                        <div>
                                            <span className={styles.infoLabel}>Ngày cấp</span>
                                            <div className={styles.infoValue}>{viewingStudent.cccdDate || '---'}</div>
                                        </div>
                                        <div>
                                            <span className={styles.infoLabel}>Nơi cấp</span>
                                            <div className={styles.infoValue}>{viewingStudent.cccdPlace || '---'}</div>
                                        </div>
                                        <div>
                                            <span className={styles.infoLabel}>Địa chỉ</span>
                                            <div className={styles.infoValue}>{viewingStudent.address || '---'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
