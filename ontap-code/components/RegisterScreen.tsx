import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebaseClient';
import { ArrowLeftIcon3D, HelmIcon3D } from './icons';

interface RegisterScreenProps {
    onBack: () => void;
    onSuccess: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [className, setClassName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            setLoading(false);
            return;
        }

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;

            // 2. Create Firestore Profile
            const username = email.split('@')[0].toLowerCase();

            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                fullName: fullName.trim(),
                phoneNumber: phoneNumber.trim(),
                birthDate: birthDate,
                role: 'hoc_vien', // Default role
                class: className.trim(),
                username: username,
                createdAt: serverTimestamp()
            });

            console.log('Registration successful');
            onSuccess(); // Navigate to Dashboard or Login
        } catch (err: any) {
            console.error("Registration failed:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Email này đã được sử dụng.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Email không hợp lệ.');
            } else if (err.code === 'auth/weak-password') {
                setError('Mật khẩu quá yếu.');
            } else {
                setError('Đăng ký thất bại. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 animate-slide-in-right">
            <div className="relative text-center mb-6">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-card/50 p-2 rounded-full shadow-md hover:bg-muted transition-all duration-300"
                >
                    <ArrowLeftIcon3D className="h-8 w-8 text-primary" />
                </button>
                <HelmIcon3D className="h-16 w-16 mx-auto text-primary mb-2" />
                <h1 className="text-3xl font-bold text-foreground">Đăng Ký</h1>
                <p className="text-sm text-muted-foreground">Tạo tài khoản học viên mới</p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-lg">
                <form onSubmit={handleRegister} className="space-y-4">
                    {error && <p className="bg-destructive/10 text-destructive p-3 rounded-md text-sm text-center">{error}</p>}

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-1">Họ và Tên *</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Nguyễn Văn A"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-1">Lớp Học *</label>
                        <input
                            type="text"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Nhập tên lớp (GV sẽ duyệt)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-card-foreground mb-1">Ngày sinh</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={e => setBirthDate(e.target.value)}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-card-foreground mb-1">SĐT</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="09..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-1">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-1">Mật khẩu *</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Ít nhất 6 ký tự"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-card-foreground mb-1">Xác nhận mật khẩu *</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-300 mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterScreen;
