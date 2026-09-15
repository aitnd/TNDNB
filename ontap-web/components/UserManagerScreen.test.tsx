import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserManagerScreen from './UserManagerScreen';
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

describe('UserManagerScreen Component Tests (Web)', () => {
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

  it('1. Render màn hình Quản lý người dùng đối với quyền Admin/Manager', async () => {
    render(<UserManagerScreen {...defaultProps} />);

    // Kiểm tra title của Manager section
    expect(screen.getByText('Quản lý Người dùng')).toBeInTheDocument();

    // Đợi danh sách users mock được load vào bảng
    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
      expect(screen.getByText('Trần Thị B')).toBeInTheDocument();
    });
  });

  it('2. Hiển thị badge Đã bị khóa và làm mờ hàng cho tài khoản status disabled', async () => {
    render(<UserManagerScreen {...defaultProps} />);

    await waitFor(() => {
      // User B là disabled, hiển thị badge màu đỏ
      expect(screen.getByText('Đã bị khóa')).toBeInTheDocument();
      
      // Hàng cho Trần Thị B (user-2) có class opacity-70
      const rowB = screen.getByText('Trần Thị B').closest('tr');
      expect(rowB).toHaveClass('opacity-70');
    });
  });

  it('3. Hiển thị nút Kích hoạt lại cho tài khoản bị khóa', async () => {
    render(<UserManagerScreen {...defaultProps} />);

    await waitFor(() => {
      // Tìm các nút hành động trong bảng
      const enableButtons = screen.getAllByTitle('Kích hoạt lại tài khoản');
      const disableButtons = screen.getAllByTitle('Khóa tài khoản');
      
      expect(enableButtons.length).toBe(1); // Chỉ Trần Thị B có nút kích hoạt
      expect(disableButtons.length).toBe(1); // Nguyễn Văn A có nút khóa tài khoản
    });
  });

  it('4. Gọi updateDoc với status disabled khi nhấn Vô hiệu hóa tài khoản', async () => {
    window.confirm = vi.fn(() => true);
    window.alert = vi.fn();
    
    render(<UserManagerScreen {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Nguyễn Văn A')).toBeInTheDocument();
    });

    const disableButton = screen.getByTitle('Khóa tài khoản');
    fireEvent.click(disableButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Bạn có chắc chắn muốn vô hiệu hóa tài khoản này? (Tài khoản sẽ không đăng nhập được nữa)');
      expect(updateDoc).toHaveBeenCalled();
    });
  });
});
