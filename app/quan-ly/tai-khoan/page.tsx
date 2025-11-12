// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useAuth } from '../../../context/AuthContext' 
import ProtectedRoute from '../../../components/ProtectedRoute' 
import { db } from '../../../utils/firebaseClient' 
import { collection, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import Link from 'next/link'

// (Import CSS Module)
import styles from './page.module.css' 

// 1. Định nghĩa "kiểu" của một Tài khoản
interface UserAccount {
  id: string; // Đây là UID
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  birthDate?: string;
  createdAt: Timestamp;
}

// (Kiểu dữ liệu cho form)
interface EditFormData {
  fullName: string;
  phoneNumber: string;
  birthDate: string;
  role: string;
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

// 2. TẠO "NỘI DUNG" TRANG
function UserManagementDashboard() {
  const { user: currentUser } = useAuth() // (User đang đăng nhập)
  const [users, setUsers] = useState<UserAccount[]>([]) // (Danh sách GỐC)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 💖 "Não" trạng thái MỚI cho bộ lọc 💖
  const [filter, setFilter] = useState<string>('all'); // ('all', 'staff', 'hoc_vien')
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]); // (Danh sách ĐÃ LỌC)

  // "Não" cho Modal (Cửa sổ Sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
    fullName: '',
    phoneNumber: '',
    birthDate: '',
    role: 'hoc_vien',
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
  // (Nó sẽ tự chạy lại mỗi khi 'users' (danh sách gốc) hoặc 'filter' (nút bấm) thay đổi)
  useEffect(() => {
    console.log(`Đang chạy bộ lọc: ${filter}`);
    if (filter === 'all') {
      setFilteredUsers(users); // (Hiện tất cả)
    } 
    else if (filter === 'staff') {
      // (Hiện nhóm "Giáo viên" như anh muốn)
      setFilteredUsers(users.filter(u => staffRoles.includes(u.role)));
    }
    else if (filter === 'hoc_vien') {
      // (Hiện chỉ Học viên)
      setFilteredUsers(users.filter(u => u.role === 'hoc_vien'));
    }
  }, [filter, users]); // (Phụ thuộc vào 2 "não" này)


  // (Hàm dịch tên vai trò - Giữ nguyên)
  const dichTenVaiTro = (role: string) => {
    return allRoles.find(r => r.id === role)?.name || role;
  }

  // (Logic Phân quyền - Giữ nguyên)
  const canEditUser = (targetUser: UserAccount): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') {
      return true; 
    }
    if (currentUser.role === 'lanh_dao') {
      if (targetUser.role === 'admin') {
        return false; 
      }
      return true;
    }
    if (currentUser.role === 'quan_ly') {
      if (targetUser.role === 'admin' || targetUser.role === 'lanh_dao' || targetUser.role === 'quan_ly') {
        return false;
      }
      return true; 
    }
    return false;
  }

  // (Logic Lấy Role cho Modal - Giữ nguyên)
  const getAvailableRoles = (): { id: string, name: string }[] => {
    if (currentUser?.role === 'admin') {
      return allRoles;
    }
    if (currentUser?.role === 'lanh_dao') {
      return allRoles.filter(r => r.id !== 'admin');
    }
    if (currentUser?.role === 'quan_ly') {
      return allRoles.filter(r => r.id !== 'admin' && r.id !== 'lanh_dao');
    }
    return [];
  }

  // --- HÀNH ĐỘNG VỚI MODAL (Giữ nguyên) ---

  const handleOpenEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      birthDate: user.birthDate || '',
      role: user.role || 'hoc_vien',
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

  // 4. HÀM "LƯU THAY ĐỔI" (Giữ nguyên)
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
        role: formData.role,
      });

      await fetchUsers(); 
      handleCloseModal(); 

    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // 5. HÀM "XÓA NGƯỜI DÙNG" (Giữ nguyên)
  const handleDeleteUser = async (userToDelete: UserAccount) => {
    if (!canEditUser(userToDelete)) {
      alert('Bạn không có quyền xóa tài khoản này!');
      return;
    }
    if (userToDelete.id === currentUser?.uid) {
      alert('Bạn không thể tự xóa chính mình!');
      return;
    }
    if (confirm(`Anh có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${userToDelete.fullName}" không? Sẽ không thể khôi phục được nha!`)) {
      try {
        const userDocRef = doc(db, 'users', userToDelete.id);
        await deleteDoc(userDocRef);
        await fetchUsers(); // Tải lại
      } catch (err: any) {
        setError(err.message || 'Lỗi khi xóa người dùng.');
      }
    }
  }

  // 6. GIAO DIỆN (ĐÃ NÂNG CẤP)
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Quản lý Tài khoản</h1>
          <Link href="/quan-ly" className={styles.backButton}>
            « Quay về Bảng điều khiển
          </Link>
        </div>

        {/* 💖 7. JSX CHO CÁC NÚT LỌC 💖 */}
        <div className={styles.filterContainer}>
          <span>Lọc theo:</span>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterButton} ${filter === 'all' ? styles.filterButtonActive : ''}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('staff')}
            className={`${styles.filterButton} ${filter === 'staff' ? styles.filterButtonActive : ''}`}
          >
            Giáo viên / Quản lý
          </button>
          <button
            onClick={() => setFilter('hoc_vien')}
            className={`${styles.filterButton} ${filter === 'hoc_vien' ? styles.filterButtonActive : ''}`}
          >
            Học viên
          </button>
          
          <span className={styles.filterInfo}>
            (Đang hiển thị {filteredUsers.length} / {users.length} tài khoản)
          </span>
        </div>
        {/* 💖 HẾT PHẦN LỌC 💖 */}


        {loading && <p>Đang tải danh sách người dùng...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <div className={styles.tableContainer}>
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Họ và Tên</th>
                  <th>Email / SĐT</th>
                  <th>Ngày sinh</th>
                  <th>Vai trò</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {/* 💖 8. SỬA "users.map" thành "filteredUsers.map" 💖 */}
                {filteredUsers.map((user) => {
                  // (Kiểm tra quyền trước khi "vẽ" nút)
                  const canEdit = canEditUser(user);

                  return (
                    <tr key={user.id}>
                      <td><strong>{user.fullName}</strong></td>
                      <td>
                        {user.email}
                        {user.phoneNumber && <div className={styles.subText}>{user.phoneNumber}</div>}
                      </td>
                      <td>{user.birthDate || '...'}</td>
                      <td>
                        <span className={`${styles.rolePill} ${styles[user.role]}`}>
                          {dichTenVaiTro(user.role)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.buttonEdit}
                            onClick={() => handleOpenEditModal(user)}
                            disabled={!canEdit} // (Khóa nút nếu không có quyền)
                          >
                            Sửa
                          </button>
                          <button 
                            className={styles.buttonDelete}
                            onClick={() => handleDeleteUser(user)}
                            disabled={!canEdit || user.id === currentUser?.uid} // (Khóa nút nếu là admin/quan_ly hoặc tự xóa)
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {/* (Nếu lọc mà không có ai) */}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', fontStyle: 'italic', color: '#777'}}>
                      Không tìm thấy tài khoản nào khớp với bộ lọc này.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* 7. "CỬA SỔ" MODAL (Giữ nguyên) */}
      {isModalOpen && editingUser && (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Sửa thông tin: {editingUser.fullName}</h2>
            
            <form onSubmit={handleSaveEdit}>
              {/* Ô Họ và Tên */}
              <div className={styles.formGroup}>
                <label htmlFor="fullName">Họ và Tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className={styles.input}
                />
              </div>

              {/* Ô SĐT */}
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  className={styles.input}
                />
              </div>

              {/* Ô Ngày sinh */}
              <div className={styles.formGroup}>
                <label htmlFor="birthDate">Ngày sinh</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleFormChange}
                  className={styles.input}
                />
              </div>
              
              {/* Ô VAI TRÒ (PHÂN QUYỀN) */}
              <div className={styles.formGroup}>
                <label htmlFor="role">Vai trò</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  className={styles.input}
                >
                  {getAvailableRoles().map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              {/* Nút bấm của Modal */}
              <div className={styles.modalActions}>
                <button type="button" onClick={handleCloseModal} className={styles.buttonSecondary}>
                  Hủy
                </button>
                <button type="submit" disabled={isSubmitting} className={styles.buttonEdit}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}

// 8. "BỌC" NỘI DUNG BẰNG "LÍNH GÁC"
export default function QuanLyTaiKhoanPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'lanh_dao', 'quan_ly']}>
      <UserManagementDashboard /> 
    </ProtectedRoute>
  )
}