'use client'

import React from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './StudentCard.module.css'
import { FaIdCard, FaCheckCircle } from 'react-icons/fa'
import UserName from './UserName'

export default function StudentCard() {
    const { user } = useAuth()

    if (!user) return null

    return (
        <div className={styles.card}>
            {/* LEFT: AVATAR */}
            <div className={styles.avatarSection}>
                <div className={styles.avatarWrapper}>
                    <img
                        src={user.photoURL || 'https://via.placeholder.com/150'}
                        alt="Avatar"
                        className={styles.avatar}
                    />
                </div>
            </div>

            {/* RIGHT: INFO GRID */}
            <div className={styles.infoSection}>
                <div className={styles.headerRow}>
                    <h3 className={styles.cardTitle}>
                        <FaIdCard /> Thẻ Học Viên
                    </h3>
                </div>

                {/* Họ và tên */}
                <div className={styles.infoItem}>
                    <span className={styles.label}>Họ và tên</span>
                    <span className={styles.value}>
                        <UserName name={user.fullName || ''} role={user.role} courseId={user.courseId} />
                    </span>
                </div>

                {/* Lớp / Khóa học */}
                <div className={styles.infoItem}>
                    <span className={styles.label}>Lớp học</span>
                    <span className={styles.value}>
                        {user.class || '---'}
                        {user.courseName && (
                            <span style={{ color: '#1890ff', marginLeft: '6px', fontSize: '0.9em' }}>
                                ({user.courseName} <FaCheckCircle style={{ verticalAlign: 'middle' }} />)
                            </span>
                        )}
                    </span>
                </div>

                {/* Ngày sinh */}
                <div className={styles.infoItem}>
                    <span className={styles.label}>Ngày sinh</span>
                    <span className={styles.value}>{user.birthDate || '---'}</span>
                </div>

                {/* Địa chỉ */}
                <div className={styles.infoItem}>
                    <span className={styles.label}>Địa chỉ</span>
                    <span className={styles.value}>{user.address || '---'}</span>
                </div>
            </div>
        </div>
    )
}
