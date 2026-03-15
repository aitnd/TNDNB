import React from 'react';
import { UserProfile } from '../types';
import styles from './StudentCard.module.css';
import { FaUniversity } from 'react-icons/fa';
import { BadgeCheck, Calendar, MapPin, Building2, GraduationCap } from 'lucide-react';

interface StudentCardProps {
    user: UserProfile;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return ' --/--/----';
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateString;
};

const StudentCard: React.FC<StudentCardProps> = ({ user }) => {
    const isTeacher = user.role !== 'hoc_vien';
    const cardTitle = isTeacher ? 'THẺ GIÁO VIÊN' : 'THẺ HỌC VIÊN';

    return (
        <div className={styles.card}>
            {/* === HEADER === */}
            <div className={`${styles.header} ${isTeacher ? styles.headerTeacher : ''}`}>
                <div className={styles.logoPlaceholder}>
                    <FaUniversity size={18} />
                </div>
                <div className={styles.schoolName}>
                    Công ty Cổ phần<br />
                    TƯ VẤN VÀ GIÁO DỤC NINH BÌNH
                </div>
            </div>

            {/* === BODY === */}
            <div className={styles.body}>
                {/* Chip giả lập */}
                <div className={styles.chip}>
                    <div className={styles.chipLine}></div>
                    <div className={styles.chipLine}></div>
                    <div className={styles.chipLine}></div>
                    <div className={styles.chipLine}></div>
                    <div className={styles.chipLine}></div>
                    <div className={styles.chipLine}></div>
                </div>

                <h2 className={`${styles.cardTitle} ${isTeacher ? styles.cardTitleTeacher : ''}`}>
                    {cardTitle}
                </h2>

                <div className={styles.contentRow}>
                    {/* ẢNH 3x4 */}
                    <div className={styles.photoSection}>
                        <div className={styles.photoWrapper}>
                            <img
                                src={user.photoURL || (isTeacher ? '/assets/img/avatar.webp' : '/assets/img/avatar1.webp')}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=random&size=150`;
                                }}
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
                                {user.full_name || user.fullName || '---'}
                                {user.isVerified && (
                                    <span className={styles.verifiedBadge}>
                                        <BadgeCheck size={10} style={{ marginRight: '2px' }} />
                                        Verified
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className={styles.infoRow}>
                            <Calendar size={12} className="text-slate-400" />
                            <span className={styles.label}>Ngày sinh:</span>
                            <span className={styles.value}>{formatDate(user.birthDate)}</span>
                        </div>

                        {isTeacher ? (
                            <div className={styles.infoRow}>
                                <Building2 size={12} className="text-slate-400" />
                                <span className={styles.label}>Phòng:</span>
                                <span className={styles.value} style={{ fontSize: '0.68rem' }}>
                                    P. Đào tạo - Tổ vận hành máy tàu thủy
                                </span>
                            </div>
                        ) : (
                            <div className={styles.infoRow}>
                                <GraduationCap size={12} className="text-slate-400" />
                                <span className={styles.label}>Lớp học:</span>
                                <span className={styles.value}>{user.courseName || 'N/A'}</span>
                            </div>
                        )}

                        <div className={styles.infoRow}>
                            <MapPin size={12} className="text-slate-400" />
                            <span className={styles.label}>Địa chỉ:</span>
                            <span className={styles.value} style={{ fontSize: '0.68rem', lineHeight: '1.2' }}>
                                {user.address || '---'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === FOOTER (BARCODE) === */}
            <div className={styles.footer}>
                <div className={styles.barcodeSection}>
                    <div className={styles.barcode}></div>
                </div>
                <div className={styles.idText}>
                    ID: {user.id ? user.id.substring(0, 10).toUpperCase() : 'APP-ID-NEW'}
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
