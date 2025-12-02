'use client'

import React, { useState, useEffect } from 'react'
import { db } from '../utils/firebaseClient'
import { collection, getDocs, query, orderBy, Timestamp, collectionGroup, where } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import styles from './UserAccountManager.module.css' // Reuse styles for consistency

// --- TYPES ---

interface ExamResult {
    id: string;
    userId: string;
    quizId: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    timeTaken: number;
    completedAt: Timestamp;
    type?: 'practice' | 'exam' | 'online_exam'; // Inferred type
}

interface OnlineExamParticipant {
    id: string; // Participant ID
    userId?: string; // Sometimes stored as userId or just id matches user
    fullName: string;
    email: string;
    status: 'waiting' | 'in_progress' | 'submitted';
    score?: number;
    totalQuestions?: number;
    joinedAt: Timestamp;
    // We need to link this back to the room/exam
    roomId?: string; // Not directly on participant, but we can get from ref? 
    // Actually collectionGroup query returns docs, we can get parent ref.
}

interface UserAccount {
    id: string;
    fullName: string;
    email: string;
    class?: string;
    courseName?: string;
}

interface AggregatedUserStats {
    userId: string;
    user: UserAccount | null;
    highScore: number;
    lastScore: number;
    lastActivityDate: Timestamp | null;
    onlineExamScore: number | null; // Latest online exam score
    history: CombinedHistoryItem[];
}

interface CombinedHistoryItem {
    id: string;
    type: 'Ôn tập' | 'Thi thử' | 'Thi thử 2' | 'Thi Trực Tuyến';
    title: string;
    score: number;
    total: number;
    timeTaken?: number; // seconds
    date: Timestamp;
}

