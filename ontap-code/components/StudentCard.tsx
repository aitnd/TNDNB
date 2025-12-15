import React from 'react';
import { UserProfile } from '../types';
import styles from './StudentCard.module.css';
import { FaUniversity } from 'react-icons/fa';

interface StudentCardProps {
    user: UserProfile;
}

const StudentCard: React.FC<StudentCardProps> = ({ user }) => {
    const isTeacher = user.role !== 'hoc_vien';
    const cardTitle = isTeacher ? 'THẺ GIÁO VIÊN' : 'THẺ HỌC VIÊN';

    // Dynamic styles for Teacher
    const headerStyle = isTeacher ? {
        background: 'linear-gradient(135deg, #b91c1c 0%, #c2410c 100%)', // Red/Orange for Teacher
        borderBottom: '4px solid #fcd34d' // Gold border
    } : {};

    const titleStyle = isTeacher ? {
        color: '#b91c1c',
        textShadow: '0px 1px 2px rgba(0,0,0,0.1)'
    } : {};

    return (
        <div className={styles.card} style={isTeacher ? { borderColor: '#fcd34d', boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.3)' } : {}}>
            {/* === HEADER === */}
            <div className={styles.header} style={headerStyle}>
                <div className={styles.logoPlaceholder} style={isTeacher ? { color: '#fbbf24', background: 'rgba(255,255,255,0.2)' } : {}}>
                    <FaUniversity size={20} />
                </div>
                <div className={styles.schoolName} style={isTeacher ? { color: '#fff', fontWeight: '800' } : {}}>
                    Công ty Cổ phần<br />
                    TƯ VẤN VÀ GIÁO DỤC NINH BÌNH
                </div>
            </div>

            {/* === BODY === */}
            <div className={styles.body}>
                <h2 className={styles.cardTitle} style={titleStyle}>{cardTitle}</h2>

                <div className={styles.contentRow}>
                    {/* ẢNH 3x4 */}
                    <div className={styles.photoSection}>
                        <div className={styles.photoWrapper} style={isTeacher ? { borderColor: '#fcd34d' } : {}}>
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
                            <span className={`${styles.value} ${styles.valueHighlight}`} style={isTeacher ? { color: '#b91c1c' } : {}}>
                                {user.full_name || '---'}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Ngày sinh: </span>
                            <span className={styles.value}> {user.birthDate || ' --/--/----'}</span>
                        </div>

                        {isTeacher ? (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Phòng: </span>
                                <span className={styles.value} style={{ fontWeight: 'bold' }}> Phòng đào tạo - Tổ vận hành máy tàu thủy</span>
                            </div>
                        ) : (
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Lớp học: </span>
                                <span className={styles.value}>{user.courseName || 'Chưa vào khóa'}</span>
                            </div>
                        )}

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
            <div className={styles.footer} style={isTeacher ? { background: '#fef2f2', borderTop: '1px dashed #fca5a5' } : {}}>
                <div className={styles.barcode} style={isTeacher ? { opacity: 0.8 } : {}}></div>
                <div style={{ position: 'absolute', bottom: '5px', fontSize: '0.6rem', color: isTeacher ? '#991b1b' : '#718096' }}>
                    ID: {user.id ? user.id.substring(0, 10).toUpperCase() : '---'}
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
