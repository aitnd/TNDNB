'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, doc, onSnapshot, query, where, updateDoc, getDocs } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

interface Student {
    uid: string
    fullName: string
    email: string
    phoneNumber?: string
    birthDate?: string
    class?: string // Lớp tự điền
    courseId?: string // Khóa học đã gán
    courseName?: string
    isVerified?: boolean
    cccd?: string
    cccdDate?: string
    cccdPlace?: string
    address?: string
    createdAt?: any
}

interface Course {
    id: string
    name: string
}

export default function StudentManager() {
    const { user } = useAuth()
    const [students, setStudents] = useState<Student[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // 💖 STATE CHO MODAL CHI TIẾT 💖
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    // Lấy danh sách khóa học
    useEffect(() => {
        const fetchCourses = async () => {
            const q = query(collection(db, 'courses'))
            const snapshot = await getDocs(q)
            const courseData = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }))
            setCourses(courseData)
        }
        fetchCourses()
    }, [])

    // Lấy danh sách học viên
    useEffect(() => {
        // Chỉ lấy user có role là 'hoc_vien'
        const q = query(collection(db, 'users'), where('role', '==', 'hoc_vien'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const studentData = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as Student[]
            setStudents(studentData)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Gán khóa học cho học viên
    const handleAssignCourse = async (studentId: string, courseId: string) => {
        if (!courseId) return
        const selectedCourse = courses.find(c => c.id === courseId)

        try {
            await updateDoc(doc(db, 'users', studentId), {
                courseId: courseId,
                courseName: selectedCourse?.name,
                isVerified: true // Đánh dấu đã xác thực
            })
            alert(`Đã thêm học viên vào khóa ${selectedCourse?.name}`)
        } catch (err: any) {
            alert('Lỗi: ' + err.message)
        }
    }

    // Lọc danh sách
    const filteredStudents = students.filter(s =>
        s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <h2 style={{ color: '#0070f3', marginBottom: '15px' }}>Quản lý & Xác thực Học viên</h2>

            <input
                type="text"
                placeholder="Tìm kiếm học viên (Tên, Email, Lớp...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
            />

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Họ tên</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Email</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Lớp (Tự điền)</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Khóa học (Xác thực)</th>
                            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map(student => (
                            <tr key={student.uid}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <strong
                                        onClick={() => setSelectedStudent(student)}
                                        style={{ cursor: 'pointer', color: '#0070f3' }}
                                        title="Xem chi tiết"
                                    >
                                        {student.fullName}
                                    </strong>
                                    {student.isVerified && <span style={{ color: '#0070f3', marginLeft: '5px', fontWeight: 'bold' }}>✓</span>}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{student.email}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#666' }}>{student.class || '---'}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    {student.courseName ? (
                                        <span style={{
                                            background: '#e6f7ff',
                                            color: '#0070f3',
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            fontSize: '0.85rem',
                                            fontWeight: 500
                                        }}>
                                            {student.courseName}
                                        </span>
                                    ) : (
                                        <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa vào khóa</span>
                                    )}
                                </td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', gap: '5px' }}>
                                    <button
                                        onClick={() => setSelectedStudent(student)}
                                        style={{
                                            padding: '5px 10px',
                                            background: '#1890ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem'
                                        }}
                                    >
                                        Chi tiết
                                    </button>
                                    <select
                                        onChange={(e) => handleAssignCourse(student.uid, e.target.value)}
                                        value={student.courseId || ''}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">-- Gán khóa --</option>
                                        {courses.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && <p style={{ padding: '20px', textAlign: 'center' }}>Không tìm thấy học viên nào.</p>}
            </div>

            {/* 💖 MODAL CHI TIẾT HỌC VIÊN 💖 */}
            {selectedStudent && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '600px',
                        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h2 style={{ margin: 0, color: '#0070f3' }}>Hồ sơ Học viên</h2>
                            <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Họ và tên:</strong>
                                <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{selectedStudent.fullName}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Email:</strong>
                                <div>{selectedStudent.email}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Số điện thoại:</strong>
                                <div>{selectedStudent.phoneNumber || '---'}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Ngày sinh:</strong>
                                <div>{selectedStudent.birthDate || '---'}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Lớp:</strong>
                                <div>{selectedStudent.class || '---'}</div>
                            </div>
                            <div>
                                <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Khóa học:</strong>
                                <div style={{ color: selectedStudent.courseName ? '#0070f3' : '#333', fontWeight: selectedStudent.courseName ? 600 : 400 }}>
                                    {selectedStudent.courseName || 'Chưa vào khóa'}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px', color: '#333' }}>Thông tin CCCD & Địa chỉ</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Số CCCD:</strong>
                                    <div>{selectedStudent.cccd || '---'}</div>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Ngày cấp:</strong>
                                    <div>{selectedStudent.cccdDate || '---'}</div>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Nơi cấp:</strong>
                                    <div>{selectedStudent.cccdPlace || '---'}</div>
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: '#666', fontSize: '0.9rem' }}>Địa chỉ:</strong>
                                    <div>{selectedStudent.address || '---'}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '0.85rem', color: '#999' }}>
                            Ngày tham gia: {selectedStudent.createdAt ? new Date(selectedStudent.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '---'}
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}
