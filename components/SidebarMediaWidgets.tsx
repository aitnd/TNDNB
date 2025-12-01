'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import styles from './Sidebar.module.css'
import { FaPlayCircle, FaFileAlt, FaTimes } from 'react-icons/fa'

type MediaItem = {
    id: number;
    media_url: string;
    media_type?: string;
    file_name?: string;
};

type FileItem = {
    id: string;
    post_id: string;
    post_title: string;
    post_thumbnail: string | null;
    file_name: string;
    file_url: string;
    file_type: string;
};

type SidebarMediaWidgetsProps = {
    latestMedia: MediaItem[];
    latestFiles: FileItem[];
};

type SelectedItem = {
    type: 'image' | 'video' | 'document';
    url: string;
    title?: string;
} | null;

export default function SidebarMediaWidgets({ latestMedia, latestFiles }: SidebarMediaWidgetsProps) {
    const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

    const openModal = (item: SelectedItem) => {
        setSelectedItem(item);
        document.body.style.overflow = 'hidden'; // Khóa cuộn trang
    };

    const closeModal = () => {
        setSelectedItem(null);
        document.body.style.overflow = 'auto'; // Mở khóa cuộn
    };

    // Xử lý click ra ngoài modal để đóng
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <>
            {/* === MODAL VIEWER === */}
            {selectedItem && (
                <div className={styles.modalOverlay} onClick={handleOverlayClick}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={closeModal}>
                            <FaTimes />
                        </button>

                        {selectedItem.type === 'image' && (
                            <img src={selectedItem.url} alt="Preview" className={styles.modalImage} />
                        )}

                        {selectedItem.type === 'video' && (
                            <video src={selectedItem.url} controls autoPlay className={styles.modalVideo} />
                        )}

                        {selectedItem.type === 'document' && (
                            <iframe
                                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedItem.url)}&embedded=true`}
                                className={styles.modalIframe}
                                title="Document Viewer"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* === BOX THƯ VIỆN === */}
            <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
                <Link href="/thu-vien">
                    <h3 className={styles.sidebarTitle}>Thư viện</h3>
                </Link>
                <div className={styles.mediaPreviewGrid}>
                    {latestMedia.length > 0 ? (
                        latestMedia.map((item) => (
                            <div
                                key={item.id}
                                className={styles.mediaPreviewItem}
                                onClick={() => openModal({
                                    type: item.media_type === 'video' ? 'video' : 'image',
                                    url: item.media_url
                                })}
                            >
                                {item.media_type === 'video' ? (
                                    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
                                        <video
                                            src={item.media_url}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                            muted
                                        />
                                        <div style={{
                                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                                            color: 'white', fontSize: '1.2rem'
                                        }}>
                                            <FaPlayCircle />
                                        </div>
                                    </div>
                                ) : (
                                    <img src={item.media_url} alt="Thư viện" loading="lazy" />
                                )}
                            </div>
                        ))
                    ) : (
                        <p className={styles.emptyMessage}>Chưa có ảnh/video nào.</p>
                    )}
                </div>
                <Link href="/thu-vien" className={styles.viewAllButton}>
                    Xem tất cả <i className="fas fa-arrow-right"></i>
                </Link>
            </div>

            {/* === BOX TÀI LIỆU MỚI === */}
            <div className={`${styles.widgetBox} ${styles.sidebarWidget}`}>
                <Link href="/tai-lieu">
                    <h3 className={styles.sidebarTitle}>Tài liệu mới</h3>
                </Link>

                <div className={styles.mediaPreviewGrid}>
                    {latestFiles.length > 0 ? (
                        latestFiles.map((file) => (
                            <div
                                key={file.id}
                                className={styles.mediaPreviewItem}
                                title={file.file_name}
                                onClick={() => openModal({
                                    type: 'document',
                                    url: file.file_url,
                                    title: file.file_name
                                })}
                            >
                                {/* Ảnh nền là Thumbnail bài viết (hoặc ảnh mặc định nếu ko có) */}
                                <img
                                    src={file.post_thumbnail || '/assets/img/document-placeholder.jpg'}
                                    alt={file.file_name}
                                    loading="lazy"
                                    style={{ filter: 'brightness(0.6)' }}
                                />

                                {/* Overlay Icon & Tên file */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    padding: '4px', textAlign: 'center'
                                }}>
                                    <FaFileAlt style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '4px' }} />
                                    <span style={{
                                        color: '#fff', fontSize: '0.6rem', fontWeight: '600',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.8)'
                                    }}>
                                        {file.file_name}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={styles.emptyMessage} style={{ gridColumn: '1 / -1' }}>
                            Chưa có tài liệu nào.
                        </p>
                    )}
                </div>

                <Link href="/tai-lieu" className={styles.viewAllButton}>
                    Xem tất cả <i className="fas fa-arrow-right"></i>
                </Link>
            </div>
        </>
    )
}
