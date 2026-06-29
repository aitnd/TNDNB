'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, getDocs, query, Timestamp, where, doc, getDoc } from 'firebase/firestore'  
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
    roomId?: string;
}

export default function StudentHistory() {
    const { user } = useAuth()
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [roomDetails, setRoomDetails] = useState<Record<string, any>>({});

    useEffect(() => {
        if (!user) return

        const fetchHistory = async () => {
            setLoading(true)
            try {
                const list: HistoryItem[] = []

                // Query exam_results
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

                    // Handle timestamps: Online Exam uses submitted_at, Practice uses completedAt
                    const timestamp = data.submitted_at || data.completedAt || Timestamp.now();

                    list.push({
                        id: doc.id,
                        type,
                        title,
                        roomId: data.roomId,
                        score: data.score,
                        total: data.totalQuestions,
                        date: timestamp
                    })
                })

                // Sort by date desc
                list.sort((a, b) => b.date.seconds - a.date.seconds)
                setHistory(list)

                // 💖 FETCH ROOM DETAILS 💖
                const roomIds = Array.from(new Set(list.filter(item => item.roomId).map(item => item.roomId!)));
                if (roomIds.length > 0) {
                    const details: Record<string, any> = {};
                    await Promise.all(roomIds.map(async (rid) => {
                        try {
                            const roomSnap = await getDoc(doc(db, 'exam_rooms', rid));
                            if (roomSnap.exists()) {
                                details[rid] = roomSnap.data();
                            }
                        } catch (err) {
                            console.error("Error fetch room", rid, err);
                        }
                    }));
                    setRoomDetails(details);
                }

            } catch (error) {
                console.error("Error fetching history:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [user])

    if (loading) return <div className={styles.container}>Đang tải lịch sử...</div>

    const getDisplayName = (item: HistoryItem) => {
        if (item.roomId && roomDetails[item.roomId]) {
            const r = roomDetails[item.roomId];
            return `Phòng thi ${r.name} / ${r.course_name || 'Tự do'} / ${r.license_name || ''}`;
        }
        return item.title;
    };

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
                                <th>Giờ nộp</th>
                                <th>Ngày nộp</th>
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
                                    <td>{getDisplayName(item)}</td>
                                    <td>
                                        <span className={styles.score}>{item.score}</span> / {item.total}
                                    </td>
                                    <td>
                                        {new Date(item.date.seconds * 1000).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
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
