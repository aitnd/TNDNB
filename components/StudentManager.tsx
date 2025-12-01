'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, doc, onSnapshot, query, where, updateDoc, getDocs } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

interface Student {
    uid: string
    fullName: string
    email: string
    class?: string // Lớp tự điền
    courseId?: string // Khóa học đã gán
    courseName?: string
    isVerified?: boolean
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
                                    {student.fullName}
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
                                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                    <select
                                        onChange={(e) => handleAssignCourse(student.uid, e.target.value)}
                                        value={student.courseId || ''}
                                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                    >
                                        <option value="">-- Chọn khóa --</option>
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
        </div>
    )
}
