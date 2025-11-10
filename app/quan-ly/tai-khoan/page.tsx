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

// (Danh sách vai trò)
const allRoles = [
  { id: 'admin', name: 'Quản trị viên (Admin)' },
  { id: 'quan_ly', name: 'Quản lý' },
  { id: 'lanh_dao', name: 'Lãnh đạo' },
  { id: 'giao_vien', name: 'Giáo viên' },
  { id: 'hoc_vien', name: 'Học viên' },
];

// 2. TẠO "NỘI DUNG" TRANG
function UserManagementDashboard() {
  const { user: currentUser } = useAuth() // (User đang đăng nhập)
  const [users, setUsers] = useState<UserAccount[]>([]) // (Danh sách user)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  // 3. "Phép thuật" Lấy danh sách Users (Giữ nguyên)
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
      setUsers(userList);
    } catch (err: any) {
      setError(err.message || 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  }

  // (Hàm dịch tên vai trò)
  const dichTenVaiTro = (role: string) => {
    return allRoles.find(r => r.id === role)?.name || role;
  }

  // --- LOGIC PHÂN QUYỀN (Yêu cầu 5.1 & 5.2) ---
  
  // (Kiểm tra xem "tôi" (currentUser) có quyền "đụng" vào "người ta" (targetUser) không)
  const canEditUser = (targetUser: UserAccount): boolean => {
    if (!currentUser) return false;
    
    // Admin (5.1)
    if (currentUser.role === 'admin') {
      return true; // Admin được sửa tất cả
    }
    
    // Quản lý (5.2)
    if (currentUser.role === 'quan_ly') {
      // KHÔNG được sửa admin hoặc quản lý khác
      if (targetUser.role === 'admin' || targetUser.role === 'quan_ly') {
        return false;
      }
      return true; // Được sửa giáo viên, lãnh đạo, học viên
    }
    
    return false; // Các role khác không được sửa ai cả
  }

  // (Lấy danh sách role cho phép khi "tôi" (currentUser) sửa)
  const getAvailableRoles = (): { id: string, name: string }[] => {
    if (currentUser?.role === 'admin') {
      return allRoles; // Admin thấy tất cả
    }
    if (currentUser?.role === 'quan_ly') {
      // Quản lý KHÔNG thấy "Admin" (5.2)
      return allRoles.filter(r => r.id !== 'admin');
    }
    return [];
  }

  // --- HÀNH ĐỘNG VỚI MODAL ---

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
        role: formData.role,
      });

      // (Cập nhật lại danh sách)
      await fetchUsers(); 
      handleCloseModal(); // (Đóng cửa sổ)

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

    if (userToDelete.id === currentUser?.id) {
      alert('Bạn không thể tự xóa chính mình!');
      return;
    }
    
    if (confirm(`Anh có chắc chắn muốn XÓA VĨNH VIỄN tài khoản "${userToDelete.fullName}" không? Sẽ không thể khôi phục được nha!`)) {
      try {
        // (Đây là logic xóa an toàn, mình chỉ xóa "hồ sơ" trong "tủ" users)
        // (Việc xóa Auth cần có server (Admin SDK) rất phức tạp, 
        //  mình sẽ làm sau nếu anh cần, tạm thời xóa hồ sơ là họ hết quyền)
        const userDocRef = doc(db, 'users', userToDelete.id);
        await deleteDoc(userDocRef);
        
        // (Cập nhật lại danh sách)
        await fetchUsers();

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
          <h1 className={styles.title}>Quản lý Tài khoản</h1>
          <Link href="/quan-ly" className={styles.backButton}>
            « Quay về Bảng điều khiển
          </Link>
        </div>

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
                {users.map((user) => {
                  // (Kiểm tra quyền trước khi "vẽ" nút)
                  const canEdit = canEdit