// @ts-nocheck
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box, 
  Alert,
  CircularProgress
} from '@mui/material';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebaseClient';
import { Course } from '../../types/classManagement';

interface CreateStudentModalProps {
  open: boolean;
  onClose: () => void;
  course: Course;
  onSuccess: () => void;
}

const CreateStudentModal: React.FC<CreateStudentModalProps> = ({ open, onClose, course, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cccd: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Kiểm tra email đã tồn tại chưa
      if (formData.email) {
        const q = query(collection(db, 'users'), where('email', '==', formData.email));
        const snap = await getDocs(q);
        if (!snap.empty) {
          throw new Error('Email này đã được sử dụng bởi một tài khoản khác.');
        }
      }

      // 2. Tạo record user mới
      await addDoc(collection(db, 'users'), {
        fullName: formData.fullName,
        full_name: formData.fullName,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber,
        cccd: formData.cccd,
        role: 'hoc_vien',
        courseId: course.id,
        courseName: course.name,
        createdAt: serverTimestamp(),
        isVerified: false
      });

      onSuccess();
      onClose();
      setFormData({ fullName: '', email: '', phoneNumber: '', cccd: '' });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi tạo học viên.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Thêm mới học viên vào lớp</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            
            <TextField
              label="Họ và tên"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              helperText="Dùng để đăng nhập hoặc lấy lại mật khẩu"
            />
            
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            
            <TextField
              label="Số CCCD"
              name="cccd"
              value={formData.cccd}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />

            <Alert severity="info" sx={{ mt: 1 }}>
              Học viên mới sẽ được tự động gán vào lớp <strong>{course.name}</strong>.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={loading}>Hủy</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Đang tạo...' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateStudentModal;
