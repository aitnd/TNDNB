'use client'

import React from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './StudentCard.module.css'
import { FaUniversity } from 'react-icons/fa'

export default function StudentCard() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className={styles.card}>
            {/* === HEADER === */}
            <div className={styles.header}>
                <div className={styles.logoPlaceholder}>
                    <FaUniversity size={20} />
                </div>
                <div className={styles.schoolName}>
                    Công ty Cổ phần<br />
                    TƯ VẤN VÀ GIÁO DỤC NINH BÌNH
                </div>
            </div>

            {/* === BODY === */}
            <div className={styles.body}>
                <h2 className={styles.cardTitle}>THẺ HỌC VIÊN</h2>

                <div className={styles.contentRow}>
                    {/* ẢNH 3x4 */}
                    <div className={styles.photoSection}>
                        <div className={styles.photoWrapper}>
                            <img
                                src={user.photoURL || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                                className={styles.avatar}
                            />
                        </div>
                    </div>

                    {/* THÔNG TIN */}
                    <div className={styles.infoSection}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Họ tên:</span>
                            <span className={`${styles.value} ${styles.valueHighlight}`}>
                                {user.fullName || 'NGUYỄN VĂN A'}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Ngày sinh: </span>
                            <span className={styles.value}> {user.birthDate || ' --/--/----'}</span>
                        </div>

                        <div className={styles.infoRow}>
                            <span className={styles.label}>Lớp học: </span>
                            <span className={styles.value}>{user.courseName || 'Chưa vào khóa'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Địa chỉ:</span>
                            <span className={styles.value} style={{ fontSize: '0.9rem' }}>
                                {user.address || '---'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === FOOTER (BARCODE) === */}
            <div className={styles.footer}>
                <div className={styles.barcode}></div>
                <div style={{ position: 'absolute', bottom: '5px', fontSize: '0.6rem', color: '#718096' }}>
                    ID: {user.uid.substring(0, 10).toUpperCase()}
                </div>
            </div>
        </div>
    )
}
