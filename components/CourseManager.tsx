

'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, where, getDocs } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

interface Course {
    id: string
    name: string
    description?: string
    createdAt: any
    teacherIds?: string[]
}

interface Student {
    uid: string
    fullName: string
    email: string
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

    // 💖 STATE MỚI 💖
    const [searchTerm, setSearchTerm] = useState('')
    const [editingCourse, setEditingCourse] = useState<Course | null>(null)
    const [editName, setEditName] = useState('')
    const [editDesc, setEditDesc] = useState('')

    // State cho quản lý học viên trong modal sửa
    const [allStudents, setAllStudents] = useState<Student[]>([])
    const [studentSearchTerm, setStudentSearchTerm] = useState('')
    const [activeStudentTab, setActiveStudentTab] = useState<'in_course' | 'available'>('in_course')

    // 💖 STATE CHO MODAL CHI TIẾT HỌC VIÊN 💖
    const [viewingStudent, setViewingStudent] = useState<Student | null>(null)

    // Check permissions
    const isTeacher = user?.role === 'giao_vien';
    const canCreateDelete = user && ['admin', 'quan_ly', 'lanh_dao'].includes(user.role);

    // Lấy danh sách khóa học
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
        })
        return () => unsubscribe()
    }, [user, isTeacher])

    // Lấy danh sách TOÀN BỘ học viên (để thêm vào khóa)
    useEffect(() => {
        if (editingCourse) {
            const q = query(collection(db, 'users'), where('role', '==', 'hoc_vien'))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const studentsData = snapshot.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                })) as Student[]
                setAllStudents(studentsData)
            })
            return () => unsubscribe()
        }
    }, [editingCourse])

    // Thêm khóa học mới
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
                teacherIds: [user?.uid] // Assign creator as teacher
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

    // Xóa khóa học
    const handleDeleteCourse = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return

        try {
            await deleteDoc(doc(db, 'courses', id))
        } catch (err: any) {
            alert('Lỗi khi xóa: ' + err.message)
        }
    }

    // 💖 CẬP NHẬT KHÓA HỌC 💖
    const handleUpdateCourse = async () => {
        if (!editingCourse) return
        try {
            await updateDoc(doc(db, 'courses', editingCourse.id), {
                name: editName,
                description: editDesc
            })
            alert('Cập nhật thông tin khóa học thành công!')
            // (Không đóng modal ngay để user còn quản lý học viên)
        } catch (err: any) {
            alert('Lỗi cập nhật: ' + err.message)
        }
    }

    // 💖 THÊM/XÓA HỌC VIÊN KHỎI KHÓA 💖
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

    // Lọc khóa học
    const filteredCourses = courses.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Lọc học viên trong modal
    const filteredStudents = allStudents.filter(s =>
        s.fullName?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.class?.toLowerCase().includes(studentSearchTerm.toLowerCase())
    )

    // Phân loại học viên: Đã trong khóa này vs Chưa vào khóa này
    const studentsInCourse = filteredStudents.filter(s => s.courseId === editingCourse?.id)
    const studentsAvailable = filteredStudents.filter(s => s.courseId !== editingCourse?.id)

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <h2 style={{ color: '#0070f3', marginBottom: '15px' }}>Quản lý Khóa học (Lớp thi)</h2>

            {/* Form tạo mới - Chỉ hiện nếu có quyền */}
            {canCreateDelete && (
                <form onSubmit={handleAddCourse} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Tên khóa học (VD: TM-K1)"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        required
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                    />
                    <input
                        type="text"
                        placeholder="Mô tả (Tuỳ chọn)"
                        value={newCourseDesc}
                        onChange={(e) => setNewCourseDesc(e.target.value)}
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 2 }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '8px 16px',
                            background: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Đang tạo...' : 'Tạo Khóa học'}
                    </button>
                </form>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* 💖 THANH TÌM KIẾM KHÓA HỌC 💖 */}
            <input
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #eee', background: '#f9f9f9' }}
            />

            {/* Danh sách */}
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {filteredCourses.map(course => (
                    <div key={course.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9', position: 'relative' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{course.name}</h3>
                        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>{course.description || 'Không có mô tả'}</p>

                        <div style={{ display: 'flex', gap: '5px' }}>
                            {/* Nút Sửa */}
                            <button
                                onClick={() => {
                                    setEditingCourse(course)
                                    setEditName(course.name)
                                    setEditDesc(course.description || '')
                                    setActiveStudentTab('in_course')
                                }}
                                style={{
                                    padding: '5px 10px',
                                    background: '#faad14',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {canCreateDelete ? 'Sửa / QL Học viên' : 'Xem / QL Học viên'}
                            </button>

                            {/* Nút Xóa - Chỉ hiện nếu có quyền */}
                            {canCreateDelete && (
                                <button
                                    onClick={() => handleDeleteCourse(course.id)}
                                    style={{
                                        padding: '5px 10px',
                                        background: '#ff4d4f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Xóa
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {filteredCourses.length === 0 && <p>Không tìm thấy khóa học nào.</p>}
            </div>

            {/* 💖 MODAL SỬA KHÓA HỌC & QUẢN LÝ HỌC VIÊN 💖 */}
            {editingCourse && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '900px',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0 }}>Chỉnh sửa: {editingCourse.name}</h2>
                            <button onClick={() => setEditingCourse(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        {/* Phần 1: Thông tin cơ bản */}
                        <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Thông tin cơ bản</h3>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    value={editName}
                                    onChange={e => setEditName(e.target.value)}
                                    placeholder="Tên khóa học"
                                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                <input
                                    value={editDesc}
                                    onChange={e => setEditDesc(e.target.value)}
                                    placeholder="Mô tả"
                                    style={{ flex: 2, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                                <button
                                    onClick={handleUpdateCourse}
                                    style={{ background: '#0070f3', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Lưu thông tin
                                </button>
                            </div>
                        </div>

                        {/* Phần 2: Quản lý học viên */}
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>Quản lý Học viên</h3>

                            <input
                                placeholder="Tìm kiếm học viên để thêm/xóa..."
                                value={studentSearchTerm}
                                onChange={e => setStudentSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />

                            {/* TABS */}
                            <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '15px' }}>
                                <button
                                    onClick={() => setActiveStudentTab('in_course')}
                                    style={{
                                        padding: '10px 20px',
                                        background: activeStudentTab === 'in_course' ? '#e6f7ff' : 'transparent',
                                        color: activeStudentTab === 'in_course' ? '#0070f3' : '#333',
                                        border: 'none',
                                        borderBottom: activeStudentTab === 'in_course' ? '2px solid #0070f3' : 'none',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Học viên trong khóa ({studentsInCourse.length})
                                </button>
                                <button
                                    onClick={() => setActiveStudentTab('available')}
                                    style={{
                                        padding: '10px 20px',
                                        background: activeStudentTab === 'available' ? '#f6ffed' : 'transparent',
                                        color: activeStudentTab === 'available' ? '#389e0d' : '#333',
                                        border: 'none',
                                        borderBottom: activeStudentTab === 'available' ? '2px solid #389e0d' : 'none',
                                        cursor: 'pointer',
                                        fontWeight: 600
                                    }}
                                >
                                    Thêm học viên
                                </button>
                            </div>

                            {/* TAB CONTENT: TABLE */}
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Họ và tên</th>
                                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
                                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Lớp</th>
                                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>SĐT</th>
                                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeStudentTab === 'in_course' ? (
                                            // LIST: STUDENTS IN COURSE
                                            studentsInCourse.length > 0 ? (
                                                studentsInCourse.map(s => (
                                                    <tr key={s.uid} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '10px' }}>{s.fullName}</td>
                                                        <td style={{ padding: '10px' }}>{s.email}</td>
                                                        <td style={{ padding: '10px' }}>{s.class || '---'}</td>
                                                        <td style={{ padding: '10px' }}>{s.phoneNumber || '---'}</td>
                                                        <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                                                            <button
                                                                onClick={() => setViewingStudent(s)}
                                                                style={{ background: '#1890ff', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Chi tiết
                                                            </button>
                                                            <button
                                                                onClick={() => handleStudentCourseChange(s.uid, 'remove')}
                                                                style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Xóa khỏi khóa
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chưa có học viên nào trong khóa này.</td></tr>
                                            )
                                        ) : (
                                            // LIST: AVAILABLE STUDENTS
                                            studentsAvailable.length > 0 ? (
                                                studentsAvailable.map(s => (
                                                    <tr key={s.uid} style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '10px' }}>
                                                            {s.fullName}
                                                            {s.courseName && <div style={{ fontSize: '0.75rem', color: '#faad14' }}>Đang học: {s.courseName}</div>}
                                                        </td>
                                                        <td style={{ padding: '10px' }}>{s.email}</td>
                                                        <td style={{ padding: '10px' }}>{s.class || '---'}</td>
                                                        <td style={{ padding: '10px' }}>{s.phoneNumber || '---'}</td>
                                                        <td style={{ padding: '10px', display: 'flex', gap: '5px' }}>
                                                            <button
                                                                onClick={() => setViewingStudent(s)}
                                                                style={{ background: '#1890ff', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Chi tiết
                                                            </button>
                                                            <button
                                                                onClick={() => handleStudentCourseChange(s.uid, 'add')}
                                                                style={{ background: '#0070f3', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Thêm vào khóa
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Không tìm thấy học viên nào khác.</td></tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* 💖 MODAL CHI TIẾT HỌC VIÊN (DÙNG CHUNG) 💖 */}
            {viewingStudent && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100
                }}>
                    <div style={{
                        background: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '600px',
                        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h2 style={{ margin: 0, color: '#0070f3' }}>Hồ sơ Học viên</h2>
                            <button onClick={() => setViewingStudent(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Họ và tên:</strong>
                                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{viewingStudent.fullName}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Email:</strong>
                                <div>{viewingStudent.email}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Số điện thoại:</strong>
                                <div>{viewingStudent.phoneNumber || '---'}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Ngày sinh:</strong>
                                <div>{viewingStudent.birthDate || '---'}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Lớp:</strong>
                                <div>{viewingStudent.class || '---'}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Khóa học:</strong>
                                <div style={{ color: viewingStudent.courseName ? '#0070f3' : '#333', fontWeight: viewingStudent.courseName ? 600 : 400 }}>
                                    {viewingStudent.courseName || 'Chưa vào khóa'}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>Thông tin CCCD & Địa chỉ</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Số CCCD:</strong>
                                    <div>{viewingStudent.cccd || '---'}</div>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Ngày cấp:</strong>
                                    <div>{viewingStudent.cccdDate || '---'}</div>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Nơi cấp:</strong>
                                    <div>{viewingStudent.cccdPlace || '---'}</div>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Địa chỉ:</strong>
                                    <div>{viewingStudent.address || '---'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '0.85rem', color: '#999' }}>
                            Ngày tham gia: {viewingStudent.createdAt ? new Date(viewingStudent.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '---'}
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