export default function ReviewManager() {
    const [aggregatedData, setAggregatedData] = useState<AggregatedUserStats[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [filterName, setFilterName] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [availableClasses, setAvailableClasses] = useState<string[]>([]);

    // 💖 STATE CHO MODAL CHI TIẾT HỌC VIÊN 💖
    const [selectedUserStats, setSelectedUserStats] = useState<AggregatedUserStats | null>(null);

    // Auth & Role
    const { user } = useAuth(); // Need auth context to check role
    const isTeacher = user?.role === 'giao_vien';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 0. If Teacher, fetch assigned courses first
                let allowedCourseIds: string[] = [];
                let allowedCourseNames: string[] = [];

                if (isTeacher && user?.uid) {
                    const coursesRef = collection(db, 'courses');
                    // We can't easily query array-contains in client-side filter if we want to be safe, 
                    // but for now let's fetch all and filter or use a query if possible.
                    // Firestore supports array-contains.
                    const qCourses = query(coursesRef, where('teacherIds', 'array-contains', user.uid));
                    const courseSnapshot = await getDocs(qCourses);
                    courseSnapshot.forEach(doc => {
                        allowedCourseIds.push(doc.id);
                        const data = doc.data();
                        if (data.name) allowedCourseNames.push(data.name);
                    });
                }

                // 1. Fetch Users
                const usersRef = collection(db, 'users');
                const userSnapshot = await getDocs(usersRef);
                const userMap: Record<string, UserAccount> = {};
                const classesSet = new Set<string>();

                userSnapshot.forEach(doc => {
                    const data = doc.data();

                    // ROLE FILTERING:
                    // If teacher, only include students in allowed courses
                    // We check both courseId (if linked) and courseName (legacy/string match)
                    if (isTeacher) {
                        const studentCourseId = data.courseId;
                        const studentCourseName = data.courseName;

                        const isInAssignedCourse =
                            (studentCourseId && allowedCourseIds.includes(studentCourseId)) ||
                            (studentCourseName && allowedCourseNames.includes(studentCourseName));

                        if (!isInAssignedCourse) return; // Skip this student
                    }

                    userMap[doc.id] = {
                        id: doc.id,
                        fullName: data.fullName || 'Unknown',
                        email: data.email || '',
                        class: data.class,
                        courseName: data.courseName
                    };
                    if (data.class) classesSet.add(data.class);
                });
                setAvailableClasses(Array.from(classesSet).sort());

                // 2. Fetch Practice/Mock Results (exam_results)
                const resultsRef = collection(db, 'exam_results');
                const qResults = query(resultsRef, orderBy('completedAt', 'desc'));
                const resultSnapshot = await getDocs(qResults);

                // 3. Fetch Online Exam Results (participants collection group)
                const participantsQuery = query(collectionGroup(db, 'participants'), where('status', '==', 'submitted'));
                const participantsSnapshot = await getDocs(participantsQuery);

                // --- AGGREGATION LOGIC ---
                const statsMap: Record<string, AggregatedUserStats> = {};

                // Initialize stats for filtered users
                Object.values(userMap).forEach(user => {
                    statsMap[user.id] = {
                        userId: user.id,
                        user: user,
                        highScore: 0,
                        lastScore: 0,
                        lastActivityDate: null,
                        onlineExamScore: null,
                        history: []
                    };
                });

                // Process Practice Results
                resultSnapshot.forEach(doc => {
                    const data = doc.data() as ExamResult;
                    const userId = data.userId;

                    if (!statsMap[userId]) return;

                    let typeLabel: CombinedHistoryItem['type'] = 'Ôn tập';
                    if (data.quizId === 'exam-quiz') typeLabel = 'Thi thử';
                    else if (data.quizId === 'thithu2' || data.quizId === 'online-exam-quiz') typeLabel = 'Thi thử 2';

                    const historyItem: CombinedHistoryItem = {
                        id: doc.id,
                        type: typeLabel,
                        title: data.quizTitle || (typeLabel === 'Ôn tập' ? 'Bài ôn tập' : typeLabel),
                        score: data.score,
                        total: data.totalQuestions,
                        timeTaken: data.timeTaken,
                        date: data.completedAt
                    };

                    statsMap[userId].history.push(historyItem);
                });

                // Process Online Exam Results (Thi Trực Tuyến)
                participantsSnapshot.forEach(doc => {
                    const data = doc.data() as OnlineExamParticipant;
                    const userId = doc.id; // doc.id is userId in participants subcollection

                    if (!statsMap[userId]) return;

                    const historyItem: CombinedHistoryItem = {
                        id: doc.id,
                        type: 'Thi Trực Tuyến',
                        title: 'Bài thi Trực tuyến',
                        score: data.score || 0,
                        total: data.totalQuestions || 0,
                        timeTaken: 0,
                        date: data.joinedAt
                    };

                    statsMap[userId].history.push(historyItem);
                });

                // Calculate Stats for each user
                Object.values(statsMap).forEach(stat => {
                    if (stat.history.length === 0) return;

                    // Sort history by date desc
                    stat.history.sort((a, b) => b.date.seconds - a.date.seconds);

                    // 1. Calculate High Score & Last Score (Only from 'Thi thử' and 'Thi thử 2')
                    const mockExams = stat.history.filter(h => h.type === 'Thi thử' || h.type === 'Thi thử 2');

                    if (mockExams.length > 0) {
                        stat.highScore = Math.max(...mockExams.map(h => h.score));
                        stat.lastScore = mockExams[0].score; // Most recent mock exam
                    } else {
                        stat.highScore = 0;
                        stat.lastScore = 0;
                    }

                    // 2. Last Activity Date (Any type)
                    stat.lastActivityDate = stat.history[0].date;

                    // 3. Online Exam Score (Latest 'Thi Trực Tuyến')
                    const latestOnline = stat.history.find(h => h.type === 'Thi Trực Tuyến');
                    if (latestOnline) {
                        stat.onlineExamScore = latestOnline.score;
                    }
                });

                setAggregatedData(Object.values(statsMap));

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, isTeacher]);

    const formatTime = (seconds?: number) => {
        if (seconds === undefined) return '--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}p ${secs}s`;
    };

    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return '---';
        return new Date(timestamp.seconds * 1000).toLocaleString('vi-VN');
    };

    // Filter Logic
    const filteredData = aggregatedData.filter(item => {
        const nameMatch = item.user?.fullName.toLowerCase().includes(filterName.toLowerCase());
        const classMatch = filterClass === 'all' || item.user?.class === filterClass;
        return nameMatch && classMatch;
    });

    // Sort: Users with most recent activity first
    filteredData.sort((a, b) => {
        const timeA = a.lastActivityDate ? a.lastActivityDate.seconds : 0;
        const timeB = b.lastActivityDate ? b.lastActivityDate.seconds : 0;
        return timeB - timeA;
    });

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Quản lý Ôn tập & Kết quả Thi</h2>
                </div>

                <div className={styles.filterContainer}>
                    <input
                        type="text"
                        placeholder="Tìm theo tên học viên..."
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        className={styles.input}
                        style={{ maxWidth: '250px' }}
                    />

                    <select
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className={styles.input}
                        style={{ maxWidth: '200px' }}
                    >
                        <option value="all">Tất cả lớp</option>
                        {availableClasses.map(cls => (
                            <option key={cls} value={cls}>{cls}</option>
                        ))}
                    </select>

                    <span className={styles.filterInfo}>(Hiển thị {filteredData.length} học viên)</span>
                </div>

                {loading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Học viên</th>
                                    <th>Lớp / Khóa</th>
                                    <th>Điểm cao nhất</th>
                                    <th>Điểm lần cuối</th>
                                    <th>Điểm Thi (Online)</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((stat) => (
                                    <tr key={stat.userId}>
                                        <td>
                                            <strong>{stat.user ? stat.user.fullName : 'Unknown'}</strong>
                                            <div className={styles.subText}>{stat.user?.email}</div>
                                        </td>
                                        <td>
                                            {stat.user?.class && <div>{stat.user.class}</div>}
                                            {stat.user?.courseName && <div style={{ color: '#0070f3', fontSize: '0.85rem' }}>{stat.user.courseName}</div>}
                                        </td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                                                {stat.highScore}
                                            </span>
                                        </td>
                                        <td>
                                            <span>{stat.lastScore}</span>
                                            <div className={styles.subText}>{formatDate(stat.lastActivityDate)}</div>
                                        </td>
                                        <td>
                                            {stat.onlineExamScore !== null ? (
                                                <span style={{ fontWeight: 'bold', color: '#d0021b' }}>
                                                    {stat.onlineExamScore}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#ccc' }}>--</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className={styles.buttonEdit}
                                                onClick={() => setSelectedUserStats(stat)}
                                            >
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredData.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#777' }}>Không tìm thấy kết quả nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 💖 DETAIL MODAL 💖 */}
                {selectedUserStats && (
                    <div className={styles.modalBackdrop} onClick={() => setSelectedUserStats(null)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                <h2 className={styles.modalTitle}>
                                    Lịch sử làm bài: {selectedUserStats.user?.fullName}
                                </h2>
                                <button onClick={() => setSelectedUserStats(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', fontSize: '0.9rem' }}>
                                <div><strong>Lớp:</strong> {selectedUserStats.user?.class || '--'}</div>
                                <div><strong>Khóa:</strong> {selectedUserStats.user?.courseName || '--'}</div>
                                <div><strong>Email:</strong> {selectedUserStats.user?.email}</div>
                            </div>

                            <div className={styles.tableContainer} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <table className={styles.userTable}>
                                    <thead>
                                        <tr>
                                            <th>Loại</th>
                                            <th>Bài thi</th>
                                            <th>Điểm</th>
                                            <th>Thời gian làm</th>
                                            <th>Ngày nộp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedUserStats.history.map((item, index) => (
                                            <tr key={`${item.id}-${index}`}>
                                                <td>
                                                    <span className={`${styles.rolePill} ${item.type === 'Thi Trực Tuyến' ? styles.admin : // Red
                                                        item.type.includes('Thi thử') ? styles.quan_ly : // Orange
                                                            styles.hoc_vien // Blue/Green
                                                        }`}>
                                                        {item.type}
                                                    </span>
                                                </td>
                                                <td>{item.title}</td>
                                                <td>
                                                    <strong>{item.score} / {item.total}</strong>
                                                </td>
                                                <td>{formatTime(item.timeTaken)}</td>
                                                <td>{formatDate(item.date)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.modalActions} style={{ marginTop: '20px' }}>
                                <button onClick={() => setSelectedUserStats(null)} className={styles.buttonSecondary}>Đóng</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
