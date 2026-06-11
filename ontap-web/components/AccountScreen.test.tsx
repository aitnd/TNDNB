import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AccountScreen from './AccountScreen';
import { getDocs, updateDoc } from 'firebase/firestore';

// Mock getDocs of firestore to return a mock list of users
const mockUsers = [
  {
    id: 'user-1',
    fullName: 'Nguyễn Văn A',
    email: 'nva@tndnb.com',
    role: 'hoc_vien',
    phoneNumber: '0987654321',
    birthDate: '2000-01-01',
    status: 'active',
    isVerified: true,
  },
  {
    id: 'user-2',
    fullName: 'Trần Thị B',
    email: 'ttb@tndnb.com',
    role: 'hoc_vien',
    phoneNumber: '0912345678',
    birthDate: '1999-05-15',
    status: 'disabled',
    isVerified: false,
  }
];

beforeEach(() => {
  vi.clearAllMocks();
  // Setup firestore mock implementations
  const getDocsMock = getDocs as any;
  getDocsMock.mockImplementation(() => Promise.resolve({
    docs: mockUsers.map(u => ({
      id: u.id,
      data: () => u
    }))
  }));
});

describe('AccountScreen Component Tests', () => {
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

  it('1. Render thông tin cá nhân của người dùng đăng nhập chính xác', () => {
    render(<AccountScreen {...defaultProps} />);
    
    // Check personal info rendering
    expect(screen.getByText('Tài khoản của tôi')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Quản trị viên')).toBeInTheDocument();
    expect(screen.getByDisplayValue('admin@tndnb.com')).toBeInTheDocument();
  });

  it('2. Hiển thị danh sách quản lý người dùng đối với quyền Admin/Manager', async () => {
    render(<AccountScreen {...defaultProps} />);

    // Check manager section title
    expect(screen.getByText('Quản lý người dùng')).toBeInTheDocument();

    // Wait for the mock users to be loaded into the table
    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
      expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
    });
  });

  it('3. Hiển thị badge 🔴 Đã vô hiệu hóa và làm mờ hàng cho tài khoản status disabled', async () => {
    render(<AccountScreen {...defaultProps} />);

    await waitFor(() => {
      // User B is disabled, should display the red badge
      expect(screen.getByText('🔴 Đã vô hiệu hóa')).toBeInTheDocument();
      
      // The row for Trần Thị B (user-2) should have class opacity-60
      const rowB = screen.getByText('Trần Thị B').closest('tr');
      expect(rowB).toHaveClass('opacity-60');
    });
  });

  it('4. Hiển thị nút Kích hoạt lại (FaCheckCircle) cho tài khoản bị khóa', async () => {
    render(<AccountScreen {...defaultProps} />);

    await waitFor(() => {
      // Find buttons in actions column
      const enableButtons = screen.getAllByTitle('Kích hoạt lại tài khoản');
      const disableButtons = screen.getAllByTitle('Vô hiệu hóa tài khoản');
      
      expect(enableButtons.length).toBe(1); // Only Trần Thị B has enable button
      expect(disableButtons.length).toBe(1); // Nguyễn Văn A has disable button
    });
  });

  it('5. Gọi updateDoc với status disabled khi nhấn Vô hiệu hóa tài khoản', async () => {
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();
    
    render(<AccountScreen {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    });

    const disableButton = screen.getByTitle('Vô hiệu hóa tài khoản');
    fireEvent.click(disableButton);

    expect(window.confirm).toHaveBeenCalledWith('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này? (Tài khoản sẽ bị khóa)');
    expect(updateDoc).toHaveBeenCalled();
  });
});
