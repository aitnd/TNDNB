import React from 'react'; 
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import AccountScreen from './AccountScreen';

describe('AccountScreen Component Tests (Cá nhân)', () => {
  const defaultProps = {
    userProfile: {
      id: 'admin-1',
      full_name: 'Quản trị viên',
      fullName: 'Quản trị viên',
      email: 'admin@tndnb.com',
      role: 'admin' as 'admin',
      phoneNumber: '0900000000',
    },
    onBack: vi.fn(),
    onNavigate: vi.fn(),
    usageConfig: {
      admin: {
        userViewEditOthers: true,
        userChangeRoleOthers: true,
        userDeleteOthers: true,
        userForceLogoutOthers: true
      }
    }
  };

  it('1. Render thông tin cá nhân của người dùng đăng nhập chính xác', async () => {
    render(<AccountScreen {...defaultProps} />);
    
    // Kiểm tra hiển thị thông tin cá nhân
    await waitFor(() => {
      expect(screen.getByText('Tài khoản của tôi')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Quản trị viên')).toBeInTheDocument();
      expect(screen.getByDisplayValue('admin@tndnb.com')).toBeInTheDocument();
    });
  });
});
