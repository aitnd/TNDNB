
// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { db } from '../utils/firebaseClient'
import { collection, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import Link from 'next/link'

// (Import CSS Module)
import styles from './UserAccountManager.module.css'

// 1. Định nghĩa "kiểu" của một Tài khoản
interface UserAccount {
    id: string; // Đây là UID
    fullName: string;
    email: string;
    role: string;
    phoneNumber?: string;
    birthDate?: string;
    class?: string; // 💖 THÊM LỚP 💖
    courseName?: string; // 💖 THÊM KHÓA 💖
    cccd?: string; // 💖 THÊM CCCD 💖
    cccdDate?: string;
    cccdPlace?: string;
    address?: string; // 💖 THÊM ĐỊA CHỈ 💖
    createdAt: Timestamp;
}

// (Kiểu dữ liệu cho form)
interface EditFormData {
    fullName: string;
    phoneNumber: string;
    birthDate: string;
    class: string;
    role: string;
    cccd: string;
    cccdDate: string;
    cccdPlace: string;
    address: string;
}

// (Danh sách vai trò - Sắp xếp theo cấp bậc)
const allRoles = [
    { id: 'admin', name: 'Quản trị viên (Admin)' },
    { id: 'lanh_dao', name: 'Lãnh đạo' },
    { id: 'quan_ly', name: 'Quản lý' },
    { id: 'giao_vien', name: 'Giáo viên' },
    { id: 'hoc_vien', name: 'Học viên' },
];

// (Các vai trò được gom nhóm "Giáo viên")
const staffRoles = ['giao_vien', 'lanh_dao', 'quan_ly'];

// 2. TẠO COMPONENT
export default function UserAccountManager() {
    const { user: currentUser } = useAuth() // (User đang đăng nhập)
    const [users, setUsers] = useState<UserAccount[]>([]) // (Danh sách GỐC)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 💖 "Não" trạng thái MỚI cho bộ lọc 💖
    const [filter, setFilter] = useState<string>('all'); // ('all', 'staff', 'hoc_vien')
    const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]); // (Danh sách ĐÃ LỌC)

    // "Não" cho Modal (Cửa sổ Chi tiết / Sửa)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('view'); // 💖 CHẾ ĐỘ XEM / SỬA 💖
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [formData, setFormData] = useState<EditFormData>({
        fullName: '',
        phoneNumber: '',
        birthDate: '',
        class: '',
        role: 'hoc_vien',
        cccd: '',
        cccdDate: '',
        cccdPlace: '',
        address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. "Phép thuật" Lấy danh sách Users (Chỉ lấy 1 lần)
    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        setError(null);
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, orderBy('createdAt', 'desc'));

            const querySnapshot = await getDocs(q);
            const userList: UserAccount[] = [];
            querySnapshot.forEach((doc) => {
                userList.push({
                    id: doc.id,
                    ...doc.data()
                } as UserAccount);
            });
            setUsers(userList); // (Cất danh sách GỐC)
        } catch (err: any) {
            setError(err.message || 'Lỗi không xác định.');
        } finally {
            setLoading(false);
        }
    }

    // 💖 4. "Phép thuật" MỚI: Chạy bộ lọc 💖
    useEffect(() => {
        if (filter === 'all') {
            setFilteredUsers(users);
        }
        else if (filter === 'staff') {
            setFilteredUsers(users.filter(u => staffRoles.includes(u.role)));
        }
        else if (filter === 'hoc_vien') {
            setFilteredUsers(users.filter(u => u.role === 'hoc_vien'));
        }
    }, [filter, users]);

    // (Hàm dịch tên vai trò)
    const dichTenVaiTro = (role: string) => {
        return allRoles.find(r => r.id === role)?.name || role;
    }

    // (Logic Phân quyền)
    const canEditUser = (targetUser: UserAccount): boolean => {
        if (!currentUser) return false;
        if (currentUser.role === 'admin') return true;
        if (currentUser.role === 'lanh_dao') {
            if (targetUser.role === 'admin') return false;
            return true;
        }
        if (currentUser.role === 'quan_ly') {
            if (targetUser.role === 'admin' || targetUser.role === 'lanh_dao' || targetUser.role === 'quan_ly') return false;
            return true;
        }
        return false;
    }

    // (Logic Lấy Role cho Modal)
    const getAvailableRoles = (): { id: string, name: string }[] => {
        if (currentUser?.role === 'admin') return allRoles;
        if (currentUser?.role === 'lanh_dao') return allRoles.filter(r => r.id !== 'admin');
        if (currentUser?.role === 'quan_ly') return allRoles.filter(r => r.id !== 'admin' && r.id !== 'lanh_dao');
        return [];
    }

    // --- HÀNH ĐỘNG VỚI MODAL ---

    // 💖 MỞ MODAL (Xem hoặc Sửa) 💖
    const handleOpenModal = (user: UserAccount, mode: 'view' | 'edit') => {
        setEditingUser(user);
        setViewMode(mode);

        // Nạp dữ liệu vào form (dù là xem hay sửa cũng nạp sẵn để chuyển đổi cho nhanh)
        setFormData({
            fullName: user.fullName || '',
            phoneNumber: user.phoneNumber || '',
            birthDate: user.birthDate || '',
            class: user.class || '',
            role: user.role || 'hoc_vien',
            cccd: user.cccd || '',
            cccdDate: user.cccdDate || '',
            cccdPlace: user.cccdPlace || '',
            address: user.address || '',
        });
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setError(null);
    }

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    // 4. HÀM "LƯU THAY ĐỔI"
    const handleSaveEdit = async (e: FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsSubmitting(true);
        setError(null);
        try {
            const userDocRef = doc(db, 'users', editingUser.id);
            await updateDoc(userDocRef, {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                birthDate: formData.birthDate,
                class: formData.class,
                role: formData.role,
                cccd: formData.cccd,
                cccdDate: formData.cccdDate,
                cccdPlace: formData.cccdPlace,
                address: formData.address,
            });

            await fetchUsers();
            handleCloseModal();
            alert('Cập nhật thông tin thành công!');

        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật.');
        } finally {
            setIsSubmitting(false);
        }
    }

    // 5. HÀM "XÓA NGƯỜI DÙNG"
    const handleDeleteUser = async (userToDelete: UserAccount) => {
        if (!canEditUser(userToDelete)) {
            alert('Bạn không có quyền xóa tài khoản này!');
            return;
        }
        if (userToDelete.id === currentUser?.uid) {
            alert('Bạn không thể tự xóa chính mình!');
            return;
        }
        if (confirm(`Anh có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${userToDelete.fullName}" không ? Sẽ không thể khôi phục được nha!`)) {
            try {
                const userDocRef = doc(db, 'users', userToDelete.id);
                await deleteDoc(userDocRef);
                await fetchUsers(); // Tải lại
            } catch (err: any) {
                setError(err.message || 'Lỗi khi xóa người dùng.');
            }
        }
    }

    // 6. GIAO DIỆN
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>

                <div className={styles.header}>
                    <h2 className={styles.title}>Quản lý Tài khoản</h2>
                </div>

                {/* BỘ LỌC */}
                <div className={styles.filterContainer}>
                    <span>Lọc theo:</span>
                    <button onClick={() => setFilter('all')} className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''} `}>Tất cả</button>
                    <button onClick={() => setFilter('staff')} className={`${styles.filterButton} ${filter === 'staff' ? styles.filterButtonActive : ''} `}>Giáo viên / Quản lý</button>
                    <button onClick={() => setFilter('hoc_vien')} className={`${styles.filterButton} ${filter === 'hoc_vien' ? styles.filterButtonActive : ''} `}>Học viên</button>
                    <span className={styles.filterInfo}>(Đang hiển thị {filteredUsers.length} / {users.length} tài khoản)</span>
                </div>

                {loading && <p>Đang tải danh sách người dùng...</p>}
                {error && <p className={styles.error}>{error}</p>}

                {!loading && !error && (
                    <div className={styles.tableContainer}>
                        <table className={styles.userTable}>
                            <thead>
                                <tr>
                                    <th>Họ và Tên</th>
                                    <th>Lớp / Khóa</th>
                                    <th>Email / SĐT</th>
                                    <th>Ngày sinh</th>
                                    <th>Vai trò</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => {
                                    const canEdit = canEditUser(user);
                                    return (
                                        <tr key={user.id}>
                                            {/* 💖 TÊN CLICK ĐƯỢC -> MỞ CHI TIẾT 💖 */}
                                            <td>
                                                <strong
                                                    onClick={() => handleOpenModal(user, 'view')}
                                                    style={{ cursor: 'pointer', color: '#0070f3' }}
                                                    title="Xem chi tiết"
                                                >
                                                    {user.fullName}
                                                </strong>
                                            </td>
                                            <td>
                                                {user.class && <div>Lớp: {user.class}</div>}
                                                {user.courseName && <div style={{ color: '#0070f3', fontSize: '0.85rem', fontWeight: 500 }}>{user.courseName}</div>}
                                                {!user.class && !user.courseName && <span style={{ color: '#ccc' }}>--</span>}
                                            </td>
                                            <td>
                                                {user.email}
                                                {user.phoneNumber && <div className={styles.subText}>{user.phoneNumber}</div>}
                                            </td>
                                            <td>{user.birthDate || '...'}</td>
                                            <td>
                                                <span className={`${styles.rolePill} ${styles[user.role]} `}>
                                                    {dichTenVaiTro(user.role)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className={styles.actionButtons}>
                                                    {/* 💖 NÚT SỬA -> MỞ MODAL EDIT 💖 */}
                                                    <button
                                                        className={styles.buttonEdit}
                                                        onClick={() => handleOpenModal(user, 'edit')}
                                                        disabled={!canEdit}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className={styles.buttonDelete}
                                                        onClick={() => handleDeleteUser(user)}
                                                        disabled={!canEdit || user.id === currentUser?.uid}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {filteredUsers.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', fontStyle: 'italic', color: '#777' }}>Không tìm thấy tài khoản nào khớp với bộ lọc này.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>

            {/* 💖 MODAL THỐNG NHẤT (CHI TIẾT & SỬA) 💖 */}
            {isModalOpen && editingUser && (
                <div className={styles.modalBackdrop} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h2 className={styles.modalTitle}>
                                {viewMode === 'view' ? `Hồ sơ: ${editingUser.fullName}` : `Sửa thông tin: ${editingUser.fullName}`}
                            </h2>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        {viewMode === 'view' ? (
                            // 💖 CHẾ ĐỘ XEM CHI TIẾT 💖
                            <div style={{ color: '#000000' }}> {/* 💖 FORCE BLACK COLOR 💖 */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                    <div><strong style={{ color: '#000' }}>Họ và tên:</strong> <div style={{ color: '#000' }}>{editingUser.fullName}</div></div>
                                    <div><strong style={{ color: '#000' }}>Email:</strong> <div style={{ color: '#000' }}>{editingUser.email}</div></div>
                                    <div><strong style={{ color: '#000' }}>SĐT:</strong> <div style={{ color: '#000' }}>{editingUser.phoneNumber || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Ngày sinh:</strong> <div style={{ color: '#000' }}>{editingUser.birthDate || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Lớp:</strong> <div style={{ color: '#000' }}>{editingUser.class || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Khóa học:</strong> <div style={{ color: '#000' }}>{editingUser.courseName || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Vai trò:</strong> <div style={{ color: '#000' }}>{dichTenVaiTro(editingUser.role)}</div></div>
                                    <div><strong style={{ color: '#000' }}>Ngày tạo:</strong> <div style={{ color: '#000' }}>{editingUser.createdAt ? new Date(editingUser.createdAt.seconds * 1000).toLocaleDateString('vi-VN') : '---'}</div></div>
                                </div>

                                <h3 style={{ fontSize: '1rem', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px', color: '#000' }}>Thông tin CCCD & Địa chỉ</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                    <div><strong style={{ color: '#000' }}>Số CCCD:</strong> <div style={{ color: '#000' }}>{editingUser.cccd || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Ngày cấp:</strong> <div style={{ color: '#000' }}>{editingUser.cccdDate || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Nơi cấp:</strong> <div style={{ color: '#000' }}>{editingUser.cccdPlace || '---'}</div></div>
                                    <div><strong style={{ color: '#000' }}>Địa chỉ:</strong> <div style={{ color: '#000' }}>{editingUser.address || '---'}</div></div>
                                </div>

                                <div className={styles.modalActions} style={{ marginTop: '20px' }}>
                                    <button onClick={handleCloseModal} className={styles.buttonSecondary}>Đóng</button>
                                    {canEditUser(editingUser) && (
                                        <button onClick={() => setViewMode('edit')} className={styles.buttonEdit}>Chỉnh sửa</button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // 💖 CHẾ ĐỘ CHỈNH SỬA 💖
                            <form onSubmit={handleSaveEdit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    <div className={styles.formGroup}>
                                        <label>Họ và Tên</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} className={styles.input} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Số điện thoại</label>
                                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleFormChange} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Ngày sinh</label>
                                        <input type="date" name="birthDate" value={formData.birthDate} onChange={handleFormChange} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Lớp học</label>
                                        <input type="text" name="class" value={formData.class} onChange={handleFormChange} className={styles.input} placeholder="VD: 12A1" />
                                    </div>

                                    {/* CCCD & Địa chỉ */}
                                    <div className={styles.formGroup}>
                                        <label>Số CCCD</label>
                                        <input type="text" name="cccd" value={formData.cccd} onChange={handleFormChange} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Ngày cấp</label>
                                        <input type="date" name="cccdDate" value={formData.cccdDate} onChange={handleFormChange} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Nơi cấp</label>
                                        <input type="text" name="cccdPlace" value={formData.cccdPlace} onChange={handleFormChange} className={styles.input} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Địa chỉ</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleFormChange} className={styles.input} />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Vai trò</label>
                                        <select name="role" value={formData.role} onChange={handleFormChange} className={styles.input}>
                                            {getAvailableRoles().map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {error && <p className={styles.error}>{error}</p>}

                                <div className={styles.modalActions} style={{ marginTop: '20px' }}>
                                    <button type="button" onClick={() => setViewMode('view')} className={styles.buttonSecondary}>Hủy bỏ</button>
                                    <button type="submit" disabled={isSubmitting} className={styles.buttonEdit}>
                                        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}
