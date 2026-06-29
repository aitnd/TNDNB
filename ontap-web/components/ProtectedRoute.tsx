import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfile } from '../types';

interface ProtectedRouteProps {
  /** Danh sách role được phép truy cập */
  roles: string[];
  /** Profile người dùng hiện tại (null = chưa đăng nhập) */
  userProfile: UserProfile | null;
  /** Nội dung hiển thị khi đủ quyền */
  children: React.ReactNode;
  /** Đường dẫn redirect khi không đủ quyền (mặc định: /ontap/dashboard) */
  redirectTo?: string;
  /** Đường dẫn redirect khi chưa đăng nhập (mặc định: /ontap/login) */
  loginPath?: string;
}

/**
 * Component bảo vệ route theo vai trò người dùng (2 lớp kiểm tra):
 * 1. Chưa đăng nhập → redirect về trang login
 * 2. Đăng nhập nhưng role không đủ → redirect về dashboard
 * 3. Hợp lệ → render children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  roles,
  userProfile,
  children,
  redirectTo = '/ontap/dashboard',
  loginPath = '/ontap/login',
}) => {
  // Lớp 1: Chưa đăng nhập
  if (!userProfile) {
    return <Navigate to={loginPath} replace />;
  }

  // Lớp 2: Đăng nhập nhưng không đủ quyền
  if (!roles.includes(userProfile.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Hợp lệ → render nội dung
  return <>{children}</>;
};

export default ProtectedRoute;
