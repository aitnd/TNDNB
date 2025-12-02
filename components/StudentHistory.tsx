'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, getDocs, query, orderBy, Timestamp, where, collectionGroup } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import styles from './StudentHistory.module.css'
import { FaHistory } from 'react-icons/fa'

interface HistoryItem {
    id: string;
    type: 'Ôn tập' | 'Thi thử' | 'Thi Trực Tuyến';
    title: string;
    score: number;
    total: number;
    date: Timestamp;
}

export default function StudentHistory() {
    const { user } = useAuth()
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchHistory = async () => {
            setLoading(true)
            try {
                const historyList: HistoryItem[] = []

                // 1. Fetch Practice/Mock Results (exam_results)
                const resultsRef = collection(db, 'exam_results')
                // Note: Composite index might be needed for userId + completedAt
                // For now, let's query by userId and sort in memory if needed, or try orderBy
                const qResults = query(
                    resultsRef,
                    where('studentId', '==', user.uid)
                )
                const resultSnapshot = await getDocs(qResults)

                resultSnapshot.forEach(doc => {
                    const data = doc.data()
                    let typeLabel: HistoryItem['type'] = 'Ôn tập'
                    // Simple logic to distinguish types based on quizId or other fields if available
                    // Assuming 'licenseId' or 'quizId' helps. 
                    // For now, default to 'Ôn tập' or 'Thi thử' if we can distinguish.
                    // Let's assume everything in exam_results is 'Ôn tập' unless specified.

                    historyList.push({
                        id: doc.id,
                        type: typeLabel,
                        title: `Bài làm ${data.licenseId || ''}`, // Customize title if possible
                        score: data.score,
                        total: data.totalQuestions,
                        date: data.submitted_at || data.completedAt // Handle different field names
                    })
                })

                // 2. Fetch Online Exam Results (participants)
                // We need to find where this user is a participant
                // collectionGroup query is powerful but requires index
                // Let's try to query 'participants' where documentId is user.uid? 
                // No, documentId query on collectionGroup is tricky.
                // But usually participant doc ID IS the user ID.
                // Let's try querying collectionGroup 'participants'
                // But wait, we can't filter by doc ID easily in collectionGroup without knowing the path.
                // Actually, if we stored userId as a field in participant doc, it's easier.
                // ReviewManager uses: const userId = doc.id;

                // Alternative: We can't easily query all exams the user participated in without an index or a 'userId' field.
                // Let's assume for now we only show 'exam_results' which is the main storage for results.
                // Wait, 'exam_results' IS where the final score is stored for online exams too (in the route.ts I saw earlier)!
                // "5. LƯU KẾT QUẢ VÀO FIRESTORE (Ngăn 'exam_results')" -> So exam_results covers BOTH!
                // Excellent. I just need to distinguish them.

                // Refine Type Logic:
                // If it has 'roomId', it's likely 'Thi Trực Tuyến'.
                // If it has 'quizId', it's 'Ôn tập' or 'Thi thử'.

                const refinedList = historyList.map(item => {
                    // We need to check the data again. 
                    // Let's re-map inside the loop for efficiency, but here is fine for clarity.
                    return item;
                })

            } catch (err) {
                console.error("Error fetching history:", err)
            } finally {
                setLoading(false)
            }
        }

        // RE-IMPLEMENTING FETCH WITH BETTER LOGIC
        const fetchBetterHistory = async () => {
            setLoading(true)
            try {
                const list: HistoryItem[] = []

                const q = query(collection(db, 'exam_results'), where('studentId', '==', user.uid))
                const snapshot = await getDocs(q)

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
                setHistory(list)

            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchBetterHistory()
    }, [user])

    if (loading) return <div className={styles.container}>Đang tải lịch sử...</div>

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                <FaHistory style={{ color: '#1890ff' }} />
                Lịch sử Ôn tập & Thi
            </h3>

            {history.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Loại</th>
                                <th>Bài thi</th>
                                <th>Điểm số</th>
                                <th>Ngày làm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <span className={`${styles.typeTag} ${item.type === 'Thi Trực Tuyến' ? styles.typeOnline :
                                                item.type === 'Thi thử' ? styles.typeExam :
                                                    styles.typeReview
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td>{item.title}</td>
                                    <td>
                                        <span className={styles.score}>{item.score}</span> / {item.total}
                                    </td>
                                    <td>
                                        {new Date(item.date.seconds * 1000).toLocaleDateString('vi-VN')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.empty}>
                    Bạn chưa có lịch sử làm bài nào.
                </div>
            )}
        </div>
    )
}
