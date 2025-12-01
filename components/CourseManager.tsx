'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, addDoc, deleteDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

interface Course {
    id: string
    name: string
    description?: string
    createdAt: any
}

export default function CourseManager() {
    const { user } = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [newCourseName, setNewCourseName] = useState('')
    const [newCourseDesc, setNewCourseDesc] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Lấy danh sách khóa học
    useEffect(() => {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const courseData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Course[]
            setCourses(courseData)
        })
        return () => unsubscribe()
    }, [])

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
                createdAt: serverTimestamp()
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

    return (
        <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <h2 style={{ color: '#0070f3', marginBottom: '15px' }}>Quản lý Khóa học (Lớp thi)</h2>

            {/* Form tạo mới */}
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Danh sách */}
            <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {courses.map(course => (
                    <div key={course.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{course.name}</h3>
                        <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '0.9rem' }}>{course.description || 'Không có mô tả'}</p>
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
                    </div>
                ))}
                {courses.length === 0 && <p>Chưa có khóa học nào.</p>}
            </div>
        </div>
    )
}
