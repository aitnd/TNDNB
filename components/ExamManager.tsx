
// Đánh dấu đây là "Client Component"
'use client'

import React from 'react'
import { useAuth } from '../context/AuthContext'
import CreateRoomForm from './CreateRoomForm'
import JoinRoomList from './JoinRoomList'
import TeacherRoomList from './TeacherRoomList'

// (Import CSS Module)
import styles from './ExamManager.module.css'

// (TẠO COMPONENT)
export default function ExamManager() {
    const { user } = useAuth()

    // Giao diện (Đã "mặc" CSS Module)
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>

                {/* Thanh tiêu đề */}
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Hệ thống Thi Trực Tuyến
                    </h2>
                </div>

                {/* --- CHỨC NĂNG CỦA GIÁO VIÊN / ADMIN / LÃNH ĐẠO / QUAN_LY --- */}
                {user && user.role !== 'hoc_vien' && (
                    <>
                        {/* (Form tạo phòng) */}
                        <CreateRoomForm />

                        <TeacherRoomList />
                    </>
                )}

                {/* --- CHỨC NĂNG CỦA HỌC VIÊN --- */}
                {user && user.role === 'hoc_vien' && (
                    <JoinRoomList />
                )}

            </div>
        </div>
    )
}
